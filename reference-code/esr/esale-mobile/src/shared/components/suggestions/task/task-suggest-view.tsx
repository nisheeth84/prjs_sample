import TaskSuggestStyles from './task-suggest-styles';
import React, { useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { ITaskSuggestProps, TaskSuggest } from '../interface/task-suggest-interface';
import { messages } from './task-suggest-messages';
import { TypeSelectSuggest } from '../../../../config/constants/enum';
import { translate } from '../../../../config/i18n';
import { LIMIT_VIEW_SELECTED_TASKS, TYPE_TASK } from './task-constant';
import { TaskSuggestSearchModal } from './task-suggest-search-modal/task-suggest-search-modal';
import { Icon } from '../../icon';
import SearchDetailScreen from './task-search-detail/search-detail-screen';
import { ISearchCondition } from './task-search-detail/search-detail-interface';
import _ from 'lodash';
import { TaskSuggestResultSearchView } from './task-suggest-result-search/task-suggest-result-search-view';

/**
 * Component for searching text fields
 * @param props see ItaskSuggestProps
 */
export function TaskSuggestView(props: ITaskSuggestProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataViewSelected, setDataViewSelected] = useState<TaskSuggest[]>(props.initData ? props.initData : []);
  const [viewAll, setViewAll] = useState(!(props.initData && props.initData.length > 5));
  const [isVisibleDetailSearchModal, setIsVisibleDetailSearchModal] = useState(false);
  const [conditions, setConditions] = useState<ISearchCondition[]>([]);
  const [isVisibleResultSearchModal, setIsVisibleResultSearchModal] = useState(false);


  /**
   * event click delete task item in list
   * @param taskId  taskId to delete
  */
  const handleDeleteItem = (taskId: number) => {
    const selected = _.filter(dataViewSelected, item => item.taskId !== taskId);
    if (selected.length <= LIMIT_VIEW_SELECTED_TASKS) {
      setViewAll(true);
    }
    setDataViewSelected(selected);
    props.updateStateElement(selected);
  }

  /**
   * event click view all selection
   */
  const handleViewAll = () => {
    setViewAll(true)
  }

  /**
   * event click choose task item in list
   * @param number taskIdid selected
   */
  const handleSelectData = (task: TaskSuggest) => {
    if (props.typeSearch === TypeSelectSuggest.SINGLE) {
      dataViewSelected.pop();
    }
    dataViewSelected.push(task);
    if (dataViewSelected.length > LIMIT_VIEW_SELECTED_TASKS) {
      setViewAll(false)
    }
    props.updateStateElement(dataViewSelected);
    setModalVisible(false);
  }

  /**
   * Render label
   */
  const renderLabel = () => {
    if (props.invisibleLabel) {
      return null;
    } else {
      return (
        <View style={TaskSuggestStyles.labelName}>
          <Text style={TaskSuggestStyles.labelText}>
            {props.fieldLabel}
          </Text>
          {props.isRequire &&
            <View style={TaskSuggestStyles.labelHighlight}>
              <Text style={TaskSuggestStyles.labelTextHighlight}>
                {translate(messages.requireText)}
              </Text>
            </View>
          }
        </View>
      )
    }
  }

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    if (isVisibleResultSearchModal) {
      setIsVisibleResultSearchModal(false);
    } else if (isVisibleDetailSearchModal) {
      setIsVisibleDetailSearchModal(false);
    } else {
      setModalVisible(false);
    }
  }

  /*
   * Render the text component in add-edit case
   */
  return (
    <View style={TaskSuggestStyles.stretchView}>
      <View>
        {renderLabel()}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={props.isError && TaskSuggestStyles.errorContent}>
          <Text style={TaskSuggestStyles.labelInput}>
            {props.typeSearch === TypeSelectSuggest.SINGLE ?
              `${props.fieldLabel}${translate(messages.placeholderSingleChoose)}` : `${props.fieldLabel}${translate(messages.placeholderMultiChoose)}`}
          </Text>
        </TouchableOpacity>
        {!props.hiddenSelectedData &&
          _.map(viewAll ? dataViewSelected : dataViewSelected.slice(0, LIMIT_VIEW_SELECTED_TASKS), item => {
            return (
              <View style={TaskSuggestStyles.selectedItem}>
                <View style={TaskSuggestStyles.suggestTouchable}>
                  <Text numberOfLines={1} style={TaskSuggestStyles.suggestText}>
                    {item.milestoneName}({item.parentCustomerName}-{item.customerName}/{item.productTradingName})
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[TaskSuggestStyles.boldText, (item.finishType === TYPE_TASK.expired && TaskSuggestStyles.redText),
                    (item.finishType === TYPE_TASK.complete && TaskSuggestStyles.strikeThroughText)]}>
                    {item.taskName}
                  </Text>
                  <Text numberOfLines={1} style={TaskSuggestStyles.suggestText}>{item.employeeName}</Text>
                </View>
                <View style={TaskSuggestStyles.deleteSelectedIcon}>
                  <TouchableOpacity onPress={() => { handleDeleteItem(item.taskId) }}>
                    <Icon style={TaskSuggestStyles.iconListDelete} name="iconDelete" />
                  </TouchableOpacity>
                </View>
              </View>
            )
          })
        }
        {
          !props.hiddenSelectedData && !viewAll &&
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={TaskSuggestStyles.linkNextPage}>
              {`${translate(messages.alertRestRecordBegin)}${(dataViewSelected.length - LIMIT_VIEW_SELECTED_TASKS)}${translate(messages.alertRestRecordEnd)}`}
            </Text>
          </TouchableOpacity>
        }
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible || isVisibleDetailSearchModal || isVisibleResultSearchModal}
        onRequestClose={() => handleCloseModal()}
      >
        {modalVisible &&
          <View style={TaskSuggestStyles.modalContentStyle}>
            <TaskSuggestSearchModal
              fieldLabel={props.fieldLabel}
              typeSearch={props.typeSearch}
              dataSelected={dataViewSelected}
              isRelation={props.isRelation}
              closeModal={() => setModalVisible(false)}
              selectTask={handleSelectData}
              openDetailSearchModal={() => setIsVisibleDetailSearchModal(true)}
              exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
            />
          </View>
        }
        {isVisibleDetailSearchModal &&
          <View style={TaskSuggestStyles.detailSearchContent}>
            <SearchDetailScreen
              updateStateElement={(cond: ISearchCondition[]) => setConditions(cond)}
              closeDetaiSearchModal={() => setIsVisibleDetailSearchModal(false)}
              openResultSearchModal={() => setIsVisibleResultSearchModal(true)}
            />
          </View>
        }
        {isVisibleResultSearchModal &&
          <View style={TaskSuggestStyles.detailSearchContent}>
            <TaskSuggestResultSearchView
              updateStateElement={(datas: TaskSuggest[]) => {
                if (TypeSelectSuggest.SINGLE === props.typeSearch) {
                  setDataViewSelected(datas);
                  props.updateStateElement(datas);
                } else {
                  const selected = _.filter(dataViewSelected.concat(datas), (item, index, self) => {
                    return _.findIndex(self, task => task.taskId === item.taskId) === index;
                  });
                  if (selected.length > LIMIT_VIEW_SELECTED_TASKS) {
                    setViewAll(false);
                  }
                  setDataViewSelected(selected);
                  props.updateStateElement(selected);
                }
                setIsVisibleDetailSearchModal(false);
                setModalVisible(false);
              }}
              isRelation={props.isRelation}
              typeSearch={props.typeSearch}
              searchConditions={conditions}
              closeModal={() => {
                setIsVisibleResultSearchModal(false)
              }}
              exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
            />
          </View>
        }
      </Modal >
    </View>

  );
}
