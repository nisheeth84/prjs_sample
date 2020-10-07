import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,

  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from '../../../../../icon';
import TaskSuggestStyles from './task-suggest-styles';
import { TaskList, RelationTaskProps } from './task-type';
import { TYPE_TASK, RelationDisplay, TypeRelationSuggest, DefineFieldType } from '../../../../../../../config/constants/enum';
import StringUtils from '../../../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import { extensionDataSelector } from '../../../../../common-tab/common-tab-selector';
import { getRelationTasks, getRelationData } from '../relation-detail-repositoty';

/**
 * Component for searching text fields
 * @param props see RelationTaskProps
 */
export function RelationTaskDetail(props: RelationTaskProps) {
  const [responseTasks, setResponseTasks] = useState<TaskList[]>([]);
  const { fieldInfo } = props;
  const displayTab = fieldInfo.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo.relationData ? fieldInfo.relationData.format : 0;
  const fieldBelong = fieldInfo.relationData.fieldBelong;
  const displayFieldIds = fieldInfo.relationData.displayFieldId;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(props?.fieldInfo, FIELD_LABLE, languageCode);
  const navigation = useNavigation();
  const extensionData = props?.extensionData ? props?.extensionData : useSelector(extensionDataSelector);
  const [relationData, setRelationData] = useState<any>();

   /**
   * Handling after first render
   */
  useEffect(() => {
    // TO DO CALL API
    if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
      handleGetRelationTasksList();
    } else if (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) {
      handleGetRelationTasksTab();
    }
  }, []);

  /**
  * Call api get relation product trading
  */
  const handleGetRelationTasksTab = async () => {
    const taskData: any = extensionData.find((item: any) => (item.fieldType === DefineFieldType.RELATION && item.key === fieldInfo.fieldName));
    const taskIds: [] = JSON.parse(taskData.value);
    const resTasks = await getRelationTasks({
      taskIds: taskIds,
    });
    if (resTasks?.data) {
      setResponseTasks(resTasks.data);
    }

  }

   /**
  * Call api get relation product list
  */
 const handleGetRelationTasksList = async () => {
  const taskData: any = extensionData.find((item: any) => (item.fieldType === DefineFieldType.RELATION && item.key === fieldInfo.fieldName));
  const taskIds: [] = JSON.parse(taskData.value);
  if (taskIds && taskIds.length > 0) {
    const resTasks = await getRelationData({
      listIds: taskIds,
      fieldBelong: fieldBelong,
      fieldIds: Array.isArray(displayFieldIds) ? displayFieldIds : [displayFieldIds]
    });
    if (resTasks?.data?.relationData) {
      setRelationData(resTasks.data.relationData);
    }
  }
}

   /**
   * reader task tab
   */
  const renderTaskTab = () => {
    return (
      <View>
        <FlatList
          data={responseTasks}
          keyExtractor={item => item.taskId.toString()}
          renderItem={({ item }) =>
            <View>
              <TouchableOpacity style={responseTasks.length > 0 ? TaskSuggestStyles.touchableSelect : TaskSuggestStyles.touchableSelectNoData}
                onPress={() => {
                  navigation.navigate("task-detail", { id: item.taskId })
                }}>
                <View style={TaskSuggestStyles.suggestTouchable}>
                  <Text style={TaskSuggestStyles.suggestText}>{item.milestone.milestoneName}({item.parentCustomerName}-{item.customer.customerName}/{item.productTradingName})</Text>
                  <Text style={[TaskSuggestStyles.boldText, (item.finishType === TYPE_TASK.expired && TaskSuggestStyles.redText), (item.finishType === TYPE_TASK.complete && TaskSuggestStyles.strikeThroughText)]}>{item.taskName}({item.finishDate})</Text>
                  <Text style={TaskSuggestStyles.suggestText}>{item.employeeName}</Text>
                </View>
                <View style={TaskSuggestStyles.iconCheckView}>
                  <Icon name="iconArrowRight" style={TaskSuggestStyles.iconArrowRight} />
                </View>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  };

  /**
   * reader task list
   */
  const renderTaskList = () => {
    return (
      <View>
        <Text style={TaskSuggestStyles.labelHeader}>{title}</Text>
        <View style={TaskSuggestStyles.mainContainer}>
          {
            relationData &&
            relationData.map((task:any, index:number) =>
              <View style={TaskSuggestStyles.employeeContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("task-detail", { id: task.recordId })
                  }} >
                  <Text>
                    {task.dataInfos.length !== 0 &&
                      task.dataInfos.map((item: any, index: number) => {
                        return (
                          <Text key={index} style={TaskSuggestStyles.employeeText}>{task.recordId}</Text>
                        );
                      })}
                  </Text>
                </TouchableOpacity>
                {
                  ++index !== relationData.length && relationData.length > 1 &&
                  <Text style={TaskSuggestStyles.employeeText}>,</Text>
                }
              </View>
            )
          }
        </View>
      </View>
    );
  };

  return (
    <View>
      {
        (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) && renderTaskTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderTaskList()
      }
    </View>
  );

}