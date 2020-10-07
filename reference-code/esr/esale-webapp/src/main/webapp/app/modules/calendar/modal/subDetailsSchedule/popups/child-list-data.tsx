import React from 'react';
import { STATUS_ONLINE } from 'app/shared/layout/common/info-employee-card/constants';
import { translate } from 'react-jhipster/lib/src/language/translate';

/**
 * interface child list data
 */
type IChildListData = {
  employee?: any,
  employees?: any,
  onlineStatus?: any,
  langKey?: string
}

/**
 * component child list data
 * @param props
 * @constructor
 */
export const ChildListData = (props: IChildListData) => {


  const renderPositionName = (positionName) => {
    const positionNameJson = JSON.parse(positionName)
    let positionNameConvert = ""
    if (positionNameJson[`${props.langKey}`].length > 0) {
      positionNameConvert = positionNameJson[`${props.langKey}`]
    } else if (positionNameJson[`ja_jp`].length > 0) {
      positionNameConvert = positionNameJson[`ja_jp`]
      return positionNameConvert
    } else if (positionNameJson[`en_us`].length > 0) {
      positionNameConvert = positionNameJson[`en_us`]
      return positionNameConvert
    } else if (positionNameJson[`zh_cn`].length > 0) {
      positionNameConvert = positionNameJson[`zh_cn`]
      return positionNameConvert
    }
    return positionNameConvert
  }

  const renderStatusOnline = (numberOnline) => {
    if (numberOnline === STATUS_ONLINE.ONLINE) {
      return <div className="status position-static online">{translate("status.online")} </div>
    }
    if (numberOnline === STATUS_ONLINE.AWAY) {
      return <div className="status position-static busy">{translate("status.away")}</div>
    }
    return <div className="status position-static offline">{translate("status.offline")}</div>
  }
  const renderKanaName = (employeeNameKanas) => {
    const nameValue = []
    if(employeeNameKanas['employeeNameKana']){
      nameValue.push(employeeNameKanas['employeeNameKana']) 
    }
    if(employeeNameKanas['employeeSurnameKana']){
      if(employeeNameKanas['employeeNameKana']){
        nameValue.push(" ")
      }
      nameValue.push(employeeNameKanas['employeeSurnameKana'])
    }
    return nameValue.join('')
  }

  const renderEmployeeName = (employeeNames) => {
    const nameValue = []
    if(employeeNames['employeeName']){
      nameValue.push(employeeNames['employeeName']) 
    }
    if(employeeNames['employeeSurname']){
      if(employeeNames['employeeName']){
        nameValue.push(" ")
      }
      nameValue.push(employeeNames['employeeSurname'])
    }
    return nameValue.join('')
  }

  return (<div className="box-user-status set-box-user-status">
    <div className="box-user-status-header">
      <img className="avatar set-height-avatar" src={`${props.employee["photoFilePath"] ? props.employee["photoFilePath"] : "../../../content/images/common/ic-avatar-status.svg"}`} alt="" title="" />
      <div className=" font-size-12">{renderEmployeeName(props.employee)}</div>
      {props.employee['employeeNameKana'] || props.employee['employeeSurnameKana'] &&
        <div className=" font-size-12">{renderKanaName(props.employee)}</div>
      }
      <div className="color2">{props.employee['departmentName']}<br />{props.employee['positionName'] ? renderPositionName(props.employee['positionName']) : ''}</div>
      {renderStatusOnline(props.onlineStatus)}
    </div>
    <div className="box-user-group none-border-box-user-group  font-size-12">
        <a title="" className="pl-4"><i className={`${props.employee['cellphoneNumber'].length > 0 ? "fas fa-phone transform-fa-phone" : "" }`} />{props.employee['cellphoneNumber']}</a>
        {props.employee['telephoneNumber'] && <a title="" className="pl-4" href={`tel:${props.employee['telephoneNumber']}`}><img className='mt-0' src="../../../content/images/common/ic-phone.svg" alt="" />{props.employee['telephoneNumber']}</a>}
        {props.employee['email'] && <a title="" className="pl-4" href={`mailto:${props.employee['email']}`}><img className='mt-0' src="../../../content/images/common/ic-mail.svg" alt="" /> {props.employee['email']}</a>}
    </div>
    {/* <div className="box-user-group none-border-box-user-group ">
      現在のスケジュール
      <div className="color2">予定A</div>
      10:00 ~ 11:00
    </div> */}
    <div className="box-user-status-bottom">
      <a title="" href={`mailto:${props.employee['email']}`} className="button-blue">相談</a>
    </div>
  </div>)
};





