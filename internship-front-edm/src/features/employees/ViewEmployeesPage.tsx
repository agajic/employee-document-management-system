import React, { useMemo, useState } from 'react';
import { useEffect } from 'react';
import { deleteEmployeeRequest, editEmployeeRequest, getEmployeesFetch, setPageNumber, setPageSize } from './employeesSlice';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Typography,
  Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText,
  InputAdornment,
  TableSortLabel,
  CardContent,
  Card,
  IconButton,
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import {
  Employee,
  setFilterRole,
  setFilterDepartment,
  setSort,
  setSearchQuery,
} from './employeesSlice';
import EditEmployee from './EditEmployeePage';
import CreateEmployee from './CreateEmployeePage';

const ViewEmployeesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const departments = useSelector((state: RootState) => state.department.departments);
  const user = useSelector((state: RootState) => state.auth.user);
  const {
    employees,
    filterRole,
    filterDepartment,
    sortField,
    sortOrder,
    searchQuery,
    pageSize,
    pageNumber,
    totalPages,
  } = useSelector((state: RootState) => state.employee);
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [selectedEmployeeEmail, setSelectedEmployeeEmail] = useState<string | null>(null);


  useEffect(() => {
    dispatch(getEmployeesFetch());
  }, [dispatch, filterRole, filterDepartment, searchQuery, sortField, sortOrder, pageSize, pageNumber]);

  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(getEmployeesFetch());
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);



  const handleRoleFilterChange = (event: any) => {
    dispatch(setFilterRole(event.target.value));
  };

  const handleDepartmentFilterChange = (event: any) => {
    dispatch(setFilterDepartment(event.target.value));
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


  const handleDeleteClick = (email: string) => {
    setSelectedEmployeeEmail(email);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedEmployeeEmail(null);
  };

  const handleDeleteEmployee = () => {
    if(selectedEmployeeEmail){
      dispatch(deleteEmployeeRequest(selectedEmployeeEmail))
      //dispatch(getEmployeesFetch());
    }
    handleCloseDeleteDialog();
  };

  const handleEditClick = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEditing(true); 
  };

  const handleSaveEmployee = (employee: any) => {
    dispatch(editEmployeeRequest(employee));
    setIsEditing(false); 
    //dispatch(getEmployeesFetch());
  };

  const handleBackClick = () => {
    setIsEditing(false);
    setIsCreating(false); 
  };

  const handleCreateClick = () => {
    setIsCreating(true); 
  };


  
  function Row(props: { row: ReturnType<any> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
  
    return (
      <React.Fragment>
        <TableRow sx={{  '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.email}
          </TableCell>
          <TableCell>{row.role}</TableCell>
          <TableCell>{row.department}</TableCell>
          {user?.role !== 'Employee' && (
                <TableCell>
                  <Button variant="contained" sx={{ marginRight: 1 }} onClick={() => handleEditClick(row)}>
                      <EditIcon />
                  </Button>
                  <Button variant="contained" color="error"  onClick={() => handleDeleteClick(row.email)}>
                      <DeleteIcon />
                  </Button>
                </TableCell>
          )}

        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold' }}>
                  {row.email}
                </Typography>
                <Table size="small" aria-label="purchases" sx={{marginBottom:2}}>
                  <TableHead>
                    <TableRow sx={{backgroundColor: '#f0f0f0'}}>
                      <TableCell sx={{ fontWeight: 'bold' }}>First Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Last Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Work Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>

                      <TableRow>
                        <TableCell component="th" scope="row">
                          {row.firstName}
                        </TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{row.phoneNumber}</TableCell>
                        <TableCell>{row.workLocation}</TableCell>
                      </TableRow>

                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }



  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        {user?.role !== 'Employee' ? 'Manage Employees' : 'View Employees'}
      </Typography>
      <Card>
      <CardContent sx={{paddingLeft:4, paddingRight:4}}>

      <h2>List of Employees</h2>

      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <FormControl variant="outlined" sx={{ minWidth: 150 }} size="small">
          <InputLabel>Filter by Role</InputLabel>
          <Select value={filterRole} onChange={handleRoleFilterChange} label="Filter by Role">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" sx={{ minWidth: 150 }} size="small">
          <InputLabel>Filter by Department</InputLabel>
          <Select value={filterDepartment} onChange={handleDepartmentFilterChange} label="Filter by Department">
          <MenuItem value="All">All</MenuItem>
          {departments
              .filter((department) => department.name !== 'HR')
              .map((department) => (
                <MenuItem key={department.id} value={department.name}>
                {department.name}
              </MenuItem>
              ))}
          </Select>
        </FormControl>
              
        <TextField
          placeholder="Search Employee"
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
          size="small"
          sx={{ minWidth: 250 }}
        />

      <Box sx={{ flexGrow: 1 }}></Box>
      {user?.role !== 'Employee' && (
      <Button variant="contained" startIcon={<PersonAddIcon/>} onClick={() => handleCreateClick()}>
        Create New Employee
      </Button>)}

      </Box>


      {/*#######################################################################################################################*/}


      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell></TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={sortField === 'email'}
                    direction={sortField === 'email' ? sortOrder : undefined}
                    onClick={() => handleSortChange('email', sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                  Email
                  </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={sortField === 'role'}
                    direction={sortField === 'role' ? sortOrder : undefined}
                    onClick={() => handleSortChange('role', sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                  Role
                  </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                      active={sortField === 'department'}
                      direction={sortField === 'department' ? sortOrder : undefined}
                      onClick={() => handleSortChange('department', sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                  Department
                  </TableSortLabel>
              </TableCell>
              {user?.role !== 'Employee' && ( <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell> )}
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <Row key={employee.email} row={employee} />
            ))}
            {/*
            {employees.map((employee) => (

              <TableRow key={employee.email}>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>{employee.department}</TableCell>
                {user?.role !== 'Employee' && (
                <TableCell>
                  <Button variant="contained" sx={{ marginRight: 1 }} onClick={() => handleEditClick(employee)}>
                      <EditIcon />
                  </Button>
                  <Button variant="contained" color="error"  onClick={() => handleDeleteClick(employee.email)}>
                      <DeleteIcon />
                  </Button>
                </TableCell>
                )}
              </TableRow>
            ))}
              */}
          </TableBody>
          </Table>
        </TableContainer>

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
      </CardContent>
      </Card>
        {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the employee with the email <strong>{selectedEmployeeEmail}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteEmployee} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog open={isCreating} onClose={handleBackClick}>
        <DialogContent>
          <CreateEmployee onBack={handleBackClick} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditing} onClose={handleBackClick}>
        <DialogContent>
        <EditEmployee
          employee={selectedEmployee}
          onSave={handleSaveEmployee}
          onBack={handleBackClick}
        />
        </DialogContent>
      </Dialog>

    </Box>
); };

export default ViewEmployeesPage;
