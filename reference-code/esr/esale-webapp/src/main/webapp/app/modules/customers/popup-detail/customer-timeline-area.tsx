import React, { useState, useCallback, useEffect, useRef } from 'react';
import TimelineCommonControl from 'app/modules/timeline/timeline-common-control/timeline-common-control';
import _ from 'lodash';
import { ConditionRange } from 'app/shared/layout/popup-detail-service-tabs/constants';


export interface ICustomerTimelineAreaProps {
  tenant?: any,
  serviceType: number,
  objectId: number,
  onShowTimeline: () => void,
  isScreenDisplay?: any,
  isDataChange?: (isChange: boolean) => void;
  childCustomer: number[];
  hasLoginUser: boolean;
  scopeCondition?: any;
  rangeCondition?: any;
}

const CustomerTimelineArea = (props: ICustomerTimelineAreaProps) => {
  const [isShowTimeline, setShowTimeline] = useState(true);
  const [timelineConditionsHaveChild, setTimelineConditionsHaveChild] = useState([{ targetType: 5, targetId: props.childCustomer }]);
  const [timelineConditionsOnlyCustomer] = useState([{ targetType: 5, targetId: []}]);

  useEffect(() => {
    setTimelineConditionsHaveChild([{ targetType: 5, targetId: props.childCustomer }])
  }, [props.childCustomer]);

  const timeline = useCallback(() => {
    if (props.rangeCondition !== null) {
      return (<>
        <TimelineCommonControl 
          hasLoginUser={props.hasLoginUser}
          targetDeliversForSearch={props.rangeCondition === ConditionRange.ThisAndChildren 
            ? timelineConditionsHaveChild : timelineConditionsOnlyCustomer}
          isDataChange={props.isDataChange} 
          objectId={[props.objectId]} 
          serviceType={props.serviceType} />
      </>)
    }
  }, [props.objectId, props.serviceType, props.scopeCondition, props.rangeCondition]);

  return (
    <>
      {props.isScreenDisplay &&
        <div className="popup-content-common-right background-col-F9 v2 wrap-timeline">
          <div className="button">
            <a className={`icon-small-primary ${isShowTimeline ? 'icon-next' : 'icon-prev'}`}
              onClick={() => { setShowTimeline(!isShowTimeline); props.onShowTimeline() }}
            />
          </div>
          {timeline()}
        </div>
      }
    </>
  )
}
export default CustomerTimelineArea;