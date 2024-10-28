using Carter;
using Internship.EDM.Features.Users;
using Internship.EDM.Infrastructure;
using Marten;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Internship.EDM.Features.UserSessions
{
    public class UpdateActivityModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/update-activity", async (HttpContext httpContext, IDocumentSession session) =>
            {
                //var email = user.FindFirst(ClaimTypes.Email)?.Value;
                //var email = user.Email;
                var email = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

                if (email != null)
                {
                    var activeSession = await session.Query<UserSession>()
                                            .Where(s => s.Email == email)
                                            .FirstOrDefaultAsync();

                    if (activeSession != null)
                    {
                        activeSession.LastActivityTime = DateTimeOffset.UtcNow;
                        activeSession.LogoutTime = null;
                        session.Store(activeSession);
                        await session.SaveChangesAsync();
                        return Results.Ok();
                    }
                }
                return Results.Unauthorized();
            });
        }
    }
}
