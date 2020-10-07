import * as React from "react";
import { View } from "react-native";
import { ProductDetailTrading } from "../../products-repository";
import { ProductTradingItem } from "./product-trading-item";
import { EnumTradingVersion } from "../../../../config/constants/enum";

interface ProductTradingListProps {
  // List data
  data: Array<ProductDetailTrading>;
  // check accept to open customer detail screen
  openCustomerDetail: boolean;
  // version of trading item
  version?: number;
}

/**
 * Component show product trading item
 * @param props
 */

export const ProductTradingList: React.FC<ProductTradingListProps> = ({
  data = [],
  openCustomerDetail = false,
  version = EnumTradingVersion.DETAIL_GENERAL_INFO,
}) => {
  return (
    <View>
      {data?.length > 0 &&
        data.map((tradingItem: ProductDetailTrading) => {
          return (
            <ProductTradingItem
              key={tradingItem.productTradingId.toString()}
              customerName={tradingItem.customerName}
              endPlanDate={tradingItem.endPlanDate}
              progressName={tradingItem.progressName}
              amount={tradingItem.amount}
              openCustomerDetail={openCustomerDetail}
              version={version}
              customerId={tradingItem.customerId}
              employeeId={tradingItem.employeeId}
              employeeName={tradingItem.employeeName}
              productId={tradingItem.productId}
              productName={tradingItem.productName}
            />
          );
        })}
    </View>
  );
};
