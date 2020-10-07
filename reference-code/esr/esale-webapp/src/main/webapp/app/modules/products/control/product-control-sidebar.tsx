import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { MENU_TYPE } from '../constants';
import CategoryList from './product-control-category-list';
import { handleDeleteCategory, ProductAction } from 'app/modules/products/list/product-list.reducer';
import {
  handleUpdateCategory,
  handleUpdateCategoryOrder,
  ProductSidebarAction
} from 'app/modules/products/control/product-control-sidebar.reducer';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { Resizable } from 're-resizable';
import * as R from 'ramda';

export interface IProductControlSidebarProps extends StateProps, DispatchProps {
  categories?: any;
  updateFiltersSearch?: (filters: any, id: any) => void;
  sidebarCurrentId: { (arg0: any): void; (sidebarId: any): void };
  onOpenPopupCategoryEdit: (item: any) => void;
  onOpenPopupCategoryAddChild: (id: any) => void;
  deleteCategory: any;
  action: any;
  reloadScreen: (arg0: any) => void;
  reloadLocalMenu: () => void;
  categoryId: any;
  actionMove: any;
  activeCardType: number;
  activeCardId: number;
  setMessage: (arg0: any) => void;
  setMessageError: (argo: any) => void;
  filterConditionList: any;
}

const ProductControlSidebar = (props: IProductControlSidebarProps) => {
  const innerListRef = useRef(null);

  const [width, setWidth] = useState(216);
  const [showSidebar, setShowSidebar] = useState(true);
  const resizeRef = useRef(null);

  const [activeCard, setActiveCard] = useState({ type: MENU_TYPE.ALL_PRODUCT, cardId: null });
  const isAdmin = hasAnyAuthority(props.authorities, [AUTHORITIES.ADMIN]);
  const [overflowY, setOverflowY] = useState<'auto' | 'hidden'>('hidden');
  const [showShadowTop, setShowShadowTop] = useState<boolean>(false);
  const [showShadowBottom, setShowShadowBottom] = useState<boolean>(false);

  const handleScroll = useCallback(
    (event: { target: any }) => {
      const node = event.target;
      const { scrollHeight, scrollTop, clientHeight } = node;
      const bottom = scrollHeight - scrollTop;
      setShowShadowTop(scrollTop > 0);
      setShowShadowBottom(bottom > clientHeight);
    },
    [setShowShadowTop, setShowShadowBottom]
  );

  useEffect(() => {
    showSidebar && setShowShadowTop(false);
  }, [showSidebar]);

  useEffect(() => {
    if (props.activeCardId && props.activeCardId > 0) {
      setActiveCard({ type: MENU_TYPE.CATEGORY, cardId: props.activeCardId });
    } else {
      setActiveCard({ type: MENU_TYPE.ALL_PRODUCT, cardId: null });
    }
  }, [props.activeCardId]);

  /**
   * Filter data in list by menu
   * @param key
   * @param value
   */
  const handleDataFilter = useCallback(
    (filters: any[], id: number) => {
      props.updateFiltersSearch(filters, id);
    },
    [props.updateFiltersSearch]
  );

  useEffect(() => {
    if (props.action === ProductAction.Success) {
      props.reloadLocalMenu();
      props.reloadScreen(props.deleteCategory);
    }
    return () => {
      if (props.deleteCategory && props.deleteCategory === activeCard.cardId) setActiveCard({ type: MENU_TYPE.ALL_PRODUCT, cardId: null });
    };
  }, [props.deleteCategory]);

  useEffect(() => {
    if (props.actionMove === ProductSidebarAction.Success && props.msgSuccess) {
      props.reloadLocalMenu();
      props.setMessage(props.msgSuccess);
    }
  }, [props.msgSuccess]);

  useEffect(() => {
    if (props.errorItem) {
      props.reloadLocalMenu();
      props.setMessageError(props.errorItem);
    }
  }, [props.errorItem]);

  /**
   * Handle for move category
   */
  const updateParent = useCallback(
    (sourceCategory, targetCategory) => {
      props.handleUpdateCategory(
        sourceCategory.productCategoryId,
        sourceCategory.productCategoryName,
        targetCategory.productCategoryId,
        sourceCategory.updatedDate
      );
    },
    [props.handleUpdateCategory]
  );

  const checkIsParents = useCallback((categories: any[], sourceCategory: { productCategoryId: any }, targetCategory) => {
    if (!targetCategory.productCategoryParentId) return false;
    const parent = categories.find((x: { productCategoryId: any }) => x.productCategoryId === targetCategory.productCategoryParentId);
    if (parent.productCategoryId === sourceCategory.productCategoryId) return true;
    return checkIsParents(categories, sourceCategory, parent);
  }, []);

  const flatten = useCallback(s => {
    let result = [];
    s.forEach(ss => {
      const { productCategoryChild } = ss;
      result.push(ss);
      if (!productCategoryChild) return;
      result = [...result, ...flatten(productCategoryChild)];
    });
    return result;
  }, []);

  const productCategoryListAll = useMemo(() => flatten(props.categories), [flatten, props.categories]);

  const mapEquals = (source, target, selectProp) => R.equals(selectProp(source), selectProp(target));
  const getId = R.prop('productCategoryId');
  const isSelf = (source, target) => mapEquals(source, target, getId);
  const isParents = (source, target) => checkIsParents(productCategoryListAll, source, target);
  const isNotOk = (source, target) => isSelf(source, target) || isParents(source, target);
  const getParentId = R.prop('productCategoryParentId');
  const setParentId = R.assoc('productCategoryParentId');
  const isSameParent = (source, target) => mapEquals(source, target, getParentId);

  const getSameParent = (items, parentId) =>
    R.filter(
      R.compose(
        R.equals(parentId),
        getParentId
      ),
      items
    );
  const findIndexById = (item, items) =>
    R.findIndex(
      R.compose(
        R.equals(getId(item)),
        getId
      ),
      items
    );
  const tranformAndReorder = R.addIndex(R.map)((item, i) =>
    R.compose(
      R.assoc('displayOrder', i),
      R.pick(['productCategoryName', 'productCategoryId', 'productCategoryParentId', 'updatedDate'])
    )(item)
  );

  const updatePositionForSameParents = (sourceCategory, targetCategory, hoverStatus) => {
    const sameParentWithSource = getSameParent(productCategoryListAll, getParentId(sourceCategory));

    // swap item position on array
    const oldSourceIndex = findIndexById(sourceCategory, sameParentWithSource);
    const targetIndex = findIndexById(targetCategory, sameParentWithSource);

    let newSourceIndex = targetIndex + (hoverStatus.isTop ? 0 : 1) + (oldSourceIndex > targetIndex ? 0 : -1);

    if (newSourceIndex < 0) {
      newSourceIndex = 0;
    } else if (newSourceIndex >= sameParentWithSource.length) {
      newSourceIndex = sameParentWithSource.length - 1;
    }

    R.compose(
      props.handleUpdateCategoryOrder,
      tranformAndReorder
    )(R.move(oldSourceIndex, newSourceIndex, sameParentWithSource));
  };

  const updatePositionForDiffParents = (sourceCategory, targetCategory, hoverStatus) => {
    // simple code: just update parent
    // updateParent(sourceCategory, targetCategory);

    // full code: update parent and inder for old and new lists
    const oldParentId = getParentId(sourceCategory);
    const newParentId = getParentId(targetCategory);

    const sameParentOldListBeforeChange = getSameParent(productCategoryListAll, oldParentId);
    const oldSourceIndexBeforeChange = findIndexById(sourceCategory, sameParentOldListBeforeChange);

    const sameParentNewListBeforeChange = getSameParent(productCategoryListAll, newParentId);
    const oldTargetIndexBeforeChange = findIndexById(targetCategory, sameParentNewListBeforeChange);

    // update new parentId fo sourceCategory
    const newSourceCategory = setParentId(newParentId, sourceCategory);

    // update order for old list
    const sameParentOldListOrdered = tranformAndReorder(R.remove(oldSourceIndexBeforeChange, 1, sameParentOldListBeforeChange));

    // update order on new list
    const newSourceIndex = oldTargetIndexBeforeChange + (hoverStatus.isTop ? -1 : 1);

    let sameParentNewListAfterChange = sameParentNewListBeforeChange;
    if (newSourceIndex < 0) {
      sameParentNewListAfterChange.unshift(newSourceCategory);
    } else if (newSourceIndex > sameParentNewListBeforeChange.length) {
      sameParentNewListAfterChange.push(newSourceCategory);
    } else {
      sameParentNewListAfterChange = R.insert(newSourceIndex, newSourceCategory, sameParentNewListBeforeChange);
    }
    const sameParentNewListOrdered = tranformAndReorder(sameParentNewListAfterChange);

    const listOrderedForUpdate = [...sameParentOldListOrdered, ...sameParentNewListOrdered];
    props.handleUpdateCategoryOrder(listOrderedForUpdate);
  };

  const onDropCategory = (sourceCategory, targetCategory, hoverStatus) => {
    if (isNotOk(sourceCategory, targetCategory)) return;

    if (hoverStatus.isTop || hoverStatus.isBottom) {
      if (isSameParent(sourceCategory, targetCategory)) {
        updatePositionForSameParents(sourceCategory, targetCategory, hoverStatus);
      } else {
        updatePositionForDiffParents(sourceCategory, targetCategory, hoverStatus);
      }
    } else if (hoverStatus.isMiddle) {
      updateParent(sourceCategory, targetCategory);
    }
  };

  const setCardState = useCallback(
    (type: number, id = null) => {
      setActiveCard({ type, cardId: id });
    },
    [setActiveCard]
  );

  if (!props.categories) {
    return <></>;
  }

  const handleChangeOverFlow = useCallback(
    (type: 'auto' | 'hidden') => (e: any) => {
      setOverflowY(type);
    },
    [setOverflowY]
  );

  const toggleSidebar = useCallback(() => setShowSidebar(!showSidebar), [showSidebar, setShowSidebar]);

  const sidebarStyle = useMemo(
    () => `button-collapse-sidebar-product ${showShadowTop && showSidebar ? 'shadow-local-navigation-top ' : ''}`,
    [showShadowTop, showSidebar]
  );

  const sidebarIconStyle = useMemo(() => `far ${showSidebar ? 'fa-angle-left' : 'fa-angle-right'}  `, [showSidebar]);

  useEffect(() => {
    showSidebar && setShowShadowBottom(innerListRef.current.clientHeight < innerListRef.current.scrollHeight);
  }, [props.categories, showSidebar]);

  const onResizeStop = useCallback(
    (e, direction, ref, d) =>
      R.compose(
        setWidth,
        R.add(width),
        R.prop('width')
      )(d),
    [setWidth, width]
  );

  const resizableSize = useMemo(() => ({ width, height: '100%' }), []);

  return (
    <>
      {showSidebar && (
        <Resizable
          ref={resizeRef}
          size={resizableSize}
          onResizeStop={onResizeStop}
          enable={{
            top: false,
            right: true,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          className={`resizeable-resize-wrap esr-content-sidebar list-category style-3 ${showShadowTop &&
            'shadow-local-navigation-top'} ${showShadowBottom && 'shadow-local-navigation-bottom-inset'}`}
        >
          <div
            className="esr-content-sidebar-outer custom-sidebar custom-sidebar-product"
            ref={innerListRef}
            onScroll={handleScroll}
            style={{ overflowY }}
            onMouseEnter={handleChangeOverFlow('auto')}
            onMouseLeave={handleChangeOverFlow('hidden')}
          >
            <div
              className={
                'title-lf ' +
                (activeCard !== null && activeCard.type === MENU_TYPE.ALL_PRODUCT && activeCard.cardId === null ? 'active' : '')
              }
            >
              <a
                className="pl-2 ml-1"
                onClick={() => {
                  handleDataFilter([], 0);
                  setCardState(MENU_TYPE.ALL_PRODUCT, null);
                  props.sidebarCurrentId(null);
                }}
              >
                {translate('products.sidebar.title.all-product')}
              </a>
            </div>
            <div className="esr-content-sidebar-inner">
              <div className="employee-sidebar-menu list-group">
                <span className="pl-2 ml-1">{translate('products.sidebar.title.categories')}</span>
                <li>
                  <ul className="list-group">
                    <CategoryList
                      localMenuData={props.categories}
                      handleDeleteCategory={props.handleDeleteCategory}
                      onOpenPopupCategoryAddChild={props.onOpenPopupCategoryAddChild}
                      type={MENU_TYPE.CATEGORY}
                      handleDataFilter={handleDataFilter}
                      filterConditionList={props.filterConditionList}
                      onDropCategory={onDropCategory}
                      sidebarCurrentId={props.sidebarCurrentId}
                      onOpenPopupCategoryEdit={props.onOpenPopupCategoryEdit}
                      setActiveCard={setCardState}
                      activeCard={activeCard}
                      isAdmin={isAdmin}
                      widthCard={width}
                    />
                  </ul>
                </li>
              </div>
            </div>
          </div>
        </Resizable>
      )}
      <div className={sidebarStyle} onClick={toggleSidebar}>
        <a className="expand">
          <i className={sidebarIconStyle} />
        </a>
      </div>
    </>
  );
};

const mapStateToProps = ({ productList, productControlSidebar, authentication }: IRootState) => ({
  authorities: authentication.account.authorities,
  localMenu: productList.localMenuData,
  deleteCategory: productList.deleteCategory,
  action: productList.actionDelete,
  categoryId: productControlSidebar.categoryId,
  msgSuccess: productControlSidebar.msgSuccess,
  actionMove: productControlSidebar.actionMove,
  errorItem: productControlSidebar.errorItems
});

const mapDispatchToProps = {
  handleDeleteCategory,
  handleUpdateCategory,
  handleUpdateCategoryOrder
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductControlSidebar);
