namespace Internship.EDM.Features.Users
{
    public class RegisterUserModel
    {
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class DeleteUserModel
    {
        public string Email { get; set; } = string.Empty;
    }

    public class EditUserModel
    {
        public string Email { get; set; } = string.Empty;
        public string NewEmail { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
    }

    public class SetPasswordModel
    {
        public string Email { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
