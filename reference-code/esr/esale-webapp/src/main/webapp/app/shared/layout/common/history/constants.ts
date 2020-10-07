export const FIELD = {
  productName: 'product_name',
  productImageName: 'product_image_name',
  productTypeId: 'product_type_id',
  productSetData: 'product_set_data',
  unitPrice: 'unit_price',
  fileName: 'file_name',
  filePath: 'file_path',
  action: 'action'
};

export const LANGUAGE_LABEL = {
  languages: [
    {
      languageId: 1,
      labelChange: '変更されました。',
      year: '年',
      month: '月',
      date: '日'
    },
    {
      languageId: 2,
      labelChange: 'changed',
      year: ' year ',
      month: ' month ',
      date: ' date '
    },
    {
      languageId: 3,
      labelChange: '变了',
      year: '年',
      month: '月',
      date: '日期'
    }
  ]
};

export const fieldType99 = [
  {
    fieldName: 'product_category_id',
    fieldType: 1,
    sourceProp: 'productCategories',
    keyOfId: 'productCategoryId',
    keyOfValue: 'productCategoryName'
  },
  {
    fieldName: 'product_type_id',
    fieldType: 1,
    sourceProp: 'productTypes',
    keyOfId: 'productTypeId',
    keyOfValue: 'productTypeName'
  },
  {
    fieldName: 'is_display',
    fieldType: 4,
    sourceProp: '',
    keyOfId: '',
    keyOfValue: ''
  }
];
