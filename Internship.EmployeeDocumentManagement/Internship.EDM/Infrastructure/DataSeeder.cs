using Internship.EDM.Features.Departments;
using Marten;
using Microsoft.AspNetCore.Identity;

namespace Internship.EDM.Infrastructure;

public class DataSeeder(RoleManager<Role> roleManager, UserManager<User> userManager, IDocumentStore documentStore)
{
    public async Task SeedUserRoles()
    {
        string[] roleNames = { "Admin", "HR", "Employee" };

        foreach (var roleName in roleNames)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var role = new Role { Name = roleName };
                await roleManager.CreateAsync(role);
            }
        }
    }
    public  async Task SeedAdmin()
    {
        var adminEmail = "admin";           //builder.Configuration["AdminSettings:Email"];
        var adminPassword = "Admin123!";    //builder.Configuration["AdminSettings:Password"];

        var adminUser = await userManager.FindByEmailAsync(adminEmail);

        if (adminUser == null)
        {
            adminUser = new User { UserName = adminEmail, Email = adminEmail };
            var result = await userManager.CreateAsync(adminUser, adminPassword);

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }
    public async Task SeedDepartments()
    {
        using var session = documentStore.LightweightSession();
        var departments = session.Query<Department>().ToList();

        if (!departments.Any())
        {
            var defaultDepartments = new List<Department>
            {
                new Department { Name = "HR"},
                new Department { Name = "FrontDev"},
                new Department { Name = "BackDev", },
                new Department { Name = "Security" }
            };

            session.Store<Department>(defaultDepartments);
            await session.SaveChangesAsync();
        }
    }
}
