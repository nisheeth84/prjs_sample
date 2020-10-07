import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from '../../../../../icon';
import { useNavigation, StackActions } from '@react-navigation/native';
import ProductListStyles from './product-suggest-styles';
import { RelationProductProps } from './product-type';
import StringUtils from '../../../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import { RelationDisplay, TypeRelationSuggest, DefineFieldType, FIELD_BELONG } from '../../../../../../../config/constants/enum';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import { getRelationData } from '../relation-detail-repositoty';
import { extensionDataSelector } from '../../../../../common-tab/common-tab-selector';
import { ScreenName } from '../../../../../../../config/constants/screen-name';
import { getProducts } from '../../../../../../../modules/products/products-repository';
import { ProductListItemStyles } from '../../../../../../../modules/products/list/product-list-style';
import { ProductGeneralInfo } from '../../../../../../../modules/products/product-general-info';

/**
 * Component for searching text fields
 * @param props see RelationProductProps
 */
export function RelationProductDetail(props: RelationProductProps) {
  const [responseApiProduct, setResponseApiProduct] = useState<any>([]);
  const { fieldInfo } = props;
  const displayTab = fieldInfo?.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo?.relationData ? fieldInfo?.relationData.format : 0;
  const fieldBelong = fieldInfo.relationData.fieldBelong;
  const displayFieldIds = fieldInfo.relationData.displayFieldId;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = useState(StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode));
  const navigation = useNavigation();
  const extensionData = props?.extensionData ? props?.extensionData : useSelector(extensionDataSelector);
  const [relationData, setRelationData] = useState<any>();

  // label product category name
  //const PRODUCT_CATEGORY_NAME = 'productCategoryName';

  /**
   * Handling after first render
   */
  useEffect(() => {
    if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
      handleGetRelationProductsList();
    } else if (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) {
      handleGetRelationProductsTab();
    }
  }, []);

  /**
  * Call api get relation product list
  */
  const handleGetRelationProductsList = async () => {
    const productData: any = extensionData.find((item: any) => (item.fieldType === DefineFieldType.RELATION && item.key === fieldInfo.fieldName));
    const productIds: [] = JSON.parse(productData.value);
    if (productIds && productIds.length > 0) {
      const resProducts = await getRelationData({
        listIds: productIds,
        fieldBelong: fieldBelong,
        fieldIds: Array.isArray(displayFieldIds) ? displayFieldIds : [displayFieldIds]
      });
      if (resProducts?.data?.relationData) {
        setRelationData(resProducts.data.relationData);
      }
    }
  }

  /**
  * Call api get relation product tab
  */
  const handleGetRelationProductsTab = async () => {
    const productData: any = extensionData.find((item: any) => (item.fieldType === DefineFieldType.RELATION && item.key === fieldInfo.fieldName));
    const productIds: number[] = JSON.parse(productData.value);
    // const resProducts = await getRelationProducts({
    //   productIds: productIds,
    // });
    // if (resProducts?.data?.products) {
    //   setResponseApiProduct(resProducts.data.products);
    // }
    const params: any = {
      orderBy: [],
      offset: 0,
      searchConditions: [],
      filterConditions: [],
    };
    const listProductResponse = await getProducts(params, {});
    if (listProductResponse?.data?.dataInfo?.products) {
      listProductResponse.data.dataInfo.products = listProductResponse.data.dataInfo.products.filter((item: any) => productIds.includes(item.productId))
      setResponseApiProduct(listProductResponse.data.dataInfo.products);
    }
  }

  /**
 * Detail product
 * @param productId
 */
  const detailProductList = (productId: any) => {
    if (fieldInfo.fieldBelong == FIELD_BELONG.PRODUCT) {
      navigation.dispatch(
        StackActions.push(ScreenName.PRODUCT_DETAIL, { productId: productId })
      );
    } else {
      navigation.navigate(ScreenName.PRODUCT_DETAIL, { productId: productId });
    }
  };

  // const parseJsonName = (inputName: any) => {
  //   return StringUtils.getFieldLabel(inputName, PRODUCT_CATEGORY_NAME, languageCode);
  // }

  const onClickItem = (isSet: any, productId: any) => {
      if (isSet) {
        navigation.navigate(ScreenName.PRODUCT, {
          screen: ScreenName.PRODUCT_SET_DETAIL,
          params: { productSetId: productId },
        });
      } else {
        navigation.navigate(ScreenName.PRODUCT, {
          screen: ScreenName.PRODUCT_DETAIL,
          params: { productId: productId },
        });
      }
  };

  /**
   * reader product tab
   */
  const renderProductTab = () => {
    return (
      <View>
        <FlatList
          data={responseApiProduct}
          keyExtractor={item => item.productId.toString()}
          renderItem={({ item }: { item: any }) =>
            // <ProductItem
            //   productId={item.productId}
            //   key={item.productId.toString()}
            //   productName={item.productName}
            //   unitPrice={item.unitPrice}
            //   productImagePath={item.productImagePath}
            //   productCategoryName={item.productCategoryName}
            //   isSet={item.isSet}
            // />
            <TouchableOpacity
              style={ProductListItemStyles.inforProduct}
              onPress={() => onClickItem(item.isSet, item.productId)}
            >
              <View style={ProductListItemStyles.inforProductRow}>
                <ProductGeneralInfo
                  productName={item.productName}
                  unitPrice={item.unitPrice}
                  productImagePath={item.productImagePath}
                  productCategoryName={item.productCategoryName}
                  onClick={() => onClickItem(item.isSet, item.productId)}
                  numberOfLineProps={1}
                />
                <Icon name="arrowRight" />
              </View>
            </TouchableOpacity>
          }
        />
      </View>
    );
  };

  const renderProductList = () => {
    return (
      <View>
        <Text style={ProductListStyles.labelHeader}>{title}</Text>
        <View style={ProductListStyles.mainContainer}>
          {
            relationData ? relationData.map((data: any, index: number) =>
              <View style={ProductListStyles.employeeContainer} key={index}>
                <TouchableOpacity onPress={() => detailProductList(data.recordId)} >
                  <Text>
                    {data.dataInfos.length !== 0 &&
                      data.dataInfos.map((_item: any, idx: number) => {
                        return (
                          <Text key={idx} style={ProductListStyles.employeeText}>{data.recordId}</Text>
                        );
                      })}
                  </Text>
                </TouchableOpacity>
                {

                  ++index !== relationData.length
                  && relationData.length > 1
                  && <Text style={ProductListStyles.employeeText}>,</Text>
                }
              </View>
            ) : (<View><Text></Text></View>)
          }
        </View>
      </View >

    );
  };

  return (
    <View>
      {
        (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) && renderProductTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderProductList()
      }
    </View>
  );

}