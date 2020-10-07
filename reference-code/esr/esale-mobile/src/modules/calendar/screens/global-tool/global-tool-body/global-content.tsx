import React, {useState} from "react";
import moment from "moment";
import {Image, Linking, Text, TouchableOpacity, View} from "react-native";

import {
  BusinessCardsType,
  CustomersType, 
  ProductTradingsType,
  ScheduleListType
} from "../../../api/schedule-list-type";
import styles from "../style";
import {Images} from "../../../config";
import GlobalBottom from "./global-bottom";
import {useNavigation} from "@react-navigation/native";
import {translate} from "../../../../../config/i18n";
import {messages} from "../../../calendar-list-messages";
import BaseModal from "../../../common/modal";
import { FORMAT_DATE, TIME_FORMAT, TIME_TO_TIME } from "../../../../../config/constants/constants";

/**
 * interface global content
 */
type IGlobalContent = {
  item: ScheduleListType;
  index: number;
  updateStatusItem: (itemId: number, flag: string, updatedDate: string) => void;
  calendarDay: moment.Moment;
}
/**
 * component global content
 * @param item
 * @param index
 * @param updateStatusItem
 * @constructor
 */
const GlobalContent = ({item, index, updateStatusItem, calendarDay}: IGlobalContent) => {


  /**
   * status show modal
   */
  const [showModal, setShowModal] = useState(0);
  /**
   * expand or collapse component
   */
  const [isActive, setActive] = useState(!index);
  /**
   * hook navigation
   */
  const navigation = useNavigation();

  /**
   * render view customers
   * @param customer 
   * @param productsTrading 
   * @param index
   */ 
  const renderCustomers = (customer: CustomersType, productsTrading: ProductTradingsType[] | undefined, index: number) => {


    let textProducts;
    if (Array.isArray(productsTrading)) {
      let listProducts = productsTrading.map(item => item.productName);
      textProducts = listProducts.join(', ');
    }

    const handleOnModal =  () => {
      navigation.navigate('create-screen') ;
      setShowModal(0)
      
    }

    return <View style={[styles.infoSchedule, styles.info_flexD]} key={`customer_${index}`}>
      <View>
        <Text style={[styles.textInfoSchedule]}>
          {customer.customerName} / {textProducts}
        </Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => setShowModal(customer.customerId)}>
          {/* <Text style={styles.textButton}>{translate(messages.historyActivities)}</Text> */}
          <Image source={Images.globalToolSchedule.ic_sort}/>
        </TouchableOpacity>
        {
          showModal === customer.customerId &&
          <BaseModal
            isVisible={!!showModal}
            onBackdropPress={() => setShowModal(0)}
          >
            <View style={styles.modal}>
              <View>
                <TouchableOpacity style={styles.text_modal_item} onPress={() => handleOnModal()}>
                  <Text style={[styles.modal_text, { textAlign: 'center', borderTopWidth: 0 }]}>
                    {translate(messages.reviewActivity)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.text_modal_item} onPress={() => alert('Alert 2')}>
                  <Text style={[styles.modal_text, { textAlign: 'center' }]}>
                    {translate(messages.historyActivity)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BaseModal>
        }
      </View>
    </View>
  }

  /**
   * convert array bussinessCards to text
   * @param businessCards
   */ 
  const renderBusinessCards = (businessCards: BusinessCardsType[]) => {
    return businessCards.map(item => item.businessCardName).join(', ');
  }

  /**
   * render date
   */
  const renderDate = () => {
    const startDate = moment.utc(item.startDate).format(FORMAT_DATE.YYYY__MM__DD);
    const startTime = moment.utc(item.startDate).format(TIME_FORMAT);
    const endDate = moment.utc(item.finishDate).format(FORMAT_DATE.YYYY__MM__DD);
    const endTime = moment.utc(item.finishDate).format(TIME_FORMAT);
    const checkDay = moment.utc(calendarDay).format(FORMAT_DATE.YYYY__MM__DD);
    // return startDate === endDate ? `${startDate} ${startTime}${TIME_TO_TIME}${endTime}` : `${startTime}${TIME_TO_TIME}${endDate} ${endTime}`;
    return `${checkDay !== startDate ? startDate : ''} ${startTime} ${TIME_TO_TIME} ${checkDay !== endDate ? endDate : ''} ${endTime}` 
  }
  
  /**
   * render content header
   * @param flag
   */ 
  const renderHeader = (flag: boolean = false) => {
    return <View style={flag ? styles.boxSchedule : styles.boxScheduleShort}>
      <View style={styles.flexD_row}>
        <Image
          source={Images.globalToolSchedule.ic_person_red}
          style={styles.ic_person_red}
        />
        <Text
          style={[styles.text_boxSchedule, styles.color_black]}
        >
          {renderDate()}
        </Text>
      </View>
      <View style={styles.infoSchedule}>
        <Text style={[styles.textInfoBox, styles.color_active]} onPress={() => navigation.navigate("schedule-detail-screen")}>
          {item.itemName}
        </Text>
      </View>
    </View>
  }
  
  /**
   * render full content
   */
  const renderFullContent = () => {
    return <>
      {renderHeader(true)}
      {/* building info */}
      <View style={styles.boxSchedule}>
        <View style={styles.flexD_row}>
          <Image
            source={Images.globalToolSchedule.ic_building}
            style={styles.ic_building}
          />
          <Text
            style={[styles.text_boxSchedule, styles.color_black]}
          >
            {translate(messages.customerProductTradings)}
          </Text>
        </View>
        { Array.isArray(item.customers) &&
          item.customers.map(
            (customer: CustomersType, index: number) => renderCustomers(customer, item.productTradings, index)
          )
        }
        {/* end building info */}
        {/* location info */}
        <View style={styles.flexD_row}>
          <Image
            source={Images.globalToolSchedule.ic_location}
            style={styles.ic_location}
          />
          <Text
            style={[styles.text_boxSchedule, styles.color_black]}
          >
            {translate(messages.streetAddress)}
          </Text>
        </View>
        { item.address &&
        <View style={styles.infoSchedule}>
          <Text 
            style={[styles.textInfoBox, styles.color_active]}
            onPress={() => Linking.openURL(`http://maps.google.com/?q=${item.address}`)}
          >
            { item.address }
          </Text>
        </View>
        }
        {/* end location info */}
        {/* user */}
        <View style={styles.flexD_row}>
          <Image
            source={Images.globalToolSchedule.ic_user}
            style={styles.general_icon}
          />
          <Text
            style={[styles.text_boxSchedule, styles.color_black]}
          >
            {translate(messages.outsideParticipant)}
          </Text>
        </View>
        {
          Array.isArray(item.businessCards) &&
          item.businessCards.length !== 0 &&
          <View style={styles.infoSchedule}>
            <Text style={[styles.textInfoBox, styles.color_active]}>
              {renderBusinessCards(item.businessCards)}
            </Text>
          </View>
        }
        {/* user */}
      </View>
      <GlobalBottom
        isActive={item.isParticipantUser}
        itemId={item.itemId}
        updatedDate={item.updatedDate}
        updateStatusItem={updateStatusItem}
      />
    </>
  }
  
  return <>
    {isActive ? renderFullContent() : renderHeader()}
    <TouchableOpacity style={styles.btn_down_up} onPress={() => setActive(!isActive)}>
      <Image
        source={isActive ? Images.globalToolSchedule.ic_up : Images.globalToolSchedule.ic_down}
        style={styles.icon_down_up}
      />
    </TouchableOpacity>
  </>
}

export default GlobalContent;