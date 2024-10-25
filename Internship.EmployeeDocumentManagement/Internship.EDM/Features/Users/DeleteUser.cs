using Carter;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Identity;

namespace Internship.EDM.Features.Users
{
    public class DeleteUserModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/delete-user", async (DeleteUserModel model, UserManager<User> userManager) =>
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user == null)
                    return Results.BadRequest("Identity: No user found..");
                var result = await userManager.DeleteAsync(user);

                if (result.Succeeded)
                    return Results.Ok("Identity: User deleted successfully!");

                return Results.BadRequest(result.Errors);
            });
        }
    }
}
