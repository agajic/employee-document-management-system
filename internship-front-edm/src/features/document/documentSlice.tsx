import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReadFileMetadataPayload } from "./documentModel";

interface UploadFilePayload {
  uploadFiles: File[];
  userEmail: string | undefined;
}
interface FileUploadState {
  files: ReadFileMetadataPayload[];
  fetchingFiles: boolean;
  loading: boolean;
  success: boolean;
  error: string | null;
  blobUri: string;
  sortField: 'FileName' | 'ContentType' | 'FileSize' | 'UploadedAt' | undefined;
  sortOrder: 'asc' | 'desc' | undefined;
  searchQuery: string;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const initialState: FileUploadState = {
  files: [],
  fetchingFiles: false,
  loading: false,
  success: false,
  error: null,
  blobUri: "",
  sortField: 'UploadedAt',
  sortOrder: 'desc',
  searchQuery: "",
  pageNumber: 1,
  pageSize: 5,
  totalPages: 0,
};

const fileUploadSlice = createSlice({
  name: "doc",
  initialState,
  reducers: {
    uploadFileRequest: (state, action: PayloadAction<UploadFilePayload>) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    uploadFileSuccess: (state) => {
      state.loading = false;
      state.success = true;
      //state.blobUri = action.payload;
    },
    uploadFileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadFileReset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    getFilesFetch: (state, action: PayloadAction<any>) =>{
      state.fetchingFiles = true;
    },
    getFilesSuccess: (state, action) =>{
      state.files = action.payload;
      state.fetchingFiles = false;
    },
    getFilesFailure: (state) =>{
      state.fetchingFiles = false;
    },
    deleteFileRequest: (state, action: PayloadAction<{userEmail:any,blobName:any}>) =>{
    },
    setSort: (
      state,
      action: PayloadAction<{ field: 'FileName' | 'ContentType' | 'FileSize' | 'UploadedAt'; order: 'asc' | 'desc' }>
    ) => {
      state.sortField = action.payload.field;
      state.sortOrder = action.payload.order;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
  },
});

export const {
  uploadFileRequest, uploadFileSuccess, uploadFileFailure, uploadFileReset,
  getFilesFetch, getFilesSuccess, getFilesFailure,
  deleteFileRequest,
  setSort, setSearchQuery, setPageNumber, setPageSize, setTotalPages,
} = fileUploadSlice.actions;

export default fileUploadSlice.reducer;
