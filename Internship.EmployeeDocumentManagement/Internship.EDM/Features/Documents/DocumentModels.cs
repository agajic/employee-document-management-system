namespace Internship.EDM.Features.Documents
{
    public class Document
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string FileName { get; set; } = string.Empty;
        public string BlobName { get; set; } = string.Empty;
        public string ContentType { get; set; } = string.Empty;
        public int FileSize { get; set; }
        public string UploadedAt { get; set; } = string.Empty;
        public string BlobUri { get; set; } = string.Empty;
        public string UploadedBy { get; set; } = string.Empty;
    }

    public class ReadDocumentModel : Document
    {
        public string BlobViewUri { get; set; } = string.Empty;
        public string BlobDownloadUri {  get; set; } = string.Empty;
        public ReadDocumentModel(Document doc) 
        { 
            Id = doc.Id;
            FileName = doc.FileName;
            BlobName = doc.BlobName;
            ContentType = doc.ContentType;
            FileSize = doc.FileSize;
            UploadedAt = doc.UploadedAt;
            BlobUri = doc.BlobUri;
            UploadedBy = doc.UploadedBy;
        }
    }

    public class FilterDocumentModel()
    {
        public string Email { get; set; } = string.Empty;
        public string SortField { get; set; } = string.Empty;
        public string SortOrder { get; set; } = string.Empty;
        public string Search { get; set; } = string.Empty;
        public int PageSize { get; set; } = 5;
        public int PageNumber { get; set; } = 1;
    }

    public class BlobNameModel
    {
        public string BlobName { get; set; } = string.Empty;
    }
}
