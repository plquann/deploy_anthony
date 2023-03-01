import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DispatchType } from '../configStore';
import { http } from '../../util/config';


export interface LstTask {
    lstTaskDeTail: LstTaskDeTail[];
    statusId:      string;
    statusName:    string;
    alias:         string;
}

export interface LstTaskDeTail {
    priorityTask:          PriorityTask;
    taskTypeDetail:        TaskTypeDetail;
    assigness:             Assigness[];
    lstComment:            any[];
    taskId:                number;
    taskName:              string;
    alias:                 string;
    description:           string;
    statusId:              string;
    originalEstimate:      number;
    timeTrackingSpent:     number;
    timeTrackingRemaining: number;
    typeId:                number;
    priorityId:            number;
    projectId:             number;
}

export interface Assigness {
    id:     number;
    avatar: string;
    name:   string;
    alias:  string;
}

export interface TaskTypeDetail {
    id:       number;
    taskType: string;
}

export interface TaskStatus {
    statusId:   string;
    statusName: string;
    alias:      string;
    deleted:    string;
}
export interface PriorityTask {
    priorityId:  number;
    priority:    string;
    description?: string;
    deleted?:     boolean;
    alias?:       string;
}
export interface Comment {
    user:           User;
    id:             number;
    userId:         number;
    taskId:         number;
    contentComment: string;
    deleted:        boolean;
    alias:          string;
  } 
  
  export interface User {
    userId: number;
    name:   string;
    avatar: string;
  }

/////////////////////////////////////////////////////
export interface TaskState {
    arrTaskStatus: TaskStatus[];  
    arrPriority: PriorityTask[];
    arrTaskType: TaskTypeDetail[];
    arrComment: Comment[];
}

///////////////////////////////////////////////////////

const initialState:TaskState = {
    arrTaskStatus: [],
    arrPriority: [],
    arrTaskType: [],
    arrComment: [],
}

const taskReducer = createSlice({
  name: 'taskReducer',
  initialState,
  reducers: {
    getTaskStatusAction: (state:TaskState, action:PayloadAction<TaskStatus[]>) => {
        state.arrTaskStatus = action.payload;
    },
    getPriorityAction: (state:TaskState, action:PayloadAction<PriorityTask[]>) => {
        state.arrPriority = action.payload;
    },
    getTaskTypeAction: (state:TaskState, action:PayloadAction<TaskTypeDetail[]>) => {
        state.arrTaskType = action.payload;
    },
    getCommentAction: (state:TaskState, action:PayloadAction<Comment[]>) => {
        state.arrComment = action.payload;
    }
}
});

export const {getTaskStatusAction, getPriorityAction, getTaskTypeAction, getCommentAction} = taskReducer.actions

export default taskReducer.reducer

/////////////////////////////////////////////////////////////

export const getTaskStatusApi = () => {

    return async (dispatch: DispatchType) => {
        const result = await http.get('/Status/getAll');
        const action:PayloadAction<TaskStatus[]> = getTaskStatusAction(result.data.content);
        dispatch(action);
    }
}

export const getPriorityApi = () => {

    return async (dispatch: DispatchType) => {
        const result = await http.get('/Priority/getAll');
        const action:PayloadAction<PriorityTask[]> = getPriorityAction(result.data.content);
        dispatch(action);
    }
}

export const getTaskTypeApi = () => {

    return async (dispatch: DispatchType) => {
        const result = await http.get('/TaskType/getAll');
        const action:PayloadAction<TaskTypeDetail[]> = getTaskTypeAction(result.data.content);
        dispatch(action);
    }
}

export const getCommentApi = (taskId:number) => {

    return async (dispatch: DispatchType) => {
        const result = await http.get(`/Comment/getAll?taskId=${taskId}`);
        const action:PayloadAction<Comment[]> = getCommentAction(result.data.content);
        dispatch(action);
    }
}

