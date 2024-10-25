namespace Internship.EDM.Infrastructure.EmailSendLogic;

public interface IEmailSender
{
    Task SendEmailAsync(string email, string subject, string htmlMessage);
}

