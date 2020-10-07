import { DefineFieldType } from '../../../config/constants/enum';
import _ from 'lodash';
import { FieldInfoItem } from '../../../config/constants/field-info-interface';
import { DEFINE_FIELD_TYPE } from './employee-special';
import { View, Modal, TouchableOpacity, Image, Text, TextInput } from 'react-native';
import {
  FieldSearchPulldownSingleStyles,
  FieldSearchNumericStyles,
} from '../../../shared/components/dynamic-form/control-field/search/field-search-styles';
import { translate } from '../../../config/i18n';
import { messages } from '../search-detail/search-detail-messages';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import React, { useState } from 'react';
import StringUtils from '../../../shared/util/string-utils';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { ProductTradingSpecialStyle } from './search-special-style';

export const specialInfoProductManage = (
  field: any,
  dataLayoutService: any
) => {
  let item = { ...field };
  const { fieldName, fieldType } = item;
  if (fieldName === 'is_finish') {
    return;
  }
  if (fieldType?.toString() === DefineFieldType.OTHER) {
    if (fieldName === 'product_trading_progress_id') {
      item.fieldType = 1;
      item = handleProgressTrading(item, dataLayoutService);
    }
    if (
      fieldName === 'customer_id' ||
      fieldName === 'product_id' ||
      fieldName === 'employee_id' ||
      fieldName === 'created_user' ||
      fieldName === 'updated_user'
    ) {
      item.fieldType = 9;
    }
  }
  return item;
};

export const getFieldNameProductManage = (field: FieldInfoItem) => {
  const _field = _.cloneDeep(field);
  if (!_field.isDefault) {
    return `sales_data.${_field.fieldName}`;
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

const handleProgressTrading = (field: any, dataLayoutService: any) => {
  const item = { ...field };
  const fieldItems: any = [];
  dataLayoutService.forEach((element: any) => {
    fieldItems.push({
      itemId: element.productTradingProgressId,
      itemLabel: element.progressName,
      itemOrder: element.progressOrder,
      isAvailable: element.isAvailable,
      isDefault: null,
    });
  });
  item.fieldItems = fieldItems;
  return item;
};

export function RenderTradingContactField({ days, onPressChoose, field }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const modalIcon = require('../../../../assets/icons/icon_modal.png');
  const author = useSelector(authorizationSelector);

  const [dateNumber, setDateNumber] = useState(days?.toString() || '');

  const onChangeValueFromEdit = (text: string) => {
    if (text === TEXT_EMPTY || validateDateNumber(text)) {
      setDateNumber(text);
    }
  };

  const handlePressButton = () => {
    onPressChoose(dateNumber);
    setModalVisible(false);
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
          <Image
            style={FieldSearchPulldownSingleStyles.modalIcon}
            source={modalIcon}
          />
          <View style={FieldSearchPulldownSingleStyles.modalContent}>
            <View>
              <Text
                style={[
                  FieldSearchNumericStyles.modalOptionText,
                  FieldSearchNumericStyles.blackText,
                ]}
              >
                {translate(messages.searchFrontContactDate)}
              </Text>

              <View
                style={ProductTradingSpecialStyle.inputContainer}
              >
                <TextInput
                  style={ProductTradingSpecialStyle.inputDays}
                  value={dateNumber}
                  onChangeText={onChangeValueFromEdit}
                  keyboardType="numeric"
                />
                <Text style={FieldSearchNumericStyles.blackText}>
                  {translate(messages.searchAfterContactDate)}
                </Text>
              </View>
            </View>
            <View style={FieldSearchPulldownSingleStyles.modalDivider} />
            <TouchableOpacity
              style={FieldSearchPulldownSingleStyles.modalButton}
              onPress={handlePressButton}
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
          author.languageCode || TEXT_EMPTY
        )}
      </Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text
          style={
            FieldSearchPulldownSingleStyles.placeholderSearchPulldownSingle
          }
        >
          {translate(messages.searchTitleContactDate)}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const validateDateNumber = (strValue: string) => {
  if (!strValue || strValue?.toString()?.trim() === TEXT_EMPTY) {
    return true;
  }

  return /^\d{0,18}$/g.test(strValue);
};
