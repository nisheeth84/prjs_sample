import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import {
  ChooseTypeSearch,
  DefineFieldType,
  SearchOption,
  SearchType
} from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchAddressStyles } from './field-search-styles';
import { fieldSearchMessages, messages } from './field-search-messages';
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
// Define value props of FieldSearchAddress component
type IFieldSearchAddressProps = IDynamicFieldProps;

/**
 * Component for searching address fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchAddress(props: IFieldSearchAddressProps) {
  const { fieldInfo, languageCode } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const optionSearchIcon = require("../../../../../../assets/icons/search_option.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const [value, setValue] = useState(TEXT_EMPTY);
  const [valueConfirm, setValueConfirm] = useState(TEXT_EMPTY);
  const [resultSearch, setResultSearch] = useState(value);
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
        fieldType: DefineFieldType.ADDRESS,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.ADDRESS, conditions);
    }
  };

  /**
   * Handling after first render
   */
  useEffect(() => {
    initialize();
  }, []);


	/**
	 * Resolve when click button confirm
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
        fieldValue: textSearch,
        isSearchBlank: isSearchBlank,
        searchType: SearchType.LIKE,
        searchOption: optionSearch
      };
      if (isSearchBlank) {
        setIsSearchOptionIcon(false);
        setResultSearch(translate(fieldSearchMessages.searchBlankAddress));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.ADDRESS, conditions);
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
	 * Render search address component
	 */
  const renderSearch = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={[FieldSearchAddressStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchAddressStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} >
            <View>
              <Image style={FieldSearchAddressStyles.modalIcon} source={modalIcon} />
            </View>
          </TouchableOpacity>
          <View style={FieldSearchAddressStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchAddressStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchAddressStyles.labelSearch}>{translate(fieldSearchMessages.searchDetailAddress)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchAddressStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchAddressStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchAddressStyles.modalOption} onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}>
              <Text style={FieldSearchAddressStyles.labelSearch}>{translate(fieldSearchMessages.searchBlankAddress)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchAddressStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchAddressStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchAddressStyles.modalButton} onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchAddressStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
    );
  }
	/**
	 * Render option search address component
	 */
  const renderOptionSearch = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalSearchOptionVisible}
      >
        <View style={FieldSearchAddressStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchAddressStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} >
            <View>
              <Image style={FieldSearchAddressStyles.modalIcon} source={modalIcon} />
            </View>
          </TouchableOpacity>
          <View style={FieldSearchAddressStyles.modalContent}>
            <View style={FieldSearchAddressStyles.fieldSearchOption}>
              <Text style={FieldSearchAddressStyles.fieldName}>{translate(fieldSearchMessages.optionSearchAddress)}</Text>
              <View style={FieldSearchAddressStyles.borderOption}>
                <TouchableOpacity style={FieldSearchAddressStyles.modalOption} onPress={() => handleSearchOption(SearchOption.OR)}>
                  <Text style={FieldSearchAddressStyles.labelOption}>{translate(fieldSearchMessages.searchORAddress)}</Text>
                  {searchOption === SearchOption.OR &&
                    <Image style={FieldSearchAddressStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchAddressStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchAddressStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.AND)}
                >
                  <Text style={FieldSearchAddressStyles.labelOption}>{translate(fieldSearchMessages.searchANDAddress)}</Text>
                  {searchOption === SearchOption.AND &&
                    <Image style={FieldSearchAddressStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchAddressStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchAddressStyles.modalOption} onPress={() => handleSearchOption(SearchOption.WORD)}>
                  <Text style={FieldSearchAddressStyles.labelOption}>{translate(fieldSearchMessages.searchByStringAddress)}</Text>
                  {searchOption === SearchOption.WORD &&
                    <Image style={FieldSearchAddressStyles.iconSelected} source={selectedIcon} />
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
          style={[FieldSearchAddressStyles.inputTextSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.placeholderSearchDetailAddress)}
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
   * Render the address component in search case
   */
  const renderSearchAddress = () => {

    return (
      <View>

        <View style={FieldSearchAddressStyles.titleView}>
          <Text style={FieldSearchAddressStyles.title}>{title}</Text>
          {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchAddressStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          <Text style={resultSearch.length > 0 ? FieldSearchAddressStyles.textColor : FieldSearchAddressStyles.placeholderColor}>
            {resultSearch.length > 0 ? resultSearch : translate(messages.placeholderSearchAddress)}</Text>
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchAddress();
}

