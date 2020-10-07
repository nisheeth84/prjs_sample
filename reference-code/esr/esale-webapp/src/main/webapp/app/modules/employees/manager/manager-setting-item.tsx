import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import ManagerSuggestSearch from 'app/shared/layout/common/suggestion/tag-auto-complete';
import { TagAutoCompleteType, TagAutoCompleteMode, SearchType } from 'app/shared/layout/common/suggestion/constants';
import { EMPLOYEE_VIEW_MODES, EMPLOYEE_ACTION_TYPES } from '../constants';
import ModalCreateEditEmployee from 'app/modules/employees/create-edit/modal-create-edit-employee';
import { isMouseOnRef, getFirstCharacter } from 'app/shared/util/utils';
import { getFullName } from 'app/shared/util/string-utils';

export interface IManagerSettingItemProps {
  item: any;
  employees: any;
  errorItems: any;
  toggleOpenEmployeeDetail: (employeeId) => void;
  toggleChangeInput: (managerId, departmentId) => void;
  validMsg: any;
}

/**
 * Component for manager setting item
 * @param props
 */
const ManagerSettingItem: React.FC<IManagerSettingItemProps> = props => {
  const { item, employees } = props;
  const [settingType, setSettingType] = useState(item.managerId === null ? '2' : '1');
  const [validMsg, setValidMsg] = useState(null);
  const [saveTagSelected, setSaveTagSelected] = useState([]);

  /**
   * Action select value suggestsearch
   */
  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag && listTag[0]) {
      const managerId = _.cloneDeep(listTag[0].employeeId);
      props.toggleChangeInput(managerId, item.departmentId);
      setValidMsg(null);
      setSaveTagSelected(listTag);
    } else {
      props.toggleChangeInput(null, item.departmentId);
      setSaveTagSelected(null);
    }
  };

  /**
   * Event change radio
   */
  const handleSettingTypeChange = event => {
    setSettingType(event.target.value);
    if (event.target.value === '1') {
      props.toggleChangeInput(item.managerId, item.departmentId);
    } else {
      props.toggleChangeInput(null, item.departmentId);
      setSaveTagSelected(null);
    }
  };

  /**
   * Init screen
   */
  useEffect(() => {
    if (!saveTagSelected || saveTagSelected.length <= 0) {
      setValidMsg(props.validMsg);
    }
  }, [saveTagSelected, props.validMsg]);

  return (
    <div className="form-group row ">
      <div className="col-lg-6">
        <div className="mission-wrap">
          <p className="type-mission">{item.departmentName}</p>
          <div className="item">
            <span className="date w-auto">{translate('employees.manager.manager-setting.form.managerName')}&nbsp;</span>
            {item.managerId && item.managerName
              ? (
                <a className="text-blue mr-2" onClick={() => props.toggleOpenEmployeeDetail(item.managerId)}>
                  {item.managerPhoto?.fileUrl
                    ? <img src={item.managerPhoto.fileUrl} alt="" className="user border-0 mr-1 mb-1" />
                    : <div className="no-avatar green">{getFirstCharacter(item.managerName)}</div>
                  }
                  {item.managerName}
                </a>
              )
              : 'ー'
            }
          </div>
          <div className="item">
            <span className="date w-auto">{translate('employees.manager.manager-setting.form.employeeName')}&nbsp;</span>
            {employees?.map((emp, idx) => {
              if (emp.departments?.find(dep => dep.departmentId === item.departmentId)) {
                return (
                  <a className="text-blue mr-2" onClick={() => props.toggleOpenEmployeeDetail(emp.employeeId)} key={idx}>
                    {emp.employeePhoto?.fileUrl
                      ? <img src={emp.employeePhoto.fileUrl} alt="" className="user border-0 mr-1 mb-1" />
                      : <div className="no-avatar green">{getFirstCharacter(getFullName(emp.employeeSurname, emp.employeeName))}</div>
                    }
                    {getFullName(emp.employeeSurname, emp.employeeName)}
                  </a>
                )
              }
              return <></>
            })}
          </div>
        </div>
        <div className="wrap-check">
          <div className="wrap-check-radio">
            <p className={`radio-item ${item.managerId ? '' : 'disabled'}`}>
              <input type="radio" id={'settingType_' + item.departmentId + '_1'} disabled={item.managerId === null} name={'settingType_' + item.departmentId} defaultChecked={item.managerId} value="1" onChange={handleSettingTypeChange} />
              <label htmlFor={'settingType_' + item.departmentId + '_1'}>
                {translate('employees.manager.manager-setting.form.organizationNanager')}
              </label>
            </p>
            <p className="radio-item">
              <input type="radio" id={'settingType_' + item.departmentId + '_2'} name={'settingType_' + item.departmentId} defaultChecked={item.managerId === null} value="2" onChange={handleSettingTypeChange} />
              <label htmlFor={'settingType_' + item.departmentId + '_2'}>
                {translate('employees.manager.manager-setting.form.individualManager')}
              </label>
            </p>
          </div>
          {settingType === '2' &&
            <ManagerSuggestSearch
              validMsg={validMsg}
              id={'managerId_' + item.departmentId}
              title={translate('employees.manager.manager-setting.form.manager')}
              type={TagAutoCompleteType.Employee}
              modeSelect={TagAutoCompleteMode.Single}
              searchType={SearchType.Employee}
              elementTags={saveTagSelected}
              onActionSelectTag={onActionSelectTag}
              className="input-normal"
              placeholder={translate('employees.manager.manager-setting.form.manager.default')}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default ManagerSettingItem;
