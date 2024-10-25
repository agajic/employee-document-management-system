import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, CircularProgress, Card, CardContent, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, InputAdornment, Typography, IconButton, TableSortLabel, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { deleteFileRequest, uploadFileRequest, setSearchQuery, setPageNumber, setSort, uploadFileReset, setPageSize } from "./documentSlice";
import { getFilesFetch } from "./documentSlice";
import { RootState } from "../../app/store";
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderIcon from '@mui/icons-material/Folder';
import VisibilityIcon from '@mui/icons-material/Visibility';

const FileManagePage = () => {
  const dispatch = useDispatch();

  const userEmail = useSelector((state: RootState) => state.auth.user?.email);
  const { loading, success, error, files, 
          sortField, sortOrder, searchQuery, pageNumber, pageSize, totalPages } = useSelector((state: RootState) => state.doc);

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedBlobName, setSelectedBlobName] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(undefined);
  const [selectedBlobUri, setSelectedBlobUri] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const [openViewFileDialog, setViewFileDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    dispatch(getFilesFetch(userEmail));
  }, [dispatch, sortField, sortOrder, pageSize, pageNumber]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(getFilesFetch(userEmail));
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);



  const handleUploadFilesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setUploadFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleSelect = (isFolder: boolean) => {
    dispatch(uploadFileReset());
    if (isFolder && folderInputRef.current) {
      folderInputRef.current.webkitdirectory = true;
      folderInputRef.current.click();
    } else if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = () => {
    if (uploadFiles.length > 0) {
      dispatch(uploadFileRequest({ uploadFiles, userEmail }));
    }
  };

  const handleDeleteClick = (blobName: string) => {
    setSelectedBlobName(blobName);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedBlobName(null);
  };

  const handleDeleteFile = () => {
    if(selectedBlobName){
      dispatch(setPageNumber(1));
      dispatch(deleteFileRequest({userEmail:userEmail, blobName:selectedBlobName}))
    }
    handleCloseDeleteDialog();
  };

  const handleSortChange = (field: any, order: any) => {
    dispatch(setSort({ field, order }));
  };

  const handleSearchChange = (event: any) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handlePageNumberChange = (event: any) => {
    dispatch(setPageNumber(event));
  };  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUploadFiles([]);
    dispatch(uploadFileReset());
  };


  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    const allFiles: File[] = [];
    const promises = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i].webkitGetAsEntry();
      if (item) {
        promises.push(traverseDirectory(item, allFiles));
      }
    }

    await Promise.all(promises);
    setUploadFiles(prevFiles => [...prevFiles, ...allFiles]);
    console.log(allFiles);
  };


  const traverseDirectory = (entry: FileSystemEntry, fileList: File[]) => {
    return new Promise<void>((resolve) => {
      if (entry.isFile) {
        (entry as FileSystemFileEntry).file((file) => {
          fileList.push(file);
          resolve();
        });
      } else if (entry.isDirectory) {
        const directoryReader = (entry as FileSystemDirectoryEntry).createReader();
        directoryReader.readEntries(async (entries) => {
          const subPromises = [];
          for (const subEntry of entries) {
            subPromises.push(traverseDirectory(subEntry, fileList));
          }
          await Promise.all(subPromises);
          resolve();
        });
      }
    });
  };

  const handleOpenViewFileModel = (fileName: string, blobUri: string) => {
    setSelectedFileName(fileName);
    setSelectedBlobUri(blobUri);
    setViewFileDialog(true);
  };

  const handleCloseViewFileModel = () => {
    setViewFileDialog(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
          Manage Files
        </Typography>
        <Card>
            <CardContent sx={{paddingLeft:4, paddingRight:4}}>
                <h2>Your Uploaded Files</h2>

                {loading && <CircularProgress />}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                <Button variant="contained" color="primary" onClick={handleClickOpen} sx={{marginRight:2}}>
                  <CloudUploadIcon sx={{marginRight: 1.4}}></CloudUploadIcon> Upload File
                </Button>
                <TextField
                  placeholder="Search File"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ minWidth: 250, marginBottom: 2 }}
                  size="small">
                </TextField>
                
                {!loading && !error && files.length === 0 && <p>No files found.</p>}
                
                {!loading && !error && files.length > 0 && (
                <TableContainer component={Paper}>
                    <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                              <TableSortLabel
                                active={sortField === 'FileName'}
                                direction={sortField === 'FileName' ? sortOrder : undefined}
                                onClick={() => handleSortChange('FileName', sortOrder === 'asc' ? 'desc' : 'asc')}
                              >
                              File Name
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={sortField === 'ContentType'}
                                direction={sortField === 'ContentType' ? sortOrder : undefined}
                                onClick={() => handleSortChange('ContentType', sortOrder === 'asc' ? 'desc' : 'asc')}
                              >
                              File Type
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={sortField === 'FileSize'}
                                direction={sortField === 'FileSize' ? sortOrder : undefined}
                                onClick={() => handleSortChange('FileSize', sortOrder === 'asc' ? 'desc' : 'asc')}
                              >
                              File Size
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                active={sortField === 'UploadedAt'}
                                direction={sortField === 'UploadedAt' ? sortOrder : undefined}
                                onClick={() => handleSortChange('UploadedAt', sortOrder === 'asc' ? 'desc' : 'asc')}
                              >
                              Uploaded At
                              </TableSortLabel>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((singleFile) => (
                        <TableRow key={singleFile.blobReadUri}>
                            <TableCell>{singleFile.fileName}</TableCell>
                            <TableCell>{singleFile.contentType}</TableCell>
                            <TableCell>{singleFile.fileSize}</TableCell>
                            <TableCell>{singleFile.uploadedAt}</TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginLeft: '10px' }}
                                    onClick={() => window.open(singleFile.blobReadUri, "_blank")}
                                    ><DownloadIcon sx={{marginRight: 1.4}}></DownloadIcon>  Download
                                </Button>
                                <Button variant="contained" color="primary" style={{ marginLeft: '20px' }} onClick={() => handleOpenViewFileModel(singleFile.fileName, singleFile.blobReadUri)}>
                                    <VisibilityIcon />
                                </Button>
                                <Button variant="contained" color="error" style={{ marginLeft: '20px' }} onClick={() => handleDeleteClick(singleFile.blobName)}>
                                    <DeleteIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </TableContainer>
                )}

                

                {!loading && !error && files.length > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'left', marginTop: '16px' }}>    
                    

                    <Button sx={{color:'black', backgroundColor:'transparent', fontWeight: 'bold'}}
                      onClick={() => handlePageNumberChange(pageNumber - 1)}
                      disabled={pageNumber === 1}
                    >
                      &lt;
                    </Button>
        
                    <Typography sx={{ display: 'flex', alignItems: 'center', marginLeft:1, marginRight:1}}>
                      {totalPages === 0 ? 0 : pageNumber}/{totalPages}
                    </Typography>
        
                    <Button sx={{color:'black', backgroundColor:'transparent', fontWeight: 'bold'}}
                      onClick={() => handlePageNumberChange(pageNumber + 1)}
                      disabled={pageNumber === totalPages}
                    >
                      &gt;
                    </Button>

                    <FormControl size="small" variant="outlined" sx={{ width: '100px',  marginLeft: 'auto'}}>
                      <InputLabel>Page Size</InputLabel>
                      <Select
                        value={pageSize}
                        onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
                        label="Page Size"
                    >
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                        <MenuItem value="10">10</MenuItem>
                        <MenuItem value="15">15</MenuItem>
                      </Select>
                    </FormControl>
                </Box>
                )}

            </CardContent>
        </Card>

        <Dialog open={open} onClose={handleClose}>
          <DialogContent>
              <IconButton
                  aria-label="close"
                  onClick={handleClose}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
              </IconButton>
              <CardContent>
                  <h2>Upload a File</h2>

                  <Button variant="outlined" onClick={() => handleSelect(false)} sx={{marginRight:0.5}}>
                    <InsertDriveFileIcon sx={{marginRight:0.7}}></InsertDriveFileIcon>Select File</Button>
                  <Button variant="outlined" onClick={() => handleSelect(true)} sx={{marginRight:1.5}}>
                    <FolderIcon sx={{marginRight:0.7}}></FolderIcon>Select Folder</Button>

                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    style={{ display: 'none' }} 
                    onChange={handleUploadFilesChange}
                  />

                  <input
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    ref={folderInputRef}
                    onChange={handleUploadFilesChange}
                  />


                  <Box
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragLeave={handleDragLeave}
                    sx={{
                      border: isDragging ? '2px dashed #1976d2' : '2px dashed #ccc',
                      backgroundColor: isDragging ? '#ebf4fc' : '#ffffff',
                      transition: 'border-color 0.3s, background-color 0.3s ease',
                      padding: '30px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      marginTop: '15px',
                      marginBottom: '15px',
                    }}
                  >
                    <Typography variant="body1">Drag and drop files here, or click above to select files</Typography>
                  </Box>



                  <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  >
                  {loading ? <CircularProgress size={24} /> : "Upload File"}
                  </Button>

                  {uploadFiles.length > 0 && (
                    <Box style={{ marginTop: '10px' }}>
                      <Typography>
                        {`Selected File${uploadFiles.length > 1 ? 's' : ''}: ${uploadFiles.length}`}
                      </Typography>
                    </Box>
                  )}

                  {error && <p>Error: {error}</p>}
                  {success && (
                  <Typography>
                      {`File${uploadFiles.length > 1 ? 's' : ''} uploaded successfully!`}
                  </Typography>
                  )}

              </CardContent>
          </DialogContent>
        </Dialog>

        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete File</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete the file?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button onClick={handleDeleteFile} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        
        <Dialog
              open={openViewFileDialog}
              onClose={handleCloseViewFileModel}
              fullWidth
              maxWidth="lg"
        >
              <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {selectedFileName}
                  <IconButton
                      edge="end"
                      color="inherit"
                      onClick={handleCloseViewFileModel}
                      aria-label="close"
                      style={{  marginLeft: 'auto' }}
                  >
                      <CloseIcon />
                  </IconButton>
              </DialogTitle>
              <DialogContent dividers >
                  <iframe
                      src={selectedBlobUri}
                      width="100%"
                      height="500px"
                      title="File Viewer"
                      style={{ border: 'none', overflow: 'hidden' }}
                  />
              </DialogContent>
        </Dialog>

    </Box>
  );
};

export default FileManagePage;
