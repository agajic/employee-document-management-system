namespace Internship.EDM.Features.UserSessions
{
    public class UserSession
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Email { get; set; } = string.Empty;
        public DateTimeOffset LoginTime { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset LastActivityTime { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? LogoutTime { get; set; }
        public bool IsActive => LogoutTime == null;
    }

    public class LoggedUser
    {
        public string Email { get; set; } = string.Empty;
    }
}
