import { DefineFieldType } from "../../../config/constants/enum";
import _ from "lodash";
import { FieldInfoItem } from "../../../config/constants/field-info-interface";
import { DEFINE_FIELD_TYPE } from "./employee-special";
import { messages } from "../search-detail/search-detail-messages";
import { translate } from "../../../config/i18n";

export const specialInfoProduct = (field: any, dataLayoutService: any) => {
  let item = { ...field };
  const { fieldName, fieldType } = item;

  if (
    fieldName === "created_user_name" ||
    fieldName === "updated_user_name" ||
    fieldName === "product_type_name" ||
    fieldName === "product_category_name"
  ) {
    return;
  }
  if (fieldType?.toString() === DefineFieldType.OTHER) {
    if (
      fieldName === "product_category_id" ||
      fieldName === "product_type_id" ||
      fieldName === "is_display"
    ) {
      item.fieldType = 1;
      item = customFieldItem(fieldName, item, dataLayoutService);
    }
    if (
      fieldName === "created_user" ||
      fieldName === "updated_user" ||
      fieldName === "product_relation_id"
    ) {
      item.fieldType = 9;
    }
  }
  return item;
};

export const getFieldNameProduct = (field: FieldInfoItem) => {
  const _field = _.cloneDeep(field);
  if (
    !_field.isDefault ||
    _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION ||
    _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.ADDRESS ||
    _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.LINK ||
    _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.EMAIL ||
    _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.FILE
  ) {
    return `product_data.${_field.fieldName}`;
  }
  if (
    (_field?.fieldType?.toString() === DEFINE_FIELD_TYPE.TEXT ||
      _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
      _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER) &&
    !_field?.fieldName?.includes("keyword")
  ) {
    return `${_field.fieldName}.keyword`;
  }
  return `${_field.fieldName}`;
};

const customFieldItem = (
  fieldName: string,
  item: any,
  dataLayoutService: any
) => {
  const field = { ...item };
  switch (fieldName) {
    case "is_display":
      field.fieldItems = [
        {
          itemId: 1,
          isAvailable: null,
          itemOrder: 1,
          isDefault: null,
          itemLabel: translate(messages.display),
        },
        {
          itemId: 2,
          isAvailable: null,
          itemOrder: 2,
          isDefault: null,
          itemLabel: translate(messages.notDisplay),
        },
      ];
      break;
    case "product_type_id":
      field.fieldItems = handleGetFieldItemFromDataTypes(
        item,
        dataLayoutService
      );
      break;
    case "product_category_id":
      field.fieldItems = handleGetFieldItemFromDataCategories(
        item,
        dataLayoutService
      );
      break;
    default:
      break;
  }
  return field;
};

const handleGetFieldItemFromDataTypes = (item: any, dataLayoutService: any) => {
  if (!dataLayoutService) return item.fieldItems;
  const { productTypes = [] } = dataLayoutService || {};
  const fieldItems = productTypes?.map((type: any) => {
    return {
      itemId: type.productTypeId.toString(),
      itemLabel: type.productTypeName,
      itemOrder: type.displayOrder,
      isAvailable: type.isAvailable,
      isDefault: null,
    };
  });
  return fieldItems;
};

const handleGetFieldItemFromDataCategories = (
  item: any,
  dataLayoutService: any
) => {
  let fieldItems = [...item.fieldItems];
  if (!!dataLayoutService?.productCategories) {
    fieldItems = searchInChild(dataLayoutService?.productCategories)?.map(
      (category: any) => {
        return {
          itemId: category.productCategoryId.toString(),
          itemLabel: category.productCategoryName,
          itemOrder: category.displayOrder,
          isAvailable: null,
          isDefault: null,
        };
      }
    );
  }
  return fieldItems;
};

const searchInChild = (child: any) => {
  let search: any = [];
  child.forEach((value: any) => {
    search.push(value);
    if ((value.productCategoryChild || []).length > 0) {
      search = search.concat(searchInChild(value.productCategoryChild));
    }
  });
  return search;
};
