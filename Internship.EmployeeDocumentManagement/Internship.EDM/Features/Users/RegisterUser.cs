using Carter;
using Internship.EDM.Infrastructure;
using Internship.EDM.Infrastructure.EmailSendLogic;
using Microsoft.AspNetCore.Identity;
using Wolverine;

namespace Internship.EDM.Features.Users
{
    public class RegisterUserModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/register", async (RegisterUserModel model, UserManager<User> userManager, RoleManager<Role> roleManager, IEmailSender emailSender, IConfiguration config, IMessageBus bus) =>
            {
                var user = new User { Email = model.Email, UserName = model.Email };
                var result = await userManager.CreateAsync(user);

                if (!result.Succeeded)
                    return Results.BadRequest(result.Errors);

                var assignedRole = model.Role ?? "Employee";
                if (!await roleManager.RoleExistsAsync(assignedRole))
                    return Results.BadRequest($"Identity: Role {assignedRole} does not exist..");

                await userManager.AddToRoleAsync(user, assignedRole);

                var token = await userManager.GeneratePasswordResetTokenAsync(user);
                var passwordSetupLink = $"{config["AppSettings:FrontendBaseUrl"]}/set-password?email={user.Email}&token={Uri.EscapeDataString(token)}";

                await bus.PublishAsync(new SendEmailEvent
                {
                    Email = model.Email,
                    Role = assignedRole,
                    PasswordSetupLink = passwordSetupLink,
                });

                return Results.Ok(new { message = $"User {user.UserName} registered successfully with role {assignedRole}. A password setup link has been sent to {model.Email}." });
            });
        }
    }
}
