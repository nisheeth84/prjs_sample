import React, { useState, useEffect, useRef } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect } from 'react-redux'
import { GetTimelineGroup } from '../models/create-timeline-group';
import { handleToggleTimelineModal,
  handleCreateTimelineGroup,
  handleUpdateTimelineGroup,
  reset,
  handleSetModalMessageMode,
  handleGetTimelineGroups,
  handleResetTimelineGroupIdRes,
  handClearMessValidateRequire } from '../timeline-reducer';
import { Storage, translate } from 'react-jhipster';
import { Modal } from 'reactstrap';
import TagAutoComplete from 'app/shared/layout/common/suggestion/tag-auto-complete'
import { TagAutoCompleteMode, TagAutoCompleteType } from 'app/shared/layout/common/suggestion/constants';
import { LISTCOLOR, LIST_PERMISSION_TIMELINE_GROUP, TYPE_OF_MEMBER, AUTHORITY } from '../common/constants'
import { useHistory } from 'react-router';
import TimelineMessageInfo from '../control/message-info/timeline-message-info';
import { startExecuting } from 'app/shared/reducers/action-executing';
import _ from 'lodash';
import DialogDirtyCheckTimeline from '../common/dialog-dirty-check-timeline';
import { FILE_FOMATS } from 'app/shared/layout/dynamic-form/control-field/edit/field-edit-file';
import { ControlType } from 'app/config/constants';
import DynamicControlField from 'app/shared/layout/dynamic-form/control-field/dynamic-control-field';
import useEventListener from 'app/shared/util/use-event-listener';
import { toKatakana } from 'app/shared/util/string-utils';
import { CommonUtil } from '../common/CommonUtil';
import { TARGET_TYPE } from '../common/constants';

export interface IGroupAddEditProp extends StateProps, DispatchProps {
  toggleCloseModalGroup?: (successInfo?) => void,
  popout?: boolean,
  errorInfo?: any;
}

export enum FSActionTypeScreen {
  None,
  RemoveSession,
  SetSession,
  GetSession,
  CloseWindow,
  Search,
}

const imageDataSave = { key: '', fieldValue: null };

const GroupAddEdit = (props: IGroupAddEditProp) => {
  const timelineGroupDefaultForm: GetTimelineGroup = {
    timelineGroup: {
      timelineGroupId: null,
      timelineGroupName: null,
      isPublic: false,
      isApproval: true,
      color: null,
      comment: null,
      imageData: null,
      imageName: null,
      width: null,
      height: null,
    },
    timelineGroupInvites: [],
    isDeleteImage: false,
  };

  let storageData = {
    listBackupData: [],
    timelineGroupId: null,
    timelineGroupName: null,
    comment: null,
    isPublic: false,
    isApproval: true,
    color: null,
    imageData: null,
    imageName: null,
    width: null,
    height: null,
    invites: [],
    imagePath: null,
    timelineGroupForm: timelineGroupDefaultForm
  }

  if (props.popout) {
    storageData = Storage.local.get(GroupAddEdit.name);
  }

  const [timelineGroupForm, setTimelineGroupForm] = useState(storageData.timelineGroupForm);
  const [initialForm, setInitialForm] = useState(timelineGroupDefaultForm);
  const [visible, setVisible] = useState(false);
  const [bgColor, setBgColor] = useState(null);
  const [indexColor, setIndexColor] = useState(null);
  const [files, setFiles] = useState();
  const [listEmployee, setListEmployee] = useState([]);
  const [forceCloseWindow, setForceCloseWindow] = useState(false);
  const [imgWidth, setImgWidth] = useState(null);
  const [imgHeight, setImgHeight] = useState(null);
  const [listBackupData, setListBackupData] = useState(props.listTimelineGroups?.length > 0 ? props.listTimelineGroups[0] : storageData);
  const [isEdit, setIsEdit] = useState(props.isEdit);
  const [isNewLoad, setIsNewLoad] = useState(true);
  const history = useHistory();
  const [listCheckDirtyCheck, setListDirtyCheck] = useState(storageData.timelineGroupForm);
  const [isCreate, setIsCreate] = useState(true);
  const ref = useRef(null);
  const imageRef = useRef(null);
  const [tags, setTags] = useState([]);
  const [listObjectAutoComplete, setListObjectAutoComplete] = useState([]);
  const [fileUploads, setFileUploads] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [listEmployeeData, setListEmployeeData] = useState([]);
  const selectColorRef = useRef(null);
  const [textValue, setTextValue] = useState(isEdit ? listBackupData.timelineGroupName : (props.popout ? storageData.listBackupData['timelineGroupName'] : null));

  useEffect(() => {
    let groupParticipants = [];
    const res = [];
    if (isEdit && listBackupData) {
      // set tag employee
      if (listBackupData && listBackupData.invites && listBackupData.invites?.length) {
        groupParticipants = _.cloneDeep(listBackupData.invites);
        groupParticipants.forEach(element => {
          if(element.authority && element.status === 1) {
            if (element.inviteType === 2) {
              res.push({
                employeeSurnameKana: element.employees?.employeeSurNameKana,
                employeeNameKana: element.employees?.employeeNameKana,
                employeeSurname: element.employees?.employeeSurname,
                employeeName: element.employees?.employeeName,
                employeeId: element.inviteId,
                participantType: element.authority,
                departments: [{
                  departmentName: element.employees?.departmentName,
                  positionName: element.employees?.positionName
                }],
                photoFileUrl: element.inviteImagePath
              })
            } else if (element.inviteType === 1) {
              const listTemp = [];
              element.departments.employeeId.forEach((employeeIds, idx) => {
                listTemp.push({
                  employeeId: employeeIds,
                  employeeName: element?.departments?.employeeName[idx],
                  employeeSurname: element?.departments?.employeeSurname[idx]
                })
              })
              res.push({
                departmentId: element.inviteId,
                departmentName: element.inviteName,
                parentDepartment: { departmentName: element.inviteName },
                participantType: element.authority,
                employeesDepartments: listTemp
              })
            }
          }
        })
      }
      ref && ref.current && ref.current.setTags && ref.current.setTags(res);

      // set file
      const imageData = _.cloneDeep(imageDataSave);
      const lengthName = listBackupData.imageName ? listBackupData.imageName.split('/')?.length : 0;
      const nameFile = listBackupData.imageName ? listBackupData.imageName.split('/')[lengthName - 1] : '';
      imageData.fieldValue = [{
        fileName: nameFile,
        filePath: listBackupData.imagePath,
        fileUrl: listBackupData.imagePath
      }];
      imageRef && imageRef.current && imageRef.current.setValueEdit && imageRef.current.setValueEdit(imageData.fieldValue);
    }
  }, [listBackupData])
  /**
  * set mode to display message on modal
  */
  useEffect(() => {
    props.handleSetModalMessageMode(true)
    return () => { props.handleSetModalMessageMode(false) }
  }, [])

  useEffect(() => {
    setListDirtyCheck(timelineGroupForm);
  }, [isCreate])

  /**
   * effect set value for listBackupData when listTimelineGroups change
   */
  useEffect(() => {
    if (props.listTimelineGroups?.length > 0) {
      setListBackupData(props.listTimelineGroups[0]);
    }
  }, [props.listTimelineGroups])

  /**
   * action close modal
   */
  const handleCloseModal = () => {
    props.handleToggleTimelineModal(false);
  }

  /**
   * set value for timelineGroupForm when modal edit
   */
  useEffect(() => {
    if (isEdit) {
      const arr = ['imageData', 'imageName', 'width', 'height', 'imagePath']
      Object.keys(timelineGroupForm.timelineGroup).forEach(key => {
        if(listBackupData[key] && !arr.includes(key)) {
          timelineGroupForm.timelineGroup[key] = listBackupData[key]
        }
      })
      timelineGroupForm.timelineGroupInvites = listBackupData.invites;
      setTags(listBackupData.invites);
      setTimelineGroupForm(timelineGroupForm);
    }
  }, [])

  const getfileUploads = () => {
    const fUploads = [];
    const keyFiles = Object.keys(fileUploads);
    keyFiles.forEach(key => {
      const arrFile = fileUploads[key];
      arrFile.forEach(file => {
        fUploads.push(file);
      });
    });
    return fUploads;
  }

  const getMetaData = (url, callback) => {
    const img = new Image();
    img.src = url;
    img.onload = () => { callback(img.width, img.height); }
  }

  const setFileToForm = () => {
    const fileUpload = getfileUploads();
    const fileId = props.timelineGroupId ? props.timelineGroupId : 0;
    if(fileUpload && fileUpload?.length > 0) {
      const u = URL.createObjectURL(fileUpload[0][fileId + '.fileUpload.file0']);
      getMetaData(u, (width, height) => {
        setImgWidth(width);
        setImgHeight(height);
        timelineGroupForm.timelineGroup.width = width;
        timelineGroupForm.timelineGroup.height = height;
        timelineGroupForm.timelineGroup.imageData = fileUpload[0][fileId + '.fileUpload.file0'];
        timelineGroupForm.timelineGroup.imageName = fileUpload[0][fileId + '.fileUpload.file0']['name'];
        timelineGroupForm.isDeleteImage = false;
        setTimelineGroupForm(timelineGroupForm);
      });
    }
  }

  /**
   * action click button save
   */
  const onConfirmEdit = () => {
    const listTimelineGroupsInvite = [];
    const arrayTemp = [];
    const cloneList = _.cloneDeep(timelineGroupForm.timelineGroupInvites);
    cloneList.forEach(item => {
      if(item.groupId) {
        item.employeesGroups.forEach(element => {
          const emp = {
            inviteId: null,
            inviteType: null,
            status: null,
            authority: null
          };
          emp.inviteId = element.employeeId;
          emp.inviteType = item.inviteType;
          emp.status = item.status;
          emp.authority = item.authority;
          arrayTemp.push(emp);
        })
      } else {
        const emp = {
          inviteId: null,
          inviteType: null,
          status: null,
          authority: null
        };
        Object.keys(emp).forEach(key => {
          if(item[key]) {
            emp[key] = item[key];
          }
        })
        arrayTemp.push(emp);
      }
    });
    arrayTemp.forEach(element => {
      const isExistEmployee = listTimelineGroupsInvite.some(emp => emp.inviteId === element.inviteId);
      if(!isExistEmployee) {
        listTimelineGroupsInvite.push(element);
      }
    })
    setTimelineGroupForm({ ...timelineGroupForm, timelineGroupInvites: listTimelineGroupsInvite });
    setFileToForm();
    setTimeout(()=>{
      if (isEdit) {
        props.handleUpdateTimelineGroup({ ...timelineGroupForm, timelineGroupInvites: listTimelineGroupsInvite });
      } else {
        props.handleCreateTimelineGroup({ ...timelineGroupForm, timelineGroupInvites: listTimelineGroupsInvite });
      }
    }, 10)
  };

  /**
   * redirect to detail group when create or update success
   */
  useEffect(() => {
    if (props.timelineGroupIdRes && !isNewLoad) {
      props.handleToggleTimelineModal({ flag: false });
      props.handleGetTimelineGroups({ sortType: 1, timelineGroupIds: [props.timelineGroupIdRes] });
      history.push(`/timeline/channel/detail/${props.timelineGroupIdRes}`);
    }
    setIsNewLoad(false);
  }, [props.timelineGroupIdRes])

  /**
   * action store session
   * @param mode
   */
  const updateStateSession = (mode: FSActionTypeScreen) => {
    if (mode === FSActionTypeScreen.SetSession) {
      Storage.local.set(GroupAddEdit.name, {
        timelineGroupForm,
        initialForm,
        visible,
        bgColor,
        indexColor,
        listEmployee,
        files,
        imgWidth,
        imgHeight,
        dataSave: props.listTimelineGroups[0],
        listBackupData,
        isEdit,
        isNewLoad,
        history,
        listCheckDirtyCheck,
        isCreate,
        ref,
        tags,
        listObjectAutoComplete,
        fileUploads,
        listEmployeeData
      });
    } else if (mode === FSActionTypeScreen.GetSession) {
      const saveObj = Storage.local.get(GroupAddEdit.name);
      if (saveObj) {
        setTimelineGroupForm(saveObj.timelineGroupForm);
        setInitialForm(saveObj.initialForm);
        setVisible(saveObj.visible);
        setBgColor(saveObj.bgColor);
        setIndexColor(saveObj.indexColor);
        setListEmployee(saveObj.listEmployee);
        setFiles(saveObj.files);
        setImgWidth(saveObj.imgWidth);
        setImgHeight(saveObj.imgHeight);
        setListBackupData(saveObj.listBackupData);
        setIsEdit(saveObj.isEdit);
        setIsNewLoad(saveObj.isNewLoad);
        setListDirtyCheck(saveObj.listCheckDirtyCheck);
        setIsCreate(saveObj.isCreate);
        setTags(saveObj.tags);
        setListObjectAutoComplete(saveObj.listObjectAutoComplete);
        setFileUploads(saveObj.fileUploads);
        setListEmployeeData(saveObj.listEmployeeData);
      }
    } else if (mode === FSActionTypeScreen.RemoveSession) {
      Storage.local.remove(GroupAddEdit.name);
    }
  }

  const handleClickOutsidePulldown = (e) => {
    if (selectColorRef.current && !selectColorRef.current.contains(e.target)) {
      setVisible(false);
    }
  }
  useEventListener('mousedown', handleClickOutsidePulldown);

  /**
   * action open new window
   */
  const openNewWindow = () => {
    updateStateSession(FSActionTypeScreen.SetSession);
    props.handleToggleTimelineModal(false);
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    window.open(`${window.location.origin}/${props.tenant}/channel/create-edit`, '', style.toString());
  }

  /**
   * action check create or update group for render title modal
   */
  const checkIsEditOrCreate = () => {
    if (isEdit) {
      return <> {translate('timeline.modal.title-update')} </>
    } else {
      return <> {translate('timeline.modal.title')} </>
    }
  }

  /**
   * action check create or update for render button
   */
  const checkIsEditOrCreateButton = () => {
    return isEdit ? <> {translate('timeline.modal.button-update')} </> : <> {translate('timeline.modal.button-create')} </>;
  }

  /**
   * action check color active or not active and render
   * @param index
   */
  const renderCheckColorClassName = (index) => {
    if (index === indexColor) {
      return "active"
    } else {
      return ""
    }
  }

  /**
   * render check span color in list color
   * @param index
   */
  const renderCheckColor = (index) => {
    if (index === indexColor) {
      return <><i className="far fa-check" /></>
    }
  }


  /**
   * action change color
   */
  const onChangeColor = (index) => {
    setBgColor('color-bg-' + index);
    renderCheckColorClassName(indexColor);
    renderCheckColor(indexColor);
    renderCheckColorClassName(index);
    renderCheckColor(index);
    setIndexColor(index);
    // set value form
    if (index >= 0) {
      setTimeout(() => {
        setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, color: LISTCOLOR[index].value } });
        setListDirtyCheck({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, color: LISTCOLOR[index].value } })
      }, 100)
    }
  }

  /**
   * random color when open modal create and render
   */
  const randomColorIndex = () => {
    const idx = Math.floor(Math.random() * 28);
    setIndexColor(idx);
    onChangeColor(idx);
    setIsCreate(false);
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
        handleCloseModal();
      }
    }
  }, [forceCloseWindow]);

  useEffect(() => {
    if (isEdit) {
      let index = -1;
      let isExist = false;
      LISTCOLOR.forEach(item => {
        if (item.value.toLowerCase() === listBackupData.color?.toString().toLowerCase()) {
          index = item.id;
          isExist = true;
        }
      })
      if (index === -1) {
        randomColorIndex();
      } else {
        onChangeColor(index);
      }
    } else {
      randomColorIndex();
    }
  }, [])

  useEffect(() => {
    firstLoad();
    return () => {
      props.reset();
      document.body.className = document.body.className.replace('modal-open', '');
    }
  }, [])

  /**
   * check the form is change?
   */
  const isChangeInput = () => {
    if (JSON.stringify(listCheckDirtyCheck) !== JSON.stringify(timelineGroupForm)) return true;
    return false;
  }

  /**
   * dirty check
   */
  const executeDirtyCheck = async () => {
    const onCancel = () => { };
    const isChange = isChangeInput();
    if (isChange) {
      await DialogDirtyCheckTimeline({
        onLeave: handleCloseModal, onStay: onCancel, ok: translate('global.dialog-dirtycheck.parttern1.confirm'),
        cancel: translate('global.dialog-dirtycheck.parttern1.cancel'),
        content: translate('timeline.dirty-check.content-create-timeline-group'),
        title: translate('global.dialog-dirtycheck.parttern1.title')
      });
    } else {
      handleCloseModal();
    }
  }

  const convertToKatakana = (e) => {
    const { value } = e.target;
    setTextValue(toKatakana(value));
  }

  const onChangeTextValue = (e) => {
    setTextValue(e.target.value);
    const { value } = e.target;
    setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, timelineGroupName: toKatakana(value).trim() }})
  }

  /**
   * render component select color
   */
  const buildSelectColorComponent = () => {
    return <>
      <div className="box-select-option box-select-option-popup bg-color-0" ref={selectColorRef}>
        <div className="box-select-option-bottom select-color">
          <ul className="color-table" >
            {LISTCOLOR.map((item, index) => {
              return <li key={item.id}>
                <span className={`${item.style} ${renderCheckColorClassName(index)}`} onClick={() => onChangeColor(item.id)}>{renderCheckColor(index)}</span>
              </li>
            })}
          </ul>
        </div>
      </div>
    </>
  }

  /**
   * clone deep file
   * @param fUploads
   */
  const updateFiles = (fUploads) => {
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  }

  /**
   * handle change status of file is delete or exist
   * @param item
   * @param type
   * @param val
   */
  const updateStateField = (item, type, val) => {
    if(val && val?.length > 0) {
      if(val[0].status === 1) {
        // status = 1 la da xoa file
        timelineGroupForm.isDeleteImage = true;
        setTimelineGroupForm(timelineGroupForm);
      }
    }
  }

  /**
   * render select image component
   */
  const renderChooseImage = () => {
    return <>
      <label>{translate('timeline.modal.image-group-label')}</label>
      <DynamicControlField
        ref={imageRef}
        showFieldLabel={false}
        controlType={ControlType.EDIT_LIST}
        isDnDAddField={false}
        isDnDMoveField={false}
        fieldInfo={{ fieldType: '11', fieldName: 'fileUpload' }}
        updateStateElement={updateStateField}
        updateFiles={updateFiles}
        className={'input-common-wrap false'}
        idUpdate={props.timelineGroupId}
        isSingleFile={true}
        acceptFileExtension={FILE_FOMATS.IMG}
      />
    </>
  }

  /**
   * action on off select color component
   */
  const handleClickSelectColor = () => {
    // set hidden color
    setVisible(!visible);
  }

  useEffect(() => {
    if(props.messageValidateRequire) {
      setErrorMessage(props.messageValidateRequire);
      props.handClearMessValidateRequire()
    }
  }, [props.messageValidateRequire])

  const handleTurnOffMessageError = () => {
    setErrorMessage(null);
  }

  useEffect(() => {
    setErrorMessage(props.messageInfo);
  }, [props.messageInfo])

  /**
   * render group name component
   */
  const renderNameGroup = () => {
    return <>
      <label>{translate('timeline.modal.group-name-label')}<a className="label-red ml-3">{translate('timeline.modal.require')}</a></label>
      <input
        type="text"
        className={`input-normal ${(errorMessage && props.errorCode !== "ERR_TIM_0004" && (props.errorCode === 'ERR_COM_0013' || props.errorCode === 'ERR_COM_0025')) ? 'error error-high-light' : ''}`}
        placeholder={translate('timeline.modal.group-name-placeholder')}
        autoFocus
        maxLength={255}
        name="timelineGroupName"
        value={isEdit ? textValue : null}
        onChange={onChangeTextValue}
        onClick={handleTurnOffMessageError}
        onBlur={convertToKatakana}
      />
      {errorMessage && (props.errorCode !== "ERR_TIM_0004") && (props.errorCode === "ERR_COM_0013" || props.errorCode === "ERR_COM_0025") && <span className="messenger-error fs-12">{errorMessage}</span>}
    </>
  }

  /**
   * render comment component
   */
  const renderComment = () => {
    return <>
      <label>{translate('timeline.modal.comment-label')}</label>
      <textarea
        placeholder={translate('timeline.modal.comment-placeholder')}
        name="comment"
        defaultValue={isEdit ? listBackupData.comment : null}
        onChange={(e) => setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, comment: e.target.value.trim() } })}
      />
    </>
  }

  /**
   * get list authority for option
   */
  const getListPermission = () => {
    const listPermission = [];
    LIST_PERMISSION_TIMELINE_GROUP.forEach((e, idx) => {
      listPermission.push({ id: e.itemId, name: translate(e.itemLabel) });
    });
    return listPermission;
  };

  /**
   * action set authority when select option
   * @param tagSelected
   * @param type
   */
  const setAuthority = (tagSelected, type) => {
    const listEmployeeBackup = _.cloneDeep(tags);
    if(isEdit) {
      listEmployeeBackup.forEach(item => {
        if (item.inviteId && tagSelected.employeeId && item.inviteId === tagSelected.employeeId) {
          item.participantType = type;
          item.authority = type;
        } else if (item.inviteId && tagSelected.departmentId && item.inviteId === tagSelected.departmentId) {
          const tp = type;
          item.participantType = tp;
          item.authority = tp;
        }
      });
    } else {
      listEmployeeBackup.forEach(item => {
        if (item.employeeId && tagSelected.employeeId && item.employeeId === tagSelected.employeeId) {
          item.participantType = type;
          item.authority = type;
        } else if (item.groupId && tagSelected.groupId && item.groupId === tagSelected.groupId) {
          const t = type;
          item.participantType = t;
          item.authority = t;
        } else if (item.departmentId && tagSelected.departmentId && item.departmentId === tagSelected.departmentId) {
          const tp = type;
          item.participantType = tp;
          item.authority = tp;
        }
      });
    }
    setTags(listEmployeeBackup);
    ref.current.setTags(listEmployeeBackup);
  };

  const getListInviteId = () => {
    const listInviteIdOfTimelineGroup: any[] = [];
    if (isEdit) {
      (props.listTimelineGroups?.length > 0 && props.listTimelineGroups.forEach(e => {
        (e.invites?.length > 0 && e.invites.forEach(index => {
          if(index.authority && index.status === 1) {
            const listNotSuggest = {
              idChoice: index.inviteId,
              searchType: index.inviteType
            }
            listInviteIdOfTimelineGroup.push(listNotSuggest)
          }
        }))
      })
      )
    } else {
      // push employeeId of user login
      listInviteIdOfTimelineGroup.push({ searchType: 2, idChoice: Number(CommonUtil.getUserLogin().employeeId) });
    }
    return listInviteIdOfTimelineGroup;
  }

  /**
   * action when select tag item
   * @param id
   * @param type
   * @param mode
   * @param listTag
   */
  const onActionSelectTag = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    const tmpListTags = listTag.map(el => {
      if (el.employeeId) {
        el.inviteType = TYPE_OF_MEMBER.EMPLOYEE_GROUP;
        el.inviteId = el.employeeId;
      } else if (el.groupId) {
        el.inviteType = TYPE_OF_MEMBER.EMPLOYEE_GROUP;
        el.inviteId = el.groupId;
      } else if (el.departmentId) {
        el.inviteType = TYPE_OF_MEMBER.DEPARTMENT;
        el.inviteId = el.departmentId;
      }
      el.status = 1;
      if (el.participantType) {
        el.authority = el.participantType;
        return el;
      } else {
        el.authority = AUTHORITY.OWNER;
        return { ...el, participantType: AUTHORITY.OWNER };
      }
    });
    setTags(tmpListTags);
    ref.current.setTags(tmpListTags);
  }

  useEffect(() => {
    setTimelineGroupForm({ ...timelineGroupForm, timelineGroupInvites: tags });
    setListEmployee(tags);
  }, [tags])

  /**
   * render select employee selection
   */
  const renderSelectEmployee = () => {
    return <>
      <TagAutoComplete
        id="employeeIdGroupTimeline"
        modeSelect={TagAutoCompleteMode.Multi}
        type={TagAutoCompleteType.Employee}
        ref={ref}
        placeholder={translate('timeline.modal.select-invite-placeholder')}
        className="items break-line form-group"
        inputClass="input-normal"
        listActionOption={getListPermission()}
        onActionSelectTag={onActionSelectTag}
        title={translate('timeline.modal.select-invite-label')}
        onActionOptionTag={setAuthority}
        tagListNotSuggestion={getListInviteId()}
      />
    </>
  }

  /**
   * render radio button check isPublic
   */
  const renderCheckPublic = () => {
    return <>
      <div className="col-lg-6 form-group common">
        <label>{translate('timeline.modal.is-public-label')}</label>
        <div className="wrap-check">
          <div className="wrap-check-radio">
            <p className="radio-item mr-5">
              <input
                type="radio"
                id="isPublicId01"
                name="isPublic"
                defaultChecked={isEdit && listBackupData.isPublic === true}
                value="true"
                onChange={(e) => setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, isPublic: e.target.value } })} />
              <label htmlFor="isPublicId01">{translate('timeline.modal.public')}</label>
            </p>
            <p className="radio-item">
              <input
                type="radio"
                id="isPublicId02"
                name="isPublic"
                defaultChecked={(isEdit && listBackupData.isPublic === false) || !isEdit}
                value="false"
                onChange={(e) => setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, isPublic: e.target.value } })} />
              <label htmlFor="isPublicId02">{translate('timeline.modal.private')} </label>
            </p>
          </div>
        </div>
      </div>
    </>
  }

  /**
   * render radio button check isApproval
   */
  const renderCheckApproval = () => {
    return <>
      <div className="col-lg-6 form-group common">
        <label>{translate('timeline.modal.approval-label')}</label>
        <div className="wrap-check">
          <div className="wrap-check-radio">
            <p className="radio-item mr-5">
              <input
                type="radio"
                id="isApprovalId01"
                name="isApproval"
                defaultChecked={(isEdit && listBackupData.isApproval === true) || !isEdit}
                value="true"
                onChange={(e) => setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, isApproval: e.target.value } })}
              />
              <label htmlFor="isApprovalId01">{translate('timeline.modal.approval')} </label>
            </p>
            <p className="radio-item">
              <input
                type="radio"
                id="isApprovalId02"
                name="isApproval"
                defaultChecked={isEdit && listBackupData.isApproval === false}
                value="false"
                onChange={(e) => setTimelineGroupForm({ ...timelineGroupForm, timelineGroup: { ...timelineGroupForm.timelineGroup, isApproval: e.target.value } })}
              />
              <label htmlFor="isApprovalId02">{translate('timeline.modal.reject')} </label>
            </p>
          </div>
        </div>
      </div>
    </>
  }

  const renderModal = () => {
    return <>
      <div className="modal popup-esr popup-esr4 user-popup-page show popup-align-common" id="popup-esr" aria-hidden="true">
        <div className={`${!props.popout ? "modal-dialog" : "h-100 modal-dialog"} form-popup`}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <button tabIndex={0} className="icon-small-primary icon-return-small disable" />
                  <span className="text">
                    <img className="icon-timeline-small" src="../../../content/images/ic-timeline-popup.svg" alt="" />
                      {checkIsEditOrCreate()}
                  </span>
                </div>
              </div>

              <div className="right">
                {!props.popout && <button tabIndex={0} className={`icon-small-primary icon-link-small`} onClick={() => openNewWindow()} />}
                {!props.popout && <button tabIndex={0} className={`icon-small-primary icon-close-up-small line`} onClick={() => { executeDirtyCheck() }} />}
              </div>
            </div>
            <div className="modal-body style-3">
              <TimelineMessageInfo isModal={true} />
              <div className="popup-content  style-3">
                <div className="user-popup-form user-popup-form2">
                  <form>
                    <div className="row break-row">
                      <div className="col-lg-6 form-group common">
                        {renderNameGroup()}
                      </div>
                      <div className="col-lg-6 form-group common">
                        {renderChooseImage()}
                      </div>
                    </div>
                    <div className="row break-row">
                      <div className="col-lg-6 form-group common">
                        {renderComment()}
                      </div>
                      <div className="col-lg-6 form-group common">
                        <label>{translate('timeline.modal.select-color-label')}</label>
                        <button type="button" className={`box-change-color action-change-color mt-2 ${bgColor}`} onClick={() => handleClickSelectColor()}>
                          {visible && buildSelectColorComponent()}
                        </button>
                      </div>
                    </div>
                    <div className="row break-row">
                      {renderCheckPublic()}
                      {renderCheckApproval()}
                    </div>
                    {/* select employee */}
                    <div className="row break-row">
                      <div className="col-lg-6 break-line form-group mb-2">
                        {renderSelectEmployee()}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="user-popup-form-bottom">
              <button tabIndex={0} className="button-blue" onClick={onConfirmEdit}>{checkIsEditOrCreateButton()}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  }

  if (!props.popout) {
    return (<>
      <Modal isOpen fade toggle={() => { }} backdrop id="popup-field-search" autoFocus={false} zIndex="auto">
        {renderModal()}
      </Modal>
    </>);
  } else {
    if (props.popout) {
      return renderModal();
    } else {
      return <></>
    }
  }
}

const mapStateToProps = ({ applicationProfile, timelineReducerState }: IRootState) => ({
  tenant: applicationProfile.tenant,
  listTimelineGroups: timelineReducerState.listTimelineGroups,
  timelineGroupId: timelineReducerState.timelineGroupId,
  isEdit: timelineReducerState.isEditGroup,
  timelineGroupIdRes: timelineReducerState.timelineGroupIdRes,
  messageValidateRequire: timelineReducerState.messageValidateRequire,
  action: timelineReducerState.action,
  errorCode: timelineReducerState.errorCode,
  messageInfo: timelineReducerState.messageInfo
});

const mapDispatchToProps = {
  handleToggleTimelineModal,
  handleCreateTimelineGroup,
  handleUpdateTimelineGroup,
  reset,
  handleSetModalMessageMode,
  startExecuting,
  handleGetTimelineGroups,
  handleResetTimelineGroupIdRes,
  handClearMessValidateRequire
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupAddEdit);
