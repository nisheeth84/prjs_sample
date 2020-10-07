import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { translate } from 'react-jhipster';
import { useId } from "react-id-generator";
import _ from 'lodash';
import { MIN_VALUE_SCALE, NETWORK_MAP_MODE, isViewAsTab, isViewAsModal } from '../../constants';
import DialogDirtyCheck, { DIRTYCHECK_PARTTERN } from 'app/shared/layout/common/dialog-dirty-check';
import { Droppable, DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Modal } from 'reactstrap';
import {
  handleInitializeNetworkMap,
  filterBusinessCards,
  handleDropBusinessCard,
  handleSaveNetworkMap,
  resetNetworkMapModalTable,
  dropTempBusinessCardTODepartment,
} from '../add-edit-network-map.reducer';
import { ScaleController } from './scale-controller';
import { SearchController } from './search-controller';
import DepartmentList from './department-list';
import BusinessCard from '../../department/business-card';
import { safeCall, safeMap, safeMapWithIndex } from 'app/shared/helpers';
import { findDepartmenIndexById } from '../../helpers';
import BusinessCardDetail from 'app/modules/businessCards/business-card-detail/business-card-detail';
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import PopupActivityDetail from 'app/modules/activity/detail/activity-modal-detail';
import {
  compose,
  eqProps,
  both,
  isNil,
  not,
  propOr,
  prop,
  path,
  filter,
  startsWith,
  when,
  split,
  find,
  propEq,
  contains,
  __,
  whereEq,
  map,
  ifElse
} from 'ramda';
import '../../customer.css';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIMEOUT_TOAST_MESSAGE } from 'app/config/constants';
import styled from 'styled-components';
import { ACTION_TYPES } from '../add-edit-network-map.reducer'
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';

const RelativeDiv = styled.div`
  position: relative;
`;

const PinedAtBottomLeft = styled.div`
  position: absolute;
  bottom: 3rem;
  left: 3rem;
`;

const getCustomerId = prop('customerId');
const getCustomerName = prop('customerName');
const getParentCustomerId = path(['customerParent', 'customerId']);
const getParentCustomerName = path(['customerParent', 'customerName']);
const hasParentCustomer = compose(
  not,
  isNil,
  path(['customerParent', 'customerId'])
);
const hasChildCustomer = compose(
  not,
  isNil,
  path(['customerChilds', 'customerId'])
);
const getDroppableId = prop('droppableId');
const getDropObjectId = compose(
  prop(1),
  split(':'),
  getDroppableId
);
const getDragObjectId = compose(
  prop(1),
  split(':'),
  prop('draggableId')
);
interface IAddEditNetworkMapModeTreeProps extends StateProps, DispatchProps {
  customerId?: number;
  updateNetworkCustomer?: (networkCustomer) => void;
  onCloseModal?: () => void;
  viewType: number;
  changeNetworkMapMode?: (mode, customerId?) => void;
  onOpenModal?: () => void;
  iconFunction?: any;
  customerOriginId;
}

const AddEditNetworkMapModeTree = (props: IAddEditNetworkMapModeTreeProps) => {
  const { customerOriginId } = props;
  const [hoveringCustomerId, setHoveringCustomerId] = useState(null);
  const [msgSuccess, setMsgSuccess] = useState(null);
  const [customerCurrentId, setCustomerCurrentId] = useState(props.customerId);
  const registerRef = useRef(null);
  const cardAreaRef = useRef(null);
  const networkMapRef = useRef(null);
  const [businessCardIdDetail, setBusinessCardIdDetail] = useState(null);
  const [employeeIdDetail, setEmployeeIdDetail] = useState(null);
  const [activityIdDetail, setActivityIdDetail] = useState(null);
  const [flagChange, setFlagChange] = useState(false);
  const [scaleValue, setScaleValue] = useState(MIN_VALUE_SCALE);
  const [networkMapStyle, setNetworkMapStyle] = useState({
    // zoom: `${MIN_VALUE_SCALE * 100}%`,
    'transform': `scale(${MIN_VALUE_SCALE},${MIN_VALUE_SCALE})`,
    '-moz-transform': `scale(${MIN_VALUE_SCALE},${MIN_VALUE_SCALE})`,
    '-moz-transform-origin': 'top left',
    'transform-origin': 'top left'
  });
  const employeeDetailCtrlId = useId(1, "customerNetworkEmployeeDetail_")

  const baseUrl = window.location.origin.toString();
  const getIconFunction = () => {
    if (props.iconFunction) {
      return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />
    }
    return <></>
  }

  const onScaleChange = useCallback(scale => {
    setScaleValue(scale);
    setNetworkMapStyle(oldStyle => ({
      ...oldStyle,
      // zoom: `${scale * 100}%`,
      'transform': `scale(${scale},${scale})`,
      '-moz-transform': `scale(${scale},${scale})`,
      '-moz-transform-origin': 'top left',
      'transform-origin': 'top left'
    }));
  }, []);

  const loadNetworkMapByCustomerId = (customerId, businessCardTemp = undefined) => {
    setCustomerCurrentId(customerId);
    props.handleInitializeNetworkMap(customerId, isViewAsModal(props.viewType), businessCardTemp);
  }

  const onClickOnCustomer = customerId => () => loadNetworkMapByCustomerId(customerId);

  useEffect(() => {
    if (document.body.classList.contains('body-full-width')) {
      document.body.className = "body-full-width wrap-customer modal-open";
    } else {
      document.body.className = "wrap-customer modal-open";
    }
    loadNetworkMapByCustomerId(props.customerId);
  }, []);

  useEffect(() => {
    const classNameBody = document.body.className;
    if(businessCardIdDetail){
      document.body.className = classNameBody + " " + "wrap-card";
    }else{
      document.body.className = classNameBody.replace('wrap-card', '');
    }
  }, [businessCardIdDetail])

  const handleChangeMode = () => {
    if (props.changeNetworkMapMode) {
      props.changeNetworkMapMode(NETWORK_MAP_MODE.TABLE, customerCurrentId);
    }
  };

  const dropOnOtherCustomer = (dragObjectId, sourceDropObject, destinationDropObject) => {
    const { allDepartments, businessCardDatas, standDatas, motivationDatas, employeeDatas } = props;

    const sourceDepartmentIndex = findDepartmenIndexById(sourceDropObject.id, allDepartments);

    const department = prop(sourceDepartmentIndex, allDepartments);

    const networkStand = compose(
      find(propEq('businessCardId', dragObjectId)),
      prop('networkStands')
    )(department);

    const {
      businessCardId,
      stands: { masterStandId, motivationId }
    } = networkStand;

    networkStand['departmentIdSource'] = department.departmentId;
    networkStand['departmentNameSource'] = department.departmentName;
    networkStand['customerIdSource'] = customerCurrentId;

    const cardData = find(propEq('businessCardId', businessCardId), businessCardDatas);
    const employeeIds = map(prop('employeeId)'), prop('businessCardReceives', cardData));

    const nextBusinessCardTemp = {
      department,
      networkStand,
      cardData,
      stands: find(propEq('masterStandId', masterStandId), standDatas),
      motivations: find(propEq('motivationId', motivationId), motivationDatas),
      employeeDatas: filter(
        compose(
          contains(__, employeeIds),
          prop('employeeId')
        ),
        employeeDatas
      )
    };

    loadNetworkMapByCustomerId(destinationDropObject.id, nextBusinessCardTemp);
  };

  const executeDirtyCheckDrag = async (action: () => void, cancel?: () => void, partern?: any, flagDropChange?: boolean) => {
    if (flagDropChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern });
    } else {
      action();
    }
  };

  const executeDirtyCheck = async (action: () => void, cancel?: () => void, partern?: any) => {
    if (flagChange) {
      await DialogDirtyCheck({ onLeave: action, onStay: cancel, partternType: partern });
    } else {
      action();
    }
  };

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination } = result;
      // dropped nowhere
      if (isNil(destination)) return;

      // did not move anywhere
      if (both(eqProps('droppableId', source), eqProps('index', source))(destination)) {
        return;
      }
      const departmentId = source.droppableId.toString().split(':')[1];
      const department = props.stateAddEditNetworkMap.departments.find(e => e.departmentId.toString() === departmentId);
      const destionType = destination && destination.droppableId ? destination.droppableId : null;
      if (department?.networkStands.length === 1 && !destionType.startsWith('department')) {
        const resultConfirm = await ConfirmDialog({
          title: (<>{translate('customers.network-map.popup-warning.warning')}</>),
          message: translate("messages.WAR_CUS_0007", { 0: department.departmentName }),
          cancelText: translate('customers.top.popup.btn-cancel'),
          cancelClass: "button-red"
        });
        if (!resultConfirm) {
          return;
        }
      }
      let flagDropChange;
      if (!destionType.startsWith('department')) {
        flagDropChange = true;
      } else {
        flagDropChange = false
      }
      executeDirtyCheckDrag(() => {
        ifElse(
          compose(
            startsWith('department'),
            getDroppableId
          ),
          ifElse(
            () =>
              compose(
                startsWith('tempDepartment'),
                getDroppableId
              )(source),
            () =>
              safeCall(props.dropTempBusinessCardTODepartment)(
                +getDropObjectId(destination),
                destination.index
              ),
            () =>
              safeCall(props.handleDropBusinessCard)(
                +getDragObjectId(result),
                { id: +getDropObjectId(source), index: source.index },
                { id: +getDropObjectId(destination), index: destination.index }
              )
          ),
          when(
            compose(
              startsWith('customer'),
              getDroppableId
            ),
            () =>
              dropOnOtherCustomer(
                +getDragObjectId(result),
                { id: +getDropObjectId(source), index: source.index },
                { id: hoveringCustomerId || +getDropObjectId(destination), index: destination.index }
              )
          )
        )(destination)}, () => {}, DIRTYCHECK_PARTTERN.PARTTERN1, flagDropChange)
    },
    [props.handleDropBusinessCard, hoveringCustomerId]
  );

  const saveNetworkMap = async () => {
    if (!flagChange) {
      return;
    }
    if (props.stateAddEditNetworkMap?.departments && props.stateAddEditNetworkMap.departments.length > 0) {
      const departmentEmpty = props.stateAddEditNetworkMap.departments.filter(department => !department.networkStands || department.networkStands.length < 1);
      if (departmentEmpty && departmentEmpty.length > 0) {
        const result = await ConfirmDialog({
          title: translate('customers.network-map.popup-warning.warning'),
          message: translate('messages.ERR_CUS_0019', { 0: departmentEmpty[0].departmentName }),
          confirmText: translate('customers.network-map.popup-warning.ok'),
          confirmClass: "button-red",
          cancelText: null,
        });
        if (result) {
          return;
        }
      }
      if (props.businessCardTemp) {
        const result = await ConfirmDialog({
          title: translate('customers.network-map.popup-warning.warning'),
          message: translate('messages.ERR_CUS_0006'),
          confirmText: translate('customers.network-map.popup-warning.ok'),
          confirmClass: "button-red",
          cancelText: null,
        });
        if (result) {
          return;
        }
      }
    }
    props.handleSaveNetworkMap(props.stateAddEditNetworkMap);
  };

  const styleHeight = useMemo(() => {
    if (isViewAsTab(props.viewType)) {
      return {};
    } else {
      return { height: window.innerHeight - 300 };
    }
  }, [registerRef.current, window.innerHeight]);

  useEffect(() => {
    if (props.msgSuccess === null || props.msgSuccess === 'messages.INF_COM_0003') {
      setFlagChange(false);
    }
    setMsgSuccess(props.msgSuccess);
    loadNetworkMapByCustomerId(props.customerId);
  }, [props.msgSuccess]);

  useEffect(() => {
    if (props.stateAddEditNetworkMap.departments) {
      setFlagChange(true);
    }
  }, [props.stateAddEditNetworkMap.departments]);

  useEffect(() => {
    setFlagChange(false);
  }, [props.startDepartment]);

  const renderMessage = () => {
    if (!msgSuccess || msgSuccess.length <= 0) {
      return <></>;
    }
    setTimeout(() => {
      setMsgSuccess(null);
    }, TIMEOUT_TOAST_MESSAGE);
    return (
      <BoxMessage
        className="message-area message-area-bottom position-absolute"
        messageType={MessageType.Success}
        message={msgSuccess}
      />
    );
  };

  const displayCustomer = (customerChild, index) => {
    if (!getCustomerId(customerChild)) {
      return <></>
    }
    return <Droppable droppableId={`customer:${getCustomerId(customerChild)}`} index={index} >
      {(provided, snapshot) => (
        <li>
          <button
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="button-primary button-parent"
            onClick={onClickOnCustomer(getCustomerId(customerChild))}
            onMouseOver={() => setHoveringCustomerId(getCustomerId(customerChild))}
            onMouseOut={() => setHoveringCustomerId(null)}
          >
            {getCustomerName(customerChild)}
            {'\u00A0'}
          </button>
        </li>
      )}
    </Droppable >
  };

  const handleClosePopup = (partern) => {
    executeDirtyCheck(() => {
      props.resetNetworkMapModalTable();
      if (props.onCloseModal) {
        props.onCloseModal();
      }
    }, () => { }, partern);
  };

  useEffect(() => {
    if (!props.getLastAction) {
      return;
    }
    if (props.getLastAction.type === ACTION_TYPES.OPEN_BUSINESS_CARD_DETAIL_MODAL) {
      setBusinessCardIdDetail(props.getLastAction.businessCardId);
    } else if (props.getLastAction.type === ACTION_TYPES.OPEN_EMPLOYEE_DETAIL_MODAL) {
      setEmployeeIdDetail(props.getLastAction.employeeId);
    } else if (props.getLastAction.type === ACTION_TYPES.OPEN_ACTIVITY_DETAIL_MODAL) {
      setActivityIdDetail(props.getLastAction.activityId);
    }
  }, [props.getLastAction]);

  useEffect(() => {
    setBusinessCardIdDetail(null);
    setEmployeeIdDetail(null);
    setActivityIdDetail(null);
  }, [props.viewType]);

  const [offsetScrollTop, setOffsetScrollTop] = useState(0);

  const handleScroll = () => {
    if (!props.departmentIdParent && networkMapRef.current) {
      setOffsetScrollTop(networkMapRef.current.scrollTop);
    }
  }

  useEffect(() => {
    if (props.departmentIdParent) {
      networkMapRef.current.scrollTop = offsetScrollTop;
    }
  }, [props.departmentIdParent])

  const renderBodyModal = () => {
    return (
      <div ref={registerRef} className="tab-pane active h-100 overflow-hidden">
        <div className="tab-pane-area position-relative h-100">
          <div className="area-control form-inline">
            {isViewAsModal(props.viewType) &&
              <SearchController onSearch={props.filterBusinessCards} isDisabled={!props.businessCardDatas || props.businessCardDatas.length === 0} />
            }
            <ScaleController onScaleChange={onScaleChange} />
            {props.businessCardDatas && props.businessCardDatas.length > 0
              ? (<a className="icon-primary icon-list-view" onClick={() => { executeDirtyCheck(() => handleChangeMode(), () => { }, DIRTYCHECK_PARTTERN.PARTTERN1) }}></a>)
              : (<a className="icon-primary icon-list-view disable"></a>)}
            {isViewAsTab(props.viewType) && (
              <a
                className="button-primary btn-add w-auto margin-left-4"
                onClick={props.onOpenModal}
              >
                {translate('customers.network-map.btn-edit-network-map')}
              </a>
            )}
          </div>
          <div className="card-area h-100" ref={cardAreaRef}>
            <div className="area-button-pane">
              <button className={`button-primary button-currently-open ${customerCurrentId === customerOriginId ? 'disable' : ''}`}
                disabled={customerCurrentId === customerOriginId} onClick={onClickOnCustomer(customerOriginId)}>
                {translate('customers.network-map.view-current-customer')}
              </button>
            </div>
            <div className={`${isViewAsTab(props.viewType) ? 'h-100 overflow-x-hover ' : 'overflow-auto '}min`} style={styleHeight}>
              <DragDropContext onDragEnd={onDragEnd} isDragDisabled={isViewAsModal(props.viewType)}>
                <div ref={networkMapRef} onScroll={handleScroll} className="list-card network-map-container position-relative style-3 h-100 overflow-x-hover overflow-y-hover" style={networkMapStyle}>
                  <div className="col-card mt-2">
                    <div className="sub-customer-three">
                      <div className="lst-customer-three">
                        {hasParentCustomer(props) && (
                          <div className="item-customer-three">
                            <Droppable droppableId={`customer:${getParentCustomerId(props)}`} index={0} isDragDisabled={isViewAsTab(props.viewType)}>
                              {(provided, snapshot) => (
                                <button
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  className="button-primary button-parent"
                                  onClick={onClickOnCustomer(getParentCustomerId(props))}
                                  onMouseOver={() =>
                                    setHoveringCustomerId(getParentCustomerId(props))
                                  }
                                  onMouseOut={() => setHoveringCustomerId(null)}
                                >
                                  {getParentCustomerName(props)}
                                </button>
                              )}
                            </Droppable>
                          </div>
                        )}
                        <div className="item-customer-three">
                          <button className="button-primary button-parent" >
                            {getCustomerName(props.customer)}
                          </button>
                        </div>
                        <div className="item-customer-three">
                          <ul className="lst-customer-four">
                            {safeMapWithIndex(displayCustomer, prop('customerChilds', props))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-card">
                    <div className="item-card pb-3">
                      <DepartmentList
                        departments={props.departments}
                        viewType={props.viewType}
                        isFirst={true}
                        scale={scaleValue}
                        isShowBorderOutLine={false}
                        onChangeTitle={(value) => setFlagChange(value)}
                      />
                    </div>
                  </div>
                  {props.businessCardTemp && (
                    <PinedAtBottomLeft className="col-card">
                      <div className="item-card">
                        <RelativeDiv className="d-flex">
                          <div className="class-test">
                            <Droppable droppableId="tempDepartment">
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.droppableProps}>
                                  <div className="body">
                                    <BusinessCard
                                      data={props.businessCardTemp}
                                      draggablePrefix="tempBusinessCardId"
                                      index={0}
                                      viewType={props.viewType}
                                      department={null}
                                      networkStand={null}
                                      scale={scaleValue}
                                    />
                                  </div>
                                </div>
                              )}
                            </Droppable>
                          </div>
                        </RelativeDiv>
                      </div>
                    </PinedAtBottomLeft>
                  )}
                </div>
              </DragDropContext>
            </div>
            {renderMessage()}
          </div>
        </div>
        {businessCardIdDetail &&
          <Modal isOpen={true} fade={true} toggle={() => { }} backdrop={true} id="popup-customer-detail" autoFocus={true} zIndex="900">
            <BusinessCardDetail
              key={businessCardIdDetail}
              showModal={false}
              businessCardId={businessCardIdDetail}
              listBusinessCardId={[businessCardIdDetail]}
              toggleClosePopupBusinessCardDetail={() => setBusinessCardIdDetail(null)}
              businessCardList={[]} />
          </Modal>
        }
        {employeeIdDetail &&
          <PopupEmployeeDetail
            id={employeeDetailCtrlId[0]}
            showModal={true}
            openFromModal={true}
            employeeId={employeeIdDetail}
            listEmployeeId={[]}
            toggleClosePopupEmployeeDetail={() => setEmployeeIdDetail(null)}
            resetSuccessMessage={() => { }} />
        }
        {activityIdDetail &&
          <PopupActivityDetail
            activityId={activityIdDetail}
            listActivityId={[activityIdDetail]}
            canBack={true}
            onCloseActivityDetail={() => setActivityIdDetail(null)}
          />}
      </div>
    );
  };

  if (isViewAsTab(props.viewType)) {
    return <>{renderBodyModal()}</>;
  } else {
    return (
      <>
        <div className="wrap-customer">
          <div
            id="popup-esr"
            className="modal popup-esr popup-esr4 user-popup-page popup-align-right show"
            aria-hidden="true"
          >
            <div className="modal-dialog form-popup">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="left">
                    <div className="popup-button-back">
                      <a
                        className="icon-small-primary icon-return-small"
                        onClick={() => handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN2)}
                      />
                      <span className="text">{getIconFunction()}{translate('customers.network-map.title')}</span>
                    </div>
                  </div>
                  <div className="right">
                    <a
                      className="icon-small-primary icon-close-up-small line"
                      onClick={() => handleClosePopup(DIRTYCHECK_PARTTERN.PARTTERN2)}
                    />
                  </div>
                </div>
                <div className="modal-body body-padding">{renderBodyModal()}</div>
                <div className="user-popup-form-bottom">
                  <button className={`button-blue button-form-register ${flagChange ?
                    '' : 'disable'}`} onClick={saveNetworkMap}>
                    {translate('customers.network-map.btn-save')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

const mapStateToProps = ({ authentication, addEditNetworkMap, lastAction }: IRootState) => ({
  authorities: authentication.account.authorities,
  businessCardTemp: addEditNetworkMap.businessCardTemp,
  businessCardDatas: addEditNetworkMap.businessCardDatas,
  standDatas: addEditNetworkMap.standDatas,
  motivationDatas: addEditNetworkMap.motivationDatas,
  employeeDatas: addEditNetworkMap.employeeDatas,
  allDepartments: addEditNetworkMap.departments,
  departments: compose(
    filter(
      whereEq({ parentId: 1 })
    ),
    propOr([], 'departments')
  )(addEditNetworkMap),
  customerParent: addEditNetworkMap.customerParent,
  customer: addEditNetworkMap.customer,
  customerChilds: propOr([], 'customerChilds', addEditNetworkMap),
  stateAddEditNetworkMap: addEditNetworkMap,
  msgError: addEditNetworkMap.errorMessage,
  msgSuccess: addEditNetworkMap.successMessage,
  startDepartment: addEditNetworkMap.startDepartment,
  getLastAction: lastAction,
  actionType: addEditNetworkMap.action,
  departmentIdParent: addEditNetworkMap.departmentIdParent
});

const mapDispatchToProps = {
  handleInitializeNetworkMap,
  filterBusinessCards,
  handleDropBusinessCard,
  handleSaveNetworkMap,
  resetNetworkMapModalTable,
  dropTempBusinessCardTODepartment
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditNetworkMapModeTree);
