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
import { FieldAddEditPulldownMultiStyles } from './field-add-edit-styles';

// define type of FieldAddEditPulldownMulti's props
type IFieldAddEditPulldownMultiProps = IDynamicFieldProps;

/**
 * Component add/edit pulldown multi form
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditPulldownMulti(props: IFieldAddEditPulldownMultiProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { fieldInfo, languageCode } = props;
  const [selectedItemIds, setSelectedItemIds] = useState<any[]>([]);
  const [resultSelected, setResultSelected] = useState('');
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
  const uncheckedIcon = require("../../../../../../assets/icons/unchecked.png");
  const language = languageCode ?? TEXT_EMPTY
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
    if (!props.isDisabled && Array.isArray(fieldItemAfterSort)) {
      let options = TEXT_EMPTY;
      let listItems: any[] = [];
      fieldItemAfterSort?.forEach((item: any) => {
        if (props?.elementStatus?.fieldValue) {
          listItems = props?.elementStatus?.fieldValue;
        }
        if (listItems?.includes(item.itemId)) {
          const fieldLabel = `${StringUtils.getFieldLabel(item, ITEM_LABEL, language)}`;
          if (options === TEXT_EMPTY) {
            options = `${options}${fieldLabel}`;
          } else {
            options = `${options}, ${fieldLabel}`;
          }
        }
      });
      setResultSelected(options);
      setSelectedItemIds(listItems);
    }
  };
  /**
   * Handling after render
   */
  useEffect(() => {
    initialize();
  }, []);

  /**
   * render field add/edit pulldown multi
   */
  const renderComponent = () => {
    return (
      <View style={FieldAddEditPulldownMultiStyles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={FieldAddEditPulldownMultiStyles.modalContainer}>
            <TouchableOpacity style={FieldAddEditPulldownMultiStyles.modalHeader} onPress={() => setModalVisible(false)} />
            <View style={FieldAddEditPulldownMultiStyles.modalList}>
              <FlatList
                keyExtractor={item => item.itemId.toString()}
                data={fieldItemAfterSort ?? []}
                renderItem={({ item }: { item: any }) => (
                  <View>
                    <TouchableOpacity
                      style={FieldAddEditPulldownMultiStyles.modalListItem}
                      onPress={() => handleSelectItem(item)}>
                      <View style={FieldAddEditPulldownMultiStyles.modalListItemPulldown}>
                        <Text>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                      </View>
                      <View style={FieldAddEditPulldownMultiStyles.iconCheckView}>
                        {selectedItemIds.includes(item.itemId)
                          ? <Image source={checkedIcon} />
                          : <Image source={uncheckedIcon} />
                        }
                      </View>
                    </TouchableOpacity>
                    <View style={FieldAddEditPulldownMultiStyles.modalButtonContainer} />
                    <View style={FieldAddEditPulldownMultiStyles.modalDivider} />
                  </View>
                )} />
            </View>
            <View style={FieldAddEditPulldownMultiStyles.modalButtonContainer}>
              {selectedItemIds.length > 0 ?
                <TouchableOpacity style={FieldAddEditPulldownMultiStyles.modalButton}
                  onPress={() => handleSaveSelectedItem()}
                >
                  <Text style={FieldAddEditPulldownMultiStyles.modalButtonTitle}>
                    {translate(fieldAddEditMessages.valuePulldownMultiConfirm)}
                  </Text>
                </TouchableOpacity>
                : <TouchableOpacity style={[FieldAddEditPulldownMultiStyles.modalButton, FieldAddEditPulldownMultiStyles.disableButton]}
                  disabled
                >
                  <Text style={FieldAddEditPulldownMultiStyles.textBtnDisable}>
                    {translate(fieldAddEditMessages.valuePulldownMultiConfirm)}
                  </Text>
                </TouchableOpacity>
              }
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          disabled={props.isDisabled}
        >
          <View style={FieldAddEditPulldownMultiStyles.titleContainer}>
            <Text style={FieldAddEditPulldownMultiStyles.title}>{title}</Text>
            {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
              <View style={FieldAddEditPulldownMultiStyles.requiredContainer}>
                <Text style={FieldAddEditPulldownMultiStyles.requiredText}>{translate(fieldAddEditMessages.common_119908_03_inputRequired)}</Text>
              </View>
            )}
          </View>
          <View>
            {
              resultSelected === TEXT_EMPTY ?
                <Text style={FieldAddEditPulldownMultiStyles.placeholder}>{`${title}${translate(fieldAddEditMessages.pulldownMultiPlaceholder)}`}</Text>
                : <Text>{resultSelected}</Text>
            }
          </View>
        </TouchableOpacity>
      </View >
    );
  }
  return renderComponent();
}