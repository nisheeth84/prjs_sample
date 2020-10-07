import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native"
import { CustomerDetailScreenStyles } from "../../customer-detail-style"
import { scheduleTimeData } from "../../customer-detail-repository";

interface ScheduleItemProps {
  //data of schedule item
  data: scheduleTimeData;
}

/**
 * Component for show schedule information item
 * @param ScheduleItemProps 
 */
export const ScheduleItem: React.FC<ScheduleItemProps> = ({
  data
}) => {
  return (
    <TouchableOpacity style={[CustomerDetailScreenStyles.scheduleBlock]}>
      <View style={CustomerDetailScreenStyles.schedule}>
        <Text style={[CustomerDetailScreenStyles.textSmall, CustomerDetailScreenStyles.textBlack]}>{data.itemName}</Text>
        <Text style={[CustomerDetailScreenStyles.textSmall, CustomerDetailScreenStyles.textBlack]}>{data.startEndDate}</Text>
      </View>
    </TouchableOpacity>
  )
}
