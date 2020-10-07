import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import ReactionPopup from './reaction-popup';
import { handleGetFullListReaction, handleGetRecentlyListReaction} from './timeline-reaction-reducer'
import { handleSetIsScrolling } from '../../timeline-common-reducer';
import { ReactionsType } from '../../models/get-user-timelines-type';
import { PositionScreen } from '../../models/suggest-timeline-group-name-model';
import { IRootState } from 'app/shared/reducers';

type IReactionPicker = StateProps & DispatchProps & {
  reactionsSelecteds?: Map<string, ReactionsType[]>;
  objectId: number,
  rootId: number,
  isCommonMode?: boolean
}

const ReactionPicker = (props: IReactionPicker) => {

  const [showReactionPopup, setShowReactionPopup] = useState(false);
  const wrapperRef = useRef(null);
  const [position, setPosition] = useState<PositionScreen>(null);
  const [isLocation, setIsLocation] = useState(false)

  /**
   * get position to show pulldown when click
   */
  const onMouseEnter = () => {
    const _top = wrapperRef.current.getBoundingClientRect().bottom;
    const space = window.innerHeight - _top;
    if(space < 270) {
      setIsLocation(!isLocation);
    }
    if(props.isCommonMode) {
      if(space >= 270) {
        setPosition({top: _top - 100, left: wrapperRef.current.getBoundingClientRect().right});
      } else {
        setPosition({top: _top - 300, left: wrapperRef.current.getBoundingClientRect().right});
      }
    }
  }

  /**
   * listen close pulldown when scroll for timeline common
   * @param e
   */
  useEffect(()=> {
    if(props.isScrolling && props.isCommonMode){
      setShowReactionPopup(false);
    }
  }, [props.isScrolling])

  const handleClickShowReactionPopup = () => {
    setShowReactionPopup(!showReactionPopup);
    onMouseEnter();
    if(props.isCommonMode){
      props.handleSetIsScrolling(false);
    }
  }

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowReactionPopup(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);
    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  }, []);

  // load mac dinh danh sach reaction
  // useEffect(() => {
  //   props.handleGetFullListReaction();
  // }, [])

  return (
    <>
      <span className="position-relative" ref={wrapperRef}>
        <a className={"icon-small-primary icon-face-smile" + (showReactionPopup ? " active unset-bg-color " : "")} onClick={() => {handleClickShowReactionPopup();}}></a>
        {showReactionPopup && <ReactionPopup isCommonMode={props.isCommonMode} position={position} objectId={props.objectId} rootId={props.rootId} callBackAffterChoose={()=> {setTimeout(()=>setShowReactionPopup(false), 500)}}/>}
      </span>
    </>
  )
}

const mapStateToProps = ({timelineCommonReducerState }: IRootState) => ({
  isScrolling: timelineCommonReducerState.isScrolling
});

const mapDispatchToProps = {
  handleGetFullListReaction,
  handleGetRecentlyListReaction,
  handleSetIsScrolling
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReactionPicker);
