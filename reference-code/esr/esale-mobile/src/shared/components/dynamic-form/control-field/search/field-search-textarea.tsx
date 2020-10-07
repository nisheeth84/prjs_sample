import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTypeSearch, DefineFieldType, SearchOption, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchTextareaStyles } from './field-search-styles';
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

// Define value props of FieldSearchTextarea component
type IFieldSearchTextareaProps = IDynamicFieldProps;

/**
 * Component for searching textarea fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchTextarea(props: IFieldSearchTextareaProps) {
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
        fieldType: DefineFieldType.TEXTAREA,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.TEXTAREA, conditions);
    }
  };

  /**
   * Handling after first render
   */
  useEffect(() => {
    initialize();
  }, [])

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
        fieldValue: textSearch,
        isSearchBlank: isSearchBlank,
        searchType: SearchType.LIKE,
        searchOption: optionSearch
      };
      if (isSearchBlank) {
        setIsSearchOptionIcon(false);
        setResultSearch(translate(fieldSearchMessages.searchBlankTextarea));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.TEXTAREA, conditions);
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
        <View style={[FieldSearchTextareaStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchTextareaStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} />
          <Image style={FieldSearchTextareaStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchTextareaStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchTextareaStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchTextareaStyles.labelSearch}>{translate(fieldSearchMessages.searchDetailTextarea)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchTextareaStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchTextareaStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchTextareaStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}
            >
              <Text style={FieldSearchTextareaStyles.labelSearch}>{translate(fieldSearchMessages.searchBlankTextarea)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchTextareaStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchTextareaStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchTextareaStyles.modalButton}
              onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchTextareaStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
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
        <View style={FieldSearchTextareaStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchTextareaStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} />
          <Image style={FieldSearchTextareaStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchTextareaStyles.modalContent}>
            <View style={FieldSearchTextareaStyles.fieldSearchOption}>
              <Text style={FieldSearchTextareaStyles.fieldName}>{translate(fieldSearchMessages.optionSearchTextarea)}</Text>
              <View style={FieldSearchTextareaStyles.borderOption}>
                <TouchableOpacity style={FieldSearchTextareaStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.OR)}>
                  <Text style={FieldSearchTextareaStyles.labelOption}>{translate(fieldSearchMessages.searchORTextarea)}</Text>
                  {searchOption === SearchOption.OR &&
                    <Image style={FieldSearchTextareaStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchTextareaStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchTextareaStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.AND)}
                >
                  <Text style={FieldSearchTextareaStyles.labelOption}>{translate(fieldSearchMessages.searchANDTextarea)}</Text>
                  {searchOption === SearchOption.AND &&
                    <Image style={FieldSearchTextareaStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchTextareaStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchTextareaStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.WORD)}>
                  <Text style={FieldSearchTextareaStyles.labelOption}>{translate(fieldSearchMessages.searchByStringTextarea)}</Text>
                  {searchOption === SearchOption.WORD &&
                    <Image style={FieldSearchTextareaStyles.iconSelected} source={selectedIcon} />
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
          style={[FieldSearchTextareaStyles.inputTextareaSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.placeholderSearchTextareaOption)}
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
   * Render the textarea component in search case
   */
  const renderSearchTextarea = () => {

    return (
      <View>

        <View style={FieldSearchTextareaStyles.titleView}>
          <Text style={FieldSearchTextareaStyles.title}>{title}</Text>
          {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchTextareaStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          {
            resultSearch === TEXT_EMPTY
              ? <Text style={FieldSearchTextareaStyles.placeholderSearchTextarea}>
                {translate(fieldSearchMessages.placeholderSearchTextarea)}
              </Text>
              : <Text style={typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && FieldSearchTextareaStyles.textDefaultColor}>
                {resultSearch}
              </Text>
          }
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchTextarea();
}
