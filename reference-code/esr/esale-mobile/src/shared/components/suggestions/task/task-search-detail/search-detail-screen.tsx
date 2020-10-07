import React, { useEffect, useState } from 'react';
import { AppbarStyles, SearchDetailStyles } from './search-detail-style';
import { cloneDeep, filter, find } from 'lodash';
import { ControlType, DefineFieldType, FieldBelong, ExtensionBelong } from '../../../../../config/constants/enum';
import { DynamicControlField } from '../../../dynamic-form/control-field/dynamic-control-field';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from '../../../icon';
import { IFieldInfoPersonal, ISearchCondition, ISearchDetailProps } from './search-detail-interface';
import { SearchDetailModal } from './search-detail-modal/search-detail-modal';
import { translate } from '../../../../../config/i18n';
import { messages } from '../task-suggest-messages';
import { getCustomFieldsInfo, getFieldInfoPersonals } from '../../repository/task-suggest-repositoty';

export enum TaskFieldName {
  PARENT_ID = 'parent_id',
  TASK_CUSTOMER_ID = 'customer_id',
  TASK_CUSTOMER_NAME = 'customer_name',
  TASK_PRODUCT_TRADINGS_ID = 'products_tradings_id',
  TASK_PRODUCT_NAME = 'product_name',
  SUBTASKS_NAME = 'subtask_name',
  TASK_CREATED_USER = 'created_user',
  TASK_CREATED_USER_NAME = 'created_user_name',
  TASK_UPDATED_USER = 'updated_user',
  TASK_UPDATED_USER_NAME = 'updated_user_name',
  IS_PUBLIC = 'is_public'
}

const typeNotInclude = [
  DefineFieldType.TAB,
  DefineFieldType.LOOKUP,
  DefineFieldType.TITLE,
];

const IS_PUBLIC = {
  PUBLIC: 1,
  NOT_PUBLIC: 0,
  ALL: 2
};

/**
 * Component for searching detail fields
 * @param props see ISearchDetailProps
 */
export default function SearchDetailScreen(props: ISearchDetailProps) {
  const [isVisibleSearchCondition, setIsVisibleSearchCondition] = useState(false);
  const [responseAPIFieldInfo, setResponseAPIFieldInfo] = useState<IFieldInfoPersonal[]>([]);
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map<string, { fieldId: string, selected: boolean }>());
  const [dataSelected, setDataSelected] = useState<IFieldInfoPersonal[]>([]);
  const [searchCondition, setSearchCondition] = useState(new Map<string, ISearchCondition>());

  /**
   * Call getCustomFieldsInfo API
   * Call getFieldInfoPersonals API
   */
  useEffect(() => {
    handleCallAPI();
  }, []);

  /**
   * Call getCustomFieldsInfo API
   * Call getFieldInfoPersonals API
   * Set display value
   */
  const handleCallAPI = async () => {
    const resCustomFields = await getCustomFieldsInfo({ fieldBelong: FieldBelong.TASK });
    if (resCustomFields.data.customFieldsInfo) {
      const customFields = filter(resCustomFields.data.customFieldsInfo, item => {
        return !typeNotInclude.includes(item?.fieldType?.toString() || "");
      });
      specialFieldInfoSearch(customFields);
      setResponseAPIFieldInfo(customFields);
    }

    const resFieldInfo = await getFieldInfoPersonals({
      fieldBelong: FieldBelong.TASK,
      extensionBelong: ExtensionBelong.SEARCH_SCREEN,
      selectedTargetId: 0,
      selectedTargetType: 0
    });
    const fieldInfoPersonals = filter(resFieldInfo.data.fieldInfoPersonals, item => {
      return !typeNotInclude.includes(item?.fieldType?.toString() || "");
    });
    if (fieldInfoPersonals) {
      fieldInfoPersonals.sort((p1, p2) => p1.fieldOrder - p2.fieldOrder);
      specialFieldInfoSearch(fieldInfoPersonals);
      setDataSelected(fieldInfoPersonals);
    }
  }

  /**
   * Custom FieldInfo when search popupFieldSearch
   * FieldInfo type = 99
   */
  const specialFieldInfoSearch = (fieldSearch: any[]) => {
    fieldSearch.forEach(z => {
      if (z.fieldName === TaskFieldName.IS_PUBLIC) {
        z.fieldItems = [];
        z.fieldItems.push({
          itemId: IS_PUBLIC.NOT_PUBLIC,
          itemLabel: translate(messages.notPublic),
          itemOrder: 1,
          isAvailable: true
        })
        z.fieldItems.push({
          itemId: IS_PUBLIC.PUBLIC,
          itemLabel: translate(messages.public),
          itemOrder: 2,
          isAvailable: true
        })
        z.fieldType = 1;
      } else if (z.fieldName === TaskFieldName.PARENT_ID) {
        z.fieldType = 5;
      }
    })
  }

  /**
   * Save input condition
   * @param _keyElement 
   * @param _type 
   * @param objEditValue 
   * @param _extEditValue 
   */
  const handleSaveCondition = (_keyElement: string | any, _type: string | any, objEditValue: string | any, _extEditValue?: any) => {
    const cond = cloneDeep(searchCondition);
    cond.set(objEditValue['fieldId'], objEditValue);
    setSearchCondition(cond);
  }

  /**
   * Update condition state
   */
  const updateStateElement = () => {
    const conditions: ISearchCondition[] = [];
    searchCondition.forEach(cond => {
      if (find(dataSelected, data => data.fieldId === cond.fieldId)) {
        if (cond.fieldName === "is_public" && cond.fieldValue !== "") {
          let valueIsPublic = [];
          if (Array.isArray(cond.fieldValue)) {
            valueIsPublic = cond.fieldValue;
          } else {
            valueIsPublic = JSON.parse(cond.fieldValue);
          }
          if (valueIsPublic.length === 2) {
            cond.fieldValue = '';
          } else {
            cond.fieldType = '90';
            if (Array.isArray(valueIsPublic) && IS_PUBLIC.PUBLIC === Number(valueIsPublic[0].toString())) {
              cond.fieldValue = "true";
            } else {
              cond.fieldValue = Array.isArray(valueIsPublic) ? "false" : cond.fieldValue;
            }
          }
        } else if (cond.fieldName === "is_public" && cond.fieldValue === "") {
          cond.fieldValue = "NULL";
        }
        conditions.push(cond);
      }
    })
    props.updateStateElement(conditions);
    props.openResultSearchModal();
  }

  /**
   * Open modal select condition
   */
  const openSearchConditionModal = () => {
    responseAPIFieldInfo.sort((p1, p2) => p1.fieldOrder - p2.fieldOrder);
    initStatusItem(responseAPIFieldInfo);
    setIsVisibleSearchCondition(true);
  }

  /**
   * Set initial state
   * @param fieldList
   */
  const initStatusItem = (fieldList: IFieldInfoPersonal[]) => {
    const newStateCheck = new Map(statusSelectedItem);
    fieldList.forEach((field) => {
      if (!newStateCheck.get(field.fieldId.toString())) {
        const initData = dataSelected.find(item => item.fieldId === field.fieldId);
        let selectData: { fieldId: string, selected: boolean } = { fieldId: field.fieldId.toString(), selected: false };
        if (initData) {
          selectData = { fieldId: field.fieldId.toString(), selected: true };
        }
        newStateCheck.set(field.fieldId.toString(), selectData);
      }
    });
    setStatusSelectedItem(newStateCheck);
  }

  /**
   * Render field condition
   * @param item 
   */
  const renderDynamicField = (item: any) => {
    if (item.fieldType === 99) {
      switch (item.fieldName) {
        case TaskFieldName.TASK_CREATED_USER:
        case TaskFieldName.TASK_UPDATED_USER:
        case TaskFieldName.TASK_CUSTOMER_NAME:
        case TaskFieldName.TASK_PRODUCT_NAME:
        case TaskFieldName.SUBTASKS_NAME:
          return (
            <DynamicControlField
              fieldInfo={{ ...item, fieldType: DefineFieldType.TEXT }}
              controlType={ControlType.SEARCH}
              updateStateElement={handleSaveCondition}
            />
          )
        case TaskFieldName.TASK_CUSTOMER_ID:
        case TaskFieldName.TASK_PRODUCT_TRADINGS_ID:
          return (
            <DynamicControlField
              fieldInfo={{ ...item, fieldType: DefineFieldType.NUMERIC }}
              controlType={ControlType.SEARCH}
              updateStateElement={handleSaveCondition}
            />
          )
        default:
          return <View />
      }
    } else {
      return (
        <DynamicControlField
          fieldInfo={item}
          controlType={ControlType.SEARCH}
          updateStateElement={handleSaveCondition}
        />
      )
    }
  }

  /**
   * Close modal
   */
  const closeDetaiSearchModal = () => {
    props.closeDetaiSearchModal();
  }

  return (
    <View style={SearchDetailStyles.searchContent}>
      <View style={[AppbarStyles.barContainer, AppbarStyles.block]}>
        <TouchableOpacity
          style={AppbarStyles.iconButton}
          onPress={closeDetaiSearchModal}
        >
          <Icon name="close" />
        </TouchableOpacity>
        <View style={AppbarStyles.titleWrapper}>
          <Text style={AppbarStyles.title}>{translate(messages.labelDetailSearch)}</Text>
        </View>
        <TouchableOpacity style={AppbarStyles.applyButton} onPress={updateStateElement}>
          <Text style={AppbarStyles.applyText}>{translate(messages.detailSearchApply)}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={AppbarStyles.filterButton}
          onPress={openSearchConditionModal}
        >
          <Text>{translate(messages.detailSearchFilterButton)}</Text>
        </TouchableOpacity>
      </View>
      <View style={SearchDetailStyles.rowBlank}></View>
      <View style={[responseAPIFieldInfo?.length > 0 ? SearchDetailStyles.selectedList : {}]}>
        <FlatList
          data={dataSelected}
          keyExtractor={item => item.fieldId.toString()}
          renderItem={({ item }) =>
            <View style={SearchDetailStyles.rowBorder}>
              <View style={SearchDetailStyles.row}>
                {renderDynamicField(item)}
              </View>
            </View>
          }
        ></FlatList>
      </View>
      <Modal
        visible={isVisibleSearchCondition}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisibleSearchCondition(false)}
      >
        <View style={SearchDetailStyles.searchModalContent}>
          <SearchDetailModal
            customFieldsData={responseAPIFieldInfo}
            statusInit={statusSelectedItem}
            closeModal={() => setIsVisibleSearchCondition(false)}
            updateStateElement={(datas) => setDataSelected(datas)}
            updateStatus={(status) => setStatusSelectedItem(status)}
          />
        </View>
      </Modal>
    </View>
  )
}
