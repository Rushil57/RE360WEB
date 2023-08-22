namespace RE360WebApp.Model
{
    public class SessionUser
    {
        public string SessionUserName = "_Name";
        public string SessionPassword = "_Pass";

        public SessionUser(string username, string password)
        {
            SessionUserName = username;
            SessionPassword = password;
        }
    }
}
