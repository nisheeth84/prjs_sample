/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Text,
  TextInput,
  // TouchableHighlight,
  TouchableOpacity,
  View,
  // Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { AppBarProducts } from '../../../shared/components/appbar/appbar-products';
import { messages } from './timeline-list-group-messages';
import { translate } from '../../../config/i18n';
import { TimelineListGroupStyles } from './timeline-list-group-style';
import { Icon } from '../../../shared/components/icon';
import { CommonStyles } from '../../../shared/common-style';
import { TimelineListGroupModalSuggestion } from './timeline-list-group-modal-suggestion';
import {
  GetFavoriteTimelineGroupsResponse,
  SuggestionTimelineGroupNameDataDataResponse,
  addRequestToTimelineGroup,
  addTimelineFavoriteGroup,
  deleteMemberOfTimelineGroup,
  deleteTimelineFavoriteGroup,
  getFavoriteTimelineGroups,
  getTimelineGroups,
  getTimelineGroupsOfEmployee,
  suggestTimelineGroupName,
} from '../timeline-repository';
import {
  dataGetFavoriteTimelineGroupsSelector,
  // dataGetTimelineGroupsOfEmployeeSelector,
  dataGetTimelineGroupsSelector,
} from '../timeline-selector';
import { AppbarCommon } from '../../../shared/components/appbar/appbar-common';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { timelineActions } from '../timeline-reducer';
import { EnumFmDate } from '../../../config/constants/enum-fm-date';
import { sortDate } from '../../../config/constants/enum';
import { ListEmptyComponent } from '../../../shared/components/list-empty/list-empty';
import { ModalListMember } from './modal-list-member';
import { theme } from '../../../config/constants';

const styles = TimelineListGroupStyles;

/**
 * Component for show list of products
 * @param props
 */

export function TimelineListGroupScreen(props: any) {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const employeeData: any = useSelector(authorizationSelector);
  const dispatch = useDispatch();
  const data: Array<any> = useSelector(dataGetTimelineGroupsSelector) || [];
  // const dataGroupEmployee: Array<any> =
  //   useSelector(dataGetTimelineGroupsOfEmployeeSelector) || [];
  const dataGetFavorite: any =
    useSelector(dataGetFavoriteTimelineGroupsSelector) || [];
  const [txtSearch, setTxtSearch] = useState(TEXT_EMPTY);
  const [visibleSuggestion, setVisibleSuggestion] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modal, setModal] = useState(false);
  const [sort, setSort] = useState(sortDate.createdDate);
  // const [array, setArray] = useState();
  const [active, setActive] = useState(false);
  const [dataMember, setDataMember] = useState([]);
  // const [card, setCard] = useState({
  //   inviteId: TEXT_EMPTY,
  //   inviteType: TEXT_EMPTY,
  //   inviteName: TEXT_EMPTY,
  //   inviteImagePath: require("../../../../assets/icons/people.png"),
  //   status: TEXT_EMPTY,
  //   authority: TEXT_EMPTY,
  // });

  /**
   * call api getTimelineGroupsFunc
   */
  const getSuggestTimelineGroupName = async (timelineGroupName: string) => {
    const params = {
      timelineGroupName,
      searchType: 1,
    };
    const dataSuggest = await suggestTimelineGroupName(params);
    if (dataSuggest) {
      dispatch(timelineActions.suggestTimelineGroupName(dataSuggest.data));
    }
  };

  useEffect(() => {
    getSuggestTimelineGroupName(txtSearch);
  }, [txtSearch]);

  const getTimelineGroupsOfEmployeeFunc = async () => {
    const params = {
      // employeeId: 1,
      // timelineGroupId,
    };
    const dataTimelineGroupsOfEmployee = await getTimelineGroupsOfEmployee(
      params
    );
    if (dataTimelineGroupsOfEmployee) {
      dispatch(
        timelineActions.getTimelineGroupsOfEmployee(
          dataTimelineGroupsOfEmployee.data
        )
      );
      // handleErrorGetTimelineGroupsOfEmployee(data);
    }
  };

  /**
   * call api error
   */
  const handleErrorGetFavoriteTimelineGroups = (
    response: GetFavoriteTimelineGroupsResponse
  ) => {
    switch (response.status) {
      case 200:
        dispatch(
          timelineActions.getFavoriteTimelineGroups(
            response.data.timelineGroupIds
          )
        );
        break;
      case 500:
        break;
      default:
        break;
    }
  };
  /**
   * call api
   */
  const getFavoriteTimelineGroupsFunc = async () => {
    const params = {
      employeeId: employeeData.employeeId,
    };
    const dataFavoriteTimelineGroups = await getFavoriteTimelineGroups(params);
    if (dataFavoriteTimelineGroups) {
      handleErrorGetFavoriteTimelineGroups(dataFavoriteTimelineGroups);
    }
  };

  const addFavoriteTimelineGroup = async (timelineGroupId: number) => {
    const params = {
      timelineGroupId,
    };

    const response = await addTimelineFavoriteGroup(params);
    if (response) {
      getFavoriteTimelineGroupsFunc();
    }
  };
  /**
   * call api getTimelineGroupsFunc
   */
  const getTimelineGroupsFunc = async () => {
    const params = {
      timelineGroupIds: null,
      sortType: sort,
    };
    const dataListGroup = await getTimelineGroups(params);
    console.log('==aaaaaaaaaaa========>>', dataListGroup.status);
    if (dataListGroup) {
      dispatch(timelineActions.getTimelineGroups(dataListGroup.data));
    }
  };
  /**
   * set group
   * @param index
   */
  // const onGroup = (item: any) => {
  //   setUser("1");
  //   getTimelineGroupsFunc();
  //   getTimelineGroupsOfEmployeeFunc();
  //   // setTimeout(() => {
  //   //   navigation.navigate("timeline-page-group", { data: item });
  //   // }, 1500);
  // };
  const addRequestToGroup = async (item: any) => {
    const params = {
      timelineGroupInvite: {
        timelineGroupId: item.timelineGroupId,
      },
    };
    const response = await addRequestToTimelineGroup(params);
    if (response) {
      getTimelineGroupsFunc();
      getTimelineGroupsOfEmployeeFunc();
    }
  };

  const deleteMember = async (item: any, add: any) => {
    const params = {
      timelineGroupId: item.timelineGroupId,
      inviteId: add[0].inviteId,
      inviteType: add[0].inviteType,
    };
    const response = await deleteMemberOfTimelineGroup(params, {});
    if (response?.status === 200 && !!response?.data) {
      console.log(
        '1111111111111111111111111111111111111111111111',
        response.status
      );
      getTimelineGroupsFunc();
      getTimelineGroupsOfEmployeeFunc();
    }
  };

  const deleteFavoriteTimelineGroup = async (timelineGroupId: number) => {
    const params = {
      timelineGroupId,
    };
    const response = await deleteTimelineFavoriteGroup(params);
    if (response) {
      getFavoriteTimelineGroupsFunc();
    }
  };

  const onPressSuggestion = (
    item: SuggestionTimelineGroupNameDataDataResponse
  ) => {
    setVisibleSuggestion(false);
    setTxtSearch(TEXT_EMPTY);
    navigation.navigate('timeline-page-group', { data: item });
  };

  /**
   * close modal
   */
  const handleCloseModal = () => {
    setOpenModal(!openModal);
  };
  /**
   * close modal
   */
  const closeModal = () => {
    setModal(!modal);
  };
  /**
   * show Modal card
   * @param item
   */
  // const openModalCard = (item: any) => {
  //   setCard(item);
  // };

  // const checkGroup = (item: any) => {
  //   const groupEmployee = [...dataGroupEmployee].filter(
  //     (el) => el.id === item.id
  //   );
  //   if (groupEmployee.length === 0) {
  //     setUser("2");
  //   } else {
  //     if (groupEmployee[0].status === 1) {
  //       if (groupEmployee[0].authority === 1) {
  //         setUser("0");
  //       }
  //       if (groupEmployee[0].authority === 2) {
  //         setUser("1");
  //       }
  //     }
  //     if (groupEmployee[0].status === null) {
  //       setUser("2");
  //     }
  //   }
  // };

  const checkOwner = (item: any) => {
    navigation.navigate('timeline-participant-group', {
      // user: 1,
      timelineGroupId: item.timelineGroupId,
    });
    // // checkGroup(item);
    // if (user === "0") {
    //   navigation.navigate("timeline-participant-group", {
    //     // user: 1,
    //     timelineGroupId: item.timelineGroupId,
    //   });
    // }
    // if (user === "1" || user === "2") {
    //   navigation.navigate("timeline-participant-group", {
    //     // user: 2,
    //     timelineGroupId: item.timelineGroupId,
    //   });
    // }
  };

  useEffect(() => {
    getTimelineGroupsFunc();
  }, [props, isFocused]);

  useEffect(() => {
    getTimelineGroupsFunc();
  }, [sort]);

  useEffect(() => {
    getTimelineGroupsFunc();
    getFavoriteTimelineGroupsFunc();
    getTimelineGroupsOfEmployeeFunc();
  }, []);

  const checkLengthIcon = (invites: any, listKey: string) => {
    const dataIcon = invites.filter((el: any) => el.status === 1);
    if (dataIcon.length > 3) {
      const arr = dataIcon.slice(0, 3);
      return (
        <FlatList
          data={arr}
          listKey={listKey}
          numColumns={3}
          renderItem={(item: any) => (
            <TouchableOpacity
              style={styles.length}
              onPress={() =>
                navigation.navigate('detail-employee', {
                  employeeId: item.inviteId,
                })}
            >
              <Image
                source={{ uri: item.inviteImagePath }}
                style={styles.iconPeople}
              />
            </TouchableOpacity>
          )}
        />
      );
    }
    if (dataIcon.length < 3 || dataIcon.length === 3) {
      return dataIcon.map((data: any, index: any) => {
        return (
          <TouchableOpacity
            style={styles.length}
            key={index}
            onPress={() =>
              navigation.navigate('detail-employee', {
                employeeId: data.inviteId,
              })}
          >
            <Image
              source={{ uri: data.inviteImagePath }}
              style={styles.iconPeople}
            />
          </TouchableOpacity>
        );
      });
      // return (
      //   <FlatList
      //     data={invites}
      //     listKey={(index) => `${index.toString()}`}
      //     numColumns={invites.length}
      //     renderItem={(item: any) => (
      //       <View style={styles.length}>
      //         <Image source={item.inviteImagePath} style={styles.iconPeople} />
      //       </View>
      //     )}
      //   />
      // );
    }
  };
  const showListMember = (item: any) => {
    setOpenModal(true);
    setDataMember(item);
  };
  const checkMember = (item:any) => {
    const add = item.invites.filter(
      (el: any) => el.inviteId === employeeData.employeeId
    );
    if (add.length === 0) {
      return (
        <TouchableOpacity
          onPress={() => addRequestToGroup(item)}
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.white,
            },
          ]}
        >
          <Text>{translate(messages.participate)}</Text>
        </TouchableOpacity>
      );
    }
    if (add.length > 0) {
      if (add[0].inviteType === 2 && add[0].status === 1) {
        return (
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: theme.colors.gray,
              },
            ]}
          >
            <Text
              style={{
                color: theme.colors.black,
              }}
            >
              {translate(messages.participating)}
            </Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.yellowDeep,
              borderColor: theme.colors.white,
            },
          ]}
          onPress={() => deleteMember(item, add)}
        >
          <Text
            style={{
              color: theme.colors.black,
            }}
          >
            {translate(messages.participate)}
          </Text>
        </TouchableOpacity>
      );
    }
  };
  /**
   *
   * @param item render item group
   * @param index
   */
  const renderItem = (item: any, index: any) => {
    const dataIcon = item.invites.filter((el: any) => el.status === 1);
    return (
      <View style={styles.viewItem}>
        <ImageBackground
          imageStyle={{ borderTopLeftRadius: 17, borderTopRightRadius: 17 }}
          source={{ uri: item.imagePath }}
          style={[styles.headerItem, { backgroundColor: item.color }]}
        >
          {dataGetFavorite.some((el: any) => el === item.timelineGroupId) ? (
            <TouchableOpacity
              style={styles.viewStart}
              onPress={() => deleteFavoriteTimelineGroup(item.timelineGroupId)}
            >
              <Icon name="start" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.viewStart}
              onPress={() => addFavoriteTimelineGroup(item.timelineGroupId)}
            >
              <Icon name="unStart" />
            </TouchableOpacity>
          )}
          {/* </TouchableOpacity> */}
          <View
            // source={{ uri: item.imagePath }}
            style={styles.viewHeader}
          >
            {/* <Image source={{ uri: item.imagePath }} style={{ width: "100%" }} /> */}
            <Text numberOfLines={1}>{item.timelineGroupName}</Text>
          </View>
        </ImageBackground>
        <View style={styles.comment}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('timeline-page-group', { data: item })
            }
          >
            <Text numberOfLines={1}>{item.timelineGroupName}</Text>
          </TouchableOpacity>
          <Text>
            {sort === 1 ? '登録日:' : '投稿日:'}
            {sort === 1
              ? moment(item.createdDate).format(
                  EnumFmDate.YEAR_MONTH_DAY_NORMAL
                )
              : moment(item.changedDate).format(
                  EnumFmDate.YEAR_MONTH_DAY_NORMAL
                )}
          </Text>
          <View style={styles.people}>
            {checkLengthIcon(item.invites, `Icon_Key ${index}`)}
            {dataIcon.length === 4 ? (
              <TouchableOpacity
                style={styles.lengthMember}
                onPress={() => showListMember(item.invites)}
              >
                <Text style={styles.txt}>+{dataIcon.length - 3}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => checkOwner(item)}>
                <Icon name="business" style={styles.length} />
              </TouchableOpacity>
            )}
          </View>
          {checkMember(item)}
        </View>
      </View>
    );
  };
  const filterDateModal = (sort: number) => {
    setActive(!active);
    setSort(sort);
  };

  const filterDate = () => {
    closeModal();
  };
  return (
    <SafeAreaView style={styles.container}>
      <AppBarProducts name={translate(messages.title)} hasBackButton={false} />
      <View style={styles.viewSearch}>
        <View style={styles.viewTxtInput}>
          <Icon name="search" style={styles.icon} />
          <TextInput
            style={styles.txtInput}
            placeholder={translate(messages.placeholder)}
            onChangeText={(txt) => setTxtSearch(txt)}
            onFocus={() => setVisibleSuggestion(true)}
            onBlur={() => setVisibleSuggestion(false)}
            value={txtSearch}
          />
        </View>
        <TouchableOpacity
          hitSlop={CommonStyles.hitSlop}
          style={styles.btnDown}
          onPress={() => setModal(!modal)}
        >
          <Icon name="arrowDown" />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <FlatList
          data={data}
          numColumns={2}
          renderItem={({ item, index }) => renderItem(item, index)}
          keyExtractor={(item: any) => item.timelineGroupId.toString()}
          ListEmptyComponent={<ListEmptyComponent />}
        />
        <View style={styles.fab}>
          <TouchableOpacity
            onPress={() => navigation.navigate('register-group-chanel')}
          >
            <Icon name="fab" />
          </TouchableOpacity>
        </View>
      </View>
      <TimelineListGroupModalSuggestion
        visible={visibleSuggestion}
        txtSearch={txtSearch}
        onPressSuggestion={(item) => onPressSuggestion(item)}
      />
      <Modal
        visible={modal}
        animationType="fade"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modal}>
          <AppbarCommon
            handleLeftPress={closeModal}
            leftIcon="sortClose"
            title={translate(messages.titleModal)}
            buttonText={translate(messages.btnModal)}
            onPress={filterDate}
          />
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => filterDateModal(sortDate.createdDate)}
          >
            <View style={styles.viewTxt}>
              <Text style={styles.text}>
                {translate(messages.lastPostDateOrder)}
              </Text>
            </View>
            <View style={styles.viewIcon}>
              {!active ? (
                <Icon name="checkActive" style={styles.check} />
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnClose}
            onPress={() => filterDateModal(sortDate.changedDate)}
          >
            <View style={styles.viewTxt}>
              <Text style={styles.text}>
                {translate(messages.registrationDate)}
              </Text>
            </View>
            <View style={styles.viewIcon}>
              {!active ? null : (
                <Icon name="checkActive" style={styles.check} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      {/*  */}
      <ModalListMember
        data={dataMember}
        visible={openModal}
        closeModal={handleCloseModal}
      />
    </SafeAreaView>
  );
}
