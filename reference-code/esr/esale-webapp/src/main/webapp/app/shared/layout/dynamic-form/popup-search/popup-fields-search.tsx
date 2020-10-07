import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Storage, translate } from 'react-jhipster';
import { useDrop } from 'react-dnd';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { FIELD_ITEM_TYPE_DND, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import DynamicControlField from '../control-field/dynamic-control-field';
import {
  getFieldInfoPersonals,
  getCustomFieldsInfo,
  getServicesInfo,
  handleUpdateField,
  addConditionRelation,
  FieldsSearchAction,
  reset
} from './popup-fields-search.reducer';
import PopupFieldCard from './popup-field-card';
import { IRootState } from 'app/shared/reducers';
import useEventListener from 'app/shared/util/use-event-listener';
import BoxMessage, { MessageType } from '../../common/box-message';
import FieldCardDragLayer from './field-card-drag-layer';
import { AVAILABLE_FLAG, ControlType, TIMEOUT_TOAST_MESSAGE, EXTENSION_BELONG, FIELD_BELONG } from 'app/config/constants';
import { getFieldNameElastic } from 'app/shared/util/elastic-search-util';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { getFieldNameExtension } from 'app/modules/modulo-bridge';
import { convertSpecialField } from 'app/shared/util/special-item';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

interface IPopupFieldsSearchDispatchProps {
  getFieldInfoPersonals;
  getCustomFieldsInfo;
  getServicesInfo;
  handleUpdateField;
  reset;
}

interface IPopupFieldsSearchStateProps {
  tenant;
  action: any;
  fieldInfos: any;
  customField: any;
  serviceInfo: any;
  errorMessage: string;
  successMessage: string;
}

interface IPopupFieldsSearchOwnProps {
  iconFunction?: string;
  conditionSearch?: { fieldId; fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[];
  fieldBelong: number;
  popout?: boolean;
  // convertSpecialField?: (field) => any;
  onCloseFieldsSearch?: (saveCondition: { fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
  onActionSearch?: (saveCondition: { fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
  conDisplaySearchDetail: any;
  setConDisplaySearchDetail: (boolean) => void;
  fields?;
  customFields?;
  fieldNameExtension?: any;
  hiddenShowNewTab?: boolean;
  isOpenedFromModal?: boolean; // = true if this modal is opened from another modal,
  selectedTargetType?: number,
  selectedTargetId?: any,
  layoutData?: any
}

type IPopupFieldsSearchProps = IPopupFieldsSearchDispatchProps & IPopupFieldsSearchStateProps & IPopupFieldsSearchOwnProps;

const PopupFieldsSearch: React.FC<IPopupFieldsSearchProps> = props => {
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  const [conditionSearch, setConditionSearch] = useState(props.conditionSearch);
  const [fieldBelong, setFieldBelong] = useState(props.fieldBelong);

  const [first, setFirst] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showCustomField, setShowCustomField] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [saveConditionSearch, setSaveConditionSearch] = useState(null);
  const [fieldFilter, setFieldFilter] = useState('');
  const [listFieldSearch, setListFieldSearch] = useState([]);
  const [listFieldSetting, setListFieldSetting] = useState([]);
  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const [fields, setFields] = useState([]);
  const [customFieldsInfo, setCustomFieldsInfo] = useState([]);
  const [optionRelation, setOptionRelation] = useState([]);

  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [forceSearch, setForceSearch] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [firstChange, setFirstChange] = useState(false);
  const [conditionDefault, setConditionDefault] = useState(null);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(PopupFieldsSearch.name, {
        fieldBelong,
        iconFunction,
        conditionSearch,
        first,
        showCustomField,
        saveConditionSearch,
        fieldFilter,
        listFieldSearch,
        listFieldSetting,
        msgError,
        msgSuccess,
        fields,
        customFieldsInfo
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(PopupFieldsSearch.name);
      if (saveObj) {
        setFieldBelong(saveObj.fieldBelong);
        setIconFunction(saveObj.iconFunction);
        setConditionSearch(saveObj.conditionSearch);
        setFirst(saveObj.first);
        setShowCustomField(saveObj.showCustomField);
        if (saveObj.saveConditionSearch && saveObj.saveConditionSearch.length > 0) {
          setSaveConditionSearch(saveObj.saveConditionSearch);
        } else {
          setSaveConditionSearch(saveObj.conditionSearch);
        }
        setFieldFilter(saveObj.fieldFilter);
        setListFieldSearch(saveObj.listFieldSearch);
        setListFieldSetting(saveObj.listFieldSetting);
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        setFields(saveObj.fields);
        setCustomFieldsInfo(saveObj.customFieldsInfo);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupFieldsSearch.name);
    }
  };

  const isFieldEqual = (field1: any, field2: any) => {
    if (!_.isEqual(field1.fieldId, field2.fieldId)) {
      return false;
    }
    if (_.isNil(field1.relationFieldId) && _.isNil(field2.relationFieldId)) {
      return true;
    }
    return _.isEqual(field1.relationFieldId, field2.relationFieldId);
  };

  useEffect(() => {
    let _fields = [];
    if (props.fields) {
      _fields = props.fields;
      // setFields(props.fields);
    } else if (props.fieldInfos && props.fieldInfos.fieldInfoPersonals) {
      _fields = props.fieldInfos.fieldInfoPersonals
      setFields(props.fieldInfos.fieldInfoPersonals);
    }
    if (props.layoutData) {
      setFields(convertSpecialField(_fields, props.layoutData, props.fieldBelong));
    }

  }, [props.fieldInfos, props.fields]);

  useEffect(() => {
    if (props.customFields) {
      setCustomFieldsInfo(convertSpecialField(props.customFields, props.layoutData, props.fieldBelong));
    }
    if (props.customField && props.customField.customFieldsInfo) {
      if (props.customField.customFieldsInfo.length > 0 && props.customField.customFieldsInfo[0].fieldBelong === props.fieldBelong) {
        customFieldsInfo.push(
          ...props.customField.customFieldsInfo.filter(e => customFieldsInfo.findIndex(o => o.fieldId === e.fieldId) < 0)
        );
        setCustomFieldsInfo(convertSpecialField(_.cloneDeep(customFieldsInfo), props.layoutData, props.fieldBelong));
        const relativeFields = props.customField.customFieldsInfo.filter(
          e =>
            _.toString(e.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(e.relationData) && !_.isNil(e.relationData.fieldBelong)
        );
        if (!relativeFields) {
          return;
        }
        const tmp = [];
        for (let i = 0; i < relativeFields.length; i++) {
          if (!relativeFields[i].relationData || !relativeFields[i].relationData.fieldBelong) {
            continue;
          }
          if (customFieldsInfo.length > 0 && customFieldsInfo.filter(o => o.fieldBelong === relativeFields[i].relationData.fieldBelong).length > 0) {
            continue;
          }
          if (tmp.findIndex(o => o === relativeFields[i].relationData.fieldBelong) < 0) {
            tmp.push(relativeFields[i].relationData.fieldBelong);
          }
        }
        tmp.forEach(el => {
          props.getCustomFieldsInfo(el);
        });
      } else {
        customFieldsInfo.push(
          ...props.customField.customFieldsInfo.filter(e => customFieldsInfo.findIndex(o => o.fieldId === e.fieldId) < 0)
        );
        setCustomFieldsInfo(convertSpecialField(_.cloneDeep(customFieldsInfo), props.layoutData, props.fieldBelong));
      }
    } else {
      // setCustomFieldsInfo([]);
    }
  }, [props.customField]);

  useEffect(() => {
    props.getServicesInfo();
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setShouldRender(true);
      setForceCloseWindow(false);
    } else {
      setFirst(true);
      setShowModal(true);
      setShowCustomField(false);
      setShouldRender(true);
      setFieldFilter('');
      setSaveConditionSearch(props.conditionSearch);
      props.getFieldInfoPersonals(fieldBelong);
      props.getCustomFieldsInfo(fieldBelong);
    }
    setConditionDefault(_.cloneDeep(props.conditionSearch));
    return () => {
      props.reset();
      setFirst(false);
      setFieldFilter('');
      updateStateSession(FSActionTypeScreen.RemoveSession);
    };
  }, []);

  useEffect(() => {
    if (props.fieldInfos && props.fieldInfos.fieldInfoPersonals) {
      setListFieldSearch(props.fieldInfos.fieldInfoPersonals);
    }
  }, [props.fieldInfos]);

  useEffect(() => {
    if (props.customField && props.customField.customFieldsInfo) {
      if (props.customField.customFieldsInfo.length > 0 && props.customField.customFieldsInfo[0].fieldBelong === props.fieldBelong) {
        setListFieldSetting(props.customField.customFieldsInfo.filter(e => e.fieldBelong === props.fieldBelong));
      }
    }
  }, [props.customField]);

  useEffect(() => {
    if (props.action === FieldsSearchAction.Success) {
      setTimeout(function () {
        setFirstChange(true)
      }, 300);
    }
  }, [props.action])

  const clearDisplayMessage = () => {
    setMsgError('');
    setMsgSuccess('');
  };

  useEffect(() => {
    setMsgError(props.errorMessage);
    if (props.successMessage) {
      setShowCustomField(false);
      setMsgSuccess(props.successMessage);
      setTimeout(function () {
        clearDisplayMessage();
      }, TIMEOUT_TOAST_MESSAGE);
    }
  }, [props.errorMessage, props.successMessage]);

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partternType?) => {
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType });
    } else {
      action();
    }
  }

  const handleClosePopup = (partternType?) => {
    if (!isChange) {
      setShowCustomField(false);
      setListFieldSearch([]);
      setListFieldSetting([]);
      if (props.onCloseFieldsSearch) {
        props.onCloseFieldsSearch(conditionDefault);
      }
    } else {
      executeDirtyCheck(() => {
        setShowCustomField(false);
        setListFieldSearch([]);
        setListFieldSetting([]);
        if (props.onCloseFieldsSearch) {
          props.onCloseFieldsSearch(conditionDefault);
        }
      }, () => { }, partternType);
    }
  };

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        handleClosePopup();
      }
    }
  }, [forceCloseWindow]);

  const [, dropBody] = useDrop({
    accept: FIELD_ITEM_TYPE_DND.ADD_CARD,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!iconFunction) {
      return <></>;
    } else {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${iconFunction}`} alt="" />;
    }
  };

  const isAvailable = flag => {
    return flag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
  };

  const isMatchFilter = (item, belong, isRelation) => {
    const LINK_FIXED = 2
    if (
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TAB ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP ||
      (item.fieldType.toString() === DEFINE_FIELD_TYPE.LINK && item.urlType === LINK_FIXED) ||
      !isAvailable(item.availableFlag) ||
      item.fieldBelong !== belong
    ) {
      return false;
    }
    if (isRelation && item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    } else if (!isRelation && item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
      if (_.get(item, 'relationData.asSelf') === 1) {
        return false;
      }
      return true;
    }
    if (fieldFilter.length <= 0) {
      return true;
    }
    const textField = getFieldLabel(item, 'fieldLabel');
    if (textField.length <= 0) {
      return false;
    }
    return textField.includes(fieldFilter);
  };

  const handleBackPopup = () => {
    handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN1)
  };

  const handleSearch = async () => {
    if (saveConditionSearch && fields && saveConditionSearch.length > 0 && fields.length > 0) {
      _.remove(saveConditionSearch, obj => _.isNil(_.get(obj, 'fieldId')) || fields.findIndex(field => field.fieldId === _.get(obj, 'fieldId')) < 0);
      const conditions = [];
      saveConditionSearch.forEach(e => {
        if (e.fieldRelation && e.fieldRelation.relationData && e.fieldRelation.relationData && e.fieldRelation.relationData.fieldBelong) {
          e.fieldName = getFieldNameElastic(e, getFieldNameExtension(+e.fieldRelation.relationData.fieldBelong));
        } else {
          e.fieldName = getFieldNameElastic(e, props.fieldNameExtension);
        }
        if (e.isSearchBlank) {
          e.fieldValue = "";
        }
        const filters = fields.filter(item => item.fieldId.toString() === e.fieldId.toString());
        if (filters.length > 0) {
          conditions.push(e);
        }
      });
      await addConditionRelation(conditions);
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.SetSession);
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        if (props.onActionSearch) {
          props.onActionSearch(conditions);
        }
      }
    } else {
      if (props.popout) {
        updateStateSession(FSActionTypeScreen.SetSession);
        window.opener.postMessage({ type: FSActionTypeScreen.Search, forceCloseWindow: true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        if (props.onActionSearch) {
          await addConditionRelation(saveConditionSearch);
          props.onActionSearch(saveConditionSearch);
        }
      }
    }

    props.setConDisplaySearchDetail(true);
  };

  useEffect(() => {
    if (forceSearch) {
      handleSearch();
    }
  }, [forceSearch]);

  const handleDisplaySetting = () => {
    setIsChange(true);
    setShowCustomField(true);
    setFieldFilter('');
    if (props.layoutData) {
      const listFieldConvert = convertSpecialField(fields, props.layoutData, props.fieldBelong);
      setListFieldSearch(listFieldConvert);
    } else {
      setListFieldSearch(fields);
    }
    // props.getCustomFieldsInfo(fieldBelong);
  };

  const handleUpdateSettingField = event => {
    event.preventDefault();
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      setMsgError("AT_LEAST_ONE_FIELD_IS_CHOSEN");
      return;
    }
    const objParams = [];
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      obj.relationFieldId = el.relationFieldId > 0 ? el.relationFieldId : null;
      objParams.push(obj);
    });
    // update then selectedTargetType and selectedTargetId value 0
    props.handleUpdateField(objParams, fieldBelong, EXTENSION_BELONG.SEARCH_DETAIL, 0, 0);
  };

  const handleCloseSettingField = () => {
    setMsgError('');
    setShowCustomField(false);
    setCustomFieldsInfo([]);
    setListFieldSearch([]);
    setListFieldSetting([]);
  };

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/fields-search`, '', style.toString());
  };

  const renderModalHeader = () => {
    return (
      <div className="modal-header">
        <div className="left">
          <div className="popup-button-back">
            <a className="modal-heading-title" onClick={props.popout || !props.isOpenedFromModal ? null : handleBackPopup} >
              <i className={`icon-small-primary icon-return-small ${props.popout || !props.isOpenedFromModal ? 'disable' : ''}`} />
            </a>
            <span className="text">{getIconFunction()} {translate('global.title.search-detail')}</span>
          </div>
        </div>
        <div className="right">
          {showModal && !props.hiddenShowNewTab && <button className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />}
          {showModal && <button className="icon-small-primary icon-close-up-small line" onClick={() => handleClosePopup()} />}
        </div>
      </div>
    )
  }

  const updateStateField = (item, type, val) => {
    if (firstChange) {
      setIsChange(true)
    }
    if (val === '' || !item || !val) {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    valueUpdate['fieldBelong'] = item.fieldBelong;
    valueUpdate['relationFieldId'] = item.relationFieldId;
    valueUpdate['fieldRelation'] = item.fieldRelation;

    if (saveConditionSearch) {
      // const indexField = saveConditionSearch.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
      const indexField = saveConditionSearch.findIndex(e => isFieldEqual(e, item));
      if (indexField < 0) {
        saveConditionSearch.push(valueUpdate);
      } else {
        saveConditionSearch[indexField] = valueUpdate;
      }
    } else {
      const newObject = [];
      newObject.push(valueUpdate);
      setSaveConditionSearch(newObject);
    }
  };

  const getDataStatusControl = item => {
    if (saveConditionSearch && saveConditionSearch.length > 0) {
      // const dataStatus = saveConditionSearch.filter(e => e.fieldId.toString() === item.fieldId.toString());
      const dataStatus = saveConditionSearch.filter(e => isFieldEqual(e, item));
      if (dataStatus && dataStatus.length > 0) {
        return dataStatus[0];
      }
    }
    return null;
  };

  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0)) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.None}
        message={translate('messages.' + msgError)}
      />
    );
  };

  const displayMessageSuccess = () => {
    if (!msgSuccess || msgSuccess.length <= 0) {
      return <></>;
    }
    return (
      <div className="message-area message-area-bottom position-absolute">
        <BoxMessage
          messageType={MessageType.Success}
          message={msgSuccess}
          className=" "
          styleClassMessage="block-feedback block-feedback-green text-left"
        />
      </div>
    )
  }

  const onSelectField = (sourceField, isChecked) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    if (objectFieldInfos) {
      if (isChecked) {
        const fieldItems = [];
        if (sourceField.fieldItems && Array.isArray(sourceField.fieldItems) && sourceField.fieldItems.length > 0) {
          sourceField.fieldItems.forEach((e, idx) => {
            fieldItems.push({
              itemId: e.itemId,
              itemLabel: e.itemLabel,
              itemOrder: e.itemOrder,
              isDefault: e.isDefault
            });
          });
        }
        const newField = _.cloneDeep(sourceField);
        newField['fieldItems'] = fieldItems;
        objectFieldInfos.push(newField);
      } else {
        const fieldIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, sourceField));
        if (fieldIndex >= 0) {
          objectFieldInfos.splice(fieldIndex, 1);
        }
      }
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      setListFieldSearch(objectFieldInfos);
    }
    clearDisplayMessage();
  };

  const onDragDropField = (fieldSrc, fieldTarget) => {
    if (!fieldSrc) {
      return;
    }
    const newFieldItems = [];
    if (fieldSrc.fieldItems && Array.isArray(fieldSrc.fieldItems) && fieldSrc.fieldItems.length > 0) {
      fieldSrc.fieldItems.forEach((e, idx) => {
        newFieldItems.push({
          itemId: e.itemId,
          itemLabel: e.itemLabel,
          itemOrder: e.itemOrder,
          isDefault: e.isDefault
        });
      });
    }
    const newField = _.cloneDeep(fieldSrc);
    newField['fieldItems'] = newFieldItems;
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    if (_.isNil(fieldTarget)) {
      if (listFieldSearch.findIndex(e => isFieldEqual(e, fieldSrc)) < 0) {
        objectFieldInfos.push(newField);
        setListFieldSearch(objectFieldInfos);
      }
      return;
    }
    if (objectFieldInfos && objectFieldInfos.length > 0) {
      const fieldIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, fieldTarget));
      const existedFieldIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, fieldSrc));
      if (fieldIndex >= 0) {
        if (fieldIndex === existedFieldIndex) {
          return;
        }
        if (existedFieldIndex < 0) {
          objectFieldInfos.splice(fieldIndex, 0, newField);
        } else {
          const tempObject = objectFieldInfos.splice(fieldIndex, 1, objectFieldInfos[existedFieldIndex])[0]; // get the item from the array
          objectFieldInfos.splice(existedFieldIndex, 1, tempObject);
        }
      }
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      setListFieldSearch(objectFieldInfos);
    }
    clearDisplayMessage();
  };

  const changeSelectFieldSetting = (type: number) => {
    const listFields = listFieldSetting.filter(e => isMatchFilter(e, props.fieldBelong, false) && isAvailable(e.availableFlag));
    const listFieldRelation = listFieldSetting.filter(
      e => _.isEqual(_.toString(e.fieldType), DEFINE_FIELD_TYPE.RELATION) && isAvailable(e.availableFlag)
    );
    listFieldRelation.forEach(fieldRelation => {
      customFieldsInfo
        .filter(field => isMatchFilter(field, fieldRelation.relationData.fieldBelong, true))
        .forEach(el => {
          const fieldInfo = _.cloneDeep(el);
          fieldInfo.relationFieldId = fieldRelation.fieldId;
          listFields.push(fieldInfo);
        });
    });
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    for (let i = 0; i < listFields.length; i++) {
      const existIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, listFields[i]));
      if (type === 0) {
        if (existIndex >= 0) {
          objectFieldInfos.splice(existIndex, 1);
        }
        continue;
      }
      const newFieldItems = [];
      if (listFields[i].fieldItems && Array.isArray(listFields[i].fieldItems) && listFields[i].fieldItems.length > 0) {
        listFields[i].fieldItems.forEach((item, idx) => {
          newFieldItems.push({
            itemId: item.itemId,
            itemLabel: item.itemLabel,
            itemOrder: item.itemOrder,
            isDefault: item.isDefault
          });
        });
      }
      const fieldInfo = _.cloneDeep(listFields[i]);
      fieldInfo['fieldItems'] = newFieldItems;
      if (type === 1 && existIndex < 0) {
        objectFieldInfos.push(fieldInfo);
      } else if (type === -1 && existIndex < 0) {
        objectFieldInfos.push(fieldInfo);
      } else if (type === -1 && existIndex >= 0) {
        objectFieldInfos.splice(existIndex, 1);
      }
    }
    setListFieldSearch(objectFieldInfos);
    clearDisplayMessage();
  };

  const onMoveField = (fieldDrag, fieldDrop) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    const dropIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, fieldDrop));
    const dragIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, fieldDrag));
    if (dropIndex >= 0 && dragIndex >= 0) {
      const tempObject = objectFieldInfos.splice(dragIndex, 1)[0];
      objectFieldInfos.splice(dropIndex, 0, tempObject);
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      setListFieldSearch(objectFieldInfos);
    }
    clearDisplayMessage();
  };

  const isItemSelected = item => {
    const matchList = listFieldSearch.filter(e => isFieldEqual(e, item));
    return matchList.length > 0;
  };

  const onBeforeUnload = ev => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, forceCloseWindow: false }, window.location.origin);
    }
  };

  const getRelationFieldName = (belong: number, field) => {
    let serviceName = '';
    if (props.serviceInfo) {
      const idx = props.serviceInfo.findIndex(e => e.serviceId === belong);
      if (idx >= 0) {
        serviceName = getFieldLabel(props.serviceInfo[idx], 'serviceName');
      }
    }
    return `${serviceName} (${getFieldLabel(field, 'fieldLabel')})`;
  };

  const onReceiveMessage = ev => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        } else {
          props.onCloseFieldsSearch(saveConditionSearch);
        }
      } else if (ev.data.type === FSActionTypeScreen.Search) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        setForceSearch(true);
      }
    }
  };

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }
  const getHeightByFieldBelong = () => {
    if (fieldBelong === FIELD_BELONG.EMPLOYEE) {
      return "height100vh-200";
    }
  }

  const renderComponentInputSearch = () => {
    return (
      // <div className="modal popup-esr user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show popup-search" id="popup-esr" aria-hidden="true">
        <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
          <div className="modal-content">
            {renderModalHeader()}
            <div className="modal-body position-relative style-3">
              <div className={`popup-content style-3 ${getHeightByFieldBelong()}`}>
                <div className="user-popup-form">
                  {displayMessage()}
                  <a onClick={handleDisplaySetting} className="button-primary button-activity-registration">
                    {translate('global.button.edit-search-condition')}
                  </a>
                  <form>
                    <div className="row break-row">
                      {shouldRender &&
                        fields.map((item, index) => {
                          if (item.relationFieldId > 0) {
                            item['fieldRelation'] = _.find(customFieldsInfo, { fieldId: item.relationFieldId })
                          }
                          const key = `${item.fieldId}${item.fieldItems ? '-' + item.fieldItems.map(o => _.toString(o.itemId)).join('') : ''}-${_.get(item, 'fieldRelation.fieldId')}`
                          return (
                            !item.disableDisplaySearch &&
                            <DynamicControlField
                              key={key}
                              belong={fieldBelong}
                              className={'col-lg-9 form-group'}
                              isFocus={index === 0 && first}
                              controlType={ControlType.SEARCH}
                              enterInputControl={handleSearch}
                              elementStatus={getDataStatusControl(item)}
                              fieldInfo={item}
                              updateStateElement={updateStateField}
                            />
                          )
                        })}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <a onClick={handleSearch} className="button-blue button-form-register ">
                {translate('global.label.local-filter')}
              </a>
            </div>
            {displayMessageSuccess()}
          </div>
        </div>
      </div>
    );
  };

  const setDisplayRelationOption = (idx) => {
    const optionArr = _.cloneDeep(optionRelation);
    optionArr[idx] = !optionArr[idx];
    setOptionRelation(optionArr);
  }

  const renderComponentSettingSearch = () => {
    let listField = customFieldsInfo.filter(e => isMatchFilter(e, fieldBelong, false) && (_.isNil(e.relationFieldId) || e.relationFieldId <= 0));
    if (props.layoutData) {
      listField = convertSpecialField(listField, props.layoutData, props.fieldBelong);
    }
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right popup-fields-search-scroll show" id="popup-esr" aria-hidden="true">
        <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
          <div className="modal-content">
            {renderModalHeader()}
            <div className="modal-body style-3">
              <div ref={dropBody} className="popup-content style-3">
                {/* <a href="#" title="" className="button-activity-registration">検索条件編集</a> */}
                <div className="user-popup-form">
                  {displayMessage()}
                  <form>
                    <div className="row break-row">
                      {shouldRender &&
                        listFieldSearch.map((item, index) => {
                          if (item.relationFieldId > 0) {
                            item['fieldRelation'] = _.find(customFieldsInfo, { fieldId: item.relationFieldId })
                          }
                          const key = `${item.fieldId}${item.fieldItems ? '-' + item.fieldItems.map(o => _.toString(o.itemId)).join('') : ''}-${_.get(item, 'fieldRelation.fieldId')}`
                          return (
                            !item.disableDisplaySearch &&
                            item.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER &&
                            <DynamicControlField
                              key={key}
                              belong={fieldBelong}
                              className={'col-lg-9 form-group'}
                              fieldInfo={item}
                              isDisabled={true}
                              isDnDAddField={true}
                              isDnDMoveField={true}
                              moveFieldCard={onMoveField}
                            />
                          )
                        })}
                    </div>
                  </form>
                </div>
              </div>
              <div className="wrap-list style-3">
                <div className="d-flex justify-content-end">
                  <a onClick={handleCloseSettingField} className="button-primary button-activity-registration button-cancel">
                    {translate('global.button.cancel')}
                  </a>
                  <a onClick={handleUpdateSettingField} className="button-blue button-activity-registration">
                    {translate('global.button.save-search-criteria')}
                  </a>
                </div>
                <div className="search-box-button-style margin-y-20">
                  <button className="icon-search">
                    <i className="far fa-search"></i>
                  </button>
                  <input
                    type="text"
                    defaultValue={fieldFilter}
                    placeholder={translate('global.placeholder.find-item')}
                    onChange={event => setFieldFilter(event.target.value.trim())}
                  />
                </div>
                <a onClick={e => changeSelectFieldSetting(1)} className="button-primary button-activity-registration">
                  {translate('global.button.select-all')}
                </a>
                <a onClick={e => changeSelectFieldSetting(0)} className="button-primary button-activity-registration">
                  {translate('global.button.deselect-all')}
                </a>
                <a onClick={e => changeSelectFieldSetting(-1)} className="button-primary button-activity-registration">
                  {translate('global.button.selection-inversion')}
                </a>
                <div className="wrap-checkbox margin-top-20">
                  <FieldCardDragLayer fieldBelong={props.fieldBelong} />
                  {listField.map((item, idx) => {
                    if (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION && !item.disableDisplaySearch) {
                      return (<div className="overflow-hidden">
                        <button className={optionRelation[idx] ? "select-option select-option-relation arrow-up" : "select-option select-option-relation"} onClick={() => setDisplayRelationOption(idx)}>
                          <span className="select-text">{getRelationFieldName(item.relationData.fieldBelong, item)}</span>
                        </button>
                        {optionRelation[idx] &&
                          <ul className="drop-down drop-down2 select-option-search-common">
                            {customFieldsInfo
                              .filter(e => isMatchFilter(e, item.relationData.fieldBelong, true))
                              .map(el => {
                                const fieldInfo = _.cloneDeep(el);
                                fieldInfo.relationFieldId = item.fieldId;
                                return (
                                  !el.disableDisplaySearch &&
                                  el.fieldType.toString() !== DEFINE_FIELD_TYPE.OTHER &&
                                  <li className="item smooth" key={el.fieldId}>
                                    <PopupFieldCard
                                      key={el.fieldId}
                                      text={getFieldLabel(el, 'fieldLabel')}
                                      fieldBelong={item.relationData.fieldBelong}
                                      fieldInfo={fieldInfo}
                                      isChecked={isItemSelected(fieldInfo)}
                                      onSelectField={onSelectField}
                                      onDragDropField={onDragDropField}
                                    />
                                  </li>
                                );
                              })}
                          </ul>
                        }
                      </div>
                      );
                    } else {
                      return (
                        !item.disableDisplaySearch &&
                        <PopupFieldCard
                          key={idx}
                          fieldBelong={fieldBelong}
                          text={getFieldLabel(item, 'fieldLabel')}
                          fieldInfo={item}
                          isChecked={isItemSelected(item)}
                          onSelectField={onSelectField}
                          onDragDropField={onDragDropField}
                          iconSrc={`/content/images/${iconFunction}`}
                        />
                      );
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-field-search" autoFocus={true} zIndex="auto">
          {!showCustomField && renderComponentInputSearch()}
          {showCustomField && renderComponentSettingSearch()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          {!showCustomField && renderComponentInputSearch()}
          {showCustomField && renderComponentSettingSearch()}
        </>
      );
    } else {
      return <></>;
    }
  }
};

const mapStateToProps = ({ popupFieldsSearch, applicationProfile }: IRootState) => ({
  tenant: applicationProfile.tenant,
  action: popupFieldsSearch.action,
  fieldInfos: popupFieldsSearch.fieldInfos,
  customField: popupFieldsSearch.customField,
  serviceInfo: popupFieldsSearch.servicesInfo,
  errorMessage: popupFieldsSearch.errorMessage,
  successMessage: popupFieldsSearch.successMessage
});

const mapDispatchToProps = {
  getFieldInfoPersonals,
  getCustomFieldsInfo,
  getServicesInfo,
  handleUpdateField,
  reset
};

export default connect<IPopupFieldsSearchStateProps, IPopupFieldsSearchDispatchProps, IPopupFieldsSearchOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PopupFieldsSearch);
