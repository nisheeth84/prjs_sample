import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, Linking, Image } from "react-native"
import { CustomerDetailScreenStyles } from "../../customer-detail-style"
import { Icon } from "../../../../../shared/components/icon";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { BasicDetailBusinessCardStyle, NetworkBusinessCardStyle, SelectedPositionModalStyle } from "./network-business-card-style";
import Modal from 'react-native-modal';
import { useState } from "react";
import { theme } from "../../../../../config/constants/theme";
import { SelectedPositionModal } from "./selected-position-modal";
import { SelectedMotivationModal } from "./selected-motivation-modal";
import { 
  BusinessCardData,
  EmployeeData,
  StandData,
  KeyValueObject,
  updateNetworkStand,
  UpdateNetworkStandResponse,
  createNetworkStand
} from "./network-business-card-repository";
import { useSelector, useDispatch } from "react-redux";
import {
  positionTypeSelector,
  networkStandDetailSelector,
  companyIdSelector,
  motivationBusinessCardSelector
} from "./network-business-card-selector";
import { PositionType } from "../../enum";
import { networkBusinessCardActions } from "./network-business-card-reducer";
import { themeCusomer } from "../../shared/components/theme-customer";
import { AppBarEmployee } from "../../../../../shared/components/appbar/appbar-employee";
import { getLabelFormatByUserLanguage } from "../../../shared/utils/utils";
import { CommonMessages } from "../../../../../shared/components/message/message";
import { DetailScreenActions } from "../../../../employees/detail/detail-screen-reducer";

interface BasicDetailBusinessCardScreenProps {
  // screen navigation
  navigation: any,
  // screen route
  route: any,
}

/**
 * Component for show basic detail business card screen
 * 
 * @param BasicDetailBusinessCardScreenProps 
 */
export const BasicDetailBusinessCardScreen: React.FC<BasicDetailBusinessCardScreenProps> = (
  {
    navigation,
    route,
  }
) => {
  const positionType = useSelector(positionTypeSelector);
  const networkStand = useSelector(networkStandDetailSelector);
  const companyId = useSelector(companyIdSelector);
  const motivation = useSelector(motivationBusinessCardSelector);
  const dispatch = useDispatch()
  const [isSuccess, setIsSuccess] = useState(true);
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [isVisibleMotivationModal, setSsVisibleMotivationModal] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [responseError, setResponseError] = useState<any>("");
  
  const screenWidth = Math.round(Dimensions.get('window').width);

  const businessCard: BusinessCardData = route.params.businessCard;
  const employees: Array<EmployeeData> = route.params.employees;
  const stand: StandData = route.params.stand;
  const departmentId: number = route.params.departmentId;

  const [standObject, setStandObject] = useState({
    key: stand ? stand.masterStandId : null,
    value: stand ? getLabelFormatByUserLanguage(stand.masterStandName) : ""
  });

  const [motivationObject, setMotivationObject] = useState({
    key: motivation ? motivation.motivationId : null,
    value: motivation ? getLabelFormatByUserLanguage(motivation.motivationName) : ""
  });

  const [commentValue, setCommentValue] = useState(networkStand.stands === null || !networkStand.stands.comment ? "" : networkStand.stands.comment);

  /**
   * handle selected position from selected position modal function
   * 
   * @param value: selected from selected position modal 
   */
  const onSelectedPosition = (value: KeyValueObject) => {
    setStandObject(value);
    setIsVisibleModal(false);
  }

  /**
   * handle selected motivation from selected motivation modal function
   * 
   * @param value: selected from selected motivation modal
   */
  const onSelectedMotivation = (value: KeyValueObject) => {
    setMotivationObject(value);
    setSsVisibleMotivationModal(false);
  }
  
  // param for pass to delete position detail screen
  const params = {
    employees: employees,
    businessCard: businessCard,
    standObject: standObject,
    motivationObject: motivationObject,
    departmentId: departmentId
  };

  /**
   * Add temporary position function
   */
  const addTemporaryPosition = () => {
    setStandObject({
      key: null,
      value: translate(messages.selectPositionValue)
    });

    setMotivationObject({
      key: null,
      value: translate(messages.selectMotivationValue)
    });

    setCommentValue("");

    dispatch(networkBusinessCardActions.setNetworkStandDetail({
      businessCardId: networkStand.businessCardId,
      stands: {
        networkStandId: null,
        standId: null,
        motivationId: null,
        tradingProductIds: null,
        comment: ""
      }
    }));
  }

  /**
   * Edit position function
   */
  async function editPosition() {
    if (networkStand.stands) {
      setDisableBtn(true);
      const updateNetworkStandResponse = await updateNetworkStand(
        {
        networkStandId: networkStand.stands.networkStandId,
        businessCardCompanyId: companyId,
        businessCardDepartmentId: departmentId,
        businessCardId: networkStand.businessCardId,
        standId: standObject.key,
        motivationId: motivationObject.key,
        comment: commentValue
      }
      
      );

      if (updateNetworkStandResponse) {
        handleUpdateNetworkStandResponse(updateNetworkStandResponse);
      }

      setDisableBtn(false);
    }
  }

  /**
   * create position function
   */
  async function createPosition() {
    setDisableBtn(true);
    const createNetworkStandResponse = await createNetworkStand({
      businessCardCompanyId: companyId,
      businessCardDepartmentId: departmentId,
      businessCardId: networkStand.businessCardId,
      standId: standObject.key,
      motivationId: motivationObject.key,
      comment: commentValue
    });

    if (createNetworkStandResponse) {
      handleCreateNetworkStandResponse(createNetworkStandResponse);
    }

    setDisableBtn(false);
  }

  /**
   * handle update network stand response function
   * 
   * @param response: value return of API update network stand
   */
  const handleUpdateNetworkStandResponse = (response: UpdateNetworkStandResponse) => {
    if(response.status === 200){
      const responseData = response.data?.networkStandId;
      const payload = {
        departmentId: departmentId,
        businessCardId: businessCard.businessCardId,
        stands: {
          networkStandId: responseData,
          standId: standObject.key,
          motivationId: motivationObject.key,
          comment: commentValue
        }
      }
      dispatch(networkBusinessCardActions.setPositionType(PositionType.HAVE_POSITION));
      dispatch(networkBusinessCardActions.updateOrAddNetworkStandData(payload));
      dispatch(networkBusinessCardActions.setMotivationBusinessCard({motivationId: motivationObject.key}));
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
      setResponseError(response);
    }
  };

  /**
   * handle create network stand response function
   * 
   * @param response: value return of API update network stand
   */
  const handleCreateNetworkStandResponse = (response: UpdateNetworkStandResponse) => {
    if(response.status === 200){
      const responseData = response.data?.networkStandId;
      const payload = {
        departmentId: departmentId,
        networkStandId: responseData,
        businessCardId: businessCard.businessCardId,
        stands: {
          networkStandId: responseData,
          standId: standObject.key,
          motivationId: motivationObject.key,
          comment: commentValue
        }
      }
      dispatch(networkBusinessCardActions.setNetworkStandDetail({
        businessCardId: businessCard.businessCardId,
        stands: {
          networkStandId: responseData,
          standId: standObject.key,
          motivationId: motivationObject.key,
          comment: commentValue
        }
      }));
      dispatch(networkBusinessCardActions.setPositionType(PositionType.HAVE_POSITION));
      dispatch(networkBusinessCardActions.updateOrAddNetworkStandData(payload));
      dispatch(networkBusinessCardActions.setMotivationBusinessCard({motivationId: motivationObject.key}));
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
        setResponseError(response);
    }
  };

  return (
    <View style={BasicDetailBusinessCardStyle.container}>
    <AppBarEmployee name={translate(messages.networkMapTitle)}/>
      {
        !isSuccess && responseError !== "" &&
        <View style={CustomerDetailScreenStyles.messageStyle}>
          <CommonMessages response={responseError} />
        </View>
      }
      <ScrollView>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.businessCardNameLabel)}</Text>
          <Text style={CustomerDetailScreenStyles.textLink}>{businessCard.companyName}</Text>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.departmentNameLabel)}</Text>
          <Text style={NetworkBusinessCardStyle.grayText}>{businessCard.departmentName}</Text>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.positionNameLabel)}</Text>
          <Text style={NetworkBusinessCardStyle.grayText}>{businessCard.position}</Text>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.emailAddress)}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${businessCard.emailAddress}`) }>
            <Text style={CustomerDetailScreenStyles.textLink}>{businessCard.emailAddress}</Text>
          </TouchableOpacity>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.tel)}</Text>
          <Text style={NetworkBusinessCardStyle.grayText}>{businessCard.phoneNumber}</Text>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.lastContactDate)}</Text>
          <Text style={NetworkBusinessCardStyle.grayText}>{businessCard.lastContactDate}</Text>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.receivedDate)}</Text>
          <Text style={NetworkBusinessCardStyle.grayText}>{businessCard.receiveDate}</Text>
        </View>
        <View style={[CustomerDetailScreenStyles.defaultRow]}>
          <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.employeesName)}</Text>
          <View style={BasicDetailBusinessCardStyle.employeesNameBlock}>
            {employees.map((employee, index) => {
              return <View style={[BasicDetailBusinessCardStyle.employeesNameBlock, CustomerDetailScreenStyles.employeeBlock]} key={employee.employeeId}>
                {employee.employeeImage.fileUrl ? (
                  <Image
                    source={{ uri: employee.employeeImage.fileUrl }}
                    style={CustomerDetailScreenStyles.avatar}
                  />
                ) : (
                    <View style={CustomerDetailScreenStyles.wrapAvatar}>
                      <Text style={CustomerDetailScreenStyles.bossAvatarText}>
                        {employee.employeeName ? employee.employeeName.charAt(0) : ""}
                      </Text>
                    </View>
                  )
                }

                <Text style={[CustomerDetailScreenStyles.textLink, CustomerDetailScreenStyles.paddingLeft5]} 
                onPress={() => {
                  dispatch(DetailScreenActions.addEmployeeIds(employee.employeeId));
                  navigation.navigate("detail-employee", {
                    id: employee.employeeId,
                    title: `${employee.employeeSurname} ${employee.employeeName || ""}`,
                  });
                }}>{employee.employeeName}</Text>
                {index+1 !== employees.length && <Text>{` `}</Text>}
              </View>
            })}
          </View>

        </View>
        {networkStand.stands === null ? 
        <TouchableOpacity style={[BasicDetailBusinessCardStyle.updatePositionBlock, NetworkBusinessCardStyle.marginTop10]}
          onPress={addTemporaryPosition}
        >
          <Text>{translate(messages.addBusinessCardButton)}</Text>
        </TouchableOpacity> 
        : <View style={[BasicDetailBusinessCardStyle.positionBlock]}>
          <TouchableOpacity
            style={BasicDetailBusinessCardStyle.deleteIcon}
            onPress={() => positionType === PositionType.HAVE_POSITION ? 
            navigation.navigate("deleted-position-detail", params) : dispatch(networkBusinessCardActions.setNetworkStandDetail({
            businessCardId: networkStand.businessCardId,
            stands: null
          }))}>
            <Icon name="delete" />
          </TouchableOpacity>
          <View style={positionType === PositionType.HAVE_POSITION ? 
          [
            BasicDetailBusinessCardStyle.havePosition,
            motivation ? {backgroundColor: motivation.motivationIcon.backgroundColor} : {backgroundColor: themeCusomer.colors.gray300}
          ]
          : BasicDetailBusinessCardStyle.noPosition}>
            <View style={[BasicDetailBusinessCardStyle.positionContent]}>
              <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom, BasicDetailBusinessCardStyle.positionRow]}>
                <Text style={[CustomerDetailScreenStyles.textBold]}>{translate(messages.positionLabel)}</Text>
                <TouchableOpacity onPress={() => setIsVisibleModal(true)}>
                  <Text style={CustomerDetailScreenStyles.textGray}>{standObject.key ? standObject.value : translate(messages.selectPositionValue)}</Text>
                </TouchableOpacity>
              </View>
              <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom, BasicDetailBusinessCardStyle.positionRow]}>
                <Text style={[CustomerDetailScreenStyles.textBold]}>{translate(messages.motivationLabel)}</Text>
                <TouchableOpacity onPress={() => setSsVisibleMotivationModal(true)}>
                  <Text style={CustomerDetailScreenStyles.textGray}>{motivationObject.key ? motivationObject.value : translate(messages.selectMotivationValue)}</Text>
                </TouchableOpacity>
              </View>
              <View style={[CustomerDetailScreenStyles.defaultRow]}>
                <Text style={[CustomerDetailScreenStyles.textBold, CustomerDetailScreenStyles.marginBottom10]}>{translate(messages.commentLabel)}</Text>
                <TextInput
                  style={CustomerDetailScreenStyles.textGray}
                  multiline={true}
                  numberOfLines={4}
                  onChangeText={(text) => setCommentValue(text)}
                  value={commentValue}
                  placeholder={translate(messages.commentPlaceHolder)}
                  />
              </View>
            </View>
            {positionType === PositionType.HAVE_POSITION ? 
              <TouchableOpacity style={[BasicDetailBusinessCardStyle.updatePositionBlock]}
                onPress={editPosition}
                disabled={disableBtn}
              >
                <Text>{translate(messages.editButton)}</Text>
              </TouchableOpacity>
              : <TouchableOpacity style={[BasicDetailBusinessCardStyle.updatePositionBlock]}
                  onPress={createPosition}
                >
                  <Text>{translate(messages.addButton)}</Text>
                </TouchableOpacity>
            }
          </View>
        </View>}
      </ScrollView>
      <Modal isVisible={isVisibleModal}
        backdropColor={theme.colors.blackDeep}
        style={SelectedPositionModalStyle.containerModal}
        onBackdropPress={() => setIsVisibleModal(false)}
        deviceWidth={screenWidth}
      >
        <SelectedPositionModal selectedPosition={onSelectedPosition} selectedValue={standObject}/>
      </Modal>
      <Modal isVisible={isVisibleMotivationModal}
        backdropColor={theme.colors.blackDeep}
        style={SelectedPositionModalStyle.containerModal}
        onBackdropPress={() => setSsVisibleMotivationModal(false)}
        deviceWidth={screenWidth}
      >
        <SelectedMotivationModal selectedMotivation={onSelectedMotivation} selectedValue={motivationObject}/>
      </Modal>
    </View>
  )
}
