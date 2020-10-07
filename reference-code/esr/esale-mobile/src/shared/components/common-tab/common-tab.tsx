import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { FieldInfosList } from './common-tab-reducer';
import { fieldInfosSelector } from './common-tab-selector';
import { TabScreen } from './interface';
import { CommonScreen } from './screens/common-screen';
import { CommonTabScreenStyles } from './screens/common-tab-style';
import { RelationDisplay, TypeRelationSuggest, PlatformOS } from '../../../config/constants/enum';
import StringUtils from '../../util/string-utils';
import { TEXT_EMPTY } from '../message/message-constants';
import { authorizationSelector } from '../../../modules/login/authorization/authorization-selector';


const Tab = createMaterialTopTabNavigator();

export function CommonTab({ tabList, prams }: { tabList: TabScreen[], prams?: any }) {
  const fieldInfosList = useSelector(fieldInfosSelector)
  const [tabs, setTabs] = useState<TabScreen[]>([]);
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;

  useEffect(() => {
    addNewTab(fieldInfosList)
  }, [fieldInfosList])

  const addNewTab = (fieldInfosListData: FieldInfosList[]) => {
    let tmp: TabScreen[] = []
    fieldInfosListData.forEach(fieldInfosListItem => {
      const relationFieldInfos = fieldInfosListItem.fieldInfos.filter(element => element.fieldType === 17)
      relationFieldInfos.forEach(relationFieldInfoItem => {
        if (relationFieldInfoItem.relationData.displayTab === RelationDisplay.TAB && relationFieldInfoItem.relationData.format === TypeRelationSuggest.MULTI) {
          const nameTab = StringUtils.getFieldLabel(relationFieldInfoItem, "fieldLabel", languageCode);
          if (nameTab && nameTab !== TEXT_EMPTY) {
            let tabScreen: TabScreen = {
              fieldInfo: relationFieldInfoItem,
              name: nameTab, component: CommonScreen, badges: prams
            }
            tmp.push(tabScreen)
          }
        }
      })
    });
    setTabs([...tabList, ...tmp])
  }

  const getPramFromRouteName = (routeName: any) => {
    let tabScreen = tabs.find((item: any) => item.name === routeName);
    if (tabScreen) {
      return tabScreen.badges
    } else {
      return 0
    }
  }

  return (!tabs || tabs.length === 0) ?
    (<View><Text></Text></View>)
    : (
      <Tab.Navigator
        swipeEnabled
        tabBarOptions={{
          activeTintColor: '#0F6DB5',
          tabStyle: CommonTabScreenStyles.styleTab,
          indicatorStyle: CommonTabScreenStyles.indicatorStyle,
          iconStyle: CommonTabScreenStyles.iconStyle,
          labelStyle: CommonTabScreenStyles.labelStyle,
          scrollEnabled: true,
        }}
        screenOptions={({ route }) => ({
          tabBarLabel: ({ focused }) => {
            const badgeNumber = getPramFromRouteName(route.name);
            return (
              <TouchableOpacity
                style={[CommonTabScreenStyles.titleTabContent,
                focused ? CommonTabScreenStyles.activeTab : null]}>
                <View style={Platform.OS === PlatformOS.ANDROID ? CommonTabScreenStyles.padding25 : CommonTabScreenStyles.paddingIOS}>
                  <Text
                    style={[focused ? CommonTabScreenStyles.textLink : CommonTabScreenStyles.textDefault]}>
                    {tabs[parseInt(route.name)]?.name || ""}
                  </Text>
                </View>
                {badgeNumber > 0 &&
                  <View style={[CommonTabScreenStyles.badgeBlock]}>
                    <Text style={CommonTabScreenStyles.badgeIcon}>{badgeNumber > 99 ? "+99" : badgeNumber}</Text>
                  </View>
                }
                <Text style={CommonTabScreenStyles.divideTab}></Text>
              </TouchableOpacity>
            );
          },
        })}
      >
        {tabs.map((item: TabScreen,index:number) => {
          return (<Tab.Screen key={item.name} name={index.toString()} component={item.component} initialParams={{ fieldInfoData: item.fieldInfo }} />)
        })}
      </Tab.Navigator>
    )
}

