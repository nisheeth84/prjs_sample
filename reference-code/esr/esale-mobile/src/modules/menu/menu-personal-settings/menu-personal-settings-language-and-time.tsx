import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import {
  LanguageAndTimeSettingStyles,
  changePasswordStyle,
  NotificationSettingStyles,
} from "./menu-personal-settings-styles";
import { messages } from "./menu-personal-settings-messages";
import { translate } from "../../../config/i18n";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { Dropdown } from "../../../shared/components/dropdown";
import {
  SelectedTimeAndLanguage,
  TypeMessage,
} from "../../../config/constants/enum";
import { FORMAT_DATE, TEXT_EMPTY, TIMEZONE_NAME } from "../../../config/constants/constants";
import { ModalBottomOption } from "../../../shared/components/modal-bottom-option/modal-bottom-option";
import { menuSettingActions } from "./menu-settings-reducer";
import {
  EmployeeSelector,
  ListLanguagesSelector,
  ListTimeZoneSelector,
} from "./menu-settings-selector";
import {
  getListLanguages,
  getListTimeZone,
  updateSettingEmployee,
} from "./menu-personal-settings-repository";
import { CommonMessage } from "../../../shared/components/message/message";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { authorizationActions } from "../../login/authorization/authorization-reducer";
import AsyncStorage from "@react-native-community/async-storage";

export const LanguageAndTimeSetting = () => {
  const formatDate = [
    {
      formatDateId: 1,
      formatDate: FORMAT_DATE.YYYY_MM_DD,
      formatDateName: moment().format(FORMAT_DATE.YYYY_MM_DD),
    },
    {
      formatDateId: 2,
      formatDate: FORMAT_DATE.MM_DD_YYYY,
      formatDateName: moment().format(FORMAT_DATE.MM_DD_YYYY),
    },
    {
      formatDateId: 3,
      formatDate: FORMAT_DATE.DD_MM_YYYY,
      formatDateName: moment().format(FORMAT_DATE.DD_MM_YYYY),
    },
  ];
  const navigation = useNavigation();
  const dispatch = useDispatch();
  /**
   * check disable or enable button save
   */
  const [isNotChanged, setChanged] = useState(false);
  const [isShowDirtycheck, setShowDirtycheck] = useState(false);

  const employeeData = useSelector(EmployeeSelector);
  const authData = useSelector(authorizationSelector);
  /**
   * text error message
   */
  const [message, setMessage] = useState({
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  });

  /**
   * list data language
   */
  const listLanguage = useSelector(ListLanguagesSelector);
  /**
   * check type update
   */
  const [selectedType, setSelectedType] = useState(-1);
  /**
   * show language
   */
  const [language, setLanguage] = useState<any>(-1);
  /**
   * show timezone
   */
  const [timeZone, setTimezone] = useState<any>(-1);
  /**
   * show date format
   */
  const [dateFormat, setDateFormat] = useState<any>(
    employeeData?.formatDateId
      ? formatDate.find((el) => el.formatDateId === employeeData.formatDateId)
      : -1
  );

  useEffect(() => {
    if (employeeData?.languageId) {
      setLanguage(
        listLanguage.find((el) => el.languageId === employeeData.languageId)
      );
    }
  }, [listLanguage]);
  /**
   * list data timezone
   */
  const listTimeZone = useSelector(ListTimeZoneSelector);

  useEffect(() => {
    if (employeeData?.timezoneId) {
      setTimezone(
        listTimeZone.find(
          (el: any) => el.timezoneId === employeeData.timezoneId
        )
      );
    }
  }, [listTimeZone]);

  /**
   * call api
   */
  useEffect(() => {
    Promise.all([getListLanguages(), getListTimeZone()])
      .then((values) => {
        if (
          values.findIndex((elm) => {
            return elm.status !== 200;
          }) != -1
        ) {
          alert("error");
        }
        dispatch(
          menuSettingActions.getListLanguages({
            listLanguages: values[0].data.languagesDTOList,
          })
        );
        dispatch(
          menuSettingActions.getListTimeZone({
            listTimeZones: values[1].data.timezones,
          })
        );
      })
      .catch();
  }, []);

  /**
   * check update
   */

  useEffect(() => {
    if (message.type == TypeMessage.SUCCESS) {
      setEmptyMessageOnSeconds();
    }
  }, [employeeData]);

  useEffect(() => {
    setChanged(
      language?.languageId == employeeData?.languageId &&
      timeZone?.timezoneId == employeeData?.timezoneId &&
      dateFormat?.formatDateId == employeeData?.formatDateId
    );
  }, [language, timeZone, dateFormat]);

  const updateSettingEmployeeFunc = async () => {
    const params = {
      languageId: language?.languageId || null,
      timezoneId: timeZone?.timezoneId || null,
      formatDateId: dateFormat?.formatDateId || null,
    };

    const data = await updateSettingEmployee(params);
    setChanged(true);
    if (data?.status == 200) {
      dispatch(
        authorizationActions.setAuthorization({
          ...authData,
          formatDate: dateFormat?.formatDate || authData.formatDate,
          timezoneName: timeZone?.timezoneShortName || authData.timezoneName,
          languageCode: language?.languageCode || authData.languageCode,
        })
      );
      await AsyncStorage.setItem(TIMEZONE_NAME, timeZone?.timezoneShortName || authData.timezoneName);
      dispatch(
        menuSettingActions.getEmployee({
          data: {
            ...employeeData,
            languageId: language?.languageId,
            timezoneId: timeZone?.timezoneId,
            formatDateId: dateFormat?.formatDateId,
          },
        })
      );

      setMessage({
        content: translate(messages.INFO_COM_0004),
        type: TypeMessage.SUCCESS,
      });

      setEmptyMessageOnSeconds();
      return;
    }
    setMessage({
      content: translate(messages.ERROR_LOG_0009),
      type: TypeMessage.ERROR,
    });
  };
  const setEmptyMessageOnSeconds = () => {
    setTimeout(() => {
      setMessage({
        content: TEXT_EMPTY,
        type: TEXT_EMPTY,
      });
      navigation.goBack();
    }, 2000);
  }

  /**
   * show and pass data to modal
   * @param status
   */
  const onSelect = (status: number) => {
    setSelectedType(status);
  };
  /**
   * close modal
   */
  const onCloseModal = () => {
    setSelectedType(-1);
  };
  /**
   * handle selected field
   * @param item
   */
  const onChangeSetting = (item: any) => {
    switch (selectedType) {
      case SelectedTimeAndLanguage.LANGUAGE:
        setLanguage(item);
        break;
      case SelectedTimeAndLanguage.TIME_ZONE:
        setTimezone(item);
        break;
      default:
        setDateFormat(item);
        break;
    }
    setSelectedType(-1);
  };
  /**
   * check data pass to modal
   */
  const checkOptionModal = () => {
    switch (selectedType) {
      case SelectedTimeAndLanguage.LANGUAGE:
        return {
          data: listLanguage,
          fieldName: "languageName",
          item: language,
        };
      case SelectedTimeAndLanguage.TIME_ZONE:
        return {
          data: listTimeZone,
          fieldName: "timezoneName",
          item: timeZone,
        };
      default:
        return {
          data: formatDate,
          fieldName: "formatDateName",
          item: dateFormat,
        };
    }
  };

  return (
    <View style={LanguageAndTimeSettingStyles.container}>
      <AppBarModal
        onClose={() =>
          !isNotChanged ? setShowDirtycheck(true) : navigation.goBack()
        }
        title={translate(messages.languageAndTimeSetting)}
        titleButtonCreate={translate(messages.save)}
        isEnableButtonCreate={!isNotChanged}
        onCreate={updateSettingEmployeeFunc}
      />
      {message.type == TypeMessage.ERROR && (
        <View style={changePasswordStyle.boxMessage}>
          <CommonMessage content={message.content} type={message.type} />
        </View>
      )}

      <Dropdown
        title={translate(messages.language)}
        value={language?.languageName ?? TEXT_EMPTY}
        isSelected={selectedType === SelectedTimeAndLanguage.LANGUAGE}
        containerStyle={LanguageAndTimeSettingStyles.spaceVertical}
        onSelect={() => onSelect(SelectedTimeAndLanguage.LANGUAGE)}
      />

      <Dropdown
        title={translate(messages.timeZone)}
        value={timeZone?.timezoneName ?? TEXT_EMPTY}
        isSelected={selectedType === SelectedTimeAndLanguage.TIME_ZONE}
        containerStyle={LanguageAndTimeSettingStyles.spaceVertical}
        onSelect={() => onSelect(SelectedTimeAndLanguage.TIME_ZONE)}
      />
      <Dropdown
        title={translate(messages.formatDate)}
        value={dateFormat?.formatDateName ?? TEXT_EMPTY}
        isSelected={selectedType === SelectedTimeAndLanguage.DATE_FORMAT}
        containerStyle={LanguageAndTimeSettingStyles.spaceVertical}
        onSelect={() => onSelect(SelectedTimeAndLanguage.DATE_FORMAT)}
      />
      {message.type == TypeMessage.SUCCESS && (
        <View style={changePasswordStyle.boxMessageSuccess}>
          <CommonMessage content={message.content} type={message.type} />
        </View>
      )}
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
      <ModalBottomOption
        dataOption={checkOptionModal().data}
        fieldName={checkOptionModal().fieldName}
        isVisible={selectedType >= 0}
        closeModal={() => onCloseModal()}
        onSelected={(item) => onChangeSetting(item)}
        itemSelected={checkOptionModal().item}
      />
    </View>
  );
};
