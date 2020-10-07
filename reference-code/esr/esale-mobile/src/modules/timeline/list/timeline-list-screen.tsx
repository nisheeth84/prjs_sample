import React, { useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  // FlatList,
  // KeyboardAvoidingView,
  // Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modalbox";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useDispatch, useSelector } from "react-redux";
import { InputWithIcon } from "../../../shared/components/search-input-with-icon/search-input";
import { Item } from "../../../shared/components/timeline/timeline-item-screen";
import { TimelineListStyle } from "./timeline-list-styles";
import { messages } from "../timeline-messages";
import { translate } from "../../../config/i18n";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { PersonReactionListScreen } from "../person-reaction-list/person-reaction-list-screen";
import { ModalBoxStyles } from "../../../shared/common-style";
import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { DUMMY_REACTION } from "../person-reaction-list/person-reaction-list-dummy-data";
// import {
//   TIMELINE_ARRAY,
//   TIMELINE_LIST,
// } from "../../../shared/components/timeline/timeline-item-dummy";
import { ModalCancel } from "../../../shared/components/modal-cancel/index";
import {
  createTimeline,
  deleteTimeline,
  getTimelineFilters,
  createCommentAndReply,
} from "../timeline-repository";

import { getTimelineById } from "../modal-detail/modal-detail-repository";


import { ItemCreateTimeline } from "./timeline-list-item-create";
import { ItemCreateComment } from "./timeline-list-item-create-comment";
import { ModalShareTimeline } from "./timeline-share";
import { ModalCommon } from "../../../shared/components/modal/modal";
import { CreateTimeLineContent } from "./timeline-list-modal-create";
import { EnumPositionModal } from "../../../config/constants/enum";
import { getUserTimelines } from "../drawer/timeline-drawer-repository";
import { timelineActions } from "../timeline-reducer";
import {
  // dataGetTimelineFilterSelector,
  dataGetUserTimelinesSelector,
  updateFilterOptionsSelector,
  updateSortOptionsSelector,
  updateListTypeOptionOptionsSelector,
  // updateListUserTimelinesSelector
} from "../timeline-selector";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { handleParamComment } from "./timeline-handle";
import { STATUS_TIMELINE } from "../../../config/constants/enum";


/**
 * Component for show list of products
 * @param props
 */

const Tab = createMaterialTopTabNavigator();

export interface TimelineSearchBar {
  searchValue?: string;
}

/**
 * Component for timeline search bar
 * @param props
 */

export function TimelineContentScreen() {
  const [content, setContent] = React.useState("");
  const navigation = useNavigation();

  let modalListReaction: any;

  const listReaction = DUMMY_REACTION.reactions;
  const [currentTimelineId, setCurrentTimelineId] = useState(1);
  const [showDelete, setShowDelete] = useState(false);
  const [showModalCreateTimeLine, setShowModalCreateTimeLine] = useState(false);

  const [timelineId, setTimelineId] = useState(0);
  const employeeId = useSelector(authorizationSelector).employeeId || -1;
  // const dataTimelineFilter = useSelector(dataGetTimelineFilterSelector);
  // const [listTimelineData, setListTimelineData] = useState();
  const dispatch = useDispatch();
  const dataGetUserTimelines = useSelector(dataGetUserTimelinesSelector) || [];
  const updateFilterOptions = useSelector(updateFilterOptionsSelector) || [1];
  const updateSortOptions =
    useSelector(updateSortOptionsSelector) || "createdDate";
  const listTypeOptions = useSelector(updateListTypeOptionOptionsSelector) || 1;
  // const [quoteContent, setQuoteContent] = useState("");
  const [paramComment, setParamComment] = useState<any>({
    isShow: false,
    parentId: 0,
    item: {},
    status: ""
  });
  const [fileChoosen, setFileChoosen] = useState<any>();
  const [addressChoosen, setAddressChoosen] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalCreateTimeline, setIsModalCreateTimeline] = useState({
    is: false,
    isShare: ""
  });
  // const updateListUserTimelines = useSelector(updateListUserTimelinesSelector);

  function handelResponse(response: any) {
    if (response) {
      switch (response.status) {
        case 400: {
          break;
        }
        case 500: {
          break;
        }
        case 403: {
          break;
        }
        case 200: {
          return true;
        }
        default:
          return false;
      }
    }
    return false;
  }

  /**
   * Call api getTimelineFilters
   */
  async function getTimelineFilter() {
    const params = {
      // employeeId: employeeId || 0,
      employeeId: employeeId || 0,
    };
    const response = await getTimelineFilters(params, {});
    const checkResponse = handelResponse(response);
    if (checkResponse) {
      dispatch(timelineActions.getTimelineFilters(response.data));
    }
  }

  // 9 option filter:
  // 活動報告 --> 3
  // 投稿 --> 1
  // グループ投稿 --> 2
  // 顧客 --> 4
  // 名刺 --> 5
  // スケジュール --> 6
  // マイルストーン・タスク --> 7 và 8
  // タスク通知 --> 9
  // ルールエンジン通知 --> 10
   async function getUserTimeline() {
    setIsLoading(true);
    const params = {
      listType: listTypeOptions,
      limit: 20,
      offset: 0,
      filters: {
        filterOptions: [3],
        // filterOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        isOnlyUnreadTimeline: false,
      },
      sort: updateSortOptions,
    };
    const responseUserTimeline = await getUserTimelines(params, {});
    const checkResponse = handelResponse(responseUserTimeline);
    if (checkResponse) {
      dispatch(timelineActions.getUserTimelines(responseUserTimeline.data));
    }
    setIsLoading(false);
  }

  async function updateTimelineDetail() {
    const params = {
      timelineId: paramComment.parentId,
    };
    const responseTimelineDetail = await getTimelineById(params, {});
      if (responseTimelineDetail?.status === 200) {
        dispatch(timelineActions.updateListUserTimelines(responseTimelineDetail.data));
      }
  }

  useEffect(() => {
    getTimelineFilter();
    getUserTimeline();
  }, []);

  useEffect(() => {
    getUserTimeline();
  }, [updateFilterOptions, updateSortOptions, listTypeOptions, isModalCreateTimeline.is, isModalCreateTimeline.isShare]);

  /**
   * get list reaction icon
   */
  const getListReactionIcon = () => {
    let list: Array<any> = [];
    list = listReaction.map((value, index) => {
      switch (index % 3) {
        case 0:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png";
        case 1:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/sad-512.png";
        case 2:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/angry-512.png";
        default:
          return "";
      }
      // return value.reactionType.toString();
    });
    return list;
  };

  /**
   * render tab screen
   */

  const renderTabScreen = () => {
    const listIcon = getListReactionIcon();
    return listIcon.map((value, key) => {
      return (
        <Tab.Screen
          key={key}
          name={`${value}_${key}`}
          component={PersonReactionListScreen}
          initialParams={{ index: key, timelineId: currentTimelineId }}
        />
      );
    });
  };

  /**
   * function create timeline
   */
  async function onCreateTimeline() {
    setContent("");
    setIsLoading(true);
    const params = {
      createPosition: 1,
      targetDelivers: [],
      targetType: 1,
      targetId: [1],
      textComment: content,
      attachedFiles: [],
    };
    Keyboard.dismiss();
    const formData = new FormData();
    formData.append("createPosition", params.createPosition.toString());
    // formData.append("targetType", params.targetType.toString());
    // formData.append("targetId", params.targetId.toString());
    formData.append("textComment", `${content}`);
    formData.append("targetDelivers[0].targetType", "1");
    formData.append("targetDelivers[0].targetId[0]", employeeId.toString());
    // formData.append("attachedFiles", fileChoosen);
    // TODO: timeline
    // {
    //   !fileChoosen || formData.append("attachedFiles", JSON.stringify(fileChoosen));
    // }

    // formData.append("attachedFiles[0].file", "c");
    // formData.append("attachedFiles[0].fileName", "24_05_2020_01_01_08_96.jpg");

    const response = await createTimeline(formData, {});
    if (response.status===200) {
      getUserTimeline();
      // switch (response.status) {
      //   case 200: {
      //     getUserTimeline();
      //     break;
      //   }
      //   default:
      //     break;
      // }
    }
    setFileChoosen({});
    setIsLoading(false);
  }

  function refreshDataStates(){
    setContent("");
    setIsLoading(false)
    setParamComment({
      isShow: false,
      parentId: paramComment.parentId,
      item: {},
      status: ""
    });
    setFileChoosen("");
    setAddressChoosen("");
  }

  async function onCommentAndReply(formData: any) {
    const response = await createCommentAndReply(formData, {});
    if (response?.status == 200) {
      updateTimelineDetail();
    }
    refreshDataStates()
  }

  async function onCreateCommentFormData() {
    paramComment["employeeId"] = employeeId;
    paramComment["content"] = content;
    paramComment["file"] = fileChoosen;
    paramComment["address"] = addressChoosen;
    Keyboard.dismiss();
    const formDataComment = handleParamComment(paramComment);
    refreshDataStates()
    onCommentAndReply(formDataComment)
  }

 
  const handleChooseFile = (file: any) => {
    setFileChoosen(file);

  };

  const handleChooseAddress = (address: any) => {
    setAddressChoosen(address)
  };

  /**
   * open person reaction list
   */
  const openPersonReactionList = (timelineId: number) => {
    setCurrentTimelineId(timelineId);
    modalListReaction.open();
  };

  /**
   * render view modal list use reaction
   */
  const renderModalListReaction = () => {
    return (
      <Modal
        style={[ModalBoxStyles.modal, ModalBoxStyles.modal4]}
        position="bottom"
        ref={(ref: any) => {
          modalListReaction = ref;
        }}
        swipeArea={20}
      >
        <View style={TimelineListStyle.reactionListModal}>
          <Tab.Navigator
            lazy
            tabBar={(props) => (
              <TopTabbar
                count={[]}
                {...props}
                arrIcon={getListReactionIcon()}
              />
            )}
          >
            {renderTabScreen()}
          </Tab.Navigator>
        </View>
      </Modal>
    );
  };

  async function onDeleteTimeline() {
    const params = {
      timelineId,
    };
    setShowDelete(false);
    const response = await deleteTimeline(params, {});
    if (response.status === 200) {
      getUserTimeline();
    }
  }

  const renderModalDelete = () => {
    return (
      <ModalCancel
        visible={showDelete}
        titleModal={translate(messages.titleDeletePost)}
        contentModal={translate(messages.titleDeletePostAsk)}
        textBtnLeft={translate(messages.titleDeletePostCancel)}
        textBtnRight={translate(messages.titleDeleted)}
        onPress={() => onDeleteTimeline()}
        closeModal={() => setShowDelete(false)}
      />
    );
  };

  function onShowDelete(timelineId: number) {
    setShowDelete(!showDelete);
    setTimelineId(timelineId);
  }


  return (
    <View
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={TimelineListStyle.safe}
    >
      <AppBarMenu
        name={translate(messages.titleFileSearch)}
        hasBackButton={false}
      />
      <InputWithIcon sorting filter file />
      {isLoading && <ActivityIndicator size="large" />}
      <ScrollView style={TimelineListStyle.scroll}>
       {dataGetUserTimelines?.map((item, key) => (
          <Item
            key={key}
            data={item}
            onPressModalDetail={() =>
              navigation.navigate("modal-detail-timeline", {
                timeLineId: item.timelineId,
              })
            }
            onPressListReaction={() =>
              openPersonReactionList(currentTimelineId)
            }
            onPressDelete={() => onShowDelete(item.timelineId)}
            onComment={(i) =>
              setParamComment({
                isShow: i,
                parentId: item.timelineId,
                item,
                status: STATUS_TIMELINE.COMMENT
              })
            }
            onReply={(check, items) =>
              setParamComment({
                isShow: check,
                parentId: item.timelineId,
                item: items,
                status: STATUS_TIMELINE.REP_COMMENT
              })
            }
            onReplyComment={(check, items) =>
              setParamComment({
                isShow: check,
                parentId: item.timelineId,
                item: items,
                status: STATUS_TIMELINE.REPLY_COMMENT
              })
            }
            onPressQuote={(check, items) => {
              setParamComment({
                isShow: check,
                parentId: item.timelineId,
                item: {...items, isQuote: true},
                status: STATUS_TIMELINE.COMMENT
              });
            }}
            onPressQuoteComment={(check, items) => 
              setParamComment({
                isShow: check,
                parentId: item.timelineId,
                item: {...items, isQuote: true},
                status: STATUS_TIMELINE.REP_COMMENT
              })
            }
            onPressQuoteReplyComment={(check, items) => 
              setParamComment({
                isShow: check,
                parentId: item.timelineId,
                item: {...items, isQuote: true},
                status: STATUS_TIMELINE.REPLY_COMMENT
              })
            }
            onPressShareTimeline={(item) => setIsModalCreateTimeline({
                is: true,
                isShare: item
              })
            }
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => setIsModalCreateTimeline({
          is: true,
          isShare: ""
        })}
        style={TimelineListStyle.btnFloat}
      >
        <Image
          source={require("../../../../assets/icons/iconFloat.png")}
          style={TimelineListStyle.btnFloatIcon}
          resizeMethod="resize"
        />
      </TouchableOpacity>
      <ModalCommon
        visible={showModalCreateTimeLine}
        position={EnumPositionModal.bottom}
        closeModal={() => setShowModalCreateTimeLine(!showModalCreateTimeLine)}
      >
        <CreateTimeLineContent
          onCreateTimeline={() => onCreateTimeline()}
          closeModal={() =>
            setShowModalCreateTimeLine(!showModalCreateTimeLine)
          }
          content={content}
          setContent={(text) => setContent(text)}
        />
      </ModalCommon>

      {paramComment.isShow ? (
        <ItemCreateComment
          onCreateTimeline={() => onCreateCommentFormData()}
          content={content} 
          setContent={(text) => setContent(text)}
          onFormatText={() => {}}
          // TODO: check paramComment status handle isQuote
          quote={paramComment.item.isQuote ? paramComment.item.comment.content : ""}
          onChooseFile={handleChooseFile}
          onChooseAddress={handleChooseAddress}
        />
      ) : (
        <ItemCreateTimeline
          onCreateTimeline={() => onCreateTimeline()}
          content={content}
          setContent={(text) => setContent(text)}
          onFormatText={() => {}}
          onChooseFile={handleChooseFile}
        />
      )}

      { !isModalCreateTimeline.is || (
        <ModalShareTimeline
          content={content || ""}
          setContent={(text) => setContent(text)}
          onFormatText={() => {}}
          // quote={paramComment.quoteContent}
          dataShare={isModalCreateTimeline.isShare}
          onClose={() => {
            setContent("");
            setIsModalCreateTimeline({
              is: false,
              isShare: ""
            });
          }}
          // onChooseFile={handleChooseFile}
        />
      )}

      {renderModalListReaction()}
      {renderModalDelete()}
    </View>
  );
}
