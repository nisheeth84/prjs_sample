import React from 'react';
import { connect } from 'react-redux';
import { handleGetScenario } from '../create-edit-customer.reducer';
import styled from 'styled-components';
import _ from 'lodash';
import MilestoneCard from './milestone-card';
import { IRootState } from 'app/shared/reducers';

export interface IMilestoneListProps extends StateProps, DispatchProps {
  milestoneList: any;
  deleteMilestone;
  createTask?: any;
  onDeleteItem?: any
  onUpdate?: any
  onEditTask?: any
  customerId?: number
  viewOnly?: boolean
  errorItems?: any
  fromActivity?: boolean
}

/**
 * List milestone on screen
 * @param props
 */
const MilestoneList = (props: IMilestoneListProps) => {
  const { milestoneList } = props;

  return (
    <div className="time-line-customer mb-3">
      {milestoneList &&
        milestoneList.map((milestone, index) => {
          if((milestone && milestone.flagDelete) || (milestone && milestone.flagHiden)){
            return <></>;
          }
          return <MilestoneCard
            key={milestone.milestoneId}
            status={milestone.statusMilestoneId}
            deleteMilestone={props.deleteMilestone}
            milestone={milestone}
            createTask={props.createTask}
            milestoneIndex={index}
            onDeleteItem={props.onDeleteItem}
            onUpdate={props.onUpdate}
            onEditTask={props.onEditTask}
            customerId={props.customerId}
            viewOnly={props.viewOnly}
            errorItems={props.errorItems}
            fromActivity={props.fromActivity}
          />
        })}
    </div>
  );
};

const mapStateToProps = ({ customerInfo }: IRootState, ownProps: any) => ({
  scenarioData: customerInfo.data.has(ownProps.id) ? customerInfo.data.get(ownProps.id).scenarioData : {}
});

const mapDispatchToProps = {
  handleGetScenario
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MilestoneList);
