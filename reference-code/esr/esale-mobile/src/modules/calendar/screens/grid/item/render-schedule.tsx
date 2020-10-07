import React from 'react'
import { Text, View, Image, TouchableOpacity} from 'react-native'

import { DataOfSchedule } from '../../../api/common'
import {SignalType, ColorType, ViewPermission} from "./constant";
import { ItemCalendar } from './item-calendar';
import styles from "../../../calendar-style";
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../../../../config/i18n';
import { messages } from '../../../calendar-list-messages';
import { GetLocalNavigation } from '../../../api/get-local-navigation-type';
import { truncateString } from '../../../common/helper';
import { STRING_TRUNCATE_LENGTH } from '../../../constants';
import {Images} from '../../../config/images'
import { normalize } from '../../../../calendar/common/index';
// import { number } from 'mathjs';


interface RenderSchedule {
    dataOfSchedule: DataOfSchedule,
    localNavigation: GetLocalNavigation,
    prefixKey: string,
    className?: string,

    formatNormalStart?: string,
    formatNormalEnd?: string,

    formatFullDayStart?: string,
    formatFullDayEnd?: string,

    formatOverDayStart?: string,
    formatOverDayEnd?: string,

    top?: string,
    left?: string,
    width?: string,
    height?: string,

    showArrow?: boolean,

    modeInHour?: boolean
    modeInList?: boolean
}

/**
 * render component schedule common for view list and view day
 * @param props 
 */
export const RenderSchedule = React.memo((props: RenderSchedule) => {
    const navigation = useNavigation();
/**
 * get Detail
 */
    const getDetail = (itemId: number) => {
        navigation.navigate("schedule-detail-screen", { id: itemId });
    };
    const plan = ItemCalendar.getPlanOfSchedule(props.dataOfSchedule, props.modeInHour);

    const styleTitle = {
        color: "",
        textDecorationLine: {},
        backgroundColor: {}
    };
    if (plan.textColor !== ColorType.None) {
        styleTitle.color = ItemCalendar.getColor(plan.textColor, props.dataOfSchedule, props.localNavigation);
    }


    const background =   ItemCalendar.getColor(ColorType.Auto, props.dataOfSchedule, props.localNavigation);
    const borderStyle = ItemCalendar.buildBorderStyle(plan.boderInfo.type, plan.boderInfo.color, props.dataOfSchedule, props.localNavigation);
    
    if (plan.isDashLine === ViewPermission.Available) {
        styleTitle.textDecorationLine = styles.lineThrough
    }
    if (props.dataOfSchedule.isReportActivity) {
        styleTitle.backgroundColor = styles.bg2
    }
    /**
     * render title of schedule
     * @param schedule 
     */
    
    // const isViewDetail: boolean = ItemCalendar.isViewDetailSchedule(props.dataOfSchedule);
    const renderScheduleTitle = (schedule: DataOfSchedule) => {
        if (plan.isViewtitle === ViewPermission.Available) {
            const titleSchedule = ItemCalendar.getTitleOfSchedule(schedule);
            if (props.modeInHour) {
                return <Text numberOfLines={1} style={{fontSize : normalize(12), paddingRight: normalize(15)}}>{truncateString(titleSchedule, STRING_TRUNCATE_LENGTH.LENGTH_60)}</Text>
            }
            return (
                <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styleTitle.textDecorationLine, styleTitle.color]}>
                    {truncateString(titleSchedule, STRING_TRUNCATE_LENGTH.LENGTH_60)}      
                </Text>
            )
            } 
            
            return (<></>)
    }

    /**
     * render icon signal of schedule
     * @param schedule 
     */

    //  const renderIconSignal  = (schedule: DataOfSchedule) => {

    //    if(schedule.participationDivision === 0) {
    //        return <Image style={styles.icon} source={Images.schedule.ic_ellipse} /> 
    //    }else if(schedule.attendanceDivision === 0 ){
    //        return <Image style={styles.icon} source={Images.schedule.ic_ellipse_no_border} /> 
    //    }else if(schedule.attendanceDivision === 2 ){
    //        return <Image style={styles.icon} source={Images.schedule.ic_close} /> 
    //    }else if(schedule.participationDivision === 1){
    //          return <Image style={styles.icon} source={Images.schedule.ic_triangle} /> 
    //    }else {
    //     return <Image style={styles.icon} source={Images.schedule.ic_ellipse} /> 
    //    }

    // }



    const renderScheduleSignal = (schedule: DataOfSchedule) => {
        if (plan.signalInfo.type !== SignalType.NotShow) {

            const signal = ItemCalendar.getClassSignal(plan.signalInfo.type);
            
            const bColor = ItemCalendar.getColor(plan.signalInfo.bgColor, schedule, props.localNavigation) || 'transparent';
            if (plan.signalInfo.type === SignalType.Circle) {
                const objStyle = {
                    color: bColor,
                    backgroundColor: bColor,
                    borderColor: ItemCalendar.getColor(plan.signalInfo.borderColor, schedule, props.localNavigation) || 'transparent'
                }
                const styleSignal = {
                    width: 8,
                    height: 8,
                    marginRight: 2,
                    borderRadius: 50,
                    borderWidth: 1,
                    marginBottom: 2
                }
                return (
                    <View style={[{
                        borderStyle: "solid",
                        width: styleSignal.width,
                        height: styleSignal.height,
                        marginRight: styleSignal.marginRight,
                        borderRadius: styleSignal.borderRadius,
                        borderWidth: styleSignal.borderWidth,
                        marginBottom: styleSignal.marginBottom
                    }, objStyle]}/>
                )
            }
            if (plan.signalInfo.type === SignalType.Triangle) {
                const styleSignal = {
                    width: 0,
                    height: 0,
                    borderLeftWidth: 4,
                    borderLeftColor: "transparent",
                    borderRightWidth: 4,
                    borderRightColor: "transparent",
                    borderBottomWidth: 7
                }
                return (
                    // <Text style={objStyle}><Image style={[styles.iconSmall]} source={signal}></Image></Text>
                    <View style={[{
                        width: styleSignal.width,
                        height: styleSignal.height,
                        borderStyle: "solid",
                        borderLeftColor: styleSignal.borderLeftColor,
                        borderLeftWidth: styleSignal.borderLeftWidth,
                        borderRightColor: styleSignal.borderRightColor,
                        borderRightWidth: styleSignal.borderRightWidth,
                        borderBottomWidth: styleSignal.borderBottomWidth
                    }]}/>
                )
            }
            if (plan.signalInfo.type === SignalType.X) {
                const objStyle = {
                    borderBottomColor: bColor
                }
                return (
                    <Text style={objStyle}><Image style={[styles.iconSmall]} source={signal}></Image></Text>
                )
            }
            return (<></>)
        } else return (<></>)
    }

    /**
     * render time of schedule
     * @param schedule 
     */
    const renderScheduleTime = (schedule: DataOfSchedule) => {   
        const renderTime = (formatStart?: string, formatEnd?: string) => {
            if (formatStart || formatEnd) {
                return (
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.txtDt, styleTitle.textDecorationLine]}>
                        {formatStart && moment(schedule.startDateMoment).format(formatStart || 'HH:mm')}
                        {formatStart && formatEnd && (<>〜</>)}
                        {formatEnd && moment(schedule.finishDateMoment).format(formatEnd || 'HH:mm')}
                    </Text>
                )
            } else {
                return (
                    <></>
                )
            }
        }
        if (plan.isViewTime === ViewPermission.Available) {
            if (props.modeInHour) {
                return (
                    renderTime(props.formatNormalStart, props.formatNormalEnd)
                )
            }
            if (schedule.isOverDay) {
                return (
                    renderTime(props.formatOverDayStart, props.formatOverDayEnd)
                )
            } else if (schedule.isFullDay) {
                return (
                    renderTime(props.formatFullDayStart, props.formatFullDayEnd)
                )
            }
            return (
                renderTime(props.formatNormalStart, props.formatNormalEnd)
            )
        } else {
            return (<></>)
        }
    }
    /**
     * render text full day
     * @param schedule 
     */
    const renderTextFullDay = (schedule: DataOfSchedule) => {
      return schedule.isFullDay && <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.txtDtBefore, styles.fBold, styleTitle.color, styleTitle.textDecorationLine]}>{translate(messages.textFullDay)}</Text>;
    };

    /**
     * render icon of schedule
     * @param schedule 
     */

    const render_Height = (schedule: DataOfSchedule) => {
        const startTime =  (moment(schedule.startDateMoment))
        const endTime = (moment(schedule.finishDateMoment))
        const result = moment.duration(endTime.diff(startTime))
        return result.as('minutes').valueOf() * 0.9
     }    
       
    const renderScheduleIcon = (schedule: DataOfSchedule) => {
     
        const check_icon = (schedule: DataOfSchedule) => {

            switch (schedule.itemIcon) {

                case 'ic-calendar-person1.svg':
                    return <Image style={styles.icon} source={Images.schedule_type.icon_person_red} /> 
                case 'ic-calendar-bag.svg':
                    return <Image style={styles.icon} source={Images.schedule_type.icon_bag} />
                case  'ic-calendar-user1.svg':
                        return <Image style={styles.icon} source={Images.schedule_type.icon_user1} /> 
                case 'ic-calendar-phone.svg' :
                    return <Image style={styles.icon} source={Images.schedule_type.ic_calendar_phone} /> 
                case 'ic-calendar-text.svg' :
                    return <Image style={styles.icon} source={Images.schedule_type.icon_text} /> 
                case 'ic-calendar-recyclebin.svg' :
                    return <Image style={styles.icon} source={Images.schedule_type.icon_bell} /> 
                default :
                    return <Image style={styles.icon} source = {{uri:`${schedule.itemIcon}`}}  />
            }   
    }
    //   return plan.isViewIcon === ViewPermission.Available && schedule.itemIcon ?  <Image style={styles.icon} source={schedule.itemIcon} />   :  check_icon(schedule) ;
      return   check_icon(schedule) ;

    }   
   
    if (!!!props.modeInHour) {
        return (
            <TouchableOpacity onPress={() => { getDetail(props.dataOfSchedule.itemId) }}>
                {props.modeInList ? 

                 <View style={[{ marginTop: normalize(6), minHeight: normalize(30)}]}>
                 <View style={[{borderStyle: props.dataOfSchedule.participationDivision === 2 ? 'dashed' : 'solid', justifyContent:'center'}, styles.itemEventCt, { backgroundColor: props.dataOfSchedule.attendanceDivision === 1  ? background : styleTitle.backgroundColor, borderColor: borderStyle.borderColor, borderWidth: borderStyle.borderWidth}]}>
                     <View style={[styles.dt]}>
                     {renderScheduleSignal(props.dataOfSchedule)}
                     {renderScheduleIcon(props.dataOfSchedule)}
                     {renderScheduleTitle(props.dataOfSchedule)}
                     {renderTextFullDay(props.dataOfSchedule)}
                     </View>
                 {/* { props.dataOfSchedule.attendanceDivision === 2 ? <View style={{width: '150%', height: 1, backgroundColor: 'black', position:'absolute'}}></View> : null } */}
                     <View style={[styles.dt]}>
                         {renderScheduleTime(props.dataOfSchedule)}
                     </View>
                 </View>
             </View>
             :
             <View style={[styleTitle.backgroundColor, { marginTop: normalize(1)}]}>
             <View style={[{borderStyle: props.dataOfSchedule.participationDivision === 2 ? 'dashed' : 'solid', justifyContent:'center', height: normalize(20)}, styles.itemEventCt, { backgroundColor: props.dataOfSchedule.attendanceDivision === 1  ? background : '#FFF', borderColor: borderStyle.borderColor, borderWidth: borderStyle.borderWidth }]}>
                 <View style={[styles.dt]}>
                     {renderScheduleIcon(props.dataOfSchedule)}
                     {renderTextFullDay(props.dataOfSchedule)}
                     {renderScheduleSignal(props.dataOfSchedule)}
                     {/* {renderIconSignal(props.dataOfSchedule)} */}
                     {renderScheduleTime(props.dataOfSchedule)}
                     {renderScheduleTitle(props.dataOfSchedule)}
                 </View>
             { props.dataOfSchedule.attendanceDivision === 2 ? <View style={{width: '150%', height: 1, backgroundColor: 'black', position:'absolute'}}></View> : null }
                 {/* <View style={[styles.dt]}>
                 
                 </View> */}
             </View>
         </View>
                }
              
            </TouchableOpacity>
        )
    } else {
        return (
            <TouchableOpacity  onPress={() => { getDetail(props.dataOfSchedule.itemId) }}>
                <View style={[styleTitle.backgroundColor, {height:normalize(render_Height(props.dataOfSchedule)) ,width: props.width, marginTop: normalize(1), paddingLeft:normalize(2)}]}>
                    <View  style={[{borderStyle: props.dataOfSchedule.participationDivision === 2 ? 'dashed' : 'solid' , justifyContent: 'center'},styles.itemEventCt, { backgroundColor:  props.dataOfSchedule.attendanceDivision === 1  ? background : '#FFF', borderColor: borderStyle.borderColor,   borderWidth: borderStyle.borderWidth} ]}>
                        <View style={styles.dt}>
                            {renderScheduleIcon(props.dataOfSchedule)}
                            {renderScheduleTitle(props.dataOfSchedule)}
                        </View>
                        { props.dataOfSchedule.attendanceDivision === 2 ? <View style={{width: '110%', height: 1, backgroundColor: 'black', position:'absolute'}}></View> : null }
                        <View style={styles.dt}>
                            {renderScheduleTime(props.dataOfSchedule)}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
})