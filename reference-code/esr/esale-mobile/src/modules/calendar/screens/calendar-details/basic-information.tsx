import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View, Linking } from "react-native";
import { Images } from "../../config";
import styles from "./style";
import { Style } from "../../common";
import { Calendar } from "../../api/get-schedule-type";
import { EmployeesType } from "../../api/get-schedule-type";
import { STATUS_PARTICIPANTS, LINK_GOOGLE_MAP } from "../../constants";
import { messages } from "../../calendar-list-messages";
import { translate } from "../../../../config/i18n";
import { useSelector } from "react-redux";
import { LanguageCode } from "../../../../config/constants/enum";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";

/**
 * type BasicInformation
 */
type IBasicInformation = {
  schedule: Calendar;
}
/**
 * Basic Information component
 * @param schedule data transfer
 */
export const BasicInformation = React.memo(({ schedule }: IBasicInformation) => {
  /**
   * render employee
   * @param item
   * @param idx
   * @param keyPrefix
   */
  const renderEmployee = (item: EmployeesType, idx: number) => {
    return <TouchableOpacity onPress={() => alert('Go to detail user')} style={styles.block_user} key={idx}>
      <Image style={styles.icon_user} source={item.photoEmployeeImg || Images.schedule_details.icon_user_blue} />
      <Text style={[styles.time, { color: "#0F6DB1" }]}>{((item.employeeName).length > 18) ? (((item.employeeName).substring(0, 18 - 3)) + '...') : item.employeeName}</Text>

    </TouchableOpacity>
  }
  const [iconAddress, setIconAddress] = useState('')
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode || LanguageCode.JA_JP;
  useEffect(() => {
    if (schedule.zipCode !== '' && schedule.zipCode !== null) {
      setIconAddress('〒')
    }
    else {
      setIconAddress('')
    }
  }, [schedule])
  return (
    schedule &&
    <View style={Style.container}>
      <View style={styles.tab_item}>
        <Image
          style={[styles.icon_building]}
          source={Images.schedule_details.icon_building}
        />
        <View style={styles.top_title}>
          <Text>{translate(messages.customerProductTradings)}</Text>


          <View>
            {
              (schedule && schedule.customer && schedule.customer.length > 0) &&
              schedule.customer?.map((customer, idxCustomer) => {
                return <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity style={Object.assign(styles.time, { color: "#0F6DB1", flex: 5 })} key={idxCustomer}>
                    {customer.customerName} {customer.parentCustomerName} /
                    {
                      (schedule.productTradings !== null) &&
                      schedule.productTradings?.map((product, idxProduct) => {
                        return <Text key={'productTrading_' + idxProduct}>
                          &nbsp;{idxProduct > 0 ? product.producTradingName : '...'}
                          {idxProduct < schedule.productTradings!.length - 1 ? ',' : ''}
                        </Text>
                      })
                    }
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 2 }}>
                    <Text style={styles.button}>{translate(messages.historyActivities)}</Text>
                  </TouchableOpacity>
                </View>
              })
            }
          </View>


        </View>
      </View>
      <View style={styles.tab_item}>
        <Image
          style={[styles.icon_building]}
          source={Images.schedule_details.icon_building}
        />
        <View style={styles.top_title}>
          <Text>{translate(messages.relatedCustomers)}</Text>
          <View style={styles.item}>
            {schedule.customer &&
              <View style={styles.item}>
                {
                  (schedule.customer !== null) &&
                  schedule.relatedCustomers?.map((customer, idxCustomer) => {
                    return <TouchableOpacity>
                      <Text style={[styles.time, { color: "#0F6DB1" }]}>
                        &nbsp;{customer.customerName}
                        {idxCustomer < schedule.relatedCustomers!.length - 1 ? ',' : ''}
                      </Text>
                    </TouchableOpacity>
                  })
                }
              </View>
            }
          </View>
        </View>
      </View>
      <View style={styles.tab_item}>
        <Image
          style={[styles.icon_location]}
          source={Images.schedule_details.icon_location}
        />
        <View style={styles.top_title}>
          <Text>{translate(messages.customer)}/{translate(messages.streetAddress)}</Text>
          <TouchableOpacity onPress={() =>
            Linking.openURL(LINK_GOOGLE_MAP +
              schedule.buildingName +
              schedule.addressBelowPrefectures +
              schedule.prefecturesName)}>
            <View style={styles.item}>
              <Text style={[styles.time, { color: "#0F6DB1" }]}>
                {iconAddress}{schedule.zipCode}{schedule.buildingName}
                {schedule.addressBelowPrefectures}
                {schedule.prefecturesName}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tab_item}>
        <Image
          style={[styles.icon_door]}
          source={Images.schedule_details.icon_door}
        />
        <View style={styles.top_title}>
          <Text>{translate(messages.equipments)}</Text>
          {schedule.equipments &&
            <View style={styles.item}>
              {(schedule.equipments) &&
                schedule.equipments.map((item, idx) => {
                  return <Text style={[styles.time]} key={'equipment_' + idx}>{JSON.parse(item.equipmentName)[languageCode]}</Text>
                })
              }
            </View>
          }
        </View>
      </View>
      <View style={styles.tab_item}>
        <Image
          style={[styles.icon_door]}
          source={Images.schedule_details.icon_user}
        />
        <View style={styles.top_title}>
          <Text>{translate(messages.businessCards)}</Text>
          <View style={styles.item}>
            {schedule.businessCards &&
              schedule.businessCards.map((item, idx) => {
                return <Text key={'businessCard_' + idx} style={[styles.time, { color: "#0F6DB1" }]}>
                  {item.businessCardName}{idx < schedule.businessCards!.length - 1 ? ',' : ''}
                </Text>;
              })
            }
          </View>
        </View>
      </View>
      <View style={styles.tab_item}>
        <Image
          style={[styles.icon_door]}
          source={Images.schedule_details.icon_user}
        />
        <View style={styles.top_title}>
          <Text>{translate(messages.participants)}</Text>
          <View>
            <View style={styles.block_user}>
              {
                schedule.participants &&
                (schedule.participants?.employees) &&
                schedule.participants?.employees.filter((item: any) => item.attendanceDivision !== STATUS_PARTICIPANTS.ABSENTEES && item.attendanceDivision !== STATUS_PARTICIPANTS.UNCONFIRMED)
                  .map((item, idx) => {
                    return renderEmployee(item, idx);
                  })
              }
            </View>
            <View>
              <Text>{translate(messages.absentees)}</Text>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                {
                  schedule.participants &&
                  (schedule.participants?.employees) &&
                  schedule?.participants?.employees.filter((item: any) => item.attendanceDivision == STATUS_PARTICIPANTS.ABSENTEES)
                    .map((item, idx) => {
                      return renderEmployee(item, idx)
                    })
                }
              </View>
            </View>
            <View>
              <Text>{translate(messages.unconfirmed)}</Text>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                {
                  schedule.participants &&
                  (schedule.participants?.employees) &&
                  schedule.participants?.employees.filter((item: any) => item.attendanceDivision === STATUS_PARTICIPANTS.UNCONFIRMED)
                    .map((item, idx) => {
                      return renderEmployee(item, idx)
                    })
                }
              </View>
            </View>
            <View>
              <Text>{translate(messages.sharer)}</Text>
              <View style={{ width: '100%', flexDirection: 'row' }}>
                {
                  schedule.sharers &&
                  (schedule.sharers?.employees) &&
                  schedule.sharers?.employees.map((item, idx) => {
                    return renderEmployee(item, idx)
                  })
                }
              </View>
            </View>

          </View>

        </View>
      </View>
    </View>
  );
})