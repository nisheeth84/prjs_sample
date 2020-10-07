/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { CommentStyles } from "./timeline-comment-styles";
import { PopupEmoji } from "../timeline-emoji-popup/timeline-emoji-screen";
import { messages } from "../timeline-messages";
import { translate } from "../../../../config/i18n";
import { Icon } from "../../icon";
//import { updateTimelineFavorite } from "../../../../modules/timeline/timeline-repository";


export interface ReplyCommentProps {
  replyTimelines?: any;
  styleContainer?: ViewStyle;
  reactions?: any;
  dataReply?: any;
  key?: number;
  onPressReplyComment?: (check: boolean, item: any) => void;
  onPressQuoteReplyComment?: (check: boolean, item: any) => void;
}

export function ReplyComment({ replyTimelines,
  onPressReplyComment = () => { },
  onPressQuoteReplyComment = () => { },
}: ReplyCommentProps) {
  const navigation = useNavigation();
  let modalListReaction: any;
  const [isFavorite, setIsFavorite] = useState(replyTimelines?.isFavorite ? 'start' : 'startIc');
  const [replyCommentPress, setReplyCommentPress] = useState("forward");

  const onPressOption = async (key: any) => {
    // const paramsFavorite = {
    //   timelineId: replyTimelines?.timelineId || 0,
    //   rootId: replyTimelines?.rootId || 0
    // };
    switch (key) {
      case "comment": {
        break;
      }
      case "quote": {
        onPressQuoteReplyComment(true, replyTimelines)
        break;
      }
      case "share": {
        navigation.navigate("share-timeline", { replyTimelines });
        break;
      }
      case "emoji": {
        modalListReaction.open();
        break;
      }
      case "start": {
        setIsFavorite("startIc");
        // const response = await updateTimelineFavorite(paramsFavorite,
        //   {}
        // );
        // if (response.status === 200) {
        // }
        break;
      }
      case "startIc": {
        setIsFavorite("start");
        // const response = await updateTimelineFavorite(paramsFavorite,
        //   {}
        // );
        // if (response.status === 200) {
        // }
        break;
      }
      case "forward": {
        onPressReplyComment(true, replyTimelines);
        setReplyCommentPress("forwardPress")
        break;
      }
      case "forwardPress": {
        onPressReplyComment(false, replyTimelines);
        setReplyCommentPress("forward")
        break;
      }
      default: {
        break;
      }
    }
  };


  function renderIconOptions(key: string) {
    return (
      <TouchableOpacity
        onPress={() => onPressOption(key)}
        style={CommentStyles.btn}
      >
        <Icon name={key} style={CommentStyles.btnIcon} />
      </TouchableOpacity>
    );
  }


  function renderCommentReply(replyTimelines: any) {
    return(
      <View style={{ width: "100%", }}>
         <View style={CommentStyles.topContent}>
        <View style={CommentStyles.topContentInfo}>
          <Image
            style={CommentStyles.topContentInfoImg}
            source={{
              uri: "https://reactnative.dev/img/tiny_logo.png",
            }}
            resizeMethod="resize"
          />
          <Text 
           numberOfLines={1}
          style={CommentStyles.topContentInfoName}>
            {replyTimelines?.createdUserName}
          </Text>
        </View>

        <View style={CommentStyles.topContentDate}>
          <Text style={CommentStyles.topContentInfoDate}>
            {/* {item.createdDate} */}
          </Text>
        </View>

        <View style={CommentStyles.topContentDelete} />
      </View>

      <View style={CommentStyles.mainContent}>
        <View style={CommentStyles.containerAddress}>
          <Text style={CommentStyles.address}>
            {`${translate(messages.optionDestination)}: `}
          </Text>
          <Text style={CommentStyles.addressName}>
            {/* {targetDelivers.toString()} */}
          </Text>
        </View>
        <Text numberOfLines={10} style={CommentStyles.mainTxt}>
          {replyTimelines?.comment?.content}
        </Text>
      </View>
      <View style={CommentStyles.containerReplyOption}>
        {renderIconOptions(replyCommentPress)}
        {renderIconOptions("quote")}
        {renderIconOptions("share")}
        {renderIconOptions("emoji")}
        {renderIconOptions(isFavorite)}
      </View>         
      </View>
    )
  }

  function renderEmoji() {
    return (
      <RBSheet
        ref={(ref) => {
          modalListReaction = ref;
        }}
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            marginTop: -10,
          },
          container: {
            height: "40%",
          },
        }}
      >
        <PopupEmoji />
      </RBSheet>
    );
  }

  return (
    <View style={CommentStyles.containerReply}>
        {renderCommentReply(replyTimelines)}
        {renderEmoji()}
    </View>
  );
}
