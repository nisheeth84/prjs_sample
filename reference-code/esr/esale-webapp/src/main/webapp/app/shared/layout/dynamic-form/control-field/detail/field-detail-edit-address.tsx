import React, { useImperativeHandle, forwardRef, useRef, useState, useEffect } from 'react'
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { DEFINE_FIELD_TYPE } from '../../constants';
import StringUtils from 'app/shared/util/string-utils';
import { Storage, translate } from 'react-jhipster';
import { ControlType } from 'app/config/constants';
import _ from 'lodash';

type IFieldDetailEditAddressProps = IDynamicFieldProps

const FieldDetailEditAddress = forwardRef((props: IFieldDetailEditAddressProps, ref) => {
  const [isGoogleMap, setIsGoogleMap] = useState(false);

  useImperativeHandle(ref, () => ({

  }));

  const prefix = 'dynamic-control.fieldDetail.layoutAddress.';

  useEffect(() => {
    if (_.isNil(props.fieldInfo.isLinkedGoogleMap)) {
      if (props.updateStateElement) {
        setIsGoogleMap(true);
      }
    } else if (props.fieldInfo.isLinkedGoogleMap) {
      setIsGoogleMap(props.fieldInfo.isLinkedGoogleMap)
    }
  }, [])

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(props.fieldInfo, props.fieldInfo.fieldType, { isLinkedGoogleMap: isGoogleMap })
    }
  }, [isGoogleMap])


  return (
    <div className="form-group">
      <div>{translate(prefix + "lable.googleMap")}</div>
      <label className="icon-check">
        <input type="checkbox" checked={isGoogleMap} onChange={(e) => setIsGoogleMap(e.target.checked)} /><i></i> {translate(prefix + "lable.googleMapCheckbox")}
      </label>
    </div>
  )
});

export default FieldDetailEditAddress
