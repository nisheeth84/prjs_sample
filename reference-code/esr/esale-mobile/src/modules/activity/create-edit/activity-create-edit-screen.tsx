import * as React from "react"
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert as ShowError
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Style } from "../../activity/common"
import { messages } from "./activity-create-edit-messages"
import { translate } from "../../../config/i18n"
import { ActivityCreateEditStyle } from "./activity-create-edit-style"
import RNDatePicker from "react-native-modal-datetime-picker"
import moment from "moment"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import { AppBarActivity } from "../app-bar-activity"
import {
  getActivity,
  ActivityResponse,
  Progresses
} from "../activity-repository"
import { useSelector, useDispatch } from "react-redux"
import { activityDetailActions, FieldItemsType, FieldInfo, ActivityFormat, Activity } from "../detail/activity-detail-reducer"
import { activityDetailSelector, fieldInfosSelector, dataInfoSelector } from "../detail/activity-detail-selector"
import { CalendarRegistration } from "../../calendar/screens/calendar-registration/calendar-addition"
import { DefineFieldType, ControlType, StatusButton, TypeButton, TypeMessage, ModifyFlag, AvailableFlag } from "../../../config/constants/enum"
import _ from "lodash"
import StringUtils from "../../../shared/util/string-utils"
import { DynamicControlField } from "../../../shared/components/dynamic-form/control-field/dynamic-control-field"
import BaseModal from "../../calendar/common/modal"
import { TEXT_EMPTY, APP_DATE_FORMAT, FIELD_LABLE } from "../../../config/constants/constants"
import { StackScreen, SpecialFieldInfo, TypeConfirm, ActivityDefaultFieldInfo, ActivityRegisterEditMode } from "../constants"
import { ProductSuggestView } from "./product/product-suggest-view"
import { ReportSuggestView } from "./schedules/schedules-suggest-view"
import { BusinessCardSuggestView } from "./business-card/business-card-suggest-view"
import { ScenarioView } from "./scenario/scenario-view"
import { CommonButton } from "../../../shared/components/button-input/button"
import {
  getActivityLayout,
  updateActivities,
  createActivities,
  createActivityDraft,
  getActivityDraft
} from "./activity-create-edit-repository"
import { ActivityDurationView } from "./activity-duration/activity-duration-view"
import { authorizationSelector } from "../../login/authorization/authorization-selector"
import { ModalConfirm } from "../modal-confirm"
import { CommonUtil } from "../common/common-util"
import { CommonMessage } from "./../../../shared/components/message/message"
import { messagesComon } from "./../../../shared/utils/common-messages"
import { LoadState } from "../../../types"
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator"
import { DetailScreenStyles } from "../../employees/detail/detail-style"
import { CustomerSuggestView } from "../../../shared/components/suggestions/customer/customer-suggest-view"
import { TypeSelectSuggest } from "../../../config/constants/enum"

/**
 * Component for create edit activity
 * @param route 
 */
export const ActivityCreateEditScreen = (route: any) => {
  /**
   * navigate param
   */
  const activityParams = route?.route.params
  const dispatch = useDispatch()
  const timerRef = React.useRef<any>()
  const navigation = useNavigation()

  /**
   * special field not display on mobile
   */
  const fieldInfoNotDisplay = [ActivityDefaultFieldInfo.CREATED_DATE, ActivityDefaultFieldInfo.CREATED_USER, ActivityDefaultFieldInfo.UPDATED_DATE, ActivityDefaultFieldInfo.UPDATED_USER, ActivityDefaultFieldInfo.EMPLOYEE_ID]

  /**
   * languageCode
   */
  const authorizationState = useSelector(authorizationSelector)
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY
  // Initial data
  const activityData = useSelector(activityDetailSelector)
  const dataInfo = useSelector(dataInfoSelector)
  const fieldInfoActivity = useSelector(fieldInfosSelector)

  const [loadState, setLoadState] = useState<LoadState>('initial')

  /**
   * dynamic field list
   */
  const [fieldInfos, setFieldInfos] = useState<Array<FieldInfo>>([])

  /**
   * activity format list 
   */
  const [activityFormatList, setActivityFormatList] = useState<Array<ActivityFormat>>([])

  /**
   * show date picker schedule
   */
  const [showNextScheduleDatePicker, setShowNextScheduleDatePicker] = useState(false)

  // data to save
  const [saveActivityData, setSaveActivityData] = useState<any>({})

  /**
   * modal when close
   */
  const [showModalConfirmClose, setShowModalConfirmClose] = useState(false)

  /**
   * Status of modal confirm
   */
  const [showModalConfirm, setShowModalConfirm] = useState(false)

  /**
   * customerId to search productTradings
   */
  const [customerId, setCustomerId] = useState<any>(null)

  /**
   * map file 
   */
  const [mapFile, setMapFile] = useState(new Map())

  /**
   * customerId temporary
   */
  const [customerIdTemporary, setCustomerIdTemporary] = useState<any>()

  /**
   * boolean show Error
   */
  const [isErrorCallAPI, setIsErrorCallAPI] = useState<any>(null)

  /**
   * time loop auto save draft
   */
  const INTERVAL_TIME = 5000

  React.useEffect(() => {
    setLoadState('loading')
    if (activityParams?.mode !== ActivityRegisterEditMode.REGISTER) {
      if (activityParams?.activityDraftId > 0) {
        getActivityDraftApi()
      } else {
        getActivityApi()
      }
    } else if (activityParams?.mode === ActivityRegisterEditMode.REGISTER) {
      getDataActivityLayout()
      if (activityParams?.activityDraftId > 0) {
        getActivityDraftApi()
      }
    }
    if (activityParams.customerId) {
      setCustomerId(activityParams.customerId)
      if (activityParams.productTradings) {
        dispatch(activityDetailActions.getActivity(activityParams))
      }
    }
  }, [])

  React.useEffect(() => {
    setFieldInfos(handleFieldInfo())
    if (activityData?.activityFormats && activityData?.activityFormats.length > 0) {
      setActivityFormatList(_.cloneDeep(activityData?.activityFormats))
    }
    // copy value customerRelationId to customerId for component customerSuggestion
    if (activityData?.customerRelations && activityData?.customerRelations.length > 0) {
      activityData?.customerRelations.forEach(customer => {
        customer["customerId"] = customer["customerRelationId"]
      })
    }
    initData(activityData)
  }, [activityData])

  React.useEffect(() => {
    setFieldInfos(handleFieldInfo())
    setActivityFormatList(_.cloneDeep(dataInfo?.activitiesFormats))
    initData()
  }, [dataInfo])

  /**
   * handle product trading field info
   * @param response 
   */
  const handleProductTradingFieldInfo = (responseData: any) => {
    if (responseData?.fieldInfoProductTrading?.length > 0) {
      const fieldInfoProductTradingList = responseData?.fieldInfoProductTrading
      fieldInfoProductTradingList.forEach((field: FieldInfo) => {
        if (field.fieldName === "product_trading_progress_id") {
          field["fieldType"] = Number(DefineFieldType.SINGER_SELECTBOX)
          const progressList: FieldItemsType[] = []
          if (responseData?.progresses?.length > 0) {
            responseData.progresses.forEach((progress: Progresses) => {
              progressList.push({
                itemId: progress.productTradingProgressId,
                itemLabel: progress.progressName,
                isAvailable: progress.isAvailable,
                itemOrder: progress.progressOrder,
                isDefault: false
              })
            })
          }
          field["fieldItems"] = progressList
        } else if (field.fieldName === "employee_id") {
          field["fieldType"] = Number(DefineFieldType.RELATION)
        }
      })
      return fieldInfoProductTradingList
    } else {
      return []
    }
  }
  /**
   * active auto save draft
   */
  const handleAutoSaveDraft = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(callAPISaveDraft, INTERVAL_TIME)
  }

  /**
   * call api create/edit draft
   */
  const callAPISaveDraft = async () => {
    const saveDraftData = updateSaveData()
    let response = await createActivityDraft(saveDraftData)
    if (response && response.status === 200) {
      saveActivityData["activityDraftId"] = response.data
    }
  }

  /**
   * call api get activity
   */
  async function getActivityDraftApi() {
    const payload = {
      activityDraftId: activityParams.activityDraftId
    }
    const responseData = await getActivityDraft(payload)
    if (responseData) {
      handleErrorGetActivity(responseData)
    }
  }

  /**
   * call api get activity
   */
  async function getActivityApi() {
    const payload = {
      activityId: activityParams.activityId,
      mode: "edit"
    }
    const responseData = await getActivity(payload)
    if (responseData) {
      handleErrorGetActivity(responseData)
    }
  }

  /**
   * handle field info after call api
   */
  const handleFieldInfo = () => {
    const fields = _.cloneDeep(fieldInfoActivity)
    if (fields && fields.length > 0) {
      fields.forEach(field => {
        if (field.fieldName === SpecialFieldInfo.ACTIVITY_FORMAT_ID) {
          field.fieldType = Number(DefineFieldType.SINGER_SELECTBOX)
          let activityFormatList: Array<ActivityFormat> = activityData?.activityFormats || dataInfo.activitiesFormats
          field.fieldItems = convertToFiledItems(activityFormatList)
        }
      })
      fields.sort((a, b) => { return a.fieldOrder - b.fieldOrder })
    }
    return fields
  }

  /**
   * Call API getActivityLayout
   */
  async function getDataActivityLayout() {
    try {
      const getActivityLayoutResponse = await getActivityLayout({})
      if (getActivityLayoutResponse?.status === 200) {
        const responseData = getActivityLayoutResponse?.data
        responseData["fieldInfoProductTrading"] = handleProductTradingFieldInfo(responseData)
        dispatch(activityDetailActions.getActivityLayout(responseData))
        setLoadState('succeeded')
      } else {
        setLoadState('failed')
      }
    }
    catch (error) {
      ShowError.alert("Message", error.message)
    }
  }

  /**
   * default value for create activity
   */
  const initData = (activity?: Activity) => {
    if (activityParams?.mode === ActivityRegisterEditMode.REGISTER) {
      saveActivityData["contactDate"] = CommonUtil.toTimeStamp(new Date().setHours(0, 0, 0, 0))
      saveActivityData["activityStartTime"] = CommonUtil.toTimeStamp(new Date().getTime() - 60 * 60 * 1000)
      saveActivityData["activityEndTime"] = CommonUtil.toTimeStamp(new Date())
      saveActivityData["activityDuration"] = 60
    } else if (activityParams?.mode !== ActivityRegisterEditMode.REGISTER) {
      if (activityParams?.mode === ActivityRegisterEditMode.EDIT) {
        saveActivityData["activityId"] = activity?.activityId
      }
      saveActivityData["contactDate"] = CommonUtil.toTimeStamp(activity?.contactDate)
      saveActivityData["activityStartTime"] = CommonUtil.toTimeStamp(activity?.activityStartTime)
      saveActivityData["activityEndTime"] = CommonUtil.toTimeStamp(activity?.activityEndTime)
      saveActivityData["activityDuration"] = activity?.activityDuration
      saveActivityData["activityFormatId"] = activity?.activityFormatId
      saveActivityData["customerId"] = activity?.customer?.customerId
      saveActivityData["memo"] = activity?.memo
      saveActivityData["updatedDate"] = activity?.updatedUser?.updatedDate
      saveActivityData["activityDraftId"] = activity?.activityDraftId
      saveActivityData["nextSchedule"] = activity?.nextSchedule
    }
    setSaveActivityData(_.cloneDeep(saveActivityData))
  }

  /**
   * handle error call API get activity
   */
  const handleErrorGetActivity = (response: ActivityResponse) => {
    switch (response.status) {
      case 400: {
        ShowError.alert("Notify", "Bad request!")
        setLoadState('failed')
        break
      }
      case 500: {
        ShowError.alert("Notify", "Server error!")
        setLoadState('failed')
        break
      }
      case 403: {
        ShowError.alert("Notify", "You don't have permission get activity!")
        setLoadState('failed')
        break
      }
      case 200: {
        const responseData = response.data
        responseData["progresses"] = handleProductTradingFieldInfo(responseData)
        dispatch(activityDetailActions.getActivity(responseData))
        setLoadState('succeeded')
        break
      }
      default: {
        setLoadState('noData')
        ShowError.alert("Notify", "Error!")
      }
    }
  }

  /**
   * action change value nextScheduleDate, show schedule
   * @param date
   */
  const handleConfirmNextScheduleDate = (date: any) => {
    setShowNextScheduleDatePicker(false)
    saveActivityData["nextScheduleDate"] = moment(date).format(APP_DATE_FORMAT)
    setSaveActivityData(_.cloneDeep(saveActivityData))
    handleAutoSaveDraft()
  }

  /**
   * change value of state
   * @param fieldName 
   * @param item 
   * @param index 
   */
  const changeValueProperty = (fieldName: string, value: any) => {
    let newParams: any = { ...saveActivityData }
    newParams[fieldName] = value
    setSaveActivityData(_.cloneDeep(newParams))
    handleAutoSaveDraft()
  }

  /**
   * Go back to list screen or detail screen
   * @param activityId 
   */
  const handleNavigate = (activityId?: number) => {
    setSaveActivityData({})
    setFieldInfos([])
    dispatch(activityDetailActions.getActivity({}))
    dispatch(activityDetailActions.getActivityLayout({}))
    if (activityId) {
      navigation.navigate(StackScreen.ACTIVITY_DETAIL, { activityId: activityId })
    } else {
      navigation.goBack()
    }
    clearInterval(timerRef.current)
  }

  /**
   * create save data, get the necessary data
   */
  const updateSaveData = () => {
    const mainData: any = {}
    mainData["activityId"] = saveActivityData["activityId"]
    mainData["contactDate"] = CommonUtil.toTimeStamp(saveActivityData["contactDate"])
    mainData["activityStartTime"] = CommonUtil.toTimeStamp(saveActivityData["activityStartTime"])
    mainData["activityEndTime"] = CommonUtil.toTimeStamp(saveActivityData["activityEndTime"])
    mainData["activityDuration"] = saveActivityData["activityDuration"]
    mainData["scheduleId"] = saveActivityData["scheduleId"]
    mainData["taskId"] = saveActivityData["taskId"]
    mainData["milestoneId"] = saveActivityData["milestoneId"]
    mainData["activityFormatId"] = saveActivityData["activityFormatId"]
    mainData["customerId"] = saveActivityData["customerId"]
    mainData["businessCardIds"] = saveActivityData["businessCardIds"]
    mainData["interviews"] = saveActivityData["interviews"]
    mainData["memo"] = saveActivityData["memo"]
    mainData["updatedDate"] = saveActivityData["updatedDate"]
    if (saveActivityData["activityData"] && saveActivityData["activityData"].length > 0) {
      saveActivityData["activityData"].forEach((element: any) => {
        if (element.fieldType === DefineFieldType.DATE_TIME || element.fieldType === DefineFieldType.DATE) {
          element.value = CommonUtil.toTimeStamp(element.value)
        }
      })
    }
    mainData["activityData"] = saveActivityData["activityData"]

    const saveData: any = {}
    saveData["activityDraftId"] = saveActivityData["activityDraftId"]
    saveData["data"] = mainData
    saveData["dataProductTradings"] = saveActivityData["dataProductTradings"]
    saveData["nextSchedule"] = saveActivityData["nextSchedule"]
    return CommonUtil.convertFormFile(saveData)
  }

  /**
   * action create activity
   */
  const createActivitiesFunc = async () => {
    const saveData = updateSaveData()
    const response = await createActivities(saveData)
    handleCreateEditActivity(response)
  }

  /**
   * action edit activity
   */
  const updateActivitiesFunc = async () => {
    const saveData = updateSaveData()
    const response = await updateActivities(saveData)
    handleCreateEditActivity(response)
  }

  /**
   * action after call api create/edit activity
   * @param response 
   */
  const handleCreateEditActivity = (response: any) => {
    if (response && response.status === 200) {
      handleNavigate(response.data)
      setIsErrorCallAPI(null)
      setLoadState('succeeded')
    } else {
      setIsErrorCallAPI(activityParams?.mode)
      setLoadState('failed')
    }
  }

  /**
   * get default data 
   * @param item 
   */
  const getDataStatusControl = (item: any) => {
    if (!item) {
      return null
    }
    if (item.fieldType.toString() === DefineFieldType.CALCULATION) {
      return { fieldValue: saveActivityData }
    }
    let saveData: any = null
    if (saveActivityData !== undefined && saveActivityData !== null && Object.keys(saveActivityData).length > 0) {
      saveData = saveActivityData
    } else if (activityData !== undefined && activityData !== null) {
      saveData = activityData
    }
    if (saveData) {
      let fieldValue
      if (item.isDefault) {
        fieldValue = saveData[StringUtils.snakeCaseToCamelCase(item.fieldName)]
      } else if (saveData["activityData"] !== undefined) {
        // extend field is in node "activityData"
        fieldValue = getExtendFieldValue(saveData["activityData"], item.fieldName)
      }

      if (fieldValue !== undefined) {
        const dataStatus = { ...item }
        dataStatus.fieldValue = fieldValue
        return dataStatus
      }
    }
    return null
  }

  /**
   * get extend field value
   * @param extendFieldList 
   * @param fieldName 
   */
  const getExtendFieldValue = (extendFieldList: any, fieldName: any) => {
    if (!extendFieldList) {
      return undefined
    }
    let retField: any = null
    extendFieldList.map((field: any) => {
      if (field.key === fieldName) {
        retField = field
      }
    })
    if (retField) {
      return retField.value
    }
    return undefined
  }

  /**
   * create new data field extend
   * @param item 
   * @param val 
   */
  const createExtItem = (item: any, val: any) => {
    const isArray = Array.isArray(val)
    const itemValue = isArray || (typeof val === "object") ? JSON.stringify(val) : val ? val.toString() : TEXT_EMPTY
    return {
      fieldType: item.fieldType.toString(),
      key: item.fieldName,
      value: itemValue
    }
  }

  /**
   * add extend field to list extend field
   * @param item 
   * @param val 
   * @param saveData 
   */
  const addExtendField = (item: any, val: any, saveData: any) => {
    let addItem: any = null
    if (item.fieldType.toString() === DefineFieldType.LOOKUP) {
      addItem = []
      let arrVal = []
      try {
        arrVal = _.isString(val) ? JSON.parse(val) : val
      } catch (e) {
        arrVal = []
      }
      arrVal.forEach((obj: any) => {
        addItem.push(createExtItem(obj.fieldInfo, obj.value))
      })
    } else {
      addItem = createExtItem(item, val)
    }
    if (Array.isArray(addItem)) {
      addItem.forEach(addIt => {
        addToActivityData(addIt, saveData)
      })
    } else {
      addToActivityData(addItem, saveData)
    }
  }

  /**
   * save data extend field list
   * @param addItem 
   * @param saveData 
   */
  const addToActivityData = (addItem: any, saveData: any) => {
    if (saveData["activityData"]) {
      let notInArray = true
      saveData["activityData"].map((e: any, index: number) => {
        if (e.key === addItem.key) {
          notInArray = false
          saveData["activityData"][index] = addItem
        }
      })
      if (notInArray) {
        saveData["activityData"].push(addItem)
      }
    } else {
      saveData["activityData"] = [addItem]
    }
  }

  /**
   * update data of nextSchedule
   * @param scheduleData 
   */
  const updateNextScheduleData = (scheduleData: any) => {
    saveActivityData["nextSchedule"] = scheduleData
    setSaveActivityData(_.cloneDeep(saveActivityData))
    handleAutoSaveDraft()
  }

  /**
   * update value of dynamic field
   * @param item 
   * @param type 
   * @param val 
   */
  const updateStateField = (item: any, type: any, val: any) => {
    let fieldInfo: any = null
    fieldInfos.forEach((field: any) => {
      if (field.fieldId.toString() === item.fieldId.toString()) {
        fieldInfo = field
      }
    })
    if (saveActivityData !== null && saveActivityData !== undefined && fieldInfo) {
      if (fieldInfo.fieldType.toString() === DefineFieldType.DATE || fieldInfo.fieldType.toString() === DefineFieldType.DATE_TIME) {
        val = CommonUtil.toTimeStamp(val)
      } else if (fieldInfo.fieldType.toString() === DefineFieldType.FILE) {
        const activityMapFile = _.cloneDeep(mapFile)
        activityMapFile.set(fieldInfo.fieldName, val)
        setMapFile(activityMapFile)
      }
      if (_.isEqual(DefineFieldType.LOOKUP, _.toString(type))) {
        const valueLookup = _.isArray(val) ? val : _.toArray(val)
        valueLookup.forEach(e => {
          const idx = fieldInfos.findIndex((o: any) => o.fieldId === e.fieldInfo.fieldId)
          if (idx >= 0) {
            let field: any = fieldInfos[idx]
            if (field.isDefault) {
              saveActivityData[fieldInfo[idx].fieldName] = e.value
            } else {
              addExtendField(field, e.value, saveActivityData)
              setSaveActivityData(_.cloneDeep(saveActivityData))
            }
          }
        })
      } else if (fieldInfo.isDefault) {
        saveActivityData[StringUtils.snakeCaseToCamelCase(fieldInfo.fieldName)] = forceNullIfEmptyString(fieldInfo, val)
        setSaveActivityData(_.cloneDeep(saveActivityData))
      } else if (!fieldInfo.isDefault) {
        addExtendField(fieldInfo, val, saveActivityData)
      }
    }
    handleAutoSaveDraft()
  }

  /**
   * languageId and timezoneId is Long
   * 
   * @param field 
   * @param val 
   */
  const forceNullIfEmptyString = (field: any, val: any) => {
    if (val === TEXT_EMPTY &&
      (field.fieldName === "language_id"
        || field.fieldName === "timezone_id"
        || field.fieldName === "telephone_number"
        || field.fieldName === "cellphone_number"
      )
    ) {
      return null
    }
    return val
  }

  /**
   * Update value for customerId
   */
  const handleCustomer = (_customerId: any) => {
    setCustomerIdTemporary(_customerId)
    if (customerId && targetReportIsExist()) {
      setShowModalConfirm(true)
    } else {
      saveActivityData["customerId"] = _customerId
      setSaveActivityData(_.cloneDeep(saveActivityData))
      setCustomerId(_customerId)
    }
    handleAutoSaveDraft()
  }

  /**
   * Update value for customerRelationIds
   * @param customerRelationList 
   */
  const handleCustomerRelations = (customerRelationList: any[]) => {
    const customerRelationIds: any[] = []
    if (customerRelationList && customerRelationList.length > 0) {
      customerRelationList.forEach(customer => {
        if (customer.customerId !== customerId) {
          customerRelationIds.push(customer.customerId)
        }
      })
    }
    saveActivityData["customerRelationIds"] = customerRelationIds
    setSaveActivityData(_.cloneDeep(saveActivityData))
    handleAutoSaveDraft()
  }

  /**
   * check target report is exist
   */
  const targetReportIsExist = () => {
    if (!saveActivityData["scheduleId"] && !saveActivityData["taskId"] && !saveActivityData["milestoneId"]) {
      return false
    }
    return true
  }

  /**
   * Check display for dynamic field
   */
  const isDisplayFieldInfo = (field: any): boolean => {
    if (!saveActivityData?.["activityFormatId"]) {
      if (field.availableFlag < AvailableFlag.AVAILABLE_IN_APP) {
        return false
      } else {
        return true
      }
    } else {
      if (!field || fieldInfoNotDisplay.includes(field.fieldName)) {
        return false
      }
      let isDisplay: boolean = false
      activityFormatList.forEach((format: any) => {
        if (format.activityFormatId === saveActivityData["activityFormatId"]) {
          if (format.fieldUse) {
            const data = JSON.parse(format.fieldUse)
            Object.keys(data).forEach(key => {
              if (Number(key) === field.fieldId && data[key] === 1) {
                isDisplay = true
              }
            })
          }
        }
      })
      return isDisplay
    }
  }

  /**
   * update businessCards, interviews property in saveActivityData
   * @param data 
   */
  const updateDataBusinessCard = (data: any) => {
    const businessCards: Array<number> = []
    const interviews: Array<string> = []
    for (const item of data) {
      if (item.businessCardId > 0) {
        businessCards.push(item.businessCardId)
      } else {
        interviews.push(item.customerName)
      }
    }
    saveActivityData["businessCardIds"] = businessCards
    saveActivityData["interviews"] = interviews
    handleAutoSaveDraft()
  }

  /**
   * update report target data
   * @param data 
   */
  const updateReportTargetData = (data: any) => {
    if (data?.scheduleId) {
      saveActivityData["scheduleId"] = data.scheduleId
      saveActivityData["taskId"] = null
      saveActivityData["milestoneId"] = null
    } else if (data?.taskId) {
      saveActivityData["scheduleId"] = null
      saveActivityData["taskId"] = data.taskId
      saveActivityData["milestoneId"] = null
    } else if (data?.milestoneId) {
      saveActivityData["scheduleId"] = null
      saveActivityData["taskId"] = null
      saveActivityData["milestoneId"] = data.milestoneId
    }
    // TODO update customerId when not choose customer
    if (!customerId && data?.customerId) {
      setCustomerId(data.customerId)
    }
    handleAutoSaveDraft()
  }

  /**
   * clear when accept changed customerId
   */
  const processClearTargetReport = () => {
    saveActivityData["scheduleId"] = null
    saveActivityData["taskId"] = null
    saveActivityData["milestoneId"] = null
    setShowModalConfirm(false)
    saveActivityData["customerId"] = customerIdTemporary
    setCustomerId(customerIdTemporary)
    setSaveActivityData(_.cloneDeep(saveActivityData))
    handleAutoSaveDraft()
  }

  /**
   * convert list activity format to fieldItems
   * @param formats 
   */
  const convertToFiledItems = (formats: Array<ActivityFormat>): Array<FieldItemsType> => {
    const lst: Array<FieldItemsType> = []
    if (formats && formats.length > 0) {
      formats.forEach((e: ActivityFormat) => {
        lst.push({
          itemId: e.activityFormatId,
          itemLabel: e.name,
          isAvailable: e.isAvailable,
          itemOrder: e.displayOrder,
          isDefault: activityData?.activityFormatId ? e.activityFormatId === activityData.activityFormatId : false
        })
      })
    }
    return lst
  }

  return (
    <View style={Style.body}>
      {activityParams?.mode !== ActivityRegisterEditMode.EDIT && <AppBarActivity
        buttonType={TypeButton.BUTTON_SUCCESS}
        buttonDisabled={StatusButton.ENABLE}
        title={translate(messages.activityCreateTitle)}
        buttonText={translate(messages.btnRegistrationName)}
        handleLeftPress={() => setShowModalConfirmClose(true)}
        onPress={() => {
          setLoadState('loading')
          createActivitiesFunc()
        }}
      />}
      {activityParams?.mode === ActivityRegisterEditMode.EDIT && <AppBarActivity
        buttonType={TypeButton.BUTTON_SUCCESS}
        buttonDisabled={StatusButton.ENABLE}
        title={translate(messages.activityEditTitle)}
        buttonText={translate(messages.btnSave)}
        handleLeftPress={() => setShowModalConfirmClose(true)}
        onPress={() => {
          setLoadState('loading')
          updateActivitiesFunc()
        }}
      />}
      <ScrollView nestedScrollEnabled={true}>
        {loadState === 'loading' &&
          <AppIndicator size={30} style={DetailScreenStyles.loadingView} />
        }
        {
          isErrorCallAPI && isErrorCallAPI === ActivityRegisterEditMode.REGISTER &&
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity>
              <CommonMessage content={translate(messagesComon.ERR_COM_0003)} type={TypeMessage.ERROR}></CommonMessage>
            </TouchableOpacity>
          </View>
        }
        {
          isErrorCallAPI && isErrorCallAPI === ActivityRegisterEditMode.EDIT &&
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity>
              <CommonMessage content={translate(messagesComon.ERR_COM_0004)} type={TypeMessage.ERROR}></CommonMessage>
            </TouchableOpacity>
          </View>
        }
        <KeyboardAwareScrollView style={[ActivityCreateEditStyle.ActivityList]}>
          {
            fieldInfos && fieldInfos.length > 0 &&
            fieldInfos.map(field => {
              const title = StringUtils.getFieldLabel(field, FIELD_LABLE, languageCode)
              const isRequire = field.modifyFlag >= ModifyFlag.REQUIRED_INPUT
              if (isDisplayFieldInfo(field)) {
                if (field.fieldName === SpecialFieldInfo.ACTIVITY_TIME) {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <ActivityDurationView
                        updateStateField={(property, value) => changeValueProperty(property, value)}
                        itemDataField={field}
                        startTime={saveActivityData["activityStartTime"]}
                        endTime={saveActivityData["activityEndTime"]}
                        duration={saveActivityData["activityDuration"]}
                        fieldLabel={title}
                      >
                      </ActivityDurationView>
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.ACTIVITY_TARGET_ID) {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <View style={[ActivityCreateEditStyle.ActivityTop]}>
                        <Text style={[ActivityCreateEditStyle.ActivityTitle, ActivityCreateEditStyle.FontWeight]}>
                          {title}
                        </Text>
                      </View>
                      <ReportSuggestView updateSelectedItem={(data) => { updateReportTargetData(data) }} customerId={customerId} />
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.CUSTOMER_ID) {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <CustomerSuggestView
                        typeSearch={TypeSelectSuggest.SINGLE}
                        fieldLabel={title}
                        updateStateElement={(searchValue) => { handleCustomer(searchValue.length > 0 ? searchValue[0].customerId : null) }}
                        isRequire={isRequire}
                        initData={activityData?.customer ? [activityData?.customer] : []}
                      />
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.INTERVIEWER) {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <BusinessCardSuggestView
                        updateStateElement={(data) => { updateDataBusinessCard(data) }}
                        fieldLabel={title}
                        customerId={customerId}
                      />
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.CUSTOMER_RELATION_IDS) {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <CustomerSuggestView
                        typeSearch={TypeSelectSuggest.MULTI}
                        fieldLabel={title}
                        updateStateElement={(searchValue) => { handleCustomerRelations(searchValue) }}
                        isRequire={isRequire}
                        isRelation={true}
                        initData={activityData?.customerRelations ? activityData?.customerRelations : []}
                        listIdChoice={[customerId] || []}
                      />
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.NEXT_SCHEDULE_ID) {
                  return (
                    <View key={field.fieldId}>
                      <View style={[ActivityCreateEditStyle.ActivityItem]}>
                        <View style={[ActivityCreateEditStyle.ActivityTop]}>
                          <Text style={[ActivityCreateEditStyle.ActivityTitle]}>
                            {title}
                          </Text>
                        </View>
                        <View style={[ActivityCreateEditStyle.ActivityContent]}>
                          <TouchableOpacity
                            style={[ActivityCreateEditStyle.ActivityButton]}
                            onPress={() => { setShowNextScheduleDatePicker(true) }}
                          >
                            <Text style={ActivityCreateEditStyle.txtTime}>{saveActivityData?.nextScheduleDate ? saveActivityData?.nextScheduleDate : translate(messages.editNextSchedulev2)}</Text>
                          </TouchableOpacity>
                          <RNDatePicker
                            isVisible={showNextScheduleDatePicker}
                            mode="date"
                            date={moment().toDate()}
                            onCancel={() => { setShowNextScheduleDatePicker(false) }}
                            onConfirm={(date) => { handleConfirmNextScheduleDate(date) }}
                          />
                        </View>
                      </View>
                      {
                        saveActivityData?.nextScheduleDate &&
                        <View style={[ActivityCreateEditStyle.ActivityItem]}>
                          <View style={[ActivityCreateEditStyle.ActivityContent]}>
                            <View style={[ActivityCreateEditStyle.ActivityExtends]}>
                              <CalendarRegistration
                                calendar={saveActivityData?.nextSchedule}
                                callbackFunction={(calendar) => { updateNextScheduleData(calendar) }}
                                isCheckValidate={3}
                              />
                            </View>
                          </View>
                        </View>
                      }
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.SCENARIO_ID) {
                  return (
                    saveActivityData?.customerId &&
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <View style={ActivityCreateEditStyle.ViewBox}>
                        <View style={[ActivityCreateEditStyle.ActivityTop]}>
                          <Text style={[ActivityCreateEditStyle.ActivityTitle, ActivityCreateEditStyle.FontWeight]}>{title}</Text>
                        </View>
                        <TouchableOpacity>
                          <Text style={[ActivityCreateEditStyle.textRight, ActivityCreateEditStyle.textBorder]}>
                            {translate(messages.labelLinkScenario)}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <ScenarioView customerId={saveActivityData?.customerId} />
                    </View>
                  )
                } else if (field.fieldName === SpecialFieldInfo.PRODUCT_TRADING_ID) {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <ProductSuggestView
                        actionMode={activityParams?.mode}
                        updateStateElement={(property, value) => { changeValueProperty(property, value) }}
                        fieldLabel={translate(messages.transactionProduct)}
                        customerId={customerId}
                        activityFormatId={saveActivityData["activityFormatId"]}
                        activityFormatList={activityFormatList}
                      />
                    </View>
                  )
                } else {
                  return (
                    <View key={field.fieldId} style={[ActivityCreateEditStyle.ActivityItem]}>
                      <DynamicControlField
                        controlType={ControlType.ADD_EDIT}
                        fieldInfo={field}
                        updateStateElement={updateStateField}
                        elementStatus={getDataStatusControl(field)}
                      />
                    </View>
                  )
                }
              } else { return null }
            })
          }
        </KeyboardAwareScrollView>
      </ScrollView>
      <BaseModal
        isVisible={showModalConfirmClose}
        onBackdropPress={() => setShowModalConfirmClose(false)}
      >
        <View style={Style.modal}>
          <Text style={Style.titleModal}>{translate(messages.modalCloseTitle)}</Text>
          <View style={[Style.modalContent]}>
            <Text style={Style.textAlignCenter}>{translate(messages.modalWarningMessage)}</Text>
            <Text style={Style.textAlignCenter}>{translate(messages.modalConfirmMessage)}</Text>
          </View>
          <View style={Style.footerModal}>
            <CommonButton onPress={() => { setShowModalConfirmClose(false) }} status={StatusButton.ENABLE} icon="" textButton={translate(messages.modalCancelButton)} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
            <CommonButton onPress={() => { clearInterval(timerRef.current); callAPISaveDraft() }} status={StatusButton.ENABLE} icon="" textButton={translate(messages.modalSaveDraftButton)} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
            <CommonButton onPress={() => { handleNavigate() }} status={StatusButton.ENABLE} icon="" textButton={translate(messages.modalDiscardButton)} typeButton={TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
          </View>
        </View>
      </BaseModal>
      {/** Modal confirm when change customer */}
      <ModalConfirm
        isVisible={showModalConfirm}
        setIsVisible={(isVisible: boolean) => setShowModalConfirm(isVisible)}
        titleModal={translate(messages.clearTargetReportMessage)}
        processActionCallBack={() => processClearTargetReport()}
        typeModal={TypeConfirm.AGREE}
      >
      </ModalConfirm>
    </View>
  )
}