import React, { useState, useCallback } from 'react';
import { MENU_TYPE } from '../constants';
import CategoryCard from './product-control-category-card';
import _ from 'lodash';

export interface ICategoryListProps {
  localMenuData?: any;
  type: number;
  handleDataFilter: (filters, id) => void;
  onDropCategory: (sourceCategory: any, targetCategory: any, hoverStatus: any) => void;
  onOpenPopupCategoryEdit: (item) => void;
  handleDeleteCategory: (id) => void;
  onOpenPopupCategoryAddChild: (id) => void;
  setActiveCard: (typeCard, id) => void;
  activeCard: any;
  sidebarCurrentId: (sidebarId) => void;
  filterConditionList;
  isAdmin: boolean;
  widthCard: any
}

const CategoryList: React.FC<ICategoryListProps> = props => {
  const [listChild, setListChild] = useState({});

  /**
   * Expand/Collapse state for category children
   * @param categoryId id of department parent
   */
  const toggleCategoryChild = useCallback(
    categoryId => {
      if (listChild[categoryId] === undefined || listChild[categoryId] === true) {
        listChild[categoryId] = false;
      } else {
        listChild[categoryId] = true;
      }
      const tmp = _.cloneDeep(listChild);
      setListChild(tmp);
    },
    [listChild, setListChild]
  );

  const setShowCategoryChild = useCallback(
    categoryId => {
      if (listChild[categoryId] === true) return;
      listChild[categoryId] = true;
      const tmp = _.cloneDeep(listChild);
      setListChild(tmp);
    },
    [listChild, setListChild]
  );

  /**
   * Check categoryChild is expanded or not
   * @param categoryId
   */
  const isExpanded = useCallback(categoryId => {
    if (categoryId === undefined || categoryId === true) {
      return true;
    }
    return false;
  }, []);

  const ProductCategory = ({ data }) => {
    return (
      data &&
      data.map((item, idx) => (
        <li className="category" key={item.productCategoryId} id={item.productCategoryId+'_sidebar'} >
          {Array.isArray(item.productCategoryChild) && item.productCategoryChild.length > 0 && (
            <i
              className={'fas ' + (isExpanded(listChild[item.productCategoryId]) ? 'fa-sort-down' : 'fa-caret-right')}
              onClick={() => toggleCategoryChild(item.productCategoryId)}
            ></i>
          )}

          <CategoryCard
            key={idx}
            sourceCategory={item}
            onShowCategoryChild={setShowCategoryChild}
            onOpenPopupCategoryAddChild={props.onOpenPopupCategoryAddChild}
            onOpenPopupCategoryEdit={props.onOpenPopupCategoryEdit}
            handleDeleteCategory={props.handleDeleteCategory}
            type={MENU_TYPE.CATEGORY}
            handleDataFilter={props.handleDataFilter}
            onDropCategory={props.onDropCategory}
            sidebarCurrentId={props.sidebarCurrentId}
            setActiveCard={props.setActiveCard}
            activeCard={props.activeCard}
            filterConditionList={props.filterConditionList}
            isAdmin={props.isAdmin}
            widthCard={props.widthCard}
            />
          {item.productCategoryChild && isExpanded(listChild[item.productCategoryId]) && (
            <ul>{<ProductCategory data={item.productCategoryChild} />}</ul>
          )}
        </li>
      ))
    );
  };

  return <ProductCategory data={props.localMenuData} />;
};

export default CategoryList;
