import React, { useState, useEffect } from 'react'
import { CommentTimelinesType, GetCommentAndReply, TimelinesType } from '../../models/get-user-timelines-type'
import TimelineViewCommentDetail from './timeline-view-comment-detail'
import { translate } from 'react-jhipster'
import { connect } from 'react-redux'
import { IRootState } from 'app/shared/reducers'
import { handleGetCommentAndRepliesRenew, handleGetCommentAndRepliesOlder } from '../../timeline-reducer'

type ITimelineViewCommentProp = StateProps & DispatchProps & {
  dataTimeline: TimelinesType;
  dataComment?: CommentTimelinesType[];
  isMulti?: number;
  isNotMemberOfGroup: boolean
  isModalDetail?: boolean
  timelineId?: number;
  dataCreateComment?: CommentTimelinesType;
  isCommon?: any
  isShowCreate: boolean
  timelineGroupId?: number
  callBackShowCreate: () => void
  callbackCheckData?: (dataCheck) => void
}

const TimelineViewComment = (props: ITimelineViewCommentProp) => {
  const [listCommentReply, setListCommentReply] = useState([])
  const [listCommentCreate, setListCommentCreate] = useState([])
  const [showCommentMode, setShowCommentMode] = useState(false)
  const [showCommentRenew, setShowCommentRenew] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [listCommentOlder, setListCommentOlder] = useState([])
  const [listCommentRenew, setListCommentRenew] = useState([])
  const [showBtnRenew, setShowBtnRenew] = useState(true)
  const [showBtnOlder, setShowBtnOlder] = useState(true)

  useEffect(() => {
    const commentReplys: CommentTimelinesType[] = []
    if (props.dataComment) {
      let idx = 0;
      if (props.dataComment?.length > 5) {
        for (let i = props.dataComment?.length - 1; i >= 0; i--) {
          commentReplys.unshift(props.dataComment[i]);
          if (props.dataComment[i].isFavorite) {
            idx = props.dataComment?.length - i;
          }
          if (idx > 0) {
            setIsFavorite(true)
            if (idx <= 5 && commentReplys?.length >= 5) break
            if (idx > 5) break
          }
        }
        setListCommentReply(commentReplys)
      } else {
        setListCommentReply(props.dataComment)
      }
    }
    setListCommentCreate([]);
  }, [props.dataComment])

  useEffect(() => {
    const commentCreates: CommentTimelinesType[] = []
    if (props.isShowCreate && props.dataCreateComment && props.dataCreateComment.timelineId > 0) {
      commentCreates.push(props.dataCreateComment);
      props.callBackShowCreate();
    }
    setListCommentCreate(listCommentCreate.concat(commentCreates));
  }, [props.isShowCreate])

  useEffect(() => {
    if (props.listDataCommentOlder.has(props.timelineId)) {
      setListCommentOlder(props.listDataCommentOlder.get(props.timelineId).listCommentOlder);
    }
  }, [props.countCommentOlder])

  useEffect(() => {
    if (props.listDataCommentRenew.has(props.timelineId)) {
      setListCommentRenew(props.listDataCommentRenew.get(props.timelineId).listCommentRerew);
    }
  }, [props.countCommentRenew])

  /**
  * render class for comment
  */
  const getClassComment = () => {
    if (props.isModalDetail) {
      return "box-share-child";
    } else if (props.isCommon) {
      return "box-share background-col-F9";
    } else {
      return "box-share-comment mt-2";
    }
  }
  /**
   * call api get comment and reply renew
   *
   */

  const hanldGetComentAndReplyRenew = (param: CommentTimelinesType, typeParam: number) => {
    const paramTemp: GetCommentAndReply = {
      timelineId: props.timelineId,
      type: typeParam,
      newerCommentId: param.timelineId,
      rootId: param.rootId
    }
    setShowBtnRenew(false)
    setShowCommentRenew(true)
    props.handleGetCommentAndRepliesRenew(paramTemp)
  }
  const handleGetCommentAndReplyOlder = (param: CommentTimelinesType, typeParam: number) => {
    if (!showCommentMode) {
      const paramTemp: GetCommentAndReply = {
        timelineId: props.timelineId,
        type: typeParam,
        olderCommentId: param.timelineId,
        rootId: param.rootId
      }
      props.handleGetCommentAndRepliesOlder(paramTemp);
    }
    setShowBtnOlder(false)
    setShowCommentMode(!showCommentMode);
  }


  const renderCommentOlder = () => {
    return (
      <>
        {showCommentMode && listCommentOlder && listCommentOlder.length > 0 && listCommentOlder.map((itemCommetOlder, index) => {
          return (
            <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={itemCommetOlder} indexComment={index} key={index + "_" + itemCommetOlder.timelineId} />
          )
        })
        }
      </>
    )
  }

  return (
    <>
      {(listCommentReply?.length > 0 || listCommentCreate?.length > 0) &&
        <div className={getClassComment()}>
          {/* > 5 and not favorite  */}
          {!isFavorite &&
            <>
              {/* lớn hơn 5 */}
              {listCommentReply?.length > 5 &&
                <>
                  {renderCommentOlder()}
                  {showBtnOlder &&
                    <div className={`more-info ${props.isCommon ? 'text-right' : ''}`} >
                      <button className={`button-primary button-border button-more-info  ${props.isModalDetail ? "position-relative mt-3" : ""}`}
                        onClick={() => { handleGetCommentAndReplyOlder(listCommentReply[listCommentReply?.length - 5], 1) }} >{translate('timeline.list.btn-expand-comment')}</button>
                    </div>
                  }
                  {listCommentReply.map((element, index) => {
                    if (index >= listCommentReply?.length - 5) {
                      return (
                        <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={element} indexComment={index} key={index + "_" + element.timelineId} />
                      )
                    }
                  })
                  }
                </>
              }

              {listCommentReply?.length <= 5 && listCommentReply.map((itemComment, index) => {
                return (
                  <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={itemComment} indexComment={index} key={index + "_" + itemComment.timelineId} />
                )
              })
              }
            </>
          }

          {/* > 5 and is favorite */}
          {isFavorite &&
            <>
              { props.dataComment?.length > 5 &&
                <>
                  {/* mode older 5 */}
                  {renderCommentOlder()}
                  {showBtnOlder && listCommentReply.length < props.dataComment.length &&
                    <div className={`more-info ${props.isCommon ? 'text-right' : ''}`} >
                      <button className={`button-primary button-border button-more-info   ${props.isModalDetail ? "position-relative mt-2" : "mb-3"}`}
                        onClick={() => { handleGetCommentAndReplyOlder(listCommentReply[0], 1) }} >{translate('timeline.list.btn-expand-comment')}</button>
                    </div>
                  }
                  {/* show 5  */}
                  {listCommentReply.map((item, index) => {
                    if (index < 5) {
                      return (
                        <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={item} indexComment={index} key={index + "_" + item.timelineId} />
                      )
                    }
                  })
                  }
                  {/* btn renew */}
                  {showBtnRenew && listCommentReply?.length > 5 &&
                    <div className={`more-info ${props.isCommon ? 'text-right' : ''}`} >
                      <button className={`button-primary button-border button-more-info  ${props.isModalDetail ? "position-relative mt-3" : ""}`}
                        onClick={() => { hanldGetComentAndReplyRenew(listCommentReply[4], 1) }} >{translate('timeline.list.btn-expand-comment')}</button>
                    </div>
                  }
                  {/* list comment renew */}
                  {showCommentRenew && listCommentRenew && listCommentRenew.length > 0 && listCommentRenew.map((itemRenew, index) => {
                    return (
                      <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={itemRenew} indexComment={index} key={index + "_" + itemRenew.timelineId} />
                    )
                  })}
                </>

              }
              {props.dataComment?.length <= 5 && props.dataComment.map((item, index) => {
                return (
                  <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={item} indexComment={index} key={index + "_" + item.timelineId} />
                )
              })
              }
            </>
          }

          {/* show create */}
          {listCommentCreate?.length > 0 && listCommentCreate.map((itemCreate, index) => {
            return (
              <TimelineViewCommentDetail dataTimeline={props.dataTimeline} timelineGroupId={props.timelineGroupId} isCommon={props.isCommon} isModalDetail={props.isModalDetail} isNotMemberOfGroup={props.isNotMemberOfGroup} dataComment={itemCreate} indexComment={index} key={index + "_" + itemCreate.timelineId} />
            )
          })
          }
        </div>
      }
    </>
  );
}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  listDataCommentRenew: timelineReducerState.listDataCommentRenew,
  listDataCommentOlder: timelineReducerState.listDataCommentOlder,
  countCommentOlder: timelineReducerState.countCommentOlder,
  countCommentRenew: timelineReducerState.countCommentRenew
});

const mapDispatchToProps = {
  handleGetCommentAndRepliesRenew,
  handleGetCommentAndRepliesOlder
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineViewComment);
