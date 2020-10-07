import TaskSuggestStyles from './task-suggest-styles';
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { LIMIT_VIEW_SELECTED_TASKS } from './task-constant';
import { TaskSuggestSearchModal } from './task-suggest-search-modal/task-suggest-search-modal';
import _, { cloneDeep } from 'lodash';
import { ITaskSuggestProps, TaskSuggest } from './task-suggest-interface';
import { TypeRelationSuggest, ModifyFlag, FIELD_BELONG } from '../../../../../../../config/constants/enum';
import { translate } from '../../../../../../../config/i18n';
import { messages } from '../relation-suggest-messages';
import { Icon } from '../../../../../icon/icon';
import { TEXT_EMPTY, APP_DATE_FORMAT_ES, DEFAULT_TIMEZONE, FIELD_LABLE } from '../../../../../../../config/constants/constants';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { Field } from '../../../../../../../modules/employees/employees-repository';
import { getCustomFieldInfo } from '../../../../../../../modules/search/search-reponsitory';
import EntityUtils from '../../../../../../util/entity-utils';
import StringUtils from '../../../../../../util/string-utils';
import { convertValueRelation } from '../relation-convert-suggest';

/**
 * Component for searching text fields
 * @param props see ItaskSuggestProps
 */
export function RelationTaskSuggest(props: ITaskSuggestProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewAll, setViewAll] = useState(!(props.initData && props.initData.length > 5));
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const timezoneName = authState?.timezoneName ? authState?.timezoneName : DEFAULT_TIMEZONE;
  const formatDate = authState?.formatDate ? authState?.formatDate : APP_DATE_FORMAT_ES;
  const fieldInfo = props?.fieldInfo ?? TEXT_EMPTY;
  const [customFieldInfoData, setCustomFieldInfoData] = useState<Field[]>([]);
  const [dataRelationSelected, setdataRelationSelected] = useState<any[]>([]);
  const relationBelong = props?.fieldInfo?.relationData?.fieldBelong ?? FIELD_BELONG.TASK;

  useEffect(() => {
    getFieldInfoService();
  }, []);

  /**
   * Get all field of element
   */
  const getFieldInfoService = async () => {
    const responseFieldInfo = await getCustomFieldInfo(
      {
        fieldBelong: relationBelong,
      },
      {}
    );
    if (responseFieldInfo) {
      setCustomFieldInfoData(responseFieldInfo?.data?.customFieldsInfo);
    }
  }

  /**
  * convert view value relation
  */
  const getNameMappingRelationId = async (itemTask: TaskSuggest) => {
    const fieldInfoDataClone = cloneDeep(customFieldInfoData);
    const taskData = cloneDeep(itemTask?.taskData);
    let nameValue = "";
    if (fieldInfoDataClone) {
      const fieldInfoItem = fieldInfoDataClone?.find((item: Field) => {
        return item?.fieldId === fieldInfo?.relationData?.displayFieldId
      })
      if (fieldInfoItem && fieldInfoItem.isDefault && taskData) {
        nameValue = EntityUtils.getValueProp(itemTask, fieldInfoItem.fieldName);
      } else if (fieldInfoItem && !fieldInfoItem.isDefault && taskData) {
        const employee = taskData?.find((item: any) => item.key == fieldInfoItem.fieldName);
        nameValue = employee?.value;
      }
      if (!nameValue || nameValue?.length === 0) {
        nameValue = `${StringUtils.getFieldLabel(fieldInfoItem, FIELD_LABLE, languageCode)}${translate(messages.common_119908_15_relation_nodata)}`;
      } else {
        if (fieldInfoItem) {
          let paramConvert = {
            nameValue: nameValue,
            fieldInfoItem: fieldInfoItem,
            relationFieldInfo: fieldInfo,
            formatDate: formatDate,
            languageCode: languageCode,
            timezoneName: timezoneName,
            fields: props?.fields
          }
          nameValue = await convertValueRelation(paramConvert);
        } else {
          nameValue = `${StringUtils.getFieldLabel(fieldInfoItem, FIELD_LABLE, languageCode)}${translate(messages.common_119908_15_relation_nodata)}`;
        }
      }
    }
    return nameValue;
  }
  /**
   * event click delete task item in list
   * @param taskId  taskId to delete
  */
  const handleDeleteItem = (taskId: number) => {
    const selected = dataRelationSelected.filter(item => item.taskId !== taskId);
    if (selected.length <= LIMIT_VIEW_SELECTED_TASKS) {
      setViewAll(true);
    }
    setdataRelationSelected(selected);
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
  const handleSelectData = async (tasks: TaskSuggest[]) => {
    const customerConverted: any[] = [];
    if (props.typeSearch === TypeRelationSuggest.SINGLE) {
      dataRelationSelected.pop();
    }
    for (let index = 0; index < tasks.length; index++) {
      const taskItem = tasks[index];
      // convert object customers to view object
      let itemView = {
        taskId: taskItem?.taskId,
        itemName: await getNameMappingRelationId(taskItem),
      }
      customerConverted.push(itemView);
    }
    setdataRelationSelected(dataRelationSelected.concat(customerConverted));
    setModalVisible(false);
    if (dataRelationSelected.concat(customerConverted)?.length > LIMIT_VIEW_SELECTED_TASKS) {
      setViewAll(false)
    }
    props.updateStateElement(dataRelationSelected.concat(customerConverted));
  }

  /**
   * Render label
   */
  const renderLabel = () => {
    return (
      <View style={TaskSuggestStyles.titleContainer}>
        {<Text style={TaskSuggestStyles.title}>{props.fieldLabel}</Text>}
        {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
          <View style={TaskSuggestStyles.requiredContainer}>
            <Text style={TaskSuggestStyles.textRequired}>{translate(messages.common_119908_15_textRequired)}</Text>
          </View>
        )}
      </View>
    )
  }

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setModalVisible(false);
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
            {props.typeSearch === TypeRelationSuggest.SINGLE ?
              `${props.fieldLabel}${translate(messages.placeholderSingleChoose)}` : `${props.fieldLabel}${translate(messages.placeholderMultiChoose)}`}
          </Text>
        </TouchableOpacity>
        {
          _.map(viewAll ? dataRelationSelected : dataRelationSelected.slice(0, LIMIT_VIEW_SELECTED_TASKS), item => {
            return (
              <View style={TaskSuggestStyles.selectedItem}>
                <View style={TaskSuggestStyles.suggestTouchable}>
                  <Text style={TaskSuggestStyles.suggestText}>
                    {item.itemName}
                  </Text>
                </View>
                <TouchableOpacity
                  style={TaskSuggestStyles.iconCheckView}
                  onPress={() => {
                    handleDeleteItem(item.taskId);
                  }}>
                  <Icon style={TaskSuggestStyles.iconListDelete} name="iconDelete" />
                </TouchableOpacity>
              </View>
            )
          })
        }
        {!viewAll &&
          <TouchableOpacity onPress={handleViewAll}>
            <Text style={TaskSuggestStyles.linkNextPage}>
              {`${translate(messages.alertRestRecordBegin)}${(dataRelationSelected.length - LIMIT_VIEW_SELECTED_TASKS)}${translate(messages.alertRestRecordEnd)}`}
            </Text>
          </TouchableOpacity>
        }
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => handleCloseModal()}
      >
        {modalVisible &&
          <View style={TaskSuggestStyles.modalContentStyle}>
            <TaskSuggestSearchModal
              fieldLabel={props.fieldLabel}
              typeSearch={props.typeSearch}
              dataSelected={dataRelationSelected}
              fieldInfo={fieldInfo}
              closeModal={() => setModalVisible(false)}
              selectTask={handleSelectData}
              exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
            />
          </View>
        }
      </Modal >
    </View>

  );
}
