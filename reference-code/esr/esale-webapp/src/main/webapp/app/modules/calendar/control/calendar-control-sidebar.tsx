import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'

import { Storage, translate } from 'react-jhipster';
import moment from 'moment'
import MiniCalendar from '../common/calendar-mini'
import {
  onChangeDateShow,
  onChangeLocalNavigation,
  onChangeTabShow,
  getEquipmentTypes,
  setOverFlow,
  resetEquipmentSuggest,
  handleReloadData
} from '../grid/calendar-grid.reducer'
import { ACTION_LOCAL_NAVIGATION, EnumIconTypeTypes, TabForcus } from '../constants';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
// import Autosuggest from 'react-autosuggest';
import { IndexSaveSuggestionChoice } from 'app/modules/calendar/constants';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete'

import { handleSearchEmployee, } from '../../employees/list/employee-list.reducer'
import { ScheduleTypesType, EquipmentTypesType, Equipment } from '../models/get-local-navigation-type';
import ItemControlSideBar from './item/item-employee-control-sidebar';
import SuggestComponent from "app/modules/calendar/control/item/suggest-component";
import PopupMenuSet from '../../setting/menu-setting';

import {
  DUMMY_DATA_LOCAL_NAVIGATION,
  // DUMMY_EQUIPMENT_TYPES, DUMMY_GET_SCHEDULE_TYPES,
  IScheduleTypes
} from "app/modules/calendar/models/get-schedule-types-type";
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import {
  getScheduleTypes,
  getScheduleTypeSuggestionsData,
  saveSuggestionsChoice
} from "app/modules/calendar/popups/create-edit-schedule.reducer";
import { CALENDAR_TAB, SETTING_MENU } from "app/modules/setting/constant";
import '../style/custom.scss';
import SettingComponent from "app/modules/calendar/control/item/setting-component";
import { CALENDAR_EMP_COLOR } from "../constants";
import { truncateString } from '../modal/details/calendar-modal-information';
import { scheduleTypeIcons } from 'app/modules/setting/calendar/schedule/list-schedule-types/constant';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';

const isDummy = false;

export const enum TYPE_SETTING {
  schedule = 1,
  equipment
}

const CalendarControlSiteBar = (props: DispatchProps & StateProps) => {
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [loadLocalMenu, setLoadLocalMenu] = useState(false)
  // const [monthShow, setMonthShow] = useState(CalenderViewMonthCommon.nowDate().toDate())
  const wrapperRef = useRef(null);
  const { localNavigationProps } = props;
  const [localNavigation, setLocalNavigation] = useState(localNavigationProps)
  const [inputScheduleType, setInputScheduleType] = useState('');
  const [hoverChild, setHoverChild] = useState(false);
  const [listResponseScheduleType, setListResponseScheduleType] = useState<any>();
  const [inputEquipment, setInputEquipment] = useState('');
  const [listResponseEquipment, setListResponseEquipment] = useState<any>();
  const [dataApiScheduleTypes, setDataApiScheduleTypes] = useState<any>();
  const [dataApiEquipmentTypes, setDataApiEquipmentTypes] = useState<any>();
  const [onOpenPopupSetting, setOnOpenPopupSetting] = useState<any>();
  /** on/off tab */
  const [tabSchedule, setTabSchedule] = useState(0);
  const [showSettingSchedule, setShowSettingSchedule] = useState<any>();
  const [showSettingEquipment, setShowSettingEquipment] = useState<any>();
  const [showSetting, setShowSetting] = useState<any>();
  const [setting, setSetting] = useState<any>();
  const [showGroups, setShowGroups] = useState<any>();
  const [settingGroups, setSettingGroups] = useState<any>();
  const [onOpenPopupScheduleSetting, setOnOpenPopupScheduleSetting] = useState<any>()

  useEffect(() => {
    if (props.currentLocale) 
      props.handleReloadData()
  }, [props.currentLocale])

  useEffect(() => {
    setLocalNavigation(localNavigationProps)
  }, [localNavigationProps])

  useEffect(() => {
    props.getScheduleTypes();
    props.getEquipmentTypes();
  }, []);

  useEffect(() => {
    if (props.scheduleTypes)
      setDataApiScheduleTypes(props.scheduleTypes);
  }, [props.scheduleTypes]);

  useEffect(() => {
    if (props.equipmentTypes)
      setDataApiEquipmentTypes(props.equipmentTypes)
  }, [props.equipmentTypes])
  /**
   * set DUMMY DATA
   */
  useEffect(() => {
    if (isDummy) {
      const DUMMY_DATA = {
        searchConditions: DUMMY_DATA_LOCAL_NAVIGATION
      }
      setLocalNavigation(DUMMY_DATA);
    }
  }, []);
  /** on/off div start */
  const [showEmployee, setShowEmployee] = useState(true);
  const [showParticipationStatus, setShowParticipationStatus] = useState(true);
  const [showItemType, setShowItemType] = useState(true);
  const [showResourceType, setShowResourceType] = useState(true);
  /** on/off div end */

  // const [isCheckAllItem, setIsCheckAllItem] = useState(false)

  /** auto complete dataItemType start */
  // const [suggestionsItemType, setSuggestionsItemType] = useState([]);
  // const [autoCompleteValueItemType, setAutoCompleteValueItemType] = useState('');
  /** auto complete dataItemType end */

  // const [suggestionsEmployee, setSuggestionsEmployee] = useState([]);
  // const [autoCompleteValueEmployee, setAutoCompleteValueEmployee] = useState('');

  /** setDataSearchStatic */
  const [dataSearchStatic, setDataSearchStatic] = useState({});
  const [, setOnShowSetting] = useState(false);
  const [hadShow, setHadShow] = useState(false);

  const onSelectedDate = (date: Date) => {
    props.onChangeDateShow(moment(date), 0, props.typeShowGrid)
  }

  /**
   * hidden component if clicked on outside of element
   */
  function handleClickOutside(event) {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowSettingSchedule('');
      setShowSettingEquipment('');
      setListResponseEquipment('');
      setListResponseScheduleType('');
    }
    if(isNullOrUndefined(wrapperRef.current)){
      setListResponseScheduleType('');
    }
  }

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("click", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("click", handleClickOutside);
    };
  }, [wrapperRef]);

  const onClickTabSchedule = () => {
    props.onChangeTabShow(TabForcus.Schedule);
    dataSearchStatic["viewTab"] = TabForcus.Schedule;
  }
  const onClickTabResource = () => {
    props.onChangeTabShow(TabForcus.Resource);
    dataSearchStatic["viewTab"] = TabForcus.Schedule;
  }

  useEffect(() => {
    const localeDraft = Storage.session.get('locale', 'ja_jp');
    if (props.scheduleTypesSuggestionsList && props.scheduleTypesSuggestionsList.length > 0) {
      const draftData = props.scheduleTypesSuggestionsList;
      draftData.forEach((item: IScheduleTypes) => {
        if (typeof item.scheduleTypeName === 'string')
          item.scheduleTypeName = JSON.parse(item.scheduleTypeName);
      });
      const response = draftData.filter((item: IScheduleTypes) => {
        if (typeof item.scheduleTypeName === 'object') {
          const check = item.scheduleTypeName[localeDraft]?.toLowerCase().indexOf(inputScheduleType.toLowerCase())
          if (check >= 0)
            return item;
        }
        return null;
      }).map((item: IScheduleTypes) => {
        return {
          ...item,
          scheduleTypeName: item?.scheduleTypeName[localeDraft],
        }
      });
      response.length ? setListResponseScheduleType(response) : setListResponseScheduleType('');
    } else {
      setListResponseScheduleType('')
    }

  }, [props.scheduleTypesSuggestionsList])

  useEffect(() => {
    const localeDraft = Storage.session.get('locale', 'ja_jp');
    if (props.equipmentSuggestionsList && props.equipmentSuggestionsList.length > 0) {
      const draftData = props.equipmentSuggestionsList;
      const tmpData = []
      draftData.forEach((item: Equipment) => {
        if (typeof item.equipmentTypeName === 'string')
          item.equipmentTypeName = JSON.parse(item.equipmentTypeName);
      });
      const response = draftData.filter((item: Equipment) => {
        if (typeof item.equipmentTypeName === 'object') {
          const check = item.equipmentTypeName[localeDraft]?.toLowerCase().indexOf(inputEquipment.toLowerCase());
          if (check >= 0 && !tmpData.includes(item)){
            tmpData.push(item)
            return item;
          }
        }
        return null;
      }).map((item: Equipment) => {
        return {
          ...item,
          equipmentTypeName: item?.equipmentTypeName[localeDraft],
        }
      });
      response.length ? setListResponseEquipment(response) : setListResponseEquipment('');
    } else {
      // setListResponseEquipment(props.errorMessEquipmentCallApi);
      setListResponseEquipment(null);
    }
  }, [props.equipmentSuggestionsList]);

  useEffect(() => {
    const searchStatic = localNavigation && localNavigation.searchConditions && localNavigation.searchConditions["searchStatic"];
    setDataSearchStatic(searchStatic)
    setTabSchedule(!searchStatic || !searchStatic['viewTab'] || searchStatic['viewTab'] === 0 ? 0 : 1)
  }, [localNavigation])

  const onChangeEmployeeInDepar = (obj: any, element: any, type: any) => {
    localNavigation.searchConditions["searchDynamic"][`${type ? type : 'departments'}`].forEach(item => {
      if (item.employees) {
        item.employees.forEach(emp => {
          if (emp.employeeId === element.employeeId) {
            emp.isSelected = obj.target.checked ? 1 : 0;
          }
        })
      }
    })
    props.onChangeLocalNavigation(localNavigation);
  }

  const selectEmployee = (employeeId, isSelected, type) => {
    localNavigation.searchConditions["searchDynamic"][`${type}`].forEach(department => {
      const employee = department.employees.find(item => item.employeeId === employeeId)
      if (employee) {
        employee.isSelected = isSelected;
        department.isSelected = department.employees.every(item => item.isSelected === 1) ? 1 : 0;
      }
    });

  }

  const onSelectDepartment = (departmentId) => {
    const department = localNavigation.searchConditions.searchDynamic.departments.find(item => item.departmentId === departmentId);
    const selected = department.isSelected === 1 ? 0 : 1
    department.isSelected = selected
    if (department.employees) {
      department.employees.forEach(employee => {
        selectEmployee(employee.employeeId, selected, 'departments');
      });
    }
    props.onChangeLocalNavigation(localNavigation)
    setLoadLocalMenu(!loadLocalMenu)
  }
  const onSelectGroups = (groupId) => {
    const group = localNavigation.searchConditions.searchDynamic.groups.find(item => item.groupId === groupId);
    const selected = group.isSelected === 1 ? 0 : 1
    group.isSelected = selected
    if (group.employees) {
      group.employees.forEach(employee => {
        selectEmployee(employee.employeeId, selected, 'groups');
      });
    }
    props.onChangeLocalNavigation(localNavigation)
    setLoadLocalMenu(!loadLocalMenu)
  }
  const onRemoveDepartment = (id) => {
    localNavigation.searchConditions.searchDynamic.departments.forEach((dep) => {
      if (dep.departmentId === id) {
        const index = localNavigation.searchConditions.searchDynamic.departments.indexOf(dep)
        if (index > -1) {
          localNavigation.searchConditions.searchDynamic.departments.splice(index, 1);
        }
      }
    })
    props.onChangeLocalNavigation(localNavigation);
    setLoadLocalMenu(!loadLocalMenu)
  }

  const onRemoveGroup = (id) => {
    localNavigation.searchConditions.searchDynamic.groups.forEach((dep) => {
      if (dep.groupId === id) {
        const index = localNavigation.searchConditions.searchDynamic.groups.indexOf(dep)
        if (index > -1) {
          localNavigation.searchConditions.searchDynamic.groups.splice(index, 1);
        }
      }
    })
    props.onChangeLocalNavigation(localNavigation);
    setLoadLocalMenu(!loadLocalMenu)
  }


  const onChangeSearchStatic = (option: any, field: string) => {
    if (dataSearchStatic) {
      dataSearchStatic[`${field}`] = option.target.checked ? 1 : 0;
    }
    props.onChangeLocalNavigation(localNavigation)
  }
  const onCheckAllItemType = (obj) => {
    if (obj.target.checked) {
      localNavigation.searchConditions.searchDynamic.scheduleTypes.forEach((e) => {
        e.isSelected = 1
      });
    } else {
      localNavigation.searchConditions.searchDynamic.scheduleTypes.forEach((e) => {
        e.isSelected = 0
      });
    }
    props.onChangeLocalNavigation(localNavigation);
    setLoadLocalMenu(!loadLocalMenu)
  }

  const onChangeScheduleTypes = (obj: any, element: any) => {
    localNavigation.searchConditions.searchDynamic.scheduleTypes.forEach(item => {
      if (item.scheduleTypeId === element.scheduleTypeId) {
        item.isSelected = obj.target.checked ? 1 : 0;
      }
    })
    props.onChangeLocalNavigation(localNavigation)
    setLoadLocalMenu(!loadLocalMenu)
  }

  /**
     * handle action open popup setting
     */
  const handleOpenPopupSetting = () => {
    setOnOpenPopupSetting(true)
  }

  /**
   * handle close popup settings
   */
  const dismissDialog = () => {
    setOnOpenPopupSetting(false);
    setOnOpenPopupScheduleSetting(false)
  }


  const renderItemTypeShow = () => {
    const convertData = (itemSchedule: ScheduleTypesType) => {
      switch (parseInt(itemSchedule.iconType, 10)) {
        case EnumIconTypeTypes.PERSON:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        case EnumIconTypeTypes.USER:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        case EnumIconTypeTypes.PHONE:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        case EnumIconTypeTypes.BAG:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        case EnumIconTypeTypes.RECYCLEBIN:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        case EnumIconTypeTypes.BELL:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        case EnumIconTypeTypes.TEXT:
          return { scheduleTypeId: itemSchedule.scheduleTypeId, isSelected: itemSchedule.isSelected, scheduleTypeName: itemSchedule.scheduleTypeName, className: "icon-calendar-person", icon: itemSchedule.iconName, iconType: itemSchedule.iconType }
        default:
          return {
            scheduleTypeId: itemSchedule.scheduleTypeId,
            isSelected: itemSchedule.isSelected,
            scheduleTypeName: itemSchedule.scheduleTypeName,
            className: "icon-calendar-person",
            icon: itemSchedule.iconPath,
            iconType: itemSchedule.iconType
          }
      }
    }

    const handleInputFormScheduleType = (dataInput: string) => {
      setInputScheduleType(dataInput);
      if (dataInput && dataInput.length > 0) {
        props.getScheduleTypeSuggestionsData(dataInput.toLowerCase())
      } else {
        props.getScheduleTypeSuggestionsData(dataInput)
      }
    }

    /**
     *  insert item when select item
     *  @param item
     */
    const handleChooseScheduleType = (item: any) => {
      const draftItem = {
        ...item,
        isSelected: 1
      }
      props.saveSuggestionsChoice('', IndexSaveSuggestionChoice.Schedule, item.scheduleTypeId)
      setInputScheduleType('');
      setListResponseScheduleType('');
      localNavigation.searchConditions
        && localNavigation.searchConditions.searchDynamic
        && localNavigation.searchConditions.searchDynamic.scheduleTypes
        && localNavigation.searchConditions.searchDynamic.scheduleTypes.push(draftItem);
      props.onChangeLocalNavigation(localNavigation)
    }

    const handleRemoveSchedule = (scheduleTypeId) => {
      setShowSettingSchedule('');
      const index = localNavigation?.searchConditions?.searchDynamic?.scheduleTypes.findIndex(item => item.scheduleTypeId === scheduleTypeId);
      localNavigation.searchConditions
        && localNavigation.searchConditions.searchDynamic
        && localNavigation.searchConditions.searchDynamic.scheduleTypes
        && localNavigation.searchConditions.searchDynamic.scheduleTypes.splice(index, 1);
      props.onChangeLocalNavigation(localNavigation)
    }

    const getIcon = (item) => {
      const typeIcon = _.find(scheduleTypeIcons, _.matchesProperty('iconType', Number(item.iconType)));
      return typeIcon.iconPath;
    }

    return (
      <>
        <div className="tab-expand cursor-pointer" onClick={() => { setShowItemType(!showItemType); setListResponseScheduleType(''); }}>
          <i className={showItemType ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>
          {translate("calendars.controls.sidebarMenu.type")}
        </div>
        {showItemType
          && localNavigation
          && localNavigation.searchConditions
          && localNavigation.searchConditions.searchDynamic &&
          (
            <>
              <div className="form-group" ref={wrapperRef}>
                <div className="input-common-wrap delete">
                  <input type="text"
                    className="input-normal"
                    placeholder={translate("calendars.controls.sidebarMenu.placeholder_schedule_type")}
                    value={inputScheduleType}
                    onChange={(e) => handleInputFormScheduleType(e.target.value)}
                    onClick={() => hadShow ? null : (inputScheduleType.length === 0 && handleInputFormScheduleType(""))}
                    
                  />
                  {
                    inputScheduleType.length > 0 &&
                    <span className="icon-delete"
                      onClick={() => {
                        setInputScheduleType('');
                        setListResponseScheduleType('');
                      }} />
                  }
                  <SuggestComponent typeComponent={ACTION_LOCAL_NAVIGATION.SCHEDULE}
                    listData={listResponseScheduleType}
                    insertItem={handleChooseScheduleType}
                    dataScreen={localNavigation.searchConditions.searchDynamic.scheduleTypes}
                    setOnOpenPopupScheduleSetting={setOnOpenPopupScheduleSetting}
                    isAdmin={isAdmin} 
                    hadShow={setHadShow}
                    
                    />
                  {onOpenPopupScheduleSetting &&
                    <PopupMenuSet 
                    dismissDialog={dismissDialog}
                    menuType={SETTING_MENU.MENU_CALENDAR} 
                    calendarTab={CALENDAR_TAB.TAB_EQUIQMENT_TYPE} />}
                </div>
              </div>
              <ul className="list-check-box">
                <li>
                  <label className="icon-check">
                    <input type="checkbox"
                      name="a"
                      value=""
                      defaultChecked={true}
                      checked={localNavigation.searchConditions.searchDynamic.scheduleTypes && localNavigation.searchConditions.searchDynamic.scheduleTypes.every(x => x.isSelected === 1)}
                      onChange={(obj) => { onCheckAllItemType(obj) }} />
                    <i></i>{translate("calendars.controls.sidebarMenu.addNewItemSchedule")}
                  </label>
                  <ul>
                    {
                      localNavigation.searchConditions.searchDynamic.scheduleTypes && localNavigation.searchConditions.searchDynamic.scheduleTypes.map((e, index) => {
                        const convert = convertData(e)
                        return (
                          <li key={index} onMouseOver={() => setShowSettingSchedule(e.scheduleTypeId)} onMouseLeave={() => setShowSettingSchedule("")}>
                            <label className="icon-check text-ellipsis">
                              <input type="checkbox" name="" checked={convert.isSelected === 1} value={convert.scheduleTypeId} onChange={(obj) => onChangeScheduleTypes(obj, e)} /><i></i>
                              <img className={convert.className} src={convert.iconType && convert.iconType.toString() === '0' ? convert.icon : `../../../content/images/common/calendar/${convert.icon}`} alt="" title={e.scheduleTypeName} />
                              {e.scheduleTypeName}
                            </label>
                            {
                              showSettingSchedule === e.scheduleTypeId &&
                              <div ref={wrapperRef}>
                                <SettingComponent
                                  type={TYPE_SETTING.schedule}
                                  actionRemove={handleRemoveSchedule}
                                  item={e}
                                />
                              </div>
                            }
                          </li>
                        )
                      })}
                  </ul>
                </li>
              </ul>
              {
                isAdmin && (
                  <a title=""
                    className="button-primary button-add-new mt-3"
                    onClick={() => { handleOpenPopupSetting() }}
                  >
                    {translate('calendars.form.register_new_type')}
                  </a>)
              }
              {onOpenPopupSetting && <PopupMenuSet dismissDialog={dismissDialog} menuType={SETTING_MENU.MENU_CALENDAR} calendarTab={CALENDAR_TAB.TAB_SCHEDULE_TYPE} />}
              <div className="divider"></div>
              {
                dataSearchStatic &&
                (<ul className="list-check-box">
                  <li>
                    <label className="icon-check">
                      <input type="checkbox" name="task" defaultChecked={dataSearchStatic["task"]} value={`${dataSearchStatic["task"]}`}
                        onChange={(obj) => onChangeSearchStatic(obj, "task")} /><i></i>
                      <img className="icon-calendar-list" src="../../../content/images/common/calendar/ic-calendar-list.svg" alt="" title="" />
                      {translate("calendars.controls.sidebarMenu.task")}
                    </label>
                  </li>
                  <li>
                    <label className="icon-check">
                      <input type="checkbox" name="milestone" defaultChecked={dataSearchStatic["milestone"]} value={`${dataSearchStatic["milestone"]}`} onChange={(obj) => onChangeSearchStatic(obj, "milestone")} /><i></i>
                      <img className="icon-calendar" src="../../../content/images/common/calendar/ic-calendar-flag1.svg" alt="" title="" />
                      {translate("calendars.controls.sidebarMenu.mileStone")}
                    </label>
                  </li>
                </ul>)
              }
            </>
          )}
        <div className="divider"></div>
      </>
    )
  }

  const renderEmployeeShow = () => {

    const onChangeItemSearch = (id, type, mode, elementSelected) => {
      elementSelected.forEach(item => {
        // Select employee
        if (item.employeeId) {
          const employeesAdd = [];
          employeesAdd.push({ employeeId: item.employeeId, isSelected: 1, employeeName: item.employeeName });
          // filter deparment
          if (item.employeeDepartments) {
            item.employeeDepartments.forEach(dp => {
              const departmentsAdd = localNavigation.searchConditions.searchDynamic.departments.find(department => department.departmentId === dp.departmentId);
              if (departmentsAdd) {
                const employeeSelect = departmentsAdd.employees.find(employee => employee.employeeId === item.employeeId);
                if (!employeeSelect) {
                  departmentsAdd.employees.push({ employeeId: item.employeeId, isSelected: 1, employeeName: item.employeeName, departmentId: dp.departmentId });
                }
              } else {
                localNavigation.searchConditions.searchDynamic.departments.push({ departmentId: dp.departmentId, departmentName: dp.departmentName, isSelected: 1, employees: employeesAdd });
              }
            });
          }
          if (item.employeeGroups) {
            item.employeeGroups.forEach(gr => {
              const groupAdd = localNavigation.searchConditions.searchDynamic.groups.find(group => group.groupId === gr.groupId);
              if (groupAdd) {
                const employeeSelect = groupAdd.employees.find(employee => employee.employeeId === item.employeeId);
                if (!employeeSelect) {
                  groupAdd.employees.push({ employeeId: item.employeeId, isSelected: 1, employeeName: item.employeeName, groupId: gr.groupId });
                }
              } else {
                localNavigation.searchConditions.searchDynamic.groups.push({ groupId: gr.groupId, groupName: gr.groupName, isSelected: 1, employees: employeesAdd });
              }
            });
          }
        } else if (item.departmentId) {
          const employeesAdd = [];
          const departmentsAdd = localNavigation.searchConditions.searchDynamic.departments.find(department => department.departmentId === item.departmentId);
          item.employeesDepartments.map(dp => {
            employeesAdd.push({ employeeId: dp.employeeId, isSelected: 1, employeeName: dp.employeeName, departmentId: item.departmentId });
          })

          if (departmentsAdd) {
            departmentsAdd.employees = employeesAdd;
          } else {
            localNavigation.searchConditions.searchDynamic.departments.push({ departmentId: item.departmentId, isSelected: 1, departmentName: item.departmentName, employees: employeesAdd });
          }
        } else if (item.groupId) {
          const employeesAdd = [];
          const groupsAdd = localNavigation.searchConditions.searchDynamic.groups.find(group => group.groupId === item.groupId);
          item.employeesGroups.map(dp => {
            employeesAdd.push({ employeeId: dp.employeeId, isSelected: 1, employeeName: dp.employeeName, departmentId: item.groupId });
          })
          if (groupsAdd) {
            groupsAdd.employees = employeesAdd;
          } else {
            localNavigation.searchConditions.searchDynamic.groups.push({ groupId: item.groupId, isSelected: 1, groupName: item.groupName, employees: employeesAdd });
          }
        }
      });
      props.onChangeLocalNavigation(localNavigation)
      setLoadLocalMenu(!loadLocalMenu)
    }

    const onChangeColor = (obj, employee, type) => {
      localNavigation.searchConditions["searchDynamic"][`${type ? type : 'departments'}`].forEach(item => {
        if (item.employees) {
          item.employees.forEach(emp => {
            if (emp.employeeId === employee.employeeId) {
              emp.color = CALENDAR_EMP_COLOR[obj];
            }
          })
        }
      })
      props.onChangeLocalNavigation(localNavigation);
      setLoadLocalMenu(!loadLocalMenu)
    }
    const onRemoveEmployee = (employeeId, type) => {
      localNavigation.searchConditions.searchDynamic[`${type ? type : 'departments'}`].forEach((dep) => {
        const emp = dep.employees.find(employee => employee.employeeId === employeeId)
        if (emp) {
          const index = dep.employees.indexOf(emp)
          if (index > -1) {
            dep.employees.splice(index, 1);
          }
        }
      })
      props.onChangeLocalNavigation(localNavigation);
      setLoadLocalMenu(!loadLocalMenu)
    }
    const onChosenOnlyEmployee = (employeeId, type) => {
      localNavigation.searchConditions.searchDynamic[`${type ? type : 'departments'}`].forEach(dep => {
        const empployee = dep.employees && dep.employees.find(employee => employee.employeeId === employeeId)
        if (!empployee) {
          dep.isSelected = 0
        } else if (dep.employees.length === 1) {
          dep.isSelected = 1
        } else {
          dep.isSelected = 0
        }
        dep.employees.forEach(emp => {
          if (emp.employeeId === employeeId) {
            emp.isSelected = 1
          } else {
            emp.isSelected = 0
          }

        })
      })
      localNavigation.searchConditions.searchDynamic.groups.forEach(groups => {
        groups.isSelected = 0
      })
      props.onChangeLocalNavigation(localNavigation);
      setLoadLocalMenu(!loadLocalMenu)
    }

    return (
      localNavigation && <>
        <div className="tab-expand cursor-pointer" onClick={() => { setShowEmployee(!showEmployee) }}>
          <i className={showEmployee ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>{translate('calendars.controls.sidebarMenu.employee')}
        </div>
        {showEmployee
          && localNavigation
          && localNavigation.searchConditions
          && localNavigation.searchConditions.searchDynamic
          && (
            <>
              <div className="form-group left-control-bar">
                <TagAutoComplete id="showEmployee"
                  // className="col-lg-12 form-group"
                  // placeholder="社員を追加"
                  // modeSelect={TagAutoCompleteMode.Multi}
                  // type={TagAutoCompleteType.Employee}
                  // onActionSelectTag={onChangeItemSearch}
                  // isHideResult
                  // tagSearch={true}
                  type={TagAutoCompleteType.Employee}
                  modeSelect={TagAutoCompleteMode.Multi}
                  onActionSelectTag={onChangeItemSearch}
                  isHideResult
                  className="col-lg-12 form-group"
                  tagSearch={true}
                  placeholder={translate("calendars.controls.suggestSearch")}
                />
              </div>
              {/* Department */}
              {localNavigation.searchConditions.searchDynamic.departments
                && localNavigation.searchConditions.searchDynamic.departments.map((dep) =>
                  <ul className="list-check-box" key={`department_${dep.departmentId}`}>
                    <li className={`d-block ${setting ? "action-change-color" : ""}`} onMouseOver={() => { setShowSetting(dep.departmentId) }}
                      onMouseLeave={() => { setShowSetting(null); setSetting(null) }}
                    >
                      <label className="icon-check text-ellipsis">
                        <input
                          type="checkbox"
                          name=""
                          onChange={() => { onSelectDepartment(dep.departmentId) }}
                          checked={dep.employees.every(x => x.isSelected === 1)}
                        />
                        <i></i>{dep.departmentName}
                      </label>
                      {showSetting === dep.departmentId && !hoverChild &&
                        <div className="change-color z-index-global-2">
                          <a className="change-color-image" title="" onClick={() => { setSetting(dep.departmentId); }}>
                            <img src="../../../content/images/common/ic-sort-blue.svg" alt="" title="" className="sort-blue" />
                          </a>
                          {setting === dep.departmentId &&
                            (
                              <div className="box-select-option box-select-option-popup box-department-can-select">
                                <ul>
                                  <li>
                                    <a className="text-ellipsis" title="" onClick={() => { onRemoveDepartment(dep.departmentId) }}>
                                      {translate('calendars.controls.sidebarMenu.removeEmployee')}
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            )
                          }
                        </div>
                      }
                      <ul>
                        {
                          dep.employees && dep.employees.map((emp, index) =>
                            <ItemControlSideBar key={`department_${emp.employeeId}_${index}`}
                              emp={emp}
                              onChangeItem={onChangeEmployeeInDepar}
                              onChangeColor={onChangeColor}
                              onRemove={onRemoveEmployee}
                              show={setHoverChild}
                              onChosenOnlyItem={onChosenOnlyEmployee}
                              onShowSetting={() => { setOnShowSetting(true) }} />
                          )
                        }
                      </ul>
                    </li>
                  </ul>
                )}
              {/* Groups */}
              {localNavigation.searchConditions.searchDynamic.groups
                && localNavigation.searchConditions.searchDynamic.groups.map((group, index) => {
                  return (
                    <ul className="list-check-box" key={`group_${index}`}>
                      <li className={`d-block ${settingGroups === group.groupId ? "action-change-color" : ""}`} onMouseOver={() => { setShowGroups(group.groupId) }}
                        ref={wrapperRef}
                        onMouseLeave={() => { setShowGroups(null); setSettingGroups(null) }}
                      >
                        <label className="icon-check text-ellipsis">
                          <input type="checkbox" name={group.groupId} defaultChecked={group.isSelected > 0} value={group.groupId} onChange={() => { onSelectGroups(group.groupId) }} checked={group.employees.every(x => x.isSelected === 1)}
                          />
                          <i></i>{group.groupName}
                        </label>
                        {showGroups === group.groupId && !hoverChild &&
                          <div className="change-color z-index-global-2">
                            <a className="change-color-image" title="" onClick={() => { setSettingGroups(group.groupId); }}>
                              <img src="../../../content/images/common/ic-sort-blue.svg" alt="" title=""  className="sort-blue" />
                            </a>
                            {settingGroups === group.groupId &&
                              (
                                <div className="box-select-option box-select-option-popup box-group-can-select" >
                                  <ul>
                                    <li>
                                      <a className="text-ellipsis" title="" onClick={() => { onRemoveGroup(group.groupId) }}>
                                        {translate('calendars.controls.sidebarMenu.removeEmployee')}
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              )
                            }
                          </div>
                        }
                        <ul>
                          {
                            group.employees && group.employees.map((emp, key) =>
                              <ItemControlSideBar key={`group_${emp.employeeId}_${key}`}
                                emp={emp}
                                type={"groups"}
                                onChangeItem={onChangeEmployeeInDepar}
                                onChangeColor={onChangeColor}
                                onRemove={onRemoveEmployee}
                                show={setHoverChild}
                                onChosenOnlyItem={onChosenOnlyEmployee}
                                onShowSetting={() => { setOnShowSetting(true) }} />
                            )
                          }
                        </ul>
                      </li>
                    </ul>
                  )
                })}
            </>
          )
        }
        <div className="divider"></div>
      </>
    );
  }

  const renderParticipationStatus = () => {
    return (
      <>
        <div className="tab-expand cursor-pointe" onClick={() => { setShowParticipationStatus(!showParticipationStatus) }}><i className={showParticipationStatus ? "fas fa-chevron-up" : "fas fa-chevron-down"}></i>{translate('calendars.controls.sidebarMenu.participationStatus')}</div>
        {showParticipationStatus && dataSearchStatic &&
          (
            <>
              <ul className="list-check-box padding-bottom-50-px">
                <li>
                  <label className="icon-check">
                    <input type="checkbox" name="isAttended" defaultChecked={dataSearchStatic["isAttended"] && dataSearchStatic["isAttended"] > 0}
                      value={`${dataSearchStatic["isAttended"]}`} onChange={(obj) => onChangeSearchStatic(obj, "isAttended")} /><i></i>
                    {translate("calendars.controls.sidebarMenu.isAttended")}
                  </label>
                </li>
                <li>
                  <label className="icon-check">
                    <input type="checkbox" name="isAbsence" defaultChecked={dataSearchStatic["isAbsence"] && dataSearchStatic["isAbsence"] > 0}
                      value={`${dataSearchStatic["isAbsence"]}`} onChange={(obj) => onChangeSearchStatic(obj, "isAbsence")} /><i></i>
                    {translate("calendars.controls.sidebarMenu.isAbsence")}
                  </label>
                </li>
                <li>
                  <label className="icon-check">
                    <input type="checkbox" name="isUnconfirmed" defaultChecked={dataSearchStatic["isUnconfirmed"] && dataSearchStatic["isUnconfirmed"] > 0}
                      value={`${dataSearchStatic["isUnconfirmed"]}`} onChange={(obj) => onChangeSearchStatic(obj, "isUnconfirmed")} /><i></i>
                    {translate("calendars.controls.sidebarMenu.isUnconfirmed")}
                  </label>
                </li>
                <li>
                  <label className="icon-check">
                    <input type="checkbox" name="isShared" defaultChecked={dataSearchStatic["isShared"] && dataSearchStatic["isShared"] > 0}
                      value={`${dataSearchStatic["isShared"]}`} onChange={(obj) => onChangeSearchStatic(obj, "isShared")} /><i></i>
                    {translate("calendars.controls.sidebarMenu.isShared")}
                  </label>
                </li>
              </ul>
            </>
          )}
      </>
    )
  }

  // const selectScheduleType = (equipmentTypeId, isSelected) => {
  // }

  const onCheckAllResource = (obj) => {
    if (obj.target.checked) {
      localNavigation.searchConditions.searchDynamic.equipmentTypes.forEach((e) => {
        e.isSelected = 1
        return e
      });
    } else {
      localNavigation.searchConditions.searchDynamic.equipmentTypes.forEach((e) => {
        e.isSelected = 0
        return e
      });
    }
    props.onChangeLocalNavigation(localNavigation);
    setLoadLocalMenu(!loadLocalMenu)
  }
  // const onChangeResource = (obj, eqi) => {

  //   localNavigation.searchConditions.searchDynamic.equipmentTypes.forEach(item => {
  //     if (item.equipmentTypeId === eqi.equipmentTypeId) {
  //       item.isSelected = obj.target.checked ? 1 : 0;
  //     }
  //   })
  //   props.onChangeLocalNavigation(localNavigation)
  //   setLoadLocalMenu(!loadLocalMenu)
  // }

  const renderResourceSetting = () => {

    // const onRemoveResource = (equipmentTypeId) => {
    //   const equipmentType = localNavigation.searchConditions.searchDynamic.equipmentTypes.find(employee => employee.equipmentTypeId === equipmentTypeId)
    //   if (equipmentType) {

    //     const index = localNavigation.searchConditions.searchDynamic.equipmentTypes.indexOf(equipmentType)
    //     if (index > -1) {
    //       localNavigation.searchConditions.searchDynamic.equipmentTypes.splice(index, 1);
    //     }
    //   }
    //   props.onChangeLocalNavigation(localNavigation);
    //   setLoadLocalMenu(!loadLocalMenu)
    // }

    /**
     * handle change input data equipment
     * @param dataInput
     */
    const handleInputEquipment = (dataInput: string) => {
      setInputEquipment(dataInput)
      const localeDraft = Storage.session.get('locale', 'ja_jp');
      if (dataInput) {
        setInputEquipment(dataInput);
        if (dataApiEquipmentTypes) {
          const draftData = JSON.parse(JSON.stringify(dataApiEquipmentTypes));
          draftData.forEach((item: EquipmentTypesType) => {
            if (typeof item.equipmentTypeName === 'string')
              item.equipmentTypeName = JSON.parse(item.equipmentTypeName);
          });
          const response = draftData.filter((item: EquipmentTypesType) => {
            if (typeof item.equipmentTypeName === 'object') {
              const check = item.equipmentTypeName[localeDraft]?.toLowerCase().indexOf(dataInput.toLowerCase());
              if (check >= 0)
                return item;
            }
            return null;
          }).map((item: EquipmentTypesType) => {
            return {
              ...item,
              equipmentTypeName: item?.equipmentTypeName[localeDraft] || item?.equipmentTypeName['ja_jp'] || item?.equipmentTypeName['en_us'] || item?.equipmentTypeName['zh_cn'],
            }
          });
          response.length ? setListResponseEquipment(response) : setListResponseEquipment('');
        } else {
          setListResponseEquipment(props.errorMessEquipmentCallApi);
        }
      } else {
        setInputEquipment('');
        setListResponseEquipment('');
      }
    }


    /**
     * insert equipment when select item
     * @param item
     */
    const handleChooseEquipment = (item: any) => {
      const draftItem = {
        ...item,
        isSelected: 1
      }
      setListResponseEquipment('');
      setInputEquipment('');
      localNavigation.searchConditions
        && localNavigation.searchConditions.searchDynamic
        && localNavigation.searchConditions.searchDynamic.equipmentTypes
        && localNavigation.searchConditions.searchDynamic.equipmentTypes.push(draftItem);
      props.onChangeLocalNavigation(localNavigation)
    }

    /**
     * remove equipment
     * @param equipmentTypeId
     */
    const handleRemoveEquipment = (equipmentTypeId) => {
      setShowSettingEquipment('');
      const index = localNavigation?.searchConditions?.searchDynamic?.equipmentTypes.findIndex(item => item.equipmentTypeId === equipmentTypeId);
      localNavigation.searchConditions
        && localNavigation.searchConditions.searchDynamic
        && localNavigation.searchConditions.searchDynamic.equipmentTypes
        && localNavigation.searchConditions.searchDynamic.equipmentTypes.splice(index, 1);
      props.onChangeLocalNavigation(localNavigation)
    }


    /**
     * change status equipment
     * @param obj
     * @param e
     */
    const onChangeEquipmentTypes = (obj, e) => {
      localNavigation.searchConditions.searchDynamic.equipmentTypes.forEach(item => {
        if (item.equipmentTypeId === e.equipmentTypeId) {
          item.isSelected = obj.target.checked ? 1 : 0;
        }
      })
      props.onChangeLocalNavigation(localNavigation)
      setLoadLocalMenu(!loadLocalMenu)
    }

    return (
      <>
        <div className="tab-expand cursor-pointer" onClick={() => { setShowResourceType(!showResourceType) }}>
          <i className={showResourceType ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
          {translate("calendars.controls.sidebarMenu.type")}
        </div>
        {showResourceType
          && localNavigation
          && localNavigation.searchConditions
          && localNavigation.searchConditions.searchDynamic
          && localNavigation.searchConditions.searchDynamic.equipmentTypes
          && (<>
            <div className="form-group">
              <div className="input-common-wrap delete">
                <input type="text"
                  className="input-normal"
                  value={inputEquipment}
                  onChange={(e) => handleInputEquipment(e.target.value)}
                  placeholder={translate("calendars.controls.sidebarMenu.addNewResourcePlaceHolder")} />
                {
                  inputEquipment.length > 0 && <span className="icon-delete"
                    onClick={() => {
                      setInputEquipment('');
                      setListResponseEquipment('');
                    }} />
                }
                <SuggestComponent typeComponent={ACTION_LOCAL_NAVIGATION.EQUIPMENT}
                  listData={listResponseEquipment}
                  insertItem={handleChooseEquipment}
                  dataScreen={localNavigation.searchConditions.searchDynamic.equipmentTypes} 
                  setOnOpenPopupScheduleSetting={setOnOpenPopupScheduleSetting}
                  isAdmin={isAdmin}
                  />
              </div>
            </div>
            <div className="tab-pane active">
              <ul className="list-check-box">
                <li>
                  <label className="icon-check">
                    <input type="checkbox" name="" checked={localNavigation.searchConditions.searchDynamic.equipmentTypes.every(x => x.isSelected === 1)} onChange={(obj) => { onCheckAllResource(obj) }} /><i></i>
                    {translate("calendars.controls.sidebarMenu.allEquipment")}
                  </label>
                  <ul>
                    {
                      localNavigation.searchConditions.searchDynamic.equipmentTypes && localNavigation.searchConditions.searchDynamic.equipmentTypes.map((e, index) => {
                        return (
                          <li key={index} onMouseOver={() => setShowSettingEquipment(e.equipmentTypeId)}>
                            <label className="icon-check color-707">
                              <input type="checkbox" name="" checked={e.isSelected === 1} value={e.equipmentTypeId} onChange={(obj) => onChangeEquipmentTypes(obj, e)} /><i />
                              {truncateString(e.equipmentTypeName, 6)}
                            </label>
                            {
                              showSettingEquipment === e.equipmentTypeId &&
                              <div ref={wrapperRef}>
                                <SettingComponent
                                  type={TYPE_SETTING.equipment}
                                  actionRemove={handleRemoveEquipment}
                                  item={e}
                                />
                              </div>
                            }
                          </li>
                        )
                      })}
                  </ul>
                </li>
              </ul>
            </div>
            {isAdmin && (<a title="" className="button-primary button-add-new mt-3" onClick={() => { setOnOpenPopupSetting(true) }}>{translate("calendars.controls.sidebarMenu.addNewResource")}</a>)}
            {onOpenPopupSetting && <PopupMenuSet dismissDialog={() => { setOnOpenPopupSetting(false) }} menuType={SETTING_MENU.MENU_CALENDAR} calendarTab={CALENDAR_TAB.TAB_EQUIQMENT_TYPE} />}
          </>
          )}
      </>
    );
  }

  return (

    <div className={`esr-calendar-sidebar sidebar-menu-outer`} style={props.overflow ? { overflow: 'visible' } : {}}>
      <div className="sidebar-menu-inner" style={props.overflow ? { overflow: 'visible' } : {}}>
        <div className="scrollbar">
          <div className="esr-calendar-sidebar-content">
            <div className="task-sidebar-calendar">
              <MiniCalendar monthShow={props.dateShow.toDate()} onSelectedDate={onSelectedDate} />
            </div>
            <div className="tab-detault">
              <ul className="nav nav-tabs">
                <li className="nav-item">
                  <a title="" className={`nav-link ${tabSchedule < 1 ? "active" : ''}`} data-toggle="tab"
                    style={tabSchedule < 1 ? { cursor: 'auto' } : { cursor: 'pointer' }}
                    onClick={() => { if (tabSchedule > 0) { setTabSchedule(0); onClickTabSchedule(); setListResponseScheduleType('') } }}>
                    {translate("calendars.controls.sidebarMenu.plan")}
                  </a>
                </li>
                <li className="nav-item">
                  <a title="" className={`nav-link ${tabSchedule > 0 ? "active" : ''}`} data-toggle="tab"
                    style={tabSchedule > 0 ? { cursor: 'auto' } : { cursor: 'pointer' }}
                    onClick={() => { if (tabSchedule < 1) { setTabSchedule(1); onClickTabResource(); setListResponseScheduleType('') } }}>
                    {translate("calendars.controls.sidebarMenu.resource")}
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane active">
                  {tabSchedule < 1 &&
                    (<>
                      {renderItemTypeShow()}
                      {localNavigation && renderEmployeeShow()}
                      {renderParticipationStatus()}
                    </>)}
                  {tabSchedule > 0 && renderResourceSetting()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = ({ dataCalendarGrid, employeeList, authentication, dataCreateEditSchedule, locale }: IRootState) => ({
  authorities: authentication.account.authorities,
  dataOfMonth: dataCalendarGrid.dataOfMonth,
  typeShowGrid: dataCalendarGrid.typeShowGrid,
  dateShow: dataCalendarGrid.dateShow,
  listEmployee: employeeList.employees,
  localNavigationProps: dataCalendarGrid.localNavigation,
  scheduleTypes: dataCreateEditSchedule.scheduleTypes,
  equipmentTypes: dataCalendarGrid.equipmentTypes,
  errorMessScheduleCallApi: dataCreateEditSchedule.errorMessage,
  errorMessEquipmentCallApi: dataCalendarGrid.errorMessage,
  overflow: dataCalendarGrid.overflow,
  scheduleTypesSuggestionsList: dataCreateEditSchedule.scheduleTypesSuggestions,
  equipmentSuggestionsList: dataCalendarGrid.equipmentSuggestions,
  currentLocale: locale.currentLocale
});

const mapDispatchToProps = {
  onChangeDateShow,
  handleSearchEmployee,
  onChangeTabShow,
  onChangeLocalNavigation,
  getScheduleTypes,
  getEquipmentTypes,
  setOverFlow,
  getScheduleTypeSuggestionsData,
  saveSuggestionsChoice,
  resetEquipmentSuggest,
  handleReloadData
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps,
  mapDispatchToProps
)(CalendarControlSiteBar);
