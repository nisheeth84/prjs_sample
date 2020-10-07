import React, { useRef, useState, useEffect } from 'react';
import { firstChar, getFieldLabel, getEmployeeImageUrl } from 'app/shared/util/string-utils';
import { ORG_COLORS as colors } from 'app/config/constants';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import { SUGGESTION_CSS } from '../constants';

export const ITEM_FORMATS = {
  SINGLE: 1,
  MULTI: 2
}

interface ISelectedItemProps {
  item: any,
  index: number,
  mode: number,
  fieldBelong: any,
  onRemoveItem: (index, value?: any) => void,
  gotoDetail: (id, fieldBelong) => void,
  listActionOption?: { id, name }[],
  onActionOption?: (idx: number, ev) => void,
  widthClass?: string
}

const SelectedItem = (props: ISelectedItemProps) => {
  const orgDepartmentType = 1;
  const orgGroupType = 2;
  const tagResultRef = useRef(null);
  const tagInfoRef = useRef(null);
  const [isShowSelectParticipant, setIsShowSelectParticipant] = useState(false);
  const [selectedItem, setSelectedItem] = useState({
    id: props.item.participantType,
    name: props.listActionOption && props.item.participantType ? props.listActionOption.find(e => e && e.id === props.item.participantType).name : ''
  });

  useEffect(() => {
    if (props.item && props.listActionOption) {
      setSelectedItem({
        id: props.item.participantType,
        name: props.listActionOption.find(e => e && e.id === props.item.participantType)?.name || ''
      })
    }
  }, [props.item, props.listActionOption])

  const departmentsOfEmployee = (emp) => {
    let departments = [];
    if (!_.isEmpty(emp?.employeeDepartments)) {
      departments = emp.employeeDepartments;
    } else if (!_.isEmpty(emp?.departments)) {
      departments = emp.departments;
    }
    return departments;
  }

  const getEmployeeFullName = (emp, positions?) => {
    let fullName = emp.employeeSurname;
    if (emp.employeeName) {
      fullName += ' ' + emp.employeeName;
    }
    if (positions) {
      fullName += ' ' + positions;
    }
    return fullName;
  }

  const getEmployeesFromOrg = (org = {}, typeOrg, hover = false) => {
    let employees = org['employees'] && org['employees'].length > 0 ? org['employees'] : []
    if (typeOrg === orgDepartmentType && org['employeesDepartments'] && org['employeesDepartments'].length > 0) {
      employees = org['employeesDepartments'];
    } else if (typeOrg === orgGroupType && org['employeesGroups'] && org['employeesGroups'].length > 0) {
      employees = org['employeesGroups'];
    }
    return hover ? employees.map(emp => {
      return {
        employeeId: emp.employeeId,
        fileUrl: getEmployeeImageUrl(emp),
        employeeName: getEmployeeFullName(emp)
      }
    }) : employees.map(emp => getEmployeeFullName(emp)).join(", ");
  }

  const getOrgObjet = (item) => {
    let image = null;
    let textAbove = "";
    let textBelow = "";
    let textHoverAbove = "";
    let textHoverBelow;
    let isGroup = false;
    let color = '';
    if (item.employeeId) {
      color = colors.employee;
      image = getEmployeeImageUrl(item) ? <img src={getEmployeeImageUrl(item)} /> : firstChar(item.employeeSurname);
      const departments = departmentsOfEmployee(item);
      const dpmNames = departments.map(dpm => { return dpm.departmentName });
      const posName = !_.isEmpty(departments) ? getFieldLabel(departments[0], "positionName") : "";
      const empName = getEmployeeFullName(item);
      textAbove = dpmNames.length > 0 ? dpmNames[0] : "";
      textBelow = [empName, posName].join(' ');
      // hover
      textHoverAbove = textAbove;
      textHoverBelow = <><a className="font-size-12 file" onClick={() => props.gotoDetail(item.employeeId, props.fieldBelong)}>{empName}</a> {posName}</>;
    } else if (item.departmentId) {
      color = colors.department;
      image = firstChar(item.departmentName);
      textAbove = item.parentDepartment && item.parentDepartment.departmentName ? item.parentDepartment.departmentName : "";
      textBelow = item.departmentName ? item.departmentName : "";
      // hover
      textHoverAbove = textAbove;
      // const empNames = item.employeesDepartments && item.employeesDepartments.length > 0 ? item.employeesDepartments.map(emp => { return getEmployeeFullName(emp) }) : [];
      textHoverBelow = getEmployeesFromOrg(item, orgDepartmentType, true);
    } else if (item.groupId) {
      color = colors.group;
      isGroup = true;
      image = firstChar(item.groupName);
      textAbove = item.groupName ? item.groupName : "";
      // hover
      textHoverAbove = textAbove;
      // const empNames = item.employeesGroups && item.employeesGroups.length > 0 ? item.employeesGroups.map(emp => { return getEmployeeFullName(emp) }) : [];
      textHoverBelow = getEmployeesFromOrg(item, orgGroupType, true);
    }

    return {
      image,
      textAbove,
      textBelow,
      textHoverAbove,
      textHoverBelow,
      isGroup,
      color
    }
  }

  const onSelectParticipantType = (o) => {
    setIsShowSelectParticipant(false);
    if (props.onActionOption) {
      props.onActionOption(props.index, o.id);
    }
    setSelectedItem(o);
  }

  // const onMouseLeaveTagRef = (e) => {
  //   if (tagResultRef && tagResultRef.current && tagResultRef.current.contains(e.target)
  //     || tagInfoRef && tagInfoRef.current && tagInfoRef.current.contains(e.target)) {
  //     setHover(true);
  //     return;
  //   }
  //   setHover(false);
  // }
  // useEventListener('mouseout', onMouseLeaveTagRef);

  const handleClickOutside = (event) => {
    if (tagResultRef && tagResultRef.current && !tagResultRef.current.contains(event.target)) {
      setIsShowSelectParticipant(false);
    }
  }
  useEventListener('mousedown', handleClickOutside);

  const renderTextHoverBelow = (textHoverBelow) => {
    if (_.isArray(textHoverBelow)) {
      return (
        <>
          <div className="d-flex align-items-center">
            {textHoverBelow.map((item, idx) =>
              <div key={idx} className="item d-inline-flex align-items-center">
                {item.fileUrl ?
                  <img className="user" src={item.fileUrl} alt="" title="" /> :
                  <div className={`no-avatar ${colors.employee}`}>{firstChar(item.employeeName)}</div>
                }
                <a className="font-size-12 file" onClick={() => props.gotoDetail(item.employeeId, props.fieldBelong)}>{item.employeeName}</a>
              </div>
            )}
          </div>
        </>
      )
    } else {
      if (textHoverBelow) {
        return (
          <div className="text2 text-blue word-break-all">{textHoverBelow}</div>
        )
      }
    }
    return <></>;
  }

  const renderModeSingle = () => {
    const orgObjet = getOrgObjet(props.item);
    const tagName = orgObjet.isGroup ? orgObjet.textAbove : orgObjet.textBelow;
    return (
      <div className={SUGGESTION_CSS.WRAP_TAG}>
        <div className={SUGGESTION_CSS.TAG}>{tagName}<button type="button" className="close" onClick={() => props.onRemoveItem(props.index, true)}>×</button></div>
        <div className="drop-down h-auto w100 mt-0">
          <ul className="dropdown-item mb-0">
            <li className="item smooth">
              <div className="item2">
                <div className={`name ${orgObjet.color}`}>
                  {orgObjet.image}
                </div>
                <div className="content">
                  <div className="text text1 font-size-12 text-blue">{orgObjet.textHoverAbove}</div>
                  {/* <div className="text text2 text-blue text-ellipsis">{orgObjet.textHoverBelow}</div> */}
                  {renderTextHoverBelow(orgObjet.textHoverBelow)}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  const renderModeMulti = () => {
    const orgObjet = getOrgObjet(props.item);
    const widthClass = props.widthClass && props.listActionOption ? props.widthClass : 'w32';
    return (
      <>
        <div className={`${isShowSelectParticipant ? 'z-index-99' : ''} ${widthClass} position-relative`} ref={tagResultRef}>
          <div className={`${isShowSelectParticipant ? 'z-index-99' : ''} drop-down w100 h-auto background-color-86 overflow-initial`}>
            <ul className="dropdown-item mb-0 overflow-initial">
              <li className="item smooth">
                <div className="item2">
                  <div className={`name ${!_.isString(orgObjet.image) ? '' : orgObjet.color}`}>
                    {orgObjet.image}
                  </div>
                  <div className={`${props.listActionOption ? 'calc120' : ''} content`} style={props.listActionOption ? { width: 'calc(100% - 120px)' } : {}}>
                    <div className={`text text1 font-size-12 text-ellipsis`}>{orgObjet.textAbove}</div>
                    {!orgObjet.isGroup && <div className={`text text2 text-ellipsis`}>{orgObjet.textBelow}</div>}
                  </div>
                  {props.listActionOption && <div className={`drop-select-down`}>
                    <a title="" className={(isShowSelectParticipant ? "active" : "") + " button-pull-down-small"}
                      onClick={() => setIsShowSelectParticipant(true)}>{selectedItem.name}</a>
                    {isShowSelectParticipant && <div className="box-select-option" style={{ minHeight: 'auto', minWidth: '100%' }}>
                      <ul ref={tagInfoRef}>
                        {props.listActionOption.map((o, i) =>
                          <li key={i} onClick={() => { onSelectParticipantType(o) }}>
                            <a className="ml-0" title="">{o.name}</a>
                          </li>
                        )}
                      </ul>
                    </div>}
                  </div>}
                </div>
                <button type="button" className="close" onClick={() => props.onRemoveItem(props.index)}>×</button>
              </li>
            </ul>
          </div>
          <div className={`drop-down child h-auto mt-0 ${isShowSelectParticipant ? 'z-index-4' : 'z-index-99'}`}>
            <ul className="dropdown-item mb-0">
              <li className="item smooth">
                <div className="item2">
                  <div className={`name ${!_.isString(orgObjet.image) ? '' : orgObjet.color}`}>
                    {orgObjet.image}
                  </div>
                  <div className="content">
                    <div className="text text1 font-size-12 text-blue">{orgObjet.textHoverAbove}</div>
                    {/* <div className="text text2 text-blue text-ellipsis">{orgObjet.textHoverBelow}</div> */}
                    {renderTextHoverBelow(orgObjet.textHoverBelow)}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  }

  const renderContent = () => {
    if (props.mode === ITEM_FORMATS.MULTI) {
      return renderModeMulti();
    } else if (props.mode === ITEM_FORMATS.SINGLE) {
      return renderModeSingle();
    }
    return <></>;
  }

  return renderContent();

}

export default SelectedItem;