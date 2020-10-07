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
  nationalHolidayName?: any;
  isNationalHoliday?: any;
};
export const JSON_STRINGIFY = (s: any) => {
  return JSON.stringify(typeof s === 'undefined' ? null : s).replace(/"(\w+)"\s*:/g, '$1:');
};

export const PARAM_VALIDATE_TASK = (taskId: number, startDate: string, finishDate: Date) => {
  return `{validateTask(tasksId: ${taskId}, startDate: "${moment(startDate)
    .utc()
    .format()}", finishDate: "${moment(finishDate)
    .utc()
    .format()}")}`;
};

/**
 * Class Common build data
 */
export class CommonUtils {
  /**
   *
  objectToFormData
  */
  public static objectToFormData(obj, rootName, ignoreList): FormData {
    const formData = new FormData();

    function ignore(root) {
      return (
        Array.isArray(ignoreList) &&
        ignoreList.some(function(x) {
          return x === root;
        })
      );
    }

    /**
     * append data to form
     * @param data
     * @param root
     */
    function appendFormData(data, root) {
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

  /**
   * convertData
   */
  public static convertData(data: any): any {
    // console.log('convertData2');
    if (typeof data === typeof {}) {
      return CommonUtils.convertDataObject(data);
    } else if (typeof data === typeof []) {
      return CommonUtils.convertDataArray(data);
    }
    return data;
  }

  /**
   * convert To FormData multiPart request post
   */
  public static convertFormFile(dataPost: any): FormData {
    const filteredData = CommonUtils.convertData(dataPost);
    const formData = CommonUtils.objectToFormData(filteredData, '', []);
    return formData;
  }

  /**
   * convertDataObject
   * param data
   */
  public static convertDataObject(data: any): {} {
    if (data) {
      for (const key in data) {
        if (!(data[key] instanceof File)) {
          data[key] = CommonUtils.convertData(data[key]);
        }
      }
    }
    return data;
  }

  /**
   * convert data array
   * @param data
   */
  public static convertDataArray(data: Array<any>): Array<any> {
    if (data && data.length > 0) {
      data.forEach((e, index) => {
        data[index] = CommonUtils.convertData(e);
      });
    }
    return data;
  }

  /**
   * convert boolean
   * @param value
   */
  public static convertBoolean(value: boolean): number {
    return value ? 1 : 0;
  }
}
