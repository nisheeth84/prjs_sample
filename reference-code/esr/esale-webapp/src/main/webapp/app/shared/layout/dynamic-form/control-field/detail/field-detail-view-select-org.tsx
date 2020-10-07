import React, { useState, useEffect, useRef } from 'react'
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import {
  handleGetSelectOrganization
} from '../edit/field-edit-select-org.reducer';
import _ from 'lodash';
import { useId } from "react-id-generator";
import { forceArray, firstChar, getEmployeeImageUrl, getColorImage } from 'app/shared/util/string-utils';
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import { moveToScreen } from 'app/shared/reducers/screen-move.reducer';
import { SCREEN_TYPES, ControlType, ORG_COLORS, FIELD_BELONG, ORG_FORMATS } from 'app/config/constants';
import Popover from 'react-tiny-popover';
import PopoverLib from 'app/shared/layout/common/Popover';
import useDeepCompareEffect from 'use-deep-compare-effect'

interface IFieldDetailViewSelectOrgDispatchProps {
  handleGetSelectOrganization,
  moveToScreen
}

interface IFieldDetailViewSelectOrgStateProps {
  flagDoNothing,
  organizationData,
  employees
}

export interface IFieldDetailViewSelectOrgOwnProps {
  fieldInfo?
  ogranizationValues: any,
  recordId: any,
  controlType?: any,
  onSelectEmployeeOrg?: (employeeId: number) => void,
  className?: any,
  deactiveId?: any,
}

type IFieldDetailViewSelectOrgProps = IFieldDetailViewSelectOrgDispatchProps & IFieldDetailViewSelectOrgStateProps & IFieldDetailViewSelectOrgOwnProps;

const MenuSelectOrg = (props: { org: any, targetNode?: any, fieldBelong: number, handleSelectOrgClick: (id) => void, onCloseMenuSelectOrg: () => void, className?: any, deactiveId?: any }) => {
  const menuRef = useRef(null);
  const [isTargetHide, setIsTargetHide] = useState(false);

  const isScrolledIntoView = (elem, scrollElem) => {
    if (elem.getBoundingClientRect().top + 20 < scrollElem.getBoundingClientRect().top) {
      return false;
    }
    if (elem.getBoundingClientRect().bottom - 20 > scrollElem.getBoundingClientRect().bottom) {
      return false;
    }
    return true;
  }

  const handleParentScroll = (event) => {
    const isShow = isScrolledIntoView(props.targetNode, event.target);
    setIsTargetHide(!isShow);
  }

  const handleUserMouseDown = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target) && props.onCloseMenuSelectOrg) {
      props.onCloseMenuSelectOrg();
    }
  };

  const getScrollParent = (node) => {
    if (node == null) {
      return null;
    }
    if (node.scrollHeight > node.clientHeight) {
      return node;
    } else {
      return getScrollParent(node.parentNode);
    }
  }

  useEffect(() => {
    setIsTargetHide(false);
    window.addEventListener('mousedown', handleUserMouseDown);
    if (props.targetNode) {
      const divScroll = getScrollParent(props.targetNode);
      if (divScroll) {
        const elemDiv = document.getElementsByClassName(divScroll.className);
        if (elemDiv && elemDiv.length > 0) {
          for (let i = 0; i < elemDiv.length; i++) {
            if (elemDiv[i] === divScroll) {
              document.getElementsByClassName(divScroll.className)[i].addEventListener('scroll', handleParentScroll);
              break;
            }
          }
        }
      }
    }
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
      const nodeScroll = getScrollParent(props.targetNode);
      if (nodeScroll) {
        const elemNode = document.getElementsByClassName(nodeScroll.className);
        if (elemNode && elemNode.length > 0) {
          for (let i = 0; i < elemNode.length; i++) {
            if (elemNode[i] === nodeScroll) {
              document.getElementsByClassName(nodeScroll.className)[i].removeEventListener('scroll', handleParentScroll);
              break;
            }
          }
        }
      }
    }
  }, [])

  const getDisplayEmployeeName = (emp) => {
    return `${emp.employeeSurname} ${emp.employeeName || ''}`;
  }

  const makeAvt = (employee) => {
    const imageUrl = getEmployeeImageUrl(employee);
    return (
      <>
        {imageUrl ? <img className="user" src={imageUrl} /> : <div className={`no-avatar ${ORG_COLORS.employee}`}>{firstChar(employee.employeeSurname)}</div>}
      </>
    )
  }

  if (isTargetHide) {
    return (<div ref={menuRef}></div>)
  }

  return (
    <div className={`box-select-option position-static max-height-300 overflow-auto max-width-300 mh-auto ${props.className}`} ref={menuRef}>
      {props.org.employees.map((emp, idx) =>
        <React.Fragment key={idx}>
          <div className="item p-2">
            {makeAvt(emp)}
            {props.deactiveId === emp.employeeId
              ? <a>{getDisplayEmployeeName(emp)}</a>
              : <a className="color-blue" onClick={() => props.handleSelectOrgClick(emp.employeeId)}>{getDisplayEmployeeName(emp)}</a>}
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

const FieldDetailViewSelectOrg = (props: IFieldDetailViewSelectOrgProps) => {
  const {
    recordId,
    fieldInfo,
    controlType,
    deactiveId
  } = props;

  const [orgItems, setOrgItems] = useState([]);
  const [tooltipIndex, setTooltipIndex] = useState(null);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeIdSelected, setEmployeeIdSelected] = useState(null);
  const [ogranizationValues, setOgranizationValues] = useState([]);
  const idControl = `${recordId}_${fieldInfo.fieldId}`;
  const displayNameRef = useRef(null);
  const employeeDetailCtrlId = useId(1, "viewSelectOrgEmployeeDetail_")


  useEffect(() => {
    if (props.ogranizationValues && !_.isEqual(props.ogranizationValues, ogranizationValues)) {
      const orgInfos = forceArray(props.ogranizationValues, []);
      if (orgInfos.length > 0) {
        props.handleGetSelectOrganization(idControl, orgInfos);
      }
      setOgranizationValues(props.ogranizationValues);
    }
  }, [props.ogranizationValues]);

  useEffect(() => {
    if (props.flagDoNothing) {
      return;
    }
    setOrgItems(_.cloneDeep(props.organizationData));
  }, [props.organizationData, props.flagDoNothing])

  const gotoPopupEmployeeDetail = (employeeId: number) => {
    if (props.fieldInfo && props.fieldInfo.fieldBelong === FIELD_BELONG.EMPLOYEE) {
      props.moveToScreen(SCREEN_TYPES.DETAIL, employeeId);
    } else if (props.onSelectEmployeeOrg) {
      props.onSelectEmployeeOrg(employeeId);
    } else {
      setOpenPopupEmployeeDetail(true);
      setEmployeeIdSelected(employeeId);
    }
  }

  const handleMoveScreen = (employeeId) => {
    gotoPopupEmployeeDetail(employeeId);
  }

  const handleTooltipClick = (employeeId) => {
    gotoPopupEmployeeDetail(employeeId);
    setTooltipIndex(null);
  }

  const getDisplayEmployeeName = (emp) => {
    return `${emp.employeeSurname} ${emp.employeeName || ''}`;
  }

  const renderPopupEmployeeDetail = () => {
    return (
      <PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        showModal={true}
        backdrop={true}
        openFromModal={true}
        employeeId={employeeIdSelected}
        listEmployeeId={[employeeIdSelected]}
        toggleClosePopupEmployeeDetail={() => setOpenPopupEmployeeDetail(false)}
        resetSuccessMessage={() => { }}
      />
    )
  }
  const format = props.fieldInfo && props.fieldInfo.selectOrganizationData && props.fieldInfo.selectOrganizationData.format;
  const isMulti = () => {
    return _.toString(format) === ORG_FORMATS.MULTI;
  }

  const renderMenuSelectOrg = (org, className?: any) => {
    return (
      <MenuSelectOrg org={org}
        fieldBelong={props.fieldInfo ? props.fieldInfo.fieldBelong : null}
        handleSelectOrgClick={handleTooltipClick}
        onCloseMenuSelectOrg={() => setTooltipIndex(null)}
        targetNode={displayNameRef && displayNameRef.current ? displayNameRef.current : null}
        className={props.className}
        deactiveId={deactiveId}
      />
    )
  }

  const groupOrDepartment = (org, idx) => {
    if (_.isNil(org.departmentName) && _.isNil(org.groupName)) {
      return <></>
    }
    const displayName = !_.isNil(org.departmentName) ? org.departmentName : org.groupName;
    const whiteSpaceNormal = (controlType !== ControlType.VIEW);
    return (
      <>
        {!isMulti() && <div className={"d-inline-block relative w-100"} ref={displayNameRef}>
          {_.isEmpty(org.employees) && <PopoverLib whiteSpaceNormal={whiteSpaceNormal} x={-20} y={25}>{displayName}</PopoverLib>}
          {!_.isEmpty(org.employees) &&
            <Popover
              containerStyle={{ overflow: 'initial', zIndex: '9000' }}
              isOpen={idx === tooltipIndex}
              position={['bottom', 'top', 'left', 'right']}
              content={renderMenuSelectOrg(org)}
            >
              <a className={"d-inline-block color-blue w-100 ellipsis"} onClick={() => setTooltipIndex(idx)}>
                <PopoverLib whiteSpaceNormal={whiteSpaceNormal} x={-20} y={25}>
                  {displayName}
                </PopoverLib>
              </a>
            </Popover>
          }
        </div>}
        {isMulti() && <div className={"d-inline"} ref={displayNameRef}>
          {_.isEmpty(org.employees) && <>{displayName}</>}
          {!_.isEmpty(org.employees) &&
            <Popover
              containerStyle={{ overflow: 'initial', zIndex: '9000' }}
              isOpen={idx === tooltipIndex}
              position={['bottom', 'top', 'left', 'right']}
              content={renderMenuSelectOrg(org)}
            >
              <a className="color-blue" onClick={() => setTooltipIndex(idx)}>
                {displayName}
              </a>
            </Popover>
          }
        </div>}
      </>
    )
  }

  const renderEmployee = (org) => {
    const url = getEmployeeImageUrl(org);
    const char = firstChar(org.employeeSurname);
    const aClass = (controlType !== ControlType.VIEW) ? '' : 'avatar';
    const imgClass = (controlType !== ControlType.VIEW) ? 'user' : '';
    const noAvtClass = (controlType !== ControlType.VIEW) ? 'no-avatar' : 'avatar';
    return (
      <>
        {url ? <a className={aClass}><img className={imgClass} src={url} /></a> : <a tabIndex={-1} className={`${noAvtClass} ${ORG_COLORS.employee}`}>{char}</a>}
        {!isMulti() && controlType === ControlType.VIEW &&
          <div className="d-inline-block text-ellipsis max-calc66"
            onClick={() => (!deactiveId || deactiveId !== org.employeeId) && handleMoveScreen(org.employeeId)}
          >
            <PopoverLib x={-20} y={25}>
              {getDisplayEmployeeName(org)}
            </PopoverLib>
          </div>
        }
        {(isMulti() || controlType !== ControlType.VIEW) &&
          <a className="file" onClick={() => (!deactiveId || deactiveId !== org.employeeId) && handleMoveScreen(org.employeeId)}>
            {getDisplayEmployeeName(org)}
          </a>
        }
      </>
    )
  }

  const renderOrgItem = (org, idx) => {
    const isComma = idx < orgItems.length - 1;
    const comma = ', ';
    return (
      <>
        {org.employeeId ? ((!deactiveId || deactiveId !== org.employeeId) ? <a>{renderEmployee(org)}</a> : <span>{renderEmployee(org)}</span>) : groupOrDepartment(org, idx)}{isComma && comma}
      </>
    );
  }

  const checkOrgValues = (values) => {
    if (_.isEmpty(forceArray(values))) {
      return false;
    }
    return forceArray(values).some((e) => e['department_id'] !== 0 || e['employee_id'] !== 0 || e['group_id'] !== 0);
  }


  const getGroupOrDepartment = (org, idx) => {
    if (_.isNil(org.departmentName) && _.isNil(org.groupName)) {
      return '';
    }
    const displayName = !_.isNil(org.departmentName) ? org.departmentName : org.groupName;
    return displayName;
  }
  const getTextPopover = () => {
    let text = '';
    checkOrgValues(props.ogranizationValues) &&
    orgItems.forEach((org, idx) => {
      const isComma = idx < orgItems.length - 1;
      const comma = isComma ? ', ' : '';
      text += org.employeeId ? getDisplayEmployeeName(org) : getGroupOrDepartment(org, idx) + comma;
    })
    return text || '';
  }

  const renderComponent = () => {
    let classTextCell = "text-over over-unset relative org-view item w-100";
    if (controlType === ControlType.DETAIL_EDIT) {
      classTextCell += " d-inline";
    }
    const text = getTextPopover();
    return (
      <>
        <div className={classTextCell}>
          {isMulti() && controlType === ControlType.VIEW &&
            <PopoverLib x={-20} y={25} text={text}>
              {checkOrgValues(props.ogranizationValues) &&
                orgItems.map((org, idx) => renderOrgItem(org, idx))
              }
            </PopoverLib>
          }
          {(!isMulti() || controlType === ControlType.DETAIL_VIEW || controlType === ControlType.DETAIL_EDIT) && <>
            {checkOrgValues(props.ogranizationValues) &&
              orgItems.map((org, idx) => renderOrgItem(org, idx))
            }
          </>
          }
        </div>
        {openPopupEmployeeDetail && renderPopupEmployeeDetail()}
      </>
    );
  }
  return renderComponent();

}

const mapStateToProps = ({ organization }: IRootState, { fieldInfo, recordId }: IFieldDetailViewSelectOrgOwnProps) => {
  const idControl = `${recordId}_${fieldInfo.fieldId}`;
  if (!organization || !organization.data.has(idControl)) {
    return { flagDoNothing: true, organizationData: [], employees: [] };
  }
  return {
    flagDoNothing: false,
    organizationData: organization.data.get(idControl).organizationData,
    employees: organization.data.get(idControl).employees
  }
}

const mapDispatchToProps = {
  handleGetSelectOrganization,
  moveToScreen
};

export default connect<IFieldDetailViewSelectOrgStateProps, IFieldDetailViewSelectOrgDispatchProps, IFieldDetailViewSelectOrgOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(FieldDetailViewSelectOrg);