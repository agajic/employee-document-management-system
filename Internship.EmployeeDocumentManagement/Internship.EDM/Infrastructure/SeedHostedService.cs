namespace Internship.EDM.Infrastructure;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class SeedHostedService : IHostedService
{
    private readonly IServiceScopeFactory serviceScopeFactory;

    public SeedHostedService(IServiceScopeFactory serviceScopeFactory)
    {
        this.serviceScopeFactory = serviceScopeFactory;
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        using var scope = serviceScopeFactory.CreateScope();
        var dataSeeder = scope.ServiceProvider.GetRequiredService<DataSeeder>();

        await dataSeeder.SeedUserRoles();
        await dataSeeder.SeedAdmin();
        await dataSeeder.SeedDepartments();
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }
}

