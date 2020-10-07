import _ from 'lodash';
import EntityUtils from '../../../../util/entity-utils';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTypeSearch, SearchOption, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchPulldownMultiStyles } from './field-search-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { translate } from '../../../../../config/i18n';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// define type of FieldSearchPulldownMulti's props
type IFieldSearchPulldownMultiProps = IDynamicFieldProps;

/**
 * Component search pulldown multi form
 * @param props see IDynamicFieldProps
 */
export function FieldSearchPulldownMulti(props: IFieldSearchPulldownMultiProps) {
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
  const searchConditionsValue = `${translate(fieldSearchMessages.searchContentPulldownMulti)}`;
  const [typeSearch, setTypeSearch] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  const [isOpenSearchDetail, setIsOpenSearchDetail] = useState(false);
  const [optionSearch, setOptionSearch] = useState(SearchOption.AND);
  const [isSearchOptionNOT, setIsSearchOptionNOT] = useState(false);
  const [isShowIconSearchOption, setIsShowIconSearchOption] = useState(true);
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
      conditions['fieldId'] = fieldInfo.fieldId;
      conditions['fieldType'] = fieldInfo.fieldType;
      conditions['isDefault'] = fieldInfo.isDefault;
      conditions['fieldName'] = fieldInfo.fieldName;
      conditions['isSearchBlank'] = isSearchBlank;
      conditions['fieldValue'] = fieldValue;
      conditions['searchType'] = SearchType.LIKE;
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
      setSearchConditions(translate(fieldSearchMessages.blankSearchPulldownMulti));
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
  }, []);
  /**
   * Render search conditions component
   */
  const renderSearch = () => {
    return (
      <View style={FieldSearchPulldownMultiStyles.modalContent}>
        <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalOption} onPress={() => { setTypeSearch(ChooseTypeSearch.BLANK_SEARCH) }}>
          <Text style={FieldSearchPulldownMultiStyles.modalOptionSearchType}>{translate(fieldSearchMessages.blankSearchPulldownMulti)}</Text>
          {typeSearch === ChooseTypeSearch.BLANK_SEARCH && (
            <Image style={FieldSearchPulldownMultiStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchPulldownMultiStyles.modalDivider} />
        <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalOption} onPress={() => { setIsOpenSearchDetail(true); setTypeSearch(ChooseTypeSearch.DETAIL_SEARCH) }}>
          <Text style={FieldSearchPulldownMultiStyles.modalOptionSearchType}>{translate(fieldSearchMessages.conditionalSearchPulldownMulti)}</Text>
          {typeSearch === ChooseTypeSearch.DETAIL_SEARCH && (
            <Image style={FieldSearchPulldownMultiStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchPulldownMultiStyles.modalDivider} />
        {typeSearch === ChooseTypeSearch.NOT_CHOOSE
          ? <TouchableOpacity style={[FieldSearchPulldownMultiStyles.modalButton, FieldSearchPulldownMultiStyles.btnDisable]} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchPulldownMultiStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmPulldownMultiSearch)}</Text>
          </TouchableOpacity>
          : <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalButton} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchPulldownMultiStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmPulldownMultiSearch)}</Text>
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
      <View style={FieldSearchPulldownMultiStyles.modalContent}>
        <View style={FieldSearchPulldownMultiStyles.modalListButtonHeader}>
          <View style={FieldSearchPulldownMultiStyles.modalViewBtnHeader}>
            <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalBtnHeader}
              onPress={handleSelectAllItem}>
              <Text style={FieldSearchPulldownMultiStyles.textCenter}>{translate(fieldSearchMessages.selectAllPulldownMultiSearch)}</Text>
            </TouchableOpacity>
          </View>
          <View style={FieldSearchPulldownMultiStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity
                style={[FieldSearchPulldownMultiStyles.modalBtnHeader, FieldSearchPulldownMultiStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchPulldownMultiStyles.textCenter, FieldSearchPulldownMultiStyles.textBtnDisable]}>
                  {translate(fieldSearchMessages.deselectAllPulldownMultiSearch)}
                </Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalBtnHeader}
                onPress={handleDeselectAllItem}
              >
                <Text style={FieldSearchPulldownMultiStyles.textCenter}>{translate(fieldSearchMessages.deselectAllPulldownMultiSearch)}</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={FieldSearchPulldownMultiStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity style={[FieldSearchPulldownMultiStyles.modalBtnHeader, FieldSearchPulldownMultiStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchPulldownMultiStyles.textCenter, FieldSearchPulldownMultiStyles.textBtnDisable]}>{translate(fieldSearchMessages.selectInversePulldownMultiSearch)}</Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalBtnHeader}
                onPress={handleSelectInverseAllItem}
              >
                <Text style={FieldSearchPulldownMultiStyles.textCenter}>{translate(fieldSearchMessages.selectInversePulldownMultiSearch)}</Text>
              </TouchableOpacity>
            }

          </View>
        </View>
        <View style={FieldSearchPulldownMultiStyles.modalDivider} />
        <View style={FieldSearchPulldownMultiStyles.modalContentSearchDetail}>
          <FlatList
            keyExtractor={item => item.itemId.toString()}
            data={sortedFieldItems}
            renderItem={({ item }: { item: any }) => <View>
              <TouchableOpacity
                style={FieldSearchPulldownMultiStyles.modalOptionSearchDetail}
                onPress={() => handleSelectItem(item)}>
                <View style={FieldSearchPulldownMultiStyles.labelOption}>
                  <Text>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                </View>
                <View style={FieldSearchPulldownMultiStyles.iconCheckView}>
                  {selectedItemIds.includes(item.itemId)
                    ? <Image source={selectedIcon} />
                    : <Image source={unSelectedIcon} />
                  }
                </View>
              </TouchableOpacity>
              <View style={FieldSearchPulldownMultiStyles.modalDivider} />
            </View>} />
        </View>
        <View style={FieldSearchPulldownMultiStyles.modalListButtonFooter}>
          <TouchableOpacity style={FieldSearchPulldownMultiStyles.btnBack}
            onPress={() => {
              setIsOpenSearchDetail(false);
            }}>
            <Text>{translate(fieldSearchMessages.cancelPulldownMultiSearch)}</Text>
          </TouchableOpacity>
          {selectedItemIds.length === 0
            ? <TouchableOpacity style={[FieldSearchPulldownMultiStyles.btnConfirm, FieldSearchPulldownMultiStyles.btnDisable]}
              disabled>
              <Text style={FieldSearchPulldownMultiStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmPulldownMultiSearch)}</Text>
            </TouchableOpacity>
            : <TouchableOpacity style={FieldSearchPulldownMultiStyles.btnConfirm}
              onPress={handleSetSearchCondition}>
              <Text style={FieldSearchPulldownMultiStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmPulldownMultiSearch)}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
  /**
   * render search pulldown Multi form
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
          <View style={FieldSearchPulldownMultiStyles.modalContainer}>
            <TouchableOpacity
              style={FieldSearchPulldownMultiStyles.modalHeader}
              onPress={() => setModalVisible(false)}
            />
            <Image style={FieldSearchPulldownMultiStyles.modalIcon} source={modalIcon} />
            {!isOpenSearchDetail
              ? renderSearch()
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
          <View style={FieldSearchPulldownMultiStyles.modalContainer}>
            <TouchableOpacity
              style={FieldSearchPulldownMultiStyles.modalHeader}
              onPress={() => setModalOptionSearchVisible(false)}
            />
            <Image style={FieldSearchPulldownMultiStyles.modalIcon} source={modalIcon} />
            <View style={FieldSearchPulldownMultiStyles.modalContenOptionSearch}>
              <View style={FieldSearchPulldownMultiStyles.modalOptionSearchType} >
                <Text style={FieldSearchPulldownMultiStyles.blackText}>{translate(fieldSearchMessages.searchMethodPulldown)}</Text>
                <View>
                  <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalOption} onPress={() => setIsSearchOptionNOT(!isSearchOptionNOT)}>
                    <Text style={FieldSearchPulldownMultiStyles.titleNOTOptionSearch}>{translate(fieldSearchMessages.searchNOTOption)}</Text>
                    {isSearchOptionNOT
                      ? <Image style={FieldSearchPulldownMultiStyles.modalOptionIcon} source={selectedIcon} />
                      : <Image style={FieldSearchPulldownMultiStyles.modalOptionIcon} source={unSelectedIcon} />
                    }
                  </TouchableOpacity>
                </View>
              </View>
              <View style={[FieldSearchPulldownMultiStyles.modalDivider]} />
              <Text style={[FieldSearchPulldownMultiStyles.titleModalOptionSearch, FieldSearchPulldownMultiStyles.modalOptionSearchType]}>{translate(fieldSearchMessages.titleSearchOptionPulldownMulti)}</Text>
              <View style={FieldSearchPulldownMultiStyles.modalListOptionSearch}>
                <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalOptionSearch} onPress={() => { setOptionSearch(SearchOption.OR) }}>
                  <Text style={FieldSearchPulldownMultiStyles.modalSearchOption}>{translate(fieldSearchMessages.searchOROption)}</Text>
                  {optionSearch === SearchOption.OR && (
                    <Image style={FieldSearchPulldownMultiStyles.modalOptionIcon} source={selectedIcon} />
                  )}
                </TouchableOpacity>
                <View style={FieldSearchPulldownMultiStyles.modalDivider} />
                <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalOptionSearch} onPress={() => { setOptionSearch(SearchOption.AND) }}>
                  <Text style={FieldSearchPulldownMultiStyles.modalSearchOption}>{translate(fieldSearchMessages.searchANDOption)}</Text>
                  {optionSearch === SearchOption.AND && (
                    <Image style={FieldSearchPulldownMultiStyles.modalOptionIcon} source={selectedIcon} />
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={FieldSearchPulldownMultiStyles.modalButton} onPress={handleSetSearchCondition}>
                <Text style={FieldSearchPulldownMultiStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmPulldownMultiSearch)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={FieldSearchPulldownMultiStyles.titleView}>
          <Text style={FieldSearchPulldownMultiStyles.title}>{title}</Text>
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
              ? <Text style={FieldSearchPulldownMultiStyles.placeholderSearchPulldownMulti}>
                {searchConditionsValue}
              </Text>
              : <Text>{searchConditions}</Text>
          }
        </TouchableOpacity>
      </View>
    );
  }

  return renderConponent();
}