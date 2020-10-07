import React, { useState, useRef, useEffect } from 'react';
import { translate } from 'react-jhipster'
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { handleSaveLocalNavigation, handleGetLocalNavigation, resetLocalNavigation } from 'app/modules/tasks/list/task-list.reducer'
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';

import DatePicker from 'app/shared/layout/common/date-picker';
import { startExecuting } from 'app/shared/reducers/action-executing';
import moment from 'moment';
import { TagAutoCompleteType, TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { Resizable } from 're-resizable';
import useEventListener from 'app/shared/util/use-event-listener';
import { convertDateTimeFromServer } from 'app/shared/util/date-utils';
import StringUtils from 'app/shared/util/string-utils';
import { WindowActionMessage } from 'app/shared/layout/menu/constants';

const DATE_TYPE = {
  START_DATE: 1,
  END_DATE: 2
}

interface ILocalMenuProps extends DispatchProps, StateProps {

}

/**
 * Left local menu in screen task list
 * @param props
 */
const LocalMenu = (props: ILocalMenuProps) => {
  const { localMenu } = props;
  const [openSearch, setOpenSearch] = useState(true)
  const [openPeriodArea, setPeriodArea] = useState(true)
  const [loadLocalMenu, setLoadLocalMenu] = useState(false);
  const resizeRef = useRef(null);
  const [width, setWidth] = React.useState(216);
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false)
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [showSubMenuEmp, setShowSubMenuEmp] = useState(false);
  const [idSubMenu, setIdSubMenu] = useState([]);
  const [overflowY, setOverflowY] = useState<"auto" | "hidden">("hidden")
  const [positionSubMenu, setPositionSubMenu] = useState({ x: 0, y: 0 });
  const localNavigationRef = useRef(null);
  const subMenuRef = useRef(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const scrollHeight = localNavigationRef.current.scrollHeight;
    const clientHeight = localNavigationRef.current.clientHeight;
    if (scrollHeight !== 777)
      setShowShadowBottom(scrollHeight > clientHeight);

    if (localMenu && localMenu.searchStatic) {
      if (localMenu.searchStatic.startDate) {
          setStartDate(convertDateTimeFromServer(localMenu.searchStatic.startDate))
      }
      if (localMenu.searchStatic.endDate) {
          setEndDate(convertDateTimeFromServer(localMenu.searchStatic.endDate))
      }
    }
  }, [localMenu])

  /**
  * event show 2 date picker input in local menu
  * @param alltime
  */
  const onSetAlltime = (alltime) => {
    localMenu.searchStatic.isAllTime = alltime ? 1 : 0;
    localMenu.searchStatic.isDesignation = alltime ? 0 : 1;
    // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU))
    props.handleSaveLocalNavigation(localMenu);
  }
  /**
 * choose employee and uncheck others
 * @param employeeId 
 */
  const onChosenOnlyItem = (employee) => {
    let departmentSelect = null;
    let groupSelect = null;
    // find department have emplpoyee


    localMenu.searchDynamic.departments.map(dp => {
      dp.employees && dp.employees.map(dpEmp => {
        if (dpEmp.employeeId !== employee.employeeId) {
          dpEmp.isSelected = 0;
        } else if (dpEmp.isSelected === 0) {
          dpEmp.isSelected = 1;
        }
      });
    });
    localMenu.searchDynamic.groups.map(gr => {
      gr.isSelected = 0;
      gr.employees && gr.employees.map(grEmp => {
        if (grEmp.employeeId !== employee.employeeId) {
          grEmp.isSelected = 0;
        } else if (grEmp.isSelected === 0) {
          grEmp.isSelected = 1;
        }
      });
    });

    localMenu.searchDynamic.departments.map(department => {
      if (department.employees.find(emp => emp.employeeId === employee.employeeId)) {
        departmentSelect = department
      } else {
        department.isSelected = 0;
      }
    });

    localMenu.searchDynamic.groups.map(group => {
      if (group.employees.find(emp => emp.employeeId === employee.employeeId)) {
        groupSelect = group;
      } else {
        group.isSelected = 0;
      }
    });
    if (departmentSelect) {
      departmentSelect.isSelected = departmentSelect.employees.every(item => item.isSelected === 1) ? 1 : 0;
    }
    if (groupSelect) {
      groupSelect.isSelected = groupSelect.employees.every(item => item.isSelected === 1) ? 1 : 0;
    }
    props.handleSaveLocalNavigation(localMenu);
    setShowSubMenuEmp(!showSubMenuEmp);
  }
  /**
   * remove employee list 
   * @param employee 
   */
  const onRemove = (employee) => {

    const departmentSelect = [];
    const groupSelect = [];
    // find department have emplpoyee
    localMenu.searchDynamic.departments.map(department => {
      if (department.employees.find(emp => emp.employeeId === employee.employeeId)) {
        departmentSelect.push(department);
      }
    });
    departmentSelect.forEach(dep => {
      const indexDp = dep.employees.findIndex(emp => emp.employeeId === employee.employeeId);
      if (indexDp > -1 && dep) {
        dep.employees.splice(indexDp, 1);
      }
    }) 
    departmentSelect.forEach(dep => {
      if (dep && dep.employees.length === 0) {
        const indexDeleteDp = localMenu.searchDynamic.departments.findIndex(department => department.departmentId === dep.departmentId);
        localMenu.searchDynamic.departments.splice(indexDeleteDp, 1);
      }
    })
    // find group have emplpoyee
    localMenu.searchDynamic.groups.map(group => {
      if (group.employees.find(emp => emp.employeeId === employee.employeeId)) {
        groupSelect.push(group);
      }
    });
    groupSelect.forEach(gr => {
      const indexGr = gr.employees.findIndex(emp => emp.employeeId === employee.employeeId);
      if (indexGr > -1 && gr) {
        gr.employees.splice(indexGr, 1);
      }
    })
    groupSelect.forEach(gr=> {
      if (gr && gr.employees.length === 0) {
        const indexDeleteGr = localMenu.searchDynamic.groups.findIndex(group => group.groupId === gr.departmentId);
        localMenu.searchDynamic.groups.splice(indexDeleteGr, 1);
      }
    })
    props.handleSaveLocalNavigation(localMenu);
    setShowSubMenuEmp(!showSubMenuEmp);
  }
  /**
   * remove department /group
   * @param deparment
   * @param group 
   */
  const onRemoveDepartment = (deparment) => {
    if (deparment.department) {
      const indexDp = localMenu.searchDynamic.departments.findIndex(dp => dp.departmentId === deparment.department.departmentId);
      localMenu.searchDynamic.departments.splice(indexDp, 1)
    } else {
      const indexGr = localMenu.searchDynamic.groups.findIndex(gr => gr.groupId === deparment.group.groupId);
      localMenu.searchDynamic.groups.splice(indexGr, 1)
    }
    props.handleSaveLocalNavigation(localMenu);
    setShowSubMenu(!showSubMenu);
  }

  const onReceiveMessage = (ev) => {
    if (StringUtils.tryGetAttribute(ev, "data.type") === WindowActionMessage.ReloadLocalNavigationTask) {
      props.resetLocalNavigation();
      props.handleGetLocalNavigation();
    }
  }
  useEventListener('message', onReceiveMessage);



  /**
   * handle when click outside submenu
   * @param e 
   */
  const handleClickOutSideSubMenu = (e) => {
    if (subMenuRef && subMenuRef.current && !subMenuRef.current.contains(e.target) && showSubMenu) {
      setShowSubMenu(!showSubMenu);
    }
    if (subMenuRef && subMenuRef.current && !subMenuRef.current.contains(e.target) && showSubMenuEmp) {
      setShowSubMenuEmp(!showSubMenuEmp);
    }
  }
  useEventListener('click', handleClickOutSideSubMenu);

  const SubMenuEmployee = ({ employee }) => {
    return (
      <div className="box-select-option d-block position-fixed" ref={subMenuRef} style={{ top: positionSubMenu.y, left: positionSubMenu.x }}>
        <ul >
          <li><a title="" onClick={() => onChosenOnlyItem(employee)}>{translate('tasks.list.left.choose_employee')}</a></li>
          <li><a title="" onClick={() => onRemove(employee)}>{translate('tasks.list.left.remove_employee')}</a></li>
        </ul>
      </div>
    )
  }
  const SubMenuDepartment = (deparment, group) => {
    return (
      <div className="box-select-option d-block position-fixed" ref={subMenuRef} style={{ top: positionSubMenu.y, left: positionSubMenu.x }}>
        <ul>
          <li>
            {
              deparment && deparment.department &&
              <a title="" onClick={() => onRemoveDepartment(deparment)}>{translate('tasks.list.left.choose_departerment')}</a>
            }
            {
              deparment && deparment.group &&
              <a title="" className="w-100" onClick={() => onRemoveDepartment(deparment)}>{translate('tasks.list.left.remove_departerment')}</a>
            }
          </li>
        </ul>
      </div>
    )
  }

  const handleScroll = (event) => {
    const node = event.target;
    const { scrollHeight, scrollTop, clientHeight } = node
    const bottom = scrollHeight - scrollTop
    setShowShadowTop(scrollTop > 0)
    setShowShadowBottom(bottom > clientHeight)
  }

  const handleChangeOverFlow = (type: "auto" | "hidden") => (e) => {
    setOverflowY(type)
  }

  const isValidDate = (dateItem) => {
    return dateItem instanceof Date && !isNaN(dateItem.getTime());
  }

  const addZezoFirst = (dataAdd) => {
    if (dataAdd < 10) {
      return '0' + dataAdd;
    }
    return dataAdd;
  };

  const converToFormDateTimezone = (date, type) => {
    if (!date) {
      return;
    }
    if (!moment.isDate(date)) {
      date = convertDateTimeFromServer(date);
    }
    if (type === DATE_TYPE.START_DATE) {
      return date.getFullYear() + '-' + addZezoFirst(date.getMonth() + 1) + '-' + addZezoFirst(date.getDate()) + 'T00:00:00.000Z'
    }
    if (type === DATE_TYPE.END_DATE) {
      return date.getFullYear() + '-' + addZezoFirst(date.getMonth() + 1) + '-' + addZezoFirst(date.getDate()) + 'T23:59:59.999Z';
    }
  };

  /**
   * update value of date box
   * @param id
   * @param date
   */
  const updateDateLocalMenu = (id, date) => {
    if (id === DATE_TYPE.START_DATE) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    if (date && !isValidDate(date)) {
      return;
    }
    if (id === DATE_TYPE.START_DATE) {
      date = converToFormDateTimezone(date, DATE_TYPE.START_DATE);
      if (date && localMenu.searchStatic.startDate === date) {
        return;
      }
      localMenu.searchStatic.startDate = date ? date : null;
    } else {
      date = converToFormDateTimezone(date, DATE_TYPE.END_DATE);
      if (date && localMenu.searchStatic.endDate === date) {
        return;
      }
      localMenu.searchStatic.endDate = date ? date : null;
    }
    // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU))
    props.handleSaveLocalNavigation(localMenu)
  }

  /**
    * change valua selected employees.
    * @param employeeId employeeId
    * @param isSelected isSelected
    */
  const selectEmployee = (employeeId, isSelected) => {
    localMenu.searchDynamic.departments.forEach(department => {
      const employee = department.employees.find(item => item.employeeId === employeeId)
      if (employee) {
        employee.isSelected = isSelected;
        department.isSelected = department.employees.every(item => item.isSelected === 1) ? 1 : 0;
      }
    });
  }

  /**
    * click check box of employees
    * @param index
    */
  const onSelectEmployee = (employeeId, departmentId, groupId) => {
    let isEmpSelected = null;
    if (departmentId) {
      const departmentSelected = localMenu.searchDynamic.departments.find(department => department.departmentId === departmentId);
      isEmpSelected = departmentSelected.employees.filter(emp => emp.employeeId === employeeId)[0].isSelected === 1 ? 0 : 1;
    } else {
      const groupSelected = localMenu.searchDynamic.groups.find(group => group.groupId === groupId);
      isEmpSelected = groupSelected.employees.filter(emp => emp.employeeId === employeeId)[0].isSelected === 1 ? 0 : 1;
    }
    localMenu.searchDynamic.departments.map(department => {
      department.employees.map(emp => {
        if (emp.employeeId === employeeId) {
          emp.isSelected = isEmpSelected;
          if (isEmpSelected === 0 && department.isSelected !== isEmpSelected) {
            department.isSelected = isEmpSelected;
          }
        }
      });
      if (department.employees.every(emp => emp.isSelected === isEmpSelected)) {
        department.isSelected = isEmpSelected;
      }
    });
    localMenu.searchDynamic.groups.map(group => {
      group.employees.map(emp => {
        if (emp.employeeId === employeeId) {
          emp.isSelected = isEmpSelected;
          if (isEmpSelected === 0 && group.isSelected !== isEmpSelected) {
            group.isSelected = isEmpSelected;
          }
        }
      });
      if (group.employees.every(emp => emp.isSelected === isEmpSelected)) {
        group.isSelected = isEmpSelected;
      }
    });
    props.handleSaveLocalNavigation(localMenu)
  }
   /**
   * check user login use activity service
   */
  const checkActivityService = () => {
    const CUSTOMERS_SERVICE_ID = 5;
    return props.servicesInfo && props.servicesInfo.findIndex((service) => service.serviceId === CUSTOMERS_SERVICE_ID) !== -1;
  }

  /**
   * click check box of department
   * @param index
   */
  const onSelectDepartment = (departmentId) => {
    const department = localMenu.searchDynamic.departments.find(item => item.departmentId === departmentId);
    const isSelected = department.isSelected === 1 ? 0 : 1;
    department.isSelected = isSelected;
    department.employees.map(emp => emp.isSelected = isSelected);
    // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU))
    props.handleSaveLocalNavigation(localMenu)
  }

  /**
   * click checkbox of groups
   * @param index
   */
  const onSelectGroups = (groupId) => {
    const group = localMenu.searchDynamic.groups.find(item => item.groupId === groupId)
    const isSelected = group.isSelected === 1 ? 0 : 1;
    group.isSelected = isSelected;
    group.employees.map(emp => emp.isSelected = isSelected);
    // props.startExecuting(REQUEST(ACTION_TYPES.TASK_LIST_SAVE_LOCAL_MENU))
    props.handleSaveLocalNavigation(localMenu)
  }

  /**
   * Action select search local navigation
   */
  const onActionSelectOperator = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    listTag.forEach(item => {
      // Select employee
      if (item.employeeId) {
        const employeesAdd = [];
        employeesAdd.push({ employeeId: item.employeeId, isSelected: 1, employeeName: item.employeeName, employeeSurname: item.employeeSurname });
        // filter deparment
        if (item.employeeDepartments) {
          item.employeeDepartments.forEach(dp => {
            const departmentsAdd = localMenu.searchDynamic.departments.find(department => department.departmentId === dp.departmentId);
            if (departmentsAdd) {
              const employeeSelect = departmentsAdd.employees.find(employee => employee.employeeId === item.employeeId);
              if (!employeeSelect) {
                departmentsAdd.employees.push({ employeeId: item.employeeId, isSelected: 1, employeeName: item.employeeName, employeeSurname: item.employeeSurname, departmentId: dp.departmentId });
              }
            } else {
              localMenu.searchDynamic.departments.push({ departmentId: dp.departmentId, departmentName: dp.departmentName, isSelected: 1, employees: employeesAdd });
            }
          });
        }
        if (item.employeeGroups) {
          item.employeeGroups.forEach(gr => {
            const groupAdd = localMenu.searchDynamic.groups.find(group => group.groupId === gr.groupId);
            if (groupAdd) {
              const employeeSelect = groupAdd.employees.find(employee => employee.employeeId === item.employeeId);
              if (!employeeSelect) {
                groupAdd.employees.push({ employeeId: item.employeeId, isSelected: 1, employeeName: item.employeeName, employeeSurname: item.employeeSurname, groupId: gr.groupId });
              }
            } else {
              localMenu.searchDynamic.groups.push({ groupId: gr.groupId, groupName: gr.groupName, isSelected: 1, employees: employeesAdd });
            }
          });
        }
      } else if (item.groupId) {
        const employeesAdd = [];
        const groupAdd = localMenu.searchDynamic.groups.find(group => group.groupId === item.groupId);
        item.employeesGroups.map(gr => {
          employeesAdd.push({ employeeId: gr.employeeId, isSelected: 1, employeeName: gr.employeeName, employeeSurname: gr.employeeSurname, groupId: item.groupId });
        })
        if (!groupAdd) {
          localMenu.searchDynamic.groups.push({ groupId: item.groupId, isSelected: 1, groupName: item.groupName, employees: employeesAdd });
        } else {
          groupAdd.isSelected = 1;
          groupAdd.employees = employeesAdd
        }

      } else if (item.departmentId) {
        const employeesAdd = [];
        const departmentsAdd = localMenu.searchDynamic.departments.find(department => department.departmentId === item.departmentId);
        item.employeesDepartments.map(dp => {
          employeesAdd.push({ employeeId: dp.employeeId, isSelected: 1, employeeName: dp.employeeName, employeeSurname: dp.employeeSurname, departmentId: item.departmentId });
        })

        if (departmentsAdd) {
          departmentsAdd.isSelected = 1;
          departmentsAdd.employees = employeesAdd;
        } else {
          localMenu.searchDynamic.departments.push({ departmentId: item.departmentId, isSelected: 1, departmentName: item.departmentName, employees: employeesAdd });
        }
      }
    });
    props.handleSaveLocalNavigation(localMenu);
  }

  const actionFilterCustomerFavourite = (listCustomerId) => {
    if (listCustomerId) {
      const customerListSelect = localMenu.searchDynamic.customersFavourite.find(customers => customers.listId === listCustomerId);
      const customerListNotSelect = localMenu.searchDynamic.customersFavourite.filter(customers => customers.listId !== listCustomerId);
      if (customerListSelect) {
        customerListSelect.isSelected = customerListSelect.isSelected === 1 ? 0 : 1;
      }
      if (customerListNotSelect) {
        customerListNotSelect.map(customerNotSelect => customerNotSelect.isSelected = 0)
      }
    }
    props.handleSaveLocalNavigation(localMenu);
    setLoadLocalMenu(!loadLocalMenu);
  }

  const showSubMenuEmployee = (employeeId, departmentId, groupId, isEmployee) => {
    const arrayItem = [];
    if (departmentId) {
      arrayItem.push(employeeId, departmentId, null);
    } else if (groupId) {
      arrayItem.push(employeeId, null, groupId);
    }
    setIdSubMenu(arrayItem);
    if (isEmployee) {
      setShowSubMenuEmp(!showSubMenuEmp);
    } else {
      setShowSubMenu(!showSubMenu);
    }

    const elementId = employeeId + "" + departmentId + "" + groupId;
    const element = document.getElementById(elementId);
    let top = 0;
    let left = 0;
    const width3Dot = 24;
    if (element) {
      top = element.getBoundingClientRect().top;
      left = element.getBoundingClientRect().left + width3Dot;
    }
    setPositionSubMenu({ x: left, y: top })
  }

  return (
    <>
      {showSidebar &&
        <Resizable
          ref={resizeRef}
          size={{ width, height: '100%' }}
          onResizeStop={(e, direction, ref, d) => {
            setWidth(width + d.width);
          }}
          onResize={(e, direction, ref, d) => {
          }}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          className={`resizeable-resize-wrap esr-content-sidebar no-background ${showShadowTop && "shadow-local-navigation-top"} ${showShadowBottom && "shadow-local-navigation-bottom-inset"}`}
        >
          <div ref={localNavigationRef} className="esr-content-sidebar-outer" onScroll={handleScroll} style={{ overflowY }} onMouseEnter={handleChangeOverFlow("auto")} onMouseLeave={handleChangeOverFlow("hidden")}>
            <div className="column column1 w95">
              {localMenu && <>
                <ul>
                  <li>
                    {/* QA 1894 */}
                    {translate("tasks.list.left.customertasklist")}
                    <ul>
                      {checkActivityService() && localMenu.searchDynamic &&
                        localMenu.searchDynamic.customersFavourite &&
                        localMenu.searchDynamic.customersFavourite.length > 0 &&
                        localMenu.searchDynamic.customersFavourite.map(list => (
                          <li
                            key={list.listId}
                            className={list.isSelected === 1 ? 'active background-color-85' : ''}
                            onClick={() => actionFilterCustomerFavourite(list.listId)}
                          >
                            <a className="text-ellipsis">{list.listName}</a>
                          </li>
                        ))}
                    </ul>
                  </li>
                </ul>
                <div className="divider" />
                <div className="expand" onClick={() => setOpenSearch(!openSearch)}>{translate("tasks.list.left.personincharge")}<i className={openSearch ? "fas fa-chevron-up" : "fas fa-chevron-down"} /></div>
                {openSearch && <>
                  <div className="form-group">
                    <ManagerSuggestSearch id
                      type={TagAutoCompleteType.Employee}
                      modeSelect={TagAutoCompleteMode.Multi}
                      onActionSelectTag={onActionSelectOperator}
                      isHideResult
                      className="col-lg-12 form-group"
                      tagSearch={true}
                      placeholder={translate("tasks.list.left.searchpersontodisplay")}
                    />
                  </div>
                  <ul >
                    {localMenu.searchDynamic && localMenu.searchDynamic.departments && localMenu.searchDynamic.departments.map((department) =>
                      <li key={department.departmentId}>
                        <ul className="box-list-item">
                          <li>
                            <label className="icon-check d-inline-flex">
                              <input type="checkbox" name="" checked={department.isSelected === 1} onChange={() => onSelectDepartment(department.departmentId)} /><i /> <span className="text-ellipsis">{department.departmentName}</span>
                            </label>
                            <div className="icon-small-primary icon-sort-small ml-5" id={"null" + department.departmentId + "null"} onClick={() => showSubMenuEmployee(null, department.departmentId, null, false)}>
                            </div>
                            {showSubMenu && idSubMenu[1] === department.departmentId &&
                              <SubMenuDepartment department={department} group={null} />
                            }
                          </li>
                        </ul>

                        <ul className="box-list-item">
                          {department.employees &&
                            department.employees.map(employee => (
                              <li key={employee.employeeId}>
                                <label className="icon-check d-inline-flex ml-4">
                                  <input
                                    type="checkbox"
                                    name=""
                                    checked={employee.isSelected === 1}
                                    onChange={() => onSelectEmployee(employee.employeeId, department.departmentId, null)}
                                  />
                                  <i /><span className="text-ellipsis">{employee.employeeSurname}{employee.employeeName ? ' ' + employee.employeeName : ''}</span>
                                </label>
                                <span className="icon-small-primary icon-sort-small ml-3" id={employee.employeeId + '' + department.departmentId + "null"} onClick={() => showSubMenuEmployee(employee.employeeId, department.departmentId, null, true)}>
                                </span>
                                {showSubMenuEmp && idSubMenu[0] === employee.employeeId && idSubMenu[1] === department.departmentId &&
                                  <SubMenuEmployee employee={employee} />
                                }
                              </li>
                            ))}
                        </ul>
                      </li>)}
                  </ul>

                  <div className="divider" />
                  <ul>
                    {localMenu.searchDynamic &&
                      localMenu.searchDynamic.groups &&
                      localMenu.searchDynamic.groups.map(group => (
                        <li key={group.groupId}>
                          <ul className="box-list-item">
                            <li>
                              <label className="icon-check d-inline-flex">
                                <input type="checkbox" name="" checked={group.isSelected === 1} onChange={() => onSelectGroups(group.groupId)} />
                                <i /> <span className="text-ellipsis">{group.groupName}</span>
                              </label>
                              <div className="icon-small-primary icon-sort-small ml-5" id={"null" + "null" + group.groupId} onClick={() => showSubMenuEmployee(null, null, group.groupId, false)}>
                              </div>
                              {showSubMenu && idSubMenu[2] === group.groupId &&
                                <SubMenuDepartment department={null} group={group} />
                              }
                            </li>
                          </ul>
                          <ul className="box-list-item">
                            {group.employees &&
                              group.employees.map(employee => (
                                <li key={employee.employeeId}>
                                  <label className="icon-check ml-4 d-inline-flex">
                                    <input
                                      type="checkbox"
                                      name=""
                                      checked={employee.isSelected === 1}
                                      onChange={() => onSelectEmployee(employee.employeeId, null, group.groupId)}
                                    />
                                    <i /> <span className="text-ellipsis">{employee.employeeSurname}{employee.employeeName ? ' ' + employee.employeeName : ''}</span>
                                  </label>
                                  <div className="icon-small-primary icon-sort-small ml-3" id={employee.employeeId + "null" + group.groupId} onClick={() => showSubMenuEmployee(employee.employeeId, null, group.groupId, true)}>
                                  </div>
                                  {showSubMenuEmp && idSubMenu[0] === employee.employeeId && idSubMenu[2] === group.groupId &&
                                    <SubMenuEmployee employee={employee} />
                                  }
                                </li>
                              ))}
                          </ul>
                        </li>
                      ))}
                  </ul>
                </>}
                <div className="divider" />
                <div className="expand" onClick={() => setPeriodArea(!openPeriodArea)}>{translate("tasks.list.left.period")}<i className={openPeriodArea ? "fas fa-chevron-up" : "fas fa-chevron-down"} /></div>

                {openPeriodArea && <>
                  <div className="wrap-check-radio mb-2">
                    <p className="radio-item">
                      <input type="radio" id="radio1" name="radio1" checked={localMenu.searchStatic.isAllTime === 1} onChange={onSetAlltime} />
                      <label onClick={() => onSetAlltime(true)} >{translate("tasks.list.left.alltime")}</label>
                    </p>
                    <p className="radio-item">
                      <input type="radio" id="radio" name="radio1" checked={localMenu.searchStatic.isAllTime !== 1} onChange={onSetAlltime} />
                      <label onClick={() => onSetAlltime(false)}>{translate("tasks.list.left.periodspecification")}</label>
                    </p>
                  </div>
                  {localMenu.searchStatic && localMenu.searchStatic.isAllTime !== 1 && <>
                    <DatePicker forcePosition={true} overlayClass={'position-fixed z-index-999'} date={startDate} onDateChanged={(d) => updateDateLocalMenu(DATE_TYPE.START_DATE, d)} />
                    <div className="divider1"></div>
                    <DatePicker forcePosition={true} overlayClass={'position-fixed z-index-999'} date={endDate} onDateChanged={(d) => updateDateLocalMenu(DATE_TYPE.END_DATE, d)} />
                  </>}
                </>}
              </>
              }
            </div>
          </div>
        </Resizable>
      }
      <div className={`button-collapse-sidebar-product ${showShadowTop && showSidebar ? "shadow-local-navigation-top " : ""}`} onClick={() => setShowSidebar(!showSidebar)}>
        <a className="expand"><i className={`far ${showSidebar ? "fa-angle-left" : "fa-angle-right"} `} /></a>
      </div>
    </>
  )

}

const mapStateToProps = ({ taskList, menuLeft }: IRootState) => ({
  localMenu: taskList.localMenu,
  servicesInfo: menuLeft.servicesInfo,
});

const mapDispatchToProps = {
  handleSaveLocalNavigation, startExecuting, handleGetLocalNavigation, resetLocalNavigation
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocalMenu);