import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import {
  ChooseTypeSearch,
  DefineFieldType,
  SearchOption,
  SearchType,
} from '../../../../../config/constants/enum';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchLinkStyles } from './field-search-styles';
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

// Define value props of FieldSearchLink component
type IFieldSearchLinkProps = IDynamicFieldProps;

/**
 * Component for searching link fields
 * @param props see IDynamicFieldProps
 */
export function FieldSearchLink(props: IFieldSearchLinkProps) {
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
  const [keyBoard, setKeyBoard] = useState(false);
  const [modalSearchOptionVisible, setModalSearchOptionVisible] = useState(false);
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  /**
   * Set value of props updateStateElement
   */
  const initialize = () => {
    if (props.updateStateElement && !props.isDisabled) {
      const conditions = {
        fieldId: fieldInfo.fieldId,
        fieldType: DefineFieldType.LINK,
        isDefault: fieldInfo.isDefault ? fieldInfo.isDefault : false,
        fieldName: fieldInfo.fieldName,
        fieldValue: value,
        isSearchBlank: typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH,
        searchType: SearchType.LIKE,
        searchOption: searchOption
      };
      props.updateStateElement(fieldInfo, DefineFieldType.LINK, conditions);
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
        fieldValue: textSearch,
        isSearchBlank: isSearchBlank,
        searchType: SearchType.LIKE,
        searchOption: optionSearch
      };
      if (isSearchBlank) {
        setIsSearchOptionIcon(false);
        setResultSearch(translate(fieldSearchMessages.searchBlankLink));
      } else {
        setIsSearchOptionIcon(true);
        setValue(textSearch);
        setResultSearch(textSearch);
      }
      setValueConfirm(textSearch);
      setTypeSearchCondition(typeSearchConditionValue);
      setTypeSearchConditionConfirm(typeSearchConditionValue)
      props.updateStateElement(fieldInfo, DefineFieldType.LINK, conditions);
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
        <View style={[FieldSearchLinkStyles.modalContainer, { paddingBottom: (Platform.OS === "ios" && keyBoard) ? "70%" : 0 }]}>
          <TouchableOpacity
            style={[typeSearchCondition !== ChooseTypeSearch.BLANK_SEARCH ? keyBoard ? { flex: 1 } : { flex: 3 }
              : FieldSearchLinkStyles.modalHeaderChooseBlank,
            ]}
            onPress={() => {
              setModalVisible(!modalVisible)
            }} />
          <Image style={FieldSearchLinkStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchLinkStyles.modalContent}>
            <TouchableOpacity
              style={FieldSearchLinkStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.DETAIL_SEARCH)}
            >
              <Text style={FieldSearchLinkStyles.labelSearch}>{translate(fieldSearchMessages.searchDetailLink)}</Text>
              {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH &&
                <Image style={FieldSearchLinkStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            {typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && renderSearchDetail()}
            <View style={FieldSearchLinkStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchLinkStyles.modalOption}
              onPress={() => setTypeSearchCondition(ChooseTypeSearch.BLANK_SEARCH)}
            >
              <Text style={FieldSearchLinkStyles.labelSearch}>{translate(fieldSearchMessages.searchBlankLink)}</Text>
              {typeSearchCondition === ChooseTypeSearch.BLANK_SEARCH &&
                <Image style={FieldSearchLinkStyles.iconSelected} source={selectedIcon} />
              }
            </TouchableOpacity>
            <View style={FieldSearchLinkStyles.modalDivider} />
            <TouchableOpacity style={FieldSearchLinkStyles.modalButton}
              onPress={() => { setModalVisible(false); confirmSearch(searchOption, typeSearchCondition, value); }}>
              <Text style={FieldSearchLinkStyles.textButton}>{translate(fieldSearchMessages.searchConditionsConfirm)}</Text>
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
        <View style={FieldSearchLinkStyles.modalContainer}>
          <TouchableOpacity
            style={FieldSearchLinkStyles.modalHeaderOptionSearch}
            onPress={() => {
              setModalSearchOptionVisible(!modalSearchOptionVisible)
            }} />
          <Image style={FieldSearchLinkStyles.modalIcon} source={modalIcon} />
          <View style={FieldSearchLinkStyles.modalContent}>
            <View style={FieldSearchLinkStyles.fieldSearchOption}>
              <Text style={FieldSearchLinkStyles.fieldName}>{translate(fieldSearchMessages.optionSearchLink)}</Text>
              <View style={FieldSearchLinkStyles.borderOption}>
                <TouchableOpacity style={FieldSearchLinkStyles.modalOption} onPress={() => handleSearchOption(SearchOption.OR)}>
                  <Text style={FieldSearchLinkStyles.labelOption}>{translate(fieldSearchMessages.searchORLink)}</Text>
                  {searchOption === SearchOption.OR &&
                    <Image style={FieldSearchLinkStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchLinkStyles.modalDivider} />
                <TouchableOpacity
                  style={FieldSearchLinkStyles.modalOption}
                  onPress={() => handleSearchOption(SearchOption.AND)}
                >
                  <Text style={FieldSearchLinkStyles.labelOption}>{translate(fieldSearchMessages.searchANDLink)}</Text>
                  {searchOption === SearchOption.AND &&
                    <Image style={FieldSearchLinkStyles.iconSelected} source={selectedIcon} />
                  }
                </TouchableOpacity>
                <View style={FieldSearchLinkStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchLinkStyles.modalOption} onPress={() => handleSearchOption(SearchOption.WORD)}>
                  <Text style={FieldSearchLinkStyles.labelOption}>{translate(fieldSearchMessages.searchByStringLink)}</Text>
                  {searchOption === SearchOption.WORD &&
                    <Image style={FieldSearchLinkStyles.iconSelected} source={selectedIcon} />
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
          style={[FieldSearchLinkStyles.inputLinkSearch, Platform.OS === 'ios' ? { padding: 8 } : { paddingLeft: 10 }]}
          placeholder={translate(fieldSearchMessages.placeholderSearchLinkOption)}
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
   * Render the link component in add-edit case
   */
  const renderSearchLink = () => {

    return (
      <View>
        <View style={FieldSearchLinkStyles.titleView}>
          <Text style={FieldSearchLinkStyles.title}>{title}</Text>
          {isSearchOptionIcon &&
            <TouchableOpacity
              onPress={() => setModalSearchOptionVisible(true)}>
              <Image style={FieldSearchLinkStyles.iconSearchOption} source={optionSearchIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity onPress={() => { setModalVisible(true); }}>
          {
            resultSearch === TEXT_EMPTY
              ? <Text style={FieldSearchLinkStyles.placeholderSearchLink}>
                {translate(fieldSearchMessages.placeholderSearchLink)}
              </Text>
              : <Text style={typeSearchCondition === ChooseTypeSearch.DETAIL_SEARCH && FieldSearchLinkStyles.textDefaultColor}>
                {resultSearch}
              </Text>
          }
        </TouchableOpacity>
        {renderSearch()}
        {renderOptionSearch()}
      </View>
    );
  }
  return renderSearchLink();
}
