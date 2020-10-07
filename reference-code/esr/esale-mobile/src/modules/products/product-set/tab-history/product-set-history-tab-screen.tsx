import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import {
  HistorySetProduct,
  getProductSetHistory,
} from "../../products-repository";
import { Icon } from "../../../../shared/components/icon";
import { messages } from "../product-set-details-messages";
import { translate } from "../../../../config/i18n";
import { TabHistoryStyles } from "../product-set-details-style";
import { productSetHistorySelector } from "../product-set-details-selector";
import { productActions } from "../product-set-details-reducer";
import { ProductSetDetailScreenRouteProp } from "../../../../config/constants/root-stack-param-list";
import moment from "moment";
import {
  FORMAT_DATE,
  TIME_FORMAT,
  FORMAT_DATE_JP,
} from "../../../../config/constants/constants";

// TODO use when api error
// const DUMMY_HISTORY_RESPONSE = {
//   contentChanges: [
//     {
//       createdDate: "2019/15/10 15:50",
//       createdUserId: 12,
//       createdUserName: "山田",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプA","new":"タイプB"},"memo":{"old":"なし","new":"メモ B"}}',
//       reasonEdit: "変更理由A",
//     },
//     {
//       createdDate: "2019/14/10 20:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//       reasonEdit: "変更理由A",
//     },
//     {
//       createdDate: "2019/14/10 20:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//       reasonEdit: "変更理由A",
//     },
//     {
//       createdDate: "2019/14/10 20:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//       reasonEdit: "変更理由A",
//     },
//     {
//       createdDate: "2019/14/10 15:50",
//       createdUserId: 13,
//       createdUserName: "茂木康汰",
//       createdUserImage:
//         "https://cdn4.iconfinder.com/data/icons/avatars-21/512/avatar-circle-human-male-3-512.png",
//       contentChange:
//         '{"product_name":{"old":"タイプC","new":"タイプA"},"memo":{"old":"なしB","new":"なし"}}',
//       reasonEdit: "変更理由A",
//     },
//   ],
// };

/**
 * Component show product set history
 */

export function ProductSetHistoryTabScreen({productSetId}: any) {
  const historySetSelector = useSelector(productSetHistorySelector);
  const dispatch = useDispatch();
  // const routes: ProductSetDetailScreenRouteProp = useRoute();

  /**
   * Get list History product
   */
  useEffect(() => {
    // const { params } = routes;
    // const { productSetId } = params;
    const param = {
      productId: productSetId,
      currentPage: 1,
      limit: 30,
    };

    async function getProductHistorySet() {
      const listProductSetHistory = await getProductSetHistory(param, {});
      if (listProductSetHistory) {
        dispatch(
          productActions.getProductHistories(
            listProductSetHistory.data.productSetHistory
          )
        );
      }
    }
    getProductHistorySet();
  }, []);

  /**
   * Render content change of product
   * @param check
   * @param before
   * @param after
   */
  const renderChangedContent = (
    check: boolean,
    before: string,
    after: string
  ) => (
    <>
      {check && (
        <View style={TabHistoryStyles.changedContainer}>
          <Text>:{before}</Text>
          <Icon name="fowardArrow" style={TabHistoryStyles.arrowIcon} />
          <Text>{after}</Text>
        </View>
      )}
    </>
  );

  return (
    <ScrollView style={TabHistoryStyles.container}>
      {historySetSelector.map((history: HistorySetProduct, index: number) => {
        const {
          contentChange = "",
          createdDate = "",
          createdUserName = "",
          createdUserImage = "",
        } = history;

        const objectContentChange = JSON.parse(contentChange);
        const isChangeProductName = "product_name" in objectContentChange;
        const isChangeMemo = "memo" in objectContentChange;
        const { product_name = {}, memo = {} } = objectContentChange;
        return (
          <View key={index.toString()} style={TabHistoryStyles.itemContainer}>
            <View style={TabHistoryStyles.timeLine}>
              <View style={TabHistoryStyles.roundView} />
              {index !== historySetSelector.length - 1 && (
                <View style={TabHistoryStyles.verticalLine} />
              )}
            </View>
            <View style={TabHistoryStyles.contentHistory}>
              <View style={TabHistoryStyles.labelContainer}>
                <Text style={TabHistoryStyles.historyLabel}>
                  {index !== historySetSelector.length - 1
                    ? translate(messages.changeHistory)
                    : translate(messages.createHistory)}
                </Text>
              </View>
              {index !== historySetSelector.length - 1 && (
                <>
                  <View style={TabHistoryStyles.dataContent}>
                    <View>
                      {isChangeProductName && (
                        <Text style={TabHistoryStyles.propertyLabel}>
                          {translate(messages.productNameHistory)}
                        </Text>
                      )}
                      {isChangeMemo && (
                        <Text style={TabHistoryStyles.propertyLabel}>
                          {translate(messages.memoNameHistory)}
                        </Text>
                      )}
                    </View>
                    <View>
                      {renderChangedContent(
                        isChangeProductName,
                        product_name.old,
                        product_name.new
                      )}
                      {renderChangedContent(isChangeMemo, memo.old, memo.new)}
                    </View>
                  </View>
                  <Text style={TabHistoryStyles.dataContent}>
                    {`${translate(messages.reasonChange)}: ${
                      history.reasonEdit
                    }`}
                  </Text>
                </>
              )}
              <View style={TabHistoryStyles.historyInfo}>
                <Image
                  style={TabHistoryStyles.userAvatar}
                  source={{ uri: createdUserImage }}
                />
                <Text
                  style={[TabHistoryStyles.textInfo, TabHistoryStyles.userName]}
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
      })}
    </ScrollView>
  );
}
