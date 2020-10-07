import React, { useState, useEffect } from "react";
import { GridList } from "./grid/grid-list/grid-list";
import { useSelector } from "react-redux";
import { typeShowGridSelector } from "../calendar-selector";
import { CalendarView } from "../constants";
import { CalendarByDayScreen } from "./grid/grid-day/calendar-by-day-screen"
import { Icon } from "../../../shared/components/icon/index";
import { Text, View,TouchableOpacity } from "react-native";
import { normalize } from "../common";
import { useNavigation ,} from "@react-navigation/native";
// import {  DrawerNavigationProp} from '@react-navigation/drawer';
import {DrawerActions} from '@react-navigation/native';

/**
 * render component home of calendar
 */
export const CalendarHomeScreen = () => {
    const navigation  = useNavigation();
    const typeShowGrid = useSelector(typeShowGridSelector);
    const [typeShowGridState, setTypeShowGridState] = useState(typeShowGrid)

    useEffect(() => {
        setTypeShowGridState(typeShowGrid)
    }, [typeShowGrid])
    /**
     * App Bar
     * @param date 
     */
    const AppBar = () => {
        return (
            <View style={{ flexDirection: 'row', height: normalize(56), alignItems: 'center' }}>
                <View style={{ flex: 2, paddingLeft: 15 }}>
                    <TouchableOpacity onPress={()=>{
                        // navigation.dangerouslyGetParent().dangerouslyGetParent().toggleDrawer();
                         navigation.dispatch(DrawerActions.openDrawer());
                    }}>
                        <Icon name={'menuHeader'} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 3 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>カレンダー</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={()=>{
                        navigation.navigate("search-stack", {
                            screen: "search",
                            params: { nameService: "products" },
                          });
                    }}>
                        <Icon name={'search'} />
                    </TouchableOpacity>
                    <View style={{ width: 10 }} />
                    <TouchableOpacity onPress={()=>{
                         navigation.dispatch(DrawerActions.openDrawer());
                    }}>
                        <Icon name={'bell'} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const renderGrid = () => {
        if (typeShowGridState === CalendarView.LIST) {
            return (
                <GridList />
            )
        } else if (typeShowGridState === CalendarView.DAY) {
            return (<CalendarByDayScreen />)
        } else return (<></>)
    }

    return (
        <>  
        <AppBar></AppBar>
            {renderGrid()}
        </>
    )
}
