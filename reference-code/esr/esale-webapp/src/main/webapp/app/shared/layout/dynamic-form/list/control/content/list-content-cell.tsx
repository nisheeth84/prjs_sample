import React from 'react';
import { ConnectDropTarget, DragSource, DragSourceMonitor, DragSourceConnector, ConnectDragSource } from 'react-dnd';
import { DropTarget } from 'react-dnd';
import { FIELD_BELONG, ScreenMode, ControlType } from 'app/config/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { getValueProp } from 'app/shared/util/entity-utils';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import StringUtils, { autoFormatNumber, jsonParse } from 'app/shared/util/string-utils';
import { downloadFile } from 'app/shared/util/file-utils';
import { translate, Storage } from 'react-jhipster';
import { calculate } from 'app/shared/util/calculation-utils';
import { IFieldDynamicStyleClass } from '../../../control-field/interface/field-dynamic-style-class';
import { DEFINE_FIELD_TYPE, ITEM_TYPE, DEFINE_FIELD_NAME_TASK, CUSTOM_OVER_FIELD_NAME_LIST } from '../../../constants';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, APP_DATE_FORMAT_ES } from 'app/config/constants';
import { isColumnCheckbox, getColumnWidth, parseRelationIds } from '../../dynamic-list-helper';
import FieldDetailViewSelectOrg from '../../../../dynamic-form/control-field/detail/field-detail-view-select-org';
import FieldDetailViewTextArea from '../../../../dynamic-form/control-field/detail/field-detail-view-text-area';
import dateFnsFormat from 'date-fns/format';
import {
  formatDate,
  utcToTz,
  DATE_TIME_FORMAT,
  timeUtcToTz,
  getDateTimeNowTz,
  getCurrentTimeRoundUp
} from 'app/shared/util/date-utils';
import { TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import Popover from 'app/shared/layout/common/Popover';
import FieldDetailViewRelation from '../../../control-field/detail/field-detail-view-relation';

export interface IListContentCellProps {
  belong?: number; // belong of module function (field-belong)
  textCell?: string; // text display in edit mode
  keyRecordId?: string; // field name of record id in list record
  targetId?: string; // field id for drag & drop
  // itemData?: any,         // field items in field info
  // valueData?: any,        // data of cell
  fieldInfo: any;
  record?: any;
  fieldLinkHolver?: { fieldName; link; hover; action: { text; target }[] }[]; // TODO waiting confirm required
  errorInfo?: { rowId; item; errorCode; errorMsg; errorParams; arrayError?: any[] }; // object error
  modeDisplay?: number; // edit or display
  fieldStyleClass?: IFieldDynamicStyleClass; // style class for custom style every cell when edit
  // for checkbox
  // isCheckBox?: boolean,   // checkbox first column
  isCheck?: boolean; // status check
  // for file
  // isFile?: boolean,
  // files?: any[],
  rowHeight?: number; // set row Height
  relationData?: any;
  updateFiles?: (files) => void;
  showMessage?: (message, type) => void;
  updateStateField?: (itemData, type, itemEditValue, idx) => void; // callback when user edit value cell
  handleItemChecked?: (recordId, isCheck, updatedDate, employeeStatus, employeeName) => void; // callback when user click checkbox
  dragCell?: (sourceDrag, targetDrag) => void; // callback when drag cell
  getCustomFieldValue?: (record: any, field: any, mode: number) => any;
  connectDropTarget: ConnectDropTarget; // for drag & drop, user don't need pass compoment
  canDrop: boolean; // for drag & drop, user don't need pass compoment
  isOver: boolean; // for drag & drop, user don't need pass compoment
  isDragging?: boolean; // for drag & drop, user don't need pass compoment
  connectDragSource?: ConnectDragSource; // for drag & drop, user don't need pass compoment
  isFocus?: boolean;  // focus error item
  modeSelected?: TagAutoCompleteMode
  isResultsSearch?: boolean;
  isLastColumn?: boolean; // for field in the last column on list
  setShowSlideImage?: (id) => void;
  deactiveId?: any;
}

const ListContentCell: React.FC<IListContentCellProps> = props => {
  const LINK_ARBITRARY = 1;
  const LINK_FIXED = 2;

  const handleItemChecked = event => {
    if (props.handleItemChecked) {
      let nameKey = 'unk';
      if (props.keyRecordId) {
        nameKey = props.keyRecordId;
      }
      const employeeFullName = {
        "employee_surname": props.record.employee_surname || null,
        "employee_name": props.record.employee_name || null
      }
      // add updatedDate to the recordCheckList
      props.handleItemChecked(getValueProp(props.record, nameKey), event.target.checked, props.record.updated_date, props.record.employee_status, employeeFullName);
    }
  };

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

  const renderRelationData = (fieldBelong: number, recordIds: number[], displayFieldId: number) => {
    if (!props.relationData || !props.relationData.records) {
      return <></>
    }
    return <FieldDetailViewRelation
      id={recordIds.join('-')}
      key={recordIds.join('-')}
      viewInList={true}
      recordIds={recordIds}
      fieldBelong={fieldBelong}
      relationData={props.relationData}
      displayFieldId={displayFieldId}
    />
    // const linksRelation = [];
    // for (let i = 0; i < recordIds.length; i++) {
    //   const idx = props.relationData.records.findIndex(e => e.recordId === recordIds[i]);
    //   if (idx < 0) {
    //     continue;
    //   }
    //   if (!props.relationData.records[idx].dataInfos || _.isNil(_.find(props.relationData.records[idx].dataInfos, { fieldId: displayFieldId }))) {
    //     continue;
    //   }
    //   const field = _.find(props.relationData.records[idx].dataInfos, { fieldId: displayFieldId });
    //   let valueDisplay = _.get(field, 'value');
    //   const fType = _.toString(_.get(field, 'fieldType'));
    //   if (fType === DEFINE_FIELD_TYPE.CHECKBOX ||  fType === DEFINE_FIELD_TYPE.RADIOBOX ||
    //       fType === DEFINE_FIELD_TYPE.SINGER_SELECTBOX || fType === DEFINE_FIELD_TYPE.MULTI_SELECTBOX) {
    //     const items = [];
    //     const itemIds = [];
    //     try {
    //       if (_.isString(valueDisplay)) {
    //         const tmp = JSON.parse(valueDisplay);
    //         if (_.isArray(tmp)) {
    //           itemIds.push(...tmp);
    //         } else {
    //           itemIds.push(tmp);
    //         }
    //       } else if (_.isArray(valueDisplay)) {
    //         itemIds.push(...valueDisplay);
    //       } else {
    //         itemIds.push(valueDisplay);
    //       }
    //     } catch (ex) {
    //       itemIds.push(valueDisplay);
    //     }
    //     itemIds.forEach(e => {
    //       if (props.relationData.fieldItems) {
    //         const idxItem = props.relationData.fieldItems.findIndex(item => _.toString(item.itemId) === _.toString(e))
    //         if (idxItem >= 0) {
    //           items.push(getFieldLabel(props.relationData.fieldItems[idxItem], 'itemLabel'));
    //         } else {
    //           items.push(e);
    //         }
    //       } else {
    //         items.push(e);
    //       }
    //     });
    //     valueDisplay = items.join(" ");
    //   } else if (fType === DEFINE_FIELD_TYPE.DATE){
    //     valueDisplay = formatDate(valueDisplay);
    //   } else if (fType === DEFINE_FIELD_TYPE.DATE_TIME){
    //     valueDisplay = utcToTz(valueDisplay, DATE_TIME_FORMAT.User);
    //   } else if (fType === DEFINE_FIELD_TYPE.TIME){
    //     valueDisplay = timeUtcToTz(valueDisplay);
    //   }
    //   else if (fType === DEFINE_FIELD_TYPE.ADDRESS){
    //     valueDisplay = jsonParse(valueDisplay);
    //     if(valueDisplay){
    //       valueDisplay = valueDisplay["address"];
    //     }
    //   }
    //   linksRelation.push(
    //     <>
    //       <Link key={props.relationData.records[idx].recordId}
    //       to={{
    //         pathname: getLinkListModule(fieldBelong),
    //           state: { openDetail: true, recordId: props.relationData.records[idx].recordId }
    //         }}
    //     >
    //       <span>{valueDisplay}</span>
    //     </Link>
    //     {/* <a key={props.relationData.records[idx].recordId} onClick={() => handClickRelation(props.relationData.records[idx].recordId, fieldBelong)}><span>{valueDisplay}</span></a> */}
    //     {i < recordIds.length - 1 && <span>,</span>}
    //     </>
    //   )
    // }
    // return <>{linksRelation}</>
  }

  const renderComponentDisplayFile = () => {
    let files = [];
    try {
      const tmp = getValueProp(props.record, props.fieldInfo.fieldName) || getValueProp(props.record, 'files');
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
            <a className="file" onClick={evt => handleClickFile(getValueProp(file, 'file_name'), getValueProp(file, 'file_url'))}>
              {getValueProp(file, 'file_name')}
            </a>
            {idx < files.length - 1 && ', '}
          </>
        ))}
      </>
    );
  }

  // case props.text is react element and fieldBelong equal 16. (sales)
  const isReactElementHasFieldBelongEq16 = (propText) => {
    return React.isValidElement(propText) && props.belong === 16
  }

  const renderComponentDisplay = () => {
    if (props.fieldInfo.fieldName === "employee_icon") {
      const icon = getValueProp(props.record, 'employee_icon');
      return <a><img className="avatar" src={icon ? icon["fileUrl"] : ""}></img></a>
    }
    if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL) {
      if (props.isResultsSearch) {
        return <label>{props.textCell}</label>;
      } else {
        return <a href={`mailto:${props.textCell}`}>{props.textCell}</a>;
      }
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.ADDRESS) {
      if (props.fieldInfo.isLinkedGoogleMap) {
        return <a href={`http://google.com/maps/search/${props.textCell}`}>{props.textCell}</a>;
      } else {
        return <>{props.textCell}</>
      }
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.FILE) {
      return renderComponentDisplayFile();
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
      let nameKey = "unk";
      if (props.keyRecordId) {
        nameKey = props.keyRecordId;
      }
      const id = getValueProp(props.record, nameKey);
      return <FieldDetailViewSelectOrg ogranizationValues={props.record[props.fieldInfo.fieldName]} fieldInfo={props.fieldInfo} recordId={id} controlType={ControlType.VIEW} deactiveId={props.deactiveId} />
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA) {
      return <FieldDetailViewTextArea text={getValueProp(props.record, props.fieldInfo.fieldName)} mode={ControlType.VIEW} />
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK) {
      const target = props.fieldInfo.linkTarget === 0 ? 'blank' : '';
      if (props.fieldInfo.urlType === LINK_FIXED) {
        return (
          <a rel="noopener noreferrer" target={target} href={props.fieldInfo.urlTarget}>
            {props.fieldInfo.urlText}
          </a>
        );
      } else if (props.fieldInfo.urlType === LINK_ARBITRARY) {
        let defaultVal = "";
        let defaultLabel = "";
        if (!_.isNil(props.textCell) && props.textCell !== '') {
          const jsonValue = jsonParse(props.textCell, {});
          defaultVal = jsonValue["url_target"] ? jsonValue["url_target"] : "";
          defaultLabel = jsonValue["url_text"] ? jsonValue["url_text"] : "";
        }
        return (
          <>
            {defaultVal ?
              <a rel="noopener noreferrer" target={target} href={defaultVal}>{defaultLabel ? defaultLabel : defaultVal}</a> : defaultLabel ? defaultLabel : ""
            }
          </>
        );
      }
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return <>{!/^-?\d*\.?\d*$/g.test(calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace))
        ? calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace)
        : autoFormatNumber(calculate(props.fieldInfo.configValue, props.record, props.fieldInfo.decimalPlace), props.fieldInfo.decimalPlace)}</>
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TIME) {
      return <>{timeUtcToTz(props.textCell)}</>;
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE) {
      return <>{isReactElementHasFieldBelongEq16(props.textCell) ? props.textCell : formatDate(props.textCell)}</>;
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME) {
      return <>{isReactElementHasFieldBelongEq16(props.textCell) ? props.textCell : utcToTz(props.textCell, DATE_TIME_FORMAT.User)}</>;
    } else if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
      if (props.fieldInfo.relationData && props.fieldInfo.relationData.fieldBelong) {
        const fBelong = props.fieldInfo.relationData.fieldBelong
        const displayFieldId = props.fieldInfo.relationData.displayFieldId
        const ids = parseRelationIds(getValueProp(props.record, props.fieldInfo.fieldName))
        return <>{renderRelationData(fBelong, ids, displayFieldId)}</>;
      }
    } else {
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
          return <>{autoFormatNumber(props.textCell, props.fieldInfo.decimalPlace)}</>;
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
      if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC
        || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
        classCell += ' text-right'
      }
      if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
        classCell = '';
      }
      if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
        || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX
        || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC
        || props.fieldInfo.fieldName === DEFINE_FIELD_NAME_TASK.FILE_NAME) {
        styleCell['width'] = getColumnWidth(props.fieldInfo);
      }
    } else {
      classCell += ' text-form-edit';
      // if (props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
      //   || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX
      //   || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC
      //   || props.fieldInfo.fieldName === DEFINE_FIELD_NAME_TASK.FILE_NAME) {
      //   styleCell['width'] = getColumnWidth(props.fieldInfo);
      // }
    }

    if (props.belong && props.belong === FIELD_BELONG.PRODUCT
      && props.fieldInfo.fieldName === 'product_image_name') {
      const imgSrc = getValueProp(props.record, 'product_image_path');
      return (
        <div id={cellId} style={styleCell} className={classCell}>
          {imgSrc ? <a className="image_table" title="" ><img className="product-item" src={imgSrc} alt="" title="" /></a> :
            <a className="image_table no_image_table" title="" ><img className="product-item" src="../../content/images/noimage.png" alt="" title="" /></a>}
        </div>
      )
    }

    if (!props.modeDisplay || props.modeDisplay === ScreenMode.DISPLAY || props.fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION || StringUtils.equalPropertyName(props.fieldInfo.fieldName, props.keyRecordId)) {
      if (!_.isNil(CUSTOM_OVER_FIELD_NAME_LIST.find(fieldName => fieldName === props.fieldInfo.fieldName))
        || props.fieldInfo.fieldType === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION) {
        return (
          <div id={cellId} style={styleCell} className={classCell}>
            {renderComponentDisplay()}
          </div>
        );
      }

      return (
        <div id={cellId} style={styleCell} className={classCell}>
          <Popover x={-20} y={25}>
            {renderComponentDisplay()}
          </Popover>
        </div>
      ); // style={{wordBreak: 'break-all'}}
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
            key={cellId}
            showFieldLabel={false}
            errorInfo={props.errorInfo}
            controlType={ControlType.EDIT_LIST}
            isDnDAddField={false}
            isDnDMoveField={false}
            fieldInfo={props.fieldInfo}
            elementStatus={rowData}
            fieldStyleClass={props.fieldStyleClass}
            updateStateElement={props.updateStateField ? props.updateStateField : (d, t, e) => { }}
            updateFiles={props.updateFiles}
            idUpdate={getValueProp(props.record, nameKey)}
            isFocus={props.isFocus}
            isLastColumn={props.isLastColumn}
            recordId={getValueProp(props.record, props.keyRecordId)}
          />
        </div>
      );
    }
  };

  if (isColumnCheckbox(props.fieldInfo)) {
    if (props.modeSelected === TagAutoCompleteMode.Single) {
      return (
        <div className="text-over text-ellipsis" style={{ width: `${getColumnWidth(props.fieldInfo)}px` }}>
          <label className="icon-check-circle-border">
            <input onChange={() => { }} onClick={handleItemChecked} className="border" type="radio" checked={props.isCheck} />
            <i />
          </label>
        </div>
      );
    } else {
      return (
        <div className="text-over text-ellipsis" style={{ width: `${getColumnWidth(props.fieldInfo)}px` }}>
          <label className="icon-check">
            <input onChange={() => { }} onClick={handleItemChecked} className="hidden" type="checkbox" checked={props.isCheck} />
            <i />
          </label>
        </div>
      );
    }

  }

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
