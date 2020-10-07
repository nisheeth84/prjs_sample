import React, { useState } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import MenuDatail from './detail-sidebar/menu-detail-employee';
import NotificationSettings from './detail-sidebar/notification-settings';
import LanguageAndTimeSettings from './detail-sidebar/language-and-time-settings';
import ChangePassWord from './detail-sidebar/change-password';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { Modal } from 'reactstrap';

export interface IEmployeeDetailSetting extends StateProps, DispatchProps {
  togglePopupEmployee
}

const EmployeeDetailSetting = (props: IEmployeeDetailSetting) => {
  const [typeMenus, setTypeMenus] = useState(0)

  const switchMenu = (type) => {
    setTypeMenus(type)
  }

  const executeDirtyCheckBack = async (action: () => void, cancel?: () => void) => {
    if (props.formDataChanged) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: DIRTYCHECK_PARTTERN.PARTTERN1});
    } else {
      action();
    }
  }

  const executeDirtyCheckClose = async (action: () => void, cancel?: () => void) => {
    if (props.formDataChanged) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: DIRTYCHECK_PARTTERN.PARTTERN2});
    } else {
      action();
    }
  }

  const callBack = () => {
    if (typeMenus !== 0) {
      // check dirty
      executeDirtyCheckBack(() => {
        setTypeMenus(0);
      });
    }
  }

  const closePopup = () => {
    // check dirty
    executeDirtyCheckClose(() => {
      props.togglePopupEmployee();
    });
  }

  const renderMenu = () => {
    switch (typeMenus) {
      case 1:
        return <ChangePassWord switchMenu={switchMenu} />
      case 2:
        return <LanguageAndTimeSettings switchMenu={switchMenu} />
      case 3:
        return <NotificationSettings switchMenu={switchMenu} />
      default:
        return <MenuDatail switchMenu={switchMenu} />
    }
  }
  const renderIconMenu = () => {
    switch (typeMenus) {
      case 1:
        return <>
          <img className="icon-task-brown" src="../../../content/images/setting/Group 5.svg" />{translate("employees.settings.icon-change-password")}
        </>
      case 2:
        return <>
          <img className="icon-task-brown new-size" src="../../../content/images/setting/ic-comnt.svg" />{translate("employees.settings.icon-language-timezone")}
        </>
      case 3:
        return <>
          <img className="icon-task-brown" src="../../../content/images/setting/iconBell.svg" />{translate("employees.settings.icon-notify")}
        </>
      default:
        return <>
          <img className="icon-task-brown new-size" src="../../../content/images/setting/icon-gear.svg" />{translate("employees.settings.icon-gear")}
        </>
    }
  }

  const renderComponent = () => {
    return (
      <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show membership-dropdown employee-detal" style={{ zIndex: 1060 }} id="popup-esr" aria-hidden="true">
          <div className="modal-dialog form-popup">
            <div className="modal-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back" >
                    <a onClick={callBack} className={`icon-small-primary icon-return-small ${typeMenus > 0 ? '' : 'disable'}`}>
                    </a>
                    <span className="text">{renderIconMenu()}</span>
                  </div>
                </div>
                <div className="right">
                  <a className="icon-small-primary icon-close-up-small line" onClick={closePopup} />
                </div>
              </div>
              {renderMenu()}
            </div>
          </div>
        </div>
      </>
    )
  };
  return (
    <>
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-employee-setting" className="wrap-membership" autoFocus={true} zIndex="auto">
        {renderComponent()}
      </Modal>
    </>
  );
};

const mapStateToProps = ({ employeeDetailAction }: IRootState) => ({
  formDataChanged: employeeDetailAction.formDataChanged,
});

const mapDispatchToProps = {

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeDetailSetting);