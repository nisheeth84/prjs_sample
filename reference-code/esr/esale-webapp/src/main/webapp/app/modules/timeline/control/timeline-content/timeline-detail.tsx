import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { TimelinesType } from '../../models/get-user-timelines-type';
import TimelineContentComment from './timeline-content-comment'
import {handleGetTimelineGroupsOfEmployee,
    handleInitTimelines,
    toggleConfirmPopup,
    onclickDelete,
    handleInitTimelinesFavorite, handleSetModalMessageMode,reset,handleShowDetail } from '../../timeline-reducer'
import { onclickDeleteExtTimeline , handleInitExtTimelines} from '../../timeline-common-reducer'
import TimelineCreateQuote from './timeline-create-quote'
import TimelineShareView from './timeline-share-view'
import TimelineHeader from './timeline-header'
import { Storage,translate } from 'react-jhipster'
import { ConfirmPopupItem } from '../../models/confirm-popup-item'
import { CommonUtil } from '../../common/CommonUtil';
import TimelineViewComment from './timeline-view-comment'
import TimelineFormControl from './timeline-form-control';
import TimelineTagetDeliversShow from './timeline-taget-delivers-show'
import ShareTimelineModal from '../button-footer/share-timeline-modal';
import TimelineMessageInfo from '../message-info/timeline-message-info';
import { IRootState } from 'app/shared/reducers';
import ViewFile  from '../timeline-content/view-file'
import ReactionPicker from '../../control/reaction/reaction-picker'
import ReactionListChoose from '../../control/reaction/reaction-list-choose'
import { TYPE_DETAIL_MODAL, GROUP_TIMELINE_MODE, MODE_CONTENT } from '../../common/constants';
import ConfirmPopup from '../timeline-content/confirm-popup';
import { handleGetTimelineById } from '../../timeline-reducer';
import  TimelineDetailOthers  from '../../timeline-list/timeline-detail-orthers';
import { ObjectDetail } from '../../models/get-followeds-model';
import TimelineDetailEmployee from '../../timeline-list/timeline-detail-employee';
import { useHistory } from 'react-router';
import { handleGetFullListReaction } from 'app/modules/timeline/control/reaction/timeline-reaction-reducer'

type ITimelineDetailProp = StateProps & DispatchProps & {
  // data call api getTimelineById
  data: TimelinesType;
  // func close modal
  closeModal: () => void;
  // check common mode
  isCommon: boolean;
  // check is private group
  isPrivateGroup?: boolean;
  popout?: boolean;

}
export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

const TimelineDetail = (props: ITimelineDetailProp) => {

  const [isComment, setIsComment] = useState(null);
  const [isQuote, setIsQuote] = useState(null);
  const [isQuoteAll, setIsQuoteAll] = useState(null);
  const [isShare, setIsShare] = useState(null);
  const [isFavorite, setIsFavorite] = useState(props.data?.isFavorite);
  const [isShowImage, setIsShowImage] = useState(null);
  const [dataTemp, setDataTemp] = useState(props.data)
  const [commentCreateData, setCommentCreateData] = useState({});
  const [showDataCreate, setShowDataCreate] = useState(false);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [backupData, setBackupData] = useState(props.data ? props.data : {});
  const[ isNotMemberOfGroup,setIsNotMemberOfGroup] = useState(false)
  const [listDataComment, setListDataComment] = useState([]);
  const [checkRec, setCheckRec] = useState(false);
  const [dataPopupDetail, setDataPopupDetail] = useState<ObjectDetail>(null)
  const history = useHistory();
  // for timeline auto
  const [allContent, setAllContent] = useState(null);

  useEffect(() => {
    if(props.data) {
      setBackupData(props.data);
      setListDataComment(props.data.commentTimelines)
      if(props.data.timelineGroupId){
        props.handleGetTimelineGroupsOfEmployee(props.data.timelineGroupId, true);
      }
    }
  }, [props.data]);

  /**
   * get data to set role
   */
  useEffect(() => {
    if(props.popout && backupData.timelineGroupId) {
      props.handleGetTimelineGroupsOfEmployee(backupData.timelineGroupId, true);
    }
  }, [backupData]);

  /**
   *  set role data on popout
  */
  useEffect(() =>{
    if(props.popout && backupData.timelineGroupId){
      setIsNotMemberOfGroup(CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee ? props.timelineGroupsOfEmployee: null ) === GROUP_TIMELINE_MODE.NOT_MEMBER)
    }
  },[props.timelineGroupsOfEmployee, props.timelineItemId])

  useEffect(() => {
    if(props.popout && props.isCheckRedirectPopout === backupData.timelineId) {
      history.push(`list`);
    }
  }, [props.isCheckRedirectPopout])

  useEffect(() => {
    props.handleSetModalMessageMode(true)
    return () => props.handleSetModalMessageMode(false)
  }, [])

  /**
   *  set role data
   */
  useEffect(() =>{
    if(props.data?.timelineGroupId){
      setIsNotMemberOfGroup(CommonUtil.getGroupUserMode(props.timelineGroupsOfEmployee ? props.timelineGroupsOfEmployee: null ) === GROUP_TIMELINE_MODE.NOT_MEMBER)
    }
  },[props.timelineGroupsOfEmployee])


  useEffect(() => {
    if (isComment) {
      setIsComment(true);
      setIsQuote(false);
      setIsQuoteAll(false);
      setIsShare(false);
    }
  }, [isComment])

  useEffect(() => {
    if (isQuote) {
      setIsQuote(true);
      setIsComment(false);
      setIsShare(false);
      setIsQuoteAll(false);
    }
  }, [isQuote])

  useEffect(() => {
    if (isQuoteAll) {
      setIsQuote(false);
      setIsComment(false);
      setIsShare(false);
      setIsQuoteAll(true);
    }
  }, [isQuoteAll])

  useEffect(() => {
    if (isShare) {
      setIsQuote(false);
      setIsComment(false);
      setIsShare(true);
      setIsQuoteAll(false);
    }
  }, [isShare])

  useEffect(()=>{
    if(props.listDataCommentAll.has(backupData?.timelineId)){
      setListDataComment(props.listDataCommentAll.get(backupData.timelineId).listComment);
    }
  },[props.countCreate])


  const handleFavorite = (value) => {
    props.handleInitTimelinesFavorite(props.data.timelineId, props.data.rootId);
    setIsFavorite(value)
  }

  const handleCreateQuote = (text) => {
    setIsQuote(true);
    setDataTemp({ ...dataTemp, comment: { ...dataTemp.comment, content: text } })
  }
  const handleDeleteModal = (timelineId: number) => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };

    const funcDelete = () => {
      if(props.isCommon) {
        props.onclickDeleteExtTimeline(timelineId, 0, 0)
      } else {
        props.onclickDelete(timelineId, 0, 0);
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

  useEffect(() => {
    if(props.popout) {
      const saveObj = Storage.local.get(TimelineDetail.name);
      props.handleGetTimelineById(saveObj?.backupData.timelineId);
    }
  }, [])

  const handleDataCreate = (dataCreate) => {
    setIsComment(false);
    setIsQuoteAll(false);
    setIsQuote(false);
    setShowDataCreate(true)
    setListDataComment(listDataComment.concat(dataCreate))
  }
  const userLoginId = CommonUtil.getUserLogin().employeeId;

  /**
   * action update session
   * @param mode
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(TimelineDetail.name, {
        isComment,
        isQuote,
        isQuoteAll,
        isShare,
        isFavorite,
        isShowImage,
        dataTemp,
        commentCreateData,
        showDataCreate,
        backupData,
        listDataComment
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(TimelineDetail.name);
       if (saveObj) {
        setIsComment(saveObj.isComment);
        setIsQuote(saveObj.isQuote);
        setIsQuoteAll(saveObj.isQuoteAll);
        setIsShare(saveObj.isShare);
        setIsFavorite(saveObj.isFavorite);
        setIsShowImage(saveObj.isShowImage);
        setDataTemp(saveObj.dataTemp)
        setCommentCreateData(saveObj.commentCreateData);
        setShowDataCreate(saveObj.showDataCreate);
        setBackupData(saveObj.backupData);
        setListDataComment(saveObj.listDataComment);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(TimelineDetail.name);
    }
  }

      /**
   * action open new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    props.closeModal()
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${props.tenant}/timeline/detail`, '', style.toString());
  }

  const firstLoad = () => {
    if (props.popout) {
      updateStateSession(FSActionTypeScreen.GetSession);
      setForceCloseWindow(false);
      document.body.className = "wrap-timeline modal-open body-full-width";
    }
  }

  useEffect(() => {
    if (forceCloseWindow) {
      if (props.popout) {
        window.opener.postMessage({ type: FSActionTypeScreen.CloseWindow, 'forceCloseWindow': true }, window.location.origin);
        Storage.session.set('forceCloseWindow', true);
        window.close();
      } else {
        props.closeModal()
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    firstLoad();
    props.handleGetFullListReaction();
    return () => {
      props.reset();
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, [])

  useEffect(() => {
    if(props.timelineItemId?.timelineId > 0){
      setBackupData(props.timelineItemId)
      setListDataComment(props.timelineItemId.commentTimelines)
      setCheckRec(true)
    }

  }, [props.popout,props.timelineItemId])

  const copyUrlTimeline = () => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = `${window.location.origin}/${props.tenant}/timeline/detail`;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
    // Show popup Employee,customer,card
    const hanldeShowObjectDetail = (dataObject: ObjectDetail) => {
      setDataPopupDetail(dataObject)
    }

  const linkToDetailChannel = () => {
    history.push(`/timeline/channel/detail/${backupData?.timelineGroupId}`);
  }

  const handleCloseModalDetail = () =>{
    props.closeModal();
    if(props.isCommon){
      props.handleInitExtTimelines({...props.getExtTimelineFormSearch, offset: 0 } )
    }else{
      props.handleInitTimelines( {...props.getTimelineFormSearch, offset: 0} );
    }
  }

const renderModal = () => {
    return (
      <>
          <div className="modal popup-esr user-popup-page popup-align-common show" id="popup-esr" aria-hidden="true">
            <div className={`${!props.popout ? "" : "p-0"} modal-dialog form-popup  `}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                    {props.isCommon? <button className="icon-small-primary icon-return-small" onClick={() => handleCloseModalDetail()}/> : <button className="icon-small-primary icon-return-small disable"/>}
                      <span className="text"><img className="icon-timeline-small ic-message" src="../../../content/images/ic-sidebar-timeline.svg" alt="" /></span>
                      <span className="">
                        {`${CommonUtil.getJustDateTimeZone(backupData?.createdDate)} ${CommonUtil.getTimeZoneFromDate(backupData?.createdDate)}`}
                      </span>
                    </div>
                  </div>
                  {!props.popout &&
                    <div className="right">
                      <button className="icon-small-primary icon-copy-small" onClick={() => copyUrlTimeline()}/>
                      <button className="icon-small-primary icon-link-small" onClick={() => {  openNewWindow() }}/>
                      <button className="icon-small-primary icon-close-up-small line" onClick={() => handleCloseModalDetail()} />
                    </div>
                  }
                </div>
                <div className="modal-body style-3">
                  <TimelineMessageInfo isModal = {true} />
                  <div className="popup-content style-3 back-ground-f8 ">
                    <div className="list-share">
                      <div className="box-share">
                        {Number(CommonUtil.NVL(backupData?.timelineGroupId, "0")) > 0 &&
                          <div className="list-group">
                            <div className="mission-wrap">
                              <div className="item">
                                {backupData?.imagePath ? (<img className="user" src={backupData?.imagePath} />): (<div className={`no-avatar  ${CommonUtil.getColorIndex(backupData?.color)}` }> {backupData?.timelineGroupName ? backupData?.timelineGroupName.charAt(0) : ''} </div>)}
                                <span className="font-size-14 text-blue ml-2">
                                  {/* <Link to={"./channel/detail/"+backupData?.timelineGroupId}>{backupData.timelineGroupName}</Link> */}
                                  <a onClick={linkToDetailChannel}>{backupData.timelineGroupName}</a>
                                </span>
                              </div>
                            </div>
                          </div>
                        }
                        <div className="box-share-top d-flex justify-content-between">
                          <div className="mission-wrap">
                            <div className="item">
                            { backupData?.createdUserPhoto ? (<img className="user" src={backupData.createdUserPhoto} alt=' ' />) : (<div className="no-avatar green"> {backupData?.createdUserName ? backupData.createdUserName.charAt(0) : ''} </div>) }
                            <a onClick={() => {hanldeShowObjectDetail({objectId: backupData.createdUser, objectType: TYPE_DETAIL_MODAL.EMPLOYEE})}}><span className="font-size-14 text-blue">{backupData?.createdUserName}</span></a>
                            </div>
                          </div>
                          <div className="date font-size-12 text-blue">
                            {`${CommonUtil.getJustDateTimeZone(backupData?.createdDate)} ${CommonUtil.getTimeZoneFromDate(backupData?.createdDate)}`}
                            {backupData?.createdUser === Number(userLoginId) && <button className="icon-small-primary icon-erase-small ml-3" onClick={() => { handleDeleteModal(backupData.timelineId) }} />}
                          </div>
                        </div>
                        <div className="box-share-content color-333">
                          {backupData?.comment?.mode < 2 && backupData?.header?.headerId > 0 && <TimelineHeader  callBackShowDetail={hanldeShowObjectDetail} data={backupData} />}
                          <TimelineTagetDeliversShow  dataTarget={backupData.targetDelivers}  createUser={backupData.createdUser} />
                          <TimelineContentComment
                            isPermission={isNotMemberOfGroup}
                            data={backupData?.comment?.content}
                            onCreateQuote={handleCreateQuote}
                            isHighlight={true}
                            getAllDataQuote = {(content: string) => setAllContent(content)}
                            isTimelineAuto={backupData.comment?.mode !== MODE_CONTENT.CREATE_NORMAL}
                            timelinePostData={backupData}
                            openObjectDetail={hanldeShowObjectDetail}
                          />

                          {/* show button read mode content */}


                          {/* timeline share start */}
                          {backupData?.sharedTimeline && backupData?.sharedTimeline?.timelineId && <TimelineShareView isTimelineAuto={backupData.sharedTimeline?.comment?.mode !== MODE_CONTENT.CREATE_NORMAL} data={backupData?.sharedTimeline} />}

                          {backupData?.comment?.mode === 2 && backupData?.header?.headerId > 0 && <TimelineHeader callBackShowDetail={hanldeShowObjectDetail}  data={backupData} />}
                          {/* logic show header start */}

                          {backupData?.attachedFiles?.length > 0 &&
                            <div className="d-flex flex-wrap py-2">
                              {backupData?.attachedFiles?.map((item, index) => {
                                return ( < ViewFile item={item} key={index + '_file' } /> )
                              }
                              )}
                            </div>
                          }
                          {/* reaction */}
                          {!props.popout && <ReactionListChoose objectId={props.data.timelineId} rootId={props.data.timelineId} reactionsSelecteds={props.data.reactions}/>}
                          {
                            props.popout && checkRec &&
                          <ReactionListChoose objectId={backupData.timelineId} rootId={backupData.timelineId} reactionsSelecteds={backupData.reactions}/>

                          }

                        </div>

                        { !isNotMemberOfGroup &&
                        <div className={`box-share-bottom pt-1 mt-1  ${isComment ? "position-relative" : ""}`}>
                          {
                            <>
                              <a className={`icon-small-primary icon-comment ${isComment ? "active unset-bg-color" : ""}`} onClick={() => setIsComment(!isComment)} ></a>
                              <a  className={`icon-small-primary icon-quote ${ isQuoteAll || isQuote ? "active unset-bg-color" : ""}`} onClick={() => setIsQuoteAll(!isQuoteAll)} ></a>
                              <a  className="icon-small-primary icon-share" onClick={() => setIsShare(!isShare)}></a>
                              <ReactionPicker objectId={backupData.timelineId} rootId={backupData.timelineId}/>
                              <a className={`icon-small-primary icon-start ${isFavorite ? "active unset-bg-color" : ""} `} onClick={() => handleFavorite(!isFavorite)} ></a>
                              {isComment && <TimelineFormControl createComment={1} dataTimeline={backupData} callbackData={handleDataCreate} />}
                              {isQuote && <TimelineCreateQuote dataTimeline={dataTemp} isCreateOfReply={false} createQuote={1} callbackData={handleDataCreate} />}
                              {isQuoteAll && <TimelineCreateQuote
                                dataTimeline={backupData}
                                isCreateOfReply={false}
                                createQuote={1}
                                callbackData={handleDataCreate}
                                dataAuto={backupData.comment.mode !== MODE_CONTENT.CREATE_NORMAL? allContent: null}
                              />}
                            </>
                          }
                        </div>
                       }
                      </div>
                      <TimelineViewComment
                      isNotMemberOfGroup = {isNotMemberOfGroup}
                      dataComment={listDataComment}
                      isModalDetail={true}
                      timelineId={backupData?.timelineId}
                      dataCreateComment={commentCreateData}
                      isShowCreate = {showDataCreate}
                      callBackShowCreate = {() => { setShowDataCreate(false) } }
                      dataTimeline={backupData}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer background-color-85 pt-2" />
              </div>
            </div>
          </div>
        {isShare && <ShareTimelineModal isTimelineAuto={backupData.comment?.mode !== MODE_CONTENT.CREATE_NORMAL}
        isCommon = {props.isCommon} data={backupData} isPrivateGroup={props.isPrivateGroup} closeModal={() => setIsShare(false)} />}
        <TimelineDetailOthers dataPopupDetail={dataPopupDetail}/>
      </>
    );
  }
  if (!props.popout) {
    return (<>
      <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" className=" wrap-timeline w69" autoFocus={false} zIndex="auto">
        {renderModal()}
        {props.openConfirmPopup && props.isCommon && !(props.listTimelines?.length > 0) && <ConfirmPopup infoObj={props.confirmPopupItem} isCommon={props.isCommon}/> }
      </Modal>
    </>);
  } else {
    if (props.popout) {
      return (
        <>
         {renderModal()}
        {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem} isCommon={props.isCommon}/> }
        <TimelineDetailEmployee/>
        </>

      )

    } else {
      return <></>
    }
  }

};

const mapStateToProps = ( {applicationProfile, timelineReducerState, timelineCommonReducerState} : IRootState ) => ({
  tenant: applicationProfile.tenant,
  timelineGroupsOfEmployee: timelineReducerState.listTimelineGroupsOfEmployee?.length > 0 ? timelineReducerState.listTimelineGroupsOfEmployee[0] : null,
  listDataCommentAll: timelineReducerState.listDataComment,
  countCreate: timelineReducerState.countCreate,
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  timelineItemId: timelineReducerState.timelineItem,
  listTimelines: timelineReducerState.listTimelines,
  isCheckRedirectPopout: timelineReducerState.isCheckRedirectPopout,
  getTimelineFormSearch: timelineReducerState.getTimelineFormSearch,
  getExtTimelineFormSearch: timelineCommonReducerState.getExtTimelineFormSearch
});

const mapDispatchToProps = {
  toggleConfirmPopup,
  onclickDelete,
  handleInitTimelinesFavorite,
  onclickDeleteExtTimeline,
  handleSetModalMessageMode,
  reset,
  handleShowDetail,
  handleGetTimelineGroupsOfEmployee,
  handleGetTimelineById,
  handleInitTimelines,
  handleInitExtTimelines,
  handleGetFullListReaction
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineDetail);
