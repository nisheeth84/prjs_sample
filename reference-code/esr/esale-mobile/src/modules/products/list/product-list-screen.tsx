import React, { useEffect, useState, useMemo } from "react";
import {
  Animated,
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "../../../shared/components/icon";
import { ProductItem } from "./product-list-item";
import {
  productsSelector,
  statusSelector,
  totalCountSelector,
  productCategoryNameSelector,
  productCategoryIdSelector,
  isContainCategoryChildSelector,
  isSetSelector,
} from "./product-list-selector";
import { messages } from "./product-list-messages";
import { translate } from "../../../config/i18n";
import { getProducts, ProductResponse } from "../products-repository";
import { productActions } from "./product-list-reducer";
import { ProductListScreenStyles } from "./product-list-style";
import { AppBarProducts } from "../../../shared/components/appbar/appbar-products";
import { productsDrawerSelector } from "../drawer/product-drawer-selector";
import { CommonStyles } from "../../../shared/common-style";
import { getCategoryFormat } from "../utils";
import { EnumStatus } from "../../../config/constants/enum-status";
import { ALL_PRODUCT_ID } from "./product-list-reducer";
import {
  orderSortSelector,
  categorySortSelector,
} from "../popup/popup-sort-selector";
import { ListEmptyComponent } from "../../../shared/components/list-empty/list-empty";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import {
  PlatformOS,
  SortType,
  FIELD_BELONG,
} from "../../../config/constants/enum";
import { getCustomFieldInfo } from "../../search/search-reponsitory";
import { ScreenName } from "../../../config/constants/screen-name";
import StringUtils from "../../../shared/util/string-utils";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { popupSortActions } from "../popup/popup-sort-reducer";
// import { LIMIT } from "../../../config/constants/constants";

// TODO use when api error
// const DUMMY_PRODUCT_RESPONSE = {
//   data: {
//     data: {
//       products: {
//         dataInfo: {
//           products: [
//             {
//               productId: 1,
//               productCategoryName: "カテゴリA",
//               productName: "商品A",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//             {
//               productId: 2,
//               productCategoryName: "カテゴリA",
//               productName: "商品B",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//             {
//               productId: 3,
//               productCategoryName: "カテゴリA",
//               productName: "商品A",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//             {
//               productId: 4,
//               productCategoryName: "カテゴリA",
//               productName: "商品B",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//             {
//               productId: 5,
//               productCategoryName: "カテゴリA",
//               productName: "商品A",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//             {
//               productId: 6,
//               productCategoryName: "カテゴリA",
//               productName: "商品B",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//             {
//               productId: 7,
//               productCategoryName: "カテゴリA",
//               productName: "商品A",
//               unitPrice: 12000,
//               productImagePath: "",
//               productImageName: "",
//             },
//           ],
//           productCategories: [
//             {
//               productCategoryId: 450,
//               productCategoryName:
//                 "カテゴリAカテゴリAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
//               productCategoryLevel: 1,
//               productCategoryChild: [
//                 {
//                   productCategoryId: 4501,
//                   productCategoryName: "カテゴリA1",
//                   productCategoryLevel: 1,
//                   productCategoryChild: [],
//                 },
//                 {
//                   productCategoryId: 4502,
//                   productCategoryName: "カテゴリA2",
//                   productCategoryLevel: 2,
//                   productCategoryChild: [],
//                 },
//               ],
//             },
//             {
//               productCategoryId: 574,
//               productCategoryName: "カテゴリB",
//               productCategoryLevel: 1,
//               productCategoryChild: [],
//             },
//             {
//               productCategoryId: 575,
//               productCategoryName: "カテゴリC",
//               productCategoryLevel: 1,
//               productCategoryChild: [
//                 {
//                   productCategoryId: 5751,
//                   productCategoryName: "カテゴリC1",
//                   productCategoryLevel: 1,
//                   productCategoryChild: [],
//                 },
//                 {
//                   productCategoryId: 5752,
//                   productCategoryName: "カテゴリC2",
//                   productCategoryLevel: 1,
//                   productCategoryChild: [
//                     {
//                       productCategoryId: 57521,
//                       productCategoryName: "カテゴリC21",
//                       productCategoryLevel: 1,
//                       productCategoryChild: [],
//                     },
//                     {
//                       productCategoryId: 57522,
//                       productCategoryName: "カテゴリC22",
//                       productCategoryLevel: 1,
//                       productCategoryChild: [],
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               productCategoryId: 576,
//               productCategoryName: "カテゴリD",
//               productCategoryLevel: 1,
//               productCategoryChild: [],
//             },
//           ],
//         },
//         recordCount: 11,
//         totalCount: 10,
//       },
//     },
//   },
// };

const LIMIT = 20;

/**
 * Component for show list of products
 * @param props
 */

export function ProductListScreen() {
  const navigation = useNavigation();
  const authState = useSelector(authorizationSelector);
  const products: Array<any> = useSelector(productsSelector);
  const statusGetProducts: EnumStatus = useSelector(statusSelector);
  const totalCount: number = useSelector(totalCountSelector);
  const productCategoryName: string = useSelector(productCategoryNameSelector);
  const productCategoryId: number | null = useSelector(
    productCategoryIdSelector
  );
  const productDrawer = useSelector(productsDrawerSelector);
  // TODO check contain child
  const isContainCategoryChild = useSelector(isContainCategoryChildSelector);
  const isSet = useSelector(isSetSelector);
  const [pageNumber, setPageNumber] = useState(0);
  const [pendingProcess, setPendingProcess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [listProduct, setListProduct] = useState<any>([]);
  let onEndReachedCalledDuringMomentum = true;
  const orderProps = useSelector(orderSortSelector);
  const sortByProps = useSelector(categorySortSelector);
  let flatListRef: any;
  const dispatch = useDispatch();

  /**
   * handle back button
   */
  const handleBackButtonClick = () => {
    return navigation.isFocused();
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);

  /**
   * call api getCustomFieldInfo
   */
  const getCustomFieldInfoFunc = async () => {
    const response = await getCustomFieldInfo({
      fieldBelong: FIELD_BELONG.PRODUCT,
    });

    if (response) {
      switch (response.status) {
        case 200:
          dispatch(productActions.saveCustomFieldsInfo(response.data));
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  };

  /**
   * Get data products
   */
  const getData = (page: number /*containCategoryChild: boolean = false*/) => {
    /**
     * Call api get products, use when api work fin
     */
    async function getDataProducts() {
      const params: any = {
        orderBy: [{ key: sortByProps, value: orderProps }],
        limit: LIMIT,
        offset: page * LIMIT,
        isContainCategoryChild,
        searchConditions: [],
        filterConditions: [],
        isOnlyData: isSet,
        isUpdateListInfo: isSet,
        productCategoryId,
      };
      if (!isSet) {
        params.orderBy = [];
      }
      const listProductResponse = await getProducts(params, {});
      if (listProductResponse) {
        handleErrorGetListProduct(listProductResponse);
      }
    }
    getDataProducts();
  };

  /**
   * get init list product
   */
  useEffect(() => {
    getData(pageNumber); // page => 0
    getCustomFieldInfoFunc();
  }, []);

  useEffect(() => {
    if (pageNumber > 0) {
      if (flatListRef) {
        flatListRef.scrollToIndex({ animated: false, index: 0 });
      }
      setPageNumber(0);
    } else {
      getData(0);
    }
  }, [orderProps, sortByProps]);

  useEffect(() => {
    if (flatListRef && listProduct.length > 0) {
      flatListRef.scrollToIndex({ animated: false, index: 0 });
    }
    setPageNumber(0);
    getData(0);
    setRefreshing(true);
  }, [productCategoryId, isContainCategoryChild]);

  /**
   * call api when offset change
   */
  useEffect(() => {
    if (products.length == LIMIT || pageNumber > 0) {
      getData(pageNumber);
      // setPendingProcess(true);
    }
  }, [pageNumber]);

  /**
   * Add new page of products
   */
  useEffect(() => {
    if (pageNumber > 0) {
      if (products.length > 0) {
        const newList = [...listProduct, ...products];
        setListProduct(newList);
        setPendingProcess(false);
      } else {
        setPendingProcess(true);
      }
    } else {
      const newList = products;
      setListProduct(newList);
    }
  }, [products]);

  useMemo(() => {
    if (!productDrawer) {
      setPageNumber(0);
      getData(0);
    }
  }, [productDrawer]);

  /**
   * Handle get list product
   * @param response
   */
  const handleErrorGetListProduct = (response: ProductResponse) => {
    setRefreshing(false);
    switch (response.status) {
      case 400: {
        break;
      }
      case 500: {
        break;
      }
      case 403: {
        break;
      }
      case 200: {
        dispatch(productActions.getProducts(response?.data));
        const { initializeInfor, dataInfo }: any = response?.data;
        if (!initializeInfor) {
          break;
        }
        const id = initializeInfor.initializeInfo.selectedTargetId;
        const categoryName = dataInfo.productCategories.find(
          (el: any) => el.productCategoryId === id
        )?.productCategoryName;

        const value = categoryName
          ? StringUtils.getFieldLabel(
              { categoryName },
              "categoryName",
              authState?.languageCode
            )
          : translate(messages.allProducts);
        dispatch(productActions.setCategoryName(value));
        dispatch(
          popupSortActions.updateSortCondition({
            order: initializeInfor.initializeInfo.orderBy[0].value,
            category: initializeInfor.initializeInfo.orderBy[0].key,
          })
        );
        break;
      }
      default:
        break;
    }
  };

  /**
   * On list end
   */
  const onListEnd = () => {
    if (
      !onEndReachedCalledDuringMomentum &&
      listProduct.length < totalCount &&
      listProduct.length > 0 &&
      !pendingProcess
    ) {
      const nextPage = pageNumber + 1;
      setPageNumber(nextPage);
    }
  };

  /**
   * loading footer
   */
  const loadingFooter = () => {
    return (
      <AppIndicator
        visible={listProduct.length > 0 && listProduct.length < totalCount}
      />
    );
  };

  /**
   * check status get product list
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    switch (status) {
      case EnumStatus.pending:
        return (
          <AppIndicator size={40} style={ProductListScreenStyles.container} />
        );
      case EnumStatus.success:
        return (
          <>
            {listProduct && (
              <FlatList
                scrollEnabled
                initialNumToRender={20}
                ref={(ref) => (flatListRef = ref)}
                data={listProduct}
                refreshing={Platform.OS === PlatformOS.IOS && refreshing}
                onRefresh={() => {
                  setPageNumber(0);
                  getData(0);
                  setRefreshing(true);
                }}
                renderItem={({ item }: any) => (
                  <ProductItem
                    productId={item.productId}
                    key={item.productId.toString()}
                    productName={item.productName}
                    unitPrice={item.unitPrice}
                    productImagePath={item.productImagePath}
                    productCategoryName={item.productCategoryName}
                    isSet={item.isSet}
                  />
                )}
                // bounces={false}
                extraData={listProduct}
                keyExtractor={(item: any) => item.productId.toString()}
                onEndReached={onListEnd}
                onEndReachedThreshold={0.8}
                ListFooterComponent={loadingFooter()}
                onMomentumScrollBegin={() => {
                  onEndReachedCalledDuringMomentum = false;
                }}
                ListEmptyComponent={<ListEmptyComponent />}
                ListHeaderComponent={
                  <AppIndicator
                    visible={Platform.OS === PlatformOS.ANDROID && refreshing}
                  />
                }
              />
            )}
          </>
        );
      default:
        return null;
    }
  };
  return (
    <View style={ProductListScreenStyles.container}>
      <AppBarProducts
        name={translate(messages.product)}
        hasBackButton={false}
      />
      <View style={ProductListScreenStyles.infoBlock}>
        {productCategoryId == ALL_PRODUCT_ID ? (
          <Text
            style={[
              ProductListScreenStyles.title,
              ProductListScreenStyles.bold,
              CommonStyles.textBlack,
            ]}
          >
            {`${translate(messages.allProducts)}（${totalCount || 0}${translate(
              messages.productCase
            )}）`}
          </Text>
        ) : (
          <Text
            style={[
              ProductListScreenStyles.title,
              ProductListScreenStyles.bold,
              CommonStyles.textBlack,
            ]}
          >
            {((!isSet && (totalCount || 0).toString()) || isSet) &&
              `${getCategoryFormat(productCategoryName)}（${
                totalCount || 0
              }${translate(messages.productCase)}）`}
          </Text>
        )}

        <View style={ProductListScreenStyles.firstRow}>
          <View style={ProductListScreenStyles.iconBlock}>
            <TouchableOpacity
              onPress={() => navigation.navigate(ScreenName.PRODUCT_SORT)}
            >
              <Icon
                name={orderProps === SortType.ASC ? "ascending" : "descending"}
                style={ProductListScreenStyles.iconDescendingButton}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={ProductListScreenStyles.listProduct}>
        {checkStatus(statusGetProducts)}
      </View>
    </View>
  );
}
