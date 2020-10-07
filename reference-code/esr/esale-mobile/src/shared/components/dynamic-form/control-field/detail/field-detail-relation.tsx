import React from 'react';
import { View } from 'react-native';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { DefineRelationSuggest, RelationDisplay, TypeRelationSuggest } from '../../../../../config/constants/enum';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { RelationBusinessCardScreen } from './relation/business-cards/relation-business-card-screen';
import { RelationCustomerDetail } from './relation/customer/relation-customer-detail-screen';
import { RelationEmployeeDetail } from './relation/employee/relation-employee-detail-screen';
import { RelationMilestonDetail } from './relation/milestone/relation-milestone-detail';
import { RelationProductTradingDetail } from './relation/product-trading/relation-products-trading-detail';
import { RelationProductDetail } from './relation/product/relation-product-detail';
import { RelationTaskDetail } from './relation/task/relation-task-detail';

// Define value props of FieldAddEditRelation component
type IFieldDetailRelationProps = IDynamicFieldProps;

/**
 * Component for show organization selection fields
 * @param props see IEmployeeSuggestionsProps
 */
export function FieldDetailRelation(props: IFieldDetailRelationProps) {
  const { fieldInfo,belong } = props;
  const relationBelong = fieldInfo.relationData?.fieldBelong ? fieldInfo.relationData?.fieldBelong : TEXT_EMPTY;
  const displayTab = fieldInfo?.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo?.relationData ? fieldInfo?.relationData.format : 0;
  const extensionData = props.extensionData ? props.extensionData : "";
  /**
   * Render the organization selection component 
   */
  const renderComponent = () => {
    if (relationBelong) {
      if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
        switch (relationBelong) {
          case DefineRelationSuggest.PRODUCT:
            return (<RelationProductDetail fieldInfo={props?.fieldInfo} extensionData={extensionData} belong={belong}/>)
          case DefineRelationSuggest.CUSTOMER:
            return (<RelationCustomerDetail fieldInfo={props?.fieldInfo} extensionData={extensionData} belong={belong} />)
          case DefineRelationSuggest.EMPLOYEE:
            return (<RelationEmployeeDetail fieldInfo={props?.fieldInfo} extensionData={extensionData} belong={belong} />)
          case DefineRelationSuggest.PRODUCT_TRADING:
            return (<RelationProductTradingDetail fieldInfo={props?.fieldInfo}/>);
          case DefineRelationSuggest.BUSINESS_CARD:
            return (<RelationBusinessCardScreen fieldInfo={props?.fieldInfo} extensionData={extensionData} belong={belong}/>);
          case DefineRelationSuggest.TASK:
            return (<RelationTaskDetail fieldInfo={props?.fieldInfo} extensionData={extensionData} />);
          case DefineRelationSuggest.MILE_STONE:
            return (<RelationMilestonDetail fieldInfo={props?.fieldInfo} extensionData={extensionData} belong={belong} />);
          default:
            return (<View />);
        }
      } else {
        return (
          <View>
          </View>
        )
      }
    } else {
      return (
        <View>
        </View>
      )
    }
  }

  return renderComponent();
}
