import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import EmployeesAdd from '../employees-add';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { MODE_POPUP, SHOW_MESSAGE } from 'app/modules/setting/constant';
import { reset, getPositions, checkPositions } from './job_title_master.reducer';
import _ from 'lodash';
import { isNullOrUndefined } from 'util';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import ListPositions from './list-positions';
import { TIME_OUT_MESSAGE } from 'app/modules/setting/constant';
import { getJsonBName, convertHTMLEncString } from 'app/modules/setting/utils';
import { revertHTMLString } from 'app/modules/products/utils';

export interface IEmployeeProps extends StateProps, DispatchProps {
  positionsChange;
  resetPage?;
  screenName?;
  renderBoxMessage?;
}
export const JobTitleMaster = (props: IEmployeeProps) => {

  const tableRef = useRef(null);
  const buttonModalAdd = useRef(null);

  const [onShowPopup, setOnShowPopup] = useState(false);
  const [positionsItem, setPositionsItem] = useState({});
  const [positionsItemDelete, SetPositionsItemDelete] = useState({});
  const [listPositions, setListPositions] = useState([]);
  const [lisPositionsUpdate, setListPositionsUpdate] = useState({});
  const [codeMessage, setCodeMessage] = useState(0);
  const [mode, setMode] = useState(MODE_POPUP.CREATE);

  const { positions, loaded } = props;

  const editPositions = item => {
    props.reset();
    setMode(MODE_POPUP.EDIT);
    setOnShowPopup(!onShowPopup);
    setPositionsItem(item);
    setCodeMessage(SHOW_MESSAGE.NONE);
  };

  const getErrorMessage = errorCode => {
    return isNullOrUndefined(errorCode) ? '' : translate('messages.' + errorCode);
  };

  const renderErrorMessage = () => {
    switch (codeMessage) {
      case SHOW_MESSAGE.ERROR:
        return <><div>
          <BoxMessage messageType={MessageType.Error}
            message={getErrorMessage(props.messageError[0] && props.messageError[0]['errorCode'])} />
        </div>
        </>
      case SHOW_MESSAGE.CAN_NOT_DELETE:
        return <><div className='magin-top-5'>
          <BoxMessage messageType={MessageType.Error}
            message={getErrorMessage("INF_SET_0002")
            } />
        </div>
        </>
      default:
        break;
    }
  };

  const getParamListItem = (item, param) => {
    return _.map(param, obj => {
      if (item.positionId > 0) {
        if (obj.positionId === item.positionId) {
          obj = _.clone(item);
        }
      } else {
        if (obj.positionOrder === item.positionOrder) {
          obj = _.clone(item);
        }
      }
      return obj;
    });
  }

  const createParamUpdate = (item, type, param, id) => {
    const paramUpdate = {};
    paramUpdate['listItem'] = param['listItem'] !== undefined ? [...param['listItem']] : [];
    paramUpdate['deletedPositions'] = param['deletedPositions'] !== undefined ? [...param['deletedPositions']] : [];
    if (id === null) {
      if (param['listItem'] === undefined) {
        paramUpdate['listItem'].push({ ...item });
        return paramUpdate;
      } else {
        let lstProductTrade = [];
        let lstItem = {};
        switch (type) {
          case MODE_POPUP.EDIT:
            lstItem = _.find(param['listItem'], { positionOrder: item.positionOrder });
            if (lstItem !== undefined) {
              lstProductTrade = getParamListItem(item, param['listItem']);
              paramUpdate['listItem'] = [...lstProductTrade];
            } else {
              paramUpdate['listItem'].push({ ...item });
            }
            return paramUpdate;
          case MODE_POPUP.CREATE:
            paramUpdate['listItem'].push({ ...item });
            return paramUpdate;
          default:
            break;
        }
      }
      return
    }
    /* create deletedPositions */
    const itemDelete = _.find(param['listItem'], { positionOrder: item.positionOrder });
    if (id !== null && itemDelete !== undefined) {
      const lstPositions = _.reject(param['listItem'], obj => {
        return item.positionId > 0 ? obj.positionId === item.positionId : obj.positionOrder === item.positionOrder;
      });
      setListPositionsUpdate(lstPositions);
      paramUpdate['listItem'] = [...lstPositions];
    }
    if (item.positionId !== 0) {
      paramUpdate['deletedPositions'].push(item.positionId);
    }
    return paramUpdate;
  };

  const createPositionOrder = (item) => {
    if (_.isEmpty(listPositions)) {
      item['positionOrder'] = 1
    } else {
      for (let index = 0; index < listPositions.length; index++) {
        if (index === listPositions.length - 1) {
          item['positionOrder'] = listPositions[index]['positionOrder'] + 1
        }
      }
    }
    return item
  }

  const handleChangePosition = item => {
    props.reset();
    const items = item.positionOrder ? getParamListItem(item, listPositions) : [...listPositions, createPositionOrder(item)];
    const param = createParamUpdate(item, item.positionOrder ? MODE_POPUP.EDIT : MODE_POPUP.CREATE, { ...lisPositionsUpdate }, null);

    if (item.positionOrder) {
      setPositionsItem(null);
    }

    setListPositionsUpdate(param);
    setListPositions(items);
    setOnShowPopup(false);
    props.positionsChange(param);
  };


  const deletePositions = async (item, actionDelete?) => {
    props.reset();
    setCodeMessage(SHOW_MESSAGE.NONE);
    SetPositionsItemDelete(item);
    if (actionDelete || item.positionId === 0) {
      let param = { ...lisPositionsUpdate };
      const itemName = convertHTMLEncString(getJsonBName(item.positionName));
      const result = await ConfirmDialog({
        title: <>{translate('employees.top.dialog.title-delete-group')}</>,
        message: revertHTMLString(translate('messages.WAR_COM_0001', { itemName })),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: 'button-red',
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: 'button-cancel'
      });

      if (result) {
        const lstPositions = _.reject(listPositions, obj => {
          return item.positionId > 0 ? obj.positionId === item.positionId : obj.positionOrder === item.positionOrder;
        });
        setListPositions(lstPositions);
        setListPositionsUpdate((param = createParamUpdate(item, null, param, item.positionOrder)));
        props.positionsChange(param);
      }
    } else {
      props.checkPositions(item.positionId);
    }
  };

  const togglePopup = type => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    setOnShowPopup(!onShowPopup);
    setMode(type);
    switch (type) {
      case MODE_POPUP.CREATE:
        setPositionsItem(null);
        break;
      case MODE_POPUP.EDIT:
        break;
      default:
        break;
    }
  };
  const dataAfterDragDrop = datas => {
    let paramUpdate = { ...lisPositionsUpdate }
    for (let index = 0; index < datas.length; index++) {
      datas[index].positionOrder = index + 1
      setListPositionsUpdate(paramUpdate = createParamUpdate(datas[index], MODE_POPUP.EDIT, paramUpdate, null))
      props.positionsChange(paramUpdate)
    }
    setListPositions(datas)

  };

  useEffect(() => {
    return () => {
      props.reset();
    }
  }, [])

  useEffect(() => {
    props.reset();
    props.getPositions();
    props.positionsChange(null);
    setListPositionsUpdate({});
  }, [props.resetPage]);

  useEffect(() => {
    if (listPositions.length === 0) {
      setCodeMessage(SHOW_MESSAGE.NO_RECORD);
    }
  }, [listPositions]);

  useEffect(() => {
    if (props.iDSS !== null) {
      props.getPositions();
      setListPositionsUpdate({});
    }
  }, [props.iDSS]);

  useEffect(() => {
    if (positions !== null) {
      setListPositions(positions);
    }
  }, [positions]);


  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (props.messageError.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
    if (props.checkDelete !== null && props.checkDelete.length === 0) {
      deletePositions(positionsItemDelete, true);
      setCodeMessage(SHOW_MESSAGE.NONE);
    }
    if (props.checkDelete !== null && props.checkDelete.length > 0) {
      setCodeMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
    }
  }, [props.iDSS, props.messageError, props.checkDelete]);

  return (
    <>
      <div className="setting-popup-content mt-2">
        <div className="form-group h-100">
          <label className="font-size-18">{translate('setting.employee.employeePosition.title')}</label>
          <div className="block-feedback background-feedback border-radius-12 magin-top-5 pr-5">
            {translate('setting.employee.employeePosition.titleWarning')}
          </div>
          {renderErrorMessage()}
          <div className="position-relative">
            <button ref={buttonModalAdd} type='button' className="button-primary btn-padding " onClick={() => { buttonModalAdd.current.blur(); togglePopup(MODE_POPUP.CREATE);}}>
              {translate('setting.employee.employeePosition.btnAdd')}</button>
            {onShowPopup && (
              <EmployeesAdd
                positionsItem={positionsItem}
                dismissDialog={togglePopup}
                positionsChange={handleChangePosition}
                modePopup={mode}
                langKey={props.account['languageCode']}
              />
            )}
          </div>
          {listPositions && listPositions.length > 0 && (
            <div>
              <table className="table-default" ref={tableRef} >
                <thead>
                  <tr>
                    <td>{translate('setting.employee.employeePosition.positionColum')}</td>
                    <td className="text-center w8">{translate('setting.employee.employeePosition.operation')}</td>
                  </tr>
                </thead>
                <tbody>
                  <ListPositions tableRef={tableRef}
                    deletePositions={deletePositions}
                    editPositions={editPositions}
                    lisPositions={listPositions}
                    setListPositions={dataAfterDragDrop}
                  />
                </tbody>
              </table>
            </div>
          )}
          {loaded && positions && positions.length === 0 && (
              <div className="show-message-nodata position-absolute" >
                {translate("messages.INF_COM_0020", { 0: props.screenName })}
              </div>
          )}
        </div>
      </div>
    </>
  );
};
const mapStateToProps = ({ employeesSetting: employeesSetting, authentication }: IRootState) => ({
  positions: employeesSetting.positions,
  iDSS: employeesSetting.positionsUpdate,
  messageError: employeesSetting.errorItems,
  checkDelete: employeesSetting.checkDelete,
  account: authentication.account,
  loaded: employeesSetting.loaded
});

const mapDispatchToProps = {
  getPositions,
  reset,
  checkPositions
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobTitleMaster);
