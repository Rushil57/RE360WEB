using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RE360.API.Common;
using RE360WebApp.Model;
using RE360WebApp.Session;
using System.Data;

namespace RE360WebApp.Controllers
{
    [SessionTimeout]
    public class AgentController : Controller
    {
        private readonly IConfiguration _configuration;
        WebAPICall webAPI;
        public AgentController(IConfiguration configuration)
        {
            _configuration = configuration;
            webAPI = new WebAPICall(_configuration);
        }
        public async Task<IActionResult> AgentRegistration(string AgentID)
        {
            //List<UserDetailModel> userDetailModel = new List<UserDetailModel>();
            //try
            //{
            //    if (!string.IsNullOrEmpty(AgentID) && AgentID != "0")
            //    {

            //        DataSet dsResult = await webAPI.MakeApiCallAsync("api/User/GetAgentByID?AgentID=" + AgentID, HttpMethod.Post, null);
            //        if (dsResult != null && dsResult.Tables.Count > 1)
            //        {
            //            if (dsResult.Tables[1] != null)
            //            {
            //                DataRow[] rowsUser = dsResult.Tables[1].Select();
            //                foreach (var item in rowsUser)
            //                {
            //                    userDetailModel.Add(new UserDetailModel()
            //                    {
            //                        AgentID = item["agentID"].ToString(),
            //                        Email = item["email"].ToString(),
            //                        FirstName = item["FirstName"].ToString(),
            //                        LastName = item["LastName"].ToString(),
            //                        CompanyName = item["CompanyName"].ToString(),
            //                        OffinceName = item["OffinceName"].ToString(),
            //                        ManagerEmail = item["ManagerEmail"].ToString(),
            //                        BaseAmount = Convert.ToDecimal(item["BaseAmount"].ToString()),
            //                        SalePricePercantage = Convert.ToInt32(item["SalePricePercantage"].ToString()),
            //                        MinimumCommission = Convert.ToDecimal(item["MinimumCommission"].ToString()),
            //                    }
            //                    );
            //                }
            //            }
            //            //if (dsResult.Tables[2] != null && dsResult.Tables.Count > 2)
            //            //{
            //            //    DataRow[] rowsComm = dsResult.Tables[2].Select();
            //            //    foreach (var item in rowsComm)
            //            //    {
            //            //        Guid guAgentID;
            //            //        Guid.TryParse(item["agentID"].ToString(), out guAgentID);
            //            //        userDetailModel[0].Commisions.Add(new Commision
            //            //        {
            //            //            //ID = Convert.ToInt32(item["id"].ToString()),
            //            //            AgentID = guAgentID,
            //            //            Percent = Convert.ToInt32(item["percent"].ToString()),
            //            //            UpToAmount = !string.IsNullOrEmpty(item["upToAmount"].ToString()) ? Convert.ToDecimal(item["upToAmount"].ToString()) : 0,
            //            //            Sequence = Convert.ToInt32(item["sequence"].ToString())
            //            //        });
            //            //    }
            //            //}
            //        }
            //        else
            //        {
            //            if (dsResult != null && dsResult.Tables[0] != null)
            //            {
            //                return Ok(new { data = dsResult.Tables[0].Rows[0]["statusCode"].ToString(), message = dsResult.Tables[0].Rows[0]["message"].ToString() });
            //            }
            //        }

            //    }
            //    //return View((object)AgentID);
            //}
            //catch (Exception ex)
            //{
            //    return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
            //}
            //return View(userDetailModel.ToList());

            return View((object)AgentID);
        }
        public async Task<IActionResult> AgentReport()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetAgentByID(string AgentID)
        {
            try
            {
                UserDetailModel userDetailModel = new UserDetailModel();
                if (!string.IsNullOrEmpty(AgentID))
                {

                    DataSet dsResult = await webAPI.MakeApiCallAsync("/GetAgentByID?AgentID=" + AgentID, HttpMethod.Post, null);
                    if (dsResult != null && dsResult.Tables[1] != null)
                    {
                        DataRow[] rowsUser = dsResult.Tables[1].Select();
                        foreach (var item in rowsUser)
                        {
                            userDetailModel.AgentID = item["agentID"].ToString();
                            userDetailModel.Email = item["email"].ToString();
                            userDetailModel.FirstName = item["FirstName"].ToString();
                            userDetailModel.LastName = item["LastName"].ToString();
                            userDetailModel.CompanyName = item["CompanyName"].ToString();
                            userDetailModel.OffinceName = item["OffinceName"].ToString();
                            userDetailModel.ManagerEmail = item["ManagerEmail"].ToString();
                            if (!string.IsNullOrEmpty(item["BaseAmount"].ToString().ToString()) && Convert.ToDecimal(item["BaseAmount"].ToString()) != 0)
                            {
                                userDetailModel.BaseAmount = Convert.ToDecimal(item["BaseAmount"].ToString());
                            }
                            if (!string.IsNullOrEmpty(item["SalePricePercantage"].ToString().ToString()) && Convert.ToDecimal(item["SalePricePercantage"].ToString()) != 0)
                            {
                                userDetailModel.SalePricePercantage = Convert.ToInt32(item["SalePricePercantage"].ToString());
                            }
                            if (!string.IsNullOrEmpty(item["MinimumCommission"].ToString().ToString()) && Convert.ToDecimal(item["MinimumCommission"].ToString()) != 0)
                            {
                                userDetailModel.MinimumCommission = Convert.ToDecimal(item["MinimumCommission"].ToString());
                            }
                        }
                    }
                    if (dsResult != null && dsResult.Tables.Count > 2)
                    {
                        DataRow[] rowsComm = dsResult.Tables[2].Select();
                        foreach (var item in rowsComm)
                        {
                            Guid guAgentID;
                            Guid.TryParse(item["agentID"].ToString(), out guAgentID);
                            userDetailModel.Commisions.Add(new Commision
                            {
                                //ID = Convert.ToInt32(item["id"].ToString()),
                                //AgentID = guAgentID,
                                //Percent = Convert.ToInt32(item["percent"].ToString()),
                                Percent = !string.IsNullOrEmpty(item["percent"].ToString()) ? Convert.ToDecimal(item["percent"].ToString()) : null,
                                UpToAmount = !string.IsNullOrEmpty(item["upToAmount"].ToString()) ? Convert.ToDecimal(item["upToAmount"].ToString()) : null,
                                Sequence = Convert.ToInt32(item["sequence"].ToString())
                            });
                        }
                    }
                }
                return Ok(new { data = userDetailModel });
            }
            catch (Exception ex)
            {
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
            }
        }
        [HttpPost]
        public async Task<IActionResult> ADDUpdateAgent([FromBody] APIRequestModel model)
        {
            try
            {
                UserDetailModel userDetailModel = JsonConvert.DeserializeObject<UserDetailModel>(model.Parameter);
                if (userDetailModel != null)
                {
                    DataSet dsResult = await webAPI.MakeApiCallAsync("/ADDUpdateAgent", HttpMethod.Post, userDetailModel);
                    if (dsResult != null && dsResult.Tables[0] != null)
                    {
                        return Ok(new { status = dsResult.Tables[0].Rows[0]["statusCode"].ToString(), message = dsResult.Tables[0].Rows[0]["message"].ToString() });
                    }
                }
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
            }
            catch (Exception ex)
            {
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
                throw;
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetAgentReport()
        {
            try
            {
                List<UserDetailModel> userlist = new List<UserDetailModel>();
                DataSet dsResult = await webAPI.MakeApiCallAsync("/GetAgentReport", HttpMethod.Post, null);
                if (dsResult != null && dsResult.Tables.Count > 1)
                {
                    if (dsResult.Tables[1].Rows.Count > 0)
                    {
                        DataRow[] rowsUser = dsResult.Tables[1].Select();
                        foreach (var item in rowsUser)
                        {
                            userlist.Add(new UserDetailModel
                            {
                                AgentID = item["agentID"].ToString(),
                                Email = item["email"].ToString(),
                                FirstName = item["firstName"].ToString(),
                                CompanyName = item["companyName"].ToString(),
                                OffinceName = item["offinceName"].ToString(),
                            });
                        }
                    }
                }
                return Ok(new { data = userlist });
            }
            catch (Exception ex)
            {
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteAgentByID(string AgentID)
        {
            try
            {
                if (!string.IsNullOrEmpty(AgentID))
                {

                    DataSet dsResult = await webAPI.MakeApiCallAsync("/DeleteAgentByID?AgentID=" + AgentID, HttpMethod.Post, null);
                    if (dsResult != null && dsResult.Tables[0] != null)
                    {
                        return Ok(new { status = dsResult.Tables[0].Rows[0]["statusCode"].ToString(), message = dsResult.Tables[0].Rows[0]["message"].ToString() });
                    }
                }
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
            }
            catch (Exception ex)
            {
                return Ok(new { status = StatusCodes.Status403Forbidden, message = "Something Went Wrong." });
            }
        }
    }
}
