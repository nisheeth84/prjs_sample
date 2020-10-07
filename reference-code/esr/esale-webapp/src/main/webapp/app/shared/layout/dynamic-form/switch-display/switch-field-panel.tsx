import React, { useState } from 'react';
import { translate } from 'react-jhipster';
import FieldCard from './switch-field-card';
import { DEFINE_FIELD_TYPE, SPECIAL_HIDE_DISPLAY_SWITCH_PANEL, SPECICAL_FIELD_LABLE_CONVERT } from '../constants';
import CommonDialog from 'app/shared/layout/common/commom-dialog';
import { AVAILABLE_FLAG, FIELD_BELONG } from 'app/config/constants';
import { decodeUserLogin, getFieldLabel } from 'app/shared/util/string-utils';
import _ from 'lodash';
import MenuSetting from 'app/modules/setting/menu-setting';
import { SETTING_MENU } from 'app/modules/setting/constant';

export interface SwitchFieldPanelProps {
  dataSource: any[],
  dataTarget: any[],
  onCloseSwitchDisplay,
  onChooseField: (fieldId: string, isChecked: boolean) => void,
  onDragField: (fieldSourceId: string, fieldTargetId: string) => void,
  fieldBelong?: any,
  isAdmin?: any,
  goToEmployeeDetail?: any,
  dismissDialog?: () => void;
}

const SwitchFieldPanel = (props: SwitchFieldPanelProps) => {
  const [fieldFilter, setFieldFilter] = useState('');
  const [isOpenSettingPopup, setIsOpenSettingPopup] = useState(false);

  const onCloseClick = (event) => {
    props.onCloseSwitchDisplay();
    event.preventDefault();
  }

  const isMatchFilter = (item) => {
    if (item.fieldType.toString() === DEFINE_FIELD_TYPE.TAB ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE ||
      item.fieldType.toString() === DEFINE_FIELD_TYPE.LOOKUP) {
      return false
    }
    if (fieldFilter.length <= 0) {
      return true;
    }
    const textField = getFieldLabel(item, 'fieldLabel');
    if (textField.length <= 0) {
      return false;
    }
    return textField.includes(fieldFilter);
  }

  const isItemSelected = (item) => {
    const matchList = props.dataTarget.filter(e => e.fieldId.toString() === item.fieldId.toString());
    return matchList.length > 0;
  }

  const isMatchSpecial = (e) => {
    if (!_.isNil(SPECIAL_HIDE_DISPLAY_SWITCH_PANEL(props.fieldBelong).find(item => item === e.fieldName))) {
      return false;
    }
    return true;
  }

  const canUncheck = () => {
    const listFieldCheck = props.dataSource.filter(e => isMatchSpecial(e)).filter(e => isItemSelected(e));
    return listFieldCheck && listFieldCheck.length > 1;
  }

  const toggleChooseCard = async (fieldId, isChecked) => {
    if (!canUncheck() && !isChecked) {
      await CommonDialog({
        message: translate('messages.WAR_COM_0011'),
        submitText: "OK"
      });
    } else {
      props.onChooseField(fieldId, isChecked);
    }
  }

  const checkDisplayField = (field: any) => {
    if (field.fieldType.toString() === DEFINE_FIELD_TYPE.TITLE) {
      return false;
    }
    if (field.fieldType.toString() === DEFINE_FIELD_TYPE.TAB) {
      return false;
    }
    return true;
  }

  /**
   * Parse constant fieldBelong to constant menuType in general setting
   * @param fieldBelong 
   */
  const parseFieldBelongToMenuType = (fieldBelong) => {
    let menuType = SETTING_MENU.MENU_HOME;
    if (fieldBelong === FIELD_BELONG.CUSTOMER) {
      menuType = SETTING_MENU.MENU_CUSTOMER
    }
    return menuType;
  }

  const dismissDialog = () => {
    setIsOpenSettingPopup(false);
    props.dismissDialog();
  }

  const convertFieldLabel = (list) => {
    list.map(elm => {
      if(!_.isNil(SPECICAL_FIELD_LABLE_CONVERT[elm.fieldName])) {
        elm.fieldLabel = SPECICAL_FIELD_LABLE_CONVERT[elm.fieldName];
      }
    })
    return list;
  }

  const listFieldInfo = props.dataSource.filter(e => isMatchFilter(e));
  let listField = listFieldInfo.filter(e => isMatchSpecial(e));
  listField = convertFieldLabel(listField)
  const infoUserLogin = decodeUserLogin(); // Get login user info
  const employeeIdLogin = infoUserLogin['custom:employee_id']; // Get employeeId of login user
  return (
    <div className="esr-content-sidebar-right style-3 overflow-hover">
      <div className="control-top-sidebar">
        <p>{translate("global.button.switch-display")}</p>
        <a onClick={onCloseClick}><i className="fas fa-times"></i></a>
      </div>
      <div className="search-box-button-style">
        <button className="icon-search"><i className="far fa-search"></i></button>
        <input onChange={(event) => setFieldFilter(event.target.value.trim())} type="text" placeholder={translate("global.placeholder.find-item")} />
      </div>
      <div className="wrap-checkbox margin-y-20">
        {listField.filter(o => o.availableFlag === AVAILABLE_FLAG.WEB_APP_AVAILABLE && checkDisplayField(o)).map((item, idx) =>
          <FieldCard key={idx} text={getFieldLabel(item, 'fieldLabel')} sourceField={item} isChecked={isItemSelected(item)}
            toggleChooseField={toggleChooseCard}
            dragField={props.onDragField}
            fieldBelong={props.fieldBelong}
          />
        )}
      </div>
      {props.isAdmin && props.fieldBelong === FIELD_BELONG.EMPLOYEE && (
        <a
          title=""
          className="sidebar-search button-primary"
          onClick={() => props.goToEmployeeDetail({ employeeId: employeeIdLogin })}
        >
          <i className="fas fa-cog"></i>
          {translate('global.button.search-all')}
        </a>
      )}
      {props.isAdmin && props.fieldBelong !== FIELD_BELONG.EMPLOYEE && (
        <a
          title=""
          className="sidebar-search button-primary"
          onClick={() => setIsOpenSettingPopup(true)}
        >
          <i className="fas fa-cog"></i>
          {translate('global.button.search-all')}
        </a>
      )}
      {isOpenSettingPopup && <MenuSetting dismissDialog={dismissDialog} menuType={parseFieldBelongToMenuType(props.fieldBelong)} />}
    </div>
  );
}

export default SwitchFieldPanel
