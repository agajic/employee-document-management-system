using Carter;
using Marten;
using Internship.EDM.Infrastructure;

namespace Internship.EDM.Features.Employees
{
    public class DeleteEmployeeModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/employee/delete", async (DeleteEmployeeModel model, IDocumentSession session) =>
            {
                var employee = await session.Query<Employee>().FirstOrDefaultAsync(e => e.Email == model.Email);
                if (employee == null)
                    return Results.BadRequest();

                session.Delete(employee);
                await session.SaveChangesAsync();
                return Results.Ok($"<arten: Employee with email {model.Email} deleted!");
            });
        }
    }
}
