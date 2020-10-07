import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  Alert as ShowError,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { Icon } from "../../../shared/components/icon";
import { EmployeeItem } from "./employee-list-item";
import {
  employeeTotalRecordsSelector,
  combinatedEmployeesSelector,
  filterSelector,
  statusDiplaySelector,
  titleDiplaySelector,
  selectedEmployeeIdsSelector,
  groupFilterSelector,
  departmentSelector,
  lastUpdateSelector,
  conditionSelector,
} from "./employee-list-selector";
import { messages } from "./employee-list-messages";
import { translate } from "../../../config/i18n";
import { getEmployees, initializeListInfo } from "../employees-repository";
import {
  employeeActions,
  UpdateEmployeesMode,
  EmployeesFilter,
  initializeListInfoActions,
  initializeEmployeeConditionAction,
  GetEmployeeCondition,
} from "./employee-list-reducer";
import {
  //  QUERY_FIELD_INFO_PERSONALS,
  DISPLAY_STATUS,
} from "../../../config/constants/query";
import { EmployeeListScreenStyles } from "./employee-list-style";
import { GroupActivityModal } from "../drawer/modal/drawer-left-modal-group-activity";
import { OtherActivityModal } from "../drawer/modal/drawer-left-modal-other-activity";
import { LoadState } from "../../../types";
import {
  employeeListConstants,
  TYPE_SORT,
  STATUS_SORT,
} from "./employee-list-constants";
import {
  TargetID,
  TargetType,
  ActionType,
} from "../../../config/constants/enum";
import { theme } from "../../../config/constants/theme";
import { ActivityIndicatorLoading } from "../../../shared/components/indicator-loading/activity-indicator-loading";
import { CommonMessages, CommonFilterMessage } from '../../../shared/components/message/message';
import { errorCode, TEXT_EMPTY } from '../../../shared/components/message/message-constants';
import { responseMessages } from '../../../shared/messages/response-messages';
import { format } from 'react-string-format';
import { DetailScreenActions } from "../detail/detail-screen-reducer";
import Toast from 'react-native-tiny-toast';
import { APP_DATE_FORMAT_ES } from "../../../config/constants/constants";
import { utcToTz, DATE_TIME_FORMAT } from "../../../shared/util/date-utils";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { ServiceInfoSelector, ServiceFavoriteSelector } from "../../menu/menu-feature-selector";
import StringUtils from "../../../shared/util/string-utils";


interface Navigation {
  [navigation: string]: any;
}

/**
 * Component for showing list of employees
 */

export const EmployeeListScreen: React.FunctionComponent = () => {

  // Define value params
  type RootStackParamList = {
    vauleParam: { notify: string, isShow: boolean };
  };
  type ProfileScreenRouteProp = RouteProp<RootStackParamList, "vauleParam">;
  const route = useRoute<ProfileScreenRouteProp>();
  // Get data from screen invite-employee
  const notifiType: { notify: string, isShow: boolean } = route?.params ? route?.params : { notify: "", isShow: false };
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMesssage] = useState(TEXT_EMPTY);
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const serviceOther = useSelector(ServiceInfoSelector);
  const navigation = useNavigation();
  const conditonEmployeeSelector = useSelector(conditionSelector);
  const dispatch = useDispatch();
  // we maintain boolean loading state here because request error is
  // handled in each specific case
  const [loadState, setLoadState] = useState<LoadState>("initial");
  // read filter from redux store, because the data to display from
  // this screen may be changed by the filter from the drawer menu
  const filter = useSelector(filterSelector);
  // title: group, department or all employees
  const titleDisplay = useSelector(titleDiplaySelector);
  // display manager when select department
  const departmentManager = useSelector(departmentSelector);
  // get last update
  const lastUpdateDate = useSelector(lastUpdateSelector);
  // list employee selected
  const selectedEmployeeIds = useSelector(selectedEmployeeIdsSelector);
  const groupSelected = useSelector(groupFilterSelector);
  // total records filter
  const totalRecords = useSelector(employeeTotalRecordsSelector);
  // data employees filter
  const combinatedEmployees = useSelector(combinatedEmployeesSelector);
  // status display: filter department, filter group, filter all employees, filter retired employees
  const statusDiplay = useSelector(statusDiplaySelector);
  const employees = useSelector(authorizationSelector);
  // argument in mode edit
  const [editMode, setEditMode] = useState(false);
  // argument hide show modal group operation
  const [modalGroupOperationVisible, setModalGroupOperationVisible] = useState(
    false
  );
  const [modalInviteEmployees, setModalInviteEmployees] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [responseEmployeeError, setResponseEmployeeError] = useState<any>("");
  const [isShowEmployeeError, setIsShowEmployeeError] = useState(false);
  const [responseListInfoError, setResponseListInfoError] = useState<any>("");
  const [isShowListInfoError, setIsShowListInfoError] = useState(false);
  const authState = useSelector(authorizationSelector);
  /**
   * argument open modal other group operation
   */
  const [
    openModalOtherGroupOperation,
    setOpenModalOtherGroupOperation,
  ] = useState(false);
  const toggleEditMode = useCallback(() => {
    setEditMode((prevEditMode) => !prevEditMode);
    dispatch(employeeActions.deselectAllEmployees(undefined));
  }, [editMode]);
  const toggleModalGroupOperation = useCallback(() => {
    setModalGroupOperationVisible(
      (prevModalGroupOperationVisible) => !prevModalGroupOperationVisible
    );
  }, []);

  /**
   * Show toast delete
   * @param status 
   */
  const setStatus = (status: string) => {
    if (status === ActionType.DELETE) {
      setShowToast(true);
      setToastMesssage(translate(responseMessages[errorCode.infCom0005]));
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
    if (status === ActionType.UPDATE) {
      setShowToast(true);
      setToastMesssage(translate(responseMessages[errorCode.infCom0004]));
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    }
  }
  /**
   * function hanlde action close modal group operation
   */
  const handleCloseModalOtherGroupOperation = () => {
    setOpenModalOtherGroupOperation(false);
  };

  /**
   * function handle action open modal other group operation
   */
  const handleOpenModalOtherGroupOperation = () => {
    setOpenModalOtherGroupOperation(true);
  };

  /**
   * Function  call api filter employees
   * @param mode
   * @param customFilter
   */
  async function getDataEmployees(
    mode: UpdateEmployeesMode = "initial",
    customFilter?: Partial<EmployeesFilter>
  ) {
    setIsShowEmployeeError(false);
    // Set ressponse
    setResponseEmployeeError("");
    if (mode == "initial") {
      dispatch(
        employeeActions.setTitleDisplay(translate(messages.allEmployees))
      );
    }

    const filterUnion = {
      ...filter,
      ...(customFilter || {}),
    };
    setLoadState("loading");
    // Call API getEmployees
    const employeesRessponse = await getEmployees({
      offset: filterUnion.offset,
      limit: filterUnion.limit,
      selectedTargetId: TargetID.ZERO,
      selectedTargetType: TargetType.ALL,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
    });
    try {

      // update employees and mode to redux store
      if (employeesRessponse.status === 200) {
        dispatch(
          employeeActions.employeesFetched({
            ...employeesRessponse.data,
            mode,
          })
        );
        // Proccessing Error there 
      } else {
        setIsShowEmployeeError(true);
        // Set ressponse
        setResponseEmployeeError(employeesRessponse);
      }
      // update filter data
      if (customFilter) {
        dispatch(employeeActions.filterUpdated(filterUnion));
      }

      // TODO: shim
      dispatch(employeeActions.setStatusDisplay(DISPLAY_STATUS.ALL_EMPLOYEE));
      dispatch(
        employeeActions.setGroupSelected({
          groupId: -1,
          groupName: "",
          isAutoGroup: false,
          participantType: -1,
        })
      );
      setLoadState("succeeded");
    } catch (error) {
      setLoadState("failed");
      ShowError.alert("Message", error.message);
    }
  }
  /**
   * Call API getInitializeListInfo
   * @param fieldBelong 
   */
  async function getInitializeListInfo(fieldBelong: number) {
    const response = await initializeListInfo({ fieldBelong: fieldBelong });
    setResponseListInfoError("");
    setIsShowListInfoError(false);
    if (response.status === 200) {
      // save condition filter and sort to store
      if (response?.data?.initializeInfo?.orderBy) {
        dispatch(
          initializeListInfoActions.setOrderBy(
            response.data.initializeInfo.orderBy
          )
        );
      }
      if (response?.data?.initializeInfo?.filterListConditions) {
        dispatch(
          initializeListInfoActions.setFilterCondition(
            response.data.initializeInfo.filterListConditions
          )
        );
      }
    } else {
      setResponseListInfoError(response);
      setIsShowListInfoError(true);
    }

  }


  /**
   *  Handle load more when the list is reaching end
   */
  const loadMore = useCallback(async () => {
    setIsLoading(true);
    if (
      !~["loading", "initial"].indexOf(loadState) &&
      filter.offset + filter.limit < totalRecords
    ) {
      if (
        conditonEmployeeSelector.selectedTargetId === TargetID.ZERO &&
        conditonEmployeeSelector.selectedTargetType === TargetType.ALL
      ) {
        await getDataEmployees("appending", {
          offset: filter.offset + filter.limit,
        });
      } else {
        await callGetEmployee("appending", {
          offset: filter.offset + filter.limit,
          limit: filter.limit,
          filterType: filter.filterType,
        });
      }
    }
    setIsLoading(false);
  }, [filter, totalRecords, loadState]);

  /**
   *  Handle refresh when the list
   */
  const onRefresh = useCallback(async () => {
    setIsRefresh(true);
    if (
      conditonEmployeeSelector.selectedTargetId === TargetID.ZERO &&
      conditonEmployeeSelector.selectedTargetType === TargetType.ALL
    ) {
      await getDataEmployees("initial", {
        offset: 0,
      });
    } else {
      callGetEmployee('initial', {
        offset: 0
      });
    }
    setIsRefresh(false);
  }, [filter, totalRecords, loadState, conditonEmployeeSelector]);

  // get employees data for the first time
  useEffect(() => {
    // Call API getmployees
    getDataEmployees();
    // Call API getInitializeListInfo
    getInitializeListInfo(employeeListConstants.fieldBelongEmployee);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
    };
  }, []);

  /**
   * Handle toast update, create
   */
  useEffect(() => {
    switch (notifiType?.notify) {
      case ActionType.CREATE:
        setShowToast(true);
        setToastMesssage(translate(responseMessages[errorCode.infCom0003]));
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        break;
      case ActionType.UPDATE:
        setShowToast(true);
        setToastMesssage(translate(responseMessages[errorCode.infCom0004]));
        setTimeout(() => {
          setShowToast(false);
        }, 2000);
        break;
      default:
        break;
    }
    notifiType.isShow = false;
    notifiType.notify = TEXT_EMPTY;
  }, [notifiType, showToast]);

  const handleBack = () => {
    dispatch(employeeActions.deselectAllEmployees(undefined));
    setEditMode(false);
  };

  async function getEmployeesFilter(
    mode: UpdateEmployeesMode = "initial",
    customFilter?: Partial<EmployeesFilter>
  ) {
    if (!conditonEmployeeSelector.isCallback) {
      return;
    }

    setIsRefresh(true);
    await callGetEmployee(mode, customFilter);
    setIsRefresh(false);

    //Set condition
    const setEmployeeCondition: GetEmployeeCondition = {
      ...conditonEmployeeSelector,
    };
    setEmployeeCondition.isCallback = false;
    dispatch(
      initializeEmployeeConditionAction.setCondition(setEmployeeCondition)
    );
  }

  const callGetEmployee = async (
    mode: UpdateEmployeesMode,
    customFilter?: Partial<EmployeesFilter>
  ) => {
    const filterUnion = {
      ...filter,
      ...(customFilter || {}),
    };
    setIsShowEmployeeError(false);
    // Set ressponse
    setResponseEmployeeError("");
    setLoadState("loading");
    const employeesResponse = await getEmployees({
      offset: filterUnion.offset,
      limit: filterUnion.limit,
      selectedTargetId: conditonEmployeeSelector.selectedTargetId,
      selectedTargetType: conditonEmployeeSelector.selectedTargetType,
      isUpdateListView: conditonEmployeeSelector.isUpdateListView,
      searchConditions: conditonEmployeeSelector.searchConditions,
      filterConditions: conditonEmployeeSelector.filterConditions,
      localSearchKeyword: conditonEmployeeSelector.localSearchKeyword,
      orderBy: conditonEmployeeSelector.orderBy,
    });

    setLoadState("succeeded");
    // update employees and mode to redux store
    if (employeesResponse.status === 200) {
      dispatch(
        employeeActions.employeesFetched({
          ...employeesResponse.data,
          mode: mode,
        })
      );
    } else {
      setIsShowEmployeeError(true);
      // Set ressponse
      setResponseEmployeeError(employeesResponse);
    }

    // update filter data
    if (customFilter) {
      dispatch(employeeActions.filterUpdated(filterUnion));
    }
  };

  useFocusEffect(
    useCallback(() => {
      setEditMode(false);
      dispatch(employeeActions.deselectAllEmployees(undefined));
      getEmployeesFilter();
    }, [conditonEmployeeSelector])
  );

  const onClickItem = (employeeId: any, employee: any) => {
    dispatch(
      employeeActions.toggleSelectEmployee({
        employeeId,
      })
    );
    const { employeeSurname, employeeName } = employee;
    if (!editMode) {
      dispatch(DetailScreenActions.addEmployeeIds(employeeId));
      navigation.navigate("detail-employee", {
        id: employeeId,
        title: `${employeeSurname} ${employeeName || ""}`,
      });
    }
  };
  function employeeListEmpty() {
    let service = serviceFavorite.find(item => item.serviceId === 8);
    !service && (service = serviceOther.find(item => item.serviceId === 8));
    return service && <CommonFilterMessage
      iconName={service.iconPath}
      content={format(translate(responseMessages[errorCode.infoCom0020]), StringUtils.getFieldLabel(service, "serviceName", employees.languageCode))}></CommonFilterMessage>
  }

  /**
   * 
   * @param index 
   */
  const getItemLayout = (index: any) => {
    const length = 100;
    return (
      {
        length: length,
        offset: length * index,
        index
      }
    )
  }

  const renderAppbar = (title: string) => {

    const navigate: Navigation = useNavigation();

    const _openDrawerLeft = () => {
      navigate?.dangerouslyGetParent()?.toggleDrawer();
    };
    // open drawer notification
    const _openDrawerRight = () => {
      navigate.toggleDrawer();
    };

    const openGlobalSearch = () => {
      navigate.navigate("search-stack", {
        screen: "search",
        params: { nameService: "employees" },
      });
    };

    const appBarMenuStyles = StyleSheet.create({
      container: {
        height: 54,
        backgroundColor: theme.colors.white100,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.gray100,
        alignItems: "center",
        flexDirection: "row",
      },
      title: {
        fontSize: 18,
        color: theme.colors.black,
      },
      titleWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      iconButton: {
        padding: theme.space[3],
        justifyContent: "center",
        alignItems: "center",
      },
      iconSearch: {
        justifyContent: "center",
        alignItems: "center",
        fontWeight: theme.fontWeights[6],
      },
    });

    return (
      <View style={appBarMenuStyles.container}>
        <TouchableOpacity
          style={appBarMenuStyles.iconButton}
          onPress={_openDrawerLeft}
        >
          <Icon name="menuHeader" />
        </TouchableOpacity>
        <View style={appBarMenuStyles.titleWrapper}>
          <Text style={appBarMenuStyles.title}>{title}</Text>
        </View>
        <TouchableOpacity
          style={appBarMenuStyles.iconSearch}
          onPress={openGlobalSearch}
        >
          <Icon name="search" />
        </TouchableOpacity>
        <TouchableOpacity
          style={appBarMenuStyles.iconButton}
          onPress={_openDrawerRight}
        >
          <Icon name="bell" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={EmployeeListScreenStyles.container}>
      {
        showToast &&
        <Toast
          visible={showToast}
          position={-65}
          shadow={false}
          animation={false}
          textColor='#333333'
          imgStyle={{ marginRight: 5 }}
          imgSource={require("../../../../assets/icons/SUS.png")}
          containerStyle={EmployeeListScreenStyles.viewToast}
        >
          <Text>{toastMessage}</Text></Toast>
      }
      {renderAppbar(translate(messages.employeesListTitle))}
      {
        <View>
          <View>
            <View>
              {
                isShowEmployeeError && responseEmployeeError !== TEXT_EMPTY &&
                <View style={EmployeeListScreenStyles.viewRegionErrorShow}>
                  <CommonMessages response={responseEmployeeError} />
                </View>
              }
              {
                isShowListInfoError && responseListInfoError !== TEXT_EMPTY &&
                <View style={EmployeeListScreenStyles.viewRegionErrorShow}>
                  <CommonMessages response={responseListInfoError} />
                </View>
              }
            </View>
            <View style={EmployeeListScreenStyles.inforBlock}>
              {totalRecords > -1 && (
                <Text style={EmployeeListScreenStyles.title}>
                  {`${titleDisplay}（${totalRecords}${translate(messages.person)})`}
                </Text>
              )}
              {statusDiplay !== DISPLAY_STATUS.FILTER_DEPARTMENT && (
                <Text style={EmployeeListScreenStyles.dateTitle}>
                  {groupSelected.isAutoGroup &&
                    `${translate(messages.lastUpdate)}: ${
                    lastUpdateDate ? utcToTz(
                      lastUpdateDate,
                      authState.timezoneName,
                      authState.formatDate || APP_DATE_FORMAT_ES,
                      DATE_TIME_FORMAT.User
                    ).substring(0, 10) : ""
                    }`
                  }
                </Text>
              )}
              {statusDiplay === DISPLAY_STATUS.FILTER_DEPARTMENT && (
                <Text style={EmployeeListScreenStyles.subTitle}>
                  {`${translate(messages.departmentManager)}: ${
                    departmentManager?.managerSurname
                      ? departmentManager.managerSurname
                      : ""
                    }${
                    departmentManager?.managerName
                      ? " " + departmentManager.managerName
                      : ""}`}
                </Text>
              )}

              <View style={EmployeeListScreenStyles.filterRow}>
                <View style={EmployeeListScreenStyles.iconBlock}>
                  {statusDiplay !== DISPLAY_STATUS.RETIRE_EMPLOYEE && (
                    <TouchableOpacity
                      style={EmployeeListScreenStyles.iconEditButton}
                      onPress={toggleEditMode}
                    >
                      <Icon name={editMode ? "editActive" : "edit"} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={EmployeeListScreenStyles.iconEditButton}
                    onPress={() => navigation.navigate("employee-list-sort")}
                  >
                    <Icon
                      name={
                        conditonEmployeeSelector?.orderBy[0]?.value ===
                          TYPE_SORT.TYPE_DESC
                          ? STATUS_SORT.DESCENDING
                          : STATUS_SORT.ASCENDING
                      }
                      style={EmployeeListScreenStyles.iconDescendingButton}
                    />
                  </TouchableOpacity>
                  {statusDiplay !== DISPLAY_STATUS.ALL_EMPLOYEE &&
                    statusDiplay !== DISPLAY_STATUS.FILTER_DEPARTMENT &&
                    statusDiplay !== DISPLAY_STATUS.RETIRE_EMPLOYEE && (
                      <TouchableOpacity
                        style={EmployeeListScreenStyles.iconEditButton}
                        onPress={handleOpenModalOtherGroupOperation}
                      >
                        <Icon
                          name="other"
                          style={EmployeeListScreenStyles.iconOtherButton}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              </View>
            </View>
          </View>
          {
            totalRecords === 0 ?
              employeeListEmpty()
              :
              <View style={EmployeeListScreenStyles.listEmployee}>
                <FlatList
                  onRefresh={onRefresh}
                  refreshing={isRefresh}
                  data={combinatedEmployees}
                  renderItem={({ item }) => {
                    return (
                      <EmployeeItem
                        employeeId={item.employee.employeeId}
                        avatarUrl={item.employee.employeeIcon.fileUrl}
                        dataDisplay={item}
                        editMode={editMode}
                        selected={item.selected}
                        onItemClick={() =>
                          onClickItem(item.employee.employeeId, item.employee)
                        }
                      />
                    );
                  }}
                  keyExtractor={(item) => item.employee.employeeId.toString()}
                  contentContainerStyle={
                    editMode
                      ? EmployeeListScreenStyles.contentContainerEditStyle
                      : EmployeeListScreenStyles.contentContainerStyle
                  }
                  ListFooterComponent={ActivityIndicatorLoading(isLoading)}
                  onEndReached={loadMore}
                  onEndReachedThreshold={0.1}
                  getItemLayout={(_data, index) => getItemLayout(index)}
                />
              </View>
          }
        </View>
      }
      {
        totalRecords > 0 &&
        <TouchableOpacity
          onPress={() => setModalInviteEmployees(true)}
          style={EmployeeListScreenStyles.fab}
        >
          <Text style={EmployeeListScreenStyles.fabIcon}>+</Text>
        </TouchableOpacity>
      }
      {editMode && (
        <View style={EmployeeListScreenStyles.wrapBottom}>
          <TouchableOpacity
            onPress={() => {
              dispatch(employeeActions.selectAllEmployees(undefined));
            }}
          >
            <Text style={EmployeeListScreenStyles.titleBottom}>
              {translate(messages.selectAll)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(employeeActions.deselectAllEmployees(undefined));
            }}
          >
            <Text style={EmployeeListScreenStyles.titleBottom}>
              {translate(messages.cancelSelectAll)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleModalGroupOperation}
            disabled={selectedEmployeeIds.length === 0}
          >
            <Text style={selectedEmployeeIds.length === 0 ? EmployeeListScreenStyles.titleBottomDisable : EmployeeListScreenStyles.titleBottom}>
              {translate(messages.groupOperation)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
        isVisible={modalGroupOperationVisible}
        onBackdropPress={toggleModalGroupOperation}
        style={EmployeeListScreenStyles.bottomView}
        backdropColor="rgba(0, 0, 0, 0.7)"
      >
        <GroupActivityModal onCloseModal={toggleModalGroupOperation} />
      </Modal>
      <Modal
        isVisible={openModalOtherGroupOperation}
        onBackdropPress={handleCloseModalOtherGroupOperation}
        style={EmployeeListScreenStyles.bottomView}
        backdropColor="rgba(0, 0, 0, 0.7)"
      >
        <OtherActivityModal
          onCloseModal={handleCloseModalOtherGroupOperation}
          setStatus={setStatus}
        />
      </Modal>
      <Modal
        isVisible={modalInviteEmployees}
        onBackdropPress={() => setModalInviteEmployees(false)}
        style={EmployeeListScreenStyles.bottomView}
        backdropColor="rgba(0, 0, 0, 0.7)"
      >
        <View>
          <TouchableOpacity
            style={EmployeeListScreenStyles.modalInviteEmployee}
            onPress={() => {
              setModalInviteEmployees(false);
              navigation.navigate("invite-employee");
            }}
          >
            <Text>{translate(messages.employeesInviteEmployee)}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};