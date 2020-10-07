import React, { useEffect, useState } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import {
  statusSelector,
  productsDetailSelector,
} from "./product-details-selector";
import { messages } from "./product-details-messages";
import { translate } from "../../../config/i18n";
import { useSelector, useDispatch } from "react-redux";
// Use this when API work fine
import {
  getProductDetail,
  ProductDetailResponse,
} from "../products-repository";
import { productActions } from "./product-details-reducer";
import { ProductGeneralInfo } from "../product-general-info";
import { AppBarProducts } from "../../../shared/components/appbar/appbar-products";
import { ProductDetailsStyles } from "./product-details-style";
import { ProductGeneralInforTabScreen } from "./tab-general-info/product-general-infor-tab-screen";
import { ProductHistoryTabScreen } from "./tab-history/product-history-tab-screen";
import { useRoute } from "@react-navigation/native";
import { ProductDetailScreenRouteProp } from "../../../config/constants/root-stack-param-list";
import { EnumStatus } from "../../../config/constants/enum-status";
import { CommonStyles } from "../../../shared/common-style";
import { getUrl, productDetailUrl } from "../../../config/constants/url";
import _ from "lodash";
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import { ListEmptyComponent } from "../../../shared/components/list-empty/list-empty";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { ModalImage } from "../../../shared/components/modal-image";
import StringUtils from "../../../shared/util/string-utils";
import { commonTabActions } from "../../../shared/components/common-tab/common-tab-reducer";
import { CommonTab } from "../../../shared/components/common-tab/common-tab";
import { TradingProduction } from "./tab-trading/trading-products-screen";

/**
 * interface use for route params
 */
export interface RouteParams {
  productId: number;
}

/**
 * interface use for route
 */
export interface Routes {
  params?: RouteParams;
}

/**
 * Product detail screen
 */
export const ProductDetailsScreen = () => {
  const productDetail: Array<any> = useSelector(productsDetailSelector) || [];
  const authLoginSelector: any = useSelector(authorizationSelector);
  const statusGetProducts: EnumStatus = useSelector(statusSelector);
  const [productData, setProductData] = useState<any>();
  const naviRoute = useRoute<ProductDetailScreenRouteProp>();

  const [modalImg, setModalImg] = useState(false);
  const languageCode = authLoginSelector?.languageCode ?? TEXT_EMPTY;
  const [tabs, setTabs] = useState([]);

  const dispatch = useDispatch();
  /**
   * Call api and dispatch product data
   */
  useEffect(() => {
    // dispatch(productActions.getProductDetails(DUMMY_PRODUCT));
    // Call this function when API work fine
    dispatch(productActions.setStatus(EnumStatus.pending));
    async function getDataProducts() {
      let params = {
        productId: naviRoute.params?.productId,
      };
      const productDetailResponse = await getProductDetail(params, {});
      if (productDetailResponse) {
        handleErrorGetProductDetail(productDetailResponse);
        if (_.isEmpty(productData)) {
          setProductData(productDetailResponse?.data?.product || {});
        }
      }
    }
    getDataProducts();
  }, [naviRoute.params?.productId]);

  useEffect(() => {
    if (!_.isEmpty(productData)) {
      const fields: any = productData?.fieldInfo || [];
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
          extensionData: productData?.product?.productData || [],
        })
      );
        let tab: any = [
          {
            name: StringUtils.getFieldLabel(
              productData?.tabInfo[0],
              "tabLabel",
              languageCode
            ),
            component: ProductGeneralInforTabScreen,
          },
          {
            name: StringUtils.getFieldLabel(
              productData?.tabInfo[1],
              "tabLabel",
              languageCode
            ),
            component: TradingProduction,
          },
          {
            name: StringUtils.getFieldLabel(
              productData?.tabInfo[2],
              "tabLabel",
              languageCode
            ),
            component: () => (
              <ProductHistoryTabScreen
                productId={productData?.product?.productId || 0}
              />
            ),
          },
        ];
        setTabs(tab);
    }
  }, [productData]);

  /**
   * Handle received response
   * @param response
   */
  const handleErrorGetProductDetail = (response: ProductDetailResponse) => {
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
        dispatch(productActions.getProductDetails(response.data?.product));
        break;
      }
      default:
        break;
    }
  };

  /**
   * check status get product detail
   * @param status
   */
  const checkStatus = (status: EnumStatus) => {
    let product = productDetail[0];

    switch (status) {
      case EnumStatus.pending:
        return (
          <AppIndicator size={40} style={ProductDetailsStyles.loadingView} />
        );
      case EnumStatus.success:
        return (
          <>
            {product ? (
              <View style={CommonStyles.flex1}>
                <ScrollView style={ProductDetailsStyles.scrollView}>
                  <ProductGeneralInfo
                    productName={product.productName}
                    unitPrice={product.unitPrice}
                    productImagePath={product.productImagePath}
                    productCategoryName={product.productCategoryName}
                    onClick={() => {}}
                    isShowShare={true}
                    shareUrl={getUrl(
                      productDetailUrl,
                      authLoginSelector?.tenantId || TEXT_EMPTY,
                      naviRoute.params?.productId
                    )}
                    onPressImg={() =>
                      setModalImg(!!productDetail[0]?.productImagePath)
                    }
                  />
                </ScrollView>
                {tabs?.length > 0 && <CommonTab tabList={tabs} />}
              </View>
            ) : (
              <ListEmptyComponent />
            )}
          </>
        );
      default:
        return;
    }
  };

  return (
    <SafeAreaView style={ProductDetailsStyles.container}>
      <AppBarProducts
        name={translate(messages.productTitle)}
        hasBackButton={true}
      />
      {checkStatus(statusGetProducts)}
      <ModalImage
        visible={modalImg}
        imageUrl={productDetail[0]?.productImagePath}
        closeModal={() => setModalImg(false)}
      />
    </SafeAreaView>
  );
};
