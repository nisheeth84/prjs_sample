export const PRODUCT_LIST_ID = 'PRODUCT_LIST_ID';
export const FILE_EXTENSION_IMAGE = ['img', 'jpeg', 'gif', 'bmp', 'png', 'jpg'];

export const PRODUCT_DEF = {
  FIELD_BELONG: 14,
  EXTENSION_BELONG_LIST: 1,
  EXTENSION_BELONG_EDIT: 2
};
export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2,
  BY_MENU: 3
};

export const SCALE = {
  SCALE_CHANGE_RANGE: 1,
  MAX_VALUE_SCALE: 25,
  MIN_VALUE_SCALE: 0
};

export const MENU_TYPE = {
  ALL_PRODUCT: 0,
  CATEGORY: 1,
  TYPE: 2
};
export const DND_CATEGORY_TYPE = {
  CARD: 'CategoryCard'
};

export const DND_PRODUCT_VIEW_TYPE = {
  CARD: 'ProductViewCard'
};

export const PRODUCT_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};
export const PRODUCT_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const DEFAULT_FIELD_NAMES = ['product_name', 'unit_price', 'memo'];
export const SPECIAL_FIELD_NAMES = ['product_category_id', 'product_type_id', 'is_display'];
export const MOVE_TYPE = {
  TRANSFER: 1,
  CONCURRENT: 2
};

export const SORT_VIEW = {
  ASC: 1,
  DESC: 2
};

export const ORDER_BY_VIEW = {
  PRODUCT_CODE: 1,
  PRODUCT_NAME: 2,
  UNIT_PRICE: 3,
  CATEGORY_NAME: 4
};

export const PRODUCT_SPECIAL_FIELD_NAMES = {
  productCategories: 'product_categories',
  isDisplay: 'is_display',
  productSurname: 'productSurname',
  productTypeId: 'product_type_id',
  productName: 'product_name',
  productCategoryId: 'product_category_id',
  createDate: 'created_date',
  createBy: 'created_user',
  updateDate: 'updated_date',
  productsSets: 'product_relation_id',
  updateBy: 'updated_user',
  productImageName: 'product_image_name',
  productId: 'product_id',
  unitPrice: 'unit_price',
  createdUserId: 'created_user_id',
  updatedUserId: 'updated_user_id'
};

export const PRODUCT_SET_CREATE = {
  EMPTY: 0,
  NOT_EMPTY: 1
};
export const SHOW_MESSAGE = {
  NONE: 0,
  ERROR: 1,
  SUCCESS: 2,
  ERROR_LIST: 3,
  ERROR_EXCLUSIVE: 4,
  MAXIMUM_FILE: 5
  // CREATE_CATEGORY: 2,
  // UPDATE_CATEGORY: 3,
  // DELETE_CATEGORY: 4,
  // MOVE_CATEGORY: 5,
  // CREATE_PRODUCT: 6,
  // UPDATE_PRODUCT: 7,
  // DELETE_PRODUCT: 8,
  // DELETE_PRODUCTS: 9,
  // MOVE_PRODUCT: 10,
  // MOVE_TO_CATEGORY: 11
};

export const PARAM_UPDATE_CUSTOM_FIELD_INFO = (
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
) => ({
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
});

export const PARAM_GET_CUSTOM_FIELD_INFO = fieldBelong => ({ fieldBelong });

export const CREATE_PRODUCT = data =>
  `mutation {
    createProduct(data: ${JSON.stringify(data).replace(/"(\w+)"\s*:/g, '$1:')})
  }`;

export const UPDATE_PRODUCT = (productId, data) =>
  `mutation {
    updateProduct(productId: ${productId} ,
    data: ${JSON.stringify(data).replace(/"(\w+)"\s*:/g, '$1:')})
  }`;

export const PARAM_CREATE_PRODUCT_SET = data =>
  `mutation {
    createProductSet(data: ${JSON.stringify(data).replace(/"(\w+)"\s*:/g, '$1:')})
  }`;

export const PARAMS_CREATE_PRODUCT_SET = params => {
  const query = {};
  query['query'] = `
    mutation(
      $productName : String,
      $productImageData : String,
      $productImageName : String,
      $unitPrice : Long,
      $productCategoryId : Long,
      $productTypeId : Long,
      $isDisplay : Boolean,
      $memo : String,
      $productData : [CreateProductSetSubType1],
      $listProduct : [CreateProductSetSubType2],
      $files : [Upload]
    ){
      createProductSet(
        data : {
          productName : $productName,
          productImageData : $productImageData,
          productImageName : $productImageName,
          unitPrice : $unitPrice,
          productCategoryId : $productCategoryId,
          productTypeId : $productTypeId,
          isDisplay : $isDisplay,
          memo : $memo,
          productData : $productData,
          listProduct : $listProduct
        },
        fileInfos : $files
      )
    }
  `
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');

  query['variables'] = params;

  return query;
};
export const PARAMS_UPDATE_PRODUCT_SET = params => {
  const query = {};
  query['query'] = `
    mutation(
      $productId : Long
      $productName : String
      $productImageData : String
      $productImageName : String
      $unitPrice : Long
      $productCategoryId : Long
      $memo : String
      $productTypeId : Long
      $isDisplay : Boolean
      $productData : [UpdateProductSetSubType1]
      $reasonEdit : String
      $updatedDate : DateTime
      $deletedProductSets : [UpdateProductSetSubType3]
      $listProduct : [UpdateProductSetSubType2]
      $isDeleteImage : Boolean
      $files : [Upload]
    ){
      updateProductSet(
        data : {
          productId : $productId
          productName : $productName
          productImageData : $productImageData
          productImageName : $productImageName
          unitPrice : $unitPrice
          productCategoryId : $productCategoryId
          memo : $memo
          productTypeId : $productTypeId
          isDisplay : $isDisplay
          productData : $productData
          reasonEdit : $reasonEdit
          updatedDate : $updatedDate
          deletedProductSets : $deletedProductSets
          listProduct : $listProduct
          isDeleteImage : $isDeleteImage
        },
        fileInfos : $files
      )
    }
  `
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');

  query['variables'] = params;

  return query;
};
export const PARAMS_CREATE_PRODUCT = params => {
  const query = {};
  query['query'] = `
    mutation(
      $productName : String,
      $productImageData : String,
      $productImageName : String,
      $unitPrice : Long,
      $productCategoryId : Long,
      $memo : String,
      $productTypeId: Long,
      $isDisplay : Boolean,
      $productData : [CreateProductSubType1]
      $files : [Upload]
    ){
      createProduct(
        data : {
          productName : $productName,
          productImageData : $productImageData,
          productImageName : $productImageName,
          unitPrice : $unitPrice,
          productCategoryId : $productCategoryId,
          memo : $memo,
          productTypeId: $productTypeId,
          isDisplay : $isDisplay,
          productData : $productData
        },
        fileInfos : $files
      )
    }
  `
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');

  query['variables'] = params;

  return query;
};
export const PARAMS_UPDATE_PRODUCT = params => {
  const query = {};
  query['query'] = `
    mutation(
      $productName : String,
      $productId : Long,
      $productImageData : String,
      $productImageName : String,
      $unitPrice : Long,
      $productCategoryId : Long,
      $memo : String,
      $productTypeId: Long,
      $isDisplay : Boolean,
      $productData : [UpdateProductSubType1],
      $updatedDate : DateTime,
      $isDeleteImage : Boolean,
      $files : [Upload]
    ){
      updateProduct(
        data : {
          productName : $productName,
          productId : $productId,
          productImageData : $productImageData,
          productImageName : $productImageName,
          unitPrice : $unitPrice,
          productCategoryId : $productCategoryId,
          updatedDate : $updatedDate,
          memo : $memo,
          productTypeId: $productTypeId,
          isDisplay : $isDisplay,
          productData : $productData,
          isDeleteImage : $isDeleteImage
        },
        fileInfos : $files
      )
    }
  `
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');

  query['variables'] = params;

  return query;
};

export const PARAM_GET_PRODUCT_SET_LAYOUT = productIds =>
  `query {
    productSetLayout(productIds: ${
      productIds ? JSON.stringify(productIds).replace(/"(\w+)"\s*:/g, '$1:') : '[]'
    }) {
      dataInfo {
        products {
          productId
          productName
          unitPrice
          isSet
          productImagePath
          productImageName
          productCategoryId
          productCategoryName
          productTypeId
          memo
          quantity
          setId
          updatedDate
        }
        productCategories {
          productCategoryId
          productCategoryName
          productCategoryLevel
          productCategoryChild {
            productCategoryId
            productCategoryName
            productCategoryLevel
            displayOrder
            updatedDate
          }
          displayOrder
          updatedDate
        }
        productTypes {
          productTypeId
          productTypeName
          fieldUse
          displayOrder
          updatedDate
        }
      }
      fieldInfoProduct {
        fieldId                
        fieldBelong            
        fieldName             
        fieldLabel           
        fieldType              
        fieldOrder             
        isDefault              
        maxLength             
        modifyFlag            
        availableFlag          
        isDoubleColumn         
        defaultValue            
        currencyUnit        
        typeUnit              
        decimalPlace          
        urlType               
        urlTarget            
        urlText                 
        linkTarget             
        configValue          
        isLinkedGoogleMap       
        fieldGroup            
        lookupData {
          fieldBelong
          searchKey
          itemReflect {
            fieldId
            fieldLabel
            itemReflect
          }
        }
        relationData {
          fieldBelong
          fieldId
          format
          displayFieldId
          displayTab
          displayFields {
            fieldName
            fieldId
            relationId
            fieldBelong
          }
          asSelf
        }
        selectOrganizationData {
          target
          format
        }
        tabData       
        updatedDate
        fieldItems {
            itemId 
            isAvailable
            itemOrder
            isDefault 
            itemLabel
        }
      }
      fieldInfoProductSet {
        fieldId                
        fieldBelong            
        fieldName             
        fieldLabel           
        fieldType              
        fieldOrder             
        isDefault              
        maxLength             
        modifyFlag            
        availableFlag          
        isDoubleColumn         
        defaultValue            
        currencyUnit        
        typeUnit              
        decimalPlace          
        urlType               
        urlTarget            
        urlText                 
        linkTarget             
        configValue          
        isLinkedGoogleMap       
        fieldGroup            
        lookupData {
          fieldBelong
          searchKey
          itemReflect {
            fieldId
            fieldLabel
            itemReflect
          }
        }
        relationData {
          fieldBelong
          fieldId
          format
          displayFieldId
          displayTab
          displayFields {
            fieldName
            fieldId
            relationId
            fieldBelong
          }
          asSelf
        }
        selectOrganizationData {
          target
          format
        }
        tabData       
        updatedDate
        fieldItems {
          itemId 
          isAvailable
          itemOrder
          isDefault
          itemLabel
        }
      }
    }
}`;

export const PARAM_GET_PRODUCT_LIST = (
  searchConditions,
  productCategoryId,
  isContainCategoryChild,
  searchLocal,
  orderBy,
  offset,
  limit,
  isOnlyData,
  filterConditions,
  isUpdateListInfo
) =>
  `query {
    products(searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')},
    productCategoryId: ${productCategoryId},
    isContainCategoryChild: ${isContainCategoryChild},
    searchLocal: ${JSON.stringify(searchLocal).replace(/"(\w+)"\s*:/g, '$1:')},
    orderBy: ${JSON.stringify(orderBy).replace(/"(\w+)"\s*:/g, '$1:')},
    offset: ${offset},
    limit: ${limit},
    isOnlyData: ${isOnlyData},
    filterConditions: ${JSON.stringify(filterConditions).replace(/"(\w+)"\s*:/g, '$1:')},
    isUpdateListInfo: ${isUpdateListInfo}) {
      dataInfo {
        products {
          productId
          productName
          unitPrice
          isDisplay
          productImagePath
          productImageName
          productCategoryId
          productCategoryName
          productTypeId
          productTypeName
          memo
          isSet
          createdDate
          createdUser
          updatedDate
          updatedUser
          createdUserName
          updatedUserName
          productData{
            fieldType
            key
            value
          }
          productRelations{
            productId
            productName
            isSet
          }
        }
        productCategories{
          ...CategoryFields
          ...CategoryRecursive
        }
        productTypes{
          productTypeId
          productTypeName
          displayOrder
        }
      }
      recordCount
      totalCount
      fieldInfo{
        fieldId
        fieldName
        fieldType
        fieldOrder
      }
      initializeInfor {
        selectedTargetType
        selectedTargetId
        extraSettings {
          key
          value
        }
        orderBy {
          isNested
          key
          value
          fieldType
        }
        filterListConditions {
          targetType 
          targetId 
          filterConditions {
              fieldId 
              fieldName 
              fieldType 
              fieldBelong 
              filterType 
              filterOption
              fieldValue 
              isNested 
          }
        }
      }
    }
  }
  fragment CategoryRecursive on ProductSetLayoutSubType3 {
    displayOrder
          productCategoryChild {
      ...CategoryFields
          productCategoryChild {
        ...CategoryFields
          productCategoryChild {
          ...CategoryFields
          productCategoryChild {
            ...CategoryFields
          productCategoryChild {
              ...CategoryFields
          productCategoryChild {
                ...CategoryFields
          productCategoryChild {
                  ...CategoryFields
          productCategoryChild {
                    ...CategoryFields
          productCategoryChild {
                      ...CategoryFields
          productCategoryChild {
                        ...CategoryFields
          productCategoryChild {
                          ...CategoryFields
          productCategoryChild {
                            ...CategoryFields
          productCategoryChild {
                              ...CategoryFields

                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fragment CategoryFields on ProductSetLayoutSubType3 {
    productCategoryId
    productCategoryName
    productCategoryLevel
    displayOrder
  }`;

export const PARAM_CHECK_DELETE_PRODUCTS = ids =>
  `query{
    checkDeleteProduct(productIds: ${JSON.stringify(ids).replace(/"(\w+)"\s*:/g, '$1:')}) {
      productSetConfirmLists{
        setId,
        setName,
        productDeleteLists{
          productId,
          productName
        }
      },
      ProductListConfirmLists{
        productId,
        productName,
        productSetAffectLists{
        setId,
        setName
        }
      }
    }
  }`;

export const PARAM_DELETE_PRODUCTS = (productIds, setIds) =>
  `mutation {
    deleteProducts(productIds: ${JSON.stringify(productIds).replace(/"(\w+)"\s*:/g, '$1:')},
     setIds : ${JSON.stringify(setIds).replace(/"(\w+)"\s*:/g, '$1:')})
  }`;

export const PARAM_DELETE_CATEGORY = categoryId =>
  `mutation {
    deleteProductCategory(productCategoryId: ${categoryId})
  }`;

export const PARAM_UPDATE_PRODUCT = products => {
  const query = {};
  query['query'] = `
      mutation(
        $products : [UpdateProductsIn],
        $files : [Upload]
      ){
        updateProducts(
          data: $products,
          fileInfos : $files
        )
      }`
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');
  query['variables'] = products;
  return query;
};

// `mutation {
//   updateProducts(data: ${JSON.stringify(products).replace(/"(\w+)"\s*:/g, '$1:')})
// }`;

export const GET_PRODUCT = (productId, isOnlyData, isContainDataSummary) =>
  `query {
  product(productId: ${productId} ,
        isOnlyData: ${isOnlyData} ,
        isContainDataSummary: ${isContainDataSummary}) {
          product {
            productId
            productName
            productData{
              fieldType
              key
              value
            }
            unitPrice
            isDisplay
            isSet
            productImageName
            productImagePath
            productCategoryId
            productCategoryName
            memo
            productTypeId
            productTypeName
            createdDate
            createdUserId
            createdUserName
            updatedDate
            updatedUserId
            updatedUserName
            }
            productCategories {
              productCategoryId
              productCategoryName
              productCategoryLevel
              displayOrder
          productCategoryChild {
                  productCategoryId
                  productCategoryName
                  productCategoryLevel
                  displayOrder
          productCategoryChild {
                      productCategoryId
                      productCategoryName
                      productCategoryLevel
                          displayOrder
          productCategoryChild {
                          productCategoryId
                          productCategoryName
                          productCategoryLevel
                            displayOrder
          productCategoryChild {
                              productCategoryId
                              productCategoryName
                              productCategoryLevel
                              displayOrder
          productCategoryChild {
                                productCategoryId
                                productCategoryName
                                productCategoryLevel
                                displayOrder
          productCategoryChild {
                                  productCategoryId
                                  productCategoryName
                                  productCategoryLevel
                                  displayOrder
          productCategoryChild {
                                    productCategoryId
                                    productCategoryName
                                    productCategoryLevel
                                    displayOrder
          productCategoryChild {
                                      productCategoryId
                                      productCategoryName
                                      productCategoryLevel
                                      displayOrder
          productCategoryChild {
                                        productCategoryId
                                        productCategoryName
                                        productCategoryLevel
                                        displayOrder
          productCategoryChild {
                                          productCategoryId
                                          productCategoryName
                                          productCategoryLevel
                                          displayOrder
          productCategoryChild {
                                            productCategoryId
                                            productCategoryName
                                            productCategoryLevel
                                            displayOrder
          productCategoryChild {
                                              productCategoryId
                                              productCategoryName
                                              productCategoryLevel
                                              displayOrder
          productCategoryChild {
                                                productCategoryId
                                                productCategoryName
                                                productCategoryLevel
                                                displayOrder
          productCategoryChild {
                                                  productCategoryId
                                                  productCategoryName
                                                  productCategoryLevel
                                                  displayOrder
          productCategoryChild {
                                                    productCategoryId
                                                    productCategoryName
                                                    productCategoryLevel
                                                    displayOrder
          productCategoryChild {
                                                      productCategoryId
                                                      productCategoryName
                                                      productCategoryLevel
                                                      displayOrder
          productCategoryChild {
                                                        productCategoryId
                                                        productCategoryName
                                                        productCategoryLevel
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                      }
                  }
              }
          }
              productTypes{
                  productTypeId
                  productTypeName
                  fieldUse
                  }
              productHistories{
                  createdDate
                  createdUserId
                  createdUserName
                  createdUserImage
                  contentChange
                  }
                  fieldInfo {
                    fieldId
                    fieldBelong
                    fieldName
                    fieldLabel
                    fieldType
                    fieldOrder
                    isDefault
                    maxLength
                    modifyFlag
                    availableFlag
                    isDoubleColumn
                    defaultValue
                    currencyUnit
                    typeUnit
                    decimalPlace
                    urlType
                    urlTarget
                    urlText
                    linkTarget
                    configValue
                    isLinkedGoogleMap
                    fieldGroup
                    lookupData {
                      fieldBelong
                      searchKey
                      itemReflect {
                        fieldId
                        fieldLabel
                        itemReflect
                      }
                    }
                    relationData {
                      fieldBelong
                      fieldId
                      format
                      displayFieldId
                      displayTab
                      displayFields {
                        fieldName
                        fieldId
                        relationId
                        fieldBelong
                      }
                      asSelf
                    }
                    selectOrganizationData {
                      target
                      format
                    }
                    tabData
                    updatedDate
                    fieldItems {
                      itemId
                      isAvailable
                      itemOrder
                      isDefault
                      itemLabel
                    }
                  }
          }
    }`;

export const GET_CATEGORY_LIST = () =>
  `query {
    getProductCategories {
      ...CategoryFields
      ...CategoryRecursive
    }
  }
  fragment CategoryRecursive on ProductCategoriesOut {
    displayOrder
          productCategoryChild {
      ...CategoryFields
          productCategoryChild {
        ...CategoryFields
          productCategoryChild {
          ...CategoryFields
          productCategoryChild {
            ...CategoryFields
          productCategoryChild {
              ...CategoryFields
          productCategoryChild {
                ...CategoryFields
          productCategoryChild {
                  ...CategoryFields
          productCategoryChild {
                    ...CategoryFields
          productCategoryChild {
                      ...CategoryFields
          productCategoryChild {
                        ...CategoryFields
          productCategoryChild {
                          ...CategoryFields
          productCategoryChild {
                            ...CategoryFields
          productCategoryChild {
                              ...CategoryFields

                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fragment CategoryFields on ProductCategoriesOut {
    productCategoryId
    productCategoryName
    productCategoryLevel
    productCategoryParentId
    displayOrder
    updatedDate
  }`;

export const PARAM_CREATE_CATEGORY = (categoryName, parentId) =>
  `mutation{
    createProductCategory(
      productCategoryName : ${JSON.stringify(categoryName).replace(/"(\w+)"\s*:/g, '$1:')},
      productCategoryParentId: ${parentId})
  }`;

export const PARAM_UPDATE_CATEGORY = (categoryId, categoryName, parentId, updatedDate) =>
  `mutation{
    updateProductCategory(
      productCategoryId: ${categoryId},
      productCategoryName : ${JSON.stringify(categoryName).replace(/"(\w+)"\s*:/g, '$1:')},
      productCategoryParentId: ${parentId ? parentId : null},
      updatedDate: ${JSON.stringify(updatedDate).replace(/"(\w+)"\s*:/g, '$1:')}
     )
  }`;
// TODO: displayOrder
export const PARAM_GET_PRODUCT_LAYOUT = () =>
  `query  {
    productLayout{
       dataInfo  {
        productCategories {
          productCategoryId
          productCategoryName
          productCategoryLevel
          productCategoryChild {
              productCategoryId
              productCategoryName
              productCategoryLevel
              productCategoryChild {
                  productCategoryId
                  productCategoryName
                  productCategoryLevel
                      productCategoryChild {
                      productCategoryId
                      productCategoryName
                      productCategoryLevel
                        productCategoryChild {
                          productCategoryId
                          productCategoryName
                          productCategoryLevel
                          productCategoryChild {
                            productCategoryId
                            productCategoryName
                            productCategoryLevel
                            productCategoryChild {
                              productCategoryId
                              productCategoryName
                              productCategoryLevel
                              productCategoryChild {
                                productCategoryId
                                productCategoryName
                                productCategoryLevel
                                productCategoryChild {
                                  productCategoryId
                                  productCategoryName
                                  productCategoryLevel
                                  productCategoryChild {
                                    productCategoryId
                                    productCategoryName
                                    productCategoryLevel
                                    productCategoryChild {
                                      productCategoryId
                                      productCategoryName
                                      productCategoryLevel
                                      productCategoryChild {
                                        productCategoryId
                                        productCategoryName
                                        productCategoryLevel
                                        productCategoryChild {
                                          productCategoryId
                                          productCategoryName
                                          productCategoryLevel
                                          productCategoryChild {
                                            productCategoryId
                                            productCategoryName
                                            productCategoryLevel
                                            productCategoryChild {
                                              productCategoryId
                                              productCategoryName
                                              productCategoryLevel
                                              productCategoryChild {
                                                productCategoryId
                                                productCategoryName
                                                productCategoryLevel
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                      }
                  }
              }
          }
      }
           productTypes  {
               productTypeId
               productTypeName
               fieldUse
           }
       }
       fieldInfo {
        fieldId
        fieldBelong
        fieldName
        fieldLabel
        fieldType
        fieldOrder
        isDefault
        maxLength
        modifyFlag
        availableFlag
        isDoubleColumn
        defaultValue
        currencyUnit
        typeUnit
        decimalPlace
        urlType
        urlTarget
        urlText
        linkTarget
        configValue
        isLinkedGoogleMap
        fieldGroup
        lookupData {
          fieldBelong
          searchKey
          itemReflect {
            fieldId
            fieldLabel
            itemReflect
          }
        }
        relationData {
          fieldBelong
          fieldId
          format
          displayFieldId
          displayTab
          displayFields {
            fieldName
            fieldId
            relationId
            fieldBelong
          }
          asSelf
        }
        selectOrganizationData {
          target
          format
        }
        tabData
        updatedDate
        fieldItems {
          itemId
          isAvailable
          itemOrder
          isDefault
          itemLabel
        }
      }
    }
  }`;

export const GET_PRODUCT_SET = (productId, isContainDataSummary) =>
  `query {
      getProductSet(productId: ${JSON.stringify(productId).replace(/"(\w+)"\s*:/g, '$1:')} ,
       isContainDataSummary : ${isContainDataSummary}) {
        dataInfo {
          productSet {
              productId
              productName
              productData {
                  fieldType
                  key
                  value
              }
              unitPrice
              isSet
              productImagePath
              productImageName
              productCategoryId
              productCategoryName
              memo
              productTypeId
              productTypeName
              isDisplay
              createdDate
              createdUserId
              createdUserName
              updatedDate
              updatedUserId
              updatedUserName
          }
          products {
              productId
              quantity
              productName
              unitPrice
              productSetData {
                fieldType
                key
                value
              }
              isSet
              productImagePath
              productImageName
              productCategoryId
              productCategoryName
              memo
              productTypeId
          }
          productSets {
              productId
              productName
              unitPrice
              productImagePath
          }
          productCategories {
              productCategoryId
              productCategoryName
              productCategoryLevel
              productCategoryChild {
                productCategoryId
                productCategoryName
                productCategoryLevel
                displayOrder
              }
              displayOrder
          }
          productTypes {
              productTypeId
              productTypeName
              fieldUse
              isAvailable
              displayOrder
              updatedDate
          }
          productTradings {
                productTradingBadge
                productTradings {
                    productTradingId
                    customerId
                    customerName
                    employeeId
                    employeeName
                    productId
                    productName
                    productTradingProgressId
                    progressName
                    endPlanDate
                    quantity
                    price
                    isFinish
                    amount
                    productTradingData {
                        fieldType
                        key
                        value
                    }
                }
                fieldInfoTab {
                    fieldId
                    fieldInfoTabId
                    fieldInfoTabPersonalId
                    fieldOrder
                    fieldName
                    fieldLabel
                    fieldType
                    isColumnFixed
                    columnWidth
                }
            }
            productHistories {
                createdDate
                createdUserId
                createdUserName
                createdUserImage
                contentChange
            }
        }
        fieldInfoProduct {
            fieldId                
            fieldBelong            
            fieldName             
            fieldLabel           
            fieldType              
            fieldOrder             
            isDefault              
            maxLength             
            modifyFlag            
            availableFlag          
            isDoubleColumn         
            defaultValue            
            currencyUnit        
            typeUnit              
            decimalPlace          
            urlType               
            urlTarget            
            urlText                 
            linkTarget             
            configValue          
            isLinkedGoogleMap       
            fieldGroup            
            lookupData {
              fieldBelong
              searchKey
              itemReflect {
                fieldId
                fieldLabel
                itemReflect
              }
            }
            relationData {
              fieldBelong
              fieldId
              format
              displayFieldId
              displayTab
              displayFields {
                fieldName
                fieldId
                relationId
                fieldBelong
              }
              asSelf
            }
            selectOrganizationData {
              target
              format
            }
            tabData       
            updatedDate
            fieldItems {
                itemId 
                isAvailable
                itemOrder
                isDefault 
                itemLabel
            }
        }
        fieldInfoProductSet {
            fieldId                
            fieldBelong            
            fieldName             
            fieldLabel           
            fieldType              
            fieldOrder             
            isDefault              
            maxLength             
            modifyFlag            
            availableFlag          
            isDoubleColumn         
            defaultValue            
            currencyUnit        
            typeUnit              
            decimalPlace          
            urlType               
            urlTarget            
            urlText                 
            linkTarget             
            configValue          
            isLinkedGoogleMap       
            fieldGroup            
            lookupData {
              fieldBelong
              searchKey
              itemReflect {
                fieldId
                fieldLabel
                itemReflect
              }
            }
            relationData {
              fieldBelong
              fieldId
              format
              displayFieldId
              displayTab
              displayFields {
                fieldName
                fieldId
                relationId
                fieldBelong
              }
              asSelf
            }
            selectOrganizationData {
              target
              format
            }
            tabData       
            updatedDate
            fieldItems {
              itemId 
              isAvailable
              itemOrder
              isDefault 
              itemLabel
            }
        }
        tabInfo  {
            tabInfoId     
            tabId         
            tabLabel      
            tabOrder       
            isDisplay        
            isDisplaySummary 
            maxRecord       
            updatedDate     
        }
      }
  }`;

export const PRODUCT_SET_UPDATE = product =>
  `mutation {
        updateProductSet(data: ${JSON.stringify(product).replace(/"(\w+)"\s*:/g, '$1:')})
      }`;

/* _____________product-detail */
export const PARAM_GET_PRODUCT = (productId, isOnlyData, isContainDataSummary) =>
  `query {
      product(productId: ${JSON.stringify(productId).replace(/"(\w+)"\s*:/g, '$1:')} ,
              isOnlyData: ${isOnlyData} ,
              isContainDataSummary: ${isContainDataSummary}) {
        product {
            productId
            productName
            productData{
              fieldType
              key
              value
            }
            unitPrice
            isDisplay
            isSet
            productImageName
            productImagePath
            productCategoryId
            productCategoryName
            memo
            productTypeId
            productTypeName
            createdDate
            createdUserId
            createdUserName
            updatedDate
            updatedUserId
            updatedUserName
        }
        productCategories{
            productCategoryId
            productCategoryName
            productCategoryLevel
            displayOrder
            productCategoryParentId
            productCategoryChild{
              productCategoryId
              productCategoryName
              productCategoryLevel
              displayOrder
              productCategoryParentId
            }
        }
        productTypes{
            productTypeId
            productTypeName
            fieldUse
            displayOrder
        }
        productSets{
            productId
            productImagePath
            productName
            unitPrice
        }
        productTradings {
          productTradingBadge
          productTradings {
            productTradingId
            customerId
            customerName
            employeeId
            employeeName
            productId
            productName
            productTradingProgressId
            progressName
            endPlanDate
            quantity
            price
            isFinish
            amount
            productTradingData {
              fieldType
              key
              value
            }
          }
          fieldInfoTab {
            fieldId
            fieldInfoTabId
            fieldInfoTabPersonalId
            fieldOrder
            fieldName
            fieldLabel
            fieldType
            isColumnFixed
            columnWidth
          }
        }
        productHistories{
            createdDate
            createdUserId
            createdUserName
            createdUserImage
            contentChange
        },
        fieldInfo{
            fieldId
            fieldBelong
            fieldName
            fieldLabel
            fieldType
            fieldOrder
            isDefault
            maxLength
            modifyFlag
            availableFlag
            isDoubleColumn
            defaultValue
            currencyUnit
            typeUnit
            decimalPlace
            urlType
            urlTarget
            urlText
            linkTarget
            configValue
            isLinkedGoogleMap
            fieldGroup
            lookupData {
              fieldBelong
              searchKey
              itemReflect {
                fieldId
                fieldLabel
                itemReflect
              }
            }
            relationData {
              fieldBelong
              fieldId
              format
              displayFieldId
              displayTab
              displayFields {
                fieldName
                fieldId
                relationId
                fieldBelong
              }
              asSelf
            }
            selectOrganizationData {
              target
              format
            }
            tabData
            updatedDate
            fieldItems {
              itemId
              isAvailable
              itemOrder
              isDefault
              itemLabel
            }
        },
        tabInfo{
          tabInfoId
          tabId
          tabOrder
          isDisplay
          isDisplaySummary
          maxRecord
          tabLabel
          updatedDate
        }
      }
    }`;

export const PARAM_GET_PRODUCT_CHANGE_HISTORY = (productId, currentPage, limit) =>
  `query {
    productHistory(productId: ${productId}, currentPage: ${currentPage}, limit: ${limit}) {
      createdDate
      createdUserId
      createdUserName
      createdUserImage
      contentChange
    }
  }`;

// export const PARAM_UPDATE_CUSTOM_FIELD_INFO = (fieldBelong, deleteFields, fields, tabs, deleteFieldsTab, fieldsTab) =>
//   `mutation {
//     updateCustomFieldsInfo(
//         fieldBelong: ${fieldBelong},
//         deletedFields: ${JSON.stringify(deleteFields).replace(/"(\w+)"\s*:/g, '$1:')},
//         fields: ${JSON.stringify(fields).replace(/"(\w+)"\s*:/g, '$1:')},
//         tabs: ${JSON.stringify(tabs).replace(/"(\w+)"\s*:/g, '$1:')},
//         deletedFieldsTab: ${deleteFieldsTab},
//         fieldsTab: ${fieldsTab}) {
//             fieldIds
//             tabInfoIds
//             fieldInfoTabIds
//     }
//   }`;

export const CURRENCY = '円';

export const DUMMY_TAB_LIST = [
  {
    tabId: 1,
    labelName: '基本情報',
    isDisplay: true,
    isDisplaySummary: true,
    maxRecord: 5
  },
  {
    tabId: 2,
    labelName: '取引商品',
    isDisplay: true,
    isDisplaySummary: true,
    maxRecord: 10
  },
  {
    tabId: 3,
    labelName: '変更履歴',
    isDisplay: true,
    isDisplaySummary: true,
    maxRecord: 10
  }
];
export const DUMMY_LANGUAGE_LABEL = {
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

/* product-detail-tablist */
export const BADGES = {
  maxBadges: 99
};

export const TAB_ID_LIST = {
  summary: 0,
  productTrading: 1,
  productHistory: 2
};

export const TAB_ID = {
  SUMMARY: 1,
  CUSTOMER: 2,
  BUSINESSCARD: 3,
  TASK: 4,
  EMAIL: 5,
  PRODUCT: 6,
  INTENDED_ACHIEVEMENT: 7,
  GROUP_LIST: 8,
  CHANGE_HISTORY: 11
};

/* product-detail-tab-summary */
export const FIELD_ITEM_TYPE_DND = {
  SWICH_ORDER: 'SwichOrderTypeItemCard',
  ADD_FIELD: 'AddFieldTypeItemCard'
};

export const ITEM_TYPE = {
  itemTypeSchedule: 3
};

/* product-detail-tab-product-trading */
export const SCREEN_ID = {
  PRODUCT_DETAIL: 111411
};

/* product-detail-tab-product-history */
export const DEFAULT_PAGE = 1;

export const PARAM_CHANGE_CATEGORY_ORDER = categoryParams =>
  `mutation {
    changeDepartmentOrder(departmentParams: ${JSON.stringify(categoryParams).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )})
  }`;

export const PARAM_EXPORT_PRODUCTS = (productIds, extensionBelong, orderBy) =>
  `query {
    exportProducts (
      productIds: ${JSON.stringify(productIds).replace(/"(\w+)"\s*:/g, '$1:')},
      extensionBelong: ${JSON.stringify(extensionBelong).replace(/"(\w+)"\s*:/g, '$1:')},
      orderBy: ${JSON.stringify(orderBy).replace(/"(\w+)"\s*:/g, '$1:')}
    )
  }`;

/* _____________end product detail */

/* product Set Detail */
export const DUMMY_PRODUCT_SET_TAB = {
  dataInfo: {
    productTradings: {
      productTradingBadge: 3,
      productTradings: [
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客A',
          employeeId: 1,
          employeeName: '社員A',
          productId: 1002,
          productName: '商品C',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          endPlanDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 111,
          customerName: '顧客B',
          employeeId: 1,
          employeeName: '社員B',
          productId: 10421,
          productName: '商品C',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          endPlanDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000
        },
        {
          amountTotal: 100000,
          productsTradingsId: 101,
          customerId: 1112,
          customerName: '顧客C',
          employeeId: 1,
          employeeName: '社員A',
          productId: 10421,
          productName: '商品Z',
          productTradingProgressId: 1,
          progressName: 'アプローチ',
          endPlanDate: '2020/10/11',
          quantity: 1,
          price: 1000,
          amount: 2000
        }
      ],
      fieldInfoTab: [
        {
          fieldId: 1,
          fieldInfoTabId: 1,
          fieldInfoTabPersonalId: 1,
          fieldName: 'customerName',
          fieldLabel: '顧客名',
          fieldType: 10,
          fieldOrder: 1,
          isColumnFixed: false,
          columnWidth: 15,
          fieldItems: []
        },
        {
          fieldId: 2,
          fieldInfoTabId: 2,
          fieldInfoTabPersonalId: 2,
          fieldName: 'employeeName',
          fieldLabel: '担当者',
          fieldType: 10,
          fieldOrder: 2,
          isColumnFixed: false,
          columnWidth: 15,
          fieldItems: []
        },
        {
          fieldId: 3,
          fieldInfoTabId: 3,
          fieldInfoTabPersonalId: 3,
          fieldName: 'progressName',
          fieldLabel: '進捗状況',
          fieldType: 10,
          fieldOrder: 3,
          isColumnFixed: false,
          columnWidth: 18,
          fieldItems: []
        },
        {
          fieldId: 4,
          fieldInfoTabId: 5,
          fieldInfoTabPersonalId: 5,
          fieldName: 'endPlanDate',
          fieldLabel: '完了予定日',
          fieldType: 10,
          fieldOrder: 5,
          isColumnFixed: false,
          columnWidth: 22,
          fieldItems: []
        },
        {
          fieldId: 5,
          fieldInfoTabId: 6,
          fieldInfoTabPersonalId: 6,
          fieldName: 'amount',
          fieldLabel: '金額',
          fieldType: 10,
          fieldOrder: 5,
          isColumnFixed: false,
          columnWidth: 30,
          fieldItems: []
        }
      ]
    },

    dataTabsInfo: [
      {
        tabInfoId: 7,
        tabId: 6,
        labelJaJp: '基本情報',
        labelEnUs: '',
        labelZhCn: '',
        tabOrder: 1,
        isDisplay: true,
        isDisplaySummary: true,
        maxRecord: 5
      },

      {
        tabInfoId: 8,
        tabId: 1,
        labelJaJp: '取引商品',
        labelEnUs: '',
        labelZhCn: '',
        tabOrder: 6,
        isDisplay: true,
        isDisplaySummary: true,
        maxRecord: 5,
        badges: 99
      },
      {
        tabInfoId: 9,
        tabId: 2,
        labelJaJp: 'History',
        labelEnUs: '',
        labelZhCn: '',
        tabOrder: 7,
        isDisplay: true,
        isDisplaySummary: true,
        maxRecord: 2
      }
    ]
  },
  dataTabsInfo: [
    {
      tabInfoId: 1,
      tabId: '1',
      labelJaJp: '基本情報',
      labelEnUs: '',
      labelZhCn: '',
      tabOrder: 1,
      isDisplay: true,
      isDisplaySummary: true,
      maxRecord: 5
    },
    {
      tabInfoId: 6,
      tabId: '6',
      labelJaJp: '取引商品',
      labelEnUs: '',
      labelZhCn: '',
      tabOrder: 6,
      isDisplay: true,
      isDisplaySummary: true,
      maxRecord: 5,
      badges: 99
    },
    {
      tabInfoId: 11,
      tabId: '11',
      labelJaJp: '変更履歴',
      labelEnUs: '',
      labelZhCn: '',
      tabOrder: 7,
      isDisplay: true,
      isDisplaySummary: true,
      maxRecord: 2
    }
  ]
};

export const PARAM_GET_TAB_SET_DETAIL = (productId, isContainDataSummary) =>
  `query {
    getProductSet(productId: ${JSON.stringify(productId).replace(/"(\w+)"\s*:/g, '$1:')} ,
    isContainDataSummary : ${isContainDataSummary}) {
    fieldInfoTab{
      fieldId
      fieldInfoTabId
      fieldInfoTabPersonalId
      fieldOrder
      fieldName
      fieldType
      isColumnFixed
      columnWidth
      }
    }
  }`;

export const PARAM_GET_HISTORY = params =>
  `query{
    productSetHistory(productId: ${params.productId},  currentPage: ${params.currentPage}, limit : ${params.limit})  {
      createdDate
      createdUserId
      createdUserName
      createdUserImage
      contentChange
      reasonEdit
    }
  }`;

export const TAB_ID_LIST_SET = {
  summary: 0,
  productTrading: 1,
  changehistory: 2
};

export const LANG_CODE = {
  enUs: 'en_us',
  jaJp: 'ja_jp',
  zhCn: 'zh_cn'
};

export const PREFIX_PRODUCT_SET_DETAIL = {
  enUs: 'Set ',
  jaJp: 'セット',
  zhCn: '套组'
};

export const EMPTY = '';
   
export const FIELDNAME_ADD_PREFIX = ['product_id', 'product_name', 'product_image_name', 'product_type_id', 'unit_price'];

export const CLASS_CUSTOM = 'block-feedback block-feedback-green text-left';

/* product Set Detail End */

export const NO_VALUE = 'NO_VALUE';

export enum EVENT_MESSAGES_POPOUT {
  UPDATE_PRODUCT_SET_SUCCESS,
  REMOVE_PRODUCT = 'REMOVE_PRODUCT'
}

export const FIELD_TYPE = {
  NUMBER: '5',
  TEXT: '9',
  TEXT_AREA: '10',
  FILE: '11',
  RELATION: '17',
  ADDRESS: '14'
};

export const MARK = {
  COMMA: ', '
};

export enum TypeMessage {
  downloadFileError,
  deleteWarning
}
