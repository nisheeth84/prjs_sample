import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { TimelineItem } from "./timeline-item-styles";
import { Options } from "./timeline-options-screen/timeline-options-screen";
import { messages } from "./timeline-messages";
import { translate } from "../../../config/i18n";
import { authorizationSelector } from "../../../modules/login/authorization/authorization-selector";
import { Icon } from "../icon";

export interface ItemProps {
  data?: any;
  reactions?: any;
  onPressListReaction?: () => void;
  onPressModalDetail?: () => void;
  onPressDelete?: () => void;
  onComment?: (check: boolean) => void;
  onReply?: (check: boolean, item: any) => void;
  onReplyComment?: (check: boolean, item: any) => void;
  onPressQuote?: (check: boolean, item: any) => void;
  onPressQuoteComment?: (check: boolean, item: any) => void;
  onPressQuoteReplyComment?: (check: boolean, item: any) => void;
  onPressShareTimeline?: (item: any) => void;
  cleanOption?: boolean;
}
interface File {
  filePath: any;
  fileName: any;
}

export function Item({
  onPressListReaction,
  data,
  onPressModalDetail,
  onPressDelete,
  onComment = () => {},
  onReply = () => {},
  onReplyComment = () => {},
  onPressQuote = () => {},
  onPressQuoteComment = () => {},
  onPressQuoteReplyComment = () => {},
  onPressShareTimeline = () => {},
  cleanOption,
}: ItemProps) {
  // renderTop (Avatar, Name, Date, Icon Delete)
  const [isCharacter, setIsCharacter] = useState(false);
  const [numberOfContent, setNumberOfContent] = useState(0);
  const employeeId = useSelector(authorizationSelector).employeeId || -1;
  const [isDelete, setIsDelete] = useState(false);

  useEffect(() => {
    setIsDelete(data.createdUser === employeeId);
    if (data?.comment?.content?.length > 100) {
      setIsCharacter(true);
      setNumberOfContent(10);
    }
  }, []);
  
  function renderTop() {
    return (
      <View style={TimelineItem.topContent}>
        <View style={TimelineItem.topContentInfo}>
          <Image
            style={TimelineItem.topContentInfoImg}
            source={{
              uri:
                data?.createdUserPhoto ||
                "https://reactnative.dev/img/tiny_logo.png",
            }}
            resizeMethod="resize"
          />
          <Text 
          numberOfLines={1}
          style={TimelineItem.topContentInfoName}>
            {data?.createdUserName}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPressModalDetail}
          style={TimelineItem.topContentDate}
        >
          <Text style={TimelineItem.topContentInfoDate}>
            {data.createdDate}
          </Text>
        </TouchableOpacity>

        {isDelete ? (
          <TouchableOpacity
            onPress={onPressDelete}
            style={TimelineItem.topContentDelete}
          >
            <Icon name="bin" style={TimelineItem.topContentInfoDelete} />
          </TouchableOpacity>
        ) : (
            <TouchableOpacity style={TimelineItem.topContentDelete} />
          )}
      </View>
    );
  }

  function renderReaction() {
    return (
      <TouchableOpacity
        onPress={onPressListReaction}
        // onPress={() => openPersonReactionList(currentTimelineId)}
        style={TimelineItem.btnReaction}
      >
        <Text style={TimelineItem.btnReactionIcon}>
          {translate(messages.iconEmoji)}
        </Text>
        <Text style={TimelineItem.btnReactionTxt}>{data.reactions.length}</Text>
      </TouchableOpacity>
    );
  }

  function renderContentShare() {
    return (
      <View style={TimelineItem.containerShare}>
        <View style={TimelineItem.containerShareLeft}>
          <Image
            style={TimelineItem.shareLeftIcon}
            source={require("../../../../assets/icons/share.png")}
            resizeMode="contain"
          />
          <View style={TimelineItem.shareLine} />
        </View>

        <View style={TimelineItem.containerShareRight}>
          <View style={TimelineItem.shareInfo}>
            <Image
              style={TimelineItem.shareInfoAvt}
              source={{
                uri:  data?.sharedTimeline?.imagePath || "https://reactnative.dev/img/tiny_logo.png",
              }}
              resizeMethod="resize"
            />
            <Text 
            numberOfLines={1}
            style={TimelineItem.shareInfoName}>
              {data?.sharedTimeline?.createdUserName}
            </Text>
          </View>

          <Text 
          numberOfLines={3}
          style={TimelineItem.shareContent}>
            {data?.sharedTimeline?.comment?.content}
          </Text>
        </View>
      </View>
    );
  }

  function renderContent() {
    return (
      <View style={TimelineItem.mainContent}>
        <Text numberOfLines={numberOfContent} style={TimelineItem.mainTxt}>
          {data.comment.content}
        </Text>

        {!isCharacter || (
          <TouchableOpacity
            onPress={() => {
              setIsCharacter(false);
              setNumberOfContent(0);
            }}
            style={TimelineItem.mainBtn}
          >
            <Text>{translate(messages.readMore)}</Text>
          </TouchableOpacity>
        )}

        {data.attachedFiles.map((item: File, key: any) => {
          return (
            <View key={key} style={TimelineItem.file}>
              <Image
                resizeMode="contain"
                style={TimelineItem.fileIcon}
                source={require("../../../../assets/icons/pdf.png")}
              />
              <Text style={TimelineItem.fileTxt}>{item.fileName}</Text>
            </View>
          );
        })}
        {!data?.sharedTimeline?.comment?.content || renderContentShare()}

        <FlatList
          data={data.reactions}
          renderItem={() => renderReaction()}
          style={TimelineItem.containerReaction}
          horizontal
          nestedScrollEnabled
        />
      </View>
    );
  }

  return (
    <View style={TimelineItem.container}>
      {renderTop()}
      {renderContent()}
      <Options 
        data={data}
        styleContainer={TimelineItem.option}
        comment={data.commentTimelines}
        onPressComment={(i) => onComment(i)}
        onPressReply={(check, item) => onReply(check, item)}
        onPressReplyComment={onReplyComment} 
        onPressQuote={onPressQuote}
        onPressQuoteComment={onPressQuoteComment}
        onPressQuoteReplyComment={onPressQuoteReplyComment}
        onPressShare={onPressShareTimeline}
        cleanOption={cleanOption}
      />
    </View>
  );
}
