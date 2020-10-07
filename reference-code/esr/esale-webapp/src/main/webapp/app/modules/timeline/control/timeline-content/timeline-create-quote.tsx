import React, { useState, useRef, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster'
import { CommonUtil } from '../../common/CommonUtil'
import { handleCreateCommentAndReply, handClearMessValidateRequire } from '../../timeline-reducer'
import TimelineTargetDeliverPulldown from './timeline-target-deliver-pulldown'
import TimelineContentComment from './timeline-content-comment'
import { TARGET_TYPE } from '../../common/constants'
import { TimelinesType, CommentTimelinesType, QuoteTimelineType, ReplyTimelinesType, TargetDeliversType } from '../../models/get-user-timelines-type'
import { CreateCommentAndReply } from '../../models/create-comment-and-reply-model'
import moment from 'moment'
import TimelineTextarea from './timeline-textarea'
import TimelineHoverSuggestion from './timeline-hover-suggestion'
import { DATETIME_FORMAT } from 'app/config/constants'
import { isExceededCapacity } from 'app/modules/timeline/common/CommonUtil';
import { MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message'
import useEventListener from 'app/shared/util/use-event-listener'
import { tzToUtc } from 'app/shared/util/date-utils'

type ITimelineCreateQuoteProp = StateProps & DispatchProps & {
  // data when create quote
  dataTimeline: TimelinesType,
  // data comment
  dataComment?: CommentTimelinesType
  // data reply
  dataReply?: ReplyTimelinesType
  // to control disable drop down
  isDisableDropdown?: boolean,
  // to set defaul value drop-down
  defaultValueDropdown?: any,
  // to check form is modal
  isModal?: boolean,
  // to check
  isCommonMode?: boolean,
  // to call back
  callback?: () => void,
  callbackData?: (dataCreate) => void,
  isDetail?: boolean,
  createQuote?: number
  isCreateOfReply: boolean
  // button small
  isButtonSmall?: boolean
  // data Auto timeline
  dataAuto?: string
}

const TimelineCreateQuote = (props: ITimelineCreateQuoteProp) => {

  // to open dialog file
  const registerOpenDialogFile = useRef(null);
  const [groupSelected, setGroupSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [textCommentForm, setTextCommentForm] = useState("");
  const [listSuggestion, setListSuggestion] = useState([]);
  const [checkActionCreate, setCheckActionCreate] = useState(false);
  const [textCommentFormReal, setTextCommentFormReal] = useState(null);
  const [textFormat, setTextFormat] = useState(null);
  const [typeFormatText, setTypeFormatText] = useState(0)
  /* Start for style text */
  const [isShowToolFormat, setIsShowToolFormat] = useState(false);
  const [isActiveValidate, setIsActiveValidate] = useState(false)
  const [messageRequire, setMessageRequire] = useState(null)
  const [msgError, setMsgError] = useState('');
  const [msgSuccess] = useState('');
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const [focus, setFocus] = useState(false);

   /**
   * reset active validate when reset message info
   */
  useEffect(() => {
    if(props.messageValidateRequire && isActiveValidate) {
      setIsActiveValidate(false);
      setMessageRequire(props.messageValidateRequire);
      props.handClearMessValidateRequire();
    }
  }, [props.messageValidateRequire])

  const autoFillTagetDeliver = (listTargetFill) =>{
    const listTarget :TargetDeliversType[]  = [];
    if(listTargetFill?.length > 0){
      listTargetFill.filter((obj) =>( (obj.targetType === TARGET_TYPE.EMPLOYEE && Number(obj.targetId)  !==  Number(CommonUtil.getUserLogin().employeeId) ) || obj.targetType === TARGET_TYPE.DEPARTMENT ) && obj.targetName !== null ).forEach((item)=>{
        listTarget.push(item)
      })
      const targetCompany: TargetDeliversType = {
        targetType: 2,
        targetId: -100,
        targetName: translate('timeline.common.target-all')
      }
      if (listTargetFill?.find((obj) => (obj.targetType === TARGET_TYPE.ALL))) {
        listTarget.unshift(targetCompany);
      }
      
    }
    setListSuggestion(CommonUtil.removeDuplicateTarget(listTarget));
  }
  
  const halderBeforeAutoFill = (data) =>{ 
    let taggerDeliverUser: TargetDeliversType ={}
    taggerDeliverUser = {
      targetType: TARGET_TYPE.EMPLOYEE,
      targetId: data.createdUser,
      targetName: data.createdUserName
    }
    if( data?.targetDelivers.find(obj => obj.targetId === taggerDeliverUser.targetId && obj.targetType === taggerDeliverUser.targetType  )) {
      autoFillTagetDeliver(data?.targetDelivers)
    }
    else{
      autoFillTagetDeliver(data?.targetDelivers.concat(taggerDeliverUser))
    }
  }


  useEffect(() => {

    if(props.createQuote === 1){ // comment
      if(props.dataTimeline?.targetDelivers.length > 0){
        halderBeforeAutoFill(props.dataTimeline);
      }
    }else if(props.createQuote === 2 && !props.isCreateOfReply){ // reply
      if(props.dataComment?.targetDelivers.length > 0){
        halderBeforeAutoFill(props.dataComment);
      }
    }else if(props.createQuote === 2 && props.isCreateOfReply){ // reply reply
      if(props.dataReply?.targetDelivers.length > 0){
        halderBeforeAutoFill(props.dataReply);
      }
    }

    return () => {
      setCheckActionCreate(false)
    }
  }, [])


  /**
   * set value defaulte to value select
   */
  useEffect(() => {
    setGroupSelected(props.defaultValueDropdown);
  }, [props.defaultValueDropdown])

  /**
   * convert lisst target choose
   */
  const convertSuggestListToTargetDeliver = () => {
    const targetDelivers = [];
    const arrEmpployeIds = [];
    // default always have user login ID
    arrEmpployeIds.push(CommonUtil.getUserLogin().employeeId);
    //
    const arrDepartmentIds = [];
    if (listSuggestion && listSuggestion.length > 0) {
      listSuggestion.forEach(element => {
        if (element.targetType === TARGET_TYPE.EMPLOYEE) {
          arrEmpployeIds.push(element.targetId);
        } else if (element.targetType === TARGET_TYPE.DEPARTMENT) {
          arrDepartmentIds.push(element.targetId);
        }
        else if (element.targetType === TARGET_TYPE.ALL) {
          targetDelivers.push({ targetType: TARGET_TYPE.ALL, targetId: [-100] });
        }
      });
    }
    if (arrEmpployeIds.length > 0) {
      targetDelivers.push({ targetType: TARGET_TYPE.EMPLOYEE, targetId: arrEmpployeIds });
    }
    if (arrDepartmentIds.length > 0) {
      targetDelivers.push({ targetType: TARGET_TYPE.DEPARTMENT, targetId: arrDepartmentIds });
    }
    return targetDelivers;
  }

  /**
   * set obg create quote
  */
 // conver file
 const convertFileTo = (fileItem: any) => {
  const listArrayFile = [];
  if (fileItem) {
    fileItem.forEach(element => {
      listArrayFile.push({ fileName: element.name });
    });
  }
  return listArrayFile;
}

  useEffect(() => {
    if (props.timelineIdCreated > 0 && checkActionCreate) {
      let _roodId: any;
      let _parentId: any;
      if (props.createQuote === 1) { // create comment
        const quote: QuoteTimelineType = {
          timelineId: props.dataTimeline?.timelineId,
          parentId: props.dataTimeline?.timelineId,
          rootId: props.dataTimeline?.rootId,
          createdUser: props.dataTimeline?.createdUser,
          createdUserName: props.dataTimeline?.createdUserName,
          createdUserPhoto: props.dataTimeline?.createdUserPhoto,
          createdDate: props.dataTimeline?.createdDate,
          comment: {
            mode: 1,
            content: props.dataAuto? props.dataAuto: props.dataTimeline?.comment.content
          }
        }
        const dataCreate: CommentTimelinesType = {
          timelineId: props.timelineIdCreated,
          parentId: props.dataTimeline.timelineId,
          rootId: props.dataTimeline.timelineId,
          createdUser: Number(CommonUtil.getUserLogin().employeeId),
          createdUserName: CommonUtil.getUserLogin().employeeName,
          createdUserPhoto: CommonUtil.getUserLogin().employeeAvatar,
          createdDate: new Date().toISOString(),
          targetDelivers: listSuggestion,
          comment: { mode: 1, content: CommonUtil.trimSpaceHtml(textCommentForm) },
          reactions: [],
          isFavorite: false,
          replyTimelines: [],
          quotedTimeline: quote,
          attachedFiles: convertFileTo(files),
        }
        props.callbackData(dataCreate);
      } else if (props.createQuote === 2) { // create reply
        let quote: QuoteTimelineType = {}
        if (props.isCreateOfReply) {
          quote = {
            timelineId: props.dataReply?.timelineId,
            parentId: props.dataReply?.timelineId,
            rootId: props.dataReply?.rootId,
            createdUser: props.dataReply?.createdUser,
            createdUserName: props.dataReply?.createdUserName,
            createdUserPhoto: props.dataReply?.createdUserPhoto,
            createdDate: props.dataReply?.createdDate,
            comment: {
              mode: 1,
              content: props.dataReply?.comment.content
            }
          }
          _roodId = props.dataReply?.rootId
          _parentId = props.dataReply.parentId
        } else {
          quote = {
            timelineId: props.dataComment?.timelineId,
            parentId: props.dataComment?.timelineId,
            rootId: props.dataComment?.rootId,
            createdUser: props.dataComment?.createdUser,
            createdUserName: props.dataComment?.createdUserName,
            createdUserPhoto: props.dataComment?.createdUserPhoto,
            createdDate: props.dataComment?.createdDate,
            comment: {
              mode: 1,
              content: props.dataComment?.comment.content
            }
          }
          _roodId = props.dataComment?.rootId
          _parentId = props.dataComment.timelineId
        }
        const dataCreateReply: CommentTimelinesType = {
          timelineId: props.timelineIdCreated,
          parentId: _parentId,
          rootId: _roodId,
          createdUser: Number(CommonUtil.getUserLogin().employeeId),
          createdUserName: CommonUtil.getUserLogin().employeeName,
          createdUserPhoto: CommonUtil.getUserLogin().employeeAvatar,
          createdDate: new Date().toISOString(),
          targetDelivers: listSuggestion,
          comment: { mode: 1, content: CommonUtil.trimSpaceHtml(textCommentForm) },
          reactions: [],
          isFavorite: false,
          replyTimelines: [],
          quotedTimeline: quote,
          attachedFiles: convertFileTo(files),
        }
        props.callbackData(dataCreateReply);
      }
      // reset
      setTextCommentForm("");
      setTextCommentFormReal("");
      setListSuggestion([]);
      setFiles([]);

    }
  }, [props.timelineIdCreated])

  /**
   * push target choose item
   */
  const pushTargetChoose = (item: any) => {
    let isDuplicate = false;
    listSuggestion.forEach(element => {
      if (element.targetId === item.targetId && item.targetType === element.targetType) {
        isDuplicate = true;
        return;
      }
    });
    if (!isDuplicate) {
      listSuggestion.push(item);
    }
    setListSuggestion([...listSuggestion]);
  }

  /**
   * delete target item choose
   */
  const deleteTarget = (item: any) => {
    const listChooseItem = [];
    listSuggestion.forEach(element => {
      if (!(element.targetId === item.targetId && item.targetType === element.targetType)) {
        listChooseItem.push(element);
      }
    });
    setListSuggestion(listChooseItem ? listChooseItem : []);
  }


  /**
   * create timeline
   */

  const createQuote = (type) => {
    let contentTextQuote = null;
    if(!textareaRef.current.isEmptyForm()){
      contentTextQuote = CommonUtil.trimSpaceHtml(textCommentForm);
    }
    // set form
    if(files.length > 0 && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else {
      setMsgError('');
    }
    if (type === 1) {
      const formCreateComment: CreateCommentAndReply = {
        timelineId: props.dataTimeline.timelineId,
        rootId: props.dataTimeline.timelineId,
        targetDelivers: convertSuggestListToTargetDeliver(),
        actionType: 2,
        textComment: contentTextQuote,
        quoteContent: props.dataAuto? props.dataAuto: props.dataTimeline.comment.content,
        attachedFiles: files
      }
      props.handleCreateCommentAndReply(formCreateComment);
    } else if (type === 2) {
      let timelineIdtemp: any
      let roodIdtemp: any
      let quoteContentTemp: any
      if (props.isCreateOfReply) {
        timelineIdtemp = props.dataReply.parentId;
        roodIdtemp = props.dataReply.rootId;
        quoteContentTemp = props.dataReply.comment.content
      } else {
        timelineIdtemp = props.dataComment.timelineId;
        roodIdtemp = props.dataComment.parentId;
        quoteContentTemp = props.dataComment.comment.content
      }
      const formCreateReply: CreateCommentAndReply = {
        timelineId: timelineIdtemp,
        rootId: roodIdtemp,
        targetDelivers: convertSuggestListToTargetDeliver(),
        actionType: 2,
        textComment: contentTextQuote,
        quoteContent: quoteContentTemp,
        attachedFiles: files
      }
      props.handleCreateCommentAndReply(formCreateReply);
    }

    setCheckActionCreate(true);
  }
  /**
   * merge file form input to list files
   */
  const mergeFiles = (newFileAdded) => {
    for (let i = 0; i < newFileAdded.length; i++) {
      const a = newFileAdded[i];
      let exist = false;
      for (let j = 0; j < files.length; j++) {
        const b = files[j];
        if (b.name === a.name && b.lastModified === a.lastModified) {
          exist = true;
          break;
        }
      }
      if (!exist) {
        files.push(a);
      }
    }
    setFiles([...files]);
  };

  /**
   *  delete wwhen change files
   */
  const handleFileChange = (event) => {
    const file = event.target.files;
    if (file.length > 0) {
      mergeFiles(file);
    }
  };

  /**
  * change comment when change input
  */
  const changeTextCommentForm = (text) => {
    setTextCommentForm(text);
  }

  /**
   * delete item file choose
   */
  const deleteItemFile = (itemFile) => {
    const fileArr = [];
    for (let j = 0; j < files.length; j++) {
      const b = files[j];
      if (itemFile.name === b.name && itemFile.lastModified === b.lastModified) {
        continue;
      } else {
        fileArr.push(b);
      }
    }
    setFiles(fileArr);
  };

  // handle show option selected format text
  const handleShowFormatText = (type: number) =>{
    if(type === 1){
      setTextFormat(['underline'])
      setTypeFormatText(1);
    }else if (type === 2){
      setTextFormat(['bold'])
      setTypeFormatText(2)
    }else if (type === 3){
      setTextFormat(['italic'])
      setTypeFormatText(3)
    }else if (type === 4){
      setTextFormat(['strikeThrough'])
      setTypeFormatText(4)
    }
    setIsShowToolFormat(false)
  }

  const handleClickOutsidePulldown = (e) => {
    if (fileRef.current && !fileRef.current.contains(e.target)) {
      setMsgError('');
    }
  }
  useEventListener('mousedown', handleClickOutsidePulldown);

  const displayMessage = () => {
    if ((!msgError || msgError.length <= 0) && (!msgSuccess || msgSuccess.length <= 0)) {
      return <></>;
    }
    return (
      <BoxMessage
        messageType={msgError && msgError.length > 0 ? MessageType.Error : MessageType.Success}
        message={msgError && msgError.length > 0 ? msgError : msgSuccess}
        className="max-width-auto"
      />
    );
  };

  return (
    <div className="timeline-form-search form-search-quote mt-2 mb-4 border-radius-10">
      <div className={props.isModal ? 'mb-1' : ''} ref={fileRef}>
        {displayMessage()}
      </div>
      <div className={`form-group mb-1 mt-1 no-before ${messageRequire ?"error-div-timeline" : "timeline-input-hover-blue"} ${focus ? 'timeline-input-focus-blue' : ''}`}>
        {listSuggestion.length > 0 &&
          <div className="wrap-tag tag-file mt-0 popup-wrap-tag show-list-item height-auto flex-wrap-wrap">
            { listSuggestion.map((item) => {
              return (
                < TimelineHoverSuggestion data={item} deleteTarget = {() => {deleteTarget(item)}} key={`${item.targetId}`} isCommonModes={props.isCommonMode}/>
              )
            })}
          </div>
        }
        <div className="input-normal card-comment-two">
          <div className="card-more-comment ml-3 mr-3 pb-0 pt-0 border-0 height-auto timeline-ic-quote">
            <div className="content style-3 mb-0 overflow-hidden">
              <div className="text mt-2">
                {/* create Quote of post */}
                {props.createQuote === 1 && <TimelineContentComment data={props.dataAuto? props.dataAuto: props.dataTimeline?.comment?.content} isHighlight={false} />}
                {/* create quote of comment */}
                {props.createQuote === 2 && !props.isCreateOfReply && <TimelineContentComment data={props.dataComment?.comment?.content} isHighlight={false} />}
                {/* create quote of reply */}
                {props.createQuote === 2 && props.isCreateOfReply && <TimelineContentComment data={props.dataReply?.comment?.content} isHighlight={false} />}
              </div>
            </div>
          </div>
          <TimelineTextarea
            ref={textareaRef}
            autoFocus={true}
            onChange={changeTextCommentForm}
            textFormat={textFormat}
            value={textCommentFormReal}
            isShowToolFormat={isShowToolFormat}
            className="input-normal"
            messRequire={messageRequire}
            onClearMess={() => setMessageRequire(null)}
            placeholder={translate('timeline.control.local-tool.placeholders-content')}
            onFocus={() => {setFocus(true)}} 
            onBlur={() => {setFocus(false)}}
            />

          {files.length > 0 && <div className="wrap-tag tag-file popup-wrap-tag height-auto flex-wrap mt-2">
            {files.length > 0 && files.map((item, index) => {
              return <div key={index} className={`tag mb-1 ${props.isCommonMode ? 'w48' : ''} width-130`}>
                <div className="mission-wrap">
                  <div className="item d-flex">
                    <img className="file-image" src={CommonUtil.getUrlImageTypeFile(item.name)} />
                    <span className="font-size-12 text-ellipsis">{item.name}</span>
                  </div>
                </div>
                <button type="button" onClick={() => { deleteItemFile(item) }} className="close">×</button>
              </div>
            })}
          </div>}
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex align-items-center">
          <TimelineTargetDeliverPulldown isCommonMode={props.isCommonMode} timelineGroupId={groupSelected ? groupSelected.timelineGroupId : props.dataTimeline?.timelineGroupId} onChooseItem={(item: any) => pushTargetChoose(item)} listItemChoose ={listSuggestion} />
          <button tabIndex={0} title="" className="icon-finder ml-2 btn-file-focus" onClick={() => { registerOpenDialogFile.current.click(); }}>
            <input id="uploadBtn" type="file" hidden multiple className="upload" onChange={() => { handleFileChange(event) }} value={undefined} ref={registerOpenDialogFile} />
          </button>
          {/** Start code for change style text */}
          <div className={`${isShowToolFormat ? "active" : ""} position-relative`}>
            {( typeFormatText === 0 || typeFormatText === 1) && <button type="button" title="" className="icon-text text-custom font-size-18 color-666 ml-2 text-underline button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}>A</button> }
            {typeFormatText === 2 && <button type="button" title="" className="text-custom font-size-18 color-666 ml-2 button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}>B</button> }
            {typeFormatText === 3 && <button type="button" title="" className="text-custom font-size-18 color-666 ml-2 button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}>I</button> }
            {typeFormatText === 4 && <button type="button" className="text-custom font-size-18 color-666 ml-2 icon-strikethrough button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}> <img src="/content/images/ic-strikethrough.svg" alt=""/> </button> }
            <div className="pupop-choosetext d-flex">
              <a className="item_choosetext text-underline" onClick={() =>  handleShowFormatText(1)  }>A</a>
              <a className="item_choosetext" onClick={() =>  handleShowFormatText(2) }>B</a>
              <a className="item_choosetext" onClick={() =>  handleShowFormatText(3) }>I</a>
              <a className="item_choosetext icon-strikethrough" onClick={() => handleShowFormatText(4) }> </a>
            </div>
          </div>
          {/** End code for change style text */}
        </div>
        <button onClick={() => { createQuote(props.createQuote); setIsActiveValidate(true); }} className={`button-blue ${props.isButtonSmall? 'small':''}`} >{translate('timeline.control.local-tool.post-comment')}</button>
      </div>
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState }: IRootState) => ({
  timelineIdCreated: timelineReducerState.timelineIdCreated,
  messageValidateRequire: timelineReducerState.messageValidateRequire
});

const mapDispatchToProps = {
  handleCreateCommentAndReply, handClearMessValidateRequire
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineCreateQuote);
