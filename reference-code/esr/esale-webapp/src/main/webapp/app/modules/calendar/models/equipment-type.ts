import { GetSchedule } from 'app/modules/calendar/models/get-schedule-type';
import moment from 'moment';
import { CalenderViewMonthCommon } from '../grid/common';

/**
 * NVL
 * @param value
 * @param valueDefault
 */
const NVL = (value: any, valueDefault?: any) => {
  return value === undefined ? (valueDefault === undefined ? null : valueDefault) : value;
};

export const CHECK_DUPLICATED_EQUIPMENTS = (schedule, scheduleId, updateFlag, equipments) => {
  return {
    schedule: {
      startDay: NVL(
        moment(schedule['startDate']).format('YYYY/MM/DD'),
        moment(CalenderViewMonthCommon.nowDate().toDate()).format('YYYY/MM/DD')
      ),
      endDay: NVL(
        moment(schedule['endDate']).format('YYYY/MM/DD'),
        moment(CalenderViewMonthCommon.nowDate().toDate()).format('YYYY/MM/DD')
      ),
      isRepeated: NVL(schedule['isRepeated']),
      repeatCondition: {
        repeatType: NVL(schedule['repeatType']),
        repeatCycle: NVL(schedule['repeatCycle']),
        regularDayOfWeek: NVL(schedule['regularDayOfWeek']),
        regularWeekOfMonth: NVL(schedule['regularWeekOfMonth']),
        regularDayOfMonth: NVL(schedule['regularDayOfMonth']),
        regularEndOfMonth: NVL(schedule['regularEndOfMonth']),
        repeatEndType: NVL(schedule['repeatEndType']),
        repeatEndDate: NVL(schedule['repeatEndDate']),
        repeatNumber: NVL(schedule['repeatNumber'])
      }
    },
    scheduleId: NVL(scheduleId),
    updateFlag: NVL(updateFlag),
    equipments:
      Array.isArray(equipments) &&
      equipments.map(item => {
        return {
          equipmentId: NVL(item.equipmentId),
          startTime: NVL(
            moment(schedule['startTime']).format('HH:mm:ss'),
            moment(CalenderViewMonthCommon.nowDate().toDate()).format('HH:mm:ss')
          ),
          endTime: NVL(
            moment(schedule['endTime']).format('HH:mm:ss'),
            moment(CalenderViewMonthCommon.nowDate().toDate()).format('HH:mm:ss')
          )
        };
      })
  };
};

export const UPDATE_SCHEDULE_EQUIPMENT_DRAG = (schedule: GetSchedule) => {
  return `
  mutation {
    updateSchedule(
      schedule: {
        scheduleId: ${NVL(schedule['scheduleId'])},
        updateFlag: ${NVL(schedule['updateFlag'])},
        scheduleTypeId: ${NVL(schedule['scheduleTypeId'])},
        scheduleName: ${NVL(schedule['scheduleName'])},
        startDay: ${NVL(
          moment(schedule['startDate']).format('YYYY/MM/DD'),
          moment(CalenderViewMonthCommon.nowDate().toDate()).format('YYYY/MM/DD')
        )},
        endDay: ${NVL(
          moment(schedule['endDate']).format('YYYY/MM/DD'),
          moment(CalenderViewMonthCommon.nowDate().toDate()).format('YYYY/MM/DD')
        )},
        startTime: ${NVL(
          moment(schedule['startDate']).format('HH:MM'),
          moment(CalenderViewMonthCommon.nowDate().toDate()).format('HH:MM')
        )},
        endTime: ${NVL(
          moment(schedule['endDate']).format('HH:MM'),
          moment(CalenderViewMonthCommon.nowDate().toDate()).format('HH:MM')
        )},
        equipments: ,
      }
    )
  }
  `;
};
