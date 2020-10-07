import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import { useSelector } from "react-redux";
import { Icon } from "../../../shared/components/icon";
import { Input } from "../../../shared/components/input";
import { ButtonInput } from "../../../shared/components/button-input";
import { FormInviteEmployeeProp } from "./invite-employee-interfaces";
import { inviteEmployeeConst, errorCode } from "./invite-employee-constants"
import {
  InviteEmployeeFormInviteStyles,
  InviteEmployeeStyles,
} from "./invite-employee-styles";
import { translate } from "../../../config/i18n";
import { messages } from "./invite-employee-messages";
import { InviteDepartmentModal } from "./invite-employee-department-modal";
import { InviteEmployeePackageModal } from "./invite-employee-package-modal";
import { InviteEmployeeDepartmentModalStyles } from "./invite-employee-styles";
import { listPackageSelector, listDepartmentSelector, listRessponseErrorSelecttor } from "./invite-employee-selector";


/**
 * Screen form invite
 * @param param0 
 */
export const FormInviteEmployee: React.FunctionComponent<FormInviteEmployeeProp> = ({
  employee, position, updateListInvite, deleteInvite, length, onFocus, onEndEdit
}) => {
  const [expand, setExpand] = useState(false);
  const [openModalDepartment, setOpenModalDepartment] = useState(false);
  const [openModalPackage, setOpenModalPackage] = useState(false);
  const [checkedLoginContract, setCheckedLoginContract] = useState(false);
  const [checkedAdmin, setCheckedAdmin] = useState(false);
  const [listPackageName, setListPackageName] = useState("");
  const [listDepartmentName, setListDepartmentName] = useState("");
  const [errSurName, setErrSurName] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errPackage, setErrPackage] = useState(false);
  const [errDepartment, setErrorDepartment] = useState(false);
  const errorRessponse = useSelector(listRessponseErrorSelecttor);
  const listDepartment = useSelector(listDepartmentSelector);
  const listPackage = useSelector(listPackageSelector);
  const [email, setEmail] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState<number[]>([]);
  const [packageInvite, setPackageInvite] = useState<number[]>([]);

  /**
   * load data from employee
   */
  useEffect(() => {
    setSurname(employee.surname);
    setName(employee.name);
    setEmail(employee.emailAddress);
    setDepartment([...employee.departments]);
    setPackageInvite([...employee.package]);
    setCheckedLoginContract(employee.isAccessContractSite);
    setCheckedAdmin(employee.isAdmin);
  }, [employee])
  /**
   * Funtion set CheckedLoginContract, IsAdmin
   * @param data 
   * @param type name controll
   */
  const handleSelectCheckedLoginContract = (data: boolean, type: string) => {
    // Add isLoginContract to employee
    switch (type) {
      case inviteEmployeeConst.admin:
        employee.isAdmin = data;
        break;
      case inviteEmployeeConst.loginContract:
        employee.isAccessContractSite = data;
        break;
      default:
        break;
    }
    updateListInvite(position, employee);
  };
  // updateListInvite(position, employee);

  /**
   * Set list name Department selected
   */
  const handleSetListDepartmentName = () => {
    if (department) {
      let tempListDepartmentName = "";
      for (let index = 0; index < department.length; index++) {
        const departmentSelected = listDepartment.find(e => e.departmentId === department[index]);
        if (index == 0) {
          tempListDepartmentName = departmentSelected?.departmentName || "";
        } else {
          tempListDepartmentName += (inviteEmployeeConst.comma + departmentSelected?.departmentName)
        }
      }
      setListDepartmentName(tempListDepartmentName);
      employee.departments = department;
      updateListInvite(position, employee);
    }
  }
  /**
   * Set list name PackageName selected
   */
  const handleSetListPackageName = () => {
    if (packageInvite) {
      let tempListPackageName = "";
      for (let index = 0; index < packageInvite.length; index++) {
        const packageSelected = listPackage.find(e => e.packageId === packageInvite[index]);
        if (index == 0) {
          tempListPackageName = packageSelected?.packageName || "";
        } else {
          tempListPackageName += (inviteEmployeeConst.comma + packageSelected?.packageName)
        }
      }
      setListPackageName(tempListPackageName);
      employee.package = packageInvite;
      updateListInvite(position, employee);
    }
  }
  /**
   * Define fuction handleErrorSurname, if have error Surname set true
   */
  const handleErrorSurname = () => {
    setErrSurName(false);
    if (errorRessponse) {
      let tempErrSurName = errorRessponse.find(item => item.rowId === position && item.item === inviteEmployeeConst.employeeSurname)
      if (tempErrSurName) {
        setErrSurName(true);
      }
    }
  }
  /**
   * If have error email set true, else false
   */
  const hanldeErorMail = () => {
    setErrEmail(false);
    if (errorRessponse) {
      let tempErrSurName = errorRessponse.find(item => item.rowId === position && item.item === inviteEmployeeConst.email)
      if (tempErrSurName) {
        setErrEmail(true);
      }
    }
  }
  /**
   * if department error , set setErrorDepartment = true
   */
  const handleErrorDepartment = () => {
    setErrorDepartment(false);
    if (errorRessponse) {
      let tempErrorDepartment = errorRessponse.find(item => item.rowId === position && item.item === inviteEmployeeConst.departments)
      if (tempErrorDepartment) {
        setErrorDepartment(true);
      }
    }
  }
  /**
   * Process ERR_EMP_0016
   */
  const handleErrorPackage = () => {
    setErrPackage(false);
    if (errorRessponse) {
      errorRessponse.forEach(element => {
        // If employee include package error and errorCode === ERR_EMP_0016
        if (employee.package.includes(listPackage[element.rowId]?.packageId) && element.errorCode === errorCode.errEmp0016) {
          setErrPackage(true);
        }
      });

    }
  }
  useEffect(() => {
    // Call handleSetListPackageName
    handleSetListPackageName();
    // Call handleSetListDepartmentNam
    handleSetListDepartmentName();
    // Call handleErrorSurname
    handleErrorSurname();
    // Call hanldeErorMail
    hanldeErorMail();
    handleErrorPackage();
    // Call handleErrorDepartment
    handleErrorDepartment();
  }, [packageInvite, department, errorRessponse]);
  /**
   * Function open modal department
   */
  const handleOpenModalDepartment = () => {
    setOpenModalDepartment(true);
  };
  /**
   * Function close modal department
   */
  const handleCloseModalDepartment = () => {
    setOpenModalDepartment(false);
  };
  /**
   * Function open Modal Package
   */
  const handleOpenModalPackage = () => {
    setOpenModalPackage(true);
  };
  /**
   * Function close Modal Package
   */
  const handleCloseModalPackage = () => {
    setOpenModalPackage(false);
  };

  /**
   * Function remove form invite
   */
  const handleRemoveForm = () => {
    // Call store remove form
    deleteInvite(position);
  };

  /**
   * Define function handleUpdateBasicInfor
   * @param data 
   * @param type name control input
   */
  const handleUpdateBasicInfor = (data: string, type: string) => {
    switch (type) {
      case inviteEmployeeConst.surname:
        setSurname(data);
        break;
      case inviteEmployeeConst.name:
        setName(data);
        break;
      case inviteEmployeeConst.email:
        setEmail(data);
        //employee.emailAddress = data;
        break;
      default:
        break;
    }
  }

  const handFocusOutInput = () => {
    employee.emailAddress = email;
    employee.surname = surname;
    employee.name = name;
    updateListInvite(position, employee);
  }

  return (
    <View style={InviteEmployeeFormInviteStyles.wrapFormInvite}>
      {length != 1 &&
      <TouchableOpacity
        style={[InviteEmployeeFormInviteStyles.closeButton, InviteEmployeeFormInviteStyles.wrapCloseButton]}
        onPress={handleRemoveForm}
      >
        <Icon name="close" style={InviteEmployeeFormInviteStyles.iconClose} />
      </TouchableOpacity>}
      <View style={InviteEmployeeFormInviteStyles.formInvite}>
        <View style={InviteEmployeeFormInviteStyles.wrapName}>
          <View style={errSurName ? InviteEmployeeFormInviteStyles.firstNameEror : InviteEmployeeFormInviteStyles.firstName}>
            <View style={InviteEmployeeFormInviteStyles.labelName}>
              <Text style={InviteEmployeeFormInviteStyles.labelText}>
                {translate(messages.inviteEmployeeSurname)}
              </Text>
              <View style={InviteEmployeeFormInviteStyles.labelHighlight}>
                <Text style={InviteEmployeeFormInviteStyles.labelTextHighlight}>
                  {translate(messages.inviteEmployeeRequired)}
                </Text>
              </View>
            </View>
            <Input
              value={surname}
              onChangeText={(text) => { handleUpdateBasicInfor(text, inviteEmployeeConst.surname); }}
              onBlur={handFocusOutInput}
              placeholder={translate(messages.inviteEmployeeEnterSurname)}
              maxLength={inviteEmployeeConst.maxLenghtSurname}
              style={InviteEmployeeFormInviteStyles.inputName}
              placeholderColor={InviteEmployeeFormInviteStyles.inputPlaceholderColor.color}
            />
          </View>
          <View style={InviteEmployeeFormInviteStyles.lastName}>
            <Text style={InviteEmployeeFormInviteStyles.labelText}>
              {translate(messages.inviteEmployeeName)}
            </Text>
            <Input
              value={name}
              onChangeText={(text) => { handleUpdateBasicInfor(text, inviteEmployeeConst.name); }}
              onBlur={handFocusOutInput}
              placeholder={translate(messages.inviteEmployeeEnterName)}
              maxLength={inviteEmployeeConst.maxLenghtName}
              style={InviteEmployeeFormInviteStyles.inputName}
              placeholderColor={InviteEmployeeFormInviteStyles.inputPlaceholderColor.color}
            />
          </View>
        </View>
        <View style={errEmail ? InviteEmployeeFormInviteStyles.wrapInputEror : InviteEmployeeFormInviteStyles.wrapInput}>
          <View style={InviteEmployeeFormInviteStyles.labelName}>
            <Text style={InviteEmployeeFormInviteStyles.labelText}>
              {translate(messages.inviteEmployeeMailAddress)}
            </Text>
            <View style={InviteEmployeeFormInviteStyles.labelHighlight}>
              <Text style={InviteEmployeeFormInviteStyles.labelTextHighlight}>
                {translate(messages.inviteEmployeeRequired)}
              </Text>
            </View>
          </View>
          <Input
            value={email}
            onChangeText={(text) => { handleUpdateBasicInfor(text, inviteEmployeeConst.email); }}
            onBlur={handFocusOutInput}
            placeholder={translate(messages.inviteEmployeeEnterEmailAddress)}
            maxLength={inviteEmployeeConst.maxLengtEmail}
            style={InviteEmployeeFormInviteStyles.inputName}
            placeholderColor={InviteEmployeeFormInviteStyles.inputPlaceholderColor.color}
            onFocus={onFocus}
            onEndEditing={onEndEdit}
          />
        </View>
        {expand && (
          <View>
            <View style={InviteEmployeeFormInviteStyles.divide} />
            <View style={errDepartment ? InviteEmployeeFormInviteStyles.wrapInputEror : InviteEmployeeFormInviteStyles.wrapInput}>
              <View style={InviteEmployeeFormInviteStyles.labelName}>
                <Text style={InviteEmployeeFormInviteStyles.labelText}>
                  {translate(messages.inviteEmployeeDepartment)}
                </Text>
                <View style={InviteEmployeeFormInviteStyles.labelHighlight}>
                  <Text style={InviteEmployeeFormInviteStyles.labelTextHighlight}>
                    {translate(messages.inviteEmployeeRequired)}
                  </Text>
                </View>
              </View>
              <ButtonInput
                label={translate(messages.inviteEmployeeSelectDepartment)}
                value={listDepartmentName}
                style={InviteEmployeeFormInviteStyles.inputName}
                onPress={handleOpenModalDepartment}
              />
            </View>
            <View style={InviteEmployeeFormInviteStyles.divide} />
            <View style={errPackage ? InviteEmployeeFormInviteStyles.wrapInputEror : InviteEmployeeFormInviteStyles.wrapInput}>
              <Text style={InviteEmployeeFormInviteStyles.labelText}>
                {translate(messages.inviteEmployeeLablePackage)}
              </Text>
              <ButtonInput
                label={translate(messages.inviteEmployeeButtonPackage)}
                value={listPackageName}
                style={InviteEmployeeFormInviteStyles.inputName}
                onPress={handleOpenModalPackage}
              />
            </View>
            <View style={InviteEmployeeFormInviteStyles.divide} />
            <View>
              <TouchableOpacity
                style={InviteEmployeeDepartmentModalStyles.wrapGroupItem}
                onPress={() => {
                  handleSelectCheckedLoginContract(!checkedLoginContract, inviteEmployeeConst.loginContract);
                  setCheckedLoginContract(!checkedLoginContract);
                }}
              >
                <Text style={InviteEmployeeDepartmentModalStyles.contentStyle}>
                  {translate(messages.inviteEmployeeCheckboxLoginContract)}
                </Text>
                {checkedLoginContract ? <Icon name="checkedGroupItem" /> : <Icon name="unCheckGroupItem" />}
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={InviteEmployeeDepartmentModalStyles.wrapGroupItem}
                onPress={() => {
                  handleSelectCheckedLoginContract(!checkedAdmin, inviteEmployeeConst.admin);
                  setCheckedAdmin(!checkedAdmin);
                }}
              >
                <Text style={InviteEmployeeDepartmentModalStyles.contentStyle}>
                  {translate(messages.inviteEmployeeCheckboxAdmin)}
                </Text>
                {checkedAdmin ? <Icon name="checkedGroupItem" /> : <Icon name="unCheckGroupItem" />}
              </TouchableOpacity>
            </View>

          </View>
        )}
      </View>
      <TouchableOpacity
        style={InviteEmployeeFormInviteStyles.expandForm}
        onPress={() => setExpand(!expand)}
      >
        <Icon name={expand ? inviteEmployeeConst.arrowUp : inviteEmployeeConst.arrowDown} />
      </TouchableOpacity>
      <View>
        <Modal
          isVisible={openModalDepartment}
          onBackdropPress={handleCloseModalDepartment}
          style={InviteEmployeeStyles.bottomView}
          onBackButtonPress={handleCloseModalDepartment}
        >
          <InviteDepartmentModal
            handleCloseModal={handleCloseModalDepartment}
            setObjectSelect={setDepartment}
            arraySelection={department}
          />
        </Modal>
      </View>
      <View>
        <Modal
          isVisible={openModalPackage}
          onBackdropPress={handleCloseModalPackage}
          style={InviteEmployeeStyles.bottomView}
          onBackButtonPress={handleCloseModalPackage}
        >
          <InviteEmployeePackageModal
            handleCloseModal={handleCloseModalPackage}
            setObjectSelect={setPackageInvite}
            arraySelection={packageInvite}
          >
          </InviteEmployeePackageModal>
        </Modal>
      </View>
    </View>
  );
};
