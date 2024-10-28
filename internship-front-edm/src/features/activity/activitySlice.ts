import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { ActionStatus } from '../login/authSlice';


interface ActivityState {
  activityStatus: ActionStatus;
}

const initialState: ActivityState = {
  activityStatus: ActionStatus.Idle,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    activityRequested: (state) => {
      state.activityStatus = ActionStatus.Pending;
    },                    
    activitySucceeded: (state) => { 
      state.activityStatus = ActionStatus.Idle;
    },
    activityFailed: (state) => {
      state.activityStatus = ActionStatus.Failed;
    },
  },
});


export const { 
  activityRequested, activitySucceeded, activityFailed, } = activitySlice.actions;
export default activitySlice.reducer;