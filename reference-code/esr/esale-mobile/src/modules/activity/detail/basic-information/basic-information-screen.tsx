import * as React from "react"
import {Text, View, ScrollView, Image} from "react-native"
import { BasicInformationStyles } from "./basic-information-style"
import { Style } from "../../../calendar/common"
import { messages } from "./basic-information-messages"
import { translate } from "../../../../config/i18n"
import { ProductTrading, Calendar, FieldInfo } from "../activity-detail-reducer"
import { CommonUtil } from "../../common/common-util"
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import {Icon} from "../../../../shared/components/icon"
import {StackScreen, SpecialFieldInfo, ActivityDefaultFieldInfo, FieldInfoNotUse, SpecialFieldInfoArr} from "../../constants"
import { fieldInfosSelector, activityDetailSelector } from "../activity-detail-selector"
import { useSelector } from "react-redux"
import { FIELD_LABLE, TEXT_EMPTY, SPACE_HALF_SIZE } from "../../../../config/constants/constants"
import { DynamicControlField } from "../../../../shared/components/dynamic-form/control-field/dynamic-control-field"
import { ControlType, DefineFieldType, AvailableFlag } from "../../../../config/constants/enum"
import { authorizationSelector } from "../../../login/authorization/authorization-selector"
import StringUtils from "../../../../shared/util/string-utils"
import EntityUtils from '../../../../shared/util/entity-utils'
import _ from "lodash"
import { ProductTradingsType } from "../../../calendar/api/schedule-list-type"

/**
 * Component for show basic information of activity
 */
export const BasicInformationScreen : React.FC = () => {
  const navigation = useNavigation()
  const activity = useSelector(activityDetailSelector)
  const fieldInfos = useSelector(fieldInfosSelector)  
  const rowData: { key: any, fieldValue: any } = { key: undefined, fieldValue: undefined }

  /**
   * Go to customer detail screen
   * 
   * @param customerId Id of customer
   */
  const goToCustomerDetail = (customerId: number) => {
    navigation.navigate("customerDetail", {
      customerId: customerId
    })
  }

   /**
   * Go to schedule detail screen
   * 
   * @param scheduleId Id of schedule
   */
  const goToScheduleDetail = (scheduleId: number) => {
    navigation.navigate("scheduleDetail", {
      scheduleId: scheduleId
    })
  }
   /**
   * Go to task detail screen
   * 
   * @param taskId Id of task
   */
  const goToTaskDeTail = (taskId: number) => {
    navigation.navigate("taskDetail", {
      taskId: taskId
    })
  }
   /**
   * Go to milestone detail screen
   * 
   * @param milestoneId Id of milestone
   */
  const goToMileStoneDetail = (milestoneId: number) => {
    navigation.navigate("mileStoneDetail", {
      milestoneId: milestoneId
    })
  }

  const goToBusinessCardDetail = (businessCardId: number) => {
    navigation.navigate("businessCardDetail", {
      businessCardId: businessCardId
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
  
  /*
   * Navigate to Product Details Screen
   */
  const onOpenProductDetail = (item: ProductTrading) => {
    navigation.navigate(StackScreen.PRODUCT_TRADING_DETAIL, {
      data: item
    })
  }

  /**
   * format amount to currency
   * @param value 
   */
  const convertToCurrency = (value: any, field: FieldInfo) => {
    let currencyValue = value.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    let currency = field?.currencyUnit? field?.currencyUnit: TEXT_EMPTY
    return field?.typeUnit === 0 ? currency + currencyValue : currencyValue + currency
  }

  /**
  * languageCode
  */
  const authorizationState = useSelector(authorizationSelector)
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY
  return (
    <ScrollView style={Style.body}>
      {
        fieldInfos && fieldInfos.length > 0 &&
        fieldInfos.filter(e => e.availableFlag === AvailableFlag.AVAILABLE_IN_BOTH).sort((a,b) => a.fieldOrder - b.fieldOrder)?.map(field => {
          if (field.isDefault) {
            rowData.fieldValue = EntityUtils.getValueProp(activity, field.fieldName)
          } else {
            const activityData = activity?.activityData?.find(item => item.key === field.fieldName)
            rowData.fieldValue = activityData?.value
          }
          
          const title = StringUtils.getFieldLabel(field, FIELD_LABLE, languageCode)
          if (field.fieldName === ActivityDefaultFieldInfo.ACTIVITY_TIME) {
            return (
            <View key={field.fieldId} style={BasicInformationStyles.item}>
              <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                {title}
              </Text>
              <Text style={[BasicInformationStyles.textSmall]}>{ CommonUtil.formatDateTime(activity?.contactDate) }({ activity?.activityDuration }{translate(messages.minuteLabel)})</Text>
            </View>
            )
          } else if (field.fieldName === ActivityDefaultFieldInfo.CUSTOMER_ID) {
            return(
              <View key={field.fieldId} style={BasicInformationStyles.item}>
                <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                  {title}
                </Text>
                <TouchableOpacity onPress={() => goToCustomerDetail(activity?.customer?.customerId)}>
                  <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                    {activity?.customer?.customerName}
                  </Text>
                </TouchableOpacity>
              </View>
            )
          } else if (field.fieldName === ActivityDefaultFieldInfo.ACTIVITY_FORMAT_ID) {
            let fieldActivityFormat = _.cloneDeep(field)
            fieldActivityFormat.fieldType = Number(DefineFieldType.TEXT)
            let formatName = ""
            const name = JSON.parse(EntityUtils.getValueProp(activity, "name"))
            if (
              name &&
              Object.prototype.hasOwnProperty.call(name, languageCode)
            ) {
              formatName = EntityUtils.getValueProp(name, languageCode)
            }
            return(
              <View key={field.fieldId} style={BasicInformationStyles.item}>
                <DynamicControlField
                  controlType={ControlType.DETAIL}
                  fieldInfo={fieldActivityFormat}
                  elementStatus={{fieldValue: formatName}}
                />
              </View>
            )
          } else if (field.fieldName === ActivityDefaultFieldInfo.ACTIVITY_TARGET_ID) {
            return(
              <View key={field.fieldId} style={BasicInformationStyles.item}>
                <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                  {title}
                </Text>
                { activity?.schedule?.scheduleId && (
                  <TouchableOpacity onPress={() => goToScheduleDetail(activity?.schedule?.scheduleId)} >
                    <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                      {activity?.schedule?.scheduleName}
                    </Text>
                  </TouchableOpacity>
                )}
                { activity?.task?.taskId && (
                  <TouchableOpacity onPress={() => goToTaskDeTail(activity?.task?.taskId)} >
                    <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                      {activity?.task?.taskName}
                    </Text>
                  </TouchableOpacity>
                )}
                { activity?.milestone?.milestoneId && (
                  <TouchableOpacity onPress={() => goToMileStoneDetail(activity?.milestone?.milestoneId)} >
                    <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                      {activity?.milestone?.milestoneName}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )
          } else if (field.fieldName === ActivityDefaultFieldInfo.CUSTOMER_RELATION_ID) {
            return(
              <View key={field.fieldId} style={BasicInformationStyles.item}>
                <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                  {title}
                </Text>
                {activity?.customerRelations?.map((item, index) => {
                  return (
                    <TouchableOpacity onPress={() => goToCustomerDetail(item.customerRelationId)} >
                      <Text key={index.toString()} style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                        {item.customerName}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )
          } else if (field.fieldName === SpecialFieldInfo.INTERVIEWER) {
            return(
              <View key={field.fieldId} style={BasicInformationStyles.item}>
                <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                  {title}
                </Text>
                { activity?.businessCards && activity?.businessCards?.length > 0 && (
                  activity?.businessCards?.map((item, index) => {
                    return (
                      <TouchableOpacity key={index} onPress={() => goToBusinessCardDetail(item.businessCardId)} >
                        <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                          {item.firstName}{SPACE_HALF_SIZE}{item.lastName}
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                )
                )}
                { activity?.interviewer && activity?.interviewer?.length > 0 && (
                  activity?.interviewer.map((item, index) => {
                    return (
                      <Text key={index} style={BasicInformationStyles.title}>
                        {item}
                      </Text>
                    )
                  }
                )
                )}
              </View>
            )
          } else if (field.fieldName === SpecialFieldInfo.PRODUCT_TRADING_ID && activity?.productTradings && activity?.productTradings?.length > 0) {
            return (
              <View key={field.fieldId} style={BasicInformationStyles.contents}>
                <View style={BasicInformationStyles.listTitle}>
                  <View style={BasicInformationStyles.blueLine}/>
                  <View style={{flex:1}}>
                    <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                      {title}
                    </Text>
                  </View>
                </View>
                  {activity?.productTradings?.map((item: ProductTrading, index: number) => {
                    return (
                      <View style={[BasicInformationStyles.item, BasicInformationStyles.itemV2]} key={index.toString()}>
                        <View key={index.toString()} style={{flex: 1}}>
                          <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>{item.productName}</Text>
                          <Text style={BasicInformationStyles.textSmall}>{`${translate(messages.endPlanDate)}`}: {CommonUtil.formatDateTime(item.endPlanDate)}</Text>
                          <Text style={BasicInformationStyles.textSmall}>{`${translate(messages.productTradingProgress)}`}：{StringUtils.getFieldLabel(item, "progressName", languageCode)}</Text>
                          <Text style={BasicInformationStyles.textSmall}>{`${translate(messages.amountOfMoney)}`}： {convertToCurrency(item?.amount, field)}</Text>
                        </View>
                        <TouchableOpacity hitSlop={{top: 50, bottom: 50, left: 50, right: 50}} onPress = {() => onOpenProductDetail(item)}>
                          <Icon name='arrowRight'/>
                        </TouchableOpacity>
                      </View>
                    )
                  })}
              </View>
            )
          } else if (field.fieldName === SpecialFieldInfo.NEXT_SCHEDULE_ID) {
              return(
                  <View key={field.fieldId} style={[BasicInformationStyles.item]}>
                    <Text style={[BasicInformationStyles.title, BasicInformationStyles.bold]}>
                        {title}
                    </Text>
                    <View style={{flex: 1, flexDirection:"row",}}>
                      <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]}>
                          {CommonUtil.formatDateTime(activity?.nextSchedule?.startDate) }{' '}
                      </Text>
                      <Image style={BasicInformationStyles.icon} source={{uri: activity?.nextSchedule?.iconPath}} />
                      <Text style={[BasicInformationStyles.title, BasicInformationStyles.colorBlue]} ellipsizeMode={'tail'}>
                          {renderScheduleTitle(activity?.nextSchedule)}
                      </Text>
                    </View>
                  </View>
              )
          } 
          else if (FieldInfoNotUse.indexOf(field.fieldName) === -1 && SpecialFieldInfoArr.indexOf(field.fieldName) === -1) {
            return (
              <View key={field.fieldId} style={BasicInformationStyles.item}>
                <DynamicControlField
                  controlType={ControlType.DETAIL}
                  fieldInfo={field}
                  elementStatus={{fieldValue: rowData.fieldValue}}
                />
              </View>
            )
          }
          return null
        })
      }
    </ScrollView>
  )
}
