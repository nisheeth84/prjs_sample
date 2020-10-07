import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TouchableOpacity, TextInput, FlatList, Animated, PanResponder, RefreshControl, ActivityIndicator } from 'react-native'
import { translate } from '../../../../../config/i18n';
import { messages } from '../task-suggest-messages';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { TYPE_TASK, TASK_INDEX, FINISHED_STATUS } from '../task-constant';
import TaskSuggestStyles from '../task-suggest-styles';
import { TaskSuggest, Tasks } from '../../interface/task-suggest-interface';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { useDebounce } from '../../../../../config/utils/debounce';
import { Icon } from '../../../icon';
import { getTasksSuggestion, saveSuggestionsChoice } from '../../repository/task-suggest-repositoty';
import _ from 'lodash';
import moment from 'moment'

/**
 * TaskSuggestSearchModalProps
 */
export interface TaskSuggestSearchModalProps {
  fieldLabel: string,
  typeSearch: number,
  dataSelected: TaskSuggest[],
  isRelation?: boolean,
  selectTask: (task: TaskSuggest) => void;
  closeModal: () => void;
  openDetailSearchModal: () => void;
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
  const [offset, setOffset] = useState(0);
  const [y, setY] = useState(0);
  const debounceSearch = useDebounce(searchValue, 500);
  const pan = useRef(new Animated.ValueXY()).current;
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
      listIdChoice: props.typeSearch === TypeSelectSuggest.MULTI ? _.map(props.dataSelected, item => item.taskId) : []
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
    props.selectTask(task);
    if (!props.isRelation) {
      callSaveTaskSuggestionsChoiceAPI(task);
    }
  }

  /**
   * call API saveCustomerSuggestionsChoice
   * @param dataSelected
   */
  const callSaveTaskSuggestionsChoiceAPI = async (dataSelected: TaskSuggest) => {
    const response = await saveSuggestionsChoice({
      sugggestionsChoice: [
        {
          index: TASK_INDEX,
          idResult: dataSelected.taskId
        }
      ]
    })
    if (response.status !== 200) {
      props.exportError(response);
    }
  }

  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    if (resultSearch.length === 0) {
      return 1;
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
      <View style={[TaskSuggestStyles.modalContent, { flex: getFlexNumber() }]}>
        <View style={TaskSuggestStyles.inputContainer}>
          <View style={TaskSuggestStyles.inputContent}>
            <TextInput style={TaskSuggestStyles.inputSearchTextData} placeholder=
              {props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
                : props.fieldLabel + translate(messages.placeholderMultiChoose)}
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
            <View style={TaskSuggestStyles.textSearchContainer}>
              <TouchableOpacity
                onPress={() => {
                  props.openDetailSearchModal();
                }}
              >
                <Icon name="searchOption" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={TaskSuggestStyles.cancel}
            onPress={() => {
              if (!_.isEmpty(searchValue)) {
                setRefreshData(true);
              }
              setSearchValue(TEXT_EMPTY);
            }}
          >
            <Text style={TaskSuggestStyles.cancelText}>{translate(messages.cancelText)}</Text>
          </TouchableOpacity>
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
                  </TouchableOpacity>
                </View>
              }
            />
          </View>}
      </View>
      <TouchableOpacity onPress={() => alert('Open add task screen')} style={TaskSuggestStyles.fab}>
        <Text style={TaskSuggestStyles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  )
}
