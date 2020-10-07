import React, { useState, useEffect } from 'react';
import { Modal } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Storage, translate } from 'react-jhipster';
import { useDrop } from 'react-dnd';
import StringUtils from 'app/shared/util/string-utils';
import './scrollSearch.scss'
import {DEFINE_FIELD_TYPE, FIELD_ITEM_TYPE_DND} from 'app/shared/layout/dynamic-form/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';

import {
  getFieldInfoPersonals,
  getCustomFieldsMilestoneInfo,
  getCustomFieldsScheduleInfo,
  getCustomFieldsTaskInfo,
  handleUpdateField,
  reset,
  getListSearchFields,
  callApiGetScheduleTypes
} from './popup-fields-search.reducer'
import PopupFieldCard from './popup-field-card';
import { IRootState } from 'app/shared/reducers';
import useEventListener from 'app/shared/util/use-event-listener';
import BoxMessage, {MessageType} from 'app/shared/layout/common/box-message';

import FieldCardDragLayer from './field-card-drag-layer';
import {AVAILABLE_FLAG, ControlType} from 'app/config/constants';
import {ID_FIELD_INFO} from '../constants';
import {isArray} from "util";
import {handleSearchConditions} from "../grid/calendar-grid.reducer";
// import CalendarControlRight from "app/modules/calendar/control/calendar-control-right";


export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

type ISearchAdvanced = StateProps & DispatchProps & {
  iconFunction?: string,
  scheduleConditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[],
  taskConditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[],
  milestoneConditionSearch?: { fieldId, fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[],
  popout?: boolean,
  // onCloseFieldsSearch?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  onCloseFieldsSearch?: (
    saveScheduleCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[],
    saveTaskCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[],
    saveMilestoneCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[],
  ) => void,
  onActionSearch?: (saveCondition: { fieldType, isDefault, fieldName, fieldValue, searchType, searchOption }[]) => void,
  conDisplaySearchDetail: any,
  setConDisplaySearchDetail: (boolean) => void,
  fields?
}

const PopupFieldsSearch = (props: ISearchAdvanced) => {
  const [iconFunction, setIconFunction] = useState(props.iconFunction);
  const [scheduleConditionSearch, setScheduleConditionSearch] = useState(props.scheduleConditionSearch);
  const [taskConditionSearch, setTaskConditionSearch] = useState(props.taskConditionSearch);
  const [milestoneConditionSearch, setMilestoneConditionSearch] = useState(props.milestoneConditionSearch);

  const [scheduleFieldBelong, setScheduleFieldBelong] = useState(ID_FIELD_INFO.SCHEDULE);
  const [taskFieldBelong, setTaskFieldBelong] = useState(ID_FIELD_INFO.TASK);
  const [milestoneFieldBelong, setMilestoneFieldBelong] = useState(ID_FIELD_INFO.MILESTONE);

  const [first, setFirst] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showCustomField, setShowCustomField] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  // schedule - task - milestone save condition start
  // has been remove saveConditionSearch
  const [saveScheduleConditionSearch, setSaveScheduleConditionSearch] = useState(null);
  const [saveTaskConditionSearch, setSaveTaskConditionSearch] = useState(null);
  const [saveMilestoneConditionSearch, setSaveMilestoneConditionSearch] = useState(null);
  // schedule - task - milestone save condition end
  const [fieldFilter, setFieldFilter] = useState('');
  // has been remove listFieldSearch
  const [listScheduleFieldSearch, setListScheduleFieldSearch] = useState([]);
  const [listTaskFieldSearch, setListTaskFieldSearch] = useState([]);
  const [listMilestoneFieldSearch, setListMilestoneFieldSearch] = useState([]);

  const [listFieldSetting, setListFieldSetting] = useState([]);
  const [listScheduleFieldSetting, setListScheduleFieldSetting] = useState([]);
  const [listTaskFieldSetting, setListTaskFieldSetting] = useState([]);
  const [listMilestoneFieldSetting, setListMilestoneFieldSetting] = useState([]);
  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");
  const [customFieldsScheduleInfo, setCustomFieldsScheduleInfo] = useState([]);
  const [customFieldsMilestoneInfo, setCustomFieldsMilestoneInfo] = useState([]);
  const [customFieldsTaskInfo, setCustomFieldsTaskInfo] = useState([]);

  const [scheduleFields, setScheduleFields] = useState([]);
  const [taskFields, setTaskFields] = useState([]);
  const [milestoneFields, setMilestoneFields] = useState([]);

  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [, setForceSearch] = useState(false);
  // const [itemBelong, setItemBelong] = useState();

  // const [optionRelation, setOptionRelation] = useState([]);
  const [scheduleTypes, setScheduleTypes] = useState<any>();
  const [saveScheduleTypesConditionSearch, setSaveScheduleTypesConditionSearch] = useState(null);
  const lang = Storage.session.get('locale', 'ja_jp');

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(PopupFieldsSearch.name, {
        scheduleFieldBelong,
        taskFieldBelong,
        milestoneFieldBelong,
        iconFunction,
        scheduleConditionSearch,
        taskConditionSearch,
        milestoneConditionSearch,
        first,
        showCustomField,
        saveScheduleConditionSearch,
        saveTaskConditionSearch,
        saveMilestoneConditionSearch,

        fieldFilter,
        listScheduleFieldSearch,
        listTaskFieldSearch,
        listMilestoneFieldSearch,

        listFieldSetting,
        listScheduleFieldSetting,
        listTaskFieldSetting,
        listMilestoneFieldSetting,

        msgError,
        msgSuccess,
        scheduleFields,
        taskFields,
        milestoneFields,
        // fields,
        customFieldsTaskInfo,
        customFieldsMilestoneInfo,
        customFieldsScheduleInfo,
        scheduleTypes,
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(PopupFieldsSearch.name);
      if (saveObj) {
        setScheduleFieldBelong(saveObj.scheduleFieldBelong);
        setTaskFieldBelong(saveObj.taskFieldBelong);
        setMilestoneFieldBelong(saveObj.milestoneFieldBelong);
        setIconFunction(saveObj.iconFunction);
        setScheduleConditionSearch(saveObj.conditionSchduleSearch);
        setTaskConditionSearch(saveObj.taskConditionSearch);
        setMilestoneConditionSearch(saveObj.milestoneConditionSearch);
        setFirst(saveObj.first);
        setShowCustomField(saveObj.showCustomField);
        // schedule - task - milestone start
        if (saveObj.saveScheduleConditionSearch && saveObj.saveScheduleConditionSearch.length > 0) {
          setSaveScheduleConditionSearch(saveObj.saveScheduleConditionSearch);
        } else {
          setSaveScheduleConditionSearch(saveObj.scheduleConditionSearch);
        }
        if (saveObj.saveTaskConditionSearch && saveObj.saveTaskConditionSearch.length > 0) {
          setSaveTaskConditionSearch(saveObj.saveTaskConditionSearch);
        } else {
          setSaveTaskConditionSearch(saveObj.taskConditionSearch);
        }
        if (saveObj.saveMilestoneConditionSearch && saveObj.saveMilestoneConditionSearch.length > 0) {
          setSaveMilestoneConditionSearch(saveObj.saveMilestoneConditionSearch);
        } else {
          setSaveMilestoneConditionSearch(saveObj.milestoneConditionSearch);
        }
        // schedule - task - milestone end

        setFieldFilter(saveObj.fieldFilter);
        setListScheduleFieldSearch(saveObj.listScheduleFieldSearch);
        setListTaskFieldSearch(saveObj.listTaskFieldSearch);
        setListMilestoneFieldSearch(saveObj.listMilestoneFieldSearch);

        setListFieldSetting(saveObj.listFieldSetting);
        setListScheduleFieldSetting(saveObj.listScheduleFieldSetting);
        setListTaskFieldSetting(saveObj.listTaskFieldSetting);
        setListMilestoneFieldSetting(saveObj.listMilestoneFieldSetting);
        setMsgError(saveObj.msgError);
        setMsgSuccess(saveObj.msgSuccess);
        // setFields(saveObj.fields);
        setScheduleFields(saveObj.scheduleFields);
        setTaskFields(saveObj.taskFields);
        setMilestoneFields(saveObj.milestoneFields);
        setCustomFieldsScheduleInfo(saveObj.customFieldsScheduleInfo);
        setCustomFieldsTaskInfo(saveObj.customFieldsTaskInfo);
        setCustomFieldsMilestoneInfo(saveObj.customFieldsMilestoneInfo);
        setScheduleTypes(saveObj.scheduleTypes);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(PopupFieldsSearch.name);
    }
  }

  useEffect(() => {
    if (props.scheduleTypes && props.scheduleTypes.length > 0) {
      const fieldItems = props.scheduleTypes.map(item => {
        const scheduleTypeName = JSON.parse(item.scheduleTypeName);
        return {
          itemId: item.scheduleTypeId,
          itemLabel: scheduleTypeName[lang],
          itemOrder: item.displayOrder,
          isDefault: false
        }
      });
      setScheduleTypes({
        fieldName: 'schedule_type_id',
        fieldLabel: '{"ja_jp": "種別","en_us": "","zh_cn": ""}',
        fieldType: 3,
        fieldOrder: 1,
        fieldItems
      });
    }
  }, [props.scheduleTypes]);

  useEffect(() => {
    if (props.fieldScheduleInfos && props.fieldScheduleInfos.fieldInfoPersonals) {
      setScheduleFields(props.fieldScheduleInfos.fieldInfoPersonals);
    } else {
      setScheduleFields([]);
    }
  }, [props.fieldScheduleInfos]);

  useEffect(() => {
    if (props.fieldTaskInfos && props.fieldTaskInfos.fieldInfoPersonals) {
      setTaskFields(props.fieldTaskInfos.fieldInfoPersonals);
    } else {
      setTaskFields([]);
    }
  }, [props.fieldTaskInfos]);

  useEffect(() => {
    if (props.fieldMilestoneInfos && props.fieldMilestoneInfos.fieldInfoPersonals) {
      setMilestoneFields(props.fieldMilestoneInfos.fieldInfoPersonals);
    } else {
      setMilestoneFields([]);
    }
  }, [props.fieldMilestoneInfos]);

  useEffect(() => {
    if (props.customScheduleField && props.customScheduleField.customFieldsInfo) {
      setCustomFieldsScheduleInfo(props.customScheduleField.customFieldsInfo);
    } else {
      setCustomFieldsScheduleInfo([]);
    }
  }, [props.customScheduleField]);

  useEffect(() => {
    if (props.customTaskField && props.customTaskField.customFieldsInfo) {
      setCustomFieldsTaskInfo(props.customTaskField.customFieldsInfo);
    } else {
      setCustomFieldsTaskInfo([]);
    }
  }, [props.customTaskField]);

  useEffect(() => {
    if (props.customMilestoneField && props.customMilestoneField.customFieldsInfo) {
      setCustomFieldsMilestoneInfo(props.customMilestoneField.customFieldsInfo);
    } else {
      setCustomFieldsMilestoneInfo([]);
    }
  }, [props.customMilestoneField]);

  useEffect(() => {
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
      setSaveScheduleConditionSearch(props.scheduleConditionSearch);
      setSaveTaskConditionSearch(props.taskConditionSearch);
      setSaveMilestoneConditionSearch(props.milestoneConditionSearch);
      props.getFieldInfoPersonals(scheduleFieldBelong);
      props.getFieldInfoPersonals(taskFieldBelong);
      props.getFieldInfoPersonals(milestoneFieldBelong);
      props.callApiGetScheduleTypes();
    }
    return () => {
      props.reset();
      setFirst(false);
      setFieldFilter('');
      updateStateSession(FSActionTypeScreen.RemoveSession);
    }
  }, []);

  useEffect(() => {
    if (props.fieldScheduleInfos && props.fieldScheduleInfos.fieldInfoPersonals) {
      setListScheduleFieldSearch(props.fieldScheduleInfos.fieldInfoPersonals);
    }
  }, [props.fieldScheduleInfos]);

  useEffect(() => {
    if (props.fieldTaskInfos && props.fieldTaskInfos.fieldInfoPersonals) {
      setListTaskFieldSearch(props.fieldTaskInfos.fieldInfoPersonals);
    }
  }, [props.fieldTaskInfos]);

  useEffect(() => {
    if (props.fieldMilestoneInfos && props.fieldMilestoneInfos.fieldInfoPersonals) {
      setListMilestoneFieldSearch(props.fieldMilestoneInfos.fieldInfoPersonals);
    }
  }, [props.fieldMilestoneInfos]);

  useEffect(() => {
    if (props.customScheduleField && props.customScheduleField.customFieldsInfo) {
      setListScheduleFieldSetting(props.customScheduleField.customFieldsInfo);
    }
  }, [props.customScheduleField]);

  useEffect(() => {
    if (props.customTaskField && props.customTaskField.customFieldsInfo) {
      setListTaskFieldSetting(props.customTaskField.customFieldsInfo);
    }
  }, [props.customTaskField]);

  useEffect(() => {
    if (props.customMilestoneField && props.customMilestoneField.customFieldsInfo) {
      setListMilestoneFieldSetting(props.customMilestoneField.customFieldsInfo);
    }
  }, [props.customMilestoneField]);

  useEffect(() => {
    setMsgError(props.errorMessage);
    if (props.successMessage) {
      setShowCustomField(false);
      setMsgSuccess(props.successMessage);
    }
  }, [props.errorMessage, props.successMessage]);

  const handleClosePopup = () => {
    setShowCustomField(false);
    setListScheduleFieldSearch([]);
    setListTaskFieldSearch([]);
    setListMilestoneFieldSearch([]);
    setListFieldSetting([]);
    setListScheduleFieldSetting([]);
    setListTaskFieldSetting([]);
    setListMilestoneFieldSetting([]);
    if (props.onCloseFieldsSearch) {
      props.onCloseFieldsSearch(saveScheduleConditionSearch, saveTaskConditionSearch, saveMilestoneConditionSearch);
    }
  }

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
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
      const didDrop = monitor.didDrop()
      if (didDrop) {
        return
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  })

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (!iconFunction) {
      return <></>
    } else {
      return <img src={baseUrl + `/content/images/${iconFunction}`} alt="" />
    }
  }

  const isAvailable = (flag) => {
    // return flag === AVAILABLE_FLAG.WEB_APP_AVAILABLE || flag === AVAILABLE_FLAG.WEB_AVAILABLE
    return flag === AVAILABLE_FLAG.WEB_APP_AVAILABLE
  }

/**
 * get custom field label
 *
 */
  const getFieldLabel = (item, fieldLabel) => {
  if (item && Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
    try {
      const obj = JSON.parse(item[fieldLabel]);
      return StringUtils.getValuePropStr(obj, lang) ? StringUtils.getValuePropStr(obj, lang) :
        StringUtils.getValuePropStr(obj, 'en_us') ? StringUtils.getValuePropStr(obj, 'en_us') :
          StringUtils.getValuePropStr(obj, 'zh_cn') ? StringUtils.getValuePropStr(obj, 'zh_cn') : '';
    } catch {
      return item[fieldLabel];
    }
  }
    return '';
  }

  /**
   * filter custom field
   *
   */
  const isMatchFilter = (item, belong, isRelation) => {
    if (
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TAB ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP ||
      item.lookupFieldId > 0 ||
      !isAvailable(item.availableFlag) ||
      item.fieldBelong !== belong
    ) {
      return false;
    }
    if (isRelation && item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
      return false;
    } else if (!isRelation && item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION) {
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
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.SetSession);
      setForceCloseWindow(true);
    } else {
      handleClosePopup();
    }
  }

  // const handleSearch = () => {
  //   if (saveScheduleConditionSearch
  //     && saveTaskConditionSearch
  //     && saveMilestoneConditionSearch
  //     && scheduleFields
  //     && taskFields
  //     && milestoneFields
  //     && saveScheduleConditionSearch.length > 0
  //     && saveTaskConditionSearch.length > 0
  //     && saveMilestoneConditionSearch.length > 0
  //     && scheduleFields.length > 0
  //     && taskFields.length > 0
  //     && milestoneFields.length > 0) {
  //     const conditions = [];
  //     saveScheduleConditionSearch.forEach(e => {
  //       const filters = scheduleFields.filter(item => item.fieldId.toString() === e.fieldId.toString());
  //       if (filters.length > 0) {
  //         conditions.push(e);
  //       }
  //     });
  //     saveTaskConditionSearch.forEach(e => {
  //       const filters = taskFields.filter(item => item.fieldId.toString() === e.fieldId.toString());
  //       if (filters.length > 0) {
  //         conditions.push(e);
  //       }
  //     });
  //     saveMilestoneConditionSearch.forEach(e => {
  //       const filters = milestoneFields.filter(item => item.fieldId.toString() === e.fieldId.toString());
  //       if (filters.length > 0) {
  //         conditions.push(e);
  //       }
  //     });
  //     if (props.popout) {
  //       updateStateSession(FSActionTypeScreen.SetSession);
  //       window.opener.postMessage({ type: FSActionTypeScreen.Search, 'forceCloseWindow': true }, window.location.origin);
  //       Storage.session.set('forceCloseWindow', true);
  //       window.close();
  //     } else {
  //       if (props.onActionSearch) {
  //         props.onActionSearch(conditions);
  //       }
  //     }
  //   } else {
  //     if (props.popout) {
  //       updateStateSession(FSActionTypeScreen.SetSession);
  //       window.opener.postMessage({ type: FSActionTypeScreen.Search, 'forceCloseWindow': true }, window.location.origin);
  //       Storage.session.set('forceCloseWindow', true);
  //       window.close();
  //     } else {
  //       if (props.onActionSearch) {
  //         props.onActionSearch(saveScheduleConditionSearch);
  //         props.onActionSearch(saveTaskConditionSearch);
  //         props.onActionSearch(saveMilestoneConditionSearch);
  //       }
  //     }
  //   }
  //   props.setConDisplaySearchDetail(true);
  // }

  // useEffect(() => {
  //   if (forceSearch) {
  //     handleSearch();
  //   }
  // }, [forceSearch]);

  const handleDisplaySetting = () => {
    setShowCustomField(true);
    setListScheduleFieldSearch(scheduleFields);
    setListTaskFieldSearch(taskFields);
    setListMilestoneFieldSearch(milestoneFields)
    props.getCustomFieldsTaskInfo();
    props.getCustomFieldsScheduleInfo();
    props.getCustomFieldsMilestoneInfo();
  }

  /**
   * set custom field param update field info
   *
   */
  const setFieldParam = (listField) => {
    const objFieldParams = [];
    if (listField.length > 0) {
      listField.forEach((el, idx) => {
        const obj = {
          fieldId: el.fieldId,
          fieldOrder: idx + 1
        };
        objFieldParams.push(obj);
      });
    }
    return objFieldParams;
  }

  /**
   * handle custom field param update field info
   *
   */
  const handleUpdateSettingField = (event) => {
    event.preventDefault();
    const objTaskFieldParams = setFieldParam(listTaskFieldSearch);
    const objScheduleParams = setFieldParam(listScheduleFieldSearch);
    const objMilestoneParams = setFieldParam(listMilestoneFieldSearch);
    props.handleUpdateField(objTaskFieldParams, ID_FIELD_INFO.TASK);
    props.handleUpdateField(objScheduleParams, ID_FIELD_INFO.SCHEDULE);
    props.handleUpdateField(objMilestoneParams, ID_FIELD_INFO.MILESTONE);
  }

  const handleCloseSettingField = () => {
    setShowCustomField(false);
    setListScheduleFieldSearch([]);
    setListTaskFieldSearch([]);
    setListMilestoneFieldSearch([])
    setListScheduleFieldSetting([]);
    setListTaskFieldSetting([]);
    setListMilestoneFieldSetting([]);
  }

  const openNewWindow = () => {
    // setShowModal(false);
    // setForceCloseWindow(false);
    updateStateSession(FSActionTypeScreen.SetSession);
    setShowModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/calendar-fields-search`, '', style.toString());
  }

  /**
   * update state of scheduleTypes field
   * @param item
   * @param type
   * @param val
   */
  const updateStateScheduleTypeField = (item, type, val) => {
    if (val === '' || !item || !val) {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    setSaveScheduleTypesConditionSearch(valueUpdate);
  }

  /**
   * update state of schedule field
   * @param item
   * @param type
   * @param val
   */
  const updateStateScheduleField = (item, type, val) => {
    if (val === '' || !item || !val) {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    valueUpdate['fieldBelong'] = item.fieldBelong;
    valueUpdate['relationFieldId'] = item.relationFieldId;
    valueUpdate['fieldRelation'] = item.fieldRelation;

    if (saveScheduleConditionSearch) {
      const indexField = saveScheduleConditionSearch.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
      if (indexField < 0) {
        saveScheduleConditionSearch.push(valueUpdate);
      } else {
        saveScheduleConditionSearch[indexField] = valueUpdate;
      }
    } else {
      const newObject = [];
      newObject.push(valueUpdate);
      setSaveScheduleConditionSearch(newObject);
    }
  }

  /**
   * update state of task field
   * @param item
   * @param type
   * @param val
   */
  const updateStateTaskField = (item, type, val) => {
    if (val === '' || !item || !val) {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    valueUpdate['fieldBelong'] = item.fieldBelong;
    valueUpdate['relationFieldId'] = item.relationFieldId;
    valueUpdate['fieldRelation'] = item.fieldRelation;

    if (saveTaskConditionSearch) {
      const indexField = saveTaskConditionSearch.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
      if (indexField < 0) {
        saveTaskConditionSearch.push(valueUpdate);
      } else {
        saveTaskConditionSearch[indexField] = valueUpdate;
      }
    } else {
      const newObject = [];
      newObject.push(valueUpdate);
      setSaveTaskConditionSearch(newObject);
    }
  }

  /**
   * update state of milestone field
   * @param item
   * @param type
   * @param val
   */
  const updateStateMilestoneField = (item, type, val) => {
    if (val === '' || !item || !val) {
      return;
    }
    const valueUpdate = _.cloneDeep(val);
    valueUpdate['fieldLabel'] = item.fieldLabel;
    valueUpdate['fieldItems'] = item.fieldItems;
    valueUpdate['fieldBelong'] = item.fieldBelong;
    valueUpdate['relationFieldId'] = item.relationFieldId;
    valueUpdate['fieldRelation'] = item.fieldRelation;

    if (saveMilestoneConditionSearch) {
      const indexField = saveMilestoneConditionSearch.findIndex(e => e.fieldId.toString() === item.fieldId.toString());
      if (indexField < 0) {
        saveMilestoneConditionSearch.push(valueUpdate);
      } else {
        saveMilestoneConditionSearch[indexField] = valueUpdate;
      }
    } else {
      const newObject = [];
      newObject.push(valueUpdate);
      setSaveMilestoneConditionSearch(newObject);
    }
  }

  /**
   * get status of control
   * @param item
   * @param idFieldInfo
   */
  const getDataStatusControl = (item, idFieldInfo) => {
    if (idFieldInfo === ID_FIELD_INFO.SCHEDULE) {
      if (saveScheduleConditionSearch && saveScheduleConditionSearch.length > 0) {
        const dataStatus = saveScheduleConditionSearch.filter( e => e.fieldId.toString() === item.fieldId.toString());
        if (dataStatus && dataStatus.length > 0) {
          return dataStatus[0];
        }
      }
    }
    if (idFieldInfo === ID_FIELD_INFO.TASK) {
      if (saveTaskConditionSearch && saveTaskConditionSearch.length > 0) {
        const dataStatus = saveTaskConditionSearch.filter( e => e.fieldId.toString() === item.fieldId.toString());
        if (dataStatus && dataStatus.length > 0) {
          return dataStatus[0];
        }
      }
    }
    if (idFieldInfo === ID_FIELD_INFO.MILESTONE) {
      if (saveMilestoneConditionSearch && saveMilestoneConditionSearch.length > 0) {
        const dataStatus = saveMilestoneConditionSearch.filter( e => e.fieldId.toString() === item.fieldId.toString());
        if (dataStatus && dataStatus.length > 0) {
          return dataStatus[0];
        }
      }
    }
    return null;
  }

  const clearDisplayMessage = () => {
    setMsgError('');
    setMsgSuccess('');
  }

  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0) && (!msgSuccess || msgSuccess.length <= 0)) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
        message={msgError && msgError.length > 0 ? msgError : msgSuccess}
      />
    )
  }

  /**
   * handle selected custom field info
   */
  const onSelectField = (sourceField, isChecked, type) => {
    let objectFieldInfos;
    switch (type) {
      case ID_FIELD_INFO.SCHEDULE: {
        objectFieldInfos = _.cloneDeep(listScheduleFieldSearch);
        break;
      }
      case ID_FIELD_INFO.MILESTONE: {
        objectFieldInfos = _.cloneDeep(listMilestoneFieldSearch);
        break;
      }
      case ID_FIELD_INFO.TASK: {
        objectFieldInfos = _.cloneDeep(listTaskFieldSearch);
        break;
      }
      default:
    }
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
        const fieldIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === sourceField.fieldId.toString());
        if (fieldIndex >= 0) {
          objectFieldInfos.splice(fieldIndex, 1);
        }
      }
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      switch (type) {
        case ID_FIELD_INFO.SCHEDULE: {
          setListScheduleFieldSearch(objectFieldInfos);
          break;
        }
        case ID_FIELD_INFO.MILESTONE: {
          setListMilestoneFieldSearch(objectFieldInfos);
          break;
        }
        case ID_FIELD_INFO.TASK: {
          setListTaskFieldSearch(objectFieldInfos)
          break;
        }
        default:
      }

    }
    clearDisplayMessage();
  }

  /**
   * handle drag and drop one field on total custom field to list
   * @param fieldSrc
   * @param fieldTargetId
   */
  const onDragDropField = (fieldSrc, fieldTargetId) => {
    let listCustomFieldSearch;
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
    switch (fieldSrc.fieldBelong) {
      case ID_FIELD_INFO.MILESTONE:{
        listCustomFieldSearch = listMilestoneFieldSearch;
        break;
      }
      case ID_FIELD_INFO.SCHEDULE: {
        listCustomFieldSearch = listScheduleFieldSearch;
        break;
      }
      case ID_FIELD_INFO.TASK: {
        listCustomFieldSearch = listTaskFieldSearch
        break;
      }
      default:
        return;
    }
    const newField = _.cloneDeep(fieldSrc);
    newField['fieldItems'] = newFieldItems;
    const objectFieldInfos = _.cloneDeep(listCustomFieldSearch);
    if (!fieldTargetId) {
      if (listCustomFieldSearch.findIndex(e => e.fieldId.toString() === fieldSrc.fieldId.toString()) < 0) {
        objectFieldInfos.push(newField);
        switch (fieldSrc.fieldBelong) {
          case ID_FIELD_INFO.MILESTONE:{
            setListMilestoneFieldSearch(objectFieldInfos);
            break;
          }
          case ID_FIELD_INFO.SCHEDULE: {
            setListScheduleFieldSearch(objectFieldInfos);
            break;
          }
          case ID_FIELD_INFO.TASK: {
            setListTaskFieldSearch(objectFieldInfos);
            break;
          }
          default:
            return;
        }
      }
      return;
    }
    if (objectFieldInfos && objectFieldInfos.length > 0) {
      const fieldIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === fieldTargetId.toString());
      const existedFieldIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === fieldSrc.fieldId.toString());
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
      switch (fieldSrc.fieldBelong) {
        case ID_FIELD_INFO.MILESTONE:{
          setListMilestoneFieldSearch(objectFieldInfos);
          break;
        }
        case ID_FIELD_INFO.SCHEDULE: {
          setListScheduleFieldSearch(objectFieldInfos);
          break;
        }
        case ID_FIELD_INFO.TASK: {
          setListTaskFieldSearch(objectFieldInfos);
          break;
        }
        default:
          return;
      }
    }
    clearDisplayMessage();
  }

  /**
   * handle action change custom field
   *
   */
  const changeSelectedField = (listField, listItemFieldSearch, type, fieldBelong) => {
    const listFields = listField.filter(e => isMatchFilter(e, fieldBelong, false));
    const objectFieldInfos = _.cloneDeep(listItemFieldSearch);
    for (let i = 0; i < listFields.length; i++) {
      const existIndex = objectFieldInfos.findIndex(e => e.fieldId.toString() === listFields[i].fieldId.toString());
      if (type === 0) {
        if (existIndex >= 0) {
          objectFieldInfos.splice(existIndex, 1);
        }
        continue;
      }
      const newFieldItems = [];
      if (listFields[i].fieldItems && Array.isArray(listFields[i].fieldItems) && listFields[i].fieldItems.length > 0) {
        listFields[i].fieldItems.forEach(e =>
          newFieldItems.push({
            itemId: e.itemId,
            itemLabel: e.itemLabel,
            itemOrder: e.itemOrder,
            isDefault: e.isDefault
          })
        );
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
    return objectFieldInfos;
  }

  /**
   * handle custom field info by action type
   * @param type
   */
  const changeSelectFieldSetting = (type: number) => {
    const listScheduleFieldTemp = changeSelectedField(listScheduleFieldSetting, listScheduleFieldSearch, type, ID_FIELD_INFO.SCHEDULE)
    const listTaskFieldTemp = changeSelectedField(listTaskFieldSetting, listTaskFieldSearch, type, ID_FIELD_INFO.TASK)
    const listMilestoneFieldTemp = changeSelectedField(listMilestoneFieldSetting, listMilestoneFieldSearch, type, ID_FIELD_INFO.MILESTONE)
    setListScheduleFieldSearch(listScheduleFieldTemp);
    setListTaskFieldSearch(listTaskFieldTemp);
    setListMilestoneFieldSearch(listMilestoneFieldTemp);
    clearDisplayMessage();
  }

  /**
   * compare field1 and field2
   * @param field1
   * @param field2
   */
  const isFieldEqual = (field1: any, field2: any) => {
    if (!_.isEqual(field1.fieldId, field2.fieldId)) {
      return false;
    }
    if (_.isNil(field1.relationFieldId) && _.isNil(field2.relationFieldId)) {
      return true;
    }
    return _.isEqual(field1.relationFieldId, field2.relationFieldId);
  };


  /**
   * handle data drag and drop
   */
  const onMove =(objectFieldInfos, fieldDrop, fieldDrag) => {
    const dropIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, fieldDrop));
    const dragIndex = objectFieldInfos.findIndex(e => isFieldEqual(e, fieldDrag));
    if (dropIndex >= 0 && dragIndex >= 0) {
      const tempObject = objectFieldInfos.splice(dragIndex, 1)[0];
      objectFieldInfos.splice(dropIndex, 0, tempObject);
      for (let i = 0; i < objectFieldInfos.length; i++) {
        objectFieldInfos[i].fieldOrder = i + 1;
      }
      setListScheduleFieldSearch(objectFieldInfos);
    }
    return objectFieldInfos;
  }


  /**
   * handle data drag and drop custom schedule field
   */
  const onMoveFieldSchedule = (fieldDrop, fieldDrag) => {
    const objectFieldInfos = _.cloneDeep(listScheduleFieldSearch);
    setListScheduleFieldSearch(onMove(objectFieldInfos, fieldDrop, fieldDrag));
    clearDisplayMessage();
  }

  /**
   * handle data drag and drop custom task field
   */
  const onMoveFieldTask = (fieldDrop, fieldDrag) => {
    const objectFieldInfos = _.cloneDeep(listTaskFieldSearch);
    setListTaskFieldSearch(onMove(objectFieldInfos, fieldDrop, fieldDrag))
    clearDisplayMessage();
  }

  /**
   * handle data drag and drop custom milestone field
   */
  const onMoveFieldMileStone = (fieldDrop, fieldDrag) => {
    const objectFieldInfos = _.cloneDeep(listMilestoneFieldSearch);
    setListMilestoneFieldSearch(onMove(objectFieldInfos, fieldDrop, fieldDrag))
    clearDisplayMessage();
  }


  const isItemSelected = (item, itemType) => {
    let matchList;
    switch (itemType) {
      case ID_FIELD_INFO.MILESTONE: {
        matchList = listMilestoneFieldSearch.filter(e => e.fieldId.toString() === item.fieldId.toString());
        break;
      }
      case ID_FIELD_INFO.SCHEDULE: {
        matchList = listScheduleFieldSearch.filter(e => e.fieldId.toString() === item.fieldId.toString());
        break;
      }
      case ID_FIELD_INFO.TASK: {
        matchList = listTaskFieldSearch.filter(e => e.fieldId.toString() === item.fieldId.toString());
        break
      }
      default:
    }
    return matchList.length > 0;
  }

  const onBeforeUnload = (ev) => {
    if (props.popout && !Storage.session.get('forceCloseWindow')) {
      window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': false }, window.location.origin);
    }
  };

  const onReceiveMessage = (ev) => {
    if (!props.popout) {
      if (ev.data.type === FSActionTypeScreen.CloseWindow) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        if (ev.data.forceCloseWindow) {
          setShowModal(true);
        } else {
          props.onCloseFieldsSearch(saveScheduleConditionSearch, saveTaskConditionSearch, saveMilestoneConditionSearch);
        }
      } else if (ev.data.type === FSActionTypeScreen.Search) {
        updateStateSession(FSActionTypeScreen.GetSession);
        updateStateSession(FSActionTypeScreen.RemoveSession);
        setForceSearch(true);
      }
    }
  }

  if (props.popout) {
    useEventListener('beforeunload', onBeforeUnload);
  } else {
    useEventListener('message', onReceiveMessage);
  }

  /**
   * get condition search data of schedule, task, milestone
   * @param data
   */
  const getConditionData = (data: Array<any>) => {
    let conditions = [];
    let conditionsWithLabel = [];
    conditions = data.filter(
      itemFilter => (itemFilter.fieldValue || Array.isArray(itemFilter.fieldValue))
        && itemFilter.fieldValue.length > 0
        && !itemFilter.isSearchBlank
    );
    conditionsWithLabel = conditions.map((item) => {
      return {
        fieldLabel: item.fieldLabel,
      }
    });
    conditions = conditions.map((item) => {
      if (item.fieldType === Number(DEFINE_FIELD_TYPE.DATE_TIME)
      || item.fieldType === Number(DEFINE_FIELD_TYPE.DATE)
      || item.fieldType === Number(DEFINE_FIELD_TYPE.TIME)
      )
        return {
          fieldType: item.fieldType,
          fieldName: item.fieldName,
          fieldValue: item.fieldValue[0] ? JSON.stringify(item.fieldValue[0]) : '',
          // searchModeDate: item.searchModeDate,
          isDefault: item.isDefault
        }

      return {
        fieldType: item.fieldType,
        fieldName: item.fieldName,
        fieldValue: Array.isArray(item.fieldValue)
          && (item.fieldType === Number(DEFINE_FIELD_TYPE.RADIOBOX) || item.fieldType === Number(DEFINE_FIELD_TYPE.CHECKBOX))
            ? item.fieldValue.toString()
            : item.fieldValue,
        searchType: item.searchType,
        searchOption: item.searchOption,
        isDefault: item.isDefault
      }
    });
    return { conditions, conditionsWithLabel };
  }

  /**
   * activate handleSearchConditions of calendar-grid.reducer and close popup search detail
   */
  const submitForm = () => {
    let scheduleConditionSearchData = [];
    let taskConditionSearchData = [];
    let milestoneConditionSearchData = [];
    let listScheduleSearch = [];
    let listTaskSearch = [];
    let listMilestoneSearch = [];

    if (isArray(saveScheduleConditionSearch)) {
      const response = getConditionData(saveScheduleConditionSearch);
      scheduleConditionSearchData = response.conditions;
      listScheduleSearch = response.conditionsWithLabel;
    }
    if (saveScheduleTypesConditionSearch
      && saveScheduleTypesConditionSearch.fieldValue.length > 0
      && !saveScheduleTypesConditionSearch.isSearchBlank)
      scheduleConditionSearchData = [
        ...scheduleConditionSearchData,
        {
          fieldType: saveScheduleTypesConditionSearch.fieldType,
          fieldName: saveScheduleTypesConditionSearch.fieldName,
          fieldValue: Array.isArray(saveScheduleTypesConditionSearch.fieldValue)
            ? saveScheduleTypesConditionSearch.fieldValue.toString()
            : '',
          isDefault: true
        }
      ]

    if (isArray(saveTaskConditionSearch)) {
      const response = getConditionData(saveTaskConditionSearch);
      taskConditionSearchData = response.conditions;
      listTaskSearch = response.conditionsWithLabel;
    }

    if (isArray(saveMilestoneConditionSearch)) {
      const response = getConditionData(saveMilestoneConditionSearch);
      milestoneConditionSearchData = response.conditions;
      listMilestoneSearch = response.conditionsWithLabel;
    }
    props.handleSearchConditions(
      {
        searchScheduleCondition: scheduleConditionSearchData,
        searchTaskCondition: taskConditionSearchData,
        searchMilestoneCondition: milestoneConditionSearchData,
      },
      !!scheduleConditionSearchData.length,
      !!taskConditionSearchData.length,
      !!milestoneConditionSearchData.length
    );
    props.getListSearchFields(listScheduleSearch, listTaskSearch, listMilestoneSearch);
    props.setConDisplaySearchDetail(false);
    handleClosePopup();
  }

  /**
   * Render search detail
   */
  const renderComponentInputSearch = () => {
    return (
      // <div className="modal popup-esr user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
      <div className="modal modal popup-esr popup-esr4 user-popup-page popup-align-right show popup-search" id="popup-esr" aria-hidden="true">
        <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
          <div className="modal-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a className="icon-small-primary icon-return-small disable"/>
                  <span className="text">
                    {getIconFunction()} {translate('global.title.search-detail')}
                  </span>
                </div>
              </div>
              <div className="right">
                {showModal && (
                  <button type="button" onClick={handleClosePopup} className="close" data-dismiss="modal">
                    ×
                  </button>
                )}
                {showModal && (
                  <span className="popup-botton-zoom" onClick={() => openNewWindow()}/>
                )}
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content style-3">
                <div className="user-popup-form">
                  {displayMessage()}
                  <a onClick={handleDisplaySetting} className="button-primary button-activity-registration">
                    {translate('global.button.edit-search-condition')}
                  </a>
                  <form>
                    <div className="row break-row">
                      {shouldRender && scheduleTypes &&
                        <DynamicControlField
                          key={'schedule_types'}
                          className={'col-lg-9 form-group'}
                          belong={ID_FIELD_INFO.SCHEDULE}
                          controlType={ControlType.SEARCH}
                          enterInputControl={submitForm}
                          fieldInfo={scheduleTypes}
                          updateStateElement={updateStateScheduleTypeField}
                        />
                      }
                      {shouldRender && scheduleFields.map( (item, index) =>
                        <DynamicControlField
                          key={`schedule_${index}`}
                          belong={ID_FIELD_INFO.SCHEDULE}
                          className={'col-lg-9 form-group'}
                          isFocus={index === 0 && first}
                          controlType={ControlType.SEARCH}
                          enterInputControl={submitForm}
                          elementStatus={getDataStatusControl(item, ID_FIELD_INFO.SCHEDULE)}
                          fieldInfo={item}
                          updateStateElement={updateStateScheduleField}
                        />
                      )}
                      {shouldRender && taskFields.map( (item, index) =>
                        <DynamicControlField
                          key={`task_${index}`}
                          belong={ID_FIELD_INFO.TASK}
                          className={'col-lg-9 form-group'}
                          controlType={ControlType.SEARCH}
                          enterInputControl={submitForm}
                          elementStatus={getDataStatusControl(item, ID_FIELD_INFO.TASK)}
                          fieldInfo={item}
                          updateStateElement={updateStateTaskField}
                        />
                      )}
                      {shouldRender && milestoneFields.map( (item, index) =>
                        <DynamicControlField
                          key={`milestone_${index}`}
                          belong={ID_FIELD_INFO.MILESTONE}
                          className={'col-lg-9 form-group'}
                          controlType={ControlType.SEARCH}
                          enterInputControl={submitForm}
                          elementStatus={getDataStatusControl(item, ID_FIELD_INFO.MILESTONE)}
                          fieldInfo={item}
                          updateStateElement={updateStateMilestoneField}
                        />
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <a onClick={submitForm} className="button-blue button-form-register ">
                {translate('global.label.local-filter')}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // const setDisplayRelationOption = (idx) => {
  //   const optionArr = _.cloneDeep(optionRelation);
  //   optionArr[idx] = !optionArr[idx];
  //   setOptionRelation(optionArr);
  // }

  // const getRelationFieldName = (belong: number, field) => {
  //   let serviceName = '';
  //   if (props.serviceInfo) {
  //     const idx = props.serviceInfo.findIndex(e => e.serviceId === belong);
  //     if (idx >= 0) {
  //       serviceName = getFieldLabel(props.serviceInfo[idx], 'serviceName');
  //     }
  //   }
  //   return `${serviceName} (${getFieldLabel(field, 'fieldLabel')})`;
  // };

  const renderComponentSettingSearch = () => {
    const listScheduleField = customFieldsScheduleInfo.filter(e => isMatchFilter(e, ID_FIELD_INFO.SCHEDULE, false)&& (_.isNil(e.relationFieldId) || e.relationFieldId <= 0));
    const listTaskField = customFieldsTaskInfo.filter(e => isMatchFilter(e, ID_FIELD_INFO.TASK, false) && (_.isNil(e.relationFieldId) || e.relationFieldId <= 0));
    const listMilestoneField = customFieldsMilestoneInfo.filter(e => isMatchFilter(e, ID_FIELD_INFO.MILESTONE, false) && (_.isNil(e.relationFieldId) || e.relationFieldId <= 0));
    return (
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right popup-fields-search-scroll show" id="popup-esr" aria-hidden="true">
        <div className={showModal ? "modal-dialog form-popup" : "form-popup"}>
          <div className="modal-content">
            <button type="button" className="close" data-dismiss="modal">
              <span className="la-icon">
                <i className="la la-close"/>
              </span>
            </button>
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a className="icon-small-primary icon-return-small" onClick={handleCloseSettingField}>
                  </a>
                  <span className="text">
                    {getIconFunction()} {translate('global.title.search-detail')}
                  </span>
                </div>
                <div className="right">
                  {showModal && (
                    <button type="button" onClick={handleClosePopup} className="close" data-dismiss="modal">
                      ×
                    </button>
                  )}
                  {showModal && (
                    <span className="popup-botton-zoom" onClick={() => openNewWindow()}>
                      &nbsp;
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-body style-3">
              <div ref={dropBody} className="popup-content style-3">
                {/* <a href="#" title="" className="button-activity-registration">検索条件編集</a> */}
                <div className="user-popup-form">
                  {displayMessage()}
                  <form>
                    <div className="row break-row">
                      {shouldRender && listScheduleFieldSearch.map((item, index) =>
                        (<DynamicControlField
                          key={index}
                          belong={ID_FIELD_INFO.SCHEDULE}
                          className={'col-lg-9 form-group'}
                          fieldInfo={item}
                          isDisabled={true}
                          isDnDAddField={true}
                          isDnDMoveField={true}
                          moveFieldCard={onMoveFieldSchedule}/>)
                      )}
                    </div>
                    <div className="row break-row">
                      {shouldRender && listTaskFieldSearch && listTaskFieldSearch.map((item, index) =>
                        (<DynamicControlField
                          key={index}
                          belong={ID_FIELD_INFO.TASK}
                          className={'col-lg-9 form-group'}
                          fieldInfo={item}
                          isDisabled={true}
                          isDnDAddField={true}
                          isDnDMoveField={true}
                          moveFieldCard={onMoveFieldTask} />)
                      )}
                    </div>
                    <div className="row break-row">
                      {shouldRender && listMilestoneFieldSearch.map((item, index) =>
                        (<DynamicControlField
                          key={index}
                          belong={ID_FIELD_INFO.MILESTONE}
                          className={'col-lg-9 form-group'}
                          fieldInfo={item}
                          isDisabled={true}
                          isDnDAddField={true}
                          isDnDMoveField={true}
                          moveFieldCard={onMoveFieldMileStone} />)
                      )}
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
                    <i className="far fa-search"/>
                  </button>
                  <input
                    type="text"
                    placeholder={translate('global.placeholder.find-item')}
                    onChange={(event) => setFieldFilter(event.target.value.trim())}
                  />
                </div>
                <a onClick={(e) => changeSelectFieldSetting(1)} className="button-primary button-activity-registration">{translate("global.button.select-all")}</a>
                <a onClick={(e) => changeSelectFieldSetting(0)} className="button-primary button-activity-registration">{translate("global.button.deselect-all")}</a>
                <a onClick={(e) => changeSelectFieldSetting(-1)} className="button-primary button-activity-registration">{translate("global.button.selection-inversion")}</a>
                <div className="wrap-checkbox margin-top-20">
                  <FieldCardDragLayer />
                  {listScheduleField && listScheduleField.map((item, idx) => {
                      // if (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
                      //   return (<div className="overflow-hidden">
                      //       <button
                      //         className={optionRelation[idx] ? "select-option select-option-relation arrow-up" : "select-option select-option-relation"}
                      //         onClick={() => setDisplayRelationOption(idx)}>
                      //         <span
                      //           className="select-text">{getRelationFieldName(item.relationData.fieldBelong, item)}</span>
                      //       </button>
                      //       {optionRelation[idx] &&
                      //       <ul className="drop-down drop-down2 select-option-search-common">
                      //         {customFieldsScheduleInfo
                      //           .filter(e => isMatchFilter(e, ID_FIELD_INFO.SCHEDULE, false))
                      //           .map(el => {
                      //             const fieldInfo = _.cloneDeep(el);
                      //             fieldInfo.relationFieldId = item.fieldId;
                      //             return (
                      //               <li className="item smooth" key={el.fieldId}>
                      //                 <PopupFieldCard
                      //                   key={el.fieldId}
                      //                   text={getFieldLabel(el, 'fieldLabel')}
                      //                   fieldInfo={fieldInfo}
                      //                   isChecked={isItemSelected(fieldInfo, ID_FIELD_INFO.SCHEDULE)}
                      //                   onSelectField={onSelectField}
                      //                   onDragDropField={onDragDropField}
                      //                 />
                      //               </li>
                      //             );
                      //           })}
                      //       </ul>
                      //       }
                      //     </div>
                      //   );
                      // } else {
                        return <PopupFieldCard
                          key={idx}
                          text={getFieldLabel(item, 'fieldLabel')}
                          fieldInfo={item}
                          isChecked={isItemSelected(item, ID_FIELD_INFO.SCHEDULE)}
                          onSelectField={onSelectField}
                          onDragDropField={onDragDropField}
                        />
                      // }
                    }
                  )}
                  <FieldCardDragLayer />
                  {listTaskField && listTaskField.map((item, idx) => {
                    // if (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
                    //   return (<div className="overflow-hidden">
                    //     <button
                    //       className={optionRelation[idx] ? "select-option select-option-relation arrow-up" : "select-option select-option-relation"}
                    //       onClick={() => setDisplayRelationOption(idx)}>
                    //       <span className="select-text">{getRelationFieldName(item.relationData.fieldBelong, item)}</span>
                    //     </button>
                    //     {optionRelation[idx] &&
                    //     <ul className="drop-down drop-down2 select-option-search-common">
                    //       {customFieldsTaskInfo
                    //         .filter(e => isMatchFilter(e, ID_FIELD_INFO.TASK, false))
                    //         .map(el => {
                    //           const fieldInfo = _.cloneDeep(el);
                    //           fieldInfo.relationFieldId = item.fieldId;
                    //           return (
                    //             <li className="item smooth" key={el.fieldId}>
                    //               <PopupFieldCard
                    //                 key={el.fieldId}
                    //                 text={getFieldLabel(el, 'fieldLabel')}
                    //                 fieldInfo={fieldInfo}
                    //                 isChecked={isItemSelected(fieldInfo, ID_FIELD_INFO.TASK)}
                    //                 onSelectField={onSelectField}
                    //                 onDragDropField={onDragDropField}
                    //               />
                    //             </li>
                    //           );
                    //         })}
                    //     </ul>
                    //       }
                    //   </div>);
                    // } else {
                      return <PopupFieldCard
                        key={idx}
                        text={getFieldLabel(item, 'fieldLabel')}
                        fieldInfo={item}
                        isChecked={isItemSelected(item, ID_FIELD_INFO.TASK)}
                        onSelectField={onSelectField}
                        onDragDropField={onDragDropField}
                      />
                    // }
                  })}
                  <FieldCardDragLayer />
                  {listMilestoneField && listMilestoneField.map((item, idx) => {
                    // if (_.toString(item.fieldType) === DEFINE_FIELD_TYPE.RELATION) {
                    //   return (<div className="overflow-hidden">
                    //     <button
                    //       className={optionRelation[idx] ? "select-option select-option-relation arrow-up" : "select-option select-option-relation"}
                    //       onClick={() => setDisplayRelationOption(idx)}>
                    //       <span className="select-text">{getRelationFieldName(item.relationData.fieldBelong, item)}</span>
                    //     </button>
                    //     {optionRelation[idx] &&
                    //     <ul className="drop-down drop-down2 select-option-search-common">
                    //       {customFieldsMilestoneInfo
                    //         .filter(e => isMatchFilter(e, ID_FIELD_INFO.MILESTONE, false))
                    //         .map(el => {
                    //           const fieldInfo = _.cloneDeep(el);
                    //           fieldInfo.relationFieldId = item.fieldId;
                    //           return (
                    //             <li className="item smooth" key={el.fieldId}>
                    //               <PopupFieldCard
                    //                 key={el.fieldId}
                    //                 text={getFieldLabel(el, 'fieldLabel')}
                    //                 fieldInfo={fieldInfo}
                    //                 isChecked={isItemSelected(fieldInfo, ID_FIELD_INFO.MILESTONE)}
                    //                 onSelectField={onSelectField}
                    //                 onDragDropField={onDragDropField}
                    //               />
                    //             </li>
                    //           );
                    //         })}
                    //     </ul>
                    //     }
                    //   </div>);
                    // } else {
                      return <PopupFieldCard
                        key={idx}
                        text={getFieldLabel(item, 'fieldLabel')}
                        fieldInfo={item}
                        isChecked={isItemSelected(item, ID_FIELD_INFO.MILESTONE)}
                        onSelectField={onSelectField}
                        onDragDropField={onDragDropField}
                      />
                    // }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

const mapStateToProps = ({ dataCalendarSearch, applicationProfile, popupFieldsSearch }: IRootState) => ({
  tenant: applicationProfile.tenant,
  action: dataCalendarSearch.action,
  fieldScheduleInfos: dataCalendarSearch.fieldScheduleInfos,
  fieldTaskInfos: dataCalendarSearch.fieldTaskInfos,
  fieldMilestoneInfos: dataCalendarSearch.fieldMilestoneInfos,
  customMilestoneField: dataCalendarSearch.customMilestoneField,
  customTaskField: dataCalendarSearch.customTaskField,
  customScheduleField: dataCalendarSearch.customScheduleField,
  errorMessage: dataCalendarSearch.errorMessage,
  successMessage: dataCalendarSearch.successMessage,
  serviceInfo: popupFieldsSearch.servicesInfo,
  scheduleTypes: dataCalendarSearch.scheduleTypes,
});

const mapDispatchToProps = {
  getFieldInfoPersonals,
  getCustomFieldsMilestoneInfo,
  getCustomFieldsScheduleInfo,
  getCustomFieldsTaskInfo,
  handleUpdateField,
  reset,
  handleSearchConditions,
  getListSearchFields,
  callApiGetScheduleTypes
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PopupFieldsSearch);
