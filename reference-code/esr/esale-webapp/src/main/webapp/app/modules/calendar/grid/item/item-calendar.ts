/**
 * Define data structure to show schedule details
 * Refer to sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
 */
import { DataOfSchedule } from '../common';
import {
  LocalNavigation,
  HIGHT_OF_SCHEDULE,
  AttendanceDivisionType,
  ParticipationDivisionType
} from '../../constants';
import _ from 'lodash';
import { isNumber } from 'util';
import {
  EmployeeIdsType,
  CustomersType,
  ProductTradingsType
} from '../../models/schedule-list-type';
import { translate } from 'react-jhipster';

export const enum ViewPermission {
  Unavailable = 0,
  Available = 1
}

export const enum SignalType {
  NotShow,
  Circle,
  X,
  Triangle
}

export const enum BoderType {
  /**
   * No border
   */
  None,
  Solid,
  Dashed
}

export const enum ColorType {
  /**
   * No color
   */
  None,
  /**
   * Use color Of employee
   */
  Auto,
  Black,
  Red,
  Grey
}

export const ColorValue = {
  Black: '#333',
  Red: 'red',
  Grey: '#e5e5e5',
  Default: '#85ACDC'
};

export const TaskStatus = {
  regular: '00',
  completed: '01',
  overdue: '02'
};

export const TaskMilestone = {
  regular: '00',
  completed: '01',
  overdue: '02'
};

export const enum PatternType {
  None,
  NotConfirmed,
  Available,
  Absent,
  Share,
  DuplicateAndAvailable,
  DuplicateAndNotConfirmed,
  ReportActivity
}

export type SignalInfo = {
  type: SignalType;

  borderColor: ColorType;
  bgColor: ColorType;
};

export type BoderInfo = {
  type: BoderType;
  color: ColorType;
};

export type PatternPlan = {
  signalInfo: SignalInfo;
  isViewIcon: ViewPermission;
  isViewTime: ViewPermission;
  isViewtitle: ViewPermission;
  isDashLine: ViewPermission;

  textColor: ColorType;
  bgColor: ColorType;

  boderInfo: BoderInfo;
};

const InHourSchedulePlan = {};
InHourSchedulePlan[ViewPermission.Available] = {};
InHourSchedulePlan[ViewPermission.Unavailable] = {};

// Refer to No2.1: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
InHourSchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: { type: SignalType.X, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Available][PatternType.Share] = {
  signalInfo: { type: SignalType.Triangle, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Available][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Available][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};

// ✘: Not allowed to see details
InHourSchedulePlan[ViewPermission.Unavailable][PatternType.Available] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Unavailable][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Unavailable][PatternType.Absent] = {
  signalInfo: { type: SignalType.X, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Unavailable][PatternType.Share] = {
  signalInfo: { type: SignalType.Triangle, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Red,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};

const NormalSchedulePlan = {};
NormalSchedulePlan[ViewPermission.Available] = {};
NormalSchedulePlan[ViewPermission.Unavailable] = {};

// Refer to No2.1: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
NormalSchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: { type: SignalType.X, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Available][PatternType.Share] = {
  signalInfo: { type: SignalType.Triangle, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Available][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Available][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};

// ✘: Not allowed to see details
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.Available] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.Absent] = {
  signalInfo: { type: SignalType.X, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.Share] = {
  signalInfo: { type: SignalType.Triangle, borderColor: ColorType.None, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.Auto },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None }
};

const FullDaySchedulePlan = {};
FullDaySchedulePlan[ViewPermission.Available] = {};
FullDaySchedulePlan[ViewPermission.Unavailable] = {};
// Refer to No2.2: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
FullDaySchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.Share] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};

// ✘: Not allowed to see details
FullDaySchedulePlan[ViewPermission.Unavailable][PatternType.Available] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Unavailable][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Unavailable][PatternType.Absent] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Unavailable][PatternType.Share] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
FullDaySchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};

const OverDaySchedulePlan = {};
OverDaySchedulePlan[ViewPermission.Available] = {};
OverDaySchedulePlan[ViewPermission.Unavailable] = {};
// Refer to No2.3: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
OverDaySchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Available][PatternType.Share] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Available][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Available][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};

// ✘: Not allowed to see details
OverDaySchedulePlan[ViewPermission.Unavailable][PatternType.Available] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Unavailable][PatternType.NotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Unavailable][PatternType.Absent] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Unavailable][PatternType.Share] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndAvailable] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
OverDaySchedulePlan[ViewPermission.Unavailable][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.NotShow, borderColor: ColorType.None, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};

export class ItemCalendar {
  /**
   * Check view detail
   * @returns ViewPermission
   */
  static isViewDetailSchedule = (schedule: DataOfSchedule) => {
    return schedule.isParticipantUser || schedule.isPublic;
  };

  /**
   * Get pattern of schedule
   * @returns PatternType
   */
  static getPatternTypeSchedule = (schedule: DataOfSchedule) => {
    if (
      schedule['isDuplicate'] &&
      schedule.participationDivision === ParticipationDivisionType.Available &&
      schedule.attendanceDivision === AttendanceDivisionType.Available
    ) {
      return PatternType.DuplicateAndAvailable;
    }
    if (
      schedule['isDuplicate'] &&
      schedule.participationDivision === ParticipationDivisionType.Available &&
      schedule.attendanceDivision === AttendanceDivisionType.NotConfirmed
    ) {
      return PatternType.DuplicateAndNotConfirmed;
    }
    if (schedule.participationDivision === ParticipationDivisionType.Share) {
      return PatternType.Share;
    }
    if (
      schedule.participationDivision === ParticipationDivisionType.Available &&
      schedule.attendanceDivision === AttendanceDivisionType.Available
    ) {
      return PatternType.Available;
    }
    if (
      schedule.participationDivision === ParticipationDivisionType.Available &&
      schedule.attendanceDivision === AttendanceDivisionType.NotConfirmed
    ) {
      return PatternType.NotConfirmed;
    }
    if (
      schedule.participationDivision === ParticipationDivisionType.Available &&
      schedule.attendanceDivision === AttendanceDivisionType.Absent
    ) {
      return PatternType.Absent;
    }

    return PatternType.None;
  };

  /**
   * Get plan view of schedule
   * @returns PatternPlan
   */
  static getPlanOfSchedule = (schedule: DataOfSchedule, modeInHour?: boolean) => {
    const isView = ItemCalendar.isViewDetailSchedule(schedule)
      ? ViewPermission.Available
      : ViewPermission.Unavailable;
    let type = ItemCalendar.getPatternTypeSchedule(schedule);
    if (type === PatternType.None) {
      type = PatternType.NotConfirmed;
    }

    let plan: PatternPlan;
    if (modeInHour) {
      plan = _.cloneDeep(InHourSchedulePlan[isView][type]);
    } else if (schedule.isFullDay) {
      plan = _.cloneDeep(FullDaySchedulePlan[isView][type]);
    } else if (schedule.isOverDay) {
      plan = _.cloneDeep(OverDaySchedulePlan[isView][type]);
    } else {
      plan = _.cloneDeep(NormalSchedulePlan[isView][type]);
    }

    if (plan && schedule.isReportActivity) {
      plan.bgColor = ColorType.Grey;
    }

    return plan;
  };

  /**
   * Get color of employee
   */
  static getColorOfEmployee = (
    schedule: DataOfSchedule | number,
    localNavigation: LocalNavigation
  ) => {
    if (
      localNavigation &&
      localNavigation.searchConditions &&
      localNavigation.searchConditions.searchDynamic &&
      localNavigation.searchConditions.searchDynamic.departments
    ) {
      const departments = localNavigation.searchConditions.searchDynamic.departments;
      let employee = null;
      let sEmployeeId = null;
      if (isNumber(schedule)) {
        sEmployeeId = schedule;
      } else {
        sEmployeeId =
          schedule.employeeIds && schedule.employeeIds[0] && schedule.employeeIds[0].employeeId;
      }
      sEmployeeId &&
        departments &&
        departments.every(d => {
          if (d.employees) {
            employee = d.employees.find(e => {
              return e.employeeId === sEmployeeId;
            });
            if (employee) return false; // stop loop every
          }
          return true;
        });
      if (employee) {
        return employee.color || ColorValue.Default;
      }

      return ColorValue.Default;
    }
  };

  /**
   * Get all color of employees in Milestone
   */
  static getAllColorOfEmployees = (
    schedule: DataOfSchedule,
    localNavigation: LocalNavigation
  ): string[] => {
    const listColors: string[] = [];
    if (schedule.employeeIds) {
      schedule.employeeIds.forEach((ids: EmployeeIdsType) =>
        listColors.push(ItemCalendar.getColorOfEmployee(ids.employeeId, localNavigation))
      );
    }
    return listColors;
  };

  /**
   * Create linear-gradient
   * Ext: background: linear-gradient(90deg, #f8f8f8, #f59f5d, #3cec4e, #5c6af1);
   */
  static getLinearGradient = (listColors: string[]): string => {
    if (listColors && listColors.length === 1) return listColors[0];
    if (listColors) {
      return 'linear-gradient(90deg, ' + listColors.join(',') + ')';
    }

    return null;
  };

  /**
   * Get color by ColorType of plan
   */
  static getColor = (
    colorType: ColorType,
    schedule: DataOfSchedule,
    localNavigation: LocalNavigation
  ) => {
    if (colorType === ColorType.Black) return ColorValue.Black;
    if (colorType === ColorType.Red) return ColorValue.Red;
    if (colorType === ColorType.Grey) return ColorValue.Grey;
    if (colorType === ColorType.Auto) {
      return ItemCalendar.getColorOfEmployee(schedule, localNavigation);
    }

    return null; // #85ACDC
  };

  static getBoderType = (type: BoderType) => {
    if (type === BoderType.Solid) {
      return 'solid ';
    }
    if (type === BoderType.Dashed) {
      return 'dashed ';
    }

    return null;
  };

  static getBorderClass = (boderType: BoderType) => {
    if (boderType === BoderType.Dashed) {
      return 'border-dash';
    } else if (boderType === BoderType.Solid) {
      return 'border-solid';
    }

    return;
  };

  static buildBorderStyle = (
    boderType: BoderType,
    borderColorType: ColorType | string,
    schedule: DataOfSchedule,
    localNavigation?: LocalNavigation
  ) => {
    const styleObj = { borderStyle: null, borderColor: null, borderWidth: '1px' };
    if (boderType === BoderType.None)
      return { borderStyle: 'solid', borderColor: 'transparent', borderWidth: '1px' };
    styleObj.borderStyle = ItemCalendar.getBoderType(boderType);
    if (typeof borderColorType === 'string') {
      styleObj.borderColor = borderColorType;
    } else {
      styleObj.borderColor = ItemCalendar.getColor(borderColorType, schedule, localNavigation);
    }

    return styleObj;
  };

  static getClassSignal = (type: SignalType) => {
    if (type === SignalType.Circle) {
      return 'icon-circle';
    }
    if (type === SignalType.X) {
      return 'icon-delete';
    }
    if (type === SignalType.Triangle) {
      return 'icon-triangle';
    }
    return '';
  };

  static getTopOfObject = (schedule: DataOfSchedule, hightHeader: number) => {
    return hightHeader + schedule.sort * HIGHT_OF_SCHEDULE;
  };

  static getWidthOfObject = (schedule: DataOfSchedule) => {
    return schedule.numOverDay * 100 + (schedule.numOverDay - 1) * 0.1;
  };

  static getTitleOfSchedule = (schedule: DataOfSchedule) => {
    let title = schedule.itemName;
    const customers: CustomersType[] = schedule['customers'];
    const productTradings: ProductTradingsType[] = schedule['productTradings'];
    const aryTitle: string[] = [];
    const findProductOfCustomer = (cusId: any): string[] => {
      const productTradingsName: string[] = [];
      if (productTradings && productTradings.length) {
        productTradings.forEach(p => {
          if (p.productName) productTradingsName.push(p.productName);
        });
      }
      return productTradingsName;
    };
    if (customers && customers.length > 0) {
      customers.forEach(c => {
        const customersName: string[] = [];
        customersName.push(c.customerName);
        const productTradingsName: string[] = findProductOfCustomer(c.customerId);

        if (productTradingsName.length) {
          customersName.push('／');
          if (productTradingsName.length === 1) {
            customersName.push(productTradingsName.join('、'));
          } else {
            const otherTitle = translate('calendars.commons.moreOther', {
              numMore: productTradingsName.length - 1
            });
            const productName = productTradingsName[0] + '…' + otherTitle;
            customersName.push(productName);
          }
        }

        aryTitle.push('（' + customersName.join('') + '）');
      });
    }
    if (aryTitle.length > 0) {
      title += aryTitle.join('');
    }
    return title;
  };

  /**
   * Check view detail
   * @returns ViewPermission
   */
  static isViewDetailTask = (schedule: DataOfSchedule) => {
    return schedule.isParticipantUser || schedule.isPublic;
  };

  /**
   * Check view detail
   * @returns ViewPermission
   */
  static isViewDetailMilestone = (schedule: DataOfSchedule) => {
    return schedule.isParticipantUser || schedule.isPublic;
  };
}
