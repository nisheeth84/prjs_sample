import React from 'react';
import { DefineRelationSuggest, RelationDisplay, TypeRelationSuggest } from '../../../../config/constants/enum';
import { RelationBusinessCardScreen } from '../../dynamic-form/control-field/detail/relation/business-cards/relation-business-card-screen';
import { RelationCustomerDetail } from '../../dynamic-form/control-field/detail/relation/customer/relation-customer-detail-screen';
import { RelationEmployeeDetail } from '../../dynamic-form/control-field/detail/relation/employee/relation-employee-detail-screen';
import { RelationMilestonDetail } from '../../dynamic-form/control-field/detail/relation/milestone/relation-milestone-detail';
import { RelationProductDetail } from '../../dynamic-form/control-field/detail/relation/product/relation-product-detail';
import { RelationProductTradingDetail } from '../../dynamic-form/control-field/detail/relation/product-trading/relation-products-trading-detail';
import { RelationTaskDetail } from '../../dynamic-form/control-field/detail/relation/task/relation-task-detail';
import { useRoute } from '@react-navigation/native';
import { View } from 'react-native';

/**
 * Component for common screen
 * @param route
 */

interface Route {
  [route: string]: any;
}
export const CommonScreen: React.FC = () => {
  const route: Route = useRoute()
  const { fieldInfoData } = route?.params ? route?.params : "";
  const displayTab = fieldInfoData?.relationData ? fieldInfoData.relationData.displayTab : 0;
  const typeSuggest = fieldInfoData?.relationData ? fieldInfoData?.relationData.format : 0;

  const renderRelation = () => {
    if (fieldInfoData && (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI)) {
      switch (fieldInfoData.relationData.fieldBelong) {
        case DefineRelationSuggest.PRODUCT:
          return (<RelationProductDetail fieldInfo={fieldInfoData} />)
        case DefineRelationSuggest.CUSTOMER:
          return (<RelationCustomerDetail fieldInfo={fieldInfoData} />)
        case DefineRelationSuggest.EMPLOYEE:
          return (<RelationEmployeeDetail fieldInfo={fieldInfoData} />)
        case DefineRelationSuggest.PRODUCT_TRADING:
          return (<RelationProductTradingDetail fieldInfo={fieldInfoData} />);
        case DefineRelationSuggest.BUSINESS_CARD:
          return (<RelationBusinessCardScreen fieldInfo={fieldInfoData} />);
        case DefineRelationSuggest.TASK:
          return (<RelationTaskDetail fieldInfo={fieldInfoData} />);
        case DefineRelationSuggest.MILE_STONE:
          return (<RelationMilestonDetail fieldInfo={fieldInfoData} />);
        default:
          return (<View />);
      }
    } else {
      return (
        <View />
      )
    }
  }
  return renderRelation()
}
