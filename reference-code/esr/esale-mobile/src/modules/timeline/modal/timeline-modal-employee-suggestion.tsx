import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  // Alert as ShowError,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { appImages, theme } from "../../../config/constants";
import { CommonStyles } from "../../../shared/common-style";
import { translate } from "../../../config/i18n";
import { TimelineModalSuggestionStyles } from "./timeline-modal-style";
import {
  AddMemberToTimelineGroupResponse,
  addMemberToTimelineGroup,
  getEmployeesSuggestion,
  getTimelineGroups,
} from "../timeline-repository";
import { messages } from "./timeline-modal-messages";
import { Icon } from "../../../shared/components/icon";
import { timelineActions } from "../timeline-reducer";
import { getEmployeeSuggestionSelector } from "../timeline-selector";
import { handleEmptyString } from "../../../shared/util/app-utils";
import {
  AuthorityEnum,
  InviteType,
  JoinGroupStatus,
} from "../../../config/constants/enum";
import { Alert } from "../../../shared/components/alert";

const styles = TimelineModalSuggestionStyles;

interface ModalEmployeeSuggestionProps {
  visible: boolean;
  onConfirm: () => void;
  timelineGroupId: number;
}

export const TimelineModalEmployeeSuggestion = ({
  visible = false,
  onConfirm = () => {},
  timelineGroupId,
}: ModalEmployeeSuggestionProps) => {
  const dispatch = useDispatch();
  const dataSelector = useSelector(getEmployeeSuggestionSelector);
  console.log(
    "dataSelectordataSelectordataSelectordataSelectordataSelector",
    dataSelector
  );
  const [textSearch, setTextSearch] = useState("");
  const [textNotification, setTextNotification] = useState("");
  const [dataSelected, setDataSelected] = useState<any>([]);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [dataGetTimelineGroup, setDataGetTimelineGroup] = useState<any>({});
  console.log(
    "=====dataGetTimelineGroup====>>>>>>dataGetTimelineGroup",
    dataGetTimelineGroup
  );

  /**
   * toggle modal sendMail
   * @param response
   */

  const toggleModalSendMail = () => {
    setModalSendMail(!modalSendMail);
  };

  /**
   * call api get Timeline Groups
   */
  const callApiGetTimelineGroups = () => {
    async function callApi() {
      const params = {
        timelineGroupIds: [timelineGroupId],
        sortType: 1,
      };
      const response = await getTimelineGroups(params, {});
      if (response?.status === 200 && !!response?.data?.timelineGroup) {
        setDataGetTimelineGroup(response.data.timelineGroup[0]);
      }
    }
    callApi();
  };

  /**
   * call api getEmployeesSuggestion
   * @param param
   */
  const getEmployeesSuggestionFunc = async () => {
    const params = {
      keyWords: textSearch,
      searchType: 2,
      offSet: 0,
    };
    const response = await getEmployeesSuggestion(params);
    if (response?.status === 200 && !!response?.data) {
      dispatch(timelineActions.getEmployeeSuggestion(response.data.employees));
    }
  };

  /**
   * call api addMemberToTimelineGroupFunc
   * @param param
   */

  const addMemberToTimelineGroupFunc = async () => {
    const timelineGroupInvites = dataSelected.map((el: any) => {
      return {
        inviteId: el.employeeId,
        inviteType: InviteType.EMPLOYEE,
        timelineGroupId,
        status: JoinGroupStatus.JOINED,
        authority: AuthorityEnum.MEMBER,
      };
    });
    const params: any = {
      timelineGroupInvites,
      content: textNotification,
    };
    const data = await addMemberToTimelineGroup(params);
    console.log(
      "==========================================================================================================================>>>",
      data
    );
    onConfirm();
    setTextSearch("");
    setDataSelected([]);
    toggleModalSendMail();
    // }
  };

  /**
   * call api search suggestion
   * @param text
   */

  // let callApiSearch: any;

  // const onSearch = (text: string) => {
  //   setTextSearch(text);
  //   // if (callApiSearch) {
  //   //   clearTimeout(callApiSearch);
  //   // }
  //   // callApiSearch = setTimeout(() => {
  //   getEmployeesSuggestionFunc(text);
  //   // }, 500);
  // };

  useEffect(() => {
    getEmployeesSuggestionFunc();
  }, [textSearch]);

  useEffect(() => {
    callApiGetTimelineGroups();
  }, []);

  /**
   * on press employee
   * @param item
   */
  const toggleSelected = (item: any) => {
    const dataInvites = dataGetTimelineGroup.invites;
    let newData = [...dataSelected];
    if (dataInvites?.some((el: any) => el.inviteId === item.employeeId)) {
      alert("Already in the group!");
    } else if (newData.some((el) => el.employeeId === item.employeeId)) {
      newData = dataSelected.filter(
        (el: any) => el.employeeId !== item.employeeId
      );
    } else {
      newData = [...newData, item];
    }
    setDataSelected(newData);
  };

  const pressBtnConfirm = () => {
    if (modalSendMail) {
      addMemberToTimelineGroupFunc();
    } else {
      toggleModalSendMail();
    }
  };

  const renderSuggestion = () => {
    return (
      <>
        <FlatList
          horizontal
          data={dataSelected}
          keyExtractor={(item: any) => item.employeeId.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.viewItemTop}>
                <Image
                  source={
                    item?.employeeIcon?.fileUrl
                      ? {
                          uri: item?.employeeIcon?.fileUrl,
                        }
                      : appImages.icUser
                  }
                  style={styles.image}
                />
                <Text numberOfLines={1} style={styles.txtTop}>
                  {`${handleEmptyString(item.employeeName)} `}
                </Text>
                <TouchableOpacity
                  hitSlop={CommonStyles.hitSlop}
                  style={styles.btnCloseItem}
                  onPress={() => {
                    toggleSelected(item);
                  }}
                >
                  <Ionicons
                    name="ios-close"
                    color={theme.colors.gray}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
        />
        <View style={[styles.viewInput]}>
          <View style={[styles.rowAlignItemCenter]}>
            <Icon name="search" style={styles.icon} />
            <TextInput
              style={styles.txtInput}
              placeholder={translate(messages.searchJoiner)}
              value={textSearch}
              onChangeText={(text) => {
                setTextSearch(text);
              }}
            />
          </View>
          {textSearch ? (
            <TouchableOpacity
              style={styles.viewClose}
              hitSlop={CommonStyles.hitSlop}
              onPress={() => setTextSearch("")}
            >
              <Ionicons
                name="ios-close"
                color={theme.colors.white200}
                size={20}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.devider} />
        <FlatList
          data={dataSelector}
          style={styles.flatlistHeight}
          ListEmptyComponent={() => null}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item: any) => item.employeeId.toString()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.btnItemEmp}
                onPress={() => {
                  toggleSelected(item);
                }}
              >
                <View style={[CommonStyles.row]}>
                  <Image
                    source={
                      item?.employeeIcon?.fileUrl
                        ? {
                            uri: item?.employeeIcon?.fileUrl,
                          }
                        : appImages.icUser
                    }
                    resizeMode="contain"
                    style={styles.image}
                  />
                  {item.employeeDepartments.length > 0 ? (
                    <View>
                      <Text style={styles.txtDepartment}>
                        {`${handleEmptyString(
                          item.employeeDepartments[0].departmentName
                        )}`}
                      </Text>
                      <Text style={styles.txt}>
                        {`${handleEmptyString(item.employeeName)} `}
                        {`${handleEmptyString(
                          item.employeeDepartments[0].positionName
                        )}`}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Text style={styles.txtDepartment}>
                        {item.employeeDepartments.employeeSurnameKana}
                      </Text>
                    </View>
                  )}
                </View>
                <View>
                  {dataSelected.some(
                    (el: any) => el.employeeId === item.employeeId
                  ) ? (
                    <Icon name="checkActive" style={styles.unSelected} />
                  ) : (
                    <View style={styles.unSelected} />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={() => {
            return <View style={styles.padding} />;
          }}
          onEndReached={() => {
            getEmployeesSuggestionFunc();
          }}
        />
      </>
    );
  };

  const renderSendMail = () => {
    return (
      <>
        <View style={styles.viewSendMail}>
          <Text style={styles.txt}>{translate(messages.contentNoti)}</Text>
          <TextInput
            style={styles.txt}
            placeholder={translate(messages.enterContent)}
            onChangeText={(text) => {
              setTextNotification(text);
            }}
          />
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <View style={styles.viewTop}>
          <View style={styles.view} />
        </View>
        <View style={styles.viewContent}>
          {modalSendMail ? renderSendMail() : renderSuggestion()}
        </View>
        <View style={styles.viewBtn}>
          {modalSendMail && (
            <TouchableOpacity
              style={[styles.btnStyle]}
              onPress={toggleModalSendMail}
            >
              <Text style={styles.txtBtn}>{translate(messages.back)}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.btnStyle,
              !_.isEmpty(dataSelected) && styles.btnActive,
            ]}
            onPress={pressBtnConfirm}
            disabled={_.isEmpty(dataSelected)}
          >
            <Text
              style={[
                styles.txtBtn,
                !_.isEmpty(dataSelected) && styles.txtBtnActive,
              ]}
            >
              {translate(messages.confirm)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
