using SendGrid.Helpers.Mail;
using SendGrid;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Internship.EDM.Infrastructure.EmailSendLogic;

public class SendGridEmailSender : IEmailSender
{
    private readonly IConfiguration _configuration;

    public SendGridEmailSender(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string email, string subject, string htmlMessage)
    {
        var apiKey = _configuration["SendGrid:ApiKey"];
        var senderEmail = _configuration["SendGrid:SenderEmail"];
        var senderName = _configuration["SendGrid:SenderName"];

        var client = new SendGridClient(apiKey);
        var from = new EmailAddress(senderEmail, senderName);
        var to = new EmailAddress(email);
        var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent: null, htmlContent: htmlMessage);

        var response = await client.SendEmailAsync(msg);

        // Optionally, you can log the response details here
        if (response.StatusCode != System.Net.HttpStatusCode.OK)
        {
            var errorMessage = await response.Body.ReadAsStringAsync();
            throw new InvalidOperationException($"Failed to send email: {errorMessage}");
        }
    }
}

