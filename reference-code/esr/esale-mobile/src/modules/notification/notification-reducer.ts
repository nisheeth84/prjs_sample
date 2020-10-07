import {
  PayloadAction,
  SliceCaseReducers,
  createSlice,
} from "@reduxjs/toolkit";
import {
  ListNotificationResponse,
  NotificationDataResponse,
} from "./notification-reponsitory";
import { appStatus } from "../../config/constants";
// import { DUMMY_PRODUCT } from "./product-details-screen"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const moment = require("moment");

export interface NotificationState {
  messages: Array<ListNotificationResponse>;
  status: string;
}

export interface NotificationReducers
  extends SliceCaseReducers<NotificationState> {}

const notificationSlice = createSlice<NotificationState, NotificationReducers>({
  name: "notification",
  initialState: {
    messages: [],
    status: appStatus.PENDING,
  },
  reducers: {
    getMessages(state, { payload }: PayloadAction<NotificationDataResponse>) {
      state.messages = payload.data;
      state.status = appStatus.SUCCESS;
    },
    updateNotification(state, { payload }) {
      const array = state.messages;
      const indexChange = array.findIndex(
        (item) => payload === item.notificationId
      );
      array[indexChange].confirmNotificationDate = moment().format(
        "DD/MM/YYYY HH:mm"
      );
      state.messages = array;
    },
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;
