import React, { useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import { appImages } from '../../../config/constants';
import { FieldAddEditCheckboxStyles } from '../../../shared/components/dynamic-form/control-field/add-edit/field-add-edit-styles';
import { fieldAddEditMessages } from '../../../shared/components/dynamic-form/control-field/add-edit/field-add-edit-messages';
import { translate } from '../../../config/i18n';
import StringUtils from '../../../shared/util/string-utils';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { isJson } from '../../products/utils';

interface ModalCustomerOption {
  isVisible: boolean;
  closeModal: () => void;
  onSelected: (item: any) => void;
  dataOption?: Array<any>;
  itemSelected?: any;
}

export const ModalCustomerOption: React.FC<ModalCustomerOption> = ({
  isVisible,
  closeModal,
  onSelected,
  dataOption = [],
  itemSelected,
}) => {
  const authState = useSelector(authorizationSelector);
  const [selectedItemIds, setSelectedItemIds] = useState<any>([itemSelected]);

  /**
   * handle select item
   * @param item
   */
  const handleSelectItem = (item: any) => {
    setSelectedItemIds([item]);
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <View style={FieldAddEditCheckboxStyles.modalContainer}>
        <TouchableOpacity
          style={FieldAddEditCheckboxStyles.modalHeader}
          onPress={closeModal}
        />
        <View style={FieldAddEditCheckboxStyles.modalList}>
          <FlatList
            keyExtractor={(item) => item.itemId.toString()}
            data={dataOption}
            renderItem={({ item }: { item: any }) => {
              const { itemLabel } = item;
              const title = isJson(itemLabel)
                ? StringUtils.getFieldLabel(
                    { itemLabel },
                    'itemLabel',
                    authState.languageCode
                  )
                : itemLabel;
              console.log('selectedItemIds', selectedItemIds);

              return (
                <View>
                  <TouchableOpacity
                    style={FieldAddEditCheckboxStyles.modalListItem}
                    onPress={() => handleSelectItem(item)}
                  >
                    <View
                      style={FieldAddEditCheckboxStyles.modalListItemCheckbox}
                    >
                      <Text>{title}</Text>
                    </View>
                    <View style={FieldAddEditCheckboxStyles.iconCheckView}>
                      {selectedItemIds[0].itemId === item.itemId ? (
                        <Image source={appImages.icSelected} />
                      ) : (
                        <Image source={appImages.icUnchecked} />
                      )}
                    </View>
                  </TouchableOpacity>
                  <View
                    style={FieldAddEditCheckboxStyles.modalButtonContainer}
                  />
                  <View style={FieldAddEditCheckboxStyles.modalDivider} />
                </View>
              );
            }}
          />
        </View>
        <View style={FieldAddEditCheckboxStyles.modalButtonContainer}>
          <TouchableOpacity
            style={FieldAddEditCheckboxStyles.modalButton}
            onPress={() => onSelected(selectedItemIds)}
          >
            <Text style={FieldAddEditCheckboxStyles.modalButtonTitle}>
              {translate(fieldAddEditMessages.valueCheckboxConfirm)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
