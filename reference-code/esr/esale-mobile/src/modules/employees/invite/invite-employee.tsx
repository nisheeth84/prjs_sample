
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, Text, ActivityIndicator, TouchableHighlight, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { AppbarCommon } from "../../../shared/components/appbar/appbar-common";
import { Icon } from "../../../shared/components/icon";
import { FormInviteEmployee } from "./invite-employee-form-invite";
import { InviteEmployeeStyles } from "./invite-employee-styles";
import { translate } from "../../../config/i18n";
import { messages } from "./invite-employee-messages";
import { useNavigation } from "@react-navigation/native";
import { Package } from "./invite-employee-repository";
import { inviteEmployeeActions, Employee, Errors, Department } from "./invite-employee-reducer";
import {
  initializeInviteModal,
  inviteEmployee,
  InviteEmployees
} from "./invite-employee-repository";
import moment from "moment";
import { inviteEmployeeConst } from "./invite-employee-constants";
import { ModalDirtycheckButtonBack } from "../../../shared/components/modal/modal";
import Modal from 'react-native-modal';
import _ from "lodash";
import { Error } from '../../../shared/components/message/message-interface';
import { responseMessages } from "../../../shared/messages/response-messages";
import { TypeMessage } from "../../../config/constants/enum";
import { format } from 'react-string-format';
import { errorCode } from "../../../shared/components/message/message-constants";
import { CommonMessage } from "../../../shared/components/message/message";
/**
 * Invite employee screen
 */
export const InviteEmployee = () => {
  const dispatch = useDispatch();
  const [employeesInviteInitial, setEmployeesInviteInitial] = useState<any>();
  const [listPackage, setListPackage] = useState<Package[]>([]);
  const navigation = useNavigation();
  const [isDisableSendButton, setDisableSendButton] = useState(false);
  // const [messageError, setMessageError] = useState<string[]>([]);
  const [isVisibleDirtycheck, setIsVisibleDirtycheck] = useState(false);
  const [isShowLoading, setIsShowLoading] = useState(false);
  const [employeesInvite, setEmployeesInvite] = useState<Employee[]>([{
    surname: '',
    name: '',
    emailAddress: '',
    departments: [],
    isAccessContractSite: false,
    isAdmin: false,
    package: [],
    updateTime: moment().format("YYYY/MM/DD hh:mm:ssss")
  }]);
  const [lisMessageRessponse, setListMessageRessponse] = useState<Error[]>([]);
  const [listDepartment, setListDepartment] = useState<Department[]>([]);
  const [onPressButton, setOnPressButton] = useState(true);
  const [keyBoard, setKeyBoard] = useState(false);
  //const [employeeList, setEmployeeList] = useState<>();
  /**
   * Hanlde error when call api invite employee
   * @param response 
   */
  const handleErrorInviteEmployee = (response: InviteEmployees) => {
    switch (response?.status) {
      case inviteEmployeeConst.errServerError: {
        // If have error
        if (response?.data?.parameters?.extensions?.errors) {
          hanldeErrorRessponse(response?.data?.parameters?.extensions?.errors);
        } else {
          // Set error
          lisMessageRessponse.push({
            error: format(translate(responseMessages[errorCode.errCom0001]), ...[]),
            type: TypeMessage.ERROR
          })
        }
        break;
      }
      // Case success, transmission ressponse to invite-employee-confirm
      case inviteEmployeeConst.succcess: {
        if (response?.data && !response.data?.parameters) {
          dispatch(inviteEmployeeActions.setErrorRessponse([]));
          // Tranform
          navigation.navigate("invite-employee-confirm", response.data.employees);
        }
        break;
      }
      default: {
        // Set error
        lisMessageRessponse.push({
          error: format(translate(responseMessages[errorCode.errCom0001]), ...[]),
          type: TypeMessage.ERROR
        })
        break;
      }
    }
  };

  /**
   * Function inviteEmployees call
   */
  const inviteEmployeeCall = async () => {
    // show loading indicator
    setIsShowLoading(true);
    setListMessageRessponse([]);
    // Set disale button
    setDisableSendButton(true);
    // Set data transmisson to query queryGetBasicInformation
    const employeesSubmit = employeesInvite?.map((e) => {
      const item = {
        employeeSurname: e.surname,
        employeeName: e.name,
        email: e.emailAddress,
        departmentIds: e.departments,
        isAccessContractSite: e.isAccessContractSite,
        packageIds: e.package,
        isAdmin: e.isAdmin
      };
      return item;
    });
    // Use query GetBasicInformation, button Send mail
    const response = await inviteEmployee(employeesSubmit);
    // Have ressponse
    if (response) {
      // Set Enable button Send
      setDisableSendButton(false);
      // Have error, set data error to store
      if (response.data?.parameters) {
        dispatch(inviteEmployeeActions.setErrorRessponse({ data: response.data.parameters?.extensions?.errors }));
      }
      // Proceccing errror
      handleErrorInviteEmployee(response);
    }
    // hide loading indicator
    setIsShowLoading(false);
  };

  /**
   * Call API get data initializeInviteModal, first time go to the screen
   */
  async function getDataModal() {

    // Call API initializeInviteModal
    const response = await initializeInviteModal({});
    if (response) {
      // Get departments from ressponse API  initializeInviteModal
      // and set data to reducer setSelectDepartment
      const departments = response.data?.departments !== null ? response.data.departments.map((item) => {
        const tempItem = {
          departmentId: item.departmentId,
          departmentName: item.departmentName,
        };
        return tempItem;
      }) : [];
      setListDepartment(departments);
      dispatch(inviteEmployeeActions.setSelectDatainitializeInvite({ data: departments, type: inviteEmployeeConst.department }));

      // Get packages from ressponse API initializeInviteModal
      // and set data to reducer 
      const packages = response.data?.packages !== null ? response.data.packages.map((item) => {
        const tempItem = {
          packageId: item.packageId,
          packageName: item.packageName,
          remainPackages: item.remainPackages,
        };
        return tempItem;
      }) : [];
      setListPackage(packages);
      dispatch(inviteEmployeeActions.setSelectDatainitializeInvite({ data: packages, type: inviteEmployeeConst.package }));
    }
  }
  /**
   * Define hanlde error ressponse
   */
  const hanldeErrorRessponse = ((errorRessponse: Errors[]) => {
    const listMessageError: Error[] = [];
    let messageError: string[] = [];
    let listEmailError0004: string[] = [];
    errorRessponse.forEach(element => {
      switch (element.errorCode) {
        case errorCode.errEmp0002:
          let errorParam: string[] = [];
          errorParam.push(employeesInvite[element.rowId].emailAddress);
          // Set error
          listMessageError.push({
            error: format(translate(responseMessages[element.errorCode]), ...errorParam),
            type: TypeMessage.ERROR
          });
          break;
        case errorCode.errEmp0003:
          let errorParam003: string[] = [];
          element.departmentsId && element.departmentsId.forEach(id => {
            const deparment = listDepartment.find(item => item.departmentId.toString() === id.toString());
            deparment && errorParam003.push(deparment.departmentName);
          });
          // Set error
          listMessageError.push({
            error: translate(responseMessages[element.errorCode]).replace("{0}", errorParam003.toString()),
            type: TypeMessage.ERROR
          })
          break;
        case errorCode.errEmp0004:
          listEmailError0004.push(employeesInvite[element.rowId].emailAddress);
          break;
        case errorCode.errEmp0016:
          let tempArrayMessage: string = translate(responseMessages[errorCode.errEmp0016]);
          listPackage.forEach(elementPackage => {
            if (elementPackage.packageId === element.rowId) {
              tempArrayMessage += "\n"
                + elementPackage.packageName
                + translate(messages.inviteEmployeePackageConnect)
                + elementPackage.remainPackages
                + translate(messages.inviteEmployeeLicense)
            }
          });
          // Set error
          listMessageError.push({
            error: tempArrayMessage,
            type: TypeMessage.ERROR
          })
          break;
        default:
          // Check dublicate error code
          if (!messageError.includes(element.errorCode)) {
            messageError.push(element.errorCode);
            let errorParams = element.errorParam ?? []
            let type = TypeMessage.INFO;
            if (element.errorCode.includes(TypeMessage.ERROR)) {
              type = TypeMessage.ERROR;
            } else if (element.errorCode.includes(TypeMessage.WARNING)) {
              type = TypeMessage.WARNING;
            }
            // Set error
            listMessageError.push({
              error: format(translate(responseMessages[element.errorCode]), ...errorParams),
              type: type
            })
            break;
          } else {
            break;
          }
      }
    });
    if (listEmailError0004.length > 0) {
      // Set error
      listMessageError.push({
        error: format(translate(responseMessages[errorCode.errEmp0004]), listEmailError0004.join(',')),
        type: TypeMessage.ERROR
      })
    }
    setListMessageRessponse(listMessageError);
  })
  useEffect(() => {
    getDataModal();
    setEmployeesInviteInitial(_.cloneDeep(employeesInvite));
    dispatch(inviteEmployeeActions.setErrorRessponse([]));
  }, []);

  const updateDataInvite = (position: number, employee: Employee) => {
    const employeeNew = new Array();
    employeeNew.push(...employeesInvite);
    employeeNew[position] = employee;
    setEmployeesInvite(employeeNew);
  }

  const deleteDataInvite = (position: number) => {
    if (employeesInvite.length === 1) return;
    let employeeNew = employeesInvite.filter(
      (_, index) => index !== position);
    setEmployeesInvite(employeeNew);
    // Clear error
    //    setMessageError([]);
    dispatch(inviteEmployeeActions.setErrorRessponse([]));
  }

  /**
   * Define function add form invite
   */
  const handleAddMember = () => {
    let newEmployee = {
      surname: '',
      name: '',
      emailAddress: '',
      departments: employeesInvite.length > 0 ? [...employeesInvite[0].departments] : [],
      isAccessContractSite: employeesInvite.length > 0 ? employeesInvite[0].isAccessContractSite : false,
      isAdmin: employeesInvite.length > 0 ? employeesInvite[0].isAdmin : false,
      package: employeesInvite.length > 0 ? [...employeesInvite[0].package] : [],
      updateTime: moment().format("YYYY/MM/DD hh:mm:ssss")
    };
    let newListEmployee = [newEmployee, ...employeesInvite];
    setEmployeesInvite(newListEmployee);
    dispatch(inviteEmployeeActions.setErrorRessponse([]));
    setListMessageRessponse([]);
  };

  const dirtycheck = () => {
    return !_.isEqual(employeesInvite, employeesInviteInitial);
  }

  const onHandleBack = () => {
    if (dirtycheck()) {
      setIsVisibleDirtycheck(true);
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={InviteEmployeeStyles.container}>
      <View style={{ paddingBottom: (Platform.OS === "ios" && keyBoard && employeesInvite.length === 1) ? "55%" : 0 }}>
        <ScrollView>
          <AppbarCommon
            title={translate(messages.inviteEmployeeTitle)}
            buttonText={translate(messages.inviteEmployeeSend)}
            buttonType="complete"
            leftIcon="close"
            onPress={() => inviteEmployeeCall()}
            handleLeftPress={onHandleBack}
            buttonDisabled={isDisableSendButton}
          />
          <View style={InviteEmployeeStyles.wrapAlert}>
            <View style={InviteEmployeeStyles.inviteMessageBox}>
              <View style={InviteEmployeeStyles.imageMessageBox}>
                <Icon
                  name="information"
                  style={InviteEmployeeStyles.iconStyle}
                />
              </View>
              <View style={InviteEmployeeStyles.viewContentMessageBox}>
                <Text style={InviteEmployeeStyles.alertText}>
                  {translate(messages.inviteEmployeeAlert)}
                </Text>
                <FlatList
                  data={listPackage}
                  renderItem={
                    ({ item: itemPackage }) => (
                      <Text>{itemPackage.packageName}{translate(messages.inviteEmployeePackageConnect)}
                        <Text style={{ fontWeight: "bold" }}>
                          {itemPackage.remainPackages}</Text>
                        {translate(messages.inviteEmployeePackage)}
                      </Text>
                    )
                  }
                >
                </FlatList>
              </View>
            </View>
          </View>
          {lisMessageRessponse.length > 0 &&
            <View style={InviteEmployeeStyles.viewRegionErrorShow}>
              {
                lisMessageRessponse?.map((error: Error, index: number) => (
                  <CommonMessage key={index} content={error.error} type={error.type} ></CommonMessage>
                ))
              }
            </View>
          }
          <View style={InviteEmployeeStyles.wrapButton}>
            <TouchableHighlight
              onHideUnderlay={() => setOnPressButton(true)} //Called immediately after the underlay is hidden.
              onShowUnderlay={() => setOnPressButton(false)} //Called immediately after the underlay is shown.
              underlayColor={"#d6e3f3"} //The color of the underlay that will show through when the touch is active.
              onPress={handleAddMember}
              style={onPressButton ? InviteEmployeeStyles.button : InviteEmployeeStyles.buttonPress}
              delayPressOut={Platform.OS === "ios" ? 80 : 1} //Delay in ms, from the release of the touch, before onPressOut is called.
            >
              <View style={InviteEmployeeStyles.viewButton}>
                <Text style={onPressButton ? InviteEmployeeStyles.text : InviteEmployeeStyles.textPress}>{translate(messages.inviteEmployeeAddMember)}</Text>
              </View>
            </TouchableHighlight>
          </View>

          {
            employeesInvite?.map((employee: Employee, index: number) => (
              <FormInviteEmployee
                key={employee.updateTime || index.toString()}
                position={index}
                employee={employee}
                updateListInvite={updateDataInvite}
                deleteInvite={deleteDataInvite}
                length={employeesInvite.length}
                onFocus={()=> setKeyBoard(true)}
                onEndEdit={()=> setKeyBoard(false)}
              />
            ))}
        </ScrollView>
        <Modal isVisible={isVisibleDirtycheck}>
          <ModalDirtycheckButtonBack
            onPress={() => { setIsVisibleDirtycheck(false) }}
            onPressBack={() => { navigation.goBack() }}
          />
        </Modal>
        {isShowLoading &&
          <View style={InviteEmployeeStyles.iconLoading}>
            <ActivityIndicator animating={true} size="large" />
          </View>
        }
      </View>
    </SafeAreaView>
  );
};
