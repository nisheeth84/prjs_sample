import React, { } from "react";
import {
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { requireIconTabEmoji } from "../timeline-handel/option";
import { emoji, emojiPopular } from "../timeline-item-dummy";
import { EmojiPopupStyles } from "./timeline-emoji-popup-styles";
import { messages } from "../timeline-messages";
import { translate } from "../../../../config/i18n";

const initialLayout = { width: Dimensions.get("window").width };

export interface EmojiProps {
  emoji?: any;
  emojiPopular?: any;
}

export function PopupEmoji() {
  // const [contentSearch, setContentSearch] = useState("");
  function renderIconEmoji(item: any) {
    return (
      <TouchableOpacity style={EmojiPopupStyles.btnEmoji}>
        <Image
          style={EmojiPopupStyles.btnEmojiIcon}
          resizeMode="contain"
          source={{
            uri: item,
          }}
        />
      </TouchableOpacity>
    );
  }
  const Face1 = () => (
    <View style={[EmojiPopupStyles.scene]}>
      <View style={EmojiPopupStyles.containerFace1}>
        <Image source={require("../../../../../assets/icons/search.png")} />
        <TextInput
          placeholder={translate(messages.searchEmoji)}
          // onChangeText={(txt) => setContentSearch(txt)}
          style={EmojiPopupStyles.faceInput}
          // value={contentSearch}
        />
      </View>

      <Text style={EmojiPopupStyles.txtEmojiHot}>{translate(messages.usedEmoji)}</Text>
      <View style={EmojiPopupStyles.emoji}>
        {emojiPopular.map((i: any) => renderIconEmoji(i))}
      </View>
      <Text style={EmojiPopupStyles.txtEmojiHot}>{translate(messages.faceEmoji)}</Text>
      <View style={EmojiPopupStyles.emoji}>
        {emoji.map((i: any) => renderIconEmoji(i))}
      </View>
    </View>
  );

  const Face2 = () => <View style={[EmojiPopupStyles.scene]} />;
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "face1",
      title: "First",
    },
    {
      key: "face2",
      title: "Second",
    },
    {
      key: "face3",
      title: "Second",
    },
    {
      key: "face4",
      title: "Second",
    },
  ]);

  const renderScene = SceneMap({
    face1: Face1,
    face2: Face2,
    face3: Face2,
    face4: Face2,
  });

  const getTabBarIcon = (props: any) => {
    const { route } = props;
    return (
      <View>
        <Image
          source={requireIconTabEmoji(route.key)}
          style={EmojiPopupStyles.imgTab}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={EmojiPopupStyles.tab}
          indicatorContainerStyle={EmojiPopupStyles.tabContainer}
          renderIcon={(props) => getTabBarIcon(props)}
          tabStyle={EmojiPopupStyles.bubble}
          labelStyle={EmojiPopupStyles.noLabel}
        />
      )}
      tabBarPosition="top"
    />
  );
}
