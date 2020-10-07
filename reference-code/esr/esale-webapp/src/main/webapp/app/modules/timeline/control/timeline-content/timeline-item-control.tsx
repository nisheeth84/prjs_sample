import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { TimelinesType } from '../../models/get-user-timelines-type';
import { translate } from 'react-jhipster';
import { ConfirmPopupItem } from '../../models/confirm-popup-item';
import { toggleConfirmPopup, onclickDelete, handleInitTimelinesFavorite } from '../../timeline-reducer';
import { onclickDeleteExtTimeline } from '../../timeline-common-reducer';
import { CommonUtil } from '../../common/CommonUtil';
import TimelineCreateQuote from './timeline-create-quote';
import ShareTimelineModal from '../button-footer/share-timeline-modal';
import TimelineShareView from './timeline-share-view';
import TimelineHeader from './timeline-header';
import { TYPE_DETAIL_MODAL, MODE_CHECK, LISTCOLOR, MODE_CONTENT } from '../../common/constants';
import TimelineContentComment from './timeline-content-comment';
import TimelineDetail from '../timeline-content/timeline-detail';
import { IRootState } from 'app/shared/reducers';
import { handleGetTimelineById } from '../../timeline-reducer';
import { handleShowDetail } from "app/modules/timeline/timeline-reducer";
import TimelineViewComment from './timeline-view-comment'
import TimelineFormControl from './timeline-form-control';
import TimelineTagetDeliversShow from './timeline-taget-delivers-show'
import { TargetDelivers } from '../../models/create-comment-and-reply-model';
import ViewFile  from '../timeline-content/view-file'
import { Link } from 'react-router-dom';
import ReactionPicker from '../../control/reaction/reaction-picker'
import ReactionListChoose from '../../control/reaction/reaction-list-choose'
import { ObjectDetail } from '../../models/get-followeds-model';
import { useHistory } from 'react-router';
import OpenModalDetail from 'app/shared/layout/common/open-modal-detail';
/**
 *  component show item timeline in list timeline
 */

type ITimelineItemControlProp = StateProps & DispatchProps & {
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
  // default Target Create Timeline for common
  defaultTargetCreateTimeline?: TargetDelivers
  // call back for show detail object
  callBackShowDetail?: (object: ObjectDetail) => void
  // set data detail timeline for common
  setDataDetailTimeline?: (object: TimelinesType) => void
}

const TimelineItemControl = (props: ITimelineItemControlProp) => {
  const [isComment, setIsComment] = useState(null);
  const [isQuoteAll, setIsQuoteAll] = useState(null);
  const [isQuote, setIsQuote] = useState(null);
  const [isShare, setIsShare] = useState(null);
  const [isFavorite, setIsFavorite] = useState(props.data?.isFavorite);
  const [dataTemp, setDataTemp] = useState(props.data)
  const [isDetail, setIsDetail] = useState(false);
  const [commentCreateData, setCommentCreateData] = useState({});
  const [showDataCreate, setShowDataCreate] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [listDataComment, setListDataComment] = useState([]);
  const[commentDirtyCheck,setCommentDirtyCheck] = useState(null)
  const history = useHistory();
  // for timeline auto
  const [allContent, setAllContent] = useState(null);

  const userLoginId = CommonUtil.getUserLogin().employeeId;

  useEffect(()=>{
    setListDataComment(props.data?.commentTimelines);
  },[props.data?.commentTimelines])

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
      setIsFavorite(props.data?.isFavorite);
  }, [props.data.isFavorite])

    // favorite success
    useEffect(() => {
      if (props.timeLineFavorite?.timelineId > 0 && props.timeLineFavorite?.status === 0 && props.data?.timelineId === props.timeLineFavorite?.timelineId  ) {
        setIsFavorite(true);
      }else if(props.timeLineFavorite?.timelineId > 0 && props.timeLineFavorite?.status === 1 && props.data?.timelineId === props.timeLineFavorite?.timelineId){
        setIsFavorite(false);
      }
    }, [props.timeLineFavorite])


  // get detail timeline success
  useEffect(() => {
    if (isDetail && props.timelineItem?.timelineId > 0) {
      setShowModalDetail(true);
	 // set data detail timeline for common
      if(props.setDataDetailTimeline){
        setIsDetail(false);
        props.setDataDetailTimeline(props.timelineItem)
      }
    }
  }, [props.timelineItem])

  useEffect(()=>{
    if(props.listDataCommentAll.has(props.data.timelineId)){
      setListDataComment(props.listDataCommentAll.get(props.data.timelineId).listComment);
    }
  },[props.countCreate])

  /**
  * Get random Avatar
  */

  const handleFavorite = () => {
    props.handleInitTimelinesFavorite(props.data.timelineId, props.data.rootId);
  }

  const showDetailTimeline = () => {
    props.handleGetTimelineById(props.data.timelineId);
    setIsDetail(true)
  }
  /**
   *  handle modal confirm delete timeline
   * @param timelineId
   */
  const handleDeleteTimeline = (timelineId: number, type: number) => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };
    const funcDelete = () => {
      if (props.isCommon) {
        props.onclickDeleteExtTimeline(timelineId,  type, 0 )
      } else {
        props.onclickDelete(timelineId, type, 0);
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

  /**
   * create quote
   * @param text
   */
  const handleCreateQuote = (text) => {
    setIsQuote(true);
    setDataTemp({ ...dataTemp, comment: { ...dataTemp.comment, content: text } })
  }
  // handle data create comment, quote
  const handleDataCreate = (dataCreate) => {
    setIsComment(false);
    setIsQuoteAll(false);
    setIsQuote(false);
    setCommentCreateData(dataCreate);
    setShowDataCreate(true);
  }

  const getColorIndex = () => {
    if (Number(CommonUtil.NVL(props.data.timelineGroupId, "0")) > 0) {
      const color = LISTCOLOR.find(e => e.value === props.data.color)
      return color ? `color-bg-group-${color.id}` : '';
    } else {
      return '';
    }
  }

  const handleDataCheck = (dataCheck) => {
    setCommentDirtyCheck(dataCheck)
  }

  /**
   * Display layout of channel detail screen
   */
  const[isChannelDetail,setIsChannelDetail] = useState(false);
  const url = window.location.pathname;
  const handleChannelDetail = () => {
    if (url.includes("/channel/detail/")) {
      setIsChannelDetail(true);
    }
  }

  useEffect(() => {
    handleChannelDetail();
  }, [])

  const hanldeShowObjectDetail = (dataObject: ObjectDetail) => {
    if(props.callBackShowDetail)
      props.callBackShowDetail(dataObject)
  }

  const linkToDetailChannel = () => {
    history.push(`/timeline/channel/detail/${props.data.timelineGroupId}`);
  }

  return <>
    <div className={`${!isChannelDetail && props.isLast ? "box-share mb-2" : "box-share "}  ${!isChannelDetail ? getColorIndex() : ''}`}>
      {/* content area */}
      {!isChannelDetail && Number(CommonUtil.NVL(props.data.timelineGroupId, "0")) > 0 &&
        <div className="list-group">
          <div className="mission-wrap">
            <div className="item">
            {props.data?.imagePath ? (<img className="user" src={props.data?.imagePath} />): (<div className={`no-avatar  ${CommonUtil.getColorIndex(props.data?.color)}` }> {props.data?.timelineGroupName ? props.data?.timelineGroupName.charAt(0) : ''} </div>)}
              <span className="font-size-12 text-blue ml-2" >
                <a onClick={linkToDetailChannel}>{props.data.timelineGroupName}</a>
              </span>
            </div>
          </div>
        </div>
      }
      <div className="box-share-top">
        <div className="mission-wrap">
          <div className="item">
          { props.data?.createdUserPhoto ? (<img className="user" src={props.data?.createdUserPhoto} alt=' ' />) : (<div className="no-avatar green"> {props.data?.createdUserName ? props.data?.createdUserName.charAt(0) : ''} </div>) }
            <a onClick={() => {hanldeShowObjectDetail({objectId: props.data.createdUser, objectType: TYPE_DETAIL_MODAL.EMPLOYEE})}}> <span className="font-size-12 text-blue"> {props.data?.createdUserName} </span></a>
          </div>
        </div>
        <div className="date font-size-10 text-blue">
          <a onClick={() => showDetailTimeline()} >  {`${CommonUtil.getJustDateTimeZone(props.data?.createdDate)} ${CommonUtil.getTimeZoneFromDate(props.data.createdDate)}`}</a>
          {props.data?.createdUser === Number(userLoginId) &&
            <button className="icon-small-primary icon-erase-small" onClick={() => { handleDeleteTimeline(props.data.timelineId, 0) }} />
          }
        </div>
      </div>
      <div className="box-share-content color-333">
        {props.data?.comment?.mode < MODE_CHECK && props.data?.header?.headerId > 0 && <TimelineHeader  callBackShowDetail={hanldeShowObjectDetail} data={props.data} />}
        <TimelineTagetDeliversShow dataTarget={props.data.targetDelivers} createUser={props.data.createdUser} />
        <TimelineContentComment 
		      data={props.data?.comment?.content}
          getAllDataQuote = {(content: string) => setAllContent(content)}
          onCreateQuote={handleCreateQuote} isHighlight={true} 
          isPermission={props.isNotMemberOfGroup} 
          isTimelineAuto={props.data.comment?.mode !== MODE_CONTENT.CREATE_NORMAL}
          timelinePostData={props.data}
          openObjectDetail={hanldeShowObjectDetail}
          />
        {/* <TimelineContentComment data={props.data?.comment?.content} onCreateQuote={handleCreateQuote} isHighlight={true} isPermission={props.isNotMemberOfGroup}/> */}
        {/* timeline share start */}
        {props.data?.sharedTimeline && props.data?.sharedTimeline?.timelineId && <TimelineShareView isTimelineAuto={props.data.sharedTimeline?.comment?.mode !== MODE_CONTENT.CREATE_NORMAL} data={props.data?.sharedTimeline} />}
        {props.data?.comment?.mode === MODE_CHECK && props.data?.header?.headerId > 0 && <TimelineHeader callBackShowDetail={hanldeShowObjectDetail} data={props.data} />}
        {/* logic show header start */}
        {/* <TimelineReactionView /> */}
        {props.data?.attachedFiles?.length > 0 &&
          <div className="d-flex flex-wrap py-2">
            {props.data?.attachedFiles?.map((item, index) => {
              return ( < ViewFile item={item} key={index + '_file' } /> )
            })}
          </div>
        }
        {/* reaction */}
        <ReactionListChoose objectId={props.data.timelineId} rootId={props.data.timelineId} reactionsSelecteds={props.data.reactions}/>
      </div>
      {/* content end */}
      {/* handle logic buttons */}
      {!props.isNotMemberOfGroup &&
      <div className={`box-share-bottom pt-1 mt-1 ${isComment ? "position-relative" : ""}`}>
        {
          <>
            <a  className={`icon-small-primary icon-comment ${isComment ? "active unset-bg-color" : ""}`} onClick={() => setIsComment(!isComment)} ></a>
            <a  className={`icon-small-primary icon-quote ${ isQuoteAll || isQuote ? "active unset-bg-color" : ""}`} onClick={() => setIsQuoteAll(!isQuoteAll)} ></a>
            <a className="icon-small-primary icon-share" onClick={() => setIsShare(!isShare)}></a>
            <ReactionPicker isCommonMode={props.isCommon} objectId={props.data.timelineId} rootId={props.data.timelineId}/>
            <a className={`icon-small-primary icon-start ${isFavorite ? "active unset-bg-color" : ""} `} onClick={() => handleFavorite()} ></a>
            {isComment && <TimelineFormControl isCommonMode={props.isCommon} createComment={1} dataTimeline={props.data} callbackData={handleDataCreate} />}
            {isQuote && <TimelineCreateQuote isCommonMode={props.isCommon} dataTimeline={dataTemp} isCreateOfReply={false} createQuote={1} callbackData={handleDataCreate} />}
            {isQuoteAll && <TimelineCreateQuote 
              dataAuto={props.data.comment.mode !== MODE_CONTENT.CREATE_NORMAL? allContent :null} 
              isCommonMode={props.isCommon} 
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
    </div>
    {isShare && <ShareTimelineModal isTimelineAuto={props.data.comment?.mode !== MODE_CONTENT.CREATE_NORMAL} defaultTargetCreateTimeline = {props.defaultTargetCreateTimeline} isCommon={props.isCommon} data={props.data} isPrivateGroup={props.isPrivateGroup} closeModal={ () => setIsShare(false)} /> }
    {showModalDetail && !props.isCommon &&
    <TimelineDetail
      isPrivateGroup={props.isPrivateGroup}
      isCommon={props.isCommon}
      data={props.timelineItem} closeModal={() => { setIsDetail(false); setShowModalDetail(false) }} />}
  </>
}
const mapStateToProps = ({ timelineReducerState }: IRootState) => {
  return {
    timelineItem: timelineReducerState.timelineItem,
    timeLineFavorite: timelineReducerState.timeLineFavorite,
    listDataCommentAll: timelineReducerState.listDataComment,
    countCreate: timelineReducerState.countCreate
  }
};
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
)(TimelineItemControl);
