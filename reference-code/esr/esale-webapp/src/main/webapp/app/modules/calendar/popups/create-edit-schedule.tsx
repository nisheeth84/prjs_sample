import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { connect, Options } from 'react-redux'

import { IRootState } from 'app/shared/reducers'
import {
  getScheduleById,
  reloadGridData,
  setPreScheduleData,
  onShowPopupCreate,
  resetEquipmentSuggest,
  saveSuggestionsChoice
} from './create-edit-schedule.reducer'

import 'rc-time-picker/assets/index.css'
import { Storage, translate } from 'react-jhipster'
import { isEqual } from 'lodash'
import CreateEdit from "app/modules/calendar/popups/create-edit-component";
import { isNullOrUndefined } from 'util'
import { Modal } from 'reactstrap';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message'
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check'
import { GetSchedule } from '../models/get-schedule-type'

type ComponentProps = StateProps & DispatchProps & {
  onClosePopup: () => void,
  scheduleId?: number,
  scheduleDataParam?: GetSchedule,
  openFromModal?: boolean,
}

const enum TYPE_DIRTY_CHECK {
  BACK = 1,
  CLOSE
}
const CreateEditScheduleComponent = (
  props: ComponentProps
) => {
  const {
    currentLocale, saveDataSuccess, reloadGrid, resetScheduleData,
    scheduleDataFromApi, scheduleTypes, getSchedule, errorMessage, successMessage, isClone, onClosePopup, scheduleId, tenant
  } = props
  const [modalTitle, setModalTitle] = useState(null);
  const [submitText, setSubmitText] = useState(null);
  const [errorMess, setErrorMess] = useState<any>();
  const [succMess, setSuccMess] = useState<any>();
  const [scheduleData, setScheduleData] = useState(scheduleDataFromApi)

  const [scheduleForm, setScheduleForm] = useState<any>();
  const [initialForm, setInitialForm] = useState<any>();
  const [, setFiles] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const convertParticipantShareInitialForm = (scheduleItem) => {
    const employeeParticipants = scheduleItem
      && scheduleItem.participants
      && Array.isArray(scheduleItem.participants.employees)
      && scheduleItem.participants.employees.map(item => { return { employeeId: item.employeeId } });
    const departmentParticipants = scheduleItem
      && scheduleItem.participants
      && Array.isArray(scheduleItem.participants.departments)
      && scheduleItem.participants.departments.map(item => { return { departmentId: item.departmentId } });
    const groupParticipants = scheduleItem
      && scheduleItem.participants
      && Array.isArray(scheduleItem.participants.groups)
      && scheduleItem.participants.groups.map(item => { return { groupId: item.groupId } });

    const employeeShares = scheduleItem
      && scheduleItem.shares
      && Array.isArray(scheduleItem.shares.employees)
      && scheduleItem.shares.employees.map(item => { return { employeeId: item.employeeId } });
    const departmentShares = scheduleItem
      && scheduleItem.shares
      && Array.isArray(scheduleItem.shares.departments)
      && scheduleItem.shares.departments.map(item => { return { departmentId: item.departmentId } });
    const groupShares = scheduleItem
      && scheduleItem.shares
      && Array.isArray(scheduleItem.shares.groups)
      && scheduleItem.shares.groups.map(item => { return { groupId: item.groupId } });
    if (isNullOrUndefined(scheduleItem.repeatEndType)) {
      scheduleItem.repeatEndType = 0
    }
    if (isNullOrUndefined(scheduleItem.repeatNumber)) {
      scheduleItem.repeatNumber = 0
    }
    if (isNullOrUndefined(scheduleItem.repeatType)) {
      scheduleItem.repeatType = 0
    }

    if (scheduleItem.shares && Object.keys(scheduleItem.shares).length > 0)
      return {
        ...scheduleItem,
        participants: {
          employees: employeeParticipants,
          departments: departmentParticipants,
          groups: groupParticipants
        },
        shares: {
          employees: employeeShares,
          departments: departmentShares,
          groups: groupShares
        }
      }
    else
      return {
        ...scheduleItem,
        participants: {
          employees: employeeParticipants,
          departments: departmentParticipants,
          groups: groupParticipants
        }
      }
  }
  useEffect(() => {
    if(scheduleDataFromApi){
      setScheduleData(scheduleDataFromApi)
    }
  }, [scheduleDataFromApi])
  
  useEffect(() => {
    if(props.scheduleDataParam){
      setScheduleData(props.scheduleDataParam)
      resetScheduleData(props.scheduleDataParam)
    }
  }, [props.scheduleDataParam])

  useEffect(() => {
    if(scheduleId)
      getSchedule(scheduleId)
  }, [scheduleId])

  const submitData = () => {
    setIsSubmit(true);
  }

  const isChangeInput= () =>  {
    const draftInitData = convertParticipantShareInitialForm(initialForm);
    const draftScheduleForm = convertParticipantShareInitialForm(scheduleForm);
    return !isEqual(draftInitData, draftScheduleForm)
  }
  const onLeave= () =>  {
    resetScheduleData({})
  }
  const createUpdateSession= () =>  {
    if (!Storage.local.get('calendar/create-edit-schedule')) {
      Storage.local.set('calendar/create-edit-schedule', scheduleForm)
    }
  }
  const removeCreateUpdateSession= () =>  {
    if (Storage.local.get('calendar/create-edit-schedule')) {
      Storage.local.remove('calendar/create-edit-schedule')
    }
  }
  
  const dirtyCheckToClose = async (typePopup: TYPE_DIRTY_CHECK) => {
    const isChange = isChangeInput();
    if (isChange) {
      await DialogDirtyCheck({
        onLeave() {
          removeCreateUpdateSession();
          onLeave()
          props.onShowPopupCreate(false)
          onClosePopup()
        },
        partternType: typePopup,
      });
    } else {
      onLeave()
      props.onShowPopupCreate(false)
      onClosePopup()
    }
  }

  useEffect(() => {
    reloadGrid()
    if (saveDataSuccess) {
      setTimeout(() => {
        resetScheduleData({})
      }, 1000)
    }
  }, [saveDataSuccess])

  useEffect(() => {
    if (errorMessage) setErrorMess(errorMessage)
  }, [errorMessage])

  useEffect(() => {
    if (successMessage) setSuccMess(successMessage)
  }, [successMessage])

  useEffect(() => {
    setModalTitle(<><img className="icon-group-user mt-1" title="" src="../../../../content/images/ic-sidebar-calendar.svg" alt="" /> {scheduleData && !scheduleData.scheduleId ? translate('calendars.form.schedule_registration') : translate('calendars.form.schedule_update')}</>)
  }, [currentLocale])


  // Transfer loading state int
  //   useEffect(() => {
  //     setLoading(isLoading)
  //   }, [isLoading])o component modal

  useEffect(() => {
    if (scheduleData && scheduleData?.scheduleId && !isClone) {
      setSubmitText(translate('calendars.form.save'))
      setModalTitle(<><img className="icon-group-user mt-1" title="" src="../../../../content/images/ic-sidebar-calendar.svg" alt="" /> {translate('calendars.form.schedule_update')}</>)
    } else {
      setSubmitText(translate('calendars.form.register'));
      setModalTitle(<><img className="icon-group-user mt-1" title="" src="../../../../content/images/ic-sidebar-calendar.svg" alt="" /> {translate('calendars.form.schedule_registration')}</>)
    }
  }, [scheduleData]);

  /**
   * pass data from create-edit-component to create-edit-schedule
   * @param scheduleFormData
   * @param initialFormData
   * @param filesData
   */
  const handleDataPass = (scheduleFormData: any, initialFormData: any, filesData: any) => {
    setScheduleForm(scheduleFormData);
    setInitialForm(initialFormData);
    setFiles(filesData);
  }

  useEffect(() => {
    if ((!errorMessage || errorMessage.length <= 0) && (!successMessage || successMessage.length <= 0))
      setIsSubmit(false);
  }, [errorMessage]);

  useEffect(() => {
    // Get schedule by id from location params
    // const { params } = match
  }, [scheduleTypes]);

  const displayMessage = () => {
    if ((!errorMess || errorMess.length <= 0) && (!succMess || succMess.length <= 0)) {
      return <></>
    }
    return (
      <div className="row">
        <div className="col-10 offset-1 mb-3">
          <BoxMessage
            className="max-width-720 m-auto"
            messageType={errorMess && errorMess.length > 0 ? MessageType.Error : MessageType.Success}
            message={errorMess && errorMess.length > 0 ? errorMess : succMess}
          />
        </div>
      </div>
    )
  }
  const openNewWindow =() => {
    const height = screen.height * 0.6;
    const width = screen.width * 0.6;
    const left = screen.width * 0.2;
    const top = screen.height * 0.2;
    const style = `width=${width},height=${height},left=${left},top=${top}`;
    createUpdateSession();
    window.open(`${tenant}/create-edit-schedule`, '', style.toString());
  }
  return (
    <Modal
      isOpen
      style={{ overlay: { zIndex: 9 } }}
      zIndex="auto"
    >
      <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
        <div className="modal-dialog form-popup">
          <div className="modal-content">
            <div className="modal-header">
              <div className="left">
                <div className="popup-button-back">
                  <a title=""
                    // className={ ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small setting-disabled'}
                    className={props.openFromModal || scheduleData?.scheduleId ? 'icon-small-primary icon-return-small' : 'icon-small-primary icon-return-small setting-disabled'}
                    onClick={() => {
                      (props.openFromModal || scheduleData?.scheduleId) && dirtyCheckToClose(TYPE_DIRTY_CHECK.BACK)
                    }} 
                  />
                  <span className="text">
                    {modalTitle}
                  </span>
                </div>
              </div>
              <div className="right">
                <a title="" className="icon-small-primary icon-link-small" onClick={() => {openNewWindow()} } />
                <a title="" className="icon-small-primary icon-close-up-small line" onClick={() => {
                  dirtyCheckToClose(TYPE_DIRTY_CHECK.CLOSE)
                }} />
              </div>
            </div>
            <div className="modal-body style-3">
              <div className={`popup-content max-height-auto style-3 popup-calendar-tool-1`}>
                <CreateEdit extendFlag={true} extendHandle={handleDataPass} isSubmit={isSubmit} setIsSubmit={setIsSubmit} modeEdit={!!scheduleData?.scheduleId} resetEquipmentSuggest={props.resetEquipmentSuggest} saveSuggestionsChoice={props.saveSuggestionsChoice}/>
              </div>
            </div>
            {displayMessage()}
            <div className="user-popup-form-bottom">
              {
                (
                  <>
                    {submitText === translate('calendars.form.save') && <a title="" className="button-cancel mr-5" onClick={() => {
                      dirtyCheckToClose(TYPE_DIRTY_CHECK.CLOSE)
                    }}>{translate('calendars.form.cancel')}</a>}
                    <a className={`button-blue button-form-register `} onClick={() => {
                      submitData()
                    }}>{submitText}</a>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const mapStateToProps = ({ locale, dataCreateEditSchedule, applicationProfile }: IRootState) => ({
  currentLocale: locale.currentLocale,
  isLoading: dataCreateEditSchedule.isLoading,
  saveDataSuccess: dataCreateEditSchedule.success,
  scheduleDataFromApi: dataCreateEditSchedule.scheduleData,
  scheduleTypes: dataCreateEditSchedule.scheduleTypes,
  scheduleId: dataCreateEditSchedule.scheduleId,
  errorMessage: dataCreateEditSchedule.errorMessage,
  successMessage: dataCreateEditSchedule.successMessage,
  isClone: dataCreateEditSchedule.isClone,
  tenant: applicationProfile.tenant
})

const mapDispatchToProps = {
  reloadGrid: reloadGridData,
  resetScheduleData: setPreScheduleData,
  getSchedule: getScheduleById,
  onShowPopupCreate,
  resetEquipmentSuggest,
  saveSuggestionsChoice
}

type StateProps = ReturnType<typeof mapStateToProps>
type DispatchProps = typeof mapDispatchToProps

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEditScheduleComponent)
