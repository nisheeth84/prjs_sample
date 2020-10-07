import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import DayPicker from 'react-day-picker';
import dateFnsFormat from 'date-fns/format';
import { useId } from 'react-id-generator';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { translate, Storage } from 'react-jhipster';
import DatePicker from '../../../../../shared/layout/common/date-picker';
import { 
  utcToTz, 
  DATE_TIME_FORMAT, 
  timeTzToUtc, 
  parseDateFmDefault,
  tzToUtc,
  getDateTimeNowTz
} from 'app/shared/util/date-utils';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import TimePicker from '../component/time-picker';
import _ from 'lodash';
import moment from 'moment-timezone';
import { isCanSettingField } from 'app/shared/util/option-manager';

type IFieldDetailEditDatetimeProps = IDynamicFieldProps

const FieldDetailEditDatetime = forwardRef((props: IFieldDetailEditDatetimeProps, ref) => {
  const FORMAT_DATE = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const idAutomatic = useId(6, "field_detail_datetime_id_");
  const nameAutomatic = useId(2, "field_detail_datetime_name_");
  const [ localErrorMsg, setLocalErrorMsg ] = useState(null);

  const [defaultDateOption, setDefaultDateOption] = useState(null);
  const [defaultTimeOption, setDefaultTimeOption] = useState(null);
  const [dateEdit, setDateEdit] = useState(null);
  const [timeEdit, setTimeEdit] = useState(null);
  const [isReady, setIsReady] = useState(false)

  const fieldInfo = props.fieldInfo;
  const prefix = 'dynamic-control.fieldDetail.layoutDate.';
  const fieldType = fieldInfo.fieldType.toString();

  useImperativeHandle(ref, () => ({
    validate() {
      if(dateEdit && (dateEdit.getFullYear() < 1753 || dateEdit.getFullYear() > 9999)){
        setLocalErrorMsg(translate(`messages.ERR_COM_0082`));
        return false;
      }
      setLocalErrorMsg("");
      return true;
    }
  }));

  const updateDefaultOption = () => {
    let configVal = null;
    if (fieldType === DEFINE_FIELD_TYPE.DATE_TIME) {
      configVal = `${defaultDateOption},${defaultTimeOption}`
    } else if (fieldType === DEFINE_FIELD_TYPE.DATE) {
      configVal = `${defaultDateOption}`
    } else if (fieldType === DEFINE_FIELD_TYPE.TIME) {
      configVal = `${defaultTimeOption}`
    }
    setLocalErrorMsg("");
    if (props.updateStateElement) {
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, { configValue: configVal })
    }
  }

  const initialize = () => {
    const DATE_DEFAULT = '2020-01-01 ';
    if (fieldInfo.defaultValue) {
      const defaultValueTmp = _.cloneDeep(fieldInfo.defaultValue)
      let arrInputDateTime = []
      if (defaultValueTmp.length >= 16) {
        arrInputDateTime = _.toString(utcToTz(defaultValueTmp, DATE_TIME_FORMAT.Database)).split(" ");
      } else if (defaultValueTmp.length <= 5) {
        arrInputDateTime = _.toString(utcToTz(DATE_DEFAULT + defaultValueTmp, DATE_TIME_FORMAT.Database)).split(" ");
      }

      if(arrInputDateTime && arrInputDateTime.length > 0) {
        const val = arrInputDateTime[arrInputDateTime.length - 1];
        if(val){
          setTimeEdit(val);
        } else {
          setTimeEdit("");
        }
      }
      
      const parsed = parseDateFmDefault(fieldInfo.defaultValue);
      if (DayPicker.DateUtils.isDate(parsed) && fieldInfo.defaultValue && fieldInfo.defaultValue.length > 5) {
        const dateTz = moment(utcToTz(parsed, DATE_TIME_FORMAT.Database), "YYYY-MM-DDTHH:mmZ").toDate()
        setDateEdit(fieldType !== DEFINE_FIELD_TYPE.DATE ? dateTz : parsed);
      }
    }
    if (fieldInfo.configValue) {
      if (fieldType === DEFINE_FIELD_TYPE.DATE_TIME) {
        const arr = fieldInfo.configValue.split(",");
        setDefaultDateOption(parseInt(arr[0], 10));
        setDefaultTimeOption(parseInt(arr[1], 10));
      } else if (fieldType === DEFINE_FIELD_TYPE.DATE) {
        setDefaultDateOption(parseInt(fieldInfo.configValue, 10));
      } else if (fieldType === DEFINE_FIELD_TYPE.TIME) {
        setDefaultTimeOption(parseInt(fieldInfo.configValue, 10));
      }
    } else {
      setDefaultDateOption(0);
      setDefaultTimeOption(0);
    }
    setIsReady(true);
  }

  useEffect(() => {
    initialize();
  }, [])

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (defaultDateOption === 0) {
      setDateEdit(null)
    } else if (defaultDateOption === 1) {
      setDateEdit(getDateTimeNowTz())
    }
    updateDefaultOption();
  }, [defaultDateOption])

  useEffect(() => {
    if (!isReady) {
      return;
    }
    if (defaultTimeOption === 0) {
      setTimeEdit('')
    } else if (defaultTimeOption === 1) {
      const dateNow = getDateTimeNowTz();
      setTimeEdit(`${dateNow.getHours().toString().padStart(2, '0')}:${dateNow.getMinutes().toString().padStart(2, '0')}`);
    }
    updateDefaultOption();
  }, [defaultTimeOption])

  useEffect(() => {
    if (!isReady) {
      return;
    }
    let defaultVal = null
    if (fieldType === DEFINE_FIELD_TYPE.DATE) {
      if (dateEdit && DayPicker.DateUtils.isDate(dateEdit)) {
        defaultVal = dateFnsFormat(dateEdit, APP_DATE_FORMAT_ES);
      }
    }
    if (fieldType === DEFINE_FIELD_TYPE.TIME) {
      if (timeEdit) {
        defaultVal = timeTzToUtc(timeEdit);
      }
    }
    if (fieldType === DEFINE_FIELD_TYPE.DATE_TIME) {
      if(dateEdit && timeEdit){
        defaultVal = tzToUtc(dateFnsFormat(dateEdit, APP_DATE_FORMAT_ES) + " " + timeEdit, DATE_TIME_FORMAT.Database);
      } else if (dateEdit && !timeEdit){
        defaultVal = dateFnsFormat(dateEdit, APP_DATE_FORMAT_ES);
      } else if (!dateEdit && timeEdit){
        defaultVal = timeTzToUtc(timeEdit);
      }
    }
    if (props.updateStateElement) {
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, { defaultValue: defaultVal })
    }
  }, [dateEdit, timeEdit])

  const isShowDefaultValue = isCanSettingField(props.belong, fieldInfo.fieldName, 'defaultValue');
  return (
    <>
      {(fieldType === DEFINE_FIELD_TYPE.DATE || fieldType === DEFINE_FIELD_TYPE.DATE_TIME) &&
        <div className="form-group mb-0">
          <label>{translate(prefix +  `${fieldType === DEFINE_FIELD_TYPE.DATE ? 'default' : 'labelDate'}`)}</label>
          <div className="wrap-check-radio">
            <p className={`radio-item ${!isShowDefaultValue ? 'radio-item-disable normal' : ''}`}>
              <input name={nameAutomatic[0]} id={idAutomatic[0]} type="radio"
                disabled={!isShowDefaultValue}
                value={0}
                checked={defaultDateOption === 0}
                onChange={(e) => setDefaultDateOption(+e.target.value)}
              />
              <label htmlFor={idAutomatic[0]}>{translate(prefix + 'radio.none')}</label>
            </p>
          </div>
          <div className="wrap-check-radio">
            <p className={`radio-item ${!isShowDefaultValue ? 'radio-item-disable normal' : ''}`}>
              <input name={nameAutomatic[0]} id={idAutomatic[1]} type="radio"
                disabled={!isShowDefaultValue}
                value={1}
                checked={defaultDateOption === 1}
                onChange={(e) => setDefaultDateOption(+e.target.value)}
              />
              <label htmlFor={idAutomatic[1]}>{translate(prefix + 'radio.dateTimeCheckBox')}</label>
            </p>
          </div>
          <div className="wrap-check-radio">
            <p className={`radio-item ${!isShowDefaultValue ? 'radio-item-disable normal' : ''}`}>
              <input name={nameAutomatic[0]} id={idAutomatic[2]} type="radio"
                disabled={!isShowDefaultValue}
                value={2}
                checked={defaultDateOption === 2}
                onChange={(e) => setDefaultDateOption(+e.target.value)}
              />
              <label htmlFor={idAutomatic[2]}>{translate(prefix + 'radio.any')}</label>
            </p>
          </div>
          <div className="input ml-4 wrap-date-setting-field">
            {defaultDateOption !== 2 &&
            <div className = "form-group has-delete">
              <input className="input-normal gray w60 disable" type="text" disabled={true} placeholder={fieldType === DEFINE_FIELD_TYPE.DATE_TIME ? translate('dynamic-control.placeholder.dateInput') : translate(prefix + 'placeholder.defaultValue')}
                value={dateEdit ? dateFnsFormat(dateEdit, FORMAT_DATE) : ""}
              />
            </div>
            }
            {defaultDateOption === 2 &&
              <DatePicker
                date={dateEdit}
                borderClass={"input-common-wrap delete w60 form-group has-delete"}
                inputClass={"input-normal gray w-100"}
                onDateChanged={(d) => setDateEdit(d)}
                placeholder={translate(prefix + 'placeholder.defaultValue')}
                isError = {localErrorMsg}
              />
            }
          </div>
          {defaultDateOption === 2 && localErrorMsg && <span className="messenger-error  ml-4">{localErrorMsg}</span>}
        </div>
      }
      {(fieldType === DEFINE_FIELD_TYPE.TIME || fieldType === DEFINE_FIELD_TYPE.DATE_TIME) &&
        <div className="form-group">
          <label>{translate(prefix +  `${fieldType === DEFINE_FIELD_TYPE.TIME ? 'default' : 'labelTime'}`)}</label>
          <div className="wrap-check-radio">
          <p className={`radio-item ${!isShowDefaultValue ? 'radio-item-disable normal' : ''}`}>
              <input name={nameAutomatic[1]} id={idAutomatic[3]} type="radio"
                disabled={!isShowDefaultValue}
                value={0}
                checked={defaultTimeOption === 0}
                onChange={(e) => setDefaultTimeOption(+e.target.value)}
              />
              <label htmlFor={idAutomatic[3]}>{translate(prefix + 'radio.none')}</label>
            </p>
          </div>
          <div className="wrap-check-radio">
            <p className={`radio-item ${!isShowDefaultValue ? 'radio-item-disable normal' : ''}`}>
              <input name={nameAutomatic[1]} id={idAutomatic[4]} type="radio"
                disabled={!isShowDefaultValue}
                value={1}
                checked={defaultTimeOption === 1}
                onChange={(e) => setDefaultTimeOption(+e.target.value)}
              />
              <label htmlFor={idAutomatic[4]}>{translate(prefix + 'radio.time')}</label>
            </p>
          </div>
          <div className="wrap-check-radio">
            <p className={`radio-item ${!isShowDefaultValue ? 'radio-item-disable normal' : ''}`}>
              <input name={nameAutomatic[1]} id={idAutomatic[5]} type="radio"
                disabled={!isShowDefaultValue}
                value={2}
                checked={defaultTimeOption === 2}
                onChange={(e) => setDefaultTimeOption(+e.target.value)}
              />
              <label htmlFor={idAutomatic[5]}>{translate(prefix + 'radio.any')}</label>
            </p>
          </div>
          <div className="input ml-4">
            {defaultTimeOption !== 2 &&
            <div className = "form-group has-delete">
              <input className="input-normal gray w60 disable" type="text" disabled={true} placeholder={fieldType === DEFINE_FIELD_TYPE.DATE_TIME ? translate('dynamic-control.placeholder.timeInput') : translate(prefix + 'placeholder.defaultValue')} value={timeEdit} />
            </div>
            }
            {defaultTimeOption === 2 && <>
              <div className="input-common-wrap form-group has-delete w60">
              <TimePicker
                fieldInfo={props.fieldInfo}
                inputClass = "input-normal gray w100"
                onChangeTime={(val) => setTimeEdit(val)}
                enterInputControl={props.enterInputControl}
                placeholder={translate(prefix + 'placeholder.defaultValue')}
                timeInit={timeEdit}
              />
              </div>
            </>}
          </div>
        </div>
      }
    </>
  );
});

export default FieldDetailEditDatetime
