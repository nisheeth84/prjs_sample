import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchFileStyles } from './field-search-styles';
import { fieldSearchMessages } from './field-search-messages';
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

// Define value props of FieldSearchFile component
type IFieldSearchFileProps = IDynamicFieldProps;

/**
 * Component for searching file fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchFile(props: IFieldSearchFileProps) {
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
        fieldType: DefineFieldType.TEXT,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.FILE, conditions);
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
        setResultSearch(translate(fieldSearchMessages.searchBlankFile));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.FILE, conditions);
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
        <View style={[FieldSearchFileStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchFileStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} />
          <Image style={FieldSearchFileStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchFileStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchFileStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchFileStyles.labelSearch}>{translate(fieldSearchMessages.searchDetailFile)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchFileStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchFileStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchFileStyles.modalOption} onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}>
              <Text style={FieldSearchFileStyles.labelSearch}>{translate(fieldSearchMessages.searchBlankFile)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchFileStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchFileStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchFileStyles.modalButton}
              onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchFileStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirmFile)}</Text>
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
        <View style={FieldSearchFileStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchFileStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} />
          <Image style={FieldSearchFileStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchFileStyles.modalContent}>
            <View style={FieldSearchFileStyles.fieldSearchOption}>
              <Text style={FieldSearchFileStyles.fieldName}>{translate(fieldSearchMessages.optionSearchFile)}</Text>
              <View style={FieldSearchFileStyles.borderOption}>
                <TouchableOpacity style={FieldSearchFileStyles.modalOption} onPress={() => handleSearchOption(SearchOption.OR)}>
                  <Text style={FieldSearchFileStyles.labelOption}>{translate(fieldSearchMessages.searchORFile)}</Text>
                  {searchOption === SearchOption.OR &&
                    <Image style={FieldSearchFileStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchFileStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchFileStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.AND)}
                >
                  <Text style={FieldSearchFileStyles.labelOption}>{translate(fieldSearchMessages.searchANDFile)}</Text>
                  {searchOption === SearchOption.AND &&
                    <Image style={FieldSearchFileStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchFileStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchFileStyles.modalOption} onPress={() => handleSearchOption(SearchOption.WORD)}>
                  <Text style={FieldSearchFileStyles.labelOption}>{translate(fieldSearchMessages.searchByStringFile)}</Text>
                  {searchOption === SearchOption.WORD &&
                    <Image style={FieldSearchFileStyles.iconSelected} source={selectedIcon} />
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
          style={[FieldSearchFileStyles.inputFileSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.placeholderSearchFileOption)}
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
   * Render the text component in add-edit case
   */
  const renderSearchFile = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          <View style={FieldSearchFileStyles.title}>
            <Text style={FieldSearchFileStyles.labelTitle}>{title}</Text>
            {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchFileStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
          </View>
          {
            resultSearch === TEXT_EMPTY
              ? <Text style={FieldSearchFileStyles.placeholderSearchFile}>{translate(fieldSearchMessages.placeholderSearchFile)}</Text>
              : <Text style={ChooseTypeSearch.BLANK_SEARCH === typeSearchCondition ? {} : FieldSearchFileStyles.resultSearch}>{resultSearch}</Text>
          }
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchFile();
}

