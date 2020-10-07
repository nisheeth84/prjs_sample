import React, { useEffect, useState } from 'react';
import { AppbarStyles, SearchDetailStyles } from './search-detail-style';
import { cloneDeep, filter, find } from 'lodash';
import { ControlType, DefineFieldType, FieldBelong, ExtensionBelong } from '../../../../../config/constants/enum';
import { DynamicControlField } from '../../../dynamic-form/control-field/dynamic-control-field';
import {
  FlatList,
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from '../../../icon';
import { IFieldInfoPersonal, ISearchCondition, ISearchDetailProps } from './search-detail-interface';
import { SearchDetailModal } from './search-detail-modal/search-detail-modal';
import { translate } from '../../../../../config/i18n';
import { messages } from '../customer-suggest-messages';
import { getCustomFieldsInfo, getFieldInfoPersonals, getDataLayout } from '../../repository/customer-suggest-repositoty';

const CUSTOMER_SPECIAL_LIST_FIELD = {
  CUSTOMER_PARENT: 'customer_parent',
  BUSINESS_MAIN_ID: 'business_main_id',
  BUSINESS_SUB_ID: 'business_sub_id',
  SCENARIO: 'scenario_id',
  SCHEDULE_NEXT: 'schedule_next',
  ACTION_NEXT: 'action_next',
  CREATED_USER: 'created_user',
  UPDATED_USER: 'updated_user',
  DISPLAY_CHILD_CUSTOMERS: 'is_display_child_customers',
  LAST_CONTACT_DATE: 'last_contact_date',
  // default display special
  PERSON_IN_CHARGE: 'person_in_charge',
  CUSTOMER_LOGO: 'customer_logo',
  // business for filter
  BUSINESS: 'business',
  // for edit list
  CUSTOMER_NAME: 'customer_name',
  CREATED_DATE: 'created_date',
  UPDATED_DATE: 'updated_date'
};

const typeNotInclude = [
  DefineFieldType.TAB,
  DefineFieldType.LOOKUP,
  DefineFieldType.TITLE,
];

/**
 * Component for searching detail fields
 * @param props see ISearchDetailProps
 */
export default function SearchDetailScreen(props: ISearchDetailProps) {
  const [isVisibleSearchCondition, setIsVisibleSearchCondition] = useState(false);
  const [responseAPIFieldInfo, setResponseAPIFieldInfo] = useState<IFieldInfoPersonal[]>([]);
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map<string, { fieldId: string, selected: boolean }>());
  const [dataSelected, setDataSelected] = useState<IFieldInfoPersonal[]>([]);
  const [searchCondition, setSearchCondition] = useState(new Map<string, ISearchCondition>());
  const [extensionsData, setExtensionsData] = useState<any>({});

  /**
   * Call getCustomFieldsInfo API
   * Call getFieldInfoPersonals API
   */
  useEffect(() => {
    handleCallAPI();
  }, []);

  /**
   * Call getCustomFieldsInfo API
   * Call getFieldInfoPersonals API
   * Set display value
   */
  const handleCallAPI = async () => {
    const resCustomFields = await getCustomFieldsInfo({ fieldBelong: FieldBelong.CUSTOMER });
    if (resCustomFields.data.customFieldsInfo) {
      const customFields = filter(resCustomFields.data.customFieldsInfo, item => {
        return !typeNotInclude.includes(item?.fieldType?.toString() || "");
      });
      setResponseAPIFieldInfo(customFields);
    }

    const layoutData = await getDataLayout({}, {});
    if (layoutData?.data?.fields) {
      setExtensionsData(getExtensionsCustomer(layoutData.data.fields));
    }

    const resFieldInfo = await getFieldInfoPersonals({
      fieldBelong: FieldBelong.CUSTOMER,
      extensionBelong: ExtensionBelong.SEARCH_SCREEN,
      selectedTargetId: 0,
      selectedTargetType: 0
    });
    const fieldInfoPersonals = filter(resFieldInfo.data.fieldInfoPersonals, item => {
      return !typeNotInclude.includes(item?.fieldType?.toString() || "");
    });
    if (fieldInfoPersonals) {
      fieldInfoPersonals.sort((p1, p2) => p1.fieldOrder - p2.fieldOrder);
      setDataSelected(fieldInfoPersonals);
    }
  }

  /**
   * Save input condition
   * @param _keyElement 
   * @param _type 
   * @param objEditValue 
   * @param _extEditValue 
   */
  const handleSaveCondition = (_keyElement: string | any, _type: string | any, objEditValue: string | any, _extEditValue?: any) => {
    const cond = cloneDeep(searchCondition);
    cond.set(objEditValue['fieldId'], objEditValue);
    setSearchCondition(cond);
  }

  /**
   * Update condition state
   */
  const updateStateElement = () => {
    const conditions: ISearchCondition[] = [];
    searchCondition.forEach(cond => {
      if (find(dataSelected, data => data.fieldId === cond.fieldId)) {
        conditions.push(cond);
      }
    })
    props.updateStateElement(conditions);
    props.openResultSearchModal();
  }

  /**
   * Open modal select condition
   */
  const openSearchConditionModal = () => {
    responseAPIFieldInfo.sort((p1, p2) => p1.fieldOrder - p2.fieldOrder);
    initStatusItem(responseAPIFieldInfo);
    setIsVisibleSearchCondition(true);
  }

  /**
   * Set initial state
   * @param fieldList
   */
  const initStatusItem = (fieldList: IFieldInfoPersonal[]) => {
    const newStateCheck = new Map(statusSelectedItem);
    fieldList.forEach((field) => {
      if (!newStateCheck.get(field.fieldId.toString())) {
        const initData = dataSelected.find(item => item.fieldId === field.fieldId);
        let selectData: { fieldId: string, selected: boolean } = { fieldId: field.fieldId.toString(), selected: false };
        if (initData) {
          selectData = { fieldId: field.fieldId.toString(), selected: true };
        }
        newStateCheck.set(field.fieldId.toString(), selectData);
      }
    });
    setStatusSelectedItem(newStateCheck);
  }

  /**
   * GetExtensionsCustomer
   */
  const getExtensionsCustomer = (customerLayout: any, type?: any) => {
    const extensionsData: any = {};
    if (!customerLayout) {
      return extensionsData;
    }
    let business: any[] = [];
    const displayChildCustomers: any[] = [];
    displayChildCustomers.push({
      isAvailable: true,
      itemId: 1,
      itemLabel: translate(messages.isDisplayChildCustomers),
      isDefault: null,
      itemOrder: 1
    })
    if (customerLayout && Array.isArray(customerLayout) && customerLayout.length > 0) {
      customerLayout.forEach(item => {
        if (item.fieldName === 'business_main_id') {
          business = convertBusinessListFieldsItem(item.listFieldsItem, type);
        }
      });
  
      extensionsData['business_main_id'] = business;
      extensionsData['business_sub_id'] = business;
      extensionsData['is_display_child_customers'] = displayChildCustomers;
    }
  
    return extensionsData;
  };

  /**
   * Convert BusinessListFieldsItem
   * @param listFieldsItem 
   * @param type 
   */
  const convertBusinessListFieldsItem = (listFieldsItem: any, type?: any) => {
    const data = [...getArrayFromTree(listFieldsItem, null, 0, type)];
    return data;
  };

  /**
   * Get array data
   * @param treeFieldsItem 
   * @param parentId 
   * @param level 
   * @param type 
   */
  const getArrayFromTree = (treeFieldsItem: any, parentId: any, level: any, type?: any) => {
    let resultArray: any[] = [];
    treeFieldsItem &&
      treeFieldsItem.map((fieldItemCurrent: { fieldItemChilds: string | any[]; itemParentId: any; }) => {
        const result = tranferCurrentData(fieldItemCurrent, parentId, level, type);
        resultArray.push(result);
        if (fieldItemCurrent.fieldItemChilds && fieldItemCurrent.fieldItemChilds.length > 0) {
          const resultChildArray = getArrayFromTree(fieldItemCurrent.fieldItemChilds, fieldItemCurrent.itemParentId, level + 1, type);
          resultArray = [...resultArray, ...resultChildArray];
        }
      });
    return resultArray;
  };

  /**
   * Update data
   * @param fieldItemCurrent 
   * @param parentId 
   * @param _level 
   * @param _type 
   */
  const tranferCurrentData = (fieldItemCurrent: any, parentId: any, _level?: any, _type?: any) => {
    const result: any = {};
    result['itemId'] = fieldItemCurrent.itemId;
    result['isAvailable'] = fieldItemCurrent.isAvailable;
    result['itemOrder'] = fieldItemCurrent.itemOrder;
    result['isDefault'] = null;
    result['itemLabel'] = fieldItemCurrent.itemLabel;
    result['updatedDate'] = fieldItemCurrent.updatedDate;
    result['itemParentId'] = parentId;
    return result;
  };

  /**
   * Render dynamic field
   * @param item 
   */
  const renderDynamicField = (item: any) => {
    item.fieldItems = cloneDeep(item.fieldItems && item.fieldItems.length > 0 ? item.fieldItems : extensionsData[item.fieldName]);
    const field = cloneDeep(item);
    switch (field.fieldName) {
      case CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID:
      case CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_SUB_ID:
      case CUSTOMER_SPECIAL_LIST_FIELD.DISPLAY_CHILD_CUSTOMERS:
        field.fieldType = DefineFieldType.SINGER_SELECTBOX;
        break;
      case CUSTOMER_SPECIAL_LIST_FIELD.SCHEDULE_NEXT:
      case CUSTOMER_SPECIAL_LIST_FIELD.ACTION_NEXT:
      case CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER:
      case CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER:
      case CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT:
        field.fieldType = DefineFieldType.TEXT;
        break; 
      case CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO:
      case CUSTOMER_SPECIAL_LIST_FIELD.SCENARIO:
        field.disableDisplaySearch = true;
        break;
      default:
        break;
    }
    return (
      <DynamicControlField
        fieldInfo={field}
        controlType={ControlType.SEARCH}
        updateStateElement={handleSaveCondition}
      />
    )
  }

  /**
   * Close modal
   */
  const closeDetaiSearchModal = () => {
    props.closeDetaiSearchModal();
  }

  return (
    <View style={SearchDetailStyles.searchContent}>
      <View style={[AppbarStyles.barContainer, AppbarStyles.block]}>
        <TouchableOpacity
          style={AppbarStyles.iconButton}
          onPress={closeDetaiSearchModal}
        >
          <Icon name="close" />
        </TouchableOpacity>
        <View style={AppbarStyles.titleWrapper}>
          <Text style={AppbarStyles.title}>{translate(messages.labelDetailSearch)}</Text>
        </View>
        <TouchableOpacity style={AppbarStyles.applyButton} onPress={updateStateElement}>
          <Text style={AppbarStyles.applyText}>{translate(messages.detailSearchApply)}</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={AppbarStyles.filterButton}
          onPress={openSearchConditionModal}
        >
          <Text>{translate(messages.detailSearchFilterButton)}</Text>
        </TouchableOpacity>
      </View>
      <View style={SearchDetailStyles.rowBlank}></View>
      <View style={[responseAPIFieldInfo?.length > 0 ? SearchDetailStyles.selectedList : {}]}>
        <FlatList
          data={dataSelected}
          keyExtractor={item => item.fieldId.toString()}
          renderItem={({ item }) =>
            <View style={SearchDetailStyles.rowBorder}>
              <View style={SearchDetailStyles.row}>
                {renderDynamicField(item)}
              </View>
            </View>
          }
        ></FlatList>
      </View>
      <Modal
        visible={isVisibleSearchCondition}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsVisibleSearchCondition(false)}
      >
        <View style={SearchDetailStyles.searchModalContent}>
          <SearchDetailModal
            customFieldsData={responseAPIFieldInfo}
            statusInit={statusSelectedItem}
            closeModal={() => setIsVisibleSearchCondition(false)}
            updateStateElement={(datas) => setDataSelected(datas)}
            updateStatus={(status) => setStatusSelectedItem(status)}
          />
        </View>
      </Modal>
    </View>
  )
}
