import React, { useState, useRef, useEffect } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { translate } from 'react-jhipster'
import { CommonUtil } from '../../common/CommonUtil'
import { CreateTimeline } from '../../models/create-timeline-model'
import { handleToggleCreateTimeLine, handleCreateCommentAndReply, handClearMessValidateRequire } from '../../timeline-reducer'
import { changeScreenMode , handleSetValuePost} from '../../timeline-common-reducer'
import { handleCreateExtTimeLine } from '../../timeline-common-reducer'
import TimelineGroupPulldown from './timeline-group-pulldown'
import TimelineTargetDeliverPulldown from './timeline-target-deliver-pulldown'
import { DataType } from '../../models/suggest-timeline-group-name-model'
import { TARGET_TYPE, CREATE_POSITION } from '../../common/constants'
import { TimelinesType, TargetDeliversType, ReplyTimelinesType } from '../../models/get-user-timelines-type'
import { CreateCommentAndReply, TargetDelivers } from '../../models/create-comment-and-reply-model'
import {CommentTimelinesType} from '../../models/get-user-timelines-type'
import moment from 'moment'
import TimelineTextarea from './timeline-textarea'
import { DATETIME_FORMAT } from 'app/config/constants'
import TimelineHoverSuggestion from './timeline-hover-suggestion'
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message'
import { isExceededCapacity } from 'app/modules/timeline/common/CommonUtil';
import { MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import useEventListener from 'app/shared/util/use-event-listener'
import { tzToUtc } from 'app/shared/util/date-utils'

type ITimelineFormControlProp = StateProps & DispatchProps & {
  // data when create quote
  dataTimeline?: TimelinesType,
  // to control disable drop down
  isDisableDropdown?: boolean,
  // to set defaul value drop-down
  defaultValueDropdown?: any,
  // to check form is modal
  isModal?: boolean,
  // to call back
  callback?: (value: string) => void
  // createComment
  createComment?: number
  // createQuote
  createQuote?: boolean
  // createPost
  createPost?: boolean
  // callback data
  callbackData? : (dataCreate)=> void
  // commonMode
  isCommonMode?: boolean
  // data comment
  dataComment?: CommentTimelinesType
  dataReply?: ReplyTimelinesType
  // create of reply
  isCreateOfReply?: boolean
  // create position
  createPosition?: number
  // default Target Create Timeline for common
  defaultTargetCreateTimeline?: TargetDelivers
  // defaul taget deliver when create comment , reply
  defaultTagetCreateComentAndReply?: TargetDelivers[]
  // button small
  isButtonSmall?: boolean
  // listent is change Data
  isDataChange?: (isChange: boolean) => void;
   // defaul taget deliver for add modal timeline
   defaultTagetCreateAdEdit?: TargetDeliversType[]
}

const TimelineFormControl = (props: ITimelineFormControlProp) => {
  /**
   * create timeline form
   */
  const defaultTimelineForm: CreateTimeline = {
    employeeId: null,
    createPosition: null,
    targetDelivers: [],
    textComment: null,
    attachedFiles: []
  }

  const registerOpenDialogFile = useRef(null);
  const [groupSelected, setGroupSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [timelineForm] = useState(defaultTimelineForm);
  const [textCommentForm, setTextCommentForm] = useState("");
  const [textCommentFormReal, setTextCommentFormReal] = useState(null);
  const [listSuggestion, setListSuggestion] = useState([]);
  const [checkActionCreate, setCheckActionCreate] = useState(false);
  const [textFormat, setTextFormat] = useState(null);
  const [isShowToolFormat, setIsShowToolFormat] = useState(false);
  const [typeFormatText, setTypeFormatText] = useState(0)
  const [isActiveValidate, setIsActiveValidate] = useState(false)
  const [resetChannel, setResetChannel] = useState(false)
  const [messageRequire, setMessageRequire] = useState(null)
  // const [listTargetFill, setListsTargetFill] = useState([])
  const [msgError, setMsgError] = useState('');
  const [msgSuccess] = useState('');
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [focus, setFocus] = useState(false);
    
  /**
   * listen change settting
   */
  useEffect(() => {
    if(props.isChangeId) {
      setForceUpdate(forceUpdate+1);
    }
  }, [props.isChangeId])


  // listent is change Data
  useEffect(() => {
    if (props.isDataChange) {
      if ((groupSelected && groupSelected.timelineGroupId)
        || (listSuggestion && listSuggestion.length > 0)
        || (textCommentForm && textCommentForm.trim().length > 0)
        || (files && files.length > 0)
      )
        props.isDataChange(true);
      else
        props.isDataChange(false);
    }
  }, [groupSelected, listSuggestion, textCommentForm, files])

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
  /**
   * set default action create when out component
   */
  useEffect(() => {
    if(props.createComment > 0){
      if(props.createComment === 1){   // comment
        if(props.dataTimeline?.targetDelivers.length > 0){
          halderBeforeAutoFill(props.dataTimeline);
        }
      }else if(props.createComment === 2 && !props.isCreateOfReply){ // reply
        if(props.dataComment?.targetDelivers.length > 0){
          halderBeforeAutoFill(props.dataComment);
        }
      } else if(props.createComment === 2 && props.isCreateOfReply ){ // reply
        if(props.dataReply?.targetDelivers.length > 0){
          halderBeforeAutoFill(props.dataReply);
        }
      }
    }
    if(props.createPost){
      props.changeScreenMode(false);
    }
    return () => {
      setCheckActionCreate(false)
    }
  }, [])

  /**
   * auto fill target deliver for case add timeline
   */
  useEffect(() => {
    if(props.defaultTagetCreateAdEdit && props.defaultTagetCreateAdEdit.length > 0){
      autoFillTagetDeliver(props.defaultTagetCreateAdEdit);
    }
  }, [])


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

  const handleDirtyCheck = (text) =>{
    if(props.createPost){
      if(text.trim().length !==0 ){
        props.handleSetValuePost(text);
        props.changeScreenMode(true);
      }else{
        props.changeScreenMode(false);
        props.handleSetValuePost("");
      }
    }
  
  }

  /**
   * set value defaulte to value select
   */
  useEffect(() => {
    setGroupSelected(props.defaultValueDropdown);
  }, [props.defaultValueDropdown])

  /**
   * change comment when change input
   */
  const changeTextCommentForm = (text) => {
    setTextCommentForm(text);
  }
  /**
   * reset form create
   */
  const resetForm = () => {
    setTextCommentForm("");
    setTextCommentFormReal("");
    setFiles([]);
    setListSuggestion([])
    props.handleSetValuePost("")
    props.changeScreenMode(false)
  }

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
   * pussh multi item target
   * @param lstItem
   */
  const pushMultiTargetChoose = (lstItem: any[]) => {
    if(lstItem){
      lstItem.forEach(element => {
        pushTargetChoose(element);
      });
    }
  }
  // conver file
  const convertFileTo = (fileItem: any) => {
    const listArrayFile = [];
    if(fileItem) {
      fileItem.forEach(element => {
        listArrayFile.push({fileName: element.name});
      });
    }
    return listArrayFile;
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
   * convert list target choose
   */
  const convertSuggestListToTargetDeliver = () => {
    const targetDelivers = [];
    const arrEmpployeIds = [];
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
    if(groupSelected) {
      targetDelivers.push({ targetType: TARGET_TYPE.GROUP, targetId: [groupSelected.timelineGroupId]});
    }
    if(props.defaultTargetCreateTimeline) {
      targetDelivers.push(props.defaultTargetCreateTimeline);
    }
     // default have user login ID when have no target deliver
      if(targetDelivers.length === 0){
        arrEmpployeIds.push(CommonUtil.getUserLogin().employeeId);
        targetDelivers.push({ targetType: TARGET_TYPE.EMPLOYEE, targetId: arrEmpployeIds });
      }
    //
    return targetDelivers;
  }
  /**
   * handle create Comment and reply
   */
  useEffect(()=>{
    if (props.timelineIdCreated > 0 && checkActionCreate) {
        if(props.createComment === 1){ // create comment
           const dataCreateComment: CommentTimelinesType = {
            timelineId: props.timelineIdCreated,
            parentId: props.dataTimeline.timelineId,
            rootId: props.dataTimeline.timelineId,
            createdUser: Number(CommonUtil.getUserLogin().employeeId) ,
            createdUserName: CommonUtil.getUserLogin().employeeName,
            createdUserPhoto: CommonUtil.getUserLogin().employeeAvatar,
            createdDate: new Date().toISOString(),
            targetDelivers: listSuggestion,
            comment: { mode: 1, content: CommonUtil.trimSpaceHtml(textCommentForm) },
            reactions: [],
            isFavorite: false,
            replyTimelines: [],
            quotedTimeline: {},
            attachedFiles:convertFileTo( files)
          }
          props.callbackData(dataCreateComment);
        }else if(props.createComment === 2){ // create reply
          const dataCreateReply: CommentTimelinesType = {
            timelineId: props.timelineIdCreated,
            parentId: props.dataComment.timelineId,
            rootId: props.dataComment.parentId,
            createdUser: Number(CommonUtil.getUserLogin().employeeId),
            createdUserName: CommonUtil.getUserLogin().employeeName,
            createdUserPhoto: CommonUtil.getUserLogin().employeeAvatar,
            createdDate: new Date().toISOString(),
            targetDelivers: listSuggestion,
            comment: { mode: 1, content: CommonUtil.trimSpaceHtml(textCommentForm) },
            reactions: [],
            isFavorite: false,
            replyTimelines: [],
            quotedTimeline: {},
            attachedFiles: convertFileTo( files)
          }
          props.callbackData(dataCreateReply);
        }
        // reset
        resetForm();
      // set to show message validate for each component
      setIsActiveValidate(false);
    }
  },[props.timelineIdCreated ])

    /**
   * handle create timeline post
   */
  useEffect(() => {
    if (props.createPost && props.timelineIdPostCreated > 0 && !props.isCommonMode && !props.isModal) {
      resetForm();
      // set to show message validate for each component
      setIsActiveValidate(false);
      setResetChannel(true)
      setGroupSelected(props.defaultValueDropdown)
      setTimeout(() => {
        setResetChannel(false)
      }, 1000);
    }
    setTypeFormatText(0);

  }, [props.timelineIdPostCreated])

  /**
   * handle create timeline post common
   */
  useEffect(()=>{
    if(props.createPost && props.timelineIdExtPostCreated && props.isCommonMode) {
      resetForm();
      // set to show message validate for each component
      setIsActiveValidate(false);
      setResetChannel(true)
      setGroupSelected(props.defaultValueDropdown)
      setTimeout(() => {
        setResetChannel(false)
      }, 1000);
    }
    setTypeFormatText(0);

  },[ props.timelineIdExtPostCreated])

  /**
   * handle call back comment out
   */
  useEffect(()=>{
     // call back data to check dirty call
     if(props.callback) {
      props.callback(textCommentForm)
    }
  },[textCommentForm])

  /**
   * resart when not in group
   */
  useEffect(()=>{
     if (props.errorCode === "ERR_TIM_0003") {
      resetForm();
      setResetChannel(true);
      setTimeout(() => {
        setResetChannel(false)
      }, 500);
     }

  },[props.errorCode])

  /**
   * create timeline
   */
  const createTimeline = () => {
    if(textareaRef.current.isEmptyForm()){
      timelineForm.textComment = null;
    }
    else {
      timelineForm.textComment = CommonUtil.trimSpaceHtml(textCommentForm);
    }
    timelineForm.createPosition =  props.createPosition? props.createPosition: CREATE_POSITION.PERSONAL;
    // set List Devliver
    timelineForm.targetDelivers = convertSuggestListToTargetDeliver();
    // set List Files
    if(files.length > 0 && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else {
      timelineForm.attachedFiles = files;
      setMsgError('');
    }
    // set to show message validate for each component
    setIsActiveValidate(true);
    // set form
    if(props.isCommonMode) {
      props.handleCreateExtTimeLine(timelineForm);
    } else {
      props.handleToggleCreateTimeLine(timelineForm);
    }
  }
  /**
   * createComment
   *
   */
  const createComment = (type) => {
    // set to show message validate for each component
    setIsActiveValidate(true);
    // set form
    if(files.length > 0 && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else {
      setMsgError('');
    }
    let commentTextCmt = null;
    if(!textareaRef.current.isEmptyForm()){
      commentTextCmt = CommonUtil.trimSpaceHtml(textCommentForm);
    }
    if(type === 1 ){
      const formCreateComment: CreateCommentAndReply = {
        timelineId: props.dataTimeline.timelineId,
        rootId: props.dataTimeline.timelineId,
        targetDelivers: convertSuggestListToTargetDeliver(),
        actionType: 1,
        textComment: commentTextCmt,
        attachedFiles: files,
      }
      props.handleCreateCommentAndReply(formCreateComment);
    }else if(type === 2){
      const formCreateReply: CreateCommentAndReply = {
        timelineId: props.dataComment.timelineId,
        rootId: props.dataComment.parentId,
        targetDelivers: convertSuggestListToTargetDeliver(),
        actionType: 1,
        textComment: commentTextCmt,
        attachedFiles: files,
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

  const handleClickOutsidePulldown = (e) => {
    if (fileRef.current && !fileRef.current.contains(e.target)) {
      setMsgError('');
    }
  }
  useEventListener('mousedown', handleClickOutsidePulldown);

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
    if (registerOpenDialogFile.current) {
      registerOpenDialogFile.current.value = null;
    }
  };

  const getClassMode = () => {
    if(props.isCommonMode) {
      if(props.createPost) {
        return "common-timeline-form-search-tag timeline-form-search p-0";
      }
      return "common-timeline-form-search-tag timeline-form-search";
    } else if (props.isModal) {
      return "timeline-form-search border-radious-12 mt-0";
    } else {
      return "timeline-form-search py-3 position-static";
    }
  }

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
  /* End for style text */
  return (
    <div className={getClassMode()}>
      <div className={props.isModal ? 'mb-1' : ''} ref={fileRef}>
        {displayMessage()}
      </div>
      <div className={props.isModal ? 'form-group  mb-1' : 'form-group overflow-normal mb-2 mt-1'}>
        <div className={`position-relative ${messageRequire ?"error-div-timeline" : "timeline-input-hover-blue"} ${focus ? 'timeline-input-focus-blue' : ''} common-timeline-require`}>
          {listSuggestion.length > 0 &&
            <div className="wrap-tag tag-file mt-0 popup-wrap-tag show-list-item height-auto flex-wrap-wrap">
              { listSuggestion.map((item) => {
                return (
                <div key={`${item.targetId}`}>
                    < TimelineHoverSuggestion data={item} deleteTarget = {() => {deleteTarget(item)}}/>
                  </div>
                )
              })}
            </div>
          }
          {!props.isModal
            &&
            <>
              <TimelineTextarea ref={textareaRef} 
                autoFocus = {true} 
                checkValueText={handleDirtyCheck} 
                onChange={changeTextCommentForm}
                textFormat={textFormat}
                value={textCommentFormReal}
                isShowToolFormat={isShowToolFormat}
                className="input-normal mh-auto"
                messRequire={messageRequire}
                placeholder={translate('timeline.control.local-tool.placeholders-content')}
                onClearMess= {() => setMessageRequire(null)}
                onFocus={() => {setFocus(true)}}
                onBlur={() => {setFocus(false)}}
                />
            </>
          }
          {props.isModal
            &&
            <>
              <TimelineTextarea ref={textareaRef}  autoFocus = {true}
                onChange={changeTextCommentForm}
                textFormat={textFormat}
                value={textCommentFormReal}
                isShowToolFormat={isShowToolFormat}
                className="input-normal"
                messRequire={messageRequire}
                onClearMess= {() => setMessageRequire(null)}
                placeholder={translate('timeline.control.local-tool.placeholders-content')} 
                classCheckFile="check-file"
                onFocus={() => {setFocus(true)}}
                onBlur={() => {setFocus(false)}}
              />
            </>
          }
          {files.length > 0 && <div className="wrap-tag tag-file popup-wrap-tag height-auto flex-wrap mt-2">
            {files.length > 0 && files.map((item, index) => {
              return <div key={index} className={`tag mb-1 ${props.isCommonMode ? 'w-48' : ''} width-130`}>
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
          { !props.createComment &&
            <TimelineGroupPulldown
              isDisabled={props.isDisableDropdown}
              defaultValue={props.defaultValueDropdown}
              isResetChannel={resetChannel}
              chooseGroup={(item: DataType) => { setGroupSelected(item); setListSuggestion([]);}}
              isCommonMode={props.isCommonMode}
              />
          }
          <TimelineTargetDeliverPulldown
            timelineGroupId={groupSelected ? groupSelected.timelineGroupId : props.dataTimeline?.timelineGroupId}
            onChooseItem={(item: any) => pushTargetChoose(item)}
            listItemChoose ={listSuggestion}
            onPushMulti = {(listItem: any[])=> pushMultiTargetChoose(listItem)}
            isCommonMode={props.isCommonMode}
          />
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
        {props.createPost && <button type="button" onClick={() => { createTimeline() }} className="button-blue" >{translate('timeline.control.local-tool.post')}</button>}
        {props.createComment > 0 && <button type="button" onClick={() => { createComment(props.createComment) }} className={`button-blue ${props.isButtonSmall? 'small':''}`} > {translate('timeline.control.local-tool.post-comment')}</button>}
      </div>
    </div>
  );
}

const mapStateToProps = ({ timelineReducerState, employeeDetailAction }: IRootState) => ({
  localNavigation: timelineReducerState.localNavigation,
  formSearchTimeline: timelineReducerState.getTimelineFormSearch,
  timelineIdCreated: timelineReducerState.timelineIdCreated,
  timelineIdPostCreated: timelineReducerState.timelineIdPostCreated,
  timelineIdExtPostCreated: timelineReducerState.timelineIdExtPostCreated,
  isModalMode: timelineReducerState.isModalMode,
  errorCode: timelineReducerState.errorCode,
  messageValidateRequire: timelineReducerState.messageValidateRequire,
  isChangeId: employeeDetailAction.idUpdate
});

const mapDispatchToProps = {
  handleToggleCreateTimeLine,
  handleCreateCommentAndReply,
  handleCreateExtTimeLine,
  handClearMessValidateRequire,
  changeScreenMode,
  handleSetValuePost
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineFormControl);
