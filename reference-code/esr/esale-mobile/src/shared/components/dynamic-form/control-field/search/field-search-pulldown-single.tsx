import _ from 'lodash';
import EntityUtils from '../../../../util/entity-utils';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTypeSearch, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchPulldownSingleStyles } from './field-search-styles';
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

// define type of FieldSearchPulldownSingle's props
type IFieldSearchPulldownSingleProps = IDynamicFieldProps;

/**
 * Component search pulldown single form
 * @param props see IDynamicFieldProps
 */
export function FieldSearchPulldownSingle(props: IFieldSearchPulldownSingleProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<any[]>([]);
  const [searchConditions, setSearchConditions] = useState(TEXT_EMPTY);
  const { fieldInfo, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const unSelectedIcon = require("../../../../../../assets/icons/unchecked.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);
  const searchConditionsValue = `${translate(fieldSearchMessages.searchContentPulldownSingle)}`;
  const [typeSearch, setTypeSearch] = useState(ChooseTypeSearch.DETAIL_SEARCH);
  const [isOpenSearchDetail, setIsOpenSearchDetail] = useState(false);
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
    })
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
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions);
    }
    if (isSearchBlank) {
      setSearchConditions(translate(fieldSearchMessages.blankSearchPulldownSingle));
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
    }
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
   * Render popup search conditions
   */
  const renderPopupConditionSearch = () => {
    return (
      <View style={FieldSearchPulldownSingleStyles.modalContent}>
        <TouchableOpacity style={FieldSearchPulldownSingleStyles.modalOption} onPress={() => { setTypeSearch(ChooseTypeSearch.BLANK_SEARCH) }}>
          <Text style={FieldSearchPulldownSingleStyles.modalOptionSearchType}>{translate(fieldSearchMessages.blankSearchPulldownSingle)}</Text>
          {typeSearch === ChooseTypeSearch.BLANK_SEARCH && (
            <Image style={FieldSearchPulldownSingleStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchPulldownSingleStyles.modalDivider} />
        <TouchableOpacity style={FieldSearchPulldownSingleStyles.modalOption} onPress={() => { setIsOpenSearchDetail(true); setTypeSearch(ChooseTypeSearch.DETAIL_SEARCH) }}>
          <Text style={FieldSearchPulldownSingleStyles.modalOptionSearchType}>{translate(fieldSearchMessages.conditionalSearchPulldownSingle)}</Text>
          {typeSearch === ChooseTypeSearch.DETAIL_SEARCH && (
            <Image style={FieldSearchPulldownSingleStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchPulldownSingleStyles.modalDivider} />
        {typeSearch === ChooseTypeSearch.NOT_CHOOSE
          ? <TouchableOpacity style={[FieldSearchPulldownSingleStyles.modalButton, FieldSearchPulldownSingleStyles.btnDisable]} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchPulldownSingleStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmPulldownSingleSearch)}</Text>
          </TouchableOpacity>
          : <TouchableOpacity style={FieldSearchPulldownSingleStyles.modalButton} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchPulldownSingleStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmPulldownSingleSearch)}</Text>
          </TouchableOpacity>
        }

      </View>
    );
  }
  /**
   * Render popup search detail
   */
  const renderSearchDetail = () => {
    return (
      <View style={FieldSearchPulldownSingleStyles.modalContent}>
        <View style={FieldSearchPulldownSingleStyles.modalListButtonHeader}>
          <View style={FieldSearchPulldownSingleStyles.modalViewBtnHeader}>
            <TouchableOpacity style={FieldSearchPulldownSingleStyles.modalBtnHeader}
              onPress={handleSelectAllItem}>
              <Text style={FieldSearchPulldownSingleStyles.textCenter}>{translate(fieldSearchMessages.selectAllPulldownSingleSearch)}</Text>
            </TouchableOpacity>
          </View>
          <View style={FieldSearchPulldownSingleStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity
                style={[FieldSearchPulldownSingleStyles.modalBtnHeader, FieldSearchPulldownSingleStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchPulldownSingleStyles.textCenter, FieldSearchPulldownSingleStyles.textBtnDisable]}>
                  {translate(fieldSearchMessages.deselectAllPulldownSingleSearch)}
                </Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchPulldownSingleStyles.modalBtnHeader}
                onPress={handleDeselectAllItem}
              >
                <Text style={FieldSearchPulldownSingleStyles.textCenter}>{translate(fieldSearchMessages.deselectAllPulldownSingleSearch)}</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={FieldSearchPulldownSingleStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity style={[FieldSearchPulldownSingleStyles.modalBtnHeader, FieldSearchPulldownSingleStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchPulldownSingleStyles.textCenter, FieldSearchPulldownSingleStyles.textBtnDisable]}>{translate(fieldSearchMessages.selectInversePulldownSingleSearch)}</Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchPulldownSingleStyles.modalBtnHeader}
                onPress={handleSelectInverseAllItem}
              >
                <Text style={FieldSearchPulldownSingleStyles.textCenter}>{translate(fieldSearchMessages.selectInversePulldownSingleSearch)}</Text>
              </TouchableOpacity>
            }

          </View>
        </View>
        <View style={FieldSearchPulldownSingleStyles.modalDivider} />
        <View style={FieldSearchPulldownSingleStyles.modalContentSearchDetail}>
          <FlatList
            keyExtractor={item => item.itemId.toString()}
            data={sortedFieldItems}
            renderItem={({ item }: { item: any }) => <View>
              <TouchableOpacity
                style={FieldSearchPulldownSingleStyles.modalOptionSearchDetail}
                onPress={() => handleSelectItem(item)}>
                <View style={[FieldSearchPulldownSingleStyles.labelOption, (!!item.parentId || item.parentId ===0) && {marginLeft: 16}]}>
                  <Text>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                </View>
                <View style={FieldSearchPulldownSingleStyles.iconCheckView}>
                  {selectedItemIds.includes(item.itemId)
                    ? <Image source={selectedIcon} />
                    : <Image source={unSelectedIcon} />
                  }
                </View>
              </TouchableOpacity>
              <View style={FieldSearchPulldownSingleStyles.modalDivider} />
            </View>} />
        </View>
        <View style={FieldSearchPulldownSingleStyles.modalListButtonFooter}>
          <TouchableOpacity style={FieldSearchPulldownSingleStyles.btnBack}
            onPress={() => {
              setIsOpenSearchDetail(false);
            }}>
            <Text>{translate(fieldSearchMessages.cancelPulldownSingleSearch)}</Text>
          </TouchableOpacity>
          {selectedItemIds.length === 0
            ? <TouchableOpacity style={[FieldSearchPulldownSingleStyles.btnConfirm, FieldSearchPulldownSingleStyles.btnDisable]}
              disabled>
              <Text style={FieldSearchPulldownSingleStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmPulldownSingleSearch)}</Text>
            </TouchableOpacity>
            : <TouchableOpacity style={FieldSearchPulldownSingleStyles.btnConfirm}
              onPress={handleSetSearchCondition}>
              <Text style={FieldSearchPulldownSingleStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmPulldownSingleSearch)}</Text>
            </TouchableOpacity>
          }

        </View>
      </View>
    );
  }
  /**
   * render search pulldown single form
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
          <View style={FieldSearchPulldownSingleStyles.modalContainer}>
            <TouchableOpacity
              style={FieldSearchPulldownSingleStyles.modalHeader}
              onPress={() => setModalVisible(false)}
            />
            <Image style={FieldSearchPulldownSingleStyles.modalIcon} source={modalIcon} />
            {!isOpenSearchDetail ? renderPopupConditionSearch() : renderSearchDetail()}

          </View>
        </Modal>

        <Text style={FieldSearchPulldownSingleStyles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          {
            searchConditions === TEXT_EMPTY
              ? <Text style={FieldSearchPulldownSingleStyles.placeholderSearchPulldownSingle}>
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