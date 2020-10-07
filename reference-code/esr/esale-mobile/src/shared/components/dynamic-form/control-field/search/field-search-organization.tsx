import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTypeSearch, DefineFieldType, SearchOption, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchOrganizationStyles } from './field-search-styles';
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

// Define value props of FieldSearchOrganization component
type IFieldSearchOrganizationProps = IDynamicFieldProps;

/**
 * Component for searching organization fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchOrganization(props: IFieldSearchOrganizationProps) {
  const { fieldInfo, languageCode } = props;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const optionSearchIcon = require("../../../../../../assets/icons/search_option.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  // State value text search show in modal
  const [value, setValue] = useState(TEXT_EMPTY);
  // State value text search show after click confirm
  const [resultSearch, setResultSearch] = useState(value);
  const [typeSearchCondition, setTypeSearchCondition] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  //State show icon search option
  const [isSearchOptionIcon, setIsSearchOptionIcon] = useState(true);
  const [searchOption, setSearchOption] = useState(SearchOption.OR);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSearchOptionVisible, setModalSearchOptionVisible] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  //State value of type search when save
  const [typeSearchConditionConfirm, setTypeSearchConditionConfirm] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  const [keyBoard, setKeyBoard] = useState(false);
  // State value of text search when save
  const [valueConfirm, setValueConfirm] = useState(TEXT_EMPTY);
	/**
	 * Set value of props updateStateElement
	 */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {
        fieldId: fieldInfo.fieldId,
        fieldType: DefineFieldType.SELECT_ORGANIZATION,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.SELECT_ORGANIZATION, conditions);
    }
  };

  /**
   * Handling after first render
   */
  useEffect(() => {
    initialize();
  }, []);

	/**
	 * Resolve when click confirm
	 */
  const confirmSearch = (optionSearch: any, typeSearchConditionValue: any, valueSearch: string) => {
    setDisableConfirm(true)
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
        setResultSearch(translate(fieldSearchMessages.common_119908_16_searchBlankOrganization));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.SELECT_ORGANIZATION, conditions);
      setDisableConfirm(false)
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
        <View style={[FieldSearchOrganizationStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchOrganizationStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} />
            <Image style={FieldSearchOrganizationStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchOrganizationStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchOrganizationStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchOrganizationStyles.labelSearch}>{translate(fieldSearchMessages.common_119908_16_searchDetailOrganization)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchOrganizationStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchOrganizationStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchOrganizationStyles.modalOption} onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}>
              <Text style={FieldSearchOrganizationStyles.labelSearch}>{translate(fieldSearchMessages.common_119908_16_searchBlankOrganization)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchOrganizationStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchOrganizationStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchOrganizationStyles.modalButton} disabled={disableConfirm}
              onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchOrganizationStyles.textButton}>{translate(fieldSearchMessages.common_119908_16_searchConditionsConfirm)}</Text>
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
        <View style={FieldSearchOrganizationStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchOrganizationStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} />
            <Image style={FieldSearchOrganizationStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchOrganizationStyles.fieldSearchOption}>
            <Text style={FieldSearchOrganizationStyles.fieldName}>{translate(fieldSearchMessages.common_119908_16_optionSearchOrganization)}</Text>
            <View style={FieldSearchOrganizationStyles.borderOption}>
              <TouchableOpacity style={FieldSearchOrganizationStyles.modalOption} onPress={() => handleSearchOption(SearchOption.OR)}>
                <Text style={FieldSearchOrganizationStyles.labelOption}>{translate(fieldSearchMessages.common_119908_16_searchOROrganization)}</Text>
                {searchOption === SearchOption.OR &&
                  <Image style={FieldSearchOrganizationStyles.iconSelected} source={selectedIcon} />
                }
              </TouchableOpacity>
              <View style={FieldSearchOrganizationStyles.modalDivider} />
              <TouchableOpacity
                style={FieldSearchOrganizationStyles.modalOption}
                onPress={() => handleSearchOption(SearchOption.AND)}
              >
                <Text style={FieldSearchOrganizationStyles.labelOption}>{translate(fieldSearchMessages.common_119908_16_searchANDOrganization)}</Text>
                {searchOption === SearchOption.AND &&
                  <Image style={FieldSearchOrganizationStyles.iconSelected} source={selectedIcon} />
                }
              </TouchableOpacity>
              <View style={FieldSearchOrganizationStyles.modalDivider} />
              <TouchableOpacity style={FieldSearchOrganizationStyles.modalOption} onPress={() => handleSearchOption(SearchOption.WORD)}>
                <Text style={FieldSearchOrganizationStyles.labelOption}>{translate(fieldSearchMessages.common_119908_16_searchByStringOrganization)}</Text>
                {searchOption === SearchOption.WORD &&
                  <Image style={FieldSearchOrganizationStyles.iconSelected} source={selectedIcon} />
                }
              </TouchableOpacity>
            </View>
          </View>
          <View style={FieldSearchOrganizationStyles.modalDivider} />
        </View>
      </Modal >
    );
  }
  /**
   * Render search detail component 
   */
  const renderSearchDetail = () => {
    return (
      <View>
        <TextInput
          style={[FieldSearchOrganizationStyles.inputOrganizationSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.common_119908_16_placeholderSearchOrganizationOption)}
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
   * Render the organization component in add-edit case
   */
  const renderSearchOrganization = () => {
    return (
      <View>
        <View style={FieldSearchOrganizationStyles.title}>
          <Text style={FieldSearchOrganizationStyles.textDefault}>{title}</Text>
          {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchOrganizationStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          {
            resultSearch === TEXT_EMPTY
              ? <Text style={FieldSearchOrganizationStyles.placeholderSearchOrganization}>
                {translate(fieldSearchMessages.common_119908_16_placeholderSearchOrganization)}
              </Text>
              : <Text style={ChooseTypeSearch.BLANK_SEARCH === typeSearchCondition ? {} : FieldSearchOrganizationStyles.resultSearch}>{resultSearch}</Text>
          }
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchOrganization();
}
