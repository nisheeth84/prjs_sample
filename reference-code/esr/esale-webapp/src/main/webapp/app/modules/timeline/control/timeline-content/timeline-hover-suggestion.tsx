import React from 'react'
import { connect } from 'react-redux'

type ITimelineHoverSuggestionProp =  StateProps & DispatchProps & {
  data?: any;
  deleteTarget?: () => void;
  isCommonModes?: boolean;
}

const TimelineHoverSuggestion = (props: ITimelineHoverSuggestionProp) => {

  // hover
  // const renderToolTip = (item) => {
    // if(item.targetType !== TARGET_TYPE.ALL && hover) {
    //   return (
    //     <div className="drop-down h-auto w100">
    //       <ul className="dropdown-item">
    //         <li className="item smooth">
    //           <div className="item2">
    //             {item.targetAvartar ?
    //               <div className="name"><img src={item.targetAvartar} alt="" title="" /></div>
    //               : <div className={"name " + item.targetAvartarRandom}>{CommonUtil.getFirstCharacter(item.targetName)}</div>}
    //             <div className="content">
    //               <div className="text text1 text-blue font-size-12">{item.targetNameUp}</div>
    //               <div className="text text2 text-blue">{item.targetNameDown}</div>
    //             </div>
    //           </div>
    //         </li>
    //       </ul>
    //     </div>
    //   );
    // }  else {
    // return <></>
    // }
  // }

return <>
    <div className={`tag mr-b-5 mb-1 ${props.isCommonModes ? 'w48' : ''}`}>
      <div className="mission-wrap">
        <div className="item">
          <span className="font-size-12 text-ellipsis timeline-hover-suggestion">{props.data.targetName}</span>
        </div>
      </div>
      <button type="button" onClick={() => { if(props.deleteTarget) props.deleteTarget() }} className="close">×</button>
    </div>
    {/* {renderToolTip(props.data)} */}
</>;}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
mapStateToProps,
mapDispatchToProps
)(TimelineHoverSuggestion);
