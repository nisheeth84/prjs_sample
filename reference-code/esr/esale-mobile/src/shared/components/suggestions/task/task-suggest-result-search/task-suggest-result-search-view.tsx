import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import TaskSuggestResultSearchStyle from './task-suggest-result-search-style';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { translate } from '../../../../../config/i18n';
import _ from 'lodash';
import { messages } from '../task-suggest-messages';
import {
  saveSuggestionsChoice, getTasks,
} from '../../repository/task-suggest-repositoty';
import { Icon } from '../../../icon';
import { responseMessages } from '../../../../messages/response-messages';
import { AppbarStyles } from '../task-search-detail/search-detail-style';
import { IResultSearchProps, ITask, TaskSuggest } from '../../interface/task-suggest-interface';
import { TYPE_TASK, TASK_INDEX, FINISHED_STATUS } from '../task-constant';
import moment from 'moment';
import StringUtils from '../../../../util/string-utils';
import { DEFINE_FIELD_TYPE } from '../../../../../modules/search/search-detail-special/employee-special';

const LIMIT = 20;
const EXTENSION_NAME = "task_data";
/**
 * Result Search View
 * @param props 
 */
export function TaskSuggestResultSearchView(props: IResultSearchProps) {
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [stateCustomerBefore, setStateCustomerBefore] = useState(TEXT_EMPTY);
  const [dataSelected, setDataSelected] = useState<TaskSuggest[]>([]);
  const [viewDataSelect, setViewDataSelect] = useState<TaskSuggest[]>([]);
  const [offset, setOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [footerIndicator, setFooterIndicator] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  const [displayNoDataMessage, setDisplayNoDataMessage] = useState(false);
  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offset 
   */
  const getDataFromAPI = async (offset: number) => {
    setFooterIndicator(true);
    setIsNoData(true);
    const payload = {
      statusTaskIds: [],
      searchLocal: TEXT_EMPTY,
      searchConditions: buildSearchCondition(),
      filterConditions: [],
      limit: LIMIT,
      offset,
      filterByUserLoginFlg: 0
    };
    const res = await getTasks(payload);
    const datas = res.data?.dataInfo;
    if (!_.isEmpty(datas?.tasks)) {
      setIsNoData(false);
    } else if (offset === 0) {
      setDisplayNoDataMessage(true);
    }
    if (!_.isNil(datas?.tasks)) {
      if (offset > 0) {
        setViewDataSelect(_.filter(_.cloneDeep(viewDataSelect).concat(convertToTaskSuggest(datas.tasks)), (value, index, self) => {
          return _.findIndex(self, item => item.taskId === value.taskId) === index;
        }));
      } else {
        setViewDataSelect(convertToTaskSuggest(datas.tasks));
      }
      setTotalRecords(datas.countTotalTask || 0);
    }
    setRefreshData(false);
    setFooterIndicator(false);
  }

  /**
   * Check value condition
   * @param value 
   * @param isSearchBlank 
   */
  const checkEmptyValue = (value: any, isSearchBlank: boolean) => {
    return !isSearchBlank && _.isEmpty(value);
  };

  /**
   * Convert search condition
   */
  const buildSearchCondition = () => {
    const conditions = [...props.searchConditions];
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
        item.fieldType = Number(conditions[i].fieldType);
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
   * Loadmore data everytime offset is changed
   */
  useEffect(() => {
    getDataFromAPI(offset);
  }, [offset]
  )

  /** 
   * set map state check view checkbox
   * @param customer 
   */
  const handleViewCheckbox = (task: TaskSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${task.taskId}`;
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
  const handleCustomerSelected = (task: TaskSuggest, typeSearch: number) => {
    const isExistCustomer = dataSelected.filter(item => (item.taskId === task.taskId));
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistCustomer?.length <= 0) {
        dataSelected.push(task);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistCustomer?.length > 0) {
        let listDataSelected = dataSelected.filter(item => (item.taskId !== task.taskId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(task);
        setDataSelected(dataSelected);
      }
    }
  }
  /**
   * call API saveCustomerSuggestionsChoice
   * @param dataSelected
   */
  const callSaveTaskSuggestionsChoiceAPI = async (dataSelected: TaskSuggest[]) => {
    const response = await saveSuggestionsChoice({
      sugggestionsChoice: _.map(dataSelected, item => {
        return {
          index: TASK_INDEX,
          idResult: item.taskId
        }
      })
    })
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
  const handleClickEmloyeeItem = (task: TaskSuggest) => {
    handleViewCheckbox(task);
    handleCustomerSelected(task, props.typeSearch);
  }

  /**
   * Convert to display data
   * @param response 
   */
  const convertToTaskSuggest = (response: ITask[]) => {
    return _.map(response, item => {
      return {
        taskId: item.taskId,
        parentCustomerName: item.customers[0].parentCustomerName,
        milestoneName: item.milestoneName,
        customerName: item.customers[0].customerName,
        productTradingName: !_.isEmpty(item.productTradings) ? item.productTradings[0].productName : TEXT_EMPTY,
        taskName: item.taskName,
        finishDate: item.finishDate,
        finishType: getType(item.statusTaskId, item.finishDate),
        employeeName: _.map(item.employees, employee => employee.employeeName).join(', '),
        status: item.statusTaskId,
        data: item
      }
    });
  }

  /**
   * back to Result Selected Screen
   */
  const applyPress = () => {
    props.updateStateElement(dataSelected);
    props.closeModal();
    if (!props.isRelation) {
      callSaveTaskSuggestionsChoiceAPI(dataSelected);
    }
  }

  /**
   * Get task state
   * @param status 
   * @param finishDate 
   */
  const getType = (status: number, finishDate: string) => {
    if (status < FINISHED_STATUS && moment(finishDate).toDate() > moment().toDate()) {
      return TYPE_TASK.expired;
    } else if (status === FINISHED_STATUS) {
      return TYPE_TASK.complete;
    } else {
      return TYPE_TASK.normal;
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
      <Text style={TaskSuggestResultSearchStyle.SumLabelStyle}>
        {translate(messages.totalRecordStartText).concat(totalRecords.toString()).concat(translate(messages.totalRecordEndText))}
      </Text>
      <View style={TaskSuggestResultSearchStyle.Underline}></View>
      <View style={{ flex: 1 }}>
        {
          !displayNoDataMessage ? (
            <FlatList
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                if (!isNoData) {
                  setOffset(offset + LIMIT);
                }
              }}
              data={viewDataSelect}
              keyExtractor={item => item.taskId.toString()}
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
              renderItem={({ item }) => {
                return (
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        handleClickEmloyeeItem(item);
                      }}
                      style={TaskSuggestResultSearchStyle.dataModalStyle}>
                      <View style={TaskSuggestResultSearchStyle.dataSelectedStyle}>
                        <Text numberOfLines={1} style={TaskSuggestResultSearchStyle.suggestText}>
                          {item.milestoneName}({item.parentCustomerName}-{item.customerName}/{item.productTradingName})
                        </Text>
                        <Text
                          numberOfLines={1}
                          style={[TaskSuggestResultSearchStyle.boldText, (item.finishType === TYPE_TASK.expired && TaskSuggestResultSearchStyle.redText),
                          (item.finishType === TYPE_TASK.complete && TaskSuggestResultSearchStyle.strikeThroughText)]}
                        >
                          {item.taskName}
                        </Text>
                        <Text numberOfLines={1} style={TaskSuggestResultSearchStyle.suggestText}>
                          {item.employeeName}
                        </Text>
                      </View>
                      <View style={TaskSuggestResultSearchStyle.iconCheckView}>
                        {
                          statusSelectedItem.get(`${item.taskId}`) ?
                            <Icon style={TaskSuggestResultSearchStyle.iconCheck} name='selected' /> : < Icon style={TaskSuggestResultSearchStyle.iconCheck} name='unchecked' />
                        }
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }
              }
            />
          ) : (
            <View style={TaskSuggestResultSearchStyle.noDataMessage}>
              <Icon style={TaskSuggestResultSearchStyle.functionIcon} name="task"></Icon>
              <Text style={TaskSuggestResultSearchStyle.textNoData}>{translate(responseMessages.INF_COM_0020).replace('{0}', translate(messages.functionText))}</Text>
            </View>
          )
        }
      </View>
    </View >
  );
}
