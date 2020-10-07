import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { FieldAddEditLookupStyles } from "./field-add-edit-styles";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Modal
} from "react-native";
import {
  DefineFieldType, FIELD_BELONG, ControlType, ModifyFlag,
} from "../../../../../config/constants/enum";
import { messages, fieldAddEditMessages } from "./field-add-edit-messages";
import { translate } from "../../../../../config/i18n";
import _ from "lodash";
import { IDynamicFieldProps } from "../interface/dynamic-field-props";
import StringUtils from "../../../../util/string-utils";
import {
  FIELD_LABLE,
  TEXT_EMPTY,
  ITEM_LABEL,
} from "../../../../../config/constants/constants";
import { DynamicControlField } from "../dynamic-control-field";
import { getEmployees, getProductTradings, getProducts, getTasks, getBusinessCards, getCustomers, getActivities } from "../dynamic-control-repository";
import { AppIndicator } from "../../../app-indicator/app-indicator";

// Define value props of FieldAddEditLookup component
type IFieldAddEditLookupProps = IDynamicFieldProps;

/**
 * Component for show lookup fields
 * @param props see IFieldAddEditLookupProps
 */
export function FieldAddEditLookup(props: IFieldAddEditLookupProps) {
  const { fieldInfo, elementStatus, listFieldInfo, languageCode } = props;
  const directValueArr = [DefineFieldType.NUMERIC, DefineFieldType.DATE, DefineFieldType.DATE_TIME,
  DefineFieldType.TIME, DefineFieldType.TEXT, DefineFieldType.TEXTAREA, DefineFieldType.LINK,
  DefineFieldType.PHONE_NUMBER, DefineFieldType.ADDRESS, DefineFieldType.EMAIL, DefineFieldType.CALCULATION];
  const indirectValueArr = [DefineFieldType.SINGER_SELECTBOX, DefineFieldType.CHECKBOX, DefineFieldType.RADIOBOX];
  const fieldBelong = fieldInfo?.lookupData?.fieldBelong;
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);

  // local state
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [mainViewValue, setMainViewValue] = useState(new Map());
  const [suggestValue, setSuggestValue] = useState(new Map());
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const [isShowSuggestion, setShowSuggestion] = useState(false);
  const [responseApiData, setResponseApiData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fieldExtension, setFieldExtension] = useState(TEXT_EMPTY);
  const [functionName, setFunctionName] = useState(TEXT_EMPTY);
  const [renderDynamicValue, setRenderDynamicValue] = useState(false);
  const [offset, setOffset] = useState(0);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [overRecord, setOverRecord] = useState(false);
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  var suggestValueMap = new Map();
  const itemReflect = fieldInfo?.lookupData?.itemReflect ?? [];
  const limit = 20;
  const handleGetValue = (info: any, _fieldType: any, data: any) => {
    if (!props.updateStateElement && props.isDisabled) {
      return;
    }
    if (props.updateStateElement && !props.isDisabled) {
      props.updateStateElement(info, info.fieldType, data);
    }
  }

  /**
   * create all state for main view after render
   */
  useEffect(() => {
    var extension = TEXT_EMPTY
    switch (fieldBelong) {
      case FIELD_BELONG.EMPLOYEE:
        setFieldExtension("employeeData")
        extension = "employeeData"
        setFunctionName("employee")
        break;
      case FIELD_BELONG.CUSTOMER:
        setFieldExtension("customerData")
        extension = "customerData"
        setFunctionName("customer")
        break;
      case FIELD_BELONG.BUSINESS_CARD:
        setFieldExtension("businessCardData")
        extension = "businessCardData"
        setFunctionName("businessCard")
        break;
      case FIELD_BELONG.ACTIVITY:
        setFieldExtension(TEXT_EMPTY)
        extension = TEXT_EMPTY
        setFunctionName("activity")
        break;
      case FIELD_BELONG.PRODUCT:
        setFieldExtension("productData")
        extension = "productData"
        setFunctionName("product")
        break;
      case FIELD_BELONG.TASK:
        setFieldExtension("taskData")
        extension = "taskData"
        setFunctionName("task")
        break;
      case FIELD_BELONG.PRODUCT_TRADING:
        setFieldExtension("productTradingData")
        extension = "productTradingData"
        setFunctionName("productTrading")
        break;
      default:
        break;
    }
    createStateMain(extension)
    setRenderDynamicValue(true)
  }, [])

  /**
   * set state in suggest modal
   */
  useEffect(() => {
    setSuggestValue(suggestValueMap)
  }, [searchValue, modalVisible, responseApiData])

  /**
   * handle get data employees
   * @param keySearch searchCondition of API
   */
  const handleCallEmployee = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    setVisibleFooter(true)
    // TODO: handle key search
    const employeeResult = await getEmployees(
      {
        searchConditions: [],
        filterConditions: [],
        localSearchKeyword: textSearch,
        selectedTargetType: null,
        selectedTargetId: null,
        isUpdateListView: null,
        orderBy: [],
        offset: offset,
        limit: limit
      }
    )
    if (employeeResult?.status === 200) {
      if (!employeeResult.data || offset > employeeResult.data.totalRecords) {
        setOverRecord(true)
      } else if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...employeeResult.data.employees)
        setResponseApiData(data)
      } else {
        setResponseApiData(employeeResult.data.employees)
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle get data product tradings
   * @param keySearch searchCondition of API
   */
  const handleCallProductTrading = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    // TODO: handle key search, call API
    setVisibleFooter(true)
    const productTradingResult = await getProductTradings(
      {
        isOnlyData: null,
        searchLocal: textSearch,
        searchConditions: [keySearch],
        filterConditions: [],
        orderBy: [],
        offset: offset,
        limit: limit,
        isFirstLoad: null,
        selectedTargetType: null,
        selectedTargetId: null
      }
    )
    if (productTradingResult?.status === 200) {
      if (offset > productTradingResult.data.totalRecords) {
        setOverRecord(true)
      } else if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...productTradingResult.data.productTradings)
        setResponseApiData(data)
      } else {
        setResponseApiData(productTradingResult.data.productTradings)
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle get data products
   * @param keySearch searchCondition of API
   */
  const handleCallProduct = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    // TODO: handle key search
    setVisibleFooter(true)
    const productResult = await getProducts(
      {
        searchConditions: [],
        productCategoryId: null,
        isContainCategoryChild: null,
        searchLocal: textSearch,
        orderBy: [],
        offset: offset,
        limit: limit,
        isOnlyData: null,
        filterConditions: [],
        isUpdateListInfo: null
      }
    )
    if (productResult?.status === 200) {
      if (!productResult.data || offset > productResult.data.totalCount) {
        setOverRecord(true)
      } else if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...productResult.data.dataInfo.products)
        setResponseApiData(data)
      } else {
        setResponseApiData(productResult.data.dataInfo.products)
      }

    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle get data tasks
   * @param keySearch searchCondition of API
   */
  const handleCallTask = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    // TODO: handle key search, call API
    setVisibleFooter(true)
    const taskResult = await getTasks(
      {
        statusTaskIds: [],
        searchLocal: textSearch,
        localNavigationConditons: null,
        searchConditions: [],
        filterConditions: [],
        orderBy: [],
        limit: limit,
        offset: offset,
        filterByUserLoginFlg: 0
      }
    )
    if (taskResult?.status === 200) {
      if (!taskResult.data.dataInfo || offset > taskResult.data.dataInfo.countTotalTask) {
        setOverRecord(true)
      } else if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...taskResult.data.dataInfo.tasks)
        setResponseApiData(data)
      } else {
        setResponseApiData(taskResult.data.dataInfo.tasks)
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle get data business cards
   * @param keySearch searchCondition of API
   */
  const handleCallBusinessCard = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    // TODO: handle key search, call API
    setVisibleFooter(true)
    const businessCardResult = await getBusinessCards(
      {
        searchConditions: [keySearch],
        orderBy: [],
        offset: offset,
        limit: limit,
        searchLocal: textSearch,
        filterConditions: [],
        isFirstLoad: null
      }
    )
    if (businessCardResult?.status === 200) {
      if (offset > businessCardResult.data.totalRecords) {
        setOverRecord(true)
      } else if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...businessCardResult.data.businessCards)
        setResponseApiData(data)
      } else {
        setResponseApiData(businessCardResult.data.businessCards)
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle get data customers
   * @param keySearch searchCondition of API
   */
  const handleCallCustomer = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    // TODO: handle key search, call API
    setVisibleFooter(true)
    const customerResult = await getCustomers(
      {
        searchConditions: [keySearch],
        searchLocal: textSearch,
        selectedTargetType: null,
        selectedTargetId: null,
        isFirstLoad: null,
        isUpdateListView: null,
        filterConditions: [],
        orderBy: [],
        offset: offset,
        limit: limit,
      }
    )
    if (customerResult?.status === 200) {
      if (offset > customerResult.data.totalRecords) {
        setOverRecord(true)
      } else if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...customerResult.data.customers)
        setResponseApiData(data)
      } else {
        setResponseApiData(customerResult.data.customers)
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle get data activities
   * @param keySearch searchCondition of API
   */
  const handleCallActivity = async (loadMore: boolean, keySearch: string, textSearch: string) => {
    // TODO: handle key search, call API
    setVisibleFooter(true)
    const activityResult = await getActivities(
      {
        listBusinessCardId: [],
        listCustomerId: [],
        listProductTradingId: [],
        searchLocal: textSearch,
        searchConditions: [keySearch],
        filterConditions: [],
        isFirstLoad: null,
        selectedTargetType: null,
        selectedTargetId: null,
        orderBy: [],
        offset: offset,
        limit: limit,
        hasTimeline: null
      }
    )
    if (activityResult?.status === 200) {
      if (offset > activityResult.data.totalRecords) {
        setOverRecord(true)
      }
      if (loadMore) {
        const data = _.cloneDeep(responseApiData)
        data.push(...activityResult.data.activities)
        setResponseApiData(data)
      } else {
        setResponseApiData(activityResult.data.activities)
      }
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
    }
    setOffset(offset + limit)
    setVisibleFooter(false)
  }

  /**
   * handle text input to show suggestion
   * @param text text from input
   * @param fieldBelong id function (ex: employee, customer...)
   */
  const handleSearch = (text: string, loadMore: boolean) => {
    setSearchValue(text);
    setShowSuggestion(true)
    setErrorMessage("");
    suggestValueMap = new Map();

    let keySearch = fieldInfo.fieldName
    switch (fieldBelong) {
      case FIELD_BELONG.EMPLOYEE:
        handleCallEmployee(loadMore, keySearch, text)
        break;
      case FIELD_BELONG.CUSTOMER:
        handleCallCustomer(loadMore, keySearch, text)
        break;
      case FIELD_BELONG.BUSINESS_CARD:
        handleCallBusinessCard(loadMore, keySearch, text)
        break;
      case FIELD_BELONG.ACTIVITY:
        handleCallActivity(loadMore, keySearch, text)
        break;
      case FIELD_BELONG.PRODUCT:
        handleCallProduct(loadMore, keySearch, text)
        break;
      case FIELD_BELONG.TASK:
        handleCallTask(loadMore, keySearch, text)
        break;
      case FIELD_BELONG.PRODUCT_TRADING:
        handleCallProductTrading(loadMore, keySearch, text)
        break;
      default:
        break;
    }
  };

  /**
   * create new state for all component in main view
   * @param data list data to creat new state
   */
  const createStateMain = (extension: string) => {
    const stateMain = new Map()
    const dataExtension = elementStatus?.fieldValue && elementStatus?.fieldValue[extension];
    itemReflect?.forEach((itemReflectCom: any, key: number) => {
      const info = listFieldInfo?.find((item) => itemReflectCom.fieldId === item.fieldId)
      const dataView = dataExtension?.find((data: any) => data["key"] == info?.fieldName)
      stateMain.set(key, dataView ? dataView["value"] : TEXT_EMPTY)
    })
    setMainViewValue(stateMain)
  };

  /**
   * event click choose item in list
   * @param itemId itemId just selected
   */
  const confirmItem = (itemId: string) => {
    setDisableConfirm(true)
    const mainValue = _.cloneDeep(mainViewValue)
    const suggestInfo = suggestValue.get(itemId)
    mainValue.forEach((_value: any, key: any, map: any) => {
      map.set(key, suggestInfo.get(key))
    })
    setRenderDynamicValue(true)
    setMainViewValue(mainValue)
    setModalVisible(false)
    setDisableConfirm(false)
    setOffset(0)
  };

  /**
   * event init popup
   */
  const initDataModal = () => {
    setModalVisible(true)
    setOverRecord(false)
    setRenderDynamicValue(false)
  };

  /**
   * Render main component
   */
  const renderComponent = () => {
    return (
      <ScrollView>
        <View style={FieldAddEditLookupStyles.stretchView}>
          <View>
            <View style={FieldAddEditLookupStyles.mainViewContainer}>
              <View style={FieldAddEditLookupStyles.titleContainer}>
                <Text style={FieldAddEditLookupStyles.label}>
                  {title}
                </Text>
                {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
                  <View style={FieldAddEditLookupStyles.requiredContainer}>
                    <Text style={FieldAddEditLookupStyles.textRequired}>
                      {translate(fieldAddEditMessages.inputRequired)}
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity style={FieldAddEditLookupStyles.labelInputData}
                onPress={() => { initDataModal(); }}
              >
                <Text style={FieldAddEditLookupStyles.holderColor}>
                  {title}{translate(messages.lookupPlaceholder)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={FieldAddEditLookupStyles.infoView}>
              {
                (itemReflect)?.map((itemReflectCom: any, key: number) => {
                  const info = listFieldInfo?.find((item) => itemReflectCom?.fieldId === item.fieldId);
                  let renderValue = mainViewValue?.get(key);
                  if (renderValue && typeof (renderValue) !== 'object') {
                    renderValue = renderValue.toString();
                  }
                  return (
                    <View style={FieldAddEditLookupStyles.dynamicComponent}>
                      {
                        renderDynamicValue &&
                        <DynamicControlField controlType={ControlType.ADD_EDIT} fieldInfo={info} elementStatus={{ fieldValue: renderValue }} updateStateElement={handleGetValue} />
                      }
                      {
                        !renderDynamicValue &&
                        <DynamicControlField controlType={ControlType.ADD_EDIT} fieldInfo={info} elementStatus={{ fieldValue: renderValue }} updateStateElement={handleGetValue} />
                      }
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setOffset(0)
                setModalVisible(false)
              }}
            >
              <View style={FieldAddEditLookupStyles.modalContainer}>
                <TouchableOpacity style={[{ flex: responseApiData?.length > 0 ? 1 : 5 }, FieldAddEditLookupStyles.modalTouchable]}
                  onPress={() => { setModalVisible(false); }} >
                  <View>
                    <Image style={FieldAddEditLookupStyles.modalIcon} source={modalIcon} />
                  </View>
                </TouchableOpacity>
                <View style={[FieldAddEditLookupStyles.modalContent, { flex: responseApiData?.length > 0 ? 3 : 2 }]}>
                  <View style={FieldAddEditLookupStyles.inputContainer}>
                    <TextInput style={searchValue.length > 0 ? FieldAddEditLookupStyles.inputSearchTextData : FieldAddEditLookupStyles.inputSearchText}
                      placeholder={`${title}${translate(messages.lookupPlaceholder)}`}
                      value={searchValue}
                      onChangeText={(text) => {
                        setOverRecord(false)
                        handleSearch(text, false)
                      }}
                      onFocus={() => handleSearch(searchValue, false)} autoFocus={true}
                    />
                    <View style={FieldAddEditLookupStyles.textSearchContainer}>
                      {searchValue.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchValue("")}>
                          <AntDesign name="closecircle" style={FieldAddEditLookupStyles.iconDelete} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View style={FieldAddEditLookupStyles.dividerContainer} />
                  {errorMessage !== "" && (
                    <Text style={FieldAddEditLookupStyles.errorMessage}>
                      {errorMessage}
                    </Text>
                  )}
                  {isShowSuggestion && (
                    <View style={FieldAddEditLookupStyles.suggestionContainer}>
                      <FlatList
                        data={responseApiData}
                        keyExtractor={(item: any) => {
                          return item[`${functionName}Id`].toString()
                        }}
                        onEndReached={() => {
                          if (!overRecord) {
                            handleSearch(searchValue, true)
                          }
                        }}
                        ListFooterComponent={() => {
                          return (visibleFooter ? <AppIndicator visible /> : <></>)
                        }}
                        onEndReachedThreshold={0.5}
                        renderItem={({ item }) => {
                          return (
                            <TouchableOpacity style={FieldAddEditLookupStyles.touchableSelect} disabled={disableConfirm}
                              onPress={() => { confirmItem(item[`${functionName}Id`].toString()); }} >
                              <View style={FieldAddEditLookupStyles.suggestTouchable}>
                                {
                                  Object.keys(itemReflect).map((key) => {
                                    const valueFieldInfo = listFieldInfo?.find((info) => info.fieldId === itemReflect[key])
                                    // field value to show in screen
                                    var fieldValue = TEXT_EMPTY
                                    // field value to set into valueMap
                                    var fieldValueIndirect = undefined
                                    if (valueFieldInfo) {
                                      if (valueFieldInfo.isDefault) {
                                        fieldValue = item[valueFieldInfo.fieldName]
                                      } else {
                                        // get extension data by fieldName of fieldInfo
                                        const extensionInfo = item[fieldExtension].find((extension: any) => extension.key === valueFieldInfo.fieldName)
                                        if (extensionInfo) {
                                          if (directValueArr.includes(extensionInfo.fieldType.toString())) {
                                            fieldValue = extensionInfo.value
                                          } else if (indirectValueArr.includes(extensionInfo.fieldType.toString())) {
                                            const fieldInfoItem = valueFieldInfo.fieldItems.find((fieldItem: any) => fieldItem.itemId === extensionInfo.value)
                                            fieldValue = StringUtils.getFieldLabel(fieldInfoItem, ITEM_LABEL, language)
                                            fieldValueIndirect = extensionInfo.value
                                          } else if (DefineFieldType.MULTI_SELECTBOX === extensionInfo.fieldType.toString()) {
                                            const fieldInfoItems = valueFieldInfo.fieldItems.map((fieldItem: any) => {
                                              if (extensionInfo.value.includes(fieldItem.itemId))
                                                return fieldItem
                                            })
                                            fieldInfoItems.forEach((fieldItem: any) => {
                                              fieldValue = `${fieldValue},${StringUtils.getFieldLabel(fieldItem, ITEM_LABEL, language)}`
                                            });
                                            fieldValue = fieldValue.substr(1)
                                            fieldValueIndirect = extensionInfo.value
                                          }
                                        }
                                      }
                                    }
                                    let valueMap = suggestValueMap.get(item[`${functionName}Id`].toString())
                                    if (!valueMap) {
                                      valueMap = new Map()
                                      suggestValueMap.set(item[`${functionName}Id`].toString(), valueMap)
                                    }
                                    // set ID in case of radio, checkbox, pulldown
                                    // set value in other cases
                                    fieldValueIndirect ? valueMap.set(key, fieldValueIndirect) : valueMap.set(key, fieldValue)
                                    return (
                                      <Text style={FieldAddEditLookupStyles.suggestText}>
                                        {fieldValue}
                                      </Text>
                                    )
                                  })
                                }
                              </View>
                            </TouchableOpacity>
                          )
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    );
  };
  return renderComponent();
}