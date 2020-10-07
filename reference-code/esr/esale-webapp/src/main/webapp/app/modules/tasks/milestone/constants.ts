export const MILES_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const TIMEOUT_TOAST_MESSAGE = 2000;

export const MILES_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const STATUS_MILESTONE = {
  TODO: 0,
  FINISH: 1
};

export const MILES_UPDATE_FLG = {
  ONE: 1,
  TWO: 2
};

export const BADGES = {
  maxBadges: 99
};

export const TAB_ID_LIST = {
  summary: '0',
  changeHistory: '2'
};

export const LICENSE = {
  TIMELINE_LICENSE: 3,
  CUSTOMER_LICENSE: 5,
  ACTIVITIES_LICENSE: 6
};

export const JAPAN_LANGUAGE_ID = 'ja_jp';
export const ENGLISH_LANGUAGE_ID = 2;
export const CHINA_LANGUAGE_ID = 3;

export const PARAM_GET_LIST_MILESTONE = () => {
  return `query{
    getMilestones{
      milestones{
          milestoneId,
          milestoneName
      },
      countMilestone
  }
  }`;
};
