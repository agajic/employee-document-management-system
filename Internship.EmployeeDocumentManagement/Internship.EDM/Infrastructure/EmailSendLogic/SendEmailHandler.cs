using JasperFx.CodeGeneration.Frames;

namespace Internship.EDM.Infrastructure.EmailSendLogic
{
    public class SendEmailHandler
    {
        private IEmailSender emailSender;

        public SendEmailHandler(IEmailSender emailSender)
        {
            this.emailSender = emailSender;
        }

        public async Task Handle(SendEmailEvent emailEvent)
        {
            var emailBody = $@"
            <h3>Hello {emailEvent.Email},</h3>
            <p>You have been registered with the role <strong>{emailEvent.Role}</strong>. Please set up your password by clicking the following link:</p>
            <p><a href='{emailEvent.PasswordSetupLink}'>Set your password</a></p>
            <p>If you did not request this, please ignore this email.</p>";

            await emailSender.SendEmailAsync(emailEvent.Email, "Set up your password", emailBody);
        }
    }
}
