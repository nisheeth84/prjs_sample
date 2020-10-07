import React, { useState, useEffect } from 'react'
import { ReplyTimelinesType, CommentTimelinesType, TimelinesType } from '../../models/get-user-timelines-type'
import TimelineCreateQuote from './timeline-create-quote'
import TimelineViewQuote from './timeline-view-quote'
import TimelineContentComment from './timeline-content-comment'
import TimelineShowImage from '../timeline-content/timeline-show-image';
import TimelineFormControl from './timeline-form-control';
import ShareTimelineModal from '../button-footer/share-timeline-modal';
import { CommonUtil } from '../../common/CommonUtil'
import { connect } from 'react-redux'
import { onclickDeleteExtTimeline } from '../../timeline-common-reducer';
import { translate } from 'react-jhipster';
import {handleInitTimelinesFavorite,toggleConfirmPopup, onclickDelete, handleShowDetail} from '../../timeline-reducer'
import { ConfirmPopupItem } from '../../models/confirm-popup-item'
import { TYPE_DETAIL_MODAL } from '../../common/constants'
import ViewFile  from '../timeline-content/view-file'
import ReactionPicker from '../../control/reaction/reaction-picker'
import ReactionListChoose from '../../control/reaction/reaction-list-choose'
import { IRootState } from 'app/shared/reducers'
import TimelineTagetDeliversShow from './timeline-taget-delivers-show'

type ITimelineViewReplyProp  = StateProps & DispatchProps & {
  dataTimeline: TimelinesType
  // data reply
  dataItemReply: ReplyTimelinesType
  // data dataComment
  dataComment: CommentTimelinesType
  isNotMemberOfGroup?: boolean
  callbackDataCreateReply?:(dataCreate)=>void
  isCommon?: boolean
  isModalDetail?: boolean
}

const TimelineViewReply = (props: ITimelineViewReplyProp) => {
  const [isQuote, setIsQuote] = useState(null);
  const [isShare, setIsShare] = useState(null);
  const [isFavorite, setIsFavorite] = useState(props.dataItemReply.isFavorite);
  const [isReply, setIsReply] = useState(null)
  const [isQuoteAll, setIsQuoteAll] = useState(null);
  const [isShowImage, setIsShowImage] = useState(null);
  const [imagePath] = useState(null);
  const [dataTemp, setDataTemp] = useState(props.dataItemReply)
  const userLoginId = CommonUtil.getUserLogin().employeeId;
  const [forceUpdate, setForceUpdate] = useState(0);

  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])

  const handleCreateQuote = (text) => {
    setIsQuote(true);
    setDataTemp({ ...dataTemp, comment: { ...dataTemp.comment, content: text } })
  }

  useEffect(() => {
    if (isReply) {
      setIsReply(true);
      setIsQuote(false);
      setIsQuoteAll(false);
      setIsShare(false);
    }
  }, [isReply])

  useEffect(() => {
    if (isQuote) {
      setIsQuote(true);
      setIsReply(false);
      setIsShare(false);
      setIsQuoteAll(false);
    }
  }, [isQuote])

  useEffect(() => {
    if (isQuoteAll) {
      setIsQuote(false);
      setIsReply(false);
      setIsShare(false);
      setIsQuoteAll(true);
    }
  }, [isQuoteAll])

  useEffect(() => {
    if (isShare) {
      setIsQuote(false);
      setIsReply(false);
      setIsShare(true);
      setIsQuoteAll(false);
    }
  }, [isShare])


  useEffect(() => {
    setIsFavorite(props.dataItemReply?.isFavorite);
  }, [props.dataItemReply.isFavorite])

  useEffect(() => {
    if (props.timeLineFavorite?.timelineId > 0 && props.timeLineFavorite?.timelineId === props.dataItemReply.timelineId) {
      setIsFavorite(props.timeLineFavorite.status === 0);
    }
  }, [props.timeLineFavorite])

  const handleFavorite = () => {
    props.handleInitTimelinesFavorite(props.dataItemReply.timelineId, props.dataItemReply.rootId);
  }

  const handleDataCreate = (dataCreate) =>{
    setIsReply(false);
    setIsQuoteAll(false);
    setIsQuote(false);
    props.callbackDataCreateReply(dataCreate)
  }
  const handleDeleteModal = (timelineId: number, type: number, rootId: number , parentId: number ) => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };
    const funcDelete = () => {
      if (props.isCommon) {
        props.onclickDeleteExtTimeline(timelineId, type, rootId, parentId)
      } else {
        props.onclickDelete(timelineId, type, rootId, parentId );
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
    <div className="popup-box-share-content mt-2">
      <div className="box-share">
        <div className="box-share-top d-flex justify-content-between">
          <div className="mission-wrap">
            <div className="item">
              { props.dataItemReply?.createdUserPhoto ? (<img className="user" src={props.dataItemReply?.createdUserPhoto} alt=' ' />) : (<div className="no-avatar green"> {props.dataItemReply?.createdUserName ? props.dataItemReply?.createdUserName.charAt(0) : ''} </div>) }
              <a onClick={() => handleShowPopupEmployeeDetail(props.dataItemReply.createdUser, TYPE_DETAIL_MODAL.EMPLOYEE)}><span className={`${props.isModalDetail ? 'font-size-14' : 'font-size-12'} text-blue`}>{props.dataItemReply.createdUserName} </span></a>
            </div>
          </div>
          <div className="date font-size-10 text-blue">{`${CommonUtil.getJustDateTimeZone(props.dataItemReply.createdDate)} ${CommonUtil.getTimeZoneFromDate(props.dataItemReply.createdDate)}`}
          {props.dataItemReply?.createdUser === Number(userLoginId) &&
            <button className="icon-small-primary icon-erase-small" onClick={() => { handleDeleteModal(props.dataItemReply.timelineId, 2, props.dataItemReply.rootId, props.dataItemReply.parentId  ) }} />
          }
          </div>
        </div>
        <div className={`box-share-content color-333 ${(props.dataItemReply.quotedTimeline && props.dataItemReply.quotedTimeline.timelineId) ? "share-comment-quote" : ""}  `}   >
        <TimelineTagetDeliversShow dataTarget={props.dataItemReply.targetDelivers} createUser={props.dataItemReply.createdUser} />
          <TimelineContentComment isPermission={props.isNotMemberOfGroup} data={props.dataItemReply?.comment?.content} onCreateQuote={handleCreateQuote} isHighlight={true}/>
          {(props.dataItemReply?.quotedTimeline && props.dataItemReply?.quotedTimeline?.timelineId) && <TimelineViewQuote data={props.dataItemReply?.quotedTimeline} />}
        </div>
         {/* <TimelineReactionView /> */}
         {props.dataItemReply?.attachedFiles?.length > 0 &&
          <div className="d-flex flex-wrap py-2">
            {props.dataItemReply?.attachedFiles?.map((item, index) => {
              return ( < ViewFile item={item} key={index + '_file' } /> )
            })}
          </div>
        }
        {/* reaction */}
        <ReactionListChoose objectId={props.dataItemReply.timelineId} rootId={props.dataItemReply.rootId} reactionsSelecteds={props.dataItemReply.reactions}/>
        {!props.isNotMemberOfGroup &&
          <div className={`box-share-bottom pt-1 mt-2`} >
            <a className={`icon-small-primary icon-share-time ${isReply ? "active unset-bg-color" : ""}   `} onClick={() => { setIsReply(!isReply) }} />
            <a className={`icon-small-primary icon-quote ${isQuoteAll || isQuote ? "active unset-bg-color" : ""}`} onClick={() => setIsQuoteAll(!isQuoteAll)} ></a>
            <a className="icon-small-primary icon-share" onClick={() => setIsShare(!isShare)}></a>
            <ReactionPicker isCommonMode={props.isCommon} objectId={props.dataItemReply.timelineId} rootId={props.dataItemReply.rootId} />
            <a className={`icon-small-primary icon-start ${isFavorite ? "active unset-bg-color" : ""} `} onClick={() => handleFavorite()} ></a>
            {isReply && <TimelineFormControl isCommonMode={props.isCommon} isButtonSmall={props.isCommon} dataTimeline={props.dataTimeline} dataComment={props.dataComment} dataReply={props.dataItemReply} createComment={2} isCreateOfReply={true} callbackData={handleDataCreate} />}
            {isQuote && <TimelineCreateQuote isCommonMode={props.isCommon} isButtonSmall={props.isCommon} dataTimeline= {props.dataTimeline} dataReply={dataTemp} createQuote={2} isCreateOfReply={true} callbackData={handleDataCreate} />}
            {isQuoteAll && <TimelineCreateQuote isCommonMode={props.isCommon} isButtonSmall={props.isCommon} dataTimeline ={props.dataTimeline} dataReply={props.dataItemReply} createQuote={2} isCreateOfReply={true} callbackData={handleDataCreate} />}
          </div>
        }
        { isShare && <ShareTimelineModal isCommon = {props.isCommon} data={{...props.dataItemReply, timelineGroupId: props.dataTimeline.timelineGroupId}} closeModal={() => setIsShare(false)} isCheckTransfer={true} dataTimeline={props.dataTimeline}/> }
        { isShowImage && <TimelineShowImage imageUrl = {imagePath} onClose={() => { setIsShowImage(!isShowImage) }} /> }

      </div>
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  timeLineFavorite: timelineReducerState.timeLineFavorite,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
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
)(TimelineViewReply);


