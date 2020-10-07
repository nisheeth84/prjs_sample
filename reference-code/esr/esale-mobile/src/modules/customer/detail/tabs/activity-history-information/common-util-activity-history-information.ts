import moment from 'moment'
import { TEXT_EMPTY } from '../../../../../config/constants/constants';

export class CommonUtil {
  static formatDateTime = (date: any, format = "YYYY/MM/DD") => {
      if (date) {
        return moment(new Date(date)).format(format);
      }else {
        return '';
      }
  }

  /**
   * Format to price
   * @param num 
   */
  static formatNumber(num: number) {
    if (num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    return TEXT_EMPTY
  }
}