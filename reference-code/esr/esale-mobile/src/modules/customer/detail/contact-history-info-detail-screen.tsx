import * as React from "react";
import { View, Text, SafeAreaView } from "react-native"
import { CustomerDetailScreenStyles } from "./customer-detail-style";
import { ContactHistoryItemData } from "./customer-detail-repository";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-detail-messages";

interface ContactHistoryInfoDetailProps {
  //screen route
  route: any;
}

/**
 * Component for show contact history information list
 * @param ContactHistoryInfoDetailProps 
 */
export const ContactHistoryInfoDetailScreen: React.FC<ContactHistoryInfoDetailProps> = (
  {
    route,
  }
) => {
  
  const data: ContactHistoryItemData = route.params.data;

  return (
    <SafeAreaView style={[CustomerDetailScreenStyles.container, CustomerDetailScreenStyles.backgroundWhite]}>
      <View>
        <View style={[
          CustomerDetailScreenStyles.borderBottom,
          CustomerDetailScreenStyles.defaultRow]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel]}>{translate(messages.closestDontactDate)}</Text>
          <Text>{data.closestContactDate}</Text>
        </View>
        <View style={[
          CustomerDetailScreenStyles.borderBottom,
          CustomerDetailScreenStyles.defaultRow]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel]}>{translate(messages.businessCard)}</Text>
          <Text style={CustomerDetailScreenStyles.textLink}>{data.businessCard}</Text>
        </View>
        <View style={[
          CustomerDetailScreenStyles.borderBottom,
          CustomerDetailScreenStyles.defaultRow]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel]}>{translate(messages.receivedDate)}</Text>
          <Text>{data.receivedDate}</Text>
        </View>
        <View style={[
          CustomerDetailScreenStyles.borderBottom,
          CustomerDetailScreenStyles.defaultRow]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel]}>{translate(messages.chargePerson)}</Text>
          <Text style={CustomerDetailScreenStyles.textLink}>{data.employeeName}</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
