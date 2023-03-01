import {configureStore} from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import projectReducer from './reducers/projectReducer';
import taskReducer from './reducers/taskReducer';

export const store = configureStore({
    reducer:{
        userReducer,
        projectReducer,
        taskReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export type DispatchType = typeof store.dispatch;

