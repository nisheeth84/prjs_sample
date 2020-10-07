import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonStyles } from '../../../../shared/common-style';
import { DynamicControlField } from '../../../../shared/components/dynamic-form/control-field/dynamic-control-field';
import { ControlType, LanguageCode } from '../../../../config/constants/enum';
import {
  PRODUCT_TRADING_BUSINESS_CARD,
  FIELD_INFO_BASIC,
} from './business-card-basic-info-dummy';
import { BusinessCardBasicInfoStyle } from './business-card-basic-info-styles';
import {
  businessCardBasicFieldInfoSelector,
  businessCardDetailSelector,
} from '../business-card-detail-selector';
import { businessCardDetailActions } from '../business-card-detail-reducer';
import { messages } from './business-card-basic-info-messages';
import { translate } from '../../../../config/i18n';
import { ProductGeneralInfoItem } from '../../../products/details/tab-general-info/product-general-info-item';
import { theme } from '../../../../config/constants';
import { authorizationSelector } from '../../../login/authorization/authorization-selector';
import {
  TEXT_EMPTY,
  ON_END_REACHED_THRESHOLD,
} from '../../../../config/constants/constants';
import StringUtils from '../../../../shared/util/string-utils';
import { getFirstItem } from '../../../../shared/util/app-utils';
import { getBusinessCard } from '../../business-card-repository';
import { CalendarByDayScreen } from '../../../calendar/screens/grid/grid-day/calendar-by-day-screen';
import { BusinessCardScreenRouteProp } from '../../../../config/constants/root-stack-param-list';
import { getActivities } from '../business-card-repository';
import { ActivityItem } from '../../../activity/list/activity-item';
import { AppIndicator } from '../../../../shared/components/app-indicator/app-indicator';

/**
 * Basic info tab screen
 */
export const BusinessCardBasicInfoScreen = () => {
  const route = useRoute();
  const basicInfo = useSelector(businessCardBasicFieldInfoSelector);
  const authData = useSelector(authorizationSelector);
  const businessCardDetails = useSelector(businessCardDetailSelector);
  const businessCardDetail: any = getFirstItem(businessCardDetails);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [load, setLoad] = useState(false);
  const [dataActivities, setDataActivities] = useState([]);

  const getBusinessCardFunc = async () => {
    const { businessCardId }: any = route.params;
    const param = {
      businessCardId,
      mode: 'detail',
      isOnlyData: false,
      hasTimeLine: true,
    };
    const response = await getBusinessCard(param);
    if (response) {
      switch (response.status) {
        case 200:
          dispatch(
            businessCardDetailActions.getBusinessCardFieldInfo(
              response.data.fieldInfo
            )
          );
          dispatch(
            businessCardDetailActions.getBusinessTrading(
              response.data.tradingProduct
            )
          );
          break;
        case 400:
          break;
        default:
          break;
      }
    }
  };

  const renderListEmptyComponent = () => {
    return <View />;
  };

  const findExtensionItem = (fieldName: any, extensionData: any) => {
    if ((extensionData || []).length === 0) {
      return null;
    }
    const item = extensionData.find((el: any) => {
      return el.key === fieldName;
    });
    return item?.value || null;
  };
  const router = useRoute<BusinessCardScreenRouteProp>();
  const listBusinessCardId = router?.params?.businessCardId;
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
      const response = await getActivities(params);
      if (response?.status === 200) {
        setDataActivities(response.data.activities);
        setRefreshing(false);
      }
    }
    callApi();
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
  const onRefresh = () => {
    setRefreshing(true);
  };

  const onEndReached = () => {
    if (!load) {
      // async function getListNotifications() {
      //   const params = {
      //     employeeId,
      //     limit: 2,
      //     textSearch: "",
      //   };
      //   const notificationResponse = await getNotifications(
      //     queryNotifications(params),
      //     {}
      //   );
      //   // if (notificationResponse) {
      //   //   handleError(notificationResponse);
      //   // }
      // }
      // setTimeout(() => {
        setLoad(false);
      // }, 1000);
      // getListNotifications();
    }
  };
  useEffect(() => {
    dispatch(
      businessCardDetailActions.getBusinessCardFieldInfo(
        FIELD_INFO_BASIC.fieldInfo
      )
    );
    dispatch(
      businessCardDetailActions.getBusinessTrading(
        PRODUCT_TRADING_BUSINESS_CARD.listProductDummy
      )
    );
    getActivitiesFuc();
    getBusinessCardFunc();
  }, []);
  return (
    <ScrollView style={CommonStyles.containerGray}>
      <FlatList
        data={[...basicInfo].sort((a: any, b: any) => {
          return a.fieldOrder - b.fieldOrder;
        })}
        keyExtractor={(item) => item.fieldId.toString()}
        renderItem={({ item }) => {
          if (item.availableFlag === 0 || item.modifyFlag === 0) {
            return <View />;
          }
          return item.fieldType !== 99 ? (
            <TouchableOpacity style={CommonStyles.generalInfoItem}>
              <DynamicControlField
                controlType={ControlType.DETAIL}
                fieldInfo={item}
                extensionData={businessCardDetail.businessCardData}
                elementStatus={{
                  fieldValue: item.isDefault
                    ? businessCardDetail[
                        StringUtils.snakeCaseToCamelCase(
                          item.fieldName || TEXT_EMPTY
                        )
                      ]
                    : findExtensionItem(
                        item.fieldName,
                        businessCardDetail.businessCardData
                      ),
                }}
              />
            </TouchableOpacity>
          ) : (
            <ProductGeneralInfoItem
              label={
                item.fieldLabel
                  ? JSON.parse(item.fieldLabel)[
                      authData?.languageCode || LanguageCode.JA_JP
                    ]
                  : ''
              }
              value={item.defaultValue || ''}
              colorValue={theme.colors.blue200}
            />
          );
        }}
        ListEmptyComponent={renderListEmptyComponent}
        showsVerticalScrollIndicator={false}
      />
      <View style={BusinessCardBasicInfoStyle.activityContainer}>
        <View style={BusinessCardBasicInfoStyle.headerPart}>
          <Text style={[CommonStyles.textBold]}>
            {translate(messages.activityTitle)}
          </Text>
        </View>
        <FlatList
          data={dataActivities}
          style={BusinessCardBasicInfoStyle.containerList}
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

      <View style={BusinessCardBasicInfoStyle.activityContainer}>
        <View style={BusinessCardBasicInfoStyle.headerPart}>
          <Text style={[CommonStyles.textBold]}>
            {translate(messages.calendarTitle)}
          </Text>
        </View>
        <CalendarByDayScreen />
      </View>
    </ScrollView>
  );
};
