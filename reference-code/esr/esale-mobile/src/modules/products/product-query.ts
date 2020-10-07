const convertJson = (string: any) => {
  return string.replace(/"(\w+)"\s*:/g, "$1:");
};

export const queryProducts = (
  params = {
    searchConditions: [],
    productCategoryId: null,
    isContainCategoryChild: false,
    searchLocal: "",
    orderBy: [],
    limit: 30,
    offset: 0,
    isOnlyData: false,
    filterConditions: [],
    isUpdateListInfo: false,
  }
) => {
  return {
    query: `query {
        products(
          searchConditions: [],
          productCategoryId: null,
          searchLocal: "",
          orderBy: [],
          offset: ${params.offset},
          limit: 30,
          filterConditions: [],
      ) {
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
            productCategoryId
            productCategoryName
            productCategoryLevel
            displayOrder
            productCategoryChild{
              productCategoryId
              productCategoryName
              productCategoryLevel
              displayOrder
              productCategoryChild{
                productCategoryId
                productCategoryName
                productCategoryLevel
                displayOrder
                productCategoryChild{
                  productCategoryId
                  productCategoryName
                  productCategoryLevel
                  displayOrder
                  productCategoryChild{
                    productCategoryId
                    productCategoryName
                    productCategoryLevel
                    displayOrder
                  }
                }
              }
            }
          }
          productTypes{
            productTypeId
            productTypeName
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
        }
      }
    }`,
  };
};

export const queryProductDetailTrading = (
  params = {
    searchConditions: [],
    searchLocal: "",
    orderBy: [{ key: "product_name", value: "ASC" }],
    limit: 30,
    offset: 0,
    isOnlyData: false,
    filterConditions: [],
    isUpdateListInfo: false,
    isFirstLoad: false,
    selectedTargetType: null,
    selectedTargetId: null,
  }
) => {
  return {
    query: `
    {
      product(
        isOnlyData: ${params.isOnlyData},
        searchLocal: ${convertJson(JSON.stringify(params.searchLocal))},
        searchConditions: ${convertJson(
      JSON.stringify(params.searchConditions)
    )},
        filterConditions: ${convertJson(
      JSON.stringify(params.filterConditions)
    )},
        isFirstLoad: ${params.isFirstLoad},
        selectedTargetType: ${params.selectedTargetType},
        selectedTargetId: ${params.selectedTargetId},
        orderBy: ${params.orderBy},
        offset: ${params.offset},
        limit: ${params.limit},
        )
        {
          product{	
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
            updatedDate
            createdUserName
            updatedUserName
          }
          productCategories{
            productCategoryId
            productCategoryName
            productCategoryLevel
            displayOrder
          }
          productTypes{
            productTypeId
            productTypeName	
            fieldUse
          }
          productSets{
            productId
            productImagePath	
            productName
            unitPrice
          }
          productHistories{
            createdDate
            createdUserId
            createdUserName
            createdUserImage
            contentChange
          }
        }
    }`,
  };
};

export const queryProductHistory = (
  params = {
    productId: 1,
  }
) => {
  return {
    query: `query
      {
        productHistory(
          productId:  ${params.productId},
          )
          {
            createdDate							
            createdUserId							
            createdUserName							
            createdUserImage
            contentChange		
          }
      }`,
  };
};

export const queryProductSetHistory = (
  params = {
    productId: 1,
  }
) => {
  return {
    query: `
    {
      products(
        productId:  ${params.productId},
        )
        {
          createdDate							
          createdUserId							
          createdUserName							
          createdUserImage							
          contentChange							
          reasonEdit							
        }
    }`,
  };
};

export const queryProductSetDetails = (
  params = {
    productId: 0,
    isOnlyData: false,
    isContainDataSummary: false,
  }
) => {
  return {
    query: `
    {
      getProductSet(
        productId:  ${JSON.stringify(params.productId)},
        isContainDataSummary: ${JSON.stringify(params.isContainDataSummary)}
        )
        {
          dataInfo{
          productSet			
            {
            productId		
            productName		
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
            productData{
                fieldType
                      key
                      value
            }
            createdDate		
            createdUserId		
            createdUserName		
            updatedDate		
            updatedUserId		
            updatedUserName		
            }
          products			
            {
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
            }	
          productSets			
            {
            productId		
            productName		
            unitPrice		
            productImagePath
            }		
          productCategories			
            {
            productCategoryId		
            productCategoryName		
            productCategoryLevel		
            productCategoryChild{
                productCategoryId		
                productCategoryName		
                productCategoryLevel
                }
            }		
          productTypes			
            {
            productTypeId		
            productTypeName		
            fieldUse
            }
          productHistories			
            {
            createdDate		
            createdUserId		
            createdUserName		
            createdUserImage		
            contentChange
            }		
        }
        fieldInfoProductSet{
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
          ownPermissionLevel
          othersPermissionLevel
          defaultValue
          currencyUnit
          typeUnit
          decimalPlace
          urlType
          urlTarget
          urlEncode
          urlText
          linkTarget
          configValue
          isLinkedGoogleMap
          fieldGroup
          lookupData {
              searchKey
              itemReflect {
                  fieldId
                  fieldLabel
                  itemReflect
              }
          }
          relationData {
              fieldId
              format
              displayFieldId
              displayTab
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
    }`,
  };
};

export const queryProductDetails = (
  params = {
    productId: 0,
    isOnlyData: false,
    isContainDataSummary: false,
  }
) => {
  return {
    query: `
    {
      product(
        productId:  ${JSON.stringify(params.productId)},
        isOnlyData: ${JSON.stringify(params.isOnlyData)},
        isContainDataSummary: ${JSON.stringify(params.isContainDataSummary)}
        )
        {
          product{	
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
            updatedDate
            createdUserName
            updatedUserName
          }
          productCategories{
            productCategoryId
            productCategoryName
            productCategoryLevel
            displayOrder
          }
          productTypes{
            productTypeId
            productTypeName	
            fieldUse
          }
          productSets{
            productId
            productImagePath	
            productName
            unitPrice
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
            ownPermissionLevel
            othersPermissionLevel
            defaultValue
            currencyUnit
            typeUnit
            decimalPlace
            urlType
            urlTarget
            urlEncode
            urlText
            linkTarget
            configValue
            isLinkedGoogleMap
            fieldGroup
            lookupData {
                searchKey
                itemReflect {
                    fieldId
                    fieldLabel
                    itemReflect
                }
            }
            relationData {
                fieldId
                format
                displayFieldId
                displayTab
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
    }`,
  };
};
