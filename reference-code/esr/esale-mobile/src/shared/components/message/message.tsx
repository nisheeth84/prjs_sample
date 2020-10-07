import React from "react";
import { StyleProp, Text, View, ViewStyle, TouchableOpacity, Dimensions } from "react-native";
import { Icon } from "../icon/icon"
import { styles, FilterMessageStyle } from "./message-style";
import { translate } from "../../../config/i18n";
import { TypeMessage } from "../../../config/constants/enum";
import { format } from 'react-string-format';
import { ressponseStatus, errorCode } from "./message-constants";
import { responseMessages } from "../../messages/response-messages";
import { Error } from "./message-interface";
import { SvgCssUri } from "react-native-svg";
import { apiUrl } from "../../../config/constants/api";
const widths = Dimensions.get('window').width;

interface ErrorRessponse {
  response: any;
  widthMessage?: any;
}
/**
  * Define ServerError
  * @param ressponse 
  */
const handleRessponseError = (ressponse: any) => {
  let listMessageError: Error[] = [];
  if (ressponse.status === ressponseStatus.statusInternalServerError && ressponse?.data?.parameters?.extensions?.errors?.length > 0) {
    let messageError: string[] = [];
    ressponse.data.parameters.extensions.errors.forEach((elementInfo: any) => {
      if(elementInfo.arrayError){
        elementInfo.arrayError.forEach((elementArrayError : any) => {
        let errorParamArrayError = elementArrayError.errorParam ?? []
          // Set error
        listMessageError.push({
          error: format(translate(responseMessages[elementArrayError.errorCode]), ...errorParamArrayError),
          type: TypeMessage.ERROR
        })
        });
      } else if (!messageError.includes(elementInfo.errorCode)) {  // Check duplicate Error code
        messageError.push(elementInfo.errorCode);
        let errorParam = elementInfo.errorParam ?? []
        let type = elementInfo.errorCode.substring(0, 3);
        // Set error
        listMessageError.push({
          error: format(translate(responseMessages[elementInfo.errorCode]), ...errorParam),
          type: type
        })
      }
    });
  } else {
    // Set error
    listMessageError.push({
      error: format(translate(responseMessages[errorCode.errCom0001]), ...[]),
      type: TypeMessage.ERROR
    })
  }
  return listMessageError;
}
/**
 * Create list message
 * @param response 
 */
export function CommonMessages(
  {
    response = "",
    widthMessage = ""
  }: ErrorRessponse) {
  const tempMessage = handleRessponseError(response);

  return (
    <View >
      {
        tempMessage?.map((error: Error, index: number) => (
          <CommonMessage
            key={index}
            widthMessage={widthMessage}
            content={error.error}
            type={error.type}
          ></CommonMessage>
        ))
      }
    </View>
  )
}

/**
 * interface MessageProps
 */
interface MessageProps {
  content?: string;
  type?: string; //"WAR" | "INF" | "ERR" | "DEF";
  button?: boolean; //"true" | "false"
  buttomName?: string; // Name of button
  widthMessage?: any;
  onPress?: () => void;
}
/**
 *  main function
 * @param param0 
 */
export function CommonMessage(
  {
    content = "",
    type = "",
    button = false,
    buttomName = "",
    widthMessage = "",
    onPress = Object }: MessageProps) {

  const containerStyles: Array<StyleProp<ViewStyle>> = [styles.container];
  //Check type Message //"WAR" | "INF" | "ERR" | "DEF";
  switch (type) {
    case TypeMessage.WARNING:
      containerStyles.push(styles.styleWarning);
      break;
    case TypeMessage.SUCCESS:
      containerStyles.push(styles.styleSuccess);
      break;
    case TypeMessage.ERROR:
      containerStyles.push(styles.styleError);
      break;
    case TypeMessage.INFO:
      containerStyles.push(styles.styleDefault);
      break;
  }

  return (
    <View style={[containerStyles, { width: widthMessage ? widthMessage : 0.94 * widths }]}>
      <View style={styles.viewIcon}>
        <Icon name={type} />
      </View>
      <View style={styles.viewText}>
        <Text style={styles.txtFonsize}>{content}</Text>
      </View>
      {button &&
        <View style={styles.viewButton}>
          <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.txtButton}>{buttomName}</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
}
export interface FilterMessageProp {
  iconName?: string;
  content?: string;
}
/**
 * Use filter no data
 */
export function CommonFilterMessage({ iconName = "", content = "" }: FilterMessageProp) {
  return (
    <View style={FilterMessageStyle.container}>
      {iconName && <View style={FilterMessageStyle.imageView}>
        <SvgCssUri
          uri={`${apiUrl}${iconName}`}
          width="100%"
          height="100%"
        />
      </View>}
      <View style={FilterMessageStyle.viewContent}>
        <Text style={FilterMessageStyle.filterMessageFont}>{content}</Text>
      </View>
    </View>
  );
}