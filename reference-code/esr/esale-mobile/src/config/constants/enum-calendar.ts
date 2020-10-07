export enum ViewPermission {
  Unavailable = 0,
  Available = 1,
}

export enum SignalType {
  NotShow = 1,
  Circle = 2,
  X = 3,
  Triangle = 4,
}

export enum BoderType {
  /**
   * No border
   */
  None = 0,
  Solid = 1,
  Dashed = 2,
}

export enum ColorType {
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
  Grey,
}
export enum ColorValue {
  Black = '#333',
  Red = 'red',
  Grey = '#e5e5e5',
  Default = '#85ACDC',
}

export enum TaskStatus {
  regular = '00',
  completed = '01',
  overdue = '02',
}

export enum TaskMilestone {
  regular = '00',
  completed = '01',
  overdue = '02',
}

export enum PatternType {
  None,
  NotConfirmed,
  Available,
  Absent,
  Share,
  DuplicateAndAvailable,
  DuplicateAndNotConfirmed,
  ReportActivity,
}
