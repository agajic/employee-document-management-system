﻿using Carter;
using Marten;

namespace Internship.EDM.Features.Employees
{
    public class CreateEmployeeModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/employee/create", async(CreateEmployeeModel model, IDocumentSession session) =>
            {
                var employee = new Employee { Email = model.Email, Role = model.Role, Department = model.Department,
                FirstName = model.FirstName, LastName = model.LastName, PhoneNumber=model.PhoneNumber, WorkLocation=model.WorkLocation};
                session.Store(employee);
                await session.SaveChangesAsync();
                return Results.Ok("Marten: Employee created!");
            });
        }
    }
}
