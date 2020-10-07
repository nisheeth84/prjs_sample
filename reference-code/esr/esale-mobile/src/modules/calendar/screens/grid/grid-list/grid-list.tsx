import React, { useEffect, useState, useRef } from "react";
import { Text, View, FlatList, StyleSheet, Modal, ActivityIndicator, Platform } from "react-native";
import styles from "../../../calendar-style";
import { normalize } from '../../../common';
import { Style } from "../../../common"
import { useSelector, useDispatch } from "react-redux";
import { tabFocusSelector, localNavigationSelector } from "../../../calendar-selector";
import moment from "moment";
import { DataOfDay, CalenderViewWeekList, DataOfViewList } from "../../../api/common";
import { TabFocus } from "../../../constants";
import { ItemList } from "./item-list";
import { CalendarComponent } from "../item/calendar-component";
import { calendarActions } from "../../../calendar-reducer";
import { getDataCalendarForListRepo, getDataCalendarForListResource } from "../../../calendar-repository";
// import { DummyDataOfSchedule } from "../../../assets/dummy-data-for-grid";
import { messages } from "../../../calendar-list-messages";
import { translate } from "../../../../../config/i18n";
import { LoadingComponent } from "../item/item-loading";
import { TypeMessage } from "../../../../../config/constants/enum";
import { checkResponse } from "../../../common/helper";
// import { ApiHeaderDayType } from "../../../api/common-type";
import _ from 'lodash';
import { NoDataComponent } from "../item/item-no-data";
const NUM_DAYS = 20;
const EVENT_NUMBER = 20;
// var maker = {};
export const GridList = React.memo(() => {
    const dispatch = useDispatch();
    // const [calendarComponent] = useState(useRef(null));
    const tabFocus = useSelector(tabFocusSelector);
    const localNavigation = useSelector(localNavigationSelector);
    // const dateShow = useSelector(dateShowSelector);10
    let old: DataOfViewList = {
        dataSchedule: {},
        dataResource: {}
    }
    const [state, setState] = useState({
        currentDate: moment().format("YYYY-MM-DD"),
        isLoadTop: false,
        isLoadBottom: false,
        isReachEnd: false,
        isReachTop: false,
        pageTop: 0,
        pageDown: 0,
        isLoadFirstLoad: false,
        listDay: Array(),
    })
    useEffect(() => {
        if (state.isLoadFirstLoad) {
            loadMoreDataBottom();
        }
        if (state.isReachEnd) {
            loadMoreDataBottom();
        }
        if (state.isReachTop) {
            loadMoreDataUp();
        }

    }, [state.isLoadFirstLoad, state.isReachEnd, state.isReachTop])
    /**
     * render item for flatList
     * @param param0 
     */
    const renderItemFlatList = ({ item, index }: { item: DataOfDay, index: number }) => {
        // if (item) {
        //     {
        return (

            <View key={`${index}${item.dataHeader.timestamp}`} style={{ paddingRight: 3 }}>
                {(moment(item.dataHeader.dateMoment).date() === moment(item.dataHeader.dateMoment).startOf('months').date()) &&

                    <View style={[styles.otherMonth, { paddingRight: 3 }]} key={`${item.dataHeader.timestamp}_${item.dataHeader.isScheduleHeader ? "true" : ""}`}>
                        <View style={[Style.container, { justifyContent: 'center' }]}>
                            <Text style={styles.titleOtherMonth}>{moment(item.dataHeader.dateMoment).format("YYYY")}{translate(messages.year)} {moment(item.dataHeader.dateMoment).format("M")}{translate(messages.month)}</Text>
                        </View>
                    </View>

                }
                {
                    (moment(item.dataHeader.dateMoment).date() === moment(item.dataHeader.dateMoment).startOf("isoWeeks").date()) &&
                    (
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.titleMusty, styles.fBold]}>
                            {moment(item.dataHeader.dateMoment).format('M')}{translate(messages.month)}{moment(item.dataHeader.dateMoment).format('D')}{translate(messages.day)}〜{moment(item.dataHeader.dateMoment).add(6, "days").format('D')}{translate(messages.day)}
                        </Text>
                    )
                }
                <ItemList dataOfDay={item} preKey={`ItemList${item.dataHeader.timestamp}_${item.dataHeader.isScheduleHeader}`} currentDay={(state.currentDate)} />
            </View>
        )
        // }
        // } else {
        //     return (<></>)
        // }
    }

    /**
     * reload data of grid
     * @param date
     */
    const handleReloadData = (date: string) => {
        setScrollUp(false)
        setDateScroll(moment());
        setState({
            currentDate: date,
            isLoadTop: false,
            isLoadBottom: false,
            isReachEnd: false,
            isReachTop: false,
            pageTop: 0,
            pageDown: 0,
            isLoadFirstLoad: true,
            listDay: [],
        })
        // reload();
        // dispatch(calendarActions.onChangeDateShow({ dateShow: date }))
    }
    const reload = () => {

        // const itemDateSelected = state.listDay.find((item:DataOfDay) => {
        //     return moment(item.dataHeader.dateMoment).format("YYYY-MM-DD") === moment(dateShow).format("YYYY-MM-DD")
        // })
        // console.log("itemDateSelected", itemDateSelected);
        // if (false) {
        //     gridListRef?.current?.scrollToItem({ animated: true, item: itemDateSelected });
        // }
        // else {
        //     setState({
        //         isLoadTop: false,
        //         isLoadBottom: false,
        //         isReachEnd: false,
        //         isReachTop: false,
        //         pageTop: 0,
        //         pageDown: 0,
        //         isLoadFirstLoad: true,
        //         listDay: [],
        //     })

        // }


        setState({
            currentDate: moment().format("YYYY-MM-DD"),
            isLoadTop: false,
            isLoadBottom: false,
            isReachEnd: false,
            isReachTop: false,
            pageTop: 0,
            pageDown: 0,
            isLoadFirstLoad: true,
            listDay: [],
        })
    }
    useEffect(reload, [tabFocus, localNavigation])
    const [gridListRef]: any = useState(useRef(null));
    const [dateScroll, setDateScroll] = useState(moment());
    const [isScroolUp, setScrollUp] = useState<boolean>(false);
    const onViewRef = useRef((viewableItems: any) => {

        const minIndex = Math.min(...viewableItems.changed.map((object: any) => object.item.dataHeader.timestamp), 0);
        const currentIndex = viewableItems.changed[minIndex].item;
        const date = currentIndex.dataHeader.dateMoment;

        if (isScroolUp === true) {
            if (moment(date) != dateScroll && moment(date).month() < dateScroll.month()) {
                setDateScroll(moment(date))
                console.log("UP", date, isScroolUp);
            }
        }
        if (isScroolUp === false) {
            if (moment(date) != dateScroll && moment(date).month() > dateScroll.month()) {
                setDateScroll(moment(date))
                console.log("DOWN", date, isScroolUp);
            }
        }

    })
    useEffect(() => {
        console.log("IS SCROOL", isScroolUp);
    }, [isScroolUp])
    const _onScroll = (data: any) => {
        // console.log(data?.nativeEvent?.velocity.y)
        if (Platform.OS == 'android') {
            if (data?.nativeEvent?.velocity.y >= 0) {
                setScrollUp(false);
            } else {
                setScrollUp(true);
            }
            const contentOffsetY = data?.nativeEvent?.contentOffset.y;
            if (contentOffsetY == 0) {

                if (!state.isReachTop && state.listDay.length > 15) {
                    console.log("_onTopReached");
                    setState({ ...state, isReachTop: true });
                }
            }
        } else {
            // console.log('aaaaa111111', data);
            // console.log('aaaaa2222', JSON.stringify(data));
            // if(data?.contentOffset?.y === 0){
            //     if (!state.isReachTop && state.listDay.length > 15) {
            //                 console.log("_onTopReached");
            //                 setState({ ...state, isReachTop: true });
            //             }
            // }
            // if(data?.contentOffSet >= 0){
            //     setScrollUp(false);
            // }else{
            //     setScrollUp(true);
            // }
            // const contentOffsetY = data?.nativeEvent?.contentOffset.y;
            // if (contentOffsetY == 0) {

            //     if (!state.isReachTop && state.listDay.length > 15) {
            //         console.log("_onTopReached");
            //         setState({ ...state, isReachTop: true });
            //     }
            // }


        }
    }
    const _onScrollEnd = (_item: any) => {
        // console.log('_onScrollEnd', _item)
        // if(calendarComponent){
        //     calendarComponent?.current?.toggle();
        // }
    }
    const _genKey = (item: any) => { return `${item.dataHeader.timestamp.toLocaleString()}_${item.dataHeader.isScheduleHeader ? "true" : ""}` }
    const loadMoreDataBottom = async () => {
        var dataResponse;
        var data;
        if (tabFocus === TabFocus.SCHEDULE) {
            try {
                dataResponse = await getDataCalendarForListRepo(moment(state.currentDate).add(state.pageDown * (NUM_DAYS + 1) - 0, "days"), moment(state.currentDate).add((state.pageDown + 1) * (NUM_DAYS + 1) + 0, "days"), 0, localNavigation, EVENT_NUMBER);
                const dataCheck = checkResponse(dataResponse);
                if (dataCheck.result) {
                    old.currentDate = moment(state.currentDate);
                    data =
                        CalenderViewWeekList.buildScheduleOfCalendarList(
                            old,
                            dataResponse.data
                        )


                    if (state.listDay.length > 0) {
                        let tempArray: any[] = state.listDay;
                        tempArray.push(...data.dataSchedule?.listDay || []);
                        tempArray = _.uniqBy(tempArray, function (e: DataOfDay) {
                            return e.dataHeader.dateMoment
                        });
                        let pageDownTemp = state.pageDown;
                        pageDownTemp++;
                        setState({ ...state, pageDown: pageDownTemp, isReachEnd: false, isReachTop: false, isLoadFirstLoad: false, listDay: tempArray });

                    } else {
                        let pageDownTemp = state.pageDown;
                        pageDownTemp++;
                        setState({ ...state, pageDown: pageDownTemp, isReachEnd: false, isReachTop: false, isLoadFirstLoad: false, listDay: data.dataSchedule?.listDay || [] });
                    }
                } else {
                    dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
                    setState({ ...state, isLoadFirstLoad: false })
                }
            } catch (error) {
                dispatch(calendarActions.setMessages({
                    type: TypeMessage.ERROR,
                    content: translate(messages.error)
                }));
                setState({ ...state, isLoadFirstLoad: false })
            }

        } else {

            try {
                dataResponse = await getDataCalendarForListResource(moment(state.currentDate).add(state.pageDown * (NUM_DAYS + 1) - 0, "days"), moment(state.currentDate).add((state.pageDown + 1) * (NUM_DAYS + 1) + 0, "days"), 0, localNavigation, EVENT_NUMBER);
                const dataCheck = checkResponse(dataResponse);
                if (dataCheck.result) {
                    old.currentDate = moment(state.currentDate);
                    data = CalenderViewWeekList.buildResourceOfCalendarList(old, dataResponse.data)
                    if (state.listDay.length > 0) {
                        let tempArray_: any[] = state.listDay;
                        tempArray_.push(...data.dataResource?.listDay || []);
                        tempArray_ = _.uniqBy(tempArray_, function (e: DataOfDay) {
                            return e.dataHeader.dateMoment
                        });
                        let pageDownTemp_ = state.pageDown;
                        pageDownTemp_++;
                        setState({ ...state, pageDown: pageDownTemp_, isReachEnd: false, isReachTop: false, isLoadFirstLoad: false, listDay: tempArray_ });
                    } else {
                        let pageDownTemp_ = state.pageDown;
                        pageDownTemp_++;
                        setState({ ...state, pageDown: pageDownTemp_, isReachEnd: false, isReachTop: false, isLoadFirstLoad: false, listDay: data.dataResource?.listDay || [] });
                    }
                } else {
                    dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
                    setState({ ...state, isLoadFirstLoad: false })
                }
            } catch (error) {
                dispatch(calendarActions.setMessages({
                    type: TypeMessage.ERROR,
                    content: translate(messages.error)
                }));
                setState({ ...state, isLoadFirstLoad: false })
            }

        }


    }
    const loadMoreDataUp = async () => {
        var dataResponse;
        var data;
        if (tabFocus === TabFocus.SCHEDULE) {
            try {
                dataResponse = await getDataCalendarForListRepo(moment(state.currentDate).add(- (state.pageTop + 1) * (NUM_DAYS), "days"), moment(state.currentDate).add(-(state.pageTop) * (NUM_DAYS), "days"), 0, localNavigation, EVENT_NUMBER);
                const dataCheck = checkResponse(dataResponse);
                if (dataCheck.result) {
                    old.currentDate = moment(state.currentDate);
                    data =
                        CalenderViewWeekList.buildScheduleOfCalendarList(
                            old,
                            dataResponse.data
                        );

                    if (state.listDay.length > 0) {
                        let tempArray: any[] = state.listDay;
                        tempArray.unshift(...data.dataSchedule?.listDay || []);
                        tempArray = _.uniqBy(tempArray, function (e: DataOfDay) {
                            return e.dataHeader.dateMoment
                        });
                        let pageTopTemp = state.pageTop;
                        pageTopTemp++;
                        setState({ ...state, pageTop: pageTopTemp, isReachEnd: false, isReachTop: false, isLoadFirstLoad: false, listDay: tempArray });
                    }
                } else {
                    dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
                    setState({ ...state, isLoadFirstLoad: false })
                }
            } catch (error) {
                dispatch(calendarActions.setMessages({
                    type: TypeMessage.ERROR,
                    content: translate(messages.error)
                }));
                setState({ ...state, isLoadFirstLoad: false })

            }
        } else {
            try {
                dataResponse = await getDataCalendarForListResource(moment(state.currentDate).add(- (state.pageTop + 1) * (NUM_DAYS), "days"), moment(state.currentDate).add(-(state.pageTop) * (NUM_DAYS), "days"), 0, localNavigation, EVENT_NUMBER);
                const dataCheck = checkResponse(dataResponse);
                if (dataCheck.result) {
                    old.currentDate = moment(state.currentDate);
                    data = CalenderViewWeekList.buildResourceOfCalendarList(old, dataResponse.data)
                    if (state.listDay.length > 0) {
                        let tempArray: any[] = state.listDay;
                        tempArray.unshift(...data.dataResource?.listDay || []);
                        tempArray = _.uniqBy(tempArray, function (e: DataOfDay) {
                            return e.dataHeader.dateMoment
                        });
                        let pageTopTemp = state.pageTop;
                        pageTopTemp++;
                        setState({ ...state, pageTop: pageTopTemp, isReachEnd: false, isReachTop: false, isLoadFirstLoad: false, listDay: tempArray });
                    }
                } else {
                    dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
                    setState({ ...state, isLoadFirstLoad: false })
                }
            } catch (error) {
                dispatch(calendarActions.setMessages({
                    type: TypeMessage.ERROR,
                    content: translate(messages.error)
                }));
                setState({ ...state, isLoadFirstLoad: false })
            }
        }

    }
    const _onEndReached = () => {

        if (!state.isReachEnd && state.listDay.length > 0) {
            // console.log("_onEndReached");
            setState({ ...state, isReachEnd: true });
        }

    }
    const schedule = {
        key: 'schedule',
        color: '#88d9b0',
        // selectedDotColor: 'blue',
    };
    const covertData = () => {
        var data: any = null;
        if (state.listDay.length > 0) {
            data = {};
            state.listDay.forEach((day: DataOfDay) => {
                var size = day.listSchedule?.length || 0;
                if (size > 4) {
                    size = 4;
                }
                const getDot = () => {
                    switch (size) {
                        case 0: {
                            return [];
                        }
                        case 1: {
                            return [schedule];
                        }
                        case 2: {
                            return [schedule, schedule];
                        }
                        case 3: {
                            return [schedule, schedule, schedule];
                        }
                        case 4: {
                            return [schedule, schedule, schedule, schedule];
                        }
                        default: return [];
                    }
                }
                var temp = {
                    [moment(day.dataHeader.dateMoment).format("YYYY-MM-DD")]: {
                        isWeekend: day.dataHeader.isWeekend || day.dataHeader.isCompanyHoliday || day.dataHeader.isNationalHoliday,
                        day: day,
                        dots: getDot(),
                        selected: (moment(day.dataHeader.dateMoment).format("YYYY-MM-DD") == state.currentDate),
                    }
                }
                data = Object.assign(data, temp);
            })
        }
        // var temp = {...data[dateShow], selected: true}
        // data = Object.assign(data, {[dateShow]:temp});
        // maker = Object.assign(maker, data);
        // return Object.assign({}, maker);
        return data;
    }

    return (
        <View style={Style.body}>
            <CalendarComponent
                dateParam={state.currentDate}
                getRefreshCallback={handleReloadData}
                markedDates={covertData()}
                dateScroll={dateScroll}
            />
            <View style={styles02.scroll}>
                {/* {
                    // listDay && listDay.length > 0 && */}

                <FlatList
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50
                    }}
                    ref={gridListRef}
                    data={state.listDay ? state.listDay : []}
                    renderItem={renderItemFlatList}
                    keyExtractor={_genKey}
                    onEndReached={_onEndReached}
                    onEndReachedThreshold={0.5}
                    onScroll={_onScroll}
                    initialNumToRender={20}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={20}
                    windowSize={normalize(500)}
                    ListFooterComponent={
                        <>{state.isReachEnd && <LoadingComponent />}</>
                    }
                    ListHeaderComponent={
                        <>{state.isReachTop && <LoadingComponent />}</>
                    }
                    onScrollEndDrag={_onScrollEnd}
                    ListEmptyComponent={<NoDataComponent></NoDataComponent>}

                />
                {state.isLoadFirstLoad &&
                    <Modal transparent={true} animationType={'fade'} visible={false}>
                        <View style={{
                            padding: 100,
                            width: '100%',
                            height: "100%",
                            alignItems: 'center',
                            backgroundColor: 'transparent',
                        }}>
                            <ActivityIndicator style={{ top: '50%' }} animating size="large" />
                        </View>
                    </Modal>}
            </View>
        </View >
    );
})

export const styles02 = StyleSheet.create({
    scroll: {
        // flex: 1,
        marginBottom: normalize(80),
    },
})