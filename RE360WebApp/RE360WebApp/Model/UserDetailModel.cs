using System.ComponentModel.DataAnnotations;

namespace RE360WebApp.Model
{
    public class UserDetailModel
    {
        public string AgentID { get; set; } = "";
        public string Email { get; set; }
        public string FirstName { get; set; } 
        public string LastName { get; set; }
        public string CompanyName { get; set; } = "";
        public string OffinceName { get; set; }
        public string ManagerEmail { get; set; }
        public decimal? BaseAmount { get; set; }
        public int? SalePricePercantage { get; set; }
        public decimal? MinimumCommission { get; set; }
        public List<Commision> Commisions { get; set; } = new List<Commision>() { };

    }
    public class Commision
    {
        //public int ID { get; set; }
        //public Guid AgentID { get; set; }
        public decimal? Percent { get; set; }
        public decimal? UpToAmount { get; set; }
        public int Sequence { get; set; }

    }
    public class Admin
    {
        public string UserName { get; set; }
        public string Password { get; set; }

    }
}
