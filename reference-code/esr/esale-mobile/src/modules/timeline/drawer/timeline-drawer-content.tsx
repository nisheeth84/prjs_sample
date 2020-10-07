/* eslint-disable react/jsx-curly-newline */
/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { styles } from "./timeline-drawer-styles";
import { ItemDrawer } from "./item-drawer";
import { ItemSearchDrawer } from "./item-search";
import { messages } from "./timeline-drawer-messages";
import { translate } from "../../../config/i18n";
import { ItemDepartment } from "./timeline-drawer-department-content";
// import { getLocalNavigationTimeline } from "./timeline-drawer-repository";
// import { queryLocalNavigation } from "../query";
import { drawerTimelineAction } from "./timeline-drawer-reducer";
import { localNavigationSelector } from "./drawer-timeline-selector";
import {
  CustomerTimeline,
  Group,
  getLocalNavigationTimeline,
} from "./timeline-drawer-repository";
import { ListTypeTimeline } from "../../../config/constants/enum";
import { getUserTimelines } from "../timeline-repository";
import { timelineActions } from "../timeline-reducer";

const { width, height } = Dimensions.get("window");
const xTranslate = width - 40;

export const DrawerTimelineScreen = () => {

  const dispatch = useDispatch();
  /**
   * handle response api */

  // const handleErrorGetFieldInfoPersonals = (
  //   response: LocalNavigationResponse
  // ) => {
  //   switch (response.status) {
  //     case 400: {
  //       ShowError.alert("Notify", "Bad request!");
  //       break;
  //     }
  //     case 500: {
  //       ShowError.alert("Notify", "Server error!");
  //       break;
  //     }
  //     case 403: {
  //       ShowError.alert(
  //         "Notify",
  //         "You have not permission get Field Info Personals!"
  //       );
  //       break;
  //     }
  //     case 200: {
  //       dispatch(
  //         drawerTimelineAction.getLocalNavigation({
  //           localNavigationData: dataDUMMY,
  //         })
  //       );
  //       break;
  //     }
  //     default: {
  //       // ShowError.alert("Notify", "Error!");
  //       dispatch(
  //         drawerTimelineAction.getLocalNavigation({
  //           localNavigationData: dataDUMMY,
  //         })
  //       );
  //     }
  //   }
  // };

  async function getDataUserTimeline(listType: number) {
    const param = {
      listType,
      listId: null,
      limit: 3,
      offset: 0,
      filters: {
        filterOptions: [1],
        isOnlyUnreadTimeline: true,
      },
      sort: "changedDate",
    };
    const userTimelineResponse = await getUserTimelines(param);
    if (userTimelineResponse) {
      dispatch(
        drawerTimelineAction.getUserTimelines(userTimelineResponse.data)
      );
    }
  }
  /**
   * call api
   */
  async function getDataLocalNavigation() {
    const param = {};
    const localNavigationResponse = await getLocalNavigationTimeline(param);
    if (localNavigationResponse) {
      dispatch(
        drawerTimelineAction.getLocalNavigation(localNavigationResponse.data)
      );
    }
  }
  useEffect(() => {
    const listTye = 1;
    getDataUserTimeline(listTye);
    getDataLocalNavigation();
  }, []);

  const localNavigationData: any = useSelector(localNavigationSelector);
  console.log("======================>", localNavigationData);
  const [positionView] = useState(new Animated.Value(-height));
  const [listDepartment, setListDepartment] = useState<any>([]);
  const [groupSearchList, setGroupSearchList] = useState<Array<Group>>([]);
  const navigation = useNavigation();
  const animationCloseSlide = () => {
    Animated.timing(positionView, {
      toValue: -height,
      duration: 500,
    }).start();
  };
  const animationOpenSlide = () => {
    Animated.timing(positionView, {
      toValue: 0,
      duration: 500,
    }).start();
  };

  /**
   * show Department screen
   * @param item
   */
  const onShowDepartment = (item: any) => {
    const newListDepartment = [...listDepartment, item];
    setListDepartment(newListDepartment);
    animationOpenSlide();
  };

  /**
   * call api get timeline when
   * @param listType
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getListTimeLine = (listType: number) => {
    // getDataUserTimeline(listType);
    // dispatch(
    //   drawerTimelineAction.getUserTimeline({
    //     userTimelineData: dataUserDUMMY,
    //   })
    // );
    dispatch(timelineActions.updateListTypeOptionOptions(listType));
    navigation.dispatch(DrawerActions.closeDrawer());
  };
  /**
   * Filter group to show data search group
   * @param dataFilter
   */
  const filterGroup = (dataFilter: Array<Group>) => {
    if (groupSearchList.length > 0) {
      const result = dataFilter.filter((obj) => {
        return groupSearchList.indexOf(obj) != -1;
      });
      return result;
    }
    return dataFilter;
  };

  /**
   * render List Groups
   * @param title
   * @param data
   */
  const itemListGroup = (title: string, data: Array<Group>) => {
    return (
      <ItemDrawer
        title={title}
        arrowDown
        showChildren={
          filterGroup(data).length > 0 && groupSearchList.length > 0
        }
      >
        <FlatList
          style={styles.boxList}
          data={filterGroup(data)}
          keyExtractor={(item: Group) => item.groupId.toString()}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <ItemDrawer
              title={item.groupName}
              newItem={item.newItem}
              onPress={() =>
                navigation.navigate("timeline-page-group", {
                  data: { timelineGroupId: item.groupId },
                })
              }
            />
          )}
        />
      </ItemDrawer>
    );
  };

  /**
   * render  timeline search view
   * @param title
   * @param placeholder
   * @param data
   * @param type
   */
  const itemSearchTimeline = (
    title: string,
    placeholder: string,
    data: Array<CustomerTimeline>,
    type: number
  ) => {
    return (
      <>
        <ItemDrawer title={title} />
        <ItemSearchDrawer
          placeholder={placeholder}
          dataSearch={data}
          fieldId="listId"
          fieldSearch="listName"
          fieldNewItem="newItem"
          onPressItem={() => getListTimeLine(type)}
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.boxItemDrawer}>
        <Text style={styles.txtHeader}>{translate(messages.titleHeader)}</Text>
      </View>
      <ScrollView>
        <ItemDrawer
          title={translate(messages.allTimeline)}
          borderBottom
          newItem={localNavigationData?.localNavigation?.allTimeline || ""}
          onPress={() => getListTimeLine(ListTypeTimeline.ALL_TIMELINE)}
        />
        <ItemDrawer
          title={translate(messages.yourTimeline)}
          borderBottom
          newItem={localNavigationData?.localNavigation?.myTimeline || ""}
          onPress={() => getListTimeLine(ListTypeTimeline.PERSONAL_TIMELINE)}
        />
        <ItemDrawer
          title={translate(messages.favoriteTimeline)}
          borderBottom
          newItem={localNavigationData?.localNavigation?.favoriteTimeline || ""}
          onPress={() => getListTimeLine(ListTypeTimeline.FAVORITE_TIMELINE)}
        />
        <View style={styles.spaceView} />

        <ItemDrawer
          title={translate(messages.channel)}
          addCircle
          onPress={() => navigation.navigate("register-group-chanel")}
        />
        <ItemSearchDrawer
          placeholder={translate(messages.searchChannel)}
          dataSearch={[
            ...localNavigationData.localNavigation.groupTimeline
              .requestToJoinGroup,
            ...localNavigationData.localNavigation.groupTimeline.joinedGroup,
            ...localNavigationData.localNavigation.groupTimeline.favoriteGroup,
          ]}
          fieldId="groupId"
          fieldSearch="groupName"
          fieldNewItem="newItem"
          onGetResponseSearch={(item) => setGroupSearchList(item)}
        />
        <ItemDrawer
          title={translate(messages.channelList)}
          onPress={() => navigation.navigate("timeline-list-group")}
        />
        {itemListGroup(
          translate(messages.favoriteChannel),
          localNavigationData.localNavigation.groupTimeline.favoriteGroup
        )}
        {itemListGroup(
          translate(messages.participatingChannel),
          localNavigationData.localNavigation.groupTimeline.joinedGroup
        )}
        {itemListGroup(
          translate(messages.channelRequestingParticipation),
          localNavigationData.localNavigation.groupTimeline.requestToJoinGroup
        )}

        <ItemDrawer title={translate(messages.department)} />
        <ItemSearchDrawer
          placeholder={translate(messages.searchDepartment)}
          dataSearch={localNavigationData.localNavigation.departmentTimeline}
          fieldId="departmentId"
          fieldSearch="departmentName"
          fieldNewItem="newItem"
          itemArrowRight
          onPressItem={(item) => onShowDepartment(item)}
        />

        {itemSearchTimeline(
          translate(messages.customerListTimeline),
          translate(messages.searchCustomerListTimeline),
          localNavigationData.localNavigation.customerTimeline,
          ListTypeTimeline.FAVORITE_CUSTOMER_TIMELINE
        )}
        {itemSearchTimeline(
          translate(messages.businessCardListTimeline),
          translate(messages.searchBusinessCardListTimeline),
          localNavigationData.localNavigation.businessCardTimeline,
          ListTypeTimeline.FAVORITE_BUSINESS_CARD_TIMELINE
        )}

        <ItemDrawer
          title={translate(messages.followManagement)}
          arrowRight
          onPress={() => navigation.navigate("followed-management-screen")}
        />
      </ScrollView>

      <Animated.View
        style={{
          width: xTranslate,
          position: "absolute",
          bottom: positionView,
          height,
        }}
      >
        <ItemDepartment
          onClose={() => animationCloseSlide()}
          title={listDepartment.length > 0 && listDepartment[0].departmentName}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
