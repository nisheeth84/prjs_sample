import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  DrawerActions,
  useRoute,
} from "@react-navigation/native";
import { BusinessCardCreationStyles } from "./business-card-creation-style";
import { messages } from "./business-card-creation-messages";
import { translate } from "../../../config/i18n";
import {
  createBusinessCardsList,
  updateBusinessCardsList,
  getBusinessCardList,
} from "../business-card-repository";
import { CreateMyListScreen } from "../../../shared/components/common-create-list/create-my-list";
import _ from "lodash";
// import { Icon } from "../../../shared/components/icon";
// import { View, Text } from "react-native";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { GetBnCardListMode } from "../../../config/constants/enum";
import { businessCardActions } from "../business-card-reducer";
import { useDispatch } from "react-redux";
const styles = BusinessCardCreationStyles;

/**
 * Component show create mylist business card screen
 */
export function BusinessCardCreateMyListScreen() {
  const navigation = useNavigation();
  const route: any = useRoute();
  const [content, setContent] = useState("");
  const [recordLength, setRecordLength] = useState(false);
  const [lengt, setLength] = useState(0);

  const dispatch = useDispatch();
  const onClick =()=>{
    setLength(lengt+1);
  }
  /**
   * create Business Cards List
   */
  const createBusinessCardsListFunc = async () => {
    if (_.isEmpty(content)) return;
    // const language = value;
    if (route?.params?.mode) {
      const params = {
        businessCardList: {
          businessCardListName: content,
          isOverWrite: route?.params?.isOverWrite || 0,
          listMode: route?.params?.list?.listMode?.toString() || "1",
          listType: route?.params?.list?.listType || 0,
          ownerList:
            JSON.parse(route?.params?.list?.ownerList).employeeId || [],
          viewerList:
            JSON.parse(route?.params?.list?.viewerList).employeeId || [],
        },
        businessCardListDetailId: route?.params?.list?.listId,
        searchConditions: [],
      };
      const data = await updateBusinessCardsList(params);

      if (data.status === 200) {
        navigation.goBack();
      } else {
        alert("Server error!");
      }
      return;
    }
    const params = {
      businessCardList: {
        businessCardListName: content,
        isOverWrite: 0,
        listMode: "1",
        listType: 1,
        ownerList: [],
        viewerList: [],
      },
      listOfBusinessCardId: route?.params?.recordIds,
      searchConditions: [],
    };
    const data = await createBusinessCardsList(params);
    if (data.status === 200) {
      getBusinessCardListFunc({});
      navigation.goBack();
    } else {
      alert("Server error!");
    }
    return;
  };

  async function getBusinessCardListFunc(param: {
    employeeTd?: number;
    idOfList?: number;
    mode?: number;
  }) {
    const params = {
      mode: GetBnCardListMode.GET_ALL,
      // limit: 500,
      ...param,
    };
    const data = await getBusinessCardList(params, {});
    if (data.status===200) {
      dispatch(businessCardActions.getBusinessCardList(data.data));
    }
    else {
      alert("Server error!");
    }
    return;
  }

  useEffect(() => {
    setContent(route?.params?.list?.listName || "");
  }, [route?.params?.list]);

  useEffect(() => {
    if (route?.params?.recordIds?.length > 0) {
      setRecordLength(route?.params?.recordIds?.length || 0);
    }
  }, [route?.params?.recordIds]);

  useEffect(() => {
    if (lengt ===1) {
      createBusinessCardsListFunc();
    }
  }, [lengt]);

  return (
    <SafeAreaView style={styles.container}>
      <CreateMyListScreen
        title={translate(messages.title)}
        buttonName={translate(messages.create)}
        onPressLeft={() => {
          navigation.goBack();
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
        onRightPress={onClick}
        warningMessage={
          route?.params?.recordIds?.length > 0
            ? recordLength + translate(messages.warring)
            : TEXT_EMPTY
        }
        placeHolderInput={translate(messages.enterList)}
        inputTitle={translate(messages.nameList)}
        onChangeText={(text) => setContent(text)}
        txtSearch={content}
      />
    </SafeAreaView>
  );
}
