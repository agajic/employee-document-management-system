namespace Internship.EDM.Features.Employees
{
    public class Employee
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    public class CreateEmployeeModel
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    public class DeleteEmployeeModel
    {
        public string Email { get; set; } = string.Empty;
    }

    public class EditEmployeeModel
    {
        public string Email { get; set; } = string.Empty;
        public string NewEmail { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
    }

    public class FilterEmployeeModel
    {
        public string Role { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string SortBy { get; set; } = string.Empty;
        public string SortOrder { get; set; } = string.Empty;
        public string Search { get; set; } = string.Empty;
        public int PageNumber { get; set; } = 1;
    }
}

