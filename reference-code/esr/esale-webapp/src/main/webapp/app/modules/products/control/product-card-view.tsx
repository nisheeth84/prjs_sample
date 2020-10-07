import React, { useState, useEffect } from 'react';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector, ConnectDragPreview } from 'react-dnd';
import { MENU_TYPE, DND_CATEGORY_TYPE, DND_PRODUCT_VIEW_TYPE } from '../constants';
import { translate } from 'react-jhipster';
// import { getJsonBName } from 'app/modules/products/utils';
import _ from 'lodash';
import Popover from 'app/shared/layout/common/Popover';
import { getFieldLabel } from 'app/shared/util/string-utils';
import { DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { getEmptyImage } from 'react-dnd-html5-backend';
import useEventListener from 'app/shared/util/use-event-listener';
import { closest } from 'app/shared/util/dom-element';

const showAllProduct = () => {
  const parentEls = Array.from(document.querySelectorAll('.product-item-detail'))
  for (const parentEl of parentEls) {
    (parentEl as any).style.visibility = "initial";
  }
}

export interface ICategoryCardProps {
  // sourceProduct;
  onDragProductView?: (src, target) => void;
  onOpenPopupProductDetail: (productId, fieldProductNameId) => void
  keydownHandler: (event, productId, idx) => void
  item: any;
  widthItem;
  heightItem;
  fieldUnitPrice;
  fieldProductId;
  fieldProductNameId;
  fieldCategoryName;
  list,
  currencyUnit,
  connectDragSource: ConnectDragSource;
  connectDragPreview: ConnectDragPreview;
  isDragging
}

const ProductCardView: React.FC<ICategoryCardProps> = (props, ref) => {
  const { list, item, widthItem, currencyUnit, heightItem, fieldUnitPrice, fieldProductId, fieldProductNameId, fieldCategoryName } = props

  const format = (str) => {
    const newStr = str.split(".").join(",");
    return newStr
  }

  useEffect(() => {
    props.connectDragPreview(getEmptyImage(), { captureDraggingState: false });
  }, []);

  // useEventListener('mousedown', event => {
  //   const parentEl = closest(event.target, '.product-item-detail')
  //   if (parentEl) {
  //     parentEl.style.visibility = "hidden";
  //   }
  // });

  // useEventListener('mouseup', showAllProduct);

  return props.connectDragSource(
    <div key={item.product_id} style={{ width: widthItem, padding: "0px 15px" }} onClick={() => {
      props.keydownHandler(event, item.product_id, item.idx)
    }
    }>
      <div className={"product-item-detail no-copy" + (list.includes(item.product_id) ? " active" : "")}>
        {item.product_image_path ? <div className="image_product" style={{ height: heightItem }}><img className="product-view" src={item.product_image_path} alt="" title="" /></div>
          : <div className="image_product no_image_product" style={{ height: heightItem }}><img className="product-view" src="../../content/images/noimage.png" alt="" title="" /></div>}
        <div className="content nowrap">
          <Popover x={-20} y={50}>
            <a className="name-product" onClick={() => { props.onOpenPopupProductDetail(item.product_id, fieldProductNameId) }}>{item.product_name}</a>
          </Popover>
          <p>{fieldUnitPrice}：{item.unit_price ? format(item.unit_price.toLocaleString(navigator.language, { minimumFractionDigits: 0 })) : "0"} {currencyUnit}</p>
          <p>{fieldProductId}：{item.product_id}</p>
          <Popover x={-20} y={50}>
            <span>{fieldCategoryName}：{getFieldLabel(item, "product_category_name")} </span>
          </Popover>
        </div>
      </div>

    </div>
  );
};

const dragSourceHOC = DragSource(
  DND_ITEM_TYPE.DYNAMIC_LIST_ROW,
  {
    beginDrag(props: ICategoryCardProps) {
      return { type: DND_CATEGORY_TYPE.CARD, sourceProduct: props.item };
    },
    endDrag(props: ICategoryCardProps, monitor: DragSourceMonitor) {
      showAllProduct()
      const dropResult = monitor.getDropResult();

      if (!dropResult) return;
      const item = monitor.getItem();
      props.onDragProductView([item.sourceProduct], dropResult.targetCategory);
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview()
  })
);


export default dragSourceHOC(ProductCardView);
