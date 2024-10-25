import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { useEffect } from 'react';
import { getDepartmentFetch } from '../department/departmentSlice';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import { useAppSelector } from '../../app/hooks';
import { isEditingEmployeeOngoing } from './employeesSlice';

interface Employee {
  email: string;
  newEmail: string;
  role: 'HR' | 'Employee';
  department: 'HR' | '';
}

interface EditEmployeeProps {
  employee: Employee;
  onSave: (employee: Employee) => void;
  onBack: () => void;
}

const EditEmployee: React.FC<EditEmployeeProps> = ({ employee, onSave, onBack }) => {
  const dispatch = useDispatch();

  const departments = useSelector((state: RootState) => state.department.departments);
  const isEditingEmployee = useAppSelector(isEditingEmployeeOngoing);

  const [editedEmployee, setEditedEmployee] = React.useState<Employee>({
    ...employee,
    newEmail: employee.email
  });
  const [openSaveDialog, setOpenSaveDialog] = React.useState(false);



  useEffect(() => {
    dispatch(getDepartmentFetch());
  }, [dispatch]);



  const handleInputChange = (field: keyof Employee, value: string) => {
    setEditedEmployee((prev) => {
      if (field === "role" && value ===  "HR") { // If the role is being updated to "HR", also set the department to "HR"
          return {
          ...prev,
          [field]: value,
          department: "HR",
          };
      }

      return {    // Otherwise, update the field as normal
          ...prev,
          [field]: value,
      };
    });
  };
  
  const handleSaveClick = () => {
    setOpenSaveDialog(true); 
  };

  const handleCloseSaveDialog = () => {
    setOpenSaveDialog(false);
  };

  const handleConfirmSave = () => {
    onSave(editedEmployee);
    setOpenSaveDialog(false); 
  };


  
  return (
    <Card> 
      <CardContent sx={{padding:5}}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Edit Employee
      </Typography>
      <TextField
        label="Email (Read-Only)"
        variant="outlined"
        value={editedEmployee.email}
        InputProps={{ readOnly: true }}
        sx={{ marginBottom: 2, width: '100%' }}
      />
      <TextField
        label="Email (Editable)"
        variant="outlined"
        value={editedEmployee.newEmail}
        onChange={(e) => handleInputChange('newEmail', e.target.value)}
        sx={{ marginBottom: 2, width: '100%' }}
      />
      <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={editedEmployee.role}
          onChange={(e) => handleInputChange('role', e.target.value as 'HR' | 'Employee')}
          label="Role"
        >
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Employee">Employee</MenuItem>
        </Select>
      </FormControl>
      {editedEmployee.role !== 'HR' && (
      <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 2 }}>
        <InputLabel>Department</InputLabel>
        <Select
          value={editedEmployee.department}
          onChange={(e) => handleInputChange('department', e.target.value)}
          label="Department"
        >
          {departments
            .filter((department) => department.name !== 'HR')
            .map((department) => (
              <MenuItem key={department.name} value={department.name}>
                {department.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleSaveClick}>
          Save
        </Button>
      </Box>

      {/* Save Confirmation Dialog */}
      <Dialog open={openSaveDialog} onClose={handleCloseSaveDialog}>
        <DialogTitle>Save Changes</DialogTitle>
        <DialogContent>Are you sure you want to save these changes?</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog}>Cancel</Button>
          <Button onClick={handleConfirmSave} color="primary">
              {isEditingEmployee ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      </CardContent>
    </Card>
  );
};

export default EditEmployee;
