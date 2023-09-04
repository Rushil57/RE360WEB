using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Nancy;
using Nancy.Json;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RE360.API.Common;
using RE360.API.Models;
using RE360WebApp.Model;
using System.Data;
using System.Reflection;
using System.Security.AccessControl;

namespace RE360WebApp.Controllers
{
    public class UserController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly string UserName = "";
        private readonly string Password = "";
        private readonly string baseUrl = "";
        public UserController(IConfiguration configuration)
        {
            _configuration = configuration;
            UserName = _configuration.GetValue<string>("AdminCredentials:UserName").ToString();
            Password = _configuration.GetValue<string>("AdminCredentials:Password").ToString();
        }
        public async Task<IActionResult> Index()
        {
            return View();
        }

        public async Task<IActionResult> AgentDocView(string pid)
        {
            string url = "";
            //if (!string.IsNullOrEmpty(pid) && Convert.ToInt32(pid) > 0)
            //{
                url = "https://re360devstoragev2.blob.core.windows.net/test/" + pid + ".pdf";
            //}
            return View((object)url);
        }

        [HttpPost]
        public async Task<IActionResult> LoginAdmin([FromBody] APIRequestModel model)
        {
            string ErrMsg = "";
            try
            {
                Admin admin = JsonConvert.DeserializeObject<Admin>(model.Parameter);
                if (admin != null)
                {
                    if (string.IsNullOrEmpty(admin.UserName))
                    {
                        ErrMsg = "Please enter User Name";
                    }
                    if (string.IsNullOrEmpty(admin.Password))
                    {
                        ErrMsg = "Please enter Password";
                    }
                    if (admin.UserName == UserName)
                    {
                        if (admin.Password == Password)
                        {
                            HttpContext.Session.SetString("UserName", admin.UserName);
                            HttpContext.Session.SetString("Password", admin.Password);
                            return Ok(new { status = StatusCodes.Status200OK });
                        }
                        else
                        {
                            ErrMsg = "Password is Invalid";
                        }
                    }
                    else
                    {
                        ErrMsg = "User Name is Invalid";
                    }
                }
                return Ok(new { status = StatusCodes.Status403Forbidden, message = string.IsNullOrEmpty(ErrMsg) ? "Something Went Wrong." : ErrMsg });
            }
            catch (Exception ex)
            {
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
                throw;
            }
        }

        [HttpGet]
        public IActionResult GetBaseUrl()
        {
            var request = HttpContext.Request;

            //var baseUrl = $"{request.Scheme}://{request.Host}:{request.PathBase.ToUriComponent()}";
            var baseUrl = $"{request.Scheme}://{request.Host}";

            return Ok(baseUrl);
        }


    }
}
