import React from 'react';
import { Text, View, TouchableOpacity } from "react-native";

import { DataOfDay, DataOfSchedule, DataOfResource, DataHeader, CalenderViewCommon } from "../../../api/common";
import styles from "../../../calendar-style";
import { ItemCalendarInList } from '../item/item-schedule-in-list';
import { tabFocusSelector, localNavigationSelector} from '../../../calendar-selector';
import { useSelector, useDispatch } from 'react-redux';
import { TabFocus, CalendarView } from '../../../constants';
import moment from 'moment';
import { ItemResourceInList } from '../item/item-resource-in-list';
import { messages } from '../../../calendar-list-messages';
import { translate } from '../../../../../config/i18n';
import { calendarActions } from '../../../calendar-reducer';

interface IItemList {
    dataOfDay: DataOfDay,
    preKey?: any
    currentDay?: any
}

/**
 * Component of item in grid list
 * @param props 
 */
export const ItemList = React.memo((props: IItemList) => {
    const tabFocus = useSelector(tabFocusSelector)
    const localNavigation = useSelector(localNavigationSelector)
    const nowDate = moment(new Date());
    let isDrawCurrentLine = false;
    const dispatch = useDispatch();

    /**
     * check holiday
     * @param d 
     */
    const isHoliday = (d: DataHeader) => {
        return !!d.isHoliday || !!d.isCompanyHoliday;
    }

    /**
     * render multi language date name
     * @param date 
     */
    const renderLangDateName = (date: string) => {
        const dateMoment = moment(date);
        switch (dateMoment.weekday()) {
            case 0:
                return `${translate(messages.monday)}`
            case 1:
                return `${translate(messages.tuesday)}`
            case 2:
                return `${translate(messages.wednesday)}`
            case 3:
                return `${translate(messages.thursday)}`
            case 4:
                return `${translate(messages.friday)}`
            case 5:
                return `${translate(messages.saturday)}`
            case 6:
                return `${translate(messages.sunday)}`
            default:
                return ""
        }
        // re
    }

    /**
     * render current line
     */
    const renderCurrentLine = () => {
        return (
            <View style={styles.eventActive}>
                <View style={styles.lineActive}>
                    <View style={[styles.dot, styles.dotActive]}></View>
                </View>
            </View>
        )
    }

    /**
     * check condition to draw current line
     * @param s 
     */
    const checkDrawCurrentLine = (s?: DataOfSchedule | DataOfResource) => {
        if (CalenderViewCommon.compareDateByDay(nowDate, moment(props.dataOfDay.dataHeader.dateMoment)) === 0 && (props.dataOfDay.listResource!.length > 0 || props.dataOfDay.listSchedule!.length > 0)) {
            if (!!!s) return true; // last row
            const nowHour = nowDate.hour();
            const sHour = moment(s.startDateMoment).hour();
            if (sHour > nowHour && !isDrawCurrentLine) {
                isDrawCurrentLine = true;
                return true;
            }
        }
        return false;
    }


    /**
     * reload data of grid
     */
    const handleReloadData = (date: string) => {
        dispatch(calendarActions.onChangeDateShow({ dateShow: date }))
    }
    const nameHoliday = props.dataOfDay.dataHeader.companyHolidayName
    ? JSON.parse(props.dataOfDay.dataHeader.companyHolidayName).ja_jp
    : '';
    // console.log('1111111111', nameHoliday)
    
   

    /**
     * render header line of day which have data
     */
    const renderHeaderLine = () => {
        const styleColorHoliday = isHoliday(props.dataOfDay.dataHeader) ? styles.colorRed : {}
        const styleColorWeekend = props.dataOfDay.dataHeader.isWeekend ? styles.colorRed : {}
        const styleCurrent = CalenderViewCommon.compareDateByDay(nowDate, moment(props.dataOfDay.dataHeader.dateMoment)) === 0 ? { backgroundColor: '#0F6DB3', color: '#fff' } : {}

        const dateNameLang = renderLangDateName(props.dataOfDay.dataHeader.dateMoment);
        // const dateNameLang = "test";
        return (
            <View style={styles.itemLeft}>
                <Text style={[styles.txtDate, styles.txtDateTop, styleColorWeekend]}>{dateNameLang ? dateNameLang : ""}</Text>
                <TouchableOpacity onPress={() => { dispatch(calendarActions.onChangeTypeShowGrid({ typeShowGrid: CalendarView.DAY })); handleReloadData(props.dataOfDay.dataHeader.dateMoment) }}>
                    <Text style={[styles.numDate, styleColorHoliday, styleColorWeekend, styleCurrent]}>{moment(props.dataOfDay.dataHeader.dateMoment).format("DD")}</Text>
                </TouchableOpacity>
                <Text style={[styles.txtDate, styleColorHoliday, { fontSize: 8 }]}>
                {!localNavigation.searchStatic?.isShowHoliday &&
                      `${
                        (nameHoliday) ?? ''
                      }`}
                    {''}
                </Text>
                <Text style={[styles.txtDate, { fontSize: 8 }]}>
                {!localNavigation.searchStatic?.isShowPerpetualCalendar &&
                      props.dataOfDay.dataHeader.perpetualCalendar}
                </Text>
            </View>
        )
    }

    /**
     * render item calendar in list
     */
    const renderItemCalendarInList = () => {
        return (
            <>
                {tabFocus === TabFocus.SCHEDULE ? (
                    <>
                        {props.dataOfDay.listSchedule && props.dataOfDay.listSchedule.map((data: DataOfSchedule, index: number) => {
                            return (
                                <View style={styles.itemEvent} key={`ItemCalendarInList${index}_${data.itemId}`} >
                                    {checkDrawCurrentLine(data) && renderCurrentLine()}
                                    <ItemCalendarInList dataOfSchedule={data} />
                                </View>
                            )
                        })}
                        {/* {props.dataOfDay.listSchedule?.length == 0 && <><Text style={{flex:1,textAlign:'center', height:'100%'}}>No Data</Text></>} */}
                        {!isDrawCurrentLine && checkDrawCurrentLine() && renderCurrentLine()}
                    </>
                ) : (
                        <>
                            {props.dataOfDay.listResource && props.dataOfDay.listResource.map((data: DataOfResource, index: number) => {
                                return (
                                    <>
                                        {checkDrawCurrentLine(data) && renderCurrentLine()}
                                        <ItemResourceInList dataOfResource={data} key={`ItemResourceInList${index}_${data.scheduleId}`} />
                                    </>
                                )
                            })}
                            {!isDrawCurrentLine && checkDrawCurrentLine() && renderCurrentLine()}
                        </>
                    )
                }
            </>
        )
    }

    return (
        <View style={styles.item} key={props.preKey}>
            {/* {props.dataOfDay.listSchedule?.length == 0 && <><Text style={{ flex: 1, textAlign: 'center', height: '100%' }}>No Data</Text></>} */}
            {(
                (props.dataOfDay?.listSchedule && props.dataOfDay.listSchedule.length > 0)
                || (props.dataOfDay.listResource && props.dataOfDay.listResource.length > 0)
            ) ? renderHeaderLine()
                :
                (
                    (moment(props.currentDay).format("yyyy-MM-DD") == moment.utc(props.dataOfDay.dataHeader.dateMoment).format("yyyy-MM-DD"))
                    &&
                    <>
                        {renderHeaderLine()}
                        <View style={styles.itemRight}>
                            <Text style={{ flex: 1, textAlign: 'center', height: '100%', marginTop: 20 }}>データなし</Text>
                        </View>
                    </>
                )}
            <View style={styles.itemRight}>
                {renderItemCalendarInList()}
            </View>





        </View>
    )
})