import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "../../../shared/components/icon";
import { ItemDrawer } from "./item-drawer";
import { styles } from "./timeline-drawer-styles";

interface ItemDepartmentProps {
  title: string;
  onClose: () => void;
}

export const ItemDepartment: React.FC<ItemDepartmentProps> = ({
  title,
  onClose,
}) => {
  const dataDummy = [
    { name: "部署A-1", newItem: 1, id: 1 },
    { name: "部署A-1", newItem: 1, id: 2 },
  ];
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerModal}>
        <TouchableOpacity
          style={styles.boxClose}
          onPress={onClose}
          hitSlop={styles.hitSlop}
        >
          <Icon name="close" />
        </TouchableOpacity>

        <Text>{title}</Text>
      </View>
      <View>
        <FlatList
          data={dataDummy}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          renderItem={({ item }) => (
            <ItemDrawer
              borderBottom
              title={item.name}
              newItem={item.newItem}
              arrowRight
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};
