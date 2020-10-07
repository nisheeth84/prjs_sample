import React, { createRef, useEffect, useMemo, useState, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { useId } from "react-id-generator";
import { Modal } from 'reactstrap';
import FieldEditDate from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-date';
import moment from 'moment';
import _ from 'lodash';
import {
  handleClearResponseData,
  handleGetProductTradings,
  handleUpdateActivityInfo,
  onclickShowModalActivityForm,
  saveData,
  toggleConfirmPopup,
  saveActivivityDraft,
  getCustomer,
  handleGetDataActivity,
  getCustomersByIds,
  getMilestonesByIds,
  getSchedulesByIds,
  getTasksByIds,
  resetDraftData,
  saveActivivityDraftManual,
  onclickDelete,
  discardDraft
} from '../list/activity-list-reducer'
import {
  updateScheduleDataDraf,
  resetDataForm,
  resetEquipmentSuggest
} from 'app/modules/calendar/popups/create-edit-schedule.reducer'
import { Storage, translate } from 'react-jhipster';
import { CommonUtil, getErrorMessage, isInvalidDate } from '../common/common-util';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { ConfirmPopupItem } from '../models/confirm-popup-item';
import {
  FSActionTypeScreen,
  SPECIAL_FIELD_NAMES as specialFName,
  TIMEOUT_TOAST_MESSAGE,
  INTERVAL_TIME_MILI,
  ACTIVITY_VIEW_MODES,
  ACTIVITY_ACTION_TYPES,
  MODE_CONFIRM,
  timeFormat
} from '../constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import { ControlType, FIELD_BELONG, MODIFY_FLAG, AVAILABLE_FLAG, MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import FieldActivityDuration from './field-activity-duration';
import TagSuggestion, { TagSuggestionMode, TagSuggestionType } from '../common/tag-suggestion/tag-suggestion';
import ScenarioArea from './scenario-area';
import { formatDate, tzToUtc, utcToTz } from 'app/shared/util/date-utils';
import CreateEdit from 'app/modules/calendar/popups/create-edit-component';
import { isJsonString } from 'app/modules/sales/utils';
import CreateEditCustomerModal from 'app/modules/customers/create-edit-customer/create-edit-customer-modal';
import { CUSTOMER_ACTION_TYPES, CUSTOMER_VIEW_MODES } from 'app/modules/customers/constants';
import { FieldInfoActivityType } from '../models/get-activity-type';
import ConfirmPopup from 'app/modules/activity/control/confirm-popup';
import { isExceededCapacity } from 'app/shared/util/file-utils';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { useDetectFormChange } from 'app/shared/util/useDetectFormChange';
import { CalenderViewMonthCommon } from 'app/modules/calendar/grid/common';

type IActivityModalFormProp = StateProps & DispatchProps & {
  toggleCloseModalActivity?: (successInfo?) => void,
  // activityInfo?: GetActivity,
  popout?: boolean,
  activityActionType?: any,
  activityViewMode?: any,
  activityId?: number, // activityId
  onCloseModalActivity?: (idss?) => void, // function to close popup from another module
  onSaveSussecc?: (isDraft: boolean, id?: number) => void,
  activitiesData?: any, // actititesData to init default value from another module
  listFieldPreview?: any,
  canBack?: boolean, // if true, enable button back
  activityFormatPreview?: any,
  openFromTask?: boolean
  customerId?: number, // customerId from another module
  milestoneId?: number, // milestoneId from another module
  scheduleId?: number, // scheduleId from another module
  taskId?: number, // taskId from another module
  businessCardId?: number, // taskId from another module
  callFromEmployee?: boolean,
  activityDraftIdInput?: number,
  isOpenFromAnotherModule?: boolean //  = true if open modal from another module
}

let timerRef = null;
/**
 * component for show form create/edit activity
 * @param props
 */
const ActivityModalForm = (props: IActivityModalFormProp) => {
  let storageData = {
    products: [],
    msgError: "",
    msgSuccess: "",
    errorValidates: [],
    durationCheckbox: false,
    saveActivityData: {},
    customer: null,
    showEditCustomer: false,
    showScheduleArea: false,
    fieldInfoActivity: [],
    activityFormatId: null,
    activityActionType: ACTIVITY_ACTION_TYPES.CREATE,
    activityViewMode: ACTIVITY_VIEW_MODES.EDITABLE,
    activityId: null,
    activityFormatList: []
  }
  if (props.popout) {
    const saveObj = _.cloneDeep(Storage.local.get(ActivityModalForm.name));
    props.activityInfo.activities = saveObj?.activityInfo?.activities;
    props.activityInfo.fieldInfoProductTrading = saveObj?.activityInfo?.fieldInfoProductTrading;
    storageData = saveObj?.storageData;
  }
  const formClass = "form-activity-edit"
  const [isChanged] = useDetectFormChange(formClass)

  const [products, setProducts] = useState(storageData.products);
  // const [showProduct, setShowProduct] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [msgError, setMsgError] = useState(storageData.msgError);
  const [msgSuccess, setMsgSuccess] = useState(storageData.msgSuccess);
  const [errorValidates, setErrorValidates] = useState(storageData.errorValidates);


  const [scheduleData, setScheduleData] = useState(null);
  const [filesSchedule, setFilesSchedule] = useState([])
  // const [showScheduleArea, setShowScheduleArea] = useState(true);
  const [showScheduleArea, setShowScheduleArea] = useState(storageData.showScheduleArea);

  const [fieldInfoActivity, setFieldInfoActivity] = useState(props.activityInfo?.fieldInfoActivity?.length > 0 ? props.activityInfo?.fieldInfoActivity : storageData.fieldInfoActivity);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const inputRefs = useMemo(() => Array.from({ length: fieldInfoActivity.length }).map(() => createRef<any>()), [fieldInfoActivity]);
  const [saveActivityData, setSaveActivityData] = useState(_.cloneDeep(props.activityInfo?.activities || {}));
  const [toastMessage, setToastMessage] = useState(null);
  const [showEditCustomer, setShowEditCustomer] = useState(storageData.showEditCustomer);
  const [customer, setCustomer] = useState(storageData.customer);
  const [activityFormatId, setActivityFormatId] = useState(storageData.activityFormatId);
  const [fileUploads, setFileUploads] = useState({});
  const [producTradingDelete, setProducTradingDelete] = useState([]);
  // const [productTradingReportTarget, setProductTradingReportTarget] = useState([]);
  // const [productTradingCustomer, setProductTradingCustomer] = useState(null);
  const [openModalCustomer, setOpenModalCustomer] = useState(false);
  const [shouldDisable, setShouldDisable] = useState(false);
  const [activityActionType, setActivityActionType] = useState(props.activityActionType || storageData.activityActionType);
  const [activityViewMode, setActivityViewMode] = useState(props.activityViewMode || storageData.activityViewMode);
  const [activityId, setActivityId] = useState(props.activityId);
  let isShowReportTarget = false;
  let isShowActivityDuration = false;
  let isShowInterview = false;
  // const timerRef = useRef(null);
  // const timerRenderRef = useRef(null);
  const customerRef = useRef(null);
  const reportTargetRef = useRef(null);
  const nextScheduleRef = useRef(null);
  const createEditScheduleRef = useRef(null);
  const productTradingSuggestion = useRef(null);
  const [arrIgnoreUpdate, setArrIgnoreUpdate] = useState([]);
  const [showInitSchedule, setShowInitSchedule] = useState(false);
  const [customerIds, setCustomerIds] = useState(null);
  const [updatedDate, setUpdatedDate] = useState(props.updatedDate)
  const [activityFormatList, setActivityFormatList] = useState(_.cloneDeep(props.activityFormatPreview) || storageData.activityFormatList)
  const [confirmPopupItem, setConfirmPopupItem] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [listFieldTab, setListFieldTab] = useState([]);
  const [listFieldNormal, setListFieldNormal] = useState([])
  const [draftData, setDraftDta] = useState({})
  const [isSubmit, setIsSubmit] = useState(false);
  const [showToastDraft, setShowToastDraft] = useState(false);
  const employeeEditCtrlId = useId(1, "detailActivityEditCtrlId_");
  let filesActivity = {};

  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(ActivityModalForm.name, {
        activityInfo: {
          activities: {
            ...props.activityInfo.activities,
            ...saveActivityData
          },
          fieldInfoProductTrading: props.activityInfo?.fieldInfoProductTrading
        },
        storageData: {
          products,
          msgError,
          msgSuccess,
          errorValidates,
          saveActivityData,
          customer,
          showEditCustomer,
          showScheduleArea,
          fieldInfoActivity,
          activityFormatId,
          activityActionType,
          activityViewMode,
          activityId,
          activityFormatList
        }
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      // const saveObj = Storage.local.get(ActivityModalForm.name);
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(ActivityModalForm.name);
    }
  }


  useEffect(() => {
    document.body.className = "wrap-activity modal-open";
    if (props.popout) {
      // updateStateSession(FSActionTypeScreen.GetSession);
      setShowModal(false);
      setForceCloseWindow(false);
    } else {
      if (props.activityViewMode !== ACTIVITY_VIEW_MODES.PREVIEW) {
        setShowModal(true);
        const data = {
          activityId,
          isOnlyData: null,
          mode: 'edit',
          hasTimeline: false
        };
        props.handleGetDataActivity(data, activityActionType, props.activityDraftIdInput)
      }
    }
    setErrorValidates(storageData.errorValidates);

    // check did mount component
    // let count = 9;
    // timerRenderRef.current = setInterval(() => {
    //   if ((!_.isNil(fieldInfoActivity) && fieldInfoActivity.length > 0) || count < 0) {
    //     // clearInterval(timerRenderRef.current);
    //     setDidMount(true)
    //   }
    //   count--;
    // }, 500);
    // setTimeout(() => { setDidMount(true) }, 1500);
    return () => {
      props.resetDraftData();
      if(!props.isOpenFromAnotherModule){
        document.body.className = 'wrap-activity';
      }
      props.updateScheduleDataDraf({});
    }
  }, []);
  // user for prop.customerId @@@@@@@
  /**
   * getProductTradings
   * @param fieldType  
   * @param isDefault 
   * @param fieldName 
   * @param productTradingIds 
   * @param isFinish 
   */
  const getProductTradings = (fieldType: number, isDefault: boolean, fieldName: string, productTradingIds: any[], isFinish?: boolean) => {
    if (!isChanged) {
      return;
    }
    const optParam = {
      fieldType,
      isDefault,
      fieldName,
      fieldValue: JSON.stringify(productTradingIds || [])
    };
    const searchConditions = [optParam];
    props.handleGetProductTradings(searchConditions, [], isFinish);
  }
  /**
   * on change customer
   * @param listTag
   */
  const initDefaultData = () => {
    if (props.customerId) {
      props.getCustomersByIds([props.customerId])
    }
    if (props.milestoneId) {
      props.getMilestonesByIds([props.milestoneId])
    } else if (props.scheduleId) {
      props.getSchedulesByIds([props.scheduleId])
    } else if (props.taskId) {
      props.getTasksByIds([props.taskId])
    }
  }


  useEffect(() => {
    if (props.customersByIds?.length > 0) {
      const _tags = [];
      props.customersByIds?.forEach(e => {
        let _address = '';
        if (isJsonString(e.customerAddress)) {
          const objAddress = JSON.parse(e.customerAddress);
          _address = objAddress?.address;
        } else {
          _address = e.customerAddress?.address;
        }
        _tags.push({
          customerId: e.customerId,
          customerName: e.customerName,
          customerAddress: e.customerAddress,
          address: _address,
          idHistoryChoice: null,
          parentCustomerName: e.customerParent?.customerName,
          updatedDate: null,
        });
      })

      if (customerRef?.current?.setTags) {
        customerRef.current.setTags(_tags);
        saveActivityData['customerId'] = _tags;
        setShowEditCustomer(true);
        const isReportTarget = !_.isNil(props.scheduleId) || !_.isNil(props.milestoneId) || !_.isNil(props.taskId);
        if (!isReportTarget) {
          // setProductTradingCustomer(props.customerId);
          props.handleGetProductTradings([], [props.customerId], false);
          setCustomerIds(CommonUtil.GET_ARRAY_VALUE_PROPERTIES(_tags, 'customerId'));
        }
        // getProductTradings(5, true, 'customer_id', [props.customerId], true);
      }
    }
  }, [props.customersByIds])

  const getProductTradingNames = (productTradings) => {
    if (productTradings && productTradings.length > 0) {
      productTradings.forEach(e => {
        e['productName'] = e['productName'] || e['productTradingName'];
      });
      
      return _.join(CommonUtil.GET_ARRAY_VALUE_PROPERTIES(productTradings, 'productName'), ',');
    }
    return '';
  }

  const getEmployeeNames = (operators) => {
    if (operators && operators.length > 0) {
      const names = []
      operators.forEach(e => {
        names.push(e.employeeSurname || '' + " " + e.employeeName)
      })
      return _.join(names, ',');
    }
    return '';
  }


  useEffect(() => {
    if (props.schedulesByIds && props.schedulesByIds.length > 0) {
      const _tags = [];
      let productTradingIds = [];
      const _tagsCustomer = [];
      props.schedulesByIds?.forEach(e => {
        _tags.push({
          scheduleName: e.scheduleName,
          finishDate: e.finishDate,
          parentCustomerName: e.customers?.parentCustomerName,
          customerName: e.customers?.customerName,
          productTradingName: getProductTradingNames(e.productTradings),
          scheduleId: e.scheduleId
        });
        if (!_.isNil(e['productTradings'])) {
          productTradingIds = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(e['productTradings'], 'productTradingId');
        }
        if (_.isNil(props.customerId) && !_.isNil(e['customers'])) {
          if(e?.customers?.customerId)
            setShowEditCustomer(true);
          _tagsCustomer.push({
            customerId: e.customers?.customerId,
            customerName: e.customers?.customerName,
            address: e.customers?.customerAddress,
            parentCustomerName: e.customers?.parentCustomerName
          });
        }
      })
      if (_.isNil(props.customerId) && customerRef?.current?.setTags) {
        customerRef.current.setTags(_tagsCustomer);
        saveActivityData['customerId'] = _tagsCustomer;
      }
      if (reportTargetRef?.current?.setTags) {
        reportTargetRef.current.setTags(_tags);
      }
      if(productTradingIds && productTradingIds.length > 0) {
        const optParam = {
          fieldType: 3,
          isDefault: true,
          fieldName: 'product_trading_id',
          fieldValue: JSON.stringify(productTradingIds)
        };
        const searchConditions = [optParam];
        props.handleGetProductTradings(searchConditions, [], null);
      }
    }
  }, [props.schedulesByIds])


  useEffect(() => {
    if (props.tasksByIds && props.tasksByIds.length > 0) {
      const _tags = [];
      let productTradingIds = [];
      const _tagsCustomer = [];
      props.tasksByIds?.forEach(e => {
        const lstProductTrading = e.productTradings;
        lstProductTrading && lstProductTrading.forEach(item => {
          item['productTradingName'] = item['productName'];
        });
        _tags.push({
          taskId: e.taskId,
          milestone: {
            milestoneName: e.milestoneName
          },
          customer: e?.customers?.length > 0 ? e?.customers[0] : {},
          productTradingName: getProductTradingNames(e.productTradings),
          status: e.statusTaskId,
          taskName: e.taskName,
          finishDate: e.finishDate,
          employeeName: getEmployeeNames(e.operators),
          operators: e.operators,
          productTradings: lstProductTrading
        });
        if (!_.isNil(e['productTradings'])) {
          productTradingIds = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(e['productTradings'], 'productTradingId');
        }
        if (_.isNil(props.customerId) && !_.isNil(e['customers']) && e.customers.length > 0) {
          setShowEditCustomer(true);
          e.customers.forEach(cus => {
            let _address = '';
            if (isJsonString(cus.customerAddress)) {
              const objAddress = JSON.parse(cus.customerAddress);
              _address = objAddress?.address;
            } else {
              _address = cus.customerAddress?.address;
            }
            _tagsCustomer.push({
              customerId: cus.customerId,
              customerName: cus.customerName,
              address: _address,
              customerAddress: _address,
              parentCustomerName: cus.customerParent?.customerName
            });
          });
        }
      })
      if (_.isNil(props.customerId) && customerRef?.current?.setTags) {
        customerRef.current.setTags(_tagsCustomer);
        saveActivityData['customerId'] = _tagsCustomer;
      }
      if (reportTargetRef?.current?.setTags) {
        reportTargetRef.current.setTags(_tags);
      }
      if(productTradingIds && productTradingIds.length > 0) {
        const optParam = {
          fieldType: 3,
          isDefault: true,
          fieldName: 'product_trading_id',
          fieldValue: JSON.stringify(productTradingIds)
        };
        const searchConditions = [optParam];
        props.handleGetProductTradings(searchConditions, [], null);
      }
    }
  }, [props.tasksByIds])


  useEffect(() => {
    if (props.milestonesByIds && props.milestonesByIds.length > 0) {
      const _tags = [];
      const _tagsCustomer = [];
      props.milestonesByIds?.forEach(e => {
        _tags.push({
          parentCustomerName: e.customer?.parentCustomerName,
          customerName: e.customer?.customerName,
          milestoneName: e.milestoneName,
          endDate: e.endDate,
          milestoneId: e.milestoneId
        });
        if (_.isNil(props.customerId) && !_.isNil(e['customer'])) {
          if (e?.customer?.customerId)
            setShowEditCustomer(true);
          _tagsCustomer.push(e['customer']);
        }
      })
      if (_.isNil(props.customerId) && customerRef?.current?.setTags) {
        customerRef.current.setTags(_tagsCustomer);
        saveActivityData['customerId'] = _tagsCustomer;
      }
      if (reportTargetRef?.current?.setTags) {
        reportTargetRef.current.setTags(_tags);
      }
    }
  }, [props.milestonesByIds])


  useEffect(() => {
    setActivityActionType(props.activityActionType);
  }, [props.activityActionType])

  useEffect(() => {
    setActivityId(props.activityId);
  }, [props.activityId]);

  useEffect(() => {
    if (props.deleteActivityDraftId && props.deleteActivityDraftId > 0 && props.onCloseModalActivity) {
      props.onCloseModalActivity();
    }
  }, [props.deleteActivityDraftId]);

  useEffect(() => {
    if (props.activityViewMode) {
      setShouldDisable(props.activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW)
    } else {
      setShouldDisable(false);
    }
  }, [props.activityViewMode])

  const isFieldRelationAsSelf = (field) => {
    if (_.toString(field.fieldType) !== DEFINE_FIELD_TYPE.RELATION) {
      return false
    }
    if (field.relationData && field.relationData.asSelf === 1) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (_.isNil(fieldInfoActivity)) {
      return;
    }
    const fieldTabs = fieldInfoActivity.filter(e => e.fieldType.toString() === DEFINE_FIELD_TYPE.TAB)
    const fieldNormals = fieldInfoActivity.filter(e => e.fieldType.toString() !== DEFINE_FIELD_TYPE.TAB && !isFieldRelationAsSelf(e))

    fieldTabs.forEach((field) => {
      if (!_.isNil(field.tabData) && field.tabData.length > 0) {
        field.tabData.forEach(e => {
          const idx = fieldNormals.findIndex(o => o.fieldId === e)
          if (idx >= 0) {
            fieldNormals.splice(idx, 1)
          }
        })
      }
    })
    setListFieldTab(fieldTabs);
    setListFieldNormal(fieldNormals)
  }, [fieldInfoActivity])


  useEffect(() => {
    if (activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW && !_.isNil(props.listFieldPreview)) {
      setFieldInfoActivity(props.listFieldPreview);
    } else {
      if (props.activityInfo?.fieldInfoActivity?.length > 0) {
        setFieldInfoActivity(props.activityInfo?.fieldInfoActivity);
        setTimeout(() => {
          initDefaultData();
        }, 500);
      }
    }
  }, [props.activityInfo?.fieldInfoActivity])

  // useEffect(() => {
  //   if (props.activityInfo?.activities?.activityFormats) {
  //     // setActivityFormatList(_.cloneDeep(props.activityInfo?.activities?.activityFormats));
  //   }
  // }, [props.activityInfo?.activities?.activityFormats])

  useEffect(() => {
    if (props.activityActionType === ACTIVITY_ACTION_TYPES.UPDATE) {
      setSaveActivityData(_.cloneDeep(props.activityInfo?.activities || {}));
      setProducts(_.cloneDeep(props.activityInfo?.activities?.productTradings || []));
    }
    const res = activityActionType === ACTIVITY_ACTION_TYPES.UPDATE && !_.isNil(props.activityInfo?.activities?.activityDraftId);
    setShowToastDraft(res);
    setTimeout(() => {
      setShowToastDraft(false);
    }, TIMEOUT_TOAST_MESSAGE);
    return () => { }
  }, [props.activityInfo?.activities]);

  const parseScheduleData = (schedule) => {
    const arrIds = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(schedule?.relatedCustomers, 'customerId')
    schedule['relatedCustomersIds'] = _.join(arrIds, ',');
    return schedule;
  }
  
  useEffect(() => {
    if (props.activityActionType === ACTIVITY_ACTION_TYPES.UPDATE) {
      const nextSchedules = props.activityInfo?.activities?.nextSchedules;
      if (nextSchedules && Object.keys(nextSchedules).find(x=>nextSchedules[x] && x !== 'activityDraftId')) {
        const schedule = _.cloneDeep(props.activityInfo?.activities?.nextSchedules);
        props.updateScheduleDataDraf(parseScheduleData(schedule));
        const startDate = _.cloneDeep(schedule.startDate);
        setTimeout(() => {
          if (startDate && nextScheduleRef?.current?.setValueEdit) {
            nextScheduleRef.current.setValueEdit(startDate);
          }
        }, 500);
        setShowInitSchedule(true);
      }
    }
  }, [props.activityInfo?.activities?.nextSchedules]);

  useEffect(() => {
    if (props.activityActionType === ACTIVITY_ACTION_TYPES.CREATE && props.activitiesData) {
      setSaveActivityData(props.activitiesData || {})
    }
  }, [props.activitiesData]);


  useEffect(() => {
    if (props.idss && props.idss > 0) {
      if (props.onSaveSussecc) {
        props.onSaveSussecc(false, props.idss);
      }
      if (props.onCloseModalActivity) {
        props.onCloseModalActivity(props.idss);
      }
      props.resetDataForm();
    }
  }, [props.idss])

  const handleAfterSaveDraftManual = () => {
    if (props.isActionSaveDraft && props.activityDraftResponse?.activityDraftId > 0) {
      if (props.onSaveSussecc) {
        props.onSaveSussecc(true);
      }
      if (props.onCloseModalActivity) {
        props.onCloseModalActivity(props.idss);
      }
      props.handleClearResponseData();
      props.resetDataForm();
    }
  }

  useEffect(() => {
    handleAfterSaveDraftManual();
  }, [props.isActionSaveDraft])


  // useEffect(() => {
  //   if (!props.popout) {
  //     setProducts(convertToProductTrading(props.productSuggestions?.dataInfo?.products) || []);
  //     if (!showProduct && props.productSuggestions?.dataInfo?.products && props.productSuggestions?.dataInfo?.products.length > 0) {
  //       setShowProduct(true);
  //     }
  //   }
  // }, [props.productSuggestions]);

  useEffect(() => {
    setMsgError(props.errorMessage);
    setMsgSuccess(props.successMessage);
    if (props.successMessage && props.successMessage.length > 0) {
      setToastMessage({ message: props.successMessage, type: MessageType.Success });
    }
  }, [props.errorMessage, props.successMessage]);

  useEffect(() => {
    setErrorValidates(props.errorValidates ? props.errorValidates : []);
    if (props.errorValidates?.length > 0) {
      const errActivityId = props.errorValidates.find(e => e.item === 'activityId');
      if (!_.isNil(errActivityId)) {
        setMsgError(translate(`messages.${errActivityId.errorCode}`))
      }

      const errProductTrading = props.errorValidates.find(e => e.item === "" && !_.isNil(e.rowId));
      if (!_.isNil(errProductTrading)) {
        setMsgError(translate(`messages.${errProductTrading.errorCode}`))
      }
      // validate next schedule
      const startDayError = props.errorValidates.find(e => e.errorParams === 'startDate');
      const endDayError = props.errorValidates.find(e => e.errorParams === 'endDate');
      const errorData = {};
      const errorDataEquiq = {};
      if(startDayError && startDayError.errorCode !== 'ERR_CAL_0001'){
        errorData['startDay'] = translate(`messages.${startDayError.errorCode}`)
        
      } else if(startDayError && startDayError.errorCode === 'ERR_CAL_0001') {
        errorDataEquiq['startDate'] = translate(`messages.${startDayError.errorCode}`);
      }
      if(endDayError){
        errorData['endDay'] = translate(`messages.${startDayError.errorCode}`);
      }
      createEditScheduleRef?.current?.setErrorInput && createEditScheduleRef.current.setErrorInput(errorData);
      createEditScheduleRef?.current?.errorDataEquiq && createEditScheduleRef.current.errorDataEquiq(errorDataEquiq);
    }
  }, [props.errorValidates]);

  useEffect(() => {
    if (props.customerInfo && props.customerInfo.customerId) {
      const _customer = ([{
        customerId: props.customerInfo.customerId,
        customerName: props.customerInfo.customerName,
        parentCustomerName: props.customerInfo.parentName,
        address: props.customerInfo.address
      }]);
      setCustomer(_customer);
    }
  }, [props.customerInfo])


  /**
   * getfileUploads
   */
  const getfileUploads = (_filesActivity?) => {
    const listFiles = _filesActivity || fileUploads;
    const fUploads = [];
    const keyFiles = Object.keys(listFiles);
    keyFiles.forEach(key => {
      const arrFile = listFiles[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }


  /**
   * convert to field items: activity format
   * @param formats
   */
  const convertToFiledItems = (formats) => {
    const lst = []
    if (formats && formats.length > 0) {
      formats = formats.sort((a, b) => a.displayOrder - b.displayOrder);
      formats.forEach(e => {
        lst.push({
          itemId: e.activityFormatId,
          itemLabel: getFieldLabel(e, "name"),
          isAvailable: e.isAvailable,
          fieldUse: e.fieldUse
        })
      })
    }
    return lst;
  }

  /**
   * calDateTime
   * @param dateValue 
   * @param timeValue 
   */
  const calDateTime = (dateValue, timeValue) => {
    if (dateValue && timeValue) {
      return CommonUtil.toTimeStamp(dateValue, timeValue)
    } else if (timeValue) {
      return CommonUtil.toTimeStamp(moment.utc().format(CommonUtil.getUseFormatDate()), timeValue);
    }
    return null;
  }

  /**
   * Check display for dynamic field
   */
  const isDisplayFieldInfo = (field: FieldInfoActivityType): boolean => {
    if ((activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW && field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
      || (!activityFormatId && field.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE)
      || field.fieldName === specialFName.activityFormatId) {
      return true;
    } else if(_.isNil(activityFormatId) && field.availableFlag !== AVAILABLE_FLAG.WEB_APP_AVAILABLE) {
      return false;
    }
    if (!field || !activityFormatId) {
      return false;
    }
    let isDisplay = false;
    const activityFormats = convertToFiledItems(props.activityInfo?.activities?.activityFormats);
    activityFormats.forEach((format: any) => {
      if (Number(format['itemId']) === Number(activityFormatId)) {
        const data = JSON.parse(format.fieldUse);
        if (data) {
          Object.keys(data).forEach(key => {
            if (Number(key) === field.fieldId && Number(data[key]) === 1) {
              isDisplay = true;
            }
          })
        }
      }
    })
    // if (!isDisplay) {
    //   updateStateField(field, field.fieldType, null);
    //   // saveActivityData[StringUtils.snakeCaseToCamelCase(field.fieldName)] = null;
    // }
    return isDisplay;
  }

  const getValueExtend = () => {
    const extendData = [];
    if(saveActivityData['activityData'] && fieldInfoActivity && fieldInfoActivity.length > 0) {
      saveActivityData['activityData'].forEach(e => {
        const field = fieldInfoActivity.find(fieldItem => fieldItem.fieldName === e.key);
        if(!_.isNil(field) && isDisplayFieldInfo(field)) {
          extendData.push(e);
        }
      })
    }
    return extendData;
  }

  /**
   * update form data
   * @param isDraft
   */
  const updateFormValue = () => {
    const contactDate = saveActivityData['contactDate'];
    // const formData = _.cloneDeep(saveActivityData);
    // console.log('---saveActivityData', saveActivityData)
    const formData = {};
    formData['activityId'] = saveActivityData['activityId'];
    formData['activityDraftId'] = saveActivityData['activityDraftId'];
    formData['activityStartTime'] = tzToUtc(calDateTime(contactDate, saveActivityData['activityStartTime']));
    formData['activityEndTime'] = tzToUtc(calDateTime(contactDate, saveActivityData['activityEndTime']));
    formData['contactDate'] = CommonUtil.toTimeStamp(contactDate);
    formData['activityFormatId'] = saveActivityData['activityFormatId'];
    formData['activityDuration'] = saveActivityData['activityDuration'];

    if (saveActivityData['interviewer'] && saveActivityData['interviewer'].length > 0) {
      const businessCards = saveActivityData['interviewer'].filter(e => e['businessCardId']);
      const interviewers = [];
      formData['businessCardIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(businessCards, "businessCardId");
      if (businessCards.length < saveActivityData['interviewer'].length) {
        saveActivityData['interviewer'].forEach(e => {
          if (!e['businessCardId']) {
            interviewers.push(e['businessCardName']);
          }
        });
      }
      formData['interviewers'] = interviewers;
    }
    if (saveActivityData['customerId'] && saveActivityData['customerId'].length > 0) {
      formData['customerId'] = saveActivityData['customerId'][0].customerId;
    }
    if (saveActivityData['customerRelationId'] && saveActivityData['customerRelationId'].length > 0) {
      formData['customerRelationIds'] = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(saveActivityData['customerRelationId'], "customerId");
    }
    formData['memo'] = saveActivityData['memo'];
    // formData['dataProductTradings'] = products;
    // formData['nextSchedule'] = convertScheduleData(scheduleData, files);
    formData['activityData'] = getValueExtend();
    formData['employeeId'] = CommonUtil.getEmployeeId();
    formData['milestoneId'] = saveActivityData?.milestone?.milestoneId;
    formData['scheduleId'] = saveActivityData?.schedule?.scheduleId;
    formData['taskId'] = saveActivityData?.task?.taskId;
    formData['activityDraftId'] = saveActivityData['activityDraftId']
    formData['updatedDate'] = updatedDate;
    if (props.activityDraftResponse) {
      formData['activityDraftId'] = props.activityDraftResponse?.activityDraftId;
      formData['updatedDate'] = props.activityDraftResponse?.updatedDate;
      // formData['isDraft'] = isDraft;
    }
    return formData;
  }

  useEffect(() => {
    if (props.updatedDate) {
      setUpdatedDate(props.updatedDate)
    }
  }, [props.updatedDate])

  /**
   * getFileSchedules
   */
  const getFileSchedules = () => {
    if (props.activityDraftResponse?.scheduleFiles?.length > 0) {
      const list = [];
      const files = props.activityDraftResponse?.scheduleFiles;
      for (let i = 0; i < files.length; i++) {
        const scheduleFile = files[i];
        for (let index = 0; index < filesSchedule.length; index++) {
          const el = filesSchedule[index];
          if (el.name === scheduleFile['file_name']) {
            filesSchedule.splice(index, 1);
            index--;
          }
        }
      }
      return list
    } else {
      return filesSchedule;
    }
  }

  /**
   * getFieldInfoByFieldName
   * @param listField 
   * @param fieldName 
   */
  const getFieldInfoByFieldName = (listField, fieldName) => {
    return listField?.find(f => f.fieldName === fieldName);
  }

  /**
   * 
   * @param products 
   */
  const buildFormDataProductTrading = (customerId) => {
    const res = [];
    if (products && products.length > 0) {
      products.forEach(e => {
        e.endPlanDate = !_.isNil(e.endPlanDate) ? moment.utc(e.endPlanDate, CommonUtil.getUseFormatDate()).format() : null;
        if(isInvalidDate(e.endPlanDate)){
          e.endPlanDate = null;
        }
        e.orderPlanDate = !_.isNil(e.orderPlanDate) ? moment.utc(e.orderPlanDate, CommonUtil.getUseFormatDate()).format() : null;
        if(isInvalidDate(e.orderPlanDate)){
          e.orderPlanDate = null;
        }
        // delete e['productTradingData']; // must change
        delete e['employee'];
        e['employeeId'] = e['employeeId'] || CommonUtil.getEmployeeId();
        e['customerId'] = e['customerId'] || customerId;
      });
      const listEdit = products.filter(e => !_.isNil(e.productTradingId));
      const listAdd = products.filter(e => _.isNil(e.productTradingId));
      if (listEdit && listEdit.length > 0) {
        listEdit.forEach(e => {
          if (e['productTradingData'] && !_.isArray(e['productTradingData']) && isJsonString(e['productTradingData'])) {
            const extendData = [];
            for (const [key, value] of Object.entries(JSON.parse(e['productTradingData']))) {
              const _field = getFieldInfoByFieldName(props.activityInfo?.fieldInfoProductTrading, key);
              if (_field) {
                extendData.push({
                  fieldType: _field.fieldType.toString(),
                  key,
                  value
                })
              }
            }
            // delete e['productTradingData'];
            e['productTradingData'] = extendData;
          } else if (_.isNil(e['productTradingData'])) {// if no change data
            const extendData = [];
            for (const [key, value] of Object.entries(e)) {
              const _field = getFieldInfoByFieldName(props.activityInfo?.fieldInfoProductTrading, key);
              if (_field && !!_field.isDefault) {
                extendData.push({
                  fieldType: _field.fieldType.toString(),
                  key,
                  value
                })
              }
            }
            e['productTradingData'] = extendData;
          }
        });
        res.push({ mode: 'edit', productTradings: listEdit });
      }
      listAdd && listAdd.length > 0 && res.push({ mode: 'add', productTradings: listAdd });
    }
    if (producTradingDelete && producTradingDelete.length) {
      producTradingDelete.forEach(e => {
        delete e['productTradingData']; // must change
        delete e['employee'];
      });
      res.push({ mode: 'delete', productTradings: producTradingDelete });
    }
    return res;
  };


  const getCustomerId = () => {
    const _customer = saveActivityData['customerId'];
    if (_customer && _customer.length > 0) {
      return _customer[0]['customerId'];
    } else {
      return 0;
    }
  }

  const funcSaveActivity = (_scheduleData) => {
    const _nextSchedule = (showInitSchedule || showScheduleArea) ? _scheduleData : null;
    const _filesSchedule = (showInitSchedule || showScheduleArea) ? getFileSchedules() : [];
    props.saveData(updateFormValue(), _nextSchedule, _filesSchedule, buildFormDataProductTrading(getCustomerId()), getfileUploads());
    setIsSubmit(false);
  }

  /**
   * validate file size before save
   * return true if can save, else return false;
   */
  const validateFileSize = () => {
    const files = getfileUploads();
    if (isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return false;
    }
    return true;
  }

  /**
   * handle save data
   * @param isDraft
   */
  const handleSave = () => {
    // validate file
    if(!validateFileSize()){
      return;
    }
    // validate next schedule 
    let invalidNextSchedule = true;
    if((showInitSchedule || showScheduleArea) && createEditScheduleRef?.current?.checkValidateRef){
      invalidNextSchedule = createEditScheduleRef.current.checkValidateRef(scheduleData);
      if(!invalidNextSchedule)
        return
      if ( !_.isNil(scheduleData.scheduleId) && scheduleData.isRepeated) {
        createEditScheduleRef?.current?.setDisplayConfirmEdit && createEditScheduleRef?.current?.setDisplayConfirmEdit(true)
      } else if (Array.isArray(scheduleData.equipments) && scheduleData.equipments.length > 0) {
        scheduleData?.scheduleName.trim();
        createEditScheduleRef?.current?.beforeStoreScheduleRef(scheduleData, getFileSchedules(), true);
      } else {
        funcSaveActivity(_.cloneDeep(scheduleData));
      }
      setIsSubmit(true);
    } else {
      funcSaveActivity(null)
    }
  };

  useEffect(()=>{
    if(props.scheduleData && isSubmit)
      funcSaveActivity(props.scheduleData)
  }, [props.scheduleData])


  
  /**
   * handle save draft auto
   */
  const handleSaveDraftAuto = (_scheduleFormData?) => {
    // validate file
    if(!validateFileSize()){
      return;
    }
    const _nextSchedule = (showInitSchedule || showScheduleArea) ? _.cloneDeep(_scheduleFormData || scheduleData) : null;
    const _filesSchedule = (showInitSchedule || showScheduleArea) ? getFileSchedules() : [];
    const draftDataNew = {
      activityData: updateFormValue(),
      nextSchedule: _nextSchedule,
      filesSchedule: _filesSchedule,
      productTradings: buildFormDataProductTrading(getCustomerId()),
      filesActivity: getfileUploads(filesActivity)
    }
    if (!_.isEqual(draftData, draftDataNew)) {
      props.saveActivivityDraft(draftDataNew.activityData, draftDataNew.nextSchedule, draftDataNew.filesSchedule, draftDataNew.productTradings, draftDataNew.filesActivity);
      setDraftDta(draftDataNew);
    }
  }

  /**
   * interval check
   */
  const intervalCheck = (_scheduleFormData?) => {
    if (isChanged) {
      timerRef && clearTimeout(timerRef);
      timerRef = setTimeout(()=>{
        handleSaveDraftAuto(_scheduleFormData)
      }, INTERVAL_TIME_MILI);
    } 
  };

  const handleCloseModal = (popupType) => {
    const func1 = () => {
      setShowConfirm(false);
    };

    const func2 = () => {
      const _nextSchedule = (showInitSchedule || showScheduleArea) ? _.cloneDeep(scheduleData) : null;
      const _filesSchedule = (showInitSchedule || showScheduleArea) ? getFileSchedules() : [];
      props.saveActivivityDraftManual(updateFormValue(), _nextSchedule, _filesSchedule, buildFormDataProductTrading(getCustomerId()), getfileUploads());
      setShowConfirm(false);
    };

    const func3 = () => {
      if (props.onCloseModalActivity) {
        props.onCloseModalActivity();
      }
      // if has draft, call api delete draft
      const draftId = saveActivityData['activityDraftId'] || props.activityDraftResponse?.activityDraftId;
      if(draftId) {
        props.discardDraft(draftId, true);
      }
      props.onclickShowModalActivityForm(false);
      props.handleUpdateActivityInfo({ activities: {} });
      props.handleClearResponseData();
      setShowConfirm(false);
      props.resetDataForm();
    };

    const msg = activityActionType === ACTIVITY_ACTION_TYPES.UPDATE ? 'WAR_ACT_0002_1' : 'WAR_ACT_0001';
    let text: ConfirmPopupItem = null;
    if (popupType === 0) {
      text = {
        title: `${translate('activity.modal-confirm.title')}`,
        content: `<p>${translate(`messages.${msg}`)}</p><p class="mt-1">${translate('messages.WAR_ACT_0002_2')}</p>`,
        listButton: [
          {
            type: "cancel",
            title: `${translate('activity.modal-confirm.button-cancel')}`,
            callback: func1
          },
          {
            type: "blue px-3",
            title: `${translate('activity.modal-confirm.button-save-draft')}`,
            callback: func2
          },
          {
            type: "red",
            title: `${translate('activity.modal-confirm.button-discard')}`,
            callback: func3
          }
        ]
      }
    }

    if (popupType === 1) {
      text = {
        title: `${translate('activity.modal-confirm.title')}`,
        content: `<p>${translate(`messages.${msg}`)}</p><p class="mt-1">${translate('messages.WAR_ACT_0002_2')}</p>`,
        listButton: [
          {
            type: "cancel",
            title: `${translate('activity.modal-confirm.button-cancel')}`,
            callback: func1
          },
          {
            type: "red",
            title: `${translate('activity.modal-confirm.button-discard')}`,
            callback: func3
          }
        ]
      };
    }

    if (isChanged) {
      setConfirmPopupItem(text);
      setShowConfirm(true);
    } else {
      if (props.onCloseModalActivity) {
        props.onCloseModalActivity();
      }
      props.onclickShowModalActivityForm(false);
      props.resetDataForm();
    }
  };


  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0) || (msgSuccess && msgSuccess.length > 0)) {
      return <></>;
    }
    return (
      <div className="row">
        <div className="col-10 offset-1 mb-3">
          <BoxMessage
            className="max-width-720 m-auto"
            messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
            message={msgError && msgError.length > 0 ? msgError : msgSuccess}
          />
        </div>
      </div>
    )
  }

  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    props.onclickShowModalActivityForm(false);
    const height = screen.height * 0.8;
    const width = screen.width * 0.8;
    const left = screen.width * 0.3;
    const top = screen.height * 0.3;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/create-edit-activity`, '', style.toString());
    props.onCloseModalActivity && props.onCloseModalActivity();
  }


  const isSpecialField = (field) => {
    const specials = Object.values(specialFName);
    const type = field.fieldType.toString();
    return specials.includes(field.fieldName) || type === DEFINE_FIELD_TYPE.TAB || type === DEFINE_FIELD_TYPE.ADDRESS;
  }

  // const fieldPreOrNext = (curIdx, increase) => {
  //   const step = increase ? 1 : -1;
  //   const length = fieldInfoActivity.length;
  //   let target = null;
  //   const start = curIdx + step;
  //   if (fieldInfoActivity[start] === undefined) {
  //     return null;
  //   }
  //   for (let i = start; increase ? i < length : i > 0; i += step) {
  //     if (isSpecialField(fieldInfoActivity[i])) {
  //       continue;
  //     }
  //     target = fieldInfoActivity[i];
  //     break;
  //   }
  //   return target;
  // }


  const fieldPreOrNext = (curIdx, increase) => {
    if (_.isNil(props.activityInfo.fieldInfoActivity)) {
      return null;
    }
    const step = increase ? 1 : -1;
    const length = props.activityInfo.fieldInfoActivity.length;
    let target = null;
    const start = curIdx + step;
    if (props.activityInfo.fieldInfoActivity[start] === undefined) {
      return null;
    }
    for (let i = start; increase ? i < length : i > 0; i += step) {
      if (isSpecialField(props.activityInfo.fieldInfoActivity[i])) {
        continue;
      }
      target = props.activityInfo.fieldInfoActivity[i];
      break;
    }
    return target;
  }



  const isFullWidth = (isDoubleColumn, index, rightSpace) => {
    if (rightSpace) {
      /**
       *  _____________ _____________
       * |_____________|_____________|
       * |_____________| right space
       */
      return false;// !isDoubleColumn;
    }
    const nxt = fieldPreOrNext(index, true);
    let fullWidth = false;
    /**
     *  _____________ _____________
     * |_____________|_____________|
     *     no have right space
     */
    if (!nxt) {
      fullWidth = true;
    } else if (nxt.isDoubleColumn) {
      fullWidth = !isDoubleColumn;
    } else {
      fullWidth = true;
    }
    return fullWidth;
  }


  const checkSnakeCase = (value) => {
    if (value.includes("_")) {
      return StringUtils.snakeCaseToCamelCase(value);
    } else {
      return value;
    }
  }

  /**
   * get data for tag suggestion
   * @param item
   */
  const getDataTagStatusControl = (item) => {
    if (activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW)
      return null;
    let fieldValue = undefined;
    if (saveActivityData !== undefined) {
      const activities = saveActivityData;
      if (item.fieldName === specialFName.activityTargetId
        || item.fieldName === specialFName.scheduleId
        || item.fieldName === specialFName.milestoneId
        || item.fieldName === specialFName.taskId) {
        if (activities?.schedule?.scheduleId) {
          fieldValue = [activities?.schedule];
        } else if (activities?.milestone?.milestoneId) {
          fieldValue = [activities?.milestone];
        } else if (activities?.task?.taskId) {
          fieldValue = [activities?.task];
        }
      } else if (item.fieldName === specialFName.interviewer || item.fieldName === specialFName.businessCardId) {
        let _tags = [];
        if (activities['interviewer']) { // when init
          fieldValue = activities['interviewer'];
        } else { // when edit field
          if (activities?.businessCards?.length > 0) {
            for (let index = 0; index < activities?.businessCards.length; index++) {
              const temp = activities?.businessCards[index];
              _tags = _.concat(_tags, [{ ...temp, businessCardName: temp['firstName'] + " " + temp['lastName'] }]);
            }
          }
          if (activities?.interviewers?.length > 0) {
            for (let index = 0; index < activities?.interviewers.length; index++) {
              _tags = _.concat(_tags, [{ businessCardName: activities?.interviewers[index] }]);
            }
          }
          fieldValue = _tags;
          saveActivityData['interviewer'] = _tags
        }
      } else if (item.fieldName === specialFName.customerRelationId) {
        let _tags = [];
        if (activities['customerRelationId']) { // when edit field
          fieldValue = activities['customerRelationId'];
        } else { // when init
          if (activities?.customerRelations?.length > 0) {
            for (let index = 0; index < activities?.customerRelations.length; index++) {
              const e = activities?.customerRelations[index];
              _tags = _.concat(_tags, [{
                customerId: e?.customerId || e?.customerRelationId,
                customerName: e?.customerName,
                parentCustomerName: e?.customerParent?.customerName,
                address: e?.customerAddress
              }]);
            }
          }
          fieldValue = _tags;
          saveActivityData['customerRelationId'] = _tags
        }
      } else if (item.fieldName === specialFName.customerId) {
        let _tags = [];
        if (activities['customerId']) { // when edit field
          fieldValue = activities['customerId'];
        } else { // when init
          if (activities?.customer) {
            _tags = [{
              customerId: activities?.customer?.customerId,
              customerName: activities?.customer?.customerName,
              parentCustomerName: activities?.customer?.customerParent?.customerName,
              address: activities?.customer?.customerAddress?.address
            }];
          }
          fieldValue = _tags;
          saveActivityData['customerId'] = _tags;
        }

      } else if (item.fieldName === specialFName.productTradingId) {
        fieldValue = activities['productTradings']
      } else {
        fieldValue = activities[StringUtils.snakeCaseToCamelCase(item.fieldName)];
      }
    }
    return fieldValue;
  }


  /**
   * convert data to init form, draft data, edit data, create new 
   * 
   * @param item 
   */
  const getDataStatusControl = (item) => {
    /**
     * saveActivityData: form API, draff, localstorage
     */
    // if calculation field
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.CALCULATION) {
      return { fieldValue: saveActivityData };
    }
    // if preview in edit custom field mode
    if (activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW) {
      return null;
    }

    let fieldValue = undefined;

    if (!item.isDefault) {// dynamic field
      if (saveActivityData['activityData'] !== undefined) {
        fieldValue = CommonUtil.getExtendfieldValue(saveActivityData['activityData'], item.fieldName);
      }
    } else {
      const camelCase = StringUtils.snakeCaseToCamelCase(item.fieldName);
      const value = saveActivityData[camelCase]
      if (fieldValue === undefined && item.fieldName === specialFName.contactDate && !saveActivityData?.activityId) {
        fieldValue = moment(new Date());
      } else if (Number(item.fieldType) === Number(DEFINE_FIELD_TYPE.DATE)) {
        if (value) {
          fieldValue = moment(value);
        }
      } else {
        fieldValue = value;
      }
    }
    if (fieldValue !== undefined) {
      const itemValue = { ...item };
      itemValue.fieldValue = fieldValue;
      return itemValue;
    } else {
      return null;
    }
  }

  const indexRef = (field) => {
    return fieldInfoActivity.findIndex(e => e.fieldId === field.fieldId);
  }



  const displayToastMessage = (message, type) => {
    if (_.isNil(message)) {
      return;
    }
    const objParams = { message, type };
    setToastMessage(objParams);
    setTimeout(() => {
      setToastMessage(null);
    }, TIMEOUT_TOAST_MESSAGE);
  };

  /**
   * updateFiles
   * @param fUploads 
   */
  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
    filesActivity = _.cloneDeep(newUploads);
    
  }

  /**
   * updateStateField
   * @param item 
   * @param type 
   * @param val 
   */
  const updateStateField = (item, type, val) => {
    let fieldInfo = null;
    if (fieldInfoActivity) {
      fieldInfoActivity.forEach(field => {
        if (field.fieldId.toString() === item.fieldId.toString()) {
          fieldInfo = field;
        }
      });
    }
    // console.log(' ---- updateStateField', fieldInfo, val)
    if (saveActivityData !== null && saveActivityData !== undefined && fieldInfo) {
      const i = arrIgnoreUpdate.indexOf(fieldInfo.fieldName);
      if (i >= 0) {
        arrIgnoreUpdate.splice(i, 1);
        CommonUtil.addExtendField(fieldInfo, val, saveActivityData, 'activityData');
        return;
      }
      if (_.isEqual(DEFINE_FIELD_TYPE.LOOKUP, _.toString(type))) {
        const valueLookup = _.isArray(val) ? val : _.toArray(val);
        let isToast = false;
        valueLookup.forEach(e => {
          const idx = fieldInfoActivity.findIndex(o => o.fieldId === e.fieldInfo.fieldId);
          if (idx >= 0) {
            const idxRef = indexRef(fieldInfoActivity[idx]);
            if (inputRefs[idxRef] && inputRefs[idxRef].current && inputRefs[idxRef].current.setValueEdit) {
              inputRefs[idxRef].current.setValueEdit(e.value);
              isToast = true;
            }
          }
        })
        if (isToast) {
          displayToastMessage('INF_COM_0018', MessageType.Info);
        }
      } else if (fieldInfo.isDefault) {
        if (fieldInfo.fieldName === specialFName.activityFormatId) {
          saveActivityData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = CommonUtil.forceNullIfEmptyString(fieldInfo, val);
          setActivityFormatId(val);
        } else {
          saveActivityData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = CommonUtil.forceNullIfEmptyString(fieldInfo, val);
        }
        setSaveActivityData(_.cloneDeep(saveActivityData));
      } else if (_.toString(fieldInfo.fieldType) !== DEFINE_FIELD_TYPE.CALCULATION) {
        CommonUtil.addExtendField(fieldInfo, val, saveActivityData, 'activityData');
        setSaveActivityData(_.cloneDeep(saveActivityData));
      }
      // if(Number(fieldInfo.fieldType) !== Number(DEFINE_FIELD_TYPE.FILE))
        intervalCheck();
        
    }
  }

  /**
   * on chang report target
   * @param listTag
   */
  const onChangeReportTarget = (listTag) => {
    if (listTag && listTag[0]) {
      const obj = listTag[0];
      let productTradingIds = [];
      let _customer;
      if (Object.prototype.hasOwnProperty.call(obj, "scheduleId")) {
        productTradingIds = [obj.productTradingId || 0];
        // if (!_.isEqual(productTradingIds, productTradingReportTarget)) {
          // setProductTradingReportTarget(productTradingIds);
          getProductTradings(3, true, 'product_trading_id', productTradingIds as []); // 3
        // }
        _customer = [{
          customerId: obj.customerId,
          customerName: obj.customerName,
          parentCustomerName: "",
          address: "",
          isChangeReportTarget: true
        }];
        saveActivityData['schedule'] = obj;
      } else if (Object.prototype.hasOwnProperty.call(obj, "taskId")) {
        productTradingIds = CommonUtil.GET_ARRAY_VALUE_PROPERTIES(obj['productTradings'], 'productTradingId');
        // if (!_.isNil(obj['productTradings']) && !_.isEqual(productTradingIds, productTradingReportTarget)) {
          // setProductTradingReportTarget(productTradingIds);
          getProductTradings(3, true, 'product_trading_id', productTradingIds as []); // 3
        // }
        _customer = ([{ ...obj.customer, parentCustomerName: "", address: "", isChangeReportTarget: true }]);
        saveActivityData['task'] = obj;
      } else {
        _customer = [{
          customerId: obj.customerId,
          customerName: obj.customerName,
          parentCustomerName: "",
          address: "",
          isChangeReportTarget: true
        }];
        saveActivityData['milestone'] = obj;
      }
      if (isChanged && _customer?.length > 0 && !_.isNil(_customer[0].customerId)) {
        customerRef && customerRef.current && customerRef.current.setTags && customerRef.current.setTags(_customer);
        saveActivityData['customerId'] = _customer;
        setCustomerIds(CommonUtil.GET_ARRAY_VALUE_PROPERTIES(_customer, 'customerId'));
        setShowEditCustomer(true);
      } else if (isChanged) {
        customerRef && customerRef.current && customerRef.current.deleteTag && customerRef.current.deleteTag(0);
        saveActivityData['customerId'] = null;
        setShowEditCustomer(false);
      }
    } else {
      saveActivityData['schedule'] = null;
      saveActivityData['task'] = null;
      saveActivityData['milestone'] = null;
    }
    setProducTradingDelete([]);
    intervalCheck();
    setSaveActivityData({...saveActivityData});
  }


  useEffect(() => {
    if (props.listProductTradings && productTradingSuggestion && productTradingSuggestion.current) {
      const data = [];
      if(props.listProductTradings && props.listProductTradings.length > 0) {
        props.listProductTradings.forEach((e: any) => {
          e['productImagePath'] = e?.product?.productImagePath;
          e['productName'] = e?.product?.productName;
          e['memoProduct'] = e?.product?.memo;
          e['productCategoryName'] = e?.product?.productCategoryName;
          data.push(e);
        })
      }
      productTradingSuggestion.current.setTags(data)
      setProducts(data)
    }
  }, [props.listProductTradings])

  // useEffect(() => {
  //   if (productTradingReportTarget)
  //     getProductTradings(3, true, 'product_trading_id', productTradingReportTarget as []); // 3
  // }, [productTradingReportTarget])

  /**
   * isHasReportTarget
   */
  const isHasReportTarget = () => {
    return !_.isNil(saveActivityData['schedule']) || !_.isNil(saveActivityData['task']) || !_.isNil(saveActivityData['milestone']);
  }


  /**
   * on change customer
   * @param listTag
   */
  const onChangeCustomer = (listTag) => {
    if (listTag?.length > 0 && listTag[0]) {
      setShowEditCustomer(true);
      const _customerId = listTag[0]['customerId'];
      if (_.isNil(listTag[0]['isChangeReportTarget'])) {
        // setProductTradingCustomer(_customerId);
        props.handleGetProductTradings([], [_customerId], false);
        setCustomerIds(CommonUtil.GET_ARRAY_VALUE_PROPERTIES(listTag, 'customerId'));
      }
    } else {
      setCustomer(null);
      setShowEditCustomer(false);
      if (productTradingSuggestion && productTradingSuggestion.current) {
        productTradingSuggestion.current.setTags([])
        setProducts([])
      }
    }
    setProducTradingDelete([]);
    intervalCheck();
  }

  const validateBeforeRemoveTag = () => {
    const func1 = () => {
      props.toggleConfirmPopup(false);
      return false;
    };
    const func2 = () => {
      reportTargetRef && reportTargetRef.current && reportTargetRef.current.deleteTag && reportTargetRef.current.deleteTag(0);
      customerRef && customerRef.current && customerRef.current.deleteTag && customerRef.current.deleteTag(0);
      saveActivityData['customerId'] = null;
      saveActivityData['schedule'] = null;
      saveActivityData['task'] = null;
      saveActivityData['milestone'] = null;
      props.toggleConfirmPopup(false);
      return true;
    };

    const confirm: ConfirmPopupItem = {
      title: ``,
      content: `${translate('activity.modal-confirm.confirm-customer')}`,
      listButton: [
        {
          type: "cancel",
          title: `${translate('activity.modal-confirm.button-cancel')}`,
          callback: func1
        },
        {
          type: "red",
          title: `${translate('activity.modal-confirm.button-confirm')}`,
          callback: func2
        }
      ]
    };
    if (isHasReportTarget()) {
      props.toggleConfirmPopup(true, confirm);
    } else {
      return true;
    }

  }

  /**
   * update activity duration
   * @param fieldName
   * @param value
   */
  const updateStateFieldActivityDuration = (fieldName, value) => {
    saveActivityData[StringUtils.snakeCaseToCamelCase(fieldName)] = value;
    intervalCheck();
  }

  const firstErrorItem = null;

  /**
   * get error
   * @param item
   */
  const getErrorInfo = (item) => {
    let errorInfo = null;
    if (errorValidates && errorValidates.length > 0) {
      errorValidates.forEach(elem => {
        let fieldName = item.fieldName;
        if (item.isDefault) {
          fieldName = StringUtils.snakeCaseToCamelCase(fieldName);
        }
        if (elem.item === fieldName || elem.errorParams === fieldName) {
          errorInfo = elem;
        } else if( fieldName === 'interviewer' && elem.item === 'updateActivityBusinessCard-2') {
          errorInfo = elem;
        } else if(item.fieldType.toString() === DEFINE_FIELD_TYPE.RELATION ){
          const relationId = StringUtils.tryGetAttribute(item, "relationData.fieldId");
          if(relationId && (_.toString(elem.item) === _.toString(relationId) || _.toString(elem.errorParams) === _.toString(relationId))){
            errorInfo = elem;
          }
        }
      });
    }
    return errorInfo;
  }

  const getErrorInfoDuration = () => {
    let errorInfo = null;
    if (errorValidates && errorValidates.length > 0) {
      errorValidates.forEach(elem => {
        if (elem.errorParams === 'activityStartTime' ||
          elem.errorParams === 'activityEndTime' ||
          elem.errorParams === 'activityDuration' ||
          elem.errorParams === 'activityChoiseTheTime') {
          errorInfo = elem;
        }
      });
    }
    return errorInfo;
  }

  const validateItem = item => {
    const errorInfo = getErrorInfo(item);
    if (errorInfo) {
      return translate('messages.' + errorInfo.errorCode, errorInfo.errorParams);
    }
    return null;
  };


  /**
   * render activity duration
   * @param item
   */
  const renderActivityDuration = (item) => {
    const isShow = isDisplayFieldInfo(item);
    if (!isShowActivityDuration && isShow) {
      isShowActivityDuration = true;
      return (
        <FieldActivityDuration itemDataField={item}
          updateStateField={updateStateFieldActivityDuration}
          startTime={saveActivityData?.activityStartTime}
          endTime={saveActivityData?.activityEndTime}
          errorInfo={getErrorInfoDuration()}
          isDisabled={shouldDisable || item.modifyFlag === 0}
          duration={saveActivityData?.activityDuration}
          elementStatus={_.cloneDeep(saveActivityData)} />
      )
    } else {
      return <></>;
    }
  }


  /**
   * get text value
   * @param fieldName
   * @param type : 2: updatedUser/createdUser, 1: updatedDate/createdDate
   */
  const getTextValue = (fieldName, type) => {
    if (type === 1) {
      const _field = fieldName === specialFName.createdDate ? "createdUser" : "updatedUser";
      let text = translate('activity.modal.updated-date-default');
      if (!_.isNil(saveActivityData) && !_.isNil(saveActivityData[_field])) {
        text = formatDate(utcToTz(saveActivityData[_field][StringUtils.snakeCaseToCamelCase(fieldName)]));
      }
      return text;
    } else {
      const _field = fieldName === specialFName.createdUser ? "createdUser" : "updatedUser";
      let text = translate('activity.modal.updated-by-default');
      if (!_.isNil(saveActivityData) && !_.isNil(saveActivityData[_field])) {
        const _employee = saveActivityData[_field];
        text = (_employee['employeeSurname'] || '') + " " + (_employee['employeeName'] || '');
      }
      return text;
    }
  }

  /**
   * render created/updated user
   * @param item
   */
  const renderUserInfo = (item) => {
    let _type;
    if (item.fieldName === specialFName.createdDate
      || item.fieldName === specialFName.updatedDate) {
      _type = 1;
    } else {
      _type = 2;
    }
    return <>
      {
        isDisplayFieldInfo(item) &&
        <div className="col-lg-6 form-group" key={`activityField_${item.fieldId}`}>
          <label className="font-weight-bold">
            {getFieldLabel(item, 'fieldLabel')}
          </label>
          <div className="">
            {getTextValue(item.fieldName, _type)}
          </div>
        </div>
      }
    </>;
  }


  /**
   * render report target
   */
  const renderReportTarget = (item) => {
    const isShow = isDisplayFieldInfo(item);
    if (!isShowReportTarget && isShow) {
      isShowReportTarget = true
      return <>
        <div className="col-lg-6 form-group common" key={`activityField_${item.fieldId}`}>
          <TagSuggestion
            id="reportTargets"
            ref={reportTargetRef}
            isHoldTextInput={true}
            className="items break-line form-group"
            placeholder={translate('activity.modal.report-target-placeholder')}
            inputClass="input-normal"
            validMsg={validateItem(item)}
            isDisabled={shouldDisable || item.modifyFlag === 0}
            mode={TagSuggestionMode.Single}
            type={TagSuggestionType.ReportTarget}
            onActionSelectTag={(id: any, type: TagSuggestionType, mode: TagSuggestionMode, listTag: any[]) => {
              updateStateField(item, type, listTag);
              onChangeReportTarget(listTag);
            }}
            title={getFieldLabel(item, 'fieldLabel')}
            customerId={getCustomerId()}
            elementTags={getDataTagStatusControl(item)}
          />
        </div>
      </>
    } else {
      return <></>;
    }
  }

  /**
   * render Interview/businesscard
   * @param item
   */
  const renderInterview = (item) => {
    const isShow = isDisplayFieldInfo(item);
    if (!isShowInterview && isShow) {
      isShowInterview = true;
      return <>
        <div className="col-lg-6 form-group custom-activity" key={`activityField_${item.fieldId}`}>
          <ManagerSuggestSearch
            id={item.fieldName}
            title={getFieldLabel(item, 'fieldLabel')}
            type={TagAutoCompleteType.BusinessCard}
            modeSelect={TagAutoCompleteMode.Multi}
            inputClass="input-normal"
            isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
            elementTags={getDataTagStatusControl(item)}
            placeholder={translate('activity.modal.business-card-placeholder')}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              updateStateField(item, type, listTag);
            }}
            isDisabled={shouldDisable || item.modifyFlag === 0}
            validMsg={validateItem(item)}
            isShowAddText={true}
            customerIds={CommonUtil.GET_ARRAY_VALUE_PROPERTIES(saveActivityData['customerRelationId'], "customerId")}
          />
        </div>
      </>
    } else {
      return <></>;
    }

  }

  /**
   * pass data from create-edit-component to create-edit-schedule
   */
  const handleDataPass = (scheduleFormData, initialFormData, filesData) => {
    // if(!_.isNil(initialFormData.scheduleId)){
    //   scheduleFormData['scheduleId'] = initialFormData.scheduleId;
    // }
    // setScheduleData({...initialFormData, ...scheduleFormData});
    setScheduleData(_.cloneDeep(scheduleFormData));
    // setInitialForm(initialFormData);
    setFilesSchedule(filesData);
    // filesActivity = {}; 
    intervalCheck(scheduleFormData);
  }

  /**
   * isRequired
   * @param item 
   */
  const isRequired = (item) => {
    return StringUtils.getValuePropStr(item, 'modifyFlag') === MODIFY_FLAG.REQUIRED || StringUtils.getValuePropStr(item, 'modifyFlag') === MODIFY_FLAG.DEFAULT_REQUIRED
  }

  /**
   * onRemoveProductTrading
   * @param productTradingRemove 
   */
  const onRemoveProductTrading = (productTradingRemove) => {
    producTradingDelete.push(productTradingRemove);
  }


  const renderDynamicField = (item, idxRef, className) => {
    if(item.fieldName === specialFName.activityId && activityActionType === ACTIVITY_ACTION_TYPES.CREATE) {
        return <>
        {/* {
          isDisplayFieldInfo(item) &&
          <div className="col-lg-6 form-group" key={`activityField_${item.fieldId}`}>
            <label className="font-weight-bold">
              {getFieldLabel(item, 'fieldLabel')}
            </label>
            <div className="">
              {translate('activity.modal.text-activity-id')}
            </div>
          </div>
        } */}
      </>;
    }
    if (item.fieldName === specialFName.activityFormatId) {
      const formats = activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW ? activityFormatList : props.activityInfo?.activities?.activityFormats;
      item['fieldItems'] = convertToFiledItems(formats);
      item['fieldType'] = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
    }
    let _isDisabled = false;
    if (Number(item.fieldType) === Number(DEFINE_FIELD_TYPE.SINGER_SELECTBOX) || Number(item.fieldType) === Number(DEFINE_FIELD_TYPE.MULTI_SELECTBOX)) {
      _isDisabled = false;
    } else {
      _isDisabled = (shouldDisable || item.modifyFlag === 0);
    }
    return (
      <>
        {
          isDisplayFieldInfo(item) &&
          <DynamicControlField
            ref={inputRefs[idxRef]}
            isFocus={(props.errorValidates && props.errorValidates.length > 0) ? (checkSnakeCase(item.fieldName) === firstErrorItem) : false}
            key={`activityField_${item.fieldId}`}
            recordId={props.activityId ? [props.activityId] : []}
            elementStatus={getDataStatusControl(item)}
            updateStateElement={updateStateField}
            belong={FIELD_BELONG.ACTIVITY}
            fieldInfo={item}
            className={`${className}`}
            isRequired={item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED}
            isDisabled={_isDisabled}
            errorInfo={getErrorInfo(item)}
            controlType={activityActionType === ACTIVITY_ACTION_TYPES.UPDATE ? ControlType.EDIT : ControlType.ADD}
            // listFieldInfo={listFieldTab}
            updateFiles={updateFiles}
          // idUpdate={employeeId}
          // isSingleFile={isIconField}
          // acceptFileExtension={isIconField ? FILE_FOMATS.IMG : null}
          />
        }
      </>
    );
  }

  /**
   * getProductFieldsView
   * get field product trading by activity format
   */
  const getProductFieldsView = () => {
    // check display product trading field by activity format ---> pending
    // let res = []
    // if (props.activityInfo?.fieldInfoProductTrading?.length > 0) {
    //   if (!activityFormatId) {
    //     res = props.activityInfo?.fieldInfoProductTrading;
    //   } else {
    //     const format = props.activityInfo?.activities?.activityFormats?.find(e => e.activityFormatId === Number(activityFormatId));
    //     const data = format && JSON.parse(format.productTradingFieldUse);
    //     if (!_.isNil(data)) {
    //       props.activityInfo?.fieldInfoProductTrading.forEach(e => {
    //         if (data[e.fieldId] && Number(data[e.fieldId]) === 1) {
    //           res.push(e);
    //         }
    //       })
    //     }
    //   }
    // }
    // return res;
    return props.activityInfo?.fieldInfoProductTrading;
  }

  /**
   * renderProductTrading
   * @param item
   */
  const renderProductTrading = (item) => {
    return <>
      {
        isDisplayFieldInfo(item) &&
        <div className="col-lg-12" key={`activityField_${item.fieldId}`}>
          <div className="col-lg-6  form-group pl-0">
            <TagSuggestion
              ref={productTradingSuggestion}
              id="productTradings"
              isHoldTextInput={true}
              className="items break-line form-group  w-200 mt-2"
              placeholder={translate('activity.modal.product-placeholder')}
              inputClass="input-normal"
              validMsg={validateItem(item)}
              isDisabled={shouldDisable || item.modifyFlag === 0}
              elementTags={products}
              errorValidates={props.errorValidates || []}
              mode={TagSuggestionMode.Multi}
              type={TagSuggestionType.ProductTrading}
              onActionSelectTag={(id: any, type: TagSuggestionType, mode: TagSuggestionMode, listTag: any[]) => {
                setProducts(listTag);
                updateStateField(item, type, listTag);
              }}
              customerIds={CommonUtil.GET_ARRAY_VALUE_PROPERTIES(saveActivityData?.customerId || [], 'customerId')}
              onRemoveProductTrading={onRemoveProductTrading}
              title={getFieldLabel(item, 'fieldLabel')}
              progresses={props.activityInfo?.progresses}
              fieldInfoProductTrading={getProductFieldsView()}
            />
          </div>
        </div>
      }
    </>
  }



  const isExistBeforeTab = listFieldTab.length > 0 && listFieldTab[0].fieldOrder > 1
  const isExistAfterTab = listFieldTab.length > 0 && listFieldNormal.length > 0 && listFieldTab[listFieldTab.length - 1].fieldOrder < listFieldNormal[listFieldNormal.length - 1].fieldOrder

  const listFieldBeforeTab = listFieldNormal.filter(e => isExistBeforeTab && e.fieldOrder < listFieldTab[0].fieldOrder)
  const listFieldAfterTab = listFieldNormal.filter(e => isExistAfterTab && e.fieldOrder > listFieldTab[listFieldTab.length - 1].fieldOrder)


  const renderNameEmployee = () => {
    let name = '';
    if (props.activityInfo?.activities?.employee?.employeeSurname)
      name += props.activityInfo?.activities?.employee?.employeeSurname + " "
    if (props.activityInfo?.activities?.employee?.employeeName) {
      name += props.activityInfo?.activities?.employee?.employeeName
    }
    return name || translate('activity.modal.report-person-default');
  }

  const getDateTimeNextSchedule = (startDate, isFinish) => {
    if(!startDate) {
      return startDate;
    }
    const now = CalenderViewMonthCommon.localToTimezoneOfConfig(CalenderViewMonthCommon.nowDate()).utc();
    const defaultTime = now.minutes() > 30 ? now.clone().hour(now.hour() + 1).minutes(0) : now.clone().minutes(0);
    const newStartDate = moment.utc(startDate + ' ' + defaultTime.format(timeFormat), `${CommonUtil.getUseFormatDate()} HH:mm`);
    return isFinish ? newStartDate.clone().add(1, 'h').format() : newStartDate.format();
  }

  /**
   * render dynamic field
   * @param listFields
   */
  const renderDynamicControlField = (listFields: any[]) => {
    let curRightSpace = false;
    let nxtRightSpace = false;
    isShowReportTarget = false;
    isShowActivityDuration = false;
    isShowInterview = false;
    listFields = _.sortBy(listFields, 'fieldOrder', 'asc');
    return (

      listFields.map((item, idx) => {
        curRightSpace = _.cloneDeep(nxtRightSpace);
        const fullWidth = isFullWidth(item.isDoubleColumn, idx, curRightSpace);
        let className = fullWidth ? "col-lg-12 form-group" : "col-lg-6 form-group";
        // let className =  "col-lg-6 form-group";
        if (item.modifyFlag === MODIFY_FLAG.REQUIRED || item.modifyFlag === MODIFY_FLAG.DEFAULT_REQUIRED) {
          className += ` required_scroll_${item.fieldName.replace('_', '').toLowerCase()}`;
        }
        if(Number(item.fieldType) === Number(DEFINE_FIELD_TYPE.RELATION)) {
          className += ` custom-activity`;
        }
        // const tabIndex = idx + 1;
        // const specials = Object.values(specialFName);
        if (!isSpecialField(item)) {
          // tick that next item has right space or not?
          nxtRightSpace = !curRightSpace && !fullWidth;
        }
        // const isIconField = item.fieldName === _.snakeCase(RESPONSE_FIELD_NAME.EMPLOYEE_ICON);
        const idxRef = fieldInfoActivity.findIndex(e => e.fieldId === item.fieldId);

        switch (item.fieldName) {
          case specialFName.createdDate:
          case specialFName.updatedDate:
          case specialFName.createdUser:
          case specialFName.updatedUser:
            return renderUserInfo(item);
          case specialFName.productTradingId:
            return renderProductTrading(item);
          case specialFName.activityTargetId:
          case specialFName.scheduleId:
          case specialFName.milestoneId:
          case specialFName.taskId:
            return renderReportTarget(item);
          case specialFName.customerId:
            return <>
              {
                isDisplayFieldInfo(item) &&
                <div className="col-lg-6  form-group" key={`activityField_${item.fieldId}`}>
                  <ManagerSuggestSearch
                    id={item.fieldName}
                    ref={customerRef}
                    title={getFieldLabel(item, 'fieldLabel')}
                    type={TagAutoCompleteType.Customer}
                    modeSelect={TagAutoCompleteMode.Single}
                    inputClass="input-normal"
                    isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
                    elementTags={customer || getDataTagStatusControl(item)}
                    validateBeforeRemoveTag={validateBeforeRemoveTag}
                    placeholder={translate('activity.modal.customer-placeholder')}
                    onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
                      updateStateField(item, type, listTag);
                      onChangeCustomer(listTag);
                    }}
                    isDisabled={shouldDisable || item.modifyFlag === 0}
                    validMsg={validateItem(item)}
                  />
                  {
                    showEditCustomer && <div className="text-blue text-right mt-2">
                      <a onClick={() => setOpenModalCustomer(true)}>{translate('activity.modal.show-edit-customer')}</a>
                    </div>
                  }
                </div>
              }
            </>
          case specialFName.interviewer:
          case specialFName.businessCardId:
            return renderInterview(item);
          case specialFName.customerRelationId:
            return <>
              {
                isDisplayFieldInfo(item) &&
                <div className="col-lg-6  form-group" key={`activityField_${item.fieldId}`}>
                  <ManagerSuggestSearch
                    id={item.fieldName}
                    title={getFieldLabel(item, 'fieldLabel')}
                    type={TagAutoCompleteType.Customer}
                    modeSelect={TagAutoCompleteMode.Multi}
                    inputClass="input-normal"
                    isRequired={item.modifyFlag === 3 || item.modifyFlag === 2}
                    elementTags={getDataTagStatusControl(item)}
                    placeholder={translate('activity.modal.customer-relation-placeholder')}
                    onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
                      updateStateField(item, type, listTag);
                    }}
                    customerIdChoice={getCustomerId()}
                    isDisabled={shouldDisable || item.modifyFlag === 0}
                    validMsg={validateItem(item)}
                  />
                </div>
              }
            </>
          case specialFName.nextScheduleId:
            return <>
              {
                isDisplayFieldInfo(item) &&
                <>
                  <div className="col-lg-12" key={`activityField_${item.fieldId}_next_schedule_date`}>
                    <div className="col-lg-6 form-group pl-0">
                      <label className="font-weight-bold">
                        {getFieldLabel(item, 'fieldLabel')}
                      </label>
                      <div>
                        <FieldEditDate fieldInfo={item}
                          fieldStyleClass={{
                            dateBox: {
                              search: {},
                              edit: {
                                wrapInput: "form-group common has-delete",
                                input: "input-normal input-common2 one-item"
                              }
                            }
                          }}
                          ref={nextScheduleRef}
                          isDisabled={shouldDisable || item.modifyFlag === 0}
                          updateStateElement={(keyElement, type, objEditValue) => {
                            updateStateField(keyElement, type, objEditValue);
                            if (objEditValue) {
                              if(isChanged) {
                                const param = {
                                  ...props.activityInfo?.activities?.nextSchedules,
                                  startDate: getDateTimeNextSchedule(objEditValue, false), // cmoment.utc(objEditValue, CommonUtil.getUseFormatDate()).format(),
                                  finishDate: getDateTimeNextSchedule(objEditValue, true) // moment.utc(objEditValue, CommonUtil.getUseFormatDate()).format()
                                }
                                setTimeout(() => {
                                  props.updateScheduleDataDraf(param);
                                }, 500)
                              }
                              setShowScheduleArea(true);
                            } else {
                              setShowScheduleArea(false);
                            }
                          }} />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 form-group wrap-calendar" key={`activityField_${item.fieldId}_next_schedule`}>
                    <div className="popup-calendar-tool-1">
                      {/* {showScheduleArea && <ScheduleArea changeScheduleData={setScheduleData} />} */}
                      {(showInitSchedule || showScheduleArea) && <div className="form-group">
                        <div className="show-search">
                          <CreateEdit isNotSave={true} modeEdit={showInitSchedule} extendFlag={true} extendHandle={handleDataPass} ref={createEditScheduleRef} resetEquipmentSuggest={props.resetEquipmentSuggest} />
                          {/* <CreateEdit extendFlag={true} scheduleData={scheduleData} filesData={filesSchedule} /> */}
                        </div>
                      </div>}
                    </div>
                  </div>
                </>
              }
            </>
          case specialFName.scenario:
            return <>
              {
                isDisplayFieldInfo(item) &&
                <ScenarioArea customerId={getCustomerId()} data={props.activityInfo?.scenario} key={`activityField_${item.fieldId}`} />
              }
            </>
          case specialFName.activityTime:
          case specialFName.activityStartTime:
          case specialFName.activityEndTime:
            return renderActivityDuration(item);
          case specialFName.employeeId:
            if (isDisplayFieldInfo(item)) {
              return <div className="col-lg-6 form-group" key={`activityField_${item.fieldId}`}>
                <label className="font-weight-bold">
                  {getFieldLabel(item, 'fieldLabel')}
                </label>
                <div className="mt-3  text-ellipsis">
                  {renderNameEmployee()}
                </div>
              </div>;
            } else {
              return <></>;
            }
          default:
            return renderDynamicField(item, idxRef, className);
        }
      })
    );
  }


  const renderContentTab = (listFieldContent: any[]) => {
    return <>{renderDynamicControlField(listFieldContent)}</>
  }

  const renderTab = () => {
    return <DynamicControlField
      controlType={ControlType.EDIT}
      showFieldLabel={false}
      fieldInfo={listFieldTab[0]}
      listFieldInfo={fieldInfoActivity}
      renderControlContent={renderContentTab}
    />
  }


  const renderTitleModal = () => {
    if (props.activityInfo?.activities?.activityId) {
      return translate('activity.modal.title-edit');
    } else {
      return translate('activity.modal.title-add');
    }
  }

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        // window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        props.onclickShowModalActivityForm(false);
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (props.activityDraftResponse?.activityFiles?.length > 0) {
      const arr = [];
      props.activityDraftResponse.activityFiles.forEach(element => {
        arr.push(element['key']);
      })
      setArrIgnoreUpdate(arr);
      props.activityDraftResponse.activityFiles.forEach(element => {
        const idxRef = fieldInfoActivity.findIndex(e => e.fieldName === element['key']);
        if (idxRef >= 0 && inputRefs[idxRef]?.current?.setValueEdit) {
          inputRefs[idxRef].current.setValueEdit(element['value']);
        }
      });
      setFileUploads({});
      filesActivity = {};
    }
  }, [props.activityDraftResponse])

  const renderToastMessage = () => {
    if (toastMessage === null) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={toastMessage.type}
        message={getErrorMessage(toastMessage.message)}
        className="message-area-bottom position-absolute"
      />
    )
  }

  /**
   * onCloseModalCustomer
   */
  const onCloseModalCustomer = () => {
    setOpenModalCustomer(false);
    props.getCustomer(getCustomerId())
  }

  /**
   * isPreview
   */
  const isPreview = () => {
    return props.activityViewMode === ACTIVITY_VIEW_MODES.PREVIEW
  }

  const onClickDeleteDraft = () => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };
    const accept = () => {
      props.onclickDelete(saveActivityData['activityDraftId'], true, true);
      props.toggleConfirmPopup(false);
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
   * onClickBack
   */
  const onClickBack = () => {
    if (!(props.popout || !props.canBack) && props.onCloseModalActivity) {
      props.onCloseModalActivity()
    }
  }

  /**
   * 
   */
  const isShowDeleleteDraft = () => {
    return activityActionType === ACTIVITY_ACTION_TYPES.UPDATE && !_.isNil(saveActivityData) && !_.isNil(saveActivityData['activityDraftId']);
  }

  const renderModal = () => {
    return (
      <>
        {/* popup */}
        <div className={`modal popup-esr popup-activity-esr2 show popup-align-right`} id="popup-esr" aria-hidden="true">
          <div className={showModal ? "modal-dialog form-popup" : "window-dialog form-popup"}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <a className={`icon-small-primary icon-return-small ${props.popout || !props.canBack ? 'disable' : ''}`} onClick={onClickBack} /><span
                      className="text">
                      <img className="icon-group-user" src="../../../content/images/ic-sidebar-activity.svg" alt="" />{renderTitleModal()}
                    </span>
                  </div>
                </div>
                <div className="right">
                  {showModal && <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />}
                  {showModal && <a className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModal(0)} />}
                </div>
              </div>
              <div className={"modal-body body-box style-3 body-padding overflow-x-hidden" + (!props.popout ? "" : " overflow-x-hidden overflow-y-hover activity-box-margin-b-80")} id={formClass}>
                {displayMessage()}
                {
                  showToastDraft && <div className="block-feedback block-feedback-blue m-4">
                    {translate('activity.modal.data-draft')}
                  </div>
                }

                <div className="break-row">
                  {/* {fieldInfoActivity && renderDynamicControlField(fieldInfoActivity)} */}
                  {isExistBeforeTab && listFieldBeforeTab && renderDynamicControlField(listFieldBeforeTab)}
                  {listFieldTab && listFieldTab.length > 0 && renderTab()}
                  {isExistAfterTab && listFieldAfterTab && renderDynamicControlField(listFieldAfterTab)}
                  {(!listFieldTab || listFieldTab.length === 0) && renderDynamicControlField(listFieldNormal)}
                </div>
              </div>
              <div className="user-popup-form-bottom">
                <a className="button-cancel mr-1" onClick={() => handleCloseModal(1)} >{translate('activity.common.button-cancel')}</a>
                {
                  isShowDeleleteDraft() && <a className="button-red mr-1" onClick={onClickDeleteDraft} >{translate('activity.modal.delete-draft')}</a>
                }

                {/* {!props.activityInfo?.activities?.activityId && <a className="button-white-grey mr-1" onClick={() => handleSave(true)}>{translate('activity.modal.button-save-draft')}</a>} */}
                <a className={`button-blue ml-1 ${isPreview() ? "disable" : ""}`}
                  onClick={() => { if (!isPreview()) handleSave() }}>
                  {props.activityId ? translate('activity.modal.button-edit') : translate('activity.modal.button-save')}
                </a>
              </div>
              {renderToastMessage()}
            </div>
          </div>

        </div>
        {/* popup */}

        {openModalCustomer && (
          <CreateEditCustomerModal
            id={employeeEditCtrlId[0]}
            toggleCloseModalCustomer={onCloseModalCustomer}
            customerActionType={CUSTOMER_ACTION_TYPES.UPDATE}
            customerViewMode={CUSTOMER_VIEW_MODES.EDITABLE}
            customerId={getCustomerId()}
          />
        )}
        {showConfirm && <ConfirmPopup infoObj={confirmPopupItem} />}
      </>
    );
  }

  if (showModal) {
    return (
      <>
        <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus zIndex="auto">
          {renderModal()}
        </Modal>
      </>
    );
  } else {
    if (props.popout) {
      return renderModal();
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = ({ activityListReducerState, applicationProfile, dataCreateEditSchedule }: IRootState) => ({
  listErrorMessage: activityListReducerState.listErrorMessage,
  productSuggestions: activityListReducerState.productSuggestions,
  errorMessage: activityListReducerState.errorMessage,
  successMessage: activityListReducerState.successMessage,
  errorValidates: activityListReducerState.errorItems,
  tenant: applicationProfile.tenant,
  productTradings: activityListReducerState.productTradings,
  listProductTradings: activityListReducerState.listProductTradings, // product tradings when select report target or customer
  activityDraftId: activityListReducerState.activityDraftId,
  activityDraftResponse: activityListReducerState.activityDraftResponse,
  customerInfo: activityListReducerState.customerInfo,
  activityInfo: activityListReducerState.activityInfo,
  idss: activityListReducerState.activityId,
  updatedDate: activityListReducerState.updateDate,
  action: activityListReducerState.action,
  customersByIds: activityListReducerState.customersByIds,
  milestonesByIds: activityListReducerState.milestonesByIds,
  schedulesByIds: activityListReducerState.schedulesByIds,
  tasksByIds: activityListReducerState.tasksByIds,
  isActionSaveDraft: activityListReducerState.isActionSaveDraft,
  deleteActivityDraftId: activityListReducerState.deleteActivityDraftId,
  scheduleData: dataCreateEditSchedule.scheduleData
});
const mapDispatchToProps = {
  saveData,
  onclickShowModalActivityForm,
  handleUpdateActivityInfo,
  handleClearResponseData,
  toggleConfirmPopup,
  handleGetProductTradings,
  saveActivivityDraft,
  getCustomer,
  handleGetDataActivity,
  updateScheduleDataDraf,
  resetDataForm,
  getCustomersByIds,
  getMilestonesByIds,
  getSchedulesByIds,
  getTasksByIds,
  resetDraftData,
  saveActivivityDraftManual,
  onclickDelete,
  resetEquipmentSuggest,
  discardDraft
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;


ActivityModalForm.defaultProps = {
  activityInfo: {
    activities: {
      isDraft: false,
      activityId: null,
      contactDate: moment().format(CommonUtil.getUseFormatDate()),
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
      memo: "",
      tasks: [],
      schedules: [],
      createdUser: null,
      updatedUser: null,
      activityData: null,
    },
    fieldInfoActivity: [],
    tabInfo: [],
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityModalForm);