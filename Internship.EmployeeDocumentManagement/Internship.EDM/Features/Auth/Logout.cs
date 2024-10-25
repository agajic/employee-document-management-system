using Carter;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace Internship.EDM.Features.Auth
{
    public class LogoutModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/logout", async (SignInManager<User> signInManager) =>
            {
                await signInManager.SignOutAsync();
                return Results.Ok("You have been logged out.");
            });
        }
    }
}
