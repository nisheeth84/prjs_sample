import React, { useState, useRef, useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import TooltipAddPositionNetwork from '../tooltip/tooltip-add-position-network';
import TooltipPositionNetworkDetail from '../tooltip/tooltip-position-network-detail';

import { Draggable } from 'react-beautiful-dnd';
import { IRootState } from 'app/shared/reducers';
import {
  propOr,
  path,
  compose,
  prop,
  find,
  eqProps,
  applySpec,
  equals,
  __,
  isNil,
  always,
  identity,
  ifElse,
  F
} from 'ramda';

import ListEmployees from './list-employees';
import BusinessCardImage from './business-card-image';
import { Storage, translate } from 'react-jhipster';
import { isViewAsTab } from '../constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import _ from 'lodash';
import { handleUpdatePosition } from '../network-map-modal/add-edit-network-map.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import { isMouseOnRef } from 'app/shared/util/utils';

const isVisible = compose(
  visible => equals(true, visible) || isNil(visible),
  prop('visible')
);

const getItemStyle = (isDragging, draggableStyle, canView, scale) => {
  return {
    userSelect: 'none',
    background: isDragging ? '#fff' : 'initial',
    visibility: canView ? 'initial' : 'hidden',
    ...draggableStyle,
    left: 0,
    top: 0,
    ...(isDragging && {
      position: 'absolute',
      // 'transform': `translate(${scale},${scale})`,
      // '-moz-transform': `translate(${scale},${scale})`,
      // '-moz-transform-origin': 'top left',
      // 'transform-origin': 'top left'
    })
  };
};

const getStyleMotivation = backgroundId => {
  switch (backgroundId) {
    case 2:
      return 'background-color-24';
    case 3:
      return 'background-color-104';
    case 4:
      return 'background-color-106';
    case 5:
      return 'background-color-93';
    case 6:
      return 'background-color-101';
    case 7:
      return 'background-color-102';
    case 8:
      return 'background-color-103';
    default:
      return 'background-color-89';
  }
};

export interface IBusinessCardProps extends StateProps, DispatchProps {
  key?: string;
  index?: number;
  draggablePrefix?: string;
  department?: any;
  networkStand?: any;
  viewType?: any;
  data?: any;
  scale;
}

const BusinessCard = (props: IBusinessCardProps) => {
  const draggablePrefix = props.draggablePrefix || 'businessCardId';
  const { index, viewType } = props;
  const { department, networkStand, motivations, stands, cardData } = (props.data || props);

  const [onTooltipAddNetworkStand, setTooltipAddNetworkStand] = useState(false);
  const [onTooltipNetworkStandDetail, setTooltipNetworkStandDetail] = useState(false);

  const tooltipAddNetworkStandRef = useRef(null);
  const divTooltipNetworkStandDetailRef = useRef(null);
  const useRefButtonCancelRef = useRef(null);
  const useRefButtonOKRef = useRef(null);

  const onOpenTooltipAddNetworkStand = useCallback(() => {
    if (isViewAsTab(viewType)) {
      return;
    }
    setTooltipAddNetworkStand(true);
  }, [setTooltipAddNetworkStand]);

  const editPositionNetwork = () => {
    setTooltipNetworkStandDetail(false);
    setTooltipAddNetworkStand(true);
  };


  const deletePositionNetwork = async () => {
    const name = cardData.lastName ? cardData.firstName + ' ' + cardData.lastName : cardData.firstName;
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.popup.title-delete')}</>),
      message: translate("messages.WAR_CUS_0005", { 0: name }),
      confirmText: translate('customers.top.popup.btn-delete'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.popup.btn-cancel'),
      cancelClass: "button-cancel"
    });
    if (result) {
      setTooltipNetworkStandDetail(false);
      props.handleUpdatePosition(
        props.department?.departmentId,
        {
          businessCardId: cardData.businessCardId, stands: {}
        }
      );
    }
  };

  const language = useMemo(() => {
    return Storage.session.get('locale', 'ja_jp');
  }, []);

  const canView = useMemo(() => isVisible(cardData), [cardData]);

  const isWorking = useMemo(() => {
    return compose(
      ifElse(isNil, F, identity),
      prop('isWorking')
    )(cardData);
  }, [cardData]);

  const standName = useMemo(
    () =>
      ifElse(
        identity,
        compose(
          prop(language),
          JSON.parse,
          prop('masterStandName')
        ),
        always('')
      )(stands),
    [stands]
  );

  const onMouseOverStand = () => {
    if (divTooltipNetworkStandDetailRef.current)
      clearTimeout(divTooltipNetworkStandDetailRef.current);
    if (!onTooltipNetworkStandDetail) setTooltipNetworkStandDetail(true);
  };

  const onMouseOutStand = () => {
    divTooltipNetworkStandDetailRef.current = setTimeout(() => {
      setTooltipNetworkStandDetail(false);
    }, 100);
  };

  const eventMouseDown = (e) => {
    if (!isMouseOnRef(tooltipAddNetworkStandRef, e)) {
      setTooltipAddNetworkStand(false);
    }
  }
  useEventListener('mousedown', eventMouseDown);

  const getSrcImg = useMemo(() => {
    if (motivations?.motivationIcon?.iconName) {
      if (motivations?.motivationIcon?.iconPath && !_.isEmpty(motivations.motivationIcon.iconPath)) {
        return (
          <a className="d-flex justify-content-between">
            <img className="icon-16" src={motivations?.motivationIcon?.iconPath}></img>
            <span>{standName}{'\u00A0'}</span>
            <span className="px-1"></span>
          </a>
        );
      }
    }
    switch (path(['motivationIcon', 'iconName'], motivations)) {
      case 'positive':
        return (
          <a
            title=""
            className="icon-primary-setting box-primary-setting ic-setting-up-arrow rotate-45 background-transparent"
          >
            {standName}
            {'\u00A0'}
          </a>
        );
      case 'neutral':
        return (
          <a
            title=""
            className="icon-primary-setting box-primary-setting ic-setting-horizontal-arrow background-transparent"
          >
            {standName}
            {'\u00A0'}
          </a>
        );
      case 'negative':
        return (
          <a
            title=""
            className="icon-primary-setting box-primary-setting ic-setting-down-arrow rotate-45 background-transparent"
          >
            {standName}
            {'\u00A0'}
          </a>
        );
      default:
        return (
          <a
            title=""
            className="icon-primary-setting box-primary-setting icon-setting-ask background-transparent"
          >
            {standName}
            {'\u00A0'}
          </a>
        );
    }
  }, [standName, motivations]);

  const renderPosition = () => {
    if (!isWorking) {
      return (
        <div className="button button-disable">
          {standName}
          {'\u00A0'}
        </div>
      );
    }
    if (motivations || stands || networkStand?.stands?.comment && !_.isEmpty(networkStand?.stands?.comment)) {
      return (
        <div
          className={`${motivations?.motivationIcon?.backgroundColor ? getStyleMotivation(motivations.motivationIcon.backgroundColor) : ''} button`}
          onMouseOver={onMouseOverStand}
          onMouseOut={onMouseOutStand}
          ref={divTooltipNetworkStandDetailRef}
        >
          {getSrcImg}
          {onTooltipNetworkStandDetail && (
            <div className="wap-customer-hover-tooltip location-r0">
              <TooltipPositionNetworkDetail
                networkStand={networkStand}
                motivation={motivations}
                test={props}
                stand={stands}
                viewType={viewType}
                editPositionNetwork={editPositionNetwork}
                deletePositionNetwork={deletePositionNetwork}
              />
            </div>
          )}
        </div>
      );
    }
    return (
      <div
        className={onTooltipAddNetworkStand ? 'button button-add active' : 'button button-add'}
        onClick={onOpenTooltipAddNetworkStand}
      >
        <i className="fas fa-plus mr-2"></i>
        {translate('customers.network-map.business-card.add-position')}
      </div>
    );
  };

  const renderContent = () => (
    <>
      {/* add position*/}
      <div className="group-button wrap-setting">
        {renderPosition()}
        {onTooltipAddNetworkStand && (
          <div ref={tooltipAddNetworkStandRef} className="wap-customer-hover-tooltip">
            <TooltipAddPositionNetwork
              currentPosition={cardData}
              departmentId={department.departmentId}
              useRefButtonCancel={useRefButtonCancelRef}
              useRefButtonOK={useRefButtonOKRef}
              onCloseTooltip={() => setTooltipAddNetworkStand(false)}
            />
          </div>
        )}
      </div>
      <BusinessCardImage
        cardData={cardData}
        department={department}
        viewType={viewType}
      />
      {/* list employees */}
      <ListEmployees
        cardData={cardData}
        viewType={viewType}
      />
    </>
  )

  // if (!props.data){
  return (
    <Draggable draggableId={`${draggablePrefix}:${prop('businessCardId', networkStand)}`} index={index} isDragDisabled={isViewAsTab(props.viewType)}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, canView, props.scale)}
        >
          {renderContent()}
        </div>
      )}
    </Draggable>
  );
};

const mapStateToProps = (
  { addEditNetworkMap }: IRootState,
  { data, draggablePrefix, department, networkStand, index, viewType, scale }
) => {
  const findBusinessCardData = addEditNetworkMap?.businessCardDatas?.find(b => b.businessCardId === networkStand?.businessCardId);
  const findDepartment = addEditNetworkMap.departments.find(de => de.departmentId === findBusinessCardData?.departmentId);
  if (findBusinessCardData && findDepartment) {
    const findNetworkStand = findDepartment.networkStands.find(n => n.businessCardId === findBusinessCardData?.businessCardId);
    findBusinessCardData["masterStandId"] = findNetworkStand?.stands?.masterStandId;
    findBusinessCardData["motivationId"] = findNetworkStand?.stands?.motivationId;
    findBusinessCardData["comment"] = findNetworkStand?.stands?.comment;
  }
  const getStands = prop('stands');
  const getStandId = prop('masterStandId');
  const getMotivationId = prop('motivationId');
  const findStands = compose(
    find(
      compose(
        equals(
          compose(
            getStandId,
            getStands
          )(networkStand)
        ),
        getStandId
      )
    ),
    propOr([], 'standDatas')
  );
  const findMotivation = compose(
    find(
      compose(
        equals(
          compose(
            getMotivationId,
            getStands
          )(networkStand)
        ),
        getMotivationId
      )
    ),
    propOr([], 'motivationDatas')
  );
  if (findBusinessCardData) {
    findBusinessCardData['companyName'] = addEditNetworkMap?.customer?.customerName;
  }
  if (!data) {
    return {
      ...applySpec({
        motivations: findMotivation,
        stands: findStands
      })(addEditNetworkMap),
      cardData: findBusinessCardData,
      viewType,
      draggablePrefix
    };
  } else {
    return {
      ...data,
      ...applySpec({
        motivations: findMotivation,
        stands: findStands
      })(addEditNetworkMap),
      cardData: findBusinessCardData,
      viewType,
      draggablePrefix
    };
  }
};

const mapDispatchToProps = {
  handleUpdatePosition
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessCard);
