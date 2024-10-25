import { call, put, takeEvery } from 'redux-saga/effects';
import { getDepartmentFetch, getDepartmentSuccess } from './departmentSlice';

function* getAllDepartmentsSaga(): Generator<any, void>{
    try {
      const departments = yield call(()=> fetch('https://localhost:7262/departments'));
      const formattedDepartments = yield departments.json();
      yield put(getDepartmentSuccess(formattedDepartments));
    } catch (error) {
      console.error('Departments fetch failed..', error);
    }
  }

function* departmentSaga() {
  yield takeEvery(getDepartmentFetch.type, getAllDepartmentsSaga);  
}

export default departmentSaga;
  