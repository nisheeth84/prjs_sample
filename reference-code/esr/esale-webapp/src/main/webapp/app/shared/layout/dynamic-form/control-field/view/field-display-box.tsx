import React, { useImperativeHandle, forwardRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import { getFieldLabel, jsonParse, forceArray } from 'app/shared/util/string-utils';
import moment from 'moment';
import { timeUtcToTz, utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { Storage, translate } from 'react-jhipster';

import _ from 'lodash';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, ControlType, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { getFullAddress } from 'app/shared/util/entity-utils';

type IFieldDisplayBoxProps = IDynamicFieldProps

const FieldDisplayBox = forwardRef((props: IFieldDisplayBoxProps, ref) => {
  const [value, setValue] = useState(null)

  useImperativeHandle(ref, () => ({

  }));

  useEffect(() => {
    setValue(props.elementStatus.fieldValue)
  }, [props.elementStatus.fieldValue])

  const fieldType = props.fieldInfo.fieldType ? props.fieldInfo.fieldType.toString() : '';

  const msgNodata = () => {
    return translate('messages.ERR_COM_0035', [getFieldLabel(props.fieldInfo, 'fieldLabel')])
  }

  const renderDisplayFieldItem = () => {
    if (_.isNil(value) || _.isNil(props.fieldInfo) || _.isNil(props.fieldInfo.fieldItems) ||
          props.fieldInfo.fieldItems.length < 1) {
        return <>{msgNodata()}</>
    }
    // force value to array, if not array keep old value
    const forced = forceArray(value, value);
    if (_.isArray(forced)) {
      const items = _.filter(props.fieldInfo.fieldItems, e => _.findIndex(forced, o => o === e.itemId) >= 0)
      if (items && items.length > 0) {
        const itemLabels = items.map( e => getFieldLabel(e, 'itemLabel'));
        return <>{itemLabels.join(',')}</>
      }
    } else {
      const item = _.find(props.fieldInfo.fieldItems, {itemId: _.toNumber(forced)})
      if (!_.isNil(item)) {
        return <>{getFieldLabel(item, 'itemLabel')}</>
      }
    }
    return <>{msgNodata()}</>
  }

  const renderDisplayNumber = () => {
    const typeUnit = props.fieldInfo.typeUnit;
    const currencyUnit = props.fieldInfo.currencyUnit ? props.fieldInfo.currencyUnit : '';
    const decimalPlace = props.fieldInfo.decimalPlace ? props.fieldInfo.decimalPlace : 0;
    let val = value;
    if (_.isNil(val)) {
      return <>{msgNodata()}</>
    }
    val = Number(val).toFixed(decimalPlace)
    let strDisplay = `${val}${currencyUnit}`
    if (typeUnit === 1) {
      strDisplay = `${currencyUnit}${val}`
    }
    return <>{strDisplay}</>
  }

  const renderDisplayFileName = () => {
    let fileNames = [];
    try {
      const objFiles = JSON.parse(value);
      objFiles.forEach(file => {
        const fileName = file.fileName ? file.fileName :
        file['file_name'] ? file['file_name'] : '';
        fileNames.push(fileName);
      });
    } catch {
      fileNames = [msgNodata()];
    }
    return <>{fileNames.join(', ')}</>;
  }

  const renderDisplayDatetime = () => {
    if (_.isNil(value)) {
      return <>{msgNodata()}</>
    }
    return <>{utcToTz(value, DATE_TIME_FORMAT.User)}</>
  }

  const renderDisplayDate = () => {
    if (_.isNil(value) || _.isEmpty(value)) {
      return <>{msgNodata()}</>
    }
    const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
    const momentVal = moment(value, APP_DATE_FORMAT_ES);
    if (momentVal.isValid()) {
      return <>{momentVal.format(userFormat)}</>
    } else {
      return <>{msgNodata()}</>
    }
  }

  const renderDisplayTime = () => {
    if (_.isNil(value)) {
      return <>{msgNodata()}</>
    }
    return <>{timeUtcToTz(value)}</>
  }

  const renderComponent = () => {

    switch(fieldType) {
      case DEFINE_FIELD_TYPE.SINGER_SELECTBOX:
      case DEFINE_FIELD_TYPE.MULTI_SELECTBOX:
      case DEFINE_FIELD_TYPE.CHECKBOX:
      case DEFINE_FIELD_TYPE.RADIOBOX:
        return renderDisplayFieldItem();
      case DEFINE_FIELD_TYPE.NUMERIC:
        return renderDisplayNumber();
      case DEFINE_FIELD_TYPE.DATE:
        return renderDisplayDate()
      case DEFINE_FIELD_TYPE.DATE_TIME:
        return renderDisplayDatetime()
      case DEFINE_FIELD_TYPE.TIME:
        return renderDisplayTime();
      case DEFINE_FIELD_TYPE.TEXT:
        return <>{value || msgNodata()}</>
      case DEFINE_FIELD_TYPE.TEXTAREA:
        return <>{value || msgNodata()}</>
      case DEFINE_FIELD_TYPE.FILE:
        return renderDisplayFileName();
      case DEFINE_FIELD_TYPE.LINK: {
        const objLink = jsonParse(value, {});
        const display = _.get(objLink, 'url_text') ? _.get(objLink, 'url_text') :
                        _.get(objLink, 'url_target') ? _.get(objLink, 'url_target') : msgNodata();
        return <>{display}</>
      }
      case DEFINE_FIELD_TYPE.PHONE_NUMBER:
        return <>{value ? value : msgNodata()}</>
      case DEFINE_FIELD_TYPE.ADDRESS: {
        let textAddress = getFullAddress(value, null);
        if (!textAddress) {
          textAddress = msgNodata();
        }
        return <>{textAddress}</>
      }
      case DEFINE_FIELD_TYPE.EMAIL:
        return (
          <>
            {props.controlType !== ControlType.SUGGEST && <a href={`mailto:${value}`}>{value || msgNodata()}</a>}
            {props.controlType === ControlType.SUGGEST && <>{value || msgNodata()}</>}
          </>
        )
      default:
        return <>{value || msgNodata()}</>
    }
  }

  return renderComponent();

});

export default FieldDisplayBox
