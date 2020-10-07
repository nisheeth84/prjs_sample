import _ from 'lodash';

import React, { useState, useEffect } from 'react';
import StringUtils from 'app/shared/util/string-utils';
import { isSpecialColumn } from 'app/shared/layout/dynamic-form/list/dynamic-list-helper';

export interface IListHeaderProps {
  fieldInfo: any;
  mode?: number;
  fieldResizing?: any[];
  tableHeight?: number;
  columnsWidth?: number[];
  disableEditHeader?: boolean; // can edit header? (resize or move order)
  contentHeader?: (field: any, titleColumn: string, specialField?: boolean) => JSX.Element;
}

const ListHeader: React.FC<IListHeaderProps> = props => {
  const [listField, setListField] = useState([]);
  const [isSpecialField, setIsSpecialField] = useState(false);
  const [titleColumn, setTitleColumn] = useState([]);

  useEffect(() => {
    const { fieldInfo } = props;
    setIsSpecialField(isSpecialColumn(fieldInfo));
    if (_.isArray(fieldInfo)) {
      setListField(_.cloneDeep(fieldInfo));
      const tmp = [];
      fieldInfo.forEach(e => {
        tmp.push(StringUtils.getFieldLabel(e, 'fieldLabel'));
      });
      setTitleColumn(tmp);
    } else {
      setListField([fieldInfo]);
      setTitleColumn([StringUtils.getFieldLabel(fieldInfo, 'fieldLabel')]);
    }
  }, [props.fieldInfo, props.mode]);

  return <>{props.contentHeader && props.contentHeader(listField, titleColumn.join(' '), isSpecialField)}</>;
};

export default ListHeader;
