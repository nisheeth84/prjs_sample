import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { itemTabStyles } from "./style";
import { theme } from "../../../../config/constants";
import { messages } from "../../business-card-messages";
import { translate } from "../../../../config/i18n";

export interface ProgressTabProps {
  onChooseTab?: (index?: number) => void;
}
interface Tab {
  zIndex: number;
  backgroundColor: string;
  title: string;
  selected: boolean;
}
export const ProgressTab: React.FC<ProgressTabProps> = ({ onChooseTab }) => {
  const listData = [
    {
      zIndex: 30,
      backgroundColor: theme.colors.blue200,
      title: "アプローチ",
      //   translate(messages.productsManageApproach),
      selected: true,
    },
    {
      zIndex: 20,
      backgroundColor: theme.colors.blue100,
      title: "案件化",
      //   translate(messages.productsManageProposal),
      selected: false,
    },
    {
      zIndex: 10,
      backgroundColor: theme.colors.blue100,
      title: "提案",
      //    translate(messages.productsManageSuggestion),
      selected: false,
    },
  ];
  const [listTab, setListTab] = useState(listData);

  const onChoose = (i: number) => {
    const newListTab = listData.filter((item: Tab, index: number) => {
      if (index === i) {
        item.backgroundColor = theme.colors.blue200;
        item.selected = true;
        return item;
      }
      item.backgroundColor = theme.colors.blue100;
      item.selected = false;
      return item;
    });
    // onChooseTab(i);
    setListTab(newListTab);
  };
  return (
    <View style={itemTabStyles.container}>
      {listTab.map((item: Tab, index: number) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onChoose(index)}
            activeOpacity={1}
            style={[itemTabStyles.boxTab, { zIndex: item.zIndex }]}
          >
            {/* <View style={itemTabStyles.borderBottom} /> */}
            <View
              style={[
                itemTabStyles.titleTab,
                {
                  right:
                    index == 0
                      ? "27%"
                      : index == listTab.length - 1
                      ? "21%"
                      : "25%",
                },
              ]}
            >
              <Text
                numberOfLines={2}
                style={{
                  textAlign: "center",
                  fontSize: theme.fontSizes[0],
                  color: item.selected ? "white" : theme.colors.black,
                }}
              >
                {item.title}
              </Text>
            </View>
            <View
              style={[
                index == 0
                  ? itemTabStyles.rectangleViewFirst
                  : index == listTab.length - 1
                  ? itemTabStyles.rectangleViewLast
                  : itemTabStyles.rectangleView,
                {
                  backgroundColor: item.backgroundColor,
                },
              ]}
            />
            <View
              style={[
                itemTabStyles.triangleView,
                { borderBottomColor: item.backgroundColor },
              ]}
            />
            <View style={itemTabStyles.borderTriangle} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
