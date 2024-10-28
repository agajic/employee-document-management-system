using Internship.EDM.Extensions;
using Internship.EDM.Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Weasel.Core;
using Marten;
using Azure.Storage.Blobs;
using Npgsql;
using Carter;
using System.Reflection;
using Internship.EDM.Infrastructure.EmailSendLogic;
using Wolverine;
using Wolverine.ErrorHandling;
using Internship.EDM.Features.UserSessions;


var builder = WebApplication.CreateBuilder(args);

// Define a CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost5173",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // Frontend URL
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var blobServiceClient = new BlobServiceClient(builder.Configuration.GetConnectionString("AccessKey"));
builder.Services.AddSingleton(blobServiceClient);

builder.Services.AddMarten(o =>
{
    var conn = builder.Configuration.GetConnectionString("EmployeeManagementDB");
    if (conn != null)
        o.Connection(conn);
    o.AutoCreateSchemaObjects = AutoCreate.All;
});

builder.Services.AddScoped<NpgsqlConnection>(sp =>
{
    var conn = builder.Configuration.GetConnectionString("EmployeeManagementDB");
    return new NpgsqlConnection(conn);
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Database")));

builder.Services.AddIdentity<User, Role>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddSingleton<IEmailSender, SendGridEmailSender>();

builder.Host.UseWolverine();

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/login";
    options.AccessDeniedPath = "/access-denied";
    options.Cookie.Name = "Cookie";
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;   
    options.Cookie.Path = "/";
    options.Cookie.Domain = "localhost";
    options.ExpireTimeSpan = TimeSpan.FromDays(7);
    options.SlidingExpiration = true;

    options.Events.OnRedirectToLogin = context =>
    {
        if (context.Request.Path.StartsWithSegments("/check-auth"))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
        }
        else
        {
            // For non-API calls, continue with the default behavior (redirect to login page)
            context.Response.Redirect(context.RedirectUri);
        }
        return Task.CompletedTask;
    };
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, CustomUserClaimsPrincipalFactory>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"));
});

builder.Services.AddCarter();

builder.Services.AddScoped<DataSeeder>();
builder.Services.AddHostedService<SeedHostedService>();

builder.Services.AddHostedService<SessionCleanupService>();

var app = builder.Build();

app.UseCors("AllowLocalhost5173");
app.UseAuthentication();
app.UseAuthorization();

app.MapCarter();
app.MapGet("/", () => "Backend working..");

app.ApplyMigrations();
app.Run();
