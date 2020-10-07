import _ from 'lodash';
import EntityUtils from '../../../../util/entity-utils';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTypeSearch, SearchOption, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldSearchCheckboxStyles } from './field-search-styles';
import { fieldSearchMessages } from './field-search-messages';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from '../../../../../config/i18n';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// define type of FieldSearchCheckbox's props
type IFieldSearchCheckboxProps = IDynamicFieldProps;

/**
 * Component search checkbox form
 * @param props see IDynamicFieldProps
 */
export function FieldSearchCheckbox(props: IFieldSearchCheckboxProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalOptionSearchVisible, setModalOptionSearchVisible] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<any[]>([]);
  const [searchConditions, setSearchConditions] = useState(TEXT_EMPTY);
  const { fieldInfo, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const unSelectedIcon = require("../../../../../../assets/icons/unchecked.png");
  const searchOptionIcon = require("../../../../../../assets/icons/search_option.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);
  const [typeSearch, setTypeSearch] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  const [isOpenSearchDetail, setIsOpenSearchDetail] = useState(false);
  const [optionSearch, setOptionSearch] = useState(SearchOption.AND);
  const [isShowIconSearchOption, setIsShowIconSearchOption] = useState(true);
  const [isSearchOptionNOT, setIsSearchOptionNOT] = useState(false);
  const [sortedFieldItems, setSortedFieldItems] = useState([]);

  useEffect(() => {
    if (fieldInfo?.fieldItems?.length > 0) {
      let fieldItems = _.cloneDeep(fieldInfo.fieldItems)
      setSortedFieldItems(fieldItems.sort((a: any, b: any) => (a.itemOrder > b.itemOrder) ? 1 : -1))
    }
  }, [])

  /**
   * handle select item
   * @param item 
   */
  const handleSelectItem = (item: any) => {
    const selectedIndex = selectedItemIds.indexOf(item.itemId);
    if (selectedIndex >= 0) {
      selectedItemIds.splice(selectedIndex, 1);
    } else {
      selectedItemIds.push(item.itemId);
    }
    setSelectedItemIds(EntityUtils.clone(selectedItemIds));
  }
  /**
   * Handle select all items
   */
  const handleSelectAllItem = () => {
    const allItemIds = fieldInfo.fieldItems.map((item: any) => {
      return item.itemId;
    });
    setSelectedItemIds(allItemIds);
  }
  /**
   * Handle delete select all items
   */
  const handleDeselectAllItem = () => {
    setSelectedItemIds([]);
  }
  /**
   * Handle select inverse all items
   */
  const handleSelectInverseAllItem = () => {
    let allItemIds: any[] = [];
    fieldInfo.fieldItems.forEach((item: any) => {
      if (selectedItemIds.indexOf(item.itemId) < 0) {
        allItemIds.push(item.itemId);
      }
    });
    setSelectedItemIds(allItemIds);
  }

  /**
   * resolve when click button confirm
   * @param text 
   */
  const handleSetSearchCondition = () => {
    const isSearchBlank = (typeSearch === ChooseTypeSearch.BLANK_SEARCH);
    if (props.updateStateElement && !props.isDisabled) {
      const fieldValue = EntityUtils.clone(selectedItemIds);
      const conditions: any = {};
      conditions["fieldId"] = fieldInfo.fieldId;
      conditions["fieldType"] = fieldInfo.fieldType;
      conditions["isDefault"] = fieldInfo.isDefault;
      conditions["fieldName"] = fieldInfo.fieldName;
      conditions["isSearchBlank"] = isSearchBlank;
      conditions["fieldValue"] = fieldValue;
      conditions["searchType"] = SearchType.LIKE;
      if (isSearchOptionNOT && optionSearch === SearchOption.OR) {
        conditions['searchOption'] = SearchOption.NOT_OR;
      } else if (isSearchOptionNOT && optionSearch === SearchOption.AND) {
        conditions['searchOption'] = SearchOption.NOT_AND;
      } else {
        conditions['searchOption'] = optionSearch;
      }
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions);
    }
    if (isSearchBlank) {
      setSearchConditions(translate(fieldSearchMessages.blankSearchCheckbox));
      setIsShowIconSearchOption(false);
    } else {
      let conditions = TEXT_EMPTY;
      selectedItemIds.forEach(item => {
        const fieldLabel = `${StringUtils.getFieldLabel(fieldInfo.fieldItems.find((i: any) => i.itemId === item), ITEM_LABEL, language)}`;
        if (conditions === TEXT_EMPTY) {
          conditions = `${conditions}${fieldLabel}`;
        } else {
          conditions = `${conditions}, ${fieldLabel}`;
        }
      });
      setSearchConditions(conditions);
      setIsShowIconSearchOption(true);
    }
    setModalOptionSearchVisible(false);
    setModalVisible(false);
  }

  /**
   * Set conditions
   */
  const initialize = () => {
    if (props?.elementStatus?.isSearchBlank && props.elementStatus.isSearchBlank) {
      setTypeSearch(ChooseTypeSearch.BLANK_SEARCH);
    }
  };
  /**
   * Handle when render first time
   */
  useEffect(() => {
    initialize();
  }, [])

  /**
   * Render search condition component
   */
  const renderSearchCondition = () => {
    return (
      <View style={FieldSearchCheckboxStyles.modalContent}>
        <TouchableOpacity style={FieldSearchCheckboxStyles.modalOption} onPress={() => { setTypeSearch(ChooseTypeSearch.BLANK_SEARCH) }}>
          <Text style={FieldSearchCheckboxStyles.modalOptionSearchType}>{translate(fieldSearchMessages.blankSearchCheckbox)}</Text>
          {typeSearch === ChooseTypeSearch.BLANK_SEARCH && (
            <Image style={FieldSearchCheckboxStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchCheckboxStyles.modalDivider} />
        <TouchableOpacity style={FieldSearchCheckboxStyles.modalOption} onPress={() => { setIsOpenSearchDetail(true); setTypeSearch(ChooseTypeSearch.DETAIL_SEARCH) }}>
          <Text style={FieldSearchCheckboxStyles.modalOptionSearchType}>{translate(fieldSearchMessages.conditionalSearchCheckbox)}</Text>
          {typeSearch === ChooseTypeSearch.DETAIL_SEARCH && (
            <Image style={FieldSearchCheckboxStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchCheckboxStyles.modalDivider} />
        {typeSearch === ChooseTypeSearch.NOT_CHOOSE
          ? <TouchableOpacity style={[FieldSearchCheckboxStyles.modalButton, FieldSearchCheckboxStyles.btnDisable]} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchCheckboxStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmCheckboxSearch)}</Text>
          </TouchableOpacity>
          : <TouchableOpacity style={FieldSearchCheckboxStyles.modalButton} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchCheckboxStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmCheckboxSearch)}</Text>
          </TouchableOpacity>
        }

      </View>
    );
  }
  /**
   * Render search detail component
   */
  const renderSearchDetail = () => {
    return (
      <View style={FieldSearchCheckboxStyles.modalContent}>
        <View style={FieldSearchCheckboxStyles.modalListButtonHeader}>
          <View style={FieldSearchCheckboxStyles.modalViewBtnHeader}>
            <TouchableOpacity style={FieldSearchCheckboxStyles.modalBtnHeader}
              onPress={handleSelectAllItem}>
              <Text style={FieldSearchCheckboxStyles.textCenter}>{translate(fieldSearchMessages.selectAllCheckboxSearch)}</Text>
            </TouchableOpacity>
          </View>
          <View style={FieldSearchCheckboxStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity
                style={[FieldSearchCheckboxStyles.modalBtnHeader, FieldSearchCheckboxStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchCheckboxStyles.textCenter, FieldSearchCheckboxStyles.textBtnDisable]}>
                  {translate(fieldSearchMessages.deselectAllCheckboxSearch)}
                </Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchCheckboxStyles.modalBtnHeader}
                onPress={handleDeselectAllItem}
              >
                <Text style={FieldSearchCheckboxStyles.textCenter}>{translate(fieldSearchMessages.deselectAllCheckboxSearch)}</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={FieldSearchCheckboxStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity style={[FieldSearchCheckboxStyles.modalBtnHeader, FieldSearchCheckboxStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchCheckboxStyles.textCenter, FieldSearchCheckboxStyles.textBtnDisable]}>{translate(fieldSearchMessages.selectInverseCheckboxSearch)}</Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchCheckboxStyles.modalBtnHeader}
                onPress={handleSelectInverseAllItem}
              >
                <Text style={FieldSearchCheckboxStyles.textCenter}>{translate(fieldSearchMessages.selectInverseCheckboxSearch)}</Text>
              </TouchableOpacity>
            }

          </View>
        </View>
        <View style={FieldSearchCheckboxStyles.modalDivider} />
        <View style={FieldSearchCheckboxStyles.modalContentSearchDetail}>
          <FlatList
            keyExtractor={item => item.itemId.toString()}
            data={sortedFieldItems}
            renderItem={({ item }: { item: any }) => <View>
              <TouchableOpacity
                style={FieldSearchCheckboxStyles.modalOptionSearchDetail}
                onPress={() => handleSelectItem(item)}>
                <View style={FieldSearchCheckboxStyles.labelOption}>
                  <Text>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                </View>
                <View style={FieldSearchCheckboxStyles.iconCheckView}>
                  {selectedItemIds.includes(item.itemId)
                    ? <Image source={selectedIcon} />
                    : <Image source={unSelectedIcon} />
                  }
                </View>
              </TouchableOpacity>
              <View style={FieldSearchCheckboxStyles.modalDivider} />
            </View>} />
        </View>
        <View style={FieldSearchCheckboxStyles.modalListButtonFooter}>
          <TouchableOpacity style={FieldSearchCheckboxStyles.btnBack}
            onPress={() => {
              setIsOpenSearchDetail(false);
            }}>
            <Text>{translate(fieldSearchMessages.cancelCheckboxSearch)}</Text>
          </TouchableOpacity>
          {selectedItemIds.length === 0
            ? <TouchableOpacity style={[FieldSearchCheckboxStyles.btnConfirm, FieldSearchCheckboxStyles.btnDisable]}
              disabled>
              <Text style={FieldSearchCheckboxStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmCheckboxSearch)}</Text>
            </TouchableOpacity>
            : <TouchableOpacity style={FieldSearchCheckboxStyles.btnConfirm}
              onPress={handleSetSearchCondition}>
              <Text style={FieldSearchCheckboxStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmCheckboxSearch)}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
  /**
   * render search checkbox form
   */
  const renderConponent = () => {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={FieldSearchCheckboxStyles.modalContainer}>
            <TouchableOpacity
              style={FieldSearchCheckboxStyles.modalHeader}
              onPress={() => setModalVisible(false)}
            />
            <Image style={FieldSearchCheckboxStyles.modalIcon} source={modalIcon} />
            {!isOpenSearchDetail
              ? renderSearchCondition()
              : renderSearchDetail()
            }
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalOptionSearchVisible}
          onRequestClose={() => setModalOptionSearchVisible(false)}
        >
          <View style={FieldSearchCheckboxStyles.modalContainer}>
            <TouchableOpacity
              style={FieldSearchCheckboxStyles.modalHeader}
              onPress={() => setModalOptionSearchVisible(false)}
            />
            <Image style={FieldSearchCheckboxStyles.modalIcon} source={modalIcon} />
            <View style={FieldSearchCheckboxStyles.modalContenOptionSearch}>
              <View style={FieldSearchCheckboxStyles.modalOptionSearchType} >
                <Text style={FieldSearchCheckboxStyles.blackText}>{translate(fieldSearchMessages.searchMethodPulldown)}</Text>
                <View>
                  <TouchableOpacity style={FieldSearchCheckboxStyles.modalOption} onPress={() => setIsSearchOptionNOT(!isSearchOptionNOT)}>
                    <Text style={FieldSearchCheckboxStyles.titleNOTOptionSearch}>{translate(fieldSearchMessages.searchNOTOption)}</Text>
                    {isSearchOptionNOT
                      ? <Image style={FieldSearchCheckboxStyles.modalOptionIcon} source={selectedIcon} />
                      : <Image style={FieldSearchCheckboxStyles.modalOptionIcon} source={unSelectedIcon} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[FieldSearchCheckboxStyles.modalDivider]} />
              <Text style={[FieldSearchCheckboxStyles.titleModalOptionSearch, FieldSearchCheckboxStyles.modalOptionSearchType]}>{translate(fieldSearchMessages.titleSearchOptionPulldownMulti)}</Text>
              <View style={FieldSearchCheckboxStyles.modalListOptionSearch}>
                <TouchableOpacity style={FieldSearchCheckboxStyles.modalOptionSearch} onPress={() => { setOptionSearch(SearchOption.OR) }}>
                  <Text style={FieldSearchCheckboxStyles.modalSearchOption}>{translate(fieldSearchMessages.searchOROption)}</Text>
                  {optionSearch === SearchOption.OR && (
                    <Image style={FieldSearchCheckboxStyles.modalOptionIcon} source={selectedIcon} />
                  )}
                </TouchableOpacity>
                <View style={FieldSearchCheckboxStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchCheckboxStyles.modalOptionSearch} onPress={() => { setOptionSearch(SearchOption.AND) }}>
                  <Text style={FieldSearchCheckboxStyles.modalSearchOption}>{translate(fieldSearchMessages.searchANDOption)}</Text>
                  {optionSearch === SearchOption.AND && (
                    <Image style={FieldSearchCheckboxStyles.modalOptionIcon} source={selectedIcon} />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={FieldSearchCheckboxStyles.modalButton} onPress={handleSetSearchCondition}>
                <Text style={FieldSearchCheckboxStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmCheckboxSearch)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={FieldSearchCheckboxStyles.titleView}>
          <Text style={FieldSearchCheckboxStyles.title}>{title}</Text>
          {
            isShowIconSearchOption &&
            <TouchableOpacity onPress={() => { setModalOptionSearchVisible(true) }}>
              <Image source={searchOptionIcon} />
            </TouchableOpacity>
          }
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          {
            searchConditions === TEXT_EMPTY
              ? <Text style={FieldSearchCheckboxStyles.placeholderSearchCheckbox}>
                {translate(fieldSearchMessages.searchContentCheckbox)}
              </Text>
              : <Text>{searchConditions}</Text>
          }
        </TouchableOpacity>
      </View>
    );
  }

  return renderConponent();
}