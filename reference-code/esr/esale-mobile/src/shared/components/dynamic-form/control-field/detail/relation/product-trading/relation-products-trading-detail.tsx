import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { translate } from "../../../../../../../config/i18n";
import { Icon } from "../../../../../icon";
import { ListProductStyles } from "./product-trading-styles";
import { Products, RelationProductTradingProps } from "./product-trading-type";
import { messages } from "./products-manage-messages";
import { RelationDisplay, TypeRelationSuggest } from "../../../../../../../config/constants/enum";
import StringUtils from "../../../../../../util/string-utils";
import { FIELD_LABLE, TEXT_EMPTY } from "../../../../../../../config/constants/constants";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../../../../../../modules/login/authorization/authorization-selector";

/**
 * component list products for status
 * @param param0
 */
export function RelationProductTradingDetail(props: RelationProductTradingProps) {
  const [listProductTrading, setListProductTrading] = useState<Products[]>();
  const displayTab = props?.fieldInfo?.relationData ? props?.fieldInfo?.relationData.displayTab : 0;
  const typeSuggest = props?.fieldInfo?.relationData ? props?.fieldInfo?.relationData.format : 0;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = useState(StringUtils.getFieldLabel(props?.fieldInfo, FIELD_LABLE, languageCode));
  // const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  // const extensionData = useSelector(extensionDataSelector);

  useEffect(() => {
    // handleGetRelationProductTradings();
    setListProductTrading(listProductDummy);
  }, []);

  /**
   * detailProductTrading 
   */
  const detailProductTrading = (productItem: any) => {
    navigation.navigate("business-card-detail", { data: productItem })
  };

  /**
  * Call api get relation product trading
  */
  // const handleGetRelationProductTradings = async () => {
  //   const resProductTradings = await getRelationProductTradings({
  //     productTradingIds: extensionData.extensionData,
  //   });
  //   if (resProductTradings.data) {
  //     setListProductTrading(resProductTradings.data);
  //   }
  // }

  /**
   * render product trading
   */
  const renderItem = (item: Products, index: number) => {
    return (

      <TouchableOpacity style={ListProductStyles.containerProduct} key={item.productId.toString() + index}
        onPress={() => detailProductTrading(item)}
      >
        <View style={ListProductStyles.boxText}>
          <Text style={ListProductStyles.txtProductsInfo}>
            {item.customerName}
          </Text>
          <Text style={ListProductStyles.txtProductsName}>
            {`${translate(messages.productsManageTradingProductName)} ${
              item.productName
              }`}
          </Text>
          <Text style={ListProductStyles.txtProductsInfo}>
            {`${translate(messages.productsManageAmount)}:  ¥${item.amount}`}
          </Text>
          <Text style={ListProductStyles.txtProductsInfo}>
            {`${translate(messages.productsManageResponsible)}: ${
              item.employeeName
              }`}
          </Text>
          <Text style={ListProductStyles.txtProductsInfo}>
            {`${translate(messages.productsManageCompletionDate)}: ${
              item.endPlanDate
              }`}
          </Text>
        </View>
        <Icon name="iconArrowRight" style={ListProductStyles.iconArrow} />
      </TouchableOpacity>
    );
  };

  /**
   * reader product trading tab
   */
  const renderProductTradingTab = () => {
    return (
      <View>
        {
          listProductTrading?.map((item: Products, index: number) => (
            renderItem(item, index)
          ))
        }
      </View>
    );
  };

  /**
   * reader product trading list
   */
  const renderProductTradingList = () => {
    return (
      <View>
        <Text style={ListProductStyles.labelHeader}>{title}</Text>
        <View style={ListProductStyles.mainContainer}>
          {
            listProductTrading &&
            listProductTrading.map((productTrading, index) =>
              <View style={ListProductStyles.employeeContainer}>
                <TouchableOpacity onPress={() => detailProductTrading(productTrading.productTradingId)} >
                  <Text style={ListProductStyles.employeeText}>{productTrading.productName}</Text>
                </TouchableOpacity>
                {
                  ++index !== listProductTrading.length &&
                  <Text style={ListProductStyles.employeeText}>,</Text>
                }

              </View>
            )
          }
        </View>
      </View>

    );
  };

  return (
    <View>
      {
         (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI)  && renderProductTradingTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderProductTradingList()
      }
    </View>
  );

}

const listProductDummy = [
  {
    productTradingId: 1,
    customerId: 1,
    productTradingProgressId: 1,
    progressName: "finish",
    progressOrder: 1,
    isAvailable: true,
    productId: 1,
    productName: "社員A",
    quantity: 1,
    price: 3000,
    amount: 1000,
    customerName: "社員A",
    employeeId: 1,
    employeeName: "",
    endPlanDate: "2020/12/12",
    orderPlanDate: "2020/12/12",
    memo: "ABC",
    updateDate: "2020/12/12",
    productTradingData: [
      { fieldType: 10, key: "text1", value: "Hello word" },
      { fieldType: 10, key: "text1", value: "Hello word" },
    ],
  },
  {
    productTradingId: 2,
    customerId: 1,
    productTradingProgressId: 1,
    progressName: "finish",
    progressOrder: 1,
    isAvailable: true,
    productId: 1,
    productName: "社員A",
    quantity: 1,
    price: 3000,
    amount: 1000,
    customerName: "社員A",
    employeeId: 1,
    employeeName: "社員A",
    endPlanDate: "2020/12/12",
    orderPlanDate: "2020/12/12",
    memo: "ABC",
    updateDate: "2020/12/12",
    productTradingData: [
      { fieldType: 10, key: "text1", value: "Hello word" },
      { fieldType: 10, key: "text1", value: "Hello word" },
    ],
  },
  {
    productTradingId: 3,
    customerId: 1,
    productTradingProgressId: 1,
    progressName: "finish",
    progressOrder: 1,
    isAvailable: true,
    productId: 1,
    productName: "社員A",
    quantity: 1,
    price: 3000,
    amount: 1000,
    customerName: "社員A",
    employeeId: 1,
    employeeName: "社員A",
    endPlanDate: "2020/12/12",
    orderPlanDate: "2020/12/12",
    memo: "ABC",
    updateDate: "2020/12/12",
    productTradingData: [
      { fieldType: 10, key: "text1", value: "Hello word" },
      { fieldType: 10, key: "text1", value: "Hello word" },
    ],
  },
  {
    productTradingId: 4,
    customerId: 1,
    productTradingProgressId: 1,
    progressName: "finish",
    progressOrder: 1,
    isAvailable: true,
    productId: 1,
    productName: "A",
    quantity: 1,
    price: 3000,
    amount: 1000,
    customerName: "社員A",
    employeeId: 1,
    employeeName: "社員A",
    endPlanDate: "2020/12/12",
    orderPlanDate: "2020/12/12",
    memo: "ABC",
    updateDate: "2020/12/12",
    productTradingData: [
      { fieldType: 10, key: "text1", value: "Hello word" },
      { fieldType: 10, key: "text1", value: "Hello word" },
    ],
  },
  {
    productTradingId: 5,
    customerId: 1,
    productTradingProgressId: 1,
    progressName: "finish",
    progressOrder: 1,
    isAvailable: true,
    productId: 1,
    productName: "社員A",
    quantity: 1,
    price: 3000,
    amount: 1000,
    customerName: "社員A",
    employeeId: 1,
    employeeName: "社員A",
    endPlanDate: "2020/12/12",
    orderPlanDate: "2020/12/12",
    memo: "ABC",
    updateDate: "2020/12/12",
    productTradingData: [
      { fieldType: 10, key: "text1", value: "Hello word" },
      { fieldType: 10, key: "text1", value: "Hello word" },
    ],
  },
  {
    productTradingId: 6,
    customerId: 1,
    productTradingProgressId: 1,
    progressName: "finish",
    progressOrder: 1,
    isAvailable: true,
    productId: 1,
    productName: "社員A",
    quantity: 1,
    price: 3000,
    amount: 1000,
    customerName: "社員A",
    employeeId: 1,
    employeeName: "社員A",
    endPlanDate: "2020/12/12",
    orderPlanDate: "2020/12/12",
    memo: "ABC",
    updateDate: "2020/12/12",
    productTradingData: [
      { fieldType: 10, key: "text1", value: "Hello word" },
      { fieldType: 10, key: "text1", value: "Hello word" },
    ],
  },
];