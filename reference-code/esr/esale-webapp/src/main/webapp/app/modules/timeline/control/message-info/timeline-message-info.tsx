import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { IRootState } from 'app/shared/reducers';
import {
  handleResetMessageInfo, TimelineAction
 } from '../../timeline-reducer'


type ITimelineMessageInfoProp = StateProps & DispatchProps & {
  isModal: boolean
}

const TimelineMessageInfo = (props: ITimelineMessageInfoProp) => {

// message zone
const [msgInfoSuccess, setMsgInfoSuccess] = useState('');

/**
 * reset message
 */
useEffect(() => {
  props.handleResetMessageInfo();
  return () => props.handleResetMessageInfo();
}, [])

  /**
   * Listen messageInfo to alert
   */
  useEffect(() => {
    if (props.messageInfo && props.isModal === props.isModalMode && props.action) {
      setMsgInfoSuccess(props.messageInfo)
    }
  }, [props.messageInfo])

const renderCodeMessage = () => {
  const typeErrorCode = props.errorCode  ? props.errorCode.split('_')[0] : '';
  let className;
  switch(typeErrorCode) {
    case 'ERR':
      className = "block-feedback-pink";
      break;
    case 'WAR':
      className = "block-feedback-yellow";
      break;
    case 'INF':
      className = "block-feedback-blue";
      break;
    case 'INFO':
      className = "block-feedback-blue";
      break;
    default:
      className = "block-feedback-pink";
      break;
  }
  if(msgInfoSuccess && props.action === TimelineAction.ERROR && props.isModal === props.isModalMode) {
    return (
      <div className={`block-feedback ${className}`}>
        <BoxMessage styleClassMessage = " " messageType={MessageType.Error}
          message={msgInfoSuccess}/>
    </div>
    )
  }
}

return (
<>
  {renderCodeMessage()}
</>
)
}

const mapStateToProps = ({timelineReducerState }: IRootState) => ({
  messageInfo: timelineReducerState.messageInfo,
  action: timelineReducerState.action,
  isModalMode: timelineReducerState.isModalMode,
  errorCode: timelineReducerState.errorCode
});

const mapDispatchToProps = {
  handleResetMessageInfo
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(TimelineMessageInfo);
