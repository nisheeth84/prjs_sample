import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

import { translate } from 'react-jhipster';
import { connect, Options } from 'react-redux';
import { reset, handleGetData, handleChangeData } from './scenarios.reducer';
import { MODE_POPUP, TYPEMASTER, DEFAULT_LANG_STATE, LANGUAGES, MAX_INPUT_LENGTH_2, MAX_INPUT_LENGTH, DEFAULT_LANG_VALID_STATE } from 'app/modules/setting/constant';
import { IRootState } from 'app/shared/reducers';
import _ from 'lodash';
import styled from 'styled-components';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import ListMilestones from './scenarios-list-item/list-scenarios';
import { getJsonBName, convertHTMLEncString } from 'app/modules/setting/utils';
import { revertHTMLString } from 'app/modules/products/utils';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import system from '../../system/system';

export interface IStateScenarios {
  scenario?: any;
}

export interface IDispatchScenarios {
  reset?: any;
  handleGetData?: any;
  handleChangeData?: any;
}
export interface IDynamicScenarios {
  modeMasterScenario?: any
  scenariosItem?: any
  scenariosChange: any
  masterScenarioId?: any
  displayOrder?: any
  isSave?: any
  setHasError?: any
}

type IScenarios = IStateScenarios & IDispatchScenarios & IDynamicScenarios;

const CustomDiv = styled.div`
  padding-left: 0px !important;
`;

export const ScenariosAdd: React.FC<IScenarios> = forwardRef((props: IScenarios, ref) => {

  const [isFirstTimeLoad, setIsFirstTimeLoad] = useState(true);
  const tableRef = useRef(null)
  const [langsMore, setLangsMore] = useState(false);
  const [masterScenarioItem, setMasterScenarioItem] = useState({});
  const [masterScenarioItemInit, setMasterScenarioItemInit] = useState({});
  const [validScenarios, setValidScenarios] = useState({});

  const [langs, setLangs] = useState(DEFAULT_LANG_STATE);
  const [validLangs, setValidLangs] = useState(DEFAULT_LANG_VALID_STATE);
  const [isAllEmpty, setIsAllEmpty] = useState(false);

  const buttonAddMore = useRef(null);
  const buttonToggle = useRef(null);

  const checkIsValueInvalidLength = (value, allowedLength) => value && value.trim().length >= allowedLength;

  const resetError = () => {
    setValidLangs(DEFAULT_LANG_VALID_STATE);
    setIsAllEmpty(false);
    setLangsMore(false);
  };

  const setInitialData = () => {
    resetError();

    const defaultItem = {
      'scenarioName': JSON.stringify(DEFAULT_LANG_STATE),
      'milestones': [{ milestoneName: '', displayOrder: 1 }]
    };

    const scenario = _.cloneDeep(props.scenario ? props.scenario : defaultItem);
    scenario.scenarioName = JSON.parse(scenario.scenarioName);

    setMasterScenarioItem(scenario);
    setLangs({ ...scenario.scenarioName });

    // set initial scenario
    setMasterScenarioItemInit({
      ...scenario,
      scenarioName: JSON.stringify(scenario.scenarioName),
    });
  };

  useImperativeHandle(ref, () => ({
    async cancel() {
      if (!_.isEqual(masterScenarioItemInit, masterScenarioItem)) {
        await DialogDirtyCheckRestart({ onLeave: setInitialData });
      }
    }
  }));

  const handleChangeLangs = keyMap => event => {
    let lang = {};

    setLangs(lang = { ...langs, [keyMap]: event.target.value })

    // reset error when change input
    setValidLangs({
      ...validLangs,
      [keyMap]: null,
    });
    setIsAllEmpty(false);

    const items = _.cloneDeep(masterScenarioItem)
    items['scenarioName'] = JSON.stringify({
      ...lang,
      [LANGUAGES.JA_JP]: lang[LANGUAGES.JA_JP].trim(),
      [LANGUAGES.EN_US]: lang[LANGUAGES.EN_US].trim(),
      [LANGUAGES.ZH_CN]: lang[LANGUAGES.ZH_CN].trim()
    })
    setMasterScenarioItem(items);
    props.scenariosChange(items, masterScenarioItemInit);
  }

  const handleChangeMilestone = (event, index) => {
    const items = _.cloneDeep(masterScenarioItem)
    items['milestones'][index].milestoneName = event.target.value;

    // reset error
    validScenarios[index] = false;

    setMasterScenarioItem(items);
    props.scenariosChange(items, masterScenarioItemInit);
  }

  const handleDelMilestone = async (item) => {
    const deletedScenarios = []
    const listScenarios = _.cloneDeep(masterScenarioItem)
    const itemName = convertHTMLEncString(getJsonBName(item.milestoneName));
    const result = await ConfirmDialog({
      title: <>{translate('employees.top.dialog.title-delete-group')}</>,
      message: revertHTMLString(translate('messages.WAR_COM_0001', { itemName })),
      confirmText: translate('employees.top.dialog.confirm-delete-group'),
      confirmClass: 'button-red',
      cancelText: translate('employees.top.dialog.cancel-text'),
      cancelClass: 'button-cancel'
    });

    if (result) {
      const lstMilestones = _.reject(masterScenarioItem['milestones'], obj => {
        return item.scenarioDetailId > 0 ? obj.scenarioDetailId === item.scenarioDetailId : obj.displayOrder === item.displayOrder;
      });
      listScenarios['milestones'] = lstMilestones
      if(item.scenarioDetailId > 0){
        deletedScenarios.push(item.scenarioDetailId)
        listScenarios['deletedScenarios'] = deletedScenarios
      }
      setMasterScenarioItem(listScenarios);
    }
  }

  const addInput = () => {
    buttonAddMore.current.blur();
    const items = _.cloneDeep(masterScenarioItem)
    let order = 1
    for (let index = 0; index < items['milestones'].length; index++) {
      if (index !== items['milestones'].length - 1) {
        continue;
      }
      order = items['milestones'][index].displayOrder + 1;
    }
    const item = { milestoneName: "", displayOrder: order }

    items['milestones'].push(item)
    setMasterScenarioItem(items);
    props.scenariosChange(items, masterScenarioItemInit);
  }

  useEffect(() => {
    if (props.modeMasterScenario === MODE_POPUP.EDIT) {
      props.handleGetData(TYPEMASTER.OBJ, props.masterScenarioId)
    }
  }, [props.modeMasterScenario]);

  useEffect(() => {
    setInitialData();
  }, [props.scenario, props.scenariosItem]);

  const showMilestoneInput = (value, index, hasError) => {
    return (
      <div className="p-0">
        <div>
          <label> {translate('setting.customer.scenarios.tblCol3')} </label>
          <div className="delete-milestones">
            <span className="icon-small-primary icon-close-up-small line" onClick={() => handleDelMilestone(value)} />
          </div>
        </div>
        <div className={`form-group form-group2 common mb-0 mt-2`}>
          <input type="text" className={`input-normal placeholder-color ${hasError ? 'setting-input-valid' : ''}`} value={value.milestoneName}
            onChange={event => handleChangeMilestone(event, index)}
            placeholder={translate('setting.customer.scenarios.placeMilestoneName')}
          />
        </div>
      </div>
    )
  }

  const validatelangkey = () => {
    if (langs['ja_jp'].trim().length === 0 && langs['en_us'].trim().length === 0 && langs['zh_cn'].trim().length === 0) {
      return false
    }
    return true
  }

  const validateInputValues = () => {
    const validates = {};
    const langsKeys = Object.values(LANGUAGES);

    let isHavingError = false;
    let isAtLeastOneNotEmpty = false;

    // validate scenarios
    for (let i = 0; i < langsKeys.length; i++) {
      const k = langsKeys[i];

      // skip remaining languages if not toggle more langs
      if ((!langsMore && k !== LANGUAGES.JA_JP) || !validatelangkey()) {
        continue;
      }

      if (checkIsValueInvalidLength(langs[k], MAX_INPUT_LENGTH_2)) {
        validates[k] = 'ERR_COM_0025';
        if (!isHavingError) {
          isHavingError = true;
        }
      }

      if (!isAtLeastOneNotEmpty) {
        isAtLeastOneNotEmpty = true;
      }
    }

    // if all empty, then there is error
    if (!isAtLeastOneNotEmpty) {
      isHavingError = true;
    }

    // validate milestones name
    const validItems = validScenarios ? _.cloneDeep(validScenarios) : {};
    const milestones = masterScenarioItem['milestones'];

    for (let i = 0; i < milestones.length; i++) {
      if (checkIsValueInvalidLength(milestones[i].milestoneName, MAX_INPUT_LENGTH)) {
        isHavingError = true;
        break;
      }
    }

    setIsAllEmpty(!isAtLeastOneNotEmpty);

    setValidScenarios({
      ...validItems
    })

    setValidLangs({
      ...validates
    });
    return isHavingError;
  }
  const setMilestones = (milestones) => {
    for (let index = 0; index < milestones.length; index++) {
      milestones[index].displayOrder = index + 1
    }
    const scenarioItem = _.cloneDeep(masterScenarioItem)
    scenarioItem['milestones'] = milestones
    setMasterScenarioItem(scenarioItem)

  }

  useEffect(() => {
    // not trigger validation for first time loading
    if (isFirstTimeLoad) {
      setIsFirstTimeLoad(false);
      return;
    }

    // not submit if there is error occurs
    const isHavingError = validateInputValues();

    if (isHavingError || !masterScenarioItem['scenarioName']) {
      return;
    }
    const dataUpdate = _.cloneDeep(masterScenarioItem)


    // trim milestoneName
    const lstmilestones = _.map(masterScenarioItem['milestones'], obj => {
      const trimdata = obj
      trimdata.milestoneName = obj.milestoneName.trim()
      obj = _.clone(trimdata);
      return obj;
    });

    dataUpdate['milestones'] = lstmilestones

    props.handleChangeData(masterScenarioItem, props.modeMasterScenario === MODE_POPUP.CREATE);
  }, [props.isSave]);

  return (

    <>
      <CustomDiv className="form-group col7 p-4" >
        <div >
          <label className="title mt-2 font-size-14 fs-14">
            {translate('setting.customer.scenarios.tblCol2')}
            <span className="label-red ml-3">{translate('setting.customer.scenarios.required')}</span>
          </label>
        </div>
        <div className="d-flex font-size-12">
          <input type="text" className={`input-normal col-7 placeholder-color mt-2 w100 ${validLangs[LANGUAGES.JA_JP] || isAllEmpty ? 'setting-input-valid' : ''}`
          }
            value={langs[LANGUAGES.JA_JP]} onChange={handleChangeLangs(LANGUAGES.JA_JP)}
            placeholder={translate('setting.sales.productTrade.add.placeholderNewStandard')}
          />
          {langsMore && <label className="text-input">{translate('setting.lang.jaJp')}</label>}
        </div>
        {
          validLangs[LANGUAGES.JA_JP] && <p className="mb-0 mt-2 setting-input-valis-msg w-100">
            {translate(`messages.${validLangs[LANGUAGES.JA_JP]}`, { 0: MAX_INPUT_LENGTH_2 })}
          </p>
        }
        {
          isAllEmpty && !langsMore && <p className="mb-0 mt-2 setting-input-valis-msg w-100">
            {langsMore ? translate('setting.employee.employeePosition.toggleOtherLanguages') : translate(`messages.ERR_COM_0013`)}
          </p>
        }
        {
          langsMore &&
          (
            <>
              <div className="d-flex font-size-12">
                <input type="text" className={`input-normal col-7 placeholder-color mt-2 w100 ${validLangs[LANGUAGES.EN_US] || isAllEmpty ? 'setting-input-valid' : ''}`}
                  value={langs[LANGUAGES.EN_US]} onChange={handleChangeLangs(LANGUAGES.EN_US)}
                  placeholder={translate('setting.sales.productTrade.add.placeholderNewStandard')}
                />
                <label className="text-input">{translate('setting.lang.enUs')}</label>
              </div>
              {
                validLangs[LANGUAGES.EN_US] && <p className="mb-0 mt-2 setting-input-valis-msg w-100">
                  {translate(`messages.${validLangs[LANGUAGES.EN_US]}`, { 0: MAX_INPUT_LENGTH_2 })}
                </p>
              }

              <div className="d-flex font-size-12">
                <input type="text" className={`input-normal col-7 placeholder-color mt-2 w100 ${validLangs[LANGUAGES.ZH_CN] || isAllEmpty ? 'setting-input-valid' : ''}`}
                  value={langs[LANGUAGES.ZH_CN]} onChange={handleChangeLangs(LANGUAGES.ZH_CN)}
                  placeholder={translate('setting.sales.productTrade.add.placeholderNewStandard')}
                />
                <label className="text-input">{translate('setting.lang.zhCn')}</label>
              </div>
              {
                validLangs[LANGUAGES.ZH_CN] && <p className="mb-0 mt-2 setting-input-valis-msg w-100">
                  {translate(`messages.${validLangs[LANGUAGES.ZH_CN]}`, { 0: MAX_INPUT_LENGTH_2 })}
                </p>
              }
              {
                isAllEmpty && <p className="mb-0 mt-2 setting-input-valis-msg w-100">
                  {translate(`messages.ERR_COM_0013`)}
                </p>
              }
            </>
          )
        }

        <button ref={buttonToggle} className="button-primary btn-padding col-7 mt-2 text-center d-block" onClick={() => { buttonToggle.current.blur(); setLangsMore(!langsMore) }}>
          {!langsMore ? translate('setting.sales.productTrade.add.langMore') : translate('setting.sales.productTrade.add.langLess')}
        </button>

        <div className="break-line form-group common mt-3 mb-0" ref={tableRef}>
          {masterScenarioItem['milestones'] &&
            <ListMilestones
              lisMilestones={masterScenarioItem['milestones']}
              setMilestones={setMilestones}
              tableRef={tableRef}
              showMilestoneInput={showMilestoneInput}
              validScenarios={validScenarios}
            />
          }
        </div>

        <div>
          <button ref={buttonAddMore} className="button-primary btn-padding" onClick={addInput}>
            {translate('setting.customer.scenarios.btnAdd')}
          </button>
        </div>

      </CustomDiv>
    </>
  );
});

const mapStateToProps = ({ scenarioSetting }: IRootState) => ({
  scenario: scenarioSetting.scenario
});

const mapDispatchToProps = {
  reset,
  handleGetData,
  handleChangeData
};

const options = { forwardRef: true }
export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(ScenariosAdd);