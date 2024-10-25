using Carter;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace Internship.EDM.Features.Auth
{
    public class LoginModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/login", async (LoginModel model, SignInManager<User> signInManager, UserManager<User> userManager) =>
            {
                var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var user = await userManager.FindByEmailAsync(model.Email);
                    if (user != null)
                    {
                        var currentRoles = await userManager.GetRolesAsync(user);
                        var currentRole = currentRoles.FirstOrDefault();
                        if (currentRole != null)
                        {
                            return Results.Ok(new { Email = model.Email, Role = currentRole });
                        }
                    }

                }
                return Results.Unauthorized();
            });
        }
    }
}
