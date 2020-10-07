
import { Image, Text, TouchableOpacity, View, TextInput } from 'react-native';
import { isNil } from 'lodash';
import ProductSuggestStyles from './product-suggest-styles';
import { TypeSelectSuggest } from '../../../../config/constants/enum';
import { Icon } from '../../icon';
import { messages } from './product-suggest-messages';
import { translate } from '../../../../config/i18n';
import { ProductSuggest } from '../interface/product-suggest-interface';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import React, { useEffect, useState } from 'react'
import { CATEGORY_LABEL } from './product-contants';
import StringUtils from '../../../util/string-utils';

interface ProductItemProps {
  typeSearch: number;
  statusSelectedItem: boolean;
  item: ProductSuggest;
  setVisible: (product: ProductSuggest) => void;
  handleRemoveProductSetting: (product: ProductSuggest) => void;
  currencyUnit: string;
  languageCode: any;
  handleUpdateData: () => void
}

/**
 * Component for cart item
 */
export const ProductItem: React.FC<ProductItemProps> = ({
  typeSearch,
  statusSelectedItem,
  item,
  currencyUnit,
  languageCode,
  setVisible,
  handleRemoveProductSetting,
  handleUpdateData
}) => {
  const [quantity, setQuantity] = useState(1);
  const [memo, setMemo] = useState(item.memo)

  useEffect(() => {
    handleUpdateData()
  }, [quantity, memo])

  return (
    <View style={ProductSuggestStyles.touchableSelected}>
      {/**define View depend on TypeSelectSuggest */}
      {
        typeSearch !== TypeSelectSuggest.SINGLE
          ?
          <View style={ProductSuggestStyles.boundViewStyle}>
            <View style={ProductSuggestStyles.boundImageAndDefaultText}>
              {/**image */}
              {
                isNil(item.productImagePath)
                  ?
                  <Icon style={ProductSuggestStyles.iconProduct} name="NoImage" />
                  :
                  < Image style={ProductSuggestStyles.iconProduct} source={{ uri: item.productImagePath }} />
              }
              < View style={ProductSuggestStyles.defaulView}>
                <Text style={ProductSuggestStyles.suggestText}>{StringUtils.getFieldLabel(item, CATEGORY_LABEL, languageCode)}</Text>
                <Text style={ProductSuggestStyles.productName}>{item.productName}</Text>
                <Text style={ProductSuggestStyles.suggestText}>{item.memo}</Text>
                <Text style={ProductSuggestStyles.priceText}>{translate(messages.totalPrice).concat(" : ")}{item.unitPrice * (item.quantity ?? 1)}{currencyUnit}</Text>
              </View>

            </View>
            {/**extension item */}
            {
              statusSelectedItem
                ?
                <View>
                  <View
                    style={ProductSuggestStyles.extensionView}
                  >
                    <View style={[ProductSuggestStyles.rowExtensionStyle, { paddingVertical: 20 }]}>
                      <Text style={ProductSuggestStyles.extensionTextStyle}>{translate(messages.totalUnitPrice)}</Text>
                      <Text style={ProductSuggestStyles.totalAmountStyle}>{item.unitPrice}{currencyUnit}</Text>
                    </View>
                    <View style={ProductSuggestStyles.rowExtensionStyle}>
                      <Text style={ProductSuggestStyles.extensionTextStyle}>{translate(messages.quantity)}</Text>
                      <TextInput
                        defaultValue={"1"}
                        value={
                          isNil(item.quantity) ? "1" : item.quantity.toString()
                        }
                        keyboardType="numeric"
                        style={ProductSuggestStyles.inputQuantumStyle}
                        onChangeText={(value) => {
                          setQuantity(parseInt(value));
                          item.quantity = parseInt(value === TEXT_EMPTY ? "0" : value);
                        }}
                        onEndEditing={() => {
                          if (item.quantity === 0) {
                            setQuantity(1);
                            item.quantity = 1;
                          }
                        }}
                      />
                    </View>
                    <View style={ProductSuggestStyles.rowExtensionStyle}>
                      <View>
                        <Text style={[ProductSuggestStyles.extensionTextStyle, {}]}>{translate(messages.note)}</Text>
                        <TextInput
                          style={{}}
                          placeholder={translate(messages.memoPlaceholder)}
                          value={memo}
                          onChangeText={(text) => {
                            setMemo(text)
                            item.memo = text
                          }} />
                      </View>
                    </View>
                  </View>
                  {/**Close extension*/}
                  <View>
                    <TouchableOpacity
                      style={ProductSuggestStyles.toucherCloseExtension}
                      onPress={() => {
                        setVisible(item)
                      }}
                    >
                      <Icon style={ProductSuggestStyles.iconCloseExtensionStyle} name="iconCloseExtension" />
                    </TouchableOpacity>
                  </View>
                </View>
                : <View>
                  <TouchableOpacity
                    style={ProductSuggestStyles.toucherCloseExtension}
                    onPress={() => {
                      setVisible(item)
                    }}
                  >
                    <View style={{ height: 2, width: 321, backgroundColor: '#E5E5E5', position: "absolute", marginTop: 15 }}>
                    </View>
                    <Icon style={ProductSuggestStyles.iconCloseExtensionStyle} name="iconOpenExtension" />
                  </TouchableOpacity>
                </View>
            }

            <TouchableOpacity
              style={ProductSuggestStyles.toucherDelete}
              onPress={() => {
                handleRemoveProductSetting(item);
              }}>
              <Icon style={ProductSuggestStyles.iconListDelete} name="iconDelete" />
            </TouchableOpacity>
          </View>
          :
          <View style={ProductSuggestStyles.viewSingleStyle}>
            <View style={ProductSuggestStyles.defaulView}>
              <Text style={ProductSuggestStyles.suggestText}>{StringUtils.getFieldLabel(item, CATEGORY_LABEL, languageCode)}</Text>
              <Text style={ProductSuggestStyles.productNameSingle}>{item.productName}</Text>
              <Text style={ProductSuggestStyles.suggestText}>{item.unitPrice}{currencyUnit}</Text>
            </View>
            <TouchableOpacity
              style={ProductSuggestStyles.iconCheckView}
              onPress={() => {
                handleRemoveProductSetting(item);
              }}>
              <Icon style={ProductSuggestStyles.iconListDelete} name="iconDelete" />
            </TouchableOpacity>
          </View>
      }
    </View>
  );
};