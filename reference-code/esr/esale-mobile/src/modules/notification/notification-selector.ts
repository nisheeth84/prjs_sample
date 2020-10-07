import { createSelector } from "@reduxjs/toolkit";
import _ from "lodash";
import moment from "moment";
import { RootState } from "../../reducers";
import { NotificationState } from "./notification-reducer";

/**
 * notification detail selector
 */

/**
 * notification detail selector
 */

function sortNotification(data: any) {
  const read = _.filter(data, function (o: any) {
    return o.confirmNotificationDate;
  });
  const UnRead = _.filter(data, function (o: any) {
    return !o.confirmNotificationDate;
  });
  const SortRead = _.sortBy(read, [
    function (o) {
      return moment(o.createdNotificationDate, "YYYY/MM/DD HH:mm").unix();
    },
  ]);
  const SortUnRead = _.sortBy(UnRead, [
    function (o) {
      return moment(o.createdNotificationDate, "YYYY/MM/DD HH:mm").unix();
    },
  ]);
  return _.concat(SortUnRead.reverse(), SortRead.reverse());
}

export const ListNotificationSelector = createSelector(
  (state: RootState) => state.notification,
  (notification: NotificationState) => sortNotification(notification.messages)
);

function countNotificationNew(data: any) {

  const UnRead = _.filter(data, function (o: any) {
    return !o.confirmNotificationDate;
  });

  const count = UnRead.length;
  return count;
}

export const CountNotificationNewSelector = createSelector(
  (state: RootState) => state.notification,
  (notification: NotificationState) => countNotificationNew(notification.messages)
);


