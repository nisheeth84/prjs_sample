import { connect } from 'react-redux';
import React, { useRef, useState, useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { TYPE_EVENT_MOUSE_ENTER, SIZE_TOOL_TIP } from 'app/modules/global/constants';
import {
  FILE_EXTENSION_IMAGE
} from 'app/modules/tasks/constants';
import { translate } from 'react-jhipster';
import { STATUS_ONLINE } from 'app/shared/layout/common/info-employee-card/constants';
import {
  handleShowComponent
} from 'app/modules/global/task/global-control-task.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import { downloadFile } from 'app/shared/util/file-utils';
import { getFieldLabel } from 'app/shared/util/string-utils';
export const FILE_FOMATS = {
  DOC: ['doc', 'docx'],
  IMG: ['jpg', 'png', 'gif', 'bmp', 'svg'],
  PDF: ['pdf'],
  PPT: ['ppt'],
  XLS: ['xls', 'xlsx']
};

export interface ITaskFieldGlobal extends StateProps, DispatchProps {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  data?: any;
  type: string;
  isDisplay?: boolean;
  onClickDetailMilestone?: (milestoneId: number) => void,
  onClickDetailSubTask?: (subtaskId: number) => void,
  onClickDetailTask?: (taskId: number) => void,
  onOpenModalEmployeeDetail: (employeeId: number) => void;
}

export const TaskFieldGlobal = (props: ITaskFieldGlobal) => {
  const globalToolTaskRef = useRef(null);
  const [topGlobalToolTip, setTopGlobalToolTip] = useState(null);
  const [isCheckHiddenToolTip, setCheckHiddenToolTip] = useState(false);
  const [stylePreview, setStylePreview] = useState(null);

  useEffect(() => {
    if (globalToolTaskRef && globalToolTaskRef.current && globalToolTaskRef.current.getBoundingClientRect().bottom > window.innerHeight) {
      setCheckHiddenToolTip(true);
      props.type === TYPE_EVENT_MOUSE_ENTER.TASK_OPERATOR ? setTopGlobalToolTip(window.innerHeight - SIZE_TOOL_TIP.HEIGHT_OPERATOR) : setTopGlobalToolTip(window.innerHeight - SIZE_TOOL_TIP.MAX_HEIGHT_OTHER);
    }
  }, [globalToolTaskRef]);

  const onImgError = (event) => {
    event.target.onerror = null;
    event.target.src = '/content/images/task/ic-clip-red.svg'
  }

  /**
* check image
* @param fileName fileName check image
*/
  const checkImage = (fileName) => {
    let flagCheckImage = false;
    FILE_EXTENSION_IMAGE.forEach(fileExtension => {
      if (fileName && fileName.toLowerCase().includes(fileExtension)) {
        flagCheckImage = true;
      }
    });
    return flagCheckImage;
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

  /**
 * Handle download file
 * @param fileName 
 * @param link 
 */
  const handleClickFile = (fileName, link) => {
    downloadFile(fileName, link, () => {
      // TODO : action when download failed
      // const message = translate('messages.ERR_COM_0042', { 0: fileName });
    });
  }

  const getExtentionIcon = (file) => {
    const ext = file.fileName.split('.').pop().toLowerCase();
    if (FILE_FOMATS.IMG.includes(ext)) {
      return 'img';
    }
    if (FILE_FOMATS.DOC.includes(ext)) {
      return 'doc';
    }
    if (FILE_FOMATS.PDF.includes(ext)) {
      return 'pdf';
    }
    if (FILE_FOMATS.PPT.includes(ext)) {
      return 'ppt';
    }
    if (FILE_FOMATS.XLS.includes(ext)) {
      return 'xls';
    }
    return 'xxx';
  }

  /**
 * Render status Online, Offline, Away
 * @param numberOnline
 */
  const renderStatusOnline = (numberOnline) => {
    if (numberOnline === STATUS_ONLINE.ONLINE) {
      return <div className="status online">{translate("status.online")} </div>
    }
    if (numberOnline === STATUS_ONLINE.AWAY) {
      return <div className="status busy">{translate("status.away")}</div>
    }
    return <div className="status offline">{translate("status.offline")}</div>
  }

  const handlePreviewImage = (id) => {
    if (props.data) {
      const element = document.getElementById(`fileItem_${id}`);
      const style = {}
      if (element) {
        const topBox = element.getBoundingClientRect().top;
        const leftBox = element.getBoundingClientRect().left - 200;
        const space = window.innerHeight - element.getBoundingClientRect().bottom;
        if (space > 300) {
          style['left'] = `${leftBox}px`;
          style['top'] = `${topBox}px`;
        } else {
          style['left'] = `${leftBox}px`;
          style['bottom'] = `${space}px`;
          style['top'] = 'inherit';
        }
      }
      setStylePreview(style);
    }
  }

  /**
   * Render Global task's name
   */
  const renderGlobalTaskName = () => {
    return (
      <div className={`box-select-option global-task-name-over position-absolute z-index-999 ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: props.top, right: props.right, left: 'inherit', bottom: props.bottom }}>
        <div className="text"><a>{props.data}</a></div>
      </div>
    )
  }

  /**
   * Render Global task's file
   */
  const renderGlobalTaskFile = () => {
    return (
      <div className={`box-list-file max-width-200 max-height-350 overflow-y-hover position-absolute global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: isCheckHiddenToolTip ? topGlobalToolTip : props.top, right: props.right, left: 'inherit', bottom: props.bottom }} ref={globalToolTaskRef}>
        <ul className='w-100'>
          {props.data.map((file, idx) => {
            const fileName = file['file_name'] ? file['file_name'] : file['fileName'];
            const filePath = file['file_path'] ? file['file_path'] : file['filePath'];
            const fileUrl = file['file_url'] ? file['file_url'] : file['fileUrl'];
            const ext = getExtentionIcon(file);
            return (
              <li key={file.fileId + idx + ''} className="file-hover">
                <a id={`fileItem_${file.fileId}`} className={'text-primary font-weight-normal'} onMouseEnter={() => handlePreviewImage(file.fileId)} onClick={() => handleClickFile(fileName, fileUrl ? fileUrl : filePath)}>
                  <img
                    className="icon"
                    src={`/content/images/common/ic-file-${ext}.svg`}
                    onError={onImgError}
                    alt=""
                  />
                  {file.fileName}
                </a>
                {checkImage(file.fileName) && (
                  <div className="img-preview position-fixed" style={stylePreview}>
                    <img src={`${file.fileUrl}`} alt="" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    )
  }

  const handleClickButtonConsultation = () => {
    window.location.href = `mailto:${props.data.employee.email}`;
  }

  /**
   * Render Global task's operator
   */
  const renderGlobalTaskOperator = () => {
    const {
      photoFilePath, departmentName, cellphoneNumber, telephoneNumber, email, employeeNameKana, employeeName, employeeSurnameKana, employeeSurname
    } = props.data.employee;
    return (
      <div className={`overflow-y-hover max-height-350 box-user-status global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: isCheckHiddenToolTip ? topGlobalToolTip : props.top, right: props.right, left: 'inherit', bottom: props.bottom }} ref={globalToolTaskRef}>
        <div className="box-user-status-header font-size-12">
          <img className="avatar rounded-circle" src={photoFilePath} alt="" onError={e => onImageAvatarEmployeeNotFound(e, props.data.employee)} />
          <div className="font-size-12">{departmentName} {getFieldLabel(props.data.employee, "positionName")}</div>
          <div className="text-blue font-size-14">
            <p className="word-break-all" onClick={() => props.onOpenModalEmployeeDetail(props.data.employee.employeeId)}>{employeeSurnameKana ? employeeSurnameKana : ''} {employeeNameKana ? employeeNameKana : ''}</p>
            <p className="word-break-all" onClick={() => props.onOpenModalEmployeeDetail(props.data.employee.employeeId)}>{employeeSurname ? employeeSurname : ''} {employeeName ? employeeName : ''}</p>
          </div>
          {renderStatusOnline(props.data.checkOnlineNumber)}
        </div>
        <div className="box-user-group font-size-12">
          {cellphoneNumber && (
            <a>
              <img src="../../content/images/common/ic-call.svg" alt="icon-phone" />
              {cellphoneNumber}
            </a>
          )}
          {telephoneNumber && (
            <a>
              <img src="../../content/images/common/ic-phone.svg" alt="icon-phone" />
              {telephoneNumber}
            </a>
          )}
          {email && (
            <a className="text-blue" href={'mailto:' + email}>
              <img src="../../content/images/common/ic-mail.svg" alt="icon-phone" />
              {email}
            </a>
          )}
        </div>
        <div className="box-user-status-bottom">
          <a className="button-blue button-blue font-size-14 w100 font-size-14" onClick={handleClickButtonConsultation}>{translate('tasks.list.card.consultation')}</a>
        </div>
      </div>
    )
  }

  /**
   * Render Global task's memo
   */
  const renderGlobalTaskMemo = () => {
    return (
      <div className={`box-select-option max-width-200 max-height-350 overflow-y-hover global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: props.top, right: props.right, left: 'inherit', bottom: props.bottom }} ref={globalToolTaskRef}>
        <div className="text word-break-all style-3">{props.data}</div>
      </div>
    )
  }

  /**
   * Render Global task's milestone
   */
  const renderGlobalTaskMilestone = () => {
    return (
      <div className={`box-select-option max-width-200 max-height-350 overflow-y-hover global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: isCheckHiddenToolTip ? topGlobalToolTip : props.top, right: props.right, left: 'inherit', bottom: props.bottom }} ref={globalToolTaskRef}>
        <ul className='w-100'>
          <li>
            <a onClick={() => props.onClickDetailMilestone(props.data.milestoneId)} className={'text-primary'}><img className="icon" src="/content/images/task/ic-flag-brown.svg" alt="" title="" />{props.data.milestoneName}</a>
          </li>
        </ul>
      </div>
    )
  }

  /**
   * Render Global task's subtask
   */
  const renderGlobalSubtask = () => {
    return (
      <div className={`box-select-option max-width-200 max-height-350 overflow-y-hover global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: isCheckHiddenToolTip ? topGlobalToolTip : props.top, right: props.right, left: 'inherit', bottom: props.bottom }} ref={globalToolTaskRef}>
        <ul className='w-100'>
          {props.data.map((sub, id) =>
            <li key={id}><a className={'icon-task text-primary'} title="" onClick={() => props.onClickDetailSubTask(sub.taskId)}><img className="icon" src="/content/images/task/ic-time1.svg" alt="" title="" />{sub.taskName}</a></li>
          )}
        </ul>
      </div>
    )
  }

  /**
   * Render Global milestone name
   */
  const renderGlobalMilestoneName = () => {
    return (
      <div className={`box-select-option global-task-name-over position-absolute global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: props.top, right: props.right, left: 'inherit', bottom: props.bottom }}>
        <div className="text">
          <span><img src="/content/images/task/ic-flag-brown.svg" className="icon" alt="" title="" />{props.data}</span>
        </div>
      </div>
    )
  }

  const renderGlobalMilestoneTask = () => {
    return (
      <div className={`box-select-option max-width-200 max-height-350 overflow-y-hover global-popup-index ${props.isDisplay ? 'd-block' : 'd-none'}`}
        style={{ top: isCheckHiddenToolTip ? topGlobalToolTip : props.top, right: props.right, left: 'inherit', bottom: props.bottom }} ref={globalToolTaskRef}>
        <ul className='w-100'>
          {props.data.map((it, id) =>
            <li key={`task-${id}`}><a title="" className={'icon-task text-primary'} onClick={() => props.onClickDetailTask(it.taskId)}>
              <img className="icon" src="/content/images/task/ic-time1.svg" alt="" title="" />{it.taskName}</a></li>
          )}
        </ul>
      </div>
    )
  }

  /**
   * Event user mouse leave
   * @param e 
   */
  const onMouseLeave = (e) => {
    if (globalToolTaskRef && globalToolTaskRef.current && !globalToolTaskRef.current.contains(e.target)) {
      props.handleShowComponent(0, 0, 0, 0, null, null, false);
    }
  }

  useEventListener('mouseover', onMouseLeave)

  return <>
    {props.type === TYPE_EVENT_MOUSE_ENTER.CUSTOMER_PRODUCT_TRADING && renderGlobalTaskName()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.TASK_NAME && renderGlobalTaskName()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.TASK_FILE && renderGlobalTaskFile()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.TASK_OPERATOR && renderGlobalTaskOperator()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.TASK_MEMO && renderGlobalTaskMemo()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.TASK_MILESTONE_NAME && renderGlobalTaskMilestone()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.SUB_TASK && renderGlobalSubtask()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.MILESTONE_NAME && renderGlobalMilestoneName()}
    {props.type === TYPE_EVENT_MOUSE_ENTER.MILESTONE_TASK && renderGlobalMilestoneTask()}
  </>;
}

const mapStateToProps = ({ authentication }: IRootState) => ({
  onlineNumber: authentication.online,
});

const mapDispatchToProps = {
  handleShowComponent
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TaskFieldGlobal);