import React, { useEffect, useMemo, useCallback } from 'react';
import { DragSourceMonitor, ConnectDragSource, ConnectDragPreview } from 'react-dnd';
import { DragSource, DragSourceConnector } from 'react-dnd';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ScreenMode } from 'app/config/constants';
import _ from 'lodash';
import { isColumnCheckbox } from '../../dynamic-list-helper';
import { DEFINE_FIELD_TYPE, DND_ITEM_TYPE } from '../../../constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { isUrlify } from 'app/shared/util/string-utils';
import { setTimeout } from 'timers';
import {  compose, path, max, map } from 'ramda';
import { FIELD_BELONG } from 'app/config/constants';

export interface IListContentRowProps {
  record: any; // record for row
  rowClassName: string; // row style class
  modeDisplay: number; // mode edit or display get from ScreenMode enum
  fields: any; // field info in database get from api
  keyRecordId?: string; // field name of record id in list record
  rowHeight?: number; // set row Height
  formatFieldGroup?: { fields: string[]; titleField: string; mergeView: boolean; mergeEdit: boolean }[];
  isResizingColumn?: boolean;
  valueEditShinkRow?: any,
  contentCell?: (rowData, field, isLastColumn) => JSX.Element; // render element from parent component
  onClickCell?: (recordId: number, fieldId: number) => void; // callback when user click row
  onChangeRowHeight?: (row: { recordId; rowHeight }) => void;
  onMouseRowEnter?: (event) => void; // callback when
  onMouseRowLeave?: (event) => void; // callback when
  onDragRow: (sourceRow, targetDepartment) => void; // callback when user drag row
  isDragging: boolean; // for drag & drop, user don't need pass component
  connectDragSource: ConnectDragSource; // for drag & drop, user don't need pass component
  connectDragPreview: ConnectDragPreview; // for drag & drop, user don't need pass component'
  recordCheckList?: any; // for drag & drop list item select
  isLock: boolean; // isTableLock
  tableLock: any;
  tableFree: any;
  headerLock: any;
  headerFree: any;
  indexOfRow?: number;
  isLastRecord?: boolean;
  onChangeCellWidth: () => void;
  belong?: number; // belong of module function (field-belong)
}

const ListContentRow: React.FC<IListContentRowProps> = props => {
  const tableLockMemo = useMemo(() => { return props.tableLock }, [props.tableLock]);
  const tableFreeMemo = useMemo(() => { return props.tableFree }, [props.tableFree]);
  const headerLockMemo = useMemo(() => { return props.headerLock }, [props.headerLock]);
  const headerFreeMemo = useMemo(() => { return props.headerFree }, [props.headerFree]);
  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  const hasDataFile = data => {
    let hasData = false;
    try {
      const files = _.isString(data) ? JSON.parse(data) : data;
      if (files && Array.isArray(files) && files.length > 0) {
        hasData = true;
      }
    } catch (e) {
      hasData = false;
    }
    return hasData;
  };

  const isDisableClickField = field => {
    if (isColumnCheckbox(field)) {
      return true;
    }

    if (_.isArray(field)) {
      for (let i = 0; i < field.length; i++) {
        if (
          (field[i].fieldType.toString() === DEFINE_FIELD_TYPE.FILE && hasDataFile(getValueProp(props.record, field[i].fieldName))) ||
          field[i].fieldType.toString() === DEFINE_FIELD_TYPE.LINK || 
          field[i].fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
          field[i].fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ||
          (props.belong && props.belong === FIELD_BELONG.BUSINESS_CARD && field[i].fieldName === 'company_name')
        ) {
          return true;
        }
      }
    } else {
      if (props.belong && props.belong === FIELD_BELONG.BUSINESS_CARD && field.fieldName === "business_card_image_path"){
        return true;
      }
      if (
        (field.fieldType.toString() === DEFINE_FIELD_TYPE.FILE && hasDataFile(getValueProp(props.record, field.fieldName))) ||
        field.fieldType.toString() === DEFINE_FIELD_TYPE.LINK || 
        field.fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
        field.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ||
        (field.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA && isUrlify(getValueProp(props.record, field.fieldName)))
      ) {
        return true;
      }
    }
    return false;
  };

  const onClickListCell = (ev, field: any) => {
    const tagIgnore = ["a", "i", "button"];
    if ( props.onClickCell && (ev.target instanceof HTMLTableCellElement || 
      (props.modeDisplay === ScreenMode.DISPLAY && !tagIgnore.includes(ev.target.nodeName.toLowerCase())))) {
      let nameKey = 'unk';
      if (props.keyRecordId) {
        nameKey = props.keyRecordId;
      }
      const recordId = getValueProp(props.record, nameKey);
      let params = null;
      if (_.isArray(field)) {
        params = field.map(e => e.fieldId);
      } else {
        params = isColumnCheckbox(field) ? null : field.fieldId;
      }
      props.onClickCell(recordId, isDisableClickField(field) ? null : params);
    }
  };

  const calculatorHeightRow = (idx, isLastColumn) => {
    if (idx === 0 && props.isLock && props.modeDisplay === ScreenMode.EDIT) {
      if (tableLockMemo && tableLockMemo.current && tableLockMemo.current.rows && tableLockMemo.current.rows[props.indexOfRow]) {
        tableLockMemo.current.rows[props.indexOfRow].style = [``];
      }
      if (tableFreeMemo && tableFreeMemo.current && tableFreeMemo.current.rows && tableFreeMemo.current.rows[props.indexOfRow]) {
        tableFreeMemo.current.rows[props.indexOfRow].style = [``];
      }
    }
    if (isLastColumn && !props.isLock) {
      setTimeout(() => {
        if (tableLockMemo && tableLockMemo.current && tableFreeMemo && tableFreeMemo.current) {
          if (!tableLockMemo.current.rows || !tableLockMemo.current.rows[props.indexOfRow]
            || !tableFreeMemo.current.rows || !tableFreeMemo.current.rows[props.indexOfRow]) {
            return;
          }
          const leftHeight = tableLockMemo.current.rows[props.indexOfRow].getClientRects()[0].height;
          const rightHeight = tableFreeMemo.current.rows[props.indexOfRow].getClientRects()[0].height;
          if (leftHeight < rightHeight) {
            tableLockMemo.current.rows[props.indexOfRow].style = [`height : ${rightHeight}px`];
            tableFreeMemo.current.rows[props.indexOfRow].style = [`height : ${rightHeight}px`];
          } else if (leftHeight > rightHeight) {
            tableLockMemo.current.rows[props.indexOfRow].style = [`height : ${leftHeight}px`];
            tableFreeMemo.current.rows[props.indexOfRow].style = [`height : ${leftHeight}px`];
          }
        }
      }, 200);
    }
  }

  const getMaxWidthOfChildren = useCallback(
    (table, pathVal) => compose(
      allWidth => max(...allWidth),
      map(i =>
        path(
          [0, 'width'],
          i.getClientRects()
        )
      ),
       path(pathVal)
    )(table),
    []
  );

  const calculatorWidthItemRow = (idx, isLastRecord, isAreaLock) => {
    if (!isLastRecord) {
      return;
    }
    if (isAreaLock) {
      // render area lock
      setTimeout(() => {
        if (tableLockMemo && tableLockMemo.current && headerLockMemo && headerLockMemo.current) {
          if (!tableLockMemo.current.rows[props.indexOfRow] || !tableLockMemo.current.rows[props.indexOfRow].cells[idx] || idx === 0) {
            return;
          }
          let widthBody = tableLockMemo.current.rows[props.indexOfRow].cells[idx].children[0].getClientRects()[0].width;
          if (props.modeDisplay === ScreenMode.EDIT) {
            try {
              if (props.indexOfRow === 0) {
                const widthBodyOfRow = getMaxWidthOfChildren(tableLockMemo, [
                  'current',
                  'rows',
                  0,
                  'cells',
                  idx,
                  'children',
                  0,
                  'children',
                  0,
                  'children'
                ]);
                widthBody = max(widthBody, widthBodyOfRow);
              } else {
                for (let index = 0; index < props.indexOfRow; index++) {
                  const widthBodyOfRow = getMaxWidthOfChildren(tableLockMemo, [
                    'current',
                    'rows',
                    index,
                    'cells',
                    idx,
                    'children',
                    0,
                    'children',
                    0,
                    'children'
                  ])
                  widthBody = max(widthBody, widthBodyOfRow);
                }
              }     
            } catch (error) {
              // continue
            }                    
          } else {
            widthBody = headerLockMemo.current.rows[0].cells[idx].children[0].getClientRects()[0].width;
          }          
          headerLockMemo.current.rows[0].cells[idx].children[0].style = [`width : ${widthBody}px`];
          tableLockMemo.current.rows[0].cells[idx].children[0].style = [`width : ${widthBody}px`];
        }
        props.onChangeCellWidth();
      }, 100);
    } else {
      // render area free
      setTimeout(() => {
        if (tableFreeMemo && tableFreeMemo.current && headerFreeMemo && headerFreeMemo.current) {
          if (!tableFreeMemo.current.rows[props.indexOfRow] || !tableFreeMemo.current.rows[props.indexOfRow].cells[idx]) {
            return;
          }
          let widthBodyFree = compose(
            path([0, 'width']),
            i => i.getClientRects(),
            path(['current', 'rows', props.indexOfRow, 'cells', idx, 'children', 0])
          )(tableFreeMemo)
          if (props.modeDisplay === ScreenMode.EDIT) {
            try {
              if (props.indexOfRow === 0) {
                const widthBodyFreeOfRow  = getMaxWidthOfChildren(tableFreeMemo, [
                  'current',
                  'rows',
                  0,
                  'cells',
                  idx,
                  'children',
                  0,
                  'children',
                  0,
                  'children'
                ]);
                widthBodyFree = max(widthBodyFree, widthBodyFreeOfRow);
              } else {
                for (let index = 0; index < props.indexOfRow; index++) {
                  const widthBodyFreeOfRow = getMaxWidthOfChildren(tableFreeMemo, [
                    'current',
                    'rows',
                    index,
                    'cells',
                    idx,
                    'children',
                    0,
                    'children',
                    0,
                    'children'
                  ])
                  widthBodyFree = max(widthBodyFree, widthBodyFreeOfRow);
                }
              }
            } catch (error) {
              // console
            }           
          } else {
            widthBodyFree = compose(
              path([0, 'width']),
              i => i.getClientRects(),
              path(['current', 'rows', 0, 'cells', idx, 'children', 0])
            )(headerFreeMemo)
          }          
          headerFreeMemo.current.rows[0].cells[idx].children[0].style = [`width : ${widthBodyFree}px`];
          tableFreeMemo.current.rows[0].cells[idx].children[0].style = [`width : ${widthBodyFree}px`];
        }
        props.onChangeCellWidth();
      }, 100);
    }
  }

  const renderWrapCell = (field, idx, isLastColumn) => {
    // calculator height
    calculatorHeightRow(idx, isLastColumn);
    calculatorWidthItemRow(idx, props.isLastRecord, props.isLock);
    let dataWidth = null;
    if (_.isArray(field)) {
      dataWidth = field.map(e => e.fieldId).join(',');
    } else {
      dataWidth = field.fieldId;
    }
    return (
      <td key={idx} onClick={e => onClickListCell(e, field)} data-tag={dataWidth}>
        {props.contentCell && props.contentCell(props.record, field, isLastColumn)}
      </td>
    );
  };

  const renderRow = () => {
    return (
      <>
        {props.fields.map((field, idx) => {
          return renderWrapCell(field, idx, idx === props.fields.length - 1);
        })}
      </>
    );
  };

  const isDisplayMode = () => {
    if (props.modeDisplay === ScreenMode.DISPLAY) {
      return true;
    }
    return false;
  };

  const onMouseRowEnter = event => {
    if (props.onMouseRowEnter) {
      props.onMouseRowEnter(event);
    }
  };
  const onMouseRowLeave = event => {
    if (props.onMouseRowLeave) {
      props.onMouseRowLeave(event);
    }
  };

  if (props.onDragRow && !props.isResizingColumn) {
    return props.connectDragSource(
      <tr className={props.rowClassName} draggable={isDisplayMode()} onMouseEnter={onMouseRowEnter} onMouseLeave={onMouseRowLeave}>
        {renderRow()}
      </tr>
    );
  }

  return (
    <tr className={props.rowClassName} draggable={isDisplayMode()} onMouseEnter={onMouseRowEnter} onMouseLeave={onMouseRowLeave}>
      {renderRow()}
    </tr>
  );
};

export default DragSource(
  DND_ITEM_TYPE.DYNAMIC_LIST_ROW,
  {
    beginDrag: (props: IListContentRowProps) => ({ type: DND_ITEM_TYPE.DYNAMIC_LIST_ROW, sourceRow: props.recordCheckList.filter(e => e.isChecked === true).length > 1 ? props.recordCheckList.filter(e => e.isChecked === true) : [props.record] }),
    endDrag(props: IListContentRowProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        if (dropResult.targetCategory) {
          props.onDragRow(item.sourceRow, dropResult.targetCategory);
        }
        if (dropResult.targetDepartment) {
          props.onDragRow(item.sourceRow, dropResult.targetDepartment);
        }
        if (dropResult.targetGroup) {
          props.onDragRow(item.sourceRow, dropResult.targetGroup);
        }
        if (dropResult.targetListCustomer) {
          props.onDragRow(item.sourceRow, dropResult.targetListCustomer);
        }
        if(dropResult.targetBusinessCardList) {
          props.onDragRow(item.sourceRow, dropResult.targetBusinessCardList);
        }
      } else {
        props.onDragRow(null, null);
      }
    },
    canDrag(props: IListContentRowProps, monitor: DragSourceMonitor) {
      const arrListCheckTmp = props.recordCheckList.filter(e => e.isChecked === true);
      let arrListCheck = []
      if (arrListCheckTmp.length > 0) {
        arrListCheck = arrListCheckTmp;
      } else {
        arrListCheck.push(props.record)
      }

      const listQuitJob = arrListCheck.filter(e => (e.employeeStatus === 1 || e.employee_status === 1));
      if (listQuitJob.length > 0) {
        return false;
      }

      if (arrListCheck.length > 0) {
        return true;
      }

      return false;
    },
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  })
)(ListContentRow);
