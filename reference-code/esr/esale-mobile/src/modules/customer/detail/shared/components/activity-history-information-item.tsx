import React, { } from "react";
import { View, TouchableOpacity, Text, Image} from "react-native"
import { ActivityHistoryInformationStyles } from "../../tabs/activity-history-information/activity-history-information-style";
import { Icon } from "../../../../../shared/components/icon";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../tabs/activity-history-information/activity-history-information-messages";
import { ActivityHistoryInformationItemProductTrading } from "./activity-history-information-item-product-trading";
import { Activity, BusinessCard, Customer, ProductTrading, Calendar } from "../../tabs/activity-history-information/activity-history-information-repository";
import { useNavigation, StackActions } from "@react-navigation/native";
import { ActivityRegisterEditMode, StackScreen } from "../../tabs/activity-history-information/enum-activity-history-information";
import { activityHistoryInformationActions } from "../../tabs/activity-history-information/activity-history-information-reducer";
import { useDispatch } from "react-redux";
import { CommonUtil } from "../../tabs/activity-history-information/common-util-activity-history-information";
import { TEXT_EMPTY, DATE_FORMAT, TIME_FORMAT, SPACE_HALF_SIZE, TWO_DOTS } from "../../../../../config/constants/constants";
import { DefaultAvatar } from "../../tabs/activity-history-information/avatar";

/**
* interface use for ActivityHistoryInformationItem
* @param activity data of an activity
* @param styleActivityItem style of component an activity
*/
interface ActivityItemProps {
  activity: Activity;
  styleActivityItem: {}
}

/**
 * Component for Activity item 
 * @param activity data of an activity
 * @param styleActivityItem style of component an activity
*/
export const ActivityHistoryInformationItem: React.FC<ActivityItemProps> = (
  {
    activity, 
    styleActivityItem
  }
) =>  {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // get value interviewerLabel
  let interviewerLabel:string = "";

  /**
   * Go to activity detail screen
   * @param activityId Id of activities
  */
  const goToActivityDetail = (activityId: number) => {
    navigation.navigate(StackScreen.ACTIVITY_DETAIL, {
      activityId: activityId
    })
  }

  /**
   * Go to employee detail screen
   * @param employeeId Id of employee
  */
  const goToEmployeeDetail = (employee: any) => {
    navigation.navigate(StackScreen.EMPLOYEE_DETAIL, {
      id: employee?.employeeId,
      title: `${employee?.employeeSurname} ${employee?.employeeName || TEXT_EMPTY}`,
    })
  }
  
  /** 
   * Render report target by task, schedule and milestone
  */
  const renderReportTarget = () => {
    if(activity?.task?.taskId) {
      return (
        <TouchableOpacity onPress={() => goToTaskDetail(activity?.task?.taskId)}>
          <Text style={ActivityHistoryInformationStyles.colorActive}>{activity?.task?.taskName}</Text>
        </TouchableOpacity>
      )
    }
    if (activity?.schedule?.scheduleId) {
      return (
        <TouchableOpacity onPress={() => goToScheduleDetail(activity?.schedule?.scheduleId)}>
          <Text style={ActivityHistoryInformationStyles.colorActive}>{activity?.schedule?.scheduleName}</Text>
        </TouchableOpacity>
      )
    }
    
    return (
      <TouchableOpacity onPress={() => goToMilestoneDetail(activity?.milestone?.milestoneId)}>
        <Text style={ActivityHistoryInformationStyles.colorActive}>{activity?.milestone?.milestoneName}</Text>
      </TouchableOpacity>
    )
  }

  /** 
   * Render interviewer name
   * @param businessCards get BusinessCard
   * @param interviewer get interviewer
  */
  const renderInterviewerName = (businessCards: Array<BusinessCard>, interviewer: Array<any>) => {
    if (interviewer?.length > 0) {
      interviewerLabel = interviewer[0];
    }
    return (
      businessCards?.length > 0 && (
        <TouchableOpacity onPress={() => goToBusinessCardDetail(businessCards[0]?.businessCardId)}>
          <Text style={ActivityHistoryInformationStyles.colorActive}>{businessCards[0]?.firstName + " " + businessCards[0]?.lastName}</Text>
        </TouchableOpacity>
      )
    )
  }

  /**
   * Render businessCard list
   * @param businessCards get BusinessCard
   * @param interviewer get interviewer
  */
  const renderTotalInterviewer = (businessCards: Array<BusinessCard>, interviewer: Array<any>) => {
    let size = businessCards?.length + interviewer?.length || 0; 
    return (
      size > 1 && (
        <TouchableOpacity onPress={() => goToBusinessCardList()}>
          <Text style={ActivityHistoryInformationStyles.colorActive}>
            {translate(messages.otherLabel)}{size -1}{translate(messages.nameLabel)}
          </Text>
        </TouchableOpacity>
      )
    )
  }

  /**
   * Render product trading name
   * @param productTradings list of product trading
  */
  const renderProductTradingName = (productTradings: Array<ProductTrading>) => {
    return (
      <Text>{productTradings[0]?.productName || TEXT_EMPTY}</Text>
    )
  }

  /**
   * Go to activity edit screen
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
   *  action handle delete activity
   * @param activityId Id of activities
  */
  const handleDeleteActivity = (activityId: number) => {
    handleIsDeleteConfirmDialog(true);
    dispatch(
      activityHistoryInformationActions.handleSetActivityId({
        activityId: activityId
      })
    );
  }

  /**
   * action handle hide/show dialog confirmation
   * @param isVisible get status isVisible of dialog confirmation
  */
  const handleIsDeleteConfirmDialog = (isVisible: boolean) => {
    dispatch(
      activityHistoryInformationActions.handleIsDeleteConfirmDialog({
        isModalVisible: isVisible
      })
    );
  }

  /**
   * Render total product trading
   * @param productTradings list of product trading
  */
  const renderTotalProductTrading = (productTradings: Array<ProductTrading>) => {
    let size = productTradings?.length || 0
    return (
      size > 1 && (
        <TouchableOpacity onPress={() => goToProductTradingList()}>
          <Text style={ActivityHistoryInformationStyles.colorActive}>
          {translate(messages.otherLabel)}{(size - 1)}{translate(messages.productNameLabel)}
          </Text>
        </TouchableOpacity>
      )
    )
  }

  /**
   * Go to customer detail screen
   * @param customerId Id of customer
   * @param customerName Name of customer
  */
  const goToCustomerDetail = (customerId: number, customerName: string) => {
    // Get params customer when tap item ChildCustomer
    let paramsCustomer: Customer  = {
      customerId: customerId,
      customerName: customerName,
    };
  
    // navigation Pass the paramsCustomer to the detail screen
    let navigationCustomerDetail = StackActions.push(StackScreen.CUSTOMER_DETAIL, paramsCustomer);
    return (
      navigation.dispatch(navigationCustomerDetail)
    );
  }

  /** 
   * Render schedule title
   * @param schedule
   */
  const renderScheduleTitle = (nextSchedule: any | Calendar) => {
    if (nextSchedule) {
      const productTradings: any = (nextSchedule?.productTradings || [])
      const productTradingName: string[] = []
      if (!nextSchedule?.scheduleName) {
        return ''
      }
      if (!nextSchedule?.customer?.customerName) {
        return ''
      }
      productTradings.forEach((p: any) => {
        if (p?.productName) {
          productTradingName.push(p?.productName ? p?.productName : TEXT_EMPTY)
        }
      })
      return ` ${nextSchedule?.scheduleName} (${nextSchedule?.customer?.customerName}/ ${productTradingName.join('、')})`
    }
    return ''
  }

  /**
   * Go to tasks detail screen
   * @param taskId Id of tasks
  */
  const goToTaskDetail = (taskId: any) => {
    navigation.navigate(StackScreen.TASK_DETAIL, {
      taskId: taskId
    })
  }

  /**
   * Go to schedule detail screen
   * @param scheduleId Id of schedule
  */
  const goToScheduleDetail = (scheduleId: any) => {
    navigation.navigate(StackScreen.SCHEDULE_DETAIL, {
      scheduleId: scheduleId
    })
  }

  /**
   * Go to milestone detail screen
   * @param milestoneId Id of milestone
  */
  const goToMilestoneDetail = (milestoneId: any) => {
    navigation.navigate(StackScreen.MILESTONE_DETAIL, {
      milestoneId: milestoneId
    })
  }

  /**
   * Go to businessCard detail screen
   * @param businessCardId Id of businessCard
  */
  const goToBusinessCardDetail = (businessCardId: number) => {
    navigation.navigate(StackScreen.BUSINESS_CARD_DETAIL, {
      businessCardId: businessCardId
    })
  }

  /**
   * Go to businessCardList screen
   */
  const goToBusinessCardList = () => {
    navigation.navigate(StackScreen.BUSINESS_CARD_LIST, {
      businessCards: activity?.businessCards?.slice(1, activity.businessCards.length)
    })
  }

  /**
   * Go to productList screen
   */
  const goToProductTradingList = () => {
    navigation.navigate(StackScreen.PRODUCT_TRADING_LIST, {
      productTradings: activity?.productTradings?.slice(1, activity.productTradings.length)
    })
  }

  return (
    <View style= {[ActivityHistoryInformationStyles.ActivityAll, styleActivityItem?styleActivityItem:{}]}>
      <View style={ActivityHistoryInformationStyles.flexContent}>

        <View style={ActivityHistoryInformationStyles.alignFlexCenter}>
          <DefaultAvatar imgPath={activity?.employee?.employeePhoto?.filePath} userName={activity?.employee?.employeeName} type={1} />
        </View>

        <View style={ActivityHistoryInformationStyles.topContent}>
          <View style={ActivityHistoryInformationStyles.justifyCenter}>
            <View style={ActivityHistoryInformationStyles.viewFlexContent}>
              <View style={ActivityHistoryInformationStyles.viewFlexContentTime}>
                <View style={ActivityHistoryInformationStyles.viewPaddingRight5}>
                  <TouchableOpacity onPress={() => goToActivityDetail(activity?.activityId)}>
                    <Text style={[ActivityHistoryInformationStyles.colorActive, ActivityHistoryInformationStyles.fontBold]}>
                      {CommonUtil.formatDateTime(activity?.contactDate, DATE_FORMAT) }
                    </Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={ActivityHistoryInformationStyles.fontBold}>
                    ({CommonUtil.formatDateTime(activity?.activityStartTime, TIME_FORMAT) } - { CommonUtil.formatDateTime(activity?.activityEndTime, TIME_FORMAT) } {SPACE_HALF_SIZE} {activity?.activityDuration}{translate(messages.minuteLabel)})
                  </Text>
                </View>
                <View style={(activity?.activityDraftId !== null) ? ActivityHistoryInformationStyles.iconLabelStyle : ActivityHistoryInformationStyles.iconLabelNormal}>
                  { activity?.activityDraftId !== null &&
                    <Text style={ActivityHistoryInformationStyles.iconLabelStyleText}>{translate(messages.activityHistoryInformationLabelActivityDraft)}</Text>
                  }
                </View>
              </View>
              <View>
                <TouchableOpacity onPress={() => goToEmployeeDetail(activity?.employee)}>
                  <Text style={[ActivityHistoryInformationStyles.colorActive, ActivityHistoryInformationStyles.fontBold]}>
                  {!activity?.employee?.employeeSurname ? activity?.employee?.employeeName : `${activity?.employee?.employeeSurname} ${activity?.employee?.employeeName}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={ActivityHistoryInformationStyles.viewContentCreatedDateEditDelete}>
              <TouchableOpacity style={ActivityHistoryInformationStyles.editIcon} onPress={() => goToEditActivity(activity?.activityId, activity?.activityDraftId)}>
                <Icon
                  name="edit"
                  style={ActivityHistoryInformationStyles.generalIcon}
                ></Icon>
              </TouchableOpacity>
              <TouchableOpacity style={ActivityHistoryInformationStyles.eraseIcon} onPress={()=> handleDeleteActivity(activity?.activityId)}>
                <Icon
                  name="erase"
                  style={ActivityHistoryInformationStyles.generalIcon}
                ></Icon>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={ActivityHistoryInformationStyles.flexContentView}>
            {renderReportTarget()}
            <Text>{translate(messages.aboutLabel)}</Text>
            {renderInterviewerName(activity?.businessCards, activity?.interviewers)}
            <Text>{interviewerLabel}</Text>
            <Text>{translate(messages.mrLabel)}</Text>
            {renderTotalInterviewer(activity?.businessCards, activity?.interviewers)}
            <Text>{translate(messages.whenLabel)}</Text>
            <TouchableOpacity onPress={() => goToCustomerDetail(activity?.customer?.customerId, activity?.customer?.customerName)}>
              <Text style={ActivityHistoryInformationStyles.colorActive}>
                {activity?.customer?.customerName}
              </Text>
            </TouchableOpacity>
            <Text>/</Text>
            {renderProductTradingName(activity?.productTradings)}
            {renderTotalProductTrading(activity?.productTradings)}
            <Text>{translate(messages.wasActiveLabel)}</Text>
          </View>

        </View>
      </View>

      <View style={ActivityHistoryInformationStyles.productList}>
        <Text style={ActivityHistoryInformationStyles.fontBold}>{`${translate(messages.tradingProductsTile)}`}</Text>
        
        {activity?.productTradings?.map((item: ProductTrading, index: number ) => {
            return (
              <ActivityHistoryInformationItemProductTrading
                key = {index.toString()}
                product = {item}/>
            )
          })}

        <View style={ActivityHistoryInformationStyles.flexContentViewProductBottom}>
          <View style={[ActivityHistoryInformationStyles.flexContentViewProduct, ActivityHistoryInformationStyles.pdBottom]}>
            <Text style={ActivityHistoryInformationStyles.fontBold}>{`${translate(messages.scheduleNextTime)}`}{SPACE_HALF_SIZE}{TWO_DOTS}{SPACE_HALF_SIZE}</Text>
            <Text style={[ActivityHistoryInformationStyles.fontSize12]}>
              {CommonUtil.formatDateTime(activity?.nextSchedule?.nextScheduleDate)}
            </Text>
            <Image style={[ActivityHistoryInformationStyles.iconRun, ActivityHistoryInformationStyles.marginHorizontalTextIconNextSchedule]} 
              source={{uri: activity?.nextSchedule?.iconPath}}
            />
            <Text style={ActivityHistoryInformationStyles.fontSize12} ellipsizeMode={'tail'}>{renderScheduleTitle(activity?.nextSchedule)}</Text>
          </View>
          <View style={[ActivityHistoryInformationStyles.flexContentViewProduct, ActivityHistoryInformationStyles.pdBottom]}>
            <Text style={ActivityHistoryInformationStyles.fontBold}>{translate(messages.memo)}{SPACE_HALF_SIZE}{TWO_DOTS}{SPACE_HALF_SIZE}</Text>
            <Text style={ActivityHistoryInformationStyles.fontSize12}>{activity?.memo}</Text>
          </View>
        </View>
      </View>

      <View style={ActivityHistoryInformationStyles.bottomActivity}>
        <TouchableOpacity style={ActivityHistoryInformationStyles.flexDRow}>
          <Icon 
            name="activityComment" style={ActivityHistoryInformationStyles.iconBottom}
          ></Icon>
          <Text style={ActivityHistoryInformationStyles.comment}>2</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ActivityHistoryInformationStyles.flexDRow}>
          <Icon
            name="activityQuote" style={ActivityHistoryInformationStyles.iconQuote}>
          </Icon>
        </TouchableOpacity>
        <TouchableOpacity style={ActivityHistoryInformationStyles.flexDRow}>
          <Icon
            name="activityShare" style={ActivityHistoryInformationStyles.iconBottom}>
          </Icon>
        </TouchableOpacity>
        <TouchableOpacity style={ActivityHistoryInformationStyles.flexDRow}>
          <Icon
            name="activitySmile" style={ActivityHistoryInformationStyles.iconBottom}>
          </Icon>
        </TouchableOpacity>
        <TouchableOpacity style={ActivityHistoryInformationStyles.flexDRow}>
          <Icon
            name="activityStar" style={ActivityHistoryInformationStyles.iconBottom}>
          </Icon>
        </TouchableOpacity>
      </View>
    </View>
  )
}