import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useNavigation,
  useRoute,
  DrawerActions,
} from "@react-navigation/native";
import {
  // FlatList,
  // Modal,
  Text,
  TextInput,
  // TouchableOpacity,
  // TouchableWithoutFeedback,
  View,
} from "react-native";
import _ from "lodash";
import { BusinessCardCreationStyles } from "./business-card-creation-style";
import { Header } from "../../../shared/components/header";
import { messages } from "./business-card-creation-messages";
import { translate } from "../../../config/i18n";
import {
  createBusinessCardsList,
  updateBusinessCardsList,
  getBusinessCardList,
} from "../business-card-repository";
import { theme } from "../../../config/constants";
import { EmployeeSuggestView } from "../../../shared/components/suggestions/employee/employee-suggest-view";
import {
  TypeSelectSuggest,
  KeySearch,
  GetBnCardListMode,
} from "../../../config/constants/enum";
import { useSelector, useDispatch } from "react-redux";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { TYPE_MEMBER } from "../../../config/constants/query";
import { Icon } from "../../../shared/components/icon";
import { businessCardActions } from "../business-card-reducer";
const styles = BusinessCardCreationStyles;
/**
 * Component show create share list business card screen
 */
let params: any = {};
export function BusinessCardCreateSharedListScreen() {
  const route: any = useRoute();
  const dispatch = useDispatch();
  const authorization = useSelector(authorizationSelector);
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [records, setRecords] = useState(0);
  const [length, setLength] = useState(0);
  // let params: any = {};
  const [validate, setValidate] = useState(false);
  //   const authSelector = useSelector(authorizationSelector);
  /**
   * add data
   */
  useEffect(() => {
    setContent(route?.params?.list?.listName || "");
    setRecords(route?.params?.recordIds?.length || 0);
    if (!!route?.params?.list) {
      params = {
        owner:
          JSON.parse(route?.params?.list?.ownerList || "{}").employeeId || [],
        viewer:
          JSON.parse(route?.params?.list?.viewerList || "{}").employeeId || [],
      };
     
    } else {
      params = {
        owner: [authorization.employeeId],
        viewer: [],
      };
    }
  }, [route]);

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
    if (data) {
      handleErrorGetBusinessCardList(data);
    }
  }

  const handleErrorGetBusinessCardList = (response: any) => {
    switch (response.status) {
      case 200: {
        dispatch(businessCardActions.getBusinessCardList(response.data));
        break;
      }
      case 400: {
        alert('Bad Request');
        break;
      }
      case 500: {
        alert("Server error!");
        break;
      }
      default: {
        alert('Bad Request');
        break;
      }
    }
  };

  const handlePickElement = (searchValue: any) => {
    let newEmpArr: any = {};
    if (searchValue?.length === 0) {
      params = {
        owner: [],
        viewer: [],
      };
      // return;
    } else {
      const owner: Array<any> = [];
      const viewer: Array<any> = [];
      searchValue.forEach((element: any) => {
        if (element.participantType !== TYPE_MEMBER.MEMBER) {
          owner.push(element.itemId.toString());
        } else {
          viewer.push(element.itemId.toString());
        }
      });
      newEmpArr = {
        owner,
        viewer,
      };
      params = newEmpArr;
    }
  };

  /**
   * create Business Cards List
   */
  const createBusinessCardsListFunc = async () => {
    if (_.isEmpty(content)) return;
    const language = content;
    if (route?.params?.mode) {
      const paramsUpdate = {
        businessCardList: {
          businessCardListName: content,
          isOverWrite: route?.params?.isOverWrite || 0,
          listMode: route?.params?.list?.listMode?.toString() || 1,
          listType: route?.params?.list?.listType || 0,
          ownerList: params?.owner || [],
          viewerList: params?.viewer || [],
        },
        businessCardListDetailId: route?.params?.list?.listId,
        searchConditions: [],
      };
      const data = await updateBusinessCardsList(paramsUpdate);
      if (data.status === 200) {
        getBusinessCardListFunc({});
        navigation.goBack();
      } else {
        alert("Server error!");
      }
      return;
    }
    const param = {
      businessCardList: {
        businessCardListName: language,
        listType: 2,
        listMode: 1,
        ownerList: params?.owner || [],
        viewerList: params?.viewer || [],
        isOverWrite: null,
      },
      searchConditions: [],
      listOfBusinessCardId:route?.params?.recordIds || [],
      // businessCardListDetailId: [],
    };
    const data = await createBusinessCardsList(param);
    if (data.status===200) {
      getBusinessCardListFunc({});
      navigation.goBack();
    } else {
      alert("Server error!");
    }
    return;
  };
  /**
   * go add list
   */
  // const add = () => {
  //   navigation.navigate("business-card-add");
  // };

  const convertArrayToSuggestion = (owner: any, viewer: any) => {
    const newArray: Array<any> = [];
    if (owner.length > 0) {
      owner.forEach((element: string) => {
        newArray.push({
          employeeId: parseInt(element) || 0,
          participantType: TYPE_MEMBER.OWNER,
        });
      });
    }
    if (viewer.length > 0) {
      viewer.forEach((element: string) => {
        newArray.push({
          employeeId: parseInt(element) || 0,
          participantType: TYPE_MEMBER.MEMBER,
        });
      });
    }
    return {
      departments: [],
      employees: newArray,
      groups: [],
    };
  };
  const onClick =()=>{
    if(content===""){
      setValidate(true)
    } else{
      setValidate(false)
      setLength(length+1);
    }
  }
  useEffect(() => {
    if(length===1){
      createBusinessCardsListFunc();
    }
  }, [length]);
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={translate(messages.titleSharedList)}
        nameButton={translate(messages.create)}
        onLeftPress={() => {
          navigation.goBack();
          navigation.dispatch(DrawerActions.toggleDrawer());
        }}
        onRightPress={onClick}
        rightContainerStyle={{
          backgroundColor: content
            ? theme.colors.blue200
            : theme.colors.gray300,
        }}
      />

      <View style={[styles.viewFragment]}>
        {records > 0 && (
          <View style={styles.viewWarming}>
            <Icon name="warning" />
            <Text style={styles.text}>
              {records + translate(messages.warring)}
            </Text>
          </View>
        )}
        <View style={styles.view}>
          <View style={styles.directionRow}>
            <Text style={styles.txt}>{translate(messages.nameList)}</Text>
            <View style={styles.required}>
              <Text style={styles.txtRequired}>
                {translate(messages.required)}
              </Text>
            </View>
          </View>
          <View style={styles.padding} />
          <TextInput
            style={styles.input}
            placeholder={translate(messages.enterList)}
            onChangeText={(text) => setContent(text)}
            value={content}
          />
          {
            validate &&<Text style={{color: "red"}}>{translate(messages.validate)}</Text>
          }
        </View>
        {/* <TouchableOpacity style={styles.btn}> */}
        <View style={styles.view}>
          <EmployeeSuggestView
            fieldLabel={translate(messages.addParticipants)}
            invisibleLabel={false}
            withAuthorization={true}
            typeSearch={TypeSelectSuggest.MULTI}
            updateStateElement={handlePickElement}
            groupSearch={KeySearch.EMPLOYEE}
            suggestionsChoice={convertArrayToSuggestion(
              JSON.parse(route?.params?.list?.ownerList || "{}").employeeId || [
                authorization.employeeId,
              ],
              JSON.parse(route?.params?.list?.viewerList || "{}").employeeId ||
                []
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
