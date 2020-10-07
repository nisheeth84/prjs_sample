import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { __, propOr, when, path, unless, isNil, compose, prop, always, take, gt } from 'ramda';

import BusinessCard from './business-card';
import { BUSINESS_CARDS_LENGTH, isViewAsModal, isViewAsTab, MAX_LENGTH_DEPARTMENT_NAME } from '../constants';
import { Droppable } from 'react-beautiful-dnd';

import {
  safeCall,
  setStateByTargetValue,
  isKeyEnterPressed,
  safeMapWithIndex
} from 'app/shared/helpers';

import { getDepartmentId } from '../helpers';

import {
  handleGetBusinessCard,
  handleUpdateDepartment,
  handleDeleteDepartment,
  handleShowFormCreateDepartment
} from '../network-map-modal/add-edit-network-map.reducer';

import { translate } from 'react-jhipster';
import CreateEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import {
  BUSINESS_CARD_VIEW_MODES,
  BUSINESS_CARD_ACTION_TYPES
} from 'app/modules/businessCards/constants';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';

interface IDepartmentCardTitleNetwork {
  department: any;
  viewType;
  onUpdate?: (departmentName: string) => void;
  onDelete?: () => void;
  isFirst?: boolean;
}

const DepartmentCardTitleNetwork = (props: IDepartmentCardTitleNetwork) => {
  const [departmentName, setDepartmentName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = useCallback(() => setIsEditing(true), []);

  const onUpdate = useCallback(safeCall(props.onUpdate), [props.onUpdate]);
  const onDelete = useCallback(safeCall(props.onDelete), [props.onDelete]);

  const onDepartmentNameChange = useCallback(setStateByTargetValue(setDepartmentName), []);

  const onUpdateDepartmentName = useCallback(() => {
    setIsEditing(false);
    onUpdate(departmentName);
  }, [departmentName]);

  const onTextboxDepartmentNameKeyPress = useCallback(
    when(isKeyEnterPressed, onUpdateDepartmentName),
    [onUpdateDepartmentName]
  );

  useEffect(() => {
    unless(
      isNil,
      compose(
        setDepartmentName,
        propOr('', 'departmentName')
      )
    )(props.department);
  }, [props.department]);

  const title = useMemo(() => {
    return `${departmentName}`;
  }, [departmentName]);

  const countDepartment = useMemo(() => {
    return ` (${+path(['networkStands', 'length'], props.department)})`;
  }, [props.department]);

  return (
    <div className={`${isViewAsTab(props.viewType) ? 'pointer-none' : ''} title position-relative mt-2`}>
      {isEditing ? (
        <input
          className="border-none w100"
          defaultValue={departmentName}
          onChange={onDepartmentNameChange}
          onBlur={onUpdateDepartmentName}
          onKeyPress={onTextboxDepartmentNameKeyPress}
          maxLength={MAX_LENGTH_DEPARTMENT_NAME}
        />
      ) : (
          <>
            <span className="text-ellipsis">
              {/* <Popover> */}
              {title}
              {/* </Popover> */}
            </span>
            <span className="w10">
              {countDepartment}
            </span>
            <div className="position-absolute location-r0">
              <a className="icon-small-primary icon-edit-small" onClick={startEdit} />
              <a className="icon-small-primary icon-erase-small" onClick={onDelete} />
            </div>
          </>
        )}
    </div>
  );
};

interface IDepartmentCardNetworkProps extends StateProps, DispatchProps {
  department: any;
  isNotFirst?;
  isFirst?;
  viewType;
  hasMultipleParent;
  scale;
  onChangeTitle?: (value?: boolean) => void;
}

const DepartmentCardNetwork = (props: IDepartmentCardNetworkProps) => {
  const { department, isNotFirst, viewType } = props;

  const [isShowFullBusiness, setIsShowFullBusiness] = useState(true);
  const [showCreateBusinessCard, setShowCreateBusinessCard] = useState(false);
  const toggleDisplayFullBusiness = useCallback(() => setIsShowFullBusiness(!isShowFullBusiness), [
    isShowFullBusiness
  ]);

  const onUpdateDepartmentName = departmentName => {
    props.onChangeTitle(true);
    department.departmentName = departmentName;
    safeCall(props.handleUpdateDepartment)(department);
  }

  const onDeleteDepartmentName = useCallback(() => {
    safeCall(props.handleDeleteDepartment)(department);
  }, [props.handleDeleteDepartment]);

  const confirmDeleteDepartment = async () => {
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.popup.title-delete')}</>),
      message: translate("messages.WAR_COM_0001", { itemName: department.departmentName }),
      confirmText: translate('customers.top.popup.btn-delete'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.popup.btn-cancel'),
      cancelClass: "button-cancel"
    });
    if (result) {
      props.onChangeTitle(true);
      onDeleteDepartmentName()
    }
  }

  const networkStands = useMemo(
    () =>
      compose(
        when(always(isShowFullBusiness), take(BUSINESS_CARDS_LENGTH)),
        propOr([], 'networkStands')
      )(department),
    [department, isShowFullBusiness]
  );

  const hasMore = useMemo(
    () =>
      compose(
        gt(__, BUSINESS_CARDS_LENGTH),
        path(['networkStands', 'length'])
      )(department),
    [department]
  );

  const onClosePopupEdit = businessCard => {
    setShowCreateBusinessCard(false);
    if (document.body.classList.contains('wrap-card')) {
      document.body.classList.remove('wrap-card');
    }
    props.handleGetBusinessCard(department, businessCard?.businessCardId);
  };

  const setTimeoutMouseOutHandler = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  const onMouseOver = () => {
    if (setTimeoutMouseOutHandler.current) clearTimeout(setTimeoutMouseOutHandler.current);
    if (!isMouseOver) setIsMouseOver(true);
  };

  const onMouseOut = () => {
    setTimeoutMouseOutHandler.current = setTimeout(() => {
      setIsMouseOver(false);
    }, 750);
  };

  const [countHover, setCountHover] = useState(false);

  const lineStyle = useMemo(() => {
    if (!department.parentId) {
      return { width: 26 };
    }
    if (isNotFirst) {
      return { width: 26 };
    }
    return { width: 52 };
  }, [isNotFirst]);

  return (
    <Droppable droppableId={`department:${getDepartmentId(department)}`}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <DepartmentCardTitleNetwork
            department={department}
            viewType={viewType}
            onUpdate={onUpdateDepartmentName}
            onDelete={confirmDeleteDepartment}
          />
          <div className="body" onMouseOver={onMouseOver} onMouseOut={onMouseOut}>
            {safeMapWithIndex(
              (networkStand, index) => (
                <BusinessCard
                  key={prop('businessCardId', networkStand)}
                  department={department}
                  networkStand={networkStand}
                  index={index}
                  viewType={viewType}
                  data={null}
                  draggablePrefix={null}
                  scale={props.scale}
                />
              ),
              networkStands
            )}
            {provided.placeholder}
            <div className="text-center mt-3">
              {hasMore && (
                <a
                  className="button-primary button-activity-registration font-size-8 mb-2 active"
                  onClick={toggleDisplayFullBusiness}
                >
                  {isShowFullBusiness
                    ? translate('customers.network-map.department-card-network.show-all')
                    : translate('customers.network-map.department-card-network.close')}
                </a>
              )}
              <a className={`${isViewAsModal(viewType) ? '' : 'opacity-none '} button-primary button-add-new font-size-12`}
                onClick={() => isViewAsModal(viewType) && setShowCreateBusinessCard(true)}>
                {translate('customers.network-map.mode-table.btn-add-business-card')}
              </a>
            </div>
            <div className="link-left">
              <div className="line" style={lineStyle} />
              {isViewAsModal(viewType) && isMouseOver && <a
                className="icon-small-primary icon-plus2 z-index-4"
                onMouseOver={() => { setCountHover(true); props.handleShowFormCreateDepartment(department?.parentId ?? 1) }}
                onMouseLeave={() => countHover && props.handleShowFormCreateDepartment(null)}
                onClick={() => { setCountHover(false); props.handleShowFormCreateDepartment(department?.parentId ?? 1, true) }}
              ></a>}
              {isNotFirst && <div className="line-h" />}
            </div>
            {isViewAsModal(viewType) && isMouseOver && (
              <div className="link-right">
                <div className="line"></div>
                <a
                  className="icon-small-primary icon-plus2"
                  onMouseOver={() => { setCountHover(true); props.handleShowFormCreateDepartment(department?.departmentId) }}
                  onMouseLeave={() => countHover && props.handleShowFormCreateDepartment(null)}
                  onClick={() => { setCountHover(false); props.handleShowFormCreateDepartment(department?.departmentId, true) }}
                ></a>
              </div>
            )}
          </div>
          {showCreateBusinessCard && (
            <CreateEditBusinessCard
              iconFunction="ic-sidebar-business-card.svg"
              businessCardActionType={BUSINESS_CARD_ACTION_TYPES.CREATE}
              businessCardViewMode={BUSINESS_CARD_VIEW_MODES.EDITABLE}
              businessCardId={null}
              closePopup={onClosePopupEdit}
              customerId={props.customer.customerId}
              customerName={props.customer.customerName}
              departmentName={props.department.departmentName}
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

const mapStateToProps = ({ addEditNetworkMap }: IRootState) => ({
  customer: addEditNetworkMap.customer,
});

const mapDispatchToProps = {
  handleGetBusinessCard,
  handleUpdateDepartment,
  handleDeleteDepartment,
  handleShowFormCreateDepartment
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepartmentCardNetwork);
