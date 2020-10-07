import React, { useState, useRef, useMemo } from 'react';
import TooltipBusinessCardDetail from '../tooltip/tooltip-business-card-detail';
import { path, prop, __, ifElse, compose, isNil, F, identity } from 'ramda';
import { connect } from 'react-redux';
import {
  handleDeleteBusinessCard,
  openBusinessCardDetailModal
} from '../network-map-modal/add-edit-network-map.reducer'
import { isViewAsModal } from '../constants';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { translate } from 'react-jhipster';
import { isMouseOnRef } from 'app/shared/util/utils';

export interface IBusinessCardImage extends StateProps, DispatchProps {
  department;
  cardData;
  viewType;
}

const BusinessCardImage: React.FC<IBusinessCardImage> = props => {
  const { cardData } = props;
  const businessCardRef = useRef(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const buttonCloseRef = useRef(null);
  const tooltipBusinessRef = useRef(null);

  const imgCard = useMemo(
    () => { return path(['businessCardImagePath'], cardData) },
    [cardData]
  );

  const isWorking = useMemo(
    () => {
      return compose(
        ifElse(
          isNil,
          F,
          identity
        ),
        path(['isWorking'])
      )(cardData)
    }, [cardData]
  )

  const onDelete = () => {
    props.handleDeleteBusinessCard(props.department, props.cardData);
  };

  const confirmOnDelete = async (e) => {
    e.preventDefault();
    const name = cardData.lastName ? cardData.firstName + ' ' + cardData.lastName : cardData.firstName;
    const result = await ConfirmDialog({
      title: (<>{translate('customers.top.popup.title-delete')}</>),
      message: translate("messages.WAR_COM_0001", { itemName: name }),
      confirmText: translate('customers.top.popup.btn-delete'),
      confirmClass: "button-red",
      cancelText: translate('customers.top.popup.btn-cancel'),
      cancelClass: "button-cancel"
    });
    if (result) {
      onDelete()
    }
  }

  const onMouseOver = () => {
    if (businessCardRef.current) clearTimeout(businessCardRef.current);
    if (!isMouseOver) setIsMouseOver(true);
  };

  const onMouseOut = () => {
    businessCardRef.current = setTimeout(() => {
      setIsMouseOver(false);
    }, 100);
  };
  return (
    <div className="card-image">
      <div ref={businessCardRef}
        className={!isWorking ? 'img disable' : isMouseOver ? 'img active' : 'img'}
        onMouseOver={onMouseOver} onMouseOut={onMouseOut}
        onClick={(e) => isViewAsModal(props.viewType) && !isMouseOnRef(buttonCloseRef, e) && props.openBusinessCardDetailModal(cardData?.businessCardId)}
      >
        {/* image business card */}
        {imgCard ? (
          <img className="img" src={imgCard.replace('"', '')} alt="" />
        ) : (
            <div className="item">
              <div className="mt-2">
                <div className="font-size-8 ml-2">{prop('companyName', cardData)}</div>
                <div className="font-size-8 ml-2">{prop('departmentName', cardData)}</div>
                <div className="font-size-8 ml-2">{prop('position', cardData)}</div>
                <div className="font-size-8 ml-2">
                  {prop('firstName', cardData)}
                  {prop('lastName', cardData)}
                </div>
              </div>
            </div>
          )}
        {isViewAsModal(props.viewType) && isMouseOver && (
          <button ref={buttonCloseRef} className="close z-index-99" onClick={confirmOnDelete}>
            ×
          </button>
        )}
        {isMouseOver && (
          <div ref={tooltipBusinessRef}>
            <TooltipBusinessCardDetail
              cardData={cardData}
              viewType={props.viewType}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = null;

const mapDispatchToProps = {
  handleDeleteBusinessCard,
  openBusinessCardDetailModal,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessCardImage);
