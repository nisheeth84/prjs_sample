/**
 * Define data structure for API getActivityLayout
 **/

type ActivitiesFormatsType = {
  activityFormatId?: any;
  activityFormatName?: any;
  fieldUse?: {};
};

type ProgressesType = {
  productTradingProgressId?: any;
  progressName?: any;
  isAvailable?: any;
  progressOrder?: any;
};

type FieldInfoProductTradingType = {
  fieldId?: any;
  fieldName?: any;
};

type FieldItemsType = {
  itemId?: any;
  isAvailable?: any;
  itemOrder?: any;
  isDefault?: any;
  itemLabel?: any;
};

export type GetActivityLayout = {
  dataInfo?: {
    employeeName?: any;
    activitiesFormats?: ActivitiesFormatsType[];
    fieldInfo?: {
      fieldId?: any;
      fieldBelong?: any;
      lookupFieldId?: any;
      fieldName?: any;
      fieldLabel?: any;
      fieldType?: any;
      fieldOrder?: any;
      isDefault?: any;
      maxLength?: any;
      modifyFlag?: any;
      availableFlag?: any;
      isDoubleColumn?: any;
      defaultValue?: any;
      currencyUnit?: any;
      typeUnit?: any;
      decimalPlace?: any;
      activityLinkedFieldId?: any;
      urlType?: any;
      urlTarget?: any;
      urlEncode?: any;
      urlText?: any;
      linkTarget?: any;
      configValue?: any;
      isLinkedGoogleMap?: any;
      fieldGroup?: any;
      lookupData?: {
        extensionBelong?: any;
        searchKey?: any;
        itemReflect?: any;
      };
      relationData?: {
        extensionBelong?: any;
        fieldId?: any;
        format?: any;
        displayTab?: any;
        displayFields?: any;
      };
      tabData?: any;
      fieldItems?: FieldItemsType[];
      differenceSetting?: {
        isDisplay?: any;
        backwardColor?: any;
        backwardText?: any;
        forwardColor?: any;
        forwardText?: any;
      };
    };
  };
  fieldInfoProductTrading?: FieldInfoProductTradingType[];
  progresses?: ProgressesType[];
};
