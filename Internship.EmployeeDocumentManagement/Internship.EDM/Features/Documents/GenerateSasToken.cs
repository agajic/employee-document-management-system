using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Carter;

namespace Internship.EDM.Features.Documents
{
    public class GenerateSasTokenModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapGet("/document/generateSasToken", (BlobServiceClient blobServiceClient) =>
            {
                var blobContainerClient = blobServiceClient.GetBlobContainerClient("files");

                var blobName = Guid.NewGuid().ToString(); // Create a unique name for the blob
                var blobClient = blobContainerClient.GetBlobClient(blobName); // Get a reference to the blob

                var sasBuilder = new BlobSasBuilder
                {
                    BlobContainerName = blobContainerClient.Name,
                    BlobName = blobName,
                    Resource = "b", // "b" = Blob
                    ExpiresOn = DateTimeOffset.UtcNow.AddHours(5) 
                };
                sasBuilder.SetPermissions(BlobSasPermissions.Write | BlobSasPermissions.Read | BlobSasPermissions.List);

                var sasUri = blobClient.GenerateSasUri(sasBuilder);

                // Return the full Blob URL that includes the SAS token
                return Results.Ok(new { blobUrl = sasUri.ToString(), blobName = blobName });
            }).WithName("GenerateSasToken");


            routes.MapPost("/document/generateDeleteSasToken", (BlobNameModel blobNameModel, BlobServiceClient blobServiceClient) =>
            {
                string blobName = blobNameModel.BlobName;

                var blobContainerClient = blobServiceClient.GetBlobContainerClient("files");
                var blobClient = blobContainerClient.GetBlobClient(blobName); 

                var sasBuilder = new BlobSasBuilder
                {
                    BlobContainerName = blobContainerClient.Name,
                    BlobName = blobName,
                    Resource = "b",
                    StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                    ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(30)
                };
                sasBuilder.SetPermissions(BlobSasPermissions.Delete);
                var sasUri = blobClient.GenerateSasUri(sasBuilder);

                return Results.Ok(new { blobUrl = sasUri.ToString(), blobName = blobName });
            }).WithName("GenerateDeleteSasToken");
        }
    }
}
