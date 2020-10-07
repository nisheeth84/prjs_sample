import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { translate } from "../../../../config/i18n";
import { messages } from "../product-details-messages";
import { theme } from "../../../../config/constants";
import { ProductDetailSetInclude } from "../../products-repository";
import { ProductGeneralInfoItem } from "./product-general-info-item";
import {
  productsDetailSelector,
  productDetailSetIncludeSelector,
  productDetailTradingGeneralInfoSelector,
  productFieldInfoSelector,
  productTypesSelector,
} from "../product-details-selector";
import { ProductSetIncludeItem } from "./product-set-include-item";
import { ProductDetailsStyles } from "../product-details-style";
import { ProductTradingList } from "../tab-trading/product-trading-list";
import { getJapanPrice, formatJaPrice } from "../../utils";
import { DynamicControlField } from "../../../../shared/components/dynamic-form/control-field/dynamic-control-field";
import {
  ControlType,
  AvailableFlag,
  DefineFieldType,
  EnumTradingVersion,
  FIELD_NAME,
  LanguageCode,
  RelationDisplay,
} from "../../../../config/constants/enum";
import { ScrollView } from "react-native-gesture-handler";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";
import StringUtils from "../../../../shared/util/string-utils";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
import { customFieldsInfoSelector } from "../../list/product-list-selector";
import { ScreenName } from "../../../../config/constants/screen-name";
import { useNavigation } from "@react-navigation/native";

interface FieldInfoItem {
  // field info id
  fieldId: string;
  // field info name
  fieldName: string;
  // field info flag
  availableFlag: number;
  // field info label
  fieldLabel: string;
  // field info type
  fieldType: string;
  // isDefault
  isDefault: boolean;
  // currencyUnit
  currencyUnit: string;
  // typeUnit
  typeUnit: number;
}

/**
 * Component show product general information tab
 * @param props
 */
export function ProductGeneralInforTabScreen() {
  const productDetails = useSelector(productsDetailSelector);
  const productFieldInfo: any = useSelector(productFieldInfoSelector);
  const productDetail: any = productDetails[0];
  const productDetailSetInclude = useSelector(productDetailSetIncludeSelector);
  const authState = useSelector(authorizationSelector);

  const productDetailTradingGeneralInfos = useSelector(
    productDetailTradingGeneralInfoSelector
  );
  const productDetailTradingGeneralInfo = productDetailTradingGeneralInfos[0];
  const productTypes = useSelector(productTypesSelector);
  let totalProductTrading =
    productDetailTradingGeneralInfo?.productTradings.reduce((total, value) => {
      return (total += value.amount);
    }, 0) || 0;
  const customFieldsInfo = useSelector(customFieldsInfoSelector);
  const fieldInfo = customFieldsInfo.find(
    (el: any) => el.fieldName === FIELD_NAME.unitPrice
  );
  let currency = fieldInfo?.currencyUnit || "";
  let type = fieldInfo?.typeUnit || 0;
  const navigation = useNavigation();

  /**
   * render fieldInfo of product
   * @param field
   */
  const renderFieldInfoItem = (field: FieldInfoItem) => {
    const {
      /*isDefault,*/ fieldName,
      availableFlag,
      fieldLabel,
      fieldType,
      isDefault,
      fieldId,
    } = field;
    if (fieldType.toString() === DefineFieldType.OTHER) {
      // console.log(field);
    }
    if (availableFlag === AvailableFlag.NOT_AVAILABLE) {
      return null;
    }

    const {
      productTypeId,
      productData,
      productImageName,
      productImagePath,
      updatedUserName,
      createdUserName,
      productCategoryName,
      productTypeName,
      isDisplay,
      unitPrice,
    } = productDetail;

    if (productTypeId !== null) {
      const productType = productTypes?.find(
        (el) => el.productTypeId === productTypeId
      );
      const fieldUse = JSON.parse(productType.fieldUse);
      if (!fieldUse[fieldId] || fieldUse[fieldId] === 0) {
        return null;
      }
    }

    if (fieldType.toString() !== DefineFieldType.OTHER) {
      let fInfo: any = { ...field };
      let fieldValue =
        productDetail[StringUtils.snakeCaseToCamelCase(fieldName)] ||
        TEXT_EMPTY;
      if (!isDefault) {
        fieldValue =
          productData.find((el: any) => el.key === fieldName)?.value ||
          TEXT_EMPTY;
      }
      if (fieldName === FIELD_NAME.productImageName) {
        fieldValue = {
          fileName: productImageName,
          filePath: "",
          fileUrl: productImagePath,
          status: null,
        };
      }
      if (fieldName === FIELD_NAME.unitPrice) {
        fInfo.currencyUnit = currency;
        fInfo.typeUnit = type;
        fieldValue = fieldValue || 0;
      }
      if (fInfo.fieldType == DefineFieldType.LOOKUP) {
        return <></>;
      }
      if (fInfo.fieldType == DefineFieldType.TAB) {
        return (
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.white,
              paddingVertical: theme.space[4],
              borderBottomColor: theme.colors.gray100,
              borderBottomWidth: 2,
            }}
          >
            <DynamicControlField
              controlType={ControlType.DETAIL}
              fieldInfo={fInfo}
              elementStatus={{
                fieldValue,
              }}
              extensionData={productData || []}
            />
          </View>
        );
      }
      if (
        fInfo.fieldType == DefineFieldType.RELATION &&
        fInfo.relationData.displayTab === RelationDisplay.TAB
      ) {
        return <></>;
      }
      return (
        <View style={ProductDetailsStyles.generalInfoItem}>
          <DynamicControlField
            controlType={ControlType.DETAIL}
            fieldInfo={fInfo}
            elementStatus={{
              fieldValue,
            }}
            extensionData={productData || []}
            fields={productDetail}
          />
        </View>
      );
    }

    let value = "";
    let isLink = false;
    let handlePress = () => {};
    switch (fieldName) {
      case FIELD_NAME.updatedUser:
        value = updatedUserName;
        isLink = true;
        handlePress = () => {
          navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
            id: productDetail.updatedUserId,
          });
        };
        break;
      case FIELD_NAME.createdUser:
        value = createdUserName;
        isLink = true;
        handlePress = () => {
          navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
            id: productDetail.createdUserId,
          });
        };
        break;
      case FIELD_NAME.productCategoryId:
        value = StringUtils.getFieldLabel(
          { productCategoryName },
          "productCategoryName",
          authState?.languageCode
        );
        break;
      case FIELD_NAME.productTypeId:
        value = StringUtils.getFieldLabel(
          { productTypeName },
          "productTypeName",
          authState?.languageCode
        );
        break;
      case FIELD_NAME.isDisplay:
        value = isDisplay
          ? translate(messages.display)
          : translate(messages.hidden);
        break;
      case FIELD_NAME.unitPrice:
        value = formatJaPrice(unitPrice, currency, type);
        break;
      case FIELD_NAME.productRelationId:
        return null;
      default:
        value =
          productDetail[StringUtils.snakeCaseToCamelCase(fieldName)] ||
          TEXT_EMPTY;
        break;
    }
    if (!isDefault) {
      value =
        productData.find((el: any) => el.key === fieldName)?.value ||
        TEXT_EMPTY;
    }

    const label = StringUtils.getFieldLabel(
      { fieldLabel },
      "fieldLabel",
      authState?.languageCode
    );
    return (
      <ProductGeneralInfoItem
        label={label}
        value={value}
        colorValue={theme.colors.gray1}
        onPress={() => {
          handlePress();
        }}
        isLink={isLink}
      />
    );
  };

  return (
    <ScrollView style={ProductDetailsStyles.container}>
      {productDetail && (
        <View>
          {[...productFieldInfo]
            ?.sort((a, b) => a.fieldOrder - b.fieldOrder)
            .map((field) => {
              return renderFieldInfoItem(field);
            })}
        </View>
      )}
      {productDetailSetInclude?.filter((el) => el.productId).length > 0 && (
        <View style={ProductDetailsStyles.setIncludeBg}>
          <View style={ProductDetailsStyles.setIncludePrTitle}>
            <Text style={ProductDetailsStyles.setIncludeTitle}>
              {`${translate(messages.setIncludes)}`}
            </Text>
          </View>
          {productDetailSetInclude
            .filter((el) => el.productId)
            .map((setInclude: ProductDetailSetInclude) => {
              return (
                <ProductSetIncludeItem
                  key={setInclude?.productId?.toString()}
                  productSetId={setInclude?.productId}
                  productImagePath={setInclude?.productImagePath}
                  productName={setInclude?.productName}
                  unitPrice={setInclude?.unitPrice}
                />
              );
            })}
        </View>
      )}
      <View>
        <View style={[ProductDetailsStyles.totalPrice]}>
          <Text style={[ProductDetailsStyles.title]}>
            {`${translate(messages.tradingProduct)}`}
          </Text>
          <Text style={[ProductDetailsStyles.title]}>
            {`${translate(messages.total)} : ${getJapanPrice(
              totalProductTrading,
              false
            )}`}
          </Text>
        </View>
        {productDetailTradingGeneralInfo && (
          <ProductTradingList
            data={productDetailTradingGeneralInfo.productTradings}
            openCustomerDetail={true}
            version={EnumTradingVersion.DETAIL_GENERAL_INFO}
          />
        )}
      </View>
    </ScrollView>
  );
}
