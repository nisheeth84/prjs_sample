import React from "react";
import { Text, View, ScrollView, FlatList } from "react-native";
import { useSelector } from "react-redux";
import { translate } from "../../../../config/i18n";
import { messages } from "../product-set-details-messages";
import { theme } from "../../../../config/constants";
import { Product } from "../../products-repository";
import { ProductSetGeneralInfoItem } from "./product-set-general-info-item";
import {
  productSetDetailSelector,
  productSetDetailProductIncludeSelector,
  productSetDetailTradingGeneralInfoSelector,
  fieldInfoProductSelector,
  productTypesSetSelector,
} from "../product-set-details-selector";
import { ProductSetProductIncludeItem } from "./product-set-product-include-item";
import { ProductSetDetailsStyles } from "../product-set-details-style";
import { ProductTradingList } from "../tab-trading/product-set-trading-list";
import { getJapanPrice, formatJaPrice } from "../../utils";
import { CommonStyles } from "../../../../shared/common-style";
import {
  EnumTradingVersion,
  AvailableFlag,
  DefineFieldType,
  ControlType,
  FIELD_NAME,
  RelationDisplay,
} from "../../../../config/constants/enum";
import { DynamicControlField } from "../../../../shared/components/dynamic-form/control-field/dynamic-control-field";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
import StringUtils from "../../../../shared/util/string-utils";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../../config/constants/screen-name";
import { customFieldsInfoSelector } from "../../list/product-list-selector";

interface FieldInfoItem {
  // field info id
  fieldId: number;
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

const SET: any = {
  en_us: "Set",
  ja_jp: "セット",
  zh_cn: "组",
};

/**
 * Component show product general information tab
 * @param props
 */
export function ProductGeneralInforTabScreen() {
  const navigation = useNavigation();
  const authState = useSelector(authorizationSelector);
  const productSetDetails = useSelector(productSetDetailSelector);
  const productSetDetail: any =
    (productSetDetails || []).length > 0 ? productSetDetails[0] : undefined;
  const productSetDetailProductInclude = useSelector(
    productSetDetailProductIncludeSelector
  );
  const fieldInfoProductSet: Array<any> =
    useSelector(fieldInfoProductSelector) || [];

  const productSetDetailTradingGeneralInfos = useSelector(
    productSetDetailTradingGeneralInfoSelector
  );
  const productTypes = useSelector(productTypesSetSelector);

  const productSetDetailTradingGeneralInfo =
    (productSetDetailTradingGeneralInfos || []).length > 0
      ? productSetDetailTradingGeneralInfos[0]
      : undefined;

  let totalProductTrading = productSetDetailTradingGeneralInfo?.productTradings.reduce(
    (total, value) => {
      return (total += value.amount);
    },
    0
  );

  if (totalProductTrading == undefined) {
    totalProductTrading = 0;
  }

  const customFieldsInfo = useSelector(customFieldsInfoSelector);
  const fieldInfo = customFieldsInfo.find(
    (el: any) => el.fieldName === FIELD_NAME.unitPrice
  );
  let currency = fieldInfo?.currencyUnit || "";
  let type = fieldInfo?.typeUnit || 0;

  /**
   * render fieldInfo of product
   * @param param0
   */
  const renderFieldInfoItem = ({
    item: field,
  }: {
    item: FieldInfoItem;
    index: number;
  }) => {
    const {
      /*isDefault,*/ fieldName,
      availableFlag,
      fieldLabel,
      fieldType,
      isDefault,
      fieldId,
    } = field;
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
    } = productSetDetail;

    if (productTypeId !== null) {
      const productType = productTypes?.find(
        (el) => el.productTypeId === productTypeId
      );
      const fieldUse = JSON.parse(productType.fieldUse);

      if (fieldUse[fieldId] === undefined || fieldUse[fieldId] === 0) {
        return null;
      }
    }

    if (fieldType.toString() !== DefineFieldType.OTHER) {
      let fInfo: any = { ...field };
      let fieldValue =
        productSetDetail[StringUtils.snakeCaseToCamelCase(fieldName)] ||
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
      if (
        fInfo.fieldType == DefineFieldType.RELATION &&
        fInfo.relationData.displayTab === RelationDisplay.TAB
      ) {
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
      return (
        <View style={ProductSetDetailsStyles.generalInfoItem}>
          <DynamicControlField
            controlType={ControlType.DETAIL}
            fieldInfo={fInfo}
            elementStatus={{
              fieldValue,
            }}
            extensionData={productData || []}
            fields={productSetDetail}
          />
        </View>
      );
    }

    let value = "";
    let productSets: any[] = [];
    let isLink = false;
    let handlePress = () => {};
    switch (fieldName) {
      case FIELD_NAME.updatedUser:
        value = updatedUserName;
        isLink = true;
        handlePress = () => {
          navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
            id: productSetDetail.updatedUserId,
          });
        };
        break;
      case FIELD_NAME.createdUser:
        value = createdUserName;
        isLink = true;
        handlePress = () => {
          navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
            id: productSetDetail.createdUserId,
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
        productSets = productSetDetailProductInclude;
        isLink = true;
        break;
      default:
        value =
          productSetDetail[StringUtils.snakeCaseToCamelCase(fieldName)] ||
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
      <ProductSetGeneralInfoItem
        label={label}
        value={value}
        colorValue={theme.colors.gray1}
        onPress={() => {
          handlePress();
        }}
        isLink={isLink}
        productSets={productSets}
      />
    );
  };

  return (
    <ScrollView style={ProductSetDetailsStyles.container}>
      {productSetDetail && (
        <FlatList
          data={[...fieldInfoProductSet]
            .sort((a: any, b: any) => {
              return a.fieldOrder - b.fieldOrder;
            })
            .map((field) => {
              let fieldLabel = field.fieldLabel;
              if (
                field.fieldName === FIELD_NAME.productId ||
                field.fieldName === FIELD_NAME.productName ||
                field.fieldName === FIELD_NAME.productImageName ||
                field.fieldName === FIELD_NAME.productTypeId ||
                field.fieldName === FIELD_NAME.unitPrice
              ) {
                const fLabel = JSON.parse(field.fieldLabel);
                for (let key in fLabel) {
                  if (fLabel[key]) {
                    fLabel[key] = SET[key] + fLabel[key];
                  }
                }
                fieldLabel = JSON.stringify(fLabel);
              }
              return {
                ...field,
                fieldLabel,
              };
            })}
          extraData={fieldInfoProductSet}
          keyExtractor={(item) => item.fieldId.toString()}
          renderItem={renderFieldInfoItem}
        />
      )}

      {/* {productSetDetailSetInclude?.length > 0 && (
        <View style={CommonStyles.bgWhite}>
          <View
            style={ProductSetDetailsStyles.productSetDetailSetIncludePrTitle}
          >
            <Text
              style={ProductSetDetailsStyles.productSetDetailSetIncludeTitle}
            >
              {`${translate(messages.setIncludes)}`}
            </Text>
          </View>

          {productSetDetailSetInclude.map(
            (setInclude: ProductDetailSetInclude) => {
              return (
                setInclude?.productId && (
                  <ProductSetSetIncludeItem
                    key={setInclude.productId.toString()}
                    productImagePath={setInclude.productImagePath}
                    productName={setInclude.productName}
                    unitPrice={setInclude.unitPrice}
                    productSetId={setInclude.productId}
                  />
                )
              );
            }
          )}
        </View>
      )} */}
      {productSetDetailProductInclude?.length > 0 && (
        <View style={[CommonStyles.bgWhite, CommonStyles.padding4]}>
          <View
            style={ProductSetDetailsStyles.productSetDetailSetIncludePrTitle}
          >
            <Text style={CommonStyles.bold14}>
              {`${translate(messages.productIncludes)}`}
            </Text>
          </View>
          <View>
            {productSetDetailProductInclude.map((productInclude: Product) => {
              return (
                <ProductSetProductIncludeItem
                  key={productInclude.productId.toString()}
                  productImagePath={productInclude.productImagePath}
                  productImageName={productInclude.productImageName}
                  productName={productInclude.productName}
                  unitPrice={productInclude.unitPrice}
                  productCategoryName={productInclude.productCategoryName}
                  memo={productInclude.memo}
                  quantity={productInclude.quantity}
                  productId={productInclude.productId}
                  productSetData={productInclude.productSetData || []}
                  productInclude={productInclude}
                />
              );
            })}
          </View>
        </View>
      )}
      <View>
        <View style={[ProductSetDetailsStyles.totalPrice]}>
          <Text style={[ProductSetDetailsStyles.title]}>
            {`${translate(messages.tradingProduct)}`}
          </Text>
          <Text style={[ProductSetDetailsStyles.title]}>
            {`${translate(messages.total)} : ${getJapanPrice(
              totalProductTrading,
              false
            )}`}
          </Text>
        </View>
        {productSetDetailTradingGeneralInfo && (
          <ProductTradingList
            data={productSetDetailTradingGeneralInfo.productTradings}
            openCustomerDetail={true}
            version={EnumTradingVersion.DETAIL_GENERAL_INFO}
          />
        )}
      </View>
    </ScrollView>
  );
}
