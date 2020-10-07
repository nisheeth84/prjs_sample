import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Images } from "../../config";
import styles from "./style";
import { Style, getHeight } from "../../common";
// import { Calendar } from "../../api/get-schedule-type";
// /**
//  * type HistoryComment
//  */
// type IHistoryComment = {
//   schedule?: Calendar;
// }
/**
 * 
 * @param schedule data transfer from props 
 */
export const HistoryComment = React.memo(() => {
  return (
    <View style={{marginBottom:getHeight(110)}}>
      <View style={[styles.box_comment, Style.container]}>
        <TextInput
          placeholder="テキストを入力"
          placeholderTextColor="#959595"
          style={styles.input_type} />
        <TouchableOpacity><Text style={styles.comment_button}>送信</Text></TouchableOpacity>
      </View>
      <View>
        <View style={Style.container}>
          <View style={styles.comment}>
            <View style={styles.user_comment}><Text style={[styles.title_item, { color: '#0F6DB1' }]}>社員A</Text><Text style={styles.comment_time}>2019/7/28</Text></View>
            <Text style={[styles.title_item, styles.main_comment]}>社員Aへの返信ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。</Text>
            <View style={styles.emotion}>
              <View style={styles.emotion_item}><Image style={styles.emotion_icon} source={Images.schedule_details.emotion_smile} /><Text style={styles.emotion_nbr}>2</Text></View>
              <View style={styles.emotion_item}><Image style={styles.emotion_icon} source={Images.schedule_details.emotion_cry} /><Text style={styles.emotion_nbr}>1</Text></View>
              <View style={styles.emotion_item}><Image style={styles.emotion_icon} source={Images.schedule_details.emotion_smile_1} /><Text style={styles.emotion_nbr}>2</Text></View>
            </View>
          </View>
        </View>
        <View style={styles.tool_comment}>
          <TouchableOpacity><Image source={Images.box_comment.icon_comment} /></TouchableOpacity>
          <TouchableOpacity><Image source={Images.box_comment.icon_double_comma} /></TouchableOpacity>
          <TouchableOpacity><Image source={Images.schedule_details.icon_share} /></TouchableOpacity>
          <TouchableOpacity><Image source={Images.box_comment.icon_smile} /></TouchableOpacity>
          <TouchableOpacity><Image source={Images.box_comment.icon_star} /></TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={[Style.container, styles.top_Text]}>
          <View><Image style={[styles.icon_user, styles.avatar]} source={Images.schedule_details.icon_user_girl} /></View>
          <View style={styles.comment}>
            <View style={styles.user_comment}><Text style={[styles.title_item, { color: '#0F6DB1' }]}>社員C</Text><Text style={styles.comment_time}>2019/7/28</Text></View>
            <Text style={[styles.title_item, styles.main_comment]}>社員Aへの返信ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。</Text>
          </View>
        </View>
      </View>
    </View>
  );
})