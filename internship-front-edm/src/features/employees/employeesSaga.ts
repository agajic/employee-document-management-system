import { call, put, all, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { getEmployeesSuccess, createEmployeeSuccess, createEmployeeFailure, deleteEmployeeRequest, createEmployeeRequested, editEmployeeRequest, getEmployeesFetch, setTotalPages, setPageNumber, editEmployeeSuccess, editEmployeeFailure } from './employeesSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface EmployeeFilters {
    filterRole: string;
    filterDepartment: string;
    sortField: string;
    sortOrder: string;
    searchQuery: string;
    pageNumber: number;
};

const employeeFIlters = (state: RootState) => ({
    filterRole: state.employee.filterRole,
    filterDepartment: state.employee.filterDepartment,
    sortField: state.employee.sortField,
    sortOrder: state.employee.sortOrder,
    searchQuery: state.employee.searchQuery,
    pageNumber: state.employee.pageNumber,
});

interface CreateEmployeePayload {
    email: string;
    role: string;
    department: string;
}

interface DeleteEmployeePayload{
    email: string;
}

interface EditEmployeePayload{
    email: string;
    newEmail: string;
    role: string;
    department: string;
}


//##################################################################################################//


async function getAllEmployeesApi(filters: EmployeeFilters) {
    const { filterRole, filterDepartment, sortField, sortOrder, searchQuery, pageNumber } = filters;
    const query = {
        role: filterRole,
        department: filterDepartment,
        sortBy: sortField,
        sortOrder: sortOrder,
        search: searchQuery,
        pageNumber: pageNumber,
    }

    const response = await fetch('https://localhost:7262/employees', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(query),
    });

    if (!response.ok) {
        throw new Error('Marten create employee failed..');
    }

    const employees = await response.json();
    return employees;
};

function* getAllEmployeesSaga(): Generator<any, void>{
    try {
      const filters:EmployeeFilters = yield select(employeeFIlters);
      const response = yield call(getAllEmployeesApi, filters);
      const {employees, totalPages} = response;
      yield put(getEmployeesSuccess(employees));
      yield put(setTotalPages(totalPages));
    } catch (error) {
      console.error('Employees fetch failed..', error);
    }
};


//##################################################################################################//


async function createEmployeeIdentityApi(info: CreateEmployeePayload) {
    const data = {email: info.email, role: info.role};
    const response = await fetch('https://localhost:7262/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Identity create employee failed..');
    }
};

async function createEmployeeMartenApi(info: CreateEmployeePayload) {
    const response = await fetch('https://localhost:7262/employee/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    });

    if (!response.ok) {
        throw new Error('Marten create employee failed..');
    }
};

function* createEmployeeSaga(action: PayloadAction<CreateEmployeePayload>): Generator<any, void> {
    try {
        yield all([
            call(createEmployeeIdentityApi, action.payload),
            call(createEmployeeMartenApi, action.payload)
        ])
        yield put(createEmployeeSuccess());
        yield put(getEmployeesFetch());
    } catch (error) {
        console.error('Create employee failed..', error);
        yield put(createEmployeeFailure());
    }
};


//##################################################################################################//


async function deleteEmployeeIdentityApi(info: DeleteEmployeePayload) {
    const data = {email:info}
    const response = await fetch('https://localhost:7262/delete-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Identity delete employee failed..');
    }
};

async function deleteEmployeeMartenApi(info: DeleteEmployeePayload) {
    const data = {email:info}
    const response = await fetch('https://localhost:7262/employee/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Marten delete employee failed..');
    }
};

function* deleteEmployeeSaga(action: PayloadAction<DeleteEmployeePayload>): Generator<any, void> {
    try {
        yield all([
            call(deleteEmployeeIdentityApi, action.payload),
            call(deleteEmployeeMartenApi, action.payload)
        ])
        yield put(getEmployeesFetch());
        console.log('Deleted employee!');
    } catch (error) {
        console.error('Delete employee failed..', error);
    }
};


//##################################################################################################//


async function editEmployeeIdentityApi(info: EditEmployeePayload) {
    const response = await fetch('https://localhost:7262/edit-user', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    });

    if (!response.ok) {
        throw new Error('Identity edit employee failed..');
    }
};

async function editEmployeeMartenApi(info: EditEmployeePayload) {
    const response = await fetch('https://localhost:7262/employee/edit', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(info),
    });

    if (!response.ok) {
        throw new Error('Marten edit employee failed..');
    }
};

function* editEmployeeSaga(action: PayloadAction<EditEmployeePayload>): Generator<any, void> {
    try {
        yield all([
            call(editEmployeeIdentityApi, action.payload),
            call(editEmployeeMartenApi, action.payload)
        ])
        yield put(getEmployeesFetch());
        yield put(editEmployeeSuccess());
        console.log('Employee edited!');
    } catch (error) {
        console.error('Edit employee failed..', error);
        yield put(editEmployeeFailure());
    }
};


//##################################################################################################//


function* employeesSaga() {
  yield takeEvery(getEmployeesFetch.type, getAllEmployeesSaga);
  yield takeLatest(createEmployeeRequested.type, createEmployeeSaga)
  yield takeLatest(deleteEmployeeRequest.type, deleteEmployeeSaga);
  yield takeLatest(editEmployeeRequest.type, editEmployeeSaga);
}

export default employeesSaga;
  