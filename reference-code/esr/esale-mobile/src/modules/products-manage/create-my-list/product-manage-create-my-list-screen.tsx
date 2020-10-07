import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { CreateMyListStyle } from "./product-manage-create-my-list-styles";
import { messages } from "./create-my-list-messages";
import { translate } from "../../../config/i18n";
import { CreateMyListScreen } from "../../../shared/components/common-create-list/create-my-list";
import {
  createProductTradingsList,
  updateProductTradingsList,
  getProductTradingsList,
} from "../product-manage-repository";
import { AddMoveToListRouteProp } from "../../../config/constants/root-stack-param-list";
import {
  LIST_TYPE,
  TypeMessage,
  LIST_MODE,
  ControlType
} from "../../../config/constants/enum";
import { productManageActions } from "../manage/product-manage-reducer";
import { getFirstItem } from "../../../shared/util/app-utils";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import {
  getApiErrorMessage
} from "../handle-error-message";
import { messages as responseMessage } from "../../../shared/messages/response-messages"


const styles = CreateMyListStyle;
const maxLengthName = 50;
let isAllowPress = true;

/**
 * Component show create my list screen
 */
export function ProductManageCreateMyListScreen() {
  const route = useRoute<AddMoveToListRouteProp>();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [text, setTxt] = useState(TEXT_EMPTY);
  const [typeMessage, setTypeMessage] = useState(TEXT_EMPTY);
  const [dataList, setDataList] = useState<any>({});
  const [messageContent, setMessageContent] = useState<string>(TEXT_EMPTY);

  const [screenText, setScreenText] = useState<any>({
    title: translate(messages.title),
    buttonConfirm: translate(messages.create)
  })

  useEffect(() => {
    navigation.addListener("focus", () => {
      setTxt(TEXT_EMPTY);
      isAllowPress = true;
    });
  }, []);

  useEffect(() => {
    if (route?.params?.type === ControlType.EDIT) {
      setScreenText({
        title: translate(messages.titleEditMyList),
        buttonConfirm: translate(messages.edit),
      })
    } else {
      setScreenText({
        title: translate(messages.title),
        buttonConfirm: translate(messages.create),
      })
    }
    if (route?.params?.type !== ControlType.ADD && route?.params?.listId) {
      callApiGetProductTradingList(route?.params?.listId);
    }
    if (route?.params?.recordIds?.length) {
      setTypeMessage(TypeMessage.INFO);
      setMessageContent(`${route?.params?.recordIds?.length} ${translate(messages.warring)}`)
    }
  }, [route])

  /**
   * call Api create My List Product Manage
   */
  const createMyListProductManageFunc = async (copyList: boolean = false) => {
    let recordIds = route?.params?.recordIds
      ? route.params.recordIds
      : []
    if (copyList) {
      recordIds = dataList.listOfproductTradingId
    }
    const params = {
      productTradingList: {
        productTradingListName: text?.trim(),
        listType: LIST_TYPE.myList,
        listMode: LIST_MODE.handwork,
        ownerList: [],
        viewerList: [],
        isOverWrite: 1,
      },
      listOfproductTradingId: recordIds
    };
    const response = await createProductTradingsList(params);
    if (response.status === 200 && !!response.data.productTradingListDetailId) {
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
      setMessageContent(error.content);
      isAllowPress = true
    }
  };

  /**
   * call api get product trading list
   */
  async function callApiGetProductTradingList(id: number) {
    const params = {
      productTradingListDetailId: id
    };
    const response = await getProductTradingsList(params, {});
    if (response?.status === 200 && !!response?.data?.productTradingList) {
      let data = getFirstItem(response.data.productTradingList);
      setDataList(data);
      if (route?.params?.type === ControlType.COPY) {
        setTxt(route?.params.listName || TEXT_EMPTY);
      } else {
        setTxt(data.productTradingListName || TEXT_EMPTY);
      }
    } else {
      let error = getApiErrorMessage(response);
      setTypeMessage(error.type);
      setMessageContent(error.content);
      isAllowPress = false;
    }
  }

  /**
   * call api update list
   */
  const updateList = async () => {
    const owner = (dataList.ownerList || []).map((employee: any) => employee?.employeeId)
    const viewer = (dataList.viewerList || []).map((employee: any) => employee?.employeeId)
    const params = {
      productTradingListDetailId: route?.params?.listId,
      productTradingList: {
        productTradingListName: text?.trim(),
        listType: dataList.typeList,
        listMode: dataList.listMode,
        ownerList: owner,
        viewerList: viewer,
        isOverWrite: 1,
      },
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
      setMessageContent(error.content);
      isAllowPress = true
    }
  };

  /**
   * handle press top right button 
   */
  const pressButtonConfirm = () => {
    if (text.length > maxLengthName) {
      setTypeMessage(TypeMessage.ERROR)
      setMessageContent(translate(responseMessage.ERR_COM_0027).replace("{0}", `${maxLengthName}`))
    } else {
      if (isAllowPress) {
        isAllowPress = false;
        switch (route?.params?.type) {
          case ControlType.ADD: {
            createMyListProductManageFunc()
            break
          }
          case ControlType.COPY: {
            createMyListProductManageFunc(true)
            break
          }
          case ControlType.EDIT: {
            updateList()
            break
          }
        }
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CreateMyListScreen
        title={screenText.title}
        buttonName={screenText.buttonConfirm}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onRightPress={() => {
          pressButtonConfirm()
        }}
        warningMessage={messageContent}
        placeHolderInput={translate(messages.enterList)}
        inputTitle={translate(messages.nameList)}
        typeMessage={typeMessage}
        txtSearch={text}
        onChangeText={(textChange) => {
          setTxt(textChange)
        }}
        checkShowModalConfirmClose={
          () => {
            if (route?.params?.type === ControlType.EDIT) {
              if (text === dataList.productTradingListName) {
                return false
              }
              return true
            }
            return !!text
          }
        }
      />
    </SafeAreaView>
  );
}
