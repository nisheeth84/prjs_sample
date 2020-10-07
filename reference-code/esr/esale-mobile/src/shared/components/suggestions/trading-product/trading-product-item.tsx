import { TradingProductSuggest } from "../interface/trading-product-suggest-interface";
import React, { useState, useEffect } from "react";
import TradingProductSuggestStyles from "./trading-product-suggest-styles";
import { TypeShowResult } from "../../../../config/constants/enum";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { isNil, isEmpty } from "lodash";
import { Icon } from "../../icon";
import { messages } from "./trading-product-suggest-messages";
import { translate } from "../../../../config/i18n";
import StringUtils from "../../../util/string-utils";
import { authorizationSelector } from "../../../../modules/login/authorization/authorization-selector";
import { useSelector } from "react-redux";
import moment from "moment";
import { APP_DATE_FORMAT } from "../../../../config/constants/constants";

interface TradingProductItemProps {
  statusSelectedItem: boolean;
  item: TradingProductSuggest;
  setVisible: (TradingProduct: TradingProductSuggest) => void;
  handleRemoveTradingProductSetting: (TradingProduct: TradingProductSuggest) => void;
  currencyUnit: string;
  typeView: number;
}

/**
 * Component for cart item
 */
export const TradingProductItem: React.FC<TradingProductItemProps> = ({
  typeView,
  statusSelectedItem,
  item,
  currencyUnit,
  setVisible,
  handleRemoveTradingProductSetting,

}) => {
  const authorizationState = useSelector(authorizationSelector);
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const newDate = moment(item.endPlanDate, APP_DATE_FORMAT);
    if (newDate.isValid()) {
      setEndDate(newDate.format(authorizationState.formatDate?.toUpperCase()));
    } else {
      setEndDate(item.endPlanDate)
    }
  }, [])

  return (
    <View style={TradingProductSuggestStyles.touchableSelected}>
      {/**define View depend on TypeSelectSuggest */}
      {
        typeView !== TypeShowResult.LIST
          ?
          (
            <View style={TradingProductSuggestStyles.boundViewStyle}>
              <View style={TradingProductSuggestStyles.boundImageAndDefaultText}>

                {/**image */}
                {
                  isNil(item.productImagePath) || isEmpty(item.productImagePath)
                    ?
                    <Icon style={TradingProductSuggestStyles.iconTradingProduct} name="NoImage" />
                    :
                    <Image style={TradingProductSuggestStyles.iconTradingProduct} source={{ uri: item.productImagePath }} />
                }
                < View style={TradingProductSuggestStyles.defaulView}>
                  <Text style={TradingProductSuggestStyles.suggestText}>{StringUtils.getFieldLabel(item, 'productCategoryName', authorizationState.languageCode)}</Text>
                  <Text style={[TradingProductSuggestStyles.productNameSingle, { color: '#0F6DB5' }]}>{item.productName}</Text>
                  <Text style={TradingProductSuggestStyles.suggestText}>{item.memoProduct}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text>{translate(messages.totalPrice)}</Text>
                    <Text style={TradingProductSuggestStyles.totalAmountStyle}>{item.price * item.quantity}</Text>
                    <Text style={{ alignSelf: 'center' }}>{currencyUnit}</Text>
                  </View>
                </View>

              </View>
              {/**extension item */}
              {
                statusSelectedItem
                  ?
                  <View>
                    <View
                      style={TradingProductSuggestStyles.extensionView}
                    >
                      <View style={[TradingProductSuggestStyles.rowExtensionStyle, { paddingVertical: 20 }]}>
                        <Text style={TradingProductSuggestStyles.extensionLabel}>{translate(messages.totalUnitPrice)}</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={TradingProductSuggestStyles.totalAmountStyle}>{item.price}</Text>
                          <Text style={{ alignSelf: 'center' }}>{currencyUnit}</Text>
                        </View>
                      </View>
                      <View style={TradingProductSuggestStyles.rowExtensionStyle}>
                        <Text style={TradingProductSuggestStyles.extensionLabel}>{translate(messages.quantity)}</Text>
                        <Text style={TradingProductSuggestStyles.totalAmountStyle}>{item.quantity}</Text>
                      </View>
                      <View style={[TradingProductSuggestStyles.rowExtensionStyle, { paddingVertical: 20 }]}>
                        <Text style={[TradingProductSuggestStyles.extensionLabel]}>{translate(messages.progressName)}</Text>
                        <Text style={[TradingProductSuggestStyles.extensionText]}>{StringUtils.getFieldLabel(item, 'progressName', authorizationState.languageCode)}</Text>
                      </View>
                      <View style={[TradingProductSuggestStyles.rowExtensionStyle, { paddingVertical: 20 }]}>
                        <Text style={[TradingProductSuggestStyles.extensionLabel]}>{translate(messages.completionDate)}</Text>
                        <Text style={TradingProductSuggestStyles.extensionText}>{endDate}</Text>
                      </View>
                      <View style={[TradingProductSuggestStyles.columnExtensionStyle, { paddingTop: 15 }]}>
                        <Text style={[TradingProductSuggestStyles.extensionLabel]}>{translate(messages.note)}</Text>
                        <Text style={[TradingProductSuggestStyles.extensionText]}>{item.memo}</Text>
                      </View>
                    </View>
                    {/**Close extension*/}
                    <View>
                      <TouchableOpacity
                        style={TradingProductSuggestStyles.toucherCloseExtension}
                        onPress={() => {
                          setVisible(item)
                        }}
                      >
                        <Icon style={TradingProductSuggestStyles.iconCloseExtensionStyle} name="iconCloseExtension" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  : <View>
                    <TouchableOpacity
                      style={TradingProductSuggestStyles.toucherCloseExtension}
                      onPress={() => {
                        setVisible(item)
                      }}
                    >
                      <View style={TradingProductSuggestStyles.separatorStyle}>
                      </View>
                      <Icon style={TradingProductSuggestStyles.iconCloseExtensionStyle} name="iconOpenExtension" />
                    </TouchableOpacity>
                  </View>
              }

              <TouchableOpacity
                style={TradingProductSuggestStyles.toucherDelete}
                onPress={() => {
                  handleRemoveTradingProductSetting(item);
                }}>
                <Icon style={TradingProductSuggestStyles.iconListDelete} name="iconDelete" />
              </TouchableOpacity>
            </View>
          )
          :
          (
            <View style={TradingProductSuggestStyles.viewSingleStyle}>
              <View style={TradingProductSuggestStyles.defaulView}>
                <Text style={TradingProductSuggestStyles.suggestText}>{item.customerName}</Text>
                <Text style={TradingProductSuggestStyles.productNameSingle}>{`${item.productName} (${StringUtils.getFieldLabel(item, 'progressName', authorizationState.languageCode)})`}</Text>
                <Text style={TradingProductSuggestStyles.suggestText}>{item.employeeName}</Text>
              </View>
              <TouchableOpacity
                style={TradingProductSuggestStyles.iconCheckView}
                onPress={() => {
                  handleRemoveTradingProductSetting(item);
                }}>
                <Icon style={TradingProductSuggestStyles.iconListDelete} name="iconDelete" />
              </TouchableOpacity>
            </View>
          )
      }
    </View>
  );
};