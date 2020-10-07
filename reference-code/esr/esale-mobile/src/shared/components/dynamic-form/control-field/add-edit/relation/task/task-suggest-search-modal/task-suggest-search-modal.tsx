import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, TextInput, FlatList, Animated, PanResponder, RefreshControl, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native'
import _ from 'lodash';
import moment from 'moment'
import { TaskSuggest, Tasks } from '../task-suggest-interface';
import { TEXT_EMPTY } from '../../../../../../../../config/constants/constants';
import { useDebounce } from '../../../../../../../../config/utils/debounce';
import { getTasksSuggestion } from '../../relation-suggest-repository';
import { TypeRelationSuggest, PlatformOS } from '../../../../../../../../config/constants/enum';
import { FINISHED_STATUS, TYPE_TASK } from '../task-constant';
import TaskSuggestStyles from '../task-suggest-styles';
import { Icon } from '../../../../../../icon/icon';
import { translate } from '../../../../../../../../config/i18n';
import { messages } from '../../relation-suggest-messages';
import { AntDesign } from '@expo/vector-icons';
/**
 * TaskSuggestSearchModalProps
 */
export interface TaskSuggestSearchModalProps {
  fieldLabel: string,
  typeSearch: number,
  fieldInfo: any,
  dataSelected: TaskSuggest[],
  isRelation?: boolean,
  selectTask: (task: TaskSuggest[]) => void;
  closeModal: () => void;
  exportError: (err: any) => void;
}

// limit search
const LIMIT = 10;

/**
 * TaskSuggestSearchModal component
 * @param props 
 */
export function TaskSuggestSearchModal(props: TaskSuggestSearchModalProps) {
  const [resultSearch, setResultSearch] = useState<TaskSuggest[]>([]);
  const [isErrorCallAPI, setIsErrorCallAPI] = useState(false);
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [footerIndicator, setFooterIndicator] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [stateCustomerBefore, setStateCustomerBefore] = useState(TEXT_EMPTY);
  const [dataSelected, setDataSelected] = useState<TaskSuggest[]>([]);
  const [offset, setOffset] = useState(0);
  const [y, setY] = useState(0);
  const debounceSearch = useDebounce(searchValue, 500);
  const pan = useRef(new Animated.ValueXY()).current;
  const [isDisplayKeyboard, setIsDisplayKeyboard] = useState(false);
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gestureState) => {
        setY(gestureState.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  /**
   * Change value search
   */
  useEffect(() => {
    if (debounceSearch) {
      handleSearch(searchValue, 0);
    } else {
      handleSearch(TEXT_EMPTY, 0);
    }
  }, [debounceSearch]);

  /**
   * handle text input to show suggestion
   * @param text text from input
   * @param offset start index search
   */
  const handleSearch = async (text: string, offset: number) => {
    setOffset(offset);
    setIsNoData(true);
    // Call api get suggest task
    const payload = {
      searchValue: text,
      limit: LIMIT,
      offset,
      listIdChoice: props.typeSearch === TypeRelationSuggest.MULTI ? _.map(props.dataSelected, item => item.taskId) : []
    };
    const response = await getTasksSuggestion(payload);
    if (response.status === 200 && response.data) {
      const taskSuggest: TaskSuggest[] = convertToTaskSuggest(response.data.tasks);
      if (offset > 0) {
        setResultSearch(resultSearch.concat(taskSuggest));
      } else {
        setResultSearch(taskSuggest);
      }
      if (!_.isEmpty(taskSuggest)) {
        setIsNoData(false);
      }
      setIsErrorCallAPI(false);
    } else {
      setIsErrorCallAPI(true);
      setResultSearch([]);
    }
    setFooterIndicator(false);
    setRefreshData(false);
  }

  const confirmSearch = (data: TaskSuggest[]) => {
    setDisableConfirm(true);
    if (props.selectTask) {
      props.selectTask(data);
    }
    props.closeModal();
    setDisableConfirm(false);
  }

  /** 
 * set map state check view checkbox
 * @param customer 
 */
  const handleViewCheckbox = (task: TaskSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${task.taskId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeRelationSuggest.SINGLE == props.typeSearch) {
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
    if (typeSearch === TypeRelationSuggest.SINGLE) {
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
   * Convert to display data
   * @param response 
   */
  const convertToTaskSuggest = (response: Tasks[]) => {
    return _.map(response, item => {
      return {
        taskId: item.taskId,
        parentCustomerName: item.customer && item.customer.parentCustomerName,
        milestoneName: item.milestone.milestoneName,
        customerName: item.customer && item.customer.customerName,
        productTradingName: !_.isEmpty(item.productTradings) ? item.productTradings[0].productTradingName : TEXT_EMPTY,
        taskName: item.taskName,
        finishDate: item.finishDate,
        finishType: getType(item.status, item.finishDate),
        employeeName: _.map(item.operators, data => data.employeeName).join(', '),
        status: item.status,
        data: item
      }
    });
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

  /**
   * event click choose task item in list
   * @param number taskIdid selected
   */
  const handleClickSelectTaskItem = (task: TaskSuggest) => {
    handleViewCheckbox(task);
    handleCustomerSelected(task, props.typeSearch)
  }


  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (resultSearch.length === 0) {
      return 2;
    } else if (y < 0) {
      return 10;
    } else {
      return 2;
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

  return (
    <View style={TaskSuggestStyles.modalContainer}>
      <Animated.View
        style={{ flex: resultSearch.length > 0 ? 1 : 4, justifyContent: 'flex-end' }}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={TaskSuggestStyles.modalTouchable}
          onPress={() => props.closeModal()}
        >
          <View>
            <Icon style={TaskSuggestStyles.modalIcon} name="iconModal" />
          </View>
        </TouchableOpacity>
      </Animated.View>
      <KeyboardAvoidingView
        style={[TaskSuggestStyles.modalContent, { flex: getFlexNumber() }]}
        behavior={Platform.OS === PlatformOS.IOS ? "padding" : undefined}
      >
        <View style={TaskSuggestStyles.inputContainer}>
          <TextInput style={TaskSuggestStyles.inputSearchTextData} placeholder=
            {props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            onFocus={() => setIsDisplayKeyboard(true)}
            onBlur={() => setIsDisplayKeyboard(false)}
          />
          <View style={TaskSuggestStyles.textSearchContainer}>
            {searchValue.length > 0 && (
              <TouchableOpacity onPress={() => setSearchValue(TEXT_EMPTY)}>
                <AntDesign size={18} name="closecircle" style={TaskSuggestStyles.iconDelete} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={TaskSuggestStyles.dividerContainer} />
        {
          isErrorCallAPI && (
            <Text style={TaskSuggestStyles.errorMessage}>{translate(messages.errorCallAPI)}</Text>
          )
        }
        {!isErrorCallAPI &&
          <View style={[resultSearch.length > 0 ? TaskSuggestStyles.suggestionContainer : TaskSuggestStyles.suggestionContainerNoData]}>
            <FlatList
              data={resultSearch}
              keyExtractor={item => item.taskId.toString()}
              onEndReached={() => {
                if (!isNoData) {
                  setFooterIndicator(true);
                  handleSearch(searchValue, offset + LIMIT);
                }
              }}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              contentContainerStyle={TaskSuggestStyles.listBottom}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setFooterIndicator(true);
                    setRefreshData(true);
                    handleSearch(searchValue, 0);
                  }}
                />
              }
              renderItem={({ item }) =>
                <View>
                  <TouchableOpacity style={resultSearch.length > 0 ? TaskSuggestStyles.touchableSelect : TaskSuggestStyles.touchableSelectNoData}
                    onPress={() => {
                      handleClickSelectTaskItem(item);
                    }}>
                    <View style={TaskSuggestStyles.suggestTouchable}>
                      <Text numberOfLines={1} style={TaskSuggestStyles.suggestText}>
                        {item.milestoneName}({item.parentCustomerName}-{item.customerName}/{item.productTradingName})
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[TaskSuggestStyles.boldText, (item.finishType === TYPE_TASK.expired && TaskSuggestStyles.redText),
                        (item.finishType === TYPE_TASK.complete && TaskSuggestStyles.strikeThroughText)]}
                      >
                        {item.taskName}({item.finishDate})
                      </Text>
                      <Text numberOfLines={1} style={TaskSuggestStyles.suggestText}>{item.employeeName}</Text>
                    </View>
                    <View style={TaskSuggestStyles.iconCheckView}>
                      {
                        statusSelectedItem.get(`${item.taskId}`) &&
                        <Icon name={"checkedIcon"}
                          style={TaskSuggestStyles.iconCheck} />
                      }
                      {
                        !statusSelectedItem.get(`${item.taskId}`) &&
                        TypeRelationSuggest.MULTI === props.typeSearch &&
                        <Icon name={"unCheckedIcon"}
                          style={TaskSuggestStyles.iconCheck} />
                      }
                    </View>
                  </TouchableOpacity>
                </View>
              }
            />
          </View>}
      </KeyboardAvoidingView>
      {!(isDisplayKeyboard && _.isEmpty(resultSearch)) &&
        <TouchableOpacity style={TaskSuggestStyles.modalButton} disabled={disableConfirm} onPress={() => { confirmSearch(dataSelected); }}>
          <Text style={TaskSuggestStyles.textButton}>{translate(messages.confirm)}</Text>
        </TouchableOpacity>
      }
    </View>
  )
}
