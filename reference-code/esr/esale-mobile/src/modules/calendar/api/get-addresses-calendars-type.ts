/**
 * Define data structure for API getAddressesCalendars
 **/

type SchedulesType = {
  scheduleId?: any;
  address?: any;
};
export type GetAddressesCalendars = {
  schedules?: SchedulesType[];
};
