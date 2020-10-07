import React, { useEffect, useRef, useState } from 'react';
import { Storage, translate } from 'react-jhipster';
import SchedulesTypeAdd from './schedule-type-add';
import _ from 'lodash';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { MODE_POPUP, SHOW_MESSAGE } from "app/modules/setting/constant";
import { handleCheckDelete, handleGetData, handleUpdate, reset, ScheduleTypeAction } from "./schedule-type.reducer";
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { isNullOrUndefined } from "util";
import ListScheduleTypes from './list-schedule-types'
import BoxMessage, { MessageType } from "app/shared/layout/common/box-message";
import { getFieldLabel } from "app/shared/util/string-utils";


export interface IScheduleTypeProps extends StateProps, DispatchProps {
  isSave?,
  calendarTabs?
  changeDateUpdate
  resetpapge,
  dataChangedCalendar,
  showMessage
}

export const SchedulesType = (props: IScheduleTypeProps) => {

  const tableRef = useRef(null)

  const [tableWidth, setTableWidth] = useState<number>(0)
  const [openDialogAdd, setOpenDialogAdd] = useState(false);
  const [scheduleTypes, setScheduleTypes] = useState([]);
  const [scheduleItem, setScheduleItem] = useState(null);
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);
  const [scheduleDelete, setScheduleDelete] = useState({});
  const [schedulesTypeFile, setSchedulesTypeFile] = useState({});
  const [scheduleUpdate, setScheduleUpdate] = useState({});
  const [isDragDrop, setIsDragDrop] = useState(false);
  const [checkActive, setCheckActive] = useState(false);
  const [messInfo, setMessInfo] = useState('');
  useEffect(() => {
    props.reset()
    setScheduleDelete({})
    setScheduleUpdate({})
    props.handleGetData();
  }, [props.resetpapge]);

  useEffect(() => {
    if (tableRef && tableRef.current) {
      setTableWidth(tableRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    if (props.iDSS !== null) {
      setScheduleUpdate({})
      props.handleGetData();
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (props.scheduleTypes.length > 0) {
      setScheduleTypes(props.scheduleTypes);
    }
  }, [props.scheduleTypes]);

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const changeFileData = (fileData, id?) => {
    const tmpFilesUpload = _.cloneDeep(schedulesTypeFile);
    if (fileData) {
      tmpFilesUpload[`${id}`] = fileData;
    }
    if (fileData === null && tmpFilesUpload[id]) {
      delete tmpFilesUpload[id];
    }
    setSchedulesTypeFile(_.cloneDeep(tmpFilesUpload));
  }


  useEffect(() => {
    if (codeMessage !== SHOW_MESSAGE.NONE) {
      let msgInfoSuccess = '';
      if (codeMessage === SHOW_MESSAGE.SUCCESS) {
        msgInfoSuccess = getErrorMessage("INF_COM_0008")
      } else if (codeMessage === SHOW_MESSAGE.ERROR) {
        msgInfoSuccess = getErrorMessage(props.messageError[0] && props.messageError[0]['errorCode'])

      } else if (codeMessage === SHOW_MESSAGE.CAN_NOT_DELETE) {
        msgInfoSuccess = getErrorMessage("INF_SET_0001")
        setMessInfo(msgInfoSuccess);
      }
      props.showMessage(codeMessage, msgInfoSuccess)
    }
  }, [codeMessage])

  const prepareSaveSchedulesType = (listSchedules) => {
    return {
      scheduleTypes: listSchedules
    }
  }

  const createParamUpdateType = (item, type, param, id) => {
    const paramupdate = {}
    paramupdate['deletedScheduleTypes'] = param['deletedScheduleTypes'] !== undefined ? _.cloneDeep(param['deletedScheduleTypes']) : []
    paramupdate['scheduleTypes'] = param['scheduleTypes'] !== undefined ? _.cloneDeep(param['scheduleTypes']) : []
    if (id === null) {
      if (param['scheduleTypes'] === undefined) {
        paramupdate['scheduleTypes'].push({ ...item })
        return paramupdate
      } else {
        let lstProductTrade = []
        let lstItem = {}
        switch (type) {
          case MODE_POPUP.EDIT:
            lstItem = _.find(param['scheduleTypes'], { 'displayOrder': item.displayOrder });
            if (lstItem && lstItem['scheduleTypeId'] === item.scheduleTypeId) {
              lstProductTrade = _.map(param['scheduleTypes'], obj => {
                if (item.scheduleTypeId > 0) {
                  if (obj.scheduleTypeId === item.scheduleTypeId) {
                    obj = _.clone(item);
                  }
                } else if (obj.displayOrder === item.displayOrder) {
                  obj = _.clone(item);

                }
                return obj;
              });
              paramupdate['scheduleTypes'] = _.cloneDeep(lstProductTrade)
            } else {
              paramupdate['scheduleTypes'].push({ ...item })
            }
            return paramupdate
          case MODE_POPUP.CREATE:
            paramupdate['scheduleTypes'].push({ ...item })
            return paramupdate;
          default:
            break;
        }
      }
    } else {
      /* create deletedEquipmentTypes */
      const itemDelete = _.find(param['scheduleTypes'], { 'displayOrder': item.displayOrder });
      if (id !== null && itemDelete !== undefined) {
        const lstPositions = _.reject(param['scheduleTypes'], (obj) => {
          return item.scheduleTypeId > 0 ?
            obj.scheduleTypeId === item.scheduleTypeId :
            obj.displayOrder === item.displayOrder;
        });
        setScheduleUpdate(lstPositions)
        paramupdate['scheduleTypes'] = [...lstPositions]
      }
      if (item.scheduleTypeId !== 0) {
        paramupdate['deletedScheduleTypes'].push(item.scheduleTypeId)
      }
    }
    return paramupdate
  }

  const deleteScheduleType = async (item, actionDelete?) => {
    props.reset();
    setCodeMessage(SHOW_MESSAGE.NONE);
    setScheduleDelete(item)
    if (actionDelete || item.scheduleTypeId === 0) {
      let param = { ...scheduleUpdate }
      document.body.className = "";
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
        message: translate('messages.WAR_COM_0001', { itemName: getFieldLabel(item, "scheduleTypeName") }),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        const lstScheduleTypes = _.reject(scheduleTypes, (objType) => {
          return item.scheduleTypeId > 0 ?
            objType.scheduleTypeId === item.scheduleTypeId :
            objType.displayOrder === item.displayOrder;
        });

        setScheduleTypes([...lstScheduleTypes]);
        setScheduleUpdate(param = createParamUpdateType(item, null, param, item.displayOrder));
        props.changeDateUpdate(param);
        setScheduleDelete({})
      }
    } else {
      props.handleCheckDelete(item.scheduleTypeId)
    }
    props.dataChangedCalendar(true)
  }

  const dataChange = (scheduleType) => {
    setCheckActive(false)
    let param = { ...scheduleUpdate }
    /* check exit record */
    if (scheduleType.displayOrder) {
      const lstScheduleTypes = _.map(scheduleTypes, obj => {
        if (scheduleType.scheduleTypeId > 0) {
          if (obj.scheduleTypeId === scheduleType.scheduleTypeId) {
            obj = _.clone(scheduleType);
          }
        } else if (obj.displayOrder === scheduleType.displayOrder) {
          obj = _.clone(scheduleType);
        }
        return obj;
      });
      setScheduleTypes([...lstScheduleTypes]);
      setScheduleUpdate(param = createParamUpdateType(scheduleType, MODE_POPUP.EDIT, param, null));
      setScheduleItem(null);
      props.dataChangedCalendar(true)
    } else {
      for (let index = 0; index <= scheduleTypes.length; index++) {
        if (index !== 0 && index === scheduleTypes.length) {
          scheduleType['displayOrder'] = scheduleTypes[index - 1].displayOrder + 1;
        } else {
          scheduleType['displayOrder'] = 1;
        }
      }
      const tmpScheduleTypes = _.cloneDeep(scheduleTypes);
      tmpScheduleTypes.push(scheduleType);
      setScheduleTypes(tmpScheduleTypes);
      setScheduleUpdate(param = createParamUpdateType(scheduleType, MODE_POPUP.CREATE, param, null));
    }
    props.changeDateUpdate(param);
    setOpenDialogAdd(false);
    props.dataChangedCalendar(true)
  }
  const openDialog = () => {
    if (!checkActive) {
      setCheckActive(true)
    } else {
      setCheckActive(false)
    }
    setScheduleItem(null);
    setOpenDialogAdd(!openDialogAdd);
  }
  const editScheduleType = (item) => {
    setOpenDialogAdd(true);
    setScheduleItem(item);
  }
  const dismissDialog = () => {
    setCheckActive(false)
    setOpenDialogAdd(false);
    setScheduleItem(null);
  }

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (scheduleUpdate['scheduleTypes']) {
      if (scheduleUpdate['scheduleTypes'].length > 0) {
        scheduleUpdate['scheduleTypes'].forEach((element, index) => {
          element.displayOrder = index + 1
        })
      }
      props.handleUpdate(scheduleUpdate, scheduleTypes);
    }

  }, [props.isSave]);

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (props.iDSS !== null) {
      setCodeMessage(SHOW_MESSAGE.SUCCESS);
      setScheduleUpdate({})
    }
    if (props.messageError.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
    if (props.checkDelete !== null && props.checkDelete.length === 0) {
      deleteScheduleType(scheduleDelete, true)
      setCodeMessage(SHOW_MESSAGE.NONE);
    }
    if (props.checkDelete !== null && props.checkDelete.length > 0) {
      setCodeMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
    }
  }, [props.iDSS, props.checkDelete]);

  // change update when drag drop
  useEffect(() => {
    if (isDragDrop) {
      let param = {}
      param = prepareSaveSchedulesType(scheduleTypes)
      setScheduleUpdate(param)
    }
  }, [scheduleTypes])

  /**
   * render Error message
   */
  const renderErrorMessage = () => {
    if (codeMessage === SHOW_MESSAGE.CAN_NOT_DELETE) {
      return <><div>
        <BoxMessage messageType={MessageType.Error}
          message={messInfo}
        />
      </div>
      </>
    }
  }

  return (
    <>
      <div className="form-group setting-popup-heigth h-100">
        <div className="form-group h-100">
          <label>{translate('setting.calendar.scheduleType.title')}</label>

          <div className="block-feedback block-feedback-radious block-feedback-blue magin-top-5">{translate('setting.calendar.scheduleType.notification')}</div>
          {renderErrorMessage()}
          <div className="position-relative">
            <a tabIndex={0} className="button-primary btn-padding setting-schedule-add"
              onClick={() => {
                setCodeMessage(SHOW_MESSAGE.NONE);
                openDialog();
              }}
            >{translate('setting.calendar.scheduleType.add')}</a>
            {
              openDialogAdd && <SchedulesTypeAdd
                dataChange={dataChange}
                scheduleItem={scheduleItem}
                dismissDialog={dismissDialog}
                langKey={props.account["languageCode"]}
                changeFileData={changeFileData}
                dataChangedCalendar={props.dataChangedCalendar}
              />
            }
          </div>
          {scheduleTypes && scheduleTypes.length > 0
            ?
            <div className="setting-table-list">
              <table className="table-default" ref={tableRef} >
                <tbody>
                  <tr>
                    <td className="title-table">{translate('setting.calendar.scheduleType.icon')}</td>
                    <td className="title-table">{translate('setting.calendar.scheduleType.name')}</td>
                    <td className="title-table">{translate('setting.calendar.scheduleType.status')}</td>
                    <td className="title-table width88">{translate('setting.calendar.scheduleType.action')}</td>
                  </tr>
                  <ListScheduleTypes
                    editScheduleType={editScheduleType}
                    deleteScheduleType={deleteScheduleType}
                    tableWidth={tableWidth}
                    listScheduleTypes={scheduleTypes ? scheduleTypes : null}
                    setScheduleTypes={setScheduleTypes}
                    setIsDragDrop={setIsDragDrop}
                  />
                </tbody>
              </table>
            </div>
            :
            <div className="absolute-center">
              {
                props.actionRequest === ScheduleTypeAction.Success
                &&
                <div className="align-center">
                  <div>{translate("messages.INF_COM_0020", { 0: translate('setting.calendar.scheduleType.title') })}</div>
                </div>
              }

            </div>
          }
          {/* {renderErrorMessage()} */}
        </div>
      </div>
    </>
  )
}
const mapStateToProps = ({ scheduleType, authentication }: IRootState) => ({
  errorMessage: scheduleType.errorMessage,
  scheduleTypes: scheduleType.scheduleTypes,
  messageError: scheduleType.errorCodeList,
  checkDelete: scheduleType.checkDelete,
  iDSS: scheduleType.scheduleTypeUpdate,
  account: authentication.account,
  actionRequest: scheduleType.action
});

const mapDispatchToProps = {
  reset,
  handleGetData,
  handleCheckDelete,
  handleUpdate
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SchedulesType);
