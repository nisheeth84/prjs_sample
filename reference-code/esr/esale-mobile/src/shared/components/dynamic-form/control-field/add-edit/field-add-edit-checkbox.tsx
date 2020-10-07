import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { ModifyFlag } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import EntityUtils from '../../../../util/entity-utils';
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditCheckboxStyles } from './field-add-edit-styles';
import { isArray } from 'lodash';

// define type of FieldAddEditCheckbox's props
type IFieldAddEditCheckboxProps = IDynamicFieldProps;

/**
 * Component add/edit checkbox form
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditCheckbox(props: IFieldAddEditCheckboxProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { fieldInfo, languageCode } = props;
  const [selectedItemIds, setSelectedItemIds] = useState<any[]>([]);
  const [resultSelected, setResultSelected] = useState(TEXT_EMPTY);
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
  const uncheckedIcon = require("../../../../../../assets/icons/unchecked.png");
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);
  const fieldItemAvailable = fieldInfo?.fieldItems?.filter((item: any) => {
    return item.isAvailable === true
  });
  const fieldItemAfterSort: [] = fieldItemAvailable?.sort((a: any, b: any) => { return a.itemOrder - b.itemOrder });
  /**
   * handle select item
   * @param item 
   */
  const handleSelectItem = (item: any) => {
    const selectedIndex = selectedItemIds?.indexOf(item.itemId);
    if (selectedIndex >= 0) {
      selectedItemIds.splice(selectedIndex, 1);
    } else {
      selectedItemIds.push(item.itemId);
    }
    setSelectedItemIds(EntityUtils.clone(selectedItemIds));
  }

  /**
   * save selected item
   */
  const handleSaveSelectedItem = () => {
    if (props.updateStateElement && !props.isDisabled) {
      fieldInfo.fieldValue = EntityUtils.clone(selectedItemIds);
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, fieldInfo.fieldValue);
    }
    let options = TEXT_EMPTY;
    selectedItemIds.forEach(idx => {
      const fieldLabel = `${StringUtils.getFieldLabel(fieldItemAfterSort?.find((i: any) => i.itemId === idx), ITEM_LABEL, language)}`;
      if (options === TEXT_EMPTY) {
        options = `${options}${fieldLabel}`;
      } else {
        options = `${options}, ${fieldLabel}`;
      }
    });
    setResultSelected(options);
    setModalVisible(false);
  }

  /**
   * Set value when render first time
   */
  const initialize = () => {
    if (!props.isDisabled && isArray(fieldItemAfterSort)) {
      let listSelected: any[] = [];
      if (props?.elementStatus?.fieldValue) {
        listSelected = props?.elementStatus?.fieldValue;
      }
      let options = TEXT_EMPTY;
      fieldItemAfterSort?.map((item: any) => {
        if (listSelected?.includes(item.itemId)) {
          const fieldLabel = `${StringUtils.getFieldLabel(item, ITEM_LABEL, language)}`;
          if (options === TEXT_EMPTY) {
            options = `${options}${fieldLabel}`;
          } else {
            options = `${options}, ${fieldLabel}`;
          }
        }
      });
      setResultSelected(options);
      setSelectedItemIds(listSelected);
    }
  };
  /**
   * Handling after render
   */
  useEffect(() => {
    initialize();
  }, []);

  /**
   * render field add/edit checkbox
   */
  const renderComponent = () => {
    return (
      <View style={FieldAddEditCheckboxStyles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={FieldAddEditCheckboxStyles.modalContainer}>
            <TouchableOpacity style={FieldAddEditCheckboxStyles.modalHeader} onPress={() => setModalVisible(false)} />
            <View style={FieldAddEditCheckboxStyles.modalList}>
              <FlatList
                keyExtractor={item => item.itemId.toString()}
                data={fieldItemAfterSort}
                renderItem={({ item }: { item: any }) => (
                  <View>
                    <TouchableOpacity
                      style={FieldAddEditCheckboxStyles.modalListItem}
                      onPress={() => handleSelectItem(item)}>
                      <View style={FieldAddEditCheckboxStyles.modalListItemCheckbox}>
                        <Text>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                      </View>
                      <View style={FieldAddEditCheckboxStyles.iconCheckView}>
                        {selectedItemIds.includes(item.itemId)
                          ? <Image source={checkedIcon} />
                          : <Image source={uncheckedIcon} />
                        }
                      </View>
                    </TouchableOpacity>
                    <View style={FieldAddEditCheckboxStyles.modalButtonContainer} />
                    <View style={FieldAddEditCheckboxStyles.modalDivider} />
                  </View>
                )} />
            </View>
            <View style={FieldAddEditCheckboxStyles.modalButtonContainer}>
              <TouchableOpacity style={FieldAddEditCheckboxStyles.modalButton}
                onPress={() => handleSaveSelectedItem()}
              >
                <Text style={FieldAddEditCheckboxStyles.modalButtonTitle}>
                  {translate(fieldAddEditMessages.valueCheckboxConfirm)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={props.isDisabled}
        >
          <View style={FieldAddEditCheckboxStyles.titleContainer}>
            <Text style={FieldAddEditCheckboxStyles.title}>{title}</Text>
            {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
              <View style={FieldAddEditCheckboxStyles.requiredContainer}>
                <Text style={FieldAddEditCheckboxStyles.requiredText}>{translate(fieldAddEditMessages.common_119908_04_inputRequired)}</Text>
              </View>
            )}
          </View>
          <View style={FieldAddEditCheckboxStyles.inputContainer}>
            {
              resultSelected === TEXT_EMPTY ?
                <Text style={FieldAddEditCheckboxStyles.placeholder}>{`${title}${translate(fieldAddEditMessages.checkboxPlaceholder)}`}</Text>
                : <Text>{resultSelected}</Text>

            }
          </View>
        </TouchableOpacity>
      </View >
    );
  }

  return renderComponent();
}