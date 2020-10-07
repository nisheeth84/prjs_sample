import React, { useState, useEffect } from 'react'
import { CommentTimelinesType, TimelinesType } from '../../models/get-user-timelines-type'
import { translate } from 'react-jhipster'
import TimelineCreateQuote from './timeline-create-quote'
import ShareTimelineModal from '../button-footer/share-timeline-modal'
import TimelineContentComment from './timeline-content-comment'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import TimelineFormControl from './timeline-form-control';
import TimelineShowImage from '../timeline-content/timeline-show-image';
import TimelineViewQuote from './timeline-view-quote'
import { CommonUtil } from '../../common/CommonUtil'
import { TYPE_DETAIL_MODAL, MODE_CONTENT } from '../../common/constants'
import { handleInitTimelinesFavorite, toggleConfirmPopup, onclickDelete, handleShowDetail } from '../../timeline-reducer'
import { handleGetReplyAll } from '../../timeline-common-reducer'
import { ConfirmPopupItem } from '../../models/confirm-popup-item';
import { onclickDeleteExtTimeline } from '../../timeline-common-reducer';
import ViewFile from '../timeline-content/view-file'
import TimelineListReply from '../timeline-content/timeline-list-reply'
import ReactionPicker from '../../control/reaction/reaction-picker'
import ReactionListChoose from '../../control/reaction/reaction-list-choose'
import TimelineTagetDeliversShow from './timeline-taget-delivers-show'

type ITimelineViewCommentDetailProp = StateProps & DispatchProps & {
  dataTimeline?: TimelinesType
  dataComment?: CommentTimelinesType
  indexComment?: number;
  isNotMemberOfGroup: boolean
  isModalDetail?: boolean
  isCommon?: any,
  timelineGroupId?: number
}

const TimelineViewCommentDetail = (props: ITimelineViewCommentDetailProp) => {
  const [isReply, setIsReply] = useState(null)
  const [isExtendReply, setIsExtendReply] = useState(false)
  const [isQuote, setIsQuote] = useState(null);
  const [isQuoteAll, setIsQuoteAll] = useState(null);
  const [isShare, setIsShare] = useState(null);
  const [isFavorite, setIsFavorite] = useState(props.dataComment.isFavorite);
  const [dataTemp, setDataTemp] = useState(props.dataComment)
  const [isShowImage, setIsShowImage] = useState(null);
  const [commentCreateData, setCommentCreateData] = useState({});
  const [countCreate, setCountCreate] = useState(0)
  const [forceUpdate, setForceUpdate] = useState(0);

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  useEffect(() => {
    if (isReply) {
      setIsReply(true);
      setIsQuote(false);
      setIsShare(false);
      // setIsReaction(false);
      setIsQuoteAll(false);
    }
  }, [isReply])

  useEffect(() => {
    if (isQuote) {
      setIsQuote(true);
      setIsReply(false);
      setIsShare(false);
      // setIsReaction(false);
      setIsQuoteAll(false);
    }
  }, [isQuote])

  useEffect(() => {
    if (isQuoteAll) {
      setIsQuote(false);
      setIsReply(false);
      setIsShare(false);
      // setIsReaction(false);
      setIsQuoteAll(true);
    }
  }, [isQuoteAll])
  useEffect(() => {
    if (isShare) {
      setIsQuote(false);
      setIsReply(false);
      setIsShare(true);
      // setIsReaction(false);
      setIsQuoteAll(false);
    }
  }, [isShare])

  useEffect(() => {
    setIsFavorite(props.dataComment?.isFavorite);
  }, [props.dataComment.isFavorite])




  useEffect(() => {
    if (props.timeLineFavorite?.timelineId > 0 && props.timeLineFavorite?.timelineId === props.dataComment.timelineId) {
      setIsFavorite(props.timeLineFavorite.status === 0);
    }
  }, [props.timeLineFavorite])

  const userLoginId = CommonUtil.getUserLogin().employeeId;

  const handleCreateQuote = (text) => {
    setIsQuote(true);
    setDataTemp({ ...dataTemp, comment: { ...dataTemp.comment, content: text } })
  }

  const handleDataCreate = (dataCreate) => {
    setIsReply(false)
    setIsQuote(false)
    setIsQuoteAll(false)
    if (!isExtendReply) {
      setIsExtendReply(true)
    }
    setCountCreate(countCreate + 1)
    setCommentCreateData(dataCreate)
  }

  const handleFavorite = () => {
    props.handleInitTimelinesFavorite(props.dataComment.timelineId, props.dataComment.rootId);
  }
  /*
   *  handle modal confirm delete timeline
   * @param timelineId
   */
  const handleDeleteComment = (timelineId: number, type: number, roodId: number) => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };
    const funcDelete = () => {
      if (props.isCommon) {
        props.onclickDeleteExtTimeline(timelineId, type, roodId)
      } else {
        props.onclickDelete(timelineId, type, roodId);
      }
    };
    const popupDelete: ConfirmPopupItem = {
      title: ``,
      content: `<p class="text-center">${translate('timeline.popup-delete.content')}</p>`,
      listButton: [
        {
          type: "cancel",
          title: `${translate('timeline.popup-delete.button-cancel')}`,
          callback: cancel
        },
        {
          type: "red",
          title: `${translate('timeline.popup-delete.button-delete')}`,
          callback: funcDelete
        }
      ]
    };
    props.toggleConfirmPopup(true, popupDelete);
  };
  const handleShowPopupEmployeeDetail = (employeeId, type) => {
    props.handleShowDetail(employeeId, type);
  }

  return (
    <div className={`box-share mb-3  ${props.indexComment === 0 ? "" : "mt-3 "}`}  >
      <div className={`box-share-top ${props.isModalDetail ? "d-flex justify-content-between" : ""}`} >
        <div className="mission-wrap">
          <div className="item">
            {props.dataComment?.createdUserPhoto ? (<img className="user" src={props.dataComment?.createdUserPhoto} alt=' ' />) : (<div className="no-avatar green"> {props.dataComment?.createdUserName ? props.dataComment?.createdUserName.charAt(0) : ''} </div>)}
            <a onClick={() => handleShowPopupEmployeeDetail(props.dataComment.createdUser, TYPE_DETAIL_MODAL.EMPLOYEE)}><span className={`${props.isModalDetail ? "font-size-14 text-blue" : "font-size-12 text-blue"}`}>{props.dataComment.createdUserName} </span></a>
          </div>
        </div>
        <div className={`${props.isModalDetail ? "fdate font-size-12 text-blue" : "date font-size-10 text-blue"}`} >{`${CommonUtil.getJustDateTimeZone(props.dataComment?.createdDate)} ${CommonUtil.getTimeZoneFromDate(props.dataComment.createdDate)}`}
          {props.dataComment?.createdUser === Number(userLoginId) &&
            <button className="icon-small-primary icon-erase-small" onClick={() => { handleDeleteComment(props.dataComment.timelineId, 1, props.dataComment.rootId) }} />
          }
        </div>
      </div>
      <div className={`box-share-content color-333 ${(props.dataComment.quotedTimeline && props.dataComment.quotedTimeline.timelineId) ? "share-comment-quote" : ""}  `}   >
        <TimelineTagetDeliversShow dataTarget={props.dataComment.targetDelivers} createUser={props.dataComment.createdUser} />
        <TimelineContentComment isPermission={props.isNotMemberOfGroup} data={props.dataComment.comment.content} onCreateQuote={handleCreateQuote} isHighlight={true} />
        {props?.dataComment?.quotedTimeline && props?.dataComment?.quotedTimeline?.timelineId && <TimelineViewQuote data={props.dataComment.quotedTimeline} />}

      </div>
      {props.dataComment?.attachedFiles?.length > 0 &&
        <div className="d-flex flex-wrap py-2">
          {props.dataComment?.attachedFiles?.map((item, index) => {
            return (< ViewFile item={item} key={index + '_file'} />)
          })}
        </div>
      }
       {/* reaction */}
       <ReactionListChoose objectId={props.dataComment.timelineId} rootId={props.dataComment.rootId} reactionsSelecteds={props.dataComment.reactions} />
      <div className={`box-share-bottom pt-1 mt-2`} >
        {
          <>
            {!props.isNotMemberOfGroup &&
              <>
                <a className={`icon-small-primary icon-share-time ${isReply ? "active unset-bg-color" : ""}`} onClick={() => { setIsReply(!isReply) }} />
                <a className={`icon-small-primary icon-quote ${isQuoteAll || isQuote ? "active unset-bg-color" : ""}`} onClick={() => setIsQuoteAll(!isQuoteAll)} ></a>
                <a className="icon-small-primary icon-share" onClick={() => setIsShare(!isShare)}></a>
                <ReactionPicker isCommonMode={props.isCommon} objectId={props.dataComment.timelineId} rootId={props.dataComment.rootId} />
                <a className={`icon-small-primary icon-start ${isFavorite ? "active unset-bg-color" : ""} `} onClick={() => handleFavorite()}  ></a>
              </>
            }
            {!isExtendReply && props.dataComment?.replyTimelines?.length > 0 &&
              <div className={`more-info mt-2 mb-2 ${props.isCommon ? 'text-right' : ''}`}>
                <button className={props.isModalDetail ? "button-primary button-border button-more-info position-static" : "button-primary button-border button-more-info"}
                  onClick={() => { setIsExtendReply(!isExtendReply) }}> {props.dataComment?.replyTimelines?.length} {translate('timeline.list.btn-expand-reply')}</button>
              </div>
            }
            {isQuote && <TimelineCreateQuote isCommonMode={props.isCommon} dataComment={dataTemp} createQuote={2} dataTimeline={props.dataTimeline} isCreateOfReply={false} callbackData={handleDataCreate} />}
            {isQuoteAll && <TimelineCreateQuote isCommonMode={props.isCommon} dataComment={props.dataComment} createQuote={2} dataTimeline={props.dataTimeline} isCreateOfReply={false} callbackData={handleDataCreate} />}
          </>
        }
      </div>

      {isReply && <TimelineFormControl isCommonMode={props.isCommon} dataComment={props.dataComment} dataTimeline={props.dataTimeline} createComment={2} callbackData={handleDataCreate} />}

      {/* view list reply */}
      {isExtendReply && <TimelineListReply isCommon = {props.isCommon} dataTimeline={props.dataTimeline} dataComment={props.dataComment} dataCreateReply={commentCreateData} callbackData={handleDataCreate} isCreate={countCreate} isNotMemberOfGroup={props.isNotMemberOfGroup} isModalDetail={props.isModalDetail}/>}
      {isShare && <ShareTimelineModal isCommon={props.isCommon} data={{...props.dataComment, timelineGroupId: props.dataTimeline.timelineGroupId}} closeModal={() => setIsShare(false)} isCheckTransfer={true} dataTimeline={props.dataTimeline}/>}
      {isShowImage && <TimelineShowImage imageUrl={""} onClose={() => { setIsShowImage(!isShowImage) }} />}
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  timeLineFavorite: timelineReducerState.timeLineFavorite,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleGetReplyAll,
  handleInitTimelinesFavorite,
  toggleConfirmPopup,
  onclickDelete,
  onclickDeleteExtTimeline,
  handleShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineViewCommentDetail);
