using Carter;
using Internship.EDM.Features.UserSessions;
using Internship.EDM.Infrastructure;
using Marten;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Internship.EDM.Features.Auth
{
    public class LoginModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/login", async (LoginModel model, SignInManager<User> signInManager, UserManager<User> userManager, HttpContext httpContext, IDocumentSession session) =>
            {
                var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var user = await userManager.FindByEmailAsync(model.Email);
                    if (user != null)
                    {
                        var authProperties = new AuthenticationProperties
                        {
                            IsPersistent = true,
                            ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7) // Explicit 7-day expiration
                        };
                        //await httpContext.SignInAsync(IdentityConstants.ApplicationScheme, new ClaimsPrincipal(new ClaimsIdentity("Cookie")), authProperties);
                        await signInManager.SignInAsync(user, authProperties);

                        var currentRoles = await userManager.GetRolesAsync(user);
                        var currentRole = currentRoles.FirstOrDefault();
                        if (currentRole != null)
                        {
                            var activeSession = await session.Query<UserSession>()
                                            .Where(s => s.Email == model.Email)
                                            .FirstOrDefaultAsync();
                            if (activeSession != null)
                            {
                                activeSession.LoginTime = DateTimeOffset.UtcNow;
                                activeSession.LastActivityTime = DateTimeOffset.UtcNow;
                                activeSession.LogoutTime = null;
                                session.Store(activeSession);
                            }
                            else
                            {
                                var userSession = new UserSession
                                {
                                    Email = model.Email,
                                    LoginTime = DateTimeOffset.UtcNow,
                                    LastActivityTime = DateTimeOffset.UtcNow,
                                    LogoutTime = null,
                                };
                                session.Store(userSession);
                            }
                            await session.SaveChangesAsync();

                            return Results.Ok(new { Email = model.Email, Role = currentRole });
                        }
                    }

                }
                return Results.Unauthorized();
            });
        }
    }
}
