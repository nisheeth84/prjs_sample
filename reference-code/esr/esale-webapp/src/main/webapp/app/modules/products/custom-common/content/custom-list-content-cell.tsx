import React from 'react';
import { ConnectDropTarget, DragSource, DragSourceMonitor, DragSourceConnector, ConnectDragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import { FIELD_BELONG, ScreenMode, ControlType } from 'app/config/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { getValueProp } from 'app/shared/util/entity-utils';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import StringUtils, { autoFormatNumber ,jsonParse } from 'app/shared/util/string-utils';
import { downloadFile } from 'app/shared/util/file-utils';
import { translate } from 'react-jhipster';
import { calculate } from 'app/shared/util/calculation-utils';

import { autoFormatTime, tzToUtc, timeTzToUtc, timeUtcToTz, utcToTz, switchFormatDate, TYPE_SWICH_FORMAT } from 'app/shared/util/date-utils';
import { getLinkListModule } from 'app/modules/modulo-bridge';
import { IFieldDynamicStyleClass } from 'app/shared/layout/dynamic-form/control-field/interface/field-dynamic-style-class';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { parseRelationIds, getColumnWidth } from 'app/shared/layout/dynamic-form/list/dynamic-list-helper';
import { ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import FieldDetailViewSelectOrg from 'app/shared/layout/dynamic-form/control-field/detail/field-detail-view-select-org';
import FieldDetailViewTextArea from 'app/shared/layout/dynamic-form/control-field/detail/field-detail-view-text-area';


export interface IListContentCellProps {
  belong?: number; // belong of module function (field-belong)
  textCell?: string; // text display in edit mode
  keyRecordId?: string; // field name of record id in list record
  targetId?: string; // field id for drag & drop
  fieldInfo: any;
  record?: any;
  fieldLinkHolver?: { fieldName; link; hover; action: { text; target }[] }[]; // TODO waiting confirm required
  errorInfo?: { rowId; item; errorCode; errorMsg; errorParams }; // object error
  modeDisplay?: number; // edit or display
  fieldStyleClass?: IFieldDynamicStyleClass; // style class for custom style every cell when edit
  isCheck?: boolean; // status check
  rowHeight?: number; // set row Height
  relationData?: any[];
  updateFiles?: (files) => void;
  showMessage?: (message, type) => void;
  updateStateField?: (itemData, type, itemEditValue , idx) => void; // callback when user edit value cell
  handleItemChecked?: (recordId, isCheck, updatedDate) => void; // callback when user click checkbox
  dragCell?: (sourceDrag, targetDrag) => void; // callback when drag cell
  getCustomFieldValue?: (record: any, field: any, mode: number) => any;
  connectDropTarget: ConnectDropTarget; // for drag & drop, user don't need pass compoment
  canDrop: boolean; // for drag & drop, user don't need pass compoment
  isOver: boolean; // for drag & drop, user don't need pass compoment
  isDragging?: boolean; // for drag & drop, user don't need pass compoment
  connectDragSource?: ConnectDragSource; // for drag & drop, user don't need pass compoment
}

const ListContentCell: React.FC<IListContentCellProps> = props => {
  const getFieldLinkHover = () => {
    if (!props.fieldLinkHolver) {
      return null;
    }
    const fieldLinkIndex = props.fieldLinkHolver.findIndex(
      e => StringUtils.equalPropertyName(e.fieldName, props.fieldInfo.fieldName) && (e.hover || e.link || e.action)
    );
    if (fieldLinkIndex < 0) {
      return null;
    }
    return props.fieldLinkHolver[fieldLinkIndex];
  };

  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      if (props.showMessage) {
        props.showMessage(translate('messages.ERR_COM_0042', { 0: fileName }), 'error');
      }
    });
  };

  const renderComponentDisplay = () => {
    if(props.fieldInfo.fieldName === "employee_icon"){
      const icon = getValueProp(props.record, 'employee_icon');
      return <a><img className = "avatar" src = {icon ? icon["fileUrl"] : ""}></img></a>
    }
    if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL) {
      return <a href={`mailto:${props.textCell}`}>{props.textCell}</a>;
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.ADDRESS) {
      if (props.fieldInfo.isLinkedGoogleMap) {
        return <a href={`http://google.com/maps/search/${props.textCell}`}>{props.textCell}</a>;
      } else {
        return <>{props.textCell}</>
      }
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.FILE) {
      let files = [];
      try {
        const tmp = getValueProp(props.record, props.fieldInfo.fieldName);
        files = _.isString(tmp) ? JSON.parse(tmp) : tmp;
        if (!files || !Array.isArray(files)) {
          files = [];
        }
      } catch (e) {
        files = [];
      }
      return (
        <>
          {files.map((file, idx) => (
            <>
              <a className="file" onClick={evt => handleClickFile(getValueProp(file, 'file_name'), getValueProp(file, 'file_url'))} >
                {getValueProp(file, 'file_name')}
              </a>
              {idx < files.length - 1 && ', '}
            </>
          ))}
        </>
      );
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
      let nameKey = "unk";
      if (props.keyRecordId) {
        nameKey = props.keyRecordId;
      }
      const id = getValueProp(props.record, nameKey);
      return <FieldDetailViewSelectOrg ogranizationValues={props.record[props.fieldInfo.fieldName]} fieldInfo={props.fieldInfo} recordId={id}/>
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA) {
      return <FieldDetailViewTextArea text={getValueProp(props.record, props.fieldInfo.fieldName)}/>
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK) {
      const link = jsonParse(props.textCell)
      const target = props.fieldInfo.linkTarget === 0 ? 'blank' : '';
      if (!link) {
        return (
          <a rel="noopener noreferrer" target={target} href={props.fieldInfo.defaultValue} className="text-blue">
            {props.fieldInfo.urlText}
          </a>
        );
      } else {
        return (
          <a rel="noopener noreferrer" target={target} href={link['url_target']}>
            {link['url_text']}
          </a>
        );
      }
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      // let value
      // console.log("nnn", parseInt(calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace), 10));
      
      // if(_.isNumber(parseInt(calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace), 10))){
      //   value = autoFormatNumber(calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace),props.fieldInfo.decimalPlace)
      // }else {
      //   value = calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace)
      // }
      // return <>{value}</>
      const resultCalculate = calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace);
      return isNaN(resultCalculate as any) ? resultCalculate : autoFormatNumber(resultCalculate, props.fieldInfo.decimalPlace);
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TIME) {
      return <>{timeUtcToTz(props.textCell)}</>;
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME) {
      return <>{utcToTz(props.textCell, 0)}</>;
    }  else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE){
      return <>{props.textCell? switchFormatDate(props.textCell, TYPE_SWICH_FORMAT.DEFAULT_TO_USER): ""}</>
      // return <>{CommonUtil.convertToDate(props.textCell)}</>
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
      if (props.fieldInfo.relationData && props.fieldInfo.relationData.extensionBelong) {
        const fBelong = props.fieldInfo.relationData.extensionBelong
        const ids = parseRelationIds(getValueProp(props.record, props.fieldInfo.fieldName))
        return (
          <>{ids.map(id =>
            <Link key={id} to={getLinkListModule(fBelong)} ><span>{id}</span></Link>
          )}</>
        ) 
      }
    }
    else {
      const fieldLink = getFieldLinkHover();
      const isArray =
        Array.isArray(getValueProp(props.record, props.fieldInfo.fieldName)) &&
        props.fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.CHECKBOX &&
        props.fieldInfo.fieldType.toString() !== DEFINE_FIELD_TYPE.MULTI_SELECTBOX;
      if (isArray) {
        const display = [];
        const records = getValueProp(props.record, props.fieldInfo.fieldName);
        records.forEach((e, i) => {
          if (fieldLink && fieldLink.link) {
            display.push(<Link to={fieldLink.link}>{e}</Link>);
          } else {
            display.push(<>{_.isNil(e) ? "" : _.toString(e)}</>);
          }
        });
        return <>{display}</>;
      } else {
        if (fieldLink && fieldLink.link) {
          return <Link to={fieldLink.link}>{props.textCell}</Link>;
        } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC) {
          return <>{autoFormatNumber(props.textCell,props.fieldInfo.decimalPlace)}</>;
        } else {
          return <>{props.textCell}</>;
        }
      }
    }
    return <></>;
  };

  const renderComponent = () => {
    let nameKey = 'unk';
    if (props.keyRecordId) {
      nameKey = props.keyRecordId;
    }
    const cellId = `dynamic_cell_${getValueProp(props.record, nameKey)}_${props.fieldInfo.fieldId}`;
    const styleCell = { height: `${props.rowHeight}px` };
    let classCell = '';
    if (props.modeDisplay !== ScreenMode.EDIT) {
      classCell += ' text-over text-ellipsis';
      styleCell['width'] = getColumnWidth(props.fieldInfo);
      if(props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC 
      || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION ){
        classCell += ' text-right'
      }
    } else {
      classCell += ' text-form-edit';
    }

    if (props.belong && props.belong === FIELD_BELONG.PRODUCT 
      && props.fieldInfo.fieldName === 'product_image_name') {
        const imgSrc = getValueProp(props.record, 'product_image_path');
        return (
          <div id={cellId} style={styleCell} className={classCell}>
            {imgSrc ? <a className="image_table" title="" ><img className="product-item" src={imgSrc} alt="" title=""/></a> :
            <a className="image_table no_image_table" title="" ><img className="product-item" src="../../content/images/noimage.png" alt="" title=""/></a>}
          </div>
        )
    }

    if (!props.modeDisplay || props.modeDisplay === ScreenMode.DISPLAY) {
      return (
        <div id={cellId} style={styleCell} className={classCell}>
          {renderComponentDisplay()}
        </div>
      );
    } else {
      const rowData = { key: '', fieldValue: null };
      rowData.key = getValueProp(props.record, nameKey);
      if (props.record) {
        let fieldValue = undefined;
        if (props.getCustomFieldValue) {
          fieldValue = props.getCustomFieldValue(props.record, props.fieldInfo, props.modeDisplay);
        }
        if (!_.isUndefined(fieldValue)) {
          rowData.fieldValue = fieldValue;
        } else {
          if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
            rowData.fieldValue = props.record;
          } else {
            rowData.fieldValue = getValueProp(props.record, props.fieldInfo.fieldName);
          }
        }
      }
      return (
        <div id={cellId} style={styleCell} className={classCell}>
          <DynamicControlField
            showFieldLabel={false}
            errorInfo={props.errorInfo}
            controlType={ControlType.EDIT_LIST}
            isDnDAddField={false}
            isDnDMoveField={false}
            fieldInfo={props.fieldInfo}
            elementStatus={rowData}
            fieldStyleClass={props.fieldStyleClass}
            updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => {}}
            updateFiles={props.updateFiles}
            idUpdate={getValueProp(props.record, nameKey)}
          />
        </div>
      );
    }
  };
  
  return props.connectDropTarget(renderComponent());
};

const dragSourceHOC = DragSource(
  ITEM_TYPE.CARD,
  {
    beginDrag: (props: IListContentCellProps) => ({}),
    endDrag(props: IListContentCellProps, monitor: DragSourceMonitor) {
      const item = monitor.getItem();
      const dropResult = monitor.getDropResult();
      if (dropResult) {
        props.dragCell(item.sourceDrag, dropResult.targetDrag);
      }
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
);

const dropTargetHOC = DropTarget(
  [ITEM_TYPE.CARD],
  {
    drop: ({ fieldInfo }: IListContentCellProps) => ({
      target: fieldInfo
    }),
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
);

export default dropTargetHOC(dragSourceHOC(ListContentCell));
