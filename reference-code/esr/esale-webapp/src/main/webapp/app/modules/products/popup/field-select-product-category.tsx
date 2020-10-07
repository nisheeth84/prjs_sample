import React, { useEffect, useRef, useState } from 'react';
import { translate } from 'react-jhipster';
// import {getJsonBName} from "app/modules/products/utils";
import _ from 'lodash';
import { NO_VALUE } from 'app/modules/products/constants';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IFieldSelectProductCategoryProps {
  productCategories: any;
  categoryId?: any;
  label: string;
  onSelectItemChange: (value) => void;
  onSelectItemChangeItem?: (value) => void;
}

const FieldSelectProductCategory = (props: IFieldSelectProductCategoryProps) => {
  const [categoryName, setCategoryName] = useState(translate('products.create-set.placeholder-category'));
  const [showOption, setShowOption] = useState(false);
  const [valueSelect, setValueSelect] = useState('');
  const [categories, setCategories] = useState([]);
  const openDropdownRef = useRef(null);

  const { productCategories, categoryId, label } = props;

  const toggleShowOption = () => {
    setShowOption(!showOption);
  };

  const handleUserMouseDown = event => {
    if (openDropdownRef.current && !openDropdownRef.current.contains(event.target)) {
      setShowOption(false);
    }
  };

  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, []);

  const divStyle = level => {
    const x = level * 12;
    return {
      paddingLeft: `${x}px`
    };
  };

  const handleTree = item => {
    const index = categories.findIndex(cate => cate.productCategoryId === item.productCategoryId);
    if (index === -1) {
      categories.push({
        productCategoryName: item.productCategoryName,
        productCategoryLevel: item.productCategoryLevel,
        productCategoryId: item.productCategoryId,
        displayOrder: item.displayOrder,
      });
    }
    if (item.productCategoryChild) {
      for (let i = 0; i < item.productCategoryChild.length; i++) {
        handleTree(item.productCategoryChild[i]);
      }
    }
  };

  useEffect(() => {
    for (let i = 0; i < productCategories.length; i++) {
      handleTree(productCategories[i]);
    }
    setCategories(categories);
    if(categoryId){
      const selected = categories.find(o => o.productCategoryId === categoryId);
      if (selected) {
        setCategoryName(getFieldLabel(selected, 'productCategoryName'));
      } 
    } else {
      setCategoryName(translate('products.create-set.placeholder-category'));
      setValueSelect(NO_VALUE)
    }
  }, [categoryId]);

  const onSelectItemChange = (productCategoryId, fromPressKey = false) => {
    if (_.isNil(productCategoryId) || productCategoryId === NO_VALUE) {
      setValueSelect(NO_VALUE);
      props.onSelectItemChange(null);
      props.onSelectItemChangeItem(null);
    } else {
      setValueSelect(`${productCategoryId}`);
      props.onSelectItemChange(productCategoryId);
      const valueSelectdIndex = categories.findIndex(e => !_.isNil(e.productCategoryId) && e.productCategoryId.toString() === `${productCategoryId}`);
      props.onSelectItemChangeItem(categories[valueSelectdIndex].productCategoryName);
    }
    if (!fromPressKey) {
      toggleShowOption();
    }
  };

  /**
   * handle key down or key up to choose item in pulldown
   * @param event 
   */
  // const keyDownHandler = (event) => {
  //   const lstDropdown = [];
  //   lstDropdown.push(NO_VALUE);
  //   if (categories.length > 0) {
  //     categories.forEach(element => {
  //       lstDropdown.push(element.productCategoryId.toString());
  //     });
  //   }

  //   // Enter
  //   if (event.keyCode === 13) {
  //     setShowOption(!showOption);
  //   }

  //   // Down
  //   if (event.keyCode === 40) {
  //     if (!_.isEmpty(valueSelect)) {
  //       const indexOfDefault = lstDropdown.indexOf(valueSelect);
  //       if (indexOfDefault === lstDropdown.length - 1) {
  //         onSelectItemChange(lstDropdown[0], true);
  //       } else {
  //         onSelectItemChange(lstDropdown[indexOfDefault + 1], true);
  //       }
  //     } else {
  //       if (categoryId) {
  //         const indexOfDefaultFirst = lstDropdown.indexOf(categoryId.toString());
  //         if (indexOfDefaultFirst === lstDropdown.length - 1) {
  //           onSelectItemChange(lstDropdown[0], true);
  //         } else {
  //           onSelectItemChange(lstDropdown[indexOfDefaultFirst + 1], true);
  //         }
  //       } else {
  //         // ignore element 0 is blank
  //         onSelectItemChange(lstDropdown[1], true);
  //       }
  //     }
  //   }

  //   // Up
  //   if (event.keyCode === 38) {
  //     if (!_.isEmpty(valueSelect)) {
  //       const indexOfDefault = lstDropdown.indexOf(valueSelect);
  //       if (indexOfDefault === 0) {
  //         onSelectItemChange(lstDropdown[lstDropdown.length - 1], true);
  //       } else {
  //         onSelectItemChange(lstDropdown[indexOfDefault - 1], true);
  //       }
  //     } else {
  //       if (categoryId) {
  //         const indexOfDefaultFirst = lstDropdown.indexOf(categoryId.toString());
  //         if (indexOfDefaultFirst === 0) {
  //           onSelectItemChange(lstDropdown[lstDropdown.length - 1], true);
  //         } else {
  //           onSelectItemChange(lstDropdown[indexOfDefaultFirst - 1], true);
  //         }
  //       } else {
  //         onSelectItemChange(lstDropdown[lstDropdown.length - 1], true);
  //       }
  //     }
  //   }

  //   event.view.event.preventDefault();
  // }

  const selectedIndex = categories.findIndex(e => !_.isNil(e.productCategoryId) && e.productCategoryId.toString() === valueSelect);
  const text = selectedIndex >= 0 ? getFieldLabel(categories[selectedIndex], "productCategoryName") : categoryName;
  return (
    <>
      <label>{label}</label>
      <button type="button" className="select-option" onClick={toggleShowOption}
        // onKeyDown={e => { e.keyCode !== 9 && keyDownHandler(e) }}
        >
        <span className="select-text">{text}</span>
      </button>
      {showOption &&
        <ul className="drop-down drop-down2 fix-height-categories-option" ref={openDropdownRef}>
          <li tabIndex={0} className={`item ${selectedIndex === -1 ? 'active' : ''} smooth`} onClick={() => onSelectItemChange(NO_VALUE)}>
            {translate('products.create-set.placeholder-category')}
          </li>
          {categories.map((item, idx) => {
            return (
              <>
                <li key={item.productCategoryId} tabIndex={idx} className={`item ${selectedIndex === idx ? 'active' : ''} smooth`}
                  style={divStyle(item.productCategoryLevel)}
                  onClick={() => onSelectItemChange(item.productCategoryId)}
                  onSelect={() => onSelectItemChange(item.productCategoryId)}
                  onKeyPress={(event) => {
                    // Enter
                    if (event.keyCode === 13) {
                      onSelectItemChange(item.productCategoryId);
                    }
                  }}
                >
                  {getFieldLabel(item, "productCategoryName")}
                </li>
              </>
            )
          })}
        </ul>
      }
    </>
  );
};

export default FieldSelectProductCategory;
