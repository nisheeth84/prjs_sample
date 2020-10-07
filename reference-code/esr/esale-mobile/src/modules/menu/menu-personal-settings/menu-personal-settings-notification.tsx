import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import _ from "lodash";
import {
  NotificationSettingStyles,
  changePasswordStyle,
} from "./menu-personal-settings-styles";
import { messages } from "./menu-personal-settings-messages";
import { translate } from "../../../config/i18n";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { ItemSwitch } from "../../../shared/components/switch/item-switch";
import { Icon } from "../../../shared/components/icon";
import { Input } from "../../../shared/components/input";
import { menuSettingActions } from "./menu-settings-reducer";
import { NotificationSettingsSelector } from "./menu-settings-selector";

import {
  FORMAT_DATE,
  NOTIFICATION_SUBTYPE,
  NOTIFICATION_TYPE,
  TEXT_EMPTY,
  TIME_FORMAT,
} from "../../../config/constants/constants";
import {
  getNotificationSetting,
  updateNotificationDetailSetting,
} from "./menu-personal-settings-repository";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import {
  TypeMessage,
  NOTIFICATION_VALIDATE_SETTING,
} from "../../../config/constants/enum";
import { CommonMessage } from "../../../shared/components/message/message";
import { messages as messaageCommon } from "../../../shared/messages/response-messages";
import { ModalCancel } from "../../../shared/components/modal-cancel";

export const NotificationSetting = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userInfo = useSelector(authorizationSelector);
  const notificationSettingsData = useSelector(NotificationSettingsSelector);
  const NOTIFICATION_SUBTYPE_MESSAGE = {
    POST_PERSONAL: [
      TEXT_EMPTY,
      translate(messages.commentedNoti),
      translate(messages.reactionNoti),
      translate(messages.personalCommentNoti),
      translate(messages.personalAdditionalCommentsNoti),
    ],
    REGISTER_SCHEDULE: [TEXT_EMPTY, translate(messages.scheduleRegisteredNoti)],
    REGISTER_TASK: [TEXT_EMPTY, translate(messages.taskSetNoti)],
    FINISH_IMPORT: [
      TEXT_EMPTY,
      translate(messages.postCompletionNoti),
      translate(messages.postCompletionNoti),
    ],
    NOTIFICATION_TASK: [
      TEXT_EMPTY,
      translate(messages.scheduleNoti),
      translate(messages.taskNoti),
      translate(messages.milestoneNoti),
    ],
  };

  /**
   * form validate email
   */
  const emailRegEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  /**
   * array list notification setting
   */
  const [listNotificationSetting, setListNotificationSetting] = useState<
    Array<any>
  >([]);
  /**
   * array list notification daily setting
   */
  const [listNotificationDaily, setListNotificationDaily] = useState<
    Array<any>
  >([]);
  /**
   * check disable or enable button save
   */
  const [isChanged, setChanged] = useState(false);
  const [isShowDirtycheck, setShowDirtycheck] = useState(false);

  /**
   * array list new email
   */
  const [listEmail, setListEmail] = useState([] as Array<string>);
  /**
   * value textInput
   */
  const [email, setEmail] = useState(TEXT_EMPTY);
  /**
   * check error
   */
  const [errorInput, setErrorInput] = useState(false);
  /**
   * set notification time
   */
  const [timeNotification, setTimeNotification] = useState(
    translate(messages.selectTime)
  );
  /**
   * check show Date picker
   */
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  /**
   * text error message
   */
  const [message, setMessage] = useState({
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  });
  const [errorType, setErrorType] = useState(-1);
  /**
   * handle timezone
   */
  const handleTimezone = (
    data: any,
    isNotificationTime: boolean,
    timezoneName: string
  ) => {
    const timezone = moment
      .tz(timezoneName)
      .format()
      .substring(moment.tz(timezoneName).format().lastIndexOf(":") - 3)
      .split(":")
      .map((c) => parseInt(c))
      .reduce((a, b) => a * 60 + (a < 0 ? -b : b), 0);
    if (isNotificationTime) {
      return (data + 1440 + timezone) % 1440;
    }
    return (data + 1440 - timezone) % 1440;
  };
  async function getDataNotificationSettings() {
    const dataNotificationSettingsResponse = await getNotificationSetting(
      { employeeId: userInfo.employeeId },
      {}
    );
    if (dataNotificationSettingsResponse) {
      switch (dataNotificationSettingsResponse.status) {
        case 400:
          alert("Bad request!");
          break;

        case 500:
          alert("Server error!");
          break;

        case 403:
          alert("You have not permission get Field Info Personals!");
          break;

        case 200:
          dispatch(
            menuSettingActions.getNotificationSettings({
              dataNotificationSettings: dataNotificationSettingsResponse.data,
            })
          );
          break;

        default:
          alert("Error");
          break;
      }
    }
  }

  const handleDate = (time: string) => {
    let currentDate = moment().format(`${FORMAT_DATE.YYYY__MM__DD} `) + time;
    if (notificationSettingsData.notificationTime == 0) {
      currentDate = moment().format(
        `${FORMAT_DATE.YYYY__MM__DD} ${TIME_FORMAT}`
      );
    }

    return new Date(currentDate);
  };

  /**
   * call api
   */
  useEffect(() => {
    getDataNotificationSettings();
  }, []);

  useEffect(() => {
    if (message.type == TypeMessage.SUCCESS) {
      setTimeout(() => {
        setMessage({ content: "", type: "" });
        navigation.goBack();
      }, 2000);
    }
  }, [message]);
  /**
   * filter Notification Setting
   * @param dataFilter
   */
  const filterNotificationSetting = (dataFilter: any) => {
    const listNotification = dataFilter.filter((item: any) => {
      return (
        (item.notificationType === NOTIFICATION_TYPE.POST_PERSONAL &&
          NOTIFICATION_SUBTYPE.POST_PERSONAL.indexOf(
            item.notificationSubtype
          ) != -1) ||
        (item.notificationType === NOTIFICATION_TYPE.REGISTER_SCHEDULE &&
          NOTIFICATION_SUBTYPE.REGISTER_SCHEDULE.indexOf(
            item.notificationSubtype
          ) != -1) ||
        (item.notificationType === NOTIFICATION_TYPE.REGISTER_TASK &&
          NOTIFICATION_SUBTYPE.REGISTER_TASK.indexOf(
            item.notificationSubtype
          ) != -1) ||
        (item.notificationType === NOTIFICATION_TYPE.FINISH_IMPORT &&
          NOTIFICATION_SUBTYPE.FINISH_IMPORT.indexOf(
            item.notificationSubtype
          ) != -1)
      );
    });
    const sortListNotification = _.orderBy(
      listNotification,
      ["notificationType", "notificationSubtype"],
      ["asc", "asc"]
    );
    return sortListNotification;
  };
  /**
   * filter Notification Daily Setting
   * @param dataFilter
   */
  const filterNotificationDailySetting = (dataFilter: any) => {
    const listNotificationDaily = dataFilter.filter((item: any) => {
      return (
        NOTIFICATION_SUBTYPE.NOTIFICATION_TASK.indexOf(
          item.notificationSubtype
        ) != -1 && item.notificationType === NOTIFICATION_TYPE.NOTIFICATION_TASK
      );
    });
    const sortListNotificationDaily = _.orderBy(
      listNotificationDaily,
      ["notificationType", "notificationSubtype"],
      ["asc", "asc"]
    );
    return sortListNotificationDaily;
  };
  /**
   * Update notifications are displayed
   */
  useEffect(() => {
    setListNotificationSetting(
      filterNotificationSetting(notificationSettingsData.data)
    );
    setListNotificationDaily(
      filterNotificationDailySetting(notificationSettingsData.data)
    );
    if (notificationSettingsData.employeeId != 0) {
      const newDataNotificationTime = handleTimezone(
        notificationSettingsData.notificationTime,
        true,
        userInfo.timezoneName
      );
      const hour = `0${Math.floor(newDataNotificationTime / 60)}`.slice(-2);
      const minute = `0${
        newDataNotificationTime - Math.floor(newDataNotificationTime / 60) * 60
        }`.slice(-2);
      setTimeNotification(`${hour}:${minute}`);
    }

    const listEmailConvert = notificationSettingsData.email.split(";");
    setListEmail(listEmailConvert);
  }, [notificationSettingsData]);

  /**
   * check notification change
   */
  const checkChangeNotificationData = () => {
    let isChanged = false;
    if (listNotificationSetting.length) {
      const newListNotificationSetting = filterNotificationSetting(
        notificationSettingsData.data
      );

      newListNotificationSetting.forEach((elm: any, index: number) => {
        if (
          elm.isNotification !== listNotificationSetting[index].isNotification
        ) {
          isChanged = true;
        }
      });
      if (isChanged) {
        return isChanged;
      }
    }
    if (listNotificationDaily.length) {
      const newListNotificationDaily = filterNotificationDailySetting(
        notificationSettingsData.data
      );

      newListNotificationDaily.forEach((elm: any, index: number) => {
        if (
          elm.isNotification !== listNotificationDaily[index].isNotification
        ) {
          isChanged = true;
        }
      });
    }
    return isChanged;
  };
  const convertTimeData = (time: any) => {
    handleDate(time);
    const listTime = time.split(":");
    return listTime[0] * 60 + listTime[1] * 1;
  };

  /**
   * check update
   */
  useEffect(() => {
    setChanged(
      _.join(listEmail, ";") != notificationSettingsData.email ||
      checkChangeNotificationData() ||
      (timeNotification != translate(messages.selectTime) &&
        handleTimezone(
          convertTimeData(timeNotification),
          false,
          userInfo.timezoneName
        ) !== notificationSettingsData.notificationTime)
    );
  }, [
    listEmail,
    listNotificationSetting,
    listNotificationDaily,
    timeNotification,
    notificationSettingsData,
  ]);
  /**
   * show date picker
   */
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  /**
   * hide date picker
   */
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  /**
   * set notification time
   * @param date
   */
  const handleConfirm = (date: moment.MomentInput) => {
    hideDatePicker();
    setTimeNotification(moment(date).format(TIME_FORMAT));
    setErrorType(-1);
  };
  /**
   * change checkbox item
   * @param item
   * @param index
   */
  const onSetListNotification = (item: any, index: number) => {
    if (item.notificationType === NOTIFICATION_TYPE.NOTIFICATION_TASK) {
      const newListNotificationDaily = [...listNotificationDaily];
      const notificationSettingItem = {
        ...newListNotificationDaily[index],
        isNotification: !item.isNotification,
      };
      newListNotificationDaily[index] = notificationSettingItem;
      setListNotificationDaily(newListNotificationDaily);
    } else {
      const newListNotificationSetting = [...listNotificationSetting];
      const notificationSettingItem = {
        ...newListNotificationSetting[index],
        isNotification: !item.isNotification,
      };
      newListNotificationSetting[index] = notificationSettingItem;
      setListNotificationSetting(newListNotificationSetting);
    }
  };

  /**
   * remove email selected from  list new email array
   * @param item
   */
  const removeNewEmail = (item: string) => {
    const newListEmail = listEmail.filter((elm) => elm !== item);
    setListEmail(newListEmail);
  };

  /**
   * push new email to list new email array
   */
  const addNewEmail = () => {
    if (!emailRegEx.test(email.trim())) {
      setErrorInput(true);
      setMessage({
        content: translate(messages.ERR_LOG_0002),
        type: TypeMessage.ERROR,
      });
      return;
    }
    if (listEmail.findIndex((elm) => elm == email) != -1) {
      setErrorInput(true);
      setMessage({
        content: `${email}${translate(messages.ERR_EMP_0002)}`,
        type: TypeMessage.ERROR,
      });
      return;
    }
    setMessage({
      content: TEXT_EMPTY,
      type: TEXT_EMPTY,
    });
    const newListEmail = [...listEmail, email];
    setListEmail(newListEmail);
    setEmail(TEXT_EMPTY);
    setErrorInput(false);
  };

  /**
   * render item new email
   * @param item
   */
  const itemNewEmail = (item: string, index: number) => {
    return (
      <View key={item} style={NotificationSettingStyles.boxContentNewEmail}>
        <Text numberOfLines={1} style={NotificationSettingStyles.txtEmail}>
          {item}
        </Text>
        {index != 0 && (
          <TouchableOpacity onPress={() => removeNewEmail(item)}>
            <Icon name="close" style={NotificationSettingStyles.iconClose} />
          </TouchableOpacity>
        )}
      </View>
    );
  };
  /**
   * handle message
   */
  const handleMessage = (item: any) => {
    switch (item.notificationType) {
      case NOTIFICATION_TYPE.NOTIFICATION_TASK:
        return NOTIFICATION_SUBTYPE_MESSAGE.NOTIFICATION_TASK[
          item.notificationSubtype
        ];
      case NOTIFICATION_TYPE.FINISH_IMPORT:
        return NOTIFICATION_SUBTYPE_MESSAGE.FINISH_IMPORT[
          item.notificationSubtype
        ];
      case NOTIFICATION_TYPE.POST_PERSONAL:
        return NOTIFICATION_SUBTYPE_MESSAGE.POST_PERSONAL[
          item.notificationSubtype
        ];
      case NOTIFICATION_TYPE.REGISTER_SCHEDULE:
        return NOTIFICATION_SUBTYPE_MESSAGE.REGISTER_SCHEDULE[
          item.notificationSubtype
        ];
      case NOTIFICATION_TYPE.REGISTER_TASK:
        return NOTIFICATION_SUBTYPE_MESSAGE.REGISTER_TASK[
          item.notificationSubtype
        ];
      default:
        return TEXT_EMPTY;
    }
  };
  /**
   * render list notification daily
   */
  const renderNotificationDaily = () => {
    return (
      <>
        <Text style={NotificationSettingStyles.spaceTop50}>
          {translate(messages.notificationDaily)}
        </Text>
        <View style={NotificationSettingStyles.notificationDaily}>
          {listNotificationDaily.map((item, index) => (
            <ItemSwitch
              content={handleMessage(item)}
              key={item.notificationSubtypeName}
              isEnabled={item.isNotification}
              toggleSwitch={() => onSetListNotification(item, index)}
            />
          ))}
          <View style={NotificationSettingStyles.chooseNotificationTimeView}>
            <Text>{translate(messages.to)}</Text>
            <TouchableOpacity
              onPress={() => showDatePicker()}
              style={[
                NotificationSettingStyles.btnChooseNotificationTime,
                errorType == NOTIFICATION_VALIDATE_SETTING.TIME &&
                NotificationSettingStyles.themeError,
              ]}
            >
              <Text style={NotificationSettingStyles.txtChooseNotificationTime}>
                {timeNotification}
              </Text>
            </TouchableOpacity>
            <Text>{translate(messages.sendTo)}</Text>
          </View>
        </View>
      </>
    );
  };

  /**
   * render list new email
   */
  const renderListEmail = () => {
    return (
      <>
        <Text style={NotificationSettingStyles.spaceTop30}>
          {translate(messages.emailAddress)}
        </Text>
        <View style={NotificationSettingStyles.listEmail}>
          {listEmail.map((item, index) => itemNewEmail(item, index))}
        </View>
      </>
    );
  };

  /**
   * render input and button add new email
   */
  const renderBoxAddNewEmail = () => {
    return (
      <>
        <Input
          error={errorInput}
          value={email}
          editable={listEmail.length < 6}
          onChangeText={(text) => setEmail(text)}
          style={NotificationSettingStyles.boxTextEmail}
        />
        <TouchableOpacity
          disabled={!email || listEmail.length >= 6}
          style={NotificationSettingStyles.boxAddEmail}
          onPress={() => addNewEmail()}
        >
          <Icon name="plusGray" />
          <Text
            style={
              !email && NotificationSettingStyles.txtChooseNotificationTime
            }
          >
            {translate(messages.addEmailAddress)}
          </Text>
        </TouchableOpacity>
      </>
    );
  };

  const updateNotificationSetting = async () => {
    if (
      notificationSettingsData.employeeId == 0 &&
      listNotificationSetting.findIndex((elm) => elm.isNotification) == -1 &&
      listNotificationDaily.findIndex((elm) => elm.isNotification) == -1
    ) {
      setErrorType(NOTIFICATION_VALIDATE_SETTING.CONTENT);
      setMessage({
        content: translate(messaageCommon.ERR_COM_0013),
        type: TypeMessage.ERROR,
      });
      return;
    }
    if (
      notificationSettingsData.employeeId == 0 &&
      timeNotification == translate(messages.selectTime)
    ) {
      setErrorType(NOTIFICATION_VALIDATE_SETTING.TIME);
      setMessage({
        content: translate(messaageCommon.ERR_COM_0013),
        type: TypeMessage.ERROR,
      });
      return;
    }

    const newFinishImportSetting = listNotificationSetting.filter(
      (elm) => elm.notificationType == 11
    )[0];

    const newListNotificationSetting = [
      ...listNotificationSetting,
      {
        notificationType: newFinishImportSetting.notificationType,
        notificationSubtype: 2,
        isNotification: newFinishImportSetting.isNotification,
      },
    ];

    const dataTimeSetting = handleTimezone(
      convertTimeData(timeNotification),
      false,
      userInfo.timezoneName
    );
    const params = {
      employeeId: userInfo.employeeId,
      dataSettingNotifications: [
        ...listNotificationDaily,
        ...newListNotificationSetting,
      ].map((elm) => {
        return {
          notificationType: elm.notificationType,
          notificationSubtype: elm.notificationSubtype,
          isNotification: elm.isNotification,
        };
      }),
      notificationTime: dataTimeSetting,
      emails: listEmail,
    };

    const updateNotificationDetailSettingResponse = await updateNotificationDetailSetting(
      params,
      {}
    );

    if (updateNotificationDetailSettingResponse?.status == 200) {
      getDataNotificationSettings();
      setMessage({
        content: translate(messages.INFO_COM_0004),
        type: TypeMessage.SUCCESS,
      });
      setErrorType(-1);
      return;
    }
    setMessage({
      content: translate(messages.ERROR_LOG_0009),
      type: TypeMessage.ERROR,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : undefined}
      style={NotificationSettingStyles.container}
    >
      <AppBarModal
        onClose={() =>
          isChanged ? setShowDirtycheck(true) : navigation.goBack()
        }
        title={translate(messages.notificationSetting)}
        titleButtonCreate={translate(messages.save)}
        isEnableButtonCreate={isChanged}
        onCreate={updateNotificationSetting}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={NotificationSettingStyles.containerContent}
      >
        {message.type == TypeMessage.ERROR && (
          <View style={changePasswordStyle.boxMessage}>
            <CommonMessage content={message.content} type={message.type} />
          </View>
        )}
        <Text>{translate(messages.receiveSettings)}</Text>
        <View
          style={
            errorType == NOTIFICATION_VALIDATE_SETTING.CONTENT &&
            NotificationSettingStyles.themeError
          }
        >
          {listNotificationSetting.map((item, index) => (
            <ItemSwitch
              content={handleMessage(item)}
              key={item.notificationSubtypeName}
              isEnabled={item.isNotification}
              toggleSwitch={() => onSetListNotification(item, index)}
            />
          ))}
        </View>
        {listNotificationDaily.length > 0 && renderNotificationDaily()}
        {renderListEmail()}
        {renderBoxAddNewEmail()}
      </ScrollView>
      {message.type == TypeMessage.SUCCESS && (
        <View style={changePasswordStyle.boxMessageSuccess}>
          <CommonMessage content={message.content} type={message.type} />
        </View>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={handleDate(timeNotification)}
      />
      <ModalCancel
        visible={isShowDirtycheck}
        titleModal={translate(messages.confirmBack)}
        textBtnRight={translate(messages.ok)}
        textBtnLeft={translate(messages.cancel)}
        btnBlue
        onPress={() => navigation.goBack()}
        closeModal={() => setShowDirtycheck(!isShowDirtycheck)}
        contentModal={translate(messages.WAR_COM_0005)}
        containerStyle={NotificationSettingStyles.boxConfirm}
        textStyle={NotificationSettingStyles.txtContent}
      />
    </KeyboardAvoidingView>
  );
};
