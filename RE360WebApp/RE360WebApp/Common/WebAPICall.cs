using System.Net.Security;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using Newtonsoft.Json;
using RE360.API.Models;
using System.Data;
using System.Xml;

namespace RE360.API.Common
{
    public class WebAPICall
    {
        private readonly IConfiguration _configuration;
        public WebAPICall(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<DataSet> MakeApiCallAsync(string endPoint, HttpMethod httpMethod, dynamic payload = null)
        {
            try
            {
                ServicePointManager.ServerCertificateValidationCallback =
                delegate (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors)
                {
                    return true;
                };
                var baseApiUrl = _configuration.GetValue<string>("BaseApiUrl:ApiUrl");
                HttpContent content = null;
                if (payload != null)
                {
                    content = new StringContent(
                            JsonConvert.SerializeObject(payload),
                            System.Text.Encoding.UTF8,
                            "application/json"
                        );
                }
                var httpRequest = new HttpRequestMessage
                {
                    RequestUri = new Uri(baseApiUrl + endPoint, UriKind.Absolute),
                    Method = httpMethod,
                    Content = content
                };
                HttpClient httpClient = new HttpClient();
                httpClient.Timeout = TimeSpan.FromMinutes(240);
                var httpResponseMessage = await httpClient.SendAsync(httpRequest);
                if (httpResponseMessage.IsSuccessStatusCode)
                {
                    var response = await httpResponseMessage.Content.ReadAsStringAsync();
                    if (!string.IsNullOrEmpty(response))
                    {
                        return jsonToDataSet(response);
                    }
                    return new DataSet();
                }
                else
                {
                    var response = await httpResponseMessage.Content.ReadAsStringAsync();
                    //throw new Exception("API ["+ endPoint + "] Error: " + response.ToString());
                    throw new Exception("API [" + endPoint + "] Error: " + response);
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public DataSet jsonToDataSet(string jsonString)
        {
            try
            {
                XmlDocument xd = new XmlDocument();
                jsonString = "{ \"rootNode\": {" + jsonString.Trim().TrimStart('{').TrimEnd('}') + "} }";
                xd = (XmlDocument)JsonConvert.DeserializeXmlNode(jsonString);
                DataSet ds = new DataSet();
                ds.ReadXml(new XmlNodeReader(xd));
                return ds;
            }
            catch (Exception ex)
            {
                throw new ArgumentException(ex.Message);
            }
        }
    }
}
