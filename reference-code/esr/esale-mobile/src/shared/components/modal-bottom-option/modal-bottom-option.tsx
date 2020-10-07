import React, { useEffect } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { theme } from "../../../config/constants";

interface ModalBottomOptionProps {
  isVisible: boolean;
  closeModal: () => void;
  onSelected: (item: any, index: number) => void;
  dataOption?: Array<any>;
  fieldName: string;
  itemSelected?: any;
}

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: "rgba(0,0,0,0.4)",
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  contentModal: {
    width: "100%",
    minHeight: 100,
    backgroundColor: "white",
    borderRadius: theme.space[4],
  },
  btnAddTask: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    padding: theme.space[7],
    borderTopColor: theme.colors.gray200,
  },
  btnAddTaskNoBorder: {
    flex: 1,
    padding: theme.space[7],
    justifyContent: "center",
    alignItems: "center",
  },
  txtFieldName: {
    fontWeight: "bold",
    textAlign: "center",
  },
  colorBlack: {
    color: theme.colors.black100,
  },
});

let flatListRef: any;

export const ModalBottomOption: React.FC<ModalBottomOptionProps> = ({
  isVisible,
  closeModal,
  onSelected,
  dataOption = [],
  fieldName,
  itemSelected,
}) => {
  const indexSelected =
    (typeof itemSelected === "object" &&
      dataOption?.findIndex(
        (el) => el[fieldName] === itemSelected[fieldName]
      )) ||
    0;

  useEffect(() => {
    if (
      flatListRef &&
      isVisible &&
      indexSelected > 0 &&
      dataOption.length > 15
    ) {
      setTimeout(() => {
        flatListRef.scrollToIndex({
          animated: true,
          index: indexSelected,
        });
      }, 2500);
    }
  }, [isVisible]);

  const itemModal = (item: any, index: number) => {
    return (
      <TouchableOpacity
        style={index === 0 ? styles.btnAddTaskNoBorder : styles.btnAddTask}
        onPress={() => {
          onSelected(item, index)
          closeModal();
        }}
      >
        <Text
          style={[
            styles.txtFieldName,
            indexSelected === index && styles.colorBlack,
          ]}
        >
          {item[fieldName]}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal transparent animationType="slide" visible={isVisible}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={closeModal}
        style={styles.containerModal}
      >
        <View style={styles.contentModal}>
          <FlatList
            ref={(ref) => {
              flatListRef = ref;
            }}
            data={dataOption}
            extraData={dataOption}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => itemModal(item, index)}
            initialNumToRender={1000}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
