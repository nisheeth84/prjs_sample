import React, {useEffect, useRef, useState} from 'react';
import {translate} from "react-jhipster";
// import {getJsonBName} from "app/modules/products/utils";
import _ from 'lodash';
import { NO_VALUE } from 'app/modules/products/constants';
import { getFieldLabel } from 'app/shared/util/string-utils';

export interface IFieldSelectProductTypeProps {
  productTypes: any,
  productTypesId: any,
  label: string,
  onSelectItemChange: (value) => void
  isSet?: any
}

const FieldSelectProductType = (props: IFieldSelectProductTypeProps) => {

  const {productTypes, productTypesId, label} = props;
  const [valueSelect, setValueSelect] = useState('');
  const [showOption, setShowOption] = useState(false);
  const [productTypeName, setProductTypeName] = useState(translate(props.isSet?'products.create-set.placeholder-type-product-set': 'products.create-set.placeholder-type-product'));
  const openDropdownRef = useRef(null);

  const toggleShowOption = () => {
    setShowOption(!showOption);
  };

  const onSelectItemChange = (productTypeId, fromPressKey = false) => {
    if (_.isNil(productTypeId) || productTypeId === NO_VALUE) {
      setValueSelect(NO_VALUE);
      props.onSelectItemChange(null);
    } else {
      setValueSelect(`${productTypeId}`);
      props.onSelectItemChange(productTypeId);
    }
    if (!fromPressKey) {
      toggleShowOption();
    }
  };

  const handleUserMouseDown = (event) => {
    if (openDropdownRef.current && !openDropdownRef.current.contains(event.target)) {
      setShowOption(false);
    }
  };


  useEffect(() => {
    window.addEventListener('mousedown', handleUserMouseDown);
    return () => {
      window.removeEventListener('mousedown', handleUserMouseDown);
    };
  }, [])

  useEffect(() => {
    const selected = productTypes.find(o => o.productTypeId === productTypesId);
    if (selected) {
      setProductTypeName(getFieldLabel(selected, 'productTypeName'));
    } else {
      setProductTypeName(translate(props.isSet?'products.create-set.placeholder-type-product-set': 'products.create-set.placeholder-type-product'));
    }
  });

  /**
   * handle key down or key up to choose item in pulldown
   * @param event 
   */
  const keyDownHandler = (event) => {
    const lstDropdown = []
    lstDropdown.push(NO_VALUE);
    if (productTypes.length > 0) {
      productTypes.forEach(element => {
        lstDropdown.push(element.productTypeId.toString());
      });
    }

    // Enter
    if (event.keyCode === 13) {
      setShowOption(!showOption);
    }

    // Down
    if (event.keyCode === 40) {
      if (!_.isEmpty(valueSelect)) {
        const indexOfDefault = lstDropdown.indexOf(valueSelect);
        if (indexOfDefault === lstDropdown.length - 1) {
          onSelectItemChange(lstDropdown[0], true);
        } else {
          onSelectItemChange(lstDropdown[indexOfDefault + 1], true);
        }
      } else {
        if (productTypesId) {
          const indexOfDefaultFirst = lstDropdown.indexOf(productTypesId.toString());
          if (indexOfDefaultFirst === lstDropdown.length - 1) {
            onSelectItemChange(lstDropdown[0], true);
          } else {
            onSelectItemChange(lstDropdown[indexOfDefaultFirst + 1], true);
          }
        } else {
          // ignore element 0 is blank
          onSelectItemChange(lstDropdown[1], true);
        }
      }
    }

    // Up
    if (event.keyCode === 38) {
      if (!_.isEmpty(valueSelect)) {
        const indexOfDefault = lstDropdown.indexOf(valueSelect);
        if (indexOfDefault === 0) {
          onSelectItemChange(lstDropdown[lstDropdown.length - 1], true);
        } else {
          onSelectItemChange(lstDropdown[indexOfDefault - 1], true);
        }
      } else {
        if (productTypesId) {
          const indexOfDefaultFirst = lstDropdown.indexOf(productTypesId.toString());
          if (indexOfDefaultFirst === 0) {
            onSelectItemChange(lstDropdown[lstDropdown.length - 1], true);
          } else {
            onSelectItemChange(lstDropdown[indexOfDefaultFirst - 1], true);
          }
        } else {
          onSelectItemChange(lstDropdown[lstDropdown.length - 1], true);
        }
      }
    }

    event.view.event.preventDefault();
  }

  const selectedIndex = productTypes.findIndex(e => !_.isNil(e.productTypeId) && e.productTypeId.toString() === valueSelect);
  const text = selectedIndex >= 0 ? getFieldLabel(productTypes[selectedIndex], 'productTypeName') : productTypeName;
  return (
    <>
      <label>{label}</label>
      <button type="button" className="select-option" onClick={toggleShowOption}
        onKeyDown={e => { e.keyCode !== 9 && keyDownHandler(e) }}>
        <span className="select-text">{text}</span>
      </button>
      {showOption &&
        <ul className="drop-down drop-down2  fix-height-categories-option" ref={openDropdownRef}>
          <li tabIndex={0} className={`item ${selectedIndex === -1 ? 'active' : ''} smooth`} onClick={() => onSelectItemChange(NO_VALUE)}>
            {translate(props.isSet ? 'products.create-set.placeholder-type-product-set' : 'products.create-set.placeholder-type-product')}
          </li>
          {productTypes.map((item, idx) => {
            return (
              <>
                <li key={item.productTypeId} tabIndex={idx} className={`item ${selectedIndex === idx ? 'active' : ''} smooth`}
                  onClick={() => onSelectItemChange(item.productTypeId)}
                  onSelect={() => onSelectItemChange(item.productTypeId)}
                  onKeyPress={(event) => {
                    // Enter
                    if (event.keyCode === 13) {
                      onSelectItemChange(item.productTypeId);
                    }
                  }}
                >
                  {getFieldLabel(item, 'productTypeName')}
                </li>
              </>
            )
          })}
        </ul>
      }
    </>
  );
};

export default FieldSelectProductType
