/**
 * Define data structure to show schedule details
 * Refer to sheet [Matrix] of the file [110201_ カ レ ン ダ ー （月 表示） .xlsx]
 */
import { HIGHT_OF_SCHEDULE, AttendanceDivisionType, ParticipationDivisionType } from '../../../constants';
import _ from 'lodash';
import { isNumber } from 'util';
import { EmployeeIdsType, CustomersType, ProductTradingsType } from '../../../api/schedule-list-type';
import { DataOfSchedule } from '../../../api/common';
import { Images } from '../../../config';
import { GetLocalNavigation } from '../../../api/get-local-navigation-type';
import { messages } from '../../../calendar-list-messages';
import { translate } from '../../../../../config/i18n';
import {SignalType, ColorType, BoderType, ViewPermission, PatternType, ColorValue} from "./constant";

export type SignalInfo = {
  type: SignalType; //SignalType

  borderColor: ColorType; //ColorType
  bgColor: ColorType; //ColorType
}

export type BoderInfo = {
  type: BoderType; //BodedType
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
    color: ColorType.None
  },
  signalInfo: {
    bgColor: ColorType.None,
    borderColor: ColorType.None,
    type: SignalType.NotShow
  },
  textColor: ColorType.None
}
const InHourSchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  }
};

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
  bgColor: ColorType.None,
  isDashLine: ViewPermission.Unavailable,
  boderInfo: { type: BoderType.Solid, color: ColorType.Auto }
};
InHourSchedulePlan[ViewPermission.Available][PatternType.DuplicateAndNotConfirmed] = {
  signalInfo: { type: SignalType.Circle, borderColor: ColorType.Auto, bgColor: ColorType.None },
  isViewIcon: ViewPermission.Available,
  isViewTime: ViewPermission.Available,
  isViewtitle: ViewPermission.Available,
  textColor: ColorType.Red,
  bgColor: ColorType.Auto,
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

const NormalSchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  }
};

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

const FullDaySchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  }
};
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

const OverDaySchedulePlan = {
  [ViewPermission.Available]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  },
  [ViewPermission.Unavailable]: {
    [PatternType.Available]: initPattenPlan,
    [PatternType.NotConfirmed]: initPattenPlan,
    [PatternType.Absent]: initPattenPlan,
    [PatternType.Share]: initPattenPlan,
    [PatternType.DuplicateAndAvailable]: initPattenPlan,
    [PatternType.DuplicateAndNotConfirmed]: initPattenPlan
  }
};
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
      schedule.participationDivision === ParticipationDivisionType.AVAILABLE &&
      schedule.attendanceDivision === AttendanceDivisionType.AVAILABLE
    ) {
      return PatternType.DuplicateAndAvailable;
    }
    if (
      schedule['isDuplicate'] &&
      schedule.participationDivision === ParticipationDivisionType.AVAILABLE &&
      schedule.attendanceDivision === AttendanceDivisionType.NOT_CONFIRMED
    ) {
      return PatternType.DuplicateAndNotConfirmed;
    }
    if (schedule.participationDivision === ParticipationDivisionType.SHARE) {
      return PatternType.Share;
    }
    if (
      schedule.participationDivision === ParticipationDivisionType.AVAILABLE &&
      schedule.attendanceDivision === AttendanceDivisionType.AVAILABLE
    ) {
      return PatternType.Available;
    }
    if (
      schedule.participationDivision === ParticipationDivisionType.AVAILABLE &&
      schedule.attendanceDivision === AttendanceDivisionType.NOT_CONFIRMED
    ) {
      return PatternType.NotConfirmed;
    }
    if (
      schedule.participationDivision === ParticipationDivisionType.AVAILABLE &&
      schedule.attendanceDivision === AttendanceDivisionType.ABSENT
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
    const isView = ItemCalendar.isViewDetailSchedule(schedule) ? ViewPermission.Available : ViewPermission.Unavailable;
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
  static getColorOfEmployee = (schedule: DataOfSchedule | number, localNavigation: GetLocalNavigation) => {
    if (
      localNavigation &&
      localNavigation.searchDynamic &&
      localNavigation.searchDynamic.departments
    ) {
      const departments = localNavigation.searchDynamic.departments;
      let employee: any = null;
      let sEmployeeId: any = null;
      if (isNumber(schedule)) {
        sEmployeeId = schedule;
      } else {
        sEmployeeId = schedule.employeeIds && schedule.employeeIds[0] && schedule.employeeIds[0].employeeId;
      }
      sEmployeeId &&
        departments &&
        departments.every((d: any) => {
          if (d.employees) {
            employee = d.employees.find((e: any) => {
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
  static getAllColorOfEmployees = (schedule: DataOfSchedule, localNavigation: GetLocalNavigation): string[] => {
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
    return "";
  };

  /**
   * Get color by ColorType of plan
   * @param colorType ColorType
   * @param schedule DataOfSchedule
   * @param localNavigation localNavigation
   */
  static getColor = (colorType: ColorType, schedule: DataOfSchedule, localNavigation: GetLocalNavigation) => {
    if (colorType === ColorType.Black) return ColorValue.Black;
    if (colorType === ColorType.Red) return ColorValue.Red;
    if (colorType === ColorType.Grey) return ColorValue.Grey;
    if (colorType === ColorType.Auto) {
      return ItemCalendar.getColorOfEmployee(schedule, localNavigation);
    }

    return null; // #85ACDC
  };
  /**
   * @param type: BoderType
   */
  static getBoderType = (type: BoderType) => {
    if (type === BoderType.Solid) {
      return { borderStyle: "solid" };
    }
    if (type === BoderType.Dashed) {
      return { borderStyle: "dashed" };
    }
    return { borderStyle: undefined };
  };

  /**
   * @param type: BoderType
   */
  static getBorderClass = (boderType: BoderType) => {
    if (boderType === BoderType.Dashed) {
      return 'border-dash';
    } else if (boderType === BoderType.Solid) {
      return 'border-solid';
    }

    return;
  };

  static buildBorderStyle = (
    boderType: BoderType, // BoderType
    borderColorType: ColorType, // ColorType
    schedule: DataOfSchedule,
    localNavigation: GetLocalNavigation
  ) => {
    const styleObj = { borderStyle: {}, borderColor: "unset", borderWidth: 1 };
    if (boderType === BoderType.None) return { borderStyle: { borderStyle: "solid" }, borderColor: 'transparent', borderWidth: 1 };
    styleObj.borderStyle = ItemCalendar.getBoderType(boderType);
    if (typeof borderColorType === 'string') {
      styleObj.borderColor = borderColorType;
    } else {
      styleObj.borderColor = ItemCalendar.getColor(borderColorType, schedule, localNavigation);
    }

    return styleObj;
  };
  /**
   * @param type: SignalType
   */
  static getClassSignal = (type: SignalType) => {
    if (type === SignalType.Circle) {
      return Images.schedule.ic_ellipse;
    }
    if (type === SignalType.X) {
      return Images.schedule.ic_close;
    }
    if (type === SignalType.Triangle) {
      return Images.schedule.ic_triangle;
    }
    return '';
  };

  static getTopOfObject = (schedule: DataOfSchedule, hightHeader: number) => {
    return hightHeader + (schedule?.sort || 0) * HIGHT_OF_SCHEDULE;
  };

  static getWidthOfObject = (schedule: DataOfSchedule) => {
    return (schedule?.numOverDay || 0) * 100 + ((schedule?.numOverDay || 0) - 1) * 0.1;
  };

  static getTitleOfSchedule = (schedule: DataOfSchedule) => {
    let title = schedule.itemName;
    const customers: CustomersType[] = (schedule['customers'] || []);
    const productTradings: ProductTradingsType[] = (schedule['productTradings'] || []);
    const aryTitle: string[] = [];
    const findProductOfCustomer = (cusId: any): string[] => {
      const productTradingsName: string[] = [];
      productTradings.forEach(p => {
        if (p.customerId === cusId) productTradingsName.push(p.productName);
      });
      return productTradingsName;
    }

    if (customers && customers.length > 0) {
      customers.forEach((c, index) => {
        const customersName: string[] = [];
        customersName.push(c.customerName);
        const productTradingsName: string[] = findProductOfCustomer(c.customerId);
        if (customers.length == 1) {
          if (productTradingsName.length) {
            customersName.push(productTradingsName.join('、'));
          }
          aryTitle.push('（' + customersName.join('／') + '）');
        }
        if (customers.length > 1 && index == 0) {
          if (productTradingsName.length) {
            const productCount = productTradingsName.length > 1
              ? (translate(messages.other) + (productTradingsName.length - 1) + translate(messages.otherLast))
              : ''
            customersName.push(productTradingsName.join('、') + '...' + productCount)
          }
          aryTitle.push('（' + customersName.join('／') + '）');
        }
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
