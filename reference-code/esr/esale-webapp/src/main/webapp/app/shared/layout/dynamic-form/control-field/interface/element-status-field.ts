export interface IElementStatusField {
  key?: string | any; // key of control (primarily is field id)
  fieldValue?: string | any; // value input control
  isSearchBlank?: boolean; // only search mode if search with null value
  searchType?: string | number; // only search mode if search required (AND, OR)
  searchOption?: string | number; // only search mode if search required (LIKE, EQUAL)
  searchModeDate?: number; // only control date time
  dateFrom?: string | any; // only control date time
  dateTo?: string | any; // only control date time
  // monthFrom?: string | any; // only control date time
  // dayFrom?: string | any; // only control date time
  // monthTo?: string | any; // only control date time
  // dayTo?: string | any; // only control date time
  monthDayFrom?: string | any;
  monthDayTo?: string | any;
  numberDateBeforeAfterFrom?: number | string; // only control date time
  numberDateBeforeAfterTo?: number | string; // only control date time
  numberDateBeforeAfterMode?: number; // only control date time
  numberDateBeforeFrom?: number | string; // only control date time
  numberDateBeforeTo?: number | string; // only control date time
  numberDateBeforeMode?: number; // only control date time
  numberDateAfterFrom?: number | string; // only control date time
  numberDateAfterTo?: number | string; // only control date time
  numberDateAfterMode?: number; // only control date time
  numberMonthBeforeAfterFrom?: number | string; // only control date time
  numberMonthBeforeAfterTo?: number | string; // only control date time
  numberMonthBeforeAfterMode?: number; // only control date time
  numberYearBeforeAfterFrom?: number | string; // only control date time
  numberYearBeforeAfterTo?: number | string; // only control date time
  numberYearBeforeAfterMode?: number; // only control date time
  datetimeDayFrom?: number | string; // only control date time
  datetimeDayTo?: number | string; // only control date time
  datetimeTimeFrom?: number | string; // only control date time
  datetimeTimeTo?: number | string; // only control date time
  timeFrom?: string; // only control date time
  timeTo?: string; // only control date time
  sortAsc?: boolean; // only filter and sort
  sortDesc?: boolean; // only filter and sort
  valueFilter?: string | any; // only filter
  filterModeDate?: number; // only filter date
}
