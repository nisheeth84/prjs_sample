/**
 * Component for show timeline want to share
 * @param data
 * @param isPrivateGroup
 */
import React, { useState, useRef, useEffect } from 'react'
import { Modal } from 'reactstrap';
import { translate } from 'react-jhipster'
import { connect } from 'react-redux'

import { handleShareTimeline,
          handleInitTimelines,
          handleResetMessageInfo,
          handleSetModalMessageMode,
          handClearMessValidateRequire
        } from '../../timeline-reducer'
import {
         handleClearCacheIsPublicGroup,
         handleCheckIsPublicGroup
       } from '../../timeline-common-reducer'
import { CommonUtil } from '../../common/CommonUtil'
import { IRootState } from 'app/shared/reducers';
import TimelineGroupPulldown from '../timeline-content/timeline-group-pulldown';
import TimelineTargetDeliverPulldown from '../timeline-content/timeline-target-deliver-pulldown';
import { DataType } from '../../models/suggest-timeline-group-name-model';
import { TARGET_TYPE, MODE_CONTENT } from '../../common/constants';
import TimelineContentComment from '../timeline-content/timeline-content-comment';
import TimelineMessageInfo from '../message-info/timeline-message-info';
import TimelineTextarea from '../timeline-content/timeline-textarea';
import DialogDirtyCheckTimeline from '../../common/dialog-dirty-check-timeline';
import { TargetDelivers } from '../../models/create-comment-and-reply-model';
import TimelineHoverSuggestion from '../timeline-content/timeline-hover-suggestion'
import { isExceededCapacity } from 'app/modules/timeline/common/CommonUtil';
import { MAXIMUM_FILE_UPLOAD_MB } from 'app/config/constants';
import useEventListener from 'app/shared/util/use-event-listener'
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';

type IShareTimelineModalProp = StateProps & DispatchProps & {
  // to call back for close modal
  closeModal: () => void
  // to receive data from timeline user chose
  data: any,
  // to check type of Timeline Group Share
  isPrivateGroup?: boolean
  // to check common
  isCommon?: boolean
  // default Target Create Timeline for common
  defaultTargetCreateTimeline?: TargetDelivers
  // timelineGroupId
  dataTimeline?: any
  // check isReply, comment, quote
  isCheckTransfer?: boolean
  // is auto timeline
  isTimelineAuto?: boolean
}

const ShareTimelineModal = (props: IShareTimelineModalProp) => {
  const [groupSelected, setGroupSelected] = useState(null);
  const [listSuggestion, setListSuggestion] = useState([]);
  const [files, setFiles] = useState([]);
  const registerOpenDialogFile = useRef(null);
  const [textFormat, setTextFormat] = useState(null);
  const [textCommentForm, setTextCommentForm] = useState("");
  const [privateGroup, setPrivateGroup] = useState(true);
  /* Start for style text */
  const [isShowToolFormat, setIsShowToolFormat] = useState(false);
  const [messageRequire, setMessageRequire] = useState(null)
  const [isActiveValidate, setIsActiveValidate] = useState(false)
  const [msgError, setMsgError] = useState('');
  const [msgSuccess, setMsgSuccess] = useState('');
  const fileRef = useRef(null);
  const textareaRef = useRef(null);
  const [focus, setFocus] = useState(false);
  const [typeFormatText, setTypeFormatText] = useState(0)

  /**
   * reset active validate when reset message info
   */
  useEffect(() => {
    if (props.messageValidateRequire && isActiveValidate) {
      setIsActiveValidate(false);
      setMessageRequire(props.messageValidateRequire);
      props.handClearMessValidateRequire();
    }
  }, [props.messageValidateRequire])

  /**
   * update channel when open share modal
   */
  useEffect(() => {
    setGroupSelected(props.data);
    props.handleSetModalMessageMode(true)
    /**
     * set private mode when start
     */
    if ((props.isCheckTransfer && props.dataTimeline.timelineGroupId)) {
      props.handleCheckIsPublicGroup({ timelineGroupIds: [props.dataTimeline.timelineGroupId], sortType: 1 });
    } else if (props.isPrivateGroup === undefined && props.data.timelineGroupId) {
      props.handleCheckIsPublicGroup({ timelineGroupIds: [props.data.timelineGroupId], sortType: 1 });
    } else {
      setPrivateGroup(props.isPrivateGroup);
    }
    return () => { props.handleSetModalMessageMode(false); props.handleClearCacheIsPublicGroup(); }
  }, [])

  /**
   * Listen is private group
   */
  useEffect(() => {
    if (props.isPublic !== null) {
      setPrivateGroup(!props.isPublic)
    }
  }, [props.isPublic])


  /**
  * change comment when change input
  */
  const changeTextCommentForm = (text) => {
    setTextCommentForm(text);
  }

  /**
   * convert suggestion list to Target Deliver to submit
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
    if (groupSelected && groupSelected.timelineGroupId != null) {
      targetDelivers.push({ targetType: TARGET_TYPE.GROUP, targetId: [groupSelected.timelineGroupId] });
    }
    // default have user login ID when have no target deliver
    if (targetDelivers.length === 0) {
      arrEmpployeIds.push(CommonUtil.getUserLogin().employeeId);
      targetDelivers.push({ targetType: TARGET_TYPE.EMPLOYEE, targetId: arrEmpployeIds });
    }
    //
    return targetDelivers;
  }

  /**
   * action share timeline
   */
  const shareTimeline = () => {
    setIsActiveValidate(true);
    const listTargetDelivers = convertSuggestListToTargetDeliver();
    if(files.length > 0 && isExceededCapacity(files)) {
      setMsgError(translate("messages.ERR_COM_0033", [MAXIMUM_FILE_UPLOAD_MB]));
      return;
    } else {
      setMsgError('');
    }
    let contentTextShare = null;
    if(!textareaRef.current.isEmptyForm()){
      contentTextShare = CommonUtil.trimSpaceHtml(textCommentForm);
    }
    const shareTimelineForm = {
      sharedTimelineId: props.data.timelineId,
      targetDelivers: listTargetDelivers,
      textComment: contentTextShare,
      sharedContent: props.data.comment.content,
      attachedFiles: files
    }
    const shareTimelineFormData = CommonUtil.objectToFormData(shareTimelineForm, '', []);

    props.handleShareTimeline(shareTimelineFormData, props.isCommon);
  }

  useEffect(() => {
    if (props.shareTimelineId) {
      props.closeModal();
    }

  }, [props.shareTimelineId])

  /**
   * action merge file
   * @param newFileAdded
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
   * action update list file when chose a file
   * @param event
   */
  const handleFileChange = (event) => {
    const file = event.target.files;
    if (file.length > 0) {
      mergeFiles(file);
    }
  };
  /**
   * action delete item file
   * @param itemFile
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

  /**
   * delete target choose
   * @param item
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
   * push target choose
   * @param item
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
    if (lstItem) {
      lstItem.forEach(element => {
        pushTargetChoose(element);
      });
    }
  }

  const executeDirtyCheck = async () => {
    const onCancel = () => { };
    if (textCommentForm) {
      await DialogDirtyCheckTimeline({
        onLeave: props.closeModal, onStay: onCancel, ok: translate('global.dialog-dirtycheck.parttern1.confirm'),
        cancel: translate('global.dialog-dirtycheck.parttern1.cancel'),
        content: translate('timeline.dirty-check.content'),
        title: translate('global.dialog-dirtycheck.parttern1.title')
      });
    } else {
      props.closeModal()
    }
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

  return (
    <>
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} className="wrap-timeline wrap-timeline-share timeline-popup-center" id="popup-field-search" autoFocus={true} zIndex="auto">
        <div className="timeline-popup-center-cell">
          <div className="popup-esr2 popup-esr3 overflow-visible" id="popup-esr2">
            <div className="popup-esr2-content">
              <div className="modal-header">
                <div className="left">
                  <div className="popup-button-back">
                    <span className="text border-left-none"><img src="../../../content/images/timeline/ic-title-modal.svg" alt="" />{translate('timeline.share-timeline-modal.share-modal-title')}</span>
                  </div>
                </div>
                <div className="right">
                  <button tabIndex={0} className="icon-small-primary icon-close-up-small" onClick={() => executeDirtyCheck()} />
                </div>
              </div>
              <div className="popup-esr2-body popup-timeline-body">
                <form onSubmit={e => { e.preventDefault(); }} className="form-timeline">
                  <TimelineMessageInfo isModal={true} />
                  <div className="timeline-form-search border-radious-12 mt-0">
                    <div className="mb-1" ref={fileRef}>
                      {displayMessage()}
                    </div>
                    <div className="form-group mb-1 overflow-auto">
                      <div className={`position-relative ${messageRequire ?"error-div-timeline" : "timeline-input-hover-blue"} ${focus ? 'timeline-input-focus-blue' : ''}`}>
                        {listSuggestion.length > 0 &&
                          <div className="wrap-tag tag-file flex-wrap h-auto mt-0 show-list-item height-auto flex-wrap-wrap">
                            {listSuggestion.map((item) => {
                              return <>
                                <div key={`${item.targetId}${item.targetType === TARGET_TYPE.EMPLOYEE ? 'e' : 'd'}`}>
                                  < TimelineHoverSuggestion data={item} deleteTarget={() => { deleteTarget(item) }} />
                                </div>
                              </>
                            })}
                          </div>
                        }
                        <TimelineTextarea ref={textareaRef} autoFocus={true} onChange={changeTextCommentForm}
                          textFormat={textFormat}
                          isShowToolFormat={isShowToolFormat}
                          className="input-normal"
                          messRequire={messageRequire}
                          onClearMess={() => setMessageRequire(null)}
                          placeholder={translate('timeline.control.local-tool.placeholders-content')} 
                          onFocus={() => {setFocus(true)}} 
                          onBlur={() => {setFocus(false)}}/>
                        <div className="p-3 bg-white border-radius-3">
                          <div className="card-more-comment mx-0 mb-0 card-more-comment-270">
                            <div className="content">
                              <div className="mission-wrap">
                                <div className="item">
                                  {props.data?.createdUserPhoto ? (<img className="user" src={props.data?.createdUserPhoto} alt=' ' />)
                                    : (<div className="no-avatar green"> {props.data?.createdUserName ? props.data?.createdUserName.charAt(0) : ''} </div>)}
                                  <span className="font-size-12 text-blue">{props.data?.createdUserName}</span>
                                </div>
                              </div>
                              <div className="text mt-2">
                                <TimelineContentComment 
                                  isTimelineAuto={props.isTimelineAuto}
                                  timelinePostData={props.data}
                                  data={props.data?.comment?.content} 
                                  isHighlight={false} />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={files.length > 0 ? 'wrap-tag tag-file flex-wrap h-auto mt-0 height-auto flex-wrap-wrap' : ''}>
                          {files.length > 0 && files.map((item, index) => {
                            return <div key={index} className="tag my-1">
                              <div className="mission-wrap">
                                <div className="item d-flex max-width-130">
                                  <img className="file-image" src={CommonUtil.getUrlImageTypeFile(item.name)} />
                                  <span className="font-size-12 text-ellipsis">{item.name}</span>
                                </div>
                              </div>
                              <button type="button" onClick={() => { deleteItemFile(item) }} className="close">×</button>
                            </div>
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="d-flex align-items-center">
                        <TimelineGroupPulldown
                          isPrivateGroup={privateGroup}
                          defaultValue={props.isCheckTransfer ? props.dataTimeline : props.data}
                          chooseGroup={(item: DataType) => { setGroupSelected(item); setListSuggestion([]);}}
                          classAppend="location-b0 location-right mb-4" />
                        <TimelineTargetDeliverPulldown
                          timelineGroupId={groupSelected ? groupSelected.timelineGroupId : null}
                          onChooseItem={(item: any) => pushTargetChoose(item)}
                          classAppend="location-b0 location-right"
                          listItemChoose={listSuggestion}
                          onPushMulti={(listItem: any[]) => pushMultiTargetChoose(listItem)}
                        />
                        <button tabIndex={0} title="" className="icon-finder ml-2 btn-file-focus" onClick={() => { registerOpenDialogFile.current.click(); }}>
                          <input id="uploadBtn" type="file" hidden multiple className="upload" onChange={() => { handleFileChange(event) }} value={undefined} ref={registerOpenDialogFile} />
                        </button>
                        {/* <div className={`${isShowToolFormat ? "active" : ""} position-relative`}>
                          <button type="button" title="" className="icon-text text-custom font-size-18 color-666 ml-2 text-underline button-focus" onClick={() => setIsShowToolFormat(!isShowToolFormat)}>A</button>
                          <div className="pupop-choosetext d-flex">
                            <button type="button" className="item_choosetext text-underline" onClick={() => setTextFormat(['underline'])}>A</button>
                            <button type="button" className="item_choosetext" onClick={() => setTextFormat(['bold'])}>B</button>
                            <button type="button" className="item_choosetext" onClick={() => setTextFormat(['italic'])}>I</button>
                            <button type="button" className="item_choosetext icon-strikethrough" onClick={() => setTextFormat(['strikeThrough'])}></button>
                          </div>
                        </div> */}
                        {/** Start code for change style text */}
                        <div className={`${isShowToolFormat ? "active" : ""} position-relative`}>
                          {(typeFormatText === 0 || typeFormatText === 1) && <button type="button" title="" className="icon-text text-custom font-size-18 color-666 ml-2 text-underline button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}>A</button>}
                          {typeFormatText === 2 && <button type="button" title="" className="text-custom font-size-18 color-666 ml-2 button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}>B</button>}
                          {typeFormatText === 3 && <button type="button" title="" className="text-custom font-size-18 color-666 ml-2 button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}>I</button>}
                          {typeFormatText === 4 && <button type="button" className="text-custom font-size-18 color-666 ml-2 icon-strikethrough button-focus" onMouseDown={e => e.preventDefault()} onClick={() => setIsShowToolFormat(!isShowToolFormat)}> <img src="/content/images/ic-strikethrough.svg" alt="" /> </button>}
                          <div className="pupop-choosetext d-flex">
                            <a className="item_choosetext text-underline" onClick={() => handleShowFormatText(1)}>A</a>
                            <a className="item_choosetext" onClick={() => handleShowFormatText(2)}>B</a>
                            <a className="item_choosetext" onClick={() => handleShowFormatText(3)}>I</a>
                            <a className="item_choosetext icon-strikethrough" onClick={() => handleShowFormatText(4)}> </a>
                          </div>
                        </div>
                        {/** End code for change style text */}
                      </div>
                      <button type="button" onClick={() => { shareTimeline() }} className="button-blue" >{translate('timeline.share-timeline-modal.button-share')}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

const mapStateToProps = ({ timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  localNavigation: timelineReducerState.localNavigation,
  shareTimelineId: timelineReducerState.shareTimelineId,
  messageValidateRequire: timelineReducerState.messageValidateRequire,
  isPublic: timelineCommonReducerState.isPublic
});

const mapDispatchToProps = {
  handleShareTimeline, handleInitTimelines, handleResetMessageInfo, handleSetModalMessageMode,
  handClearMessValidateRequire,
  handleCheckIsPublicGroup, handleClearCacheIsPublicGroup
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareTimelineModal);
