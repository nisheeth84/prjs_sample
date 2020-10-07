/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { notificationActions } from "./notification-reducer";
import { ListNotificationSelector } from "./notification-selector";
import { styles } from "./notification-style";
import {
  getNotifications,
  updateStatusNotifications,
} from "./notification-reponsitory";
import { authorizationSelector } from "../login/authorization/authorization-selector";
import { LanguageCode } from "../../config/constants/enum";
import { utcToTz, DATE_TIME_FORMAT } from "../../shared/util/date-utils";
import { APP_DATE_FORMAT_ES } from "../../config/constants/constants";

export const ListNotification = () => {
  const listNotification = useSelector(ListNotificationSelector);
  const authState = useSelector(authorizationSelector);
  const dispatch = useDispatch();
  const languageCode = authState?.languageCode || LanguageCode.JA_JP;
  useEffect(() => {
    async function getListNotifications() {
      const params = {
        textSearch: "",
      };
      const notificationResponse = await getNotifications(params, {});
      if (notificationResponse) {
        handleError(notificationResponse);
      }
    }
    getListNotifications();
  }, []);

  /**
   * handle get list notification
   * @param response
   */
  const handleError = (response: any) => {
    switch (response.status) {
      case 200: {
        dispatch(notificationActions.getMessages(response.data));
        break;
      }
      case 500: {
        break;
      }
      default: {
        break;
      }
    }
  };

  /**
   * convert to user format date
   * @param date
   */
  const convertDate = (date: string) => {
    return utcToTz(
      date,
      authState.timezoneName,
      authState.formatDate || APP_DATE_FORMAT_ES,
      DATE_TIME_FORMAT.User
    );
  };

  /**
   * handle press notification
   * @param id
   * @param updatedDate
   */
  const onChooseNotification = (id: number, updatedDate: string) => {
    // TODO use when api work fine
    async function updateStatusNotification() {
      const params = {
        notificationId: id,
        updatedDate,
      };
      const statusNotificationResponse = await updateStatusNotifications(
        params,
        {}
      );
      if (statusNotificationResponse.status === 200) {
        dispatch(notificationActions.updateNotification(id));
      }
    }
    updateStatusNotification();
  };

  /**
   *
   * @param item render Item notification
   */
  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        onPress={() =>
          item.confirmNotificationDate ||
          onChooseNotification(item.notificationId, item.updatedDate)
        }
        style={[
          item.confirmNotificationDate ? styles.btnWhite : styles.btnGray,
        ]}
      >
        <View style={styles.topContent}>
          <View style={styles.info}>
            <View style={styles.image}>
              {item?.icon && (
                <Image style={styles.icon} source={{ uri: item.icon }} />
              )}
              <Text style={styles.txtAvatar}>{item.notificationSender[0]}</Text>
            </View>

            <Text numberOfLines={1} style={styles.txtSender}>
              {item.notificationSender}
            </Text>
          </View>
          <View style={styles.date}>
            <Text style={styles.txtCreateDate}>
              {convertDate(item.createdNotificationDate)}
            </Text>
          </View>
        </View>
        <Text numberOfLines={3} style={styles.txtMessage}>
          {JSON.parse(item.message)[languageCode]}
        </Text>
        <View />
      </TouchableOpacity>
    );
  };

  /**
   * render list empty
   */
  const renderListEmptyComponent = () => {
    // return <ListEmptyComponent />;
    return <View />; // fix bug id 14980
  };
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(_item, index) => index.toString()}
        extraData={listNotification.length}
        data={listNotification}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={renderListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
