import React, { useState, useRef } from 'react';
import _ from 'lodash';
import { ActionListHeader } from '../../../constants';
import { isColumnCheckbox } from '../../dynamic-list-helper';
import { TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import Popover from 'app/shared/layout/common/Popover';
import { ScreenMode } from 'app/config/constants';
import useEventListener from 'app/shared/util/use-event-listener';
import StringUtils from 'app/shared/util/string-utils';

export interface IListHeaderContentProps {
  mode: any;
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
  modeSelected?: TagAutoCompleteMode;
}

const ListHeaderContent: React.FC<IListHeaderContentProps> = props => {
  const [openMenuAction] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [checkArrow, setCheckArrow] = useState(false);
  const refArrow = useRef(null);

  const handleAllChecked = event => {
    if (props.handleAllChecked) {
      props.handleAllChecked(event.target.checked);
      setCheckArrow(false);
    }
  };
  const onHeaderActionMenu = (isOpen: boolean, type: ActionListHeader, params?) => {
    if (props.onHeaderAction) {
      props.onHeaderAction(isOpen, type, params);
    }
  };

  const onOpenMenuHeader = (ev, action) => {
    onHeaderActionMenu(!openMenuAction, action, { fieldInfo: props.fieldInfo, x: ev.clientX, y: ev.clientY });
  };

  const handleUserKeyDown = (e) => {
    if (refArrow && refArrow.current && !refArrow.current.contains(e.target)) {
      setCheckArrow(false);
    }
  }

  useEventListener('mousedown', handleUserKeyDown);

  let classNameCheckHeader = "icon-check";
  if (props.isCheckAll) {
    classNameCheckHeader = "icon-check icon-check-all";
  }
  if (props.isCheckItem && props.haveUncheckItem) {
    classNameCheckHeader = "icon-check icon-check-horizontal"
  }

  if (isColumnCheckbox(props.fieldInfo) && props.modeSelected !== TagAutoCompleteMode.Single) {
    return (
      <>
        <div title="" className={props.isCheckItem || checkArrow ? "button-pull-down-check-wrap active" : "button-pull-down-check-wrap"}>
          <div title="" className="button-pull-down-check">
            <label className={classNameCheckHeader}>
              <input className="hidden" type="checkbox" onChange={() => { }} onClick={handleAllChecked} checked={props.isCheckAll} /><i></i>
            </label>
          </div>
          <div title="" className="button-pull-down-check option" ref={refArrow}  onClick={ev => {setCheckArrow(!checkArrow); onOpenMenuHeader(ev, ActionListHeader.OPEN_SELECT_CHECKBOX)}}>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </>
    );
  }

  const displayIconFilter = () => {
    if (props.filter) {
      const isFilter = (props.filter.valueFilter && props.filter.valueFilter.length > 0) || props.filter.isSearchBlank || ((props.filter.valueFilter === '' || props.filter.valueFilter === '[]') && !Object.prototype.hasOwnProperty.call(props.filter, 'isSearchBlank'));
      const isAsc = props.filter.sortAsc;
      const isDesc = props.filter.sortDesc;
      if (!isFilter && !isAsc && !isDesc) {
        return <></>;
      }
      const iconClass = `icon-small-primary icon${isFilter ? '-filter' : ''}${
        isAsc ? '-descending' : isDesc ? '-ascending' : '-default'
        }` + '';
      return <a className={iconClass} />;
    } else {
      return <></>;
    }
  };

  const getTitleContent = () => {
    if (props.specialColumn && props.customHeaderField) {
      const title = props.customHeaderField(props.fieldInfo);
      if (_.isUndefined(title)) {
        return <Popover x={-20} y={25}>{StringUtils.escapeSpaceHtml(props.titleColumn)}</Popover>;
      } else {
        return <>{title}</>;
      }
    } else {
      return <Popover x={-20} y={25}>{StringUtils.escapeSpaceHtml(props.titleColumn)}</Popover>;
    }
  };

  return (
    <div
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <span className={`${props.mode === ScreenMode.EDIT ?  'max-width-none ' : ''}text-ellipsis`}>{getTitleContent()}</span>
      {displayIconFilter()}
      {props.mode !== ScreenMode.EDIT &&
        <a
          className={isHover ? 'icon-small-primary icon-sort-small' : 'icon-small-primary'}
          onClick={ev => onOpenMenuHeader(ev, ActionListHeader.OPEN_FILTER)}
        />
      }
    </div>
  );
};

export default ListHeaderContent;
