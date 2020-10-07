import { DefineFieldType } from '../../../config/constants/enum';
import _ from 'lodash';
import { FieldInfoItem } from '../../../config/constants/field-info-interface';
import { DEFINE_FIELD_TYPE } from './employee-special';
import { messages } from '../search-detail/search-detail-messages';
import { translate } from '../../../config/i18n';
import { View, Modal, TouchableOpacity, Image, Text } from 'react-native';
import React, { useState } from 'react';
import { FieldSearchPulldownSingleStyles } from '../../../shared/components/dynamic-form/control-field/search/field-search-styles';
import StringUtils from '../../../shared/util/string-utils';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../login/authorization/authorization-selector';

export const specialInfoCustomer = (field: any, dataLayoutService: any) => {
  let item = { ...field };
  const { fieldName, fieldType } = item;
  if (!!dataLayoutService && dataLayoutService?.fieldItems?.length > 0) {
    item.fieldItems =
      field?.fieldItems?.length > 0
        ? field?.fieldItems
        : dataLayoutService.fieldItems;
  }
  if (fieldName === 'business_sub_id' || fieldName === 'scenario_id') {
    return;
  }
  if (fieldType?.toString() === DefineFieldType.OTHER) {
    if (fieldName === 'last_contact_date') {
      item.fieldType = 6;
    }
    if (fieldName === 'business_main_id') {
      item.fieldType = 1;
      item.fieldName = 'business';
      item = buildBusinessItem(item, dataLayoutService);
    }
    if (
      fieldName === 'customer_parent' ||
      fieldName === 'schedule_next' ||
      fieldName === 'action_next' ||
      fieldName === 'created_user' ||
      fieldName === 'updated_user'
    ) {
      item.fieldType = 9;
    }
  }
  return item;
};

export const getFieldNameCustomer = (field: FieldInfoItem) => {
  const _field = _.cloneDeep(field);
  if (!_field.isDefault) {
    return `customer_data.${_field.fieldName}`;
  }
  if (
    (_field?.fieldType?.toString() === DEFINE_FIELD_TYPE.TEXT ||
      _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.TEXTAREA ||
      _field?.fieldType?.toString() === DEFINE_FIELD_TYPE.PHONE_NUMBER) &&
    !_field?.fieldName?.includes('keyword')
  ) {
    return `${_field.fieldName}.keyword`;
  }
  return `${_field.fieldName}`;
};

export const displayChildCondition = (item: any) => {
  return {
    fieldId: item.fieldId,
    fieldName: 'is_display_child_customers',
    fieldType: 1,
    fieldValue: true,
    isDefault: true,
    searchOption: 1,
    searchType: 1,
  };
};

const buildBusinessItem = (item: any, dataLayoutService: any) => {
  let field = { ...item };
  let fieldItems: any = [];
  const { listFieldsItem = {} } = { ...dataLayoutService };
  listFieldsItem.forEach((element: any) => {
    fieldItems.push({
      itemId: element.itemId.toString(),
      isAvailable: element.isAvailable,
      itemOrder: fieldItems.length,
      isDefault: element.isDefault,
      itemLabel: element.itemLabel,
    });

    element.fieldItemChilds.forEach((el: any) => {
      fieldItems.push({
        itemId: el.itemId.toString(),
        isAvailable: el.isAvailable,
        itemOrder: fieldItems.length,
        isDefault: el.isDefault,
        itemLabel: el.itemLabel,
        parentId: 1,
      });
    });
  });
  field.fieldItems = fieldItems;
  return field;
};

export function RenderIsDisplayChildField({
  isDisplayChild,
  onPressChoose,
  field,
}: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const modalIcon = require('../../../../assets/icons/icon_modal.png');
  const unSelectedIcon = require('../../../../assets/icons/unchecked.png');
  const selectedIcon = require('../../../../assets/icons/selected.png');
  const author = useSelector(authorizationSelector);

  const [isSelected, setIsSelected] = useState(isDisplayChild);

  const handlePressItem = () => {
    setIsSelected(!isSelected);
    onPressChoose(!isSelected);
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={FieldSearchPulldownSingleStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchPulldownSingleStyles.modalHeader}
            onPress={() => setModalVisible(false)}
          />
          <View style={FieldSearchPulldownSingleStyles.modalContent}>
            <Image
              style={FieldSearchPulldownSingleStyles.modalIcon}
              source={modalIcon}
            />
            <View>
              <TouchableOpacity
                style={FieldSearchPulldownSingleStyles.modalOptionSearchDetail}
                onPress={handlePressItem}
              >
                <View style={[FieldSearchPulldownSingleStyles.labelOption]}>
                  <Text>
                    {translate(messages.searchCustomerIsDisplayChild)}
                  </Text>
                </View>
                <View style={FieldSearchPulldownSingleStyles.iconCheckView}>
                  {isSelected ? (
                    <Image source={selectedIcon} />
                  ) : (
                    <Image source={unSelectedIcon} />
                  )}
                </View>
              </TouchableOpacity>
            </View>
            <View style={FieldSearchPulldownSingleStyles.modalDivider} />
            <TouchableOpacity
              style={FieldSearchPulldownSingleStyles.modalButton}
              onPress={()=>setModalVisible(false)}
            >
              <Text style={FieldSearchPulldownSingleStyles.modalButtonTitle}>
                {translate(messages.searchConfirmButton)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Text style={FieldSearchPulldownSingleStyles.title}>
        {StringUtils.getFieldLabel(
          field,
          'fieldLabel',
          author.languageCode || 'ja_jp'
        )}
      </Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text
          style={
            FieldSearchPulldownSingleStyles.placeholderSearchPulldownSingle
          }
        >
          {translate(messages.searchCustomerIsDisplayChild)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
