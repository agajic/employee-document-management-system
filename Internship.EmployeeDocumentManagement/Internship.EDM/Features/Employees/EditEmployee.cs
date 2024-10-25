using Carter;
using Marten;

namespace Internship.EDM.Features.Employees
{
    public class EditEmployeeModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPut("/employee/edit", async (EditEmployeeModel model, IDocumentSession session) =>
            {
                var employee = await session.Query<Employee>().FirstOrDefaultAsync(e => e.Email == model.Email);
                if (employee == null)
                    return Results.NotFound();

                employee.Email = model.NewEmail;
                employee.Role = model.Role;
                employee.Department = model.Department;
                employee.FirstName = model.FirstName;
                employee.LastName = model.LastName;
                employee.PhoneNumber = model.PhoneNumber;
                employee.WorkLocation = model.WorkLocation;

                session.Store(employee);
                await session.SaveChangesAsync();

                return Results.Ok(employee);
            });
        }
    }
}
