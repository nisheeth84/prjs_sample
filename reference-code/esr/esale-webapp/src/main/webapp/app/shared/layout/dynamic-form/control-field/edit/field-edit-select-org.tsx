import React, { useEffect, useState, forwardRef, useRef } from 'react';
import { ControlType, ORG_FORMATS, FIELD_BELONG } from 'app/config/constants';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {
  reset,
  handleGetEmployeeSuggestions,
  handleGetSelectOrganization,
  SelectOrganizationAction
} from './field-edit-select-org.reducer';
import { firstChar, getFieldLabel, getErrorMessage, getPlaceHolder } from 'app/shared/util/string-utils';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import { moveToScreen } from 'app/shared/reducers/screen-move.reducer';
import {
  SCREEN_TYPES,
  ORG_TARGET_TO_SEARCH_TYPE,
  ORG_SEARCH_TYPE,
  ORG_COLORS as colors
} from 'app/config/constants';
import SelectedItem, { ITEM_FORMATS } from 'app/shared/layout/common/suggestion/item/selected-item';
import IconLoading from 'app/shared/layout/common/suggestion/other/icon-loading';
import SearchAddSuggest from 'app/shared/layout/common/suggestion/search-add-suggest/search-add-suggest';
import { TagAutoCompleteMode } from 'app/shared/layout/common/suggestion/constants';
import { getSuggestCss } from 'app/shared/layout/common/suggestion/sugesstion-helper';

interface ISelectOrganizationDispatchProps {
  reset,
  handleGetEmployeeSuggestions,
  handleGetSelectOrganization,
  moveToScreen
}

interface ISelectOrganizationStateProps {
  flagDoNothing
  action,
  suggestData,
  organizationData,
  errorMessage
}


type IFieldEditSelectOrgProps = ISelectOrganizationDispatchProps & ISelectOrganizationStateProps & IDynamicFieldProps;

const FieldEditSelectOrg = forwardRef((props: IFieldEditSelectOrgProps, ref) => {
  const LIMIT_RECORD = 10;
  const EMPLOYEE_EXT_BELONG = 8;
  const [textValue, setTextValue] = useState('');
  const [keyword, setKeyword] = useState('');
  // !!! property MUST BE camel case !!!
  const [organizations, setOrganizations] = useState([]);
  const [listSuggest, setListSuggest] = useState([]);
  const [offset, setOffset] = useState(0);
  const [oldLimit, setOldLimit] = useState(0);
  const [oldTextSearch, setOldTextSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displaySugest, setDisplaySugest] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const bodyRef = useRef(null);
  const suggestBottomRef = useRef(null);
  const textRef = useRef(null);

  const { fieldInfo } = props;
  const target = fieldInfo && fieldInfo.selectOrganizationData && fieldInfo.selectOrganizationData.target;
  const format = fieldInfo && fieldInfo.selectOrganizationData && fieldInfo.selectOrganizationData.format;
  const idControl = `${props.idUpdate ? props.idUpdate : 0}_${fieldInfo.fieldId}`;
  const orgDepartmentType = 1;
  const orgGroupType = 2;
  const timerRef = useRef(null);

  let type = ControlType.EDIT;
  if (props.controlType) {
    type = props.controlType;
  }

  const makeKeyUpdateField = () => {
    const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
    if (props.elementStatus) {
      keyObject.itemId = props.elementStatus.key;
    }
    return keyObject;
  }

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

  const handleParentScroll = (event) => {
    if (type === ControlType.EDIT_LIST && bodyRef && bodyRef.current ) {
      const left = textRef.current.getBoundingClientRect().left;
      const top = textRef.current.getBoundingClientRect().top;
      const heightPcker = bodyRef.current.getClientRects()[0].height;
      if (!_.toString(bodyRef.current.className).includes('position-absolute') && bodyRef.current.style.position === 'fixed') {
        bodyRef.current.style.left = `${left}px`;
        bodyRef.current.style.setProperty('top', `${top - heightPcker - 5}px`, 'important')
      }
    }
  }

  useEffect(() => {
    if (props.elementStatus && props.elementStatus.fieldValue) {
      const orgInfos = _.isString(props.elementStatus.fieldValue) ? JSON.parse(props.elementStatus.fieldValue) : props.elementStatus.fieldValue;
      if (_.isArray(orgInfos) && orgInfos.length > 0) {
        props.handleGetSelectOrganization(idControl, orgInfos);
      }
    }
    if (textRef && textRef.current) {
      const divScroll = getScrollParent(textRef.current);
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
      props.reset();
      const nodeScroll = getScrollParent(textRef.current);
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
    };
  }, []);

  const requestSuggestData = (startRecord: number, limit?: number) => {
    if (_.trim(keyword).length <= 1) {
      return;
    }
    setIsLoading(true);
    let listItemChoice = [];
    if (organizations.length > 0) {
      listItemChoice = organizations.map(e => {
        const searchType = e.departmentId ? ORG_SEARCH_TYPE.DEPARTMENT : e.employeeId ? ORG_SEARCH_TYPE.EMPLOYEE : ORG_SEARCH_TYPE.GROUP;
        const idChoice = e.departmentId ? e.departmentId : e.employeeId ? e.employeeId : e.groupId;
        return {
          idChoice,
          searchType
        }
      });
    }
    props.handleGetEmployeeSuggestions(
      idControl,
      EMPLOYEE_EXT_BELONG, keyword.trim(),
      startRecord, limit > 0 ? limit : LIMIT_RECORD,
      target,
      listItemChoice,
      ORG_TARGET_TO_SEARCH_TYPE[target]
    );
  }

  useEffect(() => {
    if (oldTextSearch !== keyword && isFocus) {
      setOffset(0);
      requestSuggestData(0);
      setDisplaySugest(true);
    }
    setOldTextSearch(keyword);
  }, [keyword]);

  useEffect(() => {
    if (props.flagDoNothing) {
      return;
    }
    if (props.suggestData && props.suggestData.records) {
      if (offset === 0) {
        setListSuggest(props.suggestData.records);
      } else if (offset > 0) {
        props.suggestData.records.forEach((item) => {
          if (item.employeeId) {
            if (listSuggest.findIndex(e => e.employeeId === item.employeeId) < 0) {
              listSuggest.push(item);
            }
          } else if (item.departmentId) {
            if (listSuggest.findIndex(e => e.departmentId === item.departmentId) < 0) {
              listSuggest.push(item);
            }
          } else if (item.groupId) {
            if (listSuggest.findIndex(e => e.groupId === item.groupId) < 0) {
              listSuggest.push(item);
            }
          }
        })
        setListSuggest(_.cloneDeep(listSuggest));
      }
    }
    setIsLoading(false);
  }, [props.suggestData, props.flagDoNothing]);

  useEffect(() => {
    if (_.isEqual(props.action, SelectOrganizationAction.Error)) {
      setIsLoading(false);
    }
  }, [props.action])

  useEffect(() => {
    if (props.flagDoNothing) {
      return;
    }
    if (props.organizationData && !_.isEqual(organizations, props.organizationData)) {
      setOrganizations(props.organizationData);
    }
  }, [props.organizationData, props.flagDoNothing])

  /**
   * create fomat data insert/update to database
   * @param newOrganizations
   */
  const makeUpdateOrganizations = (newOrganizations) => {
    const updateOrganizations = [];
    newOrganizations.map(org => {
      if (org['employeeId']) {
        updateOrganizations.push({
          'employee_id': org['employeeId'],
          'department_id': 0,
          'group_id': 0
        });
      } else if (org['departmentId']) {
        updateOrganizations.push({
          'employee_id': 0,
          'department_id': org['departmentId'],
          'group_id': 0
        });
      } else if (org['groupId']) {
        updateOrganizations.push({
          'employee_id': 0,
          'department_id': 0,
          'group_id': org['groupId']
        });
      }
    })
    return updateOrganizations;
  }

  const isMulti = () => {
    return _.toString(format) === ORG_FORMATS.MULTI;
  }

  const selectElementSuggest = (elem: any, isActive) => {
    const obj = _.cloneDeep(elem);
    const tmpOrgs = _.cloneDeep(organizations);
    obj['actionId'] = 0;
    if (isMulti() && !isActive) {
      tmpOrgs.push(obj);
      setOrganizations(_.cloneDeep(tmpOrgs));
    } else if (!isMulti()) {
      setOrganizations([obj]);
    }
    setTextValue('');
    setKeyword('');
    setListSuggest([]);
    setDisplaySugest(false);
  }

  const handleUserMouseDown = (event) => {
    if (suggestBottomRef && suggestBottomRef.current && suggestBottomRef.current.isShowingSearchOrAdd()) {
      return;
    }
    if (bodyRef.current && !bodyRef.current.contains(event.target)) {
      setOldLimit(listSuggest.length);
      setDisplaySugest(false);
    }
  };

  useEventListener('mousedown', handleUserMouseDown);

  useEffect(() => {
    if (props.updateStateElement) {
      props.updateStateElement(makeKeyUpdateField(), fieldInfo.fieldType, makeUpdateOrganizations(organizations));
    }
  }, [organizations])

  useEffect(() => {
    if (type === ControlType.EDIT_LIST && displaySugest && textRef && textRef.current && bodyRef && bodyRef.current) {
      const left = textRef.current.getBoundingClientRect().left;
      const top = textRef.current.getBoundingClientRect().top;
      const height = textRef.current.getBoundingClientRect().height;
      const width = textRef.current.getBoundingClientRect().width;
      const heightPcker = bodyRef.current.getClientRects()[0].height;
      const space = window.innerHeight - (top + height);
      if (space < heightPcker) {
        if (_.toString(bodyRef.current.className).includes('position-absolute')) {
          bodyRef.current.style.setProperty('top', `${0 - heightPcker - 1}px`, 'important')
        } else {
          bodyRef.current.style.left = `${left}px`;
          bodyRef.current.style.setProperty('width', `${width}px`, 'important')
          bodyRef.current.style.setProperty('top', `${top - heightPcker - 5}px`, 'important')
          bodyRef.current.style.position = 'fixed';
        }
      }
    }
  }, [displaySugest, listSuggest, isLoading])

  const getEmployeeImageUrl = (emp) => {
    return emp?.photoFileUrl || emp?.employeeIcon?.fileUrl || emp?.fileUrl || null;
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

  const departmentsOfEmployee = (emp) => {
    let departments = [];
    if (!_.isEmpty(emp?.employeeDepartments)) {
      departments = emp.employeeDepartments;
    } else if (!_.isEmpty(emp?.departments)) {
      departments = emp.departments;
    }
    return departments;
  }

  const msg = getErrorMessage(props.errorInfo);  
  const hasTag = organizations.length > 0 && !isMulti();
  const css = getSuggestCss(fieldInfo.fieldType, {
    type,
    isMulti: isMulti(),
    hasTag,
    msg,
    isDisabled: props.isDisabled
  });
  const renderSuggestItem = (item) => {
    if (item.employeeId) {
      const isActive = organizations.filter(e => e.employeeId === item.employeeId).length > 0;
      let positions = "";
      let departments = "";
      if (!_.isEmpty(departmentsOfEmployee(item))) {
        positions = getFieldLabel(departmentsOfEmployee(item)[0], "positionName");
        departments = departmentsOfEmployee(item)[0].departmentName;
      }
      const avtUrl = getEmployeeImageUrl(item);
      return (
        <li className={`${css.liSuggest} ${isActive ? "active" : ""}`} onClick={() => selectElementSuggest(item, isActive)}>
          <div className="item2">
            <div className={`name ${avtUrl ? '' : colors.employee}`}>
              {avtUrl ? <img src={avtUrl} /> : firstChar(item.employeeSurname)}
            </div>
            <div className="content">
              <div className="text text1 font-size-12">{departments}</div>
              <div className="text text2 text-ellipsis">{getEmployeeFullName(item, positions)}</div>
            </div>
          </div>
          {item._toDoWarning && <div className="warning  font-size-12">{translate('messages.WAR_COM_0004')}</div>}
        </li>
      );
    } else if (item.departmentId) {
      const isActive = organizations.filter(e => e.departmentId === item.departmentId).length > 0;
      const employeeName = getEmployeesFromOrg(item, orgDepartmentType);
      return (
        <li className={`${css.liSuggest} ${isActive ? "active" : ""}`} onClick={() => selectElementSuggest(item, isActive)}>
          <div className="item2">
            <div className={`name ${colors.department}`}>
              {firstChar(item.departmentName)}
            </div>
            <div className="content">
              <div className="text text1 font-size-12">{item.departmentName}</div>
              <div className="text text2 text-ellipsis">{employeeName}</div>
            </div>
          </div>
        </li>
      );
    } else if (item.groupId) {
      const isActive = organizations.filter(e => e.groupId === item.groupId).length > 0;
      const employeeName = getEmployeesFromOrg(item, orgGroupType);
      return (
        <li className={`${css.liSuggest} ${isActive ? "active" : ""}`} onClick={() => selectElementSuggest(item, isActive)}>
          <div className="item2">
            <div className={`name ${colors.group}`}>
              {firstChar(item.groupName)}
            </div>
            <div className="content">
              <div className="text text1 font-size-12">{item.groupName}</div>
              <div className="text text2 text-ellipsis">{employeeName}</div>
            </div>
          </div>
        </li>
      );
    }
  }

  const hasMoreSuggest = () => {
    if (!props.suggestData) {
      return false;
    }
    if (!_.isNil(props.suggestData.total)) {
      if (props.suggestData.total === 0 || offset >= props.suggestData.total) {
        return false;
      }
    }
    if (!props.suggestData.records || props.suggestData.records.length === 0) {
      return false;
    }
    if (props.suggestData.records && props.suggestData.records.length % LIMIT_RECORD !== 0) {
      return false;
    }
    return true;
  }

  const loadMoreSuggest = (newOffSet) => {
    const limit = oldLimit < 1 ? LIMIT_RECORD : oldLimit;
    requestSuggestData(newOffSet, limit)
  }

  const onScrollSuggest = (ev) => {
    if (ev.target.scrollHeight - ev.target.scrollTop === ev.target.clientHeight) {
      if (hasMoreSuggest()) {
        setOffset(offset + LIMIT_RECORD);
        loadMoreSuggest(offset + LIMIT_RECORD);
      }
    }
  }

  const onSelectedRecords = (records: any[]) => {
    if (!records || records.length < 1) {
      return;
    }
    if (isMulti()) {
      records.forEach( e => {
        const idx = _.findIndex(organizations, {recordId: e.recordId})
        if (idx < 0) {
          organizations.push(e);
        }
      })
      setOrganizations(_.cloneDeep(organizations));
    } else {
      setOrganizations([records[0]]);
    }
    setDisplaySugest(false);
  }

  const renderSuggest = () => {
    return (
      <div className={css.wrapSuggest} ref={bodyRef} onScroll={onScrollSuggest}>
        <ul className={css.ulSuggest}>
          {listSuggest.map((e) => renderSuggestItem(e))}
          <IconLoading isLoading={isLoading} />
        </ul>
        <SearchAddSuggest
          ref={suggestBottomRef}
          id={idControl}
          fieldBelong={FIELD_BELONG.EMPLOYEE}
          modeSelect={isMulti() ? TagAutoCompleteMode.Multi : TagAutoCompleteMode.Single}
          onUnfocus={() => { setListSuggest([]); setDisplaySugest(false)}}
          onSelectRecords={onSelectedRecords}
        />
      </div>
    )
  }

  const onTextChange = (text) => {
    if (hasTag) {
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setKeyword(text);
    }, 300);
    setTextValue(text);
  }

  const onFocusTextBox = (e) => {
    setIsFocus(true);
    if (hasTag) {
      // disable search when has a record selected in mode single
      return;
    }
    const limit = oldLimit < 1 ? LIMIT_RECORD : oldLimit;
    setOffset(0);
    requestSuggestData(0, limit);
    setDisplaySugest(true);
  }

  const onRemoveOrganization = (index) => {
    organizations.splice(index, 1);
    setOrganizations(_.cloneDeep(organizations));
  }

  const onKeyDownTextBox = (e) => {
    if (e.key === "Tab") {
      setOldLimit(listSuggest.length)
      setListSuggest([]);
      e.target.blur();
    }
    if (e.key === "Backspace" && hasTag) {
      onRemoveOrganization(0);
      setOffset(0);
      requestSuggestData(0);
      setDisplaySugest(true);
    }
  }

  const toEmployeeDetail = (id) => {
    props.moveToScreen(SCREEN_TYPES.DETAIL, id, FIELD_BELONG.EMPLOYEE);
  }

  const getWidthClass = () => {
    let inputWidth = '';
    let tagWidth = 'w32'
    if (type === ControlType.EDIT_LIST && isMulti()) {
      inputWidth = 'width-420';
      tagWidth = 'w48';
    } else if (type === ControlType.EDIT_LIST && !isMulti()) {
      inputWidth = 'min-width-250';
    }
    return { inputWidth, tagWidth };
  }

  const onClearSearch = () => {
    setTextValue('');
    setKeyword('');
    // if (textRef.current && !isFocus) {
    //   textRef.current.focus();
    // }
  }

  const renderComponentEdit = () => {
    const wClass = getWidthClass();
    return (
      <>
        <div className="break-line form-group common">
          <div className={`${css.wrapInput} ${wClass.inputWidth}`}>
            {hasTag &&
              <SelectedItem item={organizations[0]} index={0}
                onRemoveItem={onRemoveOrganization}
                fieldBelong={FIELD_BELONG.EMPLOYEE}
                mode={ITEM_FORMATS.SINGLE}
                gotoDetail={(id, belong) => toEmployeeDetail(id)}
                widthClass={wClass.tagWidth}
              />
            }
            <input className={`input-normal ${props.isDisabled ? 'disable' : ''}`} type="text"
              ref={textRef}
              value={textValue}
              placeholder={hasTag ? null : getPlaceHolder(fieldInfo, format)}
              onChange={(e) => onTextChange(e.target.value)}
              onFocus={onFocusTextBox}
              onKeyDown={onKeyDownTextBox}
              disabled={props.isDisabled}
              onBlur={() => setIsFocus(false)}
            />
            {textValue && textValue.length > 0 && <span className="icon-delete" onClick={() => onClearSearch()} />}
            {displaySugest && renderSuggest()}
          </div>
          {msg && <span className="messenger-error d-block">{msg}</span>}
          {organizations.length > 0 && isMulti() &&
            <div className="chose-many z-index-1">
              {organizations.map((e, idx) =>
                <SelectedItem item={e} index={idx} key={idx}
                  onRemoveItem={onRemoveOrganization}
                  fieldBelong={FIELD_BELONG.EMPLOYEE}
                  mode={ITEM_FORMATS.MULTI}
                  widthClass={wClass.tagWidth}
                  gotoDetail={(id, belong) => toEmployeeDetail(id)}
                />
              )}
            </div>
          }
        </div>
      </>
    );
  }

  const renderComponentEditList = () => {
    return renderComponentEdit();
  }

  const renderComponent = () => {
    if (type === ControlType.EDIT || type === ControlType.ADD) {
      return renderComponentEdit();
    } else if (type === ControlType.EDIT_LIST) {
      return renderComponentEditList();
    }
    return <></>;
  }

  return renderComponent();
});

const mapStateToProps = ( {organization} : IRootState, {idUpdate, fieldInfo}: IDynamicFieldProps) => {
  const idControl = `${idUpdate ? idUpdate : 0}_${fieldInfo.fieldId}`;
  if (!organization || !organization.data.has(idControl)) {
    return {
      flagDoNothing: true,
      action: null,
      errorMessage: null,
      suggestData: { records: [], total: undefined },
      organizationData: []
    }
  }
  return {
    flagDoNothing: false,
    action: organization.data.get(idControl).action,
    errorMessage: organization.data.get(idControl).errorMessage,
    suggestData: organization.data.get(idControl).suggestData,
    organizationData: organization.data.get(idControl).organizationData
  }
}

const mapDispatchToProps = {
  reset,
  handleGetEmployeeSuggestions,
  handleGetSelectOrganization,
  moveToScreen
};

export default connect<ISelectOrganizationStateProps, ISelectOrganizationDispatchProps, IDynamicFieldProps>(
  mapStateToProps,
  mapDispatchToProps
)(FieldEditSelectOrg);