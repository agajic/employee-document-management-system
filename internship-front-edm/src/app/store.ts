import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/login/authSlice';
import employeeReducer from '../features/employees/employeesSlice';
import departmentReducer from '../features/department/departmentSlice';
import documentReducer from '../features/document/documentSlice';
import createSagaMiddleware from 'redux-saga';
import authSaga from '../features/login/authSaga';
import employeesSaga from '../features/employees/employeesSaga';
import departmentSaga from '../features/department/departmentSaga';
import documentSaga from '../features/document/documentSaga';


const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    employee: employeeReducer,
    department: departmentReducer,
    doc: documentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["doc/uploadFileRequest"],  // Ignore actions that are non-serializable, such as file uploads
        ignoredPaths: ["doc.blobUri"],              // You can also ignore the check for specific paths in the state
      },
    }).concat(sagaMiddleware),
});
sagaMiddleware.run(authSaga);
sagaMiddleware.run(employeesSaga);
sagaMiddleware.run(departmentSaga);
sagaMiddleware.run(documentSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;