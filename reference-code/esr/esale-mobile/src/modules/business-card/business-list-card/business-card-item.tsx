import React, { useState } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Icon } from "../../../shared/components/icon";
import { theme } from "../../../config/constants";
import { messages } from "./business-card-messages";
import { translate } from "../../../config/i18n";
import { BusinessCardItemStyles } from "./business-card-style";

/**
 * interface for bussinasscard screen props
 */
interface BusinessCardProps {
  // url of card avatar
  avatarUrl: any;
  // name of card
  name: string;
  // role of one card
  role: string;
  // toggle for edit
  edit: boolean;
  // toggle for modal
  show: boolean;
  // to show/hide modal
  onPress: (argument: boolean) => void;
  // check if favourite
  selected?: boolean;
  // toggle Selected or not Selected
  onSelected: () => void;
  // press item to detail screen
  handlePressItem?: () => void;
  label: boolean;
  // to show/hide modal
}

/**
 * Render bussiness card component
 * @param param0
 */
export const BusinessCardItem: React.FC<BusinessCardProps> = ({
  avatarUrl,
  name,
  role,
  edit,
  show,
  onPress = () => {},
  selected = false,
  onSelected = () => {},
  handlePressItem = () => {},
  label,
}) => {
  const [showModal, onModal] = useState(show);
  const _onModal = () => {
    onModal(!showModal);
    onPress(true);
  };
  /**
   * render swipe
   * @param _progress
   * @param dragX
   *
   */
  const renderLeftActions = (
    _progress: any,
    dragX: {
      interpolate: (arg0: {
        inputRange: number[];
        outputRange: number[];
      }) => any;
    }
  ) => {
    const trans = dragX.interpolate({
      inputRange: [0, 0, 0, 0],
      outputRange: [0, 0, 0, 0],
    });
    return (
      <View
        style={
          edit
            ? BusinessCardItemStyles.viewSwipe
            : BusinessCardItemStyles.viewSwipenull
        }
      >
        <Animated.View
          style={[
            BusinessCardItemStyles.btnSwipe,
            {
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <TouchableOpacity style={BusinessCardItemStyles.btnDrop}>
            <Text style={BusinessCardItemStyles.textBtn}>
              {translate(messages.registerCustomers)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={BusinessCardItemStyles.btnDrop}>
            <Text style={BusinessCardItemStyles.textBtn}>
              {translate(messages.activityHistory)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={BusinessCardItemStyles.btnDrop}>
            <Text style={BusinessCardItemStyles.textBtn}>
              {translate(messages.activeRegistration)}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={BusinessCardItemStyles.btnDrop}>
            <Text style={BusinessCardItemStyles.textBtn}>
              {translate(messages.scheduleRegistration)}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };
  const styleLongPress = label
    ? { backgroundColor: theme.colors.yellowSkin }
    : false;
  return (
    <Swipeable renderRightActions={renderLeftActions}>
      <TouchableOpacity
        style={[BusinessCardItemStyles.inforEmployee, styleLongPress]}
        // onLongPress={_handlerLongClick}
        onPress={handlePressItem}
      >
        <View style={BusinessCardItemStyles.mainInforBlock}>
          <TouchableOpacity onPress={_onModal}>
            <Image
              source={{ uri: avatarUrl }}
              style={BusinessCardItemStyles.avatar}
            />
          </TouchableOpacity>
          <View style={BusinessCardItemStyles.name}>
            <Text numberOfLines={1} style={BusinessCardItemStyles.nameColor}>
              {name}
            </Text>
            <TouchableOpacity>
              <Text style={BusinessCardItemStyles.txtRole}>{role}</Text>
            </TouchableOpacity>
            {!!label && (
              <View style={BusinessCardItemStyles.longPress}>
                <Text style={BusinessCardItemStyles.longPressText}>
                  {translate(messages.waiting)}
                </Text>
              </View>
            )}
          </View>
            {edit ? (
              <TouchableOpacity
                onPress={handlePressItem}
                style={BusinessCardItemStyles.iconArrowRight}
              >
                <Icon name="arrowRight" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={BusinessCardItemStyles.iconArrowRight}
                onPress={() => onSelected()}
              >
                {selected === true ? (
                  <Icon name="checkedGroupItem" />
                ) : (
                  <Icon name="unFavourite" />
                )}
              </TouchableOpacity>
            )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};
