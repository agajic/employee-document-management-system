import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDepartmentFetch } from '../department/departmentSlice';
import { createEmployeeRequested, isCreatingEmployeeOngoing, resetCreateEmployee} from './employeesSlice';
import { RootState } from '../../app/store';
import { Box, TextField, Button, Typography, Select, MenuItem, InputLabel, FormControl, CircularProgress, Card, CardContent } from '@mui/material';
import { useAppSelector } from '../../app/hooks';

interface CreateEmployeePageProps {
    onBack: () => void;
}

const CreateEmployee: React.FC<CreateEmployeePageProps> = ({ onBack }) => {
  const dispatch = useDispatch();

  const departments = useSelector((state: RootState) => state.department.departments);
  const createEmployeeSuccess = useSelector((state: RootState) => state.employee.createSuccess);
  const createEmployeeFailure = useSelector((state: RootState) => state.employee.createFailure);
  const isCreatingEmployee = useAppSelector(isCreatingEmployeeOngoing);

  const [newEmployee, setNewEmployee] = React.useState({
    email: '',
    role: 'Employee' as 'HR' | 'Employee',
    department: '' as string,
  });



  useEffect(() => {
    dispatch(getDepartmentFetch());
  }, [dispatch]);

  // Set default department to the first one in the array once departments are available
  useEffect(() => {  
    if (departments.length > 0) {
      setNewEmployee((prev) => ({
        ...prev,
        department: departments[1].name,
      }));
    }
  }, [departments]);

  useEffect(() => {
    if (createEmployeeSuccess) {
        alert('Employee created successfully!');
        onBack();
    }
    if (createEmployeeFailure) {
        alert('Failed to create employee..');
    }
    dispatch(resetCreateEmployee());
  }, [createEmployeeSuccess, createEmployeeFailure, onBack]);

  

  const handleInputChange = (field: keyof typeof newEmployee, value: string) => {
    setNewEmployee((prev) => {
      if (field === "role" && value ===  "HR") {    // If the role is being updated to "HR", also set the department to "HR"
          return {
          ...prev,
          [field]: value,
          department: "HR",
          };
      }

      return {     // Otherwise, update the field as normal
          ...prev,
          [field]: value,
      };
    });
  };

  const handleCreateEmployee = () => {
    dispatch(createEmployeeRequested(newEmployee));
  };



  return (
    <Card> 
      <CardContent sx={{padding:5}}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        Create New Employee
      </Typography>

      <TextField
        label="Email"
        variant="outlined"
        value={newEmployee.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        sx={{ marginBottom: 2, width: '100%' }}
      />
      <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 2 }}>
        <InputLabel>Role</InputLabel>
        <Select
          value={newEmployee.role}
          onChange={(e) => handleInputChange('role', e.target.value as 'HR' | 'Employee')}
          label="Role"
        >
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="Employee">Employee</MenuItem>
        </Select>
      </FormControl>
      {/* Conditionally render the Department combo box only if the role is not HR */}
      {newEmployee.role !== 'HR' && (
        <FormControl variant="outlined" sx={{ width: '100%', marginBottom: 2 }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={newEmployee.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            label="Department"
          >
            {departments
              .filter((department) => department.name !== 'HR')
              .map((department) => (
              <MenuItem key={department.id} value={department.name}>
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button variant="outlined" onClick={onBack}>
            Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateEmployee}>
            {isCreatingEmployee ? <CircularProgress size={24} /> : "Create"}
        </Button>
      </Box>
      </CardContent>
    </Card> 
  );
};

export default CreateEmployee;
