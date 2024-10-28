import { call, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { uploadFileRequest, uploadFileSuccess, uploadFileFailure, getFilesFetch, getFilesSuccess, getFilesFailure, deleteFileRequest, setTotalPages } from "./documentSlice";
import { BlockBlobClient } from "@azure/storage-blob";
import { PayloadAction } from "@reduxjs/toolkit";
import { FileMetadataPayload } from "./documentModel";
import { RootState } from "../../app/store";

interface SasToken{
    blobUrl: string;
    blobName: string;
}

interface FileFilters{
    userEmail: string;
    sortField: string;
    sortOrder: string;
    searchQuery: string;
    pageSize: number;
    pageNumber: number;
}

const fileFilters = (state: RootState) => ({
    sortField: state.doc.sortField,
    sortOrder: state.doc.sortOrder,
    searchQuery: state.doc.searchQuery,
    pageSize: state.doc.pageSize,
    pageNumber: state.doc.pageNumber,
});


//##################################################################################################//


async function getSasTokenApi() : Promise<SasToken> {
    const response = await fetch('https://localhost:7262/document/generateSasToken', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
    throw new Error('Error generating SasToken..');
    }

    const sasToken = await response.json();
    return sasToken;
};

async function uploadFileMetadataApi(metadata: FileMetadataPayload) {
    const response = await fetch('https://localhost:7262/document/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
    });

    if (!response.ok) {
        throw new Error('Error uploading via marten');
    }
};

/*function* uploadFileSaga(action: PayloadAction<{ file:File, userEmail:string }>): Generator<any, void, SasToken>{
  try {
    const sasToken: SasToken = yield call(getSasTokenApi);

    // Use BlobServiceClient to upload the file
    const fileName = action.payload.file.name;
    const blockBlobClient = new BlockBlobClient(sasToken.blobUrl);

    // Upload the file to Azure Blob Storage
    yield call([blockBlobClient, blockBlobClient.uploadData], action.payload.file, {
      blobHTTPHeaders: { 
        blobContentType: action.payload.file.type,
        blobContentDisposition: `attachment; filename="${fileName}"`,
        },
    });

    const fileMetadata: FileMetadataPayload = {
        fileName: action.payload.file.name,
        blobName: sasToken.blobName,
        contentType: action.payload.file.type,
        fileSize: action.payload.file.size.toString(),
        uploadedAt: new Date().toISOString(),
        blobUri: blockBlobClient.url,
        uploadedBy: action.payload.userEmail,
    };

    yield call(uploadFileMetadataApi, fileMetadata);
    yield put(uploadFileSuccess());
    yield put(getFilesFetch(action.payload.userEmail));
  } catch (error: any) {
    yield put(uploadFileFailure(error.message));
  }
};*/

function* uploadFolderSaga(action: PayloadAction<{ uploadFiles: File[], userEmail: string }>): Generator<any, void, SasToken> {
    try {
      for (const file of action.payload.uploadFiles) {
        const sasToken: SasToken = yield call(getSasTokenApi);
        const blockBlobClient = new BlockBlobClient(sasToken.blobUrl);

        yield call([blockBlobClient, blockBlobClient.uploadData], file, {
            blobHTTPHeaders: {
              blobContentType: file.type,
              blobContentDisposition: `inline; filename="${file.name}"`,
            }, 
        });

        const fileMetadata: FileMetadataPayload = {
            fileName: file.name,
            blobName: sasToken.blobName,
            contentType: file.type,
            fileSize: file.size,
            uploadedAt: new Date().toISOString(),
            blobUri: blockBlobClient.url,
            uploadedBy: action.payload.userEmail,
        };
        
        yield call(uploadFileMetadataApi, fileMetadata);

      }
  
        yield put(uploadFileSuccess());
        yield put(getFilesFetch(action.payload.userEmail));
    } catch (error: any) {
      yield put(uploadFileFailure(error.message));
    }
  };
  


//##################################################################################################//


async function getFileMetadataApi(filters: FileFilters) {
    const { userEmail, sortField, sortOrder, searchQuery, pageSize, pageNumber } = filters;
    const data = {
        email: userEmail,
        sortField: sortField,
        sortOrder: sortOrder,
        search: searchQuery,
        pageSize: pageSize,
        pageNumber: pageNumber,
    }

    const response = await fetch('https://localhost:7262/document/get', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error fetching FileMetadata..');
    }

    const files = await response.json();
    return files;
};

function* getFilesSaga(action: PayloadAction<any>): Generator<any, void>{
    try {
      const filters:FileFilters = yield select(fileFilters);
      filters.userEmail = action.payload;
      const response = yield call(getFileMetadataApi, filters);
      const {files, totalPages} = response;
      yield put(getFilesSuccess(files));
      yield put(setTotalPages(totalPages));
    } catch (error) {
      console.error('Files fetch failed..', error);
      yield put(getFilesFailure());
    }
};


//##################################################################################################//


async function getDeleteSasTokenApi(existingBlobName: any) : Promise<SasToken> {
    const data = {blobName: existingBlobName};
    const response = await fetch('https://localhost:7262/document/generateDeleteSasToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Error generating SasToken..');
    }

    const sasToken = await response.json();
    return sasToken;
};

async function deleteFileMartenApi(existingBlobName: any) {
    const data = {blobName: existingBlobName};
    const response = await fetch('https://localhost:7262/document/delete', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Marten delete file metadata failed..');
    }
};

function* deleteEmployeeSaga(action: PayloadAction<{userEmail:string, blobName:string}>): Generator<any, void> {
    try {
        const sasToken: SasToken = yield call(getDeleteSasTokenApi, action.payload.blobName);
        const blockBlobClient = new BlockBlobClient(sasToken.blobUrl);

        yield call([blockBlobClient, blockBlobClient.delete]);

        yield call(deleteFileMartenApi, action.payload.blobName);

        yield put(getFilesFetch(action.payload.userEmail));
        console.log('Deleted file!');
    } catch (error) {
        console.error('Delete file failed..', error);
    }
};


//##################################################################################################//


function* documentSaga() {
    //yield takeLatest(uploadFileRequest.type, uploadFileSaga);
    yield takeLatest(uploadFileRequest.type, uploadFolderSaga);
    yield takeEvery(getFilesFetch.type, getFilesSaga);
    yield takeLatest(deleteFileRequest.type, deleteEmployeeSaga)
};
  
export default documentSaga;