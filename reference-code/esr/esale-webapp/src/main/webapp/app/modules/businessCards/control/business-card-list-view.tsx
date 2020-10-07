import React, { useEffect, useState, useRef } from "react";
import { translate } from "react-jhipster";
import useEventListener from 'app/shared/util/use-event-listener';
import { SORT_VIEW, ORDER_BY_VIEW, SCALE } from 'app/modules/businessCards/constants';
import BusinessCardViewItem from './business-card-view-item';
import _ from 'lodash';
import RowDragLayer from 'app/shared/layout/dynamic-form/list/control/row-drag-layer';
import { DND_ITEM_TYPE } from 'app/shared/layout/dynamic-form/constants';
export interface IBusinessCardListViewView {
  /**
   * list record
   */
  businessCardList: any[];
  /**
   * list record checked
   */
  businessCardListChecked;
  /**
   * action handle search
   */
  handleSearchListView;
  setOrderView;
  onDragRow?: (src, target) => void; // callback when user drag row
  renderSelectionBox?: any;
  resetScreen?;
  businessCardListActive?
  handleResetScreen?;
}

/**
 * component for show list business card image
 * @param props 
 */
const BusinessCardListView = (props: IBusinessCardListViewView) => {

  const [list, setList] = useState([]);
  const toolTipRef = useRef(null);
  const [isShowSortView, setIsShowSortView] = useState(false);
  const [sort, setSort] = useState(SORT_VIEW.DESC);
  const [orderByView, setOrderByView] = useState(ORDER_BY_VIEW.LAST_CONTACT_DATE);

  const [scale, setScale] = useState(SCALE.MIN_VALUE_SCALE);
  const [widthItem, setWidthItem] = useState("25%");
  const [heightItem, setHeightItem] = useState("182px");
  const networkMapParentRef = useRef(null);
  const networkMapRef = useRef(null);
  const [firstPick, setFirstPick] = useState(-1);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [mouseDown, setMouseDown] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [appendMode, setAppendMode] = useState(false);

  const { businessCardList } = props;
  businessCardList.forEach((x, idx) => {
    x.idx = idx
  })
  /**
   * set list checked when check or uncheck an item
   */
  useEffect(() => {
    props.businessCardListChecked(list);
  }, [list]);


  useEffect(() => {
    if (props.resetScreen) {
      setList([]);
      props.handleResetScreen();
    }
  }, [props.resetScreen])

  useEffect(() => {
    setList([]);
  }, [props.businessCardListActive])

  /**
   * reload list record when change order field or sort type
   */
  useEffect(() => {
    if (sort === 0 || orderByView === 0) return;
    let sortType;
    let orderByType;
    if (sort === SORT_VIEW.ASC) {
      sortType = "asc"
    } else {
      sortType = "desc"
    }
    switch (orderByView) {
      case ORDER_BY_VIEW.BUSINESS_CARD_NAME:
        orderByType = ["first_name", "last_name"];
        break;
      case ORDER_BY_VIEW.POSITION:
        orderByType = "position"
        break;
      case ORDER_BY_VIEW.RECEIVER:
        // orderByType = "receiver"
        break;
      case ORDER_BY_VIEW.RECEIVER_NUMBER:
        // orderByType = "receiver_number"
        break;
      case ORDER_BY_VIEW.RECEIVE_DATE:
        // orderByType = "receive_date"
        break;
      case ORDER_BY_VIEW.UPDATED_DATE:
        orderByType = "updated_date"
        break;
      case ORDER_BY_VIEW.LAST_CONTACT_DATE:
        orderByType = "last_contact_date"
        break;
      default:
        break;
    }
    if (_.isArray(orderByType)) {
      const order = [];
      orderByType.forEach(item => {
        order.push({ isNested: false, key: item, value: sortType, isDefault: "true" })
      })
      props.setOrderView(order);
      props.handleSearchListView(order);
      return;
    }
    if (orderByType) {
      const order = [{ isNested: false, key: orderByType, value: sortType, isDefault: "true" }]
      props.setOrderView(order);
      props.handleSearchListView(order);
    }

  }, [sort, orderByView]);

  /**
   * close div sort view
   * @param e event click
   */
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

  /**
   * reset list checked records when click an item
   * @param event 
   * @param id id of record
   */
  const keydownHandler = (event, id, idx) => {
    if (event.ctrlKey) {
      if (list.includes(id)) {
        const lst = list.filter(x => x !== id)
        setList(lst)
      } else {
        setList([...list, id])
      }
      setFirstPick(idx);
    } else if (event.shiftKey) {
      if (firstPick < 0) {
        setFirstPick(idx);
        setList([id]);
      } else {
        if (firstPick === idx) {
          setList([id]);
        } else if (firstPick < idx) {
          const rs = businessCardList.filter(x => x.idx >= firstPick && x.idx <= idx)
          setList(rs.map(y => y.business_card_id));
        } else {
          const rs = businessCardList.filter(x => x.idx <= firstPick && x.idx >= idx)
          setList(rs.map(y => y.business_card_id))
        }
      }
    } else {
      if (list.length <= 1 && list.includes(id)) {
        setFirstPick(-1);
        setList([])
      } else {
        setFirstPick(idx);
        setList([id]);
      }
    }

  }

  /**
   * click sort action
   */
  const btnSort = () => {
    setIsShowSortView(!isShowSortView)
  }

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
    const src = '../../../content/images/ic-sidebar-business-card.svg';
    const serviceStr = translate('common.business-card');
    return (
      <div className="list-table pt-2 images-group-middle position-absolute h-100 w83" >
        <div className="position-relative h-100">
          <div className="align-center images-group-content">
            <img className="images-group-16" src={src} alt="" />
            <div>{translate('messages.INF_COM_0020', { 0: serviceStr })}</div>
          </div>
        </div>
      </div>
    )
  }

  const handleOnDragRow = (src, target) => {
    if (_.isArray(list) && list.length > 0) {
      const listBusinessCard = []
      list.forEach(e => listBusinessCard.push({ "business_card_id": e }))
      props.onDragRow(listBusinessCard, target)
    } else {
      props.onDragRow(src, target)
    }
  }

  /**
   * Detect 2D box intersection
   */
  const boxIntersects = (boxA, boxB, bodyCard) => {
    if (!boxA || !boxB || !bodyCard) return false;
    if ((boxA.left - bodyCard.offsetLeft) <= (boxB.left + boxB.width)
      && (boxA.left - bodyCard.offsetLeft + boxA.width) >= boxB.left
      && (boxA.top - bodyCard.offsetTop) <= (boxB.top - bodyCard.scrollTop + boxB.height)
      && (boxA.top - bodyCard.offsetTop + boxA.height) >= (boxB.top - bodyCard.scrollTop)) {
      return true;
    }
    return false;
  }

  /**
   * Updates the selected items based on the
   * collisions with selectionBox
   */
  const updateCollidingChildren = (selBox) => {
    if (!networkMapRef.current || !networkMapRef.current.childNodes) {
      return;
    }

    const bodyCard = document.getElementById('bodyCard');
    let childs = [];
    if (appendMode) {
      childs = [...list];
    }
    _.each(networkMapRef.current.childNodes, (node) => {
      if (node.id.indexOf('cardId_') === -1) {
        return;
      }
      const id = parseInt(node.id.split('_')[1], 10);
      const tmpBox = {
        top: node.offsetTop + 1,
        left: node.offsetLeft + 15,
        width: node.clientWidth - 30,
        height: node.clientHeight - 32
      };
      if (boxIntersects(selBox, tmpBox, bodyCard)) {
        if (!childs.includes(id)) childs.push(id);
      }
    });
    setSelectedChildren(childs);
  }

  useEffect(() => {
    let html;
    if (mouseDown && !_.isNull(startPoint)) {
      html = (
        <div className='selection-border' style={selectionBox} />
      );
      updateCollidingChildren(selectionBox);
    }
    props.renderSelectionBox(html);
  }, [selectionBox]);

  /**
   * Calculate selection box dimensions
   */
  const calculateSelectionBox = (sPoint, ePoint) => {
    if (!mouseDown || _.isNull(ePoint) || _.isNull(sPoint)) {
      return null;
    }

    const sidebarMenu = document.getElementsByClassName('sidebar-menu-outer');
    const _left = Math.min(sPoint.x, ePoint.x) - sidebarMenu.item(0).clientWidth;
    const _top = Math.min(sPoint.y, ePoint.y);
    const _width = Math.abs(sPoint.x - ePoint.x);
    const _height = Math.abs(sPoint.y - ePoint.y);
    return {
      left: _left,
      top: _top,
      width: _width,
      height: _height,
      zIndex: 99999,
      position: 'absolute',
      cursor: 'default',
      willChange: 'transform',
      transform: 'translateZ(0px)',
      background: 'none',
      border: '1px dashed grey'
    };
  }

  const onMouseMoveOnDocument = (e) => {
    e.preventDefault();
  }

  /**
   * On document element mouse move
   */
  const onMouseMoveOnCard = (e) => {
    e.preventDefault();
    if (mouseDown) {
      const _endPoint = {
        x: e.pageX,
        y: e.pageY
      };
      setSelectionBox(calculateSelectionBox(startPoint, _endPoint));
    }
  }

  const removeEvent = () => {
    document.removeEventListener('mousemove', onMouseMoveOnDocument);
    networkMapParentRef.current.removeEventListener('mousemove', onMouseMoveOnCard);
  }

  /**
   * On document element mouse up
   */
  const onMouseUpOnCard = (e) => {
    document.removeEventListener('mousemove', onMouseMoveOnDocument);
    networkMapParentRef.current.removeEventListener('mousemove', onMouseMoveOnCard);
    document.removeEventListener('mouseup', onMouseUpOnCard);
    setMouseDown(false);
  }

  const addEvent = () => {
    document.addEventListener('mousemove', onMouseMoveOnDocument);
    networkMapParentRef.current.addEventListener('mousemove', onMouseMoveOnCard);
    document.addEventListener('mouseup', onMouseUpOnCard);
  }

  useEffect(() => {
    if (!mouseDown) {
      if (selectedChildren && selectedChildren.length > 0) {
        let lst = [...list];
        if (!lst || !appendMode) {
          lst = [];
        }
        const lstUnique = Array.from(new Set(lst.concat(selectedChildren)));
        setList(lstUnique);
        setSelectedChildren([]);
        setStartPoint(null);
        setSelectionBox(null);
      }
      document.removeEventListener('mouseup', onMouseUpOnCard);
      removeEvent();
    } else {
      setSelectedChildren([]);
      setSelectionBox(null);
      addEvent();
    }
  }, [mouseDown]);

  /**
   * On root element mouse down
   */
  const onMouseDownOnCard = (e) => {
    const { target } = e;
    if (target.tagName === 'IMG' || target.tagName === 'INPUT' || e.button === 2 || e.nativeEvent.which === 2 || toolTipRef.current) {
      return e;
    }
    let _appendMode = false;
    if (e.ctrlKey || e.altKey || e.shiftKey) {
      _appendMode = true;
    }
    const _startPoint = {
      x: e.pageX,
      y: e.pageY
    };

    setMouseDown(true);
    setStartPoint(_startPoint);
    setAppendMode(_appendMode);
    setSelectionBox(calculateSelectionBox(_startPoint, _startPoint));
  }

  const convertSourceRowToData = (sourceRowData: any[]): any[] => {
    const lstData = []
    if (_.isArray(sourceRowData) && sourceRowData.length > 0) {
      sourceRowData.forEach(e => lstData.push({
        isChecked: true,
        businessCardId: e
      }))
    }
    return lstData
  }

  return (
    <>
      {businessCardList && businessCardList.length <= 0 && renderContentEmpty()}
      {businessCardList && businessCardList.length > 0 &&
        <>
          <div ref={networkMapParentRef} onMouseDown={onMouseDownOnCard}>
            <div className="filter-top">
              <div className="time-bar mr-2">
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
              <div className="button-pull-down-parent">
                <a title="" className={"button-pull-down" + (isShowSortView ? " active" : "")} onClick={btnSort}>
                  {translate("businesscards.list-view.sort.label")}
                </a>
                {isShowSortView &&
                  <div className="select-box card select-box-card" ref={toolTipRef}>
                    <div className="wrap-check-radio unset-height">
                      <p className="radio-item" onClick={() => { setSort(SORT_VIEW.ASC); setIsShowSortView(false) }}>
                        <input type="radio" id="radio111" name="name-radio3" value={SORT_VIEW.ASC} checked={sort === SORT_VIEW.ASC} />
                        <label>{translate("businesscards.list-view.sort.asc")}</label>
                      </p>
                      <p className="radio-item" onClick={() => { setSort(SORT_VIEW.DESC); setIsShowSortView(false) }}>
                        <input type="radio" id="radio112" name="name-radio3" value={SORT_VIEW.DESC} checked={sort === SORT_VIEW.DESC} />
                        <label>{translate("businesscards.list-view.sort.desc")}</label>
                      </p>
                    </div>
                    <div className="wrap-check-radio unset-height">
                      <p className="radio-item" onClick={() => setOrderByView(ORDER_BY_VIEW.BUSINESS_CARD_NAME)}>
                        <input type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.BUSINESS_CARD_NAME} />
                        <label>{translate("businesscards.list-view.sort.name")}</label>
                      </p>
                      <p className="radio-item w100" onClick={() => { setOrderByView(ORDER_BY_VIEW.POSITION); setIsShowSortView(false) }}>
                        <input type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.POSITION} />
                        <label>{translate("businesscards.list-view.sort.position")}</label>
                      </p>
                      <p className="radio-item disable w100">
                        <input disabled type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.RECEIVER} />
                        <label>{translate("businesscards.list-view.sort.receiver")}</label>
                      </p>
                      <p className="radio-item disable w100">
                        <input disabled type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.RECEIVER_NUMBER} />
                        <label>{translate("businesscards.list-view.sort.receiver-number")}</label>
                      </p>
                      <p className="radio-item disable w100">
                        <input disabled type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.RECEIVE_DATE} />
                        <label>{translate("businesscards.list-view.sort.receive-date")}</label>
                      </p>
                      <p className="radio-item w100" onClick={() => { setOrderByView(ORDER_BY_VIEW.UPDATED_DATE); setIsShowSortView(false) }}>
                        <input type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.UPDATED_DATE} />
                        <label>{translate("businesscards.list-view.sort.updated-date")}</label>
                      </p>
                      <p className="radio-item w100" onClick={() => { setOrderByView(ORDER_BY_VIEW.LAST_CONTACT_DATE); setIsShowSortView(false) }}>
                        <input type="radio" id="radio113" name="name-radio4" checked={orderByView === ORDER_BY_VIEW.LAST_CONTACT_DATE} />
                        <label>{translate("businesscards.list-view.sort.last-contact-date")}</label>
                      </p>
                    </div>
                  </div>
                }
              </div>
            </div>
            <div id={'bodyCard'} className="list-card style-3">
              <div className="row" ref={networkMapRef}>
                {props.businessCardList.map((item, idx) => (
                  <div id={'cardId_' + item.business_card_id} key={idx} style={{ width: widthItem, padding: "0px 15px" }}>
                    <div id={'cardItem_' + item.business_card_id}
                      className={"item-card" + (list.includes(item.business_card_id) ? " active" : "")}
                      style={{ height: heightItem }}>
                      <BusinessCardViewItem
                        list={list}
                        widthItem={widthItem}
                        heightItem={heightItem}
                        keydownHandler={keydownHandler}
                        sourceBusinessCardItem={item}
                        key={idx}
                        onDragRow={handleOnDragRow}
                      />
                      {list.includes(item.business_card_id) &&
                        <label className="icon-check">
                          <input type="checkbox" checked={true} name="" onChange={() => { }} /><i></i>
                        </label>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <RowDragLayer recordCheckList={convertSourceRowToData(list)} itemTypeDrag={DND_ITEM_TYPE.DYNAMIC_LIST_ROW} hasTargetDrag={true} />
        </>}
    </>
  );
}

export default BusinessCardListView
