import React, { useState, useEffect} from 'react';

import _ from 'lodash';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import { FieldInfoType, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { TAB_ID_LIST } from '../../constants'
import { FIELD_BELONG } from 'app/config/constants';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';

export interface IPopupTabTradingProducts extends StateProps, DispatchProps{
	tradingProducts: any,
	mode?: any,
	onChangeFields?: (value) => void,
  tradingProductsFields?: any,
  fieldInfosTabTrading: any;
}

const TabTradingProducts = (props: IPopupTabTradingProducts) => {

  const {fieldInfosTabTrading, tradingProducts} = props;
  const [fields, setFields] = useState([]);
  // let customFields = [];
  // if (fieldInfos && fieldInfos.data && fieldInfos.fields) {
  //   customFields = fieldInfos.fields;
  //   fields = customFields.filter(x => fieldInfos.data.find(item => item.fieldId === x.fieldId));
  //   fields.forEach(field => {
  //     switch (field.fieldName) {
  //       case 'customer_id':
  //         field.fieldType = DEFINE_FIELD_TYPE.TEXT;
  //         break;
  //       case 'product_id':
  //         field.fieldType = DEFINE_FIELD_TYPE.TEXT;
  //         break;
  //       case 'employee_id':
  //         field.fieldType = DEFINE_FIELD_TYPE.TEXT;
  //         break;
  //       case 'product_trading_progress_id':
  //         field.fieldType = DEFINE_FIELD_TYPE.TEXT;
  //         break;
  //       default:
  //         break;
  //     }
  //   })
  // }

  useEffect(() => {
    if (fieldInfosTabTrading && fieldInfosTabTrading.fields ) {
      const fieldList = fieldInfosTabTrading.fields;
      // const fieldList = customFields.filter(x => props.tradingProductsFields.find(item => item.fieldId === x.fieldId));
      fieldList.forEach(field => {
        switch (field.fieldName) {
          case 'customer_id':
            field.fieldType = DEFINE_FIELD_TYPE.TEXT;
            break;
          case 'product_id':
            field.fieldType = DEFINE_FIELD_TYPE.TEXT;
            break;
          case 'employee_id':
            field.fieldType = DEFINE_FIELD_TYPE.TEXT;
            break;
          case 'product_trading_progress_id':
            field.fieldType = DEFINE_FIELD_TYPE.TEXT;
            break;
          default:
            break;
        }
      })
      setFields(fieldList);
    }
  }, [fieldInfosTabTrading, props.tradingProductsFields])

  const convertDataTrading = data => {
    const result = [];
    data.forEach(item => {
      const newElement = {};
      for (const prop in item) {
        if (Object.prototype.hasOwnProperty.call(item, prop)) {
          switch (prop) {
            case 'customer_id':
              newElement['customer_id'] = item['customer_name'];
              break;
            case 'product_id':
              newElement['product_id'] = item['product_name'];
              break;
            case 'employee_id':
              newElement['employee_id'] = item['employee_name'];
              break;
            case 'product_trading_progress_id':
              newElement['product_trading_progress_id'] = item['progress_name'];
              break;
            default:
              newElement[prop] = item[prop] ? item[prop] : null;
              break;
          }
        }
      }
      result.push(newElement);
    })
    return result;
  }

  let productTradings = [];
  if (tradingProducts && tradingProducts.length > 0) {
    productTradings = convertDataTrading(tradingProducts);
  }
  return (
      <div className="tab-pane active">
        <DynamicList
          id="ProductDetailTabTrading"
          tableClass="table-list"
          keyRecordId="productTradingId"
          records={productTradings}
          belong={FIELD_BELONG.PRODUCT_TRADING}
          extBelong={TAB_ID_LIST.productTrading}
          fieldInfoType={FieldInfoType.Tab}
          forceUpdateHeader={false}
          fields={fields}
          fieldLinkHolver={[{ fieldName: 'productName', link: '#', hover: '', action: [] }, { fieldName: 'customerName', link: '#', hover: '', action: [] }, { fieldName: 'employeeName', link: '#', hover: '', action: [] }]}
        />
    </div>
  );
}

const mapStateToProps = ({ dynamicList}: IRootState) => ({
  fieldInfosTabTrading: dynamicList.data.has("ProductDetailTabTrading") ? dynamicList.data.get("ProductDetailTabTrading").fieldInfos : {},
});

const mapDispatchToProps = {
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabTradingProducts);