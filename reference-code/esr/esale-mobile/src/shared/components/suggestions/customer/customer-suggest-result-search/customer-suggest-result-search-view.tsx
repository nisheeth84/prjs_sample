import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import CustomerSuggestResultSearchStyle from './customer-suggest-result-search-style';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { translate } from '../../../../../config/i18n';
import {
  map,
  isEmpty,
  cloneDeep
} from 'lodash';
import { messages } from '../customer-suggest-messages';
import {
  saveSuggestionsChoice,
  getCustomers,
} from '../../repository/customer-suggest-repositoty';
import { IResultSearchProps, Customer } from '../../interface/customer-suggest-interface';
import { Icon } from '../../../icon';
import { responseMessages } from '../../../../messages/response-messages';
import { AppbarStyles } from '../customer-search-detail/search-detail-style';
import { DEFINE_FIELD_TYPE } from '../../../../../modules/search/search-detail-special/employee-special';
import StringUtils from '../../../../util/string-utils';

const OFF_SET = 20;
const LIMIT = 20;
const INDEX_CHOICE = 'customer';
const EXTENSION_NAME = "customer_data";
/**
 * Result Search View
 * @param props 
 */
export function CustomerSuggestResultSearchView(props: IResultSearchProps) {
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [stateCustomerBefore, setStateCustomerBefore] = useState(TEXT_EMPTY);
  const [dataSelected, setDataSelected] = useState<Customer[]>([]);
  const [viewDataSelect, setViewDataSelect] = useState<Customer[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [parentName] = useState(new Map());
  const [isNoData, setIsNoData] = useState(false);
  const [displayNoDataMessage, setDisplayNoDataMessage] = useState(false);
  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offset 
   */
  const getDataFromAPI = async (offset: number) => {
    setIsNoData(true);
    setFooterIndicator(true);
    const res = await getCustomers({
      searchConditions: buildSearchCondition(),
      filterConditions: [],
      limit: LIMIT,
      offset
    })
    const customers = res?.data?.customers;
    if (!isEmpty(customers)) {
      setIsNoData(false);
    } else if (offset === 0) {
      setDisplayNoDataMessage(true);
    }
    if (customers) {
      if (offset > 0) {
        setViewDataSelect(viewDataSelect.concat(res.data.customers));
      } else {
        setViewDataSelect(res.data.customers);
      }
      setTotalRecords(res.data.totalRecords);
    } else {
      setDisplayNoDataMessage(true);
      setViewDataSelect([]);
      setTotalRecords(0);
    }
    setFooterIndicator(false);
    setRefreshData(false);
  }

  /**
   * Loadmore data everytime offset is changed
   */
  useEffect(() => {
    getDataFromAPI(offset);
  }, [offset]
  )

  /**
   * Check value condition
   * @param value 
   * @param isSearchBlank 
   */
  const checkEmptyValue = (value: any, isSearchBlank: boolean) => {
    return !isSearchBlank && isEmpty(value);
  };

  /**
   * Convert search condition
   */
  const buildSearchCondition = () => {
    const conditions = cloneDeep(props.searchConditions);
    let trueConditions = [];
    for (let i = 0; i <= conditions.length - 1; i++) {
      if (
        !checkEmptyValue(conditions[i].fieldValue, conditions[i].isSearchBlank)
      ) {
        const item: any = {};
        item.fieldId = conditions[i].fieldId;
        item.fieldName = StringUtils.camelCaseToSnakeCase(
          getFieldNameElastic(
            conditions[i],
            EXTENSION_NAME
          )
        );
        item.fieldType = conditions[i].fieldType;
        item.fieldValue = conditions[i].fieldValue;
        item.isDefault = conditions[i].isDefault;
        if (conditions[i].timeZoneOffset) {
          item.timeZoneOffset = conditions[i].timeZoneOffset;
        }
        if (
          conditions[i]?.fieldValue?.length > 0 &&
          (!!conditions[i]?.fieldValue[0]?.from ||
            conditions[i]?.fieldValue[0]?.from === TEXT_EMPTY)
        ) {
          item.fieldValue =
            typeof conditions[i].fieldValue[0] === "string"
              ? conditions[i].fieldValue[0]
              : JSON.stringify(conditions[i].fieldValue[0]);
        } else if (typeof conditions[i].fieldValue === "string") {
          item.fieldValue = conditions[i].fieldValue || "";
        } else {
          item.fieldValue = conditions[i].fieldValue
            ? JSON.stringify(conditions[i].fieldValue)
            : "";
        }
        if (conditions[i].searchOption) {
          item.searchOption = conditions[i].searchOption;
        } else {
          item.searchOption = 1;
        }
        if (conditions[i].searchType) {
          item.searchType = conditions[i].searchType;
        } else {
          item.searchType = 1;
        }
        if (conditions[i].isSearchBlank) {
          item.fieldValue = ''
        }
        trueConditions.push(item);
      }
    }
    return trueConditions;
  };

  /**
   * Update field name
   * @param fieldInfo 
   * @param fieldNameExtension 
   * @param isMultiLanguage 
   */
  const getFieldNameElastic = (
    fieldInfo: any,
    fieldNameExtension: string
  ) => {
    let translatedFieldName = fieldInfo.fieldName;
    if (
      !translatedFieldName &&
      translatedFieldName.startsWith(fieldNameExtension)
    ) {
      return translatedFieldName;
    }
    if (
      !fieldInfo.isDefault ||
      fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.SELECT_ORGANIZATION
    ) {
      translatedFieldName = `${fieldNameExtension}.${translatedFieldName}`;
    } else {
      if (
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXT ||
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.LINK ||
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER ||
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.EMAIL ||
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.ADDRESS ||
        fieldInfo.fieldType.toString() === DEFINE_FIELD_TYPE.FILE
      ) {
        translatedFieldName = `${translatedFieldName}.keyword`;
      }
    }
    return translatedFieldName;
  };

  /** 
   * set map state check view checkbox
   * @param customer 
   */
  const handleViewCheckbox = (customer: Customer) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${customer.customerId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeSelectSuggest.SINGLE == props.typeSearch) {
      if (stateCustomerBefore.length > 0) {
        newStateCheck.set(stateCustomerBefore, !statusSelectedItem.get(stateCustomerBefore));
      }
    }
    if (keyMap === stateCustomerBefore) {
      setStateCustomerBefore(TEXT_EMPTY);
    } else {
      setStateCustomerBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);
  }
  /**
   * handle add customer to list
   * @param customer 
   * @param typeSearch 
   */
  const handleCustomerSelected = (customer: Customer, typeSearch: number) => {
    const isExistCustomer = dataSelected.filter(item => (item.customerId === customer.customerId));
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistCustomer?.length <= 0) {
        dataSelected.push(customer);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistCustomer?.length > 0) {
        let listDataSelected = dataSelected.filter(item => (item.customerId !== customer.customerId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(customer);
        setDataSelected(dataSelected);
      }
    }
  }
  /**
   * call API saveCustomerSuggestionsChoice
   * @param dataSelected
   */
  const callsaveCustomerSuggestionsChoiceAPI = async (dataSelected: Customer[]) => {
    const response = await saveSuggestionsChoice({
      sugggestionsChoice: map(dataSelected, item => {
        return {
          index: INDEX_CHOICE,
          idResult: item.customerId
        }
      })
    });
    if (response.status !== 200) {
      props.exportError(response);
    }
  }

  /**
   * Render ActivityIndicator
   * @param animating 
   */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator style={{ padding: 5 }} animating={animating} size="large" />
    )
  }

  /**
   * Render separator flatlist
   */
  const renderItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: '#E5E5E5' }}
      />
    )
  }

  /**
   * handle click customer in list
   * @param customer
   */
  const handleClickEmloyeeItem = (customer: Customer) => {
    handleViewCheckbox(customer);
    handleCustomerSelected(customer, props.typeSearch);
  }

  /**
   * Get display parent name
   * @param customer 
   */
  const getCustomerParentName = (customer: Customer) => {
    const treeName = customer.customerParent && customer.customerParent.pathTreeName;
    if (!isEmpty(treeName) && treeName.length >= 2) {
      const parent = treeName[treeName.length - 2];// get parent customer name
      if (parent) {
        parentName.set(customer.customerId, parent)
      }
      return parent ? `${parent}（${treeName.slice(0, treeName.length - 2).join(' - ')}）` : TEXT_EMPTY;
    }
    return TEXT_EMPTY;
  }

  /**
   * Convert to customer suggest screen data
   */
  const convertToCustomerSugget = () => {
    return map(dataSelected, customer => {
      return {
        customerId: customer.customerId,
        customerName: customer.customerName,
        parentCustomerName: parentName.get(customer.customerId),
        address: customer.customerAddress && customer.customerAddress.address
      }
    })
  }

  /**
   * back to Result Selected Screen
   */
  const applyPress = () => {
    props.updateStateElement(convertToCustomerSugget());
    props.closeModal();
    if (!props.isRelation) {
      callsaveCustomerSuggestionsChoiceAPI(dataSelected);
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={[AppbarStyles.barContainer, AppbarStyles.block]}>
        <TouchableOpacity
          style={AppbarStyles.iconButton}
          onPress={props.closeModal}
        >
          <Icon name="close" />
        </TouchableOpacity>
        <View style={AppbarStyles.titleWrapper}>
          <Text style={AppbarStyles.title}>{translate(messages.functionText)}</Text>
        </View>
        <TouchableOpacity
          style={dataSelected.length > 0
            ? AppbarStyles.applyButton
            : [AppbarStyles.applyButton, AppbarStyles.disableButton]}
          disabled={dataSelected.length === 0}
          onPress={applyPress}
        >
          <Text style={AppbarStyles.applyText}>{translate(messages.choiceText)}</Text>
        </TouchableOpacity>
      </View>
      <Text style={CustomerSuggestResultSearchStyle.SumLabelStyle}>
        {translate(messages.totalRecordStartText).concat(totalRecords.toString()).concat(translate(messages.totalRecordEndText))}
      </Text>
      <View style={CustomerSuggestResultSearchStyle.Underline}></View>
      <View style={{ flex: 1 }}>
        {
          !displayNoDataMessage ? (
            <FlatList
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                if (!isNoData) {
                  setOffset(offset + OFF_SET);
                }
              }}
              data={viewDataSelect}
              keyExtractor={item => item.customerId.toString()}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setRefreshData(true);
                    setOffset(0);
                  }}
                />
              }
              renderItem={({ item }) => <View>
                <TouchableOpacity
                  onPress={() => {
                    handleClickEmloyeeItem(item);
                  }}
                  style={CustomerSuggestResultSearchStyle.dataModalStyle}>
                  <View style={CustomerSuggestResultSearchStyle.dataSelectedStyle}>
                    <Text style={CustomerSuggestResultSearchStyle.suggestText}>{getCustomerParentName(item)}</Text>
                    <Text style={CustomerSuggestResultSearchStyle.fontBold}>{item.customerName}</Text>
                    <Text style={CustomerSuggestResultSearchStyle.suggestText}>{item.customerAddress ? item.customerAddress.address : TEXT_EMPTY}</Text>
                  </View>
                  <View style={CustomerSuggestResultSearchStyle.iconCheckView}>
                    {
                      statusSelectedItem.get(`${item.customerId}`) ?
                        <Icon style={CustomerSuggestResultSearchStyle.iconCheck} name='selected' /> : < Icon style={CustomerSuggestResultSearchStyle.iconCheck} name='unchecked' />
                    }
                  </View>
                </TouchableOpacity>
              </View>
              }
            />
          ) : (
              <View style={CustomerSuggestResultSearchStyle.noDataMessage}>
                <Icon style={CustomerSuggestResultSearchStyle.functionIcon} name="customer"></Icon>
                <Text style={CustomerSuggestResultSearchStyle.textNoData}>{translate(responseMessages.INF_COM_0020).replace('{0}', translate(messages.functionText))}</Text>
              </View>
            )
        }
      </View>
    </View >
  );
}
