import * as React from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { ActivityListStyle } from "./activity-list-style"
import { Icon } from "../../../shared/components/icon"
import { Activity, ProductTrading, BusinessCard, Calendar, activityActions } from "./activity-list-reducer"
import { useNavigation } from "@react-navigation/native"
import { ProductItem } from "./product-trading-item"
import { CommonUtil } from "../common/common-util"
import { translate } from "../../../config/i18n"
import { messages } from "./activity-list-messages"
import { ActivityRegisterEditMode } from "../api/get-activities-type"
import { TEXT_EMPTY, TIME_FORMAT, TWO_DOTS, SPACE_HALF_SIZE } from "../../../config/constants/constants"
import { StackScreen, TargetReport } from "../constants"
import { normalize } from "../common";
import { DefaultAvatar } from "../common/avatar"
import { ProductTradingsType } from "../../calendar/api/schedule-list-type"
import { authorizationSelector } from "../../login/authorization/authorization-selector"
import { useSelector, useDispatch } from "react-redux"

interface ActivityItemProps {
  activity: Activity
  styleActivityItem: {}
  onclickDeleteActivityItem: any
  isDraft: boolean
  isDelete?: boolean
  isEdit?: boolean
}
/**
 * Component for Activity item 
 * @param activity data of an activity
 * @param styleActivityItem style of component an activity
 * @param onclickDeleteActivityItem binding event click delete an activity
 */
export const ActivityItem : React.FC<ActivityItemProps> = ({
  activity, styleActivityItem, onclickDeleteActivityItem: onclickDeleteActivityItem, isDraft, isDelete = true, isEdit = true
}) => {
  const navigation = useNavigation()
  const authorizationState = useSelector(authorizationSelector)
  const formatDate = authorizationState?.formatDate ?? TEXT_EMPTY
  const dispatch = useDispatch()
  
  /** 
   * Render report target by task, schedule and milestone
   */
  const renderReportTarget = () => {
    return (activity?.task?.taskId) ? TargetReport.TASK
        : activity?.schedule?.scheduleId ? TargetReport.SCHEDULE
        : activity?.milestone?.milestoneId ? TargetReport.MILESTONE
        : TEXT_EMPTY
  };
  const targetName = renderReportTarget();

  /** 
   * Render interviewer name
   * @param businessCards
   * @param interviewer
   */
  const renderInterviewerName = (businessCards: Array<BusinessCard>, interviewers: Array<string>) => {
    if(businessCards?.length > 0) {
      return (
        <TouchableOpacity onPress={() => goToBusinessCardDetail(businessCards[0]?.businessCardId)}>
          <Text style={ActivityListStyle.colorActive}>{businessCards[0]?.firstName}{SPACE_HALF_SIZE}{businessCards[0]?.lastName}</Text>
        </TouchableOpacity>
      )
    } else if (interviewers?.length > 0) {
      return (
        <Text style={ActivityListStyle.colorActive}>{interviewers[0]}</Text>
      )
    }
    return (<View/>)
  }

  /**
   * Render businessCard list
   * @param businessCards
   * @param interviewer
   */
  const renderTotalInterviewer = (businessCards: Array<BusinessCard>, interviewers: Array<string>) => {
    let size = businessCards?.length
    if (interviewers) {
      size += interviewers?.length
    }
    if (size > 1) {
      return (
        <TouchableOpacity onPress={() => {goToBusinessCardList()}}>
          <Text style={ActivityListStyle.colorActive}>
            {translate(messages.otherLabel)}{size - 1}{translate(messages.nameLabel)}
          </Text>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity>
        <Text style={ActivityListStyle.colorActive}/>
      </TouchableOpacity>
    )
  }

  /**
   * Render product trading name
   * 
   * @param productTradings list of product trading
   */
  const renderProductTradingName = (productTradings: Array<ProductTrading>) => {
    return (
      <Text>{productTradings[0]?.productName || TEXT_EMPTY}</Text>
    )
  }

  /**
   * Render total product trading
   * @param productTradings list of product trading
   */
  const renderTotalProductTrading = (productTradings: Array<ProductTrading>) => {
    let size = productTradings?.length
    if (size > 1) {
      return (
        <TouchableOpacity onPress={() => {goToProductTradingList()}}>
          <Text style={ActivityListStyle.colorActive}>
          {translate(messages.otherLabel)}{(size - 1)}{translate(messages.productNameLabel)}
          </Text>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity>
        <Text style={ActivityListStyle.colorActive}>
        </Text>
      </TouchableOpacity>
    )
  }

  /**
   * Go to activity detail screen
   * @param activityId Id of activities
   */
  const goToActivityDetail = (activityId: number) => {
    navigation.navigate(StackScreen.ACTIVITY_DETAIL, {
      activityId: activityId,
      itemDetail: activity
    })
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
   * Go to employee detail screen
   * @param employeeId Id of employee
   */
  const goToEmployeeDetail = (employee: any) => {
    navigation.navigate("detail-employee", {
      id: employee?.employeeId,
      title: `${employee?.employeeSurname} ${employee?.employeeName || TEXT_EMPTY}`,
    });
  }

  /**
   * Navigate to target report
   * @param target 
   * @param id 
   */
  const onNavigateToTargetReport = (target: any, id: number) => {
    switch (target) {
      case TargetReport.TASK:
        navigation.navigate(StackScreen.TASK_DETAIL, {
          taskId: id,
        });
        break;
      case TargetReport.MILESTONE:
        navigation.navigate(StackScreen.MILESTONE_DETAIL, {
          milestoneId: id,
        });
        break;
      case TargetReport.SCHEDULE:
        navigation.navigate(StackScreen.CALENDAR_DETAILS, {
          scheduleId: id
        });
        break;
      default:
        break;
    }
  };

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
   * Go to customer detail screen
   * @param customerId Id of customer
   */
 const goToCustomerDetail = (customerId:number, customerName: string) => {
  let paramCustomer = {
    customerId: customerId,
    customerName: customerName,
  };
  dispatch(activityActions.addCustomerIdNavigation(customerId));
  navigation.navigate(StackScreen.CUSTOMER_DETAILS, paramCustomer)
}

  /**
   * Go to businessCardList screen
   */
  const goToBusinessCardList = () => {
    navigation.navigate(StackScreen.BUSINESS_CARD_LIST, {
      businessCards: activity?.businessCards
    })
  }

  /**
   * Go to productList screen
   */
  const goToProductTradingList = () => {
    navigation.navigate(StackScreen.PRODUCT_TRADING_LIST, {
      productTradings: activity?.productTradings
    })
  }

  
  /** 
   * Render schedule title
   * @param schedule
   */
  const renderScheduleTitle = (nextSchedule: any | Calendar) => {
    if (nextSchedule ) {
      const productTradings: ProductTradingsType[] = (nextSchedule?.productTradings || [])
      const productTradingName: string[] = []
      if (!nextSchedule?.scheduleName) {
        return ''
      }
      if (!nextSchedule?.customer?.customerName) {
        return ''
      }
      productTradings.forEach(p => {
        if (p?.productName) {
          productTradingName.push(p?.productName ? p?.productName : TEXT_EMPTY)
        }
      })
      return ` ${nextSchedule?.scheduleName} (${nextSchedule?.customer?.customerName}/ ${productTradingName.join('、')})`
    }
    return ''
  }
  
    return (
      <View style= {ActivityListStyle.ActivityAll}>
        {/* Activity top */}
        <View style={[ActivityListStyle.flexContent, styleActivityItem?styleActivityItem:{}]}>
          <View style={ActivityListStyle.alignFlexCenter}>
            <DefaultAvatar
              imgPath={activity?.employee?.employeePhoto?.fileUrl}
              userName={activity?.employee?.employeeName}
            />
          </View>
          <View style={ActivityListStyle.topContent}>
            <View style={ActivityListStyle.justifyCenter}>
              <View style={ActivityListStyle.flex10}>
                <View style={ActivityListStyle.flexContent}>
                  <View style={ActivityListStyle.ActivityTopLeft}>
                    <TouchableOpacity onPress={() => goToActivityDetail(activity?.activityId)}>
                      <Text style={[ActivityListStyle.colorActive, ActivityListStyle.fontBold]}>
                        {CommonUtil.formatDateTime(activity?.contactDate, formatDate.toUpperCase())}
                      </Text>
                    </TouchableOpacity>
                    <View style={{marginLeft: normalize(4)}}>
                        <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>
                          ({CommonUtil.formatDateTime(activity?.activityStartTime, TIME_FORMAT) } - { CommonUtil.formatDateTime(activity?.activityEndTime, TIME_FORMAT) } {SPACE_HALF_SIZE} {activity?.activityDuration} {translate(messages.minuteLabel)})
                        </Text>
                    </View>
                  </View>
                  <View style={ActivityListStyle.iconLabelTop}>
                    <View style={(activity?.activityDraftId !== null && !isDraft) ? ActivityListStyle.iconLabelStyle : ActivityListStyle.iconLabelNormal}>
                      { activity?.activityDraftId !== null && !isDraft &&
                        <Text style={ActivityListStyle.iconLabelStyleText}>{translate(messages.labelActivityDraft)}</Text>
                      }
                    </View>
                    {authorizationState.employeeId === activity?.employee?.employeeId  && isEdit && <View style={ActivityListStyle.editIcon}>
                      <TouchableOpacity onPress={() => goToEditActivity(activity?.activityId, activity?.activityDraftId)}>
                        <Icon name="activityPen" style={ActivityListStyle.generalIcon}/>
                      </TouchableOpacity>
                    </View>
                    }
                    {authorizationState.employeeId === activity?.employee?.employeeId && isDelete && <View style={ActivityListStyle.editIcon}>
                      <TouchableOpacity
                        onPress={()=> onclickDeleteActivityItem(true)}>
                        <Icon name="activityRemove" style={ActivityListStyle.generalIcon}/>
                      </TouchableOpacity>
                    </View>
                    }
                  </View>
                </View>
                <View style={ActivityListStyle.flex1}>
                  <TouchableOpacity onPress={() => goToEmployeeDetail(activity?.employee)}>
                    <Text style={[ActivityListStyle.colorActive, ActivityListStyle.fontBold]}>
                      {!activity?.employee?.employeeSurname ? activity?.employee?.employeeName : `${activity?.employee?.employeeSurname} ${activity?.employee?.employeeName}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={ActivityListStyle.flexContent}>
              { targetName !== TEXT_EMPTY && 
                <Text onPress={() => onNavigateToTargetReport(targetName, activity[targetName][`${targetName}Id`])} style={ActivityListStyle.colorActive}>
                  {activity[targetName][`${targetName}Name`]}
                </Text>
              }
              <Text>{translate(messages.aboutLabel)}</Text>
              {renderInterviewerName(activity?.businessCards, activity?.interviewers)}
              <Text>{translate(messages.mrLabel)}</Text>
              {renderTotalInterviewer(activity?.businessCards, activity?.interviewers)}
              <Text>{translate(messages.whenLabel)}</Text>
              <TouchableOpacity onPress={() => goToCustomerDetail(activity?.customer?.customerId, activity?.customer?.customerName)}>
                <Text style={ActivityListStyle.colorActive}>
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
        {/* Activity content */}
        <View style={[ActivityListStyle.productList, styleActivityItem?styleActivityItem:{}]}>
          <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{`${translate(messages.tradingProductsTitle)}`}</Text>
          {activity?.productTradings?.map((item: ProductTrading, index: number ) => {
            return (
              <ProductItem
                key = {index.toString()}
                product = {item}/>
            )
          })}
        </View>
        <View style={[ActivityListStyle.flexContent, ActivityListStyle.pdLeft, ActivityListStyle.pdBottom, styleActivityItem?styleActivityItem:{}]}>
          <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{`${translate(messages.scheduleNextTime)}`}{SPACE_HALF_SIZE}{TWO_DOTS}{SPACE_HALF_SIZE}</Text>
          <Text style={ActivityListStyle.fontSize12}>
            {CommonUtil.formatDateTime(activity?.nextSchedule?.nextScheduleDate, formatDate.toUpperCase()) }{TEXT_EMPTY}
          </Text>
          <Image style={ActivityListStyle.iconRun} source={{uri: activity?.nextSchedule?.iconPath}} />
          <Text style={[ActivityListStyle.title, ActivityListStyle.colorBlue]} ellipsizeMode={'tail'}>
            {renderScheduleTitle(activity?.nextSchedule)}
          </Text>
        </View>
        <View style={[ActivityListStyle.flexContent,ActivityListStyle.pdLeft, ActivityListStyle.pdBottom, styleActivityItem?styleActivityItem:{}]}>
          <Text>
            <Text style={[ActivityListStyle.fontBold, ActivityListStyle.colorBold]}>{translate(messages.memo)}{SPACE_HALF_SIZE}{TWO_DOTS}{SPACE_HALF_SIZE}</Text>
            <Text style={ActivityListStyle.fontSize12}>{activity?.memo}</Text>
          </Text>
        </View>
        {/* Bottom activityList */}
          {!isDraft && (
            <View style={ActivityListStyle.bottomActivity}>
            </View>
          )}
      </View>
    )
}