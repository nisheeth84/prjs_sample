import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import { ControlType, ADDRESS_MAXLENGTH } from 'app/config/constants';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import _ from 'lodash';
import { translate } from 'react-jhipster';
import {
  DynamicFieldAction,
  getAddressFromZipCode,
  reset
} from 'app/shared/reducers/dynamic-field.reducer';
import { Options, connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import StringUtils, { jsonParse, toKatakana } from 'app/shared/util/string-utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { isMouseOnRef } from 'app/shared/util/utils';

interface IFieldEditAddressDispatchProps {
  getAddressFromZipCode,
  reset
}

interface IFieldEditAddressStateProps {
  action: DynamicFieldAction;
  errorMessage: string,
  addresses: any
}

type IFieldEditAddressProps = IFieldEditAddressStateProps & IFieldEditAddressDispatchProps & IDynamicFieldProps;

const FieldEditAddress = forwardRef((props: IFieldEditAddressProps, ref) => {
  const [showGoogleMap,] = useState(false);
  const [addressSuggests, setAddressSuggests] = useState([]);
  const limitLoadSuggests = 10;
  const [isEditing, setIsEditing] = useState(false);
  const [isOnFocus, setIsOnFocus] = useState(false);

  const { fieldInfo } = props;
  const [value, setValue] = useState({
    zipCode: null,
    addressName: null,
    buildingName: null,
    address: null
  });

  const prefix = 'dynamic-control.fieldDetail.layoutAddress.';

  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const getStyleClass = (attr: string) => {
    return _.get(props.fieldStyleClass, `addressBox.edit.${attr}`)
  }

  const limitLength = (address) => {
    try {
      if (address.zipCode && address.zipCode.length > ADDRESS_MAXLENGTH.ZIP_CODE) {
        address.zipCode = address.zipCode.slice(0, ADDRESS_MAXLENGTH.ZIP_CODE);
      }
      if (address.addressName && address.addressName.length > ADDRESS_MAXLENGTH.TEXT) {
        address.addressName = address.addressName.slice(0, ADDRESS_MAXLENGTH.TEXT);
      }
      if (address.buildingName && address.buildingName.length > ADDRESS_MAXLENGTH.TEXT) {
        address.buildingName = address.buildingName.slice(0, ADDRESS_MAXLENGTH.TEXT);
      }
      return address;
    } catch {
      return address;
    }
  }

  const updateValue = (val) => {
    const valueCopy = _.cloneDeep(value);
    const mergeObject = limitLength({ ...valueCopy, ...val });

    if (mergeObject.zipCode || mergeObject.addressName || mergeObject.buildingName) {
      let addressString = "";
      if (mergeObject.zipCode) {
        addressString = addressString + `${mergeObject.zipCode} `;
      }
      if (mergeObject.addressName) {
        addressString = addressString + `${mergeObject.addressName} `;
      }
      if (mergeObject.buildingName) {
        addressString = addressString + `${mergeObject.buildingName}`;
      }
      mergeObject.address = addressString;
    } else {
      mergeObject.address = null;
    }

    setValue(mergeObject);
  }

  const id = `${props.fieldInfo.fieldName}_${props.fieldInfo.fieldId}`;

  const generateAddressSuggests = (val, isAutoLoad) => {
    if (!val) {
      setAddressSuggests([]);
      return;
    }
    if (_.trim(val).length <= 1) {
      return;
    }
    let offset = 0;
    if (isAutoLoad) {
      offset = addressSuggests.length;
    }
    props.getAddressFromZipCode(id, val, offset, limitLoadSuggests, isAutoLoad);
  }

  useEffect(() => {
    if (props.addresses) {
      const addressListCopy = _.cloneDeep(props.addresses);
      if (addressListCopy.zipCode && value.zipCode && addressListCopy.zipCode.length !== value.zipCode.length) {
        return;
      }
      let prefSugg;
      if (addressListCopy.isAutoLoad) {
        prefSugg = _.cloneDeep(addressSuggests);
      } else {
        prefSugg = [];
      }
      if (addressListCopy.addressList) {
        addressListCopy.addressList.forEach(pref => {
          prefSugg.push(pref);
        });
      }
      setAddressSuggests(prefSugg);
    }
  }, [props.addresses]);

  const textboxRef = useRef(null);
  const textboxRefEdit = useRef(null);
  const suggestRefEdit = useRef(null);

  // if (props.isFocus && textboxRef && textboxRef.current) {
  //   textboxRef.current.focus();
  // }

  // if (props.isFocus && textboxRefEdit && textboxRefEdit.current) {
  //   textboxRefEdit.current.focus();
  // }

  const handleClickOutside = (e) => {
    if (suggestRefEdit && !isMouseOnRef(suggestRefEdit, e)
      && ((textboxRefEdit && !isMouseOnRef(textboxRefEdit, e)) || (textboxRef && !isMouseOnRef(textboxRef, e)))
    ) {
      setAddressSuggests([]);
      setIsOnFocus(false);
    }
    // updateValue({ zipCode: toKatakana(e.target.value) });
    // if (!suggestHover) {
    //   setAddressSuggests([]);
    // }
  }

  const handleClickSuggest = (val) => {
    updateValue({ zipCode: val.zipCode, addressName: `${val.prefectureName} ${val.cityName} ${val.areaName}` });
    setAddressSuggests([]);
  }

  const handleScrollAddressSuggests = (e) => {
    if (addressSuggests.length % limitLoadSuggests !== 0) {
      return;
    }
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      generateAddressSuggests(value.zipCode, true);
    }
  }

  useEventListener('mousedown', handleClickOutside);

  const initialize = (fieldValue) => {
    if (fieldValue && !isEditing) {
      // const defaultValueObject = JSON.parse(props.elementStatus.fieldValue);
      const defaultValueObject = jsonParse(fieldValue, value);
      const newElement = {};
      for (const prop in defaultValueObject) {
        if (Object.prototype.hasOwnProperty.call(defaultValueObject, prop)) {
          newElement[StringUtils.camelCaseToSnakeCase(prop)] = defaultValueObject[prop];
        }
      }
      const valueParse = {
        zipCode: newElement["zip_code"],
        buildingName: newElement["building_name"],
        addressName: newElement["address_name"],
        address: newElement["address"]
      }
      if (!_.isEqual(valueParse, value)) {
        setValue(valueParse);
      }
    }
  };

  useEffect(() => {
    initialize(_.get(props, 'elementStatus.fieldValue'));
    return () => {
      props.reset(id);
    };
  }, []);

  // useEffect(() => {
  //   initialize();
  // }, [props.elementStatus])

  useEffect(() => {
    const valueCopy = _.cloneDeep(value);
    if (props.updateStateElement) {
      const updateVal = {
        "zip_code": valueCopy.zipCode || valueCopy['zip_code'],
        "building_name": valueCopy.buildingName || valueCopy['building_name'],
        "address_name": valueCopy.addressName || valueCopy['address_name'],
        "address": valueCopy.address
      }
      const addressObj = (valueCopy.address != null && valueCopy.address.length > 0) ? JSON.stringify(updateVal) : null;
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, fieldInfo.fieldType, addressObj);
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    resetValue() {
      setValue({
        zipCode: null,
        addressName: null,
        buildingName: null,
        address: null
      })
    },
    setValueEdit(val) {
      if (!_.isEqual(value, val)) {
        initialize(val);
      }
    }
  }));

  const onChangeZipcode = (e) => {
    const valueData = toKatakana(e.target.value);
    updateValue({ zipCode: valueData });
    generateAddressSuggests(valueData, false);
  }

  const renderComponentEdit = () => {
    let msg = null;
    if (props.errorInfo) {
      if (props.errorInfo.errorCode) {
        msg = translate(`messages.${props.errorInfo.errorCode}`, props.errorInfo.errorParams);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    return (
      <>
        <div className="show-search">
          <div className="d-flex justify-content-between">
            <div className="w48 position-relative">
              <label>{translate(prefix + "lable.zipCode")}</label>
              <div>
                <input ref={textboxRef} disabled={props.isDisabled} type="text" className={`${getStyleClass("inputText")}  ${props.errorInfo ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`} placeholder={translate(prefix + "placeholder.zipCode")}
                  onChange={e => onChangeZipcode(e)} value={value.zipCode}
                  onBlur={e => updateValue({ zipCode: toKatakana(e.target.value)})}
                  onFocus={e => { generateAddressSuggests(value.zipCode, false); setIsOnFocus(true) }} />
                {isOnFocus && addressSuggests && addressSuggests.length > 0 &&
                  <ul ref={suggestRefEdit} className="drop-down w100 style-3 height-auto lazy-load"
                    onScroll={handleScrollAddressSuggests} >
                    {addressSuggests.map((item, idx) => {
                      return <li className="item smooth" key={"address_" + idx} onClick={e => { handleClickSuggest(item) }}>
                        <div className="text text2">{translate(prefix + "lable.postMark")}{item.zipCode} {item.prefectureName} {item.cityName} {item.areaName}</div>
                      </li>
                    })}
                  </ul>}
              </div>
            </div>
            <div className="w48">
              <label>{translate(prefix + "lable.stations")}</label>
              <input disabled={props.isDisabled} type="text" className={`${getStyleClass("inputText")}  ${props.errorInfo ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`} placeholder={translate(prefix + "placeholder.stations")}
                onChange={e => updateValue({ addressName: e.target.value })} value={value.addressName}
                onBlur={e => updateValue({ addressName: toKatakana(e.target.value) })} />
            </div>
          </div>
          <div className="d-flex justify-content-between mt-4">
            <div className="w48">
              <label>{translate(prefix + "lable.buildingName")}</label>
              <div className="d-flex justify-content-between">
                <input disabled={props.isDisabled} type="text" className={`${getStyleClass("inputText")}  ${props.errorInfo ? 'error' : ''} ${props.isDisabled ? 'disable' : ''}`} placeholder={translate(prefix + "placeholder.buildingName")}
                  onChange={e => updateValue({ buildingName: e.target.value })} value={value.buildingName}
                  onBlur={e => updateValue({ buildingName: toKatakana(e.target.value) })} />
              </div>
            </div>
          </div>
          {showGoogleMap && <div id="google-map" className="mt-3">
            <p className="check-box-item">
              <label className="icon-check">
                <input disabled={props.isDisabled} type="checkbox" name="" /><i></i>{translate(prefix + "lable.checkboxLocationOnly")}
              </label>
            </p>
            <span className="text-google-map color-999">{translate(prefix + "lable.mapTitle")}</span>
          </div>}
        </div>
        {msg && <span className="messenger-error d-block">{msg}</span>}
      </>
    );
  }

  const renderComponentEditList = () => {
    let msg = null;
    if (props.errorInfo) {
      if (props.errorInfo.errorCode) {
        msg = translate(`messages.${props.errorInfo.errorCode}`, props.errorInfo.errorParams);
      } else if (props.errorInfo.errorMsg) {
        msg = props.errorInfo.errorMsg;
      }
    }
    return (
      <>
        <div className={`list-edit-address ${msg ? 'd-block input-common-wrap error' : ''}`}>
          <div className="d-flex form-group">
            <input disabled={props.isDisabled} type="text" className={`input-normal w25 ${props.isDisabled ? 'disable' : ''}`} placeholder={translate(prefix + "placeholder.zipCode")}
              onChange={e => onChangeZipcode(e)} value={value.zipCode}
              onFocus={e => { generateAddressSuggests(value.zipCode, false); setIsEditing(true); setIsOnFocus(true) }}
              ref={textboxRefEdit} />
            {isOnFocus && addressSuggests && addressSuggests.length > 0 &&
              <ul ref={suggestRefEdit} className="drop-down w100 style-3 height-auto lazy-load"
                onScroll={handleScrollAddressSuggests} >
                {addressSuggests.map((item, idx) => {
                  return <li className="item smooth" key={"address_" + idx} onClick={e => { handleClickSuggest(item); setIsOnFocus(false) }}>
                    <div className="text text2">{translate(prefix + "lable.postMark")}{item.zipCode} {item.prefectureName} {item.cityName} {item.areaName}</div>
                  </li>
                })}
              </ul>}
            <input disabled={props.isDisabled} type="text" className={`input-normal w37 ${props.isDisabled ? 'disable' : ''}`} placeholder={translate(prefix + "placeholder.stations")}
              onChange={e => updateValue({ addressName: e.target.value })} value={value.addressName}
              onBlur={e => updateValue({ addressName: toKatakana(e.target.value) })}
              onFocus={() => setIsEditing(true)} />
            <input disabled={props.isDisabled} type="text" className={`input-normal w38 ${props.isDisabled ? 'disable' : ''}`} placeholder={translate(prefix + "placeholder.buildingName")}
              onChange={e => updateValue({ buildingName: e.target.value })} value={value.buildingName}
              onBlur={e => updateValue({ buildingName: toKatakana(e.target.value) })}
              onFocus={() => setIsEditing(true)} />
          </div>
          {msg && <span className="messenger-error d-block">{msg}</span>}
        </div>
      </>
    );
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});

const mapStateToProps = ({ dynamicField }: IRootState, ownProps: IDynamicFieldProps) => {
  const id = `${ownProps.fieldInfo.fieldName}_${ownProps.fieldInfo.fieldId}`;
  if (!dynamicField || !dynamicField.data.has(id)) {
    return {
      action: null,
      errorMessage: null,
      addresses: null
    };
  }
  return {
    action: dynamicField.data.get(id).action,
    errorMessage: dynamicField.data.get(id).errorMessage,
    addresses: dynamicField.data.get(id).addresses,
  }
};

const mapDispatchToProps = {
  getAddressFromZipCode,
  reset
};

const options = { forwardRef: true };

export default connect<IFieldEditAddressStateProps, IFieldEditAddressDispatchProps, IDynamicFieldProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(FieldEditAddress);
