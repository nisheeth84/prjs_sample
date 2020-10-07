import * as React from "react";
import { View } from "react-native";
import { ProductDetailTrading } from "../../products-repository";
import { ProductSetTradingItem } from "./product-set-trading-item";
import { EnumTradingVersion } from "../../../../config/constants/enum";

interface ProductTradingListProps {
  // List data
  data: Array<ProductDetailTrading>;
  // check accept to open customer detail screen
  openCustomerDetail: boolean;
  // check version
  version: number;
}

/**
 * Component show product set trading item
 * @param props
 */

export const ProductTradingList: React.FC<ProductTradingListProps> = ({
  data = [],
  openCustomerDetail = false,
  version = EnumTradingVersion.DETAIL_TRADING_TAB,
}) => {
  return (
    <View>
      {data?.length > 0 &&
        data.map((tradingItem: ProductDetailTrading) => {
          return (
            <ProductSetTradingItem
              key={tradingItem.productTradingId.toString()}
              customerName={tradingItem.customerName}
              endPlanDate={tradingItem.endPlanDate}
              progressName={tradingItem.progressName}
              amount={tradingItem.amount}
              openCustomerDetail={openCustomerDetail}
              employeeName={tradingItem.employeeName}
              version={version}
              customerId={tradingItem.customerId}
              employeeId={tradingItem.employeeId}
              productId={tradingItem.productId}
              productName={tradingItem.productName}
            />
          );
        })}
    </View>
  );
};
