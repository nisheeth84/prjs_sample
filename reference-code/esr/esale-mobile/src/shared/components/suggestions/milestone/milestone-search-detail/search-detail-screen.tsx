import React, { useEffect, useState } from 'react';
import { AppbarStyles, SearchDetailStyles } from './search-detail-style';
import { cloneDeep } from 'lodash';
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
import { getCustomFieldsInfo, getFieldInfoPersonals } from '../../repository/milestone-suggest-repositoty';
import { messages } from '../milestone-suggest-messages';

export enum CustomerFieldName {
  CREATED_USER = 'created_user',
  UPDATED_USER = 'updated_user'
}


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
      setResponseAPIFieldInfo(resCustomFields.data.customFieldsInfo);
    }

    const resFieldInfo = await getFieldInfoPersonals({
      fieldBelong: FieldBelong.TASK,
      extensionBelong: ExtensionBelong.SEARCH_SCREEN
    });
    const fieldInfoPersonals = resFieldInfo.data.fieldInfoPersonals;
    if (fieldInfoPersonals) {
      fieldInfoPersonals.sort((p1, p2) => p1.fieldOrder - p2.fieldOrder);
      setDataSelected(fieldInfoPersonals);
    }
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
      conditions.push(cond);
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

  const renderDynamicField = (item: any) => {
    // TODO: handle search conditions
    if (item.fieldType === 99) {
      switch (item.fieldName) {
        case CustomerFieldName.CREATED_USER:
        case CustomerFieldName.UPDATED_USER:
          return <DynamicControlField
            fieldInfo={{ ...item, fieldType: DefineFieldType.TEXT }}
            controlType={ControlType.SEARCH}
            updateStateElement={handleSaveCondition}
          />
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
