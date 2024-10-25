using Carter;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace Internship.EDM.Features.Users
{
    public class EditUserModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPut("/edit-user", async (EditUserModel model, UserManager<User> userManager, RoleManager<Role> roleManager) =>
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Results.BadRequest("Identity: No user found..");

                if (model.Email != model.NewEmail)
                {
                    var result1 = await userManager.SetEmailAsync(user, model.NewEmail);
                    var result2 = await userManager.SetUserNameAsync(user, model.NewEmail);
                }

                var currentRoles = await userManager.GetRolesAsync(user);
                var currentRole = currentRoles.FirstOrDefault();
                if (currentRole != model.Role)
                {
                    if (currentRole != null)
                    {
                        await userManager.RemoveFromRoleAsync(user, currentRole);
                        var addResult = await userManager.AddToRoleAsync(user, model.Role);

                    }
                }
                return Results.Ok("Identity: User edit success!");
            });
        }
    }
}
