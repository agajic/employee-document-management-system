using Azure.Storage.Sas;
using Azure.Storage.Blobs;
using Npgsql;
using Dapper;
using Carter;
using System;

namespace Internship.EDM.Features.Documents
{
    public class GetDocumentsModule : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder routes)
        {
            routes.MapPost("/document/get", async (FilterDocumentModel filters, NpgsqlConnection connection, BlobServiceClient blobServiceClient) =>
            {
                await connection.OpenAsync();

                string email = filters.Email;
                string sortField = filters.SortField;
                string sortOrder = filters.SortOrder;
                string search = filters.Search;
                int pageSize = filters.PageSize;
                int pageNumber = filters.PageNumber;
               
                var offset = (pageNumber - 1) * pageSize;

                var sql = @"
                        SELECT  
                                data->>'BlobUri' AS BlobUri, 
                                data->>'BlobName' AS BlobName, 
                                data->>'FileName' AS FileName,
                                data->>'FileSize' AS FileSize,
                                data->>'UploadedAt' AS UploadedAt,
                                data->>'UploadedBy' AS UploadedBy,
                                data->>'ContentType' AS ContentType
                        FROM mt_doc_document
                        WHERE 1=1"
                ;

                if (!string.IsNullOrEmpty(email))
                    sql += " AND data->>'UploadedBy' = @UploadedBy";

                if (!string.IsNullOrEmpty(search))
                    sql += " AND (LOWER(data->>'FileName') LIKE @Search OR LOWER(data->>'ContentType') LIKE @Search OR LOWER(data->>'UploadedAt') LIKE @Search)";

                if (!string.IsNullOrEmpty(sortField) && !string.IsNullOrEmpty(sortOrder))
                {
                    if (sortField == "FileSize")
                    {
                        sql += $" ORDER BY (data->>'FileSize')::INTEGER {(sortOrder.ToLower() == "desc" ? "DESC" : "ASC")}";
                    }
                    else
                    {
                        sql += $" ORDER BY {sortField} {(sortOrder.ToLower() == "desc" ? "DESC" : "ASC")}";
                    }
                }

                sql += " LIMIT @Limit OFFSET @Offset;";

                var listOfDocumentMetadata = await connection.QueryAsync<Document>(sql, new
                {
                    UploadedBy = email,
                    Search = $"%{search?.ToLower()}%",
                    Limit = pageSize,
                    Offset = offset,
                });

                List<ReadDocumentModel> readDocs = new List<ReadDocumentModel>();

                var blobContainerClient = blobServiceClient.GetBlobContainerClient("files");
                foreach (Document doc in listOfDocumentMetadata)
                {
                    ReadDocumentModel rdoc = new ReadDocumentModel(doc);

                    var blobName = doc.BlobName;
                    var blobClient = blobContainerClient.GetBlobClient(blobName);
                    var sasBuilder = new BlobSasBuilder
                    {
                        BlobContainerName = blobContainerClient.Name,
                        BlobName = blobName,
                        Resource = "b",
                        StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                        ExpiresOn = DateTimeOffset.UtcNow.AddHours(2),
                    };
                    sasBuilder.SetPermissions(BlobSasPermissions.Read);

                    sasBuilder.ContentDisposition = $"inline; filename=\"{rdoc.FileName}\"";
                    var sasViewUri = blobClient.GenerateSasUri(sasBuilder);
                    rdoc.BlobViewUri = sasViewUri.ToString();

                    sasBuilder.ContentDisposition = $"attachment; filename=\"{rdoc.FileName}\"";
                    var sadDownloadUri = blobClient.GenerateSasUri(sasBuilder);
                    rdoc.BlobDownloadUri = sadDownloadUri.ToString();

                    readDocs.Add(rdoc);
                }


                var countSql = @"
                    SELECT COUNT(*) 
                    FROM mt_doc_document
                    WHERE 1=1";

                if (!string.IsNullOrEmpty(email))
                    countSql += " AND data->>'UploadedBy' = @UploadedBy";

                if (!string.IsNullOrEmpty(search))
                    countSql += " AND (LOWER(data->>'FileName') LIKE @Search OR LOWER(data->>'ContentType') LIKE @Search OR LOWER(data->>'UploadedAt') LIKE @Search)";

                var totalFiles = await connection.ExecuteScalarAsync<int>(countSql, new
                {
                    UploadedBy = email,
                    Search = $"%{search?.ToLower()}%"
                });

                double doubleTotalPages = (double)totalFiles / pageSize;
                int intTotalPages = (int)Math.Ceiling(doubleTotalPages);

                await connection.CloseAsync();

                return Results.Ok(new
                {
                    files = readDocs,
                    totalPages = intTotalPages,
                });
            });
        }
    }
}
