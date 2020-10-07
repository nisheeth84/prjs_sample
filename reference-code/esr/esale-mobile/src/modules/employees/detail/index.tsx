import Modal from "react-native-modal";
import React, { useEffect, useState } from "react";
import {
  Clipboard,
  Image,
  Alert as ShowError,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { CalendarTabScreen } from "./employee-detail-tab-calendar";
import { ChangeLogTabScreen } from "./employee-detail-tab-change-log";
import { ClientScreen as ClientTabScreen } from "./employee-detail-tab-client";
import { DetailBasicInformation } from "./employee-detail-tab-basic-information";
import {
  DetailEmployee,
  detailInformation,
  TabsInfo,
} from "../employees-repository";
import { DetailScreenActions } from "./detail-screen-reducer";
import { GroupTabScreen } from "./employee-detail-tab-group";
import { Icon } from "../../../shared/components/icon";
import { InforModal } from "./common/employee-detail-modal-infor";
import { LoadState } from "../../../types";
import { messages } from "./detail-messages";
import { OtherEmployeeModal } from "./common/employee-detail-modal-other";
import { ListTasks } from './employee-detail-tab-task/list-task';
import { TradingProductTabScreen } from "./employee-detail-tab-trading-product";
import { translate } from "../../../config/i18n";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  DetailScreenStyles,
  DetailTabBasicInformationStyles,
} from "./detail-style";
import { CommonMessages } from "../../../shared/components/message/message";

import { TEXT_EMPTY } from "../../../config/constants/constants";

// Initialize tab navigator 
import { TabScreen } from '../../../shared/components/common-tab/interface';
import { CommonTab } from '../../../shared/components/common-tab/common-tab';
import { CommonButton } from '../../../shared/components/button-input/button';
import { TypeButton, StatusButton } from '../../../config/constants/enum';
import { employeeIdsListSelector } from './detail-screen-selector';
import { appBarHomeStyles } from '../../../shared/components/appbar/appbar-styles';
import { Ionicons } from '@expo/vector-icons';
import { TAB_ID } from './detail-screen-constants';
import { BussinessCardScreen } from './employee-detail-tab-business-card';
import { EmailTabScreen } from './employee-detail-tab-email';
import { PredictionTabScreen } from './employee-detail-tab-prediction';
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator";
import StringUtils from '../../../shared/util/string-utils';
import { CommonScreen } from '../../../shared/components/common-tab/screens/common-screen';
import { commonTabActions } from '../../../shared/components/common-tab/common-tab-reducer';
import {
  employeeDataSelector,
} from '../../employees/detail/detail-screen-selector';
interface Route {
  [route: string]: any;
}

interface Navigation {
  [navigation: string]: any;
}

/**
 * Component for main screen of detail employee
 */
export function DetailScreen() {
  const routeSreen: Route = useRoute();
  const urlDetail = "https://remixms.softbrain.co.jp/{0}/employee/detail";
  const dispatch = useDispatch();
  // const userId = useSelector(userIdSelector);
  const auth = useSelector(authorizationSelector);
  const employeeIds = useSelector(employeeIdsListSelector);
  // handled in each specific case
  const [loadState, setLoadState] = useState<LoadState>("initial");
  const [response, setResponse] = useState<DetailEmployee>();
  const [toFollowActive, setToFollowActive] = useState(false);
  const [isReload, setIsReload] = useState(false);
  // Get attribute employee from response
  const employee = response?.data;
  const lenghtSubordinate = employee?.employeeSubordinates?.length || 0;
  // const dataWatchs = response?.dataWatchs;
  const [responseError, setResponseError] = useState<any>("");
  const [isShowEmployee, setIsShowEmployee] = useState(true);
  const listDepartment = response?.data?.employeeDepartments;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;
  const [tabList, setTabList] = useState<TabScreen[]>([]);
  const employeeData = useSelector(employeeDataSelector);
  const { data, fields } = employeeData;
  const extensionData = data?.employeeData;
  
  useEffect(() => {
    if (fields) {
      const relationFieldInfos = fields.filter(element => element.fieldType === 17);
      dispatch(commonTabActions.setFieldInfos({ key: 'DetailScreen', fieldInfos: relationFieldInfos }))
    } else {
      dispatch(commonTabActions.setFieldInfos({ key: 'DetailScreen', fieldInfos: [] }))
    }
    dispatch(commonTabActions.setExtensionData({ extensionData: extensionData }))
  }, [employeeData]);

  const setTabs = (tabInfos: TabsInfo[]) => {
    const tempTabs: TabScreen[] = [];
    tabInfos.forEach((tab: TabsInfo) => {
      if (tab.isDisplay) {
        //get component for tab
        let tempComponent = CommonScreen;
        switch (tab.tabId) {
          case TAB_ID.BASIC_INFORMATION: {
            tempComponent = DetailBasicInformation;
            break;
          }
          case TAB_ID.BUSINESS_CARD: {
            tempComponent = BussinessCardScreen;
            break;
          }
          case TAB_ID.CALENDAR: {
            tempComponent = CalendarTabScreen;
            break;
          }
          case TAB_ID.CHANGE_HISTORY: {
            tempComponent = ChangeLogTabScreen;
            break;
          }
          case TAB_ID.CUSTOMER: {
            tempComponent = ClientTabScreen;
            break;
          }
          case TAB_ID.EMAIL: {
            tempComponent = EmailTabScreen;
            break;
          }
          case TAB_ID.PARTICIPATING_GROUP: {
            tempComponent = GroupTabScreen;
            break;
          }
          case TAB_ID.PROSPECT: {
            tempComponent = PredictionTabScreen;
            break;
          }
          case TAB_ID.TASK: {
            tempComponent = ListTasks;
            break;
          }
          case TAB_ID.TRADING_PRODUCT: {
            tempComponent = TradingProductTabScreen;
            break;
          }
        }

        // get Name
        const label = StringUtils.getFieldLabel(tab, "tabLabel", languageCode);

        // get badges
        // TODO ...
        const badges = 0;
        if (label && label !== TEXT_EMPTY) {
          // add tab
          tempTabs.push({
            component: tempComponent,
            name: label,
            badges,
            sortOrder: tab.tabOrder,
          });
        }
      }
    });
    // sort tab by tabOrder
    tempTabs.sort((tab1, tab2) => {
      return (tab1.sortOrder || 0) - (tab2.sortOrder || 0);
    });

    setTabList(tempTabs);
  };

  /**
   * get department have position
   */
  const getDepartment = () => {
    if (listDepartment && listDepartment.length > 1) {
      let positionMin = listDepartment[0];
      for (let i = 1; i < listDepartment.length; i++) {
        const data = listDepartment[i].positionOrder;
        if (positionMin?.positionOrder && data) {
          if (data < positionMin.positionOrder) {
            positionMin = listDepartment[i];
          }
        }
      }
      const listMin = listDepartment.filter(
        (item) => item.positionOrder === positionMin.positionOrder
      );
      if (listMin.length > 1) {
        let departmentMin = listMin[0];
        for (let i = 1; i < listMin.length; i++) {
          const { departmentOrder } = listMin[i];
          if (departmentOrder && departmentMin.departmentOrder) {
            if (departmentOrder < departmentMin.departmentOrder) {
              departmentMin = listMin[i];
            }
          }
        }
        return departmentMin;
      }
      return listMin[0];
    }
    return listDepartment && listDepartment[0];
  };
  const departmentHighest = getDepartment();

  /**
   * Check button to follow
   */
  const checkFollow = () => {
    const check = false;
    // dataWatchs?.data.watch.forEach((e: any) => {
    //   if (e.watchTargetId === userId) check = true;
    // });
    if (check) {
      // const reponse = await registerFollow(
      //   QUERY_REGISTER_FOLLOW(1102,5, 1106),{}
      // );
      setToFollowActive(true);
    } else {
      // const reponse = await removeRegisterFollow(
      //   QUERY_REMOVE_REGISTER_FOLLOW(1102, 1106),{}
      // );
      setToFollowActive(false);
    }
  };
  /**
   * get label tab
   */
  // const navigateTab = (routeName: string): Route => {
  //   switch (routeName) {
  //     case '基本情報':
  //       return {
  //         label: `${translate(messages.basicInformation)}`,
  //       };
  //     case '顧客':
  //       return {
  //         label: `${translate(messages.client)}`,
  //       };
  //     case 'カレンダー':
  //       return {
  //         label: `${translate(messages.calendar)}`,
  //       };
  //     case 'タスク':
  //       return {
  //         label: `${translate(messages.task)}`,
  //       };
  //     case '取引商品':
  //       return {
  //         label: `${translate(messages.tradingProduct)}`,
  //       };
  //     case '参加中グループ':
  //       return {
  //         label: `${translate(messages.participatingGroups)}`,
  //       };
  //     case '更新履歴':
  //       return {
  //         label: `${translate(messages.changeLog)}`,
  //       };
  //     default:
  //       return {
  //         label: '',
  //       };
  //   }
  // };
  /**
   * Fetch data employee by id
   */
  const getData = async (employeeId?: number) => {
    setResponseError("");
    dispatch(DetailScreenActions.setEmplpoyeeData({}));
    try {
      const reponse = await detailInformation({
        employeeId,
        mode: "detail",
      });
      dispatch(DetailScreenActions.setEmplpoyeeData(reponse.data));
      if (reponse.status === 200) {
        setResponse(reponse.data);
        setTabs(reponse?.data?.tabsInfo);
        setLoadState("succeeded");
      } else {
        setResponseError(reponse);
      }
    } catch (error) {
      setLoadState("failed");
      ShowError.alert("Message", error.message);
    }
  };

  useEffect(() => {
    setLoadState("loading");
    let employeeId = routeSreen?.params?.id;

    if (employeeIds.length > 0) {
      employeeId = employeeIds[employeeIds.length - 1];
    }
    dispatch(DetailScreenActions.setEmployeeId({ employeeId }));
    getData(employeeId);
  }, [isReload]);

  const [openModalInfor, setOpenModalInfor] = useState(false);

  const handleCopyLinkEmployee = () => {
    const value = `${urlDetail.replace("{0}", auth.idToken)}/${
      routeSreen?.params?.id
    }`;
    Clipboard.setString(value);
  };
  /**
   * Catch open/close infor modal
   */
  const toggleModalInfo = () => {
    setOpenModalInfor(!openModalInfor);
  };

  const [openModalOther, setOpenModalOther] = useState(false);

  /**
   * Catch open/close other employee modal
   */
  const toggleModalOther = () => {
    setOpenModalOther(!openModalOther);
  };

  const navigationScreen: Navigation = useNavigation();

  let employeeManager: any = null;
  if (employee && employee.employeeManagers?.length > 0) {
    employeeManager = employee.employeeManagers.find(
      (e) => e.managerId !== null
    );
    if (!employeeManager) {
      employeeManager = employee.employeeManagers.find(
        (e) => e.employeeId !== null
      );
    }
  }

  const openDrawerLeft = async () => {
    dispatch(DetailScreenActions.removeEmployeeIds(routeSreen?.params?.id));
    setIsReload(!isReload);
    navigationScreen.goBack();
  };
  if (loadState !== "succeeded") {
    return <AppIndicator size={40} style={DetailScreenStyles.loadingView} />;
  }
  return (
    <SafeAreaView style={DetailScreenStyles.container}>
      <View style={[appBarHomeStyles.container, appBarHomeStyles.block]}>
        <TouchableOpacity
          style={appBarHomeStyles.iconButton}
          onPress={openDrawerLeft}
        >
          <Icon name="arrowBack" />
        </TouchableOpacity>
        <View style={appBarHomeStyles.titleWrapper}>
          <Text style={appBarHomeStyles.title} numberOfLines={1}>
            {employee
              ? `${employee?.employeeSurname} ${employee?.employeeName || ""}`
              : routeSreen?.params?.title}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            appBarHomeStyles.iconButton,
            appBarHomeStyles.paddingLeftButton,
          ]}
        >
          <Ionicons
            name="md-search"
            style={appBarHomeStyles.iconGray}
            size={30}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={appBarHomeStyles.iconButton}
          onPress={() => {}}
        >
          <Ionicons
            name="ios-notifications"
            style={appBarHomeStyles.iconGray}
            size={30}
          />
        </TouchableOpacity>
      </View>
      <View>
        {responseError?.length > 0 && (
          <View style={DetailScreenStyles.viewRegionErrorShow}>
            <CommonMessages response={responseError} />
          </View>
        )}
      </View>
      {employee && (
        <View>
          <View style={DetailScreenStyles.employeeInfor}>
            {employee.employeeIcon?.fileUrl &&
            employee.employeeIcon?.fileUrl !== "" ? (
              <Image
                source={{ uri: employee.employeeIcon.fileUrl }}
                style={DetailScreenStyles.bossAvatar}
              />
            ) : (
              <View style={DetailScreenStyles.wrapAvatar}>
                <Text style={DetailScreenStyles.bossAvatarText}>
                  {employee.employeeSurname
                    ? employee.employeeSurname.charAt(0)
                    : employee.employeeName
                    ? employee.employeeName.charAt(0)
                    : ""}
                </Text>
              </View>
            )}
            <View style={DetailScreenStyles.inforContent}>
              <View style={DetailScreenStyles.blockShare}>
                <Text style={DetailScreenStyles.textGray}>
                  {departmentHighest?.departmentName || ""}{" "}
                  {departmentHighest?.departmentName &&
                  departmentHighest?.positionName
                    ? "-"
                    : TEXT_EMPTY}
                  {departmentHighest?.positionName || ""}
                </Text>
                <TouchableOpacity
                  style={DetailScreenStyles.buttonShare}
                  onPress={handleCopyLinkEmployee}
                >
                  <Image
                    source={require("../../../../assets/icons/iconshare.png")}
                    style={DetailScreenStyles.iconShare}
                  />
                </TouchableOpacity>
              </View>
              <Text
                style={DetailTabBasicInformationStyles.title}
                numberOfLines={1}
              >
                {employee.employeeSurnameKana} {employee.employeeNameKana}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={DetailTabBasicInformationStyles.title}
                  numberOfLines={1}
                >
                  {employee.employeeSurname} {employee.employeeName}
                </Text>
              </View>
              <View style={DetailScreenStyles.licenseBlock}>
                {employee.employeePackages &&
                  employee.employeePackages.length > 0 && (
                    <Text
                      style={DetailScreenStyles.textWhite}
                      numberOfLines={1}
                    >
                      {employee.employeePackages &&
                        employee.employeePackages.map((e: any, i: number) => {
                          return i == 0
                            ? e.packagesName
                            : `、　${e.packagesName}`;
                        })}
                    </Text>
                  )}
                <TouchableOpacity onPress={() => toggleModalInfo()}>
                  <Icon name="list" style={DetailScreenStyles.listIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={DetailScreenStyles.bossInfor}>
            <Text style={DetailScreenStyles.bossTitle}>
              {translate(messages.boss)}
            </Text>
            {employeeManager && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    if (isShowEmployee) {
                      dispatch(
                        DetailScreenActions.addEmployeeIds(
                          routeSreen?.params?.id
                        )
                      );
                      setIsShowEmployee((isShowEmployee) => !isShowEmployee);
                      navigationScreen.push("detail-employee", {
                        id: employeeManager.employeeId,
                        title: employeeManager.employeeName,
                      });
                      setTimeout(() => {
                        setIsShowEmployee((isShowEmployee) => !isShowEmployee);
                      }, 2000);
                    }
                  }}
                  style={DetailScreenStyles.bossContent}
                >
                  {employeeManager.employeeIcon?.file_url &&
                  employeeManager.employeeIcon?.file_url !== "" ? (
                    <Image
                      source={{ uri: employeeManager.employeeIcon?.file_url }}
                      style={DetailScreenStyles.bossAvatar}
                    />
                  ) : (
                    <View style={DetailScreenStyles.wrapAvatar}>
                      <Text style={DetailScreenStyles.bossAvatarText}>
                        {employeeManager.employeeName
                          ? employeeManager.employeeName.charAt(0)
                          : ""}
                      </Text>
                    </View>
                  )}
                  <View style={DetailScreenStyles.fieldShowManager}>
                    <Text
                      style={DetailScreenStyles.bossContactName}
                      numberOfLines={1}
                    >
                      {employeeManager.employeeName}
                    </Text>
                    {employeeManager.managerId === null && (
                      <Text
                        style={DetailScreenStyles.bossContactContent}
                        numberOfLines={1}
                      >
                        {employeeManager.departmentName}{" "}
                        {translate(messages.manageNotify)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={DetailScreenStyles.bossInfor}>
            <Text style={DetailScreenStyles.bossTitle}>
              {translate(messages.subordinate)}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {lenghtSubordinate > 0 &&
                employee.employeeSubordinates.map((e: any, index: number) => {
                  return (
                    index < 2 && (
                      <TouchableOpacity
                        style={
                          lenghtSubordinate === 1
                            ? DetailScreenStyles.onlySubOrDinateContent
                            : lenghtSubordinate === 2
                            ? DetailScreenStyles.twoSubOrDinateContent
                            : DetailScreenStyles.subOrDinateContent
                        }
                        key={e.employeeId.toString()}
                        onPress={() => {
                          if (isShowEmployee) {
                            dispatch(
                              DetailScreenActions.addEmployeeIds(
                                routeSreen?.params?.id
                              )
                            );
                            setIsShowEmployee(
                              (isShowEmployee) => !isShowEmployee
                            );
                            navigationScreen.push("detail-employee", {
                              id: e.employeeId,
                              title: e.employeeName,
                            });
                            setTimeout(() => {
                              setIsShowEmployee(
                                (isShowEmployee) => !isShowEmployee
                              );
                            }, 2000);
                          }
                        }}
                      >
                        {e.employeeIcon?.file_url &&
                        e.employeeIcon?.file_url !== "" ? (
                          <Image
                            source={{ uri: e.employeeIcon.file_url }}
                            style={DetailScreenStyles.bossAvatar}
                          />
                        ) : (
                          <View style={DetailScreenStyles.wrapAvatar}>
                            <Text style={DetailScreenStyles.bossAvatarText}>
                              {e.employeeName ? e.employeeName.charAt(0) : ""}
                            </Text>
                          </View>
                        )}
                        <Text
                          style={
                            lenghtSubordinate === 1
                              ? DetailScreenStyles.onlysubContactName
                              : DetailScreenStyles.subContactName
                          }
                          numberOfLines={1}
                        >
                          {`${e.employeeName}　`}
                        </Text>
                      </TouchableOpacity>
                    )
                  );
                })}
              {lenghtSubordinate > 2 && (
                <TouchableOpacity
                  onPress={() => {
                    toggleModalOther();
                  }}
                  style={{ alignContent: "center", alignSelf: "center" }}
                >
                  <Text style={DetailScreenStyles.bossContactName}>
                    {translate(messages.other)}
                    {lenghtSubordinate > 1 ? lenghtSubordinate - 2 : 0}
                    {translate(messages.name)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={DetailScreenStyles.actionsModify}>
            <CommonButton
              onPress={checkFollow} typeButton={TypeButton.MINI_BUTTON} status={StatusButton.ENABLE}
              textButton={toFollowActive ? translate(messages.toFllow) : translate(messages.toUnFllow)}
            />
            <TouchableOpacity style={DetailScreenStyles.modifyButton}>
              <Icon name="tabEdit" />
            </TouchableOpacity>
          </View>
          <View>
            <Modal
              isVisible={openModalInfor}
              onBackdropPress={toggleModalInfo}
              style={{ justifyContent: "flex-end", marginHorizontal: 10 }}
            >
              <InforModal
                email={employee.email}
                telephoneNumber={employee.telephoneNumber}
                cellphoneNumber={employee.cellphoneNumber}
                employeeData={employee.employeeData}
              />
            </Modal>
          </View>
          <View>
            <Modal
              isVisible={openModalOther}
              onBackdropPress={toggleModalOther}
              style={{ justifyContent: "center", marginHorizontal: 50 }}
            >
              <OtherEmployeeModal
                otherEmpolyee={employee.employeeSubordinates}
                toggleModalOther={toggleModalOther}
              />
            </Modal>
          </View>
        </View>
      )}
      {loadState === "succeeded" && tabList?.length > 0 && (
        <CommonTab tabList={tabList} />
      )}
    </SafeAreaView>
  );
}
