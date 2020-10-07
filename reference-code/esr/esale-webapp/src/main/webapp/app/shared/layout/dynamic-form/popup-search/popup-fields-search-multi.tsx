import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Storage, translate } from 'react-jhipster';
import { useDrop } from 'react-dnd';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { FIELD_ITEM_TYPE_DND, DEFINE_FIELD_TYPE, FIELD_NAME } from 'app/shared/layout/dynamic-form/constants';
import DynamicControlField from '../control-field/dynamic-control-field';
import {
  getFieldInfoPersonals,
  getCustomFieldsInfo,
  getServicesInfo,
  getServiceLayout,
  handleUpdateField,
  addConditionRelation,
  addConditionSubService,
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
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { getFieldNameExtension } from 'app/modules/modulo-bridge';
import { getIconSrc } from 'app/config/icon-loader';
import { fieldTypeSearchSpecial, fieldSearchIgnore } from './constants';
import { getFieldItemsSpecial, buildAdditionConditionBelong } from './field-search-helper';

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search
}

interface IPopupFieldsSearchMultiDispatchProps {
  getFieldInfoPersonals;
  getCustomFieldsInfo;
  getServicesInfo;
  getServiceLayout;
  handleUpdateField;
  reset;
}

interface IPopupFieldsSearchMultiStateProps {
  tenant;
  action: any;
  fieldInfos: any;
  customField: any;
  serviceInfo: any;
  servicesLayout: any;
  errorMessage: string;
  successMessage: string;
}

interface IPopupFieldsSearchMultiOwnProps {
  iconFunction?: string;
  conditionSearch?: { fieldId; fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[];
  listFieldBelong: { fieldBelong; isMain; ignoreSearch? }[];
  orderByFieldBelong?: boolean;
  popout?: boolean;
  hiddenShowNewTab?: boolean;
  isOpenedFromModal?: boolean; // = true if this modal is opened from another modal,
  selectedTargetType?: number,
  selectedTargetId?: any,
  isNotCallApi?: boolean,
  isFieldAvailable?: (fieldBelong: number, field: any) => boolean,
  onCloseFieldsSearch?: (saveCondition: { fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
  onActionSearch?: (saveCondition: { fieldType; isDefault; fieldName; fieldValue; searchType; searchOption }[]) => void;
}

type IPopupFieldsSearchMultiProps = IPopupFieldsSearchMultiDispatchProps & IPopupFieldsSearchMultiStateProps & IPopupFieldsSearchMultiOwnProps;

const PopupFieldsSearchMulti: React.FC<IPopupFieldsSearchMultiProps> = props => {
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  const [servicesLayout, setServicesLayout] = useState([]);
  const [conditionSearch, setConditionSearch] = useState(props.conditionSearch);
  const [listFieldBelong, setListFieldBelong] = useState<{ fieldBelong; isMain }[]>(props.listFieldBelong);
  const [showProgress, setShowProgress] = useState(false);
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
  const [optionRelation, setOptionRelation] = useState<{ fieldBelong, index, collap }[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [forceSearch, setForceSearch] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [, setFirstChange] = useState(false);
  const [conditionDefault, setConditionDefault] = useState(null);
  const [fieldBelongApply, setFieldBelongApply] = useState([]);
  const [isProductTrading, setIsProductTrading] = useState(false);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(PopupFieldsSearchMulti.name, {
        listFieldBelong,
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
        customFieldsInfo,
        servicesLayout
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(PopupFieldsSearchMulti.name);
      if (saveObj) {
        setListFieldBelong(saveObj.listFieldBelong);
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
        setServicesLayout(saveObj.servicesLayout)
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupFieldsSearchMulti.name);
    }
  };

  useEffect(() => {
    if (props.fieldInfos && props.fieldInfos.fieldInfoPersonals) {
      // TODO convert field type 99
      setFields(props.fieldInfos.fieldInfoPersonals);
    }
  }, [props.fieldInfos]);

  useEffect(() => {
    if (props.customField && props.customField.customFieldsInfo) {
      if (props.customField.customFieldsInfo.length > 0 && listFieldBelong.findIndex(e => e.fieldBelong === props.customField.customFieldsInfo[0].fieldBelong) >= 0) {
        customFieldsInfo.push(
          ...props.customField.customFieldsInfo.filter(e => customFieldsInfo.findIndex(o => o.fieldId === e.fieldId) < 0)
        );
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
          if (tmp.findIndex(o => o === relativeFields[i].relationData.fieldBelong) < 0 && listFieldBelong.findIndex(e => e.fieldBelong === relativeFields[i].relationData.fieldBelong) < 0) {
            tmp.push(relativeFields[i].relationData.fieldBelong);
          }
        }
        tmp.filter(o => fieldBelongApply.findIndex(belong => belong === o) < 0).forEach(el => {
          props.getCustomFieldsInfo(el);
          if (_.findIndex(servicesLayout, (i: any) => i.fieldBelong === el) < 0) {
            props.getServiceLayout(el);
          }
        });
        fieldBelongApply.push(...tmp.filter(o => fieldBelongApply.findIndex(belong => belong === o) < 0))
      } else {
        customFieldsInfo.push(
          ...props.customField.customFieldsInfo.filter(e => customFieldsInfo.findIndex(o => o.fieldId === e.fieldId) < 0)
        );
      }
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
      if (listFieldBelong.findIndex(e => e.isMain) >= 0) {
        props.getFieldInfoPersonals(_.get(_.find(listFieldBelong, { isMain: true }), 'fieldBelong'));
      }
      listFieldBelong.forEach((belong => {
        if(belong.fieldBelong === FIELD_BELONG.PRODUCT_TRADING && belong.isMain === true){
          setIsProductTrading(true);
        }
        if (customFieldsInfo.findIndex(e => e.fieldBelong === belong.fieldBelong) < 0) {
          props.getCustomFieldsInfo(belong.fieldBelong);
        }
        if (_.findIndex(servicesLayout, (i: any) => i.fieldBelong === belong.fieldBelong) < 0) {
          props.getServiceLayout(belong.fieldBelong);
        }
      }))
      setFieldBelongApply(listFieldBelong.map(e => e.fieldBelong))
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
    if (props.customField && props.customField.customFieldsInfo && props.customField.customFieldsInfo.length > 0) {
      const tmp = props.customField.customFieldsInfo.filter(e => listFieldSetting.findIndex(o => o.fieldId === e.fieldId) < 0)
      listFieldSetting.push(...tmp)
      setListFieldSetting(_.cloneDeep(listFieldSetting));
    }
  }, [props.customField]);

  useEffect(() => {
    if (props.action === FieldsSearchAction.Success) {
      setTimeout(function () {
        setFirstChange(true)
      }, 300);
    } else if (props.action === FieldsSearchAction.UpdateCompleted) {
      setIsUpdating(false);
    }
  }, [props.action])

  useEffect(() => {
    if (props.servicesLayout && _.has(props.servicesLayout, 'fieldBelong')) {
      const idx = servicesLayout.findIndex(e => e.fieldBelong === _.get(props.servicesLayout, 'fieldBelong'))
      if (idx < 0) {
        servicesLayout.push(props.servicesLayout);
      } else {
        servicesLayout[idx] = _.cloneDeep(props.servicesLayout);
      }
      setServicesLayout(_.cloneDeep(servicesLayout));
    }
  }, [props.servicesLayout])

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

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  }

  const handleClosePopup = () => {
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
      });
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
      const mainBelong = _.get(_.find(listFieldBelong, { isMain: true }), 'fieldBelong');
      return <img className="icon-group-user" src={baseUrl + `${getIconSrc(mainBelong)}`} alt="" />
    } else {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${iconFunction}`} alt="" />;
    }
  };

  const isAvailable = flag => {
    return flag === AVAILABLE_FLAG.WEB_APP_AVAILABLE;
  };

  const isFieldIgnored = (field) => {
    const idx = fieldSearchIgnore.findIndex(e => e.fieldBelong === field.fieldBelong)
    if (idx < 0) {
      return false;
    }
    return fieldSearchIgnore[idx].fields.findIndex(e => StringUtils.equalPropertyName(e, _.trim(field.fieldName))) >= 0;
  }

  const isMatchFilter = (item, belong, isRelation) => {
    const LINK_FIXED = 2
    if (isFieldIgnored(item) ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TAB ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP ||
      (item.fieldType.toString() === DEFINE_FIELD_TYPE.LINK && item.urlType === LINK_FIXED) ||
      !isAvailable(item.availableFlag) ||
      item.fieldBelong !== belong
    ) {
      return false;
    }
    if (props.isFieldAvailable) {
      if (!props.isFieldAvailable(belong, item)) {
        return false;
      }
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
    handleClosePopup()
  };

  const handleSearchSubServices = async (conditions: any[], conditionsIgnore: any[]) => {
    const mainBelong = _.get(_.find(listFieldBelong, { isMain: true }), 'fieldBelong');
    const subBelongs = listFieldBelong.filter(e => !e.isMain).map(e => e.fieldBelong);
    const additionConds = [];
    for (let i = 0; i < subBelongs.length; i++) {
      if (_.find(props.listFieldBelong, {fieldBelong: subBelongs[i], ignoreSearch: true})) {
        continue;
      }
      const listInputCondition = [];
      saveConditionSearch.forEach(e => {
        const fieldInfoIdx = customFieldsInfo.findIndex(field => field.fieldId === e.fieldId);
        if (fieldInfoIdx >= 0 && 
            (customFieldsInfo[fieldInfoIdx].fieldBelong === subBelongs[i] || _.get(e, 'fieldRelation.fieldBelong') === subBelongs[i])
            && _.get(e, 'fieldRelation.fieldBelong') !== mainBelong) {
          listInputCondition.push(_.cloneDeep(e));
        }
      });
      const aIdx = additionConds.findIndex( e => e.fieldBelong === subBelongs[i] );
      if (aIdx >= 0) {
        listInputCondition.push(additionConds[aIdx].condition);
      }
      await addConditionSubService(conditions, listInputCondition, customFieldsInfo, mainBelong, subBelongs[i])
      const additionCond = buildAdditionConditionBelong(mainBelong, subBelongs[i], conditions, customFieldsInfo);
      if (!_.isNull(additionCond)) {
        additionConds.push(additionCond);
      }
    }
    conditions.push(...conditionsIgnore);
  }

  const handleSearch = async () => {
    setShowProgress(true);
    _.remove(saveConditionSearch, obj => _.isNil(_.get(obj, 'fieldId')) || fields.findIndex(field => field.fieldId === _.get(obj, 'fieldId')) < 0);
    if (saveConditionSearch && fields && saveConditionSearch.length > 0 && fields.length > 0) {
      const mainBelong = _.get(_.find(listFieldBelong, { isMain: true }), 'fieldBelong');
      const conditions = [];
      const conditionsIgnore = [];
      saveConditionSearch.forEach(e => {
        const fieldInfoIdx = customFieldsInfo.findIndex(field => field.fieldId === e.fieldId);
        if (fieldInfoIdx >= 0 && (customFieldsInfo[fieldInfoIdx].fieldBelong === mainBelong || _.get(e, 'fieldRelation.fieldBelong') === mainBelong)) {
          if (e.fieldRelation && e.fieldRelation.relationData && e.fieldRelation.relationData && e.fieldRelation.relationData.fieldBelong) {
            e.fieldName = getFieldNameElastic(e, getFieldNameExtension(+e.fieldRelation.relationData.fieldBelong));
          } else {
            e.fieldName = getFieldNameElastic(e, getFieldNameExtension(mainBelong));
          }
          if (e.isSearchBlank) {
            e.fieldValue = "";
          }
          const filters = fields.filter(item => item.fieldId.toString() === e.fieldId.toString());
          if (filters.length > 0) {
            conditions.push(e);
          }
        } else {
          const objConditions = _.cloneDeep(e);
          if (_.find(props.listFieldBelong, {fieldBelong: customFieldsInfo[fieldInfoIdx].fieldBelong, ignoreSearch: true})) {
            objConditions['ignore'] = false;
          } else {
            objConditions['ignore'] = true;
          }
          conditionsIgnore.push(objConditions);
        }
      });
      if (!props.isNotCallApi) {
        await addConditionRelation(conditions);
        await handleSearchSubServices(conditions, conditionsIgnore);
      }
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
          if (!props.isNotCallApi) {
            await addConditionRelation(saveConditionSearch);
          }
          props.onActionSearch(saveConditionSearch);
        }
      }
    }
  };

  useEffect(() => {
    if (forceSearch) {
      handleSearch();
    }
  }, [forceSearch]);

  const handleDisplaySetting = () => {
    // setIsChange(true);
    setShowCustomField(true);
    setFieldFilter('');
    setListFieldSearch(fields);
  };

  const handleUpdateSettingField = event => {
    event.preventDefault();
    if (!listFieldSearch || listFieldSearch.length <= 0) {
      setMsgError("AT_LEAST_ONE_FIELD_IS_CHOSEN");
      return;
    }
    setIsUpdating(true);
    const objParams = [];
    const fieldBelongObj = _.find(listFieldBelong, { isMain: true })
    listFieldSearch.forEach((el, idx) => {
      const obj = _.cloneDeep(el);
      obj.fieldOrder = idx + 1;
      obj.relationFieldId = el.relationFieldId > 0 ? el.relationFieldId : null;
      objParams.push(obj);
    });
    // update then selectedTargetType and selectedTargetId value 0
    props.handleUpdateField(objParams, _.get(fieldBelongObj, 'fieldBelong'), EXTENSION_BELONG.SEARCH_DETAIL, 0, 0);
    setIsChange(false);
  };

  const handleCloseSettingField = () => {
    setIsChange(false);
    setMsgError('');
    setShowCustomField(false);
    // setCustomFieldsInfo([]);
    setListFieldSearch([]);
    // setListFieldSetting([]);
  };

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/fields-search-multi`, '', style.toString());
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
    // if (firstChange) {
    //   setIsChange(true)
    // }
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

  const isFieldOfBelong = (field, fieldBelong: number) => {
    if (_.get(field, 'fieldBelong') === fieldBelong || _.get(field, 'relationData.fieldBelong') === fieldBelong) {
      return true
    }
    if (_.get(field, 'relationFieldId') > 0 && _.get(_.find(customFieldsInfo, { fieldId: _.get(field, 'relationFieldId') }), 'fieldBelong') === fieldBelong) {
      return true;
    }
    return false;
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
      let order = 1;
      listFieldBelong && listFieldBelong.forEach(e => {
        const tmp = objectFieldInfos.filter(field => isFieldOfBelong(field, e.fieldBelong));
        for (let i = 0; i < tmp.length; i++) {
          const idx = objectFieldInfos.findIndex(field => isFieldEqual(field, tmp[i].fieldId));
          if (idx >= 0) {
            objectFieldInfos[idx].fieldOrder = order;
          }
          order += 1;
        }
      })
      setListFieldSearch(objectFieldInfos);
    }
    clearDisplayMessage();
    setIsChange(true);
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
    setIsChange(true);
  };

  const changeSelectFieldSetting = (type: number) => {
    const objectFieldInfos = _.cloneDeep(listFieldSearch);
    listFieldBelong.forEach((belong) => {
      const listFields = listFieldSetting.filter(e => isMatchFilter(e, belong.fieldBelong, false) && isAvailable(e.availableFlag));
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
    })
    setListFieldSearch(objectFieldInfos);
    clearDisplayMessage();
    setIsChange(true);
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
    setIsChange(true);
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

  const setDisplayRelationOption = (fieldBelong, idx) => {
    const optionCollapIndex = optionRelation.findIndex(e => e.fieldBelong === fieldBelong && e.index === idx);
    if (optionCollapIndex < 0) {
      optionRelation.push({ fieldBelong, index: idx, collap: true })
    } else {
      optionRelation[optionCollapIndex].collap = !optionRelation[optionCollapIndex].collap;
    }
    setOptionRelation(_.cloneDeep(optionRelation));
  }

  const isAreaRelationCollap = (fieldBelong, idx) => {
    const optionCollap = _.find(optionRelation, { fieldBelong, index: idx });
    if (!optionCollap) {
      return false;
    } else {
      return optionCollap.collap;
    }
  }

  const orderByFieldBelong = (listField: any[]) => {
    if (!props.orderByFieldBelong) {
      return listField;
    }
    const tmp = [];
    props.listFieldBelong.forEach(e => {
      tmp.push(...listField.filter(field => isFieldOfBelong(field, e.fieldBelong)));
    });
    return tmp;
  }

  const convertSpecialField = (field) => {
    if (!field) {
      return field;
    }

    // change name contact_date
    if (
      field.fieldType ===  DEFINE_FIELD_TYPE.OTHER &&
      field.fieldName === FIELD_NAME.CONTACT_DATE &&
      field.fieldBelong === FIELD_BELONG.ACTIVITY
    ) {
      field.fieldLabel = translate('sales.contact-date1')
      return field
    }

    if (field.relationFieldId > 0) {
      field.fieldRelation = _.find(customFieldsInfo, { fieldId: field.relationFieldId })
    }
    const fieldBelongIdx = fieldTypeSearchSpecial.findIndex(e => e.fieldBelong === field.fieldBelong && e.fields && _.size(e.fields) > 0);
    if (fieldBelongIdx < 0) {
      return field;
    }
    const fieldIdx = fieldTypeSearchSpecial[fieldBelongIdx].fields.findIndex(e => StringUtils.equalPropertyName(e.fieldName, field.fieldName));
    if (fieldIdx < 0) {
      return field;
    }
    const newField = _.cloneDeep(field);
    newField.fieldType = +fieldTypeSearchSpecial[fieldBelongIdx].fields[fieldIdx].fieldType;
    const fieldItems = getFieldItemsSpecial(newField, servicesLayout);
    if (fieldItems && fieldItems.length > 0) {
      newField.fieldItems = fieldItems;
    }

 
    return newField;
  }

  const renderProgressBar = () => {
    if (!showProgress || listFieldBelong.findIndex(e => !e.isMain) < 0) {
      return <></>;
    }
    return (
      <div style={{ position: 'fixed', left: 0, top: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', zIndex: 99999 }}>
        <div className="" >
          <div className="sk-fading-circle">
            <div className="sk-circle1 sk-circle"></div>
            <div className="sk-circle2 sk-circle"></div>
            <div className="sk-circle3 sk-circle"></div>
            <div className="sk-circle4 sk-circle"></div>
            <div className="sk-circle5 sk-circle"></div>
            <div className="sk-circle6 sk-circle"></div>
            <div className="sk-circle7 sk-circle"></div>
            <div className="sk-circle8 sk-circle"></div>
            <div className="sk-circle9 sk-circle"></div>
            <div className="sk-circle10 sk-circle"></div>
            <div className="sk-circle11 sk-circle"></div>
            <div className="sk-circle12 sk-circle"></div>
          </div>
        </div>
      </div>
    )
  }

  const renderComponentInputSearch = () => {
    const fieldsSearch = orderByFieldBelong(fields);
    return (
      <>
        <div className={"modal popup-esr popup-esr4 user-popup-page popup-align-right show popup-search"} id="popup-esr" aria-hidden="true">

          <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
            <div className="modal-content">
              {renderModalHeader()}
              <div className="modal-body position-relative style-3">
                <div className="popup-content style-3 overflow-y-hover">
                  <div className="user-popup-form">
                    {displayMessage()}
                    <a onClick={handleDisplaySetting} className="button-primary button-activity-registration">
                      {!isProductTrading?translate('global.button.edit-search-condition'):translate('sales.button.edit-search-condition')}
                    </a>
                    <form>
                      <div className="row break-row">
                        {shouldRender && !isUpdating &&
                          fieldsSearch.map((item, index) => {
                            const fieldConvert = convertSpecialField(item);
                            const key = `${fieldConvert.fieldId}${fieldConvert.fieldItems ? '-' + fieldConvert.fieldItems.map(o => _.toString(o.itemId)).join('') : ''}-${_.get(fieldConvert, 'fieldRelation.fieldId')}`
                            return (
                              !item.disableDisplaySearch &&
                              <DynamicControlField
                                key={key}
                                belong={fieldConvert.fieldBelong}
                                className={'col-lg-9 form-group'}
                                isFocus={index === 0 && first}
                                controlType={ControlType.SEARCH}
                                enterInputControl={handleSearch}
                                elementStatus={getDataStatusControl(fieldConvert)}
                                fieldInfo={fieldConvert}
                                updateStateElement={updateStateField}
                              />
                            )
                          })}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="user-popup-form-bottom">
                  <a onClick={handleSearch} className="button-blue button-form-register ">
                    {translate('global.label.local-filter')}
                  </a>
                </div>
                {displayMessageSuccess()}
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
        {renderProgressBar()}
      </>
    );
  };

  const renderFieldSettingWithBelong = (fieldBelong: number) => {
    const listField = customFieldsInfo.filter(e => isMatchFilter(e, fieldBelong, false) && (_.isNil(e.relationFieldId) || e.relationFieldId <= 0));
    // if (props.layoutData) {
    //   listField = convertSpecialField(listField, props.layoutData, props.fieldBelong);
    // }
    return (
      <>
        {listField.map((item, idx) => {
          if (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION && !item.disableDisplaySearch) {
            return (<div className="overflow-hidden">
              <button className={isAreaRelationCollap(fieldBelong, idx) ? "select-option select-option-relation arrow-up" : "select-option select-option-relation"} onClick={() => setDisplayRelationOption(fieldBelong, idx)}>
                <span className="select-text">{getRelationFieldName(item.relationData.fieldBelong, item)}</span>
              </button>
              {isAreaRelationCollap(fieldBelong, idx) &&
                <ul className="drop-down drop-down2 select-option-search-common">
                  {customFieldsInfo
                    .filter(e => isMatchFilter(e, item.relationData.fieldBelong, true))
                    .map(el => {
                      const fieldInfo = _.cloneDeep(el);
                      fieldInfo.fieldRelation = _.find(customFieldsInfo, { fieldId: item.fieldId })
                      fieldInfo.relationFieldId = item.fieldId;
                      return (
                        !el.disableDisplaySearch &&
                        <li className="item smooth" key={el.fieldId}>
                          <PopupFieldCard
                            key={el.fieldId}
                            text={getFieldLabel(el, 'fieldLabel')}
                            isDnDWithBelong={props.orderByFieldBelong}
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
                isDnDWithBelong={props.orderByFieldBelong}
                fieldInfo={item}
                isChecked={isItemSelected(item)}
                onSelectField={onSelectField}
                onDragDropField={onDragDropField}
                iconSrc={getIconSrc(fieldBelong)}
              />
            );
          }
        })}
      </>)
  }

  const renderComponentSettingSearch = () => {
    const fieldsSearch = orderByFieldBelong(listFieldSearch);
    return (
      <div className={"modal popup-esr popup-esr4 user-popup-page popup-align-right popup-fields-search-scroll show"} id="popup-esr" aria-hidden="true">
        <div className={showModal ? 'modal-dialog form-popup' : 'form-popup'}>
          <div className="modal-content">
            {renderModalHeader()}
            <div className="modal-body style-3">
              <div ref={dropBody} className="popup-content style-3 overflow-y-hover">
                {/* <a href="#" title="" className="button-activity-registration">検索条件編集</a> */}
                <div className="user-popup-form">
                  {displayMessage()}
                  <form>
                    <div className="row break-row">
                      {shouldRender &&
                        fieldsSearch.map((item, index) => {
                          return (
                            !item.disableDisplaySearch &&
                            <DynamicControlField
                              key={index}
                              belong={item.fieldBelong}
                              isDnDWithBelong={props.orderByFieldBelong}
                              className={'col-lg-9 form-group'}
                              fieldInfo={convertSpecialField(item)}
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
                  {listFieldBelong.map((belong) => {
                    return (
                      <>
                        <FieldCardDragLayer key={belong.fieldBelong} fieldBelong={belong.fieldBelong} />
                        {renderFieldSettingWithBelong(belong.fieldBelong)}
                      </>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getCustomClassWrapper = () => {
    let className = "";
    const mainBelong = _.get(_.find(listFieldBelong, { isMain: true }), 'fieldBelong');
    if (mainBelong === FIELD_BELONG.BUSINESS_CARD) {
      className = " popup-search ";
    }
    return className;
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-field-search" autoFocus={true} zIndex="auto">
          <div className={getCustomClassWrapper()}>
            {!showCustomField && renderComponentInputSearch()}
            {showCustomField && renderComponentSettingSearch()}
          </div>

        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return (
        <>
          <div className={getCustomClassWrapper()}>
            {!showCustomField && renderComponentInputSearch()}
            {showCustomField && renderComponentSettingSearch()}
          </div>
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
  servicesLayout: popupFieldsSearch.servicesLayout,
  errorMessage: popupFieldsSearch.errorMessage,
  successMessage: popupFieldsSearch.successMessage
});

const mapDispatchToProps = {
  getFieldInfoPersonals,
  getCustomFieldsInfo,
  getServicesInfo,
  getServiceLayout,
  handleUpdateField,
  reset
};

export default connect<IPopupFieldsSearchMultiStateProps, IPopupFieldsSearchMultiDispatchProps, IPopupFieldsSearchMultiOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(PopupFieldsSearchMulti);
