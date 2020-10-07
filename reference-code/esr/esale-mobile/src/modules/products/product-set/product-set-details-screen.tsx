import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import {
  productSetDetailSelector,
  statusSetSelector,
  productSetDetailTradingGeneralInfoSelector,
  productSetTabInfoSelector,
} from "./product-set-details-selector";
import { messages } from "./product-set-details-messages";
import { translate } from "../../../config/i18n";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductSetDetail,
  ProductSetDetailResponse,
} from "../products-repository";
import { productActions } from "./product-set-details-reducer";
import { ProductListScreenStyles } from "../list/product-list-style";
import { ProductGeneralInfo } from "../product-general-info";
import { AppBarProducts } from "../../../shared/components/appbar/appbar-products";
import { ProductSetDetailsStyles } from "./product-set-details-style";
import { ProductGeneralInforTabScreen } from "./tab-general-info/product-set-general-infor-tab-screen";
import { ProductSetTradingTabScreen } from "./tab-trading/product-set-trading-tab-screen";
import { ProductSetHistoryTabScreen } from "./tab-history/product-set-history-tab-screen";
import { useRoute } from "@react-navigation/native";
import { ProductSetDetailScreenRouteProp } from "../../../config/constants/root-stack-param-list";
import { EnumStatus } from "../../../config/constants/enum-status";
import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { getUrl, productSetDetailUrl } from "../../../config/constants/url";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import { ListEmptyComponent } from "../../../shared/components/list-empty/list-empty";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { ModalImage } from "../../../shared/components/modal-image";
import StringUtils from "../../../shared/util/string-utils";
import { commonTabActions } from "../../../shared/components/common-tab/common-tab-reducer";
import { CommonTab } from "../../../shared/components/common-tab/common-tab";
import _ from "lodash";

const Tab = createMaterialTopTabNavigator();

/**
 * Product detail screen
 */

export const ProductSetDetailsScreen = () => {
  const authLoginSelector: any = useSelector(authorizationSelector);
  const tabInfo: Array<any> = useSelector(productSetTabInfoSelector) || [];
  const productSetDetail: Array<any> = useSelector(productSetDetailSelector);
  const statusGetProducts: EnumStatus = useSelector(statusSetSelector);
  const productSetDetailTradingGeneralInfos: Array<any> = useSelector(
    productSetDetailTradingGeneralInfoSelector
  );
  const productDetailTradingGeneralInfo =
    (productSetDetailTradingGeneralInfos || []).length > 0
      ? productSetDetailTradingGeneralInfos[0]
      : undefined;
  const productTradingBadge =
    productDetailTradingGeneralInfo?.productTradings?.productTradingBadge || 0;
  const languageCode = authLoginSelector?.languageCode ?? TEXT_EMPTY;
  const [tabs, setTabs] = useState<any>([]);
  const [productSetData, setProductSetData] = useState<any>({});

  const [modalImg, setModalImg] = useState(false);

  const route = useRoute<ProductSetDetailScreenRouteProp>();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productActions.setStatusSet(EnumStatus.pending));
    async function getDataProducts() {
      let params: any = {
        productId: route.params?.productSetId,
        isContainDataSummary: false,
      };
      // dispatch(productActions.getProductSetDetails(DUMMY_PRODUCT_SET.dataInfo));
      const productSetDetailResponse = await getProductSetDetail(params, {});

      if (productSetDetailResponse) {
        handleErrorGetProductDetail(productSetDetailResponse);
        if (_.isEmpty(productSetData)) {
          setProductSetData(productSetDetailResponse?.data?.productSet);
        }
      }
    }
    getDataProducts();
  }, [route.params?.productSetId]);

  useEffect(() => {
    if (!_.isEmpty(productSetData)) {
      const fields: any = productSetData?.fieldInfoProduct || [];
      if (fields) {
        const relationFieldInfos = fields.filter(
          (element: any) => element.fieldType === 17
        );

        dispatch(
          commonTabActions.setFieldInfos({
            key: "DetailScreen",
            fieldInfos: relationFieldInfos,
          })
        );
      } else {
        dispatch(
          commonTabActions.setFieldInfos({
            key: "DetailScreen",
            fieldInfos: [],
          })
        );
      }
      dispatch(
        commonTabActions.setExtensionData({
          extensionData: productSetData?.dataInfo?.productSet?.productData || [],
        })
      );
      let tab: any = [
        {
          name: StringUtils.getFieldLabel(
            productSetData?.tabInfo[0],
            "tabLabel",
            languageCode
          ),
          component: ProductGeneralInforTabScreen,
        },
        {
          name: StringUtils.getFieldLabel(
            productSetData?.tabInfo[1],
            "tabLabel",
            languageCode
          ),
          component: ProductSetTradingTabScreen,
        },
        {
          name: StringUtils.getFieldLabel(
            productSetData?.tabInfo[2],
            "tabLabel",
            languageCode
          ),
          component: () => (
            <ProductSetHistoryTabScreen
              productSetId={productSetData?.product?.productId || 0}
            />
          ),
        },
      ];
      setTabs(tab);
    }
  }, [productSetData]);

  const handleErrorGetProductDetail = (response: ProductSetDetailResponse) => {
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
        dispatch(
          productActions.getProductSetDetails(
            response.data?.productSet?.dataInfo
          )
        );
        dispatch(
          productActions.setFieldInfo(
            response.data?.productSet?.fieldInfoProduct
          )
        );
        dispatch(
          productActions.setFieldInfoSet(
            response.data?.productSet?.fieldInfoProductSet
          )
        );
        dispatch(productActions.setTabInfo(response.data?.productSet?.tabInfo));
        break;
      }
      default:
        break;
    }
  };

  /**
   * check status get product set detail
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    let productSet =
      (productSetDetail || []).length > 0 ? productSetDetail[0] : undefined;
    switch (status) {
      case EnumStatus.pending:
        return (
          <AppIndicator size={40} style={ProductListScreenStyles.container} />
          // <View style={ProductListScreenStyles.container}>
          //   <ActivityIndicator size="large" color="#0000ff" />
          // </View>
        );
      case EnumStatus.success:
        return (
          productSet && (
            <ScrollView style={ProductListScreenStyles.scrollView}>
              <ProductGeneralInfo
                productName={productSet.productName}
                unitPrice={productSet.unitPrice}
                productImagePath={productSet.productImagePath}
                productCategoryName={productSet.productCategoryName}
                onClick={() => {}}
                isShowShare={true}
                shareUrl={getUrl(
                  productSetDetailUrl,
                  authLoginSelector?.tenantId || TEXT_EMPTY,
                  route.params?.productSetId
                )}
                onPressImg={() => setModalImg(!!productSet.productImagePath)}
              />
            </ScrollView>
          )
        );
      default:
        return;
    }
  };

  // const renderTabs = () => {
  //   return [
  //     {
  //       name: "basicInfo",
  //       component: ProductGeneralInforTabScreen,
  //       initialParams: {
  //         tabBarLabel: translate(messages.basicInfo)
  //       }
  //     },
  //     {
  //       name: "tradingProduct",
  //       component: ProductSetTradingTabScreen,
  //       initialParams: {
  //         tabBarLabel: translate(messages.tradingProduct)
  //       }
  //     },
  //     {
  //       name: "changeLog",
  //       component: ProductSetHistoryTabScreen,
  //       initialParams: {
  //         productSetId: route.params?.productSetId,
  //         tabBarLabel: translate(messages.changeLog)
  //       }
  //     }
  //   ].map((item: any, index: number) => {
  //     item = {
  //       ...item,
  //       initialParams: {
  //         ...item.initialParams,
  //         tabBarLabel: StringUtils.getFieldLabel(tabInfo[index], 'tabLabel', languageCode) || item.initialParams.tabBarLabel
  //       }
  //     }
  //     return <Tab.Screen key={index} {...item} />
  //   })
  // }

  const productSet =
    (productSetDetail || []).length > 0 ? productSetDetail[0] : undefined;

  /**
   * render tab bar
   */
  return (
    <SafeAreaView style={ProductSetDetailsStyles.container}>
      <AppBarProducts
        name={translate(messages.productTitle)}
        hasBackButton={true}
      />
      {productSetDetail && productSetDetail[0] ? (
        <>
          {checkStatus(statusGetProducts)}
          {statusGetProducts === EnumStatus.success && tabs?.length > 0 && (
            <CommonTab tabList={tabs} />
          )}
        </>
      ) : (
        <ListEmptyComponent />
      )}
      <ModalImage
        visible={modalImg}
        imageUrl={productSet?.productImagePath}
        closeModal={() => setModalImg(false)}
      />
    </SafeAreaView>
  );
};
