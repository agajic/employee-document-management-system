export interface FileMetadataPayload{
    fileName: string;
    blobName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
    blobUri: string;
    uploadedBy: string;
}

export interface ReadFileMetadataPayload{
    fileName: string;
    blobName: string;
    contentType: string;
    fileSize: string;
    uploadedAt: string;
    blobUri: string;
    uploadedBy: string;
    blobViewUri: string;
    blobDownloadUri: string;
}