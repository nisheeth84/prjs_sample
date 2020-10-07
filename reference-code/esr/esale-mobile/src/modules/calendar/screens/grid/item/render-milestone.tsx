
import React from 'react'
import { DataOfSchedule } from '../../../api/common';
import {  ItemCalendar } from './item-calendar';
import { View, Image, Text } from 'react-native';
import { Images } from '../../../config';
import styles from "../../../calendar-style";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GetLocalNavigation } from '../../../api/get-local-navigation-type';
import { truncateString, normalize } from '../../../common/helper';
import { STRING_TRUNCATE_LENGTH } from '../../../constants';
import {TaskMilestone, ColorType} from '../item/constant';
import { useNavigation } from '@react-navigation/native';



interface IRenderMilestone {
    dataOfSchedule: DataOfSchedule,
    localNavigation: GetLocalNavigation,
    className?: string,
    prefixKey: string,

    top?: string,
    left?: string,
    width?: string,
    height?: string,
    modeInList?:boolean,

    showArrow?: boolean
}

/**
 * component render common for milestone
 * @param props 
 */
export const RenderMilestone = React.memo((props: IRenderMilestone) => {
    const navigation = useNavigation();


    const renderModalMilestoneDetail = (item: DataOfSchedule) => {
        navigation.navigate("milestone-detail", { milestoneId: item.itemId });
    }

    const background = ItemCalendar.getLinearGradient(ItemCalendar.getAllColorOfEmployees(props.dataOfSchedule, props.localNavigation))
    /**
     * render icon milestone
     * @param schedule 
     */
    const renderMilestoneIcon = (schedule: DataOfSchedule) => {
        const MilestoneNormalIcon = Images.schedule.ic_flag_green;
        const MilestoneCompletedIcon = Images.schedule.ic_flag_completed;
        const MilestoneDeleteIcon = Images.schedule.ic_flag_red;
        let src = MilestoneNormalIcon;
        if (schedule.milestoneStatus === TaskMilestone.completed) {
            src = MilestoneCompletedIcon;
        }
        if (schedule.milestoneStatus === TaskMilestone.overdue) {
            src = MilestoneDeleteIcon;
        }

        return (
            <Image style={styles.icon} source={src}></Image>
        )
    }

    /**
     * render title milestone
     * @param schedule 
     */
    const renderMilestoneTitle = (schedule: DataOfSchedule) => {
        if (ItemCalendar.isViewDetailMilestone(schedule)) {
            const styleTitle = { color: '' };
            {schedule.milestoneStatus === "02" ?

            styleTitle.color = ItemCalendar.getColor(ColorType.Red, schedule, props.localNavigation) 
            :
            styleTitle.color = ItemCalendar.getColor(ColorType.Black, schedule, props.localNavigation) 
            
        }
            return (
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.txtDt, styles.fBold, styleTitle]}>
                    {truncateString(schedule.itemName, STRING_TRUNCATE_LENGTH.LENGTH_60)}
                </Text>
            )
        } else{
            return <></>
        }
    }
    const isViewDetail: boolean = ItemCalendar.isViewDetailMilestone(props.dataOfSchedule);


    /**
     * render milestone
     * @param schedule 
     */
    const renderMilestone = (schedule: DataOfSchedule) => {
        const styleSchedule = {
            // top: props.top || '',
            // left: props.left || '',
            width: props.width || (ItemCalendar.getWidthOfObject(schedule) + '%'),
            zIndex: 1
        };
        const styleContent = {
            backgroundColor: background
        };

        return (
            <TouchableOpacity onPress={() => {isViewDetail && renderModalMilestoneDetail(props.dataOfSchedule) }}>
                {props.modeInList 
                ? 
                 <View style={[styles.itemEvent, styleSchedule, {height: normalize(27), paddingTop: normalize(5)}]}>
                      <View style={[styles.itemEventCt, styleContent, {flexDirection:'row', alignItems:'center' }]}>
                          {renderMilestoneIcon(schedule)}
                          {renderMilestoneTitle(schedule)}
                      </View>
                  </View>
                  :
                  <View style={[{height: normalize(20)}, styles.itemEvent, styleSchedule]}>
                        <View style={[styles.itemEventCt, styleContent, {flexDirection:'row'}]}>
                            {renderMilestoneIcon(schedule)}
                            {renderMilestoneTitle(schedule)}
                        </View>
                 </View>
                }
              
            </TouchableOpacity>
        )
    }

    return (
        renderMilestone(props.dataOfSchedule)
    )
})
