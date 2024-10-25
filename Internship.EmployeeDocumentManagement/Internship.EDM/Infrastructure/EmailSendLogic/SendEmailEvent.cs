namespace Internship.EDM.Infrastructure.EmailSendLogic
{
    public class SendEmailEvent
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string PasswordSetupLink { get; set; } = string.Empty;
    }
}
