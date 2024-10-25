using Carter;
using Marten;

namespace Internship.EDM.Features.Documents
{
    public class DeleteDocumentModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/document/delete", async (BlobNameModel blobNameModel, IDocumentSession session) =>
            {
                string blobName = blobNameModel.BlobName;
                if (string.IsNullOrWhiteSpace(blobName))
                    return Results.BadRequest("BlobName is required.");

                var document = await session.Query<Document>().FirstOrDefaultAsync(e => e.BlobName == blobName);
                if (document == null)
                    return Results.NotFound();

                session.Delete(document);
                await session.SaveChangesAsync();

                return Results.Ok($"Marten: Document with Blob Name {blobName} deleted!");
            });
        }
    }
}
