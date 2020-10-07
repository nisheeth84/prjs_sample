import React, {useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Images } from "../../config";
import styles from "./style";
import { Calendar } from "../../api/get-schedule-type";
import moment from 'moment';
import { messages } from "../../calendar-list-messages";
import { translate } from "../../../../config/i18n";
import { truncateString } from "../../common/helper";

/**
 * type BasicInformationDetail
 */
type IBasicInformationDetail = {
  schedule: Calendar;
}
/**
 * Basic Information Detail
 * @param schedule data from props
 */
export const BasicInformationDetail = React.memo(({ schedule }: IBasicInformationDetail) => {
  // const schedule = props.schedule;

  const [color] = useState('#0F6DB1')


  return (
    <View style={styles.detail_information}>
      <View style={styles.tab_item}>
        <Image style={[styles.icon_card_visit, styles.detail_icon]} source={Images.schedule_details.icon_card_visit} />
        <View style={styles.top_title}>
          <Text style={styles.title_item}>{translate(messages.task)}</Text>
          {
            Array.isArray(schedule?.tasks) &&
            schedule?.tasks.map((task, idx) => {
              const  date1 = moment(task.endDate).format("yyyy/MM/DD")
              const  date2 = moment().format("yyyy/MM/DD") 
              return <View key={idx} style={styles.item}>
                <Text style={ date1  > date2 ? [styles.time_red] : [styles.time] } >{(task?.endDate)?.format("yyyy/MM/DD")} </Text>
                <TouchableOpacity onPress={() => alert('Go to detail task')}>
                  {task.taskName.length > 50
                    ? (<Text style={[styles.time, { color: color }]}>
                      {truncateString(task.taskName)}
                    </Text>)
                    : (<Text style={[styles.time, { color: color }]}>{task.taskName}</Text>)
                  }
                </TouchableOpacity>
              </View>
            })
          }
        </View>
      </View>
      <View style={styles.tab_item}>
        <Image style={[styles.icon_flag, styles.detail_icon]} source={Images.schedule_details.icon_flag} />
        <View style={styles.top_title}>
          <Text style={styles.title_item}>{translate(messages.mileStone)}</Text>
          {
            Array.isArray(schedule?.milestones) &&
            schedule?.milestones.map((milestones, idx) => {
              const  date1 = moment(milestones.milestoneTime).format("yyyy/MM/DD")
              const  date2 = moment().format("yyyy/MM/DD")       
              return <View style={styles.item} key={idx}>
                <Text style={ date1  > date2 ? [styles.date_red] : [styles.date] }>{moment(milestones?.milestoneTime)?.format("yyyy/MM/DD")} </Text>
                <TouchableOpacity onPress={() => alert('Go to detail milestone')} style={[styles.time]}>

                  {milestones.milestoneName.length > 50
                    ? <Text style={[styles.time, { color: "#0F6DB1" }]}>
                      {truncateString(milestones.milestoneName)}
                    </Text>
                    : (<Text style={[styles.time, { color: "#0F6DB1" }]}>{milestones.milestoneName}</Text>)
                  }
                </TouchableOpacity>
              </View>
            })
          }
        </View>
      </View>
      <View style={styles.tab_item}>
        <Image style={[styles.icon_tag_file, styles.detail_icon]} source={Images.schedule_details.icon_tag_file} />
        <View style={styles.top_title}>
          <Text style={styles.title_item}>{translate(messages.files)}</Text>
          {
            Array.isArray(schedule?.files) &&
            schedule?.files.map((file, idx) => {
              return <TouchableOpacity key={idx}>
                <Text style={[styles.time, { color: "#0F6DB1" }]}>{file.fileName}</Text>
              </TouchableOpacity>
            })
          }
          {
            <View>
              <View style={styles.item}>
                <View style={styles.detail_item}>
                  <View style={styles.detail_title}>
                    <Text style={[styles.item_text]}>
                      {translate(messages.registrationDate)} :
                      </Text>
                  </View>
                  <TouchableOpacity onPress={() => alert('Go to detail user')}>
                    <Text style={[styles.item_text, { color: "#0F6DB1" }]}>
                      {schedule.createdUserSurName}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.detail_item}>
                  <View style={styles.detail_title}>
                    <Text style={[styles.item_text]}>
                      {translate(messages.registeredPeople)} :
                    </Text>
                  </View>
                  <Text style={[styles.item_text]}>
                    {moment(schedule.createdDate).format("yyyy/MM/DD")}
                  </Text>
                </View>
              </View>
            </View>
          }
          {
            <View>
              <View style={styles.item}>
                <View style={styles.detail_item}>
                  <View style={styles.detail_title}>
                    <Text style={[styles.item_text]}>
                      {translate(messages.lastUpdatedDate)} :
                      </Text>
                  </View>
                  <TouchableOpacity onPress={() => alert('Go to detail user')}>
                    <Text style={[styles.item_text, { color: "#0F6DB1" }]}>
                      {schedule.createdUserSurName}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.item}>
                <View style={styles.detail_item}>
                  <View style={styles.detail_title}>
                    <Text style={[styles.item_text]}>
                      {translate(messages.finalUpdater)} :
                    </Text>
                  </View>
                  <Text style={[styles.item_text]}>
                    {moment(schedule.updatedDate).format("yyyy/MM/DD")}
                  </Text>
                </View>
              </View>
            </View>
          }
        </View>
      </View>
    </View>
  );
})