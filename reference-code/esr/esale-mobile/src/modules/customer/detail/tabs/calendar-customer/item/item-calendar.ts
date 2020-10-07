/**
 * Define data structure to show schedule details
 * Refer to sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
 */

import _ from 'lodash';
import { DataOfSchedule } from '../type';
import { SignalType, ColorType, BoderType, ViewPermission, PatternType } from '../../../../../../config/constants/enum-calendar';
import { ParticipationDivisionType, AttendanceDivisionType } from '../../../../../../config/constants/calendar';

export type SignalInfo = {
  type: SignalType; //SignalType

  borderColor: ColorType; //ColorType
  bgColor: ColorType; //ColorType
};

export type BoderInfo = {
  type: BoderType; //BoderType
  color: ColorType; //ColorType
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

const initPattenPlan: PatternPlan = {
  isDashLine: ViewPermission.Unavailable,
  isViewIcon: ViewPermission.Unavailable,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Unavailable,
  bgColor: ColorType.None,
  boderInfo: {
    type: BoderType.None,
    color: ColorType.None,
  },
  signalInfo: {
    bgColor: ColorType.None,
    borderColor: ColorType.None,
    type: SignalType.NotShow,
  },
  textColor: ColorType.None,
};
const InHourSchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
};

// Refer to No2.1: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
InHourSchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};
InHourSchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};
InHourSchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: {
    type: SignalType.X,
    borderColor: ColorType.None,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};

const NormalSchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
};

// Refer to No2.1: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
NormalSchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: {
    type: SignalType.X,
    borderColor: ColorType.None,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Available][PatternType.Share] = {
  signalInfo: {
    type: SignalType.Triangle,
    borderColor: ColorType.None,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Available][
  PatternType.DuplicateAndAvailable
] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Available][
  PatternType.DuplicateAndNotConfirmed
] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};

// ✘: Not allowed to see details
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.Available] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.NotConfirmed] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.Absent] = {
  signalInfo: {
    type: SignalType.X,
    borderColor: ColorType.None,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Unavailable][PatternType.Share] = {
  signalInfo: {
    type: SignalType.Triangle,
    borderColor: ColorType.None,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Unavailable][
  PatternType.DuplicateAndAvailable
] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.Auto,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};
NormalSchedulePlan[ViewPermission.Unavailable][
  PatternType.DuplicateAndNotConfirmed
] = {
  signalInfo: {
    type: SignalType.Circle,
    borderColor: ColorType.Auto,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Unavailable,
  textColor: ColorType.Red,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.None, color: ColorType.None },
};

const FullDaySchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
};
// Refer to No2.2: sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
// ○: Allowed to see details
FullDaySchedulePlan[ViewPermission.Available][PatternType.Available] = {
  signalInfo: {
    type: SignalType.NotShow,
    borderColor: ColorType.None,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.NotConfirmed] = {
  signalInfo: {
    type: SignalType.NotShow,
    borderColor: ColorType.None,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.Absent] = {
  signalInfo: {
    type: SignalType.NotShow,
    borderColor: ColorType.None,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Available,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};
FullDaySchedulePlan[ViewPermission.Available][PatternType.Share] = {
  signalInfo: {
    type: SignalType.NotShow,
    borderColor: ColorType.None,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Dashed, color: ColorType.Auto },
};
FullDaySchedulePlan[ViewPermission.Available][
  PatternType.DuplicateAndAvailable
] = {
  signalInfo: {
    type: SignalType.NotShow,
    borderColor: ColorType.None,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.Auto,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};
FullDaySchedulePlan[ViewPermission.Available][
  PatternType.DuplicateAndNotConfirmed
] = {
  signalInfo: {
    type: SignalType.NotShow,
    borderColor: ColorType.None,
    bgColor: ColorType.None,
  },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Unavailable,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Black,
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto },
};

const OverDaySchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan,
  },
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
  static getPlanOfSchedule = (
    schedule: DataOfSchedule,
    modeInHour?: boolean
  ) => {
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
   * Check view detail
   * @returns ViewPermission
   */
  static isViewDetailMilestone = (schedule: DataOfSchedule) => {
    return schedule.isParticipantUser || schedule.isPublic;
  };
}
