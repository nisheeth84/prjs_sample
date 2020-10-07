import React, { useState } from "react";
import {
  FlatList,
  RefreshControl
} from "react-native";
import { listProductStyles } from "../styles";
import { ProductTrading } from "../product-type";
import { ListEmptyComponent } from "../../../shared/components/list-empty/list-empty";
import { ProductTradingItem } from "../../../shared/components/product-trading-item";
export interface ProductsProps {
  /**
   * list products passed on
   */
  listProduct: Array<ProductTrading>;
  /**
   * check show checkbox or icon to detail
   */
  edit: boolean;
  /**
   * set checkbox
   */
  onCheck?: Function;
  /**
   * navigate to employee detail screen
   */
  onPressEmployeesDetail: Function;
  /**
   * pull to refresh
   */
  onPullToRefresh: Function;
  /**
   * fieldInfo
   */
  fieldInfoArr?: any[]
}

/**
 * component list products for status
 * @param param0
 */
export const ListProduct: React.FC<ProductsProps> = ({
  listProduct,
  edit,
  onCheck = () => { },
  onPullToRefresh = () => { },
  fieldInfoArr = []
}) => {

  const [refreshData, setRefreshData] = useState(false);

  return (
    <FlatList
      style={
        edit
          ? listProductStyles.marginTabEditActive
          : listProductStyles.marginTabEdit
      }
      keyExtractor={(item) => item.productTradingId.toString()}
      extraData={listProduct?.length}
      data={listProduct}
      renderItem={({ item, index }) => {
        return (
          <ProductTradingItem
            edit={edit}
            onCheck={() => {
              onCheck(item, index)
            }}
            fieldInfoArr={fieldInfoArr}
            item={item}
            index={index}
          />
        )
      }}
      ListEmptyComponent={< ListEmptyComponent />}
      refreshControl={
        < RefreshControl
          refreshing={refreshData}
          onRefresh={() => {
            setTimeout(() => {
              setRefreshData(false);
            }, 1000)
            onPullToRefresh();
          }}
        />
      }
    />
  );
};
