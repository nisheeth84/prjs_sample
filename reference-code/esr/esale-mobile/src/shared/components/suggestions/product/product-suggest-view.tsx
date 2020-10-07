import ProductSuggestStyles from './product-suggest-styles';
import React, { useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';
import { IProductSuggestProps, ProductSuggest } from '../interface/product-suggest-interface';
import { messages } from './product-suggest-messages';

import { translate } from '../../../../config/i18n';
import { ProductSuggestResultSearchView } from './product-suggest-result-search/product-suggest-result-search-view';
import { TypeSelectSuggest } from '../../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import { authorizationSelector } from '../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import _, { cloneDeep } from 'lodash';
import { ProductItem } from './product-item';
import { ProductSuggestSearchModal } from './product-suggest-search-modal/product-suggest-search-modal';
import { getCustomFieldsInfo } from '../repository/product-suggest-repositoty';
import { LIMIT_VIEW_SELECTED_PRODUCT, FIELD_BELONG_PRODUCT, FIELDID_CURRENCY_UNIT } from './product-contants';
import { searchConditionsSelector } from '../../../../modules/search/search-selector';
import { DetailSearch } from '../../../../modules/search/search-detail/search-detail-screen';
import { ServiceName } from '../../../../modules/search/search-enum';


/**
 * Component for searching text fields
 * @param props see IProductSuggestProps
 */
export function ProductSuggestView(props: IProductSuggestProps) {
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<ProductSuggest[]>(props.initData ? props.initData : []);
  const [isVisibleResultSearchModal, setIsVisibleResultSearchModal] = useState(false);
  const [isVisibleDetailSearchModal, setIsVisibleDetailSearchModal] = useState(false);
  const [conditions, setConditions] = useState<any[]>([]);
  const [viewAll, setViewAll] = useState(!(props.initData && props.initData.length > 5));
  const [currencyUnit, setCurrencyUnit] = useState(TEXT_EMPTY);
  const [reRender, SetReRender] = useState(false);
  //state click Product
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  //state item Product used to be Clicked
  const [stateProductBefore, setStateProductBefore] = useState(TEXT_EMPTY);
  const arrayIndex: any = [];
  const searchConditions = useSelector(searchConditionsSelector);

  /**
  * event click view all selection
  */
  const handleViewAll = () => {
    setViewAll(true)
  }

  useEffect(() => {
    dataSelected.length > LIMIT_VIEW_SELECTED_PRODUCT ? setViewAll(false) : setViewAll(true)
  }, [reRender])

  useEffect(() => {
    props.updateStateElement(dataSelected)
  }, [dataSelected])

  useEffect(() => {
    getCurrencyUnit();
  }, [])


  const getCurrencyUnit = async () => {
    const resCustomFields = await getCustomFieldsInfo({ fieldBelong: FIELD_BELONG_PRODUCT });
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
  const handleAddProductSuggestions = (item: ProductSuggest, typeSearch: number) => {
    const isExistEmployee = dataSelected.find(itemProduct => (itemProduct.productId === item.productId))
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
    if (dataSelected.length > LIMIT_VIEW_SELECTED_PRODUCT) {
      setViewAll(false);
    }
  }
  const setVisible = (product: ProductSuggest) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${product.productId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));
    if (keyMap === stateProductBefore) {
      setStateProductBefore(TEXT_EMPTY);
    } else {
      setStateProductBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);

  }
  const setProductSelected = (data: ProductSuggest[]) => {
    switch (props.typeSearch) {
      case TypeSelectSuggest.SINGLE:
        setDataSelected(data);
        break;
      case TypeSelectSuggest.MULTI:
        data.forEach(item => {
          if (dataSelected.findIndex(_item => item.productId === _item.productId) === -1) {
            arrayIndex.push(item);
          }
        })
        setDataSelected(cloneDeep(dataSelected).concat(arrayIndex));
        break;
      default:
        break;
    }
  }


  /**
   * event click choose Product item in list
   * @param Product
   */
  const handleRemoveProductSetting = (product: ProductSuggest) => {
    const ProductSelected = dataSelected.filter(item => (item.productId !== product.productId));
    setDataSelected(ProductSelected);
    props.updateStateElement(ProductSelected);
  }
  /**
  * Render label
  */
  const renderLabel = () => {
    if (props.invisibleLabel) {
      return null;
    } else {
      return (
        <View style={ProductSuggestStyles.labelName}>
          <Text style={ProductSuggestStyles.labelText}>
            {props.fieldLabel}
          </Text>
          {props.isRequire &&
            <View style={ProductSuggestStyles.labelHighlight}>
              <Text style={ProductSuggestStyles.labelTextHighlight}>
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
      setModalVisible(false);
    }
  }

  /*
  * Render the text component
  */
  return (
    <View style={ProductSuggestStyles.stretchView}>
      <View>
        {renderLabel()}
        <TouchableOpacity style={props.isError && ProductSuggestStyles.errorContent}
          onPress={() => setModalVisible(true)}>
          <Text style={ProductSuggestStyles.labelInput}>{props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
            : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
        </TouchableOpacity>

        {/* View list save setting data */}
        {!props.hiddenSelectedData &&
          _.map(viewAll ? dataSelected : dataSelected.slice(0, LIMIT_VIEW_SELECTED_PRODUCT), item => {
            return (
              <ProductItem
                item={item}
                typeSearch={props.typeSearch}
                languageCode={languageCode}
                statusSelectedItem={statusSelectedItem.get(`${item.productId}`)}
                setVisible={(item) => setVisible(item)}
                handleRemoveProductSetting={(item) => handleRemoveProductSetting(item)}
                currencyUnit={currencyUnit}
                handleUpdateData={() => {
                  setDataSelected(_.cloneDeep(dataSelected))
                }}
              />
            )
          })}
      </View >
      {
        !props.hiddenSelectedData && !viewAll &&
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={ProductSuggestStyles.linkNextPage}>
            {`${translate(messages.alertRestRecordBegin)}${(dataSelected.length - LIMIT_VIEW_SELECTED_PRODUCT)}${translate(messages.alertRestRecordEnd)}`}
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
            <View style={ProductSuggestStyles.modalContainer}>
              <ProductSuggestSearchModal
                typeSearch={props.typeSearch}
                fieldLabel={props.fieldLabel}
                currencyUnit={currencyUnit}
                dataSelected={dataSelected}
                isRelation={props.isRelation}
                isCloseDetailSearchModal={isVisibleDetailSearchModal}
                selectedData={handleAddProductSuggestions}
                setConditions={(cond) => setConditions(cond)}
                openDetailSearchModal={() => setIsVisibleDetailSearchModal(true)}
                closeModal={() => setModalVisible(false)}
                exportError={(error) => !_.isNil(props.exportError) && props.exportError(error)}
              />
            </View>
          }
          {isVisibleDetailSearchModal &&
            <View style={ProductSuggestStyles.detailSearchContent}>
              <DetailSearch
                suggestService={ServiceName.products}
                suggestClose={() => setIsVisibleDetailSearchModal(false)}
                suggestConfirm={() => {
                  setIsVisibleResultSearchModal(true);
                  setConditions(searchConditions ?? []);
                }}
              />
            </View>
          }
          {isVisibleResultSearchModal &&
            <View style={ProductSuggestStyles.detailSearchContent}>
              <ProductSuggestResultSearchView
                updateStateElement={(listProduct: ProductSuggest[]) => {
                  setProductSelected(listProduct);
                  setIsVisibleDetailSearchModal(false);
                  //ReRender to set viewAll 1 time
                  SetReRender(reRender === false)
                }}
                typeSearch={props.typeSearch}
                isRelation={props.isRelation}
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


