import moment from 'moment';
import _ from 'lodash';

export type ApiHeaderDayType = {
  date?: any;
  dateByDay?: any;
  perpetualCalendar?: any;
  holidayName?: any;
  isWeekend?: any;
  isHoliday?: any;
  companyHolidayName?: any;
  isCompanyHoliday?: any;
  isNationalHoliday?:any;
  nationalHolidayName?:any

};
export const JSON_STRINGIFY = (s: any) => {
  return JSON.parse(JSON.stringify(typeof s === 'undefined' ? null : s).replace(/"(\w+)"\s*:/g, '$1:'));
};

export const PARAM_VALIDATE_TASK = (taskId: number, startDate: string, finishDate: Date) => {
  return `{validateTask(tasksId: ${taskId}, startDate: "${moment(startDate)
    .utc()
    .format()}", finishDate: "${moment(finishDate)
      .utc()
      .format()}")}`;
};

/** Common END**/
/**
 * convert boolean
 * @param value
 */
export const convertBoolean = (value: boolean) => {
  return value ? 1 : 0;
}
export const convertBooleanString = (value: boolean) => {
  return value ? 'true' : 'false';
}
/**
 * convert To FormData multiPart request post
 */
export const convertFormFile = (dataPost: any) => {
  const filteredData = convertData(dataPost);
  const formData = objectToFormData(filteredData, '', []);
  return formData;
}

/**
 * convertData
 */
export const convertData = (data: any) => {
  if (typeof data === typeof {}) {
    return convertDataObject(data);
  } else if (typeof data === typeof []) {
    return convertDataArray(data);
  } else if (typeof data === typeof true) {
    return convertBoolean(data);
  }
  return data;
}

/**
 * convertDataObject
 * param data
 */
export const convertDataObject = (data: any) => {
  if (data) {
    for (const key in data) {
      if (!(data[key] instanceof File)) {
        data[key] = convertData(data[key]);
      }
    }
  }
  return data;
}

/**
 * convert data array
 * @param data
 */
export const convertDataArray = (data: Array<any>) => {
  if (data && data.length > 0) {
    data.forEach((e, index) => {
      data[index] = convertData(e);
    });
  }
  return data;
}

/**
* 
objectToFormData
*/
export const objectToFormData = (obj: any, rootName: any, ignoreList: any) => {
  const formData = new FormData();

  function ignore(root: any) {
    return (
      Array.isArray(ignoreList) &&
      ignoreList.some(function (x) {
        return x === root;
      })
    );
  }

  /**
   * append data to form
   * @param data
   * @param root
   */
  function appendFormData(data: any, root: any) {
    if (!ignore(root)) {
      root = root || '';
      if (data instanceof File) {
        formData.append(root, data);
      } else if (Array.isArray(data)) {
        let index = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i] instanceof File) {
            appendFormData(data[i], root + '[' + index + ']');
            index++;
          } else {
            appendFormData(data[i], root + '[' + i + ']');
          }
        }
      } else if (data && typeof data === 'object') {
        for (const key in data) {
          if (_.has(data, key)) {
            if (root === '') {
              appendFormData(data[key], key);
            } else {
              appendFormData(data[key], root + '.' + key);
            }
          }
        }
      } else {
        if (data !== null && typeof data !== 'undefined') {
          formData.append(root, data);
        }
      }
    }
  }

  appendFormData(obj, rootName);
  return formData;
}