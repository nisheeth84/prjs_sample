import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ScrollView,
  Image,
  // Alert as ShowError,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import _ from "lodash";
import {
  BusinessCardRegisterStyles,
  ModalSuggestionStyles,
} from "./business-card-register-style";
// import { Header } from "../../../shared/components/header";
import { translate } from "../../../config/i18n";
import { messages } from "./business-card-register-messages";
import { theme } from "../../../config/constants";
// import { dataGetBusinessCardSelector } from "../business-card-selector";
import { Icon } from "../../../shared/components/icon";
import { CommonStyles } from "../../../shared/common-style";
// import { ModalDepartmentSuggestion } from "./business-card-register-modal-department-suggestion";
// import { ModalEmployeeSuggestion } from "./business-card-register-modal-employee-suggestion";
import {
  CreateBusinessCardResponse,
  GetBusinessCardResponse,
  UpdateBusinessCardsResponse,
  createBusinessCard,
  getBusinessCard,
  updateBusinessCards,
  getCustomFieldsInfo,
} from "../business-card-repository";
// import { businessCardActions } from "../business-card-reducer";
import {
  typeInputRegister,
  fieldBelong,
  ControlType,
  FIELD_NAME,
  SelectFileMode,
  KeySearch,
  TypeSelectSuggest,
  TYPEMESSAGE,
  DefineFieldType,
} from "../../../config/constants/enum";
import { TEXT_EMPTY, FORMAT_DATE } from "../../../config/constants/constants";
import { businessCardDetailActions } from "../business-card-details/business-card-detail-reducer";

// import { D_BUSINESS_CARD_DETAIL } from "../business-card-details/business-card-dummy-data";
import {
  businessCardDetailSelector,
  businessCardBasicFieldInfoSelector,
} from "../business-card-details/business-card-detail-selector";
import { DynamicControlField } from "../../../shared/components/dynamic-form/control-field/dynamic-control-field";
import StringUtils from "../../../shared/util/string-utils";
import { EmployeeSuggestView } from "../../../shared/components/suggestions/employee/employee-suggest-view";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { getFirstItem } from "../../../shared/util/app-utils";
import { CommonMessage } from "../../../shared/components/message/message";
// import { format } from "react-string-format";
// import { responseMessages } from "../../../shared/messages/response-messages";
// import { errorCode } from "../../../shared/components/message/message-constants";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
// import Toast from "react-native-tiny-toast";
import { MultipleSelectWithSearchBox } from "../../../shared/components/multiple-select-with-search-box/multiple-select-search-box";

const styles = BusinessCardRegisterStyles;

const RECEIVER = {
  employeeSurname: TEXT_EMPTY,
  employeeName: TEXT_EMPTY,
  employeeIcon: {
    filePath: TEXT_EMPTY,
    fileName: TEXT_EMPTY,
  },
  employeeId: 0,
};

export const BusinessCardRegisterScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const authorization = useSelector(authorizationSelector);
  const businessCardDetail = useSelector(businessCardDetailSelector);
  const dataGetBusinessCard: any = getFirstItem(businessCardDetail);
  /**
   * data "Dynamic Control Field
   */
  // const businessCardDetails = useSelector(businessCardDetailSelector);
  // const businessCardDetail: any = getFirstItem(businessCardDetails);
  const basicInfo = useSelector(businessCardBasicFieldInfoSelector);
  const [isShowModal, setShowModal] = useState(false);
  // TODO  SEARCH
  // const [searchData, setSearchData] = useState({
  //   mode: SelectFileMode.MULTI,
  //   fieldLabel: TEXT_EMPTY,
  //   group: KeySearch.NONE,
  // });
  const [toastVisible, setToastVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [indexReceiver, setIndexReceiver] = useState(0);
  // const [image, setImage] = useState({ uri: TEXT_EMPTY });
  // const [imageName, setImageName] = useState(TEXT_EMPTY);
  // const [listImage, setListImage] = useState([]);
  const [firstName, setFirstName] = useState(TEXT_EMPTY);
  const [lastName, setLastName] = useState(TEXT_EMPTY);
  const [firstNameKana, setFirstNameKana] = useState(TEXT_EMPTY);
  const [lastNameKana, setLastNameKana] = useState(TEXT_EMPTY);
  const [department, setDepartment] = useState<any>("");
  const [jobTitle, setJobTitle] = useState(TEXT_EMPTY);
  const [postalCode, setPostalCode] = useState(TEXT_EMPTY);
  const [addressStreet, setAddressStreet] = useState(TEXT_EMPTY);
  const [buildingName, setBuildingName] = useState(TEXT_EMPTY);
  const [mail, setMail] = useState(TEXT_EMPTY);
  const [phone, setPhone] = useState(TEXT_EMPTY);
  const [cellphone, setCellphone] = useState(TEXT_EMPTY);
  const [validate, setValidate] = useState<Array<any>>([]);
  const [employeeNumber, setEmployeeNumber] = useState([1]);
  const [departmentModalShow, setDepartmentModalShow] = useState(false);

  const [receiverPerson, setReceiverPerson] = useState([
    {
      receiver: RECEIVER,
      date: TEXT_EMPTY,
    },
  ]);
  const [flag, setFlag] = useState(false);
  // const [campaign, setCampaign] = useState(TEXT_EMPTY);
  const [note, setNote] = useState(TEXT_EMPTY);
  const [customerName, setCustomerName] = useState(TEXT_EMPTY);
  // const [customerId, setCustomerId] = useState(-1);

  const getCustomFieldsInfoFunction = async () => {
    const dataCustomFieldsInfo = await getCustomFieldsInfo({
      fieldBelong: fieldBelong.BUSINESS_CARD,
    });
    if (dataCustomFieldsInfo) {
      if (dataCustomFieldsInfo.status === 200) {
        const newListField = dataCustomFieldsInfo.data.customFieldsInfo.sort(
          (a: any, b: any) => {
            return a.fieldOrder - b.fieldOrder;
          }
        );
        dispatch(
          businessCardDetailActions.getBusinessCardFieldInfo(newListField)
        );
      }
    }
  };

  // const paramsGeneral = {
  //   businessCardImageData: TEXT_EMPTY,
  //   businessCardImagePath: "",
  //   businessCardImageName: imageName,
  //   customerId,
  //   customerName: customerName || "",
  //   alternativeCustomerName: TEXT_EMPTY,
  //   firstName,
  //   lastName,
  //   firstNameKana,
  //   lastNameKana,
  //   position: jobTitle,
  //   departmentName: "",
  //   zipCode: postalCode,
  //   prefecture: "HN",
  //   addressUnderPrefecture: "HT",
  //   address: addressStreet,
  //   building: buildingName,
  //   emailAddress: mail,
  //   phoneNumber: phone,
  //   mobileNumber: cellphone,
  //   receivePerson: receiverPerson.map((el) => {
  //     return {
  //       employeeId: el.receiver.employeeId,
  //       receivedDate: el.date,
  //     };
  //   }),
  //   isWorking: flag ? 1 : 2,
  //   memo: note,
  //   saveMode: 1,
  // };

  /**
   * fill data editer
   */

  const fillDataBusinessCardHistoryDetail = () => {
    if (!dataGetBusinessCard) {
      return;
    }

    const {
      // customerId,
      customerName = "",
      departmentName,
      position,
      firstName,
      firstNameKana,
      lastName,
      lastNameKana,
      zipCode,
      address,
      building,
      emailAddress,
      phoneNumber,
      mobilePhone,
      // businessCardImagePath,
      // businessCardImageName,
      isWorking,
      memo,
      businessCardReceives,
    } = dataGetBusinessCard || {};

    const newRec = businessCardReceives?.map((el: any) => {
      return {
        receiver: {
          employeeId: el.employeeId,
          employeeName: el.employeeName,
          employeeSurname: el.employeeSurname,
          employeePhoto: el.employeePhoto,
        },
        date: moment(el.receiveDate).format(FORMAT_DATE.YYYY_MM_DD),
      };
    });

    // setImage({ uri: businessCardImagePath });
    // setImageName(businessCardImageName);
    setFirstName(firstName);
    setLastName(lastName);
    setFirstNameKana(firstNameKana);
    setLastNameKana(lastNameKana);
    setDepartment(departmentName);
    setJobTitle(position);
    setPostalCode(zipCode);
    setAddressStreet(address);
    setBuildingName(building);
    setMail(emailAddress);
    setPhone(phoneNumber);
    setCellphone(mobilePhone);
    setReceiverPerson(newRec);
    setFlag(isWorking === 1);
    setNote(memo);
    setCustomerName(customerName || "");
  };

  // const checkChanged = () => {};

  /**
   * handle error api getBusinessCard
   * @param response
   */

  const handleErrorGetBusinessCard = (response: GetBusinessCardResponse) => {
    switch (response.status) {
      case 200: {
        dispatch(
          businessCardDetailActions.getBusinessCardDetail(response?.data)
        );
        break;
      }
      case 400: {
        alert("Bad request!");
        break;
      }
      case 500: {
        alert("Server Error!");
        break;
      }
      default: {
        // ShowError.alert("Notify", "Error!");
      }
    }
  };

  /**
   * call api getBusinessCard
   * @param param
   */

  const getBusinessCardFunc = async () => {
    const { businessCardId } = route.params.data;
    const params = {
      businessCardId,
      mode: "detail",
    };
    const data = await getBusinessCard(params, {});
    if (data) {
      handleErrorGetBusinessCard(data);
    }
  };

  /**
   * handle error api CreateBusinessCard
   * @param response
   */

  const handleErrorCreateBusinessCard = (
    response: CreateBusinessCardResponse
  ) => {
    switch (response.status) {
      case 200: {
        setValidate([]);
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          navigation.goBack();
        }, 500);
        break;
      }
      case 400: {
        alert("Bad request!");
        break;
      }
      case 500: {
        alert("Server Error!");
        break;
      }
      default: {
        // ShowError.alert("Notify", "Error!");
      }
    }
  };

  /**
   * call api CreateBusinessCard
   * @param param
   */

  const createBusinessCardFunc = async () => {
    const formData = new FormData();

    const params = {
      businessCardImageData: TEXT_EMPTY,
      businessCardImagePath: TEXT_EMPTY,
      businessCardImageName: TEXT_EMPTY,
      customerId: 4,
      customerName: customerName || "",
      alternativeCustomerName: null,
      firstName,
      lastName,
      firstNameKana,
      lastNameKana,
      position: jobTitle,
      departmentName: department,
      zipCode: postalCode,
      address: addressStreet,
      building: buildingName,
      emailAddress: mail,
      phoneNumber: phone,
      mobileNumber: cellphone,
      receivePerson: [
        {
          employeeId: null,
          receiveDate: "2020-07-29T02:13:24.661Z",
        },
      ],
      // url: "www.softbrain.com",
      // receiverPerson.map((el) => {
      //   return {
      //     employeeId: el.receiver.employeeId,
      //     receivedDate: el.date,
      //   };
      // }),
      businessCardData: [],
      isWorking: 0, //flag ? 1 : 2,
      memo: note,
      saveMode: 1,
    };
    // const param = {
    //   receivePerson: [
    //     { employeeId: null, receiveDate: "2020-07-29T02:30:00.024Z" },
    //   ],
    //   saveMode: 1,
    //   firstName: "gghh",
    //   isWorking: 0,
    //   businessCardImagePath: null,
    // };
    formData.append("data", JSON.stringify(params));

    const data = await createBusinessCard(formData, {});
    if (data) {
      handleErrorCreateBusinessCard(data);
    }
  };

  /**
   * handle error api updateBusinessCards
   * @param response
   */

  const handleErrorUpdateBusinessCards = (
    response: UpdateBusinessCardsResponse
  ) => {
    switch (response.status) {
      case 200: {
        // do smt
        getBusinessCardFunc();
        setValidate([]);
        setToastVisible(true);
        setTimeout(() => {
          setToastVisible(false);
          navigation.goBack();
        }, 500);
        break;
      }
      case 400: {
        alert("Bad request!");
        break;
      }
      case 500: {
        alert("Server Error!");
        break;
      }
      default: {
        // ShowError.alert("Notify", "Error!");
      }
    }
  };

  /**
   * call api CreateBusinessCard
   * @param param
   */

  const updateBusinessCardsFunc = async () => {
    // const params = {
    //   businessCards: [paramsGeneral],
    // };
    const formDataUpdate = new FormData();
    const params = {
      businessCards: [
        {
          businessCardId: dataGetBusinessCard.businessCardId,
          businessCardImageData: TEXT_EMPTY,
          businessCardImagePath: TEXT_EMPTY,
          businessCardImageName: TEXT_EMPTY,
          customerId: 4,
          customerName: customerName || "",
          alternativeCustomerName: null,
          firstName,
          lastName,
          firstNameKana,
          lastNameKana,
          position: jobTitle,
          departmentName: department,
          zipCode: postalCode,
          address: addressStreet,
          building: buildingName,
          emailAddress: mail,
          phoneNumber: phone,
          mobileNumber: cellphone,
          receivePerson: [
            {
              employeeId: 1002,
              receiveDate: "2020-07-29T02:13:24.661Z",
            },
          ],
          // url: "www.softbrain.com",
          // receiverPerson.map((el) => {
          //   return {
          //     employeeId: el.receiver.employeeId,
          //     receivedDate: el.date,
          //   };
          // }),
          businessCardData: [],
          isWorking: 0, //flag ? 1 : 2,
          memo: note,
          saveMode: 1,
        },
      ],
    };

    formDataUpdate.append("data", JSON.stringify(params));

    // ShowError.alert("Notify", "Save Success");

    const data = await updateBusinessCards(formDataUpdate);
    if (data) {
      handleErrorUpdateBusinessCards(data);
    }
  };
  // call api get  business card detail
  useEffect(() => {
    const { screen } = route.params.data;
    if (screen == "Editer") {
      getBusinessCardFunc();
      return;
    }
    getCustomFieldsInfoFunction();
    // dispatch(
    //   businessCardDetailActions.getBusinessCardDetail(
    //     D_BUSINESS_CARD_DETAIL.data
    //   )
    // );
  }, []);

  useEffect(() => {
    const { screen } = route.params.data;
    if(screen==="Editer"){
      fillDataBusinessCardHistoryDetail();
      return;
    }
    // switch (screen) {
    //   case "Editer":
    //     fillDataBusinessCardHistoryDetail();
    //     break;
    //   default:
    //     break;
    // }
  }, [dataGetBusinessCard]);

  /**
   * toggle isWorking
   */

  const toggleSwitch = () => {
    setFlag(!flag);
  };

  /**
   * toggle modal department
   */

  const toggleModal = (/*mode: number, fieldLabel: string, group: number*/) => {
    setShowModal(!isShowModal);
    // setSearchData({
    //   mode,
    //   fieldLabel,
    //   group,
    // });
  };

  /**
   * toggle modal date picker
   */

  const toggleDatePicker = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  /**
   * handle Confirm Date
   * @param date
   */

  const handleConfirmDate = (date: any) => {
    toggleDatePicker();
    const newRec = [...receiverPerson];
    newRec[indexReceiver].date = moment(date).format(FORMAT_DATE.YYYY_MM_DD);
    setReceiverPerson(newRec);
  };
  /**
   * handle suggestion
   * @param fieldId
   * @param text
   */

  const handleSuggestionEmployee = (data: any) => {
    if (data?.length === 0) return;
    const newRec = [...receiverPerson];
    newRec[indexReceiver].receiver = data[0].employee;
    setReceiverPerson(newRec);
  };

  /**
   * change textinput
   * @param type
   * @param text
   */

  const onChangText = (field: any, text: string) => {
    if (field.modifyFlg <= 1 && _.isEmpty(text)) {
      validate.push(field.fileName);
    }
    const fieldId = field.fieldId;
    switch (fieldId) {
      case typeInputRegister.firstName:
        setFirstName(text);
        break;
      case typeInputRegister.lastName:
        setLastName(text);
        break;
      case typeInputRegister.firstNameKana:
        setFirstNameKana(text);
        break;
      case typeInputRegister.lastNameKana:
        setLastNameKana(text);
        break;
      case typeInputRegister.emailAddress:
        setMail(text);
        break;
      // case typeInputRegister.departmentName:
      //   setDepartment(text);
      //   break;
      case typeInputRegister.phoneNumber:
        setPhone(text);
        break;
      case typeInputRegister.mobileNumber:
        setCellphone(text);
        break;
      case typeInputRegister.memo:
        setNote(text);
        break;
      default:
        break;
    }
  };

  /**
   * show modal suggestion, date picker
   * @param type
   * @param index
   */

  const pressFragmentModal = (type: string, index: number) => {
    switch (type) {
      case typeInputRegister.customerName:
        toggleModal(/*
          SelectFileMode.SINGLE,
          translate(messages.customerName),
          KeySearch.EMPLOYEE
          */
        );
        break;
      case typeInputRegister.receiver:
        setIndexReceiver(index);
        toggleModal(/*
          SelectFileMode.SINGLE,
          translate(messages.receiver),
          KeySearch.EMPLOYEE
          */
        );
        break;
      case typeInputRegister.date:
        setIndexReceiver(index);
        toggleDatePicker();
        break;
      default:
        break;
    }
  };

  // const handleSuggestionDepartment = (field: any) => {};

  const renderFragmentModal = (
    type: string,
    title: string,
    placeholder: string,
    value: string,
    style?: ViewStyle,
    index?: number
  ) => {
    const indexx = index || 0;
    if (
      type === typeInputRegister.receiver &&
      receiverPerson[indexx].receiver.employeeId !== 0
    ) {
      const { employeeName, employeeIcon } = receiverPerson[indexx].receiver;
      return (
        <View style={[styles.viewFragment, style || null]}>
          <Text style={styles.txt}>{title}</Text>
          <View style={styles.padding} />
          <View style={styles.btnItemEmp}>
            <View style={styles.directionRow}>
              <Image
                source={{
                  uri: employeeIcon.filePath,
                }}
                style={ModalSuggestionStyles.image}
              />
              <Text style={ModalSuggestionStyles.txt}>{employeeName}</Text>
            </View>
            <TouchableOpacity
              hitSlop={styles.hitslop}
              style={styles.btnClose}
              onPress={() => {
                const newRec = [...receiverPerson];
                newRec[indexx].receiver = RECEIVER;
                setReceiverPerson(newRec);
              }}
            >
              <Icon name="close" />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={[styles.viewFragment, style || null]}>
        <Text style={styles.txt}>{title}</Text>
        <View style={styles.padding} />
        <TouchableOpacity
          onPress={() => pressFragmentModal(type, indexx)}
          hitSlop={CommonStyles.hitSlop}
        >
          <Text style={value ? styles.txt : styles.txtPlaceholder}>
            {value || placeholder}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * press Regist - Save
   */

  const onRightPress = () => {
    const { screen } = route.params.data;
    if (!firstName || firstName?.length === 0) {
      setValidate(["first_name"]);
    }
    if(screen==="Editer"){
      updateBusinessCardsFunc();
    } else{
      createBusinessCardFunc();
    }
    // switch (screen) {
    //   case "Editer":
    //     updateBusinessCardsFunc();
    //     break;
    //   default:
    //     createBusinessCardFunc();
    //     break;
    // }
  };

  const findExtensionItem = (fieldName: any, extensionData: any) => {
    if ((extensionData || []).length === 0) {
      return null;
    }
    const item = extensionData.find((el: any) => {
      return el.key === fieldName;
    });
    return item?.value || null;
  };

  const getElementStatus = (field: any) => {
    if (route?.params?.data?.screen !== "Editer") {
      return {
        fieldValue: null,
      };
    }
    return {
      fieldValue: field.isDefault
        ? dataGetBusinessCard[StringUtils.snakeCaseToCamelCase(field.fieldName)]
        : findExtensionItem(
            field.fieldName,
            dataGetBusinessCard.businessCardData || []
          ),
    };
  };

  const handleFieldType99 = (fieldName: string) => {
    switch (fieldName) {
      case FIELD_NAME.isWorking:
        return (
          <View style={styles.viewFragment}>
            <Text style={styles.txt}>{translate(messages.flag)}</Text>
            <View style={styles.padding} />
            <View style={[CommonStyles.row, styles.viewSwitch]}>
              <TextInput
                style={styles.txt}
                placeholder={translate(messages.inOffice)}
                editable={false}
              />
              <Switch
                trackColor={{
                  false: theme.colors.gray100,
                  true: theme.colors.blue200,
                }}
                thumbColor={theme.colors.white}
                ios_backgroundColor={theme.colors.gray100}
                onValueChange={toggleSwitch}
                value={flag}
              />
            </View>
          </View>
        );
      case FIELD_NAME.alternativeCustomerName:
        return renderFragmentModal(
          typeInputRegister.customerName,
          translate(messages.customerName),
          translate(messages.customerName) + translate(messages.select),
          customerName || ""
        );

      default:
        return null;
      // renderFragment(
      //   typeInputRegister.campaign,
      //   translate(messages.campaign),
      //   translate(messages.campaign) + translate(messages.enter),
      //   campaign
      // );
    }
  };

  const handleAddEmployee = () => {
    const newArr = [...employeeNumber];
    newArr.push(1);
    setEmployeeNumber(newArr);
  };

  const getReceiveDateFieldInfo = () => {
    return basicInfo.find((el: any) => {
      return el.fieldName === FIELD_NAME.receiveDate;
    });
  };

  const renderItemCreate = (item: any) => {
    // TODO LookUp dynamic field cause crash, intergrate after fix
    if (
      item.availableFlag === 0 ||
      item.modifyFlag === 0 ||
      item.fieldType.toString() === DefineFieldType.LOOKUP
    ) {
      return;
    }
    if (item.fieldName === FIELD_NAME.employeeId) {
      return (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e5e5e5",
            borderRadius: theme.borderRadius,
            margin: theme.space[2],
          }}
        >
          {employeeNumber.map(() => {
            return (
              <View>
                <View style={{ padding: theme.space[2] }}>
                  <EmployeeSuggestView
                    updateStateElement={(data) =>
                      handleSuggestionEmployee(data)
                    }
                    fieldLabel={StringUtils.getFieldLabel(
                      item,
                      "fieldLabel",
                      authorization.languageCode
                    )}
                    typeSearch={TypeSelectSuggest.SINGLE}
                    groupSearch={KeySearch.EMPLOYEE}
                    invisibleLabel={false}
                  />
                </View>
                <View
                  style={{
                    borderTopWidth: 0.8,
                    borderBottomWidth: 0.8,
                    padding: theme.space[2],
                    borderColor: "#e5e5e5e5",
                  }}
                >
                  <DynamicControlField
                    controlType={ControlType.ADD_EDIT}
                    fieldInfo={getReceiveDateFieldInfo()}
                    extensionData={dataGetBusinessCard?.businessCardData || []}
                    elementStatus={getElementStatus(item)}
                    updateStateElement={(key,/* field,*/ itemEdit) => {
                      onChangText(key, itemEdit);
                    }}
                  />
                </View>
              </View>
            );
          })}

          <TouchableOpacity
            onPress={handleAddEmployee}
            style={{
              borderRadius: theme.space[4],
              flex: 1,
              alignItems: "center",
              borderWidth: 0.8,
              paddingVertical: theme.space[3],
              margin: theme.space[4],
              borderColor: "#e5e5e5e5",
            }}
          >
            <Text>受取人を追加</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.fieldName === FIELD_NAME.receiveDate) {
      return;
    }
    if (item.fieldName === FIELD_NAME.departmentName) {
      return (
        <View style={CommonStyles.generalInfoItem}>
          <View>
            <Text style={styles.txt}>
              {StringUtils.getFieldLabel(
                item,
                "fieldLabel",
                authorization.languageCode
              )}
            </Text>
            <View style={styles.padding} />
            <TouchableOpacity
              onPress={() => setDepartmentModalShow(true)}
              hitSlop={CommonStyles.hitSlop}
            >
              <Text style={styles.txt}>
                {StringUtils.getFieldLabel(
                  item,
                  "fieldLabel",
                  authorization.languageCode
                ) + " choose"}
              </Text>
            </TouchableOpacity>
            {!!department && (
              <View style={styles.viewItemSelected}>
                <Text
                  style={[styles.txt, { marginHorizontal: theme.space[3] }]}
                >
                  {department}
                </Text>
                <TouchableOpacity
                  style={styles.viewIcon}
                  onPress={() => setDepartment("")}
                >
                  <Icon name="close" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      );
    }
    if (item.fieldType !== 99) {
      return (
        <TouchableOpacity
          style={CommonStyles.generalInfoItem}
          disabled={item.fieldId !== typeInputRegister.departmentName}
          onPress={() =>
            toggleModal(/*
              SelectFileMode.SINGLE,
              translate(messages.departmentName),
              KeySearch.DEPARTMENT
              */
            )
          }
        >
          <DynamicControlField
            controlType={ControlType.ADD_EDIT}
            fieldInfo={item}
            errorInfo={
              validate.includes(item.fieldName) ? { errorMsg: "error" } : {}
            }
            extensionData={dataGetBusinessCard?.businessCardData || []}
            elementStatus={getElementStatus(item)}
            updateStateElement={(key, /*field,*/ itemEdit) => {
              onChangText(key, itemEdit);
            }}
          />
        </TouchableOpacity>
      );
    }

    return handleFieldType99(item.fieldName);
  };

  const handleSubmitModal = (item: any) => {
    if (!!item) {
      setDepartment(item.departmentName);
    }
    setDepartmentModalShow(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBarModal
        onClose={() => navigation.goBack()}
        title={
          route.params.data.screen === "Editer"
            ? translate(messages.titleEdit)
            : translate(messages.title)
        }
        titleButtonCreate={
          route.params.data.screen === "Editer"
            ? translate(messages.save)
            : translate(messages.registration)
        }
        // isDisableButtonCreate={true}
        onCreate={() => onRightPress()}
      />
      <View
        style={{ paddingHorizontal: theme.space[3], marginTop: theme.space[2] }}
      >
        {validate.length > 0 && (
          <CommonMessage
            type={TYPEMESSAGE.ERROR}
            content={"入力必須項目です。値を入力してください。"}
            widthMessage="100%"
          />
        )}
      </View>

      {/* Dynamic Control Field */}
      <ScrollView>
        {basicInfo.map((item) => renderItemCreate(item))}
      </ScrollView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={moment(receiverPerson[indexReceiver].date || undefined).toDate()}
        onConfirm={handleConfirmDate}
        onCancel={toggleDatePicker}
      />
      {toastVisible && (
        <View
          style={{
            alignSelf: "center",
            position: "absolute",
            top: theme.space[8],
            width: "90%",
          }}
        >
          <CommonMessage
            type={TYPEMESSAGE.SUCCESS}
            content={"登録完了しました。"}
            widthMessage="100%"
          />
        </View>
      )}
      <MultipleSelectWithSearchBox
        modalVisible={departmentModalShow}
        onSubmitModal={handleSubmitModal}
      />
    </SafeAreaView>
  );
};
