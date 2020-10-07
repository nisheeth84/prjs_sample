import React, { useState, useRef, useCallback, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { DragSourceMonitor, ConnectDragSource, DragSource, DragSourceConnector } from 'react-dnd';
import { DropTarget, ConnectDropTarget } from 'react-dnd';
import { MENU_TYPE, DND_CATEGORY_TYPE, DND_PRODUCT_VIEW_TYPE } from '../constants';
import { DND_ITEM_TYPE } from '../../../shared/layout/dynamic-form/constants';
import { translate } from 'react-jhipster';
// import { getJsonBName } from 'app/modules/products/utils';
import useEventListener from 'app/shared/util/use-event-listener';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import _ from 'lodash';
import styled from 'styled-components';
import Popover from 'app/shared/layout/common/Popover';
import { getFieldLabel } from 'app/shared/util/string-utils';

const DivLocationDropDrag = styled.div`
  padding-bottom: 0 !important;
  background: ${props => (props.isMiddle ? '#e9f0f7 !important' : 'inherit')};
  &:before {
    z-index: 1000;
    left: 10px;
    bottom: ${props => (props.isTop ? '35px' : props.isBottom ? '-4px' : 'inherit')};
    display: ${props => (props.isMiddle ? 'none' : 'block')};
  }
  &:after {
    z-index: 1000;
    left: 10px;
    bottom: ${props => (props.isBottom ? '0px' : props.isTop ? '40px' : 'inherit')};
    display: ${props => (props.isMiddle ? 'none' : 'block')};
  }
`;

const DivSubMenuCategory = styled.div`
  top: 35px ;
  right: -15px;
  left: unset !important;

`;

export interface ICategoryCardProps {
  sourceCategory: any;
  type: number;
  sidebarCurrentId?: (sidebarId: any) => void;
  handleDataFilter: (filters: any, id: any) => void;
  onDropCategory: (sourceCategory: any, targetCategory: any, hoverStatus: any) => void;
  // Collected Props
  isDragging: boolean;
  onShowCategoryChild?: (productCategoryId: any) => void;
  connectDragSource: ConnectDragSource;
  connectDropTarget: ConnectDropTarget;
  canDrop: boolean;
  isOver: boolean;
  localMenuData?: any;
  onOpenPopupCategoryEdit: (item: any) => void;
  handleDeleteCategory: (id: any) => void;
  onOpenPopupCategoryAddChild: (id: any) => void;
  setActiveCard: (type: any, id: any) => void;
  activeCard: any;
  isAdmin: boolean;
  filterConditionList: any[];
  widthCard: any
}

const CategoryCard: React.FC<ICategoryCardProps> = (props, ref) => {
  const [isTop, setIsTop] = useState(false);
  const [isMiddle, setIsMiddle] = useState(false);
  const [isBottom, setIsBottom] = useState(false);

  const [isShowSubMenu, setIsShowSubMenu] = useState(false);
  const refEdit = useRef(null);
  const refDelete = useRef(null);
  const refAddChild = useRef(null);

  const wrapperELRef = useRef(null);

  const logXY = useCallback(
    _.throttle((x: any, y: any, width: number, height: number) => {
      const isMouseTop = y < height / 3;
      const isMouseMiddle = y >= height / 3 && y <= (height * 2) / 3;
      const isMouseBottom = y > (height * 2) / 3;
      setIsTop(isMouseTop);
      setIsMiddle(isMouseMiddle);
      setIsBottom(isMouseBottom);
    }, 1000 / 60),
    []
  );

  const deleteByIcon = useCallback(
    async (categoryId, productCategoryName) => {
      const result = await ConfirmDialog({
        title: <>{translate('products.top.dialog.title-delete-products')}</>,
        message: translate('messages.WAR_COM_0001', { itemName: getFieldLabel({productCategoryName}, "productCategoryName") }),
        confirmText: translate('products.top.dialog.confirm-delete-products'),
        confirmClass: 'button-red',
        cancelText: translate('products.top.dialog.cancel-text'),
        cancelClass: 'button-cancel'
      });
      if (result) {
        props.handleDeleteCategory(categoryId);
      }
    },
    [props.handleDeleteCategory]
  );

  const onCategorySelected = useCallback(() => {
    let { productCategoryId } = props.sourceCategory;
    props.setActiveCard(MENU_TYPE.CATEGORY, productCategoryId);
    productCategoryId = productCategoryId != null ? productCategoryId.toString() : null;
    const filterList = props.filterConditionList.filter(item => item.targetId.toString() === productCategoryId);
    const filters = [];
    filterList.forEach((filter: { filterConditions: any[] }) => {
      filter.filterConditions.forEach((f: any) => filters.push(f));
    });
    props.handleDataFilter(filters, productCategoryId);
    props.sidebarCurrentId(productCategoryId);
  }, [props.sourceCategory, props.filterConditionList, props.setActiveCard, props.handleDataFilter, props.sidebarCurrentId]);

  const onShowCategoryChildThrottle = useCallback(
    _.debounce((productCategoryId: any) => {
      if (!props.onShowCategoryChild) return;
      props.onShowCategoryChild(productCategoryId);
    }, 1000),
    [props.onShowCategoryChild]
  );

  const handleMouseDown = useCallback(
    e => {
      if (!refEdit || !refEdit.current || !refDelete || !refDelete.current || !refAddChild || !refAddChild.current) {
        return;
      }
      if (
        (refEdit.current && refEdit.current.contains(e.target)) ||
        (refDelete.current && refDelete.current.contains(e.target)) ||
        (refAddChild.current && refAddChild.current.contains(e.target))
      ) {
        return;
      }
      setIsShowSubMenu(false);
    },
    [refEdit.current, refDelete.current, refAddChild.current, setIsShowSubMenu]
  );

  useEventListener('mousedown', handleMouseDown);

  useEffect(() => {
    if (isMiddle) {
      onShowCategoryChildThrottle(props.sourceCategory.productCategoryId);
    }
  }, [isMiddle]);

  /**
   * check active class if user click to category card
   * @param category
   */
  const activeClass = useMemo(() => {
    let name = 'd-flex';
    if (
      props.activeCard &&
      props.activeCard.cardId &&
      props.activeCard.cardId.toString() === props.sourceCategory.productCategoryId.toString()
    ) {
      name = 'd-flex active';
    }
    return name;
  }, [props.activeCard, props.sourceCategory]);

  const classNameDrag = useMemo(() => {
    let className = 'category ';
    if (props.isOver && props.canDrop && !props.isDragging) {
      className += ' location-drop-drag ';
    }
    return className;
  }, [props.isOver, props.canDrop, props.isDragging]);

  useImperativeHandle(ref, () => ({
    updateClientOffset(clientOffset) {
      if (!wrapperELRef.current) return;
      const bounds = wrapperELRef.current.getBoundingClientRect();
      logXY(clientOffset.x - bounds.left, clientOffset.y - bounds.top, bounds.width, bounds.height);
    },
    getHoverStatus() {
      return { isTop, isMiddle, isBottom };
    }
  }));

  const [subMenuWidth, setSubMenuWidth] = useState(0);
  const [subMenuHeight, setSubMenuHeight] = useState(0);
  const subMenuRef = useCallback((node) => {
    if (node !== null) {
      setSubMenuHeight(node.getBoundingClientRect().height);
      setSubMenuWidth(node.getBoundingClientRect().width);
    }
  }, []);
  // const subMenuRef = useRef(null)

  /**
   * Set position left, top for SubMenu
   */
  const setPosition = () => {
    const element = document.getElementById(`${props.sourceCategory.productCategoryId}_sidebar`);
    console.log({element, c:props.sourceCategory, subMenuWidth, subMenuHeight })
    let top = 0;
    let left = 0;
    if (element) {
      const elementBounding = element.getBoundingClientRect();

      const elementWithBottomSpace = window.innerHeight - elementBounding.top;
      top = elementWithBottomSpace < (subMenuHeight + 2.5 * elementBounding.height) ? -(subMenuHeight + 5) : (elementBounding.height - 5);
      left = window.pageXOffset - (subMenuWidth - 10);
    }
    return { left, top };
  }


  const SubMenuCategory = (item: { item: { productCategoryId: any; productCategoryName: any } }) => {
    return (
      <DivSubMenuCategory
        className="box-select-option version2"
        ref={subMenuRef}
        style={{top: setPosition().top}}
       >

        <ul className="text-left">
          <li ref={refEdit} onClick={event => {props.onOpenPopupCategoryEdit(item.item); event.preventDefault()}}>
            <a className="item" href="">
              {translate('products.category-card.submenu.edit-category')}
            </a>
          </li>
          <li ref={refDelete} onClick={event => {deleteByIcon(item.item.productCategoryId, item.item.productCategoryName); event.preventDefault()}}>
            <a className="item" href="">
              {translate('products.category-card.submenu.delete-category')}
            </a>
          </li>
          <li ref={refAddChild} onClick={event => {props.onOpenPopupCategoryAddChild(item.item.productCategoryId); event.preventDefault()}}>
            <a className="item" href="">
              {translate('products.category-card.submenu.add-category-child')}
            </a>
          </li>
        </ul>
      </DivSubMenuCategory>
    );
  };

  return props.connectDropTarget(
    props.connectDragSource(
      <div ref={wrapperELRef}>
        <DivLocationDropDrag className={[classNameDrag, activeClass]} isTop={isTop} isMiddle={isMiddle} isBottom={isBottom}>
          <a onClick={onCategorySelected} style={{width : props.widthCard - 100 - (props.sourceCategory.productCategoryLevel -1 )*10 }}>
            <Popover x={-20} y={50} >
              <span>{getFieldLabel(props.sourceCategory, "productCategoryName")}</span>
            </Popover>
          </a>
          <div className="more-option1" onClick={e => setIsShowSubMenu(!isShowSubMenu)}>
            {isShowSubMenu && <SubMenuCategory item={props.sourceCategory} />}
          </div>
        </DivLocationDropDrag>
      </div>
    )
  );
};

const dragSourceHOC = DragSource(
  DND_CATEGORY_TYPE.CARD,
  {
    beginDrag(props: ICategoryCardProps) {
      return { type: DND_CATEGORY_TYPE.CARD, sourceCategory: props.sourceCategory };
    },
    endDrag(props: ICategoryCardProps, monitor: DragSourceMonitor) {
      const dropResult = monitor.getDropResult();
      if (!dropResult) return;
      const item = monitor.getItem();
      props.onDropCategory(item.sourceCategory, dropResult.targetCategory, dropResult.hoverStatus);
    }
  },
  (connect: DragSourceConnector, monitor: DragSourceMonitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
);

const dropTargetHOC = DropTarget(
  [DND_CATEGORY_TYPE.CARD, DND_ITEM_TYPE.DYNAMIC_LIST_ROW],
  {
    drop({ sourceCategory }: ICategoryCardProps, monitor, component) {
      return {
        targetCategory: sourceCategory,
        hoverStatus: component.getHoverStatus()
      };
    },
    hover(props, monitor, component) {
      const clientOffset = monitor.getClientOffset();
      component.updateClientOffset(clientOffset);
    }
  },
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
);

export default dragSourceHOC(dropTargetHOC(forwardRef(CategoryCard)));
