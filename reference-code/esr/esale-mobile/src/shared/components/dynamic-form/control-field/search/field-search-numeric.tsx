import NumberUtils from '../../../../util/number-utils';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { DynamicFormModalVisible, TypeUnit, ChooseTypeSearch } from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchNumericStyles } from './field-search-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { translate } from '../../../../../config/i18n';

// define type of FieldSearchNumeric's props
type IFieldSearchNumericProps = IDynamicFieldProps;

/**
 * Component search numeric form
 * @param props 
 */
export function FieldSearchNumeric(props: IFieldSearchNumericProps) {
  const { fieldInfo, languageCode } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [modalVisible, setModalVisible] = useState(DynamicFormModalVisible.INVISIBLE);
  const [valueFrom, setValueFrom] = useState(TEXT_EMPTY);
  const [valueTo, setValueTo] = useState(TEXT_EMPTY);
  const [searchCondition, setSearchCondition] = useState(TEXT_EMPTY);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const [isEndEditingFrom, setIsEndEditingFrom] = useState(false);
  const [isEndEditingTo, setIsEndEditingTo] = useState(true);
  const [typeSearchChoose, setTypeSearchChoose] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  /**
   * Resolve when focus input value from
   */
  const onFocusValueEditFrom = () => {
    setIsEndEditingFrom(false);
  }

  /**
   * Resolve when blur input value from
   * @param text 
   */
  const onBlurValueEditFrom = () => {
    if (valueFrom?.length > 0) {
      setIsEndEditingFrom(true);
    }
  }

  /**
   * Resolve when focus input value to
   * @param text 
   */
  const onFocusValueEditTo = () => {
    setIsEndEditingTo(false);
  }

  /**
   * Resolve when blur input value to
   * @param text 
   */
  const onBlurValueEditTo = () => {
    if (valueTo?.length > 0) {
      setIsEndEditingTo(true);
    }
  }

  /**
   * run useEffect when close modal
   */
  useEffect(() => {
    if (valueFrom?.length > 0) {
      setIsEndEditingFrom(true);
    }
    if (valueTo?.length > 0) {
      setIsEndEditingTo(true);
    }
  }, [modalVisible]);

  /**
   * validate when user input ValueFrom
   * @param text 
   */
  const onChangeValueFromEdit = (text: string) => {
    if (text === TEXT_EMPTY || NumberUtils.isValidNumber(text, props.fieldInfo.decimalPlace)) {
      setValueFrom(text);
    }
  }

  /**
   * validate when user input ValueTo
   * @param text 
   */
  const onChangeValueToEdit = (text: string) => {
    if (text === TEXT_EMPTY || NumberUtils.isValidNumber(text, props.fieldInfo.decimalPlace)) {
      setValueTo(text);
    }
  }

  /**
   * Resolve when click button confirm
   */
  const handleSetSearchCondition = () => {
    setModalVisible(DynamicFormModalVisible.INVISIBLE);
    const isValueFromEmpty = valueFrom === TEXT_EMPTY;
    const isValueToEmpty = valueTo === TEXT_EMPTY;

    if (typeSearchChoose === ChooseTypeSearch.BLANK_SEARCH) {
      setSearchCondition(translate(fieldSearchMessages.blankSearchNumeric));
    } else if (isValueFromEmpty && isValueToEmpty) {
      setSearchCondition(TEXT_EMPTY);
    } else {
      const curUnit = fieldInfo.currencyUnit ?? TEXT_EMPTY;
      const valueToFormat = `${NumberUtils.autoFormatNumberCommon(valueTo)}`;
      const valueFromFormat = `${NumberUtils.autoFormatNumberCommon(valueFrom)}`;
      const messageLowerValue = `${translate(fieldSearchMessages.lowerValueNumeric)}`;
      const messageUpperValue = `${translate(fieldSearchMessages.upperValueNumeric)}`;
      if (fieldInfo.typeUnit === TypeUnit.SYMBOL) {
        if (isValueFromEmpty) {
          setSearchCondition(`${curUnit}${valueToFormat}${messageLowerValue}`);
        } else if (isValueToEmpty) {
          setSearchCondition(`${curUnit}${valueFromFormat}${messageUpperValue}`);
        } else {
          setSearchCondition(`${curUnit}${valueFromFormat}${messageUpperValue}${curUnit}${valueToFormat}${messageLowerValue}`);
        }
      } else {
        if (isValueFromEmpty) {
          setSearchCondition(`${valueToFormat}${curUnit}${messageLowerValue}`);
        } else if (isValueToEmpty) {
          setSearchCondition(`${valueFromFormat}${curUnit}${messageUpperValue}`);
        } else {
          setSearchCondition(`${valueFromFormat}${curUnit}${messageUpperValue}${valueToFormat}${curUnit}${messageLowerValue}`);
        }
      }
    }
    if (!props.isDisabled && props.updateStateElement) {
      const conditions: any = {};
      conditions["fieldId"] = fieldInfo.fieldId;
      conditions["fieldType"] = fieldInfo.fieldType;
      conditions["isDefault"] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
      conditions["fieldName"] = fieldInfo.fieldName;
      conditions["isSearchBlank"] = typeSearchChoose === ChooseTypeSearch.BLANK_SEARCH;
      const valDown = valueFrom.split(",").join(TEXT_EMPTY);
      const valUp = valueTo.split(",").join(TEXT_EMPTY);
      if ((valDown?.length > 0) || (valUp?.length > 0)) {
        conditions["fieldValue"] = { from: valDown, to: valUp };
      }
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions);
    }
  }
  /**
   * Render component search detail 
   */
  const renderSearchDetail = () => {
    const currencyUnit = fieldInfo?.currencyUnit ?? TEXT_EMPTY;
    const currencyUnitStr = currencyUnit.length > 3 ? currencyUnit.substring(0, 3) + "..." : currencyUnit;
    return (
      <View style={FieldSearchNumericStyles.modalOptionRange}>
        <View style={FieldSearchNumericStyles.modalOptionValueContainer}>
          <View style={FieldSearchNumericStyles.modalOptionValueInput}>
            {fieldInfo.typeUnit === TypeUnit.SYMBOL && currencyUnit !== TEXT_EMPTY &&
              (<Text style={FieldSearchNumericStyles.modalOptionCurrency}>{currencyUnitStr}</Text>)}
            {
              !isEndEditingFrom ?
                <TextInput
                  style={FieldSearchNumericStyles.modalTextInput}
                  value={valueFrom}
                  onChangeText={(text: string) => onChangeValueFromEdit(text)}
                  onBlur={() => onBlurValueEditFrom()}
                  onFocus={() => onFocusValueEditFrom()}
                  keyboardType='numeric'
                  autoFocus={!isEndEditingFrom}
                />
                :
                <Text onPress={() => { onFocusValueEditFrom() }}
                  style={FieldSearchNumericStyles.currencyUnit}
                  numberOfLines={1}>{NumberUtils.autoFormatNumberCommon(valueFrom).toString()}</Text>
            }
            {fieldInfo.typeUnit === TypeUnit.UNIT && currencyUnit !== TEXT_EMPTY &&
              (<Text style={FieldSearchNumericStyles.modalOptionCurrency}>
                {currencyUnitStr}
                </Text>)}
          </View>
        <View style={FieldSearchNumericStyles.modelOptionRangeLabel}>
          <Text style={FieldSearchNumericStyles.blackText}>{translate(fieldSearchMessages.upperValueNumeric)}</Text>
        </View>
      </View>

      <View style={FieldSearchNumericStyles.modalOptionValueContainer}>
        <View style={FieldSearchNumericStyles.modalOptionValueInput}>
          {fieldInfo.typeUnit === TypeUnit.SYMBOL && currencyUnit !== TEXT_EMPTY &&
            (<Text style={FieldSearchNumericStyles.modalOptionCurrency}>{currencyUnitStr}</Text>)}
          {
            !isEndEditingTo ?
              <TextInput
                style={FieldSearchNumericStyles.modalTextInput}
                value={valueTo}
                onChangeText={(text: string) => onChangeValueToEdit(text)}
                onBlur={() => onBlurValueEditTo()}
                onFocus={() => onFocusValueEditTo()}
                keyboardType='numeric'
                autoFocus={!isEndEditingTo}
              /> :
              <Text onPress={() => { onFocusValueEditTo() }}
                style={FieldSearchNumericStyles.currencyUnit}
                numberOfLines={1}>{NumberUtils.autoFormatNumberCommon(valueTo).toString()}</Text>
          }
          {fieldInfo.typeUnit === TypeUnit.UNIT && currencyUnit !== TEXT_EMPTY &&
            (<Text style={FieldSearchNumericStyles.modalOptionCurrency}>
              {currencyUnitStr}
            </Text>)}
        </View>
        <View style={FieldSearchNumericStyles.modelOptionRangeLabel}>
          <Text style={FieldSearchNumericStyles.blackText}>{translate(fieldSearchMessages.lowerValueNumeric)}</Text>
        </View>
      </View>
      </View >
    );
}
/**
 * render search numeric form
 */
const renderConponent = () => {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible === DynamicFormModalVisible.VISIBLE}
      >
        <View style={FieldSearchNumericStyles.modalContainer}>
          <TouchableOpacity style={FieldSearchNumericStyles.modalHeader} onPress={() => setModalVisible(DynamicFormModalVisible.INVISIBLE)} />
          <Image style={FieldSearchNumericStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchNumericStyles.modalContent}>
            <TouchableOpacity style={FieldSearchNumericStyles.modalOption} onPress={() => setTypeSearchChoose(ChooseTypeSearch.BLANK_SEARCH)}>
              <Text style={[FieldSearchNumericStyles.modalOptionText, FieldSearchNumericStyles.blackText]}>
                {translate(fieldSearchMessages.blankSearchNumeric)}
              </Text>
              {typeSearchChoose === ChooseTypeSearch.BLANK_SEARCH && (
                <Image style={FieldSearchNumericStyles.modalOptionIcon} source={selectedIcon} />
              )}
            </TouchableOpacity>
            <View style={FieldSearchNumericStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchNumericStyles.modalOption} onPress={() => setTypeSearchChoose(ChooseTypeSearch.DETAIL_SEARCH)}>
              <Text style={[FieldSearchNumericStyles.modalOptionText, FieldSearchNumericStyles.blackText]}>
                {translate(fieldSearchMessages.conditionalSearchNumeric)}
              </Text>
              {typeSearchChoose === ChooseTypeSearch.DETAIL_SEARCH && (
                <Image style={FieldSearchNumericStyles.modalOptionIcon} source={selectedIcon} />
              )}
            </TouchableOpacity>
            {typeSearchChoose === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchNumericStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchNumericStyles.modalButton} onPress={handleSetSearchCondition}>
              <Text style={FieldSearchNumericStyles.modalButtonTitle}>{translate(fieldSearchMessages.searchConditionsConfirmNumeric)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => setModalVisible(DynamicFormModalVisible.VISIBLE)}
      >
        <Text style={FieldSearchNumericStyles.title}>{title}</Text>
        {
          searchCondition === TEXT_EMPTY
            ? <Text style={FieldSearchNumericStyles.placeholderSearchNumeric}>
              {translate(fieldSearchMessages.searchContentNumeric)}
            </Text>
            : <Text style={FieldSearchNumericStyles.blackText}>{searchCondition}</Text>
        }
      </TouchableOpacity>
    </View>
  );
}

return renderConponent();
}