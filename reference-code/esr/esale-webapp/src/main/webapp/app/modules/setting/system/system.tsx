import React, { useState, useEffect, useRef } from 'react';
import { SYSTEM_TAB, SHOW_MESSAGE } from '../constant';
import SAML from './saml/saml';
import IpAddresses from './ip-address/ip-address';
import Period from './period/period';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { updateIpAddresses, reloadDrityCheck, reset } from './ip-address/ip-address.reducer';
import { updateAuthenticationSAML } from './saml/saml.reducer';
import { updatePeriod, getPeriod } from './period/period.reducer';
import General from './general/general';
import LogAccessses from '../system/logs-access/logs-access';
import PublicAPI from '../system/public-api/publicAPI';
import { updateGeneral } from './general/general.reducer';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIME_OUT_MESSAGE } from '../constant';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';

export interface ISystemProps extends StateProps, DispatchProps {
  setIsDirty;
}
export const System = (props: ISystemProps) => {
  const [dirtyReload, setDirtyReload] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showMsgSucess, setShowMsgSucess] = useState(SHOW_MESSAGE.NONE);
  const [systemTabs, setSystemTabs] = useState(SYSTEM_TAB.TAB_IP);

  const [ipAddresses, setIpAddresses] = useState([]);
  const [ipAddressesDel, setIpAddressesDel] = useState([]);
  const [ipAddressesInit, setIpAddressesInit] = useState([]);

  const [samlInit, setSamlInit] = useState(null);
  const [saml, setSaml] = useState(null);
  const [samlFile, setSamlFile] = useState([]);

  const [periodInit, setPeriodInit] = useState(null);
  const [period, setPeriod] = useState(null);

  const [generalSetting, setGeneralSetting] = useState({});
  const [generalSettingInit, setGeneralSettingInit] = useState(null);
  const [isError, setIsError] = useState(false);

  const [urlAPI, setUrlAPI] = useState({});
  const [urlAPIInit, setUrlAPIInit] = useState(null);
  const buttonCance = useRef(null);
  const buttonSubmit = useRef(null);

  // reset intitial data for dirty check
  const resetAll = () => {
    setIpAddresses([]);
    setIpAddressesDel([]);
    setIpAddressesInit([]);

    setSamlInit(null);
    setSaml(null);
    setSamlFile([]);

    setPeriodInit(null);
    setPeriod(null);

    setGeneralSetting({});
    setGeneralSettingInit(null);

    setUrlAPI({});
    setUrlAPIInit(null);
  };

  // init data methods
  const initIpAddrData = items => {
    setIpAddresses(items);
    setIpAddressesInit(items);
  };

  const initSamlData = items => {
    setSaml(items);
    setSamlInit(items);
  };

  const initPeriodData = items => {
    setPeriodInit(items);
    setPeriod(items);
  };

  const initGeneralSetting = items => {
    setGeneralSettingInit(items);
    setGeneralSetting(items);
  };

  const initUrlAPI = items => {
    setUrlAPI(items);
    setUrlAPIInit(items);
  };

  // change data methods
  const changeIpAddresses = (ips, ipsDel) => {
    const dirty = !_.isEqual(ips, ipAddressesInit) || !_.isEqual(ipsDel, ipAddressesDel);
    props.setIsDirty(dirty);
    setIsDirty(dirty);
    setIpAddresses(ips);
    setIpAddressesDel(ipsDel);
  };

  const changeSamlData = samlItem => {
    const dirty = !_.isEqual(samlItem, samlInit);
    props.setIsDirty(dirty);
    setIsDirty(dirty);
    setSaml(samlItem);
  };

  const changePeriod = (item, defaultData) => {
    const dirty = !defaultData ? !_.isEqual(item, periodInit) : false;
    props.setIsDirty(dirty);
    setIsDirty(dirty);
    setPeriod(item);
  };

  const changeGeneralSetting = item => {
    const dirty = !_.isEqual(item, generalSettingInit);
    setGeneralSetting(item);
    props.setIsDirty(dirty);
    setIsDirty(dirty);
  };

  const changeUrlAPI = item => {
    const dirty = !_.isEqual(item, urlAPIInit);
    setUrlAPI(item);
    props.setIsDirty(dirty);
    setIsDirty(dirty);
  };

  const saveData = () => {
    buttonSubmit.current.blur();
    let dataupdate = {};
    const newIps = [];
    ipAddresses &&
      ipAddresses.forEach(e => {
        newIps.push({ ...e, ipAddress: e.ipAddress.trim() });
      });
    switch (systemTabs) {
      case SYSTEM_TAB.TAB_IP:
        props.updateIpAddresses(newIps, ipAddressesDel);
        break;
      case SYSTEM_TAB.TAB_SAML:
        dataupdate = _.cloneDeep(saml ? saml : {});
        dataupdate['referenceValue'] = dataupdate['referenceValue'] ? dataupdate['referenceValue'].trim() : dataupdate['referenceValue'];
        dataupdate['providerName'] = dataupdate['providerName'] ? dataupdate['providerName'].trim() : dataupdate['providerName'];
        props.updateAuthenticationSAML(dataupdate, samlFile);
        break;
      case SYSTEM_TAB.TAB_PERIOD:
        props.updatePeriod(period);
        break;
      case SYSTEM_TAB.TAB_TIME:
        if (!_.isEmpty(generalSetting)) {
          setIsError(false);
          props.updateGeneral(generalSetting);
          console.log(generalSetting);

        } else {
          setIsError(true);
          props.setIsDirty(true);
        }
        break;
      case SYSTEM_TAB.TAB_API:
        if (!_.isEmpty(urlAPI)) {
          console.log(urlAPI);
        } else {
          props.setIsDirty(true);
        }
        break;
      default:
        break;
    }
  };
  const setDirtyAdd = isCheck => {
    setIsDirty(isCheck);
  };

  const dirtyCheck = async callback => {
    if (isDirty) {
      const action = () => {
        setDirtyReload(!dirtyReload);
        setIsDirty(false);
        props.setIsDirty(false);
      };
      await DialogDirtyCheckRestart({
        onLeave: () => action()
      });
    }
  };

  const backDefauldReload = () => {
    setDirtyReload(false);
  };

  const cancel = async () => {
    buttonCance.current.blur();
    switch (systemTabs) {
      case SYSTEM_TAB.TAB_IP:
      case SYSTEM_TAB.TAB_SAML:
      case SYSTEM_TAB.TAB_PERIOD:
        await dirtyCheck(null);
        break;
      case SYSTEM_TAB.TAB_TIME:
        await dirtyCheck(null);
        setIsError(false);
        break;
      default:
        break;
    }
  };

  const changeSamlFileData = data => {
    setSamlFile(data ? [data] : []);
  };

  const changeMenuTabs = menuType => {
    props.setIsDirty(false);
    setIsDirty(false);
    resetAll();
    setSystemTabs(menuType);
    if (menuType === 3) {
      setIsError(false);
    }
  };

  useEffect(() => {
    if (props.generalSuccess) {
      setShowMsgSucess(SHOW_MESSAGE.SUCCESS);
      setTimeout(() => {
        setShowMsgSucess(SHOW_MESSAGE.NONE);
      }, TIME_OUT_MESSAGE);
    }
  }, [props.generalSuccess]);

  useEffect(() => {
    if (props.ipAddressUpdateRes || props.periodUpdateSuccess || props.samlUpdateRes) {
      if (
        (props.ipAddressUpdateRes && !props.ipAddressUpdateRes.errorCodeList) ||
        props.generalSuccess ||
        props.periodUpdateSuccess ||
        props.samlUpdateRes
      ) {
        setShowMsgSucess(SHOW_MESSAGE.SUCCESS);
        setIsDirty(false);
        props.setIsDirty(false);
      }
      setTimeout(() => {
        setShowMsgSucess(SHOW_MESSAGE.NONE);
      }, TIME_OUT_MESSAGE);
    }
  }, [props.ipAddressUpdateRes, props.generalSuccess, props.periodUpdateSuccess, props.samlUpdateRes]);

  /**
   * Get success message from IpAddresses component
   * @param flg
   */
  const handleMsgIpAddress = flg => {
    setShowMsgSucess(flg);
  };

  /**
   * Render message from IpAddresses component
   */
  const renderMessage = () => {
    return <BoxMessage messageType={MessageType.Success} message={translate('messages.INF_COM_0008')} className="message-area-bottom" />;
  };

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3">
          <div className="user-popup-form setting-popup-wrap h-100 position-relative">
            <div className="setting-popup-left">
              <div className="wrap-control-esr">
                <div className="esr-content">
                  <div className="esr-content-sidebar no-background">
                    <div className="esr-content-sidebar-outer">
                      <div className="esr-content-sidebar-inner">
                        <div className="list-group" onClick={() => systemTabs !== SYSTEM_TAB.TAB_IP && changeMenuTabs(SYSTEM_TAB.TAB_IP)}>
                          <a className={systemTabs === SYSTEM_TAB.TAB_IP ? 'active' : ''}>{translate('setting.system.nav.ipAddress')}</a>
                        </div>
                        <div
                          className="list-group"
                          onClick={() => systemTabs !== SYSTEM_TAB.TAB_SAML && changeMenuTabs(SYSTEM_TAB.TAB_SAML)}
                        >
                          <a className={systemTabs === SYSTEM_TAB.TAB_SAML ? 'active' : ''}>{translate('setting.system.nav.saml')}</a>
                        </div>
                        <div className="list-group" onClick={() => systemTabs !== SYSTEM_TAB.TAB_LOG && changeMenuTabs(SYSTEM_TAB.TAB_LOG)}>
                          <a className={systemTabs === SYSTEM_TAB.TAB_LOG ? 'active' : ''}>{translate('setting.system.nav.history')}</a>
                        </div>
                        <div
                          className="list-group"
                          onClick={() => systemTabs !== SYSTEM_TAB.TAB_PERIOD && changeMenuTabs(SYSTEM_TAB.TAB_PERIOD)}
                        >
                          <a className={systemTabs === SYSTEM_TAB.TAB_PERIOD ? 'active' : ''}>{translate('setting.system.nav.period')}</a>
                        </div>
                        <div
                          className="list-group"
                          onClick={() => systemTabs !== SYSTEM_TAB.TAB_TIME && changeMenuTabs(SYSTEM_TAB.TAB_TIME)}
                        >
                          <a className={systemTabs === SYSTEM_TAB.TAB_TIME ? 'active' : ''}>{translate('setting.system.nav.general')}</a>
                        </div>
                        <div className="list-group" onClick={() => systemTabs !== SYSTEM_TAB.TAB_API && changeMenuTabs(SYSTEM_TAB.TAB_API)}>
                          <a className={systemTabs === SYSTEM_TAB.TAB_API ? 'active' : ''}>{translate('setting.system.nav.publicAPI')}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="setting-popup-content">
              {systemTabs === SYSTEM_TAB.TAB_IP && (
                <IpAddresses
                  resetAll={resetAll}
                  setIsDirty={props.setIsDirty}
                  changeIpAddresses={changeIpAddresses}
                  initIpAddrData={initIpAddrData}
                  dirtyReload={dirtyReload}
                  showMsgIpAddress={handleMsgIpAddress}
                  setDirtyAdd={setDirtyAdd}
                />
              )}

              {systemTabs === SYSTEM_TAB.TAB_SAML && (
                <SAML
                  changeSamlData={changeSamlData}
                  initSamlData={initSamlData}
                  changeSamlFileData={changeSamlFileData}
                  dirtyReroad={dirtyReload}
                />
              )}

              {systemTabs === SYSTEM_TAB.TAB_PERIOD && (
                <Period
                  changePeriod={changePeriod}
                  initPeriodData={initPeriodData}
                  dirtyReload={dirtyReload}
                  setDirtyReload={backDefauldReload}
                />
              )}

              {systemTabs === SYSTEM_TAB.TAB_TIME && (
                <General
                  changeTimeEdit={changeGeneralSetting}
                  initGeneralSetting={initGeneralSetting}
                  dirtyReload={dirtyReload}
                  errorInfo={isError}
                />
              )}

              {systemTabs === SYSTEM_TAB.TAB_LOG && <LogAccessses />}

              {systemTabs === SYSTEM_TAB.TAB_API && (
                <PublicAPI changeUrlAPI={changeUrlAPI} initUrlAPIDate={initUrlAPI} dirtyReload={dirtyReload} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom">
        {showMsgSucess === SHOW_MESSAGE.SUCCESS && renderMessage()}
        {showMsgSucess === SHOW_MESSAGE.NONE && (
          <>
            {systemTabs !== SYSTEM_TAB.TAB_API && (
              <button ref={buttonCance} type="button" className="btn-button button-primary" onClick={cancel}>
                {translate('setting.button.cancel')}
              </button>
            )}
            <button
              ref={buttonSubmit}
              type="button"
              className="button-blue button-form-register"
              disabled={props.periodLoading}
              onClick={saveData}
            >
              {systemTabs === SYSTEM_TAB.TAB_API ? translate('setting.button.saveAPI') : translate('setting.button.save')}
            </button>
          </>
        )}
      </div>
    </>
  );
};

const mapStateToProps = ({ general, ipAddress, period, saml }: IRootState) => ({
  periodLoading: period.loading,
  generalSuccess: general.generalSettingId,
  ipAddressUpdateRes: ipAddress.ipAddressUpdateRes,
  periodUpdateSuccess: period.periodUpdateSuccess,
  samlUpdateRes: saml.samlUpdateRes
});

const mapDispatchToProps = {
  updateIpAddresses,
  reloadDrityCheck,
  updateAuthenticationSAML,
  updatePeriod,
  getPeriod,
  updateGeneral,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(System);
