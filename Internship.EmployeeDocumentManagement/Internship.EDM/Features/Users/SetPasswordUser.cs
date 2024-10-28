using Carter;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Identity;
using System.Web;

namespace Internship.EDM.Features.Users
{
    public class SetPasswordUserModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/set-password", async (SetPasswordModel model, UserManager<User> userManager) =>
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Results.BadRequest("Identity: User not found..");

                var result = await userManager.ResetPasswordAsync(user, model.Token, model.Password);
                if (result.Succeeded)
                    return Results.Ok("Password has been set successfully. You can now log in using your new password.");

                return Results.BadRequest(result.Errors);
            });
        }
    }
}
