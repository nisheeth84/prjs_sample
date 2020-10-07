import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import {
  ChooseTypeSearch,
  DefineFieldType,
  SearchOption,
  SearchType,
} from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchEmailStyles } from './field-search-styles';
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

// Define value props of FieldSearchEmail component
type IFieldSearchEmailProps = IDynamicFieldProps;

/**
 * Component for searching email fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchEmail(props: IFieldSearchEmailProps) {
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
        fieldType: DefineFieldType.EMAIL,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.EMAIL, conditions);
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
        searchType: SearchType.LIKE,
        isSearchBlank: isSearchBlank,
        searchOption: optionSearch
      };
      if (isSearchBlank) {
        setIsSearchOptionIcon(false);
        setResultSearch(translate(fieldSearchMessages.searchBlankEmail));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.EMAIL, conditions);
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
        <View style={[FieldSearchEmailStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchEmailStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} />
          <Image style={FieldSearchEmailStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchEmailStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchEmailStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchEmailStyles.labelSearch}>{translate(fieldSearchMessages.searchDetailEmail)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchEmailStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchEmailStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchEmailStyles.modalOption} onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}>
              <Text style={FieldSearchEmailStyles.labelSearch}>{translate(fieldSearchMessages.searchBlankEmail)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchEmailStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchEmailStyles.modalDivider} />

            <TouchableOpacity style={FieldSearchEmailStyles.modalButton} onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchEmailStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
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
        <View style={FieldSearchEmailStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchEmailStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} />
          <Image style={FieldSearchEmailStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchEmailStyles.modalContent}>
            <View style={FieldSearchEmailStyles.fieldSearchOption}>
              <Text style={FieldSearchEmailStyles.fieldName}>{translate(fieldSearchMessages.optionSearchEmail)}</Text>
              <View style={FieldSearchEmailStyles.borderOption}>
                <TouchableOpacity style={FieldSearchEmailStyles.modalOption} onPress={() => handleSearchOption(SearchOption.OR)}>
                  <Text style={FieldSearchEmailStyles.labelOption}>{translate(fieldSearchMessages.searchOREmail)}</Text>
                  {searchOption === SearchOption.OR &&
                    <Image style={FieldSearchEmailStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchEmailStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchEmailStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.AND)}
                >
                  <Text style={FieldSearchEmailStyles.labelOption}>{translate(fieldSearchMessages.searchANDEmail)}</Text>
                  {searchOption === SearchOption.AND &&
                    <Image style={FieldSearchEmailStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchEmailStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchEmailStyles.modalOption} onPress={() => handleSearchOption(SearchOption.WORD)}>
                  <Text style={FieldSearchEmailStyles.labelOption}>{translate(fieldSearchMessages.searchByStringEmail)}</Text>
                  {searchOption === SearchOption.WORD &&
                    <Image style={FieldSearchEmailStyles.iconSelected} source={selectedIcon} />
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
          style={[FieldSearchEmailStyles.inputEmailSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.placeholderSearchEmailOption)}
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
   * Render the email component in add-edit case
   */
  const renderSearchEmail = () => {

    return (
      <View>
        <View style={FieldSearchEmailStyles.titleView}>
          <Text style={FieldSearchEmailStyles.title}>{title}</Text>
          {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchEmailStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          {
            resultSearch === TEXT_EMPTY
              ? <Text style={FieldSearchEmailStyles.placeholderSearchEmail}>
                {translate(fieldSearchMessages.placeholderSearchEmail)}
              </Text>
              : <Text style={typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && FieldSearchEmailStyles.textDefaultColor}>
                {resultSearch}
              </Text>
          }
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchEmail();
}
