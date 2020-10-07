import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { TimelineListStyle } from "./timeline-list-styles";
import { translate } from "../../../config/i18n";
import { messages } from "../timeline-messages";
import { Input } from "../../../shared/components/input";
import { theme } from "../../../config/constants";
import { ItemCreateTimeline } from "./timeline-list-item-create";
import { EnumFormatText } from "../../../config/constants/enum";
import { CommonStyles } from "../../../shared/common-style";

interface CreateTimeLineContentProps {
  content: string;
  setContent: (text: string) => void;
  closeModal: () => void;
  onCreateTimeline: () => void;
}

export const CreateTimeLineContent: React.FC<CreateTimeLineContentProps> = ({
  content,
  setContent,
  closeModal,
  onCreateTimeline,
}) => {
  const [styleFormat, setStyleFormat] = useState<any>({});

  const convertStyle = (format: EnumFormatText) => {
    switch (format) {
      case EnumFormatText.bold:
        setStyleFormat(TimelineListStyle.txtBold);
        break;
      case EnumFormatText.italic:
        setStyleFormat(TimelineListStyle.txtItalic);
        break;
      case EnumFormatText.underLine:
        setStyleFormat(TimelineListStyle.txtUnderLine);
        break;
      case EnumFormatText.strikeThrough:
        setStyleFormat(TimelineListStyle.txtStrikeThrough);
        break;
      default:
        setStyleFormat(TimelineListStyle.txtNormal);
        break;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={TimelineListStyle.boxModalCreateTimeline}
    >
      <View style={TimelineListStyle.create}>
        <Text style={TimelineListStyle.txtCreate}>
          {translate(messages.destination)}
        </Text>
        <TouchableOpacity hitSlop={CommonStyles.hitSlop} onPress={closeModal}>
          <Icon resizeMode="contain" name="zoomOut" />
        </TouchableOpacity>
      </View>
      <Input
        multiline
        placeholder={translate(messages.placeholderCreateTimeline)}
        placeholderColor={theme.colors.gray}
        value={content}
        onChangeText={(txt) => setContent(txt)}
        style={TimelineListStyle.inputCreate}
        inputStyle={[TimelineListStyle.inputContent, styleFormat]}
      />
      <ItemCreateTimeline
        onCreateTimeline={onCreateTimeline}
        onFormatText={(formatType) => convertStyle(formatType)}
        content={content}
      />
    </TouchableOpacity>
  );
};
