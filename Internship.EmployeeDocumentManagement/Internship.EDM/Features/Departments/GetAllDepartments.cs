using Carter;
using Marten;

namespace Internship.EDM.Features.Departments
{
    public class GetAllDepartmentsModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapGet("/departments", async
                (IDocumentSession session
                ) =>
            {
                IQueryable<Department> query = session.Query<Department>();

                List<Department> departments = (List<Department>)await query.ToListAsync();

                return Results.Ok(departments);
            }).WithName("GetAllDepartments");
        }
    }
}
