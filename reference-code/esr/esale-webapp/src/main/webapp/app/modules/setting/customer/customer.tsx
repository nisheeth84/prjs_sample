import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { CUSTOMER_TAB, TIME_OUT_MESSAGE, SHOW_MESSAGE } from '../constant';
import MasterPosition from './master-position/master-position';
import MasterScenarios from './scenarios/master-scenarios';
import { translate } from 'react-jhipster';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import _ from 'lodash';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import scenariosReducer from './scenarios/scenarios.reducer';
import { getErrorMessage } from 'app/shared/util/string-utils';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
export interface ICustomerProps extends StateProps, DispatchProps {
  callBack?
  typeScenario
  changeScenario?
  cenario?
  setScenario?
  changeScenarioSuccsess?
  validateAction?
  validateBack
  setIsDirty?
  isChangeDirtyCheck?
  renderBoxMessage?
}

export const Customer = forwardRef((props: ICustomerProps) => {
  const [reload, setSeload] = useState(false)
  const [customerTabs, setCustomerTabs] = useState(CUSTOMER_TAB.DEFAULT);
  const [isSave, setIsSave] = useState(false);
  const [toggleBtnActive, setToggleBtnActive] = useState(true)
  const [showBtnAdd, setshowBtnAdd] = useState(0)
  const [checkDirty, setDirtyType] = useState(null);
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);
  const [isCancelMasterPosition, setIsCancelMasterPosition] = useState(false);
  const masterScenariosRef = useRef(null);

  const buttonCance = useRef(null);
  const buttonSubmit = useRef(null);

  const dirtyCheck = async (action: () => void) => {
    if (checkDirty) {
      await DialogDirtyCheckRestart({ onLeave: action });
    } else {
      action();
    }
  }

  const showbtb = (type?, codeType?) => {
    switch (type) {
      case CUSTOMER_TAB.MASTER_POSITION:
        dirtyCheck(() => {
          setDirtyType(null);
          setCustomerTabs(type)
          setToggleBtnActive(true)
          setshowBtnAdd(2)
        });
        break;
      case CUSTOMER_TAB.SCENARIOS:
        props.setScenario();
        setDirtyType(null);
        if (codeType) {
          props.changeScenario()

        }
        setToggleBtnActive(codeType)
        setCustomerTabs(type)
        setshowBtnAdd(codeType)
        break;
      default:
        break;
    }
  }

  const backAction = () => {
    if (props.validateBack) {
      props.changeScenarioSuccsess()
    }
    props.setIsDirty(false);
  }

  const changeMaster = (action) => {
    props.setIsDirty(action)
    setDirtyType(action)
    setSeload(false)

  }


  const cancel = async () => {
    buttonCance.current.blur();
    if (!masterScenariosRef || !masterScenariosRef.current) {
      return;
    }
    await masterScenariosRef.current.cancel()
    setDirtyType(false);
  }

  useEffect(() => {
    if (props.masterPositionSuccess) {
      setCodeMessage(SHOW_MESSAGE.SUCCESS);
    }
  }, [props.masterPositionSuccess]);

  const renderErrorMessage = () => {
    if (codeMessage === SHOW_MESSAGE.SUCCESS) {
      setTimeout(() => {
        setCodeMessage(SHOW_MESSAGE.ERROR);
      }, TIME_OUT_MESSAGE);
    }
    return <div>
      <BoxMessage messageType={MessageType.Success}
        message={translate('messages.INF_COM_0008')}
        className="message-area-bottom position-absolute" />
    </div>
  }

  useEffect(() => {
    if (props.typeScenario && props.cenario) {
      setToggleBtnActive(false)
    } else if (customerTabs === CUSTOMER_TAB.MASTER_POSITION) {
      setToggleBtnActive(true)
      setshowBtnAdd(2)
    }
  }, [props.typeScenario])

  useEffect(() => {
    if (props.scenarioSettingSuccess) {
      setCodeMessage(SHOW_MESSAGE.SUCCESS);
      setToggleBtnActive(false)
    }
  }, [props.scenarioSettingSuccess]);
  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3" style={{ height: "calc(100vh - 200px)" }}>
          <div className="user-popup-form h-100 setting-popup-wrap">
            <div className="setting-popup-left">
              <div className="wrap-control-esr">
                <div className="esr-content">
                  <div className="esr-content-sidebar no-background sidebar-menu-relative">
                    <div className="esr-content-sidebar-outer">
                      <div className="esr-content-sidebar-inner">
                        <div className="list-group" onClick={() => showbtb(CUSTOMER_TAB.DEFAULT)}>
                          <a className={customerTabs === CUSTOMER_TAB.DEFAULT ? "active" : ""} >
                            {translate('setting.product.projectSetting')}
                          </a>
                        </div>
                        <div className="list-group" onClick={() => showbtb(CUSTOMER_TAB.MASTER_POSITION)}>
                          <a className={customerTabs === CUSTOMER_TAB.MASTER_POSITION ? "active" : ""}>
                            {translate('setting.customer.nav.masterPosition')}
                          </a>
                        </div>
                        <div className="list-group" onClick={() => showbtb(CUSTOMER_TAB.SCENARIOS)}>
                          <a className={customerTabs === CUSTOMER_TAB.SCENARIOS ? "active" : ""}>
                            {translate('setting.customer.nav.scenatios')}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="setting-popup-content pt-2">
              {customerTabs === CUSTOMER_TAB.MASTER_POSITION && <MasterPosition isSave={isSave} setIsDirty={changeMaster} isCancel={isCancelMasterPosition} />}
              {customerTabs === CUSTOMER_TAB.SCENARIOS &&
                <MasterScenarios
                  ref={masterScenariosRef}
                  screenName={translate('setting.customer.nav.scenatios')}
                  isSave={isSave}
                  showbtb={showbtb}
                  backAction={backAction}
                  validateCanel={props.validateAction}
                  toggleBtnActive={toggleBtnActive}
                  renderBoxMessage={props.renderBoxMessage}
                  setIsDirty={props.setIsDirty}
                />}
            </div>
          </div>
        </div>
        {
          codeMessage === SHOW_MESSAGE.SUCCESS && renderErrorMessage()
        }
      </div>
      <div className="user-popup-form-bottom">
        {toggleBtnActive && <div className="user-popup-form-bottom">
          {showBtnAdd === 2 &&
            <button ref={buttonCance} className="btn-button button-primary btn-padding" onClick={e => { cancel(); setIsCancelMasterPosition(!isCancelMasterPosition) }}>
              {translate('setting.button.cancel')}
            </button>
          }
          <button ref={buttonSubmit} className="btn-button button-blue" onClick={e => setIsSave(!isSave)}>
            {customerTabs === CUSTOMER_TAB.SCENARIOS ? (
              showBtnAdd === 2 ? translate('setting.button.edit') : translate('setting.button.add')) : (
                translate('setting.button.save')
              )}
          </button>
        </div>}
      </div>
    </>
  )

});

const mapStateToProps = ({ scenarioSetting, masterPosition }: IRootState) => ({
  scenarioSettingSuccess: scenarioSetting.scenarioChange,
  masterPositionSuccess: masterPosition.updateSuccess
});

const mapDispatchToProps = {

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Customer);
