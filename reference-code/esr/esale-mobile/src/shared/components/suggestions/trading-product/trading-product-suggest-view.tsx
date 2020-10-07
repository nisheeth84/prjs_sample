import { translate } from '../../../../config/i18n';
import { TypeSelectSuggest } from '../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import React, { useState, useEffect } from 'react';
import { cloneDeep } from 'lodash';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { ISearchCondition } from './trading-product-search-detail/search-detail-interface';
import TradingProductSuggestStyles from './trading-product-suggest-styles';
import { messages } from './trading-product-suggest-messages';
import { ITradingProductSuggestProps, TradingProductSuggest } from '../interface/trading-product-suggest-interface';
import _ from 'lodash';
import { TradingProductSuggestSearchModal } from './trading-product-suggest-search-modal/trading-product-suggest-search-modal';
import { TradingProductSuggestResultSearchView } from './trading-product-suggest-result-search/trading-product-suggest-result-search-view';
import SearchDetailScreen from './trading-product-search-detail/search-detail-screen';
import { TradingProductItem } from './trading-product-item';
import { getCustomFieldsInfo } from '../repository/trading-product-suggest-repositoty';
import { LIMIT_VIEW_SELECTED_TRADINGPRODUCT, FIELD_BELONG_TRADINGPRODUCT, FIELDID_CURRENCY_UNIT } from './trading-product-contants';


/**
 * Component for searching text fields
 * @param props see ITradingProductSuggestProps
 */
export function TradingProductSuggestView(props: ITradingProductSuggestProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<TradingProductSuggest[]>(props.initData ? props.initData : []);
  const [isVisibleResultSearchModal, setIsVisibleResultSearchModal] = useState(false);
  const [isVisibleDetailSearchModal, setIsVisibleDetailSearchModal] = useState(false);
  const [conditions, setConditions] = useState<ISearchCondition[]>([]);
  const [viewAll, setViewAll] = useState(!(props.initData && props.initData.length > 5));
  const [currencyUnit, setCurrencyUnit] = useState(TEXT_EMPTY);
  const [reRender, SetReRender] = useState(false);
  //state click TradingProduct
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  //state item TradingProduct used to be Clicked
  const [stateTradingProductBefore, setStateTradingProductBefore] = useState(TEXT_EMPTY);
  const arrayIndex: any = [];

  /**
  * event click view all selection
  */
  const handleViewAll = () => {
    setViewAll(true)

  }

  useEffect(() => {
    dataSelected.length > LIMIT_VIEW_SELECTED_TRADINGPRODUCT ? setViewAll(false) : setViewAll(true)
  }, [reRender])

  useEffect(() => {
    getCurrencyUnit();
  }, [])


  const getCurrencyUnit = async () => {
    const resCustomFields = await getCustomFieldsInfo({ fieldBelong: FIELD_BELONG_TRADINGPRODUCT });
    if (resCustomFields.data.customFieldsInfo) {
      const array = resCustomFields.data.customFieldsInfo;
      const data = array.filter(item => item.fieldName === FIELDID_CURRENCY_UNIT);
      setCurrencyUnit(data[0].currencyUnit);
    }
  }

  /**
  * add employee selected in popup
  *  @param item selected
  */
  const handleAddTradingProductSuggestions = (item: TradingProductSuggest, typeSearch: number) => {
    const isExistEmployee = dataSelected.find(itemTradingProduct => (itemTradingProduct.productTradingId === item.productTradingId))
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      if (!isExistEmployee) {
        dataSelected.pop();
        dataSelected.push(item);
      }
    } else {
      if (!isExistEmployee) {
        dataSelected.push(item);
      }
    }
    setDataSelected(dataSelected);
    props.updateStateElement(dataSelected)
    if (dataSelected.length > LIMIT_VIEW_SELECTED_TRADINGPRODUCT) {
      setViewAll(false);
    }
  }
  const setVisible = (TradingProduct: TradingProductSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${TradingProduct.productTradingId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));
    if (keyMap === stateTradingProductBefore) {
      setStateTradingProductBefore(TEXT_EMPTY);
    } else {
      setStateTradingProductBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);

  }
  const setTradingProductSelected = (data: TradingProductSuggest[]) => {
    switch (props.typeSearch) {
      case TypeSelectSuggest.SINGLE:
        setDataSelected(data);
        props.updateStateElement(dataSelected);
        break;
      case TypeSelectSuggest.MULTI:
        data.forEach(item => {
          if (dataSelected.findIndex(_item => item.productTradingId === _item.productTradingId) === -1) {
            arrayIndex.push(item);
          }
        })
        setDataSelected(cloneDeep(dataSelected).concat(arrayIndex));
        props.updateStateElement(dataSelected);
        break;
      default:
        break;
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
      setModalVisible(false);
    }
  }
  /**
   * Render label
   */
  const renderLabel = () => {
    if (props.invisibleLabel) {
      return null;
    } else {
      return (
        <View style={TradingProductSuggestStyles.labelName}>
          <Text style={TradingProductSuggestStyles.labelText}>
            {props.fieldLabel}
          </Text>
          {props.isRequire &&
            <View style={TradingProductSuggestStyles.labelHighlight}>
              <Text style={TradingProductSuggestStyles.labelTextHighlight}>
                {translate(messages.requireText)}
              </Text>
            </View>
          }
        </View>
      )
    }
  }


  /**
   * event click choose TradingProduct item in list
   * @param TradingProduct
   */
  const handleRemoveTradingProductSetting = (TradingProduct: TradingProductSuggest) => {
    const TradingProductSelected = dataSelected.filter(item => (item.productTradingId !== TradingProduct.productTradingId));
    setDataSelected(TradingProductSelected);
    props.updateStateElement(TradingProductSelected);
  }


  /*
  * Render the text component
  */
  return (
    <View style={TradingProductSuggestStyles.stretchView}>
      <View>
        {renderLabel()}
        <TouchableOpacity style={TradingProductSuggestStyles.labelInput}
          onPress={() => setModalVisible(true)}>
          <Text style={TradingProductSuggestStyles.labelInput}>
            {props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}
          </Text>
        </TouchableOpacity>

        {/* View list save setting data */}
        {!props.hiddenSelectedData &&
          _.map(viewAll ? dataSelected : dataSelected.slice(0, LIMIT_VIEW_SELECTED_TRADINGPRODUCT), item => {
            return (
              <TradingProductItem
                typeView={props.typeShowResult}
                item={item}
                statusSelectedItem={statusSelectedItem.get(`${item.productTradingId}`)}
                setVisible={(item) => setVisible(item)}
                handleRemoveTradingProductSetting={(item) => handleRemoveTradingProductSetting(item)}
                currencyUnit={currencyUnit}
              >
              </TradingProductItem>

            )
          })}
      </View >
      {!props.hiddenSelectedData && !viewAll &&
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={TradingProductSuggestStyles.linkNextPage}>
            {`${translate(messages.alertRestRecordBegin)}${(dataSelected.length - LIMIT_VIEW_SELECTED_TRADINGPRODUCT)}${translate(messages.alertRestRecordEnd)}`}
          </Text>
        </TouchableOpacity>
      }
      <View>
        {/* layout modal  */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible || isVisibleDetailSearchModal || isVisibleResultSearchModal}
          onRequestClose={() => handleCloseModal()}
        >
          {modalVisible &&
            <View style={TradingProductSuggestStyles.modalContainer}>
              <TradingProductSuggestSearchModal
                typeSearch={props.typeSearch}
                fieldLabel={props.fieldLabel}
                currencyUnit={currencyUnit}
                dataSelected={dataSelected}
                isRelation={props.isRelation}
                isCloseDetailSearchModal={isVisibleDetailSearchModal}
                customerIds={props.customerIds ?? []}
                selectedData={handleAddTradingProductSuggestions}
                setConditions={(cond) => setConditions(cond)}
                openDetailSearchModal={() => setIsVisibleDetailSearchModal(true)}
                closeModal={() => setModalVisible(false)}
                exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
              />
            </View>
          }
          {isVisibleDetailSearchModal &&
            <View style={TradingProductSuggestStyles.detailSearchContent}>
              <SearchDetailScreen
                updateStateElement={(cond: ISearchCondition[]) => setConditions(cond)}
                closeDetaiSearchModal={() => setIsVisibleDetailSearchModal(false)}
                openResultSearchModal={() => setIsVisibleResultSearchModal(true)}
              />
            </View>
          }
          {isVisibleResultSearchModal &&
            <View style={TradingProductSuggestStyles.detailSearchContent}>
              <TradingProductSuggestResultSearchView
                updateStateElement={(listTradingProduct: TradingProductSuggest[]) => {
                  setTradingProductSelected(listTradingProduct);
                  setIsVisibleDetailSearchModal(false);
                  //ReRender to set viewAll 1 time
                  SetReRender(reRender === false)
                }}
                isRelation={props.isRelation}
                typeSearch={props.typeSearch}
                currencyUnit={currencyUnit}
                searchConditions={conditions}
                closeModal={() => {
                  setModalVisible(false);
                  setIsVisibleResultSearchModal(false)
                }}
                exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
              />
            </View>
          }
        </Modal>
      </View >
    </View >

  );
}
