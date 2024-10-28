using Carter;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Internship.EDM.Features.Auth
{
    public class CheckAuthModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapGet("/check-auth", (SignInManager<User> signInManager, HttpContext httpContext) =>
            {
                var email = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
                var role = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value;

                if (email == null || role == null) {
                    return Results.BadRequest();
                }

                return Results.Ok(new { Email = email, Role = role });
            }).RequireAuthorization();


            routes.MapGet("/secured", [Authorize(Roles = "Admin,HR")] () =>
            {
                return Results.Ok("You are authorized to access this endpoint.");
            });
        }
    }
}
