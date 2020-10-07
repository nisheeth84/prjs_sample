import React from "react"
import { View, Text, StyleSheet, Image, ImageStyle, StyleProp } from "react-native"
import { normalize } from "../../calendar/common"
import { TEXT_EMPTY } from "../../../config/constants/constants"

interface Props {
  imageStyle?: StyleProp<ImageStyle>,
  style?: StyleProp<ImageStyle>,
  imgPath?: any,
  userName?: string
}

export const DefaultAvatar: React.FC<Props> = (props) => {
  const defaultStyle = { width: normalize(50), height: normalize(50)}

  const validImagePath = (path: string) => {
    const testString = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/
    return testString.test(path)
  }

  const imagePath = props?.imgPath && validImagePath(props?.imgPath); 

  const  renderDefaultImage = () => {
    return (
    <View style={[styles.defaultStyleAvatar, props?.style]}>
        <Text>{props?.userName ? props?.userName.charAt(0) : TEXT_EMPTY}</Text>
    </View>
    )
  }

  const renderImage = () => {
    return (
      <View style={[styles.defaultStyleAvatar, {backgroundColor:"transparent", overflow: "hidden"}, props?.style]}>
        <Image resizeMode="contain" source={{uri: props?.imgPath}} style={[defaultStyle, props?.imageStyle]}/>
      </View>
    )
  }

  return (imagePath ? renderImage() : renderDefaultImage()); 
}

const styles = StyleSheet.create({
  defaultStyleAvatar: {
    width: normalize(50), 
    height: normalize(50),
    backgroundColor: "#4B8A08", 
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center"
  }
}) 