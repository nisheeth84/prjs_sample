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
import StringUtils from '../../../../util/string-utils';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditPulldownSingleStyles } from './field-add-edit-styles';

// define type of FieldAddEditPulldownSingle's props
type IFieldAddEditPulldownSingleProps = IDynamicFieldProps;

/**
 * Component add/edit pulldown single form
 * @param props see IDynamicFieldProps
 */
export function FieldAddEditPulldownSingle(props: IFieldAddEditPulldownSingleProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIdView, setSelectedItemIdView] = useState(TEXT_EMPTY);
  const { fieldInfo, elementStatus, languageCode } = props;
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
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
   * set selected item in list when open modal 
   * Set value when render first time
   */
  const initialize = () => {
    if (!props.isDisabled) {
      if (elementStatus?.fieldValue) {
        const itemDefault: any = fieldItemAfterSort?.find((item: any) => item.itemId === elementStatus?.fieldValue)
        if (itemDefault) {
          setSelectedItemIdView(itemDefault.itemId)
          return
        }
      }
    }
  };

  /**
   * Handling after render
   */
  useEffect(() => {
    initialize();
  }, []);


  /**
   * render field add/edit pulldown single
   */
  const renderComponent = () => {
    return (
      <View style={FieldAddEditPulldownSingleStyles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={FieldAddEditPulldownSingleStyles.modalContainer}>
            <TouchableOpacity style={FieldAddEditPulldownSingleStyles.modalHeader} onPress={() => setModalVisible(false)} />
            <View style={FieldAddEditPulldownSingleStyles.modalList}>
              <FlatList
                keyExtractor={item => item.itemId}
                data={fieldItemAfterSort ?? []}
                renderItem={({ item }: { item: any }) => (
                  <View>
                    <TouchableOpacity
                      style={FieldAddEditPulldownSingleStyles.modalListItem}
                      onPress={() => handleSelectItem(item)}>
                      <View style={FieldAddEditPulldownSingleStyles.modalListItemPulldown}>
                        <Text style={FieldAddEditPulldownSingleStyles.optionText}>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                      </View>
                      <View style={FieldAddEditPulldownSingleStyles.iconCheckView}>
                        {selectedItemIdView === item.itemId
                          && <Image source={checkedIcon} />
                        }
                      </View>
                    </TouchableOpacity>
                    <View style={FieldAddEditPulldownSingleStyles.modalButtonContainer} />
                    <View style={FieldAddEditPulldownSingleStyles.modalDivider} />
                  </View>
                )} />
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          <View style={FieldAddEditPulldownSingleStyles.titleContainer}>
            <Text style={FieldAddEditPulldownSingleStyles.title}>{title}</Text>
            {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
              <View style={FieldAddEditPulldownSingleStyles.requiredContainer}>
                <Text style={FieldAddEditPulldownSingleStyles.requiredText}>{translate(fieldAddEditMessages.common_119908_03_inputRequired)}</Text>
              </View>
            )}
          </View>
          <View>
            {
              selectedItemIdView === TEXT_EMPTY ?
                <Text style={FieldAddEditPulldownSingleStyles.placeholder}>{`${title}${translate(fieldAddEditMessages.pulldownSinglePlaceholder)}`}</Text>
                : <Text>{StringUtils.getFieldLabel(fieldItemAfterSort?.find((item: any) => item.itemId === selectedItemIdView), ITEM_LABEL, language)}</Text>
            }
          </View>
        </TouchableOpacity>
      </View >
    );
  }

  return renderComponent();
}