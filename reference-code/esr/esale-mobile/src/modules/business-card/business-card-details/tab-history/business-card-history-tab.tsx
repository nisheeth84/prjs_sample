import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { messages } from "../business-card-detail-messages";
import { translate } from "../../../../config/i18n";
import {
  TabHistoryStyles,
  BusinessCardDetailStyle,
} from "../business-card-detail-style";
import {
  businessCardHistoryUpdateSelector,
  bnCardHistoryUpdateFieldInfoSelector,
  businessCardOldestHistoryUpdateSelector,
  businessCardDetailSelector
} from "../business-card-detail-selector";
import { EnumFmDate } from "../../../../config/constants/enum-fm-date";
import { useNavigation } from "@react-navigation/native";
import { CommonStyles } from "../../../../shared/common-style";
import { businessCardDetailActions } from "../business-card-detail-reducer";
import {
  getBusinessCardHistoryUpdate,
  BusinessCardHistoryUpdate,
  MergedBusinessCard,
} from "../business-card-repository";
import {
  ParentChangeHistory,
  formatDataHistory,
  ChangeHistory,
  getFormatDateTaskDetail,
  repeatString,
  getFirstItem,
} from "../../../../shared/util/app-utils";
import { handleEmptyString, checkEmptyString } from "../../../products/utils";
import { appImages } from "../../../../config/constants";
import { ON_END_REACHED_THRESHOLD, TEXT_EMPTY } from "../../../../config/constants/constants";
import { ListEmptyComponent } from "../../../../shared/components/list-empty/list-empty";


export const BusinessCardHistoryTabScreen = () => {
  const dispatch = useDispatch();
  const historySelector = useSelector(businessCardHistoryUpdateSelector);
  const fieldInfoSelector = useSelector(bnCardHistoryUpdateFieldInfoSelector);
  const businessCard = useSelector(businessCardDetailSelector);
  const oldestHistoryUpdate = getFirstItem(
    useSelector(businessCardOldestHistoryUpdateSelector)
  );
  const [refreshing, setRefreshing] = useState(false);
  async function getData() {
    let params = {
      businessCardId: businessCard[0].businessCardId,
      offset: 0,
      limit: 30,
      orderBy: "updated_date : DESC",
    };
    const getBusinessCardHistoryUpdateResponse = await getBusinessCardHistoryUpdate(
      params,
      {}
    );
    if (getBusinessCardHistoryUpdateResponse && getBusinessCardHistoryUpdateResponse.status == 200) {
      setRefreshing(false);
      const businessCardHistories = getBusinessCardHistoryUpdateResponse.data.businessCardHistories;
      getBusinessCardHistoryUpdateResponse.data.businessCardHistories = [businessCardHistories[businessCardHistories.length - 1], ...businessCardHistories.splice(0, businessCardHistories.length - 1)]
      dispatch(
        businessCardDetailActions.saveBusinessCardHistoryUpdate(
          getBusinessCardHistoryUpdateResponse.data
        )
      );
      dispatch(
        businessCardDetailActions.saveOldestBusinessCardHistoryUpdate(
          getBusinessCardHistoryUpdateResponse.data.businessCardHistories[getBusinessCardHistoryUpdateResponse.data.businessCardHistories.length - 1]
        )
      );
    }

  }
  useEffect(() => {
    navigation.addListener("focus", () => {
      getData();
    });


  }, []);

  const navigation = useNavigation();
  const openHistoryDetail = (
    businessCardId: number,
    businessCardHistoryId: number,
    updatedDate: string
  ) => {
    navigation.navigate("business-card-history-detail-screen", {
      businessCardId,
      businessCardHistoryId,
      updatedDate,
    });
  };

  /**
   * navigate to employee detail screen
   * @param id
   */
  const openEmployeeDetail = (employeeId: number, employeeName: string) => {
    navigation.navigate('employee-detail', {
      id: employeeId,
      title: employeeName,
    });
  };

  // /**
  //  * get business card name
  //  * @param businessCard
  //  */
  // const getBusinessCardName = (businessCard: BusinessCardHistoryUpdate) => {
  //   return `${handleEmptyString(businessCard.firstName)} ${handleEmptyString(businessCard.lastName)}`;
  // }

  /**
   * handle group of first name, last name, company name
   */
  const handleGroupName = (
    firstName: string = "",
    lastName: string = "",
    companyName: string = ""
  ) => {
    let str = checkEmptyString(companyName) ? "" : `(${companyName})`;
    return `${handleEmptyString(firstName)} ${handleEmptyString(
      lastName
    )}${str}`;
  };

  /**
   * Render content change of content
   * @param check
   * @param before
   * @param after
   */
  const renderChangedContent = (history: BusinessCardHistoryUpdate) => {
    if (!history.contentChange) {
      return;
    }
    let { changeHistory, maxLength }: ParentChangeHistory = formatDataHistory(
      history.contentChange,
      fieldInfoSelector
    );
    if (changeHistory && changeHistory.length == 0) {
      return;
    }
    if (history.updatedDate == oldestHistoryUpdate?.updatedDate) {
      return (
        <View>
          <View style={TabHistoryStyles.labelContainer}>
            <Text style={TabHistoryStyles.historyLabel}>
              {`${handleGroupName(
                history?.firstName || TEXT_EMPTY,
                history?.lastName || TEXT_EMPTY,
                history?.companyName || TEXT_EMPTY
              )}${translate(messages.wasRegister)}`}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View style={TabHistoryStyles.labelContainer}>
            <Text style={[TabHistoryStyles.historyLabel, CommonStyles.black12]}>
              {`${handleGroupName(
                history?.firstName || TEXT_EMPTY,
                history?.lastName || TEXT_EMPTY,
                history?.companyName || TEXT_EMPTY
              )}${translate(messages.wasChanged)}`}
            </Text>
          </View>
          <View style={TabHistoryStyles.changedContainerParent}>
            <View style={CommonStyles.flex1}>
              {changeHistory && changeHistory.map((item: ChangeHistory) => {
                return (
                  <View
                    style={[TabHistoryStyles.changedContainer]}
                    key={item.id.toString()}
                  >
                    <Text style={[TabHistoryStyles.changedLabel, CommonStyles.black12]}>
                      {`${item.name}${repeatString(
                        " ",
                        maxLength - item.name.length
                      )}`}
                    </Text>
                    <Text style={[CommonStyles.black12]}>{` : `}</Text>
                    <View style={[CommonStyles.flex1, CommonStyles.rowInline]}>
                      <Text
                        style={[
                          CommonStyles.black12,
                          TabHistoryStyles.changedContent,
                        ]}
                      >
                        {`${item.change.old} `}
                      </Text>
                      <Image
                        resizeMode="contain"
                        source={appImages.icFowardArrow}
                        style={[TabHistoryStyles.arrowIcon]}
                      />
                      <Text
                        style={[
                          CommonStyles.black12,
                          TabHistoryStyles.changedContent,
                        ]}
                      >
                        {` ${item.change.new}`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      );
    }
  };

  /**
   * Render mergeed business card list
   * @param check
   * @param before
   * @param after
   */
  const renderMergedBusinessCards = (
    historyUpdate: BusinessCardHistoryUpdate
  ) => {
    let mergedBusinessCards = historyUpdate?.mergedBusinessCards;

    if ((mergedBusinessCards || []).length == 0) {
      return;
    }

    return (
      <View>
        <View style={TabHistoryStyles.labelContainer}>
          <Text style={[TabHistoryStyles.historyLabel]}>
            {mergedBusinessCards.map(
              (item: MergedBusinessCard, index: number) => {
                if (index < mergedBusinessCards.length - 1) {
                  return (
                    <Text style={CommonStyles.black12} key={item.businessCardId.toString()}>
                      {`${handleGroupName(
                        item.firstName,
                        item.lastName,
                        item.companyName
                      )}, `}
                    </Text>
                  );
                } else {
                  return (
                    <Text style={CommonStyles.black12} key={item.businessCardId.toString()}>
                      {`${handleGroupName(
                        item?.firstName || TEXT_EMPTY,
                        item?.lastName || TEXT_EMPTY,
                        item?.companyName || TEXT_EMPTY
                      )} ${translate(messages.but)}${handleGroupName(
                        historyUpdate?.firstName || TEXT_EMPTY,
                        historyUpdate?.lastName || TEXT_EMPTY,
                        historyUpdate?.companyName || TEXT_EMPTY
                      )}`}
                    </Text>
                  );
                }
              }
            )}
            {`${translate(messages.bnCardHasIntegrate)}`}
          </Text>
        </View>
        <View style={[CommonStyles.flex1, { backgroundColor: 'red' }]}>
          {mergedBusinessCards.length > 0 && mergedBusinessCards.map((item: MergedBusinessCard) => {
            return (
              <View
                style={TabHistoryStyles.mergedBusinessCard}
                key={item.businessCardId.toString()}
              >
                <TouchableOpacity
                  onPress={() => {
                    openHistoryDetail(
                      historyUpdate?.businessCardId,
                      historyUpdate?.businessCardHistoryId,
                      historyUpdate?.updatedDate
                    );
                  }}
                >
                  <Text style={[TabHistoryStyles.link, CommonStyles.flex1]}>
                    {`${item?.firstName || TEXT_EMPTY}`}
                  </Text>
                </TouchableOpacity>
                <View style={CommonStyles.flex1}>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.firstName
                  )} : ${item?.firstName || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.lastName
                  )} : ${item?.lastName || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.firstNameKana
                  )} : ${item?.firstNameKana || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.lastNameKana
                  )} : ${item?.lastNameKana || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.position
                  )} : ${item?.position || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.departmentName
                  )} : ${item?.departmentName || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.zipCode
                  )} : ${item?.zipCode || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.address
                  )} : ${item?.address || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.building
                  )} : ${item?.building || TEXT_EMPTY}`}</Text>
                  <Text style={[CommonStyles.black12]}>
                    {`${translate(messages.emailAddress)} : `}
                    <Text style={[TabHistoryStyles.link]}>
                      {item?.emailAddress || TEXT_EMPTY}
                    </Text>
                  </Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.phoneNumber
                  )} : ${item?.phoneNumber || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.mobileNumber
                  )} : ${item?.mobileNumber || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>
                    {`${translate(
                      messages.lastContactDate
                    )} : ${getFormatDateTaskDetail(
                      item?.lastContactDate || TEXT_EMPTY,
                      EnumFmDate.YEAR_MONTH_DAY_NORMAL
                    )}`}
                  </Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.memo
                  )} : ${item?.memo || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>{`${translate(
                    messages.fax
                  )} : ${item?.fax || TEXT_EMPTY}`}</Text>
                  <Text style={CommonStyles.black12}>
                    {`${translate(messages.url)} : `}
                    <Text style={[TabHistoryStyles.link]}>{`${item?.url || TEXT_EMPTY}`}</Text>
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const itemHistory = (history: BusinessCardHistoryUpdate) => {
    return (
      <View
        key={history.businessCardHistoryId.toString()}
        style={TabHistoryStyles.itemContainer}
      >
        <View style={TabHistoryStyles.timeLine}>
          <View style={TabHistoryStyles.roundView} />
          <View style={TabHistoryStyles.verticalLine} />
        </View>
        <View style={TabHistoryStyles.contentHistory}>
          <TouchableOpacity
            onPress={() => {
              openHistoryDetail(
                history.businessCardId,
                history.businessCardHistoryId,
                history.updatedDate
              );
            }}
          >
            <Text style={[TabHistoryStyles.dateChange]}>
              {getFormatDateTaskDetail(
                history.updatedDate,
                EnumFmDate.YEAR_MONTH_DAY_HM_NORMAL
              )}
            </Text>
          </TouchableOpacity>
          <View style={TabHistoryStyles.historyInfo}>

            {history.updatedUserPhotoPath ? <Image
              style={TabHistoryStyles.userAvatar}
              source={{ uri: history.updatedUserPhotoPath || TEXT_EMPTY }}
            /> : <View style={TabHistoryStyles.userAvatarDefault}>
                <Text style={TabHistoryStyles.txtUserNameDefault}>
                  {history.updatedUserName[0]}
                </Text>
              </View>}

            <TouchableOpacity
              onPress={() => {
                openEmployeeDetail(history.updatedUser, history.updatedUserName);
              }}
            >
              <Text style={[TabHistoryStyles.userName]}>
                {history.updatedUserName}
              </Text>
            </TouchableOpacity>
          </View>
          {history.contentChange != null && history.contentChange.length > 4 && <View style={TabHistoryStyles.dataContent}>
            {renderMergedBusinessCards(history)}
            {renderChangedContent(history)}
          </View>}

        </View>
      </View>
    );
  };
  /**
   * pull to refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    getData();

  };

  const onEndReached = () => { };
  const renderListEmptyComponent = () => {
    return <ListEmptyComponent />;
  };
  return (
    <ScrollView>
      <View style={BusinessCardDetailStyle.main}>
        {historySelector && <FlatList
          keyExtractor={(_item, index) => index.toString()}
          extraData={historySelector.length}
          data={historySelector}
          renderItem={({ item }) => itemHistory(item)}
          ListEmptyComponent={renderListEmptyComponent}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          // ListFooterComponent={
          //   <AppIndicator style={CommonStyles.backgroundTransparent} />
          // }
          onRefresh={onRefresh}
          refreshing={refreshing}
        />}

      </View>
    </ScrollView>
  );
};
