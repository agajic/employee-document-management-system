import { call, takeEvery, delay, put } from 'redux-saga/effects';
import { activityFailed, activityRequested, activitySucceeded } from './activitySlice';


async function sendActivityUpdateApi(){
    const response = await fetch('https://localhost:7262/update-activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    
      if (!response.ok) {
        throw new Error('Activity update failed');
      }
}


function* sendActivityUpdateSaga() {
    try {
        yield call(sendActivityUpdateApi);
        console.log("Activity updated!!")
        yield put(activitySucceeded());
    } catch (error) {
        console.error("Failed to update activity..", error);
        yield put(activityFailed());
    }
}

function* activityWatcher() {
    while (true) {
        yield delay(1 * 60 * 1000); // Every 1 minute
        yield put(activityRequested());
    }
}

function* activitySaga() {
    yield takeEvery(activityRequested.type, sendActivityUpdateSaga);
    yield activityWatcher();
}

export default activitySaga;
