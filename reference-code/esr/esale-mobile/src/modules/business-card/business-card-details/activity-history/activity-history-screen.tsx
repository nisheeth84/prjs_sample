/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import {  useRoute } from '@react-navigation/native';
import { activityHistoryStyle } from './style';

import { ON_END_REACHED_THRESHOLD } from '../../../../config/constants/constants';
import { ListEmptyComponent } from '../../../../shared/components/list-empty/list-empty';
import { AppIndicator } from '../../../../shared/components/app-indicator/app-indicator';
import { CommonStyles } from '../../../../shared/common-style';
import { getActivities } from '../business-card-repository';
import { BusinessCardScreenRouteProp } from '../../../../config/constants/root-stack-param-list';
import { ActivityItem } from '../../../activity/list/activity-item';

export const ActivityHistoryScreen = () => {
  // const navigation = useNavigation();
  const [load, setLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dataActivities, setDataActivities] = useState([]);
  /**
   * call api delete business card
   */
  const route = useRoute<BusinessCardScreenRouteProp>();
  const listBusinessCardId = route?.params?.businessCardId;
  const getActivitiesFuc = () => {
    async function callApi() {
      const params = {
        filterConditions: [],
        isFirstLoad: null,
        limit: 30,
        listBusinessCardId: [listBusinessCardId],
        listCustomerId: [],
        listProductTradingId: [],
        offset: 0,
        searchConditions: [],
        searchLocal: '',
        selectedTargetId: 0,
        selectedTargetType: 1,
        orderBy: [],
      };
      const response = await getActivities(params, {});
      if (response?.status === 200) {
        setDataActivities(response.data.activities);
      }
    }
    callApi();
  };

  useEffect(() => {
    getActivitiesFuc();
  }, []);

  /**
   * pull to refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
  };

  const onEndReached = () => {
    if (!load) {
      setLoad(false);
    }
  };
  const renderListEmptyComponent = () => {
    return <ListEmptyComponent />;
  };

  const onClick = () => {
    // todo: action delete activity
  };
  const renderItemActivities = (index: number, item: any) => {
    return (
      <ActivityItem
        isDelete={false}
        isEdit={false}
        key={index}
        activity={item}
        styleActivityItem={{ paddingHorizontal: 16 }}
        onclickDeleteActivityItem={onClick}
        isDraft={false}
      />
    );
  };

  return (
    <View style={activityHistoryStyle.container}>
      <FlatList
        data={dataActivities}
        style={activityHistoryStyle.containerList}
        renderItem={({ index, item }) => renderItemActivities(index, item)}
        ListEmptyComponent={renderListEmptyComponent}
        showsVerticalScrollIndicator={false}
        onEndReached={onEndReached}
        onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
        ListFooterComponent={
          <AppIndicator style={CommonStyles.backgroundTransparent} />
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </View>
  );
};
