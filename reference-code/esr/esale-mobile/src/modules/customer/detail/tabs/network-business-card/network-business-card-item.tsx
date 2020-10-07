import * as React from "react";
import { 
  View, Text, Image, TouchableOpacity, Dimensions, Alert, ScrollView
 } from "react-native";
import { CustomerDetailScreenStyles } from "../../customer-detail-style"
import { Icon } from "../../../../../shared/components/icon";
import Modal from 'react-native-modal';
import { NetworkBusinessCardStyle } from "./network-business-card-style";
import { useNavigation } from "@react-navigation/native";
import { DepartmentData, NetworkStandData } from "./network-business-card-repository";
import { businessCardsSelector, employeesSelector, standsSelector, motivationsSelector, tradingProductsSelector } from "./network-business-card-selector";
import { useSelector, useDispatch } from "react-redux";
import { networkBusinessCardActions } from "./network-business-card-reducer";
import { PositionType } from "../../enum";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { useState } from "react";
import { getLabelFormatByUserLanguage } from "../../../shared/utils/utils";

interface NetworkBusinessCardItemProps {
  // department data
  department: DepartmentData;

  // networkStand data
  networkStand: NetworkStandData
}

/**
 * Component for show network business item
 * 
 * @param param0 NetworkBusinessCardItemProps
 */
export const NetworkBusinessCardItem: React.FC<NetworkBusinessCardItemProps> = (
  {
    department,
    networkStand
  }
) => {
  const dispatch = useDispatch()
  const businessCards = useSelector(businessCardsSelector);
  const employees = useSelector(employeesSelector);
  const stands = useSelector(standsSelector);
  const motivations = useSelector(motivationsSelector);
  const tradingProducts = useSelector(tradingProductsSelector);
  const navigation = useNavigation();
  const screenWidth = Math.round(Dimensions.get('window').width);
  const [visibleInfoEmployees, setVisibleInfoEmployees] = useState(false);//flag open popup list detail

  // 120 value is width image business, 10 value is padding left, 30 value is padding hozizontal item, 30 value is width icon right arrow
  const employeeIconsScreenWidth = screenWidth - 120 - 10 - 30 - 30;

  // 35 value is width employee icon 
  const countIconsCanDisplay = Math.floor(employeeIconsScreenWidth / 35);

  // get business card by networkStand
  const businessCard = businessCards ? businessCards.filter((item) => {
    return item.businessCardId === networkStand.businessCardId
  }) : [];

  // get stand by networkStand
  const stand = stands ? stands.filter((item) => {
    return item.masterStandId === networkStand.stands?.standId;
  }) : [];

  // get motivation by networkStand
  const motivation = motivations ? motivations.filter((item) => {
    return item.motivationId === networkStand.stands?.motivationId;
  }) : [];

  // get tradingProduct by networkStand
  const tradingProduct = tradingProducts ? tradingProducts.filter((item) => {
    return item.tradingProductId === networkStand.stands?.tradingProductIds;
  }) : [];

  // get employees by businessCard
  const employeesData = employees ? employees.filter((item) => {
    let check = false;

    if (businessCard[0] && businessCard[0].employeeIds) {
      for (var i = 0; i < businessCard[0].employeeIds.length; i++) {
        if(item.employeeId === businessCard[0].employeeIds[i]) {
          check = true;
          break;
        }
      }
    }

    return check;
  }) : [];

  // params for pass to basic detail business card screen
  const params = {
    employees: employeesData,
    businessCard: businessCard.length === 1 ?  businessCard[0]: null,
    stand: stand.length === 1 ?  stand[0]: null,
    motivation: motivation.length === 1 ?  motivation[0]: null,
    tradingProduct: tradingProduct.length === 1 ?  tradingProduct[0]: null,
    departmentId: department.departmentId
  };

  return (<View>
    <TouchableOpacity onPress={() => {
      dispatch(networkBusinessCardActions.setPositionType(networkStand.stands === null ? PositionType.NOT_POSITION : PositionType.HAVE_POSITION));
      dispatch(networkBusinessCardActions.setMotivationBusinessCard({motivationId: motivation && motivation.length > 0 ? motivation[0].motivationId : null}));
      dispatch(networkBusinessCardActions.setNetworkStandDetail(networkStand));
      navigation.navigate("basic-detail-business-card", params)}
    }>
      {businessCard[0] && <View style={[CustomerDetailScreenStyles.rowIcon, CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <View style={NetworkBusinessCardStyle.businessCardBlock}>
            <View style={[NetworkBusinessCardStyle.businessCardLeft]}>
              {networkStand.stands !== null && <View style={[NetworkBusinessCardStyle.positionBlock, {backgroundColor: motivation[0]?.motivationIcon.backgroundColor}]}>
                <Image
                  style={NetworkBusinessCardStyle.positionIcon}
                  source={{
                    uri: motivation[0]?.motivationIcon.iconPath,
                  }}
                />
                <Text style={[NetworkBusinessCardStyle.positionLabel]}>{getLabelFormatByUserLanguage(stand[0]?.masterStandName)}</Text>
              </View>}
              <Image
                style={NetworkBusinessCardStyle.businessCardImage}
                source={{
                  uri: businessCard[0]?.businessCardImage?.businessCardImagePath,
                }}
              />
            </View>
            <View style={NetworkBusinessCardStyle.businessCardRight}>
              <Text style={NetworkBusinessCardStyle.grayText}>{businessCard[0]?.departmentName} {businessCard[0]?.position}</Text>
              <Text style={CustomerDetailScreenStyles.boildLabel}>{`${businessCard[0]?.firstName}${businessCard[0]?.lastName?" "+businessCard[0]?.lastName:""}`}</Text>
              <Text style={NetworkBusinessCardStyle.grayText}>{translate(messages.lastContactDate)}: {businessCard[0]?.lastContactDate}</Text>
              <Text style={NetworkBusinessCardStyle.grayText}>{translate(messages.receivedDate)}: {businessCard[0]?.receiveDate}</Text>
              {
              <View style={NetworkBusinessCardStyle.employeeImageBlock}>
                {countIconsCanDisplay > (employeesData ? employeesData.length : 0)
                ? employeesData.map((employee) => {
                  return <TouchableOpacity onPress={() => {Alert.alert("navigate to employee detail screen")}} key={employee.employeeId}>
                    <Image
                      style={NetworkBusinessCardStyle.employeeImage}
                      source={{
                        uri: employee.employeeImage.photoFilePath,
                      }}
                    />
                  </TouchableOpacity>
                })
                : 
                employeesData.map((employee, index) => {
                  
                  if (index < countIconsCanDisplay - 1) {
                    return <TouchableOpacity onPress={() => {Alert.alert("navigate to employee detail screen")}} key={employee.employeeId}>
                      <Image
                        style={NetworkBusinessCardStyle.employeeImage}
                        source={{
                          uri: employee.employeeImage.photoFilePath,
                        }}
                      />
                    </TouchableOpacity>
                      
                  } else if (index === countIconsCanDisplay - 1) {
                    return <View style={NetworkBusinessCardStyle.addedIconBlock} key={employee.employeeId}>
                      <Text style={NetworkBusinessCardStyle.addedIcon}
                       onPress={() => setVisibleInfoEmployees(true)}
                      >+{(employeesData ? employeesData.length : 0) - countIconsCanDisplay + 1}</Text>
                      </View>
                  }

                  return null;
                })
              }
              </View>
            }
            </View>
          </View>
          
          <View style={CustomerDetailScreenStyles.iconArrowBlock}>
            <Icon name="arrowRight" style={CustomerDetailScreenStyles.arrowRightIcon}/>
          </View>
        </View>}
      </TouchableOpacity>
      <Modal
        isVisible={visibleInfoEmployees}
        backdropColor={"rgba(0, 0, 0, 0.8)"}
        onBackdropPress={() => setVisibleInfoEmployees(false)}
        onBackButtonPress={() => setVisibleInfoEmployees(false)}
        style={NetworkBusinessCardStyle.popupConfirmContainer}
      >
        <TouchableOpacity activeOpacity={1} style={NetworkBusinessCardStyle.listEmployeesContent}>
          <ScrollView>
            {employeesData.map((employee) =>
              <View style={NetworkBusinessCardStyle.infoEmployeeContainer}>
                <View style={NetworkBusinessCardStyle.imageEmployeeContainer}>
                  {employee.employeeImage.photoFilePath !== '' ?
                    <Image style={NetworkBusinessCardStyle.imageEmployee} source={{ uri: employee.employeeImage.photoFilePath }} /> :
                    <View style={[NetworkBusinessCardStyle.imageEmployee, NetworkBusinessCardStyle.backgroundAvatar]}>
                      <Text style={NetworkBusinessCardStyle.imageName}>{employee.employeeName.charAt(0)}</Text>
                    </View>}
                </View>
                <View style={NetworkBusinessCardStyle.infoEmployeeTextContainer}>
                  <Text style={NetworkBusinessCardStyle.employeeNameText}
                    onPress={() => {
                      Alert.alert("navigate to employee detail screen");
                    }}>
                    {employee.employeeName}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
          <View style={NetworkBusinessCardStyle.closeButtonContainer}>
            <TouchableOpacity onPress={() => {
              setVisibleInfoEmployees(false);
            }}
              style={NetworkBusinessCardStyle.closeButton}
            >
              <Text style={NetworkBusinessCardStyle.closeButtonText}>
                {translate(messages.closeListEmployee)}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
    )
}
