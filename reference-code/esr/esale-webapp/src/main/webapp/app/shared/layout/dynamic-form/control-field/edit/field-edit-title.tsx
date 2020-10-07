import React, { forwardRef } from 'react';
import _ from 'lodash';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { getFieldLabel } from 'app/shared/util/string-utils';

type IFieldEditTitleProps = IDynamicFieldProps;

const FieldEditTitle = forwardRef((props: IFieldEditTitleProps, ref) => {

  const renderComponentEdit = () => {
    return (
      <div className ="wrap-show-case pt-md-2">
        {getFieldLabel(props.fieldInfo, 'fieldLabel')}
      </div>
    );
  }

  return renderComponentEdit();
});

export default FieldEditTitle
