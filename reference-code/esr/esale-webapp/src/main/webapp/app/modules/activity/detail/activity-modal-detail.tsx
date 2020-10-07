import React, { useState, useEffect, useRef, useMemo } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { Modal } from 'reactstrap';
import Sticky from 'react-sticky-el';
import {
  handleShowModalActivityDetail,
  onclickEdit,
  onclickDelete,
  onclickShowModalActivityForm,
  toggleConfirmPopup,
  updateActivityDetailIndex,
  handleUpdateActivityInfo,
  changeScreenMode,
  handleUpdateCustomFieldInfo,
  handleUpdateMultiCustomFieldInfo,
  handleShowDetail,
  handleReorderField,
  handleClearResponseData,
  turnModeEditToDetail,
  getActivityDetail,
  ActivityAction,
  handleGetActivityHistory,
  clearShowDetail
} from '../list/activity-list-reducer';
import { ScreenMode, FIELD_BELONG, TIMEOUT_TOAST_MESSAGE, AVAILABLE_FLAG, AUTHORITIES } from 'app/config/constants';
import { translate, Storage } from 'react-jhipster';
import { ConfirmPopupItem } from '../models/confirm-popup-item';
import ActivityTabInfo from './activity-tab-info';
import moment from 'moment';
import _ from 'lodash';
import ActivityTabHistory from './activity-tab-history';
import DynamicSelectField, { SettingModes } from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { FSActionTypeScreen, TAB_ID_LIST, TYPE_DETAIL_MODAL, PREFIX_PRODUCT_SET_DETAIL, ACTIVITY_VIEW_MODES, ACTIVITY_ACTION_TYPES, MODE_CONFIRM } from '../constants';
import { DEFINE_FIELD_TYPE, DynamicControlAction } from 'app/shared/layout/dynamic-form/constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import TabList from './activity-modal-detail-tab-list';
import ModalSubDetailsSchedule from "app/modules/calendar/modal/subDetailsSchedule/modal-details-schedule";
import BusinessCardItemList from '../list/item-list/business-item-list';
import ProductTradingItemList from '../list/item-list/product-item-list';
import ShowDetail from '../common/show-detail';
import { isJsonString } from '../utils';
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import { LICENSE } from '../constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route'
import ActivityModalForm from '../create-edit/activity-modal-form';
import ConfirmPopup from 'app/modules/activity/control/confirm-popup';
import { processRelationselectOrganization, putDataToFieldEdit, createNewFieldLookup, revertDeletedFields, initialRevertFields, concatArray, isFieldRelationAsTab } from 'app/shared/util/utils';
import useEventListener from 'app/shared/util/use-event-listener';
import { AvatarDefault, AvatarReal } from '../list/activity-list-content-header';
import { useDragLayer } from 'react-dnd';
import { TypeMessage } from './activity-tab-info-element';
import { TIMELINE_SERVICE_TYPES } from 'app/modules/timeline/common/constants';
import { formatDate } from 'app/shared/util/date-utils';
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab'
import { CommonUtil, getErrorMessage } from '../common/common-util';
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import CreateEditSchedule from 'app/modules/calendar/popups/create-edit-schedule';
import {
  updateScheduleDataDraf,
} from 'app/modules/calendar/popups/create-edit-schedule.reducer'
import useHandleShowFixedTip from 'app/shared/util/useHandleShowFixedTip';

type IActivityDetailProp = StateProps & DispatchProps & {
  popout?: boolean,
  popoutParams?: any,
  onCloseActivityDetail?: () => void,
  onCloseActivityDetailRelation?: () => void,
  onDeleleSuccess?: () => void, // function call back when delete success
  canBack?: boolean,
  activityId: number,
  listActivityId?: any
  classRelation?: any
}

const dateFormat = 'YYYY/MM/DD';
const WAR_COM_0010 = "WAR_COM_0010";
const WAR_COM_0013 = "WAR_COM_0013";

/**
 * component for show detail activity
 * @param props
 */
const ActivityDetail = (props: IActivityDetailProp) => {

  let storageData = {
    tabListShow: [],
    listActivityId: null,
    activityDetailIndex: null,
    activityFieldsAvailable: null,
    tabList: [],
    activityFieldUnavailable: [],
    fieldInfoActivity: [],
    msgError: null,
    msgSuccess: null,
    screenMode: ScreenMode.DISPLAY
  }
  if (props.popout) {
    const saveObj = _.cloneDeep(Storage.local.get(ActivityDetail.name));
    props.activityDetail['activities'] = saveObj?.activityDetail?.activities;
    props.activityDetail['fieldInfoActivity'] = saveObj?.activityDetail?.fieldInfoActivity;
    props.activityDetail['tabListShow'] = saveObj?.activityDetail?.tabListShow;
    props.activityDetail['tabInfo'] = saveObj?.activityDetail?.tabInfo;
    storageData = saveObj?.storageData;
  }
  const initialState = {
    tabListShow: _.cloneDeep(props.activityDetail && props.activityDetail?.tabListShow?.filter(e => e.isDisplay).sort((a, b) => a.tabOrder - b.tabOrder)),
    tabList: _.cloneDeep(props.activityDetail && props.activityDetail.tabInfo),
    tabListUpdate: null,
    summaryFields: null
  };

  const onClickDetailPopup = (objectId, type) => {
    if (props.handleShowDetail && objectId) {
      props.handleShowDetail(objectId, type, `ActivityDetail_${props.activityId}`);
    }
  }
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [tabListShow, setTabListShow] = useState(props.activityDetail?.tabListShow ? props.activityDetail.tabListShow : storageData.tabListShow); // .filter(e => e.isDisplay)
  const [summaryFields, setSummaryFields] = useState(null);
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [showTipProduct, setShowTipProduct] = useState<boolean>(false);
  const [showTipBizzCard, setShowTipBizzCard] = useState<boolean>(false);

  const [tabList, setTabList] = useState(props.activityDetail?.tabInfo || storageData.tabList);
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  // const isAdmin = true;
  // const [employeeActionType, setEmployeeActionType] = useState(EMPLOYEE_ACTION_TYPES.CREATE);
  // const [employeeViewMode, setEmployeeViewMode] = useState(EMPLOYEE_VIEW_MODES.EDITABLE);
  // const [employeeId, setEmployeeId] = useState(null);
  // const [employeeSuccessMsg, setEmployeeSuccessMsg] = useState(null);
  // const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState([]);
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [paramsEdit, setParamsEdit] = useState();
  const [activityFieldUnavailable, setActivityFieldUnavailable] = useState(storageData.activityFieldUnavailable);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const activityDetail = props.activityDetail && (props.activityFieldsAvailable || storageData.activityFieldsAvailable);
  const [activityFieldsAvailable, setActivityFieldsAvailable] = useState(storageData.activityFieldsAvailable);
  const [productTradingUnAvailable, setProductTradingUnAvailable] = useState([]);
  const tabSummaryRef = useRef(null);
  const tableListRef = useRef(null);
  const actionTabRef = useRef(null);
  const tipProductTradingRef = useRef(null);
  const tipBusinessCardRef = useRef(null);
  const [isLoadActivity, setIsLoadActivity] = useState(false);
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);
  // const [toastMessage, setToastMessage] = useState(null);
  const [normalMessage, setNormalMessage] = useState(null);
  const [countSave] = useState({});
  const [heightTable, setHeightTable] = useState(0);
  const [fieldCallback, setFieldCallback] = useState({});
  const [screenMode, setScreenMode] = useState(storageData.screenMode);
  const [listActivityId, setListActivityId] = useState(storageData.listActivityId);
  const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE, customerId: null, productTradingIds: null });
  // const [taskData, setTaskData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  // fix bug disable when new window
  const [isDisableButtonBack, setIsDisableButtonBack] = useState(!props.canBack);
  const [openModalActivity, setOpenModalActivity] = useState(false);
  const [activityViewMode, setActivityViewMode] = useState(false);
  const [activityActionType, setActivityActionType] = useState(false);
  const [currentActivityId, setCurrentActivityId] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [fieldBelong, setFieldBelong] = useState(FIELD_BELONG.ACTIVITY)
  const [isDelete, setIsDelete] = useState(false);
  const [isScrollMin, setIsScrollMin] = useState(true);
  // state to close windown
  const [isDeleting, setIsDeleting] = useState(false);
  const [fieldNameExtension, setFieldNameExtension] = useState('activity_data');
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([])
  const bizzCardRef = useRef(null);
  const productRef = useRef(null);
  const [activityDraftId, setActivityDraftId] = useState(null);
  const [notFoundMes, setNotFoundMes] = useState(null);
  const [showCustomerDetail, setShowCustomerDetail] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [openCreateSchedule, setOpenCreateSchedule] = useState(false);
  const customerDetailCtrlId = useId(1, "activityTabModalDetailCustomerDetailCtrlId_");

  const handleClickOutside = (e) => {
    if (bizzCardRef.current && !bizzCardRef.current.contains(e.target)) {
      setShowTipBizzCard(false);
    }
    if (productRef.current && !productRef.current.contains(e.target)) {
      setShowTipProduct(false);
    }
  }
  useEventListener('mousedown', handleClickOutside);

  useEffect(() => {
    if (props.popout && !!props.canBack) {
      setIsDisableButtonBack(true);
    } else {
      setIsDisableButtonBack(!props.canBack);
    }
    if (props.popout) {
      setForceCloseWindow(false);
      setShowModal(false);
    } else {
      setShowModal(true);
    }
    return () => {
      props.changeScreenMode(false);
      props.turnModeEditToDetail(false);
      props.clearShowDetail();
      setNotFoundMes(null);
    }
  }, [])

  /**
   * onCloseModal
   */
  const onCloseModal = () => {
    if (!isDisableButtonBack) {
      if (props.onCloseActivityDetail) {
        props.onCloseActivityDetail();
        return;
      }
      if (props.onCloseActivityDetailRelation) {
        props.onCloseActivityDetailRelation();
        return;
      }
      props.handleShowModalActivityDetail(false);
    }
  }

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.DeleteSuccess, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        onCloseModal();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (ActivityAction.Success === props.action && props.deleteActivityIds) {
      if (props.popout) {
        window.close();
        setForceCloseWindow(true);
      } else if (props.onDeleleSuccess) {
        props.onDeleleSuccess();
      }
    }
  }, [props.deleteActivityIds]);

  useEffect(() => {
    if (props.activityFieldsAvailable) {
      setActivityFieldsAvailable(props.activityFieldsAvailable)
    }
  }, [props.activityFieldsAvailable])

  useEffect(() => {
    if (summaryFieldRevert && summaryFields && activityFieldUnavailable) {
      setSummaryFieldRevert(initialRevertFields(summaryFields, activityFieldUnavailable, summaryFieldRevert));
    }
  }, [summaryFields, activityFieldUnavailable])

  useEffect(() => {
    if (props.activityDetail) {
      setSummaryFieldRevert(props.activityDetail.fieldInfoActivity)
      if (!isLoadActivity && _.toArray(props.activityDetail.fieldInfoActivity).length > 0 ) {
        setFieldRelationTab(props.activityDetail.fieldInfoActivity.filter(e => isFieldRelationAsTab(e)))
        setIsLoadActivity(true);
      }
    }
  }, [props.activityDetail])

  useEffect(() => {
    setScreenMode(props.screenMode);
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({ type: MessageType.None, message: [] })
      setEditedSummaryFields([])
    }
  }, [props.screenMode]);

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ActivityDetail.name, {
        activityDetail: {
          ...props.activityDetail,
          tabListShow,
          tabInfo: tabList,
          fieldInfoActivity: props.activityDetail.fieldInfoActivity
        },
        storageData: {
          listActivityId,
          activityFieldsAvailable,
          activityFieldUnavailable,
          screenMode
        }
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      // const saveObj = Storage.local.get(ActivityDetail.name);
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ActivityDetail.name);
    }
  }

  const [showTimeline, setShowTimeline] = useState((props.screenMode === ScreenMode.DISPLAY && props.listLicense && props.listLicense.includes(LICENSE.TIMELINE_LICENSE)))
  const [currentTab, setCurrentTab] = useState(TAB_ID_LIST.summary)
  const [activityId, setActivityId] = useState(props.popoutParams ? props.popoutParams.activityId : props.activityId);

  // const tabList = [{ tabId: 1, tabLabel: 'sssss' }];
  // const tabListShow = [{ tabId: 1, tabLabel: 'sssss' }]

  const changeTab = (clickedTabId) => {
    setCurrentTab(clickedTabId)
  }

  const handleClose = () => {
    if (props.onCloseActivityDetail) {
      props.onCloseActivityDetail();
    }
    if (props.onCloseActivityDetailRelation) {
      props.onCloseActivityDetailRelation();
    }
    props.handleShowModalActivityDetail(false);
    props.handleUpdateActivityInfo({ activities: null });
    props.handleClearResponseData();
  }

  // check close windown new when delete success
  useEffect(() => {
    if (props.popout && isDeleting && !props.openConfirmPopup) {
      window.close();
    }
  }, [props.openConfirmPopup])

  const handleShowConfirmDelete = (id: number) => {
    // const itemName = '○○';
    const cancel = () => {
      setIsDeleting(false);
      props.toggleConfirmPopup(false);
    };
    const accept = () => {
      setIsDeleting(true);
      props.onclickDelete(id);
    };
    const confirmItem: ConfirmPopupItem = {
      modeConfirm: MODE_CONFIRM.DELETE,
      title: translate('activity.popup-delete.title'),
      content: "<p>" + translate('messages.WAR_COM_0001', { itemName: translate('activity.title-2') }) + "</p>",
      listButton: [
        {
          type: "cancel",
          title: translate('activity.popup-delete.button-cancel'),
          callback: cancel
        },
        {
          type: "red",
          title: translate('activity.popup-delete.button-delete'),
          callback: accept
        }
      ]
    };
    props.toggleConfirmPopup(true, confirmItem);
  }


  /**
   * on click button create schedule
   */
  const handleShowSchedule = () => {
    // init data for create schedule
    const activityData = _.cloneDeep(props.activityDetail?.activities);
    const scheduleData = {};
    scheduleData['customer'] = {...activityData?.customer, customerAddressObject: activityData?.customer?.customerAddress};
    if(activityData?.customerRelations?.length > 0) {
      activityData?.customerRelations.forEach(e => {
        e['customerAddressObject'] = e['customerAddress'];
        e['customerId'] = e['customerRelationId'];
      })
    }
    scheduleData['relatedCustomers'] = activityData?.customerRelations;
    const arrIds = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(activityData?.customerRelations, 'customerRelationId')
    scheduleData['relatedCustomersIds'] = _.join(arrIds, ',');
    if(activityData?.businessCards?.length > 0) {
      const businessCards = [];
      activityData?.businessCards?.forEach(e => {
        businessCards.push({
          ...e,
          businessCardName: (e.firstName || '') + " " + (e.lastName || '')
        })
      })
      scheduleData['businessCards'] = businessCards;
    }
    if(activityData?.productTradings?.length > 0) {
      activityData?.productTradings?.forEach(e => {
        e['producTradingName'] = e.productName;
      })
      scheduleData['productTradings'] = activityData?.productTradings;
    }
    props.updateScheduleDataDraf(scheduleData);
    document.body.classList.add("wrap-calendar");
    setOpenCreateSchedule(true);
  }

  /**
   * on click button create task
   */
  const handleShowTask = () => {
    setDataModalTask({
      ...dataModalTask,
      showModal: true,
      productTradingIds: CommonUtil.GET_ARRAY_VALUE_PROPERTIES(props.activityDetail?.activities?.productTradings, 'productTradingId'),
      customerId: props.activityDetail?.activities?.customer?.customerId
    })
  }

  const resetStateExecuteDirtyCheck = () => {
    props.changeScreenMode(false);
    setPopupSettingMode(SettingModes.CreateNewInput);
    setTabListUpdate(null);
    setSummaryFields(null);
    setActivityFieldUnavailable(_.cloneDeep(props.activityFieldsUnAvailable));
    setCurrentFieldEdit(null);
    setTabListShow(_.cloneDeep(initialState.tabListShow));
    setTabList(_.cloneDeep(initialState.tabList));
    setToastMessage(null);
    setFieldCallback({});
    setIsOpenMenuAddTab(false);
    setDeletedSummaryFields([]);
    setNormalMessage({ type: MessageType.None, message: [] });
    tabSummaryRef.current.resetFieldInfoProductSet();
  }


  const isChangeInputEdit = () => {
    let isChange = false;
    if (screenMode === ScreenMode.EDIT) {
      const oldData = {
        summaryField: _.cloneDeep(activityFieldsAvailable.fields),
        tabList: _.cloneDeep(props.activityDetail.tabInfo)
      };

      if (summaryFields === null && tabListUpdate === null && popupSettingMode !== SettingModes.EditInput) {
        isChange = false;
      } else {
        if (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList)) {
          isChange = true;
        }
        // if ((summaryFields !== null && !_.isEqual(summaryFields, oldData.summaryField)) || (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList))) {
        if (!_.isNil(summaryFields)) {
          summaryFields.forEach((field) => {
            if (field.userModifyFlg && field.userModifyFlg === true) {
              isChange = true;
            }
          })
        }
        if (!_.isNil(tabListUpdate)) { // Todo
          isChange = true;
        }
        if (popupSettingMode === SettingModes.EditInput) {
          isChange = true;
        }
      }
    } else {
      isChange = false;
    }
    if (isDelete) {
      isChange = true;
    }
    return isChange;
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel });
    } else {
      action();
    }
  };

  /**
   * onOpenModalActivity
   * @param viewMode 
   */
  const onOpenModalActivity = (_actionType, _viewMode, _activityId, _activityDraftId) => {
    if (!openModalActivity) {
      if (_viewMode === ACTIVITY_VIEW_MODES.EDITABLE) {
        executeDirtyCheck(() => {
          setActivityViewMode(_viewMode);
          setCurrentActivityId(_activityId);
          setActivityActionType(_actionType);
          setOpenModalActivity(true);
          setActivityDraftId(_activityDraftId)
          // setEmployeeSuccessMsg(null);
          resetStateExecuteDirtyCheck()
        });
      } else {
        // setEmployeeActionType(actionType);
        setActivityViewMode(_viewMode);
        setActivityActionType(_actionType);
        setCurrentActivityId(_activityId);
        setOpenModalActivity(true);
        // setEmployeeSuccessMsg(null);
      }

    }
  };

  /**
   * on click edit activity
   * @param id
   */
  const handleEditActivity = (_activityId: number, _activityDraftId?: number) => {
    onOpenModalActivity(ACTIVITY_ACTION_TYPES.UPDATE, ACTIVITY_VIEW_MODES.EDITABLE, _activityId, _activityDraftId)
  }

  /**
   * on click delete activity
   * @param id
   */
  const handleDeleteActivity = (id: number) => {
    handleShowConfirmDelete(id);
  }
  const handleUpdateChangeInfo = () => {
    setShowTimeline(false);
    setTimeout(() => {
      props.changeScreenMode(true);
    }, 350);
  }

  const openNewWindow = (id) => {
    updateStateSession(FSActionTypeScreen.SetSession);
    props.handleShowModalActivityDetail(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/activity-detail/${id}`, '', style.toString());
  }

  const copyUrlActivity = () => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/activity-detail/${activityId}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }

  /** remove Prefix Field label */
  const removePrefixFields = fieldInfo => {
    if (fieldInfo) {
      fieldInfo.forEach(field => {
        if (field && field.fieldLabel && isJsonString(field.fieldLabel)) {
          const langCode = Storage.session.get('locale', 'ja_jp');
          const fieldLabel = JSON.parse(field.fieldLabel);
          if (
            fieldLabel[langCode] &&
            fieldLabel[langCode].indexOf(PREFIX_PRODUCT_SET_DETAIL[StringUtils.snakeCaseToCamelCase(langCode)]) !== -1
          ) {
            fieldLabel[langCode] = fieldLabel[langCode].replace(PREFIX_PRODUCT_SET_DETAIL[StringUtils.snakeCaseToCamelCase(langCode)], '');
            field.fieldLabel = JSON.stringify(fieldLabel);
          }
        }
      });
    }
    return fieldInfo;
  };

  const getFieldUpdate = listFieldsTmp => {
    const fieldsUpdate = [];
    listFieldsTmp.forEach(item => {
      const field = _.cloneDeep(item);
      delete field.fieldBelong;
      delete field.createdDate;
      delete field.createdUser;
      delete field.updatedUser;
      if (!_.isNil(field.oldField)) {
        delete field.oldField;
      }
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(field.relationField)) {
        const relationField = _.cloneDeep(field.relationField);
        delete field.relationField;
        fieldsUpdate.push(field);
        relationField.fieldLabel =
          !_.isNil(relationField) && _.isString(relationField.fieldLabel)
            ? relationField.fieldLabel
            : JSON.stringify(relationField.fieldLabel);
        delete relationField.createdDate;
        delete relationField.createdUser;
        delete relationField.updatedUser;
        fieldsUpdate.push(relationField);
      } else {
        fieldsUpdate.push(field);
      }
    });
    return fieldsUpdate;
  }

  const getFieldsUpdate = listFields => {
    const listFieldsTmp = _.cloneDeep(listFields);
    if (!_.isNil(listFields)) {
      productTradingUnAvailable.forEach(field => {
        const index = listFields.findIndex(e => e.fieldId === field.fieldId);
        if (index < 0) {
          listFieldsTmp.push(field);
        }
      });
    }
    let fieldsUpdate = [];
    if (listFieldsTmp !== null) {
      fieldsUpdate = getFieldUpdate(listFieldsTmp);
    }
    return removePrefixFields(fieldsUpdate);
  };

  const getDataUpdateFieldInfoProductTrading = () => {
    const currentFieldInfoProductSet = tabSummaryRef.current.getCurrentFieldInfoProductSet();
    const deleteFieldInfoProductSet = tabSummaryRef.current.getDeleteFieldInfoProductSet();
    const fieldsUpdate = getFieldsUpdate(currentFieldInfoProductSet.filter(i => !!i.userModifyFlg));
    if (fieldsUpdate && fieldsUpdate.length > 0) {
      fieldsUpdate.forEach(e => {
        if (e.relationField && !_.isNil(e.relationField.isMultiToSingle)) {
          delete e.relationField.isMultiToSingle;
        }
        delete e['isMultiToSingle'];
        delete e['isModified'];
        delete e['columnWidth'];
        delete e['ownPermissionLevel'];
        delete e['othersPermissionLevel'];
        if (e['differenceSetting'] && e['differenceSetting']['backwardText']) {
          e['differenceSetting']['backwardText'] = _.isString(e['differenceSetting']['backwardText'])
            ? e['differenceSetting']['backwardText']
            : JSON.stringify(e['differenceSetting']['backwardText']);
        }
        if (e['differenceSetting'] && e['differenceSetting']['forwardText']) {
          e['differenceSetting']['forwardText'] = _.isString(e['differenceSetting']['forwardText'])
            ? e['differenceSetting']['forwardText']
            : JSON.stringify(e['differenceSetting']['forwardText']);
        }
      });
    }

    const fieldHasFieldOrderEqual0 = fieldsUpdate.find(_field => _field.fieldOrder === 0)
    const newFieldUpdates = fieldHasFieldOrderEqual0 ? fieldsUpdate.map((_field) => ({ ..._field, fieldOrder: _field.fieldOrder + 1 })) : fieldsUpdate


    return {deleteFieldInfoProductSet, fieldsUpdate: newFieldUpdates}
    // props.handleUpdateCustomFieldInfo(FIELD_BELONG.PRODUCT_TRADING, deleteFieldInfoProductSet, fieldsUpdate, null, null, null);
  };

  const updateCustomFieldInfo = () => {
    if (tabListUpdate !== null) {
      tabListUpdate.map(item => {
        delete item.tabLabel;
        delete item.fieldOrder;
      });
    }
    const summaryFieldsTmp = _.cloneDeep(summaryFields);
    let fieldsUpdate = [];
    if (!_.isNil(summaryFields)) {
      activityFieldUnavailable.forEach(field => {
        const index = summaryFields.findIndex(e => e.fieldId === field.fieldId);
        if (index < 0) {
          summaryFieldsTmp.push(field);
        }
      });
    }
    const deleteSummaryFieldTmp = _.cloneDeep(deletedSummaryFields);
    deleteFieldUnavailable.forEach(field => {
      const index = deletedSummaryFields.findIndex(e => e.fieldId !== field.fieldId);
      if (index < 0) {
        deleteSummaryFieldTmp.push(field);
      }
    });
    if (summaryFieldsTmp !== null) {
      fieldsUpdate = getFieldUpdate(summaryFieldsTmp);
    }
    if (fieldsUpdate && fieldsUpdate.length > 0) {
      fieldsUpdate.forEach(e => {
        if (e.relationField && !_.isNil(e.relationField.isMultiToSingle)) {
          delete e.relationField.isMultiToSingle;
        }
        delete e['isMultiToSingle'];
        delete e['ownPermissionLevel'];
        delete e['othersPermissionLevel'];
      });
    }
    // update product tradding
    const dataProduct = getDataUpdateFieldInfoProductTrading();

    props.handleUpdateMultiCustomFieldInfo([FIELD_BELONG.ACTIVITY, FIELD_BELONG.PRODUCT_TRADING], [deleteSummaryFieldTmp, dataProduct.deleteFieldInfoProductSet],
      [fieldsUpdate, dataProduct.fieldsUpdate], [tabListUpdate, null], null, null)
    // if ((deleteSummaryFieldTmp && deleteSummaryFieldTmp.length > 0) || (fieldsUpdate && fieldsUpdate.length > 0)
    //   || (tabListUpdate && tabListUpdate.length > 0)) {
    //   props.handleUpdateCustomFieldInfo(FIELD_BELONG.ACTIVITY, deleteSummaryFieldTmp, fieldsUpdate, tabListUpdate, null, null);
    // }

  };

  let isChangeField = false;
  const isChangeSettingField = (isChange: boolean) => {
    isChangeField = isChange;
    return isChange;
  };

  const openDynamicSelectFields = async (currentSettingMode, currentField) => {
    if (
      isChangeField &&
      currentFieldEdit &&
      (currentField.fieldId > 0 || (currentField.fieldId < 0 && !_.isNil(currentField.userModifyFlg))) &&
      currentField.fieldId !== currentFieldEdit.fieldId
    ) {
      const onEdit = () => {
        setPopupSettingMode(currentSettingMode);
        setCurrentFieldEdit(currentField);
      };
      const onCancel = () => { };
      await DialogDirtyCheck({
        onLeave: onEdit,
        onStay: onCancel
      });
    } else {
      setPopupSettingMode(currentSettingMode);
      setCurrentFieldEdit(currentField);
      setFieldBelong(currentField?.fieldBelong || FIELD_BELONG.ACTIVITY)
      setFieldNameExtension(currentField?.fieldBelong === FIELD_BELONG.PRODUCT_TRADING ? 'product_trading_data' : 'activity_data');
    }
    if (currentFieldEdit && currentFieldEdit.fieldId < 0 && _.isNil(currentFieldEdit.userModifyFlg)
      && _.isNil(countSave[currentFieldEdit.fieldId]) && currentField.fieldId !== currentFieldEdit.fieldId) {
      const summaryFieldsTmp = _.cloneDeep(summaryFields);
      const idx = summaryFieldsTmp.findIndex(e => e.fieldId === currentFieldEdit.fieldId);
      if (idx >= 0) {
        countSave[currentFieldEdit.fieldId] = 0;
        summaryFieldsTmp.splice(idx, 1);
        setSummaryFields(summaryFieldsTmp);
      }
    }
  };

  const deleteFieldUnAvailable = fieldInfo => {
    const fieldsUnAvailable = _.cloneDeep(activityFieldUnavailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setActivityFieldUnavailable(fieldsUnAvailable);
    }
  };

  const displayToastMessage = (message, type, styleClass) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message, styleClass };
    objParams.type = type;
    objParams.message = [message];
    objParams.styleClass = styleClass;
    setToastMessage(objParams);
    if (type === MessageType.Success || message === WAR_COM_0010 || message === WAR_COM_0013) {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const displayNormalMessage = (message, type) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message };
    objParams.type = type;
    objParams.message = [message];
    setNormalMessage(objParams);
  };

  useEffect(() => {
    displayToastMessage(props.messageChangeStatusSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
  }, [props.messageChangeStatusSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorMessageChangeStatusFailed, MessageType.Error);
  }, [props.errorMessageChangeStatusFailed]);

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === ActivityAction.Success && props.fieldBelongUpdateCustomFieldInfo === FIELD_BELONG.PRODUCT_TRADING) {
      props.getActivityDetail(activityId);
      setSummaryFields(null);
      setFieldCallback(null);
      resetStateExecuteDirtyCheck();
      displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
    }
  }, [props.messageUpdateCustomFieldInfoSuccess, props.action]);

  // useEffect(() => {
  //   if (props.fieldBelongUpdateCustomFieldInfo === FIELD_BELONG.PRODUCT_TRADING) {
  //     displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, 'block-feedback block-feedback-green text-left');
  //   }
  // }, [props.messageUpdateCustomFieldInfoSuccess, props.action]);

  useEffect(() => {
    displayNormalMessage(props.messageUpdateCustomFieldInfoError, MessageType.Error);
    if (props.messageUpdateCustomFieldInfoError) {
      const resultRevert = revertDeletedFields(deletedSummaryFields, summaryFields, activityFieldUnavailable, summaryFieldRevert);
      setSummaryFields(_.cloneDeep(resultRevert.fieldsAvailable));
      setActivityFieldUnavailable(_.cloneDeep(resultRevert.fieldsUnVailable))
      setDeletedSummaryFields(resultRevert.deletedFields)
      setSummaryFieldRevert(resultRevert.fieldsRevert)
      tabSummaryRef.current.resetFieldInfoProductSet()
    }
  }, [props.messageUpdateCustomFieldInfoError]);


  /**
   * getIndexOfActivityid
   */
  const getIndexOfActivityid = (id) => {
    if (id && props.listActivityId.length > 0) {
      return _.indexOf(props.listActivityId, id)
    } else {
      return 0;
    }
  }

  useEffect(() => {
    if (props.activityId && props.activityId > 0) {
      props.getActivityDetail(props.activityId);
      setActivityId(props.activityId)
    }
  }, [props.activityId])


  const nextBefore = () => {
    if(!(listActivityId && activityId !== listActivityId[0]))
      return;
    const idx = getIndexOfActivityid(activityId) - 1;
    props.getActivityDetail(listActivityId[idx]);
    setActivityId(listActivityId[idx]);
    if (currentTab === TAB_ID_LIST.changeHistory) {
      props.handleGetActivityHistory(listActivityId[idx])
    }
  }

  const nextAfter = () => {
    if(!(listActivityId && activityId !== listActivityId[listActivityId.length - 1]))
      return;
    const idx = getIndexOfActivityid(activityId) + 1;
    props.getActivityDetail(listActivityId[idx]);
    setActivityId(listActivityId[idx]);
    if (currentTab === TAB_ID_LIST.changeHistory) {
      props.handleGetActivityHistory(listActivityId[idx])
    }
  }

  useEffect(() => {
    setListActivityId(props.listActivityId);
  }, [props.listActivityId])

  const onSaveField = (fields, paramsEditField, fieldInfoEdit) => {
    setCurrentFieldEdit(null);
    let deleteField = [];
    let listField = _.cloneDeep(fields);
    const resultProcess = processRelationselectOrganization(listField, paramsEditField, deleteField);
    listField = resultProcess.listField;
    deleteField = resultProcess.deleteField;
    const newParamsEditField = resultProcess.newParamsEditField;
    listField = putDataToFieldEdit(listField, newParamsEditField, fieldInfoEdit);

    listField.forEach((field, index) => {
      if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.LOOKUP) {
        const temp = createNewFieldLookup(listField, field, deleteField)
        listField = temp.listField;
        deleteField = temp.deleteField;
      }
      if (field.fieldId === fieldInfoEdit.fieldId) {
        if (field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
          const idx = activityFieldUnavailable.findIndex(e => e.fieldId === field.fieldId)
          if (idx < 0) {
            activityFieldUnavailable.push(field);
          } else {
            activityFieldUnavailable[idx] = field;
          }
          displayToastMessage(WAR_COM_0010, MessageType.Warning, 'block-feedback block-feedback-yellow text-left');
          listField.splice(index, 1);
        } else if (field.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          if (listField.findIndex(e => e.fieldId === field.fieldId) < 0) {
            listField.push(field);
          }
          if (editedSummaryFields.findIndex(e => e === field.fieldId) < 0) {
            editedSummaryFields.push(field.fieldId);
            setEditedSummaryFields(_.cloneDeep(editedSummaryFields));
          }
          const idxUnAvailable = activityFieldUnavailable.findIndex(e => e.fieldId === field.fieldId);
          if (idxUnAvailable >= 0) {
            activityFieldUnavailable.splice(idxUnAvailable, 1);
          }
        }
      }
    });

    for (let i = 0; i < listField.length; i++) {
      listField[i].fieldOrder = i + 1;
    }
    const ret = { listField: null, deleteFields: null };

    setFieldRelationTab(listField.filter(e => isFieldRelationAsTab(e)))

    ret.listField = listField;
    ret.deleteFields = deleteField;
    setFieldCallback(_.cloneDeep(ret));
    return ret;
  };
  const [isEditAvailableField, setIsEditAvailableField] = useState(false);

  const onExecuteActionActivity = (fieldInfo, actionType, params) => {
    switch (actionType) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(props.activityDetail.fieldInfoActivity.filter(e => e.availableFlag > 0), activityFieldUnavailable, fieldInfo);
          if (summaryFields) {
            props.activityDetail.fieldInfoActivity.forEach((field) => {
              const index = summaryFields.findIndex(e => e.fieldId === field.fieldId)
              if (index < 0 && field.fieldId === params.fieldId) {
                listFieldTmp.push(field)
              }
            })
          }
          const saveFieldResult = onSaveField(listFieldTmp, params, fieldInfo);
          setSummaryFields(saveFieldResult.listField);
          const arrFieldDel = _.cloneDeep(deleteFieldUnavailable)
          if (saveFieldResult.deleteFields.length > 0) {
            arrFieldDel.push(...saveFieldResult.deleteFields)
          }
          setDeleteFieldUnavailable(arrFieldDel);
        }
        setFieldEdit(fieldInfo);
        setParamsEdit(params);
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.CANCEL: {
        const summaryFieldsTmp = _.cloneDeep(summaryFields);
        if (summaryFieldsTmp) {
          const idx = summaryFieldsTmp.findIndex(e => e.fieldId === fieldInfo.fieldId);
          if (fieldInfo.fieldId < 0 && (_.isNil(countSave[fieldInfo.fieldId]) || countSave[fieldInfo.fieldId] === 0) && !fieldInfo.copyField) {
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
              countSave[fieldInfo.fieldId] = 0;
              setCurrentFieldEdit(null)
            }
          } else if (fieldInfo.fieldId > 0 && fieldInfo.availableFlag === 0) {
            const idx2 = activityFieldUnavailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
            }
            if (idx2 < 0) {
              activityFieldUnavailable.push(fieldInfo);
            }
            setCurrentFieldEdit(null)
          }
        }
        if (!_.isNil(summaryFields)) {
          setSummaryFields(summaryFieldsTmp);
        }
        if (isEditAvailableField) {
          setPopupSettingMode(SettingModes.AddNotAvailabelInput);
          setIsEditAvailableField(false);
        } else setPopupSettingMode(SettingModes.CreateNewInput);
        break;
      }
      case DynamicControlAction.DELETE:
        deleteFieldUnAvailable(fieldInfo);
        if (fieldInfo) {
          setIsDelete(true);
        }
        break;
      case DynamicControlAction.EDIT:
        if (!_.isNil(fieldInfo.fieldId)) {
          setIsEditAvailableField(true);
        }
        openDynamicSelectFields(SettingModes.EditInput, fieldInfo);
        if (fieldInfo.fieldId === null) {
          tabSummaryRef.current.onAddNewField(fieldInfo);
        }
        break;
      default:
        break;
    }
  };

  const onExecuteActionProductTrading = (fieldInfo, actionType, params) => {
    // console.log('onExecuteActionProductTrading detail', fieldInfo, actionType, params)
    tabSummaryRef.current.onDynamicFieldPopupExecuteActionForCommonProduct(fieldInfo, actionType, params);
    setPopupSettingMode(SettingModes.CreateNewInput);
  };

  const onExecuteAction = (fieldInfo, actionType, params) => {
    if (FIELD_BELONG.PRODUCT_TRADING === fieldInfo.fieldBelong) {
      onExecuteActionProductTrading(fieldInfo, actionType, params);
    } else {
      onExecuteActionActivity(fieldInfo, actionType, params);
    }
  };

  const renderDynamicSelectFields = () => {
    if (screenMode === ScreenMode.EDIT) {
      let listField = [];
      if (fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
        listField = tabSummaryRef.current.getCurrentFieldInfoProductSet();
      } else {
        listField = _.concat(summaryFields ? summaryFields : [], activityFieldUnavailable);
      }

      const listUnVailable = _.concat(activityFieldUnavailable ? activityFieldUnavailable : [], productTradingUnAvailable ? productTradingUnAvailable : []);
      return (
        <DynamicSelectField
          key={fieldBelong}
          onChangeSettingField={isChangeSettingField}
          fieldsUnVailable={listUnVailable}
          currentSettingMode={popupSettingMode}
          fieldInfos={currentFieldEdit}
          listFieldInfo={listField}
          fieldNameExtension={fieldNameExtension}
          onExecuteAction={currentTab === TAB_ID_LIST.summary ? onExecuteAction : undefined}
          fieldBelong={fieldBelong}
          getFieldsCallBack={!_.isEmpty(fieldCallback) ? fieldCallback : { listField: props.activityDetail.fieldInfoActivity, deleteFields: null }}
        />
      );
    }
  };

  const executeDirtyCheckCloseModal = async () => {
    const isChange = isChangeInputEdit();
    if (isChange) {
      const onCancel = () => { };
      await DialogDirtyCheck({
        onLeave: handleClose,
        onStay: onCancel,
        partternType: DIRTYCHECK_PARTTERN.PARTTERN1
      });
    } else {
      handleClose()
    }
  };

  useEffect(() => {
    if (props.activityDetail) {
      props.activityDetail?.fieldInfoActivity?.forEach((item) => {
        if (_.isNil(item.salesProcess)) {
          Object.assign(item, { salesProcess: null });
        }
      })
      if (props.activityDetail?.tabListShow)
        setTabListShow(_.cloneDeep(props.activityDetail?.tabListShow));
      if (props.activityDetail?.tabInfo) {
        setTabList(_.cloneDeep(props.activityDetail?.tabInfo));
      }
    }
    if (props.activityFieldsUnAvailable)
      setActivityFieldUnavailable(_.cloneDeep(props.activityFieldsUnAvailable));

    setProductTradingUnAvailable(props.productTradingUnAvailable || [])
    if (_.isNil(props.activityDetail?.activities)) {
      setNotFoundMes(translate(`activity.message.404`))
    } else {
      setNotFoundMes(null);
    }
  }, [props.activityDetail]);

  const calculateHeightTable = () => {
    if (tableListRef && tableListRef.current) {
      const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 74;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  }

  const {
    isDragging,
  } = useDragLayer(monitor => ({
    isDragging: monitor.isDragging()
  }));

  const handleScrollIsDragging = e => {
    const element = e.target;
    if (element.scrollTop === 0) {
      setIsScrollMin(true);
    } else {
      setIsScrollMin(false)
    }
  };

  const onDelAddTab = (tabListDelAddAfter, tabListAfter) => {
    const tabArray = [];
    if (tabListDelAddAfter.length > 0) {
      setTabListShow(_.cloneDeep(tabListDelAddAfter));
      tabListDelAddAfter.map(it => {
        tabArray.push(it.tabId)
      })
    }
    let listTemp = tabListAfter.sort((a, b) => a.tabOrder - b.tabOrder);
    listTemp = listTemp.map((it, index) => {
      let obj = {}
      if (tabArray.includes(it.tabId)) {
        obj = Object.assign(it, { isDisplay: true, tabOrder: index + 1 })
      } else {

        obj = Object.assign(it, { isDisplay: false, tabOrder: tabListDelAddAfter.length + index + 1 })
      }
      return obj
    })
    setTabListUpdate(listTemp);
    setTabList(_.cloneDeep(tabListAfter));
  };

  const addTab = (tabId) => {
    tabList.forEach((tab) => {
      if (tab.tabId === tabId) {
        tab.isDisplay = true;
        tab.tabOrder = tabListShow[tabListShow.length - 1].tabOrder + 1;
        tabListShow.push(tab)
      }
    })
    const tabListTmp = tabList.filter(e => e.isDisplay === false)
    const tabsUpdate = _.cloneDeep(tabListShow);
    const lastTabOrderDisplay = tabListShow[tabListShow.length - 1].tabOrder;
    _.orderBy(tabListTmp, 'tabOrder', 'asc').forEach((item, idx) => {
      item.tabOrder = lastTabOrderDisplay + idx + 1;
      tabsUpdate.push(item);
    })
    setTabListShow(_.cloneDeep(tabListShow))
    onDelAddTab(tabListShow, tabList);
  }

  const renderActionTab = () => {
    if (tabListShow && tabList && tabListShow.length < tabList.length && screenMode === ScreenMode.EDIT) {
      return (
        <div className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length &&
            <div className="box-select-option">
              <ul>
                {tabList.map((tab) => {
                  let tabHidden = true;
                  tabListShow.forEach((tabShow) => {
                    if (tab.tabId === tabShow.tabId) {
                      tabHidden = false;
                    }
                  })
                  if (tabHidden === true) {
                    return (
                      <li><a key={`tab_${tab.tabId}`} onClick={() => addTab(tab.tabId)} >{getFieldLabel(tab, 'tabLabel')}</a></li>
                    )
                  }
                })}
              </ul>
            </div>
          }
        </div>
      )
    } else {
      return <></>
    }
  }

  const onDragDropTabList = (dragTabId, dropTabId) => {
    const dragIndexListShow = tabListShow.findIndex(e => e.tabId === dragTabId);
    const dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
    const dragIndexList = tabList.findIndex(e => e.tabId === dragTabId);
    const dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
    if (dragIndexListShow < 0 || dropIndexListShow < 0 || dragIndexListShow === dropIndexListShow) {
      return;
    }
    const objParamListShow = [];
    const objParamList = [];
    const tempObjectListShow = tabListShow.splice(dragIndexListShow, 1, tabListShow[dropIndexListShow])[0]; // get the item from the array
    const tempObjectList = tabList.splice(dragIndexList, 1, tabList[dropIndexList])[0]; // get the item from the array
    tabListShow.splice(dropIndexListShow, 1, tempObjectListShow);
    tabList.splice(dropIndexList, 1, tempObjectList);
    for (let i = 0; i < tabListShow.length; i++) {
      objParamListShow.push(_.cloneDeep(tabListShow[i]));
      objParamListShow[i].tabOrder = i + 1;
    }
    for (let i = 0; i < tabList.length; i++) {
      objParamList.push(_.cloneDeep(tabList[i]));
      objParamList[i].tabOrder = i + 1;
    }
    setTabListShow(_.cloneDeep(objParamListShow));
    setTabList(_.cloneDeep(objParamList));
    setTabListUpdate(objParamList);
  };

  const renderViewTab = () => {
    if (tabList && tabListShow) {
      return (
        <>
          <TabList
            onChangeTab={changeTab}
            tabList={tabList}
            tabListShow={tabListShow}
            onDragDropTabList={onDragDropTabList}
            deleteAddTab={onDelAddTab}
            currentTab={currentTab}
            screenMode={screenMode}
          />
          <RelationDisplayTab
            id="activityRelationId"
            isHeader={true}
            listFieldInfo={fieldRelationTab}
            currentTabId={currentTab}
            onChangeTab={changeTab}
          />
        </>)
    }
  }

  const onChangeSummaryFields = (fields, deleteFields, editedFields) => {
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: null })
    setSummaryFields(_.cloneDeep(fields));
    setEditedSummaryFields(editedFields);
    setDeletedSummaryFields(_.cloneDeep(deleteFields));
  };

  const destroySaveField = () => {
    setIsSaveField(false);
  };

  const onShowMessage = (message, type) => {
    if (type === TypeMessage.downloadFileError) {
      setMessageDownloadFileError(message);
    } else if (type === TypeMessage.deleteWarning) {
      displayToastMessage("WAR_COM_0013", MessageType.Warning, 'block-feedback block-feedback-yellow text-left')
    }
    setTimeout(() => {
      setMessageDownloadFileError(null);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  /**
 * Update tabList when select DislaySummary
 * editedItem : item after edited
 */
  const onSelectDislaySummary = editedItem => {
    const editItemIndex = tabList.findIndex(tab => tab.tabId === editedItem.tabId);
    const copyTabList = _.cloneDeep(tabList);
    copyTabList[editItemIndex] = { ...copyTabList[editItemIndex], ...editedItem };
    setTabListUpdate(_.cloneDeep(copyTabList));
    setTabList(_.cloneDeep(copyTabList));
  }

  /**
   * openProductDetailFromOther
   * @param id 
   */
  const openDetail = (id, type) => {
    if (id)
      props.handleShowDetail(id, type, `ActivityDetail_${props.activityId}`)
  }

  const addFieldUnavailable = (field) => {
    displayToastMessage(WAR_COM_0010, MessageType.Warning, 'block-feedback block-feedback-yellow text-left');
    productTradingUnAvailable.push(field);
  }

  const renderTabContents = () => {
    calculateHeightTable();
    return (
      <>
        {activityDetail && activityDetail.tabInfo && tabList && currentTab === TAB_ID_LIST.summary && (
          <ActivityTabInfo
            tab={currentTab}
            countSave={countSave}
            onChangeFields={onChangeSummaryFields}
            fieldEdit={fieldEdit}
            isSaveField={isSaveField}
            destroySaveField={destroySaveField}
            activityDetail={activityDetail}
            screenMode={screenMode}
            handleReorderField={props.handleReorderField}
            editedFields={editedSummaryFields}
            summaryFields={summaryFields}
            tabList={tabList}
            paramsEdit={paramsEdit}
            onSaveField={onSaveField}
            onShowMessage={onShowMessage}
            openDetal={openDetail}
            openDynamicSelectFields={openDynamicSelectFields}
            ref={tabSummaryRef}
            activityId={props.activityId}
            fieldsUnavailable={activityFieldUnavailable}
            deletedFields={deletedSummaryFields}
            edittingField={currentFieldEdit}
            onSelectDislaySummary={onSelectDislaySummary}
            addFieldUnavailable={addFieldUnavailable}
          />
        )}
        {activityDetail && activityDetail.tabInfo && tabList && currentTab === TAB_ID_LIST.changeHistory && (
          <ActivityTabHistory
            fieldInfoActivity={props.activityDetail.fieldInfoActivity}
            activityId={props.activityId}
            tab={currentTab} />
        )}
        <RelationDisplayTab
          id="activityRelationId"
          recordData={activityDetail ? activityDetail.activities : null}
          fieldNameExtension="activityData"
          isHeader={false}
          listFieldInfo={fieldRelationTab}
          currentTabId={currentTab}
        />
      </>
    );
  };

  const renderSheduleTaskMilestine = () => {
    let objectId, type, textValue;
    if (props.activityDetail?.activities?.schedule?.scheduleId) {
      objectId = props.activityDetail?.activities?.schedule?.scheduleId;
      textValue = props.activityDetail?.activities?.schedule?.scheduleName;
      type = TYPE_DETAIL_MODAL.SCHEDULE;
    } else if (props.activityDetail?.activities?.milestone?.milestoneId) {
      objectId = props.activityDetail?.activities?.milestone?.milestoneId;
      textValue = props.activityDetail?.activities?.milestone?.milestoneName;
      type = TYPE_DETAIL_MODAL.MILESTONE
    } else {
      objectId = props.activityDetail?.activities?.task?.taskId;
      textValue = props.activityDetail?.activities?.task?.taskName;
      type = TYPE_DETAIL_MODAL.TASK;
    }

    return (<>
      <a className="text-blue-activi"
        onClick={() => { props.handleShowDetail(objectId, type, `ActivityDetail_${props.activityId}`, true) }}>
        {textValue}
      </a>
      {(textValue?.length > 0) && <span>&nbsp;{translate('activity.list.body.about')}</span>}
      </>
    )
  };


  const handleClosePopupModeEdit = () => {
    executeDirtyCheck(() => {
      resetStateExecuteDirtyCheck();
    });
  };

  const renderModalSubDetail = () => {
    if (props.modalSubDetail) {
      return (
        <ModalSubDetailsSchedule />
      );
    }
  }

  const onCloseModalTask = (actionStatus) => {
    setDataModalTask({
      ...dataModalTask,
      showModal: false
    });
  }

  useEffect(() => {
    if (props.successMessage && props.successMessage.length > 0) {
      setToastMessage({ message: props.successMessage, type: MessageType.Success });
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
    if (props.errorMessage && props.errorMessage.length > 0) {
      setNotFoundMes(props.errorMessage)
    }
  }, [props.successMessage, props.errorMessage]);

  /**
   * renderToastMessage
   */
  const renderToastMessage = () => {
    if (toastMessage !== null && toastMessage.message !== null) {
      return (
        <>
          <div className="message-area message-area-bottom position-absolute">
            <BoxMessage
              messageType={toastMessage.type}
              message={getErrorMessage(toastMessage.message)}
              styleClassMessage={toastMessage.styleClass}
              className=" "
            />
          </div>
        </>
      );
    }
  }

  const renderMessage = () => {
    if (notFoundMes) {
      return (
        <>
          <div className="message-area">
            <BoxMessage messageType={MessageType.Error} message={notFoundMes} />
          </div>
        </>
      )
    } else if (normalMessage) {
      if (messageDownloadFileError) {
        return <BoxMessage messageType={normalMessage?.type} message={messageDownloadFileError} />;
      }
      return normalMessage.message && normalMessage.message.length > 0 && (
        <div className="message-area position-absolute custom-message">
          {normalMessage.message.map((messsageParams, idx) => {
            return (
              <>
                {messsageParams.map((item, index) => {
                  return <BoxMessage key={index} messageType={normalMessage.type} message={getErrorMessage(item.errorCode)} />;
                })}
              </>
            )
          })}
        </div>
      );
    }
  };

  /**
   * onCloseModalActivity
   * @param id 
   */
  const onCloseModalActivity = (id?) => {
    setOpenModalActivity(false)
    if (id && id > 0) {
      props.getActivityDetail(id);
      props.handleGetActivityHistory(id);
    }
  }

  /**
   * render common right must have license
   */
  const renderCommonTimeline = () => {
    if (screenMode === ScreenMode.DISPLAY && props.listLicense && props.listLicense.includes(LICENSE.TIMELINE_LICENSE)) {
      return (<div className={`popup-content-common-right background-col-F9 v2 wrap-timeline  ${!showTimeline ? 'hide-timeline w1' : 'show-timeline'} `} >
        <div className="button button-gray-common">
          <a className={"icon-small-primary " + (showTimeline ? "icon-next" : "icon-prev")} onClick={() => setShowTimeline(!showTimeline)} />
        </div>
        {showTimeline && <TimelineCommonControl objectId={[activityId]} serviceType={TIMELINE_SERVICE_TYPES.ACTIVITY} isHiddenFormCreate={true} isFullHeight={true}/>}
      </div>)
    }
  }


  const onClickCustomerHistory = (_showHistory?: boolean) => {
    const _customerId = props.activityDetail?.activities?.customer?.customerId;
    setCustomerId(_customerId);
    setShowHistory(!!_showHistory);
    setShowCustomerDetail(true);
  }

  const getClassWidthLeftContent = () => {
    return screenMode === ScreenMode.EDIT ? "" : (!showTimeline ? " w99" : "");
  }

  /**
   * render calendar
   */
  const renderCalendar = () => {
    return (props.listLicense && props.listLicense.includes(LICENSE.CALENDAR_LICENSE) && _.isNil(notFoundMes) &&
      <a className="icon-tool mr-2" onClick={() => handleShowSchedule()} >
        <img src="../../../content/images/icon-calendar.svg" />
      </a>)
  }

  const renderCustomer = () => {
    return (_.isNil(notFoundMes) && <a className="icon-tool" onClick={() => onClickCustomerHistory(true)} >
      <img title="" src="../../../content/images/ic-check-list-clock.svg" alt="" />
    </a>)
  }

  /**
   * render task 
   */
  const renderTask = () => {
    return (props.listLicense && props.listLicense.includes(LICENSE.CALENDAR_LICENSE) && _.isNil(notFoundMes) &&
      <a className="icon-tool mr-2" onClick={() => handleShowTask()} >
        <img src="../../../content/images/calendar/ic-task-brown.svg" />
      </a>
    )
  }

  const renderRightTool = () => {
    return (_.isNil(notFoundMes) && <div>
      {CommonUtil.getEmployeeId() === props.activityDetail?.activities?.employee?.employeeId &&
        <>
          <a className="icon-small-primary icon-edit-small" onClick={() => handleEditActivity(activityId, props.activityDetail?.activities?.activityDraftId)} />
          <a className="icon-small-primary icon-erase-small" onClick={() => handleDeleteActivity(activityId)} />
        </>
      }
      {screenMode === ScreenMode.DISPLAY && isAdmin && (
        <a className="button-primary button-add-new color-999" onClick={() => handleUpdateChangeInfo()}>{translate('activity.activityDetail.button.edit')}</a>
      )}
      {screenMode === ScreenMode.EDIT && (
        <>
          <a onClick={handleClosePopupModeEdit} className="button-cancel">
            {translate('employees.detail.label.button.cancel')}
          </a>
          {_.isEqual(popupSettingMode, SettingModes.EditInput) ? (
            <a className="button-blue disable">{translate('employees.detail.label.button.save')}</a>
          ) : (
              <a onClick={updateCustomFieldInfo} className="button-blue">
                {translate('employees.detail.label.button.save')}
              </a>
            )}
        </>
      )}
      {
        !props.popout && !props.isEditToDetail && <>
          <a className={`icon-small-primary icon-prev ${!(listActivityId && activityId !== listActivityId[0]) ? 'disable' : ''}`}
            onClick={() => nextBefore()}/>
          <a className={`icon-small-primary icon-next ${!(listActivityId && activityId !== listActivityId[listActivityId.length - 1]) ? 'disable' : ''}`}
            onClick={() => nextAfter()}/>
        </>
      }
    </div>)
  }

  const renderBusinessCard = (item) => {
    if (!_.isNil(item.businessCardId)) {
      return (<a onClick={() => { onClickDetailPopup(item.businessCardId, TYPE_DETAIL_MODAL.BUSINESS_CARD) }}
        className="text-blue">{(item.firstName || "") + " " + (item.lastName || "")}</a>)
    } else {
      return (<span >{item.firstName}</span>)
    }
  }

  /**
   * call back when save draft manual success
   */
  const onSaveSussecc = () => {
    props.getActivityDetail(props.activityId)
  }

  const listInterview = useMemo(() => {
    let res = [];
    if (props.activityDetail?.activities?.businessCards?.length > 0) {
      res = _.cloneDeep(props.activityDetail?.activities?.businessCards);
    }
    if (props.activityDetail?.activities?.interviewers?.length > 0) {
      props.activityDetail?.activities?.interviewers.forEach(e => {
        res.push({
          businessCardId: null,
          departmentName: "",
          firstName: e,
          position: "",
          customerName: ""
        })
      })
    }
    return res;
  }, [props.activityDetail]);

  const onClosePopupCustomerDetail = () => {
    setShowCustomerDetail(!showCustomerDetail);
    document.body.className = 'wrap-activity modal-open'
  }

  const renderPopupTool = () => {
    return (
        <div className="popup-tool">
          {/* {screenMode === ScreenMode.DISPLAY && */}
            <div>
              {renderCalendar()}
              {renderTask()}
              {renderCustomer()}
            </div>
          {/* } */}
          {/* {screenMode === ScreenMode.DISPLAY && renderMessage()} */}
          {renderMessage()}
          {screenMode === ScreenMode.EDIT && 
            <a className={`button-primary button-activity-registration content-left activity-unset-position ${!props.popout ? 'left-16-percent' : 'left-10-percent'}`}
              onClick={() => onOpenModalActivity(ACTIVITY_ACTION_TYPES.UPDATE, ACTIVITY_VIEW_MODES.PREVIEW, activityId, null)}>
              {translate('activity.modal.button.preview')}
            </a>
          }
          {renderRightTool()}
        </div>
    )
  }

  const onCloseModalCreateSchedule = () => { 
    setOpenCreateSchedule(false);
    document.body.className = document.body.className.replace('wrap-calendar', '')
  }

  const [customStyleProductTrading, triggerCalcProductTrading] = useHandleShowFixedTip({
    inputRef: productRef,
    overlayRef: tipProductTradingRef,
    isFixedTip: true
  })
  
  const [customStyleBusinessCard, triggerCalcBusinessCard] = useHandleShowFixedTip({
    inputRef: bizzCardRef,
    overlayRef: tipBusinessCardRef,
    isFixedTip: true
  })

  
  const renderModal = () => {
    return (<>
      <div className="modal popup-esr popup-task popup-esr4 user-popup-page popup-align-right popup-modal-common show" id="popup-esr" aria-hidden="true">
        <div className={!props.popout ? "modal-dialog form-popup" : "window-dialog form-popup"}>
          <div className="modal-content">
            {isDragging && !isScrollMin && <div className="box-common-drag-drop-success">
              <span>{translate('employees.detail.info.infoScroll')}</span>
            </div>}
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a className={`icon-small-primary icon-return-small ${isDisableButtonBack ? 'disable' : ''}`} onClick={onCloseModal} />
                  <span className="text"><img className="icon-group-user" src="../../../content/images/ic-sidebar-activity.svg" />
                    {translate('activity.modal.title-detail')}
                  </span>
                </div>
              </div>
              <div className="right">
                <a className="icon-small-primary icon-share" onClick={() => copyUrlActivity()} />
                {!props.popout && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow(activityId)} />}
                {!props.popout && <a className="icon-small-primary icon-close-up-small line" onClick={() => { executeDirtyCheckCloseModal() }} />}
              </div>
            </div>
            <div className={!props.popout ? "modal-body style-3" : "modal-body style-3 no-padding"}>
              <div className={`popup-content popup-content-activity style-3 popup-task-no-padding none-scroll ${props.classRelation ? props.classRelation : ""}`}>
                {renderPopupTool()}
                {props.activityDetail?.activities &&
                  <div className="popup-content-task-wrap">
                    <div className={"popup-content-task-left bg-white scrollarea overflow-x-hidden " + getClassWidthLeftContent()} onScroll={handleScrollIsDragging}>
                      {screenMode === ScreenMode.EDIT && (
                        <a
                          className="button-primary button-activity-registration content-left"
                          onClick={() => onOpenModalActivity(ACTIVITY_ACTION_TYPES.UPDATE, ACTIVITY_VIEW_MODES.PREVIEW, activityId, null)}>
                          {translate('activity.modal.button.preview')}
                        </a>
                      )}
                      <div className="flag-wrap background-col-F9 mb-0">
                        <div className="block-card d-flex margin-bottom-25">
                          <div className="img">

                            {/* "../../../content/images/ic-user5.svg" */}
                            {!_.isEmpty(props.activityDetail?.activities?.employee?.employeePhoto?.fileUrl) ? (
                              <AvatarReal className="user ml-2" sizeAvatar={70} src={props.activityDetail?.activities?.employee?.employeePhoto?.fileUrl} alt="" title="" />
                            ) : (
                                <AvatarDefault sizeAvatar={70}>{!_.isEmpty(props.activityDetail?.activities?.employee?.employeeSurname) ? props.activityDetail?.activities?.employee?.employeeSurname[0].toUpperCase() : " "}</AvatarDefault>
                              )}
                            {/* <img src = "../../../content/images/ic-user5.svg"    /> */}

                            {/* <img src={ props.activityDetail?.activities?.employee?.employeePhoto?.filePath || "../../../content/images/ic-user5.svg" } alt=""/> */}

                          </div>
                          <div className="ml-3 info color-333">
                            <p className="date mb-0">
                              {formatDate(props.activityDetail?.activities?.contactDate)}&nbsp;
                              ({CommonUtil.convertToTime(props.activityDetail?.activities?.activityStartTime)} - {CommonUtil.convertToTime(props.activityDetail?.activities?.activityEndTime)} {props.activityDetail?.activities?.activityDuration}{translate('activity.modal.minute')})
                              {props.activityDetail?.activities?.activityDraftId && <span className="label-red background-color-33 ml-3 px-3">{translate('activity.list.body.isDraft')}</span>}
                            </p>

                            <p className="person mb-0" onClick={() => { onClickDetailPopup(props.activityDetail?.activities?.employee?.employeeId, TYPE_DETAIL_MODAL.EMPLOYEE) }}>
                              <a title="" className="text-blue-activi">
                                {props.activityDetail?.activities?.employee?.employeeSurname || ''}&nbsp;{props.activityDetail?.activities?.employee?.employeeName || ''}
                              </a>
                            </p>
                            <div className="message mb-0">
                              {renderSheduleTaskMilestine()}
                              {/* interview and card start */}
                              {listInterview?.length === 1 &&
                                <>
                                  {renderBusinessCard(listInterview[0])}
                                  &nbsp;{translate('activity.list.body.san')}&nbsp;
                                </>
                              }
                              {listInterview?.length > 1 &&
                                <>
                                  {renderBusinessCard(listInterview[0])}
                                  &nbsp;{translate('activity.list.body.san')}&nbsp;
                                  <div ref={bizzCardRef} onClick={() => {triggerCalcBusinessCard(); setShowTipBizzCard(!showTipBizzCard);}} className="text-blue show-list-item-activity">{translate('activity.list.body.business-card-amount', { amount: listInterview?.length - 1 })}&nbsp;

                                    {showTipBizzCard &&
                                      <div className="form-group width-450"  style={{...customStyleBusinessCard}} ref={tipBusinessCardRef}>
                                        <ul className="drop-down drop-down2 height-unset">
                                          {
                                            listInterview.map((e, idx) => {
                                              if (idx !== 0) {
                                                return <BusinessCardItemList onClick={() => { onClickDetailPopup(e.businessCardId, TYPE_DETAIL_MODAL.BUSINESS_CARD) }}
                                                  businessCard={e} key={`businessCard_${activityId}_${e.businessCardId}_${idx}`} />
                                              }
                                            })
                                          }
                                        </ul>
                                      </div>
                                    }

                                  </div>
                                </>
                              }
                              {listInterview?.length > 0 && props.activityDetail?.activities?.customer?.customerId && translate('activity.list.body.to')}&nbsp;
                              {/* interview and card end */}
                              <a title="" className="text-blue-activi" onClick={() => { onClickCustomerHistory(false) }}>{props.activityDetail?.activities?.customer?.customerName || ''}</a>
                              {props.activityDetail?.activities?.productTradings?.length > 1 ? (
                                <>
                                  <span>&nbsp;／&nbsp;</span>
                                  {props.activityDetail?.activities?.productTradings[0].productName}
                                  &nbsp;
                                  <a ref={productRef} title="" onClick={() => { triggerCalcProductTrading(); setShowTipProduct(!showTipProduct) }}
                                    className="text-blue-activi show-list-item-activity">
                                    &nbsp;{translate('activity.list.body.product-amount', { amount: props.activityDetail?.activities?.productTradings?.length - 1 })}&nbsp;
                                    {showTipProduct &&
                                      <div className="form-group width-450" style={{...customStyleProductTrading}} ref={tipProductTradingRef}>
                                        <ul className="drop-down drop-down2 height-unset">
                                          {
                                            props.activityDetail?.activities?.productTradings?.map((e, idx) => {
                                              if (idx !== 0) {
                                                return <ProductTradingItemList onClick={() => onClickDetailPopup(e.productId, TYPE_DETAIL_MODAL.PRODUCT)}
                                                  productTrading={e} key={`product_${activityId}_${e.productTradingId}_${idx}`} />
                                              }
                                            })
                                          }
                                        </ul>
                                      </div>
                                    }
                                  </a>
                                  {translate('activity.list.body.related_activities')}
                                </>
                              ) : (
                                  <>
                                    {props.activityDetail?.activities?.productTradings?.length > 0 &&
                                      (<>
                                        <span>&nbsp;／&nbsp;</span>
                                        {props.activityDetail?.activities?.productTradings[0].productName}
                                        {translate('activity.list.body.related_activities')}
                                      </>
                                      )}
                                  &nbsp;
                                  </>)
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`popup-content-common-content acitivty-body-detail ${screenMode === ScreenMode.EDIT ? "pl-4" : ""}`}>
                        <div className="tab-detault">
                          <Sticky scrollElement=".scrollarea" className="activity-sticky-selector z-index-999">
                            <ul className={"nav nav-tabs background-color-88" + (currentTab === 2 ? 'mb-0' : '')}>
                              {renderViewTab()}
                              {renderActionTab()}
                            </ul>
                          </Sticky>
                          <div className={'tab-content mt-4 style-3'} style={{ height: heightTable }} ref={tableListRef}>
                            {renderTabContents()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {renderCommonTimeline()}
                    {renderDynamicSelectFields()}
                  </div>
                }
                {renderToastMessage()}
              </div>
            </div>
          </div>
        </div>
        {renderModalSubDetail()}
      </div>
      {dataModalTask.showModal &&
        <ModalCreateEditTask
          toggleCloseModalTask={onCloseModalTask}
          iconFunction="ic-time1.svg"
          {...dataModalTask}
          customerId={dataModalTask.customerId}
          productTradingIds={dataModalTask.productTradingIds}
          canBack={true} />
      }

      {openModalActivity &&
        <ActivityModalForm
          activityViewMode={activityViewMode}
          activityActionType={activityActionType}
          listFieldPreview={summaryFields}
          activityFormatPreview={props.activityDetail?.activities?.activityFormats}
          canBack={true}
          onSaveSussecc={onSaveSussecc}
          activityDraftIdInput={activityDraftId}
          onCloseModalActivity={onCloseModalActivity}
          activityId={currentActivityId} popout={false} />
      }

      {/* fix bug not display confirm delete */}
      {props.openConfirmPopup && props.popout
        && <ConfirmPopup infoObj={props.confirmPopupItem} />
      }

      {
        showCustomerDetail &&
        <PopupCustomerDetail
          id={customerDetailCtrlId[0]}
          showModal={true}
          openFromModal={true}
          customerId={customerId}
          listCustomerId={[]}
          displayActivitiesTab={showHistory}
          toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
          openFromOtherServices={true}
        />
      }
      {openCreateSchedule && <CreateEditSchedule onClosePopup={onCloseModalCreateSchedule} openFromModal={true}/>}
    </>);
  };

  useEffect(() => {
    if (props.popout) {
      setInterval(() => {
        // for temporary patch only
        document.body.className = 'body-full-width';
      }, 1000);
    }

  }, [props.popout]);

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
          {renderModal()}
        </Modal>
        <ShowDetail idCaller={`ActivityDetail_${props.activityId}`} cleanClosePopup={true} popout={props.popout} />
      </>
    );
  } else {
    return <>
      <div className="wrap-activity window-activity">
        {renderModal()}
      </div>
      <ShowDetail idCaller={`ActivityDetail_${props.activityId}`} cleanClosePopup={true} popout={props.popout} />
    </>
  }
}

const mapStateToProps = ({ activityListReducerState, applicationProfile, authentication, screenMoveState, dataModalSchedule }: IRootState) => ({
  listActivities: activityListReducerState.listActivities,
  tenant: applicationProfile.tenant,
  activityDetail: activityListReducerState.activityDetail,
  authorities: authentication.account.authorities,
  screenMode: activityListReducerState.screenMode,
  screenMoveInfo: screenMoveState.screenMoveInfo,
  messageChangeStatusSuccess: activityListReducerState.messageChangeStatusSuccess,
  errorMessageChangeStatusFailed: activityListReducerState.errorMessageChangeStatusFailed,
  messageUpdateCustomFieldInfoSuccess: activityListReducerState.messageUpdateCustomFieldInfoSuccess,
  messageUpdateCustomFieldInfoError: activityListReducerState.messageUpdateCustomFieldInfoError,
  activityFieldsAvailable: activityListReducerState.activityFieldsAvailableDetail,
  activityFieldsUnAvailable: activityListReducerState.activityFieldsUnAvailableDetail,
  productTradingUnAvailable: activityListReducerState.productTradingUnAvailableDetail,
  modalSubDetail: dataModalSchedule.modalSubDetailCalendar,
  errorMessage: activityListReducerState.errorMessage,
  successMessage: activityListReducerState.successMessage,
  fieldInfoIds: activityListReducerState.fieldInfoIds,
  isEditToDetail: activityListReducerState.isEditToDetail,
  confirmPopupItem: activityListReducerState.confirmPopupItem,
  openConfirmPopup: activityListReducerState.openConfirmPopup,
  listLicense: authentication.account.licenses,
  action: activityListReducerState.action,
  deleteActivityIds: activityListReducerState.deleteActivityIds,
  fieldBelongUpdateCustomFieldInfo: activityListReducerState.fieldBelongUpdateCustomFieldInfo
});

const mapDispatchToProps = {
  handleShowModalActivityDetail,
  onclickEdit,
  onclickDelete,
  onclickShowModalActivityForm,
  toggleConfirmPopup,
  updateActivityDetailIndex,
  handleUpdateActivityInfo,
  changeScreenMode,
  handleUpdateCustomFieldInfo,
  handleUpdateMultiCustomFieldInfo,
  handleShowDetail,
  handleReorderField,
  handleClearResponseData,
  turnModeEditToDetail,
  getActivityDetail,
  handleGetActivityHistory,
  updateScheduleDataDraf,
  clearShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

ActivityDetail.defaultProps = {
  activityDetail: {
    activities: {
      isDraft: false,
      activityId: null,
      contactDate: moment().format(dateFormat),
      activityStartTime: "",
      activityEndTime: "",
      activityDuration: null,
      activityFormatId: null,
      name: null,
      activityFormats: [],
      employee: null,
      businessCards: [],
      interviewer: null,
      customer: {},
      productTradings: [],
      customers: [],
      memo: null,
      tasks: [],
      schedules: [],
      createdUser: null,
      updatedUser: null,
      activityData: null
    },
    fieldInfoActivity: [],
    tabInfo: []
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityDetail);

