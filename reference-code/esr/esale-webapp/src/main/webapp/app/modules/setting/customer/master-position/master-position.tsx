import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import _ from 'lodash';
import {
  reset,
  handleGetData,
  handleCheckDelete,
  handleUpdate
} from "./master-position.reducer";
import MasterStands from './master-stands';
import MasterMotivations from './master-motivations';
import {
  MASTER_MOTIVATIONS_BACGROUND,
  MASTER_MOTIVATIONS_ICON_TYPE,
  CUSTOMER_TYPE,
  SHOW_MESSAGE,
  MODE_POPUP,
  TIME_OUT_MESSAGE
} from '../../constant';
import ListMasterStands from './list-master-stands';
import ListMasterMotivations from './list-master-motivations';
import { getJsonBName, convertHTMLEncString } from 'app/modules/setting/utils';
import { revertHTMLString } from 'app/modules/products/utils';


export interface IMasterPositionProps extends StateProps, DispatchProps {
  isSave,
  setIsDirty,
  isCancel
}
export const MasterPosition = (props: IMasterPositionProps) => {

  const tableMasterStandRef = useRef(null);
  const tableMasterMotivationRef = useRef(null);
  const buttonModalOne = useRef(null);
  const buttonModalTwo = useRef(null);

  const [dialogMasterStands, setDialogMasterStands] = useState(false);
  const [dialogMasterMotivations, setDialogMasterMotivations] = useState(null);
  const [masterStands, setMasterStands] = useState([]);
  const [masterMotivations, setMasterMotivations] = useState([]);
  const [customerConnectionsMapUpdate, setCustomerConnectionsMapUpdate] = useState({});
  const [masterStandItem, setMasterStandItem] = useState(null);
  const [masterMotivationsItem, setMasterMotivationsItem] = useState(null);
  const [checkType, setCheckType] = useState(true);
  const [codeMessage, setCodeMessage] = useState(SHOW_MESSAGE.NONE);
  const [masterMotivationItemDelete, setMasterMotivationItemDelete] = useState({});
  const [masterStandsItemDelete, setMasterStandsItemDelete] = useState({});
  const [motivationFile, setMotivationFile] = useState({});

  useEffect(() => {
    return (() => {
      props.reset()
    })
  }, []);

  useEffect(() => {
    props.handleGetData();
  }, [props.iDSS]);


  useEffect(() => {
    const param = _.cloneDeep(customerConnectionsMapUpdate)
    const paramupdate = {};
    let tmpMasterStands = [];
    if (props.customerConnectionsMap) {
      if (masterStands.length > 0 && !_.isEqual(masterStands, props.customerConnectionsMap.mastersStands)) {
        tmpMasterStands = _.cloneDeep(masterStands);
        for (let i = 0; i < tmpMasterStands.length; i++) {
          tmpMasterStands[i]['displayOrder'] = i + 1;
        }
        props.setIsDirty(true);
      }
    }

    let tmpMasterMotivations = [];
    if (props.customerConnectionsMap) {
      if (masterMotivations.length > 0 && !_.isEqual(masterMotivations, props.customerConnectionsMap.masterMotivations)) {
        tmpMasterMotivations = _.cloneDeep(masterMotivations);
        for (let i = 0; i < tmpMasterMotivations.length; i++) {
          tmpMasterMotivations[i]['displayOrder'] = i + 1;
        }
        props.setIsDirty(true);
      }
    }
    paramupdate['deletedMasterMotivations'] = param['deletedMasterMotivations'] !== undefined ? param['deletedMasterMotivations'] : [];
    paramupdate['masterMotivations'] = tmpMasterMotivations;
    paramupdate['deletedMasterStands'] = param['deletedMasterStands'] !== undefined ? param['deletedMasterStands'] : [];
    paramupdate['masterStands'] = tmpMasterStands;
    setCustomerConnectionsMapUpdate(paramupdate);
  }, [masterStands, masterMotivations]);

  useEffect(() => {
    if (!_.isEmpty(customerConnectionsMapUpdate)) {
      props.handleUpdate(customerConnectionsMapUpdate, motivationFile);
      props.setIsDirty(false);
    }
  }, [props.isSave]);

  const checkChangeData = () => {
    if (_.isEmpty(customerConnectionsMapUpdate)) {
      return false;
    } else {
      if ('deletedMasterMotivations' in customerConnectionsMapUpdate && !_.isEmpty(customerConnectionsMapUpdate['deletedMasterMotivations'])) {
        return true;
      }
      if ('deletedMasterStands' in customerConnectionsMapUpdate && !_.isEmpty(customerConnectionsMapUpdate['deletedMasterStands'])) {
        return true;
      }
      if ('masterMotivations' in customerConnectionsMapUpdate && !_.isEmpty(customerConnectionsMapUpdate['masterMotivations'])) {
        return true;
      }
      if ('masterStands' in customerConnectionsMapUpdate && !_.isEmpty(customerConnectionsMapUpdate['masterStands'])) {
        return true;
      }
    }
    return false;
  }

  const resetComponent = () => {
    setMasterStands(_.cloneDeep(props.customerConnectionsMap.mastersStands));
    setMasterMotivations(_.cloneDeep(props.customerConnectionsMap.masterMotivations));
    setCustomerConnectionsMapUpdate({});
  }
  const cancelMaster = async () => {
    if (checkChangeData()) {
      await DialogDirtyCheck({
        onLeave: resetComponent, partternType: 2
      });
      return;
    }
  }
  useEffect(() => {
    cancelMaster();
  }, [props.isCancel]);

  useEffect(() => {
    if (props.customerConnectionsMap) {
      setMasterStands(_.cloneDeep(props.customerConnectionsMap.mastersStands));
      setMasterMotivations(_.cloneDeep(props.customerConnectionsMap.masterMotivations));
    }
  }, [props.customerConnectionsMap]);

  const createParamupdateMotivations = (item, type, param, id) => {
    const paramupdate = {}
    paramupdate['deletedMasterMotivations'] = param['deletedMasterMotivations'] !== undefined ? _.cloneDeep(param['deletedMasterMotivations']) : []
    paramupdate['masterMotivations'] = param['masterMotivations'] !== undefined ? _.cloneDeep(param['masterMotivations']) : []
    paramupdate['deletedMasterStands'] = param['deletedMasterStands'] !== undefined ? _.cloneDeep(param['deletedMasterStands']) : []
    paramupdate['masterStands'] = param['masterStands'] !== undefined ? _.cloneDeep(param['masterStands']) : []
    if (id === null) {
      if (param['masterMotivations'] === undefined) {
        paramupdate['masterMotivations'].push({ ...item })
        return paramupdate
      } else {
        let lstMasterMotivations = []
        let lstItem = {}
        switch (type) {
          case MODE_POPUP.EDIT:
            lstItem = _.find(param['masterMotivations'], { 'displayOrder': item.displayOrder });
            if (lstItem !== undefined) {
              lstMasterMotivations = _.map(param['masterMotivations'], objEdit => {
                if (item.masterMotivationId > 0) {
                  if (objEdit.masterMotivationId === item.masterMotivationId) {
                    objEdit = _.clone(item);
                  }
                } else if (objEdit.displayOrder === item.displayOrder) {
                  objEdit = _.clone(item);
                }
                return objEdit;
              });
              paramupdate['masterMotivations'] = _.cloneDeep(lstMasterMotivations)
            } else {
              paramupdate['masterMotivations'].push({ ...item })
            }
            return paramupdate
          case MODE_POPUP.CREATE:
            paramupdate['masterMotivations'].push({ ...item })
            return paramupdate;
          default:
            break;
        }
      }
    } else {
      /* create deletedMasterMotivations */
      const itemDelete = _.find(param['masterMotivations'], { 'displayOrder': item.displayOrder });
      if (id !== null && itemDelete !== undefined) {
        const lstmasterMotivationDel = _.reject(param['masterMotivations'], (objDelete) => {
          return item.masterMotivationId > 0 ?
            objDelete.masterMotivationId === item.masterMotivationId :
            objDelete.displayOrder === item.displayOrder;
        });
        setCustomerConnectionsMapUpdate(lstmasterMotivationDel)
        paramupdate['masterMotivations'] = [...lstmasterMotivationDel]
      }
      if (item.masterMotivationId !== 0) {
        paramupdate['deletedMasterMotivations'].push(item.masterMotivationId)
      }
    }
    return paramupdate
  }

  const createParamupdateStand = (item, type, param, id) => {
    const paramupdate = {}
    paramupdate['deletedMasterMotivations'] = param['deletedMasterMotivations'] !== undefined ? _.cloneDeep(param['deletedMasterMotivations']) : []
    paramupdate['masterMotivations'] = param['masterMotivations'] !== undefined ? _.cloneDeep(param['masterMotivations']) : []
    paramupdate['deletedMasterStands'] = param['deletedMasterStands'] !== undefined ? _.cloneDeep(param['deletedMasterStands']) : []
    paramupdate['masterStands'] = param['masterStands'] !== undefined ? _.cloneDeep(param['masterStands']) : []
    if (id === null) {
      if (param['masterStands'] === undefined) {
        paramupdate['masterStands'].push({ ...item })
        return paramupdate
      } else {
        let lststand = []
        let lstItem = {}
        switch (type) {
          case MODE_POPUP.EDIT:
            lstItem = _.find(param['masterStands'], { 'displayOrder': item.displayOrder });
            if (lstItem !== undefined) {
              lststand = _.map(param['masterStands'], objEdit => {
                if (item.masterStandId > 0) {
                  if (objEdit.masterStandId === item.masterStandId) {
                    objEdit = _.clone(item);
                  }
                } else if (objEdit.displayOrder === item.displayOrder) {
                  objEdit = _.clone(item);
                }
                return objEdit;
              });
              paramupdate['masterStands'] = _.cloneDeep(lststand)
            } else {
              paramupdate['masterStands'].push({ ...item })
            }
            return paramupdate
          case MODE_POPUP.CREATE:
            paramupdate['masterStands'].push({ ...item })
            return paramupdate;
          default:
            break;
        }
      }
    } else {
      /* create deletedMasterStands */
      const itemDelete = _.find(param['masterMmasterStandsotivations'], { 'displayOrder': item.displayOrder });
      if (id !== null && itemDelete !== undefined) {
        const lstStandDel = _.reject(param['masterStands'], (objDelete) => {
          return item.masterStandId > 0 ?
            objDelete.masterStandId === item.masterStandId :
            objDelete.displayOrder === item.displayOrder;
        });
        setCustomerConnectionsMapUpdate(lstStandDel)
        paramupdate['masterStands'] = [...lstStandDel]
      }
      if (item.masterStandId !== 0) {
        paramupdate['deletedMasterStands'].push(item.masterStandId)
      }
    }
    return paramupdate
  }

  const changeOpenDialogMasterStands = () => {
    setDialogMasterStands(!dialogMasterStands);
    setDialogMasterMotivations(false);
    setMasterStandItem(null);
  }

  const editMasterStand = (item) => {
    setMasterStandItem(item);
    setDialogMasterStands(true);
    setDialogMasterMotivations(false);
  }

  const masterStandChange = (item) => {
    const param = { ...customerConnectionsMapUpdate }
    if (item.displayOrder) {
      const lstMasterStands = _.map(masterStands, obj => {
        if (item.masterStandId > 0) {
          if (obj.masterStandId === item.masterStandId) {
            obj = _.clone(item);
          }
        } else if (obj.displayOrder === item.displayOrder) {
          obj = _.clone(item);
        }
        return obj;
      });
      setMasterStands([...lstMasterStands]);
      setCustomerConnectionsMapUpdate(createParamupdateStand(item, MODE_POPUP.EDIT, param, null));
      setMasterStandItem(null);
    } else {

      for (let index = 0; index <= masterStands.length; index++) {
        if (index !== 0 && index === masterStands.length) {
          item['displayOrder'] = masterStands[index - 1].displayOrder + 1;
        } else {
          item['displayOrder'] = 1;
        }
        item['masterStandId'] = 0;
      }
      setMasterStands([...masterStands, item]);
      setCustomerConnectionsMapUpdate(createParamupdateStand(item, MODE_POPUP.EDIT, param, null));
    }
    setDialogMasterStands(false);
    // props.productTradeChange(productTrade);
  }

  const deleteMasterStand = async (item, actionDelete?) => {
    // props.reset();
    setCheckType(false)
    setCodeMessage(SHOW_MESSAGE.NONE);
    setMasterStandsItemDelete(item);
    const itemName = convertHTMLEncString(getJsonBName(item.masterStandName));
    if (item) {
      let param = { ...customerConnectionsMapUpdate }
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
        message: revertHTMLString(translate('employees.top.dialog.message-delete-group', { itemName })),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        const lstSMasterStands = _.reject(masterStands, (obj) => {
          return item.masterStandId > 0 ?
            obj.masterStandId === item.masterStandId :
            obj.displayOrder === item.displayOrder;
        });

        setCustomerConnectionsMapUpdate(param = createParamupdateStand(item, null, param, item.displayOrder));
        setMasterStandsItemDelete({})
        setMasterStands([...lstSMasterStands]);
        // props.changeDateUpdate(param);
      }
    } else {
      props.handleCheckDelete(CUSTOMER_TYPE.MASTER_STANDS, [item.masterStandId])
    }
  }

  const changeDialogMasterMotivations = () => {
    setDialogMasterMotivations(!dialogMasterMotivations);
    setMasterMotivationsItem(null);
  }

  const editMasterMotivations = (item) => {
    setMasterMotivationsItem(item);
    setDialogMasterMotivations(true);
    setDialogMasterStands(false);
  }

  const masterMotivationsChange = (item) => {
    const param = { ...customerConnectionsMapUpdate }
    if (item.displayOrder) {
      const lstMasterMotivations = _.map(masterMotivations, obj => {
        if (item.masterMotivationId > 0) {
          if (obj.masterMotivationId === item.masterMotivationId) {
            obj = _.clone(item);
          }
        } else if (obj.displayOrder === item.displayOrder) {
          obj = _.clone(item);
        }
        return obj;
      });
      setMasterMotivations([...lstMasterMotivations]);
      setCustomerConnectionsMapUpdate(createParamupdateMotivations(item, MODE_POPUP.EDIT, param, null))
      setMasterMotivationsItem(null);
    } else {
      for (let index = 0; index <= masterMotivations.length; index++) {
        if (index !== 0 && index === masterMotivations.length) {
          item['displayOrder'] = masterMotivations[index - 1].displayOrder + 1;
        } else {
          item['displayOrder'] = 1;
        }
      }
      setMasterMotivations([...masterMotivations, item]);
      setCustomerConnectionsMapUpdate(createParamupdateMotivations(item, MODE_POPUP.CREATE, param, null));
    }
    setDialogMasterMotivations(false);
    // props.productTradeChange(productTrade);
  }

  const deleteMasterMotivation = async (item, actionDelete?) => {
    // props.reset();
    setCheckType(true)
    setCodeMessage(SHOW_MESSAGE.NONE);
    setMasterMotivationItemDelete(item);
    const itemName = convertHTMLEncString(getJsonBName(item.masterMotivationName));
    if (item) {
      let param = { ...customerConnectionsMapUpdate }
      const result = await ConfirmDialog({
        title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
        message: revertHTMLString(translate('employees.top.dialog.message-delete-group', { itemName })),
        confirmText: translate('employees.top.dialog.confirm-delete-group'),
        confirmClass: "button-red",
        cancelText: translate('employees.top.dialog.cancel-text'),
        cancelClass: "button-cancel"
      });
      if (result) {
        const lstSMasterMotivation = _.reject(masterMotivations, (obj) => {
          return item.masterMotivationId > 0 ?
            obj.masterMotivationId === item.masterMotivationId :
            obj.displayOrder === item.displayOrder;
        });
        setCustomerConnectionsMapUpdate(param = createParamupdateMotivations(item, null, param, item.displayOrder));
        setMasterMotivationItemDelete({})
        setMasterMotivations([...lstSMasterMotivation]);
      }
    } else {
      props.handleCheckDelete(CUSTOMER_TYPE.MASTER_MOTIVATIONS, [item.masterMotivationId])
    }
  }

  useEffect(() => {
    setCodeMessage(SHOW_MESSAGE.NONE);
    if (props.messageError.length > 0) {
      setCodeMessage(SHOW_MESSAGE.ERROR);
    }
    if (props.checkDelete !== null && props.checkDelete.length === 0) {
      !checkType ?
        deleteMasterStand(masterStandsItemDelete, true) :
        deleteMasterMotivation(masterMotivationItemDelete, true)
      setCodeMessage(SHOW_MESSAGE.NONE);
    }
    if (props.checkDelete !== null &&
      props.checkDelete.length > 0) {
      setCodeMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
    }
  }, [props.iDSS, props.checkDelete]);


  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const renderErrorMessage = () => {
    return (
      <BoxMessage messageType={MessageType.Error} message={getErrorMessage(props.messageError)} />
    )
  }

  const changeFileData = (fileData, id) => {
    const tmpFilesUpload = _.cloneDeep(motivationFile);
    if (fileData) {
      tmpFilesUpload[`${id}`] = fileData;
    }
    if (fileData === null && tmpFilesUpload[id]) {
      delete tmpFilesUpload[id];
    }
    setMotivationFile(_.cloneDeep(tmpFilesUpload));
  }

  return (
    <>
      <div className="form-group">
        <label className="font-size-14">{translate('setting.customer.masterPosition.title')}</label>
        <div className="block-feedback background-feedback magin-top-5">
          {translate('setting.customer.masterPosition.warning')}
        </div>
        <div className="magin-top-5">
          {(codeMessage === SHOW_MESSAGE.ERROR || codeMessage === SHOW_MESSAGE.CAN_NOT_DELETE) && renderErrorMessage()}
        </div>
        <div className="position-relative">
          <button ref={buttonModalOne} className="button-primary btn-padding " onClick={()=>{ buttonModalOne.current.blur(); changeOpenDialogMasterStands();}}>{translate('setting.customer.masterPosition.btn')}</button>
          {
            dialogMasterStands &&
            <MasterStands
              dismissDialogMasterStands={changeOpenDialogMasterStands}
              masterStandItem={masterStandItem}
              masterStandChange={masterStandChange} />
          }
        </div>
        <div>
          {masterStands.length > 0 ?
            <table className="table-default" ref={tableMasterStandRef} >
              <tbody>
                <tr>
                  <td className="title-table w-cus60px">{translate('setting.customer.masterPosition.no')}</td>
                  <td className="title-table">{translate('setting.customer.masterPosition.tblStandCol2')}</td>
                  <td className="title-table">{translate('setting.customer.masterPosition.tblStandCol3')}</td>
                  <td className="title-table w-cus88px">{translate('setting.customer.masterPosition.tblStandCol4')}</td>
                </tr>
                <ListMasterStands
                  tableRef={tableMasterStandRef}
                  listItems={masterStands}
                  setItems={setMasterStands}
                  editItem={editMasterStand}
                  deleteItem={deleteMasterStand}
                />
              </tbody>
            </table>
            : <div className="align-center">{translate('setting.customer.noMasterStands')}</div>
          }
        </div>
      </div>
      <div className="form-group">
        <label className="font-size-14">{translate('setting.customer.masterPosition.titleTwo')}</label>
        <div className="block-feedback background-feedback magin-top-5">
          {translate('setting.customer.masterPosition.warning')}
        </div>
        <div className="position-relative">
          <button ref={buttonModalTwo} className="button-primary btn-padding " onClick={() => { buttonModalTwo.current.blur(); setDialogMasterStands(false); setDialogMasterMotivations(!dialogMasterMotivations) }}>{translate('setting.customer.masterPosition.btn')}</button>
          {
            dialogMasterMotivations && <MasterMotivations dismissDialogMasterMotivations={changeDialogMasterMotivations} masterMotivationsItem={masterMotivationsItem} masterMotivationsChange={masterMotivationsChange}
              changeFileData={changeFileData}
            />
          }
        </div>
        <div>
          {masterMotivations.length > 0 ?
            <table className="table-default" ref={tableMasterMotivationRef} >
              <tbody>
                <tr>
                  <td className="title-table w-cus60px">{translate('setting.customer.masterPosition.no')}</td>
                  <td className="title-table">{translate('setting.customer.masterPosition.tblMotivationCol2')}</td>
                  <td className="title-table">{translate('setting.customer.masterPosition.tblStandCol2')}</td>
                  <td className="title-table">{translate('setting.customer.masterPosition.tblStandCol3')}</td>
                  <td className="title-table w-cus88px">{translate('setting.customer.masterPosition.tblStandCol4')}</td>
                </tr>
                <ListMasterMotivations
                  tableRef={tableMasterMotivationRef}
                  listItems={masterMotivations}
                  setItems={setMasterMotivations}
                  editItem={editMasterMotivations}
                  deleteItem={deleteMasterMotivation}
                />
              </tbody>
            </table>
            : <div className="align-center">{translate('setting.customer.noMasterMotivations')}</div>
          }
        </div>
      </div>
    </>
  )
}

const mapStateToProps = ({ masterPosition }: IRootState) => ({
  errorMessage: masterPosition.errorMessage,
  customerConnectionsMap: masterPosition.customerConnectionsMap,
  iDSS: masterPosition.updateSuccess,
  checkDelete: masterPosition.checkDelete,
  messageError: masterPosition.errorItems
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
)(MasterPosition);