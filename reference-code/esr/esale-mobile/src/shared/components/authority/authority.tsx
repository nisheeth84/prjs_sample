import React, { useState } from "react";
import { View, Image, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { CommonStyles } from "../../common-style";
import { Icon } from "../icon";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthorityStyle } from "./styles";
import { appImages } from "../../../config/constants";
import { AuthorityModal } from "./authority-modal";
import { messages } from "./authority-messages";
import { translate } from "../../../config/i18n";
import { AuthorityEnum, AuthorityItemType } from "../../../config/constants/enum";
import { checkEmptyString } from "../../util/app-utils";


export interface AuthorityProps {
  // icon
  icon?: string;
  // first text for create default icon
  firstText?: string;
  // default icon background color
  iconDefaultColor?: string;
  // left title
  title?: string;
  // right title
  title2?: string;
  // left content
  content?: string;
  // right content
  content2?: string;
  // handle delete
  handleDeletePress?: Function;
  // handle select authority
  handleAuthoritySelected: Function;
  // item type - employee, department, group
  authorityItemType?: number;
  // authority
  authority: number;
}

export function Authority({
  icon = "",
  firstText = "",
  iconDefaultColor = "",
  title = "",
  title2 = "",
  content = "",
  content2 = "",
  handleDeletePress = () => { },
  handleAuthoritySelected,
  authority,
  authorityItemType = AuthorityItemType.EMPLOYEE
}: AuthorityProps) {

  /**
   * Check for empty title or empty content
   */
  const checkEmpty = () => {
    if (checkEmptyString(title) && checkEmptyString(title2)
      || checkEmptyString(content) && checkEmptyString(content2)) {
      return true;
    }
    return false;
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [authorityTitle, setAuthorityTitle] = useState(authority == AuthorityEnum.MEMBER ? translate(messages.member) : translate(messages.owner));

  return (
    <View style={[CommonStyles.rowSpaceBetween, CommonStyles.flex1]}>
      <View style={[CommonStyles.rowInline, CommonStyles.flex1]}>
        <View>
          {
            !checkEmptyString(icon) ?
              <Image
                resizeMode="contain"
                source={{ uri: icon }}
                style={AuthorityStyle.iconUser}
              />
              :
              (authorityItemType == AuthorityItemType.EMPLOYEE ?
                <Image
                  resizeMode="contain"
                  source={appImages.icUser}
                  style={AuthorityStyle.iconUser} />
                :
                <View style={[AuthorityStyle.firstTextIcon,
                checkEmptyString(iconDefaultColor) ?
                  (authorityItemType == AuthorityItemType.GROUP ?
                    AuthorityStyle.group
                    : AuthorityStyle.department)
                  : { backgroundColor: iconDefaultColor }]}>
                  <Text style={AuthorityStyle.firstText}>{checkEmptyString(firstText) ? title[0] : firstText}</Text>
                </View>)
          }
        </View>
        <View style={[CommonStyles.flex1]}>
          {
            !checkEmptyString(title + title2) ?
              <Text style={AuthorityStyle.title}>
                {
                  !checkEmptyString(title) ?
                    <TouchableWithoutFeedback onPress={() => { }}>
                      <Text>{title}</Text>
                    </TouchableWithoutFeedback>
                    : null
                }
                {
                  !checkEmptyString(title2) ?
                    <TouchableWithoutFeedback
                      onPress={() => { }}>
                      <Text style={AuthorityStyle.title}>{title2}</Text>
                    </TouchableWithoutFeedback>
                    : null
                }
              </Text>
              : null
          }
          {
            !checkEmptyString(content + content2) ?
              <Text style={AuthorityStyle.content}>
                {
                  !checkEmptyString(content) ?
                    <TouchableWithoutFeedback onPress={() => { }}>
                      <Text>{`${content} `}</Text>
                    </TouchableWithoutFeedback>
                    : null
                }
                {
                  !checkEmptyString(content2) ?
                    <TouchableWithoutFeedback onPress={() => { }}>
                      <Text>{content2}</Text>
                    </TouchableWithoutFeedback>
                    : null
                }
              </Text>
              : null
          }
        </View>
      </View>

      <View style={[CommonStyles.rowInline]}>
        <View style={[CommonStyles.rowInline, !checkEmpty() ? CommonStyles.wrapContent : {}]}>
          <TouchableOpacity
            style={[CommonStyles.rowInline, AuthorityStyle.authoritySelected]}
            onPress={() => {
              setModalOpen(true);
            }}
          >
            <Text>
              {
                authorityTitle
              }
            </Text>
            <Icon name="arrowDown" style={AuthorityStyle.arrowDown} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            handleDeletePress();
          }}>
            <Icon name="close" />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={modalOpen}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setModalOpen(false);
        }}
      >
        <AuthorityModal
          onCloseModal={() => { setModalOpen(false); }}
          handleSelected={(value: number) => {
            handleAuthoritySelected(value);
            if (value == AuthorityEnum.MEMBER) {
              setAuthorityTitle(translate(messages.member));
            } else {
              setAuthorityTitle(translate(messages.owner));
            }
          }}
        />
      </Modal>

    </View>
  );
}
