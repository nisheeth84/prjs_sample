import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef } from 'react';
import { connect, Options } from 'react-redux';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import {
  reset,
  handleGetData,
  handleChangeData,
  handleDelete
} from './scenarios.reducer';
import ScenariosList from './scenarios-list';
import ScenariosAdd from './scenarios-add';
import { TYPEMASTER, MODE_POPUP, SHOW_MESSAGE } from 'app/modules/setting/constant';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { isNullOrUndefined } from 'util';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';

export interface IMasterStateScenarios  {
  scenarios;
  isChangeSuccess;
  errorMessage;
  scenario;
}

export interface IMasterDispatchScenarios  {
  reset;
  handleGetData;
  handleChangeData;
  handleDelete
}

export interface IMasterDynamicScenarios  {
  screenName? : string;
  isSave? : boolean;
  showbtb? : any
  backAction? : any;
  validateCanel?: any;
  toggleBtnActive? : any;
  setIsDirty? : any;
  renderBoxMessage? : any,
}

type IMasterScenarios = IMasterStateScenarios & IMasterDispatchScenarios & IMasterDynamicScenarios;


export const MasterScenarios : React.FC<IMasterScenarios> = forwardRef((props, ref) => {

  const [toggleAddScenarion, setToggleAddScenario] = useState(true);
  const [modeMasterScenario, setModeMasterScenario] = useState(null);
  const [masterScenarioId, setMasterScenarioId] = useState(null);
  const [listScenarios, setListScenarios] = useState([])
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);

  const scenariosAddRef = useRef(null);

  const { scenarios } = props

  useImperativeHandle(ref, () => ({
    async cancel() {
      if (!scenariosAddRef || !scenariosAddRef.current) {
        return;
      }
      await scenariosAddRef.current.cancel();
    }
  }));

  useEffect(() => {
    props.handleGetData(TYPEMASTER.LIST);
  }, []);

  useEffect(() => {
    if (props.isChangeSuccess !== null) {
      setToggleAddScenario(true)
      props.showbtb(3)
      props.backAction()
      setCodeMessage(props.isChangeSuccess ? SHOW_MESSAGE.SUCCESS : SHOW_MESSAGE.ERROR);
    }
    props.reset();
    props.handleGetData(TYPEMASTER.LIST);
  }, [props.isChangeSuccess]);

  useEffect(() => {
    if (!props.toggleBtnActive) {
      setToggleAddScenario(true)
    }
  }, [props.toggleBtnActive]);

  useEffect(() => {
    if (scenarios) {
      setListScenarios(scenarios);
    }
  }, [scenarios]);

  const handleAddScenarios = () => {
    setModeMasterScenario(MODE_POPUP.CREATE)
    setToggleAddScenario(false);
    props.showbtb(3, 1)
  }

  const handelEditScenarios = (item) => {
    setMasterScenarioId(item.scenarioId)
    setModeMasterScenario(MODE_POPUP.EDIT);
    setToggleAddScenario(false);
    props.showbtb(3, 2);
  }

  const masterScenarioDelete = (id) => {
    props.setIsDirty(true);
    props.handleDelete(id)
  }

  const masterScenarioChange = (item, initItem) => {
    const initScenario = _.cloneDeep(initItem);
    initScenario.scenarioName = JSON.parse(initScenario.scenarioName)
    initScenario.scenarioName = JSON.stringify(initScenario.scenarioName);

    const isDirty = !_.isEqual(item, initScenario);
    props.setIsDirty(isDirty);
  }

  const getErrorMessage = errorCode => {
    return !isNullOrUndefined(errorCode) ? translate('messages.' + errorCode) : '';
  };

  const renderBoxMessage = (isSuccess: boolean, mesageCode: string) => {
    setTimeout(() => {
      setCodeMessage(SHOW_MESSAGE.NONE);
    }, TIMEOUT_TOAST_MESSAGE);

    return (
      <div className="setting-message-show">
        <BoxMessage messageType={isSuccess ? MessageType.Success : MessageType.Error} message={getErrorMessage(mesageCode)} />
      </div>
    );
  }

  const renderErrorMessage = () => {
    if (SHOW_MESSAGE.NONE === codeMessage) {
      return '';
    }
    const isSuccess = codeMessage === SHOW_MESSAGE.SUCCESS;
    const errorCode = isSuccess ? 'INF_COM_0008' : props.errorMessage && props.errorMessage['errorCode'];
    return renderBoxMessage(isSuccess, errorCode);
  };

  return (
    <>
      <div className="form-group h-100 mb-0">
        <label>{translate('setting.customer.scenarios.title')}</label>
        {
          toggleAddScenarion ?
            <ScenariosList
              screenName={props.screenName}
              scenariosList={listScenarios}
              scenariosRemove={masterScenarioDelete}
              scenariosAdd={handleAddScenarios}
              scenariosEdit={handelEditScenarios}
            />
            :
            <ScenariosAdd
              ref={scenariosAddRef}
              masterScenarioId={masterScenarioId}
              modeMasterScenario={modeMasterScenario}
              scenariosChange={masterScenarioChange}
              isSave={props.isSave}
            />
        }
      </div>
    </>
  )
});

const mapStateToProps = ({ scenarioSetting }: IRootState) => ({
  scenarios: scenarioSetting.scenarios,
  isChangeSuccess: scenarioSetting.isChangeSuccess,
  errorMessage: scenarioSetting.errorMessage,
  scenario: scenarioSetting.scenario,
});

const mapDispatchToProps = {
  reset,
  handleGetData,
  handleChangeData,
  handleDelete
};

const options = { forwardRef: true }
export default connect<IMasterStateScenarios , IMasterDispatchScenarios, IMasterDynamicScenarios>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(MasterScenarios);