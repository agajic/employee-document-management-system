import { createSlice } from '@reduxjs/toolkit';

interface Department {
  id: string;
  name: string;
};

interface DepartmentState {
    departments: Department[];
    isLoading: boolean;
};

const initialState: DepartmentState = {
    departments: [],
    isLoading: false
};

const departmentSlice = createSlice({
  name: 'department',
  initialState,
  reducers: {
    getDepartmentFetch: (state) =>{
      state.isLoading = true;
    },
    getDepartmentSuccess: (state, action) =>{
      state.departments = action.payload;
      state.isLoading = false;
    },
    getDepartmentFailure: (state) =>{
      state.isLoading = false;
    },
  },
});

export const { getDepartmentFetch, getDepartmentSuccess, getDepartmentFailure} = departmentSlice.actions;

export default departmentSlice.reducer;
