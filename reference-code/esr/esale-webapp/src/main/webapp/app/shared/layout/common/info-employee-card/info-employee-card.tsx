import React, { useState, useEffect } from 'react';
import { STATUS_ONLINE } from './constants';
import { translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { checkOnline, resetOnline } from 'app/shared/reducers/authentication.ts';
import { IRootState } from 'app/shared/reducers';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IInfoEmployeeCardProps extends DispatchProps, StateProps {
  employee: any;
  taskType?: number;
  onOpenModalEmployeeDetail?: (employeeId: number) => void;
  styleHover?: {};
  classHover?: any;
}

const InfoEmployeeCard = (props: IInfoEmployeeCardProps) => {
  const [online, setOnline] = useState(-1);
  /**
 * Render status Online, Ofline, Away
 * @param numberOnline
 */
  const renderStatusOnline = (numberOnline) => {
    if (numberOnline === STATUS_ONLINE.ONLINE) {
      return <div className="status position-static online">{translate("status.online")} </div>
    }
    if (numberOnline === STATUS_ONLINE.AWAY) {
      return <div className="status position-static busy">{translate("status.away")}</div>
    }
    return <div className="status position-static offline">{translate("status.offline")}</div>
  }

  /**
 * create avatar image from first character of name
 * @param event
 */
  const onImageAvatarEmployeeNotFound = (event, employeeData) => {
    event.target.onerror = null;
    const employeeFullName = employeeData.employeeSurname ? employeeData.employeeSurname : employeeData.employeeName;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', "48px");
    canvas.setAttribute('height', "48px");
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = "#8ac891";
    ctx.fillRect(0, 0, 48, 48);
    ctx.fillStyle = "#fff"
    ctx.font = "28px Noto Sans CJK JP";
    ctx.fillText(employeeFullName[0], 12, 34);
    event.target.src = canvas.toDataURL('image/jpeg', 1.0);
  }

  useEffect(() => {
    setOnline(props.onlineNumber)
  }, [props.onlineNumber]);

  useEffect(() => {
    if (props.employee) {
      props.checkOnline(props.employee.employeeId);
    }
  }, []);

  const styleImg = {width: 'inherit', height: 'inherit'}


  const handleClickButtonConsultation = () => {
    window.location.href = `mailto:${props.employee.email}`;
  }

  return (
    <div className={`box-user-status ${props.classHover ? props.classHover : ''} ${props.taskType === 2 ? 'left-type-finish' : ''}`} style={props.styleHover}>
      <div className="box-user-status-header font-size-12">
        <img className="avatar" src={props.employee.photoFilePath ? props.employee.photoFilePath : ""} alt="" onError={(e) => onImageAvatarEmployeeNotFound(e, props.employee)} title="" />
        <div className="font-size-12 word-break-all">{props.employee.departmentName} {getFieldLabel(props.employee, "positionName")}</div>
        <div className="text-blue font-size-14">
          <a className="word-break-all" onClick={() => props.onOpenModalEmployeeDetail(props.employee.employeeId)}>{props.employee.employeeSurnameKana} {props.employee.employeeNameKana}</a><br />
          <a className="word-break-all" onClick={() => props.onOpenModalEmployeeDetail(props.employee.employeeId)}>{props.employee.employeeSurname} {props.employee.employeeName}</a>
        </div>
        {renderStatusOnline(online)}
      </div>
      <div className="box-user-group font-size-12">
        {props.employee.cellphoneNumber && <a title=""><img src="../../../content/images/common/ic-call.svg" alt="" title="" style={styleImg} />
          {props.employee.cellphoneNumber}</a>}
        {props.employee.telephoneNumber && <a title=""><img src="../../../content/images/common/ic-phone.svg" alt="" title="" style={styleImg} />
          {props.employee.telephoneNumber}</a>}
        <a title="" className="text-blue" href={"mailto:" + props.employee.email}>
          <img src="../../../content/images/common/ic-mail.svg" alt="" title="" style={styleImg} />{props.employee.email}</a>
      </div>
      <div className="box-user-status-bottom">
        <button title="" className="button-blue font-size-14 w100" onClick={handleClickButtonConsultation}>{translate("tasks.list.card.consultation")}</button>
      </div>
    </div >
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  onlineNumber: authentication.online
});

const mapDispatchToProps = {
  checkOnline,
  resetOnline
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(InfoEmployeeCard);