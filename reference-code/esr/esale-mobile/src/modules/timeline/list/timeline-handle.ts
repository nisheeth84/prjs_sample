import { STATUS_TIMELINE, ACTION_TYPE } from "../../../config/constants/enum";

export const handleParamComment = (data: any) => {

  const roodId = data.item.rootId ? data.item.rootId.toString() : data.item.timelineId.toString();
  const timelineId = STATUS_TIMELINE.REPLY_COMMENT === data.status ? data.item.parentId.toString() : data.item.timelineId.toString();
  const actionType = data?.item?.isQuote ? ACTION_TYPE.QUOTE : ACTION_TYPE.COMMENT
  const formData = new FormData();
  // switch (data.status) {
  //   case STATUS_TIMELINE.REPLY_COMMENT:
  //     formData.append("timelineId", data.item.parentId.toString());console
  //     break;
  
  //   default:
  //     formData.append("timelineId", data.item.timelineId.toString());
  //     return;
  // }

  formData.append("timelineId", timelineId);
  formData.append("targetDelivers[0].targetType", "1");
  formData.append("rootId", roodId);
  formData.append("targetDelivers[0].targetId[0]", data.employeeId.toString());
  formData.append("actionType", actionType);
  formData.append("textComment", `${data.content}`);
  
  // TODO: file
  // {
  //   !item.fileChoosen || formData.append("attachedFiles", JSON.stringify(item.fileChoosen));
  // }
  {!data?.item?.isQuote || formData.append("quoteContent", `${data.item.comment.content}`)}
  
  return formData;
} 