import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../../../config";
import styles from "../style";
import CheckBoxCustom from "../../../components/checkbox-custom/checkbox-custom";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../../calendar-list-messages";
import { ACTION_LOCAL_NAVIGATION } from "../../../constants";

/**
 * interface plan status
 */
type IPlanStatus = {
  handleShowBottom: (flag: boolean) => void,
  isAttended?: any,
  isAbsence?: any,
  isUnconfirmed?: any,
  isShared?: any
  handleUpdateStatic?: any,
}

/**
 * component plan status
 * @param props
 * @constructor
 */
const PlanStatus = (props: IPlanStatus) => {
  /**
   * status show or hidden component
   */
  const [isShow, setIsShow] = useState(true);

  /**
   * handle touch: show or close component current and component bottom
   */
  const handleTouch = () => {
    setIsShow(!isShow);
    props.handleShowBottom(!isShow);
  }
  return <View style={styles.content_checkbox}>
    <TouchableOpacity onPress={handleTouch}>
      <View style={styles.boxArrow}>
        <Image
          source={isShow ? Images.localNavigation.ic_up : Images.localNavigation.ic_down}
          style={styles.icon_up_down}
        />
        <Text style={[styles.textFontSize, styles.textBoxArrow]}>
          {translate(messages.participationStatus)}
        </Text>
      </View>
    </TouchableOpacity>
    {isShow &&
      <View style={styles.ContentSmall}>
        <View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background="#0F6EB5"
              borderColor="#0F6EB5"
              active={!!props.isAttended}
              type={ACTION_LOCAL_NAVIGATION.PARTICIPANTS}
              handleCheckStatic={props.handleUpdateStatic}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.attendance)}
            </Text>
          </View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background="#0F6EB5"
              borderColor="#0F6EB5"
              active={!!props.isAbsence}
              type={ACTION_LOCAL_NAVIGATION.ABSENTEES}
              handleCheckStatic={props.handleUpdateStatic}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.absenteeism)}
            </Text>
          </View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background="#0F6EB5"
              borderColor="#0F6EB5"
              active={!!props.isUnconfirmed}
              type={ACTION_LOCAL_NAVIGATION.UNCONFIRMED}
              handleCheckStatic={props.handleUpdateStatic}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.unconfirmed)}
            </Text>
          </View>
          <View style={styles.checkboxParent}>
            <CheckBoxCustom
              background="#0F6EB5"
              borderColor="#0F6EB5"
              active={!!props.isShared}
              type={ACTION_LOCAL_NAVIGATION.SHARE}
              handleCheckStatic={props.handleUpdateStatic}
            />
            <Text style={[styles.textFontSize, styles.textCheckBox]}>
              {translate(messages.share)}
            </Text>
          </View>
        </View>
      </View>
    }
  </View>
}

export default PlanStatus;