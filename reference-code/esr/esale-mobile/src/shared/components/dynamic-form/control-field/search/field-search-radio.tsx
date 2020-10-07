import _ from 'lodash';
import EntityUtils from '../../../../util/entity-utils';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { ChooseTypeSearch, SearchType } from '../../../../../config/constants/enum';
import { FIELD_LABLE, ITEM_LABEL, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { fieldSearchMessages } from './field-search-messages';
import { FieldSearchRadioStyles } from './field-search-styles';
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

// define type of FieldSearchRadio"s props
type IFieldSearchRadioProps = IDynamicFieldProps;

/**
 * Component search radio button form
 * @param props see IDynamicFieldProps
 */
export function FieldSearchRadio(props: IFieldSearchRadioProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<any[]>([]);
  const [searchConditions, setSearchConditions] = useState(TEXT_EMPTY);
  const { fieldInfo, languageCode } = props;
  const language = languageCode ?? TEXT_EMPTY;
  const selectedIcon = require("../../../../../../assets/icons/selected.png");
  const unSelectedIcon = require("../../../../../../assets/icons/unchecked.png");
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, language);
  const searchConditionsValue = `${translate(fieldSearchMessages.searchContentRadio)}`;
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
    const selectedIndex = selectedItemIds.indexOf(item.itemId)
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
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, conditions);
    }
    if (isSearchBlank) {
      setSearchConditions(translate(fieldSearchMessages.blankSearchRadio));
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
  }, []);
  /**
   * Render search condition component
   */
  const renderSearchCondition = () => {
    return (
      <View style={FieldSearchRadioStyles.modalContent}>
        <TouchableOpacity style={FieldSearchRadioStyles.modalOption} onPress={() => { setTypeSearch(ChooseTypeSearch.BLANK_SEARCH) }}>
          <Text style={FieldSearchRadioStyles.modalOptionSearchType}>{translate(fieldSearchMessages.blankSearchRadio)}</Text>
          {typeSearch === ChooseTypeSearch.BLANK_SEARCH && (
            <Image style={FieldSearchRadioStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchRadioStyles.modalDivider} />
        <TouchableOpacity style={FieldSearchRadioStyles.modalOption} onPress={() => { setIsOpenSearchDetail(true); setTypeSearch(ChooseTypeSearch.DETAIL_SEARCH) }}>
          <Text style={FieldSearchRadioStyles.modalOptionSearchType}>{translate(fieldSearchMessages.conditionalSearchRadio)}</Text>
          {typeSearch === ChooseTypeSearch.DETAIL_SEARCH && (
            <Image style={FieldSearchRadioStyles.modalOptionIcon} source={selectedIcon} />
          )}
        </TouchableOpacity>
        <View style={FieldSearchRadioStyles.modalDivider} />
        {typeSearch === ChooseTypeSearch.NOT_CHOOSE
          ? <TouchableOpacity style={[FieldSearchRadioStyles.modalButton, FieldSearchRadioStyles.btnDisable]} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchRadioStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmRadioSearch)}</Text>
          </TouchableOpacity>
          : <TouchableOpacity style={FieldSearchRadioStyles.modalButton} onPress={handleSetSearchCondition}>
            <Text style={FieldSearchRadioStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmRadioSearch)}</Text>
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
      <View style={FieldSearchRadioStyles.modalContent}>
        <View style={FieldSearchRadioStyles.modalListButtonHeader}>
          <View style={FieldSearchRadioStyles.modalViewBtnHeader}>
            <TouchableOpacity style={FieldSearchRadioStyles.modalBtnHeader}
              onPress={handleSelectAllItem}>
              <Text style={FieldSearchRadioStyles.textCenter}>{translate(fieldSearchMessages.selectAllRadioSearch)}</Text>
            </TouchableOpacity>
          </View>
          <View style={FieldSearchRadioStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity
                style={[FieldSearchRadioStyles.modalBtnHeader, FieldSearchRadioStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchRadioStyles.textCenter, FieldSearchRadioStyles.textBtnDisable]}>
                  {translate(fieldSearchMessages.deselectAllRadioSearch)}
                </Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchRadioStyles.modalBtnHeader}
                onPress={handleDeselectAllItem}
              >
                <Text style={FieldSearchRadioStyles.textCenter}>{translate(fieldSearchMessages.deselectAllRadioSearch)}</Text>
              </TouchableOpacity>
            }
          </View>
          <View style={FieldSearchRadioStyles.modalViewBtnHeader}>
            {selectedItemIds.length === 0
              ? <TouchableOpacity style={[FieldSearchRadioStyles.modalBtnHeader, FieldSearchRadioStyles.btnDisable]}
                disabled
              >
                <Text style={[FieldSearchRadioStyles.textCenter, FieldSearchRadioStyles.textBtnDisable]}>{translate(fieldSearchMessages.selectInverseRadioSearch)}</Text>
              </TouchableOpacity>
              : <TouchableOpacity style={FieldSearchRadioStyles.modalBtnHeader}
                onPress={handleSelectInverseAllItem}
              >
                <Text style={FieldSearchRadioStyles.textCenter}>{translate(fieldSearchMessages.selectInverseRadioSearch)}</Text>
              </TouchableOpacity>
            }

          </View>
        </View>
        <View style={FieldSearchRadioStyles.modalDivider} />
        <View style={FieldSearchRadioStyles.modalContentSearchDetail}>
          <FlatList
            keyExtractor={item => item.itemId.toString()}
            data={sortedFieldItems}
            renderItem={({ item }: { item: any }) => <View>
              <TouchableOpacity
                style={FieldSearchRadioStyles.modalOptionSearchDetail}
                onPress={() => handleSelectItem(item)}>
                <View style={FieldSearchRadioStyles.labelOption}>
                  <Text>{StringUtils.getFieldLabel(item, ITEM_LABEL, language)}</Text>
                </View>
                <View style={FieldSearchRadioStyles.iconCheckView}>
                  <Image source={selectedItemIds.includes(item.itemId) ? selectedIcon : unSelectedIcon} />
                </View>
              </TouchableOpacity>
              <View style={FieldSearchRadioStyles.modalDivider} />
            </View>} />
        </View>
        <View style={FieldSearchRadioStyles.modalListButtonFooter}>
          <TouchableOpacity style={FieldSearchRadioStyles.btnBack}
            onPress={() => {
              setIsOpenSearchDetail(false);
            }}>
            <Text>{translate(fieldSearchMessages.cancelRadioSearch)}</Text>
          </TouchableOpacity>
          {selectedItemIds.length === 0
            ? <TouchableOpacity style={[FieldSearchRadioStyles.btnConfirm, FieldSearchRadioStyles.btnDisable]}
              disabled>
              <Text style={FieldSearchRadioStyles.textBtnDisable}>{translate(fieldSearchMessages.confirmRadioSearch)}</Text>
            </TouchableOpacity>
            : <TouchableOpacity style={FieldSearchRadioStyles.btnConfirm}
              onPress={handleSetSearchCondition}>
              <Text style={FieldSearchRadioStyles.modalButtonTitle}>{translate(fieldSearchMessages.confirmRadioSearch)}</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
  /**
   * render search radio button form
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
          <View style={FieldSearchRadioStyles.modalContainer}>
            <TouchableOpacity
              style={FieldSearchRadioStyles.modalHeader}
              onPress={() => setModalVisible(false)}
            />
            <Image style={FieldSearchRadioStyles.modalIcon} source={modalIcon} />
            {!isOpenSearchDetail
              ? renderSearchCondition()
              : renderSearchDetail()
            }

          </View>
        </Modal>

        <Text style={FieldSearchRadioStyles.title}>{title}</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          {
            searchConditions === TEXT_EMPTY
              ? <Text style={FieldSearchRadioStyles.placeholderSearchRadio}>
                {searchConditionsValue}
              </Text>
              : <Text style={FieldSearchRadioStyles.blackText}>{searchConditions}</Text>
          }
        </TouchableOpacity>
      </View>
    )
  }

  return renderConponent();
}