using Carter;
using Marten;

namespace Internship.EDM.Features.Documents
{
    public class UploadDocumentModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/document/upload", async (Document document, IDocumentSession session) =>
            {
                if (string.IsNullOrWhiteSpace(document.UploadedBy))
                    return Results.BadRequest("Email is required.");
                if (string.IsNullOrWhiteSpace(document.BlobUri))
                    return Results.BadRequest("BlobUri is required.");

                session.Store(document);
                await session.SaveChangesAsync();

                return Results.Ok("Marten: Document saved!");
            });
        }
    }
}
