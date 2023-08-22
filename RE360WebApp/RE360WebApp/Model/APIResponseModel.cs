namespace RE360.API.Models
{
    public class APIResponseModel
    {
        public object statusCode { get; set; }
        public string message { get; set; }
        public string result { get; set; } = "";
    }
}
