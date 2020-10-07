import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { Icon } from "../../shared/components/icon";
import { useNavigation } from "@react-navigation/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { theme } from "../../config/constants"
import { CommonButton } from "../../shared/components/button-input/button";

export interface IAppBarActivity {
  title: string
  buttonText: string
  onPress?: () => void
  buttonType?: number
  buttonDisabled?: string
  leftIcon?: string
  handleLeftPress?: () => void
  styleTitle?: object
  containerStyle?: object
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space[4],
    height: 54,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100,
    elevation: 1
  },
  leftElement: {
    flex: 1,
  },
  centerElement: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightElement: {
    flex: 2,
  },
  title: {
    fontSize: theme.fontSizes[4],
  }
})

export function AppBarActivity({
  title,
  buttonText,
  onPress,
  buttonType,
  buttonDisabled,
  leftIcon,
  handleLeftPress,
  styleTitle,
  containerStyle,
}: IAppBarActivity) {
  const navigation = useNavigation()
  const onHandleBack = () => {
    if (!!handleLeftPress) {
      handleLeftPress()
    } else {
      navigation.goBack()
    }
  }
  const iconName = leftIcon || "close"
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftElement}>
        <TouchableOpacity onPress={onHandleBack}>
          <Icon name={iconName} />
        </TouchableOpacity>
      </View>
      <View style={styles.centerElement}>
        <Text style={[styles.title, styleTitle]}>{title}</Text>
      </View>
      <View style={styles.rightElement}>
        <CommonButton onPress={onPress} status={buttonDisabled} icon="" textButton={buttonText} typeButton={buttonType}></CommonButton>
      </View>
    </View>
  )
}
