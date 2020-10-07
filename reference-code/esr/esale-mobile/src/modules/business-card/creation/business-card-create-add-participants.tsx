import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import _ from "lodash";
import { BusinessCardCreationStyles } from "./business-card-creation-style";
import { Header } from "../../../shared/components/header";
import { messages } from "./business-card-creation-messages";
import { translate } from "../../../config/i18n";
import { dataGetBusinessCardsDummy } from "./dummy-data-list-share";
import { Icon } from "../../../shared/components/icon";
import { CommonStyles } from "../../../shared/common-style";
import { theme } from "../../../config/constants";
import { ModalBusinessCardSearch } from "./business-card-create-add-participants-modal";

const styles = BusinessCardCreationStyles;

/**
 * Conponent show create business card screen
 */
export function BusinessCardCreateAdd() {
  const navigation = useNavigation();
  const data = dataGetBusinessCardsDummy.businessCards;
  const [array, setArray] = useState(data);
  const [modalBusinessCardSearch, setModalBusinessCardSearch] = useState(false);
  const listSelected = array.filter((el) => el.check === true);
  /**
   * add to list share
   */
  const addList = () => {
    navigation.navigate("business-card-create-shared-list", {
      param: listSelected,
    });
  };
  /**
   *
   * @param id on check
   */
  const onSelect = (id: number) => {
    const arr = [...array];
    arr[id - 1].check = !arr[id - 1].check;
    setArray(arr);
  };

  /**
   *
   * @param item render item
   */
  const renderItem = (item: any) => {
    return (
      <View style={styles.viewItem}>
        <View style={styles.textAvatar}>
          <View style={item.id % 2 === 0 ? styles.bgAvatav1 : styles.bgAvatav2}>
            <Text>{translate(messages.company)}</Text>
          </View>
        </View>
        <View style={styles.viewManager}>
          <View style={styles.txtManager}>
            <Text>{item.department}</Text>
            <Text>{item.manager}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.btnCheck}
          onPress={() => onSelect(item.id)}
        >
          {!item.check ? (
            <Icon name="unFavourite" />
          ) : (
            <Icon name="favourite" />
          )}
        </TouchableOpacity>
      </View>
    );
  };
  /**
   *
   * @param item render item bottom
   */
  const renderItemBottom = (item: any) => {
    return (
      <View style={styles.bodyBot}>
        <View style={item.id % 2 === 0 ? styles.avataBotv1 : styles.avataBotv2}>
          <Text>{translate(messages.company)}</Text>
        </View>
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {item.position}
        </Text>
        <TouchableOpacity
          style={styles.btnIcon}
          onPress={() => onSelect(item.id)}
        >
          <Icon name="delete" style={styles.icon} />
        </TouchableOpacity>
      </View>
    );
  };
  /**
   * toggle ModalBusinessCardSearch
   */
  const toggleModalBusinessCardSearch = () => {
    setModalBusinessCardSearch(!modalBusinessCardSearch);
  };
  /**
   *
   * @param data
   */
  const onConfirmData = () => {
    toggleModalBusinessCardSearch();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={translate(messages.titleSharedList)}
        nameButton={translate(messages.create)}
        onLeftPress={() => {
          navigation.goBack();
        }}
        onRightPress={addList}
        rightContainerStyle={{
          backgroundColor: !_.isEmpty(listSelected)
            ? theme.colors.blue200
            : theme.colors.gray300,
        }}
      />
      <View style={styles.viewHead}>
        <View style={styles.directionRow}>
          <Text style={styles.txt}>{translate(messages.participantToAdd)}</Text>
        </View>
        <TouchableOpacity
          onPress={toggleModalBusinessCardSearch}
          style={[styles.textInput, styles.paddingBtn]}
        >
          <Icon name="search" style={styles.iconSearch} />
          <Text style={styles.txtPlaceholder}>
            {translate(messages.placeholderSearch)}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bgBody}>
        <View style={CommonStyles.flex1}>
          <FlatList
            data={array}
            renderItem={({ item }: any) => renderItem(item)}
          />
        </View>
        {_.isEmpty(listSelected) ? null : (
          <View style={styles.viewFlatist}>
            <FlatList
              horizontal
              data={listSelected}
              renderItem={({ item }: any) => renderItemBottom(item)}
            />
          </View>
        )}
      </View>
      <ModalBusinessCardSearch
        visible={modalBusinessCardSearch}
        onConfirm={onConfirmData}
      />
    </SafeAreaView>
  );
}
