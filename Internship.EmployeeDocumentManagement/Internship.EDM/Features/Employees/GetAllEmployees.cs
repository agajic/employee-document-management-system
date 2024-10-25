using Npgsql;
using Dapper;
using Carter;

namespace Internship.EDM.Features.Employees
{
    public class GetAllEmployeesModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/employees", async
                (
                    FilterEmployeeModel filters,
                    NpgsqlConnection connection
                ) =>
            {
                await connection.OpenAsync();

                string role = filters.Role;
                string department = filters.Department;
                string sortBy = filters.SortBy;
                string sortOrder = filters.SortOrder;
                string search = filters.Search;
                int pageNumber = filters.PageNumber;

                int PAGE_SIZE = 2;
                var offset = (pageNumber - 1) * PAGE_SIZE;

                var sql = @"
                        SELECT data->>'Email' AS Email, 
                                data->>'Role' AS Role, 
                                data->>'Department' AS Department
                        FROM mt_doc_employee
                        WHERE 1=1";

                if (!string.IsNullOrEmpty(role) && role != "All")
                    sql += " AND data->>'Role' = @Role";

                if (!string.IsNullOrEmpty(department) && department != "All")
                    sql += " AND data->>'Department' = @Department";

                if (!string.IsNullOrEmpty(search))
                    sql += " AND (LOWER(data->>'Email') LIKE @Search OR LOWER(data->>'Role') LIKE @Search OR LOWER(data->>'Department') LIKE @Search)";


                if (!string.IsNullOrEmpty(sortOrder) && !string.IsNullOrEmpty(sortBy))
                {
                    string sortColumn = sortBy.ToLower() switch
                    {
                        "email" => "Email",
                        "role" => "Role",
                        "department" => "Department",
                        _ => "Email" // Default sort by Email
                    };
                    sql += $" ORDER BY {sortColumn} {(sortOrder.ToLower() == "desc" ? "DESC" : "ASC")}";
                }

                sql += " LIMIT @Limit OFFSET @Offset;";

                var listOfEmployees = await connection.QueryAsync<Employee>(sql, new
                {
                    Role = role,
                    Department = department,
                    Search = $"%{search?.ToLower()}%",
                    Limit = PAGE_SIZE,
                    Offset = offset,
                });

                var countSql = @"
                    SELECT COUNT(*) 
                    FROM mt_doc_employee 
                    WHERE 1=1";
                if (!string.IsNullOrEmpty(role) && role != "All")
                    countSql += " AND data->>'Role' = @Role";

                if (!string.IsNullOrEmpty(department) && department != "All")
                    countSql += " AND data->>'Department' = @Department";

                if (!string.IsNullOrEmpty(search))
                    countSql += " AND (LOWER(data->>'Email') LIKE @Search OR LOWER(data->>'Role') LIKE @Search OR LOWER(data->>'Department') LIKE @Search)";

                var totalEmployees = await connection.ExecuteScalarAsync<int>(countSql, new
                {
                    Role = role,
                    Department = department,
                    Search = $"%{search?.ToLower()}%"
                });

                double doubleTotalPages = (double)totalEmployees / PAGE_SIZE;
                int intTotalPages = (int)Math.Ceiling(doubleTotalPages);

                await connection.CloseAsync();

                return Results.Ok(new
                {
                    employees = listOfEmployees,
                    totalPages = intTotalPages,
                });
            });
        }
    }
}
