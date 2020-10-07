import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import _ from "lodash";
import moment from "moment";
import { HistoryProduct, getProductHistory } from "../../products-repository";
import { Icon } from "../../../../shared/components/icon";
import { messages } from "../product-details-messages";
import { translate } from "../../../../config/i18n";
import { TabHistoryStyles } from "../product-details-style";
import {
  productFieldInfoSelector,
  productsHistorySelector,
} from "../product-details-selector";
import { productActions } from "../product-details-reducer";
import { CommonStyles } from "../../../../shared/common-style";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";

import {
  TEXT_EMPTY,
  FORMAT_DATE,
  TIME_FORMAT,
  FORMAT_DATE_JP,
} from "../../../../config/constants/constants";
import { ListEmptyComponent } from "../../../../shared/components/list-empty/list-empty";
import { LanguageCode } from "../../../../config/constants/enum";

// const DUMMY_HISTORY_RESPONSE = {
//   contentChanges: [
//     {
//       createdDate: "2019/05/10 15:50",
//       createdUserId: 12,
//       createdUserName: "山田",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプA","new":"タイプB"},"memo":{"old":"なし","new":"メモ B"}}',
//     },
//     {
//       createdDate: "2019/04/10 20:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//     },
//     {
//       createdDate: "2019/04/10 20:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//     },
//     {
//       createdDate: "2019/04/10 20:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//     },
//     {
//       createdDate: "2019/03/10 15:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//     },
//     {
//       createdDate: "2019/02/10 15:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '',
//     },
//   ],
// };

export interface PropsHistory {
  productId: number;
}

export function ProductHistoryTabScreen({productId}: any) {
  const productFieldInfo: Array<any> =
    useSelector(productFieldInfoSelector) || [];
  const historySelector: Array<HistoryProduct> =
    useSelector(productsHistorySelector) || [];
  const authSelector: any = useSelector(authorizationSelector);
  const dispatch = useDispatch();

  /**
   * Get list History product then dispatch data
   */
  useEffect(() => {
    // const { params } = routes;
    // const { productId } = params;
    const param = {
      productId,
      currentPage: 1,
      limit: 30,
    };
    async function getProductHistories() {
      const listProductHistory = await getProductHistory(param, {});
      if (listProductHistory) {
        dispatch(
          productActions.getProductHistories(
            listProductHistory.data.productHistory
          )
        );
      }
    }
    getProductHistories();
  }, []);

  /**
   * Render content change of product
   * @param check
   * @param before
   * @param after
   */
  const renderChangedContent = (check: boolean, change: any) => (
    <>
      {check && (
        <View style={TabHistoryStyles.changedContainer}>
          <Text>{`:${change.old}`}</Text>
          <Icon name="fowardArrow" style={TabHistoryStyles.arrowIcon} />
          <Text>{change.new}</Text>
        </View>
      )}
    </>
  );

  const findField = (key: string) => {
    const newArray: Array<any> = [...productFieldInfo] || [];
    const findItem = {
      ...newArray.find((field: any) => {
        return field.fieldName === key;
      }),
    };
    const labelObject = {
      ...JSON.parse(
        _.isUndefined(findItem.fieldLabel) ? null : findItem.fieldLabel
      ),
    };
    const label =
      labelObject[authSelector.languageCode || LanguageCode.JA_JP] || TEXT_EMPTY;
    return label;
  };

  return (
    <ScrollView style={CommonStyles.flex1}>
      <SafeAreaView style={CommonStyles.flex1}>
        {historySelector && historySelector.length > 0 ? (
          historySelector.map((history: HistoryProduct, index: number) => {
            const {
              contentChange = TEXT_EMPTY,
              createdDate = TEXT_EMPTY,
              createdUserName = TEXT_EMPTY,
              createdUserImage = TEXT_EMPTY,
            } = history;
            const objectContentChange = contentChange
              ? JSON.parse(contentChange)
              : {};
            const keyChange = Object.keys(objectContentChange)[0] || TEXT_EMPTY;

            return (
              <View
                key={index.toString()}
                style={TabHistoryStyles.itemContainer}
              >
                <View style={TabHistoryStyles.timeLine}>
                  <View style={TabHistoryStyles.roundView} />
                  {index !== historySelector.length - 1 && (
                    <View style={TabHistoryStyles.verticalLine} />
                  )}
                </View>
                <View style={TabHistoryStyles.contentHistory}>
                  <View style={TabHistoryStyles.labelContainer}>
                    <Text style={TabHistoryStyles.historyLabel}>
                      {!_.isEmpty(objectContentChange)
                        ? translate(messages.changeHistory)
                        : translate(messages.createHistory)}
                    </Text>
                  </View>
                  {!_.isEmpty(objectContentChange) && (
                    <View style={TabHistoryStyles.dataContent}>
                      <View>
                        {keyChange && (
                          <Text style={TabHistoryStyles.propertyLabel}>
                            {findField(keyChange)}
                          </Text>
                        )}
                      </View>
                      <View>
                        {renderChangedContent(
                          true,
                          objectContentChange[keyChange]
                        )}
                      </View>
                    </View>
                  )}
                  <View style={[TabHistoryStyles.historyInfo]}>
                    <Image
                      style={TabHistoryStyles.userAvatar}
                      source={{ uri: createdUserImage }}
                    />
                    <Text
                      style={[
                        TabHistoryStyles.textInfo,
                        TabHistoryStyles.userName,
                      ]}
                    >
                      {createdUserName}
                    </Text>
                    <Text
                      style={[
                        TabHistoryStyles.textInfo,
                        TabHistoryStyles.dateChange,
                      ]}
                    >
                      {moment(
                        createdDate,
                        `${FORMAT_DATE.YYYY_MM_DD} ${TIME_FORMAT}`
                      ).format(FORMAT_DATE_JP.YYYY_MM_DD)}
                    </Text>
                    <Text
                      style={[
                        TabHistoryStyles.textInfo,
                        TabHistoryStyles.dateChange,
                      ]}
                    >
                      {moment(
                        createdDate,
                        `${FORMAT_DATE.YYYY_MM_DD} ${TIME_FORMAT}`
                      ).format(TIME_FORMAT)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <ListEmptyComponent />
        )}
      </SafeAreaView>
    </ScrollView>
  );
}
