import React, { useRef } from 'react'
import { DEFINE_FIELD_TYPE } from '../../../../shared/layout/dynamic-form/constants'
import FieldSettingTextBox from './field-setting-text-box'

export interface IDynamicSettingFieldProps {
    fieldInfo: any
}

const DynamicSettingField = (props: IDynamicSettingFieldProps) => {

    const { fieldInfo } = props;

    return (
        <>
            {fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXT && <FieldSettingTextBox fieldInfo={fieldInfo} />}
        </>
    );
}

export default DynamicSettingField;