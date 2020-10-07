import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { CreateEditShareListStyle } from "./create-edit-share-list-styles";
import { messages } from "./create-edit-share-list-messages";
import { translate } from "../../../config/i18n";
import { CreateShareListScreen } from "../../../shared/components/common-create-list/create-shared-list";
import { createProductTradingsList, updateProductTradingsList, getProductTradingsList } from "../product-manage-repository";
import { LIST_MODE, LIST_TYPE, ControlType, TypeMessage } from "../../../config/constants/enum";
import { AddMoveToListRouteProp } from "../../../config/constants/root-stack-param-list";
import { getFirstItem } from "../../../shared/util/app-utils";
import _ from "lodash";
import { TYPE_MEMBER } from "../../../config/constants/query";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { getApiErrorMessage } from "../handle-error-message";
import { useSelector, useDispatch } from "react-redux";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { AuthorizationState } from "../../login/authorization/authorization-reducer";
import { messages as responseMessage } from "../../../shared/messages/response-messages"
import { productManageActions } from "../manage/product-manage-reducer";

const maxLengthName = 50;
let isAllowPress = true;

/**
 * Component show create share list screen
 */
export function CreateEditShareListScreen() {
  const navigation = useNavigation();
  const route = useRoute<AddMoveToListRouteProp>();
  const dispatch = useDispatch();
  const [dataList, setDataList] = useState<any>({});
  const [contentMessage, setContentMessage] = useState<string>(TEXT_EMPTY);
  const [isShowMessage, setShowMessage] = useState<boolean>(false);
  const [typeMessage, setTypeMessage] = useState<string>(TypeMessage.INFO);
  const authSelector: AuthorizationState = useSelector(authorizationSelector);
  const [suggestionsChoice, setSuggestionsChoice] = useState<any>({});
  const [listName, setListName] = useState(TEXT_EMPTY);

  const [screenText, setScreenText] = useState<any>({
    title: translate(messages.titleSharedList),
    buttonConfirm: translate(messages.create),
  })

  /**
   * set default suggestion choice
   */
  const setDefaultSuggestionChoice = () => {
    let employees: Array<any> = [{
      employeeId: authSelector?.employeeId,
      participantType: TYPE_MEMBER.OWNER,
    }]
    setSuggestionsChoice({
      departments: [],
      employees: employees,
      groups: [],
    });
  }

  useEffect(() => {
    navigation.addListener("focus", () => {
      setDataList({});
      setListName(TEXT_EMPTY);
      setShowMessage(false);
      isAllowPress = true;
    });
    return () => {
      setDataList({});
      setListName(TEXT_EMPTY);
      setShowMessage(false);
      setDefaultSuggestionChoice();
    };
  }, []);

  useEffect(() => {
    switch (route?.params?.type) {
      case ControlType.EDIT: {
        setScreenText({
          title: translate(messages.titleEditSharedList),
          buttonConfirm: translate(messages.edit),
        })
        break;
      }
      case ControlType.CHANGE_TO_SHARE: {
        setScreenText({
          title: translate(messages.changeToShareList),
          buttonConfirm: translate(messages.complete),
        })
        break;
      }
      default: {
        setScreenText({
          title: translate(messages.titleSharedList),
          buttonConfirm: translate(messages.create),
        })
        setDefaultSuggestionChoice();
        break;
      }
    }
    if (route?.params?.type !== ControlType.ADD && route?.params?.listId) {
      callApiGetProductTradingList(route?.params?.listId);
    }
    if (route?.params?.recordIds?.length) {
      setContentMessage(`${route?.params?.recordIds} ${translate(messages.warning)}`)
      setShowMessage(true)
      setTypeMessage(TypeMessage.INFO)
    }
  }, [route])

  /**
   * call api create share list
   */
  const callApiCreateShareList = async (values: any, nameList: string, copyList: boolean) => {
    const owner = _.compact((values || []).map((item: any) => {
      return item?.participantType === TYPE_MEMBER.OWNER || item?.participantType == undefined ? item?.employee?.employeeId : undefined
    })) || []
    const viewer = _.compact((values || []).map((item: any) => {
      return item?.participantType === TYPE_MEMBER.MEMBER ? item?.employee?.employeeId : undefined
    })) || []

    let recordIds = route?.params?.recordIds
      ? route.params.recordIds
      : []
    if (copyList) {
      recordIds = dataList.listOfproductTradingId
    }
    const params = {
      productTradingList: {
        productTradingListName: nameList?.trim(),
        listType: LIST_TYPE.sharedList,
        listMode: LIST_MODE.handwork,
        ownerList: owner,
        viewerList: viewer,
        isOverWrite: 1,
      },
      listOfproductTradingId: recordIds,
    };

    const response = await createProductTradingsList(params);
    if (
      response?.status === 200 &&
      !!response?.data?.productTradingListDetailId
    ) {
      dispatch(productManageActions.reloadDrawer({}));
      dispatch(productManageActions.showMessageWarning(
        {
          content: translate(responseMessage.INF_COM_0003),
          type: TypeMessage.SUCCESS
        }
      ));
      navigation.goBack();
    } else {
      let error = getApiErrorMessage(response);
      setTypeMessage(error.type);
      setContentMessage(error.content);
      setShowMessage(true);
      isAllowPress = true;
    }
  };

  /**
   * call api get product trading list
   */
  async function callApiGetProductTradingList(listId: number) {
    const params = {
      productTradingListDetailId: listId
    };
    const response = await getProductTradingsList(params, {});
    if (response?.status === 200 && !!response?.data?.productTradingList) {
      let data = getFirstItem(response.data.productTradingList);
      let employees: any[] = [];
      if (data?.ownerList?.length || data?.viewerList?.length) {
        data.ownerList.forEach((employee: any) => {
          employees.push({
            employeeId: employee.employeeId,
            participantType: TYPE_MEMBER.OWNER,
          })
        });
        if (route?.params?.type !== ControlType.CHANGE_TO_SHARE) {
          data.viewerList.forEach((employee: any) => {
            employees.push({
              employeeId: employee.employeeId,
              participantType: TYPE_MEMBER.MEMBER,
            })
          })
        }
      }
      if (route?.params?.type === ControlType.COPY) {
        setListName(route?.params?.listName);
      } else {
        setListName(data.productTradingListName);
      }
      setDataList(data);
      setSuggestionsChoice({
        departments: [],
        employees: employees,
        groups: [],
      });
    } else {
      let error = getApiErrorMessage(response);
      setTypeMessage(error.type);
      setShowMessage(true);
      setContentMessage(error.content);
      isAllowPress = false;
    }
  }

  /**
   * call api update list
   */
  const updateList = async (values: any, nameList: string) => {
    const owner = _.compact((values || []).map((item: any) => {
      return item?.participantType === TYPE_MEMBER.OWNER || item?.participantType == undefined ? item?.employee?.employeeId : undefined
    })) || []
    const viewer = _.compact((values || []).map((item: any) => {
      return item?.participantType === TYPE_MEMBER.MEMBER ? item?.employee?.employeeId : undefined
    })) || []

    let listType = route?.params?.type === ControlType.CHANGE_TO_SHARE
      ? LIST_TYPE.sharedList
      : dataList.typeList

    const params: any = {
      productTradingListDetailId: route?.params?.listId,
      productTradingList: {
        productTradingListName: nameList?.trim(),
        listType: listType,
        listMode: dataList.listMode,
        ownerList: owner,
        viewerList: viewer,
        isOverWrite: 1,
      }
    };
    const response = await updateProductTradingsList(params);
    if (response?.status === 200 && !!response?.data) {
      dispatch(productManageActions.reloadDrawer({}));
      dispatch(productManageActions.showMessageWarning(
        {
          content: translate(responseMessage.INF_COM_0004),
          type: TypeMessage.SUCCESS
        }
      ));
      navigation.goBack();
    } else {
      let error = getApiErrorMessage(response);
      setTypeMessage(error.type);
      setShowMessage(true);
      setContentMessage(error.content);
      isAllowPress = true;
    }
  };

  /**
   * press button confirm 
   */
  const pressButtonConfirm = (values: any) => {
    if (listName.length > maxLengthName) {
      setTypeMessage(TypeMessage.ERROR)
      setContentMessage(translate(responseMessage.ERR_COM_0027).replace("{0}", `${maxLengthName}`))
      setShowMessage(true);
    } else {
      const owner = _.compact((values || []).map((item: any) => {
        return item?.participantType === TYPE_MEMBER.OWNER || item?.participantType == undefined ? item?.employee?.employeeId : undefined
      })) || []
      const viewer = _.compact((values || []).map((item: any) => {
        return item?.participantType === TYPE_MEMBER.MEMBER ? item?.employee?.employeeId : undefined
      })) || []
      if (owner.length === 0 && viewer.length === 0) {
        setTypeMessage(TypeMessage.ERROR)
        setContentMessage(translate(responseMessage.ERR_COM_0014))
        setShowMessage(true);
      } else {
        if (isAllowPress) {
          isAllowPress = false;
          switch (route?.params?.type) {
            case ControlType.ADD: {
              callApiCreateShareList(values, listName, false)
              break
            }
            case ControlType.COPY: {
              callApiCreateShareList(values, listName, true)
              break
            }
            case ControlType.EDIT: {
              updateList(values, listName);
              break
            }
            case ControlType.CHANGE_TO_SHARE: {
              updateList(values, listName);
              break
            }
          }
        }
      }
    }
  }

  /**
   * check show modal confirm close
   * @param valueSelected 
   */
  const checkShowModalConfirmClose = (valueSelected: any[]) => {
    let listId = (valueSelected || []).map((item: any) => {
      return item?.employee?.employeeId
    }) || []
    if (route?.params?.type === ControlType.EDIT) {
      const owner = (_.compact((valueSelected || []).map((item: any) => {
        return item?.participantType === TYPE_MEMBER.OWNER || item?.participantType == undefined ? item?.employee?.employeeId : undefined
      })) || []).sort()
      const viewer = (_.compact((valueSelected || []).map((item: any) => {
        return item?.participantType === TYPE_MEMBER.MEMBER ? item?.employee?.employeeId : undefined
      })) || []).sort()

      const ownerList = ((dataList?.ownerList || []).map((item: any) => {
        return item?.employeeId
      }) || []).sort()

      const viewerList = ((dataList?.viewerList || []).map((item: any) => {
        return item?.employeeId
      })).sort()

      console.log(ownerList, owner, viewerList, viewer)
      if (!_.isEqual(ownerList, owner) || !_.isEqual(viewerList, viewer)) {
        return true;
      }
      if (listName !== dataList.productTradingListName) {
        return true
      }
      return false
    }
    if (!listName && listId.length === 1 && listId.indexOf(authSelector?.employeeId) === 0 && valueSelected[0]?.participantType === TYPE_MEMBER.OWNER) {
      return false
    }
    return true;
  }

  return (
    <SafeAreaView style={CreateEditShareListStyle.container}>
      <CreateShareListScreen
        titleScreen={screenText.title}
        listName={listName}
        buttonName={screenText.buttonConfirm}
        inputTitle={translate(messages.nameList)}
        inputHolder={translate(messages.enterList)}
        onTopRightPress={(values: any) => {
          pressButtonConfirm(values)
        }}
        contentMessage={contentMessage}
        isShowMessage={isShowMessage}
        typeMessage={typeMessage}
        suggestionsChoice={suggestionsChoice}
        onTextChange={(text: string) => { setListName(text) }}
        isChangeToShareList={route?.params?.type === ControlType.CHANGE_TO_SHARE}
        checkShowModalConfirmClose={(valueSelected: any[]) => {
          return checkShowModalConfirmClose(valueSelected);
        }
        }
      />
    </SafeAreaView>
  );
}
