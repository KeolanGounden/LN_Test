using ChangeTrackerAPI.Extensions;
using ChangeTrackerAPI.Interfaces;
using ChangeTrackerAPI.Models;
using ChangeTrackerModel.DatabaseContext;
using ChangeTrackerModel.Models.Config;
using ChangeTrackerModel.Models.Data;
using ChangeTrackerModel.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Text.Json;


namespace ChangeTrackerAPI.Services
{
    public class PlatformContentService : IPlatformContentService
    {
        private HttpClient _httpClient;
        private readonly MySqlContext _context;
        private ILogger<PlatformContentService> _logger;
        private PlatformConfig _platformConfig;

        public PlatformContentService(MySqlContext context, ILogger<PlatformContentService> logger, IHttpClientFactory httpClientFactory, IOptions<PlatformConfig> platformConfig)
        {
            _context = context;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _platformConfig = platformConfig.Value;

        }

        public async Task PopulateTakealot(long start = 1,long target = 99999999)
        {
            try 
            {
                _logger.LogInformation($"Starting Takealot Scraping: {target}");

                

                for (var i = start; i <= target; i++)
                {

                    var plid = i.ToString("00000000");

                    await AddTakealotToDatabase(plid);

                }
                _logger.LogInformation($"Finished Takealot Scraping: {target}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error: {ex.Message}");
            }
           


        }


        public async Task CleanTakealot(string plid)
        {

            var itemFound = await _context.PlatformContentTakealot.AsNoTracking().AnyAsync(x => x.ProductIdentifier == plid);

            var lastItem = await _context.PlatformContentTakealot.AsNoTracking().OrderBy(x => x.ProductIdentifier).LastAsync();

            var isLastItem = false;

            var request = new KeysetParams()
            {
                PageSize = 1000,
            };

          

          
            while(!isLastItem)
            {
                var query = _context.PlatformContentTakealot.AsNoTracking();

                if (itemFound)
                {
                    query = query.OrderBy(b => b.ProductIdentifier).Where(x => string.Compare(x.ProductIdentifier, plid) >= 0);
                }
                var res = await query.ToKeysetPagedResultAsync(request);

                foreach (var product in res.Items)
                {
                    var item = await _context.PlatformContentTakealot.FirstAsync(x => x.Id == product.Id);

                    var productDetails = JsonSerializer.Deserialize<TakealotProductDetails>(item.MetaRaw);

                    item.MetaRaw = JsonSerializer.Serialize(productDetails);
                    item.InStock = productDetails.event_data.documents.product.in_stock;

                    await _context.SaveChangesAsync();
                }

                if(res.LastItem.Id == lastItem.Id)
                {
                    isLastItem = true;
                }

                plid = res.LastItem.ProductIdentifier;

                _logger.LogInformation($"Last PLID: {plid}");

            }
            

        }
        



        private async Task<bool> AddTakealotToDatabase(string plid)
        {

           
            var url = $"{_platformConfig.TakealotApiUrl}/product-details/PLID{plid}";

            var itemFound = await _context.PlatformContentTakealot.AnyAsync(x => x.ProductIdentifier == plid);

            if (!itemFound)
            {
                Task.Delay(100).Wait(); // Delay to avoid hitting API rate limits


                HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Get, url);

                request.Headers.Add("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
                request.Headers.Add("accept-language", "en-ZA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7");
                request.Headers.Add("cache-control", "no-cache");
                request.Headers.Add("if-none-match", "W/\"ca6BxjYqcfDPvKHg7n31BQ\"");
                request.Headers.Add("priority", "u=0, i");
                request.Headers.Add("sec-ch-ua", "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"");
                request.Headers.Add("sec-ch-ua-mobile", "?0");
                request.Headers.Add("sec-ch-ua-platform", "\"Windows\"");
                request.Headers.Add("sec-fetch-dest", "document");
                request.Headers.Add("sec-fetch-mode", "navigate");
                request.Headers.Add("sec-fetch-site", "none");
                request.Headers.Add("sec-fetch-user", "?1");
                request.Headers.Add("upgrade-insecure-requests", "1");
                request.Headers.Add("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36");


                HttpResponseMessage response = await _httpClient.SendAsync(request);


                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var productDetails = JsonSerializer.Deserialize<TakealotProductDetails>(content);

                    var inStock = productDetails.event_data.documents.product.in_stock;

                    var productEntity = new PlatformContentTakealotEntity
                    {

                        Name = productDetails.title,
                        Url = productDetails.desktop_href,
                        ProductIdentifier = plid,
                        LastUpdated = DateTime.UtcNow,
                        InStock = inStock,
                        MetaRaw = inStock ? JsonSerializer.Serialize(productDetails) : JsonSerializer.Serialize(new { })
                    };

                    await _context.PlatformContentTakealot.AddAsync(productEntity);

                    await _context.SaveChangesAsync();

                    
         
                    return true;

                }
                else if (response.StatusCode != System.Net.HttpStatusCode.Forbidden)
                {
                    _logger.LogWarning($"Product not found for PLID: {plid} - Status Code: {response.StatusCode}");
                    return false;
                }
                else
                {
                    _logger.LogWarning($"Request Forbidden");
                    return false;

                }

            }
            else
            {
                _logger.LogInformation($"Product already exists for PLID: {plid}");
                return false;
            }

        }

        public async Task<PagedResult<TakealotContentResponse>> SearchTakealot(TakealotSearchRequest request, CancellationToken cancellationToken)
        {
            var query = _context.PlatformContentTakealot.AsNoTracking();

            if(request.Name != null && request.Name != string.Empty)
            {
                query = query.Where(x => x.Name.Contains(request.Name));
            }

            if (request.LastUpdatedStart != null && request.LastUpdatedEnd != null)
            {
                query = query.Where(x =>   x.LastUpdated.Date <= request.LastUpdatedEnd && x.LastUpdated.Date >= request.LastUpdatedStart);
            }

            if (request.ProductId != null)
            {
                query = query.Where(x => x.ProductIdentifier.Contains(request.ProductId));
            }

            if (request.InStock != null)
            {
                query = query.Where(x => x.InStock == request.InStock);
            }

            var result = query.OrderBy(x => x.ProductIdentifier).Select(e => new TakealotContentResponse()
            {
                Id = e.Id,
                Name = e.Name,
                LastUpdated = e.LastUpdated,
                Url = e.Url,
                ProductIdentifier = e.ProductIdentifier,
                InStock = e.InStock
            });

            return await result.ToPagedResultAsync(request,cancellationToken);
        }
    }
}
