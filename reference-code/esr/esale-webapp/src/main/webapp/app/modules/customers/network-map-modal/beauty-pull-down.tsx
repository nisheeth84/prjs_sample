import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Storage, translate } from 'react-jhipster';
import _ from 'lodash';
import { getValueProp } from 'app/shared/util/entity-utils';
import { ADD_DEPARTMENT_TO_BUSINESS_CARD } from '../constants';

export interface IBeautyPullDownProps {
  showLabel: any
  data: any
  value?: any
  updateStateField: (itemEditValue) => void
  tabIndex?: number
  rowIndex?: number
  departmentId?: any;
  className?: any
  listSelected?: any
  classNameBtn?: string
  zIndex?: any,
  defaultBlank?: any,
  classPulldown?: any;
}

const DEFAULT_DEPARTMENT_BUSINESS_CARD = 1;

const BeautyPullDown = (props: IBeautyPullDownProps) => {

  const [showItems, setShowItems] = useState(false);
  const [valueSelect, setValueSelect] = useState(null);
  const [departments, setDepartments] = useState([]);
  const { data } = props;

  const wrapperRef = useRef(null);

  const getFieldLabel = (item, fieldLabel) => {
    const lang = Storage.session.get('locale', "ja_jp");
    if (item && Object.prototype.hasOwnProperty.call(item, fieldLabel)) {
      try {
        const labels = _.isString(item[fieldLabel]) ? JSON.parse(item[fieldLabel]) : item[fieldLabel];
        if (labels && Object.prototype.hasOwnProperty.call(labels, lang)) {
          return getValueProp(labels, lang);
        } else {
          return labels;
        }
      } catch (e) {
        return item[fieldLabel];
      }
    }
    return '';
  }

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowItems(false);
      props.zIndex && props.zIndex(false);
    }
  }

  const buildDepartmentTree = (departmentlst) => {
    const departmentList = _.cloneDeep(departmentlst);
    if (departmentList === null || departmentList.length <= 0) {
      return departmentList;
    }
    // Map<Long, DepartmentsDTO>
    const departmentMap = {};
    departmentList.forEach(dto => {
      departmentMap[dto.itemId] = dto;
    });
    // List<DepartmentsDTO>
    const departmentTree = [];
    departmentList.forEach(dto => {
      if (_.isNil(dto.itemParentId)) {
        return;
      } else if (dto.itemParentId === DEFAULT_DEPARTMENT_BUSINESS_CARD) {
        departmentTree.push(dto);
      } else {
        const pDto = departmentMap[dto.itemParentId];
        if (pDto !== undefined) {
          let childList = pDto.departmentChild;
          if (childList === undefined) {
            childList = [];
          }
          childList.push(dto);
          pDto.departmentChild = childList;
        } else {
          departmentTree.push(dto);
        }
      }
    });
    return departmentTree;
  }

  useEffect(() => {
    if (data.fieldName === ADD_DEPARTMENT_TO_BUSINESS_CARD) {
      const buildRes = buildDepartmentTree(data.fieldItems);
      setDepartments(_.sortBy(buildRes, ['itemId']));
      document.addEventListener('click', handleClickOutside, false);
      return () => {
        document.removeEventListener('click', handleClickOutside, false);
      };
    }
  }, [data]);

  useEffect(() => {
    if (props.value) {
      setValueSelect(props.value);
    }
  }, [props.value])

  useEffect(() => {
    if (props.updateStateField) {
      props.updateStateField(valueSelect);
    }
  }, [valueSelect]);

  const handleItemClick = (val) => {
    setShowItems(false);
    props.zIndex && props.zIndex(false);
    setValueSelect(val);
  }

  const getDisplayItem = (key) => {
    if (key) {
      const indexOfValue = data.fieldItems.map(e => e.itemId).indexOf(key);
      if (indexOfValue >= 0) {
        const label = getFieldLabel(data.fieldItems[indexOfValue], 'itemLabel');
        return label || props.defaultBlank;
      }
    }
  }

  const renderDepartmentTree = (department) => {
    const childs = department.departmentChild !== undefined ? department.departmentChild : null;
    return (
      <>
        <li>
          <div className="d-flex item position-relative" onClick={() => handleItemClick(department.itemId)}>
            <a className="d-block w-100"><span className="text-ellipsis w-100">
              {department.itemId === DEFAULT_DEPARTMENT_BUSINESS_CARD
                ? (props.defaultBlank || translate("employees.department.department-regist-edit.form.parentId.default"))
                : getFieldLabel(department, 'itemLabel')}
            </span></a>
          </div>
          {childs && <ul>
            {childs.map(child => renderDepartmentTree(child))}
          </ul>}
        </li>
      </>
    );
  }

  const stylePulldown = useMemo(() => `drop-down-scroll-horizon drop-down drop-down2 ${props.classPulldown || 'max-height-300'}`, [props.classPulldown])

  const renderPulldown = () => {
    return (
      <div className={stylePulldown}>
        <ul className="list-group">
          {departments.map(node =>
            <>
              {renderDepartmentTree(node)}
            </>
          )}
        </ul>
      </div>
    );
  }

  const renderComponent = () => {
    return (
      <>
        <div className={`${props.className ? props.className : 'col-lg-6 form-group'}`} ref={wrapperRef}>
          <label>{translate('employees.department.department-regist-edit.form.parentId')}</label>
          <div className="select-option" tabIndex={props.tabIndex}>
            <button type="button" className={`select-text text-left ${props.classNameBtn}`} onClick={() => { setShowItems(true); props.zIndex && props.zIndex(true) }}>{getDisplayItem(valueSelect)}</button>
            {showItems && data.fieldItems && data.fieldItems.length > 0 && renderPulldown()}
          </div>
        </div>
      </>
    );
  }

  // final return
  return (
    <>
      {renderComponent()}
    </>
  );
}

export default BeautyPullDown;