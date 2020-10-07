import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Modal from "react-native-modalbox";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../../../config/constants";
import { Item } from "../../../shared/components/timeline/timeline-item-screen";
import { TIMELINE } from "../../../shared/components/timeline/timeline-item-dummy";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { messages } from "../timeline-messages";
import { translate } from "../../../config/i18n";
import { PersonReactionListScreen } from "../person-reaction-list/person-reaction-list-screen";

import { ModalBoxStyles } from "../../../shared/common-style";

import { TopTabbar } from "../../../shared/components/toptabbar/top-tabbar";
import { DUMMY_REACTION } from "../person-reaction-list/person-reaction-list-dummy-data";
import { ModalDetailStyles } from "./modal-detail-styles";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { getTimelineById } from "./modal-detail-repository";
import {
  createCommentAndReply,
  getCommentAndReplies,
} from "../timeline-repository";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { ItemCreateComment } from "../list/timeline-list-item-create-comment";

/**
 * Component for
 * @param props
 */

const Tab = createMaterialTopTabNavigator();

export function ModalDetail() {
  const [content, setContent] = useState(TEXT_EMPTY);
  let modalListReaction: any;

  const listReaction = DUMMY_REACTION.reactions;
  const [currentTimelineId, setCurrentTimelineId] = useState(1);
  const [timelinesDetail, setTimelineDetail] = useState<any>();
  const employeeId = useSelector(authorizationSelector).employeeId || -1;
  const [fileChoosen, setFileChoosen] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const route: any = useRoute();
  const [isComment, setIsComment] = useState({
    is: false,
    nameReply: "",
    timelineId: route?.params?.timeLineId || 0,
    rootId: 0,
    quoteContent: "",
  });

  async function getTimelineDetail() {
    const params = {
      timelineId: route?.params?.timeLineId || 0,
    };

    const responseTimelineDetail = await getTimelineById(params, {});
    console.log("responseTimelineDetail", responseTimelineDetail);
    if (responseTimelineDetail) {
      if (responseTimelineDetail.status === 200) {
        // dispatch(TimelinesActions.getTimelinesDetail(responseTimelineDetail));
        setTimelineDetail(responseTimelineDetail?.data?.timelines);
      }
    }
  }

  useEffect(() => {
    async function getCommentAndReply() {
      const params = {
        timelineId: route?.params?.timeLineId || 0,
        type: 1,
        lastestTimelineId: 1,
      };
      const listCommentResponse = await getCommentAndReplies(params, {});
      if (listCommentResponse) {
        if (listCommentResponse.status === 200) {
          // dispatch(timelineActions.getCommentAndReplies(listCommentResponse));
        }
      }
    }
    getTimelineDetail();
    getCommentAndReply();
  }, []);

  async function onCreateComment() {
    const param = {
      timelineId: isComment.timelineId,
      // TODO: api fix bug 
      // rootId: isComment.rootId != 0 ? isComment.timelineId,
      rootId: isComment.timelineId,
      targetDelivers: [
        // { targetType: 5, targetId: 1000 },
        // { targetType: 6, targetId: 1001 },
      ],
      actionType: 1,
      targetType: 1,
      targetId: [1],
      textComment: content,
      attachedFiles: [],
      quoteContent: isComment.quoteContent
    };
    setIsLoading(true)
    const formData = new FormData();
    formData.append("timelineId", param.timelineId.toString());
    formData.append("rootId", param.rootId.toString());
    formData.append("targetDelivers[0].targetType", "1");
    formData.append("targetDelivers[0].targetId[0]", employeeId.toString());

    formData.append("actionType", param.actionType.toString());
    formData.append(
      "textComment",
      `${content}`
    );
    {
      !fileChoosen || formData.append("attachedFiles", `${fileChoosen}}`);
    }
    {!param.quoteContent || formData.append("quoteContent", param.quoteContent)}
    setContent("");
    const response = await createCommentAndReply(formData, {});
    console.log("createCommentAndReply-response-------->", response)
    if (response) {
      switch (response.status) {
        case 200: {
          getTimelineDetail();
          setContent("");
          break;
        }
        case 500: {
          break;
        }
        default:
          break;
      }
    }
    setIsLoading(false)
    setIsComment({
      is: false,
      nameReply: "",
      timelineId: route?.params?.timeLineId || 0,
      rootId: 0,
      quoteContent: "",
    })
  }

  // const handleChooseFile = (file: any) => {
  //   console.log("vvvvvvv", file);
  //   setFileChoosen(file);
  // };

  /**
   * get list reaction icon
   */
  const getListReactionIcon = () => {
    return listReaction.map((value) => {
      switch (value.reactionType) {
        case 0:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png";
        case 1:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/sad-512.png";
        case 2:
          return "https://cdn4.iconfinder.com/data/icons/reaction/32/angry-512.png";
        default:
          return TEXT_EMPTY;
      }
      // return value.reactionType.toString();
    });
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
   * open person reaction list
   */

  const openPersonReactionList = (timelineId: number) => {
    setCurrentTimelineId(timelineId);
    modalListReaction.open();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={ModalDetailStyles.safe}
    >
      <SafeAreaView style={ModalDetailStyles.safe}>
        <AppbarCommon
          // title={timelinesDetail.createdDate}
          title={timelinesDetail?.createdDate || ""}
          styleTitle={ModalDetailStyles.titleHeader}
          containerStyle={ModalDetailStyles.appbarCommonStyle}
          leftIcon="md-close"
        />
        {isLoading && <ActivityIndicator size="large" />}
        <ScrollView style={ModalDetailStyles.scroll}>
          {timelinesDetail && (
            <Item
              key={0}
              data={timelinesDetail}
              onPressListReaction={() =>
                openPersonReactionList(currentTimelineId)
              }
              onComment={(i) =>
                setIsComment({
                  is: i,
                  nameReply: timelinesDetail?.createdUserName || "",
                  timelineId: timelinesDetail.timelineId,
                  rootId: timelinesDetail.rootId,
                  quoteContent: "",
                })
              }
              onReply={(check, items) =>
                setIsComment({
                  is: check,
                  nameReply: items?.createdUserName || "",
                  timelineId: items.timelineId,
                  rootId: timelinesDetail.rootId,
                  quoteContent: "",
                })
              }
              onReplyComment={(check, items) =>
                setIsComment({
                  is: check,
                  nameReply: items?.createdUserName || "",
                  rootId: timelinesDetail.rootId,
                  timelineId: items.timelineId,
                  quoteContent: "",
                })
              }
              onPressQuote={(check, items) =>{
                setIsComment({
                  is: check,
                  nameReply: items?.createdUserName || "",
                  timelineId: items.timelineId,
                  rootId: timelinesDetail.rootId,
                  quoteContent: check ? items.comment.content : ""
                })
              }}
            />
          )}
        </ScrollView>

        <ItemCreateComment
          onCreateTimeline={() => onCreateComment()}
          content={content}
          setContent={(text) => setContent(text)}
          onFormatText={() => {}}
          // onChooseFile={handleChooseFile}
        />

        {/* <View style={ModalDetailStyles.createComment}>
          <View style={ModalDetailStyles.create}>
            <Text style={ModalDetailStyles.txtCreate}>
              {translate(messages.destination)}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("share-timeline", {
                  title: translate(messages.modalCommentTimeline),
                  comment: true,
                })
              }
            >
              <Image
                resizeMode="contain"
                source={require("../../../../assets/icons/detail.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={ModalDetailStyles.create}>
            <TextInput
              placeholder={translate(messages.placeholderCreateTimeline)}
              placeholderTextColor={theme.colors.gray}
              value={content}
              onChangeText={(txt) => setContent(txt)}
              style={ModalDetailStyles.inputCreate}
            />

            <TouchableOpacity
              onPress={() => setContent(TEXT_EMPTY)}
              style={
                content
                  ? ModalDetailStyles.createTimelineIn
                  : ModalDetailStyles.createTimeline
              }
            >
              <Text
                style={
                  content
                    ? ModalDetailStyles.txtCreateTimelineIn
                    : ModalDetailStyles.txtCreateTimeline
                }
              >
                {translate(messages.buttonCreateTimeline)}
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <Modal
          style={[ModalBoxStyles.modal, ModalBoxStyles.modal4]}
          position="bottom"
          ref={(ref: any) => {
            modalListReaction = ref;
          }}
          swipeArea={20}
        >
          <View style={ModalDetailStyles.reactionListModal}>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
