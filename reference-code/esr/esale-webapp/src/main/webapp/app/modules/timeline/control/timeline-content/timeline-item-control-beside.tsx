import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { TimelinesType } from '../../models/get-user-timelines-type';
import { toggleConfirmPopup, onclickDelete, handleInitTimelinesFavorite } from '../../timeline-reducer';
import { onclickDeleteExtTimeline } from '../../timeline-common-reducer';
import TimelineCreateQuote from './timeline-create-quote';
import ShareTimelineModal from '../button-footer/share-timeline-modal';
import { handleGetTimelineById } from '../../timeline-reducer';
import { handleShowDetail } from "app/modules/timeline/timeline-reducer";
import TimelineViewComment from './timeline-view-comment'
import TimelineFormControl from './timeline-form-control';
import { IRootState } from 'app/shared/reducers';
import TimelineMessageInfo from '../message-info/timeline-message-info';
import TimelineDetail from './timeline-detail';
import ReactionPicker from '../reaction/reaction-picker';
import { TargetDelivers } from '../../models/create-comment-and-reply-model';
import { translate } from 'react-jhipster';
import DialogDirtyCheckTimeline from '../../common/dialog-dirty-check-timeline';
import { MODE_CONTENT } from '../../common/constants';
import TimelineContentCommentAuto from './timeline-content-comment-auto';
/**
 *  component show item timeline in list timeline
 */

type ITimelineItemControlBesideProp = StateProps & DispatchProps & {
  // data
  data: TimelinesType;
  // check is last
  isLast?: boolean;
  // check member of group
  isNotMemberOfGroup?: boolean,
  // check group private
  isPrivateGroup?: boolean,
  // check isCommon
  isCommon?: boolean,
  // class set to bar
  classType: string
  // default Target Create Timeline for common
  defaultTargetCreateTimeline?: TargetDelivers
}

const TimelineItemControlBeside = (props: ITimelineItemControlBesideProp) => {
  const [isComment, setIsComment] = useState(null);
  const [isQuoteAll, setIsQuoteAll] = useState(null);
  const [isQuote, setIsQuote] = useState(null);
  const [isShare, setIsShare] = useState(null);
  const [isFavorite, setIsFavorite] = useState(props.data?.isFavorite);
  const [isDetail, setIsDetail] = useState(false);
  const [commentCreateData, setCommentCreateData] = useState({});
  const [showDataCreate, setShowDataCreate] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [dataTemp, setDataTemp] = useState(props.data)
  const [listDataComment, setListDataComment] = useState([]);
  const[commentDirtyCheck, setCommentDirtyCheck] = useState(null)
  const refContentAuto = useRef<HTMLDivElement>(null);
  

  useEffect(()=>{
    setListDataComment(props.data?.commentTimelines);
  },[props.data?.commentTimelines])

  useEffect(()=>{
    if(props.listDataComment.has(props.data?.timelineId)){
      setListDataComment(props.listDataComment.get(props.data?.timelineId).listComment);
    }
  },[props.countCreate])
  // const employeeDetail = props.employee && props.employeeFieldsAvailable;

  useEffect(() => {
    if (isComment) {
      setIsComment(true);
      setIsQuote(false);
      setIsQuoteAll(false);
      setIsShare(false);
      // setIsReaction(false);
      setIsDetail(false);
    }
  }, [isComment])

  useEffect(() => {
    if (isQuote) {
      setIsQuote(true);
      setIsComment(false);
      setIsShare(false);
      // setIsReaction(false);
      setIsDetail(false);
      setIsQuoteAll(false);
    }
  }, [isQuote])

  useEffect(() => {
    if (isQuoteAll) {
      setIsQuote(false);
      setIsComment(false);
      setIsShare(false);
      // setIsReaction(false);
      setIsDetail(false);
      setIsQuoteAll(true);
    }
  }, [isQuoteAll])

  useEffect(() => {
    if (isShare) {
      setIsQuote(false);
      setIsComment(false);
      setIsShare(true);
      // setIsReaction(false);
      setIsDetail(false);
      setIsQuoteAll(false);
    }
  }, [isShare])

  useEffect(() => {
    // if (props.data?.isFavorite) {
      setIsFavorite(props.data?.isFavorite);
    // }
  }, [props.data?.isFavorite])

    // favorite success
    useEffect(() => {
      if (props.timeLineFavorite?.timelineId > 0 && props.timeLineFavorite?.status === 0 && props.data?.timelineId === props.timeLineFavorite.timelineId  ) {
        setIsFavorite(true);
        return
      }else if(props.timeLineFavorite?.timelineId > 0 && props.timeLineFavorite?.status === 1 && props.data?.timelineId === props.timeLineFavorite.timelineId){
        setIsFavorite(false);
        return
      }
    }, [props.timeLineFavorite])


  // get detail timeline success
  useEffect(() => {
    if (isDetail && props.timelineItem?.timelineId > 0) {
      setShowModalDetail(true);
    }
  }, [props.timelineItem])


  // handle data create comment, quote
  const handleDataCreate = (dataCreate) => {
    setIsComment(false);
    setIsQuoteAll(false);
    setIsQuote(false);
    setCommentCreateData(dataCreate);
    setShowDataCreate(true)
    // props.data?.commentTimelines.push(dataCreate);
  }

  const handleFavorite = () => {
    props.handleInitTimelinesFavorite(props.data?.timelineId, props.data?.rootId);
  }

  const handleDataCheck = (dataCheck) => {
    setCommentDirtyCheck(dataCheck)
  }

  const executeDirtyCheck = async (dirtyCheck) => {
    if (dirtyCheck===1) {
      const onCancel = () => {setIsComment(true); setCommentDirtyCheck(true)};
      const onOk = () => {setIsComment(false);setCommentDirtyCheck(false)};
      await DialogDirtyCheckTimeline({
        onLeave: onOk, onStay: onCancel, ok: translate('global.dialog-dirtycheck.parttern1.confirm'),
        cancel: translate('global.dialog-dirtycheck.parttern1.cancel'),
        content: translate('timeline.dirty-check.content'),
        title: translate('global.dialog-dirtycheck.parttern1.title')
      });
    } else if (dirtyCheck===2) {
      const onCancel = () => {
        if(isQuote){
          setIsQuote(true)
        }else if(isQuoteAll){
          setIsQuoteAll(true);
        }

         setCommentDirtyCheck(true)};
      const onOk = () => {
          setIsQuoteAll(false);
          setIsQuote(false);
          setCommentDirtyCheck(false)};
      await DialogDirtyCheckTimeline({
        onLeave: onOk, onStay: onCancel, ok: translate('global.dialog-dirtycheck.parttern1.confirm'),
        cancel: translate('global.dialog-dirtycheck.parttern1.cancel'),
        content: translate('timeline.dirty-check.content'),
        title: translate('global.dialog-dirtycheck.parttern1.title')
      });
    }
  };

  const handleCheckQuoteAll = () => {
    if (commentDirtyCheck && (isQuoteAll || isQuote) ) {
      executeDirtyCheck(2)
    }
    else {
      setIsQuoteAll(!isQuoteAll)
    }
  }

  const handleCheckComment = () => {
    if (commentDirtyCheck && isComment) {
      executeDirtyCheck(1)
    }
    else {
      setIsComment(!isComment)
    }
  }

  return <>
      <div hidden>
         <TimelineMessageInfo isModal = {false}/>
      </div>
      <div hidden ref={refContentAuto}>
         <TimelineContentCommentAuto contentAuto={props.data?.comment?.content} timelinePost={props.data} />
      </div>
      {/* content end */}
      {/* handle logic buttons */}
      {!props.isNotMemberOfGroup &&
      <div className={`box-share-bottom pt-1 mt-1 ${isComment ? "position-relative" : ""}`}>
        {
          <>
            <a  className={`icon-small-primary icon-comment ${isComment ? "active unset-bg-color" : ""}`} onClick={() => handleCheckComment()} ></a>
            <a  className={`icon-small-primary icon-quote ${ isQuoteAll || isQuote ? "active unset-bg-color" : ""}`} onClick={() => handleCheckQuoteAll()} ></a>
            <a className="icon-small-primary icon-share" onClick={() => setIsShare(!isShare)}></a>
            <ReactionPicker objectId={props.data?.timelineId} rootId={props.data?.timelineId}/>
            <a className={`icon-small-primary icon-start ${isFavorite ? "active unset-bg-color" : ""} `} onClick={() => handleFavorite()} ></a>
            {isComment && <TimelineFormControl createComment={1} dataTimeline={props.data} callbackData={handleDataCreate}  />}
            {isQuote && <TimelineCreateQuote dataTimeline={dataTemp} isCreateOfReply={false} createQuote={1} callbackData={handleDataCreate} />}
            {isQuoteAll && <TimelineCreateQuote 
             dataAuto={refContentAuto.current.innerHTML}
             dataTimeline={props.data} 
             isCreateOfReply={false} 
             createQuote={1} 
             callbackData={handleDataCreate} />}
          </>
        }
      </div>
      }
      {/* comment and show display area */}
      <TimelineViewComment
        dataTimeline={props.data}
        isCommon={props.isCommon}
        isNotMemberOfGroup={props.isNotMemberOfGroup}
        dataComment={listDataComment}
        timelineId={props.data?.timelineId}
        dataCreateComment={commentCreateData}
        isShowCreate = {showDataCreate}
        callbackCheckData = {handleDataCheck}
        timelineGroupId = {props.data?.timelineGroupId}
        callBackShowCreate = {() => { setShowDataCreate(false) } }
      />
    {isShare && <ShareTimelineModal isTimelineAuto={props.data.comment?.mode !== MODE_CONTENT.CREATE_NORMAL} defaultTargetCreateTimeline = {props.defaultTargetCreateTimeline} isCommon={props.isCommon} data={props.data} isPrivateGroup={props.isPrivateGroup} closeModal={ () => setIsShare(false)} /> }
    {showModalDetail && <TimelineDetail isPrivateGroup={props.isPrivateGroup} isCommon={props.isCommon} data={props.timelineItem} closeModal={() => { setIsDetail(false); setShowModalDetail(false) }}   />}
  </>

}
const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  timelineItem: timelineReducerState.timelineItem,
  // employeeFieldsAvailable: employeeDetail.employeeFieldsAvailable,
  // employee: employeeDetail.employee,
  timeLineFavorite: timelineReducerState.timeLineFavorite,
  listDataComment: timelineReducerState.listDataComment,
  countCreate: timelineReducerState.countCreate
});
const mapDispatchToProps = {
  handleGetTimelineById,
  toggleConfirmPopup,
  onclickDelete,
  handleInitTimelinesFavorite,
  handleShowDetail,
  onclickDeleteExtTimeline
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineItemControlBeside);
