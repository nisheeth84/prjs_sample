import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { messages } from './timeline-group-participant-messages';
import { translate } from '../../../config/i18n';
import { TimelineParticipantStyles } from './timeline-group-participant-style';
import { ModalParticipant } from './timeline-group-participant-modal';
import { Header } from '../../../shared/components/header';
import { ModalCardInfo } from '../../../shared/components/modal-card-info';
import { timelineActions } from '../timeline-reducer';
import { dataGetTimelineGroupsSelector } from '../timeline-selector';
import { ItemMember } from './timeline-group-item-member';
import { TimelineModalEmployeeSuggestion } from '../modal/timeline-modal-employee-suggestion';
import { ModalPermissions } from './time-group-permissions-modal';
import {
  deleteMemberOfTimelineGroup,
  getTimelineGroups,
  getTimelineGroupsOfEmployee,
  updateMemberOfTimelineGroup,
} from '../timeline-repository';
import {
  AuthorityEnum,
  JoinGroupStatus,
  TimelineGroupParticipantModal,
  // UpdateMemberGroupType,
} from '../../../config/constants/enum';
import { getFirstItem } from '../../../shared/util/app-utils';
import { TimelineGroupParticipantRouteProp } from '../../../config/constants/root-stack-param-list';
import { authorizationSelector } from '../../login/authorization/authorization-selector';

const styles = TimelineParticipantStyles;

interface ScreenModal {
  isOpen: boolean;
  type: TimelineGroupParticipantModal;
}

/**
 * Component show timeline group participant screen
 */
export function TimelineGroupParticipantScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute<TimelineGroupParticipantRouteProp>();
  const dataTimelineGroup = useSelector(dataGetTimelineGroupsSelector);
  const authSelector = useSelector(authorizationSelector);
  // check tab member
  const [tab, setTab] = useState(true);
  // check owner
  const [userType, setUserType] = useState(AuthorityEnum.OWNER);
  // check user info
  const [userInfo, setUserInfo] = useState<any>(-1);
  // current index check item change permission
  const [currentIndex, setCurrentIndex] = useState(0);
  // list participating
  const [dataParticipating, setDataParticipating] = useState<Array<any>>([]);
  // list member
  const [dataMember, setDataMember] = useState<Array<any>>([]);
  // reload
  const [reload, setReload] = useState<boolean>(false);

  const [timelineGroupModal, handleToggleModal] = useState<ScreenModal>({
    isOpen: false,
    type: TimelineGroupParticipantModal.TOOLTIP_EMPLOYEE,
  });

  // const dataGroupEmployee: Array<any> =
  //   useSelector(dataGetTimelineGroupsOfEmployeeSelector) || [];

  const [dataGroupEmployee, setDataGroupEmployee] = useState<Array<any>>([]);

  const getTimelineGroupsOfEmployeeFunc = async () => {
    const timelineGroupId = route?.params?.timelineGroupId;
    const params = {
      // employeeId: 1,
      timelineGroupId,
    };
    const dataTimelineGroupsOfEmployee = await getTimelineGroupsOfEmployee(
      params
    );
    if (dataTimelineGroupsOfEmployee.status === 200) {
      setDataGroupEmployee(dataTimelineGroupsOfEmployee.data.timelineGroup);
      // dispatch(
      //   timelineActions.getTimelineGroupsOfEmployee(
      //     dataTimelineGroupsOfEmployee.data
      //   )
      // );
      // handleErrorGetTimelineGroupsOfEmployee(data);
    }
  };

  useEffect(() => {
    getTimelineGroupsOfEmployeeFunc();
    if (dataGroupEmployee.length === 0) {
      setUserType(AuthorityEnum.MEMBER);
    } else {
      if (dataGroupEmployee[0].status === 1) {
        if (dataGroupEmployee[0].authority === 1) {
          setUserType(AuthorityEnum.OWNER);
        }
        if (dataGroupEmployee[0].authority === 2) {
          setUserType(AuthorityEnum.MEMBER);
        }
      }
      if (dataGroupEmployee[0].status === null) {
        setUserType(AuthorityEnum.MEMBER);
      }
    }
  }, [dataGroupEmployee]);
  /**
   * close modal
   */
  const closeModal = () => {
    handleToggleModal({
      isOpen: false,
      type: timelineGroupModal.type,
    });
  };

  /**
   * open modal
   */
  const openModal = (type: TimelineGroupParticipantModal) => {
    handleToggleModal({
      isOpen: true,
      type,
    });
  };

  /**
   * render modal
   */
  const renderModal = () => {
    switch (timelineGroupModal.type) {
      case TimelineGroupParticipantModal.AUTHORITY:
        return (
          <ModalPermissions
            member={() => {
              checkAndChangeAuthority(AuthorityEnum.MEMBER);
            }}
            owner={() => {
              checkAndChangeAuthority(AuthorityEnum.OWNER);
            }}
            visible={timelineGroupModal.isOpen}
            closeModal={() => {
              closeModal();
            }}
          />
        );
      case TimelineGroupParticipantModal.ERROR_CHANGE:
        return (
          <ModalParticipant
            visible={timelineGroupModal.isOpen}
            closeModal={() => {
              closeModal();
            }}
            content={translate(messages.contentErr)}
            errBtn={false}
          />
        );
      case TimelineGroupParticipantModal.OWNER_TO_MEMBER:
        return (
          <ModalParticipant
            visible={timelineGroupModal.isOpen}
            closeModal={() => {
              closeModal();
            }}
            pressConfirmChange={() => {
              updateAuthority(AuthorityEnum.MEMBER);
            }}
            content={translate(messages.contentModal)}
            errBtn
          />
        );
      case TimelineGroupParticipantModal.TOOLTIP_EMPLOYEE:
        return (
          <ModalCardInfo
            visible={timelineGroupModal.isOpen}
            closeModal={() => {
              closeModal();
            }}
            inviteName={userInfo.inviteName}
          />
        );
      case TimelineGroupParticipantModal.SUGGESTION:
        return (
          <TimelineModalEmployeeSuggestion
            onConfirm={() => {
              closeModal();
              setReload(!reload);
            }}
            timelineGroupId={route?.params?.timelineGroupId}
            visible={timelineGroupModal.isOpen}
          />
        );
      default:
    }
  };

  /**
   * call api get Timeline Groups
   */
  const callApiGetTimelineGroups = () => {
    async function callApi() {
      const params = {
        timelineGroupIds: null,
        sortType: 1,
      };
      const response = await getTimelineGroups(params, {});
      if (response?.status === 200 && !!response?.data?.timelineGroup) {
        dispatch(
          timelineActions.getTimelineGroups({
            timelineGroup: response.data.timelineGroup,
          })
        );
      }
    }
    callApi();
  };

  /**
   * call api get Timeline Groups Of Employee
   */
  useEffect(() => {
    async function callApiGetTimelineGroupsOfEmployee() {
      const params = {
        timelineGroupId: route?.params?.timelineGroupId,
      };
      const response = await getTimelineGroupsOfEmployee(params, {});
      if (response?.status === 200 && response?.data?.timelineGroup) {
        const timelineGroup = getFirstItem(response.data.timelineGroup);
        if (
          timelineGroup.status === JoinGroupStatus.JOINED &&
          timelineGroup.authority === AuthorityEnum.OWNER
        ) {
          setUserType(AuthorityEnum.OWNER);
        } else {
          setUserType(AuthorityEnum.MEMBER);
        }
        callApiGetTimelineGroups();
      }
    }
    callApiGetTimelineGroupsOfEmployee();
  }, [route?.params?.timelineGroupId, reload]);

  /**
   *  set data tab
   */
  useEffect(() => {
    const dataTimeline = dataTimelineGroup.filter(
      (el: any) => el.timelineGroupId === route?.params?.timelineGroupId
    );
    const newDataParticipating = dataTimeline[0].invites.filter(
      (el) => el.status === JoinGroupStatus.JOINED
    );
    setDataParticipating(newDataParticipating);
    const newDataMember = dataTimeline[0].invites.filter(
      (el) => el.status === JoinGroupStatus.REQUEST
    );
    setDataMember(newDataMember);
  }, [dataTimelineGroup]);

  /**
   * show modal user, group info
   * @param info
   */
  const onShowUserInfo = (info: any) => {
    setUserInfo(info);
    openModal(TimelineGroupParticipantModal.TOOLTIP_EMPLOYEE);
  };

  /**
   * update member
   * @param item
   */
  const callApiUpdateMember = async (
    // idx: any,
    item: any,
    // type: UpdateMemberGroupType
  ) => {
    const params = {
      timelineGroupId: route?.params?.timelineGroupId,
      inviteId: item.inviteId,
      inviteType: item.inviteType,
      status: JoinGroupStatus.JOINED,
      authority: item.authority,
    };
    const response = await updateMemberOfTimelineGroup(params, {});
    if (response?.status === 200 && !!response?.data?.timelineGroupId) {
      // const arrParticipating = _.cloneDeep(dataParticipating);
      // switch (type) {
      //   case UpdateMemberGroupType.UPDATE_PERMISSION:
      //     closeModal();
      //     arrParticipating[currentIndex].authority = item.authority;
      //     setDataParticipating(arrParticipating);
      //     break;
      //   case UpdateMemberGroupType.APPROVAL:
      //     const arrMember = _.cloneDeep(dataMember);
      //     const approvalItem = _.cloneDeep(arrMember[idx]);
      //     approvalItem.status = JoinGroupStatus.JOINED;
      //     arrParticipating.push(approvalItem);
      //     arrMember.splice(idx, 1);
      //     setDataMember(arrMember);
      //     setDataParticipating(arrParticipating);
      //     break;
      //   default:
      //     break;
      // }
      // setReload(!reload);
      getTimelineGroupsOfEmployeeFunc();
      callApiGetTimelineGroups();
    }
  };

  /**
   * delete member
   * @param item
   */
  const deleteMember = async (item: any) => {
    const params = {
      timelineGroupId: route?.params?.timelineGroupId,
      inviteId: item.inviteId,
      inviteType: item.inviteType,
    };
    const response = await deleteMemberOfTimelineGroup(params, {});
    if (response?.status === 200 && !!response?.data) {
      // if (isJoined) {
      //   const arr1 = _.cloneDeep(dataParticipating);
      //   arr1.splice(idx, 1);
      //   setDataParticipating(arr1);
      // } else {
      //   const arr1 = _.cloneDeep(dataMember);
      //   arr1.splice(idx, 1);
      //   setDataMember(arr1);
      // }
      getTimelineGroupsOfEmployeeFunc();
      callApiGetTimelineGroups();
    }
  };

  /**
   * check sole owner of list
   */
  const checkSoleOwner = () => {
    const ownerList = dataParticipating.filter(
      (element) => Number(element.authority) === AuthorityEnum.OWNER
    );
    // return ownerList?.length > 1 ? false : true;
    return ownerList?.length > 1 ;

  };

  /*
   * update authority
   */
  const updateAuthority = (authority: number) => {
    const item = _.cloneDeep(dataParticipating[currentIndex]);
    item.authority = authority;
    callApiUpdateMember(
      // currentIndex,
      item
      // UpdateMemberGroupType.UPDATE_PERMISSION
    );
  };

  /**
   * check owner list and update authority
   */
  const checkAndChangeAuthority = (authority: number) => {
    if (
      authority === AuthorityEnum.MEMBER &&
      authSelector.employeeId === dataParticipating[currentIndex].inviteId
    ) {
      if (checkSoleOwner()) {
        openModal(TimelineGroupParticipantModal.ERROR_CHANGE);
      } else {
        openModal(TimelineGroupParticipantModal.OWNER_TO_MEMBER);
      }
    } else {
      updateAuthority(authority);
    }
  };

  /**
   * show modal permissions
   */
  const setPermissions = (index: any) => {
    openModal(TimelineGroupParticipantModal.AUTHORITY);
    setCurrentIndex(index);
  };

  /**
   * render item tab member
   * @param active
   * @param requestNumber
   * @param title
   */
  const renderTab = (active: boolean, requestNumber: number, title: string) => {
    return (
      <TouchableOpacity
        style={active ? styles.tabMemberOff : styles.tabMemberOn}
        onPress={() => setTab(!tab)}
      >
        <Text style={!active ? styles.txtTabOff : styles.txtTabOn}>
          {`${title}(${requestNumber})`}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={translate(messages.title)}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <View style={styles.tab}>
          {renderTab(
            tab,
            dataMember.length,
            translate(messages.requestingParticipation)
          )}
          {renderTab(
            !tab,
            dataParticipating.length,
            translate(messages.participating)
          )}
        </View>
        {userType === AuthorityEnum.OWNER && !tab && (
          <View style={styles.viewBtn}>
            <TouchableOpacity
              style={styles.btnAdd}
              onPress={() => {
                openModal(TimelineGroupParticipantModal.SUGGESTION);
              }}
            >
              <Text style={styles.txtAdd}>
                {translate(messages.addParticipants)}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={tab ? dataMember : dataParticipating}
          renderItem={({ item, index }) => (
            <ItemMember
              item={item}
              isMemberTab={tab}
              onApproval={() => {
                callApiUpdateMember(
                  // index,
                  item,
                  // UpdateMemberGroupType.APPROVAL
                );
              }}
              onRefusal={() => {
                deleteMember(item);
              }}
              onPressIcon={(data: any) => onShowUserInfo(data)}
              setPermissions={() => {
                setPermissions(index);
              }}
              removeMember={() => {
                deleteMember(item);
              }}
              userType={userType}
            />
          )}
        />
      </View>
      {renderModal()}
    </SafeAreaView>
  );
}
