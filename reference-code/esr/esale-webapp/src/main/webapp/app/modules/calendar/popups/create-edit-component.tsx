import React, { ReactElement, useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { connect, Options } from 'react-redux'
import moment, { Moment } from 'moment'
import jwtDecode from 'jwt-decode';

import BeautyPullDown from './../common/beauty-pull-down'
import BeautyPullDownForEquipment from '../common/beauty-pull-down'
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete'
import DatePicker from 'app/shared/layout/common/date-picker'
import {
  FlagEditRepeatedSchedule,
  ScheduleRepeatEndType,
  ScheduleRepeatMonthType,
  ScheduleRepeatType,
  getJsonBName,
  ACTION_LOCAL_NAVIGATION
} from '../constants'
import { IRootState } from 'app/shared/reducers'
import { GetSchedule, ScheduleFile } from '../models/get-schedule-type'
import {
  beforeCheckStoreSchedule,
  getEquipmentSuggestionsData,
  getScheduleTypes,
  reloadGridData,
  storeSchedule,
  TYPE_SCREEN,
  updateScheduleDataDraf
} from './create-edit-schedule.reducer'
import { getEquipmentTypes } from 'app/modules/calendar/grid/calendar-grid.reducer'
import TimePicker from '../../../shared/layout/dynamic-form/control-field/component/time-picker'

import 'rc-time-picker/assets/index.css'
import { hasAnyAuthority } from 'app/shared/auth/menu-private-route'
import { AUTHORITIES, ControlType } from 'app/config/constants'
// import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message'
import { Storage, translate } from 'react-jhipster'
import DynamicControlField from "app/shared/layout/dynamic-form/control-field/dynamic-control-field"
import { DEFINE_FIELD_TYPE } from "app/shared/layout/dynamic-form/constants"
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants'
import PopupMenuSet from '../../setting/menu-setting'
import { SETTING_MENU, CALENDAR_TAB } from 'app/modules/setting/constant'
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file'
import EquipmentError from "app/modules/calendar/grid/item/popups/equipment-error";
import EquipmentConfirm from "app/modules/calendar/grid/item/popups/equipment-confirm";
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import { AUTH_TOKEN_KEY, USER_ICON_PATH } from 'app/config/constants';
import { CalenderViewMonthCommon } from '../grid/common';
import { getTimezone } from 'app/shared/util/date-utils';
import { isNullOrUndefined } from 'util';
import { LICENSE_IN_CALENDAR } from '../constants';
import SuggestComponent from '../control/item/suggest-equipment';
import { Equipment } from '../models/get-local-navigation-type';
import { IndexSaveSuggestionChoice } from 'app/modules/calendar/constants';
import { JSON_STRINGIFY } from '../models/common-type';
import StringUtils from 'app/shared/util/string-utils';

type IComponentProps = {
  extendFlag?: boolean;
  extendHandle?: (scheduleForm, initForm, extendFileUploads) => void,
  isSubmit?: boolean,
  setIsSubmit?: (flag) => void,
  modeEdit?: boolean,
  resetEquipmentSuggest?: () => void
  saveSuggestionsChoice?: (namespace, index, idResult) => void
  isNotSave?: boolean
}

const getWeekOfMonth = (m: Moment) => {
  // Gets or sets the ISO day of the week with 1 being Monday and 7 being Sunday.
  const dateLocal = CalenderViewMonthCommon.localToTimezoneOfClient(m);
  const dayFirst = dateLocal.clone().startOf('month').isoWeekday();
  const ofset = 7 - dayFirst + 1;
  if (dateLocal.date() <= ofset) return 1;
  const w = Math.floor((dateLocal.date() - 1 - ofset) / 7) + 1 + 1;
  return w;
}

const convertDateByFormatLocal = (dateLocal, localFormat) => {
  return CalenderViewMonthCommon.localToTimezoneOfConfig(dateLocal).format('YYYY-MM-DD')
}

const enum TYPE_DATE_EQUIP {
  startDate = 1,
  startTime,
  endDate,
  endTime
}

interface IAddress {
  zip_code?: any,
  address_name?: any
  building_name?: any
}


const CreateEditComponent = forwardRef((
  {
    currentLocale,
    scheduleData,
    getScheduleType,
    getEquipmentType,
    scheduleTypes,
    listEquipmentType,
    isAdmin,
    defaultDate,
    errorMessage,
    errorItems,
    successMessage,
    formatDateFromSetting,
    getEquipmentSuggestions,
    equipmentSuggestionsList,
    extendFlag,
    extendHandle,
    isSubmit,
    modeEdit,
    saveSchedule,
    beforeStoreSchedule,
    setIsSubmit,
    infoEmployee,
    listLicense,
    resetEquipmentSuggest,
    saveSuggestionsChoice,
    isNotSave,
    updateScheduleDataActivity
  }: StateProps & DispatchProps & IComponentProps, ref) => {

  const getInfoEmpCurrent = () => {
    if (!Object.keys(infoEmployee).length && AUTH_TOKEN_KEY) {
      const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
      if (jwt) {
        const jwtData = jwtDecode(jwt);
        return [{
          employeeId: jwtData['custom:employee_id'],
          employeeName: jwtData['custom:employee_name'],
          employeeSurname: jwtData['custom:employee_surname'],
          photoFileUrl: Storage.session.get(USER_ICON_PATH, 'default icon')
        }]
      }
    }
    if (Object.keys(infoEmployee).length > 0) {
      return [infoEmployee]
    }
    return [];
  }

  const dateFormat = formatDateFromSetting ?? Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT)
  const timeFormat = 'HH:mm'
  const now = CalenderViewMonthCommon.localToTimezoneOfConfig(defaultDate ? defaultDate.toDate() : CalenderViewMonthCommon.nowDate())
  const defaultTime = now.minutes() > 30 ? now.clone().hour(now.hour() + 1).minutes(0) : now.clone().minutes(0)
  const defaultScheduleForm = {
    scheduleType: {
      scheduleTypeId: null
    },
    scheduleName: null,
    repeatCycle: 1,
    repeatType: ScheduleRepeatType.Day,
    repeatEndType: ScheduleRepeatEndType.None,
    repeatEndDate: null,
    repeatNumber: 0,
    isFullDay: false,
    isRepeated: false,
    isAllAttended: false,
    participants: {
      employees: modeEdit ? [] : getInfoEmpCurrent(),
      groups: [],
      departments: []
    },
    sharers: {
      employees: [],
      groups: [],
      departments: []
    },
    updateFlag: FlagEditRepeatedSchedule.One,
    zipCode: null,
    addressBelowPrefectures: null,
    buildingName: null,
    regularDayOfMonth: null,
    regularDayOfWeek: null,
    regularEndOfMonth: null,
    regularWeekOfMonth: null,
    startDate: now.add(30, 'minutes').startOf('hour').format(),
    endDate: now.add(1, 'hours').add(30, 'minutes').startOf('hour').format(),
    isPublic: true,
    canModify: true,
    milestoneIds: [],
    taskIds: [],
    customerId: null,
    productTradingIds: [],
    customerRelatedIds: [],
    businessCardIds: [],
    equipmentTypeId: 0,
    otherParticipantIds: []
  }

  const [weekDays, setWeekDays] = useState([])
  const [startDatePicker, setStartDatePicker] = useState(defaultDate ? defaultDate.toDate() : CalenderViewMonthCommon.nowDate().toDate())
  const [endDatePicker, setEndDatePicker] = useState(defaultDate ? defaultDate.toDate() : CalenderViewMonthCommon.nowDate().toDate())
  const [startDate, setStartDate] = useState<any>(now.format(dateFormat))
  const [endDate, setEndDate] = useState<any>(now.format(dateFormat))

  const [startTime, setStartTime] = useState(defaultTime.format(timeFormat))
  const [endTime, setEndTime] = useState(defaultTime.clone().add(1, 'h').format(timeFormat))
  const [startTimeInput, setStartTimeInput] = useState(defaultTime.format(timeFormat))
  const [endTimeInput, setEndTimeInput] = useState(defaultTime.clone().add(1, 'h').format(timeFormat))

  // Start fix bug default scheduleData missing [scheduleId, scheduleTypeId...] in scheduleForm
  let defautData: any = defaultScheduleForm;
  if (scheduleData?.scheduleName && !window.location.href.includes('create-edit-schedule')) {
    defautData = scheduleData;
  } else if (Storage.local.get('calendar/create-edit-schedule')) {
    defautData = Storage.local.get('calendar/create-edit-schedule');
  }
  const [scheduleForm, setScheduleForm] = useState(defautData)
  const [initialForm, setInitialForm] = useState(defautData)
  // End fix bug default scheduleData missing [scheduleId, scheduleTypeId...] in scheduleForm
  const [parsedScheduleType, setParsedScheduleType] = useState([])
  const [weekDaysRepeat, setWeekDaysRepeat] = useState([])
  const [repeatType, setRepeatType] = useState(ScheduleRepeatType.Day)
  const [repeatTypeOld, setRepeatTypeOld] = useState(ScheduleRepeatType.Day)
  const [participants, setParticipants] = useState<any>([])
  const [milestones, setMilestones] = useState<any>([]);
  const [tasks, setTask] = useState<any>([])
  const [sharers, setSharers] = useState<any>([])

  // State for repeated by month
  const [dayOfStartDate, setDayOfStartDate] = useState(now.date())
  const [dayWeekOfStartDate, setDayWeekOfStartDate] = useState(null)
  const [weekMonthOfStartDate, setWeekMonthOfStartDate] = useState(getWeekOfMonth(now))
  const [isLastDayOfMonth, setIsLastDayOfMonth] = useState(now.clone().endOf('month').date() === dayOfStartDate)
  const [repeatTypeWithMonth, setRepeatTypeWithMonth] = useState(ScheduleRepeatMonthType.Day)

  const [repeatEndDate, setRepeatEndDate] = useState(null)
  // const [repeatEndNumber, setRepeatEndNumber] = useState(null)

  const [listEquipmentTypeConvert, setListEquipmentTypeConvert] = useState([])
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState<any>()
  const [onOpenPopupScheduleSetting, setOnOpenPopupScheduleSetting] = useState<any>()


  const [files, setFiles] = useState([])
  const [filesDefault, setFilesDefault] = useState([])
  const [callRender, setCallRender] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [hoverIndex, setHoverIndex] = useState(null)
  const [displayConfirmEdit, setDisplayConfirmEdit] = useState(false);

  const [draftStartDay, setDraftStartDay] = useState(moment(defaultScheduleForm.startDate).format('YYYY-MM-DD'));
  const [draftStartTime, setDraftStartTime] = useState(moment(defaultScheduleForm.startDate).format(timeFormat));
  const [draftEndDay, setDraftEndDay] = useState(moment(defaultScheduleForm.endDate).format('YYYY-MM-DD'));
  const [draftEndTiem, setDraftEndTime] = useState(moment(defaultScheduleForm.endDate).format(timeFormat));
  const [errorInput, setErrorInput] = useState({});
  const [errorEquip, setErrorEquip] = useState({});
  /**
   * Equipment
   */
  const [equipmentTypeIdSelect, setEquipmentTypeIdSelect] = useState(0);
  const [nameEquipSug, setNameEquipSug] = useState('');
  const wrapperRef = useRef(null);
  const addressRef = useRef(null);
  const [isShowSuggestionEquip, setShowSuggestionEquip] = useState(false);
  const [itemEquipmentListSelected, setItemEquipmentListSelected] = useState([]);
  const [isHoverEquipSuggest, setIsHoverEquipSuggest] = useState(0);
  const [openPopupSettingEquip, setOpenPopupSettingEquip] = useState(false);

  const [customer, setCustomer] = useState<any>(null);
  const [productTradings, setProductTradings] = useState<any>([]);
  const [customerRelateds, setCustomerRelateds] = useState<any>([]);
  const [businessCards, setBusinessCards] = useState<any>([]);
  const [addressInfo, setAddressInfo] = useState<any>(null);
  const [isFullDay, setIsFullDay] = useState(false);
  const [listResponseEquipment, setListResponseEquipment] = useState<any>();

  // ______________START: handle action VAlIDATE__________________________________

  const getStartTimeDefault = (): string => {
    return CalenderViewMonthCommon.nowDate()
      .add(30, 'minutes')
      .startOf('hour')
      .format(timeFormat)
  }
  const getEndTimeDefault = (): string => {
    return CalenderViewMonthCommon.nowDate()
      .add(1, 'hours')
      .add(30, 'minutes')
      .startOf('hour')
      .format("HH:mm")
  }

  /**
   * validate data input null in client
   * @param scheduleData
   */
  const validateInClient = (scheduleItems: GetSchedule) => {
    const errorData = {};
    if (scheduleItems?.scheduleType?.scheduleTypeId === null || scheduleItems?.scheduleType?.scheduleTypeId === undefined)
      errorData['scheduleTypeId'] = translate('messages.ERR_COM_0013')
    if (scheduleItems.scheduleName === null || scheduleItems.scheduleName === undefined || scheduleItems.scheduleName === '')
      errorData['scheduleName'] = translate('messages.ERR_COM_0013')

    if (draftStartDay === null || draftStartDay === 'Invalid date')
      errorData['startDay'] = translate('messages.ERR_COM_0013')
    if (draftStartTime === null || draftStartTime === '')
      errorData['startTime'] = translate('messages.ERR_COM_0013')
    if (draftEndDay === null || draftEndDay === 'Invalid date')
      errorData['endDay'] = translate('messages.ERR_COM_0013')
    if (draftEndTiem === null || draftEndTiem === '')
      errorData['endTime'] = translate('messages.ERR_COM_0013')

    if (!errorData['startDay'] && !errorData['endDay'] && moment(draftEndDay).isBefore(moment(draftStartDay)))
      errorData['startDay'] = translate('messages.ERR_COM_0037')
    if (
      !errorData['startTime']
      && !errorData['endTime']
      && (moment(draftEndDay).isBefore(moment(draftStartDay)) || moment(draftStartDay).isSame(moment(draftEndDay)))
      && moment(draftEndTiem, timeFormat).isBefore(moment(draftStartTime, timeFormat))
    )
      errorData['startTime'] = translate('messages.ERR_COM_0037')

    if (moment(draftStartDay).isSame(moment(draftEndDay)) && moment(draftStartTime, timeFormat).isSame(moment(draftEndTiem, timeFormat)))
      errorData['endTime'] = translate('messages.ERR_COM_0037')

    return errorData;
  }

  const validateEquipment = (dataScheduleForm) => {
    const dataDraft = {};
    if (dataScheduleForm &&
      Array.isArray(dataScheduleForm.equipments) &&
      dataScheduleForm.equipments.length > 0) {
      dataScheduleForm.equipments.forEach((equip, idx) => {
        const tmpEquipStartDay = CalenderViewMonthCommon.localToTimezoneOfConfig(equip.startDate || equip.startTime).format('YYYY-MM-DD')
        const tmpEquipEndDay = CalenderViewMonthCommon.localToTimezoneOfConfig(equip.endDate || equip.endTime).format('YYYY-MM-DD')
        const tmpEquipStartTime = CalenderViewMonthCommon.localToTimezoneOfConfig(equip.startDate || equip.startTime).format("HH:mm")
        const tmpEquipEndTime = CalenderViewMonthCommon.localToTimezoneOfConfig(equip.endDate || equip.endTime).format("HH:mm")
        // console.log(`schedule`, draftStartDay, draftStartTime, draftEndDay, draftEndTiem)
        // console.log(`equip`, tmpEquipStartDay, tmpEquipStartTime, tmpEquipEndDay, tmpEquipEndTime)
        if (tmpEquipStartDay === null || tmpEquipStartDay === 'Invalid date')
          dataDraft[`startDate_${idx}`] = translate('messages.ERR_COM_0013')
        if (tmpEquipStartTime === null || tmpEquipStartTime === '')
          dataDraft[`startTime_${idx}`] = translate('messages.ERR_COM_0013')
        if (tmpEquipEndDay === null || tmpEquipEndDay === 'Invalid date')
          dataDraft[`endDate_${idx}`] = translate('messages.ERR_COM_0013')
        if (tmpEquipEndTime === null || tmpEquipEndTime === '')
          dataDraft[`endTime_${idx}`] = translate('messages.ERR_COM_0013')

        // Equipment Start Time compare vs Equipment End Time
        if (moment(equip.endDate || equip.endTime).isSameOrBefore(moment(equip.startDate || equip.startTime))) {
          dataDraft[`endDateEquip_${idx}`] = translate('messages.ERR_COM_0037')
        }

        // Equipment Start Day compare vs Schedules Start Day
        if (((moment(tmpEquipStartDay, 'YYYY-MM-DD')).isBefore(moment(draftStartDay, 'YYYY-MM-DD'))) || ((moment(tmpEquipStartDay, 'YYYY-MM-DD')).isAfter(moment(draftEndDay, 'YYYY-MM-DD')))) {
          dataDraft[`startDate_${idx}`] = translate('messages.ERR_CAL_0001')
        }

        // Equipment End Day compare vs Schedules End Day
        if (((moment(tmpEquipEndDay, 'YYYY-MM-DD')).isAfter(moment(draftEndDay, 'YYYY-MM-DD'))) || ((moment(tmpEquipEndDay, 'YYYY-MM-DD')).isBefore(moment(draftStartDay, 'YYYY-MM-DD')))) {
          dataDraft[`endDate_${idx}`] = translate('messages.ERR_CAL_0001');
        }

        if ((moment(tmpEquipStartDay, 'YYYY-MM-DD')).isSame(moment(draftStartDay, 'YYYY-MM-DD'))) {
          if (moment(tmpEquipStartTime, timeFormat).isBefore(moment(draftStartTime, timeFormat))) {
            dataDraft[`startTime_${idx}`] = translate('messages.ERR_CAL_0001')
          }
        }


        if ((moment(tmpEquipEndDay, 'YYYY-MM-DD')).isSame(moment(draftEndDay, 'YYYY-MM-DD'))) {
          if (moment(tmpEquipEndTime, timeFormat).isAfter(moment(draftEndTiem, timeFormat))) {
            dataDraft[`endTime_${idx}`] = translate('messages.ERR_CAL_0001')
          }
        }

        if ((moment(tmpEquipStartDay, 'YYYY-MM-DD')).isSame(moment(draftEndDay, 'YYYY-MM-DD'))) {
          if (moment(tmpEquipStartTime, timeFormat).isAfter(moment(draftEndTiem, timeFormat))) {
            dataDraft[`startTime_${idx}`] = translate('messages.ERR_CAL_0001')
          }
        }

        if ((moment(tmpEquipEndDay, 'YYYY-MM-DD')).isSame(moment(draftStartDay, 'YYYY-MM-DD'))) {
          if (moment(tmpEquipEndTime, timeFormat).isBefore(moment(draftStartTime, timeFormat))) {
            dataDraft[`endTime_${idx}`] = translate('messages.ERR_CAL_0001')
          }
        }

      });
    }
    return dataDraft;
  }

  const isFieldError = (field: string): boolean => {
    // return errorItems[field] ?? false
    return errorInput[field] ?? false
  }

  const getErrorItemWithFieldKey = (field: string): ReactElement => {
    // return isFieldError(field) ? <span className="error-message">{errorItems[field]}</span> : <></>
    return isFieldError(field)
      ? <><span className="error-message d-block mt-2 color-red">{errorInput[field]}</span></>
      : <></>
  }

  const getFieldAdditionalClass = (field: string): string => {
    return isFieldError(field) ? 'error' : ''
  }
  // ______________END: handle action VAlIDATE__________________________________
  // ********************************************************************************
  // ______________START: handle action SUBMIT DATA__________________________________

  const joinDateTime = (date, time) => {
    const convertDate = CalenderViewMonthCommon.localToTimezoneOfConfig(moment(date, dateFormat));
    const convertTime = moment(time, 'HH:mm');
    convertDate.hour(convertTime.hour());
    convertDate.minute(convertTime.minute());
    return convertDate.format();
  }

  useEffect(() => {
    if (isSubmit) {
      const scheduleDataSubmit = {
        ...scheduleForm,
        scheduleName: scheduleForm?.scheduleName?.trim() === '' ? null : scheduleForm?.scheduleName?.trim(),
        startDate: joinDateTime(startDate, startTime),
        endDate: joinDateTime(endDate, endTime)
      }

      const errorEquipData = validateEquipment(scheduleDataSubmit);
      const errorData = validateInClient(scheduleDataSubmit);
      if (!Object.keys(errorData).length && !Object.keys(errorEquipData).length) {
        if (scheduleDataSubmit.scheduleId !== null && initialForm.isRepeated) {
          setDisplayConfirmEdit(true)
        } else {
          if (Storage.local.get('calendar/create-edit-schedule')) {
            Storage.local.remove('calendar/create-edit-schedule')
            window.close()
          }
          if (Array.isArray(scheduleDataSubmit.equipments) && scheduleDataSubmit.equipments.length > 0) {
            beforeStoreSchedule(scheduleDataSubmit, files, false, () => { setIsSubmit(false) });
          } else {
            saveSchedule(scheduleDataSubmit, files, false, () => { setIsSubmit(false) });
          }
        }
      } else {
        setErrorInput(errorData);
        setErrorEquip(errorEquipData);
        setIsSubmit(false);
      }
    }
  }, [isSubmit])
  // ______________END: handle action SUBMIT DATA__________________________________
  // ********************************************************************************
  // ______________START: INIT DATA FOR FORM__________________________________

  useEffect(() => {
    resetEquipmentSuggest()
    if (extendFlag && extendHandle)
      extendHandle(scheduleForm, initialForm, files)
  }, [])

  /**
   * init data for schedule loop
   * @param initialData 
   */
  const initDataRepeat = (initialData) => {
    if ((initialData.repeatType === ScheduleRepeatType.Week) && initialData.regularDayOfWeek) { // Repeat day
      const arrRegDayOfWeek = initialData.regularDayOfWeek.split('');
      const arrDaySeleted = arrRegDayOfWeek.map((x, idx) => {
        return parseInt(x, 10) === 1 ? idx : '00'
      }).filter(x => x !== '00');
      if (arrDaySeleted.length > 0) {
        setWeekDaysRepeat(arrDaySeleted)
      } else {
        setWeekDaysRepeat([(new Date).getDay() - 1])
      }

    } else if (initialData.repeatType === ScheduleRepeatType.Month) {
      !!initialData.regularWeekOfMonth && setRepeatTypeWithMonth(ScheduleRepeatMonthType.Week)
      !!initialData.regularDayOfMonth && setRepeatTypeWithMonth(ScheduleRepeatMonthType.Day)
    } else if (repeatEndDate === 1) {
      setRepeatTypeWithMonth(ScheduleRepeatMonthType.EndOfMonth)
    }
    setRepeatTypeOld(initialData.repeatType)
    // setRepeatEndNumber(initialData.repeatNumber || 0)
    setRepeatEndDate(CalenderViewMonthCommon.localToTimezoneOfConfig(initialData.repeatEndDate).toDate())
  }

  const initDataAutoComplete = (initialData) => {
    if (initialData) {
      initialData.participants
        && Array.isArray(initialData.participants.employees)
        && initialData.participants.employees.forEach(item => {
          item['employeeIcon'] = item.employeeIcon ? item.employeeIcon : {
            fileUrl: item?.photoEmployeeImg
          }
        })
      initialData.participants
        && Array.isArray(initialData.participants.groups)
        && initialData.participants.groups.forEach((itemGroup) => {
          Array.isArray(itemGroup.employees)
            && itemGroup.employees.forEach(itemEmpInGroup => {
              itemEmpInGroup['employeeIcon'] = {
                fileUrl: itemEmpInGroup?.photoEmployeeImg
              }
            })
        })
      initialData.participants
        && Array.isArray(initialData.participants.departments)
        && initialData.participants.departments.forEach(itemDepartment => {
          Array.isArray(itemDepartment.employees)
            && itemDepartment.employees.forEach(itemEmpInDepartment => {
              itemEmpInDepartment['employeeIcon'] = {
                fileUrl: itemEmpInDepartment?.photoEmployeeImg
              }
            })
        })

      setParticipants([...(initialData.participants && initialData.participants.employees || []), ...(initialData.participants && initialData.participants.groups || []), ...(initialData.participants && initialData.participants.departments || [])])

      initialData.sharers
        && Array.isArray(initialData.sharers.employees)
        && initialData.sharers.employees.forEach(item => {
          item['employeeIcon'] = {
            fileUrl: item?.photoEmployeeImg
          }
        })
      initialData.sharers
        && Array.isArray(initialData.sharers.groups)
        && initialData.sharers.groups.forEach((itemShareGroup) => {
          Array.isArray(itemShareGroup.employees)
            && itemShareGroup.employees.forEach(itemShareEmpInGroup => {
              itemShareEmpInGroup['employeeIcon'] = {
                fileUrl: itemShareEmpInGroup?.photoEmployeeImg
              }
            })
        })

      initialData.sharers
        && Array.isArray(initialData.sharers.departments)
        && initialData.sharers.departments.forEach(itemShareDepartment => {
          Array.isArray(itemShareDepartment.employees)
            && itemShareDepartment.employees.forEach(itemShareEmpInDepartment => {
              itemShareEmpInDepartment['employeeIcon'] = {
                fileUrl: itemShareEmpInDepartment?.photoEmployeeImg
              }
            })
        })
      setSharers([...(initialData.sharers && initialData.sharers.employees || []), ...(initialData.sharers && initialData.sharers.groups || []), ...(initialData.sharers && initialData.sharers.departments || [])])

      setMilestones(initialData.milestones || []);
      Array.isArray(initialData.tasks)
        && initialData.tasks.forEach(task => {
          task['milestone'] = {
            milestoneId: task.milestoneId,
            milestoneName: task.milestoneName
          };
          task['finishDate'] = task.endDate;
          Array.isArray(task.operators)
            && task.operators.forEach(emp => {
              emp['employeeIcon'] = emp.photoEmployeeImg
            })
        })
      setTask(initialData.tasks || []);
      // Product Trading
      Array.isArray(initialData.productTradings)
        && initialData.productTradings.forEach(product => {
          if (product.employee) {
            product['employeeIcon'] = product.employee.photoFilePath;
            product['employeeId'] = product.employee.employeeId;
            product['employeeName'] = product.employee.employeeName;
            product['employeeSurname'] = product.employee.employeeSurname;
          }
        })
      setProductTradings(initialData.productTradings || [])
      // Bussiness Cards
      initialData.businessCards && setBusinessCards(initialData.businessCards)
      // Customer
      initialData.customer && initialData.customer.customerId && setCustomer([{ ...initialData.customer, customerAddress: initialData.customer.customerAddressObject?.address }])
      // Related Customer
      const arrRelatedCustomerIds = typeof initialData.relatedCustomersIds === 'string' ? initialData.relatedCustomersIds.split(',') : [];
      const relatedCustomersData = [];
      arrRelatedCustomerIds.forEach((idCustomer) => {
        if (Array.isArray(initialData.relatedCustomers)) {
          initialData.relatedCustomers.filter(item => item.customerId === parseInt(idCustomer, 10)).forEach(customerItem => {
            const customerInfo = { ...customerItem, customerAddress: customerItem.customerAddressObject?.address }
            relatedCustomersData.push(customerInfo)
          });
        }
      })
      setCustomerRelateds(relatedCustomersData)
    }
  }

  // Initial Data for edit
  useEffect(() => {
    if (scheduleData) {
      const allFiles = scheduleData.allFiles || scheduleData.files
      scheduleData.allFiles = allFiles
      scheduleData['endDate'] = scheduleData.finishDate;
    }
    let initialData = {
      ...scheduleForm,
      ...scheduleData,
    }
    if (window.location.href.includes('create-edit-schedule')) {
      initialData = {
        ...scheduleForm
      }
    }
    // Set repeat form
    initDataRepeat(initialData)
    if (extendFlag) {
      initDataAutoComplete((scheduleData && (scheduleData['activityDraftId'] || scheduleData.scheduleId ))  ? scheduleData : initialData)
    } else {
      initDataAutoComplete(scheduleData ? scheduleData : initialData)
    }
    if (!initialData.scheduleType) {
      initialData.scheduleType = { ...defaultScheduleForm.scheduleType }
    }

    if (isNullOrUndefined(initialData.repeatCycle)) {
      initialData['repeatCycle'] = 1
    }
    // const checkUpdate = scheduleData?.scheduleId ? scheduleData : initialData;

    // setParticipants([...(checkUpdate.participants && checkUpdate.participants.employees || []), ...(checkUpdate.participants && checkUpdate.participants.groups || []), ...(checkUpdate.participants && checkUpdate.participants.departments || [])])
    // setParticipants([...(scheduleData.participants && scheduleData.participants.employees || []), ...(scheduleData.participants && scheduleData.participants.groups || []), ...(scheduleData.participants && scheduleData.participants.departments || [])])
    setScheduleForm({
      ...initialData,
      taskIds: Array.isArray(initialData.tasks) && initialData.tasks.length > 0 ? initialData.tasks.map(task => task.taskId) : [],
      milestoneIds: Array.isArray(initialData.milestones) && initialData.milestones.length > 0 ? initialData.milestones.map(milestone => milestone.milestoneId) : [],
      productTradingIds: typeof initialData.productsTradingsIds === 'string' ? initialData.productsTradingsIds.split(',') : [],
      customerRelatedIds: typeof initialData.relatedCustomersIds === 'string' ? initialData.relatedCustomersIds.split(',') : [],
      otherParticipantIds: typeof initialData.businessCardIds === 'string' ? initialData.businessCardIds.split(',') : [],
    })
    setInitialForm({
      ...initialData,
      taskIds: Array.isArray(initialData.tasks) && initialData.tasks.length > 0 ? initialData.tasks.map(task => task.taskId) : [],
      milestoneIds: Array.isArray(initialData.milestones) && initialData.milestones.length > 0 ? initialData.milestones.map(milestone => milestone.milestoneId) : [],
      productTradingIds: typeof initialData.productsTradingsIds === 'string' ? initialData.productsTradingsIds.split(',') : [],
      customerRelatedIds: typeof initialData.relatedCustomersIds === 'string' ? initialData.relatedCustomersIds.split(',') : [],
      otherParticipantIds: typeof initialData.businessCardIds === 'string' ? initialData.businessCardIds.split(',') : [],
    })
    if (scheduleData) {
      if (scheduleData.startDate) {
        const startDateObj = CalenderViewMonthCommon.localToTimezoneOfConfig(scheduleData.startDate)
        setStartDate(startDateObj.format(dateFormat))
        setDraftStartDay(startDateObj.format('YYYY-MM-DD'))
        if (scheduleData.isFullDay) {
          setStartDatePicker(moment(startDateObj.format(dateFormat)).toDate())
          setStartTime(getStartTimeDefault())
          // setDraftStartTime(CalenderViewMonthCommon.nowDate().format(timeFormat))
          setDraftStartTime(getStartTimeDefault());

          setStartTimeInput(getStartTimeDefault())
        } else {
          setStartDatePicker(startDateObj.toDate())
          setStartTime(startDateObj.format(timeFormat))
          setDraftStartTime(startDateObj.format(timeFormat))
          setStartTimeInput(startDateObj.format(timeFormat))
        }
        // setStartTimePicker(startDateObj)
      }
      if (scheduleData.finishDate) {
        const endDateObj = CalenderViewMonthCommon.localToTimezoneOfConfig(scheduleData.finishDate)
        setEndDate(endDateObj.format(dateFormat))
        // setEndTimePicker(endDateObj)
        setDraftEndDay(endDateObj.format('YYYY-MM-DD'))
        if (scheduleData.isFullDay) {
          setEndDatePicker(moment(endDateObj.format(dateFormat)).toDate())
          setEndTime(getEndTimeDefault())
          // setDraftEndTime(CalenderViewMonthCommon.nowDate().format(timeFormat))
          setDraftEndTime(getEndTimeDefault());
          setEndTimeInput(getEndTimeDefault())
        } else {
          setEndDatePicker(endDateObj.toDate())
          setEndTime(endDateObj.format(timeFormat))
          setDraftEndTime(endDateObj.format(timeFormat))
          setEndTimeInput(endDateObj.format(timeFormat))
        }
      }
      if (scheduleData.allFiles) {
        setFilesDefault(scheduleData.allFiles)
      }
    }
    setShowSuggestionEquip(false);

    const draftData = [];
    if (initialData.equipments) {
      for (let i = 0; i < initialData.equipments.length; i++) {
        draftData.push(
          {
            ...initialData.equipments[i],
            startDate: CalenderViewMonthCommon.localToTimezoneOfConfig(initialData.equipments[i]['startTime']),
            endDate: CalenderViewMonthCommon.localToTimezoneOfConfig(initialData.equipments[i]['endTime'])
          }
        )
      }
    }

    if (addressRef && addressRef.current) {
      addressRef.current.setValueEdit(JSON.stringify({
        'zip_code': scheduleData?.zipCode,
        'address_name': scheduleData?.addressBelowPrefectures,
        'building_name': scheduleData?.buildingName
      }))
    }

    if (scheduleData) {
      setRepeatType(scheduleData['repeatType'])
      setIsFullDay(scheduleData.isFullDay)
    }

    setItemEquipmentListSelected(draftData);
  }, [scheduleData])

  /**
   * handle pass data to component other
   */
  useEffect(() => {
    if (extendFlag && extendHandle)
      extendHandle(scheduleForm, initialForm, files)
  }, [scheduleForm, initialForm])
  // ______________END: INIT DATA FOR FORM__________________________________
  // **********************************************************************************
  // ______________START: handle action FIELD COMMON__________________________________


  const onChangeStartDateTime = () => {
    // const strDateTime = `${convertDateByFormatLocal(startDate, dateFormat)} ${startTime}`;
    if (startDate) {
      const convertDate = CalenderViewMonthCommon.localToTimezoneOfConfig(moment(startDate, dateFormat));
      const convertTime = moment(startTime, 'HH:mm');
      convertDate.hour(convertTime.hour());
      convertDate.minute(convertTime.minute());

      const date = convertDate.format()
      setScheduleForm({ ...scheduleForm, startDate: date })

      // Update repeat by month state
      const startDateObj = moment(startDate, dateFormat);
      setDayOfStartDate(startDateObj.date())
      setDayWeekOfStartDate(moment.weekdaysShort()[startDateObj.days()])
      // startDateObj.days() === 0 : Sunday (current start day of week is sunday, convert to monday )
      // setWeekMonthOfStartDate(startDateObj.days() === 0 ? getWeekOfMonth(startDateObj.clone()) - 1 : getWeekOfMonth(startDateObj.clone()))
      setWeekMonthOfStartDate(getWeekOfMonth(startDateObj.clone()))
      setIsLastDayOfMonth(startDateObj.clone().endOf('month').date() === startDateObj.date())
      // because weekDays.map start index 0, startDateObj.days() start index 1
      if (!modeEdit) {
        setWeekDaysRepeat([(new Date).getDay() - 1])
      }
    } else {
      setScheduleForm({ ...scheduleForm, startDate: null })
      setDayOfStartDate(null)
      setDayWeekOfStartDate(null)
      // startDateObj.days() === 0 : Sunday (current start day of week is sunday, convert to monday )
      setWeekMonthOfStartDate(null)
      setIsLastDayOfMonth(null)
      setWeekDaysRepeat([])
    }
  }

  const onChangeEndDateTime = () => {
    const convertDate = CalenderViewMonthCommon.localToTimezoneOfConfig(moment(endDate, dateFormat));
    const convertTime = moment(endTime, 'HH:mm');
    convertDate.hour(convertTime.hour());
    convertDate.minute(convertTime.minute());

    const date = convertDate.format()
    setScheduleForm({ ...scheduleForm, endDate: date })
  }

  useEffect(() => {
    if (isFullDay) {
      setStartTime(CalenderViewMonthCommon.roundDownDay(moment(scheduleForm.startDate)).format('HH:mm'));
      setDraftStartTime(CalenderViewMonthCommon.roundDownDay(moment(scheduleForm.startDate)).format('HH:mm'));
      setEndTime(CalenderViewMonthCommon.roundUpDay(moment(scheduleForm.endDate)).format('HH:mm'));
      setDraftEndTime(CalenderViewMonthCommon.roundUpDay(moment(scheduleForm.endDate)).format('HH:mm'));
      // setScheduleForm({
      //   ...scheduleForm,
      //   startDate: CalenderViewMonthCommon.roundDownDay(moment(scheduleForm.startDate)).format(),
      //   endDate: CalenderViewMonthCommon.roundUpDay(moment(scheduleForm.endDate)).format()
      // })
    } else {
      // const convertStartDate = CalenderViewMonthCommon.localToTimezoneOfConfig(moment(startDate, dateFormat));
      // const convertStartTime = CalenderViewMonthCommon.nowDate().add(30, 'minutes').startOf('hour');
      // convertStartDate.hour(convertStartTime.hour());
      // convertStartDate.minute(convertStartTime.minute());


      setStartTime(startTimeInput);
      setDraftStartTime(startTimeInput);
      setEndTime(endTimeInput);
      setDraftEndTime(endTimeInput);
    }
    // onChangeStartDateTime()
    // onChangeEndDateTime()
  }, [isFullDay])

  useEffect(() => {
    onChangeStartDateTime();
  }, [startDate, startTime])

  useEffect(() => {
    onChangeEndDateTime();
  }, [endDate, endTime])

  useEffect(() => {
    currentLocale && moment.locale(currentLocale.split('_')[0])
    const days = moment.weekdays(true).map((x) => x[0]);
    days.push(days.splice(days.indexOf('日'), 1)[0])
    setWeekDays(days)
    getScheduleType()
    getEquipmentType()
  }, [currentLocale])

  useEffect(() => {
    scheduleTypes && scheduleTypes.length && setParsedScheduleType(scheduleTypes.map((v) => {
      const typeName = getJsonBName(v.scheduleTypeName)
      // typeName = getJsonBName(v.scheduleTypeName)
      return {
        itemId: v.scheduleTypeId,
        itemLabel: (
          <>
            {v.iconPath && v.iconPath.includes('http') ? (<img className="icon-calendar icon-calendar-person" src={v.iconPath} />)
              : <img className="icon-calendar icon-calendar-person" src={`../../../../content/images/common/calendar/${v.iconName}`} />}
            <span>{typeName}</span>
          </>
        )
      }
    }))
  }, [scheduleTypes])
  // ______________END: handle action FIELD COMMON__________________________________
  // **********************************************************************************************
  // ______________START: handle action LOOP SCHEDULE__________________________________

  /**
   * handle useEffect when isRepeated, startDate, repeatType, repeatTypeWithMonth, weekDaysRepeat, repeatEndType onChange
   */
  useEffect(() => {
    let willUpdate: GetSchedule = {
      regularDayOfMonth: null,
      regularDayOfWeek: null,
      regularEndOfMonth: null,
      regularWeekOfMonth: null,
      repeatEndDate: null,
      repeatNumber: null
    }
    const startDateObj = moment(scheduleForm.startDate)
    if (repeatType === ScheduleRepeatType.Week) {
      willUpdate = {
        ...willUpdate,
        regularDayOfWeek: moment.weekdays().reduce((carry, v, idx) => {
          carry += (weekDaysRepeat.includes(idx)) ? '1' : '0'
          return carry
        }, ''),
        regularDayOfMonth: null,
        regularEndOfMonth: null,
        regularWeekOfMonth: null,
        repeatType: ScheduleRepeatType.Week
      }
    } else if (repeatType === ScheduleRepeatType.Month) {
      willUpdate.repeatType = ScheduleRepeatType.Month
      let tempRegularDayOfWeek = [];
      let tempWeekOfMonth = 0;
      switch (repeatTypeWithMonth) {
        case ScheduleRepeatMonthType.Day:
          // willUpdate.regularDayOfMonth = dayOfStartDate
          willUpdate = {
            ...willUpdate,
            regularDayOfMonth: dayOfStartDate,
            regularDayOfWeek: null,
            regularEndOfMonth: null,
            regularWeekOfMonth: null,
          }
          break
        case ScheduleRepeatMonthType.Week:
          // current start day is SunDay, backEnd start day is monday
          tempRegularDayOfWeek = moment.weekdays().map((v, idx) => {
            return startDateObj.days() === idx ? 1 : 0
          });
          // tempWeekOfMonth = startDateObj.days() === 0 ? getWeekOfMonth(startDateObj.clone()) - 1 : getWeekOfMonth(startDateObj.clone())
          tempWeekOfMonth = getWeekOfMonth(startDateObj.clone())
          willUpdate = {
            ...willUpdate,
            regularDayOfWeek: tempRegularDayOfWeek.splice(1, 6).join('') + tempRegularDayOfWeek[0],
            regularWeekOfMonth: Array(6).fill(0).map((v, idx) => {
              return idx === (tempWeekOfMonth - 1) ? 1 : 0
            }).join(''),
            regularDayOfMonth: null,
            regularEndOfMonth: null,
            // repeatType: 3
          }
          break
        case ScheduleRepeatMonthType.EndOfMonth:
          // willUpdate.regularEndOfMonth = true
          willUpdate = {
            ...willUpdate,
            regularDayOfMonth: null,
            regularDayOfWeek: null,
            regularEndOfMonth: true,
            regularWeekOfMonth: null,
          }
          break
        default:
          // willUpdate.regularEndOfMonth = false
          willUpdate = {
            ...willUpdate,
            regularDayOfMonth: null,
            regularDayOfWeek: null,
            regularEndOfMonth: false,
            regularWeekOfMonth: null,
          }
      }
    } else {
      willUpdate.repeatType = ScheduleRepeatType.Day
    }

    if (scheduleForm.isRepeated) {
      if (scheduleForm.repeatEndType === ScheduleRepeatEndType.Cycle) {

        if (repeatType !== repeatTypeOld) {
          switch (repeatType) {
            case ScheduleRepeatType.Day:
              willUpdate.repeatNumber = 30
              break
            case ScheduleRepeatType.Week:
              willUpdate.repeatNumber = 13
              break
            default:
              willUpdate.repeatNumber = 12
          }
        } else {
          willUpdate.repeatNumber = scheduleForm.repeatNumber;
        }
        if (extendFlag && scheduleForm.repeatNumber) {
          willUpdate.repeatNumber = scheduleForm.repeatNumber;
        }
      }

      if (scheduleForm.repeatEndType === ScheduleRepeatEndType.Specific) {
        // const startDateObj = moment(scheduleForm.startDate !== "Invalid date" ? scheduleForm.startDate : CalenderViewMonthCommon.nowDate().toDate());
        let additionalDays = 0
        switch (repeatType) {
          case ScheduleRepeatType.Day:
            additionalDays = 30
            break
          case ScheduleRepeatType.Week:
            additionalDays = 60
            break
          default:
            additionalDays = 365
        }
        if (repeatType !== repeatTypeOld) {
          willUpdate.repeatEndDate = startDateObj.add(additionalDays, 'days').format()
        } else {
          willUpdate.repeatEndDate = scheduleForm.repeatEndDate;
        }
        if (extendFlag  && scheduleForm.repeatEndDate) {
          willUpdate.repeatEndDate = scheduleForm.repeatEndDate;
        }
      }
    } else {
      willUpdate = {
        ...willUpdate,
        repeatNumber: defaultScheduleForm.repeatNumber,
        repeatEndType: defaultScheduleForm.repeatEndType,
        repeatType: defaultScheduleForm.repeatType
      }
    }
    setScheduleForm({ ...scheduleForm, ...willUpdate })
    setRepeatEndDate(willUpdate.repeatEndDate ? new Date(willUpdate.repeatEndDate) : null)
    // setRepeatEndNumber(willUpdate.repeatNumber || 0)
    setRepeatTypeOld(null)

    if (willUpdate.repeatType !== repeatType) {
      setRepeatType(willUpdate.repeatType);
    }

  }, [scheduleForm.isRepeated, scheduleForm.startDate, repeatType, repeatTypeWithMonth, weekDaysRepeat, scheduleForm.repeatEndType])

  /**
   * handle useEffect when repeatNumber onChange
   */
  // useEffect(() => {
  //   setRepeatEndNumber(scheduleForm.repeatNumber)
  // }, [scheduleForm.repeatNumber])

  /**
   * handle useEffect when repeatType onChange
   */
  // useEffect(() => {
  //   setRepeatType(scheduleForm.repeatType)
  // }, [scheduleForm.repeatType])

  /**
   * update flag of schedule loop
   */
  const onFlagEditChange = (updateFlag) => {
    setScheduleForm({ ...scheduleForm, updateFlag })
  }
  /**
   * Edit schedule loop
   */
  const onConfirmEdit = () => {
    const scheduleDataSubmitEdit = {
      ...scheduleForm,
      scheduleName: scheduleForm?.scheduleName?.trim() === '' ? null : scheduleForm?.scheduleName?.trim(),
      startDate: joinDateTime(startDate, startTime),
      endDate: joinDateTime(endDate, endTime)
    }
    if (Storage.local.get('calendar/create-edit-schedule')) {
      Storage.local.remove('calendar/create-edit-schedule')
      window.close()
    }
    if (Array.isArray(scheduleDataSubmitEdit.equipments) && scheduleDataSubmitEdit.equipments.length > 0)
      beforeStoreSchedule(scheduleDataSubmitEdit, files);
    else if(isNotSave)
      updateScheduleDataActivity(scheduleDataSubmitEdit);
    else
      saveSchedule(scheduleDataSubmitEdit, files);
    setDisplayConfirmEdit(false)
  }
  /**
   * display confirm edit loop schedule
   */
  const displayConfirmEditLoopSchedule = () => {
    return (displayConfirmEdit &&
      <>
        <div className="popup-esr2" id="popup-esr2">
          <div className="popup-esr2-content">
            <div className="popup-esr2-body">
              <div className="popup-esr2-title">{translate('calendars.form.edit_recurring_appointment')}</div>
              <p className="radio-item">
                <input type="radio"
                  id="radio-one" name="radio-group7"
                  checked={scheduleForm.updateFlag === FlagEditRepeatedSchedule.One}
                  onChange={() => onFlagEditChange(FlagEditRepeatedSchedule.One)}
                />
                {/* fix bug activity */}
                <label htmlFor="radio-one" className="ml-1 d-inline">{translate('calendars.form.only_this_appointment')}</label>
                {/* fix bug activity */}
              </p>
              <p className="radio-item mt-3">
                <input type="radio" id="radio-all-after" name="radio-group7"
                  checked={scheduleForm.updateFlag === FlagEditRepeatedSchedule.AllAfter}
                  onChange={() => onFlagEditChange(FlagEditRepeatedSchedule.AllAfter)}
                />
                <label htmlFor="radio-all-after" className="ml-1 d-inline">{translate('calendars.form.all_after_this_schedule')}</label>
              </p>
              <p className="radio-item mt-3">
                <input type="radio" id="radio-all" name="radio-group7"
                  checked={scheduleForm.updateFlag === FlagEditRepeatedSchedule.All}
                  onChange={() => onFlagEditChange(FlagEditRepeatedSchedule.All)}
                />
                {/* fix bug activity */}
                <label htmlFor="radio-all" className="ml-1 d-inline">{translate('calendars.form.all_plan')}</label>
                {/* fix bug activity */}
              </p>
            </div>
            <div className="popup-esr2-footer">
              <button className="button-cancel" onClick={() => { setDisplayConfirmEdit(false); setIsSubmit(false) }}>{translate('calendars.form.cancel')}</button>
              <button className="button-blue" onClick={onConfirmEdit}>{translate('calendars.form.save')}</button>
            </div>
          </div>
        </div>
        <div className="modal-backdrop2 show" />
      </>
    )
  }

  const onWeekDaySelect = (idx) => {
    if (weekDaysRepeat.length <= 1 && weekDaysRepeat.includes(idx)) {
      return false
    }

    if (weekDaysRepeat.includes(idx)) {
      setWeekDaysRepeat(weekDaysRepeat.filter(v => v !== idx))
    } else {
      setWeekDaysRepeat([...weekDaysRepeat, idx])
    }
  }

  const renderWeekDay = () => {
    return (
      <div className="break-line form-group mt-3">
        <label>{translate("calendars.form.day_of_week")}</label>
        <div className="content-items flex-jct weekdays">
          {
            weekDays.map((x, idx) => <span className={`name ${weekDaysRepeat.includes(idx) ? 'active' : ''}`} key={idx} onClick={(e) => onWeekDaySelect(idx)}>{x}</span>)
          }
        </div>
      </div>
    )
  }

  const renderRepeatEndDate = () => {
    const onRepeatChange = (e) => {
      setScheduleForm({
        ...scheduleForm,
        repeatEndType: parseInt(e.target?.value, 10)
      })
    }

    return (
      <div className="break-line form-group mb-0">
        <label>{translate('calendars.form.end_date')}</label>
        <div className="dis-flex">
          <div className="wrap-check-radio flex-jct w_auto">
            <p className="radio-item col-lg-4 col-xl-3">
              <input type="radio"
                id="radio1"
                name="name-radio1"
                checked={scheduleForm.repeatEndType === ScheduleRepeatEndType.None}
                onChange={onRepeatChange}
                value={ScheduleRepeatEndType.None} />
              <label onClick={() => { setScheduleForm({ ...scheduleForm, repeatEndType: ScheduleRepeatEndType.None }) }}>{translate('calendars.form.none')}</label>
            </p>
            <p className="radio-item col-lg-3 col-xl-3 pr-0">
              <input type="radio" id="radio2" name="name-radio1"
                checked={scheduleForm.repeatEndType === ScheduleRepeatEndType.Specific}
                onChange={onRepeatChange}
                value={ScheduleRepeatEndType.Specific} />
              <label onClick={() => { setScheduleForm({ ...scheduleForm, repeatEndType: ScheduleRepeatEndType.Specific }) }}>{translate('calendars.form.end_date')}:</label>
            </p>
            <div className="radio-item col-lg-5 col-xl-6 pl-0">
              <div className="form-group form-group2 common has-delete">
                {
                  scheduleForm.repeatEndType !== ScheduleRepeatEndType.Specific
                    ? <input type='text' className='input-normal input-common2 one-item' onClick={() => setScheduleForm({ ...scheduleForm, repeatEndType: ScheduleRepeatEndType.Specific })} />
                    : <DatePicker
                      date={repeatEndDate}
                      onDateChanged={(day: Date) => {
                        const dateSelected = moment(day).format('YYYY-MM-DD');
                        let repeatEndDateMax = moment(draftEndDay).format('YYYY-MM-DD');
                        switch (repeatType) {
                          case ScheduleRepeatType.Day:
                            repeatEndDateMax = moment(draftEndDay).add(100, 'days').format('YYYY-MM-DD');
                            break;
                          case ScheduleRepeatType.Week:
                            repeatEndDateMax = moment(draftEndDay).add(7 * 100, 'days').format('YYYY-MM-DD');
                            break;
                          case ScheduleRepeatType.Month:
                            repeatEndDateMax = moment(draftEndDay).add(30 * 100, 'days').format('YYYY-MM-DD');
                            break;
                          default:
                            break;
                        }
                        setRepeatEndDate(moment(dateSelected).isBefore(repeatEndDateMax) ? new Date(dateSelected) : new Date(repeatEndDateMax));
                        setScheduleForm({
                          ...scheduleForm,
                          repeatEndDate: moment(dateSelected).isBefore(repeatEndDateMax) ? dateSelected : repeatEndDateMax
                        })
                      }}
                    // isDisabled={scheduleForm.repeatEndType !== ScheduleRepeatEndType.Specific}
                    />
                }

              </div>
            </div>
          </div>
          <div className="wrap-check-radio flex-jct w_auto justify-content-around">
            <p className="radio-item pr-0 mr-5 ">
              <input type="radio" id="radio3" name="name-radio1"
                checked={scheduleForm.repeatEndType === ScheduleRepeatEndType.Cycle}
                onChange={onRepeatChange}
                value={ScheduleRepeatEndType.Cycle} />
              <label onClick={() => { setScheduleForm({ ...scheduleForm, repeatEndType: ScheduleRepeatEndType.Cycle }) }}>{translate('calendars.form.repetition')}:</label>
            </p>
            <p className="radio-item">
              {
                scheduleForm.repeatEndType !== ScheduleRepeatEndType.Cycle
                  ? <input type="text"
                    className="input-normal mw-input marginleft__48 mw-96-px"
                    value={''}
                    onClick={() => setScheduleForm({ ...scheduleForm, repeatEndType: ScheduleRepeatEndType.Cycle })}
                  />
                  : <input type="text" className="input-normal mw-input marginleft__48"
                    defaultValue={scheduleForm.repeatNumber}
                    value={scheduleForm.repeatNumber}
                    onChange={(e) => setScheduleForm({
                      ...scheduleForm,
                      repeatNumber: parseInt(e.target?.value, 10) && !Number.isNaN(parseInt(e.target?.value, 10))
                        ? (parseInt(e.target?.value, 10) > 100 ? 100 : parseInt(e.target?.value, 10))
                        : 0
                    })
                    }
                  />
              }&nbsp; &nbsp;{translate('calendars.form.times')}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderRepeatByMonth = () => {
    const onRepeatByMonthChange = (e) => {
      setRepeatTypeWithMonth(parseInt(e.target.value, 10))
    }

    return (
      <>
        <div className="break-line form-group mb-0">
          <div className="wrap-check-radio un-justify-content">
            <p className="radio-item">
              <input type="radio" id="radio4" name="name-radio2"
                defaultChecked={repeatTypeWithMonth === ScheduleRepeatMonthType.Day}
                onChange={onRepeatByMonthChange}
                value={ScheduleRepeatMonthType.Day} />
              <label htmlFor="radio4">{translate('calendars.form.monthly')}</label>
            </p>
            <input className="input-number" type="text" disabled={true} value={dayOfStartDate} />
            <label> &nbsp; {translate('calendars.form.day')}</label>
          </div>
        </div>

        <div className="break-line form-group mb-0">
          <div className="wrap-check-radio un-justify-content">
            <p className="radio-item">
              <input type="radio" id="radio5" name="name-radio2"
                defaultChecked={repeatTypeWithMonth === ScheduleRepeatMonthType.Week}
                onChange={onRepeatByMonthChange}
                value={ScheduleRepeatMonthType.Week} />
              <label htmlFor="radio5">{translate('calendars.form.monthly')}</label>
            </p>
            <label> &nbsp; {translate('calendars.form.first')}</label>
            <input className="input-number" type="text" disabled={true} value={weekMonthOfStartDate} />
            <input className="max-width-auto input-month" type="text" disabled={true} value={dayWeekOfStartDate} />
            <label> &nbsp; {translate('calendars.form.day_of_week')}</label>
          </div>
        </div>

        {
          (isLastDayOfMonth) && (
            <div className="break-line form-group mb-0">
              <div className="wrap-check-radio un-justify-content">
                <p className="radio-item">
                  <input type="radio" id="radio6" name="name-radio2"
                    defaultChecked={repeatTypeWithMonth === ScheduleRepeatMonthType.EndOfMonth}
                    onChange={onRepeatByMonthChange}
                    value={ScheduleRepeatMonthType.EndOfMonth} />
                  <label htmlFor="radio6">{translate('calendars.form.end_of_every_month')}</label>
                </p>
              </div>
            </div>
          )
        }
      </>
    )
  }

  const renderRepeatSchedule = () => {
    return <>
      <div className="break-line form-group mt-3">
        <label>{translate('calendars.form.repeat_condition')}</label>
        <div className="content-items">
          <input className="box-title" defaultValue={initialForm.repeatCycle} onChange={(e) => setScheduleForm({ ...scheduleForm, repeatCycle: parseInt(e.target.value, 10) })} />
          <BeautyPullDown
            items={[
              {
                itemId: ScheduleRepeatType.Day,
                itemLabel: translate('calendars.form.every_day')
              },
              {
                itemId: ScheduleRepeatType.Week,
                itemLabel: translate('calendars.form.every_week')
              },
              {
                itemId: ScheduleRepeatType.Month,
                itemLabel: translate('calendars.form.every_month')
              }
            ]}
            value={repeatType}
            updateStateField={(value) => {
              if (value !== repeatType) {
                setRepeatType(value)
                setScheduleForm({ ...scheduleForm, repeatType: value })
              }
            }} />
        </div>
      </div>

      {repeatType === ScheduleRepeatType.Week && renderWeekDay()}
      {repeatType === ScheduleRepeatType.Month && renderRepeatByMonth()}
      {renderRepeatEndDate()}
    </>
  }
  // ______________END: handle action LOOP SCHEDULE__________________________________
  // **********************************************************************************************
  // ______________START: handle action FILE__________________________________
  const mergeFiles = (newFileAdded) => {
    for (let i = 0; i < newFileAdded.length; i++) {
      const a = newFileAdded[i]
      let exist = false
      for (let j = 0; j < files.length; j++) {
        const b = files[j]
        if (b.name === a.name && b.lastModified === a.lastModified) {
          exist = true
          break
        }
      }
      if (!exist) {
        files.push(a)
      }
    }
    setCallRender(!callRender)
    setFiles(files)
  }

  const handleFileChange = (event) => {
    const file = event.target.files
    if (file.length > 0) {
      const array = Array.from(file)
      mergeFiles(array)
    }
  }

  const handleRemoveFile = (index) => {
    files.splice(index, 1)
    setFiles(files)
    setCallRender(!callRender)
  }

  const handleRemoveFileDefault = (item, index) => {
    filesDefault[index].status = 1;
    setScheduleForm({
      ...scheduleForm,
      allFiles: filesDefault
    })
    setFilesDefault(filesDefault)
    setCallRender(!callRender)
  }

  const getExtentionIcon = (file) => {
    const strFileName = file.name || file.fileName
    const ext = strFileName.split('.').pop();
    if (FILE_FOMATS.IMG.includes(ext)) {
      return 'img';
    }
    if (FILE_FOMATS.DOC.includes(ext)) {
      return 'doc';
    }
    if (FILE_FOMATS.PDF.includes(ext)) {
      return 'pdf';
    }
    if (FILE_FOMATS.PPT.includes(ext)) {
      return 'ppt';
    }
    if (FILE_FOMATS.XLS.includes(ext)) {
      return 'xls';
    }
    return 'xxx';
  }
  // ______________END: handle action FILE__________________________________
  // **************************************************************************************************
  // ______________START: handling action prepare data for sugguestion__________________________________

  /**
   * get participants data
   * @param tags 
   */
  const getParticipantsData = (tags: any[]) => {
    let employees = [],
      departments = [],
      groups = []

    Array.isArray(tags) && tags.forEach((v) => {
      if (v.employeeId) {
        employees = [...employees, { employeeId: v.employeeId }]
      } else if (v.departmentId) {
        departments = [...departments, { departmentId: v.departmentId }]
      } else if (v.groupId) {
        groups = [...groups, { groupId: v.groupId }]
      }
    })

    return {
      employees,
      departments,
      groups
    }
  }
  // ______________END: handling action prepare data for sugguestion__________________________________
  // **************************************************************************************************
  // ______________START: handle action data for sugguestion__________________________________

  /**
   * show equipment suggestion when equipmentSuggestionsList has data
   */
  useEffect(() => {
    const localeDraft = Storage.session.get('locale', 'ja_jp');
    if (equipmentSuggestionsList.length > 0) {
      const response = equipmentSuggestionsList.map((item: Equipment) => {
        return {
          ...item,
          equipmentName: item.equipmentName && JSON.parse(item.equipmentName)[localeDraft] || JSON.parse(item.equipmentName)['ja_jp'] || JSON.parse(item.equipmentName)['en_us'] || JSON.parse(item.equipmentName)['zh_cn'],
          equipmentTypeName: item.equipmentTypeName && JSON.parse(item.equipmentTypeName)[localeDraft] || JSON.parse(item.equipmentTypeName)['ja_jp'] || JSON.parse(item.equipmentTypeName)['en_us'] || JSON.parse(item.equipmentTypeName)['zh_cn']
        }
      });
      setListResponseEquipment(response)
      setShowSuggestionEquip(true)
    } else {
      setListResponseEquipment(null)
    }
  }, [equipmentSuggestionsList]);
  /**
   * close equipment suggestion when click outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      const idTargetCurrent = event.target.getAttribute('id');
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && idTargetCurrent !== 'input-equipment-name-suggestion') {
        setListResponseEquipment(null);
      }
    }
    // Bind the event listener
    document.addEventListener('click', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside);
    };
  }, [wrapperRef])

  /**
   * handle select equipment type
   * @param itemIdSelect
   */
  const handleSelectEquipmentType = itemIdSelect => {
    setEquipmentTypeIdSelect(itemIdSelect);
    setScheduleForm({
      ...scheduleForm,
      equipmentTypeId: itemIdSelect
    })
    setItemEquipmentListSelected([]);
    setErrorEquip({})
    setNameEquipSug("")
  }
  /**
   * handle input equipment suggestion
   * @param e
   */
  const handleInputEquipSuggestion = (value: string) => {
    setNameEquipSug(value);
    if (value && value.length > 0)
      getEquipmentSuggestions(equipmentTypeIdSelect, value)
  }

  /**
   * handle select equipment suggest
   * @param item
   */
  const handleSelectEquipmentSuggest = (item) => {
    if (item.isVailable) {
      const draftData = [
        ...itemEquipmentListSelected,
        {
          ...item,
          startDate: CalenderViewMonthCommon.nowDate()
            .add(30, 'minutes')
            .startOf('hour')
            .format(),
          endDate: CalenderViewMonthCommon.nowDate()
            .add(1, 'hours')
            .add(30, 'minutes')
            .startOf('hour')
            .format(),
        }
      ];
      setItemEquipmentListSelected(draftData);
      setScheduleForm({
        ...scheduleForm,
        equipments: draftData
      })
      setShowSuggestionEquip(false);
    }
  }

  const handleChosenCustomer = (listTag) => {
    if (!listTag || listTag.length === 0) {
      setScheduleForm({ ...scheduleForm, productTradingIds: [], customer: null, customerId: null })
    }
  }

  // ______________END: handle action data for sugguestion__________________________________
  // **************************************************************************************************
  // ______________START: handling action for equipment__________________________________

  /**
   * handle useEffect when listEquipmentType onChange
   * @param item
   */
  useEffect(() => {
    let draftData = [];
    if (listEquipmentType && listEquipmentType.length) {
      draftData = listEquipmentType.map((v) => {
        let typeName = JSON.parse(v.equipmentTypeName)
        typeName = typeName[currentLocale] ?? null
        return {
          itemId: v.equipmentTypeId,
          itemLabel: (
            <>
              <div className="text text2">{typeName}</div>
            </>
          )
        }
      });
      draftData.unshift({
        itemId: 0,
        itemLabel: (
          <>
            <div className="text text2">{translate('calendars.form.all_categories')}</div>
          </>
        )
      })
    } else {
      draftData.push({
        itemId: 0,
        itemLabel: (
          <>
            <div className="text text2">{translate('calendars.form.all_categories')}</div>
          </>
        )
      })
    }
    setListEquipmentTypeConvert(draftData);
  }, [listEquipmentType])

  /**
   * remove equipment selected
   * @param item
   */
  const removeEquipmentSelected = (item) => {
    const flag = itemEquipmentListSelected.findIndex((equip) => equip.equipmentId === item.equipmentId);
    const draftEquipmentList = [
      ...itemEquipmentListSelected
    ]
    draftEquipmentList.splice(flag, 1);
    setScheduleForm({
      ...scheduleForm,
      equipments: draftEquipmentList
    })
    setItemEquipmentListSelected(draftEquipmentList);
    setErrorEquip({})
  }

  /**
   * handle change date time equipment
   * @param index
   * @param dateTime
   * @param type
   */
  const handleChangeDateTimeEquip = (index, dateTime, type) => {
    const draftData = [
      ...itemEquipmentListSelected
    ];
    const checkStartDate = itemEquipmentListSelected
      && itemEquipmentListSelected[index]
      && itemEquipmentListSelected[index].startDate
      && itemEquipmentListSelected[index].startDate !== 'Invalid date'
      ? moment(itemEquipmentListSelected[index].startDate)
      : moment(CalenderViewMonthCommon.nowDate().toDate());
    const checkEndDate = itemEquipmentListSelected
      && itemEquipmentListSelected[index]
      && itemEquipmentListSelected[index].endDate
      && itemEquipmentListSelected[index].endDate !== 'Invalid date'
      ? moment(itemEquipmentListSelected[index].endDate)
      : moment(CalenderViewMonthCommon.nowDate().toDate());
    let convertDate;
    let convertTime;
    switch (type) {
      case TYPE_DATE_EQUIP.startDate:
        if (dateTime === 'Invalid date' || dateTime === 'Invalid Date') dateTime = moment(CalenderViewMonthCommon.nowDate().toDate());
        // dateTime timezone client
        convertDate = CalenderViewMonthCommon.localToTimezoneOfConfig(moment(dateTime, dateFormat)); // convertDateByFormatLocal(dateTime, dateFormat);
        convertDate.hour(checkStartDate.clone().tz(getTimezone()).hour());
        convertDate.minute(checkStartDate.clone().tz(getTimezone()).minute());
        draftData[index] = {
          ...itemEquipmentListSelected[index],
          startDate: convertDate.format()
        }
        break;
      case TYPE_DATE_EQUIP.startTime:
        convertDate = checkStartDate.clone().tz(getTimezone());
        convertTime = moment(dateTime, 'HH:mm');
        convertDate.hour(convertTime.hour());
        convertDate.minute(convertTime.minute());

        draftData[index] = {
          ...itemEquipmentListSelected[index],
          startDate: convertDate.format()
        }
        break;
      case TYPE_DATE_EQUIP.endDate:
        if (dateTime === 'Invalid date' || dateTime === 'Invalid Date') dateTime = moment(CalenderViewMonthCommon.nowDate().toDate());
        convertDate = CalenderViewMonthCommon.localToTimezoneOfConfig(moment(dateTime, dateFormat));
        convertDate.hour(checkEndDate.clone().tz(getTimezone()).hour());
        convertDate.minute(checkEndDate.clone().tz(getTimezone()).minute());
        draftData[index] = {
          ...itemEquipmentListSelected[index],
          endDate: convertDate.format()
        }
        break;
      case TYPE_DATE_EQUIP.endTime:
        convertDate = checkEndDate.clone().tz(getTimezone());
        convertTime = moment(dateTime, 'HH:mm');
        convertDate.hour(convertTime.hour());
        convertDate.minute(convertTime.minute());

        draftData[index] = {
          ...itemEquipmentListSelected[index],
          endDate: convertDate.format()
        }
        break;
      default:
        break;
    }
    setItemEquipmentListSelected(draftData);
    setScheduleForm({
      ...scheduleForm,
      equipments: draftData
    })
  }

  const handleChooseEquipment = (item: any) => {
    saveSuggestionsChoice && saveSuggestionsChoice('', IndexSaveSuggestionChoice.Equipment, item.equipmentId);
    if (Array.isArray(equipmentSuggestionsList) && equipmentSuggestionsList.length > 0) {
      const idx = equipmentSuggestionsList.findIndex(equip => equip.equipmentId === item.equipmentId);
      idx >= 0 ? handleSelectEquipmentSuggest(equipmentSuggestionsList[idx]) : handleSelectEquipmentSuggest(null)
    } else {
      handleSelectEquipmentSuggest(null);
    }
    setListResponseEquipment('');
    setNameEquipSug('');
  }

  /**
   * render error of equipment
   */
  const renderErrorEquip = (index: number, field: string): ReactElement => {
    return errorEquip
      && errorEquip[`${field}_${index}`]
      ? <><br /><span className="error-message color-red">{errorEquip[`${field}_${index}`]}</span></>
      : <></>
  }

  /**
   * get name item by locale
   */
  const getItemNameByLocale = (itemData) => {
    if (!isNullOrUndefined(itemData)) {
      const localeDraft = Storage.session.get('locale', 'ja_jp');
      const item = typeof itemData === 'string' ? JSON.parse(itemData) : itemData;
      if (item[localeDraft] && item[localeDraft].length > 0)
        return item[localeDraft]
      else if (item['ja_jp'] && item['ja_jp'].length > 0)
        return item['ja_jp']
      else if (item['en_us'] && item['en_us'].length > 0)
        return item['en_us']
      else if (item['zh_cn'] && item['zh_cn'].length > 0)
        return item['zh_cn']
    }
    return
  }

  /**
   * render equipment select
   */
  const renderEquipmentSelected = () => {
    return Array.isArray(itemEquipmentListSelected) &&
      itemEquipmentListSelected.length > 0 &&
      itemEquipmentListSelected.map((item, idx) => {
        return <div className="form-group common p-2"
          onMouseOver={() => setIsHoverEquipSuggest(item.equipmentId)}
          onMouseLeave={() => setIsHoverEquipSuggest(0)}
          style={
            isHoverEquipSuggest === item.equipmentId ? { backgroundColor: '#ededed', borderRadius: '15px' } : {}
          }
          key={`1equipment_suggestion_${idx}`}
        >
          <div className="border-none d-flex">
            <div className="col-10 p-0">
              <label className="color-666">{getItemNameByLocale(item.equipmentTypeName)}</label>
              <label className="color-666">{getItemNameByLocale(item.equipmentName)}</label>
              <div className="wrap-select">
                <div className="wrap-select-item">
                  <div className="top-item ">
                    <div className="wrap-input-date wrap-input-date-4-input d-flex">
                      <div className="form-group form-group2 common has-delete">
                        <DatePicker
                          date={CalenderViewMonthCommon.localToTimezoneOfConfig(item.startDate).toDate()}
                          isError={!!errorEquip[`startDate_${idx}`] || !!errorEquip[`startTime_${idx}`]}
                          onDateChanged={(day: Date) => handleChangeDateTimeEquip(idx, moment(day).format(), TYPE_DATE_EQUIP.startDate)}
                        />
                      </div>
                      <div className="w25">
                        <TimePicker
                          divClass="form-group form-group2 common has-delete"
                          inputClass="input-normal"
                          timeInit={
                            CalenderViewMonthCommon.localToTimezoneOfConfig(item.startDate).format("HH:mm")
                            // CalenderViewMonthCommon.nowDate()
                            //   .add(30, 'minutes')
                            //   .startOf('hour')
                            //   .format("HH:mm")
                          }
                          errorInfo={!!errorEquip[`startTime_${idx}`] || !!errorEquip[`startDate_${idx}`] || !!errorEquip[`endDateEquip_${idx}`]}
                          onChangeTime={(time) => handleChangeDateTimeEquip(idx, time, TYPE_DATE_EQUIP.startTime)} />
                      </div>
                      <span className="approximately">{translate('dynamic-control.approximately')}</span>
                      <div className="form-group form-group2 common has-delete">
                        <DatePicker
                          date={CalenderViewMonthCommon.localToTimezoneOfConfig(item.endDate).toDate()}
                          isError={!!errorEquip[`endDate_${idx}`] || !!errorEquip[`endTime_${idx}`]}
                          onDateChanged={(day: Date) => handleChangeDateTimeEquip(idx, moment(day).format(), TYPE_DATE_EQUIP.endDate)}
                        />
                      </div>
                      <div className="w25">
                        <TimePicker
                          divClass="form-group form-group2 common has-delete"
                          inputClass="input-normal"
                          timeInit={
                            CalenderViewMonthCommon.localToTimezoneOfConfig(item.endDate).format("HH:mm")
                            // CalenderViewMonthCommon.nowDate()
                            //   .add(1, 'hours')
                            //   .add(30, 'minutes')
                            //   .startOf('hour')
                            //   .format("HH:mm")
                          }
                          errorInfo={!!errorEquip[`endTime_${idx}`] || !!errorEquip[`endDate_${idx}`] || !!errorEquip[`endDateEquip_${idx}`]}
                          onChangeTime={(time) => handleChangeDateTimeEquip(idx, time, TYPE_DATE_EQUIP.endTime)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-2 p-0">
              {
                isHoverEquipSuggest === item.equipmentId &&
                <button className="close" onClick={() => removeEquipmentSelected(item)}>×</button>
              }
            </div>
          </div>
          {renderErrorEquip(idx, 'startDate')}
          {renderErrorEquip(idx, 'startTime')}
          {renderErrorEquip(idx, 'endDate')}
          {renderErrorEquip(idx, 'endTime')}
          {renderErrorEquip(idx, 'endDateEquip')}
        </div>
      })
  }
  // ______________END: handling action for equipment__________________________________
  // **************************************************************************************************

  const ref1 = useRef(null);

  /**
   * handle close popup settings
   */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
    setOnOpenPopupScheduleSetting(false)
  }

  /**
   * get list Tag not suggestion
   */
  const getTagListNotSuggestion = (item) => {
    let searchType = 0;
    let idChoice = 0;
    if (item.employeeId) {
      searchType = 2;
      idChoice = item.employeeId;
    } else if (item.departmentId) {
      searchType = 1;
      idChoice = item.departmentId;
    } else if (item.groupId) {
      searchType = 3;
      idChoice = item.groupId;
    }
    return { idChoice, searchType }
  }

  const initClickEquipment = () => {
    if (!nameEquipSug || nameEquipSug.length === 0) {
      getEquipmentSuggestions(null, "")
    } else {
      nameEquipSug && nameEquipSug.length > 0 ? getEquipmentSuggestions(equipmentTypeIdSelect, nameEquipSug) : setShowSuggestionEquip(true)
    }
  }

  useImperativeHandle(ref, () => ({
    checkValidateRef(scheduleFormFor) {
      // validateInClient(scheduleFormFor)
      const errorEquipData = validateEquipment(scheduleFormFor);
      const errorData = validateInClient(scheduleFormFor);
      if (!Object.keys(errorData).length && !Object.keys(errorEquipData).length) {
        return true;
      } else {
        setErrorInput(errorData);
        setErrorEquip(errorEquipData);
        return false;
      }
    },
    beforeStoreScheduleRef(_scheduleFormFor, _files, _isNotSave) {
      beforeStoreSchedule(_scheduleFormFor, _files, _isNotSave);
    },
    setErrorInput(_errorData) {
      setErrorInput(_errorData);
    },
    setErrorEquip(_errorData) {
      setErrorEquip(_errorData);
    },
    setDisplayConfirmEdit(_flag) {
      setDisplayConfirmEdit(_flag)
    },
    getFileFromSchedule() {
      return files
    },
    setAllFileToScheduleForm(file: any) {
      setScheduleForm({ ...scheduleForm, allFiles: file })
      setFiles(null)
    }
  }));

  /**
   * render form customer
   */
  const renderFormCustomer = () => {
    if (Array.isArray(listLicense) && listLicense.includes(LICENSE_IN_CALENDAR.CUSTOMER_LICENSE)) {
      return <div className="items">
        <label className="title">
          {translate('calendars.form.customer')}
        </label>
        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="customerIds"
            className="items break-line form-group"
            placeholder={translate('calendars.form.add_customer')}
            inputClass="input-normal"
            elementTags={customer}
            key={customer}
            ref={ref1}
            modeSelect={TagAutoCompleteMode.Single}
            type={TagAutoCompleteType.Customer}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                customerId: listTag.length > 0 ? listTag[0].customerId : null,
                customer: listTag
              })
              setCustomer(listTag)
              handleChosenCustomer(listTag)
              setProductTradings([]);
            }}
          />
        </div>
      </div>
    }

    return <></>
  }

  /**
   * render form product trading
   */
  const renderFormSales = () => {
    if (
      Array.isArray(listLicense)
      && listLicense.includes(LICENSE_IN_CALENDAR.SALES_LICENSE)
      && Array.isArray(customer)
      && customer.length > 0
    ) {
      return <div className="items">
        <label className="title">
          {translate('calendars.form.product_trading')}
        </label>
        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="productTradingIds"
            className="items break-line form-group"
            placeholder={translate('calendars.form.product_trading')}
            inputClass="input-normal"
            elementTags={productTradings}
            key={productTradings}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.ProductTrading}
            hiddenActionRight={true}
            customerIds={Array.isArray(customer) ? customer.map(item => item.customerId) : []}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                productTradingIds: listTag.map(item => item.productTradingId)
              })
              setProductTradings(listTag)
            }}
          />
        </div>
      </div>
    }
    return <></>
  }

  /**
   * render form customer related
   */
  const renderFormCustomerRelated = () => {
    if (Array.isArray(listLicense) && listLicense.includes(LICENSE_IN_CALENDAR.CUSTOMER_LICENSE)) {
      return <div className="items">
        <label className="title">
          {translate('calendars.form.related_customer')}
        </label>
        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="customerIds"
            className="items break-line form-group"
            placeholder={translate('calendars.form.add_related_customer')}
            inputClass="input-normal"
            elementTags={customerRelateds}
            key={customerRelateds}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.Customer}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                customerRelatedIds: listTag.map(item => item.customerId)
              })
              setCustomerRelateds(listTag)
            }}
          />
        </div>
      </div>
    }
    return <></>
  }

  /**
   * render form business card
   */
  const renderFormBusinessCard = () => {
    if (Array.isArray(listLicense) && listLicense.includes(LICENSE_IN_CALENDAR.BUSINESS_CARD_LICENSE)) {
      return <div className="items">
        <label className="title">
          {translate('calendars.form.outside_participant')}
        </label>
        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="customerIds"
            className="items break-line form-group"
            placeholder={translate('calendars.form.add_outside_participant')}
            inputClass="input-normal"
            elementTags={businessCards}
            key={businessCards}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.BusinessCard}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                businessCardIds: listTag.map(item => item.businessCardId),
                otherParticipantIds: listTag.map(item => item.businessCardId),
              });
              setBusinessCards(listTag)
            }}
          />
        </div>
      </div>
    }
    return <></>
  }

  /**
   * RENDER
   */
  return <>
    {/* {displayMessage()} */}
    <div className="row">
      <div className="col-6">
        <div className={`items ${getFieldAdditionalClass('scheduleTypeId')}`}>
          <label className="title" htmlFor="schedule-type">
            {translate('calendars.form.type')}
            <span className="label-red">{translate('calendars.form.required')}</span>
          </label>
          <div className="break-line form-group common">
            <BeautyPullDown
              items={parsedScheduleType}
              extraItems={
                isAdmin ? [
                  {
                    itemId: 'setting-schedule-type',
                    itemLabel: (<><i className="fas fa-cog" /><a target="_blank" onClick={() => { setOnOpenPopupScheduleSetting(true) }} className="pl-2">{translate('calendars.form.register_new_type')}</a></>)
                  }
                ] : []
              }
              defaultLabel={translate('calendars.form.select_type')}
              value={initialForm?.scheduleType?.scheduleTypeId}
              updateStateField={(scheduleTypeId) => setScheduleForm({ ...scheduleForm, scheduleType: { scheduleTypeId } })} />
            {onOpenPopupScheduleSetting && <PopupMenuSet dismissDialog={dismissDialog} menuType={SETTING_MENU.MENU_CALENDAR} calendarTab={CALENDAR_TAB.TAB_SCHEDULE_TYPE} />}
            {getErrorItemWithFieldKey('scheduleTypeId')}
          </div>
        </div>
        <div className={`items ${getFieldAdditionalClass('scheduleName')}`}>
          <label className="title" htmlFor="scheduleName">
            {translate('calendars.form.subject')}
            <span className="label-red">{translate('calendars.form.required')}</span>
          </label>
          <div className="break-line form-group common">
            <input
              type="text"
              name="scheduleName"
              className="input-normal"
              placeholder={translate('calendars.form.enter_subject')}
              defaultValue={initialForm.scheduleName}
              // value={scheduleForm.scheduleName}
              onChange={(e) => {
                setScheduleForm({ ...scheduleForm, scheduleName: e.target.value });
                // console.log("e.target.value", e.target.value)
              }}
              onKeyDown={(e) => {
                // press key Backspace or Delete
                if (e.keyCode === 8 || e.keyCode === 46) {
                  const dataSelection = window.getSelection();
                  // console.log("window.getSelection()", window.getSelection().toString())
                  if (dataSelection.toString() === initialForm.scheduleName)
                    setScheduleForm({ ...scheduleForm, scheduleName: null })
                }
              }}
            />
            {getErrorItemWithFieldKey('scheduleName')}
          </div>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.date_and_time')}
            <span className="label-red">{translate('calendars.form.required')}</span>
          </label>
          <div className="break-line form-group common">
            <div className="wrap-check wrap-check3">
              <div className="wrap-select">
                <div className="wrap-select-item">
                  <div className="top-item d-flex">
                    <div className="wrap-input-date wrap-input-date-4-input d-flex">

                      <div className="form-group form-group2 common has-delete">
                        <DatePicker
                          date={startDatePicker}
                          onDateSelected={(day: Date) => {
                            if (day) {
                              setDraftStartDay(moment(day).format('YYYY-MM-DD'))
                              setStartDate(day)
                            } else {
                              setDraftStartDay(null)
                              setStartDate(null)
                            }
                          }}
                          isError={!!errorInput['startDay']}
                        />
                      </div>
                      {
                        (!isFullDay) ?
                          (
                            <div className="w30">
                              <TimePicker
                                divClass="form-group form-group2 common has-delete"
                                inputClass="input-normal"
                                timeInit={
                                  // scheduleData && !scheduleData.isFullDay ? CalenderViewMonthCommon.localToTimezoneOfConfig(scheduleData.startDate).format(timeFormat)
                                  //   : CalenderViewMonthCommon.nowDate()
                                  //     .add(30, 'minutes')
                                  //     .startOf('hour')
                                  //     .format(timeFormat)
                                  // startTime
                                  startTimeInput
                                }
                                onChangeTime={(time) => {
                                  if (startTime !== time) {
                                    setDraftStartTime(time);
                                    setStartTime(time);
                                    // onChangeStartDateTime();
                                  }
                                }}
                                errorInfo={!!errorInput['startTime']}
                              />
                            </div>
                          )
                          : <></>
                      }
                      <span className="approximately">{translate('dynamic-control.approximately')}</span>
                      <div className="form-group form-group2 common has-delete">
                        <DatePicker
                          date={endDatePicker}
                          onDateSelected={(day: Date) => {
                            if (day) {
                              setDraftEndDay(moment(day).format('YYYY-MM-DD'))
                              setEndDate(day)
                            } else {
                              setDraftEndDay(null)
                              setEndDate(null)
                            }
                          }}
                          isError={!!errorInput['endDay']}
                        />
                      </div>
                      {
                        (!isFullDay) &&
                        (
                          <div className="w30">
                            <TimePicker
                              divClass="form-group form-group2 common has-delete"
                              inputClass="input-normal"
                              timeInit={
                                // scheduleData && !scheduleData.isFullDay ? CalenderViewMonthCommon.localToTimezoneOfConfig(scheduleData.endDate).format(timeFormat)
                                //   : CalenderViewMonthCommon.nowDate()
                                //     .add(1, 'hours')
                                //     .add(30, 'minutes')
                                //     .startOf('hour')
                                //     .format("HH:mm")
                                // endTime
                                endTimeInput
                              }
                              onChangeTime={(time) => {
                                if (endTime !== time) {
                                  setDraftEndTime(time);
                                  setEndTime(time);
                                  // onChangeEndDateTime();
                                }
                              }}
                              errorInfo={!!errorInput['endTime']}
                            />
                          </div>
                        )
                      }
                    </div>
                    {/* To be developed in phase 2
                    <a title=""
                      className="button-primary button-activity-registration text-ellipsis button-activity-register-in-calendar"
                    >
                      {translate('calendars.form.adjust_your_appointment')}
                    </a> */}
                  </div>
                </div>
              </div>
              {getErrorItemWithFieldKey('startDay')}
              {getErrorItemWithFieldKey('startTime')}
              {getErrorItemWithFieldKey('endDay')}
              {getErrorItemWithFieldKey('endTime')}
              <div className="wrap-check-box 123">
                <p className="check-box-item">
                  <label className="icon-check width-fit-content">
                    <input
                      type="checkbox"
                      checked={isFullDay}
                      // defaultChecked={scheduleForm.isRepeated || scheduleForm.isFullDay}
                      onChange={(e) => {
                        if (isFullDay !== e.target.checked) {
                          setScheduleForm({ ...scheduleForm, isFullDay: e.target.checked })
                          setIsFullDay(e.target.checked)
                        }
                      }} /><i /> {translate('calendars.form.plan_whole_day')}
                  </label>
                </p>
                <p className="check-box-item">
                  <label className="icon-check width-fit-content">
                    <input
                      type="checkbox"
                      checked={scheduleForm.isRepeated}
                      // defaultChecked={scheduleForm.isRepeated}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, isRepeated: e.target.checked })} /><i /> {translate('calendars.form.repeat')}
                  </label>
                </p>
              </div>
              {scheduleForm.isRepeated && renderRepeatSchedule()}
            </div>
          </div>
        </div>

        {renderFormCustomer()}
        {renderFormSales()}
        {renderFormCustomerRelated()}

        <div className="items">
          <label className="title">
            {translate('calendars.form.street_address')}
          </label>
          <div className="break-line form-group common">
            <DynamicControlField
              ref={addressRef}
              fieldInfo={{
                fieldType: DEFINE_FIELD_TYPE.ADDRESS
              }}
              elementStatus={addressInfo}
              controlType={ControlType.EDIT}
              updateStateElement={(item, type, val) => {
                const response: IAddress = typeof val === 'string' && JSON.parse(val)
                setScheduleForm({
                  ...scheduleForm,
                  zipCode: response['zip_code'] ? response['zip_code'] : null,
                  addressBelowPrefectures: response['address_name'] ? response['address_name'] : null,
                  buildingName: response['building_name'] ? response['building_name'] : null
                })
              }} />
          </div>
        </div>

        {renderFormBusinessCard()}

        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="participantIds"
            className="items break-line form-group"
            placeholder={translate('calendars.form.add_participant')}
            inputClass="input-normal"
            elementTags={participants}
            key={JSON_STRINGIFY(participants)}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.Employee}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                participants: getParticipantsData(listTag)
              })
              setParticipants(listTag)
            }}
            tagListNotSuggestion={Array.isArray(sharers) && sharers.map((item) => {
              const { idChoice, searchType } = getTagListNotSuggestion(item);
              return { idChoice, searchType };
            }
            )}
            title={translate('calendars.form.participant')}
          />
        </div>
        <div className="items mb-3">
          <label className="icon-check width-fit-content">
            <input type="checkbox"
              checked={scheduleForm.isAllAttended}
              onChange={(e) => setScheduleForm({ ...scheduleForm, isAllAttended: e.target.checked })} />
            <i /> {translate('calendars.form.all_participant_involve')}
          </label>
        </div>

        <div className="form-group set-clear-table-list-wrap items">
          <TagAutoComplete
            id="sharerIds"
            className="items break-line form-group"
            placeholder={translate('calendars.form.add_sharer')}
            inputClass="input-normal"
            elementTags={sharers}
            key={sharers}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.Employee}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                sharers: getParticipantsData(listTag)
              })
              setSharers(listTag)
            }}
            tagListNotSuggestion={Array.isArray(participants) && participants.map((item) => {
              const { idChoice, searchType } = getTagListNotSuggestion(item);
              return { idChoice, searchType };
            }
            )}
            title={translate('calendars.form.sharer')}
          />

          <div className="row items-1">
            <div className="form-group col-4 pl-0">
              <BeautyPullDownForEquipment
                items={listEquipmentTypeConvert}
                extraItems={
                  isAdmin ? [
                    {
                      itemId: 'setting-schedule-type',
                      itemLabel: (<><i className="fas fa-cog" /><a target="_blank" onClick={() => { setOnOpenPopupSetting(true) }} className="pl-2">{translate('calendars.controls.sidebarMenu.addNewResource')}</a></>)
                    }
                  ] : []
                }
                defaultLabel={translate('calendars.form.all_categories')}
                value={initialForm?.equipmentTypeId}
                updateStateField={handleSelectEquipmentType}
              />
              {onOpenPopupSetting && <PopupMenuSet dismissDialog={() => { setOnOpenPopupSetting(false) }} menuType={SETTING_MENU.MENU_CALENDAR} calendarTab={CALENDAR_TAB.TAB_EQUIQMENT_TYPE} />}
            </div>
            <div className="form-group common col-8 p-0 ">
              <input
                type="text"
                className="input-normal"
                id="input-equipment-name-suggestion"
                value={nameEquipSug}
                placeholder={translate('calendars.form.add_meeting_room_and_equipment')}
                onChange={(e) => handleInputEquipSuggestion(e.target.value)}
                // onKeyUp={e => handleSubmitEquipSug(e)}
                onClick={() => initClickEquipment()}
              />
              {/* {renderSuggestionEquipment()} */}
              <SuggestComponent
                typeComponent={ACTION_LOCAL_NAVIGATION.EQUIPMENT}
                listData={listResponseEquipment}
                insertItem={handleChooseEquipment}
                setOpenPopupSettingEquip={setOpenPopupSettingEquip}
                isAdmin={isAdmin}
                dataScreen={itemEquipmentListSelected}
              />
            </div>
            {renderEquipmentSelected()}
            {
              openPopupSettingEquip &&
              <PopupMenuSet
                dismissDialog={() => setOpenPopupSettingEquip(false)}
                menuType={SETTING_MENU.MENU_CALENDAR}
                calendarTab={CALENDAR_TAB.TAB_EQUIQMENT_TYPE} />
            }
          </div>
        </div>

        <div className="items">
          <label className="title">
            {translate('calendars.form.extended_app')}
          </label>
          <div className="break-line form-group common">
            <input type="text" className="input-normal" placeholder={translate('calendars.form.add_extended_app')} value={undefined} />
          </div>
        </div>

      </div>


      <div className="col-6">
        <div className="items">
          <label className="title">
            {translate('calendars.form.note')}
          </label>
          <div className="form-group">
            <textarea placeholder={translate('calendars.form.enter_note')} defaultValue={initialForm.note} onChange={(e) => setScheduleForm({ ...scheduleForm, note: e.target.value })} />
          </div>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.file')}
          </label>
          <div className="input-common-wrap ">
            <div className="upload-wrap">
              <input id="uploadFile" className="f-input" value={undefined} />
              <div className="fileUpload btn btn--browse">
                <span><i className="far fa-plus mr-2" />{translate('calendars.form.click_or_drop_file')}</span>
                <p className="file"></p>
                <button type="button" className="remove hidden"><img title="" src="../../content/images/ic-control.svg" alt="" /></button>
                <input id="uploadBtn" type="file" className="upload" value={undefined} onChange={(e) => { handleFileChange(e) }} />
              </div>
            </div>
            <div className="form-group input-common-wrap mt-2">
              <div className="list-files mt-3 clearfix">
                {files && files.map((item, index) => {
                  const fileExtension = item.name.split('.').pop()
                  return (
                    <div key={`file-${index}`} className="item">
                      <img src={`/content/images/file-icon-pack/svg/${fileExtension}.svg`} width="20px" height="20px" alt="" className="icon fa-pull-left" />
                      <span className="text-ellipsis" onMouseOver={() => { if (getExtentionIcon(item) === 'img') { setPreviewImage(URL.createObjectURL(item)); setHoverIndex(index) } }} onMouseLeave={() => { setPreviewImage('') }} >{item.name}</span>
                      <button type="button" className="close" onClick={() => handleRemoveFile(index)}>×</button>
                      {
                        getExtentionIcon(item) === 'img' && previewImage && index === hoverIndex &&
                        <div className="box-choose-file">
                          <img src={previewImage} />
                        </div>
                      }
                    </div>
                  )
                })}
                {filesDefault && filesDefault.map((itemDefault, index) => {
                  const fileExtension = itemDefault.fileName.split('.').pop()
                  return (
                    <>
                      {
                        (!itemDefault.status || itemDefault.status !== 1) &&
                        <div key={`filesDefault-${index}`} className="item">
                          <img src={`/content/images/file-icon-pack/svg/${fileExtension}.svg`} width="20px" height="20px" alt="" className="icon fa-pull-left" />
                          <span className="text-ellipsis" onMouseOver={() => { if (getExtentionIcon(itemDefault) === 'img') { setPreviewImage(itemDefault.fileUrl); setHoverIndex(index) } }} onMouseLeave={() => { setPreviewImage('') }} >{itemDefault.fileName}</span>
                          <button type="button" className="close" onClick={() => handleRemoveFileDefault(itemDefault, index)}>×</button>
                          {
                            getExtentionIcon(itemDefault) === 'img' && previewImage && index === hoverIndex &&
                            <div className="box-choose-file" key={`filesDefault-img-${index}`}>
                              <img src={previewImage} />
                            </div>
                          }
                        </div>
                      }
                    </>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone suggestion */}
        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="milestone_create_id"
            className="items break-line form-group"
            placeholder={translate('calendars.form.add_milestone')}
            inputClass="input-normal"
            elementTags={milestones}
            key={milestones}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.Milestone}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                milestoneIds: listTag.map(item => item.milestoneId) || []
              })
              setMilestones(listTag);
            }}
            title={translate('calendars.form.milestone')}
          />
        </div>
        <div className="form-group set-clear-table-list-wrap">
          <TagAutoComplete
            id="taskIds"
            className="items break-line form-group common"
            placeholder={translate('calendars.form.add_task')}
            inputClass="input-normal"
            elementTags={tasks}
            key={tasks}
            modeSelect={TagAutoCompleteMode.Multi}
            type={TagAutoCompleteType.Task}
            onActionSelectTag={(id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
              setScheduleForm({
                ...scheduleForm,
                taskIds: listTag.map(item => item.taskId) || []
              })
              setTask(listTag)
            }}
            title={translate('calendars.form.task')}
          />
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.publishing_setting')}
          </label>
          <div className="break-line form-group common">
            <div className="wrap-check wrap-check3 pt-0 pb-0">
              <div className="wrap-check-box">
                <p className="check-box-item mb-2">
                  <label className="icon-check width-fit-content">
                    <input type="checkbox" checked={scheduleForm.isPublic} onChange={(e) => setScheduleForm({ ...scheduleForm, isPublic: e.target.checked })} value={null} /><i /> {translate('calendars.form.public')}
                  </label>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.editable_setting')}
          </label>
          <div className="break-line form-group common">
            <div className="wrap-check wrap-check3">
              <div className="wrap-check-box">
                <label className="icon-check width-fit-content">
                  <input type="checkbox" checked={scheduleForm.canModify} onChange={(e) => setScheduleForm({ ...scheduleForm, canModify: e.target.checked })} value={null} /><i /> {translate('calendars.form.do_allow_to_edit')}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.registration_date')}
          </label>
          <p className="text-bottom">{initialForm && initialForm.createdDate && CalenderViewMonthCommon.localToTimezoneOfConfig(scheduleForm.createdDate).toDate().toLocaleDateString()}</p>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.last_updated_date')}
          </label>
          <p className="text-ellipsis width-120-px">{initialForm && initialForm.createdUserSurName} {initialForm && initialForm.createdUserName}</p>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.registered_people')}
          </label>
          <p className="text-bottom">{initialForm && initialForm.updatedDate && CalenderViewMonthCommon.localToTimezoneOfConfig(scheduleForm.updatedDate).toDate().toLocaleDateString()}</p>
        </div>
        <div className="items">
          <label className="title">
            {translate('calendars.form.final_updater')}
          </label>
          <p className="text-ellipsis width-120-px">{initialForm && initialForm.updatedUserSurName} {initialForm && initialForm.updatedUserName}</p>
        </div>
      </div>
    </div>
    {displayConfirmEditLoopSchedule()}
    <EquipmentError dataOfResource={{ scheduleId: TYPE_SCREEN.createSchedule }} isEdit={modeEdit} />
    <EquipmentConfirm dataOfResource={{ scheduleId: TYPE_SCREEN.createSchedule }} isEdit={modeEdit} isNotSave={isNotSave}/>
  </>
})

const mapStateToProps = ({ locale, dataCreateEditSchedule, authentication: { account }, dataCalendarGrid: { dateShow, equipmentTypes } }: IRootState) => ({
  currentLocale: locale.currentLocale,
  scheduleData: dataCreateEditSchedule.scheduleData,
  scheduleTypes: dataCreateEditSchedule.scheduleTypes,
  listEquipmentType: equipmentTypes,
  isAdmin: hasAnyAuthority(account.authorities, [AUTHORITIES.ADMIN]),
  formatDateFromSetting: account.formatDate,
  defaultDate: dataCreateEditSchedule.dateOnClick,
  saveDataSuccess: dataCreateEditSchedule.success,
  errorMessage: dataCreateEditSchedule.errorMessage,
  successMessage: dataCreateEditSchedule.successMessage,
  errorItems: dataCreateEditSchedule.errorItems,
  equipmentSuggestionsList: dataCreateEditSchedule.equipmentSuggestions,
  infoEmployee: dataCreateEditSchedule.employeeInfo,
  listLicense: account.licenses
})

const mapDispatchToProps = {
  getScheduleType: getScheduleTypes,
  getEquipmentType: getEquipmentTypes,
  saveSchedule: storeSchedule,
  reloadGrid: reloadGridData,
  getEquipmentSuggestions: getEquipmentSuggestionsData,
  beforeStoreSchedule: beforeCheckStoreSchedule,
  updateScheduleDataActivity: updateScheduleDataDraf
}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

const options = { forwardRef: true };

export default connect<StateProps, DispatchProps, IComponentProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(CreateEditComponent);
