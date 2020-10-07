import * as React from "react";
import { View, Text } from "react-native"
import { CustomerDetailScreenStyles } from "../../customer-detail-style"
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { NetworkBusinessCardStyle, BasicDetailBusinessCardStyle } from "./network-business-card-style";
import {
  BusinessCardData,
  EmployeeData,
  deleteNetworkStand,
  DeleteNetworkStandResponse,
  KeyValueObject
} from "./network-business-card-repository";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { networkBusinessCardActions } from "./network-business-card-reducer";
import { useNavigation } from "@react-navigation/native";
import { PositionType } from "../../enum";
import { networkStandDetailSelector } from "./network-business-card-selector";
import { CommonButton } from "../../../../../shared/components/button-input/button";
import { AppbarCommon } from "../../../../../shared/components/appbar/appbar-common";
import { CommonMessages } from "../../../../../shared/components/message/message";
import { STATUSBUTTON, TypeButton } from "../../../../../config/constants/enum";

interface DeletedPositionDetailScreenProps {
  // screen route
  route: any
}

/**
 * Component for delete position detail screen
 * 
 * @param DeletedPositionDetailScreenProps
 */
export const DeletedPositionDetailScreen: React.FC<DeletedPositionDetailScreenProps> = (
  {
    route
  }
) => {
  const networkStand = useSelector(networkStandDetailSelector);
  const dispatch = useDispatch();
  const [isSuccess , setIsSuccess] = useState(true);
  const [disableDeleteBtn, setDisableDeleteBtn] = useState(false);
  const navigation = useNavigation();
  const businessCard: BusinessCardData = route.params.businessCard;
  const employees: Array<EmployeeData> = route.params.employees;
  const stand: KeyValueObject = route.params.standObject;
  const motivation: KeyValueObject = route.params.motivationObject;
  const tradingProduct: KeyValueObject = route.params.tradingProductObject;
  const departmentId: number = route.params.departmentId;
  const [responseError, setResponseError] = useState<any>("");

  /**
   * delete network stand info function
   * 
   * @param networkStandId: networkStandId param for delete network stand
   */
  async function deleteNetworkStandInfo (networkStandId: number | undefined) {
    if(typeof networkStandId === "number") {
      setDisableDeleteBtn(true);

      // call api delete network stand
      const deleteNetworkStandResponse = await deleteNetworkStand({networkStandId: networkStandId});

      if (deleteNetworkStandResponse) {
        handleDeleteNetworkStandResponse(deleteNetworkStandResponse);
      }
      setDisableDeleteBtn(false);
    }
  }

  /**
   * handle delete network stand response function
   * 
   * @param response value return of API delete network stand
   */
  const handleDeleteNetworkStandResponse = (response: DeleteNetworkStandResponse) => {
    if(response.status === 200) {
      setIsSuccess(true);
      const tempNetworkStand = {
        businessCardId: networkStand.businessCardId,
        stands: null
      };

      dispatch(networkBusinessCardActions.deleteNetworkStandData({departmentId: departmentId, businessCardId: networkStand.businessCardId}));
      dispatch(networkBusinessCardActions.setPositionType(PositionType.NOT_POSITION));
      dispatch(networkBusinessCardActions.setNetworkStandDetail(tempNetworkStand));

      navigation.navigate("basic-detail-business-card", {
        employees: employees,
        businessCard: businessCard,
        stand: null,
        motivation: null,
        tradingProduct: null,
        departmentId: departmentId
      });
    } else {
      setIsSuccess(false);
      setResponseError(response);
    }
  };

  return (
    <View style={BasicDetailBusinessCardStyle.container}>
      <AppbarCommon
      title={translate(messages.deleteScreenTitle)}
      leftIcon="back"
    />
      {
        !isSuccess && responseError !== "" &&
        <View style={CustomerDetailScreenStyles.messageStyle}>
          <CommonMessages response={responseError} />
        </View>
      }

      <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
        <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.positionLabel)}</Text>
        <Text style={NetworkBusinessCardStyle.grayText}>{stand.key ? stand.value : ""}</Text>
      </View>
      <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
        <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.motivationLabel)}</Text>
        <Text style={NetworkBusinessCardStyle.grayText}>{motivation.key? motivation.value : ""}</Text>
      </View>
      <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
        <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.tradingProductLabel)}</Text>
        <Text style={NetworkBusinessCardStyle.grayText}>{tradingProduct.key ? tradingProduct.value : ""}</Text>
      </View>
      <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
        <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.commentLabel)}</Text>
        <Text style={NetworkBusinessCardStyle.grayText}>{networkStand.stands?.comment}</Text>
      </View>
      <View style={BasicDetailBusinessCardStyle.deletedButtonBlock}>
        <CommonButton onPress= {() => deleteNetworkStandInfo(networkStand.stands?.networkStandId)} status = {disableDeleteBtn ? STATUSBUTTON.DISABLE : STATUSBUTTON.ENABLE} icon = "" textButton= {translate(messages.deleteButton)} typeButton = {TypeButton.BUTTON_DIALOG_SUCCESS}></CommonButton>
      </View>
    </View>
  )
}
