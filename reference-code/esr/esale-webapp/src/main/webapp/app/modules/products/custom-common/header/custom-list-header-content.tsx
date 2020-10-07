import React from 'react';
import _ from 'lodash';
import { ActionListHeader } from 'app/shared/layout/dynamic-form/constants';
import Popover from 'app/shared/layout/common/Popover';



export interface IListHeaderContentProps {
  fieldInfo: any; // field info get in database from api
  titleColumn?: any;
  specialColumn?: boolean;
  filter?: any; // status filter header
  isCheckItem?: any; // status check/uncheck/mixcheck
  haveUncheckItem?: any; // status/ checkAll have uncheck items
  isCheckAll?: boolean; // status check/uncheck
  disableEditHeader?: boolean; // disable edit header (resize or dragndrop header)
  headerHoverOn?: (item) => void; // callback when user mouse move enter header
  headerHoverOff?: (item) => void; // callback when user mouse move leave header
  handleAllChecked?: (isCheck) => void; // callback when user check/uncheck all in header
  onHeaderAction?: (isOpen: boolean, type: ActionListHeader, param?) => void; // callback when user execute some action in header
  customHeaderField?: (field: any[] | any) => JSX.Element; // render element from parent component
}

const ListHeaderContent: React.FC<IListHeaderContentProps> = props => {
  const getTitleContent = () => {
    if (props.specialColumn && props.customHeaderField) {
      const title = props.customHeaderField(props.fieldInfo);
      if (_.isUndefined(title)) {
        return <Popover x={-20} y={25}>{props.titleColumn}</Popover>;
      } else {
        return <>{title}</>;
      }
    } else {
      return <Popover x={-20} y={25}>{props.titleColumn}</Popover>;
    }
  };

  return (
    getTitleContent()
  );
};

export default ListHeaderContent;
