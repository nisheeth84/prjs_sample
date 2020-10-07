import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { SceneMap, TabView } from "react-native-tab-view";
import { RecentMissonComplete } from "./recent-misson-complete";
import { RecentMissonInComplete } from "./recent-misson-incomplete";
import { stylesRecent } from "./recent-misson-style";
import { translate } from "../../../config/i18n";
import { messages } from "./recent-misson-messages";

import { ScreenName } from "../../../config/constants/screen-name";
import { ControlType } from "../../../config/constants/enum";

export const RecentMisson = () => {
  const [index, setIndex] = React.useState(0);
  const [isVisible, setIsVisible] = React.useState(false);
  const navigation = useNavigation();
  // const dispatch = useDispatch();
  //   dispatch(globalToolActions.getGlobalTool(DUMMY_DATA.dataInfo));
  //   const dataGlobalTool = useSelector(getGlobalToolSelector);

  const [routes] = React.useState([
    { key: "first", title: translate(messages.incomplete) },
    { key: "second", title: translate(messages.complete) },
  ]);
  const NewRoute = () => <RecentMissonInComplete />;
  const DiscussRoute = () => <RecentMissonComplete />;

  const renderScene = SceneMap({
    first: NewRoute,
    second: DiscussRoute,
  });

  const onPressTabBtn = (propsTab: any, itemTab: any) => () => {
    propsTab.jumpTo(itemTab.key);
  };

  const openModal = () => {
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
  };
  const goCreateTask = () => {
    navigation.navigate(ScreenName.CREATE_TASK, { type: ControlType.ADD });
  };
  const goCreateMilestone = () => {
    navigation.navigate(ScreenName.CREATE_MILESTONE, { type: ControlType.ADD });
  };
  const renderItemBtn = ({ item, idx }: any, propsTab: any) => {
    return (
      <TouchableOpacity
        key={idx}
        style={index === idx ? stylesRecent.btnTabActive : stylesRecent.btnTab}
        onPress={onPressTabBtn(propsTab, item)}
      >
        <Text
          style={
            index === idx ? stylesRecent.btnTxtActive : stylesRecent.btnTxt
          }
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };
  const renderTabBar = (propsTab: any) => {
    return (
      <View style={stylesRecent.btnTabWrap}>
        {routes.map((item, idx) => renderItemBtn({ item, idx }, propsTab))}
      </View>
    );
  };
  return (
    <View style={stylesRecent.container}>
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />

      <TouchableOpacity onPress={openModal} style={stylesRecent.fab}>
        <Text style={stylesRecent.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={isVisible}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={closeModal}
          style={stylesRecent.containerModal}
        >
          <View style={stylesRecent.contentModal}>
            <TouchableOpacity
              style={stylesRecent.btnAddTask}
              onPress={goCreateTask}
            >
              <Text style={stylesRecent.btnTxtModal} >{translate(messages.registerTask)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={stylesRecent.btnAddMilestone}
              onPress={goCreateMilestone}
            >
              <Text style={stylesRecent.btnTxtModal} >{translate(messages.registerMilestone)}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
