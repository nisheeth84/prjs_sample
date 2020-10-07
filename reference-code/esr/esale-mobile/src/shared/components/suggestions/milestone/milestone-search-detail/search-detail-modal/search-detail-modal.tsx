import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SearchDetailStyles } from '../search-detail-style';
import { Icon } from '../../../../icon';
import { translate } from '../../../../../../config/i18n';
import { cloneDeep, map } from 'lodash';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../../../../../modules/login/authorization/authorization-selector';
import { IFieldInfoPersonal } from '../search-detail-interface';
import { TEXT_EMPTY, FIELD_LABLE } from '../../../../../../config/constants/constants';
import { updateFieldInfoPersonals } from '../../../repository/employee-suggest-repositoty';
import StringUtils from '../../../../../util/string-utils';
import { AuthorizationState } from '../../../../../../modules/login/authorization/authorization-reducer';
import { messages } from '../../milestone-suggest-messages';
import { FieldBelong, ExtensionBelong } from '../../../../../../config/constants/enum';

/**
 * Define SearchDetailModal props
 */
export interface ISearchDetailModalProps {
  customFieldsData: IFieldInfoPersonal[],
  statusInit: Map<string, { fieldId: string, selected: boolean }>,
  closeModal: () => void;
  updateStateElement: (datas: IFieldInfoPersonal[]) => void;
  updateStatus: (itemStatus: Map<string, { fieldId: string, selected: boolean }>) => void;
}

/**
 * Component setting search condition
 * @param props 
 */
export function SearchDetailModal(props: ISearchDetailModalProps) {
  const authState: AuthorizationState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const [statusSelectedItem, setStatusSelectedItem] = useState(props.statusInit);
  const [filterDatas, setFilterDatas] = useState<IFieldInfoPersonal[]>(cloneDeep(props.customFieldsData));
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);

  /**
   * set map state check view checkbox 
   * @param employee checked
   */
  const handleViewCheckbox = (field: IFieldInfoPersonal) => {
    const newStateCheck = cloneDeep(statusSelectedItem);
    let keyMap = field.fieldId.toString();
    const selectData = newStateCheck.get(keyMap);
    if (selectData) {
      selectData.selected = !selectData.selected;
      newStateCheck.set(keyMap, selectData);
    }
    setStatusSelectedItem(newStateCheck);
  }

  /**
   * Return data selected to detail search screen
   */
  const handleUpdateSelectedData = () => {
    const datas: IFieldInfoPersonal[] = [];
    statusSelectedItem.forEach((item) => {
      if (item.selected) {
        const data = props.customFieldsData.find(field => field.fieldId.toString() === item.fieldId);
        if (data) {
          datas.push(data);
        }
      }
    })
    props.updateStateElement(datas);
    props.updateStatus(cloneDeep(statusSelectedItem));
    props.closeModal();
    // call API updateFieldInfoPersonals
    handleUpdateFieldInfoPersonals(datas);
  }

  /**
   * call API updateFieldInfoPersonals
   * @param dataSelected 
   */
  const handleUpdateFieldInfoPersonals = (dataSelected: IFieldInfoPersonal[]) => {
    updateFieldInfoPersonals({
      fieldBelong: FieldBelong.TASK,
      extensionBelong: ExtensionBelong.SEARCH_SCREEN,
      fieldInfos: map(dataSelected, item => {
        return {
          fieldId: item.fieldId,
          fieldOrder: item.fieldOrder
        }
      }),
      selectedTargetType: 0,
      selectedTargetId: 0
    })
  };

  /**
   * Search condition
   * @param value input value
   */
  const handleSearch = (value: string) => {
    setSearchValue(value);
    const result = props.customFieldsData.filter((field) => field.fieldLabel.includes(value));
    setFilterDatas(result);
  }

  /**
   * Checked all condition
   */
  const selectAllCondition = () => {
    const status = cloneDeep(statusSelectedItem);
    status.forEach((value) => {
      value.selected = true;
    });
    setStatusSelectedItem(status);
  }

  /**
   * Uncheck all condition
   */
  const deselectedAllCondition = () => {
    const status = cloneDeep(statusSelectedItem);
    status.forEach((value) => {
      value.selected = false;
    });
    setStatusSelectedItem(status);
  }

  /**
   * Reverse select state
   */
  const reverseStatus = () => {
    const status = cloneDeep(statusSelectedItem);
    status.forEach((value) => {
      value.selected = !value.selected;
    });
    setStatusSelectedItem(status);
  }

  /**
   * Check status of condition
   * @param fieldId 
   * @returns true if condition is selected, otherwise return false
   */
  const isSelectData = (fieldId: string) => {
    const data = statusSelectedItem.get(fieldId);
    if (data) {
      return data.selected;
    }
    return false;
  }

  /**
   * Check status of condition
   * @returns true if no conditions are selected, otherwise return false
   */
  const isNotSelected = () => {
    let result = true;
    statusSelectedItem.forEach(item => {
      if (item.selected) {
        result = false;
      }
    })
    return result;
  }

  /**
   * Render button
   * @param label 
   * @param clickFunc 
   * @param isDisable 
   */
  const renderControlButton = (label: string, clickFunc: () => void, isDisable: boolean) => {
    return (
      <TouchableOpacity
        style={isDisable ? [SearchDetailStyles.button, SearchDetailStyles.disableButton] : SearchDetailStyles.button}
        disabled={isDisable}
        onPress={clickFunc}
      >
        <Text>{label}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={SearchDetailStyles.modalContainer}>
      <TouchableOpacity
        style={[{ flex: 1 }, SearchDetailStyles.modalTouchable]}
        onPress={props.closeModal} >
        <View>
          <Icon style={SearchDetailStyles.modalIcon} name="iconModal" />
        </View>
      </TouchableOpacity>
      <View style={[SearchDetailStyles.modalContent, { flex: 2, justifyContent: 'flex-end' }]}>
        <View style={SearchDetailStyles.searchContent}>
          <View style={SearchDetailStyles.searchInput}>
            <View style={SearchDetailStyles.iconView}>
              <Icon style={SearchDetailStyles.iconSearch} name="search"></Icon>
            </View>
            <TextInput
              style={SearchDetailStyles.inputDataSearch}
              placeholder={translate(messages.placeholderItemSearch)}
              value={searchValue}
              onChangeText={(text) => handleSearch(text)}
            />
          </View>
          <View style={SearchDetailStyles.rowBlank}></View>
          <View style={SearchDetailStyles.rowButton}>
            {renderControlButton(translate(messages.selectAllOption), selectAllCondition, false)}
            {renderControlButton(translate(messages.deselectAllOption), deselectedAllCondition, isNotSelected())}
            {renderControlButton(translate(messages.reverseOption), reverseStatus, isNotSelected())}
          </View>
          <View style={SearchDetailStyles.searchContent}>
            <FlatList
              data={filterDatas}
              keyExtractor={item => item.fieldId.toString()}
              renderItem={({ item }) =>
                <TouchableOpacity
                  style={SearchDetailStyles.searchResponse}
                  onPress={() => handleViewCheckbox(item)}
                >
                  <Text style={SearchDetailStyles.fieldNameResponse}>{StringUtils.getFieldLabel(item, FIELD_LABLE, languageCode)}</Text>
                  <View style={SearchDetailStyles.iconView}>
                    {isSelectData(item.fieldId.toString()) ?
                      <Icon style={SearchDetailStyles.iconSearch} name="selected" /> : <Icon style={SearchDetailStyles.iconSearch} name="unchecked" />
                    }
                  </View>
                </TouchableOpacity>
              }
            ></FlatList>
            <TouchableOpacity
              style={[SearchDetailStyles.modalButton, SearchDetailStyles.floatLeftButton]}
              onPress={props.closeModal}
            >
              <Text>{translate(messages.cancelModal)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={isNotSelected() ? [SearchDetailStyles.modalButton, SearchDetailStyles.disableButton, SearchDetailStyles.floatRightButton]
                : [SearchDetailStyles.modalButton, SearchDetailStyles.decisionButton, SearchDetailStyles.floatRightButton]}
              disabled={isNotSelected()}
              onPress={handleUpdateSelectedData}
            >
              <Text style={isNotSelected() ? SearchDetailStyles.textDisable : SearchDetailStyles.textEnable}>{translate(messages.confirm)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

