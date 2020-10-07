import React, { useState, useRef } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash';
import { translate } from 'react-jhipster';
import {
  handleShowDetail
} from 'app/modules/activity/list/activity-list-reducer';
import ProductTradingItemList from './product-item-list';
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';

type ITooltipProductTradingProps = StateProps & DispatchProps & {
  data: any[],
  idCaller: any,
  fieldOrderInRow?: any
}

/**
 * component for show list business card and detail
 * @param props
 */
const TooltipProductTrading = (props: ITooltipProductTradingProps) => {
  const [showTipProduct, setShowTipProduct] = useState<boolean>(false);
  const productRef = useRef(null);

  const onClickDetailPopup = (objectId, type) => {
    if (objectId) {
      props.handleShowDetail(objectId, type, props.idCaller);
    }
  }


  return <>
    {props.data?.length === 1 &&
      <>
        <span onClick={() => onClickDetailPopup(props.data[0].productId, TYPE_DETAIL_MODAL.PRODUCT)}>{props.data[0].productTradingName || props.data[0].productName}</span>
      </>
    }
    {props.data?.length > 1 &&
      <>
        <span onClick={() => onClickDetailPopup(props.data[0].productId, TYPE_DETAIL_MODAL.PRODUCT)}>{props.data[0].productTradingName || props.data[0].productName}</span>
        <a ref={productRef} onMouseLeave={() => setShowTipProduct(false)} onMouseEnter={() => setShowTipProduct(true)} className="text-blue show-list-item-activity">&nbsp;{translate('activity.list.body.product-amount', { amount: props.data?.length - 1 })}&nbsp;
              {showTipProduct &&
            <div className={`form-group width-450 position-absolute ${props.fieldOrderInRow && props.fieldOrderInRow === 1 ? 'activity-right-0' : 'activity-left-0' }`}>
              <div className="drop-down drop-down2 ">
                <ul className="dropdown-item dropdown-item-v2 height-unset overflow-unset">
                  {
                    props.data.map((e, idx) => {
                      if (idx !== 0) {
                        return <ProductTradingItemList onClick={() => onClickDetailPopup(e.productId, TYPE_DETAIL_MODAL.PRODUCT)}
                          productTrading={e} key={`nextSchedule_productTading_${e.productTradingId}_${idx}`} />
                      }
                    })
                  }
                </ul>
              </div>
            </div>
          }
        </a>
      </>
    }
  </>
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
  handleShowDetail
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TooltipProductTrading);
