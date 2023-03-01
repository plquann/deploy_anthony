import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DispatchType } from '../configStore';
import { http } from '../../util/config';

export interface ProjectModel {
    members:      Member[];
    creator:      Creator;
    id:           number;
    projectName:  string;
    description:  string;
    categoryId?:   string;
    categoryName: string;
    alias:        string;
    deleted:      boolean;
}

export interface Category {
    id:                  number;
    projectCategoryName: string;
}

///////////////////////////////////////////////////
export interface ProjectDetail {
    lstTask:         LstTask[];
    members:         Member[];
    creator:         Creator;
    id:              number;
    projectName:     string;
    description:     string;
    projectCategory: Creator;
    alias:           string;
}

export interface Creator {
    id:   number;
    name: string;
}

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

export interface PriorityTask {
    priorityId: number;
    priority:   string;
}

export interface TaskTypeDetail {
    id:       number;
    taskType: string;
}

export interface Member {
    userId:      number;
    name:        string;
    avatar:      string;
    email:       string;
    phoneNumber: string;
}
/////////////////////////////////////////////////////
export interface ProjectState {
    arrProject: ProjectModel[];
    arrCategory: Category[];
    project: ProjectModel | null;
    projectDetail: ProjectDetail | null;
}

///////////////////////////////////////////////////////

const initialState:ProjectState = {
    arrProject: [],
    arrCategory: [],
    project: null,
    projectDetail: null
}

const projectReducer = createSlice({
  name: 'projectReducer',
  initialState,
  reducers: {
    getProjectAction: (state:ProjectState, action:PayloadAction<ProjectModel[]>) => {
        state.arrProject = action.payload;
    },
    getCategoryAction: (state:ProjectState, action:PayloadAction<Category[]>) => {
        state.arrCategory = action.payload;
    },
    setProject: (state:ProjectState, action:PayloadAction<ProjectModel>) => {
        state.project = action.payload;
    },
    getProjectDetailAction: (state:ProjectState, action:PayloadAction<ProjectDetail>) => {
        state.projectDetail = action.payload;
    },
  }
});

export const {getProjectAction, getCategoryAction, setProject, getProjectDetailAction} = projectReducer.actions

export default projectReducer.reducer

/////////////////////////////////////////////////////////////

export const getProjectApi = () => {

    return async (dispatch: DispatchType) => {
        const result = await http.get('/Project/getAllProject');
        const action:PayloadAction<ProjectModel[]> = getProjectAction(result.data.content);
        dispatch(action);
    }
}

export const getCategoryApi = () => {

    return async (dispatch: DispatchType) => {
        const result = await http.get('/ProjectCategory');
        const action:PayloadAction<Category[]> = getCategoryAction(result.data.content);
        dispatch(action);
    }
}

export const getProjectDetailApi = (num: number) => {

    return async (dispatch: DispatchType) => {
        const result = await http.get(`/Project/getProjectDetail?id=${num}`);
        const action:PayloadAction<ProjectDetail> = getProjectDetailAction(result.data.content);
        dispatch(action);
    }
}