import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  useLayoutEffect,
  forwardRef
} from 'react';
import { translate } from 'react-jhipster';
import { connect, Options } from 'react-redux';
import { ScrollSync, ScrollSyncPane } from 'react-scroll-sync';
import { IRootState } from 'app/shared/reducers';
import {
  DEFINE_FIELD_TYPE,
  FieldInfoType,
  HEADER_ACTION_TYPE,
  DND_ITEM_TYPE,
  SPECIAL_FILTER_LIST,
  DynamicControlAction
} from '../constants';
import { DEFINE_FIELD_NAME_TASK } from 'app/modules/tasks/constants';
import { TYPE_MSG_EMPTY } from 'app/config/constants';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { getValueProp, getFullAddress } from 'app/shared/util/entity-utils';
import { ScreenMode, ControlType } from 'app/config/constants';
import { ActionListHeader } from '../constants';
import { getFieldNameElastic, getFieldTypeSpecial } from 'app/shared/util/elastic-search-util';
import {
  isColumnFixed,
  isColumnCheckbox,
  isSpecialColumn,
  getColumnWidth,
  getColumnsWidth,
  findIndexFields,
  setColumnFixedAtIndex,
  getRecordIdsRelation,
  renderContentEmpty,
  findFieldByFieldName,
  flattenFieldGroup
  // isGroupOneColumn
} from './dynamic-list-helper';
import _ from 'lodash';
import {
  reset,
  getFieldInfoPersonals,
  getRelationDisplayField,
  handleChooseField,
  handleDragField,
  handleReorderField,
  handleFixColumn,
  handleRecordCheckItem,
  handleChangeColumnsWidth
} from './dynamic-list.reducer';
import { getRelationData } from 'app/shared/reducers/dynamic-field.reducer';
import { IFieldDynamicStyleClass } from '../control-field/interface/field-dynamic-style-class';
import ListHeader from './control/header/list-header';
import ListContentRow from './control/content/list-content-row';
import ListContentCell from './control/content/list-content-cell';
import ListHeaderContent from './control/header/list-header-content';
import ColumnDragLayer from './control/column-drag-layer';
import ReactResizeDetector from 'react-resize-detector';
import useEventListener from 'app/shared/util/use-event-listener';
import DynamicControlField from '../control-field/dynamic-control-field';
import RowDragLayer from './control/row-drag-layer';
import { isNullOrUndefined } from 'util';
import { TagAutoCompleteMode } from '../../common/suggestion/constants';
import { getTimezonesOffset } from 'app/shared/util/date-utils';
import { getFieldName } from 'app/shared/util/special-item';
import { safeCall } from 'app/shared/helpers';
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IDynamicListDispatchProps {
  getFieldInfoPersonals;
  getRelationDisplayField;
  handleChooseField;
  handleDragField;
  handleReorderField;
  handleRecordCheckItem;
  handleFixColumn;
  handleChangeColumnsWidth;
  getRelationData;
  reset;
}

interface IDynamicListStateProps {
  fieldInfos: any;
  relationDisplayField: any;
  messageChildren: any;
  relationData: any;
  authorities: any;
}

interface IDynamicListOwnProps {
  id: string; // id of dynamic list
  tableClass?: string; // table class html
  records: any[]; // list record display in list
  fields?: any; // field info in database get from api
  belong: number; // belong of module function (field-belong)
  extBelong?: number; // children of mudule function if have
  targetType?: number; // target type of field info personals
  targetId?: number; //  target id of field info personals
  selectedTargetType?: number; //
  fieldInfoType?: number; // field info or field info tab (pass from FieldInfoType enum)
  keyRecordId: string; // field name of record id in list record
  fieldNameExtension?: any;
  errorRecords?: { rowId; item; errorCode; errorMsg; errorParams: any }[]; // array record error
  mode?: number; // mode edit or display or filter (pass from ScreenMode enum)
  forceUpdateHeader?: boolean; // Pass True when edit header (resize, move order) then will update into database. Pass False when update into state
  disableEditHeader?: boolean; // disable not allow edit header (resize, move order)
  hideFilterOrderHeader?: boolean; // not allow Filter or Order list
  checkboxFirstColumn?: boolean; // show checkbox in first column
  extensionsData?: any; // data text for display field is id
  fieldLinkHolver?: { fieldName; link; hover; action: { text; target }[] }[]; // TODO waiting confirm required
  // formatFieldGroup?: { fields: string[]; titleField: string; mergeView: boolean; mergeEdit: boolean }[];
  fieldStyleClass?: IFieldDynamicStyleClass; // style class for custom style every cell when edit
  onUpdateFieldValue?: (itemData, type, itemEditValue, idx) => void; // only edit mode, callback when user update control in cell
  resetScreen?: boolean; // Remove check all only edit mode, callback when user update control in cell
  onActionFilterOrder?: (filter: {}[], orderBy: { key; value; type }[]) => void; // callback when user execute filter or order data
  updateMessage?: (msg: string) => void; // callback when have message occur when api return back from api
  onClickCell?: (recordId: number, fieldId: number) => void; // callback when user click cell
  onSelectedRecord?: (listRecord: any[]) => void; // callback when user select/unselect record (checkbox)
  onDragRow?: (src, target) => void; // callback when user drag row
  getCustomFieldValue?: (record: any, field: any, mode) => any; // custom value field when display in cell, if not custom return undefined
  getCustomFieldInfo?: (field: any, type: ControlType) => any; // custom properties (field item) field info, if not custom return undefined
  customHeaderField?: (field: any[] | any, mode: number) => JSX.Element; // render element from parent component
  customContentField?: (
    field: any[] | any,
    rowData: any[] | any,
    mode: number,
    nameKey
  ) => JSX.Element; // render element from parent component
  showMessage?: (message, type) => void;
  updateFiles?: (files) => void; // for field file
  handleCheck?: (recordId: number, isChecked: boolean) => void;
  handleCheckAll?: (isCheckAll: boolean) => void;
  totalRecords?: number;
  firstFocus?: { id; item; nameId }; // Check focus error item. Id : this is id (row index or obj id). item : field name. nameId : obj key.
  isResultsSearch?: boolean;
  modeSelected?: TagAutoCompleteMode;
  typeMsgEmpty?: number;
  disableDragRow?: boolean; // disable drag row
  setShowSlideImage?: (id) => void;
  onBeforeRender?: () => void;
  heightBottomDynamicList?: number; // height bottom dynamic list
  deactiveId?: any;
}

type IDynamicListProps = IDynamicListDispatchProps & IDynamicListStateProps & IDynamicListOwnProps;

const DynamicList: React.FC<IDynamicListProps> = forwardRef((props, ref) => {
  const [fields, setFields] = useState([]);
  const [relationDisplayFields] = useState([]);
  const [listFieldFree, setListFieldFree] = useState([]);
  const [listFieldLock, setListFieldLock] = useState([]);

  const [checkAll, setCheckAll] = useState(false);
  const [recordCheckList, setRecordCheckList] = useState([]);
  const [fieldFilter, setFieldFilter] = useState([]);
  const [openMenuCheckBox, setOpenMenuCheckBox] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [recordsRelation, setRecordRelation] = useState(null);
  const [fieldResizing, setFieldResizing] = useState(null);
  const [showMenuFilter, setShowMenuFilter] = useState(false);
  const [fieldHederFilter, setFieldFilterHeader] = useState(null);
  const [locationMenuX, setLocationMenuX] = useState(0);
  const [locationMenuY, setLocationMenuY] = useState(0);
  const menuSelectCheckboxRef = useRef(null);
  const menuFilterRef = useRef(null);
  const divScrollLock = useRef(null);
  const divScrollFree = useRef(null);
  const headerLockRef = useRef(null);
  const tableLockRef = useRef(null);
  const headerFreeRef = useRef(null);
  const tableFreeRef = useRef(null);
  const tableParentRef = useRef(null);
  const tbodyTableRef = useRef(null);
  const [heightTableParent, setHeightTableParent] = useState(0);
  const [widthTableParent, setWidthTableParent] = useState(0);
  const [isShowHeaderTable, setIsShowHeaderTable] = useState(false);
  const [valueEditRecord, ] = useState([]);

  const makeGroupFieldInfo = (listFieldInfo: any[]) => {
    if (!listFieldInfo || listFieldInfo.length < 1) {
      return listFieldInfo;
    }
    const listFieldGroup = _.groupBy(
      listFieldInfo.filter(e => !_.isNil(e.fieldGroup) && e.fieldGroup > 0),
      'fieldGroup'
    );
    const tmp = listFieldInfo.filter(e => _.isNil(e.fieldGroup) || e.fieldGroup === 0);
    for (const prop in listFieldGroup) {
      if (!Object.prototype.hasOwnProperty.call(listFieldGroup, prop)) {
        continue;
      }
      let idx = 0;
      const field = listFieldGroup[prop][0];
      while (idx < tmp.length) {
        if (_.isArray(tmp[idx])) {
          if (tmp[idx][0].fieldOrder > field.fieldOrder) {
            break;
          }
        } else if (tmp[idx].fieldOrder > field.fieldOrder) {
          break;
        }
        idx++;
      }
      tmp.splice(idx, 0, listFieldGroup[prop]);
    }
    return tmp;
  };

  const handleMouseDown = e => {
    if (openMenuCheckBox) {
      if (!menuSelectCheckboxRef || !menuSelectCheckboxRef.current) {
        return;
      }
      if (menuSelectCheckboxRef.current && menuSelectCheckboxRef.current.contains(e.target)) {
        return;
      }
      setOpenMenuCheckBox(false);
    }
    if (showMenuFilter) {
      if (!menuFilterRef || !menuFilterRef.current) {
        return;
      }
      if (menuFilterRef.current && menuFilterRef.current.contains(e.target)) {
        return;
      }
      setShowMenuFilter(false);
    }
  };

  const calculatorSizeList = () => {
    /* remove scroll lock  */
    if (
      divScrollLock &&
      divScrollLock.current &&
      tableFreeRef &&
      tableFreeRef.current &&
      tableParentRef &&
      tableParentRef.current &&
      tableLockRef &&
      tableLockRef.current
    ) {
      if (
        tableParentRef.current.getBoundingClientRect().width -
        tableLockRef.current.getBoundingClientRect().width >
        tableFreeRef.current.getBoundingClientRect().width
      ) {
        divScrollLock.current.classList.remove('style-0');
        divScrollLock.current.classList.add('style-none');
      } else {
        divScrollLock.current.classList.add('style-0');
        divScrollLock.current.classList.remove('style-none');
      }
    }
  };

  const scrollToErrorElement = (fieldError, columnIndex: number, rowIndex: number) => {
    setTimeout(() => {
      try {
        if (isColumnFixed(fieldError)) {
          divScrollLock.current.scrollTop =
            tableLockRef.current.children[0].children[rowIndex].cells[0].offsetTop;
        } else {
          divScrollFree.current.scrollTop =
            tableFreeRef.current.children[0].children[rowIndex].cells[0].offsetTop;
          divScrollFree.current.scrollLeft =
            tableFreeRef.current.children[0].children[rowIndex].cells[columnIndex].offsetLeft;
        }
      } catch (ex) {
        return;
      }
    }, 500);
  };

  const setFocusFirstElement = (isError: boolean) => {
    if (!props.records || props.records.length < 1) {
      return;
    }
    let inputsElement;
    try {
      if (isError && props.errorRecords && props.errorRecords.length > 0) {
        const rowErrorIndex = props.records.findIndex(
          e =>
            props.errorRecords.findIndex(o => getValueProp(e, props.keyRecordId) === o.rowId) >= 0
        );
        if (rowErrorIndex < 0) {
          return;
        }
        const errorIndex = props.errorRecords.findIndex(
          e => e.rowId === getValueProp(props.records[rowErrorIndex], props.keyRecordId)
        );
        if (errorIndex < 0) {
          return;
        }
        const fieldError = findFieldByFieldName(fields, props.errorRecords[errorIndex].item);
        if (!fieldError) {
          return;
        }
        let fieldErrorIndex = findIndexFields(fields, fieldError);
        if (isColumnFixed(fieldError)) {
          if (props.checkboxFirstColumn) {
            fieldErrorIndex += 1;
          }
          inputsElement = tableLockRef.current.children[0].children[rowErrorIndex].cells[
            fieldErrorIndex
          ].querySelectorAll('input, button, select, textarea');
        } else {
          if (tableLockRef && tableLockRef.current) {
            fieldErrorIndex =
              fieldErrorIndex - tableLockRef.current.children[0].firstElementChild.cells.length;
            if (props.checkboxFirstColumn) {
              fieldErrorIndex += 1;
            }
          }
          inputsElement = tableFreeRef.current.children[0].children[rowErrorIndex].cells[
            fieldErrorIndex
          ].querySelectorAll('input, button, select, textarea');
        }
        if (inputsElement && inputsElement.length > 0) {
          for (let j = 0; j < inputsElement.length; j++) {
            if (!inputsElement[j].hidden && inputsElement[j].tabIndex !== -1) {
              inputsElement[j].focus();
              break;
            }
          }
        }
        scrollToErrorElement(fieldError, fieldErrorIndex, rowErrorIndex);
      } else {
        if (
          tableLockRef &&
          tableLockRef.current &&
          ((props.checkboxFirstColumn &&
            tableLockRef.current.children[0].firstElementChild.cells.length > 1) ||
            (!props.checkboxFirstColumn &&
              tableLockRef.current.children[0].firstElementChild.cells.length > 0))
        ) {
          for (
            let i = 0;
            i < tableLockRef.current.children[0].firstElementChild.cells.length;
            i++
          ) {
            inputsElement = tableLockRef.current.children[0].firstElementChild.cells[
              i
            ].querySelectorAll('input, button, select, textarea');
            if (inputsElement && inputsElement.length > 0) {
              for (let j = 0; j < inputsElement.length; j++) {
                if (!inputsElement[j].hidden && inputsElement[j].tabIndex !== -1) {
                  inputsElement[j].focus();
                  return;
                }
              }
            }
          }
        }
        if (tableFreeRef && tableFreeRef.current) {
          for (
            let i = 0;
            i < tableFreeRef.current.children[0].firstElementChild.cells.length;
            i++
          ) {
            inputsElement = tableFreeRef.current.children[0].firstElementChild.cells[
              i
            ].querySelectorAll('input, button, select, textarea');
            if (inputsElement && inputsElement.length > 0) {
              for (let j = 0; j < inputsElement.length; j++) {
                if (!inputsElement[j].hidden && inputsElement[j].tabIndex !== -1) {
                  inputsElement[j].focus();
                  return;
                }
              }
            }
          }
        }
      }
    } catch (ex) {
      return;
    }
  };

  useEventListener('mousedown', handleMouseDown);
  useEffect(() => {
    if (props.fieldInfoType !== FieldInfoType.Tab
        && (!props.fieldInfos.fieldInfoPersonals || props.fieldInfos.fieldInfoPersonals.length === 0)) {
      props.getFieldInfoPersonals(
        props.id,
        props.belong,
        props.extBelong,
        props.fieldInfoType,
        props.targetType,
        props.targetId
      );
    }
    calculatorSizeList();
    return () => {
      props.reset(props.id);
    };
  }, []);

  useEffect(() => {
    const tmp = [];
    if (props.fields) {
      tmp.push(...makeGroupFieldInfo(props.fields));
    } else {
      const { fieldInfos, messageChildren } = props;
      if (
        fieldInfos &&
        fieldInfos.fieldInfoPersonals &&
        !_.isEqual(fields, fieldInfos.fieldInfoPersonals)
      ) {
        tmp.push(...makeGroupFieldInfo(fieldInfos.fieldInfoPersonals));
      }
      if (messageChildren && messageChildren.length > 0) {
        if (props.updateMessage) {
          props.updateMessage(messageChildren);
        }
      }
    }
    if (tmp.length > 0) {
      setFields(tmp);
    }
    calculatorSizeList();
  }, [props.fieldInfos, props.messageChildren, props.fields]);

  useDeepCompareEffect(() => {
    const relationIds = [];
    if (props.fields) {
      relationIds.push(
        ...getRecordIdsRelation(props.fields, props.records, props.fieldNameExtension)
      );
    } else {
      const { fieldInfos } = props;
      if (fieldInfos && fieldInfos.fieldInfoPersonals &&
        (!_.isEqual(fields, fieldInfos.fieldInfoPersonals) || _.isNil(recordsRelation))) {
        relationIds.push(
          ...getRecordIdsRelation(
            fieldInfos.fieldInfoPersonals,
            props.records,
            props.fieldNameExtension
          )
        );
      }
    }
    if (relationIds.length > 0) {
      relationIds.forEach((el, idx) => {
        if (el.ids && el.ids.length > 0) {
          props.getRelationData(props.id, el.fieldBelong, el.ids, el.fields);
        }
      });
    }
    if (tbodyTableRef && tbodyTableRef.current) {
      setContentHeight(tbodyTableRef.current.getBoundingClientRect().height);
    }
    // check show header
    if (
      (!props.typeMsgEmpty ||
        (props.typeMsgEmpty && props.typeMsgEmpty !== TYPE_MSG_EMPTY.FILTER)) &&
      (!props.records || props.totalRecords < 1)
    ) {
      setIsShowHeaderTable(false);
    } else {
      setIsShowHeaderTable(true);
    }
    calculatorSizeList();
  }, [props.fieldInfos, props.fields, props.records]);

  useEffect(() => {
    if (props.relationData) {
      let isChange = false; // fieldBelong, records: [], fieldItems: []
      let records = null;
      let fieldItems = null;
      if (recordsRelation && _.has(recordsRelation, 'records')) {
        records = _.cloneDeep(_.get(recordsRelation, 'records'));
      } else {
        records = [];
      }
      if (recordsRelation && _.has(recordsRelation, 'fieldItems')) {
        fieldItems = _.cloneDeep(_.get(recordsRelation, 'fieldItems'));
      } else {
        fieldItems = [];
      }
      if (props.relationData.records) {
        props.relationData.records.forEach(el => {
          const idx = records.findIndex(
            record => record.fieldBelong === el.fieldBelong && record.recordId === el.recordId
          );
          if (idx < 0) {
            records.push(el);
            isChange = true;
          } else if (!_.isEqual(el.dataInfos, records[idx].dataInfos)) {
            records[idx].dataInfos = _.cloneDeep(el.dataInfos);
            isChange = true;
          }
        });
      }
      if (props.relationData.fieldItems) {
        props.relationData.fieldItems.forEach(el => {
          if (fieldItems.findIndex(item => item.itemId === el.itemId) < 0) {
            fieldItems.push(el);
            isChange = true;
          }
        });
      }
      if (isChange) {
        setRecordRelation({ records, fieldItems });
      }
    }
  }, [props.relationData]);

  useEffect(() => {
    if (props.onSelectedRecord) {
      props.onSelectedRecord(recordCheckList ? recordCheckList.filter(e => e.isChecked) : []);
    }
    props.handleRecordCheckItem(props.id, recordCheckList);
  }, [recordCheckList]);

  const handleAllChecked = isCheck => {
    const key = props.keyRecordId;
    props.records.forEach(element => {
      const obj = {};
      obj['isChecked'] = isCheck;
      obj[key] = StringUtils.getValuePropStr(element, key);
      obj['employeeStatus'] = element.employee_status;
      obj['employee_surname'] = element.employee_surname;
      obj['employee_name'] = element.employee_name;
      if (recordCheckList.length > 0) {
        const itemIndex = recordCheckList.findIndex(
          e => StringUtils.getValuePropStr(e, key) + '' === obj[key] + ''
        );
        if (itemIndex >= 0) {
          recordCheckList[itemIndex] = obj;
        } else {
          recordCheckList.push(obj);
        }
      } else {
        recordCheckList.push(obj);
      }
    });
    recordCheckList.forEach(e => (e.isChecked = isCheck));
    setRecordCheckList(_.cloneDeep(recordCheckList));
    setCheckAll(isCheck);
    if (props.handleCheckAll) {
      props.handleCheckAll(isCheck);
    }
  };

  // use useDeepCompareEffect instead of useEffect, fix bug call getRelationDisplayField many time
  useDeepCompareEffect(() => {
    const listFieldFixed = [];
    if (props.checkboxFirstColumn) {
      listFieldFixed.push({ isCheckBox: true });
    }
    listFieldFixed.push(...fields.filter(e => isColumnFixed(e)));
    const listFieldNormal = fields.filter(e => !isColumnFixed(e));
    setListFieldFree(listFieldNormal);
    setListFieldLock(listFieldFixed);
    const fieldIdRelation = [];
    const lstFields = flattenFieldGroup(fields);
    lstFields.forEach(e => {
      if (_.toString(e.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
        if (
          relationDisplayFields.findIndex(
            o => o.fieldId === _.get(e, 'relationData.displayFieldId')
          ) < 0 &&
          fieldIdRelation.findIndex(o => o === _.get(e, 'relationData.displayFieldId')) < 0
        ) {
          fieldIdRelation.push(_.get(e, 'relationData.displayFieldId'));
        }
      }
    });
    if (fieldIdRelation.length > 0) {
      props.getRelationDisplayField(props.id, fieldIdRelation);
    }
  }, [fields]);

  useEffect(() => {
    if (props.relationDisplayField && props.relationDisplayField.length > 0) {
      const tmp = props.relationDisplayField.filter(
        e => relationDisplayFields.findIndex(o => o.fieldId === e.fieldId) < 0
      );
      relationDisplayFields.push(...tmp);
    }
  }, [props.relationDisplayField]);

  /**
   * Get fieldId for list sort/filter conditions
   * @param objSortFilter
   * @param listFields
   */
  const getFieldId = (objSortFilter, listFields, type) => {
    let fieldId = null;
    if (!isNullOrUndefined(objSortFilter)) {
      listFields.length > 0 &&
        listFields.map(field => {
          if (
            (type === HEADER_ACTION_TYPE.SORT &&
              field.fieldName.toLowerCase() === getFieldName(objSortFilter.key)) ||
            (type === HEADER_ACTION_TYPE.FILTER &&
              field.fieldName.toLowerCase() === getFieldName(objSortFilter.fieldName))
          ) {
            fieldId = field.fieldId;
          }
          if (
            type === HEADER_ACTION_TYPE.FILTER &&
            !_.isNil(
              SPECIAL_FILTER_LIST.some(item => item === getFieldName(objSortFilter.fieldName))
            )
          ) {
            fieldId = objSortFilter.fieldId;
          }
        });
    }
    return fieldId;
  };

  useImperativeHandle(
    ref,
    () => ({
      updateSizeDynamicList() {
        calculatorSizeList();
      },
      reloadFieldInfo() {
        props.getFieldInfoPersonals(
          props.id,
          props.belong,
          props.extBelong,
          props.fieldInfoType,
          props.targetType,
          props.targetId
        );
      },
      handleChooseField(srcField, isSelected) {
        // update typeGroup and select target type
        props.handleChooseField(
          props.id,
          srcField,
          isSelected,
          props.belong,
          props.extBelong,
          props.fieldInfoType,
          props.targetType,
          props.targetId
        );
      },

      changeTargetSidebar(targetType, targetId) {
        props.getFieldInfoPersonals(
          props.id,
          props.belong,
          props.extBelong,
          props.fieldInfoType,
          targetType,
          targetId
        );
      },

      handleDragField(fieldSrc, fieldTarget) {
        props.handleDragField(
          props.id,
          fieldSrc,
          fieldTarget,
          props.belong,
          props.extBelong,
          props.fieldInfoType,
          props.targetType,
          props.targetId
        );
      },

      getFields() {
        return fields;
      },
      getFreeFields() {
        return listFieldFree;
      },
      getLockFields() {
        return listFieldLock;
      },
      removeSelectedRecord() {
        setRecordCheckList([]);
        setCheckAll(false);
        props.handleRecordCheckItem(props.id, []);
      },
      resetState() {
        setRecordCheckList([]);
        setCheckAll(false);
        setOpenMenuCheckBox(false);
        setFieldFilterHeader(null);
        setFieldFilter([]);
      },
      changeRecordCheckList(recorCheck) {
        setRecordCheckList(recorCheck);
      },
      setFilterListView(orderBy, defaultConditions, listFields) {
        const tmpFieldSortFilter = [];
        // create default data for filterConditions
        const fieldIdSort = getFieldId(orderBy[0], listFields, HEADER_ACTION_TYPE.SORT);
        let resultSort = {
          fieldId: fieldIdSort,
          fieldType:
            orderBy &&
            orderBy[0] &&
            orderBy[0].fieldType &&
            orderBy[0] &&
            orderBy[0].fieldType.toString(),
          // isSearchBlank: false,
          searchOption: '2',
          searchType: '1',
          sortAsc: false,
          sortDesc: false,
          valueFilter: null
        };
        // flag = 0: sort field is not the same as filter field => push resultSort and resultFilter to tmpFieldSortFilter
        // flag = 1: push only resultFilter having all resultSort's properties
        let flag = 0;
        // create default data for orderBy
        if (!_.isNil(fieldIdSort)) {
          if (orderBy[0].value.toLowerCase() === 'asc') {
            resultSort = { ...resultSort, sortAsc: true };
          } else if (orderBy[0].value.toLowerCase() === 'desc') {
            resultSort = { ...resultSort, sortDesc: true };
          }
        }

        // create default data for filterConditions
        defaultConditions.length > 0 &&
          defaultConditions.map(conditionItem => {
            let resultFilter = {
              fieldId: getFieldId(conditionItem, listFields, HEADER_ACTION_TYPE.FILTER),
              isSearchBlank: false,
              searchOption: '2',
              searchType: '1',
              sortAsc: false,
              sortDesc: false,
              valueFilter: null
            };

            resultFilter = { ...resultFilter, valueFilter: conditionItem.fieldValue };
            if (fieldIdSort === resultFilter.fieldId) {
              flag = 1;
              // assign resultSort's properties to resultFilter
              resultFilter = {
                ...resultFilter,
                sortAsc: resultSort.sortAsc,
                sortDesc: resultSort.sortDesc
              };
            }
            if (!_.isNil(conditionItem.searchType)) {
              resultFilter = { ...resultFilter, searchType: conditionItem.searchType };
            }
            if (!_.isNil(conditionItem.searchOption)) {
              resultFilter = { ...resultFilter, searchOption: conditionItem.searchOption };
            }
            if (!_.isNil(conditionItem.isSearchBlank)) {
              resultFilter = { ...resultFilter, isSearchBlank: conditionItem.isSearchBlank };
            }
            // push resultFilter to list conditions
            tmpFieldSortFilter.push(resultFilter);
          });

        // flag = 0 then push resultSort to tmpFieldSortFilter
        if (flag === 0) {
          tmpFieldSortFilter.push(resultSort);
        }
        // set to fieldFilter to display default values getting from DB
        setFieldFilter(tmpFieldSortFilter);
      },
      // change page : onscroll top
      onScrollTopTable() {
        divScrollLock.current.scrollTop =
          tableLockRef.current.children[0].children[0].cells[0].offsetTop;
      },
    }),
    [fields, listFieldFree, listFieldLock]
  );

  const onChangeCellWidth = () => {
    let widthHeader = 0;
    let widthTableFree = 0;
    let tableLockRefIsUndefine = false;
    let tableFreeRefIsUndefine = false;
    if (
      tableLockRef &&
      tableLockRef.current &&
      tableLockRef.current.rows &&
      tableLockRef.current.rows.length > 0 &&
      tableLockRef.current.rows[0].cells &&
      tableLockRef.current.rows[0].cells.length > 0 &&
      headerLockRef &&
      headerLockRef.current &&
      headerLockRef.current.rows &&
      headerLockRef.current.rows.length > 0 &&
      headerLockRef.current.rows[0].cells &&
      headerLockRef.current.rows[0].cells.length > 0
    ) {
      for (let i = 0; i < headerLockRef.current.rows[0].cells.length; i++) {
        const width = tableLockRef.current.children[0].rows[0].cells[i].getClientRects()[0].width;
        if (i < headerLockRef.current.rows[0].cells.length) {
          // headerLockRef.current.rows[0].cells[i].children[0].style.width = `${width}px`;
          widthHeader += width;
        }
      }
      tableLockRefIsUndefine = true;
    }
    if (
      tableFreeRef &&
      tableFreeRef.current &&
      tableFreeRef.current.rows &&
      tableFreeRef.current.rows.length > 0 &&
      tableFreeRef.current.rows[0].cells &&
      tableFreeRef.current.rows[0].cells.length > 0 &&
      headerFreeRef &&
      headerFreeRef.current &&
      headerFreeRef.current.rows &&
      headerFreeRef.current.rows.length > 0 &&
      headerFreeRef.current.rows[0].cells &&
      headerFreeRef.current.rows[0].cells.length > 0
    ) {
      for (let i = 0; i < headerFreeRef.current.rows[0].cells.length; i++) {
        const width = tableFreeRef.current.children[0].rows[0].cells[i].getClientRects()[0].width;
        if (i < headerFreeRef.current.rows[0].cells.length) {
          // headerFreeRef.current.rows[0].cells[i].children[0].style.width = `${width}px`;
          widthTableFree += width;
        }
      }
      tableFreeRefIsUndefine = true;
    }
    // const widthLock = tableLockRef.current.getClientRects()[0].width
    if (divScrollLock && divScrollLock.current) {
      // divScrollLock.current.style.width = `${widthHeader - 1}px`;
      let marginScrollbar = 4;
      if (tableLockRefIsUndefine && tableFreeRefIsUndefine) {
        if (tableParentRef.current.getBoundingClientRect().width - widthTableFree > widthHeader) {
          marginScrollbar = 0;
        }
      }
      // widthHeader += widthScrollBar;
      tableLockRef.current.style.width = `${widthHeader + marginScrollbar}px`;
      divScrollLock.current.style.width = `${widthHeader}px`;
    }

    if (tableFreeRef && tableFreeRef.current) {
      const width = `${tableFreeRef.current.getClientRects()[0].width}px`;
      if (divScrollFree && divScrollFree.current && width !== divScrollFree.current.style.width) {
        divScrollFree.current.style.width = width;
      }
    }
    calculatorSizeList();
  };

  useEffect(() => {
    calculatorSizeList();
    if (props.mode === ScreenMode.EDIT) {
      setFocusFirstElement(false);
    }
  }, [props.mode]);

  useEffect(() => {
    setFocusFirstElement(true);
  }, [props.errorRecords]);

  const handleItemChecked = (recordId, isChecked, updatedDate, employeeStatus, employeeFullName) => {
    const key = props.keyRecordId;
    const obj = {};
    obj['isChecked'] = isChecked;
    obj[key] = recordId;
    // add updatedDate to the recordCheckList
    obj['updatedDate'] = updatedDate;
    obj['employeeStatus'] = employeeStatus;
    obj['employee_surname'] = employeeFullName['employee_surname'];
    obj['employee_name'] = employeeFullName['employee_name'];
    /**
     * Type radio button
     */
    if (props.modeSelected === TagAutoCompleteMode.Single) {
      setRecordCheckList([obj]);
    } else {
      if (recordCheckList.length > 0) {
        const itemIndex = recordCheckList.findIndex(
          e => StringUtils.getValuePropStr(e, key).toString() === recordId.toString()
        );
        if (itemIndex >= 0) {
          recordCheckList[itemIndex] = obj;
        } else {
          recordCheckList.push(obj);
        }
      } else {
        recordCheckList.push(obj);
      }
      setRecordCheckList(_.cloneDeep(recordCheckList));
    }
    if (props.handleCheck) {
      props.handleCheck(recordId, isChecked);
    }
  };

  const onHeaderAction = (isOpen: boolean, action: ActionListHeader, params?) => {
    // setOpenMenuCheckBox(isOpen);
    const tmp = flattenFieldGroup(fields);
    if (action === ActionListHeader.OPEN_SELECT_CHECKBOX) {
      setOpenMenuCheckBox(!openMenuCheckBox);
      setLocationMenuX(params.x);
      setLocationMenuY(params.y);
    } else if (action === ActionListHeader.OPEN_FILTER) {
      setShowMenuFilter(!showMenuFilter);
      setLocationMenuX(params.x);
      setLocationMenuY(params.y);
      setFieldFilterHeader(params.fieldInfo);
    } else if (action === ActionListHeader.SELECT_ALL) {
      handleAllChecked(true);
    } else if (action === ActionListHeader.UNSELECT_ALL) {
      handleAllChecked(false);
    } else if (
      (action === ActionListHeader.SELECT_INSIDE || action === ActionListHeader.UNSELECT_INSIDE) &&
      props.records
    ) {
      const isChecked = action === ActionListHeader.SELECT_INSIDE;
      const key = props.keyRecordId;
      props.records.forEach(element => {
        const obj = {};
        obj['isChecked'] = isChecked;
        obj[key] = StringUtils.getValuePropStr(element, key);
        if (recordCheckList.length > 0) {
          const itemIndex = recordCheckList.findIndex(
            e => StringUtils.getValuePropStr(e, key).toString() === obj[key].toString()
          );
          if (itemIndex >= 0) {
            recordCheckList[itemIndex] = obj;
          } else {
            recordCheckList.push(obj);
          }
        } else {
          recordCheckList.push(obj);
        }
      });
      setRecordCheckList(_.cloneDeep(recordCheckList));
    } else if (action === ActionListHeader.FIX_COLUMN && params) {
      if (!props.disableEditHeader) {
        if (props.forceUpdateHeader) {
          props.handleFixColumn(
            props.id,
            params['fieldId'],
            params['isColumnFixed'],
            props.belong,
            props.extBelong,
            props.fieldInfoType,
            props.targetType,
            props.targetId
          );
        } else {
          _.find(tmp, { fieldId: params['fieldId'] }).isColumnFixed = params['isColumnFixed'];
          tmp.sort((a, b) => {
            if (a.isColumnFixed && b.isColumnFixed) {
              return a.fieldOrder - b.fieldOrder;
            } else if (a.isColumnFixed && !b.isColumnFixed) {
              return -1;
            } else if (!a.isColumnFixed && b.isColumnFixed) {
              return 1;
            } else {
              return a.fieldOrder - b.fieldOrder;
            }
          });
          tmp.forEach((item, i) => {
            item.fieldOrder = i + 1;
          });
          setFields(makeGroupFieldInfo(tmp));
        }
      }
    } else if (
      action === ActionListHeader.SORT_ASC ||
      action === ActionListHeader.SORT_DESC ||
      action === ActionListHeader.FILTER
    ) {
      if (
        props.records.length < 1 &&
        (action === ActionListHeader.SORT_ASC || action === ActionListHeader.SORT_DESC)
      ) {
        return;
      }
      setCheckAll(false);
      setRecordCheckList([]);
      const fieldIndex = fieldFilter.findIndex(e => e.fieldId === params.fieldId);
      if (
        (action === ActionListHeader.SORT_ASC || action === ActionListHeader.SORT_DESC) &&
        fieldFilter.length > 0
      ) {
        fieldFilter.forEach(function (e, i) {
          e.sortAsc = false;
          e.sortDesc = false;
        });
      }
      if (fieldIndex < 0) {
        fieldFilter.push(params);
      } else {
        fieldFilter[fieldIndex] = params;
      }
      setFieldFilter(_.cloneDeep(fieldFilter));
      if (props.onActionFilterOrder) {
        const filter = [];
        const orderBy = [];
        for (let i = 0; i < fieldFilter.length; i++) {
          const fIdx = tmp.findIndex(e => e.fieldId === fieldFilter[i].fieldId);
          if (fIdx < 0) {
            continue;
          }
          const fieldName = getFieldNameElastic(tmp[fIdx], props.fieldNameExtension);
          const fieldType = getFieldTypeSpecial(tmp[fIdx])['fieldType'];
          if (fieldFilter[i].sortAsc) {
            let sortVal;
            if (fieldFilter[i].fieldType.toString() === DEFINE_FIELD_TYPE.TIME) {
              sortVal = JSON.stringify({ value: 'asc', timezonesOffset: getTimezonesOffset() });
            } else {
              sortVal = 'asc';
            }
            orderBy.push({
              isNested: false,
              key: fieldName,
              value: sortVal,
              fieldType,
              isDefault: _.isNil(tmp[fIdx].isDefault) ? 'false' : tmp[fIdx].isDefault.toString()
            });
          }
          if (fieldFilter[i].sortDesc) {
            let sortVal;
            if (fieldFilter[i].fieldType.toString() === DEFINE_FIELD_TYPE.TIME) {
              sortVal = JSON.stringify({ value: 'desc', timezonesOffset: getTimezonesOffset() });
            } else {
              sortVal = 'desc';
            }
            orderBy.push({
              isNested: false,
              key: fieldName,
              value: sortVal,
              fieldType,
              isDefault: _.isNil(tmp[fIdx].isDefault) ? 'false' : tmp[fIdx].isDefault.toString()
            });
          }
          const objFilter = _.cloneDeep(tmp[fIdx]);
          objFilter.isSearchBlank = fieldFilter[i].isSearchBlank;
          objFilter.fieldValue = fieldFilter[i].valueFilter;
          objFilter.searchType =
            fieldFilter[i].searchType ||
            (fieldFilter[i] &&
              fieldFilter[i].filterModeDate &&
              fieldFilter[i].filterModeDate.toString());
          objFilter.searchOption = fieldFilter[i].searchOption;
          objFilter.fieldType = fieldType;
          objFilter.timeZoneOffset = fieldFilter[i].timeZoneOffset;
          if (fieldFilter[i].valueFilter && fieldFilter[i].valueFilter.length > 0) {
            const isArray = Array.isArray(fieldFilter[i].valueFilter);
            const val = isArray
              ? JSON.stringify(fieldFilter[i].valueFilter)
              : fieldFilter[i].valueFilter;
            objFilter.fieldValue = val;
          }
          objFilter['fieldName'] = fieldName;
          filter.push(objFilter);
        }
        props.onActionFilterOrder(filter, orderBy);
      }
    }
  };

  const onHeaderActionFilter = (key, type, obj) => {
    setShowMenuFilter(false);
    if (onHeaderAction) {
      const params = {};
      params['fieldId'] = key.fieldId;
      params['fieldType'] = parseInt(key.fieldType, 10);
      if (type === ActionListHeader.FIX_COLUMN) {
        params['isColumnFixed'] = obj;
      } else {
        for (const prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            params[prop] = obj[prop];
          }
        }
      }
      onHeaderAction(false, type, params);
    }
  };

  const getRecordLatestValue = (record, valuesUpdate: any[]) => {
    if (props.mode === ScreenMode.DISPLAY || valuesUpdate.length < 1) {
      return record;
    }
    const idx = _.findIndex(valuesUpdate, (e) => e.recordId === getValueProp(record, props.keyRecordId));
    if (idx < 0) {
      return record;
    }
    const recordTmp = _.cloneDeep(record);
    for (const key in valuesUpdate[idx]) {
      if (Object.prototype.hasOwnProperty.call(valuesUpdate[idx], key) && key !== 'recordId') {
        let isExist = false;
        let fieldNameExt = null;
        const field = findFieldByFieldName(fields, key);
        for (const fieldName in recordTmp) {
          if (StringUtils.equalPropertyName(key, fieldName)) {
            recordTmp[fieldName] = valuesUpdate[idx][key]
            isExist = true;
          } else if (StringUtils.equalPropertyName(fieldName, props.fieldNameExtension)) {
            fieldNameExt = fieldName;
            const extData = getValueProp(recordTmp, fieldName);
            if (extData) {
              if (_.isArray(extData)) {
                extData.forEach((e, i) => {
                  if (StringUtils.equalPropertyName(e['key'], key)) {
                    extData[i][e['value']] = valuesUpdate[idx][key]
                    isExist = true;
                  }
                });
                recordTmp[fieldName] = extData;
              } else {
                if (getValueProp(extData, key) !== undefined) {
                  extData[key] = valuesUpdate[idx][key]
                  recordTmp[fieldName] = extData;
                  isExist = true;
                }
              }
            }
          }
        }
        if (!isExist) {
          if (_.get(field, 'isDefault') || _.isEmpty(fieldNameExt)) {
            recordTmp[key] = valuesUpdate[idx][key]
          } else if (!_.isEmpty(fieldNameExt)) {
            recordTmp[fieldNameExt].push({ key, value: valuesUpdate[idx][key], fieldType: field.fieldType })
          }
        }
      }
    }
    recordTmp['recordId'] = getValueProp(recordTmp, props.keyRecordId);
    return recordTmp;
  }

  const onUpdateFieldValue = (itemData, type, itemEditValue, idx) => {
    if (props.mode !== ScreenMode.EDIT && props.onUpdateFieldValue) {
      return;
    }
    props.onUpdateFieldValue(itemData, type, itemEditValue, idx);
    const lstFields = flattenFieldGroup(fields);
    const fIdx = _.findIndex(lstFields, e => e.fieldId === itemData.fieldId);
    const recordIdx = _.findIndex(valueEditRecord, e => e.recordId === itemData.itemId);
    if (fIdx >= 0) {
      if (recordIdx < 0) {
        const objRecord = { recordId: itemData.itemId }
        objRecord[lstFields[fIdx].fieldName] = itemEditValue;
        valueEditRecord.push(objRecord);
      } else {
        const objRecord = _.cloneDeep(valueEditRecord[recordIdx])
        objRecord[lstFields[fIdx].fieldName] = itemEditValue;
        valueEditRecord[recordIdx] = objRecord;
      }
      if (_.toString(lstFields[fIdx].fieldType) === DEFINE_FIELD_TYPE.NUMERIC) {
        const recIdx = _.findIndex(props.records, e => _.toString(getValueProp(e, props.keyRecordId)) === _.toString(itemData.itemId))
        if (recIdx >= 0) {
          window.postMessage({ type: DynamicControlAction.EDIT_NUMBER, fieldValue: getRecordLatestValue(props.records[recIdx], valueEditRecord) }, window.location.origin);
        }
      }
      // setValueEditRecord(_.cloneDeep(valueEditRecord))
    }
  };

  const onResizeAreaTable = (width, height, isLock, isHeader) => {
    if (isHeader) {
      setHeaderHeight(height);
    } else {
      if (tbodyTableRef && tbodyTableRef.current) {
        setContentHeight(tbodyTableRef.current.getBoundingClientRect().height);
      }
    }
  };

  const onReorderColumn = (fieldDrag: any, fieldDrop: any) => {
    if (!fields || fields.length < 1) {
      return;
    }
    const dragIndex = findIndexFields(fields, fieldDrag);
    const dropIndex = findIndexFields(fields, fieldDrop);
    if (dragIndex < 0 || dropIndex < 0) {
      return;
    }
    const tmp = _.cloneDeep(fields);
    setColumnFixedAtIndex(tmp, dragIndex, isColumnFixed(tmp[dropIndex]));
    let tempObject = null;
    if (dragIndex + 1 === dropIndex) {
      if (
        dragIndex === 0 &&
        isColumnFixed(fields[dragIndex]) &&
        !isColumnFixed(fields[dropIndex])
      ) {
        setColumnFixedAtIndex(tmp, dropIndex, true);
      }
      tempObject = tmp.splice(dragIndex, 1, tmp[dropIndex])[0];
      tmp.splice(dropIndex, 1, tempObject);
    } else {
      tempObject = tmp.splice(dragIndex, 1)[0];
      tmp.splice(dropIndex - (dragIndex > dropIndex ? 0 : 1), 0, tempObject);
    }
    let order = 1;
    tmp.forEach((field, idx) => {
      if (_.isArray(field)) {
        field.forEach((el, jdx) => {
          tmp[idx][jdx].fieldOrder = order;
          order++;
        });
      } else {
        tmp[idx].fieldOrder = order;
        order++;
      }
    });
    if (props.forceUpdateHeader) {
      const listField = flattenFieldGroup(tmp);
      const params = listField.map(el => {
        return { fieldId: el.fieldId, isColumnFixed: el.isColumnFixed, fieldOrder: el.fieldOrder };
      });
      props.handleReorderField(
        props.id,
        params,
        props.belong,
        props.extBelong,
        props.fieldInfoType,
        props.targetType,
        props.targetId
      );
    } else {
      setFields(tmp);
    }
  };

  const onResizeColumnWidth = (columnsWidth: { fieldId; columnWidth }[]) => {
    if (columnsWidth && columnsWidth.length > 0) {
      const tmp = flattenFieldGroup(fields);
      const paramsWidth = [];
      columnsWidth.forEach(e => {
        const ids = e.fieldId.toString().split(',');
        const width = Math.ceil(e.columnWidth / ids.length);
        tmp.forEach((el, i) => {
          if (ids.find(elm => elm === tmp[i].fieldId.toString())) {
            tmp[i].columnWidth = width;
            paramsWidth.push({ fieldId: el.fieldId, columnWidth: width });
          }
        });
      });
      setFields(makeGroupFieldInfo(tmp));
      if (props.forceUpdateHeader) {
        props.handleChangeColumnsWidth(
          props.id,
          paramsWidth,
          props.belong,
          props.extBelong,
          props.fieldInfoType,
          props.targetType,
          props.targetId
        );
      }
    }
  };

  const onMouseRowEnter = (idx: number, isLock: boolean) => {
    if (!tableFreeRef || !tableFreeRef.current || !tableLockRef || !tableLockRef.current) {
      return;
    }
    if (isLock) {
      if (tableLockRef.current.rows[idx].className.startsWith('active')) {
        tableFreeRef.current.rows[idx].className = 'active bg-hover-tr';
      } else {
        tableFreeRef.current.rows[idx].className += 'bg-hover-tr';
      }
    } else {
      if (tableFreeRef.current.rows[idx].className.startsWith('active')) {
        tableLockRef.current.rows[idx].className = 'active bg-hover-tr';
      } else {
        tableLockRef.current.rows[idx].className += 'bg-hover-tr';
      }
    }
  };

  const onMouseRowLeave = (idx: number, isLock: boolean) => {
    if (!tableFreeRef || !tableFreeRef.current || !tableLockRef || !tableLockRef.current) {
      return;
    }
    if (isLock) {
      let className = tableFreeRef.current.rows[idx].className;
      className = className.split('bg-hover-tr').join('');
      tableFreeRef.current.rows[idx].className = className;
    } else {
      let className = tableLockRef.current.rows[idx].className;
      className = className.split('bg-hover-tr').join('');
      tableLockRef.current.rows[idx].className = className;
    }
  };

  const rowClassName = rowData => {
    let isCheck = checkAll;
    if (recordCheckList.length > 0) {
      const itemCheck = recordCheckList.filter(e =>
        StringUtils.equalProperties(e, rowData, props.keyRecordId)
      );
      if (itemCheck.length > 0) {
        isCheck = itemCheck[0].isChecked;
      }
    }
    let rowErrorStyle = '';
    if (props.mode === ScreenMode.EDIT && props.errorRecords && props.errorRecords.length > 0) {
      if (
        props.errorRecords.findIndex(e => e.rowId === getValueProp(rowData, props.keyRecordId)) >= 0
      ) {
        rowErrorStyle = 'vertical-top';
      }
    }
    if (!isCheck) {
      return `${rowErrorStyle}`;
    } else {
      return `active ${rowErrorStyle}`;
    }
  };

  let tableClass = 'table-no-border';
  let isCheckItem = false;
  if (props.tableClass) {
    tableClass = props.tableClass;
  }
  if (props.checkboxFirstColumn) {
    if (!checkAll && recordCheckList.length > 0) {
      const isMix = recordCheckList.filter(e => e.isChecked).length > 0;
      if (isMix) {
        tableClass = `${tableClass} table-list`;
        isCheckItem = true;
      }
    }
  }

  const customSpecialHeader = field => {
    if (props.customHeaderField) {
      return props.customHeaderField(field, props.mode);
    } else {
      return undefined;
    }
  };

  const getColumnWithField = (field: any, tableRef: any) => {
    if (isColumnCheckbox(field)) {
      return [getColumnWidth(field)];
    }
    let fieldId = null;
    if (!_.isArray(field)) {
      for (let i = 0; i < tableRef.current.rows[0].cells.length; i++) {
        if (_.isNil(tableRef.current.rows[0].cells[i].attributes.getNamedItem('data-tag'))) {
          continue;
        }
        const dataTag = tableRef.current.rows[0].cells[i].attributes.getNamedItem('data-tag').value;
        fieldId = field.fieldId;
        if (_.isEqual(_.toString(fieldId), _.toString(dataTag))) {
          return [tableRef.current.rows[0].cells[i].getClientRects()[0].width];
        }
      }
    } else {
      fieldId = field.map(e => _.toString(e.fieldId));
      for (let i = 0; i < tableRef.current.rows[0].cells.length; i++) {
        if (_.isNil(tableRef.current.rows[0].cells[i].attributes.getNamedItem('data-tag'))) {
          continue;
        }
        const dataTag = tableRef.current.rows[0].cells[i].attributes.getNamedItem('data-tag').value;
        const dataTags = dataTag.split(',');
        if (_.isEqual(dataTags.sort(), fieldId.sort())) {
          return [tableRef.current.rows[0].cells[i].getClientRects()[0].width];
        }
      }
    }
  };

  const getHeaderColumnWidth = (idx: number, isLock) => {
    if (props.mode === ScreenMode.DISPLAY) {
      return null;
    }
    const defaultWidth = [-1];
    if (!tableLockRef || !tableLockRef.current || !tableFreeRef || !tableFreeRef.current) {
      return defaultWidth;
    }
    if (tableLockRef.current.rows.length < 1 || tableFreeRef.current.rows.length < 1) {
      return defaultWidth;
    }
    if (isLock) {
      return getColumnWithField(listFieldLock[idx], tableLockRef);
    } else {
      return getColumnWithField(listFieldFree[idx], tableFreeRef);
    }
  };

  const getListHeight = () => {
    let listHeight = headerHeight + contentHeight;
    if (tableLockRef && tableLockRef.current && headerLockRef && headerLockRef.current) {
      const lockHeight =
        tableLockRef.current.getBoundingClientRect().height +
        headerLockRef.current.getBoundingClientRect().height;
      if (lockHeight > listHeight) {
        listHeight = lockHeight;
      }
    }
    if (tableFreeRef && tableFreeRef.current && headerFreeRef && headerFreeRef.current) {
      const freeHeight =
        tableFreeRef.current.getBoundingClientRect().height +
        headerFreeRef.current.getBoundingClientRect().height;
      if (freeHeight > listHeight) {
        listHeight = freeHeight;
      }
    }
    return listHeight;
  };

  const contentHeader = (fieldHeader: any, titleColumn: string, special?: boolean) => {
    if (fieldHeader.isCheckBox) {
      let isCheckAll = checkAll;
      isCheckItem = checkAll;
      let isUncheckItem = !checkAll;
      if (recordCheckList.length > 0) {
        isCheckItem = recordCheckList.filter(e => e.isChecked).length > 0;
        isUncheckItem = recordCheckList.filter(e => !e.isChecked).length > 0;
        if (!isCheckItem && checkAll && recordCheckList.length < props.totalRecords) {
          isCheckItem = true;
        }
        if (!isCheckItem && isUncheckItem) {
          isCheckAll = false;
          setCheckAll(false);
        }
        if (!isUncheckItem && !checkAll && recordCheckList.length < props.totalRecords) {
          isUncheckItem = true;
        }
        if (isCheckItem) {
          isCheckAll = true;
          if (!isUncheckItem) {
            setCheckAll(true);
          }
        }
      }
      return (
        <ListHeaderContent
          mode={props.mode}
          titleColumn={titleColumn}
          specialColumn={special}
          isCheckAll={isCheckAll}
          fieldInfo={fieldHeader}
          handleAllChecked={handleAllChecked}
          onHeaderAction={onHeaderAction}
          isCheckItem={isCheckItem}
          haveUncheckItem={isUncheckItem}
          modeSelected={props.modeSelected}
        />
      );
    } else {
      let field = undefined;
      if (isSpecialColumn(fieldHeader)) {
        if (props.getCustomFieldInfo) {
          field = props.getCustomFieldInfo(fieldHeader, ControlType.FILTER_LIST);
        }
      } else {
        field = fieldHeader;
      }
      if (_.isUndefined(field)) {
        field = _.isArray(fieldHeader) ? fieldHeader[0] : fieldHeader;
      }
      const filterIndex = fieldFilter.findIndex(e => e.fieldId === field.fieldId);
      return (
        <ListHeaderContent
          mode={props.mode}
          titleColumn={titleColumn}
          specialColumn={special}
          fieldInfo={fieldHeader}
          filter={filterIndex < 0 ? null : fieldFilter[filterIndex]}
          customHeaderField={customSpecialHeader}
          onHeaderAction={onHeaderAction}
          disableEditHeader={props.disableEditHeader}
          modeSelected={props.modeSelected}
        />
      );
    }
  };

  const renderHeader = (listField: any[], isLock) => {
    return (
      <ReactResizeDetector handleWidth onResize={(w, h) => onResizeAreaTable(w, h, isLock, true)}>
        <tr>
          {listField.map((e, idx) => (
            <ListHeader
              key={idx}
              field={e}
              mode={props.mode}
              fieldResizing={fieldResizing}
              // formatFieldGroup={props.formatFieldGroup}
              tableHeight={getListHeight()}
              columnsWidth={getHeaderColumnWidth(idx, isLock)}
              onFieldResizing={field => setFieldResizing(field)}
              onReorderColumn={onReorderColumn}
              isResultsSearch={props.isResultsSearch}
              onResizeColumnWidth={onResizeColumnWidth}
              contentHeader={contentHeader}
            />
          ))}
        </tr>
      </ReactResizeDetector>
    );
  };

  const getTextDataCell = (rowData: any, fieldColumn: any) => {
    let text = '';
    let fieldValue = getValueProp(rowData, fieldColumn.fieldName);
    if (_.isUndefined(fieldValue) && !fieldColumn.isDefault && props.fieldNameExtension) {
      const extData = getValueProp(rowData, props.fieldNameExtension);
      if (extData) {
        if (_.isArray(extData)) {
          extData.forEach(e => {
            if (StringUtils.equalPropertyName(e['key'], fieldColumn.fieldName)) {
              fieldValue = e['value'];
            }
          });
        } else {
          fieldValue = getValueProp(extData, fieldColumn.fieldName);
        }
      }
    }
    if (
      Array.isArray(fieldValue) ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.RADIOBOX ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.CHECKBOX ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.SINGER_SELECTBOX ||
      fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.MULTI_SELECTBOX
    ) {
      if (fieldColumn.fieldItems && fieldColumn.fieldItems.length > 0) {
        const fieldItem = fieldColumn.fieldItems.filter(e =>
          !e.itemId || !fieldValue ? false : fieldValue.toString().includes(e.itemId.toString())
        );
        text = fieldItem
          .map(function (elem) {
            return getFieldLabel(elem, 'itemLabel');
          })
          .join(',');
      }
    } else if (fieldColumn.fieldType.toString() === DEFINE_FIELD_TYPE.ADDRESS) {
      if (fieldValue) {
        text = getFullAddress(fieldValue, rowData);
      }
    } else {
      text = _.toString(fieldValue);
    }
    return text;
  };

  const contentCell = (rowData: any, fieldColumn: any, isLastColumnParam?: boolean) => {
    if (isColumnCheckbox(fieldColumn)) {
      let isCheck = checkAll;
      if (recordCheckList.length > 0) {
        const itemCheck = recordCheckList.filter(e =>
          StringUtils.equalProperties(e, rowData, props.keyRecordId)
        );
        if (itemCheck.length > 0) {
          isCheck = itemCheck[0].isChecked;
        }
      }
      return (
        <ListContentCell
          fieldInfo={fieldColumn}
          isCheck={isCheck}
          record={rowData}
          modeDisplay={props.mode}
          keyRecordId={props.keyRecordId}
          handleItemChecked={handleItemChecked}
          isLastColumn={isLastColumnParam}
          // isFocusError={isFocus}
          modeSelected={props.modeSelected}
          isResultsSearch={props.isResultsSearch}
        />
      );
    }
    if (isSpecialColumn(fieldColumn, props.fieldInfoType, props.belong)) {
      const styleCell = {};
      let classCell = '';
      if (props.mode !== ScreenMode.EDIT) {
        styleCell['width'] = `${getColumnWidth(fieldColumn)}px`;
        // classCell += ' text-over text-ellipsis';
      } else {
        classCell += ' text-form-edit';
        if (
          fieldColumn.fieldName === DEFINE_FIELD_NAME_TASK.OPERATOR_ID ||
          fieldColumn.fieldName === DEFINE_FIELD_NAME_TASK.PRODUCT_NAME
        ) {
          styleCell['width'] = `${fieldColumn.columnWidth ? fieldColumn.columnWidth : 430}px`;
        }
      }
      const cellId = `dynamic_cell_${getValueProp(rowData, props.keyRecordId)}_${
        _.isArray(fieldColumn) ? fieldColumn[0].fieldId : fieldColumn.field
        }`;
      if (props.customContentField) {
        return (
          <div id={cellId} style={styleCell} className={classCell}>
            {props.customContentField(fieldColumn, rowData, props.mode, props.keyRecordId)}
          </div>
        );
      } else {
        return <div id={cellId} style={styleCell} className="text-over"></div>;
      }
    }
    let text = undefined;
    if (props.getCustomFieldValue) {
      text = props.getCustomFieldValue(rowData, fieldColumn, props.mode);
    }
    if (_.isUndefined(text)) {
      text = getTextDataCell(rowData, fieldColumn);
    }
    let errorInfo = null;
    if (props.mode === ScreenMode.EDIT && props.errorRecords && props.errorRecords.length > 0) {
      errorInfo = props.errorRecords.find(
        e =>
          e &&
          e.rowId.toString() === getValueProp(rowData, props.keyRecordId).toString() &&
          StringUtils.equalPropertyName(e.item, fieldColumn.fieldName)
      );
    }
    let fieldInfo = _.cloneDeep(fieldColumn);
    if (props.getCustomFieldInfo) {
      fieldInfo = props.getCustomFieldInfo(
        fieldColumn,
        props.mode === ScreenMode.DISPLAY ? ControlType.VIEW : ControlType.EDIT
      );
    }
    return (
      <ListContentCell
        textCell={text}
        targetId={fieldColumn.fieldId}
        errorInfo={errorInfo}
        keyRecordId={props.keyRecordId}
        fieldInfo={fieldInfo}
        record={rowData}
        fieldLinkHolver={props.fieldLinkHolver}
        modeDisplay={props.mode}
        fieldStyleClass={props.fieldStyleClass}
        updateStateField={onUpdateFieldValue}
        updateFiles={props.updateFiles}
        showMessage={props.showMessage}
        relationData={recordsRelation}
        getCustomFieldValue={props.getCustomFieldValue}
        belong={props.belong}
        // isFocus={isFocus}
        isLastColumn={isLastColumnParam}
        modeSelected={props.modeSelected}
        isResultsSearch={props.isResultsSearch}
        setShowSlideImage={props.setShowSlideImage}
        deactiveId={props.deactiveId}
      />
    );
  };

  const [hasTargetDrag, setHasTargetDrag] = useState(false);
  const handleOnDragRow = (sourceRow, targetCategory) => {
    if (targetCategory) {
      setHasTargetDrag(true);
      props.onDragRow(sourceRow, targetCategory);
    } else {
      setHasTargetDrag(false);
    }
  };

  const renderContent = (listField: any[], isLock) => {
    if (!props.records || props.records.length < 1) {
      return <></>;
    }
    return (
      <>
        {props.records.map((record, idx) => {

          return (
            <ListContentRow
              key={idx}
              keyRecordId={props.keyRecordId}
              rowClassName={rowClassName(record)}
              record={record}
              fields={listField}
              modeDisplay={props.mode}
              isResizingColumn={fieldResizing && fieldResizing.length > 0}
              contentCell={contentCell}
              onClickCell={props.onClickCell}
              onDragRow={props.disableDragRow ? null : handleOnDragRow}
              onMouseRowEnter={() => onMouseRowEnter(idx, isLock)}
              onMouseRowLeave={() => onMouseRowLeave(idx, isLock)}
              recordCheckList={recordCheckList}
              isLock={isLock}
              indexOfRow={idx}
              isLastRecord={props.records.length - 1 === idx}
              tableLock={tableLockRef}
              tableFree={tableFreeRef}
              headerLock={headerLockRef}
              headerFree={headerFreeRef}
              onChangeCellWidth={onChangeCellWidth}
              belong={props.belong}
            />
          );
        })}
      </>
    );
  };

  const renderAreaTableLock = () => {
    const styleWrapDiv = {};
    const styleShadowsDiv = {};
    const widthOfTableLock = getColumnsWidth(listFieldLock);
    if (props.mode === ScreenMode.DISPLAY) {
      let marginScrollbar = 1;
      if (
        divScrollLock &&
        divScrollLock.current &&
        tableFreeRef &&
        tableFreeRef.current &&
        tableParentRef &&
        tableParentRef.current &&
        tableLockRef &&
        tableLockRef.current
      ) {
        if (
          tableParentRef.current.getBoundingClientRect().width -
          tableLockRef.current.getBoundingClientRect().width >
          tableFreeRef.current.getBoundingClientRect().width
        ) {
          marginScrollbar = 0;
        }
      }
      styleWrapDiv['width'] = `${widthOfTableLock - marginScrollbar}px`;
    } else if (tableLockRef && tableLockRef.current) {
      // styleWrapDiv['width'] = `${tableLockRef.current.getBoundingClientRect().width}px`;
    }
    // calculator height div shadows
    styleShadowsDiv['height'] = `${getListHeight()}px`;
    // if (tableLockRef && tableLockRef.current && headerLockRef && headerLockRef.current) {
    //   styleShadowsDiv['height'] = `${tableLockRef.current.getBoundingClientRect().height + headerLockRef.current.getBoundingClientRect().height + 1}px`;
    // }
    return (
      <>
        {props.records &&
          props.records.length < 1 &&
          renderContentEmpty(props.belong, props.typeMsgEmpty, widthTableParent)}
        {isShowHeaderTable && (
          <div className="wrap-table-scroll no-scroll-ie h-100 position-relative">
            <table className={`${tableClass} table-scroll`} ref={headerLockRef}>
              <thead>{renderHeader(listFieldLock, true)}</thead>
            </table>
            <ReactResizeDetector
              handleHeight
              handleWidth
              onResize={(w, h) => onResizeAreaTable(w, h, true, false)}
            >
              <ScrollSyncPane group="A">
                <div className="set-height-66 style-0" style={styleWrapDiv} ref={divScrollLock}>
                  <table
                    className={`${tableClass} table-scroll vertical-align-middle`}
                    ref={tableLockRef}
                  >
                    <tbody>{renderContent(listFieldLock, true)}</tbody>
                  </table>
                </div>
              </ScrollSyncPane>
            </ReactResizeDetector>
            <div className="table-box-shadow-l" style={styleShadowsDiv}></div>
          </div>
        )}
      </>
    );
  };

  const renderAreaTableFree = () => {
    const styleWrapDiv = {};
    const customStyleTableFree = { minWidth: '0px' };
    let styleTableFree = '';
    styleWrapDiv['overflowY'] = 'scroll';
    if (props.mode === ScreenMode.DISPLAY) {
      styleWrapDiv['width'] = `${getColumnsWidth(listFieldFree)}px`;
    } else {
      styleTableFree = 'margin-left-zero';
    }
    return (
      <>
        {isShowHeaderTable && (
          // style={{ marginLeft: '-1px' }}
          <div className="wrap-table-scroll width style-3 h-100 overflow-hover">
            <table className={`${tableClass} table-scroll`} ref={headerFreeRef}>
              <thead>{renderHeader(listFieldFree, false)}</thead>
            </table>
            <ReactResizeDetector
              handleHeight
              onResize={(w, h) => onResizeAreaTable(w, h, false, false)}
            >
              <ScrollSyncPane group="A">
                <div className="style-3 table-scroll-content overflow-y-hover" ref={divScrollFree}>
                  <table ref={tableFreeRef}
                    className={`${tableClass} table-scroll width ${styleTableFree} vertical-align-middle`}
                    style={customStyleTableFree}
                  >
                    <tbody ref={tbodyTableRef}>{renderContent(listFieldFree, false)}</tbody>
                  </table>
                </div>
              </ScrollSyncPane>
            </ReactResizeDetector>
          </div>
        )}
      </>
    );
  };

  const getLeftLocationFilter = () => {
    if (locationMenuX + 300 > window.innerWidth) {
      return locationMenuX - 300;
    } else {
      return locationMenuX - 3;
    }
  };

  const calculatorHeightTable = () => {
    if (tableParentRef && tableParentRef.current) {
      const heightBottom =
        props.heightBottomDynamicList ?
          props.heightBottomDynamicList :
          (props.fieldInfoType === FieldInfoType.Tab ? 52 :
            !props.isResultsSearch ? 0 : 130);
      const height =
        window.innerHeight - tableParentRef.current.getBoundingClientRect().top - heightBottom;
      if (height !== heightTableParent) {
        setHeightTableParent(height);
        tableParentRef.current.style.setProperty('height', `${height}px`, 'important') // force set height some screen fix min height
      }
      const width = window.innerWidth - tableParentRef.current.getBoundingClientRect().left;
      if (width !== widthTableParent) {
        setWidthTableParent(width);
      }
    }
  };
  const calculatorDynamicList = () => {
    calculatorHeightTable();
    calculatorSizeList();
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', calculatorDynamicList);
  }, []);

  useLayoutEffect(() => {
    safeCall(props.onBeforeRender)();
  }, [fields, listFieldFree, listFieldLock, props.records]);

  const renderMenuFilter = fieldHeader => {
    if (!showMenuFilter) {
      return <></>;
    }
    let field = undefined;
    if (isSpecialColumn(fieldHeader)) {
      if (props.getCustomFieldInfo) {
        field = props.getCustomFieldInfo(fieldHeader, ControlType.FILTER_LIST);
      }
    } else {
      field = fieldHeader;
    }
    if (_.isUndefined(field)) {
      field = _.isArray(fieldHeader) ? fieldHeader[0] : fieldHeader;
    }
    let relationDisplayField;
    if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
      relationDisplayField = _.find(relationDisplayFields, {
        fieldId: _.get(field, 'relationData.displayFieldId')
      });
    }
    const filterIndex = fieldFilter.findIndex(e => e.fieldId === field.fieldId);
    return (
      <div
        className="table-tooltip-wrap"
        ref={menuFilterRef}
        style={{
          zIndex: 2000,
          position: 'fixed',
          left: getLeftLocationFilter(),
          top: locationMenuY - 10
        }}
      >
        <div className="table-tooltip-box-no-min-height">
          <DynamicControlField
            controlType={ControlType.FILTER_LIST}
            fieldInfo={field}
            relationDisplayField={relationDisplayField}
            elementStatus={filterIndex < 0 ? null : fieldFilter[filterIndex]}
            updateStateElement={onHeaderActionFilter}
            isResultsSearch={props.isResultsSearch}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <RowDragLayer
        recordCheckList={recordCheckList}
        itemTypeDrag={DND_ITEM_TYPE.DYNAMIC_LIST_ROW}
        hasTargetDrag={hasTargetDrag}
        belong={props.belong}
      />
      <ColumnDragLayer tableHeight={headerHeight + contentHeight} />
      <ReactResizeDetector handleHeight handleWidth onResize={() => calculatorHeightTable()}>
        <ScrollSync>
          <div className={`overflow-hidden table-list-wrap d-flex flex-nowrap hiddenScroll no-select z-index-1`} ref={tableParentRef}>
            {listFieldLock.length > 0 && renderAreaTableLock()}
            {listFieldFree.length > 0 && renderAreaTableFree()}
            {openMenuCheckBox && (
              <div
                className="table-tooltip-wrap"
                style={{ position: 'absolute', left: '11px', top: '46px' }}
                ref={menuSelectCheckboxRef}
              >
                <div
                  className="table-tooltip-box z-index-99"
                  style={{ top: '0px', width: 'max-content', minHeight: '0px' }}
                >
                  <div className="table-tooltip-box-body">
                    <ul>
                      <li>
                        <a onClick={() => onHeaderAction(false, ActionListHeader.SELECT_ALL)}>
                          {translate('global.menu-context.select-all')}
                        </a>
                      </li>
                      <li>
                        <a onClick={() => onHeaderAction(false, ActionListHeader.UNSELECT_ALL)}>
                          {translate('global.menu-context.deselect-all')}
                        </a>
                      </li>
                      <li>
                        <a onClick={() => onHeaderAction(false, ActionListHeader.SELECT_INSIDE)}>
                          {translate('global.menu-context.select-all-in-page')}
                        </a>
                      </li>
                      <li>
                        <a onClick={() => onHeaderAction(false, ActionListHeader.UNSELECT_INSIDE)}>
                          {translate('global.menu-context.deselect-all-in-page')}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {renderMenuFilter(fieldHederFilter)}
          </div>
        </ScrollSync>
      </ReactResizeDetector>
    </>
  );
});

DynamicList.defaultProps = {
  tableClass: 'table-no-border table-list',
  fieldInfoType: FieldInfoType.Personal,
  forceUpdateHeader: true,
  extBelong: 1,
  hideFilterOrderHeader: false,
  disableEditHeader: false
};

const mapStateToProps = (
  { dynamicList, dynamicField, authentication }: IRootState,
  ownProps: IDynamicListOwnProps
) => {
  const stateObject = {
    fieldInfos: {},
    relationDisplayField: null,
    messageChildren: null,
    relationData: null,
    authorities: null
  };
  if (dynamicList && dynamicList.data.has(ownProps.id)) {
    stateObject.fieldInfos = dynamicList.data.get(ownProps.id).fieldInfos;
    stateObject.relationDisplayField = dynamicList.data.get(ownProps.id).relationDisplayField;
    stateObject.messageChildren = dynamicList.data.get(ownProps.id).errorMessage;
  }
  if (dynamicField && dynamicField.data.has(ownProps.id)) {
    stateObject.relationData = dynamicField.data.get(ownProps.id).relationData;
  }
  stateObject.authorities = authentication.account.authorities;
  return stateObject;
};

const mapDispatchToProps = {
  getFieldInfoPersonals,
  getRelationDisplayField,
  handleChooseField,
  handleDragField,
  handleReorderField,
  handleRecordCheckItem,
  handleFixColumn,
  handleChangeColumnsWidth,
  reset,
  getRelationData
};

const options = { forwardRef: true };

export default connect<IDynamicListStateProps, IDynamicListDispatchProps, IDynamicListOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(DynamicList);
