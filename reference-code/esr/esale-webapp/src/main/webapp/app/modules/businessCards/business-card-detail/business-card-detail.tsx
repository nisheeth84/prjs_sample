import { isScreenModeDisplay, isScreenModeEdit, FIELD_BELONG, ScreenMode, TIMEOUT_TOAST_MESSAGE, SCREEN_TYPES, AUTHORITIES } from 'app/config/constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { DynamicControlAction, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import DynamicSelectField from 'app/shared/layout/dynamic-form/control-field/dynamic-select-field';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { Modal } from 'reactstrap';
import { OPTION_DELETE, TAB_ID_LIST, BUSINESS_CARD_VIEW_MODES, BUSINESS_CARD_ACTION_TYPES, EMPLOYEE_OPTION, CUSTOMER_OPTION } from '../constants';
import { handleInitActivities } from 'app/modules/activity/list/activity-list-reducer'
import BoxMessage, { MessageType } from '../../../shared/layout/common/box-message';
import { isNullOrUndefined } from 'util';
import {
  changeScreenMode,
  handleCreateFollowed,
  handleDeleteFolloweds, handleInitBusinessCard,
  handleInitBusinessCardChangeHistory,
  handleDeleteBusinessCards,
  handleInitProductTrading,
  resetState,
  handleReorderField,
  handleUpdateCustomFieldInfo,
  handleInitListCustomer,
  BusinessCardAction
} from './business-card-detail-reducer';
import TabList from './business-card-detail-tab-list';
import TabActivityHistory from './business-card-detail-tabs/business-card-detail-tab-activity-history';
import TabCalendar from './business-card-detail-tabs/business-card-detail-tab-calendar';
import TabChangeHistory from './business-card-detail-tabs/business-card-detail-tab-change-history';
import TabMail from './business-card-detail-tabs/business-card-detail-tab-mail';
import TabSummary from './business-card-detail-tabs/business-card-detail-tab-summary';
import RelationDisplayTab from 'app/shared/layout/dynamic-form/control-field/view/relation-display-tab'
import SlideShow from '../common/slide-show'
import { convertDateToUserFormat, snakeBusinessCardField } from '../util';
import { moveScreenReset } from 'app/shared/reducers/screen-move.reducer'
import { CLASS_CUSTOM } from 'app/modules/businessCards/constants';
import CreateEditBusinessCard from '../create-edit-business-card/create-edit-business-card';
import PopupEmployeeDetail from '../../employees/popup-detail/popup-employee-detail';
import PopupCustomerDetail from '../../customers/popup-detail/popup-customer-detail';
import PopupBusinessCardTransfer from "./popup-business-card-transfer/popup-business-card-transfer";
import useEventListener from 'app/shared/util/use-event-listener';
import { processRelationselectOrganization, putDataToFieldEdit, isFieldRelationAsTab, createNewFieldLookup, initialRevertFields, revertDeletedFields, concatArray } from 'app/shared/util/utils';
import MergeBusinessCard from "../popup-merge-business-cards/merge-business-cards";
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import PopupTaskDetail from '../../tasks/detail/detail-task-modal';
import PopupActivityDetail from '../../activity/detail/activity-modal-detail';
import PopupMileStoneDetail from '../../tasks/milestone/detail/detail-milestone-modal';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import EmployeeName from '../common/EmployeeName';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { TypeMessage } from './business-card-detail-tabs/business-card-detail-tab-summary-element';
import Sticky from 'react-sticky-el';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { LICENSE } from '../constants';
import { TIMELINE_SERVICE_TYPES } from 'app/modules/timeline/common/constants';
import BusinessCardTimeline from './business-card-detail-timelines'

export const AVAILABLE_FLAG = {
  UNAVAILABLE: 0,
  WEB_APP_AVAILABLE: 3
};

export interface IBusinessCardDetailProps extends StateProps, DispatchProps {
  iconFunction?: string,
  showModal: boolean;
  backdrop?: boolean; // [backdrop:false] when open from popup
  businessCardAddEditMsg?: any,
  isList?: boolean,
  resetSuccessMessage?: () => void;
  openFromModal?: boolean;
  businessCardId: any,
  listBusinessCardId: any,
  businessCardList: any,
  toggleClosePopupBusinessCardDetail: (isCreateEdit?) => void; // change isbck => isCreateEdit xu ly ham back khi create 
  toggleOpenPopupBusinessCardEdit?: (update, editable, currentBusinessCardId) => void,
  popout?: boolean,
  popoutParams?: any,
  openBusinessCardDetailFromOther?: (id) => void;
  activities?: boolean
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

export enum PopupConditionDisplay {
  None,
  ModalDialog,
  Window,
}

export enum SettingModes {
  CreateNewInput,
  AddNotAvailabelInput,
  EditInput
}

const BusinessCardDetail = (props: IBusinessCardDetailProps) => {
  const businessCardDetail = props.businessCard && props.businessCardFieldsAvailable;
  const [showModal, setShowModal] = useState(true);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [currentTab, setCurrentTab] = useState(props.activities ? TAB_ID_LIST.activity : TAB_ID_LIST.summary);
  const [currentBusinessCardId, setCurrentBusinessCardId] = useState(props.businessCardId);
  const [listBusinessCardId, setListBusinessCardId] = useState(props.listBusinessCardId);
  const [businessCardList, setBusinessCardList] = useState(props.businessCardList ? props.businessCardList : []);
  const [summaryFields, setSummaryFields] = useState(null);
  const [heightTable, setHeightTable] = useState(0);
  const [, setShowConditionDisplay] = useState(PopupConditionDisplay.None);

  /* mode edit */
  const [popupSettingMode, setPopupSettingMode] = useState(SettingModes.CreateNewInput);
  const [currentFieldEdit, setCurrentFieldEdit] = useState(null);
  const [isSaveField, setIsSaveField] = useState(false);
  const [fieldEdit, setFieldEdit] = useState();
  const [paramsEdit, setParamsEdit] = useState();
  const [tabListUpdate, setTabListUpdate] = useState(null);
  const [deletedSummaryFields, setDeletedSummaryFields] = useState([]);
  const [tabList, setTabList] = useState(props.businessCard ? props.businessCard.tabInfos : []);
  const [tabListShow, setTabListShow] = useState(props.businessCard ? props.businessCard.tabInfos.filter(e => e.isDisplay) : null);
  const [businessCardFieldUnvailable, setBusinessCardFieldUnvailable] = useState([]);
  const [deleteFieldUnavailable, setDeleteFieldUnavailable] = useState([]);
  const [countSave] = useState({});
  const [isEditAvailableField, setIsEditAvailableField] = useState(false);
  const tabSummaryRef = useRef(null);
  const [fieldCallback, setFieldCallback] = useState({});
  /* end mode edit */

  /* call popup */
  const [employeeId, setEmployeeId] = useState(0);
  const [customerId, setCustomerId] = useState(0);
  const [taskId, setTaskId] = useState(0);
  const [activityId, setActivityId] = useState(null);
  const [activityActionType, setActivityActionType] = useState(ACTIVITY_ACTION_TYPES.CREATE)
  const [mileStoneId, setMileStoneId] = useState(0);
  const [openPopupEdit, setOpenPopupEdit] = useState(false);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [openPopupCustomerDetail, setOpenPopupCustomerDetail] = useState(false);
  const [openPopupTaskDetail, setOpenPopupTaskDetail] = useState(false);
  const [openPopupActivityDetail, setOpenPopupActivityDetail] = useState(false);
  const [openPopupMileStoneDetail, setOpenPopupMileStoneDetail] = useState(false);
  const [cardDetail, setCardDetail] = useState(false);
  const [openPopupBusinessCardTransfer, setOpenPopupBusinessCardTransfer] = useState(false);
  const [openMergeBusinessCard, setOpenMergeBusinessCard] = useState(false);
  const [dataModalTask, setDataModalTask] = useState({ showModal: false, taskActionType: TASK_ACTION_TYPES.CREATE, taskId: null, parentTaskId: null, taskViewMode: TASK_VIEW_MODES.EDITABLE })
  const [openPopupCreateTask, setOpenPopupCreateTask] = useState(false);
  const [openPopupCreateActivity, setOpenPopupCreateActivity] = useState(false);
  /* end call popup */

  const [toastMessage, setToastMessage] = useState(null);
  const [fieldRelationTab, setFieldRelationTab] = useState([]);
  const [editedSummaryFields, setEditedSummaryFields] = useState([]);
  const [isLoadBusinessCard, setIsLoadBusinessCard] = useState(false);
  const [normalMessage, setNormalMessage] = useState(null);
  const [messageDownloadFileError, setMessageDownloadFileError] = useState(null);

  const [checkDelete, setCheckDelete] = useState(false);
  const [checkDeleteBusinessCard, setCheckDeleteBusinessCard] = useState(false);
  const [checkDeleteLastBusinessCard, setCheckDeleteLastBusinessCard] = useState(false);
  const [checkChooseOption, setCheckChooseOption] = useState(false);
  const [actionTypePopup, setActionTypePopup] = useState()
  const [hasFollow, setHasFollow] = useState((props.businessCard && props.businessCard.businessCardDetail && props.businessCard.businessCardDetail.hasFollow) ? 1 : 0)
  const [businessCardViewMode, setBusinessCardViewMode] = useState(BUSINESS_CARD_VIEW_MODES.EDITABLE)

  const [employeeOption, setEmployeeOption] = useState(EMPLOYEE_OPTION.ALL);
  const [customerOption, setCustomerOption] = useState(CUSTOMER_OPTION.ALL);
  const [customerIds, setCustomerIds] = useState(null);
  const [hasLoginUser, setHasLoginUser] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const toolTipRef = useRef(null);
  const toolTipReceiverRef = useRef(null);

  const [isShowPulldown, setIsShowPulldown] = useState(false)

  const { screenMoveInfo } = props
  const tableListRef = useRef(null);
  const [summaryFieldRevert, setSummaryFieldRevert] = useState([])
  const [screenMode, setScreenMode] = useState(props.screenMode);
  const [isDelete, setIsDelete] = useState(false);
  const [isCreateEdit, setIsCreateEdit] = useState(false);
  /* slide show */
  const [showSlideImage, setShowSlideImage] = useState(false);
  const [lstImage, setLstImage] = useState([]);
  /* end slide show */

  /* timeline */
  const [showTimeline, setShowTimeline] = useState(screenMode === ScreenMode.DISPLAY)
  const [timelineConditions, setTimelineConditions] = useState(null)
  const [isChangeTimeline, setIsChangeTimeline] = useState(false);
  /* end timeline */

  /* update KP21 */
  const [isOpenMenuAddTab, setIsOpenMenuAddTab] = useState(false);
  const actionTabRef = useRef(null);
  const [cardId, setCardId] = useState(null);
  const [businessCardSuccessMsg, setBusinessCardSuccessMsg] = useState(null);
  /* end update KP21 */

  /* For history */
  const [modeComponent, setModeComponent] = useState("normal");
  const [dateHistory, setDateHistory] = useState(null);
  const [dataDetailHistory, setDataDetailHistory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [companyNameHistory, setCompanyNameHistory] = useState(null);
  const [, setCustomerNameHistory] = useState(null);
  const [customerIdHistory, setCustomerIdHistory] = useState(null);
  const [alternativeCustomerNameHistory, setAlternativeCustomerNameHistory] = useState(null);
  const [lstHistoryData, setLstHistoryData] = useState([]);
  const [amountOfHistory, setAmountOfHistory] = useState(null);
  const [currentHistory, setCurrentHistory] = useState(0);
  const [lstDateHistory, setLstDateHistory] = useState([])
  const employeeDetailCtrlId = useId(1, "businessCardEmployeeDetailCtrlId_");
  const customerDetailCtrlId = useId(1, "businessCardDetailCustomerDetailCtrlId_");

  /* authority */
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);

  /* For tab calendar */
  const [calendarView, setCalendarView] = useState('month');

  const [lstBCId, setLstBCId] = useState([{ idBC: props.businessCardId, index: 0 }]);
  const [isCanBack, setIsCanBack] = useState(false);

  const initialState = {
    tabListShow: _.cloneDeep(props.businessCard && props.businessCard.tabInfos.filter(e => e.isDisplay)),
    tabList: _.cloneDeep(props.businessCard && props.businessCard.tabInfos),
    tabListUpdate: null,
    summaryFields: null
  };

  const [loadTab] = useState({
    summary: false,
    activity: false,
    trading: false,
    calendar: false,
    mail: false,
    history: false
  })

  let isChangeField = false;
  const handleMouseDownListView = (e) => {
    if ((!toolTipRef || !toolTipRef.current) && (!toolTipReceiverRef || !toolTipReceiverRef.current)) {
      return;
    }
    if ((toolTipRef.current && toolTipRef.current.contains(e.target)) || (toolTipReceiverRef.current && toolTipReceiverRef.current.contains(e.target))) {
      return;
    }
    setCheckChooseOption(false);
    setIsShowPulldown(false);
  }
  useEventListener('mousedown', handleMouseDownListView);

  const handleInitData = (businessCardId, tab, lstIdCustomer, isUserLogin) => {
    if (businessCardId) {
      switch (tab) {
        case TAB_ID_LIST.summary:
          if (modeComponent === "normal") {
            props.handleInitBusinessCard(businessCardId, "detail", false, lstIdCustomer, isUserLogin);
          }
          break;
        case TAB_ID_LIST.history:
          props.handleInitBusinessCard(businessCardId, "detail", false, lstIdCustomer, isUserLogin);
          props.handleInitBusinessCardChangeHistory(businessCardId, 0, 30, null);
          break;
        case TAB_ID_LIST.activity:
          props.handleInitBusinessCard(businessCardId, "detail", false, lstIdCustomer, isUserLogin);
          setCurrentPage(1);
          break;
        default:
          break;
      }
    }
  }

  const onOpenModalEmployeeDetail = (paramEmployeeId): void => {
    setEmployeeId(paramEmployeeId);
    setOpenPopupEmployeeDetail(true);
  }

  const onOpenModalCustomerDetail = (paramCustomerId) => {
    if (paramCustomerId) {
      setCustomerId(paramCustomerId);
      setOpenPopupCustomerDetail(true);
    }
  }

  const isChangeInputEdit = () => {
    let isChange = false;
    if (screenMode === ScreenMode.EDIT) {
      const oldData = {
        summaryField: _.cloneDeep(props.businessCardFieldsAvailable.fieldInfo),
        tabList: _.cloneDeep(props.businessCard.tabInfos)
      };
      if (summaryFields === null && tabListUpdate === null && popupSettingMode !== SettingModes.EditInput) {
        isChange = false;
      } else {
        if (tabListUpdate !== null && !_.isEqual(tabListUpdate, oldData.tabList)) {
          isChange = true;
        }
        if (!_.isNil(summaryFields)) {
          summaryFields.forEach((field) => {
            if (field.userModifyFlg && field.userModifyFlg === true) {
              isChange = true;
            }
          })
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

  /**
   * Handle for clicking the outside of dropdown
   * @param e
   */
  const handleClickOutside = (e) => {
    if (actionTabRef.current && !actionTabRef.current.contains(e.target)) {
      setIsOpenMenuAddTab(false);
    }
  }

  useEffect(() => {
    return (() => {
      props.resetState();
    })
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  useEffect(() => {
    if (currentTab !== TAB_ID_LIST.history) {
      setCurrentPage(0);
    }
  }, [currentTab]);

  useEffect(() => {
    if (lstBCId.length === 1) {
      setIsCanBack(false);
    }
  }, [lstBCId]);

  const resetStateExecuteDirtyCheck = () => {
    props.changeScreenMode(false);
    setPopupSettingMode(SettingModes.CreateNewInput);
    setTabListUpdate(null);
    setSummaryFields(null);
    setBusinessCardFieldUnvailable(_.cloneDeep(props.businessCardFieldsUnVailable));
    setCurrentFieldEdit(null);
    setTabListShow(initialState.tabListShow);
    setTabList(initialState.tabList);
    setToastMessage(null);
    setFieldCallback({});
    setIsOpenMenuAddTab(false);
    setDeletedSummaryFields([]);
    setNormalMessage({ type: MessageType.None, message: [] })
  }

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    const isChange = isChangeInputEdit();
    if (isChange || isChangeTimeline) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern });
    } else {
      action();
    }
  };

  const onClickBack = () => {
    if (screenMode === ScreenMode.DISPLAY) {
      if (lstBCId.length >= 2) {
        const tmpLstId = _.cloneDeep(lstBCId);
        setCurrentBusinessCardId(lstBCId[lstBCId.length - 2].idBC);
        setLstBCId(tmpLstId.slice(0, -1));
        setIsCanBack(true);
      }
      if (props.openFromModal) {
        return props.toggleClosePopupBusinessCardDetail(isCreateEdit);
      }
    }
    executeDirtyCheck(() => {
      props.changeScreenMode(false)
      resetStateExecuteDirtyCheck()
    }, null, DIRTYCHECK_PARTTERN.PARTTERN1)
  }

  const resetOptionData = (inputTab?) => {
    setCustomerIds(null);
    setHasLoginUser(false);
    setIsInit(true);
    setCustomerOption(CUSTOMER_OPTION.ALL);
    setEmployeeOption(EMPLOYEE_OPTION.ALL);
    setTimelineConditions(null)
    if (inputTab !== null || inputTab !== undefined) {
      setCurrentPage(0);
      setCurrentTab(inputTab)
    } else {
      setCurrentTab(currentTab)
    }
  }

  const handleClosePopup = () => {
    setShowConditionDisplay(PopupConditionDisplay.None);
    executeDirtyCheck(() => {
      props.resetState();
      props.toggleClosePopupBusinessCardDetail(isCreateEdit);
    });
  }

  const toggleOpenPopupEdit = (viewMode, action, showModalPopup) => {
    if (viewMode === BUSINESS_CARD_VIEW_MODES.PREVIEW) {
      setOpenPopupEdit(true);
      setActionTypePopup(action)
      setBusinessCardViewMode(viewMode)
      setCardId(null);
      setBusinessCardSuccessMsg(null);
    } else {
      executeDirtyCheck(() => {
        setOpenPopupEdit(true);
        setActionTypePopup(action);
        setBusinessCardViewMode(viewMode);
        setCardId(currentBusinessCardId);
        setBusinessCardSuccessMsg(null);
        resetStateExecuteDirtyCheck()
      });
    }
  }

  const onClosePopupEdit = (param) => {
    setOpenPopupEdit(false);
    if (param && param.msg) {
      setBusinessCardSuccessMsg(param.msg);
      Object.keys(loadTab).forEach((item) => {
        loadTab[item] = false;
      })
      handleInitData(currentBusinessCardId, TAB_ID_LIST.summary, [], false);
      resetOptionData(TAB_ID_LIST.summary);
    } else if (_.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.SEARCH) || _.isEqual(screenMoveInfo.screenType, SCREEN_TYPES.ADD)) {
      props.toggleClosePopupBusinessCardDetail();
    }
  }

  const handleCloseModalBusinessCard = (toggleModal) => {
    if (toggleModal) {
      setOpenPopupEdit(false);
    }
  }

  const onClosePopupEmployeeDetail = (isBack?) => {
    setOpenPopupEmployeeDetail(false);
    if (!isBack) {
      props.toggleClosePopupBusinessCardDetail();
    }
  }

  const onOpenPopupTaskDetail = (idTask) => {
    setOpenPopupTaskDetail(true);
    setTaskId(idTask);
  }

  const onOpenPopupActivityDetail = (idActivity) => {
    if (idActivity) {
      setOpenPopupActivityDetail(true);
      setActivityId(idActivity);
    }
  }

  const onOpenPopupMileStoneDetail = (idMileStone) => {
    setOpenPopupMileStoneDetail(true);
    setMileStoneId(idMileStone);
  }

  const onClosePopupActivityDetail = (isBack = true) => {
    setOpenPopupActivityDetail(false);
    setActivityId(null)
    if (!isBack) {
      props.toggleClosePopupBusinessCardDetail();
    }
  }

  const onClosePopupTaskDetail = (isBack = true) => {
    setOpenPopupTaskDetail(false);
    if (!isBack) {
      props.toggleClosePopupBusinessCardDetail();
    }
  }

  const onClosePopupMileStoneDetail = (isBack = true) => {
    setOpenPopupMileStoneDetail(isBack);
    if (!isBack) {
      document.body.className = 'wrap-card modal-open';
    }
  }

  const onClosePopupCustomerDetail = () => {
    document.body.className = 'wrap-card modal-open';
    setOpenPopupCustomerDetail(false);
  }

  const onOpenPopupBusinessCardTransfer = () => {
    setCardDetail(props.businessCard?.businessCardDetail);
    setOpenPopupBusinessCardTransfer(true);
  }
  /**
   * close Popup Transfer
   */
  const closePopupTransfer = () => {
    setOpenPopupBusinessCardTransfer(false);
    handleInitData(currentBusinessCardId, currentTab, customerIds, hasLoginUser);
  }

  const onOpenMergeBusinessCard = () => {
    setOpenMergeBusinessCard(true);
  }

  const onClosePopupMergeBusinessCard = (isMerged) => {
    setOpenMergeBusinessCard(false);
    if (isMerged) {
      handleInitData(currentBusinessCardId, TAB_ID_LIST.summary, [], false);
    }
    // if (isMerged) {
    //   if (props.popout) {
    //     window.close();
    //     setForceCloseWindow(true);
    //   } else {
    //     handleClosePopup()
    //   }
    //   props.resetState();
    // }
  }

  /**
   * open modal create task
   */
  const onOpenPopupCreateTask = () => {
    setOpenPopupCreateTask(true);
  }

  /**
   * close modal create task
   */
  const onCloseModalTask = () => {
    setDataModalTask({
      ...dataModalTask
    });
    setOpenPopupCreateTask(false);
    document.body.className = 'wrap-card modal-open';
  }

  /**
   * open modal create activity
   */
  const onOpenPopupCreateActivity = (id?, actionType?) => {
    if (actionType) {
      setActivityActionType(actionType);
    }
    if (id) {
      setActivityId(id);
    }
    setOpenPopupCreateActivity(true);
  }

  /**
   * close modal create activity
   */
  const onCloseModalActivity = () => {
    document.body.className = 'wrap-card modal-open';
    setActivityId(null)
    setOpenPopupCreateActivity(false);
  }

  const onSaveActivitySuccess = (id) => {
    if (currentTab === TAB_ID_LIST.activity) {
      const orderBy = [{ key: "contact_date", value: "DESC" }];
      const paramsInitActivities = {
        listBusinessCardId: [props.businessCardId],
        listCustomerId: customerIds,
        orderBy
      }
      props.handleInitActivities(paramsInitActivities);
    } else if (currentTab === TAB_ID_LIST.summary) {
      handleInitData(currentBusinessCardId, currentTab, customerIds, hasLoginUser)
    }
  }

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

  const onClickChooseOption = () => {
    setCheckChooseOption(!checkChooseOption);
  }

  const createFollowed = () => {
    const followTargetType = 2;
    const followTargetId = currentBusinessCardId ? currentBusinessCardId : props.popoutParams.businessCardId;
    props.handleCreateFollowed(followTargetType, followTargetId);
  }

  const deleteFollowed = () => {
    const followTargetType = 2;
    const followTargetId = currentBusinessCardId ? currentBusinessCardId : props.popoutParams.businessCardId;
    const followeds = [{ followTargetType, followTargetId }];
    props.handleDeleteFolloweds(followeds);
  }

  /* _________________Message_________________ */
  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const displayToastMessage = (message, type, styleClass) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { type, message, styleClass };
    objParams.type = type;
    objParams.message = [message];
    objParams.styleClass = styleClass;
    setToastMessage(objParams);
    if (type === MessageType.Success || message === "WAR_COM_0010" || message === "WAR_COM_0013") {
      setTimeout(() => {
        setToastMessage(null);
      }, TIMEOUT_TOAST_MESSAGE);
    }
  };

  const renderMessage = () => {
    if (normalMessage === null) {
      if (messageDownloadFileError) {
        return <BoxMessage messageType={MessageType.Error} message={messageDownloadFileError} />;
      }
    } else {
      return (
        <>
          {normalMessage.message.map((messsageParams, idx) => {
            return <BoxMessage className="mw-100" key={idx} messageType={normalMessage.type} message={getErrorMessage(messsageParams)} />;
          })}
        </>
      );
    }
  };

  const renderToastMessage = () => {
    if (toastMessage !== null) {
      return (
        <>
          <div className="message-area message-area-bottom position-absolute">
            {toastMessage.message.map((messsageParams, idx) => {
              return <BoxMessage key={idx} messageType={toastMessage.type} message={props.msgSuccess ? props.msgSuccess : getErrorMessage(messsageParams)} styleClassMessage={toastMessage.styleClass} className=' ' />;
            })}
          </div>
        </>
      );
    }
  }

  const displayNormalMessage = (message, type) => {
    if (_.isNil(message) || !message.length) {
      return;
    }
    const objParams = { type, message };
    objParams.type = type;
    objParams.message = [message];
    setNormalMessage(objParams);
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
  }

  const copyUrlBusinessCard = (url) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/business-card-detail/${currentBusinessCardId}`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  const getCurrentIndex = () => {
    let index = null;
    listBusinessCardId.forEach((id, i) => {
      if (currentBusinessCardId === id) {
        index = i;
      }
    });
    return index
  }

  const onNextBusinessCard = () => {
    let nextId = null;
    const currentIndex = getCurrentIndex();

    listBusinessCardId.forEach((id, idx) => {
      if (idx === currentIndex) {
        nextId = listBusinessCardId[idx + 1];
      }
    });
    executeDirtyCheck(() => {
      resetStateExecuteDirtyCheck()
      resetOptionData(currentTab)
      setCurrentBusinessCardId(_.cloneDeep(nextId));
    })
  }

  const onPrevBusinessCard = () => {
    let prevProductId = null;
    const currentIndex = getCurrentIndex();

    listBusinessCardId.forEach((id, i) => {
      if (i === currentIndex) {
        prevProductId = listBusinessCardId[i - 1];
      }
    });
    executeDirtyCheck(() => {
      resetStateExecuteDirtyCheck()
      resetOptionData(currentTab)
      setCurrentBusinessCardId(_.cloneDeep(prevProductId));
    })
  }

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(BusinessCardDetail.name, {
        summaryFields,
        tabListShow,
        currentTab,
        currentBusinessCardId,
        listBusinessCardId,
        businessCardList,
        screenMode,
        customerIds,
        hasLoginUser,
        lstImage,
      });
    }
    else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(BusinessCardDetail.name);
      if (saveObj) {
        setSummaryFields(saveObj.summaryFields);
        setTabListShow(saveObj.tabListShow);
        setCurrentTab(saveObj.currentTab);
        setCurrentBusinessCardId(saveObj.currentBusinessCardId);
        setListBusinessCardId(saveObj.listBusinessCardId);
        setBusinessCardList(saveObj.businessCardList);
        setScreenMode(saveObj.screenMode);
        setCustomerIds(saveObj.customerIds);
        setHasLoginUser(saveObj.hasLoginUser);
        setLstImage(saveObj.lstImage);
        // handleInitData(saveObj.currentBusinessCardId, saveObj.currentTab, saveObj.customerIds, saveObj.hasLoginUser);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(BusinessCardDetail.name);
    }
  }

  const openNewWindow = () => {
    executeDirtyCheck(() => {
      setShowModal(false);
      updateStateSession(FSActionTypeScreen.SetSession);
      const height = screen.height * 0.8;
      const width = screen.width * 0.8;
      const left = screen.width * 0.3;
      const top = screen.height * 0.3;
      const style = `width=${width},height=${height},left=${left},top=${top}`;
      window.open(`${props.tenant}/business-card-detail/${props.businessCardId}`, '', style.toString());
      setShowConditionDisplay(PopupConditionDisplay.None);
      props.toggleClosePopupBusinessCardDetail();
    }, null, DIRTYCHECK_PARTTERN.PARTTERN1);
  }

  /* _________________Get Info_________________ */
  const renderPulldownReceiver = (items) => {
    return (
      <div className="receiver-drop-down" ref={toolTipReceiverRef}>
        {items.map(item => {
          let empName = item.employeeSurname ? item.employeeSurname : ''
          empName += item.employeeName ? ' ' + item.employeeName : ''
          return (
            <div className="dropdown-item" key={item.employeeId}>
              <EmployeeName
                userName={empName}
                userImage={item.employeePhoto?.filePath}
                employeeId={item.employeeId}
                sizeAvatar={30}
                backdrop={false}
              ></EmployeeName>
            </div>
          )
        })}
      </div>
    )
  }

  const getLastContact = () => {
    if (props.businessCard && props.businessCard.businessCardDetail && props.businessCard.businessCardDetail.businessCardReceives) {
      const receivers = props.businessCard.businessCardDetail.businessCardReceives.filter(item => (item.receivedLastContactDate && item.receivedLastContactDate === props.businessCard.businessCardDetail.lastContactDate));
      // const receivers = _.cloneDeep(props.businessCard.businessCardDetail.businessCardReceives);
      const receiversShow = [];
      const receiversHide = [];
      receivers.forEach((item, idx) => {
        if (idx < 3) {
          receiversShow.push(item)
        } else {
          receiversHide.push(item)
        }
      })
      if (receiversHide.length === 0) {
        return (
          <div className="flex-fill">
            {receiversShow.map((el, idx) => {
              let empName = el.employeeSurname ? el.employeeSurname : ''
              empName += el.employeeName ? ' ' + el.employeeName : ''
              return (
                el.employeeId &&
                <EmployeeName
                  userName={empName}
                  userImage={el.employeePhoto?.filePath}
                  employeeId={el.employeeId}
                  sizeAvatar={30}
                  backdrop={false}
                  subCol={receiversShow.length > 0 ? 12 / receiversShow.length : 12}
                ></EmployeeName>
              )
            })}
          </div>
        )
      } else {
        return (
          <>
            <div className="flex-fill">
              {receiversShow.map((ele, idx) => {
                let empName = ele.employeeSurname ? ele.employeeSurname : ''
                empName += ele.employeeName ? ' ' + ele.employeeName : ''
                return (
                  ele.employeeId &&
                  <EmployeeName
                    userName={empName}
                    userImage={ele.employeePhoto?.filePath}
                    employeeId={ele.employeeId}
                    sizeAvatar={30}
                    backdrop={false}
                    subCol={receiversShow.length > 0 ? 12 / receiversShow.length : 12}
                  ></EmployeeName>
                )
              })}
            </div>
            <div className="dropdown transform-y-4">
              <a className="text-blue mr-3" title="" onClick={() => { setIsShowPulldown(!isShowPulldown) }}>
                {translate('businesscards.detail.label.more-receiver', { 0: receiversHide.length })}
              </a>
              {isShowPulldown && renderPulldownReceiver(receiversHide)}
            </div>
          </>
        )
      }
    } else {
      return <></>
    }
  }

  const isChangeSettingField = (isChange: boolean) => {
    isChangeField = isChange;
    return isChange;
  }

  /* _________________Edit mode_________________ */
  const deleteFieldUnAvailable = fieldInfo => {
    const fieldsUnAvailable = _.cloneDeep(businessCardFieldUnvailable);
    const index = fieldsUnAvailable.findIndex(e => e.fieldId === fieldInfo.fieldId)
    if (index >= 0) {
      fieldsUnAvailable.splice(index, 1);
      deletedSummaryFields.push(fieldInfo.fieldId);
      setBusinessCardFieldUnvailable(fieldsUnAvailable);
    }
  }

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
        const fLookup = createNewFieldLookup(listField, field, deleteField)
        listField = fLookup.listField;
        deleteField = fLookup.deleteField;
      }
      if (field.fieldId === fieldInfoEdit.fieldId) {
        if (field.availableFlag === AVAILABLE_FLAG.UNAVAILABLE) {
          const idx = businessCardFieldUnvailable.findIndex(e => e.fieldId === field.fieldId)
          if (idx < 0) {
            businessCardFieldUnvailable.push(field);
          } else {
            businessCardFieldUnvailable[idx] = field;
          }
          displayToastMessage("WAR_COM_0010", MessageType.Warning, 'block-feedback block-feedback-yellow text-left');
          listField.splice(index, 1);
        } else if (field.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          if (listField.findIndex(e => e.fieldId === field.fieldId) < 0) {
            listField.push(field);
          }
          if (editedSummaryFields.findIndex(e => e === field.fieldId) < 0) {
            editedSummaryFields.push(field.fieldId);
            setEditedSummaryFields(_.cloneDeep(editedSummaryFields));
          }
          const idxUnAvailable = businessCardFieldUnvailable.findIndex(e => e.fieldId === field.fieldId);
          if (idxUnAvailable >= 0) {
            businessCardFieldUnvailable.splice(idxUnAvailable, 1);
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
  }

  const onExecuteAction = (fieldInfo, actionType, params) => {
    switch (actionType) {
      case DynamicControlAction.SAVE: {
        countSave[fieldInfo.fieldId] = countSave[fieldInfo.fieldId] + 1;
        if (fieldInfo.availableFlag > AVAILABLE_FLAG.UNAVAILABLE) {
          setIsSaveField(true);
        } else {
          const listFieldTmp = summaryFields ? _.cloneDeep(summaryFields) : concatArray(businessCardDetail.fieldInfo.filter(e => e.availableFlag > 0), businessCardFieldUnvailable, fieldInfo);
          if (summaryFields) {
            props.businessCard.fieldInfo.forEach((field) => {
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
            const idx2 = businessCardFieldUnvailable.findIndex(e => e.fieldId === fieldInfo.fieldId);
            if (idx >= 0) {
              summaryFieldsTmp.splice(idx, 1);
            }
            if (idx2 < 0) {
              businessCardFieldUnvailable.push(fieldInfo);
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

  const handleClosePopupModeEdit = () => {
    executeDirtyCheck(() => {
      resetStateExecuteDirtyCheck();
    });
  }

  const updateCustomFieldInfo = () => {
    if (tabListUpdate !== null) {
      tabListUpdate.map(item => {
        delete item.tabLabel;
        delete item.fieldOrder;
      });
    }
    const summaryFieldsTmp = _.cloneDeep(summaryFields);
    const fieldsUpdate = [];
    if (!_.isNil(summaryFields)) {
      businessCardFieldUnvailable.forEach(field => {
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
      summaryFieldsTmp.map(item => {
        const field = _.cloneDeep(item);
        delete field.fieldBelong;
        delete field.createdDate;
        delete field.createdUser;
        delete field.updatedUser;
        if (!_.isNil(field.oldField)) {
          delete field.oldField;
        }
        if (_.toString(field.fieldType) === DEFINE_FIELD_TYPE.RELATION && !_.isNil(field.relationField)) {
          if (!_.isNil(field.relationField.isMultiToSingle)) {
            delete field.relationField.isMultiToSingle;
          }
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
    }
    props.handleUpdateCustomFieldInfo(FIELD_BELONG.BUSINESS_CARD, deleteSummaryFieldTmp, fieldsUpdate, tabListUpdate, null, null);
    props.changeScreenMode(false);
  }

  /**
   * delete
   */

  const buidBusinessCardName = listData => {
    const listName = [];
    if (listData && listData.length > 0) {
      listData.forEach(data => {
        let name = '';
        if (data.firstName) name += data.firstName;
        if (data.lastName) name += (name ? ' ' : '') + data.lastName;
        listName.push(name)
      })
    }
    return listName;
  }

  const deleteBusinessCards = option => {
    const dataDetele = [{
      customerId: props.businessCard && props.businessCard.businessCardDetail ? props.businessCard.businessCardDetail.customerId : null,
      businessCardIds: [currentBusinessCardId],
      businessCardNames: props.businessCard && props.businessCard.businessCardDetail ? buidBusinessCardName([props.businessCard.businessCardDetail]) : ['']
    }];
    if (option === OPTION_DELETE.checkDelete) {
      setCheckDelete(true);
    } else {
      setCheckDelete(false);
    }
    props.handleDeleteBusinessCards(dataDetele, option)
  }

  const onClickDelete = () => {
    deleteBusinessCards(OPTION_DELETE.checkDelete)
  }

  const onClickClosePopupDelete = () => {
    setCheckDelete(false);
    setCheckDeleteBusinessCard(false);
    setCheckDeleteLastBusinessCard(false);
  }

  const onClickConfirmPopupDelete = () => {
    deleteBusinessCards(OPTION_DELETE.deleteOnly);
    onClickClosePopupDelete();
  }

  const onClickConfirmPopupDeleteMulti = () => {
    deleteBusinessCards(OPTION_DELETE.deleteMulti);
    onClickClosePopupDelete();
  }

  useEffect(() => {
    if (props.deleteBusinessCards && props.actionDelete === BusinessCardAction.Success) {
      if (checkDelete) {
        if (props.deleteBusinessCards.hasLastBusinessCard) {
          setCheckDeleteLastBusinessCard(true);
        } else {
          setCheckDeleteBusinessCard(true);
        }
      } else {
        if (props.popout) {
          window.close();
          setForceCloseWindow(true);
        } else {
          props.toggleClosePopupBusinessCardDetail(true)
        }
        props.resetState();
      }
    }
  }, [props.deleteBusinessCards])

  const renderDeleteLastBusinessCard = () => {
    return (
      checkDeleteLastBusinessCard &&
      <>
        <div className="popup-esr2 popup-esr3 popup-product" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-esr2-body">
              <a className="icon-small-primary icon-close-up-small" onClick={onClickClosePopupDelete} />
              <div className="popup-esr2-title">
                {translate('businesscards.detail.label.title.delete')}
              </div>
              <div>{props.deleteBusinessCards ? props.deleteBusinessCards.messageWarning : ''}</div>
            </div>
            <div className="popup-esr2-footer">
              <a className="button-blue" onClick={onClickConfirmPopupDeleteMulti}>{translate('businesscards.detail.label.button.confirmMulti')}</a>
              <a className="button-blue" onClick={onClickConfirmPopupDelete}>{translate('businesscards.detail.label.button.confirmOnly')}</a>
              <a className="button-cancel" onClick={onClickClosePopupDelete}>{translate('businesscards.detail.label.button.cancel')}</a>
            </div>
          </div>

        </div>
        <div className="modal-backdrop show" />
      </>
    )
  }

  const renderDeleteBusinessCard = () => {
    return (
      checkDeleteBusinessCard &&
      <>
        <div className="popup-esr2 popup-esr3 popup-product" id="popup-esr2">
          <div className="popup-esr2-content">
            <button type="button" className="close" data-dismiss="modal"><span className="la-icon"><i className="la la-close" /></span></button>
            <div className="popup-esr2-body">
              <a className="icon-small-primary icon-close-up-small" onClick={onClickClosePopupDelete} />
              <div className="popup-esr2-title">
                {translate('businesscards.detail.label.title.delete')}
              </div>
              <div>{props.deleteBusinessCards ? props.deleteBusinessCards.messageWarning : ''}</div>
            </div>
            <div className="popup-esr2-footer justify-content-center">
              <a className="button-blue" onClick={onClickConfirmPopupDelete}>{translate('businesscards.detail.label.button.confirm')}</a>
              <a className="button-cancel" onClick={onClickClosePopupDelete}>{translate('businesscards.detail.label.button.cancel')}</a>
            </div>
          </div>
        </div>
        <div className="modal-backdrop show" />
      </>
    )
  }

  /* _________________Tab list_________________ */
  const changeTab = (clickedTabId) => {
    setCurrentTab(clickedTabId);
  }

  const onDragDropTabList = (dragTabId, dropTabId) => {
    const dragIndexListShow = tabListShow.findIndex(e => e.tabId === dragTabId);
    let dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
    const dragIndexList = tabList.findIndex(e => e.tabId === dragTabId);
    let dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
    if (dragIndexListShow < 0 || dropIndexListShow < 0 || dragIndexListShow === dropIndexListShow) {
      return;
    }
    const objParamListShow = [];
    const objParamList = [];
    if (Math.abs(dragIndexListShow - dropIndexListShow) === 1) {
      const tempObjectListShow = tabListShow.splice(dragIndexListShow, 1, tabListShow[dropIndexListShow])[0]; // get the item from the array
      tabListShow.splice(dropIndexListShow, 1, tempObjectListShow);
    } else {
      const tmpObjectListShow = tabListShow.splice(dragIndexListShow, 1)[0]; // get the item from the array
      dropIndexListShow = tabListShow.findIndex(e => e.tabId === dropTabId);
      tabListShow.splice(dropIndexListShow, 0, tmpObjectListShow);
    }
    if (Math.abs(dragIndexList - dropIndexList) === 1) {
      const tempObjectList = tabList.splice(dragIndexList, 1, tabList[dropIndexList])[0]; // get the item from the array
      tabList.splice(dropIndexList, 1, tempObjectList);
    } else {
      const tmpObjectList = tabList.splice(dragIndexList, 1)[0]; // get the item from the array
      dropIndexList = tabList.findIndex(e => e.tabId === dropTabId);
      tabList.splice(dropIndexList, 0, tmpObjectList);
    }

    for (let i = 0; i < tabListShow.length; i++) {
      objParamListShow.push(_.cloneDeep(tabListShow[i]));
      objParamListShow[i].tabOrder = i + 1;
    }
    for (let i = 0; i < tabList.length; i++) {
      objParamList.push(_.cloneDeep(tabList[i]));
      objParamList[i].tabOrder = i + 1;
    }
    setTabListShow(objParamListShow);
    setTabList(objParamList);
    setTabListUpdate(objParamList);
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

  const getListImage = (lstData) => {
    const lstImg = []
    lstData.forEach(item => lstImg.push({ imageId: item['business_card_id'], imageName: item['business_card_image_name'], imagePath: item['business_card_image_path'] }))
    return lstImg;
  }

  /* use effect */
  useEffect(() => {
    if (!isInit) {
      let lstId = []
      let isLoginUser;
      const timeLineSearch = [];
      if (employeeOption === EMPLOYEE_OPTION.ALL) {
        isLoginUser = false;
        if (customerOption === CUSTOMER_OPTION.ALL) {
          if (props.customers && props.customers.length > 0) {
            props.customers.forEach(customer => {
              lstId.push(customer.customerId)
            })
            lstId.push(props.businessCard.businessCardDetail.customerId)
          } else {
            lstId = (props.businessCard && props.businessCard.businessCardDetail.customerId) ? [props.businessCard.businessCardDetail.customerId] : []
          }
          timeLineSearch.push({ targetType: 6, targetId: [currentBusinessCardId] })
          if (lstId.length > 0) {
            timeLineSearch.push({ targetType: 5, targetId: lstId })
          }
        } else {
          lstId = (props.businessCard && props.businessCard.businessCardDetail.customerId) ? [props.businessCard.businessCardDetail.customerId] : []
        }
      } else {
        isLoginUser = true;
        if (customerOption === CUSTOMER_OPTION.ALL) {
          if (props.customers && props.customers.length > 0) {
            props.customers.forEach(customer => {
              lstId.push(customer.customerId)
            })
            lstId.push(props.businessCard.businessCardDetail.customerId)
          } else {
            lstId = (props.businessCard && props.businessCard.businessCardDetail.customerId) ? [props.businessCard.businessCardDetail.customerId] : []
          }
          timeLineSearch.push({ targetType: 6, targetId: [currentBusinessCardId] })
          if (lstId.length > 0) {
            timeLineSearch.push({ targetType: 5, targetId: lstId })
          }
        } else {
          lstId = (props.businessCard && props.businessCard.businessCardDetail.customerId) ? [props.businessCard.businessCardDetail.customerId] : []
          timeLineSearch.push({ targetType: 6, targetId: [currentBusinessCardId] })
        }
      }
      setTimelineConditions(timeLineSearch)
      setCustomerIds(lstId)
      setHasLoginUser(isLoginUser)
      handleInitData(currentBusinessCardId, currentTab, lstId, isLoginUser);
    }
    if (modeComponent === "normal") {
      setDataDetailHistory(null);
      setCompanyNameHistory(null);
      setCustomerNameHistory(null);
      setCustomerIdHistory(null);
      setAlternativeCustomerNameHistory(null);
    }
  }, [employeeOption, customerOption, modeComponent])

  useEffect(() => {
    if (props.customers) {
      let lstId = []
      if (props.customers.length > 0) {
        props.customers.forEach(customer => {
          lstId.push(customer.customerId)
        })
        const itemId = props.businessCardId ? props.businessCardId : Number(props.popoutParams.businessCardId)
        if (businessCardList && businessCardList.length > 0) {
          const item = businessCardList.find(x => x['business_card_id'] === itemId);
          if (item && item['customer_id']) {
            lstId.push(item['customer_id'])
          }
        }
      } else {
        const itemId = props.businessCardId ? props.businessCardId : Number(props.popoutParams.businessCardId)
        if (businessCardList && businessCardList.length > 0) {
          const item = businessCardList.find(x => x['business_card_id'] === itemId);
          lstId = (item && item['customer_id']) ? [item['customer_id']] : []
        }
      }
      if (modeComponent === "normal") {
        handleInitData(currentBusinessCardId, currentTab, lstId, hasLoginUser)
      }
    }
  }, [props.customers])

  useEffect(() => {
    if (props.businessCardIdResponse) {
      setIsCreateEdit(true)
    }
  }, [props.businessCardIdResponse])

  useEffect(() => {
    if (props.timelineFollowed) {
      setHasFollow(1)
    }
  }, [props.timelineFollowed])

  useEffect(() => {
    if (props.followeds && props.followeds.length > 0) {
      setHasFollow(0)
    }
  }, [props.followeds])

  useEffect(() => {
    setScreenMode(props.screenMode);
    if (props.screenMode === ScreenMode.DISPLAY) {
      setNormalMessage({ type: MessageType.None, message: [] })
      setEditedSummaryFields([])
    }
  }, [props.screenMode]);

  useEffect(() => {
    if (screenMoveInfo && screenMoveInfo.screenType === SCREEN_TYPES.DETAIL) {
      if (currentBusinessCardId !== screenMoveInfo.objectId) setCurrentBusinessCardId(screenMoveInfo.objectId);
      // if (currentTab !== TAB_ID_LIST.summary) setCurrentTab(TAB_ID_LIST.summary);
      // if (!isInit) handleInitData(screenMoveInfo.objectId, TAB_ID_LIST.summary, customerIds, hasLoginUser);
      props.moveScreenReset();
    }
  }, [screenMoveInfo])

  useEffect(() => {
    const item = businessCardList.find(x => x['business_card_id'] === currentBusinessCardId);
    if (item && item['customer_id']) {
      props.handleInitListCustomer(item['customer_id'])
    } else {
      if (currentTab === TAB_ID_LIST.summary) {
        handleInitData(currentBusinessCardId, TAB_ID_LIST.summary, [], false)
      } else {
        handleInitData(currentBusinessCardId, TAB_ID_LIST.summary, [], false)
        handleInitData(currentBusinessCardId, currentTab, [], false)
      }
    }
    return () => {
      // props.resetState();
      if (props.resetSuccessMessage) {
        props.resetSuccessMessage();
      }
      setBusinessCardSuccessMsg(null);
    };
  }, [currentBusinessCardId])

  useEffect(() => {
    if (props.businessCardList && props.businessCardList.length > 0) {
      setBusinessCardList(props.businessCardList);
      setLstImage(getListImage(props.businessCardList))
    }
  }, [props.businessCardList])

  useEffect(() => {
    const itemId = props.businessCardId ? props.businessCardId : Number(props.popoutParams.businessCardId)
    setCurrentBusinessCardId(itemId);
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      setShowModal(true);
    }
  }, []);

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

  useEffect(() => {
    if (summaryFieldRevert && summaryFields && businessCardFieldUnvailable) {
      setSummaryFieldRevert(initialRevertFields(summaryFields, businessCardFieldUnvailable, summaryFieldRevert));
    }
  }, [summaryFields, businessCardFieldUnvailable])

  useEffect(() => {
    if (props.businessCard) {
      // set list customer
      let lstId = [];
      if (props.customers && props.customers.length > 0) {
        props.customers.forEach(customer => {
          lstId.push(customer.customerId)
        })
        lstId.push(props.businessCard.businessCardDetail.customerId)
      } else {
        lstId = (props.businessCard.businessCardDetail && props.businessCard.businessCardDetail.customerId) ? [props.businessCard.businessCardDetail.customerId] : []
      }
      setCustomerIds(lstId)

      // set timeline condition
      const timeLineSearch = [{ targetType: 6, targetId: [currentBusinessCardId] }];
      if (lstId.length > 0) {
        timeLineSearch.push({ targetType: 5, targetId: lstId })
      }
      setTimelineConditions(timeLineSearch)

      setIsInit(false);
      if (businessCardList.length === 0) {
        setBusinessCardList([snakeBusinessCardField(props.businessCard.businessCardDetail)]);
        setLstImage(getListImage([snakeBusinessCardField(props.businessCard.businessCardDetail)]))
      }

      setTabListShow(_.cloneDeep(props.tabListShow));
      setTabList(_.cloneDeep(props.businessCard.tabInfos));

      setBusinessCardFieldUnvailable(_.cloneDeep(props.businessCardFieldsUnVailable));
      setSummaryFieldRevert(props.businessCard.fieldInfo)
      props.businessCard.fieldInfo.forEach((item) => {
        if (_.isNil(item.salesProcess)) {
          Object.assign(item, { salesProcess: null });
        }
      })
      if (!isLoadBusinessCard && _.toArray(props.businessCard.fieldInfo).length > 0) {
        setFieldRelationTab(props.businessCard.fieldInfo.filter(e => isFieldRelationAsTab(e)))
        setIsLoadBusinessCard(true);
      }
    }
  }, [props.businessCard])

  useEffect(() => {
    setTabListShow(props.businessCard ? props.tabListShow : []);
    setTabList(props.businessCard ? props.businessCard.tabInfos : []);
  }, [props.tabListShow])

  useEffect(() => {
    if ((currentTab === TAB_ID_LIST.summary || currentTab === TAB_ID_LIST.history) && !isInit) {
      handleInitData(currentBusinessCardId, currentTab, customerIds, hasLoginUser);
    }
    return () => {
      setShowConditionDisplay(PopupConditionDisplay.None);
    }
  }, [currentTab]);

  useEffect(() => {
    if (props.messageUpdateCustomFieldInfoSuccess && props.action === BusinessCardAction.UpdateSuccess) {
      Object.keys(loadTab).forEach((item) => {
        loadTab[item] = false;
      })
      handleInitData(currentBusinessCardId, currentTab, customerIds, hasLoginUser);
      setSummaryFields(null);
      props.changeScreenMode(false);
      setFieldCallback(null);
      resetStateExecuteDirtyCheck()
    }
  }, [props.messageUpdateCustomFieldInfoSuccess, props.action])

  useEffect(() => {
    displayToastMessage(businessCardSuccessMsg, MessageType.Success, CLASS_CUSTOM)
  }, [businessCardSuccessMsg])

  useEffect(() => {
    displayToastMessage(props.messageUpdateCustomFieldInfoSuccess, MessageType.Success, CLASS_CUSTOM);
  }, [props.messageUpdateCustomFieldInfoSuccess]);

  useEffect(() => {
    displayNormalMessage(props.messageUpdateCustomFieldInfoError, MessageType.Error);
    if (props.messageUpdateCustomFieldInfoError) {
      const resultRevert = revertDeletedFields(deletedSummaryFields, summaryFields, businessCardFieldUnvailable, summaryFieldRevert);
      setSummaryFields(_.cloneDeep(resultRevert.fieldsAvailable));
      setBusinessCardFieldUnvailable(_.cloneDeep(resultRevert.fieldsUnVailable))
      setDeletedSummaryFields(resultRevert.deletedFields)
      setSummaryFieldRevert(resultRevert.fieldsRevert)
    }
  }, [props.messageUpdateCustomFieldInfoError]);

  useEffect(() => {
    displayToastMessage(props.msgSuccess, MessageType.Success, CLASS_CUSTOM);
  }, [props.msgSuccess]);

  useEffect(() => {
    displayNormalMessage(props.errorItems, MessageType.Error);
  }, [props.errorItems]);

  useEffect(() => {
    if (props.businessCardAddEditMsg) {
      setBusinessCardSuccessMsg(props.businessCardAddEditMsg);
    }
  }, [props.businessCardAddEditMsg])

  /* _________________Render_________________ */
  const renderSlideShowImage = () => {
    return (
      showSlideImage &&
      <SlideShow
        lstImage={lstImage}
        setShowSlideImage={setShowSlideImage}
        currentId={currentBusinessCardId}
        setCurrentBusinessCardId={setCurrentBusinessCardId}
      />
    )
  }

  const renderImage = () => {
    if (modeComponent === "history") {
      return (
        <img src={dataDetailHistory ?
          (dataDetailHistory.businessCardDetail.businessCardImagePath ?
            dataDetailHistory.businessCardDetail.businessCardImagePath : '../../content/images/noimage.png') : ""} alt=""
          className="cursor-pointer" onClick={() => { setShowSlideImage(!showSlideImage) }} />
      )
    }
    return (
      <img src={props.businessCard ?
        (props.businessCard.businessCardDetail.businessCardImagePath ?
          props.businessCard.businessCardDetail.businessCardImagePath : '../../content/images/noimage.png') : ""} alt=""
        className="cursor-pointer" onClick={() => { setShowSlideImage(!showSlideImage) }} />
    )
  }

  const renderCustomer = () => {
    if (modeComponent === "history") {
      return (
        (companyNameHistory[currentHistory]) ?
          (alternativeCustomerNameHistory[currentHistory] ?
            alternativeCustomerNameHistory[currentHistory] :
            <a className="text-blue item word-break-all" onClick={() => { onOpenModalCustomerDetail(customerIdHistory[currentHistory]) }}>{companyNameHistory[currentHistory]}</a>) : <a className="text-blue item" />
      )
    }
    return (
      (props.businessCard && props.businessCard.businessCardDetail) ?
        (!props.businessCard.businessCardDetail.customerId ?
          <a>{props.businessCard.businessCardDetail.alternativeCustomerName}</a> :
          <a className="text-blue item word-break-all" onClick={() => { onOpenModalCustomerDetail(props.businessCard.businessCardDetail.customerId) }}>{props.businessCard.businessCardDetail.customerName}</a>) : <a />
    )
  }

  const renderDepartmentPosition = () => {
    if (modeComponent === "history") {
      return (
        (dataDetailHistory) ?
          (dataDetailHistory.businessCardDetail ?
            <span className="item word-break-all">{dataDetailHistory.businessCardDetail.departmentName}{" "}{dataDetailHistory.businessCardDetail.position}</span> : <span className="item word-break-all" />
          ) : <span className="item word-break-all" />)
    } else {
      let departmentPositionName = '';
      if (props.businessCard && props.businessCard.businessCardDetail) {
        if (props.businessCard.businessCardDetail.departmentName) departmentPositionName += props.businessCard.businessCardDetail.departmentName
        if (props.businessCard.businessCardDetail.position) departmentPositionName += props.businessCard.businessCardDetail.position
      }
      return (
        <span className="item word-break-all">
          {departmentPositionName}
        </span>
      )
    }
  }

  const renderBusinessCardName = (isShowActivityLabel) => {
    let businessCardName = '';
    if (props.businessCard && props.businessCard.businessCardDetail) {
      if (props.businessCard.businessCardDetail.firstName) businessCardName += props.businessCard.businessCardDetail.firstName
      if (props.businessCard.businessCardDetail.lastName) businessCardName += props.businessCard.businessCardDetail.lastName
    }
    if (isShowActivityLabel) {
      return (
        <div className="name">
          <div className="name-info word-break-all">{businessCardName}</div>
          {props.businessCard && props.businessCard.businessCardDetail && props.businessCard.businessCardDetail.hasActivity && props.listLicense && props.listLicense.includes(LICENSE.ACTIVITIES_LICENSE) ? <span>{translate('businesscards.detail.label.active')}</span> : ''}
        </div>
      )
    } else {
      return businessCardName;
    }
  }

  const renderLastContactDate = () => {
    let lastContactDate = '';
    if (props.businessCard && props.businessCard.businessCardDetail && props.businessCard.businessCardDetail.lastContactDate) {
      lastContactDate = convertDateToUserFormat(props.businessCard.businessCardDetail.lastContactDate)
    }
    if (lastContactDate) {
      return (
        <span className="text-blue" onClick={() => onOpenPopupActivityDetail(props.businessCard.businessCardDetail.activityId)}>{lastContactDate}</span>
      )
    } else {
      return <></>
    }
  }

  const renderDynamicSelectFields = () => {
    const listField = _.concat(summaryFields ? summaryFields : [], businessCardFieldUnvailable);
    return (
      <DynamicSelectField
        onChangeSettingField={isChangeSettingField}
        fieldsUnVailable={businessCardFieldUnvailable}
        currentSettingMode={popupSettingMode}
        fieldInfos={currentFieldEdit}
        fieldNameExtension={"business_card_data"}
        listFieldInfo={listField}
        onExecuteAction={currentTab === TAB_ID_LIST.summary ? onExecuteAction : undefined}
        fieldBelong={FIELD_BELONG.BUSINESS_CARD}
        getFieldsCallBack={!_.isEmpty(fieldCallback) ? fieldCallback : { listField: props.businessCard && props.businessCard.fieldInfo, deleteFields: null }}
      />
    )
  }

  const isScreenDisplay = useMemo(() => isScreenModeDisplay(screenMode), [screenMode]);
  const isScreenEdit = useMemo(() => isScreenModeEdit(screenMode), [screenMode]);
  // const renderTimelineContent = useCallback(() => {
  //   return (
  //     <div className="popup-content-task-right wrap-timeline popup-content-common-right v2" style={showTimeline ? { width: "38%" } : { width: "0%" }}>
  //       <div className="button">
  //         <a className={"icon-small-primary icon-small-primary-v2 " + (showTimeline ? "icon-next" : "icon-prev")} onClick={() => setShowTimeline(!showTimeline)} />
  //       </div>
  //       {showTimeline && !isInit && timelineConditions.length > 0 &&
  //         <TimelineCommonControl
  //           objectId={[currentBusinessCardId]}
  //           serviceType={TIMELINE_SERVICE_TYPES.BUSSINESS_CARD}
  //           targetDeliversForSearch={timelineConditions}
  //           isDataChange={(isChange) => setIsChangeTimeline(isChange)}
  //           // timelineFiltersDefault={[1,2,3,4,5,6,7,8,9]}
  //           hasLoginUser={hasLoginUser} />
  //       }
  //     </div>
  //   )
  // }, [customerIds, hasLoginUser]);

  const renderChooseOption = () => {
    return (
      checkChooseOption &&
      <div className="select-box select-box-card card" ref={toolTipRef}>
        <div className="wrap-check-radio unset-height">
          <p className="radio-item" onClick={() => setEmployeeOption(EMPLOYEE_OPTION.ALL)}>
            <input type="radio" id="radio111" name="name-radio3" value={EMPLOYEE_OPTION.ALL} checked={employeeOption === EMPLOYEE_OPTION.ALL} />
            <label htmlFor="radio111">{translate('businesscards.detail.label.button.optionAll')}</label>
          </p>
          <p className="radio-item" onClick={() => setEmployeeOption(EMPLOYEE_OPTION.MY)}>
            <input type="radio" id="radio112" name="name-radio3" value={EMPLOYEE_OPTION.MY} checked={employeeOption === EMPLOYEE_OPTION.MY} />
            <label htmlFor="radio112">{translate('businesscards.detail.label.button.optionCost')}</label>
          </p>
        </div>
        <div className="wrap-check-radio unset-height">
          <p className="radio-item" onClick={() => setCustomerOption(CUSTOMER_OPTION.ALL)}>
            <input type="radio" id="radio113" name="name-radio4" value={CUSTOMER_OPTION.ALL} checked={customerOption === CUSTOMER_OPTION.ALL} />
            <label htmlFor="radio113">{translate('businesscards.detail.label.button.optionCustomer')}</label>
          </p>
          <p className="radio-item" onClick={() => setCustomerOption(CUSTOMER_OPTION.ONE)}>
            <input type="radio" id="radio114" name="name-radio4" value={CUSTOMER_OPTION.ONE} checked={customerOption === CUSTOMER_OPTION.ONE} />
            <label htmlFor="radio114">{translate('businesscards.detail.label.button.optionOpen')}</label>
          </p>
        </div>
      </div>
    )
  }

  const onPrevBusinessCardHistory = () => {
    if (currentHistory > 0) {
      const presHis = currentHistory - 1;
      setDataDetailHistory(lstHistoryData[presHis]);
      setCurrentHistory(presHis);
      setDateHistory(lstDateHistory[presHis])
    }
  }

  const onNextBusinessCardHistory = () => {
    if (currentHistory < amountOfHistory - 1) {
      const nextHis = currentHistory + 1;
      setDataDetailHistory(lstHistoryData[nextHis]);
      setCurrentHistory(nextHis);
      setDateHistory(lstDateHistory[nextHis])
    }
  }


  const renderPopupTool = () => {
    return (
      screenMode === ScreenMode.EDIT ?
        <div className="popup-tool">
          {currentTab === TAB_ID_LIST.summary ?
            <div><a title="" className="button-primary button-review" onClick={() => { toggleOpenPopupEdit(BUSINESS_CARD_VIEW_MODES.PREVIEW, BUSINESS_CARD_ACTION_TYPES.CREATE, true) }}>{translate('businesscards.detail.label.button.exampleData')}</a></div>
            : <div />
          }
          <div>
            <a className="button-cancel" onClick={handleClosePopupModeEdit}>{translate('businesscards.detail.label.button.cancel')}</a>
            <a className={`button-blue ${_.isEqual(popupSettingMode, SettingModes.EditInput) ? 'disable' : ''}`} onClick={!_.isEqual(popupSettingMode, SettingModes.EditInput) ? updateCustomFieldInfo : null}>{translate('businesscards.detail.label.button.save')}</a>
          </div>
        </div> :
        <div className="popup-tool">
          <div>
            <span className="icon-tool">
              <img src="../../../content/images/icon-calendar.svg" alt="" onClick={onOpenPopupCreateTask} />
            </span>
            <span className="icon-tool">
              <img src="../../../content/images/common/ic-bag.svg" alt="" onClick={onOpenPopupCreateActivity} />
            </span>
            <span className="icon-tool">
              <img src="../../../content/images/icon-mail-white.svg" alt="" />
            </span>
          </div>
          <div className="message-area">
            {renderMessage()}
          </div>
          <div>
            {modeComponent === "normal" &&
              <>
                <a className="icon-small-primary icon-integration-small" onClick={onOpenMergeBusinessCard} />
                {props.servicesInfo.filter(e => e.servicePath === "/customer/list").length > 0 && <a className="icon-small-primary icon-person-arrow-next-small" onClick={onOpenPopupBusinessCardTransfer} />}
                <a className="icon-small-primary icon-edit-small" onClick={() => toggleOpenPopupEdit(BUSINESS_CARD_VIEW_MODES.EDITABLE, BUSINESS_CARD_ACTION_TYPES.UPDATE, false)} />
                <a className="icon-small-primary icon-erase-small" onClick={onClickDelete} />
              </>
            }
            <div className="button-pull-down-parent">
              <a className={checkChooseOption ? "button-pull-down-small active" : "button-pull-down-small"} onClick={onClickChooseOption}>{translate('businesscards.detail.label.button.displayArea')}</a>
              {renderChooseOption()}
            </div>
            {modeComponent === "normal" && isAdmin &&
              <a className="button-primary button-add-new" onClick={() => props.changeScreenMode(true)}>{translate('businesscards.detail.label.button.editMode')}</a>
            }
            {
              modeComponent !== "history" ?
                <a>
                  <a className={"icon-small-primary icon-prev" +
                    ((listBusinessCardId && currentBusinessCardId !== listBusinessCardId[0])
                      ? "" : " disable")}
                    style={((listBusinessCardId && currentBusinessCardId === listBusinessCardId[0]) ? { pointerEvents: 'none' } : {})}
                    onClick={onPrevBusinessCard} />
                  <a className={
                    "icon-small-primary icon-next" +
                    ((listBusinessCardId && currentBusinessCardId !== listBusinessCardId[listBusinessCardId.length - 1]) ? "" : " disable")

                  }
                    style={((listBusinessCardId && currentBusinessCardId === listBusinessCardId[listBusinessCardId.length - 1]) ? { pointerEvents: 'none' } : {})}
                    onClick={onNextBusinessCard} />
                </a>
                : <a>
                  <a className={"icon-small-primary icon-prev " +
                    ((modeComponent === "history" && currentHistory === 0) ? " disable" : "")}
                    style={(amountOfHistory < 2) ? { pointerEvents: 'none' } : {}}
                    onClick={amountOfHistory > 1 && onPrevBusinessCardHistory} />
                  <a className={
                    "icon-small-primary icon-next  " +
                    ((modeComponent === "history" && currentHistory === amountOfHistory - 1) ? " disable" : "")
                  }
                    style={((amountOfHistory < 2) ? { pointerEvents: 'none' } : {})}
                    onClick={(amountOfHistory > 1) && (currentHistory <= amountOfHistory - 1) && onNextBusinessCardHistory} />
                </a>
            }

          </div>
        </div>
    )
  }

  /**
   * Set default current tab after updated business card
   * @param defaultTab 
   */
  const handleUpdateBusinessSetCurrentTab = (defaultTab: number) => {
    setCurrentTab(defaultTab);
  }

  /* render modal edit */
  const renderPopupCreateEditBusinessCard = () => {
    return (
      openPopupEdit &&
      <CreateEditBusinessCard
        closePopup={onClosePopupEdit}
        iconFunction="ic-sidebar-business-card.svg"
        businessCardActionType={actionTypePopup}
        businessCardViewMode={businessCardViewMode}
        businessCardId={cardId}
        fieldPreview={summaryFields}
        isOpenedFromModal={true}
        toggleNewWindow={handleCloseModalBusinessCard}
        handleUpdateBusinessSetCurrentTab={handleUpdateBusinessSetCurrentTab}
      />
    )
  }

  const renderPopupEmployeeDetail = () => {
    return (
      openPopupEmployeeDetail &&
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        backdrop={false}
        openFromModal={true}
        employeeId={employeeId}
        listEmployeeId={[employeeId]}
        toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
        resetSuccessMessage={() => { }} />
    )
  }

  const renderPopupTaskDetail = () => {
    return (
      openPopupTaskDetail &&
      <PopupTaskDetail
        taskId={taskId}
        listTask={[taskId]}
        toggleCloseModalTaskDetail={onClosePopupTaskDetail}
      ></PopupTaskDetail>
    )
  }

  const renderPopupActivityDetail = () => {
    return (
      openPopupActivityDetail &&
      <PopupActivityDetail
        popoutParams={{ activityId }}
        activityId={activityId}
        listActivityId={[activityId]}
        canBack={true}
        onCloseActivityDetail={onClosePopupActivityDetail}
      ></PopupActivityDetail>
    )
  }

  const renderPopupMileStone = () => {
    return (
      openPopupMileStoneDetail &&
      <PopupMileStoneDetail
        milestoneId={mileStoneId}
        milesActionType={mileStoneId}
        toggleCloseModalMilesDetail={onClosePopupMileStoneDetail}
        openFromModal={true}
      ></PopupMileStoneDetail>
    )
  }

  const renderPopupCustomerDetail = () => {
    return (
      openPopupCustomerDetail &&
      <PopupCustomerDetail
        id={customerDetailCtrlId[0]}
        canBack={true}
        popout={props.popout}
        showModal={!props.popout}
        customerId={customerId}
        listCustomerId={[customerId]}
        toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
        resetSuccessMessage={() => { }}
      />
    )
  }

  const renderPopupTransferBusinessCard = () => {
    return (
      openPopupBusinessCardTransfer &&
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-transfer-business-card" autoFocus={true} zIndex="auto">
        <PopupBusinessCardTransfer
          popout={props.popout}
          closePopupTransfer={closePopupTransfer}
          cardDetail={cardDetail}
          businessCardCurrentDetail={props.businessCard}
        ></PopupBusinessCardTransfer>
      </Modal>
    )
  }

  const renderPopupMergeBusinessCard = () => {
    return (
      openMergeBusinessCard &&
      <MergeBusinessCard
        popout={props.popout}
        disableBack={false}
        isInitLoadDataWindow={true}
        businessCardDetailId={currentBusinessCardId}
        toggleClosePopup={onClosePopupMergeBusinessCard}
        showModal={showModal}
      />
    )
  }

  const renderPopupCreateTask = () => {
    return (
      openPopupCreateTask &&
      <ModalCreateEditTask
        toggleCloseModalTask={onCloseModalTask}
        customerId={props.businessCard && props.businessCard.businessCardDetail ? props.businessCard.businessCardDetail.customerId : null}
        businessCardId={currentBusinessCardId}
        iconFunction="ic-time1.svg"
        {...dataModalTask}
        canBack={true} />
    )
  }

  const renderPopupCreateActivity = () => {
    return (
      openPopupCreateActivity &&
      <ActivityModalForm popout={false}
        activityActionType={activityActionType === ACTIVITY_ACTION_TYPES.UPDATE ? ACTIVITY_ACTION_TYPES.UPDATE : ACTIVITY_ACTION_TYPES.CREATE}
        activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
        activityId={activityId}
        customerId={(props.businessCard && props.businessCard.businessCardDetail) ? props.businessCard.businessCardDetail.customerId : null}
        onSaveSussecc={onSaveActivitySuccess}
        onCloseModalActivity={onCloseModalActivity}
        canBack={true} />
    )
  }

  const calculateHeightTable = () => {
    if (tableListRef && tableListRef.current) {
      const height = window.innerHeight - tableListRef.current.getBoundingClientRect().top - 24;
      if (height !== heightTable) {
        setHeightTable(height);
      }
    }
  }

  /* _________________TAB LIST_________________*/
  const addTab = (tabId) => {
    tabList.map((tab) => {
      if (tab.tabId === tabId) {
        tab.isDisplay = true;
        tab.tabOrder = tabListShow[tabListShow.length - 1].tabOrder + 1;
        tabListShow.push(tab)
      }
    })
    const tabListTmp = tabList.filter(e => e.isDisplay === false)
    const tabsUpdate = _.cloneDeep(tabListShow);
    const lastTabOrderDisplay = tabListShow[tabListShow.length - 1].tabOrder;
    tabListTmp.sort((a, b) => a.tabOrder - b.tabOrder).forEach((item, idx) => {
      item.tabOrder = lastTabOrderDisplay + idx + 1;
      tabsUpdate.push(item);
    })
    setTabListShow(_.cloneDeep(tabListShow))
    onDelAddTab(tabListShow, tabList);
  }

  const renderActionTab = () => {
    if (tabListShow !== null && tabList !== null && tabListShow.length < tabList.length && screenMode === ScreenMode.EDIT) {
      return (
        <div className="add-tab-wrap active" ref={actionTabRef}>
          <div className="add-tab" onClick={() => setIsOpenMenuAddTab(!isOpenMenuAddTab)}></div>
          {isOpenMenuAddTab && tabListShow && tabListShow.length < tabList.length &&
            <div className="box-select-option z-index-9" >
              <ul>
                {tabList.map((tab, idx) => {
                  let tabHidden = true;
                  tabListShow.forEach((tabShow) => {
                    if (tab.tabId === tabShow.tabId) {
                      tabHidden = false;
                    }
                  })
                  if (tabHidden === true) {
                    return (
                      <>
                        <li><a key={idx} onClick={(tabId) => addTab(tab.tabId)} >{getFieldLabel(tab, 'tabLabel')}</a></li>
                      </>
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

  /* _________________Tab Summary_________________ */
  const onChangeSummaryFields = (fields, deleteFields, editedFields) => {
    setFieldCallback({ listField: _.cloneDeep(fields), deleteFields: null })
    setSummaryFields(_.cloneDeep(fields));
    setEditedSummaryFields(editedFields);
    setDeletedSummaryFields(_.cloneDeep(deleteFields));
  };

  const destroySaveField = () => {
    setIsSaveField(false);
  }

  /**
   * For history detail, set mode to history, change curent tab to summary tab, set date and time history. 
   * @param mode 
   * @param tab 
   * @param date 
   * @param time 
   */
  const setModeComponentForHistory = (mode, tab, date, index, total) => {
    setModeComponent(mode);
    setCurrentTab(tab);
    setLstDateHistory(date);
    setDateHistory(date[index]);
  }

  /**
   * Set history data for detail
   */
  const setDataForHistory = (dataHistory, index, amountHistory) => {
    setDataDetailHistory(dataHistory[index]);
    setCurrentHistory(index);
    setLstHistoryData(dataHistory);
    setAmountOfHistory(amountHistory);
  }

  const handleScroll = (e) => {
    const element = e.target;
    if (
      props.businessCardHistory && !_.isEmpty(props.businessCardHistory.businessCardHistories) &&
      props.businessCardHistory.totalRecord >= (currentPage + 1) * 30 &&
      element.scrollHeight - element.scrollTop === element.clientHeight
    ) {
      const offset = currentPage + 1;
      props.handleInitBusinessCardChangeHistory(props.businessCard.businessCardDetail.businessCardId, offset * 30, 30, null);
      setCurrentPage(offset);
    }
  }

  const setCompanyHistory = (companyName, customerName, custommerId, alternativeCustomerName, index) => {
    setCompanyNameHistory(companyName);
    setCustomerNameHistory(customerName);
    setCustomerIdHistory(custommerId);
    setAlternativeCustomerNameHistory(alternativeCustomerName);
    setCurrentHistory(index);
  }


  /**
   * When click to business item in timeline area, it return id to set detail.
   * @param id 
   */
  const setBussinessCardIdForDetail = (id) => {
    setCurrentBusinessCardId(id);
    const tmpLstBCId = _.cloneDeep(lstBCId);
    tmpLstBCId.push({ idBC: id, index: (lstBCId[lstBCId.length - 1].index + 1) });
    setLstBCId(_.cloneDeep(tmpLstBCId));
    setIsCanBack(true);
  }

  const renderTabContents = () => {
    calculateHeightTable();
    return (
      <>
        {
          props.businessCard && props.businessCard.tabInfos && currentTab === TAB_ID_LIST.summary &&
          <TabSummary
            ref={tabSummaryRef}
            businessCard={dataDetailHistory ? dataDetailHistory : businessCardDetail}
            screenMode={screenMode}
            handleReorderField={props.handleReorderField}
            onChangeFields={onChangeSummaryFields}
            editedFields={editedSummaryFields}
            summaryFields={summaryFields}
            openDynamicSelectFields={openDynamicSelectFields}
            tabList={tabList}
            isSaveField={isSaveField}
            destroySaveField={destroySaveField}
            fieldEdit={fieldEdit}
            paramsEdit={paramsEdit}
            onSaveField={onSaveField}
            onShowMessage={onShowMessage}
            businessCardId={props.businessCardId}
            countSave={countSave}
            businessCardAllFields={props.businessCard ? props.businessCard.fieldInfo : []}
            deletedFields={deletedSummaryFields}
            edittingField={currentFieldEdit}
            onSelectDislaySummary={onSelectDislaySummary}
            fieldsUnavailable={businessCardFieldUnvailable}
            // for tab activity
            activities={props.businessCard && props.businessCard.activityHistories ? props.businessCard.activityHistories : []}
            currentTab={currentTab}
            onOpenModalEmployeeDetail={onOpenModalEmployeeDetail}
            onOpenModalCustomerDetail={onOpenModalCustomerDetail}
            onOpenPopupTaskDetail={onOpenPopupTaskDetail}
            onOpenPopupBusinessCardTransfer={onOpenPopupBusinessCardTransfer}
            onOpenPopupActivityDetail={onOpenPopupActivityDetail}
            onOpenPopupMileStoneDetail={onOpenPopupMileStoneDetail}
            onOpenPopupCreateActivity={onOpenPopupCreateActivity}
            handleInitDataBusinessCard={handleInitData}
            // for tab calendar
            customerIds={customerIds}
            hasLoginUser={hasLoginUser}
          />
        }
        {
          currentTab === TAB_ID_LIST.activity ?
            <TabActivityHistory
              businessCardId={currentBusinessCardId}
              currentTab={currentTab}
              onOpenModalEmployeeDetail={onOpenModalEmployeeDetail}
              onOpenModalCustomerDetail={onOpenModalCustomerDetail}
              onOpenPopupTaskDetail={onOpenPopupTaskDetail}
              onOpenPopupBusinessCardTransfer={onOpenPopupBusinessCardTransfer}
              onOpenPopupActivityDetail={onOpenPopupActivityDetail}
              onOpenPopupMileStoneDetail={onOpenPopupMileStoneDetail}
              onOpenPopupCreateActivity={onOpenPopupCreateActivity}
              customerId={props.businessCard ? props.businessCard.businessCardDetail.customerId : null}
              customerIds={customerIds}
              hasLoginUser={hasLoginUser}
            >
            </TabActivityHistory> : null
        }
        {
          currentTab === TAB_ID_LIST.calendar ?
            <TabCalendar
              businessCardId={props.businessCardId}
              customerIds={customerIds}
              calendarView={calendarView}
              updateCalendarView={setCalendarView}
            /> : null
        }
        {
          currentTab === TAB_ID_LIST.mail ?
            <TabMail></TabMail> : null
        }
        {
          props.businessCardHistory?.businessCardHistories && currentTab === TAB_ID_LIST.history ?
            <TabChangeHistory
              businessCardCurrentDetail={props.businessCard}
              setDataDetailHistory={setDataForHistory}
              setModeComponent={setModeComponentForHistory}
              setCompanyNameHistory={setCompanyHistory}
            />
            : null
        }
        {renderPopupCreateEditBusinessCard()}
        {renderPopupEmployeeDetail()}
        {renderPopupCustomerDetail()}
        {renderPopupMergeBusinessCard()}
        {renderPopupTaskDetail()}
        {renderPopupActivityDetail()}
        {renderPopupMileStone()}
        {renderPopupCreateTask()}
        {renderPopupCreateActivity()}
        {renderSlideShowImage()}
        <RelationDisplayTab
          id="businessCardRelationId"
          recordData={props.businessCard ? props.businessCard.businessCardDetail : null}
          fieldNameExtension="businessCardData"
          isHeader={false}
          listFieldInfo={fieldRelationTab}
          currentTabId={currentTab}
        />
      </>
    );
  };

  const renderComponent = () => {

    return (
      <div className={`modal popup-esr popup-esr4 popup-card user-popup-page popup-align-right popup-modal-common ${currentTab === TAB_ID_LIST.history ? "card-overwrite" : ""} show`} id="popup-esr" aria-hidden="true">
        <div className={showModal ? "modal-dialog form-popup" : "form-popup"} >
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  {screenMode === ScreenMode.EDIT || props.openFromModal || isCanBack ? (
                    <a className="icon-small-primary icon-return-small" onClick={onClickBack} />
                  ) : (
                      <a className="icon-small-primary icon-return-small disable" />
                    )}
                  <span className="text word-break-all">
                    <img className="icon-popup-big" src="../../../content/images/ic-popup-title-card.svg" alt="" />
                    {renderBusinessCardName(false)}
                  </span>
                </div>
              </div>
              <div className="right d-flex">
                <a className="icon-small-primary icon-share" onClick={() => copyUrlBusinessCard(window.location.href)} />
                {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />}
                {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={handleClosePopup} />}
              </div>
            </div>
            <div className="modal-body style-3">
              <div className="popup-content style-3 popup-task-no-padding none-scroll">
                {renderPopupTool()}
                <div className={`popup-content-task-wrap ${isScreenEdit ? '' : showTimeline ? '' : 'popup-content-close'}`}>
                  <div className={currentTab === TAB_ID_LIST.history ? "popup-content-task-left" : "popup-content-task-left overflow-hov scrollarea"}
                    onScroll={e => { (currentTab === TAB_ID_LIST.history) && handleScroll(e) }}
                    ref={tableListRef}
                    style={screenMode === ScreenMode.DISPLAY ? (
                      showTimeline ? { width: "62%", height: heightTable } : { width: "100%", height: heightTable }) : { height: heightTable }}
                  >
                    {modeComponent === "history" &&
                      <div className="notification">
                        <div className="block-feedback block-feedback-blue-button">
                          {`${translate('businesscards.detailHistory.titleOne')} ${dateHistory} ${translate('businesscards.detailHistory.titleTwo')}`}
                          <a title="" className="button-primary button-activity-registration" onClick={e => { setModeComponent("normal"); setCurrentHistory(-1) }}>
                            {translate('businesscards.detailHistory.buttonBackToNow')}
                          </a>
                        </div>
                      </div>
                    }
                    <div className="flag-wrap flag-wrap-v2">
                      <div className="block-card">
                        <div className="img">
                          {renderImage()}
                          {/* <img src="../../../content/images/img-card1.svg" alt="" /> */}
                        </div>
                        <div className="content">
                          <div className="text-right">
                            {renderCustomer()}
                            {
                              hasFollow === 1 ?
                                <a className="button-primary button-activity-registration m-0 text-nowrap ml-3" onClick={deleteFollowed}>{translate('businesscards.detail.label.button.deleteFolloweds')}</a> :
                                <a className="button-primary button-activity-registration m-0 text-nowrap ml-3" onClick={createFollowed}>{translate('businesscards.detail.label.button.createFollowed')}</a>
                            }
                          </div>
                          {renderDepartmentPosition()}
                          {renderBusinessCardName(true)}
                          <ul>
                            <li>{translate('businesscards.detail.label.lastContactDate')}：{renderLastContactDate()}</li>
                            <li className="dropdown d-flex justify-content-between">
                              <div className="transform-y-4">{translate('businesscards.detail.label.lastContact')}：</div>
                              {getLastContact()}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className={`popup-content-common-content ${props.screenMode === ScreenMode.EDIT ? "pl-4" : ""}`}>
                      <div className="tab-detault">
                        <Sticky scrollElement=".scrollarea" stickyStyle={{ zIndex: '2' }}>
                          <ul className="nav nav-tabs background-color-88" >
                            {tabList && tabListShow && (
                              <TabList
                                onChangeTab={changeTab}
                                tabList={tabList.filter(x => x.tabId !== TAB_ID_LIST.trading)}
                                tabListShow={tabListShow.filter(x => x.tabId !== TAB_ID_LIST.trading)}
                                onDragDropTabList={onDragDropTabList}
                                badges={props.businessCard?.calendar?.badges}
                                deleteAddTab={onDelAddTab}
                                currentTab={currentTab}
                                screenMode={screenMode}
                              />
                            )}
                            <RelationDisplayTab
                              id="businessCardRelationId"
                              isHeader={true}
                              listFieldInfo={fieldRelationTab}
                              currentTabId={currentTab}
                              onChangeTab={changeTab}
                            />
                            {renderActionTab()}
                          </ul>
                        </Sticky>
                        <div className="tab-content">{renderTabContents()}</div>
                      </div>
                    </div>
                  </div>
                  {currentTab === TAB_ID_LIST.summary && screenMode === ScreenMode.EDIT && renderDynamicSelectFields()}
                  <BusinessCardTimeline
                    objectId={[currentBusinessCardId]}
                    serviceType={TIMELINE_SERVICE_TYPES.BUSSINESS_CARD}
                    onShowTimeline={() => setShowTimeline(!showTimeline)}
                    isScreenDisplay={isScreenDisplay}
                    hasLoginUser={hasLoginUser}
                    targetDeliversForSearch={timelineConditions}
                    isDataChange={(isChange) => setIsChangeTimeline(isChange)}
                    setBussinessCardIdForDetail={setBussinessCardIdForDetail}
                  />
                </div>
                {renderToastMessage()}
              </div>
            </div>
          </div>
        </div>
        {renderDeleteLastBusinessCard()};
        {renderDeleteBusinessCard()}
      </div>
    );
  }

  /* _________________Render_________________ */
  if (showModal) {
    return (
      <>
        {!openPopupBusinessCardTransfer ?
          <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={(props.backdrop || props.backdrop === undefined)} id="business-card-detail" autoFocus={true} zIndex="auto">
            {renderComponent()}
          </Modal>
          :
          renderPopupTransferBusinessCard()
        }
      </>
    );
  }
  else {
    if (props.popout) {
      document.body.className = 'body-full-width wrap-card modal-open';
      // return (
      //   <>
      //     {renderComponent()}
      //     {(document.body.className = document.body.className.replace('modal-open', ''))}
      //   </>
      // );
      return (
        <>
          {!openPopupBusinessCardTransfer ?
            <>
              {renderComponent()}
              {(document.body.className = document.body.className.replace('modal-open', ''))}
            </>
            :
            renderPopupTransferBusinessCard()
          }
        </>
      )
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ authentication, businessCardDetail, applicationProfile, businessCardTranfer,
  screenMoveState, businessCardList, menuLeft, createEditBusinessCard }: IRootState) => ({
    tenant: applicationProfile.tenant,
    authorities: authentication.account.authorities,
    listLicense: authentication.account.licenses,
    businessCard: businessCardDetail.businessCard,
    businessCardHistory: businessCardDetail.businessCardHistory,
    businessCardFieldsUnVailable: businessCardDetail.businessCardFieldsUnVailable,
    businessCardFieldsAvailable: businessCardDetail.businessCardFieldsAvailable,
    deleteBusinessCards: businessCardDetail.deleteBusinessCards,
    tabListShow: businessCardDetail.tabListShow,
    screenMode: businessCardDetail.screenMode,
    errorMessage: businessCardTranfer.errorMessage,
    screenMoveInfo: screenMoveState.screenMoveInfo,
    action: businessCardDetail.action,
    actionDelete: businessCardDetail.actionDelete,
    messageUpdateCustomFieldInfoSuccess: businessCardDetail.messageUpdateCustomFieldInfoSuccess,
    messageUpdateCustomFieldInfoError: businessCardDetail.messageUpdateCustomFieldInfoError,
    msgSuccess: businessCardList.msgSuccess,
    errorItems: businessCardDetail.errorItems,
    timelineFollowed: businessCardDetail.timelineFollowed,
    followeds: businessCardDetail.followeds,
    customers: businessCardDetail.customers,
    servicesInfo: menuLeft.servicesInfo,
    dataDetailMergedBusinessCard: businessCardDetail.businessCardHistoryById,
    businessCardIdResponse: createEditBusinessCard.businessCardIdResponse,
  });

const mapDispatchToProps = {
  handleInitBusinessCard,
  handleInitBusinessCardChangeHistory,
  handleDeleteBusinessCards,
  handleInitProductTrading,
  changeScreenMode,
  resetState,
  moveScreenReset,
  handleReorderField,
  handleUpdateCustomFieldInfo,
  handleCreateFollowed,
  handleDeleteFolloweds,
  handleInitListCustomer,
  handleInitActivities,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessCardDetail);
