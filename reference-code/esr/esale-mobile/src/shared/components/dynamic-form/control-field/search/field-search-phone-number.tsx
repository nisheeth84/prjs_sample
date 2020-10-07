import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchPhoneNumberStyles } from './field-search-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import { translate } from '../../../../../config/i18n';
import {
  ChooseTypeSearch,
  DefineFieldType,
  SearchOption,
  SearchType,
} from '../../../../../config/constants/enum';

// Define value props of FieldSearchPhoneNumber component
type IFieldSearchPhoneNumberProps = IDynamicFieldProps;

/**
 * Component for searching phone number fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchPhoneNumber(props: IFieldSearchPhoneNumberProps) {
  const { fieldInfo, languageCode } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const optionSearchIcon = require("../../../../../../assets/icons/search_option.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [value, setValue] = useState(TEXT_EMPTY);
  const [resultSearch, setResultSearch] = useState(value);
  const [valueConfirm, setValueConfirm] = useState(TEXT_EMPTY);
  const [typeSearchCondition, setTypeSearchCondition] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  const [typeSearchConditionConfirm, setTypeSearchConditionConfirm] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  const [isSearchOptionIcon, setIsSearchOptionIcon] = useState(true);
  const [searchOption, setSearchOption] = useState(SearchOption.OR);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearchOptionVisible, setModalSearchOptionVisible] = useState(false);
  const [keyBoard, setKeyBoard] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {
        fieldId: fieldInfo.fieldId,
        fieldType: DefineFieldType.PHONE_NUMBER,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.PHONE_NUMBER, conditions);
    }
  };

  /**
   * Handling after first render
   */
  useEffect(() => {
    initialize();
  }, []);

  /**
   * Resolve when confirm
   */
  const confirmSearch = (optionSearch: any, typeSearchConditionValue: any, valueSearch: string) => {
    const isSearchBlank = typeSearchConditionValue === ChooseTypeSearch.BLANK_SEARCH;
    const textSearch = valueSearch.trim() === TEXT_EMPTY ? TEXT_EMPTY : valueSearch;
    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {
        fieldId: fieldInfo.fieldId,
        fieldType: fieldInfo.fieldType,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: valueSearch,
        searchType: SearchType.LIKE,
        isSearchBlank: isSearchBlank,
        searchOption: optionSearch
      };
      if (isSearchBlank) {
        setIsSearchOptionIcon(false);
        setResultSearch(translate(fieldSearchMessages.searchBlankPhoneNumber));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.PHONE_NUMBER, conditions);
    }
  }

  /**
   * Set search option when click choose
   */
  const handleSearchOption = (optionSearch: number) => {
    setSearchOption(optionSearch);
    setModalSearchOptionVisible(false);
    confirmSearch(optionSearch, typeSearchConditionConfirm, valueConfirm);
  }
  /**
   * Render search component
   */
  const renderSearch = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={[FieldSearchPhoneNumberStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchPhoneNumberStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} />
          <Image style={FieldSearchPhoneNumberStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchPhoneNumberStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchPhoneNumberStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchPhoneNumberStyles.labelSearch}>{translate(fieldSearchMessages.searchDetailPhoneNumber)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchPhoneNumberStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchPhoneNumberStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchPhoneNumberStyles.modalOption} onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}>
              <Text style={FieldSearchPhoneNumberStyles.labelSearch}>{translate(fieldSearchMessages.searchBlankPhoneNumber)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchPhoneNumberStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchPhoneNumberStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchPhoneNumberStyles.modalButton} onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchPhoneNumberStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
    );
  }
  /**
   * Render option search component
   */
  const renderOptionSearch = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSearchOptionVisible}
      >
        <View style={FieldSearchPhoneNumberStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchPhoneNumberStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} />
          <Image style={FieldSearchPhoneNumberStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchPhoneNumberStyles.modalContent}>
            <View style={FieldSearchPhoneNumberStyles.fieldSearchOption}>
              <Text style={FieldSearchPhoneNumberStyles.fieldName}>{translate(fieldSearchMessages.optionSearchPhoneNumber)}</Text>
              <View style={FieldSearchPhoneNumberStyles.borderOption}>
                <TouchableOpacity style={FieldSearchPhoneNumberStyles.modalOption} onPress={() => handleSearchOption(SearchOption.OR)}>
                  <Text style={FieldSearchPhoneNumberStyles.labelOption}>{translate(fieldSearchMessages.searchORPhoneNumber)}</Text>
                  {searchOption === SearchOption.OR &&
                    <Image style={FieldSearchPhoneNumberStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchPhoneNumberStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchPhoneNumberStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.AND)}
                >
                  <Text style={FieldSearchPhoneNumberStyles.labelOption}>{translate(fieldSearchMessages.searchANDPhoneNumber)}</Text>
                  {searchOption === SearchOption.AND &&
                    <Image style={FieldSearchPhoneNumberStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchPhoneNumberStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchPhoneNumberStyles.modalOption} onPress={() => handleSearchOption(SearchOption.WORD)}>
                  <Text style={FieldSearchPhoneNumberStyles.labelOption}>{translate(fieldSearchMessages.searchByStringPhoneNumber)}</Text>
                  {searchOption === SearchOption.WORD &&
                    <Image style={FieldSearchPhoneNumberStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    );
  }
  /**
   * Render search detail component 
   */
  const renderSearchDetail = () => {
    return (
      <View>
        <TextInput
          style={[FieldSearchPhoneNumberStyles.inputPhoneNumberSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.placeholderSearchPhoneNumberOption)}
          placeholderTextColor="#999999"
          onChangeText={(text) => setValue(text)}
          value={value}
          onFocus={() => setKeyBoard(true)}
          onEndEditing={() => setKeyBoard(false)}
        />
      </View>
    );
  }
  /**
   * Render the phone number component in add-edit case
   */
  const renderSearchPhoneNumber = () => {

    return (
      <View>
        <View style={FieldSearchPhoneNumberStyles.title}>
          <Text style={FieldSearchPhoneNumberStyles.textTitle}>{title}</Text>
          {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchPhoneNumberStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          {
            resultSearch === TEXT_EMPTY
              ? <Text style={FieldSearchPhoneNumberStyles.placeholderSearchPhoneNumber}>
                {translate(fieldSearchMessages.placeholderSearchPhoneNumber)}
              </Text>
              : <Text>{resultSearch}</Text>
          }
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchPhoneNumber();
}
