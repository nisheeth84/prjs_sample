import React, { useState, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { useId } from "react-id-generator";
import { handleGetScenario } from '../list/activity-list-reducer';
import DetailMilestoneModal from 'app/modules/tasks/milestone/detail/detail-milestone-modal';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import { TYPE_DETAIL_MODAL } from '../constants';
import DetailTaskModal from "app/modules/tasks/detail/detail-task-modal";
import { translate } from 'react-jhipster';
import ScenarioPopup from 'app/modules/customers/create-edit-customer/popup/scenario-popup';
import _ from 'lodash';
import MilestoneList from 'app/modules/customers/create-edit-customer/popup/milestone-list';

type IScenarioAreaProp = StateProps & DispatchProps & {
  customerId: number,
  data?: any
}

/**
 * 
 * @param props component for show scenario
 */
const ScenarioArea = (props: IScenarioAreaProp) => {
  const [showMilestoneDetails, setShowMilestoneDetails] = useState(false);
  const [milestoneId, setMilestoneId] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [taskId, setTaskId] = useState(null);
  const [scenario, setScenario] = useState(props.data);
  const [showScenarioPopup, setShowScenarioPopup] = useState(false);
  let isFirstLoad = true;
  const activityEditCtrlId = useId(1, "scenarioAreaActivityEditCtrlId_");

  useEffect(() => {
    if (props.customerId && isFirstLoad ) {
      props.handleGetScenario(props.customerId);
    } else {
      isFirstLoad = false;
    }
  }, [props.customerId])

  useEffect(() => {
    setScenario(props.scenario);
  }, [props.scenario])

  useEffect(() => {
    setScenario(props.data);
  }, [props.data])

  /**
   * check and render modal milestone detail
   */
  const renderModalMilestoneDetail = () => {
    if (showMilestoneDetails) {
      return <DetailMilestoneModal
        milestoneId={milestoneId}
        toggleCloseModalMilesDetail={setShowMilestoneDetails}
        milesActionType={MILES_ACTION_TYPES.UPDATE}
      />
    }
  }

  /**
   * check render modal task detail
   */
  const renderModalTaskDetail = () => {
    if (showTaskDetails) {
      return <DetailTaskModal
        taskId={taskId}
        toggleCloseModalTaskDetail={setShowTaskDetails} />
    }
  }

  const showDetail = (objectId, type) => {
    switch (type) {
      case TYPE_DETAIL_MODAL.MILESTONE:
        setMilestoneId(objectId);
        setShowMilestoneDetails(true);
        break;
      case TYPE_DETAIL_MODAL.TASK:
        setTaskId(objectId);
        setShowTaskDetails(true);
        break;
      default:
        break;
    }
  }

  /**
   * onClickeditScenario
   */
  const onClickeditScenario = () =>{
    setShowScenarioPopup(true);
  }

  /**
   * onCloseScenarioPopup
   */
  const onCloseScenarioPopup = () => {
    setShowScenarioPopup(false);
    if (props.customerId) {
      props.handleGetScenario(props.customerId);
    }
  }

  return (
    <>
      { props.customerId > 0 && 
        <>
          <div className="col-lg-12 form-group">
            <div className="d-flex justify-content-between">
              <label >{translate('activity.modal.scenario')}</label>
              <button className="button-cancel" onClick={onClickeditScenario}>{translate('activity.modal.button-scenario')}</button>
            </div>
            <div className="time-line-customer time-line-customer-2 mb-3">
            {scenario?.milestones?.length > 0 && <MilestoneList 
              milestoneList={scenario?.milestones}
              deleteMilestone={() => { return }}
              fromActivity={true}
              viewOnly={true}
            />}
            </div>
          </div>
          <div className="wrap-calendar">
            {renderModalMilestoneDetail()}
            {renderModalTaskDetail()}
          </div>
        {showScenarioPopup &&
          <ScenarioPopup id={activityEditCtrlId[0]} closeScenarioPopup={onCloseScenarioPopup} initData={_.cloneDeep({ ...scenario, customerId: props.customerId })} fromActivity={true}/>}
        </>
      }
    </>
  );
}

const mapStateToProps = ({ activityListReducerState }: IRootState) => ({
  scenario: activityListReducerState.scenario
});

const mapDispatchToProps = {
  handleGetScenario
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScenarioArea);
