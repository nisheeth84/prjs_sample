import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditRadioStyles } from './field-add-edit-styles';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { ModifyFlag } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';

// define type of FieldAddEditRadio's props
type IFieldAddEditRadioProps = IDynamicFieldProps;

/**
 * Component add/edit radio button form
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditRadio(props: IFieldAddEditRadioProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIdView, setSelectedItemIdView] = useState(TEXT_EMPTY);
  const { fieldInfo, elementStatus, languageCode } = props;
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
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
    if (props.updateStateElement && !props.isDisabled) {
      const keyObject = { itemId: null, fieldId: fieldInfo.fieldId };
      if (props.elementStatus) {
        keyObject.itemId = props.elementStatus.key;
      }
      props.updateStateElement(keyObject, props.controlType, item.itemId);
      setSelectedItemIdView(item.itemId);
    }
    setModalVisible(false);
  }

  /**
   * Set value of option choose
   */
  const initialize = () => {
    if (!props.isDisabled && fieldItemAfterSort?.length > 0) {
      if (elementStatus?.fieldValue) {
        const itemDefault: any = fieldItemAfterSort?.find((item: any) => item.itemId === elementStatus?.fieldValue)
        if (itemDefault) {
          setSelectedItemIdView(itemDefault.itemId)
          return
        } 
      }
      const itemDefault: any = fieldItemAfterSort?.find((item: any) => item.isDefault === true);
      if (itemDefault) {
        setSelectedItemIdView(itemDefault.itemId);
      } else {
        setSelectedItemIdView(Object.values(fieldItemAfterSort)[0]["itemId"]);
      }
    }
    
  }

  /**
   * Handling after each rendering
   */
  useEffect(() => {
    initialize();
  }, []);

  /**
   * render field add/edit  radio button
   */
  const renderComponent = () => {
    return (
      <View style={FieldAddEditRadioStyles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={FieldAddEditRadioStyles.modalContainer}>
            <TouchableOpacity style={FieldAddEditRadioStyles.modalHeader} onPress={() => setModalVisible(false)} />
            <View style={FieldAddEditRadioStyles.modalList}>
              <FlatList
                keyExtractor={item => item.itemId.toString()}
                data={fieldItemAfterSort}
                renderItem={({ item }: { item: any }) => (
                  <View>
                    <TouchableOpacity
                      style={FieldAddEditRadioStyles.modalListItem}
                      onPress={() => handleSelectItem(item)}>
                      <View style={FieldAddEditRadioStyles.modalListItemLabel}>
                        <Text style={FieldAddEditRadioStyles.optionText}>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                      </View>
                      <View style={FieldAddEditRadioStyles.iconCheckView}>
                        {selectedItemIdView === item.itemId
                          && <Image source={checkedIcon} />
                        }
                      </View>
                    </TouchableOpacity>
                    <View style={FieldAddEditRadioStyles.modalButtonContainer} />
                    <View style={FieldAddEditRadioStyles.modalDivider} />
                  </View>
                )} />
            </View>

          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={props.isDisabled}
        >
          <View style={FieldAddEditRadioStyles.titleContainer}>
            <Text style={FieldAddEditRadioStyles.title}>{title}</Text>
            {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
              <View style={FieldAddEditRadioStyles.requiredContainer}>
                <Text style={FieldAddEditRadioStyles.requiredText}>{translate(fieldAddEditMessages.common_119908_04_inputRequired)}</Text>
              </View>
            )}
          </View>
          <View>
            {
              selectedItemIdView === TEXT_EMPTY ?
                <Text style={FieldAddEditRadioStyles.placeholder}>{`${title}${translate(fieldAddEditMessages.radioPlaceholder)}`}</Text>
                : <Text>{StringUtils.getFieldLabel(fieldItemAfterSort.find((item: any) => item.itemId === selectedItemIdView), ITEM_LABEL, language)}</Text>

            }
          </View>
        </TouchableOpacity>
      </View >
    );
  }

  return renderComponent();
}