export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  CreatUpdateSuccess
}

export const PARTICIPANT_TYPE = {
  VIEWER: 1,
  OWNER: 2
};

export const GROUP_TYPE = {
  MY: 1,
  SHARED: 2
};

export const GROUP_MODE_SCREEN = {
  // actions with group
  CREATE: 1,
  EDIT: 2,
  COPY: 3,
  CREATE_LOCAL: 4,
  SWITCH_TYPE: 5
};

export const GROUP_MODE = {
  // setting mode add condition search employee
  MANUAL: 1,
  AUTO: 2
};

/**
 * Member permision
 */
export const CLASS_NAME_AREA = {
  WRAP: {
    MY_AND_MANUAL: 'popup-esr2 popup-esr3 popup-employee-height-auto',
    DEFAULT: 'modal popup-esr popup-esr4 user-popup-page popup-align-right wrap-employee show'
  },
  FORM: {
    MY_AND_MANUAL: 'popup-esr2-content',
    DEFAULT: 'modal-dialog form-popup'
  },
  CONTENT: {
    MY_AND_MANUAL: 'popup-esr2-body',
    DEFAULT: 'modal-body style-3 fix-tag-auto-width-720'
  }
};
