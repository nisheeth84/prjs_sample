import ProductSuggestStyles from './product-suggest-styles'
import React, { useEffect, useState } from 'react'
import {
  Modal as RNModal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  RefreshControl,
  SectionList
} from 'react-native'
import { ProductSuggestion } from "../activity-create-edit-reducer"
import { messages } from './product-suggest-messages'
import { SuggetionModalVisible, StatusButton, TypeButton } from '../../../../config/constants/enum'
import { translate } from '../../../../config/i18n'
import { Icon } from '../../../../shared/components/icon'
import { ProductItem } from './product-item'
import { ActivityCreateEditStyle } from '../activity-create-edit-style'
import { getProductTradingSuggestions, getProductSuggestions, DataProductTrading, ProductTrading, getProductTradings, GetProductTradingResponse } from '../activity-create-edit-repository'
import { CommonButton } from '../../../../shared/components/button-input/button'
import { TEXT_EMPTY, SPACE_HALF_SIZE } from '../../../../config/constants/constants'
import { activityDetailSelector, fieldInfosProductTradingSelector } from '../../detail/activity-detail-selector'
import { useSelector } from 'react-redux'
import { ProductTradingMode, ActivityRegisterEditMode, ProductTradingSearchType } from '../../constants'
import _ from "lodash"
import { DefaultProductTrading, IProductSuggestProps, SectionProductTrading } from './product-suggest-interface'
import { useDebounce } from '../../../../config/utils/debounce'
import StringUtils from '../../../../shared/util/string-utils'
import { authorizationSelector } from '../../../login/authorization/authorization-selector'

/**
 * Component for searching text fields
 * @param props see IProductSuggestProps
 */
export function ProductSuggestView(props: IProductSuggestProps) {
  /**
  * languageCode
  */
  const authorizationState = useSelector(authorizationSelector)
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY

  /**
   * the searchValue
   */
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY)

  /**
   * start offset search API
   */
  const [currentOffset, setCurrentOffset] = useState(0)

  /**
   * error message if call API error
   */
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY)

  /**
   * show modal
   */
  const [modalVisible, setModalVisible] = useState(SuggetionModalVisible.INVISIBLE)

  /**
   * show list suggestion
   */
  const [isShowSuggestion, setShowSuggestion] = useState(false)

  /**
   * map check item chosen
   */
  const [stateCheck, setStateChecked] = useState(new Map())

  /**
   * list product chosen
   */
  const [dataSelected, setDataSelected] = useState<ProductTrading[]>([])

  /**
   * list product chosen view
   */
  const [dataViewSelected, setDataViewSelected] = useState<ProductTrading[]>([])

  /**
   * list productTradingId chosen
   */
  const [listIdChoiceProductTrading] = useState<Array<number>>([])

  /**
   * list productId chosen
   */
  const [listIdChoiceProduct] = useState<Array<number>>([])

  /**
   * show reach end loading icon
   */
  const [footerIndicator, setFooterIndicator] = useState(true)
  const [refreshData, setRefreshData] = useState(false)
  const activityData = useSelector(activityDetailSelector)
  const PRODUCT_TRADING_KEY = "productTrading"
  const PRODUCT_KEY = "product"
  const customerId = props.customerId

  /**
   * init data product trading
   */
  const initDataProductTrading = (mode: string): DataProductTrading => {
    const data: DataProductTrading = {
      mode: mode,
      productTradings: []
    }
    return data
  }

  /**
   * data save product trading
   */
  const [dataProductTradingAddMode] = useState<DataProductTrading>(initDataProductTrading(ProductTradingMode.ADD))
  const [dataProductTradingEditMode] = useState<DataProductTrading>(initDataProductTrading(ProductTradingMode.EDIT))
  const [dataProductTradingDeleteMode] = useState<DataProductTrading>(initDataProductTrading(ProductTradingMode.DELETE))

  /**
   * list data result search product
   */
  const [productTradingSuggestionList, setProductTradingSuggestionList] = useState<Array<any>>([])
  const [productSuggestionList, setProductSuggestionList] = useState<Array<any>>([])

  /**
   * map result search
   */
  const [contentSearch, setContentSearch] = useState<Map<string, SectionProductTrading>>(new Map())

  /**
   * list view result search
   */
  const [arrSectionProductTrading, setArrSectionProductTrading] = useState<SectionProductTrading[]>([])
  const [searchType, setSearchType] = useState<string>(ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION)

  /**
   * boolean to prevent call api getProductTradings when change customerId in first time enter edit screen
   */
  const [isPreventChangeCustomer, setIsPreventChangeCustomer] = useState<boolean>(true)

  /**
   * boolean check api productSuggestion has empty response, if empty so not search when reach end
   */
  const [isEmptyProductResponse, setIsEmptyProductResponse] = useState(false)

  const debouncedSearchValue = useDebounce(searchValue, 500)

  /**
   * field info product trading list
   */
  const fieldInfoProductTrading = useSelector(fieldInfosProductTradingSelector)

  useEffect(() => {
    if (debouncedSearchValue && debouncedSearchValue.length > 0) {
      handleCallAPI(ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION, currentOffset, searchValue)
    }
  }, [debouncedSearchValue])

  useEffect(() => {
    if (activityData?.productTradings && activityData.productTradings.length > 0) {
      for (const productTrading of activityData.productTradings) {
        const productTradingData: ProductTrading = copyValueToDataSaveProductTrading(productTrading)
        if (productTrading["productTradingId"]) {
          dataProductTradingEditMode["productTradings"]?.push(productTradingData)
          listIdChoiceProductTrading.push(productTrading["productTradingId"])
        } else {
          listIdChoiceProduct.push(productTrading["productId"])
          dataProductTradingAddMode["productTradings"]?.push(productTradingData)
        }
      }
      setDataViewSelected(activityData.productTradings)
    }
  }, [])

  useEffect(() => {
    setDataSelected([])
    setStateChecked(new Map)
    setArrSectionProductTrading([])
    setContentSearch(new Map)
    handleSearch(TEXT_EMPTY)
    setShowSuggestion(false)
    if (modalVisible === SuggetionModalVisible.INVISIBLE_SAVE) {
      props.updateStateElement("dataProductTradings", initDataProductTradingReturn())
    }
  }, [modalVisible])

  useEffect(() => {
    if (customerId && customerId > 0
        && !(activityData?.productTradings && activityData?.productTradings?.length > 0 && isPreventChangeCustomer)) {
      callAPIGetProductTradings()
      props.updateStateElement("dataProductTradings", initDataProductTradingReturn())
    }
    setIsPreventChangeCustomer(false)
  }, [customerId])

  useEffect(() => {
    if (arrSectionProductTrading.length > 0) {
      setShowSuggestion(true)
    }
  }, [arrSectionProductTrading])

  useEffect(() => {
    let arrSection: Array<SectionProductTrading> = []
    contentSearch.forEach((item, key) => {
      const newItem: SectionProductTrading = {
        icon: item["icon"],
        title: item["title"],
        type: item["type"],
        data: item["data"],
        renderItem: ({ item, index, section: { data } }) => renderItem({ item, index, data }, key, stateCheck),
      }
      arrSection.push(newItem)
    })
    setArrSectionProductTrading(arrSection)
  }, [stateCheck])

  const copyValueToDataSaveProductTrading = (originalObj: ProductTrading) => {
    const productTradingData: ProductTrading = DefaultProductTrading
    productTradingData["productTradingId"] = originalObj["productTradingId"]
    productTradingData["productId"] = originalObj["productId"]
    productTradingData["customerId"] = originalObj["customerId"]
    productTradingData["quantity"] = originalObj["quantity"]
    productTradingData["price"] = originalObj["price"] ? originalObj["price"] : originalObj["unitPrice"]
    productTradingData["amount"] = originalObj["amount"]
    productTradingData["productTradingProgressId"] = originalObj["productTradingProgressId"]
    productTradingData["endPlanDate"] = originalObj["endPlanDate"]
    productTradingData["orderPlanDate"] = originalObj["orderPlanDate"]
    productTradingData["employeeId"] = originalObj["employee"] ? originalObj["employee"].employeeId : originalObj?.employeeId
    productTradingData["memo"] = originalObj["memo"]
    productTradingData["memoProduct"] = originalObj["productMemo"]
    productTradingData["productCategoryName"] = originalObj["productCategoryName"]
    productTradingData["productTradingData"] = originalObj["productTradingData"]
    return productTradingData
  }

  /**
   * add product selected in popup
   *  @param item selected
   */
  const handleAddNewSuggestions = (item: ProductSuggestion, newStateCheck: Map<string, boolean>) => {
    let keyProduct
    if (item?.productTradingId) {
      keyProduct = PRODUCT_TRADING_KEY + item.productTradingId
    } else {
      keyProduct = PRODUCT_KEY + item.productId
    }
    let resultList = _.cloneDeep(dataSelected)
    const isExistProduct = resultList.filter(itemProduct => itemProduct.productTradingId ? itemProduct.productTradingId === item?.productTradingId : itemProduct.productId === item.productId)
    if (newStateCheck.has(keyProduct) && newStateCheck.get(keyProduct)) {
      if (isExistProduct?.length === 0) {
        resultList.push(item)
      }
    } else {
      if (isExistProduct?.length > 0) {
        if (resultList.length > 1) {
          resultList.splice(resultList.indexOf(item), 1)
        } else {
          resultList.pop()
        }
      }
    }
    setDataSelected(resultList)
  }

  /**
   * call API GetProductTradingSuggestion
   * @param offset 
   */
  const callAPIGetProductTradingSuggestion = async (offset: number, searchValue: string) => {
    const payload = {
      searchValue: searchValue,
      offset: offset,
      listIdChoice: listIdChoiceProductTrading,
      customerIds: customerId ? [customerId] : []
    }
    const productTradingResponse = await getProductTradingSuggestions(payload)
    // setCurrentOffset(offset)
    return productTradingResponse
  }

  /**
   * call API getProductSuggestion
   * @param offset 
   */
  const callAPIGetProductSuggestion = async (offset: number, textSearch: string) => {
    const payload = {
      searchValue: textSearch,
      offset: offset,
      listIdChoice: listIdChoiceProduct
    }
    const productResponse = await getProductSuggestions(payload)
    // setCurrentOffset(offset)
    return productResponse
  }

  /**
   * show item detail info
   * @param item 
   * @param type 
   */
  const getItemDetail = (item: ProductSuggestion, type: string) => {
    if (type === ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION) {
      return {
        firstLine: item?.customerName,
        secondLine: `${item?.productName}${SPACE_HALF_SIZE}(${StringUtils.getFieldLabel(item, "progressName", languageCode)})`,
        thirdLine: item?.employeeName
      }
    } else {
      return {
        firstLine: StringUtils.getFieldLabel(item, "productCategoryName", languageCode),
        secondLine: item?.productName,
        thirdLine: item?.unitPrice
      }
    }
  }

  /**
   * handle call API suggestion
   * @param _productTradingSearchType 
   * @param offset 
   * @param textSearch 
   * @param isRefresh 
   */
  const handleCallAPI = async (_productTradingSearchType: string, offset: number, textSearch: string, isRefresh?: boolean) => {
    let response
    switch (_productTradingSearchType) {
      case ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION:
        response = await callAPIGetProductTradingSuggestion(offset, textSearch)
        break
      case ProductTradingSearchType.PRODUCT_SUGGESTION:
        response = await callAPIGetProductSuggestion(offset, textSearch)
        break
      default:
        break
    }
    handleErrorCallAPI(_productTradingSearchType, response, isRefresh)
  }

  useEffect(() => {
    handleCallAPI(searchType, currentOffset, searchValue)
  }, [currentOffset])

  /**
   * handle error call API suggestion
   * @param _productTradingSearchType 
   * @param response 
   * @param isRefresh 
   */
  const handleErrorCallAPI = (_productTradingSearchType: string, response: any, isRefresh?: boolean) => {
    let productList = []
    if (response.status) {
      if (response.status === 200) {
        if (_productTradingSearchType === ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION) {
          if (response?.data?.productTradings && response?.data?.productTradings.length > 0) {
            if (isRefresh) {
              productList = response?.data.productTradings
            } else {
              productList = productTradingSuggestionList.concat(response?.data.productTradings)
            }
            if (productTradingSuggestionList.length === 0 && response?.data.productTradings.length < 10) {
              setSearchType(ProductTradingSearchType.PRODUCT_SUGGESTION)
              handleCallAPI(ProductTradingSearchType.PRODUCT_SUGGESTION, 0, searchValue)
            } 
            updateContentSearch(_productTradingSearchType, productList)
            setProductTradingSuggestionList(productList)
            createStateCheck(response?.data.productTradings)
          } else {
            productList = _.cloneDeep(productTradingSuggestionList)
            updateContentSearch(_productTradingSearchType, productList)
            setSearchType(ProductTradingSearchType.PRODUCT_SUGGESTION)
            if (currentOffset === 0) {
              handleCallAPI(ProductTradingSearchType.PRODUCT_SUGGESTION, 0, searchValue)
            } else {
              setCurrentOffset(0)
            }
          }
        } else if (_productTradingSearchType === ProductTradingSearchType.PRODUCT_SUGGESTION)
          if (response?.data.dataInfo && response.data.dataInfo.length > 0) {
            for (const product of response.data.dataInfo) {
              product["memoProduct"] = product["memo"]
              product["quantity"] = 1
              product["price"] = product["unitPrice"]
              product["amount"] = product["unitPrice"]
            }
            productList = productSuggestionList.concat(response.data.dataInfo)
            updateContentSearch(_productTradingSearchType, productList)
            setProductSuggestionList(productList)
            createStateCheck(response?.data.dataInfo)
          } else {
            productList = _.cloneDeep(productSuggestionList)
            updateContentSearch(_productTradingSearchType, productList)
            setIsEmptyProductResponse(true)
          }
      }
      setErrorMessage(TEXT_EMPTY)
    } else {
      setErrorMessage(translate(messages.errorCallAPI))
    }
    setRefreshData(false)
    setFooterIndicator(false)
  }

  /**
   * update view search suggestion
   * @param _productTradingSearchType 
   */
  const updateContentSearch = (_productTradingSearchType: string, productList: any) => {
    const mapSection = contentSearch
    switch (_productTradingSearchType) {
      case ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION:
        mapSection.set(ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION, {
          icon: "icBook",
          title: translate(messages.productTradingLabel),
          type: ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION,
          data: productList,
          renderItem: ({ item, index, section: { data } }) => renderItem({ item, index, data }, ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION, stateCheck)
        })
        break
      case ProductTradingSearchType.PRODUCT_SUGGESTION:
        mapSection.set(ProductTradingSearchType.PRODUCT_SUGGESTION, {
          icon: "icOther",
          title: translate(messages.productLabel),
          type: ProductTradingSearchType.PRODUCT_SUGGESTION,
          data: productList,
          renderItem: ({ item, index, section: { data } }) => renderItem({ item, index, data }, ProductTradingSearchType.PRODUCT_SUGGESTION, stateCheck)
        })
        break
      default:
        break;
    }
    setContentSearch(mapSection)
    let arrSection: Array<SectionProductTrading> = []
    mapSection.forEach(item => { arrSection.push(item) })
    setArrSectionProductTrading(arrSection)
  }

  /**
   * call API getProductTradings
   * @param offset 
   */
  const callAPIGetProductTradings = async () => {
    const payload = {
      selectedTargetId: 0,
      isOnlyData: true,
      searchConditions: [
        {
          fieldType: 5,
          isDefault: true,
          fieldName: "customer_id",
          fieldValue: JSON.stringify(customerId ? [customerId] : []),
        }
      ],
      isFinish: false
    }
    const response = await getProductTradings(payload)
    handleAPIGetProductTradings(response)
  }

  /**
   * handle response after call API GetProductTradings
   * @param response 
   */
  const handleAPIGetProductTradings = (response: GetProductTradingResponse) => {
    if (response?.status && response.status === 200) {
      if (response.data.productTradings) {
        handleProductTradings(response.data.productTradings)
      }
    }
  }

  /**
   * show product trading after change customerId
   * @param productTradings 
   */
  const handleProductTradings = (productTradings: Array<ProductTrading>) => {
    const dataView = _.cloneDeep(dataViewSelected)
    productTradings.forEach(item => {
      const isExistProductView = dataView.find(productView => productView?.productTradingId === item.productTradingId)
      if (!isExistProductView) {
        dataView.push(item)
        listIdChoiceProductTrading.push(item.productTradingId)
        dataProductTradingEditMode["productTradings"]?.push(copyValueToDataSaveProductTrading(item))
      }
    })
  }

  /**
   * handle text input to show suggestion
   * @param text text from input
   */
  const handleSearch = async (text: string) => {
    setCurrentOffset(0)
    setSearchValue(text)
    setIsEmptyProductResponse(false)
    setFooterIndicator(true)
    setErrorMessage(TEXT_EMPTY)
    setArrSectionProductTrading([])
    setContentSearch(new Map)
    setProductTradingSuggestionList([])
    setProductSuggestionList([])
    setFooterIndicator(false)
    setSearchType(ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION)
    setShowSuggestion(false)
  }

  /**
   * confirm selection
   *  @param list item selected product
   */
  const confirmSearch = () => {
    const data = _.cloneDeep(dataSelected)
    const dataView: ProductSuggestion[] = _.cloneDeep(dataViewSelected)
    setModalVisible(SuggetionModalVisible.INVISIBLE_SAVE)
    if (data.length > 0) {
      for (const product of data) {
        if (product.productTradingId) {
          const keyProduct = PRODUCT_TRADING_KEY + product.productTradingId
          if (stateCheck.has(keyProduct) && stateCheck.get(keyProduct)) {
            dataView.push(product)
            dataProductTradingEditMode["productTradings"]?.push(copyValueToDataSaveProductTrading(product))
            listIdChoiceProductTrading.push(product.productTradingId)
          }
        } else {
          const keyProduct = PRODUCT_KEY + product.productId
          if (stateCheck.has(keyProduct) && stateCheck.get(keyProduct)) {
            dataView.push(product)
            dataProductTradingAddMode["productTradings"]?.push(copyValueToDataSaveProductTrading(product))
            listIdChoiceProduct.push(product.productId)
          }
        }
      }
    }
    setDataViewSelected(dataView)
  }

  /**
   * set map state check view checkbox 
   * @param product product checked
   */
  const handleViewCheckbox = (product: ProductSuggestion) => {
    const newStateCheck = new Map(stateCheck)
    if (product?.productTradingId) {
      const keyProduct = PRODUCT_TRADING_KEY + product.productTradingId
      newStateCheck.set(keyProduct, !stateCheck.get(keyProduct))
    } else {
      const keyProduct = PRODUCT_KEY + product.productId
      newStateCheck.set(keyProduct, !stateCheck.get(keyProduct))
    }
    setStateChecked(newStateCheck)
    return newStateCheck
  }

  /**
   * create new state for checkbox when change keyword
   */
  const createStateCheck = (data: ProductSuggestion[]) => {
    data.forEach(product => {
      if (product?.productTradingId) {
        stateCheck.set(PRODUCT_TRADING_KEY + product.productTradingId, false)
      } else {
        stateCheck.set(PRODUCT_KEY + product.productId, false)
      }
    })
    setStateChecked(stateCheck)
  }

  /**
   * event click choose product item in list
   * @param product ProductSuggest
   */
  const handleClickProductItem = (product: ProductSuggestion) => {
    const newStateCheck = handleViewCheckbox(product)
    handleAddNewSuggestions(product, newStateCheck)
  }

  /**
   * remove item chosen
   * @param product 
   */
  const removeItem = (product: ProductSuggestion) => {
    const dataView = _.cloneDeep(dataViewSelected)
    dataView.forEach((item, index) => {
      if (product.productTradingId && product.productTradingId > 0) {
        if (item.productTradingId === product.productTradingId) {
          if (dataView.length > 1) {
            dataView.splice(index, 1)
          } else {
            dataView.pop()
          }
        }
      } else {
        if (item.productId === product.productId) {
          if (dataView.length > 1) {
            dataView.splice(index, 1)
          } else {
            dataView.pop()
          }
        }
      }
    })
    setDataViewSelected(dataView)
    if (product.productTradingId) {
      dataProductTradingEditMode["productTradings"]?.forEach((item, index) => {
        if (product.productTradingId === item.productTradingId) {
          dataProductTradingEditMode["productTradings"]?.splice(index, 1)
          if (props.actionMode === ActivityRegisterEditMode.EDIT) {
            dataProductTradingDeleteMode["productTradings"]?.push(item)
          }
        }
      })
      if (props.actionMode !== ActivityRegisterEditMode.EDIT) {
        listIdChoiceProductTrading.forEach((id, i) => {
          if (id === product.productTradingId) {
            listIdChoiceProductTrading.splice(i, 1)
          }
        })
      }
    } else {
      dataProductTradingAddMode["productTradings"]?.forEach((item, index) => {
        if (product.productId === item.productId) {
          dataProductTradingAddMode["productTradings"]?.splice(index, 1)
        }
      })
      listIdChoiceProduct.forEach((id, i) => {
        if (id === product.productId) {
          listIdChoiceProduct.splice(i, 1)
        }
      })
    }
  }

  /**
   * create list data save product trading
   */
  const initDataProductTradingReturn = () => {
    const resultSuggestion: Array<DataProductTrading> = []
    if (dataProductTradingAddMode["productTradings"] && dataProductTradingAddMode["productTradings"].length > 0) {
      resultSuggestion.push(dataProductTradingAddMode)
    }
    if (dataProductTradingEditMode["productTradings"] && dataProductTradingEditMode["productTradings"].length > 0) {
      resultSuggestion.push(dataProductTradingEditMode)
    }
    if (dataProductTradingDeleteMode["productTradings"] && dataProductTradingDeleteMode["productTradings"].length > 0) {
      resultSuggestion.push(dataProductTradingDeleteMode)
    }
    return resultSuggestion
  }

  /** 
   * check scroll bottom
   */
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    return layoutMeasurement?.height + contentOffset?.y >= contentSize?.height - 20;
  }

  /**
   * Show productList has been selected
   */
  const showProductList = () => {
    return (
      <View>
        {dataViewSelected?.map((productItem: ProductSuggestion) => {
          const fileInfoList = _.cloneDeep(fieldInfoProductTrading)
          if (fileInfoList && fileInfoList.length > 0) {
            fileInfoList.forEach(field => {
              if (field.fieldName === "product_trading_progress_id") {
                field.fieldItems.forEach(item => {
                  item["isDefault"] = item["itemId"] === productItem["productTradingProgressId"]
                })
              }
            })
            fileInfoList.sort((a, b) => { return a.fieldOrder - b.fieldOrder })
          }
          return (
            <ProductItem
              key={productItem.productTradingId ? PRODUCT_TRADING_KEY + productItem.productTradingId : PRODUCT_KEY + productItem.productId}
              productItem={productItem}
              activityFormatId={props.activityFormatId}
              activityFormatList={props.activityFormatList}
              fieldInfoList={fileInfoList}
              removeItem={(item: ProductSuggestion) => removeItem(item)}
              onChangeInfoItem={() => props.updateStateElement("dataProductTradings", initDataProductTradingReturn())}
            />
          )
        })}
      </View>
    )
  }

  /**
   * render item search
   * @param param0 
   * @param type 
   */
  const renderItem = ({ item }: any, type: string, stateCheck: Map<string, boolean>) => {
    const itemDetail = getItemDetail(item, type)
    let keyProduct = ""
    if (type === ProductTradingSearchType.PRODUCT_TRADING_SUGGESTION) {
      keyProduct = PRODUCT_TRADING_KEY + item.productTradingId
    } else if (type === ProductTradingSearchType.PRODUCT_SUGGESTION) {
      keyProduct = PRODUCT_KEY + item.productId
    }
    const isCheck = stateCheck.get(keyProduct)
    return (
      <View style={ProductSuggestStyles.marginItemSearch}>
        <TouchableOpacity
          style={[ProductSuggestStyles.touchableSelect]}
          onPress={() => { handleClickProductItem(item) }}
        >
          <View style={ProductSuggestStyles.suggestTouchable}>
            <Text style={ProductSuggestStyles.suggestText}>{itemDetail?.firstLine}</Text>
            <Text style={ProductSuggestStyles.suggestText}>{itemDetail?.secondLine}</Text>
            <Text style={ProductSuggestStyles.suggestText}>{itemDetail?.thirdLine}</Text>
          </View>
          <View style={ProductSuggestStyles.iconCheckView}>
            {isCheck &&
              <Icon style={ProductSuggestStyles.iconCheck} name="checkedIcon" />
            }
            {!isCheck &&
              <Icon style={ProductSuggestStyles.iconCheck} name="unCheckedIcon" />
            }
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  /*
   * Render the text component in add-edit case
   */
  return (
    <View>
      {/*
      <Modal
        isVisible={isFetchingData}>
        <ActivityIndicator />
      </Modal>
    */}

      <Text
        style={[
          ProductSuggestStyles.marginB5,
          ActivityCreateEditStyle.ActivityTitle,
          ActivityCreateEditStyle.FontWeight
        ]}
      >
        {props.fieldLabel}
      </Text>
      <Text
        style={[ProductSuggestStyles.textHolder]}
        onPress={() => {
          setModalVisible(SuggetionModalVisible.VISIBLE)
        }}
      >
        {props.fieldLabel + translate(messages.placeholderMultiChoose)}
      </Text>
      {showProductList()}
      <RNModal
        animationType="slide"
        transparent={true}
        visible={modalVisible === SuggetionModalVisible.VISIBLE}
      >
        <View style={ProductSuggestStyles.modalContainer}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => {
              setModalVisible(SuggetionModalVisible.INVISIBLE)
            }} />
          <View style={[ProductSuggestStyles.modalContent, { flex: 3 }]}>
            <View style={ProductSuggestStyles.inputContainer}>
              {
                searchValue.length <= 0 &&
                <View style={ProductSuggestStyles.iconCheckView}>
                  <Icon style={ProductSuggestStyles.iconCheck} name="searchIcon" />
                </View>
              }
              <TextInput
                style={searchValue.length > 0 ? ProductSuggestStyles.inputSearchTextData : ProductSuggestStyles.inputSearchText}
                placeholder={props.fieldLabel + translate(messages.placeholderMultiChoose)}
                value={searchValue}
                onChangeText={(text: any) => {
                  handleSearch(text)
                }}
              />
              <View style={ProductSuggestStyles.textSearchContainer}>
                {searchValue.length > 0 && (
                  <TouchableOpacity onPress={() => handleSearch(TEXT_EMPTY)}>
                    <Icon name="icClose" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={ProductSuggestStyles.dividerContainer} />
            {
              errorMessage !== TEXT_EMPTY && (
                <Text style={ProductSuggestStyles.errorMessage}>{errorMessage}</Text>
              )
            }
            {
              isShowSuggestion &&
              <View
                style={[
                  ProductSuggestStyles.suggestionContainer
                ]}
              >
                <View>
                  <SectionList
                    renderSectionHeader={({ section: { title, icon, type } }) => (
                      <View
                        style={[
                          ProductSuggestStyles.ViewCustom,
                          ProductSuggestStyles.paddingTitle,
                          type === ProductTradingSearchType.PRODUCT_SUGGESTION ? ProductSuggestStyles.borderProduct : {}
                        ]}
                      >
                        <View style={ProductSuggestStyles.flex_D}>
                          <Icon name={icon} style={ProductSuggestStyles.ic_general} />
                          <Text style={ProductSuggestStyles.titleModal}>{title}</Text>
                        </View>
                      </View>
                    )}
                    sections={arrSectionProductTrading}
                    keyExtractor={(item: any) => item.productTradingId ? PRODUCT_TRADING_KEY + item.productTradingId : PRODUCT_KEY + item.productId}
                    ListFooterComponent={() => {
                      if (!footerIndicator) {
                        return null
                      } else {
                        return (
                          <ActivityIndicator style={{ padding: 5 }} animating={footerIndicator} size="large" />
                        )
                      }
                    }}
                    onScroll={({nativeEvent}) => {
                      if (isCloseToBottom(nativeEvent)) {
                        setTimeout(() => {
                          if (!isEmptyProductResponse) {
                            setFooterIndicator(true)
                            setCurrentOffset(currentOffset + 10)
                          }
                        }, 200);
                      }
                    }}
                    refreshControl={
                      <RefreshControl
                        refreshing={refreshData}
                        onRefresh={() => {
                          handleSearch(searchValue)
                          setShowSuggestion(false)
                        }}
                      />
                    }
                  />
                </View>
              </View>
            }
            <View style={ProductSuggestStyles.modalButton}>
              <CommonButton onPress={() => { confirmSearch() }} status={StatusButton.ENABLE} icon="" textButton={translate(messages.confirmProductSuggest)} typeButton={TypeButton.BUTTON_MINI_MODAL_SUCCESS}></CommonButton>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  )
}
