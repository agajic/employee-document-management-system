using Carter;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Internship.EDM.Features.Auth
{
    public class CheckAuthModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapGet("/check-auth", (ClaimsPrincipal user) =>
            {
                if (user.Identity?.IsAuthenticated == true)
                {
                    var email = user.FindFirst(ClaimTypes.Email)?.Value;
                    var role = user.FindFirst(ClaimTypes.Role)?.Value;

                    return Results.Ok(new { Email = email, Role = role });
                }
                else
                {
                    return Results.Unauthorized();
                }
            }).RequireAuthorization();


            routes.MapGet("/secured", [Authorize(Roles = "Admin,HR")] () =>
            {
                return Results.Ok("You are authorized to access this endpoint.");
            });
        }
    }
}
