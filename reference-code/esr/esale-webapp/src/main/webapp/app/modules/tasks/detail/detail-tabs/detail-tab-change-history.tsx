import React, { useState } from 'react';
import {
  TAB_ID_LIST
} from '../../constants';

const TYPE_STRING = "string";
const FIEL_TASK_DATA = "task_data";
const FIEL_PHOTO_FILE_PATH = "photo_file_path";

import { Storage, translate } from 'react-jhipster';
import { useId } from "react-id-generator";
import PopupEmployeeDetail from '../../../employees/popup-detail/popup-employee-detail';
import { formatDateTime, utcToTz } from 'app/shared/util/date-utils';
import { USER_FORMAT_DATE_KEY, APP_DATE_FORMAT } from 'app/config/constants';
import dateFnsFormat from 'date-fns/format';
import { getFieldLabel, getColorImage } from 'app/shared/util/string-utils';
export interface IDetailTabChangeHistory {
  changeHistory: any;
  languageId: any;
  taskLayout: any;
  getMoreDataScroll: () => void;
  tenant: any;
  tabList: any;
}

let arrayTime = [];

const TabChangeHistory = (props: IDetailTabChangeHistory) => {
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [employeeId, setEmployeeId] = useState(0);
  const employeeDetailCtrlId = useId(1, "taskDetailHistoryEmployeeDetail_")

  const getOldNewValue = (value) => {
    if (!value) {
      return []
    }
    let arrOldNewValue = []
    if (typeof value === 'string') {
      arrOldNewValue = value.split(">");
      return arrOldNewValue;
    }
    return arrOldNewValue;
  }

  const renderTaskData = (param) => {
    return (
      param.map((item) =>
        <>
          {
            item.oldData && item.newData && item.oldData.toString() !== item.newData.toString() ?
              <>
                {(typeof item.oldData === TYPE_STRING || typeof item.oldData === "number") ?
                  <>
                    <div className="mission-wrap">
                      <p className="type-mission">{item.oldData}  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {item.newData}</p>
                    </div>
                  </> :
                  <>
                    {Array.isArray(item.oldData) &&
                      item.oldData.map((item1, index1) =>
                        <>
                          {item.oldData[index1] === item.newData[index1] &&
                            <div className="mission-wrap" >
                              <p className="type-mission">{item.oldData[index1]}  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {item.newData[index1]}</p>
                            </div>
                          }
                        </>
                      )
                    }
                  </>
                }
              </> :
              <></>
          }
        </>
      )
    )
  }

  const renderImformationChange = (item) => {
    if (item.fieldChange === FIEL_TASK_DATA) {
      if (item.valueChange) {
        const lstValue = item.valueChange.split(">");
        const strNew = lstValue[1];
        const strOld = lstValue[0];
        const valueOld = Object.values(JSON.parse(strOld));
        const valueNew = Object.values(JSON.parse(strNew));
        const dataHistory = [];
        for (const [keyitem, value] of Object.entries(valueNew)) {
          dataHistory.push({ key: keyitem, newData: value, oldData: valueOld[keyitem] });
        }
        return (
          <>
            {renderTaskData(dataHistory)}
          </>
        )
      }
      return <> </>;
    }
    const oldNewValue = getOldNewValue(item.valueChange);
    if (item.key === FIEL_PHOTO_FILE_PATH) {
      return (
        <>
          <div className="mission-wrap">
            <img className="user" src={oldNewValue[0]} alt="" />
            <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" />
            <img className="user" src={oldNewValue[1]} alt="" />
          </div>
        </>
      )
    }
    return (
      <>
        <div className="mission-wrap">
          <p>{oldNewValue[0]}  <img className="arrow" src="../../content/images/ic-time-line-arrow.svg" alt="" /> {oldNewValue[1]}</p>
        </div>
      </>
    )
  }

  const handleScroll = (e) => {
    const element = e.target;
    if (props.changeHistory && element.scrollHeight - element.scrollTop === element.clientHeight) {
      props.getMoreDataScroll();
    }
  }

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  const getTabHistory = () => {
    let labelName = '';
    if (props.tabList) {
      props.tabList.map((item) => {
        if (item.tabId === TAB_ID_LIST.changeHistory) {
          labelName = getFieldLabel(item, 'labelName')
        }
      }
      )
    }
    return labelName
  }

  /**
   * open employeeId detail
   * @param employeeIdParam 
   */
  const onOpenModalEmployeeDetail = (employeeIdParam) => {
    setEmployeeId(employeeIdParam);
    setOpenPopupEmployeeDetail(true);
  }

  /**
   * create avatar image from first character of name
   * @param event error event
   * @param employeeFullName full name of employees
   */
  const onImageAvatarEmployeeNotFound = (event, employeeFullName) => {
    event.target.onerror = null;
    const canvas = document.createElement('canvas');
    canvas.setAttribute('width', "48px");
    canvas.setAttribute('height', "48px");
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = `rgb(${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)},${Math.floor(Math.random() * 200)})`;
    ctx.fillRect(0, 0, 48, 48);
    ctx.fillStyle = "#fff"
    ctx.font = "28px Noto Sans CJK JP";
    ctx.fillText(employeeFullName[0], 12, 34);
    event.target.src = canvas.toDataURL('image/jpeg', 1.0);
  }

  const getFirstCharacter = (name) => {
    return name ? name.charAt(0) : "";
  }

  const userFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);
  if (!props.changeHistory || props.changeHistory.length < 1) {
    return (
      <>
        <div className="tab-content">
          <div className="tab-pane active">
            <div className="list-table pt-2 images-group-middle">
              <div className="align-center images-group-content">
                <img className="images-group-16" src="../../content/images/task/ic-time1.svg" alt="" />
                <div className="align-center">{translate('messages.INF_COM_0020', { 0: getTabHistory() })} </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="tab-content">
          <div className="tab-pane active">
            <div className="time-line scroll-table-v2" onScroll={handleScroll} >
              {
                props.changeHistory && props.changeHistory.map((item, idx) => {
                  const dateTimeTz = formatDateTime(utcToTz(item.updatedDate).toString(), 'YYYY/MM/DD HH:mm')
                  arrayTime = dateTimeTz.split(" ");
                  return (
                    <>
                      <div className="title">
                        {props.changeHistory.length > 0 && props.changeHistory.length - 1 !== idx
                          ? translate('milestone.detail.form.label-change-history-update')
                          : translate('milestone.detail.form.label-change-history-create')}
                      </div>
                      {item.contentChange.map(itemField => {
                        return <>{renderImformationChange(itemField)}</>;
                      })}
                      <div className="mission-wrap">
                        <div className="item item2">
                          {item.updatedUserImage ? (
                            <img className="user" src={item.updatedUserImage} alt="" />
                          ) : (
                            <div className={'no-avatar ' + getColorImage(7)}>
                              {getFirstCharacter(item.updatedUserName)}
                            </div>
                          )}
                          <span className="text-blue">
                            <a onClick={() => onOpenModalEmployeeDetail(item.updatedUserId)}>
                              {item.updatedUserName}
                            </a>
                          </span>
                          <span className="date w-auto">
                            {dateFnsFormat(arrayTime[0], userFormat)}
                          </span>
                          <span className="date">{arrayTime[1]}</span>
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
        {
          openPopupEmployeeDetail &&
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            employeeId={employeeId}
            listEmployeeId={[employeeId]}
            toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
            openFromModal={true}
            resetSuccessMessage={() => { }} />
        }
      </>
    );
  }
}
export default TabChangeHistory;