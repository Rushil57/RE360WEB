using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using RE360WebApp.Model;
using System.Runtime.Intrinsics.Arm;
using Microsoft.Extensions.Configuration;

namespace RE360WebApp.Session
{
    internal class SessionTimeout : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var configuration = filterContext.HttpContext.RequestServices.GetRequiredService<IConfiguration>();
            //string url = filterContext.HttpContext.Request.Path.Value;
            if (filterContext.HttpContext.Session.GetString("UserName") != null && filterContext.HttpContext.Session.GetString("Password") != null)
            {
                if (filterContext.HttpContext.Session.GetString("UserName") == configuration.GetValue<string>("AdminCredentials:UserName").ToString()
                    && filterContext.HttpContext.Session.GetString("Password") == configuration.GetValue<string>("AdminCredentials:Password").ToString())
                {
                    base.OnActionExecuting(filterContext);
                }
            }
            else
            {
                filterContext.HttpContext.Session.Clear();
                filterContext.Result = new RedirectToActionResult("Index", "User", null);
                return;
            }
        }
    }
}