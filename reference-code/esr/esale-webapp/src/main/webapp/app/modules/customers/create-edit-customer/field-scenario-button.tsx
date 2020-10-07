import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useId } from "react-id-generator";
// import { EMPLOYEE_SPECIAL_FIELD_NAMES as specialFName } from '../constants';
import { translate } from 'react-jhipster';
import ScenarioPopup from './popup/scenario-popup';

export const defaultEmployeeDepartments = {
  businessMainId: null,
  businessSubId: null
};

export interface IFieldScenarioButtonProps {
  fieldLabel?: string
  key?: number
  isDisabled?: boolean
  updateStateField?: (itemData, type, itemEditValue) => void
  initData?: any,
  showScenarioPopup : boolean
}

/**
 * Using for scenario button
 * @param props
 */
const FieldScenarioButton = (props) => {
  const [showScenarioPopup, setShowScenarioPopup] = useState(props.showScenarioPopup);
  const activityEditCtrlId = useId(1, "scenarioButtonActivityEditCtrlId_");

  const onCloseScenarioPopup = () => {
    setShowScenarioPopup(false);
  }

  useEffect(() => {
    if(props.showScenarioPopup){
      setShowScenarioPopup(props.showScenarioPopup);
    }
  },[props.showScenarioPopup])

  return (
    <>
      <div className="col-lg-6 form-group break-line">
      <label>{translate('customers.scenario-popup.title-scenario')}</label>
      <a className="button-add-department-post-name no-margin" onClick={() => setShowScenarioPopup(true)}>{translate('customers.scenario-popup.field-scenario')}</a>
      </div>
      {showScenarioPopup &&
        <ScenarioPopup id={activityEditCtrlId[0]} closeScenarioPopup={onCloseScenarioPopup} initData={props.initData} />}
    </>
  )
}

export default FieldScenarioButton