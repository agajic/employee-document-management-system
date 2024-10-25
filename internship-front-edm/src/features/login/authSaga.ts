import { call, put, takeLatest } from 'redux-saga/effects';
import { loginFailed, logoutSuccess, loginRequested, logoutRequested, loginSucceeded, checkAuthRequested, checkAuthFailed } from './authSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload, User } from './authModel';

async function loginApi(credentials: LoginPayload): Promise<User> {
    const response = await fetch('https://localhost:7262/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const user = await response.json();
    return user;
};

function* loginSaga(action: PayloadAction<LoginPayload>): Generator<any, void, User> {
  try {
    const user: User = yield call(loginApi, action.payload);
    yield put(loginSucceeded(user));
  } catch (error) {
    yield put(loginFailed())
    console.error('Login failed..', error);
  }
};


async function checkAuthApi(): Promise<User> {
  const response = await fetch('https://localhost:7262/check-auth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Not logged in..');
  }

  const user = await response.json();
  return user;
};


function* checkAuthSaga(): Generator<any, void, User> {
  try {
    const user: User = yield call(checkAuthApi);
    yield put(loginSucceeded(user));
  } catch (error) {
    yield put(checkAuthFailed())
    console.error('Auth failed..', error);
  }
}





function* logoutSaga(): Generator<any, void, Response> {
  try {
    const response: Response = yield call(()=> 
      fetch('https://localhost:7262/logout',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }));

    if (!response.ok) {
      throw new Error(`Logout failed with status: ${response.status}`);
    }

    yield put(logoutSuccess());
    console.log('Logged out!');
  } catch (error) {
    console.error('Logout failed..', error);
  }
}




function* authSaga() {
  yield takeLatest(loginRequested.type, loginSaga);  
  yield takeLatest(logoutRequested.type, logoutSaga);
  yield takeLatest(checkAuthRequested.type, checkAuthSaga)
}

export default authSaga;
  