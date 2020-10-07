import CustomerSuggestStyles from './customer-suggest-style';
import React, { useState } from 'react';
import { CustomerSuggest, ICustomerSuggestionsProps } from '../interface/customer-suggest-interface';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { messages } from './customer-suggest-messages';
import { SuggetionModalVisible, TypeSelectSuggest } from '../../../../config/constants/enum';
import { translate } from '../../../../config/i18n';
import { CustomerSuggestModalView } from './customer-suggest-modal/customer-suggest-modal-view';
import { map, filter, findIndex, isNil } from 'lodash'
import { Icon } from '../../icon';
import SearchDetailScreen from './customer-search-detail/search-detail-screen';
import { ISearchCondition } from './customer-search-detail/search-detail-interface';
import { CustomerSuggestResultSearchView } from './customer-suggest-result-search/customer-suggest-result-search-view';

/**
 * Max size display selected data
 */
const MAX_SIZE_DISPLAY = 5;

/**
 * Component for searching text fields
 * @param props see ICustomerSuggestProps
 */
export function CustomerSuggestView(props: ICustomerSuggestionsProps) {
  const [viewAll, setViewAll] = useState(!(props.initData && props.initData.length > 5));
  const [modalVisible, setModalVisible] = useState(SuggetionModalVisible.INVISIBLE);
  const [dataSelected, setDataSelected] = useState<CustomerSuggest[]>(props.initData ? props.initData : []);
  const [isVisibleDetailSearchModal, setIsVisibleDetailSearchModal] = useState(false);
  const [conditions, setConditions] = useState<ISearchCondition[]>([]);
  const [isVisibleResultSearchModal, setIsVisibleResultSearchModal] = useState(false);

  /**
   * add customer selected in popup
   *  @param item selected
   */
  const handleAddNewSuggestions = (item: CustomerSuggest) => {
    if (props.typeSearch === TypeSelectSuggest.SINGLE) {
      dataSelected.pop();
    }
    dataSelected.push(item);
    if (dataSelected.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
    props.updateStateElement(dataSelected);
  }

  /**
   * event click choose employee item in list
   * @param employee
   */
  const handleRemoveCustomerSetting = (customer: CustomerSuggest) => {
    const selected = dataSelected.filter(itemDto => itemDto.customerId !== customer.customerId);
    setDataSelected(selected);
    if (selected.length <= MAX_SIZE_DISPLAY) {
      setViewAll(true);
    }
    props.updateStateElement(selected);
  }

  /**
   * Add data select from search result screen
   * @param customers CustomerSuggest[]
   */
  const handleAddSelectResults = (customers: CustomerSuggest[]) => {
    const selected = props.typeSearch === TypeSelectSuggest.MULTI ? filter(dataSelected.concat(customers), (value, index, self) => {
      return findIndex(self, item => item.customerId === value.customerId) === index;
    }) : customers;
    setDataSelected(selected);
    if (selected.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
    setIsVisibleDetailSearchModal(false);
    setModalVisible(SuggetionModalVisible.INVISIBLE);
    props.updateStateElement(selected);
  }

  /**
   * Render label
   */
  const renderLabel = () => {
    if (props.invisibleLabel) {
      return null;
    } else {
      return (
        <View style={CustomerSuggestStyles.labelName}>
          <Text style={CustomerSuggestStyles.labelText}>
            {props.fieldLabel}
          </Text>
          {props.isRequire &&
            <View style={CustomerSuggestStyles.labelHighlight}>
              <Text style={CustomerSuggestStyles.labelTextHighlight}>
                {translate(messages.requireText)}
              </Text>
            </View>
          }
        </View>
      )
    }
  }

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    if (isVisibleResultSearchModal) {
      setIsVisibleResultSearchModal(false);
    } else if (isVisibleDetailSearchModal) {
      setIsVisibleDetailSearchModal(false);
    } else {
      setModalVisible(SuggetionModalVisible.INVISIBLE);
    }
  }

  /*
   * Render the text component in add-edit case
   */
  return (
    <View style={CustomerSuggestStyles.stretchView}>
      {renderLabel()}
      <View>
        <TouchableOpacity
          style={[CustomerSuggestStyles.labelInputData, props.isError && CustomerSuggestStyles.errorContent]}
          onPress={() => {
            setModalVisible(SuggetionModalVisible.VISIBLE);
          }}
        >
          <Text style={CustomerSuggestStyles.labelInputCorlor}>{props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
            : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
        </TouchableOpacity>
        {!props.hiddenSelectedData &&
          map(viewAll ? dataSelected : dataSelected.slice(0, MAX_SIZE_DISPLAY), item => {
            return (
              <View style={CustomerSuggestStyles.viewSuggestContent}>
                <View
                  style={CustomerSuggestStyles.suggestTouchable}>
                  <Text numberOfLines={1} style={CustomerSuggestStyles.suggestText}>{item.parentCustomerName}</Text>
                  <Text numberOfLines={1} style={CustomerSuggestStyles.fontBold}>{item.customerName}</Text>
                </View>
                <TouchableOpacity
                  style={CustomerSuggestStyles.iconCheckView}
                  onPress={() => {
                    handleRemoveCustomerSetting(item);
                  }}>
                  <Icon style={CustomerSuggestStyles.iconListDelete} name="delete" />
                </TouchableOpacity>
              </View>
            )
          })
        }
        {
          !props.hiddenSelectedData && !viewAll &&
          <TouchableOpacity onPress={() => setViewAll(true)}>
            <Text style={CustomerSuggestStyles.buttonViewAll}>{`${translate(messages.labelViewMore1)}${(dataSelected.length - MAX_SIZE_DISPLAY)}${translate(messages.labelViewMore2)}`}</Text>
          </TouchableOpacity>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible === SuggetionModalVisible.VISIBLE || isVisibleDetailSearchModal || isVisibleResultSearchModal}
          onRequestClose={() => handleCloseModal()}
        >
          {modalVisible === SuggetionModalVisible.VISIBLE &&
            <View style={CustomerSuggestStyles.modalContentStyle}>
              <CustomerSuggestModalView
                typeSearch={props.typeSearch}
                fieldLabel={props.fieldLabel}
                dataSelected={dataSelected}
                isRelation={props.isRelation}
                listIdChoice={props.listIdChoice}
                closeModal={() => setModalVisible(SuggetionModalVisible.INVISIBLE)}
                selectData={(data) => handleAddNewSuggestions(data)}
                openDetailSearchModal={() => setIsVisibleDetailSearchModal(true)}
                exportError={(error) => !isNil(props.exportError) && props.exportError(error)}
              />
            </View>
          }
          {isVisibleDetailSearchModal &&
            <View style={CustomerSuggestStyles.detailSearchContent}>
              <SearchDetailScreen
                updateStateElement={(cond: ISearchCondition[]) => setConditions(cond)}
                closeDetaiSearchModal={() => setIsVisibleDetailSearchModal(false)}
                openResultSearchModal={() => setIsVisibleResultSearchModal(true)}
              />
            </View>
          }
          {isVisibleResultSearchModal &&
            <View style={CustomerSuggestStyles.detailSearchContent}>
              <CustomerSuggestResultSearchView
                updateStateElement={(listEmployee: CustomerSuggest[]) => handleAddSelectResults(listEmployee)}
                isRelation={props.isRelation}
                typeSearch={props.typeSearch}
                searchConditions={conditions}
                closeModal={() => {
                  setIsVisibleResultSearchModal(false)
                }}
                exportError={(error) => !isNil(props.exportError) && props.exportError(error)}
              />
            </View>}
        </Modal >
      </View>
    </View>

  );
}
