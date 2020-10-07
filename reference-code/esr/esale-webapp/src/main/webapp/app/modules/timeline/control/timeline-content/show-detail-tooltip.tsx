import React, { useState, useRef } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { useId } from "react-id-generator";
import PopupEmployeeDetail from 'app/modules/employees/popup-detail/popup-employee-detail';
import { CommonUtil } from '../../common/CommonUtil';
import { translate } from 'react-jhipster';
import { getLanguages } from "../../../../shared/layout/menu/employee-detail/employee-detail-setting.reducer";
import { Storage } from 'react-jhipster';
import { USER_LANGUAGE } from 'app/config/constants';
import useEventListener from 'app/shared/util/use-event-listener';
import Popover from 'app/shared/layout/common/Popover';
import StatusDetailEmployee from './status-detail-employee';

type IShowDetailTooltipProp = StateProps & DispatchProps & {
  data?: any
  position?: string
  isModal?: boolean
  isListEmployee?: boolean
}

const ShowDetailTooltip = (props: IShowDetailTooltipProp) => {
  const [hover, setHover] = useState(false);
  const [employeeId, setEmployeeId] = useState(null);
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(null);
  const language = Storage.session.get(USER_LANGUAGE);
  const registerRef = useRef(null);
  const imgRef = useRef(null);
  const [objPosition, setObjPosition] = useState({top: 0, left: 0, marginLeft: '-170px'});
  const employeeDetailCtrlId = useId(1, "timelineTooltipEmployeeDetail_")

  const onClosePopupEmployeeDetail = () => {
    setShowEmployeeDetails(false);
  }
  const renderPopUpEmployeeDetails = () => {
    if (showEmployeeDetails) {
      return (
        <PopupEmployeeDetail
          id={employeeDetailCtrlId[0]}
          showModal={true}
          employeeId={employeeId}
          listEmployeeId={[employeeId]}
          toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
          resetSuccessMessage={() => { }}
        />
      );
    }
  };

  const getAvartaColor = () => {
    if (Number(props.data.inviteType) === 2) {
      return ' green';
    }
    if (Number(props.data.inviteType) === 1) {
      return ' light-blue';
    }
  }

  const handleClickOutsideRegistration = (e) => {
    if (registerRef.current && !registerRef.current.contains(e.target)) {
      setHover(false)
    }
  }
  useEventListener('mousedown', handleClickOutsideRegistration);

  const onMouseOver = () => {
    if(props.isListEmployee) {
      const _top = imgRef.current.getBoundingClientRect().bottom;
      const _left = imgRef.current.getBoundingClientRect().right;
      setObjPosition({
        top: _top,
        left: _left,
        marginLeft: '-170px'
      })
    }
    setHover(true)
  }

  /**
   * redirect to List group
   */
  const renderTooltip = () => {
    if (hover) {
      return (
        <div className="box-user w100 text-left" ref={registerRef}>
          <div className={`min-height-auto box-user-status zindex-1 ${props.position==="right" && !props.isListEmployee  ? "location-r0": "" } ${props.isListEmployee ? "position-fixed" : ""}`} style={props.isListEmployee && {top: objPosition.top, left: objPosition.left, marginLeft: '-170px'}}>
            <div className="box-user-status-header font-size-10">
              {props.data.inviteImagePath ?
                <img className={`${props.isModal === true ? "avatar-modal-img" : "avatar"} user`} src={props.data?.inviteImagePath} alt="" title="" />
                : <span className={`${props.isModal === true ? "avatar-modal" : "avatar"} no-avatar sz-32` + getAvartaColor()}>{CommonUtil.getFirstCharacter(props.data?.inviteName)}</span>
              }
              <div className="text-ellipsis">
                <Popover x={-139} y={25}>
                  {props.data.employees?.departmentName ? props.data.employees?.departmentName : ''} {props.data.employees?.positionName ? JSON.parse(props.data.employees?.positionName)[`${language}`] : ''}
                </Popover>
              </div>
              <div className="text-blue">
                <Popover x={-139} y={25}>
                  <p className="mb-0">
                    <a className="text-ellipsis" onClick={() => { setEmployeeId(props.data?.inviteId); setShowEmployeeDetails(true) }}>
                      {props.data.employees?.employeeSurNameKana ? props.data.employees?.employeeSurNameKana : ''}
                      {props.data.employees?.employeeNameKana ? props.data?.employees?.employeeNameKana : ''}
                    </a>
                  </p>
                </Popover>
                <Popover x={-139} y={25}>
                  <p className="mb-0">
                    <a className="text-ellipsis" onClick={() => { setEmployeeId(props.data?.inviteId); setShowEmployeeDetails(true) }}>
                      {props.data.inviteName ? props.data.inviteName : ''}
                    </a>
                  </p>
                </Popover>
              </div>
              <Popover x={-20} y={25}><StatusDetailEmployee employeeId={props.data.inviteId} /></Popover>
            </div>
            <div className="box-user-group font-size-10 pb-4 mb-4">
              { props.data.employees?.cellPhoneNumber &&
                <a><img src="../../../content/images/common/ic-call.svg" alt="" />
                  <Popover x={-20} y={25}>{props.data.employees?.cellPhoneNumber}</Popover>
                </a> }
              { props.data.employees?.telePhoneNumber &&
                <a><img src="../../../content/images/common/ic-phone.svg" alt="" />
                  <Popover x={-20} y={25}></Popover>{props.data.employees?.telePhoneNumber}
                </a> }
              { props.data.employees?.email &&
                <a className={`${props.isModal ? "text-blue-modal" : "text-blue"} text-ellipsis`}><img src="../../../content/images/common/ic-mail.svg" alt="" />
                  <Popover x={-120} y={25}>{props.data.employees?.email}</Popover>
                </a> }

              {/* <a className={`${props.isModal ? "text-blue-modal" : "text-blue"}`}><img src="../../../content/images/common/ic-mail.svg" alt="" />{props.data.employees?.email}</a> */}
            </div>
            <div className="box-user-status-bottom">
             <a href={"mailto:" + props.data.employees?.email} className="button-blue">{translate('timeline.popup-show-detail.button-sent-mail')}</a>
            </div>
          </div>
        </div>
      )
    } else {
      return <></>
    }
  }

  const renderCheckInvite = () => {
    return <>
      {props.data.inviteImagePath ?
        <img className="user mr-1" src={props.data?.inviteImagePath} alt="" title="" />
        : <span className={"more-user mr-1" + getAvartaColor()}>{CommonUtil.getFirstCharacter(props.data?.inviteName)}</span>
      }
      {props.data.inviteType === 2 &&
        <>
          {renderTooltip()}
          {renderPopUpEmployeeDetails()}
        </>
      }
    </>
  }

  return (
    <div className="show-list-item align-top item p-0" onMouseOver={() => onMouseOver()} onMouseLeave={() => setHover(false)} ref={imgRef} >
      {Number(props.data.inviteType) === 2 && renderCheckInvite()}
      {Number(props.data.inviteType) === 1 && renderCheckInvite()}
    </div>
  );
}

const mapStateToProps = ({ applicationProfile, employeeDetailAction }: IRootState) => ({
  tenant: applicationProfile.tenant,
  dataGetLang: employeeDetailAction.dataGetLang,
});

const mapDispatchToProps = {
  getLanguages
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowDetailTooltip);
