import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'reactstrap';
import { Storage, translate } from 'react-jhipster'
import { connect } from 'react-redux'
import { ConfirmPopupItem } from '../models/confirm-popup-item'
import { handleResetMessageInfo,toggleConfirmPopup, handleDeleteFolloweds, handleShowDetail, handleToggleTimelineModal, reset } from '../timeline-reducer'
import { handleGetFolloweds,handleClearCacheFollowed } from '../timeline-common-reducer'
import { IRootState } from 'app/shared/reducers';
import { FollowedsType, ObjectDetail } from '../models/get-followeds-model'
import { TYPE_DETAIL_MODAL_HEADER } from '../common/constants';
import useEventListener from 'app/shared/util/use-event-listener';
import { dateToStringUserTzFormat } from 'app/shared/util/date-utils';
import ConfirmPopup from '../control/timeline-content/confirm-popup';
import { handleToggleDetailModalOther } from '../timeline-reducer'
import  TimelineDetailOthers  from './timeline-detail-orthers';




type ITimelineFollowedModalProp = StateProps & DispatchProps & {
  closeModal: () => void,
  popout?: boolean
}
export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

const TimelineFollowedModal = (props: ITimelineFollowedModalProp) => {
  // List item dropDown modal
  const listRecordDropDown = [
    { label: translate('timeline.following-management.first-record'), value: 15 },
    { label: translate('timeline.following-management.center-record'), value: 30 },
    { label: translate('timeline.following-management.last-record'), value: 50 }
  ]

  const [isModalSize, setIsModalSize] = useState(false);
  const [records, setRecords] = useState(30);
  const registerRef = useRef(null);
  const [textValue, setTextValue] = useState(translate('timeline.following-management.center-record'));
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [disButtonNex,setDisButtonNex] = useState(false)
  const [disButtonPre,setDisButtonPre] = useState(false)
  const [hiddenButton, setHiddenButton] = useState(true);
  const [hiddenTable, setHiddenTable] = useState(true);
  const [dataPopupDetail, setDataPopupDetail] = useState<ObjectDetail>()
  const [currentPage, setCurrentPage] = useState(0);
  const [numberFirst, setNumberFirst] = useState(1);
  const [numberLast, setNumberLast] = useState(30);

  // Event item dropDown
  const handleItemClick = (item) => {
    setTextValue(item.label);
    setHiddenButton(true);
    if (props.followedsType.total < item.value) {
      setNumberLast(props.followedsType.total)
      setHiddenButton(false)
    } else {
      setNumberLast(item.value);
    }
    if(item.value === props.followedsType.total){
      setHiddenButton(false)
    }
    setRecords(item.value);
    setCurrentPage(0);
    setNumberFirst(1);

    props.handleGetFolloweds(item.value, 0)
    setIsModalSize(false);
  }


  const handleClickOutsideRegistration = (e) => {
    if (registerRef.current && !registerRef.current.contains(e.target)) {
      setIsModalSize(false)
    }
  }
  useEventListener('click', handleClickOutsideRegistration);

  useEffect(() => {
    props.handleGetFolloweds(records, currentPage)
    setNumberFirst(1)
    setNumberLast(30)
    return () =>{
      setNumberFirst(1)
      setNumberLast(30)
      props.handleClearCacheFollowed()
    }
  }, [])

  useEffect(() => {
    if(props.followedsType && props.followedsType?.followeds?.length > 0){
      if ( props.followedsType?.total <= records ){
        setNumberLast(props.followedsType?.total)
        setHiddenButton(false)
      } else if (props.followedsType?.total > records ){
        setNumberLast(( numberFirst + records - 1 ) > props.followedsType?.total ? props.followedsType?.total : ( numberFirst + records - 1 )   )
        setHiddenButton(true)
      }
      if( currentPage === 0 ){
        setDisButtonPre(true)
        setDisButtonNex(false)
      }else if( ( numberFirst + records - 1 ) >= props.followedsType?.total  ){
        setDisButtonPre(false)
        setDisButtonNex(true)
      }else{
        setDisButtonPre(false)
        setDisButtonNex(false)
      }
      setHiddenTable(true)
    }else if(props.followedsType && props.followedsType?.followeds === null && props.followedsType?.total === null ){
      setHiddenTable(false)
      setNumberFirst(0)
      setNumberLast(0)
    }else if(props.followedsType && props.followedsType?.total === 0 ){
      setHiddenTable(false)
    }
  }, [props.followedsType])

  // Button next page
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    props.handleGetFolloweds(records, (records * nextPage)   );
    setCurrentPage(nextPage)
    setNumberFirst((records * nextPage) + 1 )
  }

  // Button previous page
  const handlePreviousPage = () => {
    const nextPage =  (currentPage - 1 ) < 0 ? 0 :  (currentPage - 1 ) ;
    props.handleGetFolloweds(records, ( records * nextPage ) );
    setCurrentPage(nextPage)
    setNumberFirst((records * nextPage )+ 1)
  }


  // Show popup Employee,customer,card
  const handleShowPopupDetail = (targetId, typeDetail) => {
    setDataPopupDetail({objectId: targetId, objectType: typeDetail})

  }
  // Modal xóa Followeds
  const handleDeleteFollowed = (targetId, targetType) => {
    const cancel = () => {
      props.toggleConfirmPopup(false);
    };

    const funcDelete = () => {
      if(props.followedsType.followeds.length === 1){
        props.handleDeleteFolloweds(targetId, targetType, records, (records * ( currentPage -1) ) );
        setNumberFirst( ( records * ( currentPage -1) +1 ) > 0 ? ( records * ( currentPage -1) +1 ) : 0 )
      }else{
        props.handleDeleteFolloweds(targetId, targetType, records,  (records * currentPage) );
      }
    };

    const popupDelete: ConfirmPopupItem = {
      title: `${translate('timeline.message-followes.label-modal')}`,
      content: `<p class="">${translate('timeline.message-followes.message')}</p>`,
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
   * action update session
   * @param mode
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(TimelineFollowedModal.name, {
        listRecordDropDown,
        isModalSize,
        hiddenButton,
        records,
        currentPage,
        numberFirst,
        numberLast,
        textValue,

      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(TimelineFollowedModal.name);
      if (saveObj) {
        setIsModalSize(saveObj.isModalSize);
        setHiddenButton(saveObj.hiddenButton);
        setRecords(saveObj.records);
        setCurrentPage(saveObj.currentPage);
        setNumberFirst(saveObj.numberFirst);
        setNumberLast(saveObj.numberLast);
        setTextValue(saveObj.textValue);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(TimelineFollowedModal.name);
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
    window.open(`${props.tenant}/timeline/manage-follow`, '', style.toString());
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
    return () => {
      props.reset();
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, [])

  const renderIconType = (targetType, targetId, targetName) => {
    if (targetType === 1) {
      return (
        <>
          <td>
            <span className="icon"><img src="../../../content/images/ic-sidebar-client.svg" alt="" /></span>{translate('timeline.following-management.customer')}
          </td>
          <td className="text-blue"><a onClick={() => { handleShowPopupDetail(targetId, TYPE_DETAIL_MODAL_HEADER.CUSTOMER) }}>{targetName}</a></td>

        </>
      )
    } else if (targetType === 2) {
      return (
        <>
          <td><span className="icon"><img src="../../../content/images/ic-sidebar-business-card.svg" alt="" /></span>{translate('timeline.following-management.card')}</td>
          <td className="text-blue"><a onClick={() => { handleShowPopupDetail(targetId, TYPE_DETAIL_MODAL_HEADER.CARD) }}>{targetName}</a></td>
        </>
      )
    } else {
      return (
        <>
          <td><span className="icon"><img src="../../../content/images/ic-sidebar-employee.svg" alt="" /></span>{translate('timeline.following-management.employee')}</td>
          <td className="text-blue"><a onClick={() => { handleShowPopupDetail(targetId, TYPE_DETAIL_MODAL_HEADER.EMPLOYEE) }}>{targetName}</a></td>
        </>
      )
    }
  }
  const renderModal = () => {
  return (
        <>
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right  show z-index-100" id="popup-esr" aria-hidden="true" >
          <div className={`${!props.popout ? "" : "p-0"} modal-dialog form-popup`}>
            <div className="modal-content">
              <div className="modal-header" >
                <div className="left">
                  <div className="popup-button-back">
                    <a className="icon-small-primary icon-return-small disable"/>
                    <span className="text"><img className="icon-timeline-small ic-message" src="../../../content/images/timeline/ic-title-modal.svg" alt="" />{translate('timeline.following-management.following-name')}</span>
                  </div>
                </div>
                {!props.popout &&
                  <div className="right">
                    <a className="icon-small-primary icon-link-small" onClick={() => openNewWindow()} />
                    <a className="icon-small-primary icon-close-up-small line" onClick={() => { props.closeModal() }} />
                  </div>
                }
              </div>
            { hiddenTable ?
              <div className="modal-body style-3">
                <div className="popup-content style-3">

                  <div className="pagination-top d-flex mb-3">
                    <div className="esr-pagination">
                      <div className="drop-select-down" ref={registerRef}>
                        <a className="active button-pull-down-small"  onClick={() => { setIsModalSize(!isModalSize) }}>{textValue}</a>
                        {isModalSize && <>
                          <div className="box-select-option">
                            <ul>
                              {listRecordDropDown && listRecordDropDown.map((item, index) => {
                                return <li className="ml-0" key={index} onClick={() => { handleItemClick(item) }}><a className="ml-0">{item.label}</a></li>
                              })}
                            </ul>
                          </div>
                        </>
                        }
                      </div>
                      <span className="text"> {numberFirst} - {numberLast} {translate('timeline.following-management.page')} / {props.followedsType?.total}{translate('timeline.following-management.page')}</span>
                      {hiddenButton?
                        <>
                          <button  disabled ={disButtonPre} onClick={() => { handlePreviousPage() }} className="ml-0"><i className={`icon-small-primary icon-prev ${disButtonPre ? "disable" : ""}`  }/></button>
                          <button disabled ={disButtonNex}  onClick={() => { handleNextPage() }} className="ml-0"><i className={`icon-small-primary icon-next ${disButtonNex ? "disable" : ""}`}  /></button>
                        </>
                        : <></>
                      }
                    </div>
                  </div>
                  <div className="style-3">
                    <table className="table-default color-333">
                      <tbody>
                        <tr className="">
                          <td className="title-table w7" />
                          <td className="title-table w22">{translate('timeline.following-management.type')}</td>
                          <td className="title-table w46" >{translate('timeline.following-management.name')}</td>
                          <td className="title-table w25">{translate('timeline.following-management.keep-date')}</td>
                        </tr>
                        {props.followedsType?.followeds?.length > 0 && props.followedsType?.followeds?.map((item: FollowedsType, idx: number) => {
                          return (
                            <tr key={idx}>
                              <td className="text-center"><a className="icon-small-primary icon-close-up-small" onClick={() => { handleDeleteFollowed(item.followTargetId, item.followTargetType) }} /></td>
                              {renderIconType(item.followTargetType, item.followTargetId, item.followTargetName)}
                              <td>{dateToStringUserTzFormat(item.createdDate)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              : <><div className="block-feedback block-feedback-radious block-feedback-pink magin-top-5">
              {translate('timeline.following-management.message-no-data')}
            </div></>
            }
            </div>
          </div>
        </div>
          {/* <div className="modal-backdrop show" /> */}
         <TimelineDetailOthers dataPopupDetail={dataPopupDetail}/>
        </>
        );
  }

  if (!props.popout) {
    return (<>
      <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-followed" autoFocus={true} zIndex="100">
        {renderModal()}
      </Modal>

    </>);
  } else {
    if (props.popout) {
      return(
        <>
          {renderModal()}
          {props.openConfirmPopup && <ConfirmPopup infoObj={props.confirmPopupItem}/> }
        </>
      );
    } else {
      return <>
      </>
    }
  }
}

const mapStateToProps = ({applicationProfile, timelineReducerState, timelineCommonReducerState }: IRootState) => ({
  tenant: applicationProfile.tenant,
  followedsType: timelineCommonReducerState.followedsType,
  openConfirmPopup: timelineReducerState.openConfirmPopup,
  confirmPopupItem: timelineReducerState.confirmPopupItem,
  messageFollow: timelineCommonReducerState.messageFollow,
  action: timelineReducerState.action,
  messageInfo: timelineReducerState.messageInfo
});
const mapDispatchToProps = {
  toggleConfirmPopup,
  handleGetFolloweds,
  handleDeleteFolloweds,
  handleShowDetail,
  handleToggleTimelineModal,
  reset,
  handleResetMessageInfo,
  handleToggleDetailModalOther,
  handleClearCacheFollowed
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineFollowedModal);
