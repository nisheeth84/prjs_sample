import React, { useEffect, useState, useRef } from "react";
import { translate } from "react-jhipster";
// import { getJsonBName } from 'app/modules/products/utils'
import { PRODUCT_SPECIAL_FIELD_NAMES, SCALE, SORT_VIEW, ORDER_BY_VIEW, SEARCH_MODE, DND_PRODUCT_VIEW_TYPE } from '../constants';
import useEventListener from "app/shared/util/use-event-listener";
import Popover from 'app/shared/layout/common/Popover';
import { getFieldLabel } from 'app/shared/util/string-utils';
// import { DragSource, DragSourceConnector, DragSourceMonitor } from 'react-dnd';
import ProductCardView from './product-card-view'
import _ from 'lodash';
import ColumnDragLayer from '../custom-common/column-drag-layer';
import RowDragLayer from 'app/shared/layout/dynamic-form/list/control/row-drag-layer';
import { DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
import {DragLayer} from 'app/modules/setting/components/DragLayer'
export interface IProductListView {
  data: any[];
  productListChecked;
  onOpenPopupProductDetail;
  customFieldInfos;
  setListProductChecked;
  handleSearchProductView
  onDragProductView? : (src, target) => void
}

const ProductListView = (props: IProductListView) => {
  const [list, setList] = useState([]);
  const [firstPick, setFirstPick] = useState(-1);
  const [fieldUnitPrice, setFieldUnitPrice] = useState("");
  const [fieldProductId, setFieldProductId] = useState("");
  const [currencyUnit, setCurrencyUnit] = useState("");
  const [fieldCategoryName, setFieldCategoryName] = useState("");
  const [fieldProductNameId, setFieldProductNameId] = useState(null);
  const [sort, setSort] = useState(SORT_VIEW.ASC);
  const [orderByView, setOrderByView] = useState(ORDER_BY_VIEW.PRODUCT_CODE);
  const [isShowSortView, setIsShowSortView] = useState(false);

  const [scale, setScale] = useState(SCALE.MIN_VALUE_SCALE);
  const [widthItem, setWidthItem] = useState("25%");
  const [heightItem, setHeightItem] = useState("182px");
  const networkMapRef = useRef(null);
  const toolTipRef = useRef(null);

  const { data } = props;
  const format = (str) => {
    const newStr = str.split(".").join(",");
    return newStr
  }
  data.forEach((x, idx) => {
    x.idx = idx
  })

  useEffect(() => {
    if (sort === 0 || orderByView === 0) return;

    let sortType;
    let orderByType;
    if (sort === SORT_VIEW.ASC) {
      sortType = "ASC"
    } else {
      sortType = "DESC"
    }
    switch (orderByView) {
      case ORDER_BY_VIEW.PRODUCT_CODE:
        orderByType = "product_id"
        break;
      case ORDER_BY_VIEW.PRODUCT_NAME:
        orderByType = "product_name"
        break;
      case ORDER_BY_VIEW.UNIT_PRICE:
        orderByType = "unit_price"
        break;
      case ORDER_BY_VIEW.CATEGORY_NAME:
        orderByType = PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId
        break;
      default:
        break;
    }
    const searchType = props.customFieldInfos.find(x => x.fieldName === orderByType).fieldType.toString();
    const isDefault = props.customFieldInfos.find(x => x.fieldName === orderByType).isDefault.toString();
    const order = [{ key: orderByType, value: sortType, fieldType: searchType, isDefault, isNested: false }];
    props.handleSearchProductView(order);
  }, [sort, orderByView]);

  useEffect(() => {
    props.productListChecked(list);
  }, [list]);

  useEffect(() => {
    if (props.customFieldInfos && props.customFieldInfos.length > 0) {
      const fieldUnitPrice2 = props.customFieldInfos.find(x => x.fieldName === "unit_price")
      if (fieldUnitPrice2) {
        setFieldUnitPrice(getFieldLabel(fieldUnitPrice2, "fieldLabel"))
        setCurrencyUnit(fieldUnitPrice2.currencyUnit)
      }
      const fieldProductId2 = props.customFieldInfos.find(x => x.fieldName === "product_id")
      if (fieldProductId2) {
        setFieldProductId(getFieldLabel(fieldProductId2, 'fieldLabel'))
      }
      const fieldCategoryName2 = props.customFieldInfos.find(x => x.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productCategoryId)
      if (fieldCategoryName2) {
        setFieldCategoryName(getFieldLabel(fieldCategoryName2, "fieldLabel"))
      }
      const fieldName = props.customFieldInfos.find(x => x.fieldName === "product_name")
      if (fieldName) {
        setFieldProductNameId(fieldName.fieldId)
      }

    }
  }, [props.customFieldInfos]);

  const btnSort = () => {
    setIsShowSortView(!isShowSortView)
  }

  const keydownHandler = (event, id, idx) => {
    if (event.ctrlKey) {
      if (list.includes(id)) {
        const lst = list.filter(x => x !== id)
        setList(lst)
        props.setListProductChecked(data.filter(x => lst.includes(x.product_id)));
      } else {
        setList([...list, id])
        props.setListProductChecked(data.filter(x => (list.includes(x.product_id) || x.product_id === id)));
      }
      setFirstPick(idx);
    } else if (event.shiftKey) {
      if (firstPick < 0) {
        setFirstPick(idx);
        setList([id])
        props.setListProductChecked(data.filter(x => x.product_id === id));
      } else {
        if (firstPick === idx) {
          setList([id])
          props.setListProductChecked(data.filter(x => x.product_id === id));
        } else if (firstPick < idx) {
          const rs = data.filter(x => x.idx >= firstPick && x.idx <= idx)
          setList(rs.map(y => y.product_id))
          props.setListProductChecked(rs)
        } else {
          const rs = data.filter(x => x.idx <= firstPick && x.idx >= idx)
          setList(rs.map(y => y.product_id))
          props.setListProductChecked(rs)
        }
      }
    } else {
      if (list.length <= 1 && list.includes(id)) {
        setFirstPick(-1);
        setList([])
        props.setListProductChecked([]);
      } else {
        setFirstPick(idx);
        setList([id])
        props.setListProductChecked(data.filter(x => x.product_id === id));
      }
    }

  }

  const handleMouseDownListView = (e) => {
    if (!toolTipRef || !toolTipRef.current) {
      return;
    }
    if (toolTipRef.current && toolTipRef.current.contains(e.target)) {
      return;
    }
    setIsShowSortView(false);
  }
  useEventListener('mousedown', handleMouseDownListView);

  const changeScalePreviewNetwork = (isScaleUp: boolean) => {
    const scaleNew = isScaleUp ? scale + SCALE.SCALE_CHANGE_RANGE : scale - SCALE.SCALE_CHANGE_RANGE;
    if (scaleNew < SCALE.MIN_VALUE_SCALE || scaleNew > SCALE.MAX_VALUE_SCALE) {
      return;
    }
    setScale(scaleNew);
    setWidthItem(25 + scaleNew + "%")
    setHeightItem(182 * (scaleNew + 25) / 25 + "px")
  };

  const handleChangeScale = e => {
    const scaleNew = parseFloat(e.target.value);
    setScale(scaleNew)
    setWidthItem(25 + scaleNew + "%")
    setHeightItem(182 * (scaleNew + 25) / 25 + "px")
  }

  const renderContentEmpty = () => {
    const src = '../../../content/images/ic-sidebar-product.svg';
    const serviceStr = translate('common.products');
    return (
      <div className="list-table pt-2 images-group-middle position-absolute h-100 w83">
        <div className="position-relative h-100">
          <div className="align-center images-group-content">
            <img className="images-group-16" src={src} alt="" />
            <div>{translate('messages.INF_COM_0019', { 0: serviceStr })}</div>
          </div>
        </div>
      </div>
    )
  }

  const onDragCard = (src, target) => {
    if(_.isArray(list) && list.length > 0){
    const listProduct = []
    list.forEach(e => listProduct.push({productId : e}))
      props.onDragProductView(listProduct, target)
    }else{
     props.onDragProductView(src, target)
    }
  }

  const convertSourceRowToData = (sourceRowData:any[]) : any[] => {
    const lstData = []
    if(_.isArray(sourceRowData) && sourceRowData.length > 0){
     sourceRowData.forEach(e => lstData.push({
      isChecked: true,
      productId: e
    }))
    }
    return lstData
  }

  return (
    <>
      {data && data.length <= 0 && renderContentEmpty()}
      {data && data.length > 0 &&
        <>
          <div className="sort-bar-wrap position-relative">
            <div className="time-bar">
              <span
                className={scale <= SCALE.MIN_VALUE_SCALE ? 'icon-primary reduction disable' : 'icon-primary reduction'}
                onClick={e => changeScalePreviewNetwork(false)}
              />
              <div className="slidecontainer">
                <input type="range"
                  min={SCALE.MIN_VALUE_SCALE}
                  max={SCALE.MAX_VALUE_SCALE}
                  step={SCALE.SCALE_CHANGE_RANGE}
                  value={scale}
                  onChange={e => handleChangeScale(e)} />
              </div>
              <span
                className={scale >= SCALE.MAX_VALUE_SCALE ? 'icon-primary increase disable' : 'icon-primary increase'}
                onClick={e => changeScalePreviewNetwork(true)}
              />
            </div>
            <a title="" className={"button-pull-down" + (isShowSortView ? " active" : "")} onClick={btnSort}>{translate('products.list-view.sort.label')}</a>
            {isShowSortView &&
              <div className="select-box product" ref={toolTipRef}>

                <div className="wrap-check-radio" >
                  <p className="radio-item" onClick={() => setSort(SORT_VIEW.ASC)} >
                    <input type="radio" id="radio111" name="a" value={SORT_VIEW.ASC} checked={sort === SORT_VIEW.ASC} />
                    <label >{translate('products.list-view.sort.asc')}</label>
                  </p>
                  <p className="radio-item" onClick={() => setSort(SORT_VIEW.DESC)}>
                    <input type="radio" id="radio112" name="a" value={SORT_VIEW.DESC} checked={sort === SORT_VIEW.DESC} />
                    <label >{translate('products.list-view.sort.desc')}</label>
                  </p>
                </div>


                <div className="wrap-check-radio" >
                  <p className="radio-item" onClick={() => setOrderByView(ORDER_BY_VIEW.PRODUCT_CODE)}>
                    <input type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.PRODUCT_CODE}></input>
                    <label >{translate('products.list-view.sort.product-code')}</label>
                  </p>
                  <p className="radio-item" onClick={() => setOrderByView(ORDER_BY_VIEW.PRODUCT_NAME)}>
                    <input type="radio" id="radio114" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.PRODUCT_NAME}></input>
                    <label >{translate('products.list-view.sort.product-name')}</label>
                  </p>
                  <p className="radio-item" onClick={() => setOrderByView(ORDER_BY_VIEW.UNIT_PRICE)}>
                    <input type="radio" id="radio115" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.UNIT_PRICE}></input>
                    <label >{translate('products.list-view.sort.unit-price')}</label>
                  </p>
                  <p className="radio-item" onClick={() => setOrderByView(ORDER_BY_VIEW.CATEGORY_NAME)}>
                    <input type="radio" id="radio116" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.CATEGORY_NAME}></input>
                    <label >{translate('products.list-view.sort.product-category')}</label>
                  </p>
                </div>
              </div>
            }
          </div>
          <div className="product-item-detail-wrap style-3">
            <div className="row" ref={networkMapRef}>
              {data.map((item, idx) => (
                <ProductCardView
                key={idx}
                item={item}
                widthItem={widthItem}
                heightItem={heightItem}
                fieldUnitPrice={fieldUnitPrice}
                fieldProductId={fieldProductId}
                fieldProductNameId={fieldProductNameId}
                fieldCategoryName={fieldCategoryName}
                list={list}
                currencyUnit={currencyUnit}
                onOpenPopupProductDetail={props.onOpenPopupProductDetail}
                keydownHandler={keydownHandler}
                onDragProductView={onDragCard}
                ></ProductCardView>

              ))}
             </div>
          </div>
          <RowDragLayer recordCheckList={convertSourceRowToData(list)} itemTypeDrag={DND_ITEM_TYPE.DYNAMIC_LIST_ROW} hasTargetDrag={true} />
        </>}
    </>
  );
}

export default ProductListView
