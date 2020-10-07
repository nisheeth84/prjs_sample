import * as React from "react"
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert as ShowError,
} from "react-native"
import { ActivityDetailStyles } from "./activity-detail-style"
import { Style } from "../../activity/common"
import { messages } from "./activity-detail-messages"
import { translate } from "../../../config/i18n"
import { Images } from "../../calendar/config"
import { useState } from "react"
import { activityDetailSelector } from "./activity-detail-selector"
import { useSelector, useDispatch } from "react-redux"
import { getActivity, deleteActivities } from "../activity-repository"
import { activityDetailActions, Activity } from "../detail/activity-detail-reducer"
import { useNavigation } from "@react-navigation/native"
import { ActivityListStyle } from "../../activity/list/activity-list-style"
import { BusinessCard, ProductTrading } from "./activity-detail-reducer"
import { TEXT_EMPTY, SPACE_HALF_SIZE, TIME_FORMAT } from "../../../config/constants/constants"
import { StackScreen, TypeConfirm, ActivityRegisterEditMode } from "../constants"
import { TypeMessage } from "../../../config/constants/enum"
import Toast from 'react-native-toast-message'
import {NavigationModal} from "../modals/navigate-modal";
import { SafeAreaView } from "react-native-safe-area-context"
import { CommonUtil } from "../common/common-util"
import { LoadState } from "../../../types"
import { ModalConfirm } from "../modal-confirm"
import { CommonTab } from "../../../shared/components/common-tab/common-tab"
import { TabScreen } from "../../../shared/components/common-tab/interface"
import { BasicInformationScreen } from "./basic-information/basic-information-screen"
import { ChangeHistoryScreen } from "./change-history/change-history-screen"
import { DefaultAvatar } from "../common/avatar"
import { CommonMessage } from "../../../shared/components/message/message"
import { messages as messageButtonCommon } from "../../../shared/messages/response-messages"
import { authorizationSelector } from "../../login/authorization/authorization-selector"
import EntityUtils from "../../../shared/util/entity-utils"
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator"
import { DetailScreenStyles } from "../../employees/detail/detail-style"
import { AddButton } from "../components/addButton"
import { ScreenName } from "../../../config/constants/screen-name"
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu"

export const ActivityDetailScreen = (props: any) => {
  const navigation = useNavigation()
  const activityParams = props.route?.params
  const dispatch = useDispatch()
  const activityDetail = useSelector(activityDetailSelector)
  const [activityData, setActivityData] = useState<Activity>();
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false)
  const [showNavigateModal, setShowNavigateModal] = useState(false);
  const [loadState, setLoadState] = useState<LoadState>('initial');
  /**
  * languageCode
  */
 const authorizationState = useSelector(authorizationSelector);
 const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;

  /**
   * Tab list
   */
  const [tabList, setTabList] = useState<TabScreen[]>([])

  /**
   * Call API getActivity
   */
  async function callAPIGetActivity() {
    try {
      const responseData = await getActivity({activityId: activityParams?.activityId, mode: "detail"});
      if (responseData && responseData?.status === 200) {
        dispatch(activityDetailActions.getActivity(responseData?.data))
        // update tabList
        let tabListCur: TabScreen[] = []
        responseData?.data?.tabInfo?.forEach((item: any) => {
          let title = EntityUtils.getValueProp(JSON.parse(item.tabLabel), languageCode)
          switch(item.tabId) {
            case 0:
              tabListCur.push({
                name: title,
                badges: 0,
                component: BasicInformationScreen,
              })
              break
            case 2:
              tabListCur.push({
                name: title,
                badges: 0,
                component: ChangeHistoryScreen,
              })
              break
            default:
              break
          }
        })
        setTabList(tabListCur)
      }
      setLoadState('succeeded');
    }
    catch (error) {
      setLoadState('failed');
      ShowError.alert('Message', error.message)
    }
  }
  /** 
   * Init data
   */
  React.useEffect(() => {
    setLoadState('loading');
    dispatch(
      activityDetailActions.setActivityId({activityId: activityParams?.activityId})
    );
    callAPIGetActivity()
  }, [])

  React.useEffect(() => {
    setActivityData(activityDetail)
  }, [activityDetail])

  /**
   * Call API ActivityDelete
   * @param activityId id of activity
   */
  async function deleteActivityApi(activityId: number) {
    try {
      const responseData = await deleteActivities({activityIds: [activityId]})
      if (responseData?.status === 200) {
        navigation.navigate(StackScreen.DRAWER_ACTIVITY, {
          screen: StackScreen.ACTIVITY_LIST,
          params: {
            filterListParams: {}
          }
        })
        Toast.show({
          position: 'bottom',
          visibilityTime: 3000,
          text2: TypeMessage.SUCCESS,
          text1: `${translate(messageButtonCommon.INF_COM_0005)}`,
          autoHide: true
        })
      } else {
        Toast.show({
          position: 'bottom',
          visibilityTime: 3000,
          text2: TypeMessage.ERROR,
          text1: `${translate(messageButtonCommon.ERR_COM_0005)}`,
          autoHide: true
        })
      }

    } catch (error) {
      ShowError.alert('Message', error.message)
    }
  }

  /**
   * Process delete activity
   */
  const processDeleteActivity = () => {
    setShowModalConfirmDelete(false)
    deleteActivityApi(activityParams?.activityId)
  }

  /**
   * render report targe
   */
  const renderReportTarget = () => {
    if(activityData?.task?.taskName) {
      return (
        <TouchableOpacity onPress={() => goToTaskDetail(activityData?.task?.taskId)}>
          <Text style={ActivityDetailStyles.colorBlue}>{activityData?.task?.taskName}</Text>
        </TouchableOpacity>
      )
    }
    if (activityData?.schedule?.scheduleName) {
      return (
        <TouchableOpacity onPress={() => goToScheduleDetail(activityData?.schedule?.scheduleId)}>
          <Text style={ActivityDetailStyles.colorBlue}>{activityData?.schedule?.scheduleName}</Text>
        </TouchableOpacity>
      )
    } 
    if (activityData?.milestone?.milestoneName) {
      return (
        <TouchableOpacity onPress={() => goToMilestoneDetail(activityData?.milestone?.milestoneId)}>
          <Text style={ActivityDetailStyles.colorBlue}>{activityData?.milestone?.milestoneName}</Text>
        </TouchableOpacity>
      )
    }
    return (
      <View></View>
    )
  }

  /**
   * render interview name
   * 
   * @param businessCards list id of business card
   * @param interviewers interview list
   */
  const renderInterviewerName = (businessCards?: Array<BusinessCard>, interviewers?: Array<string>) => {
    if(businessCards && businessCards?.length > 0) {
      return (
        <TouchableOpacity onPress={() => { goToBusinessCardDetail(businessCards[0]?.businessCardId)}}>
          <Text style={ActivityListStyle.colorActive}>
            {businessCards[0]?.firstName}{SPACE_HALF_SIZE}{businessCards[0]?.lastName}
          </Text>
        </TouchableOpacity>
      )
    }
    return (
      interviewers && interviewers?.length > 0 && <Text style={ActivityListStyle.colorActive}>{interviewers[0]}</Text>
    )
  }

  /**
   * Go to businessCardList screen
   */
  const goToBusinessCardList = () => {
    navigation.navigate(StackScreen.BUSINESS_CARD_LIST, {
      businessCards: activityData?.businessCards
    })
  }

  /**
   * Render businessCard list
   * @param businessCards
   * @param interviewer
   */
  const renderTotalInterviewer = (businessCards?: Array<BusinessCard>, interviewer?: Array<string>) => {
    let size = businessCards?.length || 0
    size = size + (interviewer?.length || 0)
    return (
      size > 1 && <TouchableOpacity onPress={() => goToBusinessCardList()}>
        <Text style={ActivityListStyle.colorActive}>
          {translate(messages.otherLabel)}{size - 1}{translate(messages.nameLabel)}
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * Render product trading name
   * 
   * @param productTradings list of product trading
   */
  const renderProductTradingName = (productTradings?: Array<ProductTrading>) => {
    return (
      productTradings && <Text>{productTradings[0]?.productName || TEXT_EMPTY}</Text>
    )
  }

  /**
   * Go to productList screen
   */
  const goToProductTradingList = () => {
    navigation.navigate(StackScreen.PRODUCT_TRADING_LIST, {
      productTradings: activityData?.productTradings
    })
  }

  /**
   * Render total product trading
   * 
   * @param productTradings list of product trading
   */
  const renderTotalProductTrading = (productTradings?: Array<ProductTrading>) => {
    let size = productTradings?.length || 0
    return (
      size > 1 &&
      <TouchableOpacity onPress={() => goToProductTradingList()}>
        <Text style={ActivityListStyle.colorActive}>
          {translate(messages.otherLabel)}{size - 1}{translate(messages.productNameLabel)}
        </Text>
      </TouchableOpacity>
    )
  }

  const goToEmployeeDetail = (employee: any) => {
    navigation.navigate(StackScreen.EMPLOYEE_DETAIL, {
      id: employee?.employeeId,
      title: `${employee?.employeeSurname} ${employee?.employeeName || TEXT_EMPTY}`,
    });
  }

  /**
   * Go to tasks detail screen
   * 
   * @param taskId Id of tasks
   */
  const goToTaskDetail = (taskId: number) => {
    navigation.navigate(StackScreen.TASK_STACK, {
      screen: ScreenName.TASK_DETAIL,
      params: {
        taskId: taskId
      }
    })
  }

  /**
   * Go to schedule detail screen
   * 
   * @param scheduleId Id of schedule
   */
  const goToScheduleDetail = (scheduleId: number) => {
    navigation.navigate(StackScreen.CALENDAR_SCREEN, {
      screen: "schedule-detail-screen",
      params: {
        id: scheduleId
      }
    })
  }

  /**
   * Go to milestone detail screen
   * 
   * @param milestoneId Id of milestone
   */
  const goToMilestoneDetail = (milestoneId: number) => {
    navigation.navigate(StackScreen.TASK_STACK, {
      screen: ScreenName.MILESTONE_DETAIL,
      params: {
        milestoneId: milestoneId
      }
    })
  }

  /**
   * Go to businessCard detail screen
   * 
   * @param businessCardId Id of businessCard
   */
  const goToBusinessCardDetail = (businessCardId: number) => {
    navigation.navigate(StackScreen.BUSINESS_CARD_STACK, {
      screen: "business-card-detail",
      params: {
        businessCardId: businessCardId
      }
    })
  }

  /**
   * Go to customer detail screen
   * 
   * @param customer customer info
   */
  const goToCustomerDetail = (customer: any) => {
    navigation.navigate(StackScreen.CUSTOMER_NAVIGATOR, {
      screen: StackScreen.CUSTOMER_DETAILS,
      params: {
        customerId: customer.customerId,
        customerName: customer.customerName
      }
    })
  }

  /**
   * Go to activity edit screen
   * 
   * @param activityId Id of activities
   */
  const goToEditActivity = (activityId: number, activityDraftId: number) => {
    navigation.navigate(StackScreen.ACTIVITY_CREATE_EDIT, {
      activityId: activityId,
      activityDraftId: activityDraftId,
      mode: ActivityRegisterEditMode.EDIT
    })
  }

  /**
   * Go to activity edit screen
   * 
   * @param activityId Id of activities
   */
  const goToListTimeLine = () => {
    navigation.navigate(StackScreen.TIME_LINE_STACK, {
      screen: "content-timeline"
    })
  }

  /**
   * Go to activity copy screen
   * 
   * @param activityId Id of activities
   */
  const goToCopyActivity = (activityId: number) => {
    navigation.navigate(StackScreen.ACTIVITY_CREATE_EDIT, {
      activityId: activityId,
      mode: ActivityRegisterEditMode.COPY
    })
  }

  const showModalConfirmDeleteAction = () => {
    return (
      <ModalConfirm
        key = {activityParams?.activityId}
        isVisible = {showModalConfirmDelete}
        setIsVisible = {(isVisible: boolean) => setShowModalConfirmDelete(isVisible)}
        titleModal = {translate(messages.recurringAppointment)}
        processActionCallBack = {() => processDeleteActivity()}
        typeModal = {TypeConfirm.DELETE}
        >
      </ModalConfirm>
    )
  }

  const onNavigateToRegisterSchedule = () => {
    setShowNavigateModal(false)
    navigation.navigate(StackScreen.PRODUCT_TRADING_MANAGER_STACK, {
      screen: ScreenName.REGISTER_SCHEDULE
    })
  };

  const onNavigateToRegisterTask = () => {
    setShowNavigateModal(false)
    navigation.navigate(StackScreen.PRODUCT_TRADING_MANAGER_STACK, {
      screen: ScreenName.REGISTER_TASK
    })
  };
  
  const navigateModal = () => {
    return <NavigationModal
      isVisible = {showNavigateModal}
      setIsVisible = {(isVisible: boolean) => setShowNavigateModal(isVisible)}
      goToRegisterSchedule={onNavigateToRegisterSchedule}
      goToRegisterTask={onNavigateToRegisterTask}/>;
  };

  /**
   * Handle copy url to clipBoard
   */
  const handleCopyUrl = () => {
    
  }

  return (
    <SafeAreaView style={Style.body}>
      <View>
        <AppBarMenu
          name={translate(messages.activityDetails)}
          hasBackButton={true}
        />
      </View>
        {loadState === 'loading' &&
          <AppIndicator size={30} style={DetailScreenStyles.loadingView} />
        }
        {loadState === 'failed' &&
          <View style={ActivityDetailStyles.alignItems}>
            <TouchableOpacity>
              <CommonMessage content={translate(messageButtonCommon.ERR_COM_0012)} type={TypeMessage.ERROR}></CommonMessage>
            </TouchableOpacity>
          </View>
        }
       { loadState === 'succeeded' &&
       <>
       <View style={[ActivityDetailStyles.container, tabList.length > 0 ? {} : {borderBottomWidth: 0.5} ]}>
        <View style={ActivityDetailStyles.topContents}>
          <View style={{flex:1}}>
            <View style={ActivityDetailStyles.topText}>
              <View style={ActivityDetailStyles.flexContent}>
                <DefaultAvatar
                  imgPath={activityData?.employee?.employeePhoto?.fileUrl}
                  userName={activityData?.employee?.employeeSurname }
                />
                <View style={ActivityListStyle.flex85}>
                  <View style = {{flexDirection: 'row'}}>
                    <Text style={[ActivityDetailStyles.time, ActivityDetailStyles.bold]}>
                      {CommonUtil.formatDateTime(activityData?.contactDate)}{SPACE_HALF_SIZE}
                      <Text style={ActivityDetailStyles.time}>
                        ({CommonUtil.formatDateTime(activityData?.activityStartTime, TIME_FORMAT)} - {CommonUtil.formatDateTime(activityData?.activityEndTime, TIME_FORMAT)}
                        {SPACE_HALF_SIZE}{activityData?.activityDuration}{translate(messages.minuteLabel)})
                      </Text>
                    </Text>
                    <View style={activityData?.activityDraftId !== null ? ActivityDetailStyles.iconLabelStyle : ActivityDetailStyles.activityDetail}>
                      { activityData?.activityDraftId !== null &&
                        <Text style={ActivityDetailStyles.iconLabelStyleText}>{translate(messages.labelActivityDraft)}</Text>
                      }
                    </View>
                  </View>
                  <View style={ActivityListStyle.contentTitle}>
                    <View>
                      <TouchableOpacity onPress={() => goToEmployeeDetail(activityData?.employee)}>
                        <Text style={[ActivityDetailStyles.name, ActivityDetailStyles.colorBlue, ActivityDetailStyles.bold]}>{activityData?.employee?.employeeSurname} {activityData?.employee?.employeeName}</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={ActivityListStyle.toolBox}>
                      <View style={ActivityListStyle.toolItem}>
                        <TouchableOpacity onPress={() => goToListTimeLine()}>
                          <Image
                            style={[ActivityDetailStyles.iconTimeLine]}
                            source={Images.listActivity.ic_timeLine}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={ActivityListStyle.toolItem}>
                        <TouchableOpacity onPress={() => handleCopyUrl()}>
                          <Image
                            style={[ActivityDetailStyles.iconTimeLine]}
                            source={Images.schedule_details.icon_share}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={[ActivityDetailStyles.flexContentCenter]}>
                    {renderReportTarget()}
                    <Text>{translate(messages.aboutLabel)}</Text>
                    {renderInterviewerName(activityData?.businessCards, activityData?.interviewer)} 
                    <Text>{translate(messages.mrLabel)}</Text>
                    {renderTotalInterviewer(activityData?.businessCards, activityData?.interviewer)} 
                    <Text>{translate(messages.whenLabel)}</Text>
                    <TouchableOpacity onPress={() => goToCustomerDetail(activityData?.customer)}>
                      <Text style={ActivityListStyle.colorActive}>
                        {activityData?.customer?.customerName}
                      </Text>
                    </TouchableOpacity>
                    {renderProductTradingName(activityData?.productTradings)}
                    {renderTotalProductTrading(activityData?.productTradings)}
                    <Text>{translate(messages.wasActiveLabel)}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[ActivityDetailStyles.flexContentCenter]}>
              <View style={ActivityDetailStyles.toolRight}>
                <View style={ActivityListStyle.toolItem}>
                  <TouchableOpacity onPress={() => goToCustomerDetail(activityData?.customer)}>
                    <Image
                    style={ActivityDetailStyles.iconActivityHistories}
                    source={Images.listActivity.ic_activityHistories}
                    />
                  </TouchableOpacity>
                </View>
                <View style={ActivityListStyle.toolItem}>
                  <TouchableOpacity onPress={() => goToCopyActivity(activityData?.activityId)}>
                    <Image
                      style={ActivityDetailStyles.iconSave}
                      source={Images.schedule_details.icon_save}
                    />
                  </TouchableOpacity>
                </View>
                <View style={ActivityListStyle.toolItem}>
                  <TouchableOpacity onPress={() => goToEditActivity(activityData?.activityId, activityData?.activityDraftId)}>
                    <Image
                      style={ActivityDetailStyles.iconPencil}
                      source={Images.schedule_details.icon_pencil}
                    />
                  </TouchableOpacity>
                </View>
                <View style={ActivityListStyle.toolItem}>
                  <TouchableOpacity onPress={ () => setShowModalConfirmDelete(true) }>
                    <Image
                      style={ActivityDetailStyles.iconRecycleBin}
                      source={Images.schedule_details.icon_recycle_bin}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      { tabList.length > 0 &&
        <CommonTab tabList={tabList} />
      }
      </>}
      {showModalConfirmDelete && showModalConfirmDeleteAction()}
      {showNavigateModal && navigateModal()}
      <AddButton onNavigate={() => setShowNavigateModal(true)} />
    </SafeAreaView>
  )
};