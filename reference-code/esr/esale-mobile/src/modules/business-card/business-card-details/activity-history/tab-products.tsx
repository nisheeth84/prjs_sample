import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { itemProductTabStyles } from "./style";
import { theme } from "../../../../config/constants";

export interface ProgressTabProps {
  onChooseTab?: (index?: number) => void;
}
interface Tab {
  zIndex: number;
  backgroundColor: string;
  title: string;
  selected: boolean;
}
export const ProductsTab: React.FC<ProgressTabProps> = () => {
  const listData = [
    {
      zIndex: 30,
      backgroundColor: theme.colors.gray100,
      title: "アプローチ",
      //   translate(messages.productsManageApproach),
      selected: false,
    },
    {
      zIndex: 20,
      backgroundColor: theme.colors.gray100,
      title: "案件化",
      //   translate(messages.productsManageProposal),
      selected: false,
    },
    {
      zIndex: 10,
      backgroundColor: theme.colors.gray100,
      title: "提案",
      //    translate(messages.productsManageSuggestion),
      selected: false,
    },
  ];
  // const [listTab, setListTab] = useState(listData);

  // const onChoose = (i: number) => {
  //   const newListTab = listData.filter((item: Tab, index: number) => {
  //     if (index === i) {
  //       item.backgroundColor = theme.colors.gray200;
  //       item.selected = true;
  //       return item;
  //     }
  //     item.backgroundColor = theme.colors.gray100;
  //     item.selected = false;
  //     return item;
  //   });
  //   // onChooseTab(i);
  //   setListTab(newListTab);
  // };
  return (
    <View style={itemProductTabStyles.container}>
      {listData.map((item: Tab, index: number) => {
        return (
          <TouchableOpacity
            key={index}
            // onPress={() => onChoose(index)}
            activeOpacity={1}
            style={[itemProductTabStyles.boxTab, { zIndex: item.zIndex }]}
          >
            {/* <View style={itemProductTabStyles.borderBottom} /> */}
            <View
              style={[
                itemProductTabStyles.titleTab,
                {
                  right:
                    index == 0
                      ? "27%"
                      : index == listData.length - 1
                        ? "21%"
                        : "25%",
                },
              ]}
            >
              <Text
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
                  ? itemProductTabStyles.rectangleViewFirst
                  : index == listData.length - 1
                    ? itemProductTabStyles.rectangleViewLast
                    : itemProductTabStyles.rectangleView,
                {
                  backgroundColor: item.backgroundColor,
                },
              ]}
            >
              {index == 0 && (
                <View style={itemProductTabStyles.triangleViewFirst} />
              )}
            </View>
            {index !== listData.length - 1 && (
              <View
                style={[
                  itemProductTabStyles.triangleView,
                  { borderBottomColor: item.backgroundColor },
                ]}
              />
            )}

            <View style={itemProductTabStyles.borderTriangle} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
