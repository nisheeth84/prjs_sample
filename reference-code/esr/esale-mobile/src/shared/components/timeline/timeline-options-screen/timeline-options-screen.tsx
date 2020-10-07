/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useState, useEffect } from "react";
import {
  FlatList,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { OptionsStyles } from "./timeline-options-style";
import { PopupEmoji } from "../timeline-emoji-popup/timeline-emoji-screen";
import { Icon } from "../../icon";
import { Comment } from "../timeline-comment/timeline-comment";

export interface OptionsProps {
  data?: any;
  styleContainer?: ViewStyle;
  reactions?: any;
  dataReply?: any;
  comment?: any;
  onPressComment?: (check: boolean) => void;
  onPressQuote?: (check: boolean, item: any) => void;
  onPressReply?: (check: boolean, item: any) => void;
  onPressReplyComment?: (check: boolean, item: any) => void;
  onPressQuoteComment?: (check: boolean, item: any) => void;
  onPressQuoteReplyComment?: (check: boolean, item: any) => void;
  onPressShare?: (item: any) => void;
  cleanOption?: boolean;
}

export function Options({
  // dataReply = {
  //   name: "社員A",
  //   avt: "https://reactnative.dev/img/tiny_logo.png",
  // },
  data,
  comment,
  onPressComment = () => { },
  onPressReply = () => { },
  onPressReplyComment = () => { },
  onPressQuote = () => { },
  onPressQuoteComment = () => { },
  onPressQuoteReplyComment = () => { },
  onPressShare = () => { },
  cleanOption,
}: OptionsProps) {
  let modalListReaction: any;
  const [isFavorite, setIsFavorite] = useState(data?.isFavorite ? 'start' : 'startIc');
  const [ countComment ] = useState(5);
  const [commentChoose, setCommentChoose] = useState("comment")
  const [quoteChoose] = useState(false)


  useEffect(() => {
    // TODO: 
  }, [cleanOption])

  const onPressOption = async (key: any) => {
    // const paramsFavorite = {
    //   timelineId: data?.timelineId || 0,
    //   rootId: data?.rootId || 0
    // };
    switch (key) {
      case "comment": {
        onPressComment(true)
        setCommentChoose("commentPress")
        break;
      }
      case "commentPress": {
        onPressComment(false)
        setCommentChoose("comment")
        break;
      }
      case "quote": {
        onPressQuote(!quoteChoose, data)
        break;
      }
      case "share": {
        onPressShare(data);
        // navigation.navigate("share-timeline", { data });
        break;
      }
      case "emoji": {
        modalListReaction.open();
        break;
      }
      case "start": {
        setIsFavorite('startIc');
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
        break;
      }
      default: {
        break;
      }
    }
  };

  // function onHandleComment() {
  // }

  function renderIconOptions(key: string) {
    return (
      <TouchableOpacity
        // onPress={() => onPressOption(key)}
        onPress={() => onPressOption(key)}
        style={OptionsStyles.btn}
      >
        <Icon name={key} style={OptionsStyles.btnIcon} />
      </TouchableOpacity>
    );
  }

  function renderOptionIteTimeline() {
    return (
      <View>
        <View style={OptionsStyles.containerOptionsComment}>
          {renderIconOptions(commentChoose)}
          {renderIconOptions("quote")}
          {renderIconOptions("share")}
          {renderIconOptions("emoji")}
          {renderIconOptions(isFavorite)}
        </View>
      </View>
    );
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
    <View>
      <View style={OptionsStyles.containerComment}>
        {renderOptionIteTimeline()}
        <FlatList
          data={comment?.slice(0, countComment)}
          renderItem={(i) => 
          <Comment 
            item={i.item} 
            onPressReply={onPressReply}
            onReplyComment={onPressReplyComment}
            onQuoteComment={onPressQuoteComment}
            onQuoteReplyComment={onPressQuoteReplyComment}
            />}
        />
      </View>
      {renderEmoji()}
    </View>
  );
}
