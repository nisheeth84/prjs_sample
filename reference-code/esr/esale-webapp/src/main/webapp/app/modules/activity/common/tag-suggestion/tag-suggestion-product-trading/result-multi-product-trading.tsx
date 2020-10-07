import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { CommonUtil } from '../../common-util';
import _ from 'lodash';
import StringUtils, { getFieldLabel } from 'app/shared/util/string-utils';
import { ProgressesType, FieldInfoActivityType } from '../../../models/get-activity-type'
import styled from 'styled-components'
import CustomDynamicList from 'app/modules/activity/custom-common/custom-dynamic-list';
import { PRODUCT_SPECIAL_FIELD_NAMES } from 'app/modules/activity/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import SpecialEditList from 'app/modules/activity/special-item/special-edit-list';
import { ScreenMode } from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { pluck, uniq }  from 'ramda'
import * as R from 'ramda'

const DeclareErrorWrapper  = styled.div`
  border:  ${props => props.isError ? '1px solid red' : 'none'};
` 

// const FIELD_IGNORE_RENDER = {
//   productTradingId: 'product_trading_id',
//   customerId: 'customer_id',
//   productId: 'product_id',
//   employeeId: 'employee_id',
//   createdDate: 'created_date',
//   createdUser: 'created_user',
//   updatedDate: 'updated_date',
//   updatedUser: 'updated_user'
// }


type IResultMultiProductTradingProp = StateProps & DispatchProps & {
  tags: any;
  onRemoveTag: any,
  totalPrice?,
  totalQuantity?,
  totalAmount?,
  onListProductDataChange?: (data) => void,
  progresses?: ProgressesType[],
  fieldInfoProductTrading?: FieldInfoActivityType[],
  errorValidates?: any[]
}

const ResultMultiProductTrading = (props: IResultMultiProductTradingProp) => {
  const [fieldInfo, setFiledInfo] = useState([]);
  const [saveEditValues] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [fileUploads, setFileUploads] = useState([]);
  
  /**
   * handleRowDataChange
   */
  const handleRowDataChange = () => {
    // let productIds = [];
    const listProductTrading = [];
    if(fieldInfo && props.tags && saveEditValues){
      listProduct.forEach((product, idx) => {
        const data = {};
        const fieldItems = saveEditValues.filter( val => val.itemId === `${idx}.${product.productId}`); // change itemId
        fieldInfo.forEach(field => {
          const itemData = fieldItems.find( e => e.fieldId === field.fieldId);
          const value = itemData ? itemData.itemValue : null;
          if(field.isDefault){
            data[StringUtils.snakeCaseToCamelCase(field.fieldName)] = value;
          } else {
            CommonUtil.addExtendField(field, value, data,'productTradingData');
          }
        })
        data['productId'] = product.productId;
        data['productName'] = product.productName;
        data['productTradingId'] = product['productTradingId'];
        data['productCategoryName'] = product['productCategoryName'];
        data['productImagePath'] = product['productImagePath'];
        data['memoProduct'] = product['memoProduct'];
        // data['quantity'] = product['quantity'];
        data['employeeId'] = product['employeeId'];
        data['customerId'] = product['customerId'];
        data['amount'] = _.isNaN(data['quantity'] * data['price']) ? 0 : (data['quantity'] * data['price']);
        listProductTrading.push(data);
      });
    }
    
    if(props.onListProductDataChange)
      props.onListProductDataChange(listProductTrading);
  };

  /**
   * handleDeleteItem
   * @param idx 
   */
  const handleDeleteItem = (idx) => {
    if(props.onRemoveTag)
      props.onRemoveTag(idx);
  };

  /**
   * onUpdateFieldValue
   * @param itemData 
   * @param type 
   * @param itemEditValue 
   */
  const onUpdateFieldValue = (itemData, type, itemEditValue) => {
    const index = saveEditValues.findIndex(
      e => itemData.itemId && e.itemId.toString() === itemData.itemId.toString() && e.fieldId.toString() === itemData.fieldId.toString()
    );
    if (index < 0) {
      saveEditValues.push({ itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue });
    } else {
      saveEditValues[index] = { itemId: itemData.itemId, fieldId: itemData.fieldId, itemValue: itemEditValue };
    }
    handleRowDataChange();
  };

  

  
    /**
   * convert to field items: activity format
   * @param formats
   */
  const convertToFiledItems = (progresses) => {
    const lst = []
    if (progresses && progresses.length > 0) {
      // progresses = progresses.sort((a, b) => a.progressOrder - b.progressOrder);
      progresses = progresses.filter(e => e.isAvailable);
      progresses.forEach(e => {
        lst.push({
          itemId: e.productTradingProgressId,
          itemLabel: getFieldLabel(e, "progressName"),
          isAvailable: e.isAvailable
        })
      })
    }
    return lst;
  }

  useEffect(()=>{
    if(props.fieldInfoProductTrading){
      const list = _.orderBy(props.fieldInfoProductTrading, 'fieldOrder', 'asc');
      list.forEach(field => {
        if(field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productTradingProgressId){
          field['fieldItems'] = convertToFiledItems(props.progresses);
          field['fieldType'] = DEFINE_FIELD_TYPE.SINGER_SELECTBOX;
        }
      })
      
      setFiledInfo(list);
    } else {
      setFiledInfo([]);
    }
  },[props.fieldInfoProductTrading])

  useEffect(()=>{
    setListProduct(props.tags);
  },[props.tags])


  const renderCellSpecial = (field, rowData, mode, nameKey) => {
    const cellId = `dynamic_cell_${getValueProp(rowData, nameKey)}_${field.fieldId}`;
    if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
      return (
        <div id={cellId} className="break-spaces">
          {rowData[field.fieldName]}
        </div>
      );
    } else if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
      if (rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]) {
        return (
          <div id={cellId} className="break-spaces">
            {rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].map((item, idx) => {
              if (idx < rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets].length - 1) {
                return <a>{item.productName}, </a>;
              } else {
                return <a>{item.productName}</a>;
              }
            })}
          </div>
        );
      }
    } else {
      return (
        <SpecialEditList
          valueData={rowData}
          itemData={field}
          extensionsData={() => { }}
          updateStateField={onUpdateFieldValue}
          nameKey={nameKey}
          mode={mode}
        />
      );
    }
  };

  const handleListProductDataChange = data => {
    listProduct[data.idx].quantity = data.quantity;
    setListProduct(_.cloneDeep(listProduct));
    handleRowDataChange();
  };
  
  /**
   * isSpecialField
   * @param field 
   */
  // const isSpecialField = (field) => {
  //   const specials = Object.values(FIELD_IGNORE_RENDER);
  //   return specials.includes(field.fieldName);
  // }

    /**
   * get list field render
   * @param listField 
   */
  // const getFiledRender = (listField) => {
  //   let res = [];
  //   if(listField && listField.length > 0){
  //     res = listField.filter(e => !isSpecialField(e))
  //   } 
  //   return res;
  // }

  const updateFiles = (fUploads) => {
    // setTmpProductSet(prev => ({ ...prev, isUpload: true }))
    const newUploads = {
      ...fileUploads,
      ...fUploads
    };
    setFileUploads(_.cloneDeep(newUploads));
  };

  const [errorMessagesProductOfSet, setErrorMessagesProductOfSet] = useState<string[]>([])

  useEffect(() => {
    if(Array.isArray(fieldInfo) && Array.isArray(props.errorValidates) ){
      const getListFieldOfProductOfSet = pluck('fieldName', fieldInfo)
      const getListErrorOfProductSet = props.errorValidates.filter(({item}) => getListFieldOfProductOfSet.includes(item))
      const getMessageCode = pluck('errorCode', getListErrorOfProductSet  )
      setErrorMessagesProductOfSet(uniq(getMessageCode))
    }
  }, [props.errorValidates])

  const addPropIsFixedTip = (fInfos) => {
    return R.map(R.assoc('isFixedTip', true), fInfos)
  } 

  return (
    <DeclareErrorWrapper isError={errorMessagesProductOfSet.length > 0}>
      <CustomDynamicList
        products={listProduct}
        fieldInfoProductSet={addPropIsFixedTip(fieldInfo)}
        customContentField={renderCellSpecial}
        onDeleteItem={handleDeleteItem}
        onListProductDataChange={handleListProductDataChange}
        onUpdateFieldValue={onUpdateFieldValue}
        updateFiles={updateFiles}
        errorItems={props.errorValidates}
        screenMode={ScreenMode.EDIT}
        isCanNotDrop={true}
        isCanNotResize={true}
      />
    </DeclareErrorWrapper>
  );
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultMultiProductTrading);
