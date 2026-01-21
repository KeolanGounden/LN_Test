using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;


namespace ChangeTrackerModel.Utlis
{

    public class UnixMilliHexConverter : JsonConverter<DateTime>
    {
        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
            {
                throw new JsonException($"Cannot convert null value to {typeToConvert}");
            }

            if (reader.TokenType == JsonTokenType.String)
            {
                string hexValue = reader.GetString();

                if (!long.TryParse(hexValue, NumberStyles.HexNumber, CultureInfo.InvariantCulture, out long milliseconds))
                {
                    throw new JsonException($"Cannot convert '{hexValue}' to {typeToConvert}");
                }

                return DateTimeOffset.FromUnixTimeMilliseconds(milliseconds).UtcDateTime;
            }

            if (reader.TokenType == JsonTokenType.Number)
            {
                long milliseconds = reader.GetInt64();
                return DateTimeOffset.FromUnixTimeMilliseconds(milliseconds).UtcDateTime;
            }

            throw new JsonException($"Unexpected token parsing DateTime. Token: {reader.TokenType}");
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            long unixMilliSeconds = ((DateTimeOffset)value).ToUnixTimeMilliseconds();
            string hex = unixMilliSeconds.ToString("X");
            writer.WriteStringValue(hex);
        }
    }

}
