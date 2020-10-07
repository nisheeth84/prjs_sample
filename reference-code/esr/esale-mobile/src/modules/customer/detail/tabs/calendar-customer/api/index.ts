import axios from 'axios';

// https://esms-dev.softbrain.com/services/schedules/api/get-data-for-calendar-by-list
const baseUrl = 'https://esms-dev.softbrain.com/services/schedules/api/';
const GET_DATA_FOR_CALENDAR_BY_LIST = 'get-data-for-calendar-by-list';
const GET_DATA_FOR_CALENDER_BY_DAY = 'get-data-for-calendar-by-day';

/**
 * call api get by list
 * @param param
 */
export const getDataApiForByList = async (token: string, param: any) => {
  console.log("getDataApiForByList -> token: string, param: any", token, param)
  try {
    console.log('call success')
    return await axios.post(baseUrl + GET_DATA_FOR_CALENDAR_BY_LIST, param, {
      headers: {
        ['Content-Type']: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log('call error')
    return error;
  }
};

/**
 * call api get by day
 * @param param
 */
export const getDataApiForByDay = async (token: string, param: any) => {
  console.log("getDataApiForByDay -> token: string, param: any", token, param)
  try {
    return await axios.post(baseUrl + GET_DATA_FOR_CALENDER_BY_DAY, param, {
      headers: {
        ['Content-Type']: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return error;
  }
};
