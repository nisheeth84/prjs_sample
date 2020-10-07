import * as React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import {
  getJapanPrice,
  checkEmptyString,
  getCategoryFormat,
  formatJaPrice,
} from "../../utils";
import { appImages, theme } from "../../../../config/constants";
import { ProductGeneralStyles } from "../../product-general-style";
import { ProductIncludeStyles } from "../product-set-details-style";

import { messages } from "../product-set-details-messages";
import { translate } from "../../../../config/i18n";
import { DynamicData } from "../../products-repository";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Line } from "../../../../shared/components/line/line";
import { TEXT_EMPTY } from "../../../../config/constants/constants";
import { useSelector } from "react-redux";
import { fieldInfoProductSetSelector } from "../product-set-details-selector";
import { DynamicControlField } from "../../../../shared/components/dynamic-form/control-field/dynamic-control-field";
import {
  AvailableFlag,
  FIELD_NAME,
  ControlType,
  DefineFieldType,
  LanguageCode,
} from "../../../../config/constants/enum";
import StringUtils from "../../../../shared/util/string-utils";
import { CommonStyles } from "../../../../shared/common-style";
import { useNavigation } from "@react-navigation/native";
import { ScreenName } from "../../../../config/constants/screen-name";
import { customFieldsInfoSelector } from "../../list/product-list-selector";
import { ProductSetGeneralInfoItem } from "./product-set-general-info-item";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";

interface ProductSetProductIncludeItemProps {
  // image path
  productImagePath: string;

  // image name
  productImageName: string;

  //category name
  productCategoryName: string;

  // product name
  productName: string;

  // memo
  memo: string;

  // product price
  unitPrice: number;

  // quantity
  quantity: number;

  // product Id
  productId: number;

  // product set data
  productSetData: Array<DynamicData>;

  // productInclude
  productInclude: any;
}

/**
 * Component show product include item
 * @param props
 */

export const ProductSetProductIncludeItem: React.FC<ProductSetProductIncludeItemProps> = ({
  productImagePath,
  productImageName,
  productCategoryName,
  productName,
  memo,
  unitPrice,
  quantity,
  // productId,
  productSetData = [],
  productInclude,
}) => {
  const navigation = useNavigation();

  const customFieldsInfo = useSelector(customFieldsInfoSelector);
  const fieldInfo = customFieldsInfo.find(
    (el: any) => el.fieldName === FIELD_NAME.unitPrice
  );
  let currency = fieldInfo?.currencyUnit || "";
  let type = fieldInfo?.typeUnit || 0;

  const authState = useSelector(authorizationSelector);
  const fieldInfoSet = useSelector(fieldInfoProductSetSelector);

  const [isOpenExtends, updateIsOpenExtends] = React.useState(false);

  productCategoryName = StringUtils.getFieldLabel(
    { productCategoryName },
    "productCategoryName",
    authState?.languageCode || LanguageCode.JA_JP
  );

  /**
   * render fieldInfoProductSet
   * @param param0
   */
  const renderFieldInfoItem = ({
    item: field,
  }: {
    item: any;
    index: number;
  }) => {
    const {
      /*isDefault,*/ fieldName,
      availableFlag,
      fieldLabel,
      fieldType,
      isDefault,
    } = field;

    if (availableFlag === AvailableFlag.NOT_AVAILABLE) {
      return null;
    }

    const {
      updatedUserName,
      createdUserName,
      productTypeName,
      isDisplay,
      updatedUserId,
      createdUserId,
    } = productInclude;

    if (fieldType.toString() !== DefineFieldType.OTHER) {
      let fInfo = { ...field };
      let fieldValue =
        productInclude[StringUtils.snakeCaseToCamelCase(fieldName)] ||
        TEXT_EMPTY;
      if (!isDefault) {
        fieldValue =
          productSetData.find((el: any) => el.key === fieldName)?.value ||
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

      return (
        <View style={ProductIncludeStyles.extendDataItemVer}>
          <DynamicControlField
            controlType={ControlType.DETAIL}
            fieldInfo={fInfo}
            elementStatus={{
              fieldValue,
            }}
            extensionData={productSetData || []}
            fields={productInclude}
          />
        </View>
      );
    }

    let value = "";
    let productSets: any[] = [];
    let isLink = false;
    let prefix = "";
    let handlePress = () => {};
    switch (fieldName) {
      case FIELD_NAME.updatedUser:
        value = updatedUserName;
        isLink = true;
        handlePress = () => {
          navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
            id: updatedUserId,
          });
        };
        break;
      case FIELD_NAME.createdUser:
        value = createdUserName;
        isLink = true;
        handlePress = () => {
          navigation.navigate(ScreenName.EMPLOYEE_DETAIL, {
            id: createdUserId,
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
      default:
        value =
          productInclude[StringUtils.snakeCaseToCamelCase(fieldName)] ||
          TEXT_EMPTY;
        break;
    }

    if (!isDefault) {
      value =
        productSetData.find((el: any) => el.key === fieldName)?.value ||
        TEXT_EMPTY;
    }

    const label = StringUtils.getFieldLabel(
      { fieldLabel },
      "fieldLabel",
      authState?.languageCode
    );
    return (
      <ProductSetGeneralInfoItem
        label={prefix + label}
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
    <View style={ProductIncludeStyles.container}>
      <View style={[ProductGeneralStyles.inforProductRow]}>
        <View style={ProductIncludeStyles.image}>
          <Image
            style={[ProductGeneralStyles.image]}
            source={
              !checkEmptyString(productImagePath)
                ? {
                    uri: productImagePath,
                  }
                : appImages.iconNoImage
            }
          />
        </View>

        <View style={ProductGeneralStyles.content}>
          <Text style={ProductGeneralStyles.productCategory}>
            {checkEmptyString(productCategoryName) ? "" : productCategoryName}
          </Text>
          <TouchableOpacity
            hitSlop={CommonStyles.hitSlop}
            onPress={() =>
              navigation.navigate(ScreenName.PRODUCT_DETAIL, {
                productId: productInclude.productId,
              })
            }
          >
            <Text
              style={[
                ProductGeneralStyles.productName,
                ProductGeneralStyles.blue200,
              ]}
            >
              {checkEmptyString(productName) ? "" : productName}
            </Text>
          </TouchableOpacity>
          <Text style={ProductGeneralStyles.productPrice}>{memo}</Text>
        </View>
      </View>

      {isOpenExtends ? (
        <View style={ProductIncludeStyles.extendData}>
          <FlatList
            data={fieldInfoSet
              ?.filter((_) => true)
              .sort((a, b) => a.fieldOrder - b.fieldOrder)}
            extraData={fieldInfoSet}
            keyExtractor={(item) => item.fieldId.toString()}
            renderItem={renderFieldInfoItem}
          />
        </View>
      ) : (
        <Line colorLine={theme.colors.gray100} marginLine={theme.space[4]} />
      )}
      <TouchableWithoutFeedback
        onPress={() => {
          updateIsOpenExtends(!isOpenExtends);
        }}
        style={ProductIncludeStyles.extendDataItemIconUpDown}
      >
        {isOpenExtends ? (
          <Image source={appImages.iconUp} />
        ) : (
          <Image source={appImages.iconDown} />
        )}
      </TouchableWithoutFeedback>
    </View>
  );
};
