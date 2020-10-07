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
import { ReplyComment } from "./timeline-comment-reply";

export interface CommentProps {
  item?: any;
  styleContainer?: ViewStyle;
  reactions?: any;
  dataReply?: any;
  onPressReply?: (check: boolean, item: any) => void;
  onReplyComment?:  (check: boolean, item: any) => void;
  onQuoteComment?:  (check: boolean, item: any) => void;
  onQuoteReplyComment?:  (check: boolean, item: any) => void;
}

export function Comment({ item,
  onPressReply = () => { },
  onReplyComment = () => { },
  onQuoteComment = () => { },
  onQuoteReplyComment = () => { },
}: CommentProps) {
  const navigation = useNavigation();
  let modalListReaction: any;
  const [isFavorite, setIsFavorite] = useState(item?.isFavorite ? 'start' : 'startIc');
  const [showReplyComment, setShowReplyComment] = useState(false);
  const [replyCommentPress, setReplyCommentPress] = useState("forward");

  const onPressOption = async (key: any) => {
    // const paramsFavorite = {
    //   timelineId: item?.timelineId || 0,
    //   rootId: item?.rootId || 0
    // };
    switch (key) {
      case "comment": {
        break;
      }
      case "quote": {
        onQuoteComment(true, item);
        break;
      }
      case "share": {
        navigation.navigate("share-timeline", { item });
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
        onPressReply(true, item);
        setReplyCommentPress("forwardPress")
        break;
      }
      case "forwardPress": {
        onPressReply(false, item);
        setReplyCommentPress("forward")
        break;
      }
      default: {
        break;
      }
    }
  };

  function renderTop() {
    return (
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
            {item.createdUserName}
          </Text>
        </View>
        <View style={CommentStyles.topContentDate}>
          <Text style={CommentStyles.topContentInfoDate}>
            {/* {item.createdDate} */}
          </Text>
        </View>

        <View style={CommentStyles.topContentDelete} />
      </View>
    );
  }

  function renderIconOptions(key: string) {
    return (
      <TouchableOpacity
        onPress={() => onPressOption(key)}
        style={CommentStyles.btn}
      >
        {/* <Image
          style={OptionsStyles.btnIcon}
          source={requireIcon(key)}
          resizeMethod="resize"
        /> */}
        <Icon name={key} style={CommentStyles.btnIcon} />
      </TouchableOpacity>
    );
  }

  function renderOptionReply() {
    return (
      <View style={CommentStyles.containerOption}>
        {renderIconOptions(replyCommentPress)}
        {renderIconOptions("quote")}
        {renderIconOptions("share")}
        {renderIconOptions("emoji")}
        {renderIconOptions(isFavorite)}
      </View>
    );
  }

  function renderContent() {
    const arryDeliver = item.targetDeliver || [];
    const targetDelivers = arryDeliver.map(function(i: any) {
      return i['targetName'];
    });
    const count =  item?.replyTimelines.length;
    return (
      <View style={CommentStyles.mainContent}>
        <View style={CommentStyles.containerAddress}>
          <Text style={CommentStyles.address}>
            {`${translate(messages.optionDestination)}: `}
          </Text>
          <Text style={CommentStyles.addressName}>
            {targetDelivers.toString()}
          </Text>
        </View>
        <Text numberOfLines={10} style={CommentStyles.mainTxt}>
          {item.comment.content}
        </Text>

        {renderQuote()}

        {/* <FlatList
          data={reactions}
          renderItem={(i) => renderReaction(i)}
          style={CommentStyles.containerReaction}
          horizontal
        /> */}
        {renderOptionReply()}
        {count != 0 && !showReplyComment ?  <TouchableOpacity
         onPress={() => setShowReplyComment(true)}
         style={CommentStyles.btnShowPast}>
          <Text
          numberOfLines={1}
          style={CommentStyles.btnShowPastTxt}>
          {count + "件の返信"}
          </Text>
        </TouchableOpacity> :
        <View />
        }

        {!showReplyComment || 
        item.replyTimelines.map((i: any, index: number) => 
          <ReplyComment 
          key={index} 
          replyTimelines={i}
          onPressReplyComment={onReplyComment}
          onPressQuoteReplyComment={onQuoteReplyComment}
          />
        )}
      </View>
    );
  }

  const renderQuote = () => {
    if(item?.quotedTimeline?.comment?.content){
     return(
       <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingBottom: 10}}>
         <View style={{ width: '95%', minHeight: 50, flexDirection: 'row', borderWidth: 1, padding: 5, borderRadius: 15,  borderColor: '#E5E5E5',
         }}>
         
           <View style={{ flex: 0.5, alignItems: 'center'}}>
           <Icon name="quote" style={{ width: 10, height: 10 }} />
               <View style={{ 
                 width: 4,
                 backgroundColor: "#999999",
                 flex: 1,
                 marginTop: 5,
                 }}/>
 
           </View>
           <View style={{ flex: 7, justifyContent: 'center', marginTop: 12}}>
           <Text numberOfLines={3}>{item?.quotedTimeline?.comment?.content}</Text>
           </View>
       </View>
     </View>
     )
    }
    return <></>
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
      {renderTop()}
      {renderContent()}
      {renderEmoji()}
    </View>
  );
}
