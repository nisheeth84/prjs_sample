import NumberUtils from '../../../../util/number-utils';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchCalculationStyles } from './field-search-styles';
import { fieldSearchMessages } from './field-search-messages';
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

// define type of FieldSearchCalculation props
type IFieldSearchCalculationProps = IDynamicFieldProps;

/**
 * Component search calculation form
 * @param props 
 */
export function FieldSearchCalculation(props: IFieldSearchCalculationProps) {
  const { fieldInfo,languageCode } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [modalVisible, setModalVisible] = useState(false);
  const [valueFrom, setValueFrom] = useState(TEXT_EMPTY);
  const [valueTo, setValueTo] = useState(TEXT_EMPTY);
  const [isSearchBlank, setIsSearchBlank] = useState(false);
  const [searchCondition, setSearchCondition] = useState(TEXT_EMPTY);
  const language = languageCode ?? TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);
  const [isEndEditingFrom, setIsEndEditingFrom] = useState(false);
  const [isEndEditingTo, setIsEndEditingTo] = useState(true);
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
    setModalVisible(false);
    const isValueFromEmpty = valueFrom === TEXT_EMPTY;
    const isValueToEmpty = valueTo === TEXT_EMPTY;
    if (isSearchBlank) {
      setSearchCondition(translate(fieldSearchMessages.blankSearchCalculation));
    } else if (isValueFromEmpty && isValueToEmpty) {
      setSearchCondition(TEXT_EMPTY);
    } else {
      const valueToFormat = `${NumberUtils.autoFormatNumberCommon(valueTo)}`;
      const valueFromFormat = `${NumberUtils.autoFormatNumberCommon(valueFrom)}`;
      const messageLowerValue = `${translate(fieldSearchMessages.lowerValueCalculation)}`;
      const messageUpperValue = `${translate(fieldSearchMessages.upperValueCalculation)}`;
      if (isValueFromEmpty) {
        setSearchCondition(`${valueToFormat}${messageLowerValue}`);
      } else if (isValueToEmpty) {
        setSearchCondition(`${valueFromFormat}${messageUpperValue}`);
      } else {
        setSearchCondition(`${valueFromFormat}${messageUpperValue}${valueToFormat}${messageLowerValue}`);
      }

    }
    if (!props.isDisabled && props.updateStateElement) {
      const conditions: any = {};
      conditions["fieldId"] = fieldInfo.fieldId;
      conditions["fieldType"] = fieldInfo.fieldType;
      conditions["isDefault"] = fieldInfo.isDefault ? fieldInfo.isDefault : false;
      conditions["fieldName"] = fieldInfo.fieldName;
      conditions["isSearchBlank"] = isSearchBlank;
      const valDown = valueFrom.split(",").join(TEXT_EMPTY);
      const valUp = valueTo.split(",").join(TEXT_EMPTY);
      if (valDown?.length > 0 || valUp?.length > 0) {
        conditions["fieldValue"] = { from: valDown, to: valUp };
      }
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions);
    }
  }
  /**
   * Render component search detail 
   */
  const renderSearchDetail = () => {
    return (
      <View style={FieldSearchCalculationStyles.modalOptionRange}>
        <View style={FieldSearchCalculationStyles.modalOptionValueContainer}>
          <View style={FieldSearchCalculationStyles.modalOptionValueInput}>
            {
              !isEndEditingFrom ?
                <TextInput
                  style={[FieldSearchCalculationStyles.modalTextInput,
                  { textAlign: 'left' },
                  ]}
                  value={valueFrom}
                  onChangeText={(text: string) => onChangeValueFromEdit(text)}
                  onBlur={() => onBlurValueEditFrom()}
                  onFocus={() => onFocusValueEditFrom()}
                  keyboardType='numeric'
                  autoFocus={!isEndEditingFrom}
                />
                :
                <Text onPress={() => { onFocusValueEditFrom() }}
                  style={{ paddingVertical: 10, textAlign: "right" , width:"100%"}}
                  numberOfLines={1}>{NumberUtils.autoFormatNumberCommon(valueFrom).toString()}</Text>
            }
          </View>
          <View style={FieldSearchCalculationStyles.modelOptionRangeLabel}>
            <Text style={FieldSearchCalculationStyles.blackText}>{translate(fieldSearchMessages.upperValueCalculation)}</Text>
          </View>
        </View>

        <View style={FieldSearchCalculationStyles.modalOptionValueContainer}>
          <View style={FieldSearchCalculationStyles.modalOptionValueInput}>
            {
              !isEndEditingTo ?
                <TextInput
                  style={[FieldSearchCalculationStyles.modalTextInput,
                  { textAlign: 'left' },
                  ]}
                  value={valueTo}
                  onChangeText={(text: string) => onChangeValueToEdit(text)}
                  onBlur={() => onBlurValueEditTo()}
                  onFocus={() => onFocusValueEditTo()}
                  keyboardType='numeric'
                  autoFocus={!isEndEditingTo}
                /> :
                <Text onPress={() => { onFocusValueEditTo() }}
                  style={{ paddingVertical: 10, textAlign: "right", width:"100%" }}
                  numberOfLines={1}>{NumberUtils.autoFormatNumberCommon(valueTo).toString()}</Text>
            }
          </View>
          <View style={FieldSearchCalculationStyles.modelOptionRangeLabel}>
            <Text style={FieldSearchCalculationStyles.blackText}>{translate(fieldSearchMessages.lowerValueCalculation)}</Text>
          </View>
        </View>
      </View>
    );
  }
  /**
   * render search calculation form
   */
  const renderConponent = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={FieldSearchCalculationStyles.modalContainer}>
            <TouchableOpacity style={FieldSearchCalculationStyles.modalHeader} onPress={() => setModalVisible(!modalVisible)} />
            <Image style={FieldSearchCalculationStyles.modalIcon} source={modalIcon} />
            <View style={FieldSearchCalculationStyles.modalContent}>
              <TouchableOpacity style={FieldSearchCalculationStyles.modalOption} onPress={() => setIsSearchBlank(true)}>
                <Text style={FieldSearchCalculationStyles.modalOptionText}>{translate(fieldSearchMessages.blankSearchCalculation)}</Text>
                {isSearchBlank && (
                  <Image style={FieldSearchCalculationStyles.modalOptionIcon} source={selectedIcon} />
                )}
              </TouchableOpacity>
              <View style={FieldSearchCalculationStyles.modalDivider} />
              <TouchableOpacity style={FieldSearchCalculationStyles.modalOption} onPress={() => setIsSearchBlank(false)}>
                <Text style={FieldSearchCalculationStyles.modalOptionText}>{translate(fieldSearchMessages.conditionalSearchCalculation)}</Text>
                {!isSearchBlank && (
                  <Image style={FieldSearchCalculationStyles.modalOptionIcon} source={selectedIcon} />
                )}
              </TouchableOpacity>
              {!isSearchBlank && renderSearchDetail()}
              <View style={FieldSearchCalculationStyles.modalDivider} />
              <TouchableOpacity style={FieldSearchCalculationStyles.modalButton} onPress={handleSetSearchCondition}>
                <Text style={FieldSearchCalculationStyles.modalButtonTitle}>{translate(fieldSearchMessages.searchConditionsConfirmCalculation)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          <Text style={FieldSearchCalculationStyles.title}>{title}</Text>
          {
            searchCondition === TEXT_EMPTY
              ? <Text style={FieldSearchCalculationStyles.placeholderSearchCalculation}>
                {translate(fieldSearchMessages.searchContentCalculation)}
              </Text>
              : <Text style={FieldSearchCalculationStyles.blackText}>{searchCondition}</Text>
          }
        </TouchableOpacity>
      </View>
    );
  }

  return renderConponent();
}