using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ChangeTrackerModel.Models.Data
{
    public class ActionField
    {
        public string list { get; set; }
    }

    public class Categories
    {
        public string id { get; set; }
        public string display_name { get; set; }
        public string source { get; set; }
        public string content_type { get; set; }
        public string displayable_text { get; set; }
    }


    public class Core
    {
        public string title { get; set; }
        public string slug { get; set; }
        public object subtitle { get; set; }
        public string brand { get; set; }
        public double star_rating { get; set; }
        public int reviews { get; set; }
        public List<object> formats { get; set; }
        public List<object> authors { get; set; }
        public List<Link> links { get; set; }
        public int id { get; set; }
    }



    public class DataLayer
    {
        public string name { get; set; }
        public string tsin { get; set; }
        public string @event { get; set; }
        public int quantity { get; set; }
        public List<string> categoryname { get; set; }
        public int totalPrice { get; set; }
        public string productlineSku { get; set; }
        public string departmentname { get; set; }
        public int departmentid { get; set; }
        public string pageType { get; set; }
        public List<int> categoryid { get; set; }
        public string prodid { get; set; }
    }



    public class Description
    {
        public string description { get; set; }
        public List<Value> values { get; set; }
        public string tab_title { get; set; }
        public string html { get; set; }
    }

    public class DistributionCentre
    {
        public string id { get; set; }
        public string text { get; set; }
        public string description { get; set; }
        public string info_type { get; set; }
    }

    public class Documents
    {
        public Product product { get; set; }
    }



    public class EventData
    {
        public Documents documents { get; set; }
    }


    public class Fields
    {
        public string cms_page { get; set; }
        public string brand_slug { get; set; }
        public string api_version { get; set; }
        public string plid { get; set; }
        public string platform { get; set; }
        public string plid_str { get; set; }
        public string seller_id { get; set; }
        public string seller_slug { get; set; }
    }




    public class Image
    {
        public string source { get; set; }
        public string title { get; set; }
        public string alt_text { get; set; }
    }


    public class Link
    {
        public string display_value { get; set; }
        public LinkData link_data { get; set; }
    }

    public class LinkData
    {
        public string path { get; set; }
        public Fields fields { get; set; }
        public string action { get; set; }
        public string context { get; set; }
    }



    public class Meta
    {
        public string identifier { get; set; }
        public string href { get; set; }
        public LinkData link_data { get; set; }
        public DateTime date_retrieved { get; set; }
        public bool display { get; set; }
        public string type { get; set; }
    }

    public class Product
    {
        public int product_line_id { get; set; }
        public bool in_stock { get; set; }
        public bool market_place_listing { get; set; }
        public int purchase_price { get; set; }
        public string lead_time { get; set; }
        public int original_price { get; set; }

    }

    public class ProductInformation
    {
        public Categories categories { get; set; }
        public string tab_title { get; set; }
    }

    public class TakealotProductDetails
    {
        public string title { get; set; }
        public string desktop_href { get; set; }
        public Core core { get; set; }
        public ProductInformation product_information { get; set; }
        public Description description { get; set; }
        public Meta meta { get; set; }
        public DataLayer data_layer { get; set; }
        public EventData event_data { get; set; }


    }


    public class Value
    {
        public string value_id { get; set; }
        public string type { get; set; }
        public string value { get; set; }
        public string url { get; set; }
    }


}
