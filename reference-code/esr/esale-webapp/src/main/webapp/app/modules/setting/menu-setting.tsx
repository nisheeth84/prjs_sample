import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster';
import SettingTop from './setting-top'
import Calendar from './calendar/calendar'
import System from './system/system';
import Product from './product/product';
import TaskProduct from './task-product/task-product';
import Employee from './employee/employee';
import { SETTING_MENU } from './constant';
import Task from './task/task';
import Customer from './customer/customer';
import DialogDirtyCheckPopup from 'app/shared/layout/common/dialog-dirty-check-popup';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import _ from 'lodash';

interface IMenuSettingProps {
  dismissDialog,
  menuType?: number,
  calendarTab?: number
}
export const MenuSetting = (props: IMenuSettingProps) => {

  const [menuType, setMenuType] = useState(SETTING_MENU.MENU_HOME);
  const [callBack, setCallBack] = useState(false);
  const [typeScenario, setTypeScenario] = useState(true);
  const [cenario, setScenario] = useState(false);
  const [validateBack, setValidateBack] = useState(true);
  const [modelHeader, setModelHeader] = useState({ iconPath: "setting/icon-gear.svg", title: translate('setting.title') });
  const [isDirty, setIsDirty] = useState(false);
  const [checkDirtyData, setCheckDirtyData] = useState({});
  const [dataChanged, setDataChanged] = useState(false);

  const handleChangeMenu = (type) => {
    setCallBack(true)
    setMenuType(type);
    switch (type) {
      case SETTING_MENU.MENU_HOME:
        setModelHeader({ iconPath: "setting/icon-gear.svg", title: translate('setting.title') });
        break;
      case SETTING_MENU.MENU_SYSTEM:
        setModelHeader({ iconPath: "setting/icon-gear.svg", title: translate('setting.system.title') });
        break;
      case SETTING_MENU.MENU_TASK:
        setModelHeader({ iconPath: "ic-todolist.svg", title: translate('setting.task.title') });
        break;
      case SETTING_MENU.MENU_CALENDAR:
        setModelHeader({ iconPath: "ic-sidebar-calendar.svg", title: translate('setting.calendar.title-fix') });
        break;
      case SETTING_MENU.MENU_PRODUCT_TRADE:
        setModelHeader({ iconPath: "setting/ic-book-pink.svg", title: translate('setting.sales.title-fix') });
        break;
      case SETTING_MENU.MENU_PRODUCT:
        setModelHeader({ iconPath: "setting/ic-box-yellow.svg", title: translate('setting.product.titleModal') });
        break;
      case SETTING_MENU.MENU_CUSTOMER:
        setModelHeader({ iconPath: "setting/ic-setting-opsition.svg", title: translate('setting.employee.titleDetail') });
        break;
      case SETTING_MENU.MENU_EMPLOYEE:
        setModelHeader({ iconPath: "setting/ic-person-yellow.svg", title: translate('setting.employee.titlePopup') });
        break;
      default:
        break;
    }
  }
  useEffect(() => {
    if (props.menuType) {
      setMenuType(props.menuType);
      handleChangeMenu(props.menuType)
    }
  }, [props.menuType])

  const changeScenario = () => {
    setTypeScenario(false)
  }

  const dataChangedCalendar = (flag) => {
    setDataChanged(flag)
  }

  const changeScenarioSuccsess = () => {
    setTypeScenario(true)
  }

  const validateAction = (bol) => {
    setValidateBack(bol)
  }

  const executeDirtyCheckCalendar = async (action: () => void) => {
    if (dataChanged) {
      await DialogDirtyCheckRestart({ onLeave: action });
    } else {
      action();
    }
  }

  // default action for dirty check leave is close dialog
  const executeDirtyCheck = async (type, action: () => void) => {
    if (!_.isEmpty(checkDirtyData) || isDirty) {
      if (type) {
        await DialogDirtyCheckPopup({ onLeave: action });
      } else {
        await DialogDirtyCheckRestart({ onLeave: action });
      }
    } else {
      action();
    }
  };

  const goHome = () => {
    setMenuType(SETTING_MENU.MENU_HOME);
    setModelHeader({ iconPath: "setting/icon-gear.svg", title: translate('setting.title') });
  }

  const backMenuHome = () => {
    switch (menuType) {
      case SETTING_MENU.MENU_CALENDAR:
      case SETTING_MENU.MENU_TASK:
        if (dataChanged) {
          DialogDirtyCheckPopup({
            onLeave() {
              setDataChanged(false);
              goHome();
            }
          });
        } else {
          goHome()
        }
        break;
      case SETTING_MENU.MENU_SYSTEM:
      case SETTING_MENU.MENU_PRODUCT_TRADE:
      case SETTING_MENU.MENU_PRODUCT:
      case SETTING_MENU.MENU_EMPLOYEE:
      case SETTING_MENU.MENU_CUSTOMER:
        executeDirtyCheck(true, () => {
          setCheckDirtyData({})
          goHome()
          setIsDirty(false)
        })
        break;
      default:
        goHome();
    }
  }

  const handleClosedPopup = () => {
    switch (menuType) {
      case SETTING_MENU.MENU_CALENDAR:
        if (dataChanged) {
          executeDirtyCheckCalendar(() => {
            props.dismissDialog()
            setDataChanged(false)
          })
        } else {
          props.dismissDialog()
        }
        break;
      case SETTING_MENU.MENU_TASK:
        if (dataChanged) {
          DialogDirtyCheckRestart({
            onLeave() {
              setDataChanged(false);
              props.dismissDialog()
            }
          });
        } else {
          props.dismissDialog()
        }
        break;
      case SETTING_MENU.MENU_SYSTEM:
      case SETTING_MENU.MENU_PRODUCT_TRADE:
      case SETTING_MENU.MENU_PRODUCT:
      case SETTING_MENU.MENU_EMPLOYEE:
      case SETTING_MENU.MENU_CUSTOMER:
        executeDirtyCheck(false, () => {
          props.dismissDialog()
          setCheckDirtyData({})
          setIsDirty(false)
        })
        break;

      default:
        props.dismissDialog()
        break;
    }
  }

  return (
    <>
      <Modal isOpen className="modal-open wrap-setting ">
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-left show" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content" id="MySetting1">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <button className={
                      menuType === SETTING_MENU.MENU_HOME ?
                        "icon-small-primary icon-return-small setting-disabled" :
                        "icon-small-primary icon-return-small"
                    } onClick={backMenuHome}
                    />
                    <span className="text">
                      <img id="12" className="icon-gear" src={`../../../content/images/${modelHeader.iconPath}`} />
                      {modelHeader.title}
                    </span>
                  </div>
                </div>
                <div className="right">
                  <button className="icon-small-primary icon-close-up-small line" onClick={handleClosedPopup} />
                </div>
              </div>
              {menuType === SETTING_MENU.MENU_EMPLOYEE &&
                <Employee callBack={callBack} closeDialog={props.dismissDialog}
                  setDirtyType={setCheckDirtyData}
                  setDirtyTypeProps={setCheckDirtyData}
                />
              }
              {menuType === SETTING_MENU.MENU_HOME && <SettingTop handleChangeMenu={handleChangeMenu} />}
              {menuType === SETTING_MENU.MENU_CALENDAR && <Calendar calendarTab={props.calendarTab} dataChangedCalendar={dataChangedCalendar} />}
              {menuType === SETTING_MENU.MENU_SYSTEM && <System setIsDirty={setIsDirty} />}
              {menuType === SETTING_MENU.MENU_PRODUCT_TRADE && <Product callBack={callBack} setDirtyTypeProps={setCheckDirtyData} />}
              {menuType === SETTING_MENU.MENU_PRODUCT && <TaskProduct callBack={callBack} setDirtyTypeProps={setCheckDirtyData} />}
              {menuType === SETTING_MENU.MENU_TASK && <Task callBack={callBack} setDirtyTypeProps={setCheckDirtyData} setDataChanged={setDataChanged} />}
              {menuType === SETTING_MENU.MENU_CUSTOMER &&
                <Customer
                  typeScenario={typeScenario}
                  cenario={cenario}
                  setScenario={setScenario}
                  changeScenarioSuccsess={changeScenarioSuccsess}
                  changeScenario={changeScenario}
                  validateBack={validateBack}
                  validateAction={validateAction}
                  isChangeDirtyCheck={backMenuHome}
                  setIsDirty={setIsDirty}
                />
              }
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MenuSetting;
