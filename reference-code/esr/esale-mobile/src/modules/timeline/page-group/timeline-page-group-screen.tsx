import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  // Alert,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
// import _ from "lodash";
import {
  useIsFocused,
  useNavigation,
  // useRoute,
} from '@react-navigation/native';
import { AppBarMenu } from '../../../shared/components/appbar/appbar-menu';
import { translate } from '../../../config/i18n';
import { messages } from './timeline-page-group-messages';
import { messages as messages2 } from '../timeline-messages';
import { TimelinePageGroupStyles } from './timeline-page-group-style';
import { Icon } from '../../../shared/components/icon';
import { CommonStyles } from '../../../shared/common-style';
import {
  // GetTimelineGroupsOfEmployeeResponse,
  // GetTimelineGroupsResponse,
  GetUserTimelinesDataDataResponse,
  GetUserTimelinesResponse,
  addRequestToTimelineGroup,
  addTimelineFavoriteGroup,
  deleteMemberOfTimelineGroup,
  deleteTimelineFavoriteGroup,
  deleteTimelineGroup,
  getFavoriteTimelineGroups,
  getTimelineGroups,
  getTimelineGroupsOfEmployee,
  getUserTimelines,
} from '../timeline-repository';
// import {
//   queryGetTimelineGroups,
//   //   queryGetTimelineGroupsOfEmployee,
//   //   queryGetUserTimelines,
// } from "../timeline-query";
import { timelineActions } from '../timeline-reducer';
// import { EmployeeSuggestView } from "../../../shared/components/suggestions/employee/employee-suggest-view";
// import {
//   dataGetTimelineGroupsDummy,
//   dataGetTimelineGroupsOfEmployeeDummy,
//   dataGetUserTimelinesDummy,
// } from "./timeline-page-group-data-dummy";
import {
  dataGetFavoriteTimelineGroupsSelector,
  // dataGetTimelineGroupsOfEmployeeSelector,
  // dataGetTimelineGroupsSelector,
  dataGetUserTimelinesSelector,
} from '../timeline-selector';
import { Item } from '../../../shared/components/timeline/timeline-item-screen';
import { ModalCardInfo } from '../../../shared/components/modal-card-info';
import { ModalPageGroup } from './timeline-page group-modal';
import { theme } from '../../../config/constants';
import { ModalCancel } from '../../../shared/components/modal-cancel';
import { TimelineListStyle } from '../list/timeline-list-styles';
import { TEXT_EMPTY } from '../../../config/constants/constants';
// import {
//   dataGetTimelineGroupsDummy,
//   dataGetTimelineGroupsOfEmployeeDummy,
// } from "./timeline-page-group-data-dummy";
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { TimelineModalEmployeeSuggestion } from '../modal/timeline-modal-employee-suggestion';

const styles = TimelinePageGroupStyles;
const DUMMY_USER_OWNER = 0;
const DUMMY_USER_OWNER_REQUEST = 3;
const DUMMY_USER_MEMBER = 1;
const DUMMY_USER = 2;
const DUMMY_INVITE_NAME = 'Dororo';

/**
 * route timeline
 */
interface TimelinePageGroupInterface {
  route: any;
}

// interface TimelineGroupEmployeeInterface {
//   timelineGroupId: number;
//   timelineGroupName: string;
//   imagePath: string;
//   inviteId: number;
//   inviteType: number;
//   status: number;
//   authority: number;
// }

/**
 * Component show timeline page group screen
 */
export const TimelinePageGroupScreen = ({
  route,
}: TimelinePageGroupInterface) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const dataTimelines = useSelector(dataGetUserTimelinesSelector);
  // const dataGroupDetail = useSelector(dataGetTimelineGroupsSelector)[0];
  const [dataGroupDetail, setDataGroupDetail] = useState<any>({});
  console.log('=daaa dataGroupDetail', dataGroupDetail);
  const [dataGroupEmployee, setDataGroupEmployee] = useState<any>([]);
  // const dataGroupEmployee: Array<TimelineGroupEmployeeInterface> =
  //   useSelector(dataGetTimelineGroupsOfEmployeeSelector) || [];
  const [showModal, setModal] = useState(false);
  const [modal, setShowModal] = useState(false);
  const [showConfirm, modalConfirm] = useState(false);
  const [visibleModalCancel, setVisibleModalCancel] = useState(false);
  const [user, setUser] = useState(2);
  const [request, setRequest] = useState(false);
  const [content, setContent] = useState(TEXT_EMPTY);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [addMemeber, setAddMemeber] = useState(false);
  const employeeData: any = useSelector(authorizationSelector);
  const dataGetFavorite: any =
    useSelector(dataGetFavoriteTimelineGroupsSelector) || [];
  const isFocused = useIsFocused();
  const dataFake = {
    timelineGroupId: 0,
    timelineGroupName: 'Name',
    comment: '',
    imagePath: '',
    invites: 2,
  };
  const {
    timelineGroupId = '',
    timelineGroupName = '',
    comment = '',
    imagePath = '',
    invites = [],
  } = dataGroupDetail || dataFake;

  const [txtSearch, setTxtSearch] = useState('');

  useEffect(() => {
    if (dataGroupEmployee[0] === undefined) {
      setUser(2);
    } else if (dataGroupEmployee[0].status === 1) {
      if (dataGroupEmployee[0].authority === 2) {
        setUser(1);
      }
      if (dataGroupEmployee[0].authority === 1) {
        if (dataGroupDetail?.invites?.some((el: any) => el.status === 2)) {
          setUser(3);
        } else {
          setUser(0);
        }
      }
    } else if (dataGroupEmployee[0].status === null) {
      setUser(2);
    } else if (dataGroupEmployee[0].status === 2) {
      setUser(2);
      setRequest(true);
    }
  }, [dataGroupDetail]);

  /**
   * handle error getTimelineGroupsOfEmployee
   * @param response
   */
  // const handleErrorGetTimelineGroupsOfEmployee = (
  //   response: GetTimelineGroupsOfEmployeeResponse
  // ) => {
  //   switch (response.status) {
  //     case 200:
  //       dispatch(timelineActions.getTimelineGroupsOfEmployee(response.data));
  //       break;
  //     default:
  //       // Alert.alert("Notify", "Get data failed");
  //       break;
  //   }
  // };

  /**
   * call api getTimelineGroupsOfEmployee
   */
  const getTimelineGroupsOfEmployeeFunc = async () => {
    const { timelineGroupId } = route?.params?.data || 0;
    const params = {
      timelineGroupId,
    };

    const data = await getTimelineGroupsOfEmployee(params);
    // setDataGroupEmployee(data.data.timelineGroup);
    if (data) {
      // handleErrorGetTimelineGroupsOfEmployee(data);
      setDataGroupEmployee(data.data.timelineGroup);
    }
  };

  /**
   * handle error getUserTimelines
   * @param response
   */
  const handleErrorGetUserTimelines = (response: GetUserTimelinesResponse) => {
    switch (response.status) {
      case 200:
        dispatch(timelineActions.getUserTimelines(response.data));
        break;
      case 500:
        alert("Sever Error!")
        break;
      default:
        break;
    }
  };

  /**
   * call api getUserTimelines
   */
  const getUserTimelinesFunc = async () => {
    const params = {
      listType: 7,
      listId: null,
      limit: 30,
      offset: 1,
      filters: {
        filterOptions: [1],
        isOnlyUnreadTimeline: false,
      },
      sort: 'changedDate',
    };

    const data = await getUserTimelines(params);

    if (data) {
      handleErrorGetUserTimelines(data);
    }
  };

  /**
   * call api
   */
  const getTimelineGroupsFunc = async () => {
    const { timelineGroupId } = route?.params?.data || 0;
    const params = {
      timelineGroupIds: [timelineGroupId],
      sortType: 1,
    };
    const data = await getTimelineGroups(params);
    if (data) {
      setDataGroupDetail(data.data.timelineGroup[0]);
      // dispatch(timelineActions.getTimelineGroups(data.data));
    }
  };

  const onHandleDeleteGroup = async () => {
    const params = {
      timelineGroupId,
    };
    const response = await deleteTimelineGroup(params);
    if (response) {
      // TODO: delete
      navigation.goBack();
      // getFavoriteTimelineGroupsFunc();
    }
  };

  const onLeaveGroup = async () => {
    setShowModal(!modal);
    const params = {
      timelineGroupId,
      inviteId: invites.inviteId,
      inviteType: invites.inviteType,
    };
    const response = await deleteMemberOfTimelineGroup(params, {});
    console.log('===========onLeaveGroup=========>>>>', response.status);
    if (response.status === 200 && !!response?.data) {
      getTimelineGroupsOfEmployeeFunc();
      getTimelineGroupsFunc();
    }
  };

  const checkOwner = () => {
    // TODO: check permistion user
    navigation.navigate('timeline-participant-group', {
      timelineGroupId,
    });
  };

  const moveNavigateShare = () => {
    navigation.navigate('share-timeline', {
      title: translate(messages2.titleCreatTimeline),
    });
  }
  useEffect(() => {
    const { timelineGroupId } = route?.params?.data || 0;
    if (dataGetFavorite.some((el: any) => el === timelineGroupId)) {
      setFavorite(false);
      setIsFavorite(false);
    } else {
      setFavorite(true);
      setIsFavorite(true);
    }
  }, [dataGetFavorite]);

  /**
   * handleAddGroup
   * @param item
   */

  const handleAddGroup = async (timelineGroupId: number, invites: any) => {
    setRequest(!request);
    const params = {
      timelineGroupId,
      inviteId: invites.inviteId,
      inviteType: invites.inviteType,
    };
    const param = {
      timelineGroupInvite: {
        timelineGroupId,
      },
    };
    if (request) {
      const response = await deleteMemberOfTimelineGroup(params, {});
      console.log('===========delete=========>>>>', response.status);
      if (response.status === 200 && !!response?.data) {
        getTimelineGroupsOfEmployeeFunc();
        getTimelineGroupsFunc();
      }
    } else {
      const response = await addRequestToTimelineGroup(param);
      console.log('===========add=========>>>>', response.status);
      if (response) {
        getTimelineGroupsOfEmployeeFunc();
        getTimelineGroupsFunc();
      }
    }
  };

  /**
   * get favor
   */
  const getFavoriteTimelineGroupsFunc = async () => {
    const params = {
      employeeId: employeeData.employeeId,
    };
    const dataFavoriteTimelineGroups = await getFavoriteTimelineGroups(params);
    if (dataFavoriteTimelineGroups) {
      dispatch(
        timelineActions.getFavoriteTimelineGroups(
          dataFavoriteTimelineGroups.data.timelineGroupIds
        )
      );
    }
  };

  const handleFavoriteGroup = async () => {
    setIsFavorite(!isFavorite);
    const params = {
      timelineGroupId,
    };
    if (!isFavorite) {
      const response = await deleteTimelineFavoriteGroup(params);
      if (response) {
        // TODO: get group detail
        getTimelineGroupsFunc();
        getFavoriteTimelineGroupsFunc();
      }
    } else {
      const response = await addTimelineFavoriteGroup(params);
      if (response) {
        getTimelineGroupsFunc();
        getFavoriteTimelineGroupsFunc();
        // TODO: get group detail
      }
    }
  };

  const favoriteGroup = async () => {
    setFavorite(!favorite);
    const params = {
      timelineGroupId,
    };
    if (!favorite) {
      const response = await deleteTimelineFavoriteGroup(params);
      console.log(
        '===========deleteTimelineFavoriteGroup========>>>>>>>>>>>>>>',
        response.status
      );
      if (response) {
        // TODO: get group detail
        getFavoriteTimelineGroupsFunc();
      }
    } else {
      const response = await addTimelineFavoriteGroup(params);
      console.log(
        '=========addTimelineFavoriteGroup==========>>>>>>>>>>>>>>',
        response.status
      );

      if (response) {
        getFavoriteTimelineGroupsFunc();
        // TODO: get group detail
      }
    }
  };

  const setReload = () => {
    getTimelineGroupsFunc();
  };

  useEffect(() => {
    getTimelineGroupsFunc();
  }, []);

  useEffect(() => {
    getTimelineGroupsFunc();
  }, [isFocused]);

  /**
   * get data timeline
   */
  useEffect(() => {
    console.log('==========>route?.params?.data>', route?.params?.data);
    getTimelineGroupsOfEmployeeFunc();
    getUserTimelinesFunc();
    getFavoriteTimelineGroupsFunc();
  }, []);

  const checkLengthIcon = (invites: any) => {
    const dataIcon = invites.filter((el: any) => el.status === 1);
    if (dataIcon.length > 4) {
      const arr = dataIcon.slice(0, 3);
      return (
        <FlatList
          data={arr}
          // listKey={(index) => `${index.toString()}`}
          numColumns={arr.length}
          renderItem={(item: any) => (
            <View style={styles.iconMember}>
              <Image
                source={{ uri: item.inviteImagePath }}
                style={styles.iconMember}
              />
            </View>
          )}
        />
      );
    }
    if (dataIcon.length < 4 || dataIcon.length === 4) {
      return dataIcon.map((data: any, index: any) => {
        return (
          <View style={styles.iconMember} key={index}>
            <Image
              source={{ uri: data.inviteImagePath }}
              style={styles.iconMember}
            />
          </View>
        );
      });
    }
  };

  const renderHeader = () => {
    return (
      <ImageBackground source={{ uri: imagePath }} style={styles.bgImg}>
        <View style={styles.viewBgImg}>
          <ImageBackground
            source={{ uri: imagePath }}
            style={styles.channelImg}
            imageStyle={styles.border}
          >
            <View style={styles.viewGroupName}>
              <Text style={styles.txtChannel} numberOfLines={1}>
                {timelineGroupName}
              </Text>
            </View>
          </ImageBackground>
          <View style={styles.content}>
            <Text style={styles.txtGroupName} numberOfLines={1}>
              {timelineGroupName}
            </Text>
            <Text style={styles.txt} numberOfLines={3}>
              {comment}
            </Text>
            <View style={[CommonStyles.row, styles.member]}>
              {checkLengthIcon(invites)}
              {invites.filter((el: any) => el.status === 1).length > 4 && (
                <TouchableOpacity style={styles.iconMember}>
                  <Text style={{ color: '#fff' }}>
                    +{invites.filter((el: any) => el.status === 1).length - 4}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => checkOwner()}
                style={styles.iconBusiness}
              >
                <Icon name="business" style={styles.iconBusiness} />
              </TouchableOpacity>
              {user === DUMMY_USER_OWNER && (
                <TouchableOpacity onPress={() => setAddMemeber(!addMemeber)}>
                  <Icon name="addIc" style={styles.iconMember} />
                </TouchableOpacity>
              )}
            </View>
            {/* check */}
            {user === DUMMY_USER_OWNER || user === DUMMY_USER_OWNER_REQUEST ? (
              <View style={[CommonStyles.row, styles.member]}>
                <TouchableOpacity onPress={() => handleFavoriteGroup()}>
                  <Icon
                    name={isFavorite ? 'startIc' : 'starIc'}
                    style={styles.start}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // TODO: check id
                  onPress={() =>
                    navigation.navigate('register-group-chanel', {
                      timelineGroupId,
                    })
                  }
                >
                  <Icon name="edit" style={styles.start} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => modalConfirm(!showConfirm)}>
                  <Icon
                    name="erase"
                    style={styles.start}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>
            ) : null}
            {user === DUMMY_USER_MEMBER && (
              <View style={[CommonStyles.rowInline]}>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setShowModal(!modal)}
                >
                  <Text style={styles.txtBtn}>
                    {translate(messages.cancel)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => favoriteGroup()}>
                  <Icon
                    name={favorite ? 'startIc' : 'starIc'}
                    style={{ height: 30, width: 30 }}
                  />
                </TouchableOpacity>
              </View>
            )}
            {user === DUMMY_USER && (
              <View style={[CommonStyles.rowInline]}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: request
                        ? theme.colors.yellowDeep
                        : '#fff',
                    },
                  ]}
                  onPress={() => handleAddGroup(timelineGroupId, invites)}
                >
                  <Text style={styles.txtBtn}>
                    {translate(messages.requestJoin)}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBarMenu name={translate(messages.title)} hasBackButton />
      <View style={styles.viewSearch}>
        <View style={styles.viewTxtInput}>
          <Icon name="search" style={styles.icon} />
          <TextInput
            style={styles.txtInput}
            placeholder={translate(messages.placeholder)}
            onChangeText={(txt) => setTxtSearch(txt)}
            // onFocus={() => setVisibleSuggestion(true)}
            // onBlur={() => setVisibleSuggestion(false)}
            value={txtSearch}
          />
        </View>
        <TouchableOpacity hitSlop={CommonStyles.hitSlop} style={styles.btnDown}>
          <Icon name="descending" />
        </TouchableOpacity>
      </View>
      {user === DUMMY_USER ? (
        <View style={styles.viewTop}>
          <View style={styles.viewTxtTop}>
            {!request ? (
              <Text style={styles.txt}>
                {translate(messages.memberMessage)}
              </Text>
            ) : (
              <Text style={styles.txt}>
                {translate(messages.userNotRequest)}
              </Text>
            )}
            {/* <Text style={styles.txt}>{translate(messages.memberMessage)}</Text> */}
          </View>
        </View>
      ) : null}
      {user === DUMMY_USER_OWNER_REQUEST ? (
        <View style={styles.viewTop}>
          <View style={styles.requestTxtTop}>
            <Text style={styles.txt}>
              {translate(messages.messagesRequest)}
            </Text>
            <TouchableOpacity
              onPress={() => checkOwner()}
            >
              <Text style={[styles.txt, styles.confirmRequest]}>
                {translate(messages.confirmRequest)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
      <FlatList
        data={dataTimelines}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item: GetUserTimelinesDataDataResponse) => {
          return item.timelineId.toString();
        }}
        renderItem={({ item }) => {
          return (
            <Item
              data={item}
              reactions={item.reactions}
              onPressDelete={() => setVisibleModalCancel(true)}
              onPressListReaction={() => setVisibleModalCancel(true)}
              onPressModalDetail={() => setVisibleModalCancel(true)}
            />
          );
        }}
      />

      <TouchableOpacity
        onPress={() => moveNavigateShare()}
        style={TimelineListStyle.btnFloat}
      >
        <Image
          source={require('../../../../assets/icons/iconFloat.png')}
          style={TimelineListStyle.btnFloatIcon}
          resizeMethod="resize"
        />
      </TouchableOpacity>
      <View style={TimelineListStyle.create}>
        <Text style={TimelineListStyle.txtCreate}>
          {translate(messages2.destination)}
        </Text>
        <TouchableOpacity
          onPress={() => moveNavigateShare()}
        >
          <Image
            resizeMode="contain"
            source={require('../../../../assets/icons/detail.png')}
          />
        </TouchableOpacity>
      </View>
      <View style={TimelineListStyle.create}>
        <TextInput
          placeholder={translate(messages2.placeholderCreateTimeline)}
          placeholderTextColor={theme.colors.gray}
          value={content}
          onChangeText={(txt) => setContent(txt)}
          style={TimelineListStyle.inputCreate}
        />

        <TouchableOpacity
          onPress={() => setContent('')}
          style={
            content
              ? TimelineListStyle.createTimelineIn
              : TimelineListStyle.createTimeline
          }
        >
          <Text
            style={
              content
                ? TimelineListStyle.txtCreateTimelineIn
                : TimelineListStyle.txtCreateTimeline
            }
          >
            {translate(messages2.buttonCreateTimeline)}
          </Text>
        </TouchableOpacity>
      </View>
      <TimelineModalEmployeeSuggestion
        onConfirm={() => {
          setAddMemeber(false);
          setReload();
        }}
        timelineGroupId={timelineGroupId}
        visible={addMemeber}
      />

      <ModalCardInfo
        visible={showModal}
        closeModal={() => setModal(!showModal)}
        inviteName={DUMMY_INVITE_NAME}
      />
      <ModalPageGroup
        visible={showConfirm}
        closeModal={() => modalConfirm(!showConfirm)}
        content={translate(messages.contentDeleteGroup)}
        title={translate(messages.titleDeleteGroup)}
        onPressConfirm={() => onHandleDeleteGroup()}
      />
      <ModalPageGroup
        visible={modal}
        closeModal={() => setShowModal(!modal)}
        content={translate(messages.contentLeave)}
        title={translate(messages.titleLeave)}
        onPressConfirm={() => onLeaveGroup()}
      />
      <ModalCancel
        visible={visibleModalCancel}
        closeModal={() => setVisibleModalCancel(false)}
        onPress={() => setVisibleModalCancel(false)}
        titleModal="A"
        contentModal="A"
        textBtnLeft="A"
        textBtnRight="A"
      />
    </SafeAreaView>
  );
};
