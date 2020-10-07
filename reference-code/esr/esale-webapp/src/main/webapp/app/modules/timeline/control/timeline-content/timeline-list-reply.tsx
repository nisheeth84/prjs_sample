import React, { useState, useEffect } from 'react'
import { CommentTimelinesType, GetCommentAndReply, ReplyTimelinesType } from '../../models/get-user-timelines-type';
import TimelineViewReply from './timeline-view-reply'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { handleGetReplyAll } from '../../timeline-common-reducer'
import _ from 'lodash';

type ITimelineListReplyProp = StateProps & DispatchProps & {
  dataTimeline: any
  isCreate: number
  dataComment: CommentTimelinesType
  dataCreateReply: ReplyTimelinesType
  callbackData?: (dataCreate) => void
  isNotMemberOfGroup: boolean
  isCommon?: boolean
  isModalDetail?: boolean
}

const TimelineListReply = (props: ITimelineListReplyProp) => {
  // list reply
  const [listReply, setListReply] = useState([])

  // handle extend reply
  const handleExtendReply = (dataComment: CommentTimelinesType, typeTemp) => {
    const paramTemp: GetCommentAndReply = {
      timelineId: dataComment.timelineId,
      type: typeTemp,
      rootId: dataComment.rootId
    }
    props.handleGetReplyAll(paramTemp, dataComment.timelineId)
  }

  useEffect(() => {
    setTimeout(() => {
      handleExtendReply(props.dataComment, 2);
    }, 1000)
  }, [])

  useEffect(() => {
    const listCreateReplyTemp: ReplyTimelinesType[] = []
    if (props.dataCreateReply.parentId === props.dataComment.timelineId) {
      listCreateReplyTemp.push(props.dataCreateReply)
      setListReply(_.cloneDeep(listReply).concat(listCreateReplyTemp))
    }
  }, [props.dataCreateReply])

  useEffect(() => {
    if (props.listDataReply.has(props.dataComment.timelineId)) {
      setListReply(props.listDataReply.get(props.dataComment.timelineId).listReplies)
    }
  }, [props.countReply])

  const handleDataCallback = (data) => {
    props.callbackData(data);
  }

  return (
    <>
      {listReply && listReply.length > 0 && listReply.map((item, index) => {
        return (
          < TimelineViewReply isModalDetail={props.isModalDetail} isCommon={props.isCommon} dataTimeline={props.dataTimeline} dataComment={props.dataComment} dataItemReply={item} key={`${index}_${item.timelineId}`} callbackDataCreateReply={handleDataCallback} isNotMemberOfGroup = {props.isNotMemberOfGroup} />
        )
      })
      }
    </>
  )
}

const mapStateToProps = ({ timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  listDataReply: timelineCommonReducerState.dataListReply,
  timeLineFavorite: timelineReducerState.timeLineFavorite,
  countReply: timelineCommonReducerState.countReply
});

const mapDispatchToProps = {
  handleGetReplyAll
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineListReply);

