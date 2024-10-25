import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActionStatus } from '../login/authSlice';
import { RootState } from '../../app/store';

interface Employee {
  email: string;
  role: 'HR' | 'Employee';
  department: 'HR' | 'FrontDev' | 'BackDev' | 'Security';
}

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  filterRole: 'HR' | 'Employee' | 'All';
  filterDepartment: 'HR' | 'FrontDev' | 'BackDev' | 'Security' | 'All';
  sortField: 'role' | 'department' | 'email' | undefined;
  sortOrder: 'asc' | 'desc' | undefined;
  searchQuery: string;
  pageNumber: number;
  totalPages: number;
  editStatus: ActionStatus;
  createStatus: ActionStatus;
  createSuccess: boolean;
  createFailure: boolean;
}

const initialState: EmployeeState = {
  employees: [],
  isLoading: false,
  filterRole: 'All',
  filterDepartment: 'All',
  sortField: 'role',
  sortOrder: 'desc',
  searchQuery: '',
  pageNumber: 1,
  totalPages: 0,
  editStatus: ActionStatus.Idle,
  createStatus: ActionStatus.Idle,
  createSuccess: false,
  createFailure: false,
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    getEmployeesFetch: (state) =>{
      state.isLoading = true;
    },
    getEmployeesSuccess: (state, action) =>{
      state.employees = action.payload;
      state.isLoading = false;
    },
    getEmployeesFailure: (state) =>{
      state.isLoading = false;
    },
    setFilterRole: (state, action: PayloadAction<any>) => {
      state.filterRole = action.payload;
    },
    setFilterDepartment: (
      state,
      action: PayloadAction<any>
    ) => {
      state.filterDepartment = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<{ field: any; order: any }>
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
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    createEmployeeRequested: (state, action: PayloadAction<any>) =>{
      state.createStatus = ActionStatus.Pending;
    },
    createEmployeeSuccess: (state) =>{
      state.createSuccess = true;
      state.createStatus = ActionStatus.Idle;
    },
    createEmployeeFailure: (state) =>{
      state.createFailure = true;
      state.createStatus = ActionStatus.Failed;
    },
    resetCreateEmployee: (state) =>{
      state.createSuccess = false;
      state.createFailure = false;
    },
    editEmployeeRequest: (state, action: PayloadAction<any>) =>{
      state.editStatus = ActionStatus.Pending;
    },
    editEmployeeSuccess: (state) =>{
      state.editStatus = ActionStatus.Idle;
    },
    editEmployeeFailure: (state) =>{
      state.editStatus = ActionStatus.Failed;
    },
    deleteEmployeeRequest: (state, action: PayloadAction<string>) =>{
    },
  },
});



export const isCreatingEmployeeOngoing = (state: RootState) => state.employee.createStatus === ActionStatus.Pending;
export const isEditingEmployeeOngoing = (state: RootState) => state.employee.editStatus === ActionStatus.Pending;

export const { 
  getEmployeesFetch, getEmployeesSuccess, getEmployeesFailure, 
  setFilterRole, setFilterDepartment, setSort, setSearchQuery, setPageNumber, setTotalPages,
  createEmployeeRequested, createEmployeeSuccess, createEmployeeFailure, resetCreateEmployee,
  editEmployeeRequest, editEmployeeSuccess, editEmployeeFailure, deleteEmployeeRequest 
} = employeeSlice.actions;

export default employeeSlice.reducer;
