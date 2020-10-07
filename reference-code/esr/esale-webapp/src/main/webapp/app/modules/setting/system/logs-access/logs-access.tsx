import React, { useState, useEffect, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { SHOW_MESSAGE } from '../../constant';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { translate } from 'react-jhipster';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import DatePicker from 'app/shared/layout/common/date-picker';
import dateFnsFormat from 'date-fns/format';
import { APP_DATE_FORMAT_ES } from 'app/config/constants';
import { convertDateTimeFromTz } from 'app/shared/util/date-utils';
import {
  getAccessLogs,
  exportAccessLogs,
  reset
} from "./logs-access.reducer";

import {
  getFieldsInfo
} from "app/shared/reducers/dynamic-field.reducer";
import { GET_LOG_ACCESS } from 'app/modules/employees/constants';
import { SETTING_BELONG, ACCESS_LOG } from 'app/modules/setting/constant';

export interface LogAccessProps extends StateProps, DispatchProps {
  customFieldInfos: any;
  fieldInfos: any;
}

export const LogAccessses = (props: LogAccessProps) => {

  const prefix = 'dynamic-control.fieldFilterAndSearch.layoutDateTime.';
  const userFormatDate = APP_DATE_FORMAT_ES;
  const tableListRef = useRef(null);
  const [limit, setLimit] = useState(5);
  const [searchText, setSearchText] = useState("");
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  const currentDay = (today.getFullYear()) + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + (("0" + today.getDate()).slice(-2));
  const tomorrowDay = (tomorrow.getFullYear()) + '-' + ("0" + (tomorrow.getMonth() + 1)).slice(-2) + '-' + (("0" + tomorrow.getDate()).slice(-2));
  const [datetimeDayTo, setDatetimeDayTo] = useState(tomorrow);
  const [datetimeDayFrom, setDatetimeDayFrom] = useState(today);
  const [accessLog, setAccessLog] = useState({
    dateFrom: currentDay,
    dateTo: tomorrowDay,
    searchLocal: null,
    limit: 5,
    offset: 0,
    isInitialInfo: true,
    filterConditions: [],
    orderBy: [],
    isDefaultSort: null,
  });
  const [showMessage, setShowMessage] = useState(0);
  useEffect(() => {
    props.getAccessLogs(accessLog);
    props.getFieldsInfo(ACCESS_LOG, SETTING_BELONG, null, null);
  }, [])

  useEffect(() => {
    if (props.errorCode) {
      setShowMessage(SHOW_MESSAGE.ERROR)
    }
    setShowMessage(SHOW_MESSAGE.SUCCESS)
  }, [props.errorCode])

  const changeLimit = (event) => {
    const currentLimit = {
      dateFrom: dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), userFormatDate),
      dateTo: dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), userFormatDate),
      searchLocal: accessLog.searchLocal,
      limit: Math.floor(event.target.value),
      offset: 0,
      isInitialInfo: false,
      filterConditions: [],
      orderBy: [],
      isDefaultSort: accessLog.isDefaultSort,
    }
    setAccessLog(currentLimit);
    props.getAccessLogs(currentLimit);
  }

  const Search = () => {
    const currentData = {
      dateFrom: dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), userFormatDate),
      dateTo: dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), userFormatDate),
      searchLocal: accessLog.searchLocal,
      limit: accessLog.limit,
      offset: accessLog.offset,
      isInitialInfo: false,
      filterConditions: [],
      orderBy: [],
      isDefaultSort: accessLog.isDefaultSort,
    }
    setAccessLog(currentData)
    props.getAccessLogs(currentData);
  }

  const subPage = () => {
    if (accessLog.offset >= 0) {
      if (accessLog.offset >= accessLog.limit) {
        const pageData = {
          dateFrom: dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), userFormatDate),
          dateTo: dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), userFormatDate),
          limit: accessLog.limit,
          searchLocal: accessLog.searchLocal,
          offset: accessLog.offset - accessLog.limit,
          isInitialInfo: false,
          filterConditions: accessLog.filterConditions,
          orderBy: accessLog.orderBy,
          isDefaultSort: null,
        }
        setAccessLog(pageData);
        props.getAccessLogs(pageData);
      }
    }
  }

  const addPage = () => {
    if (props.totalCount - limit >= accessLog.offset) {
      const pageData = {
        dateFrom: dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), userFormatDate),
        dateTo: dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), userFormatDate),
        limit: accessLog.limit,
        searchLocal: accessLog.searchLocal,
        offset: accessLog.offset + accessLog.limit,
        isInitialInfo: false,
        filterConditions: accessLog.filterConditions,
        orderBy: accessLog.orderBy,
        isDefaultSort: null,
      }
      setAccessLog(pageData);
      props.getAccessLogs(pageData);
    }
  }

  const renderErrorMessage = () => {
    switch (showMessage) {
      case SHOW_MESSAGE.ERROR:
        return (
          <BoxMessage messageType={MessageType.Error}
            message={translate("messages.ERR_COM_0037")} />
        )
      case SHOW_MESSAGE.SUCCESS:
        return (
          <BoxMessage messageType={MessageType.Success}
            message={""} />
        )
      default:
        break;
    }
  }

  const searchAcess = () => {
    const searchLocalData =
    {
      dateFrom: dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), userFormatDate),
      dateTo: dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), userFormatDate),
      searchLocal: searchText,
      limit: accessLog.limit,
      offset: accessLog.offset,
      isInitialInfo: false,
      filterConditions: [],
      orderBy: [],
      isDefaultSort: null,
    }
    props.getAccessLogs(searchLocalData);
  }
  const searchAfterUseKey = event => {
    if (event.charCode === 13) {
      searchAcess();
    }
  }

  const onActionFilterOrder = (filter, order) => {
    const filterInput = [];
    if (filter) {
      let fieldNameFilter = null;
      filter.forEach(e => {
        fieldNameFilter = e.fieldName.includes(".") ? e.fieldName.slice(0, e.fieldName.indexOf(".")) : e.fieldName;
        if (e.fieldValue) {
          filterInput.push({ fieldName: fieldNameFilter, fieldValue: e.fieldValue })
        }
      })
    }

    const orderInput = [];
    if (order) {
      let fieldNameOrder = null;
      order.forEach(e => {
        fieldNameOrder = e.key.includes(".") ? e.key.slice(0, e.key.indexOf(".")) : e.key;
        orderInput.push({ key: fieldNameOrder, value: e.value.toUpperCase() })
      })
    }

    const searchLocalData =
    {
      dateFrom: dateFnsFormat(convertDateTimeFromTz(datetimeDayFrom), userFormatDate),
      dateTo: dateFnsFormat(convertDateTimeFromTz(datetimeDayTo), userFormatDate),
      searchLocal: searchText,
      limit: accessLog.limit,
      offset: accessLog.offset,
      isInitialInfo: false,
      filterConditions: filterInput,
      orderBy: orderInput,
      isDefaultSort: null,
    }
    setAccessLog(searchLocalData);
    props.getAccessLogs(searchLocalData);
  }

  const download = () => {
    const dowloadLogAccess = {
      dateFrom: accessLog.dateFrom,
      dateTo: accessLog.dateTo,
      searchLocal: accessLog.searchLocal,
      filterConditions: accessLog.filterConditions,
      orderBy: accessLog.orderBy,
    };
    props.exportAccessLogs(dowloadLogAccess);
  }

  useEffect(() => {
    if (props.exportAccessLog) {
      // download file csv when api response an url
      window.open(props.exportAccessLog);
    }
  }, [props.exportAccessLog]);

  useEffect(() => {
    return function cleanup() {
      props.reset();
    };
  }, []);

  return (
    <>
      {renderErrorMessage()}
      <div className="form-group">
        <label>{translate('setting.system.accesslog.title')}</label>
        <div className="wrap-check px-0 border-0">
          <span className="wrap-input-date version2 version3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="w40">
                <DatePicker
                  date={datetimeDayFrom}
                  inputClass="input-normal mb-3 w100"
                  onDateChanged={(d) => setDatetimeDayFrom(d)}
                  placeholder={translate(prefix + 'placeholder.selectDate')}
                  componentClass="filter-box"
                />
              </div>
              <span className="approximately">{translate('setting.system.accesslog.to')}</span>
              <div className="w40">
                <DatePicker
                  date={datetimeDayTo}
                  inputClass="input-normal mb-3 w100"
                  onDateChanged={(d) => setDatetimeDayTo(d)}
                  placeholder={translate(prefix + 'placeholder.selectDate')}
                  componentClass="filter-box"
                />
              </div>
            </div>
            <span className="approximately">{translate('setting.system.accesslog.to')}</span>
            <button className="button-primary button-simple-edit px-4 mr-2" onClick={Search}>{translate('setting.system.accesslog.search')}</button>
            <button className="button-primary button-simple-edit" onClick={download} >{translate('setting.system.accesslog.downloadLogAccess')}</button>
          </span>
        </div>
      </div>
      <div className="form-group">
        <div className="d-flex justify-content-between">
          <div className="search-box-no-button-style">
            <button className="icon-search" ><i className="far fa-search" /></button>
            <input type="text" placeholder={translate('setting.system.accesslog.placeholder')} onChange={input => { setSearchText(input.target.value) }}
              onBlur={searchAcess}
              value={searchText}
              onKeyPress={searchAfterUseKey}
            />
          </div>
        </div>
      </div>
      <div className="text-right mb-3">
        <div className="esr-pagination">
          <div className="select-option">
            <select onChange={e => { changeLimit(e); setLimit(parseInt(e.target.value, 10)) }}>
              <option value={5}>5 {translate('setting.system.accesslog.item')}</option>
              <option value={10}>10 {translate('setting.system.accesslog.item')}</option>
              <option value={15}>15 {translate('setting.system.accesslog.item')}</option>
            </select>
          </div>
          <span className="text"> {`${props.totalCount ? accessLog.offset + 1 : 0} - ${(accessLog.offset + accessLog.limit) >= props.totalCount ? props.totalCount : (accessLog.offset + accessLog.limit)}`} {translate('setting.system.accesslog.record')} / {props.totalCount} {translate('setting.system.accesslog.record')}</span>
          <a><i className="icon-next fas fa-angle-left" onClick={subPage} /></a>
          <a><i className="icon-prev far fa-angle-right" onClick={addPage} /></a>
        </div>
      </div>
      <div>
        <div className="overflow-auto">
          {props.contentAccess &&
            <DynamicList
              ref={tableListRef}
              id={GET_LOG_ACCESS}
              records={props.contentAccess}
              belong={SETTING_BELONG}
              keyRecordId={"employeeId"}
              tableClass={"table-default min-width-800"}
              checkboxFirstColumn={false}
              onActionFilterOrder={onActionFilterOrder}
            // fields={props.fieldAccessLog}
            />
          }
        </div>
      </div>
    </>
  )
}
const mapStateToProps = ({ logAccess, dynamicList, dynamicField }: IRootState) => ({
  fieldInfos: dynamicList.data.has(GET_LOG_ACCESS) ? dynamicList.data.get(GET_LOG_ACCESS).fieldInfos : {},
  errorCode: logAccess.errorCode,
  logAccesses: logAccess.logAccesses,
  exportAccessLog: logAccess.exportAccessLog,
  customFieldInfos: logAccess.customFieldInfos,
  contentAccess: logAccess.contentAccess,
  totalCount: logAccess.totalCount,
  fieldAccessLog: dynamicField.data.get(ACCESS_LOG) ? dynamicField.data.get(ACCESS_LOG).fieldInfo ? dynamicField.data.get(ACCESS_LOG).fieldInfo : null : null
})
const mapDispatchToProps = {
  getAccessLogs,
  exportAccessLogs,
  getFieldsInfo,
  reset
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(LogAccessses);









