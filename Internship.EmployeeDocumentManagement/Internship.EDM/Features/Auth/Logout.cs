using Carter;
using Internship.EDM.Features.UserSessions;
using Internship.EDM.Infrastructure;
using Marten;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Net.Http;
using System.Security.Claims;

namespace Internship.EDM.Features.Auth
{
    public class LogoutModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/logout", async (HttpContext httpContext, IDocumentSession session, SignInManager < User> signInManager) =>
            {
                var email = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                if (email != null)
                {
                    var activeSession = session.Query<UserSession>()
                                                .Where(s => s.Email == email && s.LogoutTime == null)
                                                .FirstOrDefault();
                    if(activeSession != null)
                    {
                        activeSession.LogoutTime = DateTimeOffset.UtcNow;
                        session.Store(activeSession);
                        await session.SaveChangesAsync();

                        //await signInManager.SignOutAsync();
                        //return Results.Ok("You have been logged out.");
                    }
                }
                await signInManager.SignOutAsync();
                return Results.Ok("You have been logged out.");
                //return Results.Unauthorized();
            });
        }
    }
}
