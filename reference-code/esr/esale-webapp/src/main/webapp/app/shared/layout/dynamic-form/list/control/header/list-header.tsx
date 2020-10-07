import React, { useState, useRef, useEffect } from 'react';
import useEventListener from 'app/shared/util/use-event-listener';
import styled from 'styled-components';
import _ from 'lodash';
import StringUtils from 'app/shared/util/string-utils';
import { ScreenMode } from 'app/config/constants';
import ListHeaderDnD from './list-header-dnd';
import { getColumnWidth, isColumnCheckbox, isSpecialColumn } from '../../dynamic-list-helper';
import { DEFINE_FIELD_TYPE } from '../../../constants';

const Resizer = styled.span`
  display: block !important;
  position: absolute !important;
  top: 0px !important;
  right: 0px !important;
  left: auto !important;
  width: 7px !important;
  height: 100% !important;
  cursor: col-resize !important;
  z-index: 99;
`;

interface IResizerColumnProps {
  elementKey: any;
  lineHeight: number;
  fieldId: number;
  columnWidth: number;
  onResizingColumn?: (isResizing: boolean) => void;
  onResizeColumnWidth?: (fieldWidth: { fieldId; columnWidth }[]) => void;
}

const ResizerColumn = (props: IResizerColumnProps) => {
  const spanRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleMouseMove = evt => {
    if (!spanRef || !spanRef.current) {
      return;
    }
    const mX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    if (!dragging) {
      return;
    }
    const moveDiff = mX - spanRef.current.closest('th').getBoundingClientRect().left;
    if (moveDiff > 10) {
      const el = window.document.getElementById('div-line-id');
      if (el) {
        el.style.left = mX + 'px';
      }
    }
  };

  const startResize = evt => {
    if (!spanRef || !spanRef.current) {
      return;
    }
    setDragging(true);
    if (props.onResizingColumn) {
      props.onResizingColumn(true);
    }
    const mX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    setStartX(mX);
    document.body.style.cursor = 'col-resize';
    if (!window.document.getElementById('div-line-id')) {
      const el = window.document.createElement('div');
      if (el) {
        el.id = 'div-line-id';
        el.style.width = '1px';
        el.style.height = `${props.lineHeight}px`; // spanRef.current.closest('table').clientHeight - 10 + 'px';
        el.style.backgroundColor = 'lightgray';
        el.style.display = 'block';
        el.style.position = 'absolute';
        el.style.top = spanRef.current.closest('th').getBoundingClientRect().top + 'px';
        el.style.zIndex = '9999';
        el.style.left = mX + 'px';
        window.document.body.appendChild(el);
      }
    }
  };

  const endResize = evt => {
    if (props.onResizingColumn) {
      props.onResizingColumn(false);
    }
    if (!spanRef || !spanRef.current) {
      return;
    }
    if (dragging) {
      const mX = evt.touches ? evt.touches[0].clientX : evt.clientX;
      setDragging(false);
      if (window.document.getElementById('div-line-id')) {
        window.document.body.removeChild(window.document.getElementById('div-line-id'));
      }
      document.body.style.cursor = '';

      const columnsWidth = [];
      const width = _.toNumber(spanRef.current.children[0].getAttribute('width')) + (mX - startX);
      if (width < 10) {
        return;
      }
      columnsWidth.push({ fieldId: spanRef.current.children[0].value, columnWidth: width });
      if (props.onResizeColumnWidth) {
        props.onResizeColumnWidth(columnsWidth);
      }
    }
  };

  useEventListener('mousemove', handleMouseMove);
  useEventListener('mouseup', endResize);
  useEventListener('touchmove', handleMouseMove);
  useEventListener('touchend', endResize);

  return (
    <Resizer ref={spanRef} onMouseDown={startResize} onTouchStart={startResize}>
      <input type="hidden" className="resizer-fieldId" value={props.fieldId} key={props.elementKey} width={props.columnWidth} />
    </Resizer>
  );
};

export interface IListHeaderProps {
  keyId?: any;
  field: any;
  mode?: number;
  fieldResizing?: any[];
  tableHeight?: number;
  columnsWidth?: number[];
  disableEditHeader?: boolean; // can edit header? (resize or move order)
  contentHeader?: (field: any, titleColumn: string, specialField?: boolean) => JSX.Element;
  onFieldResizing?: (fieldResizing: any[]) => void; // calback when user resizing column
  onResizeColumnWidth?: (fieldWidth: { fieldId; columnWidth }[]) => void; // calback when user resize column
  onReorderColumn?: (fieldDrag: any, fieldDrop: any) => void; // calback when user reorder column
  isResultsSearch?: boolean; // is popup Results Search
}

const ListHeader: React.FC<IListHeaderProps> = props => {
  const [listField, setListField] = useState([]);
  const [isSpecialField, setIsSpecialField] = useState(false);
  // const [mergeColumn, setMergeColumn] = useState(false);
  const [titleColumn, setTitleColumn] = useState([]);
  const [resizing, setResizing] = useState(false);
  const [dragging,] = useState(false);
  const [isCheckbox] = useState(isColumnCheckbox(props.field));
  const [dndStatus, setDndStatus] = useState({ field: {}, dragging: false, canDrop: false, over: false });
  const [columnsWidth, setColumnsWidth] = useState([]);

  useEffect(() => {
    setIsSpecialField(isSpecialColumn(props.field));
    if (_.isArray(props.field)) {
      setListField(_.cloneDeep(props.field));
      const tmp = [];
      props.field.forEach(e => {
        tmp.push(StringUtils.getFieldLabel(e, 'fieldLabel'));
      });
      setTitleColumn(tmp);
    } else {
      setListField([props.field]);
      setTitleColumn([StringUtils.getFieldLabel(props.field, 'fieldLabel')]);
      // setMergeColumn(false);
    }
  }, [props.field, props.mode]);

  useEffect(() => {
    setColumnsWidth(props.columnsWidth);
  }, [props.columnsWidth]);

  useEffect(() => {
    if (props.mode === ScreenMode.EDIT) {
      setColumnsWidth([-1]);
    }
  }, [props.mode])

  useEffect(() => {
    setResizing(props.fieldResizing && props.fieldResizing.length > 0)
  }, [props.fieldResizing])

  const onDragDropColumnField = (drag, drop) => {
    if (props.onReorderColumn) {
      props.onReorderColumn(drag, drop);
    }
  };

  const onDragDroppingColumn = (dnd: { field: any; dragging: boolean; canDrop: boolean; over: boolean }) => {
    setDndStatus(dnd);
  };

  const onResizingColumn = (isResizing) => {
    setResizing(isResizing);
    if (props.onFieldResizing) {
      props.onFieldResizing(isResizing ? listField : null);
    }
  }

  const renderOneColumn = (field) => {
    if (isCheckbox) {
      return (
        <th key={0}>
          <div className="text-over pad" style={{ width: `${getColumnWidth(field)}px` }}>
            {props.contentHeader && props.contentHeader(field, null, false)}
          </div>
        </th>
      );
    } else {
      const fieldId = _.isArray(field) ? (field.length > 0 ? field[0].fieldId : 0) : field.fieldId;
      const isOverCanDrop = _.get(dndStatus.field, 'fieldId') === fieldId && dndStatus.over && !dndStatus.dragging;
      let styleClass = _.get(dndStatus.field, 'fieldId') === fieldId && dndStatus.dragging ? 'none' : '';
      styleClass = `${styleClass} ${isOverCanDrop ? 'th-drag-drop' : ''}`;
      const divWrapStyle = {};
      if (props.mode !== ScreenMode.EDIT) {
        divWrapStyle['width'] = `${getColumnWidth(field)}px`;
      } else {
        if (columnsWidth && columnsWidth.length > 0) {
          divWrapStyle['width'] = `${columnsWidth[0]}px`;
        }
      }
      const disableColumn = props.disableEditHeader || props.mode === ScreenMode.EDIT || dragging || isColumnCheckbox(field);
      const disableDnd = !props.isResultsSearch ? (disableColumn || resizing) : true;

      return (
        <th className={styleClass} key={fieldId}>
          <div className={`text-over pad`} style={divWrapStyle}>
            <ListHeaderDnD
              fieldInfo={field}
              titleColumn={titleColumn.join(" ")}
              onDragDropColumnField={onDragDropColumnField}
              disableEditHeader={disableDnd}
              mode={props.mode}
              onDnDingColumn={onDragDroppingColumn}
            >
              {props.contentHeader && props.contentHeader(field, titleColumn.join(" "), isSpecialField)}
            </ListHeaderDnD>
          </div>
          {!disableColumn &&
            <ResizerColumn
              elementKey={fieldId}
              fieldId={_.isArray(field) ? field.map(e => e.fieldId) : field.fieldId}
              columnWidth={getColumnWidth(field)}
              lineHeight={props.tableHeight}
              onResizingColumn={onResizingColumn}
              onResizeColumnWidth={props.onResizeColumnWidth}
            />
          }
        </th>
      );
    }
  };

  return (
    <>
      {isColumnCheckbox && renderOneColumn(props.field)}
      {!isColumnCheckbox && renderOneColumn(listField)}
    </>
  );
};

export default ListHeader;
