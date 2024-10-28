using Marten;

namespace Internship.EDM.Features.UserSessions
{
    public class SessionCleanupService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;

        public SessionCleanupService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    using var scope = _serviceProvider.CreateScope();
                    var session = scope.ServiceProvider.GetRequiredService<IDocumentSession>();
                    var threshold = DateTimeOffset.UtcNow.AddMinutes(-2); // 30-minute inactivity threshold

                    var inactiveSessions = await session.Query<UserSession>()
                        .Where(s => s.LogoutTime == null && s.LastActivityTime < threshold)
                        .ToListAsync();

                    foreach (var inactiveSession in inactiveSessions)
                    {
                        inactiveSession.LogoutTime = DateTimeOffset.UtcNow;
                        session.Store(inactiveSession);
                    }

                    await session.SaveChangesAsync();
                    await Task.Delay(TimeSpan.FromMinutes(2), stoppingToken);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SessionCleanupService: {ex.Message}");
            }
        }
    }
}
