export const TASK_STATUS = {
  TODO: 1,
  DOING: 2,
  COMPLETE: 3
}

export const LIMIT_EMPLOYEES_AVATAR_DISPLAY = 3;

export const LIMIT_TASK_PER_PAGE = 20;

export enum MODE_LOAD_DATA {
  LoadMore,
  Reload
}

export const TYPE_DELETE_TASK= {
  DELETE_ONE: 1,
  DELETE_ALL: 2,
  DELETE_AND_CONVERT: 3
}

export const STATUS_UPDATE_FLG = {
  DOING: 5,
  COMPLETE_ONE_TASK: 2,
  COMPLETE_TASK_AND_SUBTASKS: 3,
  COMPLETE_TASK_AND_CONVERT_SUBTASKS: 4,
  TODO: 1
}

export const STATUS_CALL_API = {
  SUCCESS: 200
}