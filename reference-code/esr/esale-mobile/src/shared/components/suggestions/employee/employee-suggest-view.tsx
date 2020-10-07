import EmployeeSuggestStyles, { AuthorizationModalStyles } from './employee-suggest-style';
import React, { useState, useEffect } from 'react';
import {
  EmployeeDTO,
  IEmployeeSuggestionsProps,
  IOrganizationInfo
} from '../interface/employee-suggest-interface';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';
import { KeySearch, TypeSelectSuggest, PlatformOS } from '../../../../config/constants/enum';
import { messages } from './employee-suggest-messages';
import { translate } from '../../../../config/i18n';
import { Icon } from '../../icon';
import BottomModal from 'react-native-modal';
import { cloneDeep, isEmpty, isNil, forEach, first, map, filter, findIndex } from 'lodash';
import { EmployeeSuggestResultSearchView } from './employee-suggest-result-search/employee-suggest-result-search-view';
import { Employee } from '../interface/employee-suggest-result-search-interface';
import { EmployeeSuggestSearchModal } from './employee-suggest-search-modal/employee-suggest-search-modal';
import { getSelectedOrganizationInfo } from '../repository/employee-suggest-repositoty';
import StringUtils from '../../../util/string-utils';
import { authorizationSelector } from '../../../../modules/login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ServiceName } from '../../../../modules/search/search-enum';
import { DetailSearch } from '../../../../modules/search/search-detail/search-detail-screen';
import { searchConditionsSelector } from '../../../../modules/search/search-selector';


/**
 * IndexChoice of data select
 */
enum IndexChoice {
  EMPLOYEE = 'employee',
  DEPARTMENT = 'employee_department',
  GROUP = 'employee_group'
}

/**
 * TypeMember
 */
enum TypeMember {
  VIEWER = 1,
  OWNER = 2
}

// label positionName
const POSITION_NAME = 'positionName';

/**
 * Max size display selected data
 */
const MAX_SIZE_DISPLAY = 5;

/**
 * Component for searching text fields
 * @param props see IEmployeeSuggestProps
 */
export function EmployeeSuggestView(props: IEmployeeSuggestionsProps) {
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ?? TEXT_EMPTY;
  const [viewAll, setViewAll] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataSelected, setDataSelected] = useState<EmployeeDTO[]>([]);
  const [openModalShareGroup, setOpenModalShareGroup] = useState(false);
  const [itemSelected, setItemSelected] = useState(-1);
  const [groupSelected, setGroupSelected] = useState(-1);
  const [isVisibleResultSearchModal, setIsVisibleResultSearchModal] = useState(false);
  const [isVisibleDetailSearchModal, setIsVisibleDetailSearchModal] = useState(false);
  const [conditions, setConditions] = useState<any[]>([]);
  const suggesstionChoiseFirst = props.suggestionsChoice;
  const searchConditions = useSelector(searchConditionsSelector);

  useEffect(() => {
    handleGetSelectedOrganizationInfo();
  }, [suggesstionChoiseFirst]);
  /**
   * Call API GetSelectedOrganizationInfo
   */
  const handleGetSelectedOrganizationInfo = async () => {
    if (suggesstionChoiseFirst) {
      const response = await getSelectedOrganizationInfo({
        departmentId: map(suggesstionChoiseFirst.departments, item => item.departmentId),
        employeeId: map(suggesstionChoiseFirst.employees, item => item.employeeId),
        groupId: map(suggesstionChoiseFirst.groups, item => item.groupId)
      });
      if (response.status === 200) {
        if (response.data) {
          setEmployeeDTO(response.data);
        }
      } else if (!isNil(props.exportError)) {
        props.exportError(response);
      }
    }
  }

  /**
   * set data view list when call API
   * @param response data API
   */
  const setEmployeeDTO = (data: IOrganizationInfo) => {
    const dataConvert: EmployeeDTO[] = [];
    setEmployeeAPI(data, dataConvert);
    setDepartmentAPI(data, dataConvert);
    setGroupAPI(data, dataConvert);
    const selected = filter(dataSelected.concat(dataConvert), (item, index, self) => {
      return findIndex(self, s => s.groupSearch === item.groupSearch && s.itemId === item.itemId) === index;
    });
    setDataSelected(selected);
    props.updateStateElement(selected);
    if (selected.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
  }

  /**
   * set data seach when search with employee
   * @param response data API
   */
  const setEmployeeAPI = (data: IOrganizationInfo, dataConvert: EmployeeDTO[]) => {
    forEach(data.employee, (employeeItem) => {
      const department = first(employeeItem.departments);
      const type = props.suggestionsChoice?.employees.find(item => item.employeeId === employeeItem.employeeId);
      let itemView = {
        itemId: employeeItem.employeeId,
        groupSearch: KeySearch.EMPLOYEE,
        itemName: getEmployeeFullName(employeeItem.employeeName, employeeItem.employeeSurname),
        departmentName: department ? department.departmentName : TEXT_EMPTY,
        positionName: department ? StringUtils.getFieldLabel(department, POSITION_NAME, languageCode) : TEXT_EMPTY,
        itemImage: employeeItem.photoFileUrl,
        isBusy: employeeItem.isBusy,
        participantType: type ? type.participantType : TypeMember.OWNER,
        indexChoice: IndexChoice.EMPLOYEE,
        employee: employeeItem
      }
      dataConvert.push(itemView);
    });
  }

  /**
   * set data seach when search with depart
   * @param response data API
   */
  const setDepartmentAPI = (data: IOrganizationInfo, dataConvert: EmployeeDTO[]) => {
    forEach(data.departments, (departmentItem) => {
      const type = props.suggestionsChoice?.departments.find(item => item.departmentId === departmentItem.departmentId);
      let itemView = {
        itemId: departmentItem.departmentId,
        groupSearch: KeySearch.DEPARTMENT,
        itemName: departmentItem.departmentName,
        departmentName: departmentItem.parentDepartment && departmentItem.parentDepartment.departmentName,
        positionName: TEXT_EMPTY,
        itemImage: TEXT_EMPTY,
        participantType: type ? type.participantType : TypeMember.OWNER,
        indexChoice: IndexChoice.DEPARTMENT,
        employee: departmentItem
      }
      dataConvert.push(itemView);
    });
  }

  /**
   * set data seach when search with group
   * @param response data API
   */
  const setGroupAPI = (data: IOrganizationInfo, dataConvert: EmployeeDTO[]) => {
    forEach(data.groupId, (groupItem) => {
      const type = props.suggestionsChoice?.groups.find(item => item.groupId === groupItem.groupId);
      let itemView = {
        itemId: groupItem.groupId,
        groupSearch: KeySearch.GROUP,
        itemName: groupItem.groupName,
        groupName: groupItem.groupName,
        positionName: TEXT_EMPTY,
        itemImage: TEXT_EMPTY,
        participantType: type ? type.participantType : TypeMember.OWNER,
        indexChoice: IndexChoice.GROUP,
        employee: groupItem
      }
      dataConvert.push(itemView);
    });
  }

  /**
   * add employee selected in popup
   *  @param item selected
   */
  const handleAddEmployeeSuggestions = (item: EmployeeDTO, typeSearch: number) => {
    const isExistEmployee = dataSelected.find(itemEmployee => (itemEmployee.itemId === item.itemId && itemEmployee.groupSearch === item.groupSearch))
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      if (!isExistEmployee) {
        dataSelected.pop();
        dataSelected.push(item);
      }
    } else {
      if (!isExistEmployee) {
        dataSelected.push(item);
      }
    }
    setDataSelected(dataSelected);
    confirmSearch(dataSelected);
  }
  /**
   * Set data selected from result search
   * @param data
   */
  const setEmployeeSelected = (data: Employee[]) => {
    const listEmployeeConverted: EmployeeDTO[] = [];
    for (let index = 0; index < data.length; index++) {
      const employeeItem = data[index];
      // convert object employee to view object
      let itemView = {
        itemId: employeeItem.employeeId,
        groupSearch: KeySearch.EMPLOYEE,
        itemName: getEmployeeFullName(employeeItem.employeeSurname, employeeItem.employeeName),
        departmentName: !isNil(employeeItem.employeeDepartments[0])
          ? employeeItem.employeeDepartments[0].departmentName : TEXT_EMPTY,
        positionName: !isNil(employeeItem.employeeDepartments[0])
          ? employeeItem.employeeDepartments[0].positionName : TEXT_EMPTY,
        itemImage: employeeItem.employeeIcon.filePath,
        isBusy: employeeItem.isBusy,
        // TODO: default participantType
        participantType: TypeMember.OWNER,
        indexChoice: IndexChoice.EMPLOYEE,
        employee: employeeItem
      }
      const itemCheck = dataSelected.find(employee => employee.groupSearch === KeySearch.EMPLOYEE && employee.itemId === itemView.itemId);
      if (!itemCheck) {
        listEmployeeConverted.push(itemView);
      }
    }
    const selected = props.typeSearch === TypeSelectSuggest.SINGLE ? listEmployeeConverted : dataSelected.concat(listEmployeeConverted);
    setDataSelected(selected);
    props.updateStateElement(selected);
    if (selected.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
  }

  /**
   * Get employee name
   * @param surname 
   * @param name 
   */
  const getEmployeeFullName = (surname?: string, name?: string) => {
    return [surname, name].join(' ').trim();
  }

  /**
   * confirm selection
   *  @param list item selected
   */
  const confirmSearch = (data: EmployeeDTO[]) => {
    setModalVisible(false);
    const newDataViewSelected = cloneDeep(data)
    if (newDataViewSelected.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
    if (props.updateStateElement) {
      props.updateStateElement(newDataViewSelected);
    }
  }

  /**
   * event click view all selection
   */
  const handleViewAll = () => {
    setViewAll(true)
  }

  /**
   * event click choose employee item in list
   * @param employee
   */
  const handleRemoveEmployeeSetting = (employee: EmployeeDTO) => {
    const employeeSelected = dataSelected.filter(itemDto => (itemDto.itemId !== employee.itemId || itemDto.groupSearch !== employee.groupSearch));
    setDataSelected(employeeSelected);
    if (employeeSelected.length <= MAX_SIZE_DISPLAY) {
      setViewAll(true);
    }
    props.updateStateElement(employeeSelected);
  }

  /**
   * function close modal share group
   */
  const handleCloseModalShareGroup = () => {
    setOpenModalShareGroup(false);
  };

  /**
   * function open modal share group
   */
  const handleOpenModalShareGroup = (item: EmployeeDTO) => {
    setItemSelected(item.itemId);
    setGroupSelected(item.groupSearch);
    setOpenModalShareGroup(true);
  };

  /**
   * function change type member オーナー or 閲覧者
   * @param type
   */
  const onChangeTypeMember = (type: number) => {
    const item = dataSelected.find(data => data.itemId === itemSelected && data.groupSearch === groupSelected);
    if (item) {
      item.participantType = type;
    }
    setOpenModalShareGroup(false);
    if (props.updateStateElement) {
      props.updateStateElement(dataSelected);
    }
  };

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    if (isVisibleResultSearchModal) {
      setIsVisibleResultSearchModal(false);
    } else if (isVisibleDetailSearchModal) {
      setIsVisibleDetailSearchModal(false);
    } else {
      setModalVisible(false);
    }
  }

  /*
   * Render the text component
   */
  return (
    <View style={EmployeeSuggestStyles.stretchView}>
      <View>
        {!props.invisibleLabel && <Text style={EmployeeSuggestStyles.title}>{props.fieldLabel}</Text>}
        <TouchableOpacity style={[props.isError ? EmployeeSuggestStyles.errorContent : EmployeeSuggestStyles.touchContent]}
          onPress={() => setModalVisible(true)}>
          <Text style={EmployeeSuggestStyles.labelInputCorlor}>{props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
            : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
        </TouchableOpacity>
        {/* View list save setting data */}
        {!props.hiddenSelectedData &&
          map(viewAll ? dataSelected : dataSelected.slice(0, MAX_SIZE_DISPLAY), item => {
            return (<View style={EmployeeSuggestStyles.touchableSelected}>
              {/* check view icon by group search */}
              <View style={EmployeeSuggestStyles.suggestAvatar}>
                {item.groupSearch === KeySearch.DEPARTMENT &&
                  <View style={EmployeeSuggestStyles.iconDepart}>
                    <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                  </View>
                }

                {item.groupSearch === KeySearch.EMPLOYEE && !isEmpty(item.itemImage) &&
                  <Image style={EmployeeSuggestStyles.iconImage} source={{ uri: item.itemImage }} />
                }
                {item.groupSearch === KeySearch.EMPLOYEE && isEmpty(item.itemImage) &&
                  <View style={EmployeeSuggestStyles.iconEmployee}>
                    <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                  </View>
                }
                {item.groupSearch === KeySearch.GROUP &&
                  <View style={EmployeeSuggestStyles.iconGroup}>
                    <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                  </View>
                }
              </View>

              {item.groupSearch === KeySearch.DEPARTMENT &&
                <View style={[EmployeeSuggestStyles.suggestTouchable, { width: props.withAuthorization ? '40%' : '70%' }]}>
                  <Text style={EmployeeSuggestStyles.suggestText}>{item.departmentName}</Text>
                  <Text style={EmployeeSuggestStyles.suggestTextDate}>{item.itemName}</Text>
                </View>
              }
              {item.groupSearch === KeySearch.EMPLOYEE &&
                <View style={[EmployeeSuggestStyles.suggestTouchable, { width: props.withAuthorization ? '40%' : '70%' }]}>
                  <Text style={EmployeeSuggestStyles.suggestText}>{item.departmentName}</Text>
                  <Text style={EmployeeSuggestStyles.suggestTextDate}>{item.itemName} {item.positionName}</Text>
                </View>
              }
              {item.groupSearch === KeySearch.GROUP &&
                <View style={[EmployeeSuggestStyles.suggestTouchable, { width: props.withAuthorization ? '40%' : '70%' }]}>
                  <Text style={EmployeeSuggestStyles.suggestText}>{item.groupName}</Text>
                </View>
              }

              <View style={EmployeeSuggestStyles.elementRight}>
                {props.withAuthorization && <TouchableOpacity
                  style={EmployeeSuggestStyles.openModal}
                  onPress={() => handleOpenModalShareGroup(item)}
                >
                  <Text style={EmployeeSuggestStyles.buttonText}>{item.participantType === TypeMember.VIEWER ? translate(messages.groupViewer) : translate(messages.groupOwner)}</Text>
                  <Icon name="arrowDown" />
                </TouchableOpacity>}
                <TouchableOpacity
                  style={EmployeeSuggestStyles.iconCheckView}
                  onPress={() => {
                    handleRemoveEmployeeSetting(item);
                  }}>
                  <Icon style={EmployeeSuggestStyles.iconListDelete} name="iconDelete" />
                </TouchableOpacity>
              </View>
            </View>
            )
          })
        }
      </View>
      <View>
        <BottomModal
          isVisible={openModalShareGroup}
          onBackdropPress={handleCloseModalShareGroup}
          style={EmployeeSuggestStyles.bottomView}
        >
          <View style={AuthorizationModalStyles.container}>
            <View style={AuthorizationModalStyles.wrapText}>
              <TouchableOpacity
                style={AuthorizationModalStyles.button}
                onPress={() => onChangeTypeMember(TypeMember.OWNER)}
              >
                <Text style={AuthorizationModalStyles.title}>
                  {translate(messages.groupOwner)}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={AuthorizationModalStyles.divide1} />
            <View style={AuthorizationModalStyles.wrapText}>
              <TouchableOpacity
                style={AuthorizationModalStyles.button}
                onPress={() => onChangeTypeMember(TypeMember.VIEWER)}
              >
                <Text style={AuthorizationModalStyles.title}>
                  {translate(messages.groupViewer)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomModal>
      </View>
      {
        !props.hiddenSelectedData && !viewAll &&
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={EmployeeSuggestStyles.buttonViewAll}>
            {`${translate(messages.labelViewMore1)}${(dataSelected.length - MAX_SIZE_DISPLAY)}${translate(messages.labelViewMore2)}`}
          </Text>
        </TouchableOpacity>
      }

      {/* layout modal  */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible || isVisibleDetailSearchModal || isVisibleResultSearchModal}
        onRequestClose={() => handleCloseModal()}
      >
        {modalVisible &&
          <SafeAreaView style={[EmployeeSuggestStyles.modalContainer, Platform.OS === PlatformOS.IOS ? { marginTop: 0 } : {}]}>
            <EmployeeSuggestSearchModal
              typeSearch={props.typeSearch}
              fieldLabel={props.fieldLabel}
              groupSearch={props.groupSearch}
              dataSelected={dataSelected}
              isCloseDetailSearchModal={isVisibleDetailSearchModal}
              isRelation={props.isRelation}
              selectedData={handleAddEmployeeSuggestions}
              setConditions={(cond) => setConditions(cond)}
              openDetailSearchModal={() => setIsVisibleDetailSearchModal(true)}
              closeModal={() => setModalVisible(false)}
              exportError={(error) => !isNil(props.exportError) && props.exportError(error)}
            />
          </SafeAreaView>
        }
        {isVisibleDetailSearchModal &&
          <SafeAreaView style={[EmployeeSuggestStyles.detailSearchContent, Platform.OS === PlatformOS.IOS ? { marginTop: 0 } : {}]}>
            <DetailSearch
              suggestService={ServiceName.employees}
              suggestClose={() => setIsVisibleDetailSearchModal(false)}
              suggestConfirm={() => { setIsVisibleResultSearchModal(true); setConditions(searchConditions ?? []); }}
            />
          </SafeAreaView>
        }
        {isVisibleResultSearchModal &&
          <SafeAreaView style={[EmployeeSuggestStyles.detailSearchContent, Platform.OS === PlatformOS.IOS ? { marginTop: 0 } : {}]}>
            <EmployeeSuggestResultSearchView
              updateStateElement={(listEmployee: Employee[]) => {
                setEmployeeSelected(listEmployee);
                setIsVisibleDetailSearchModal(false);
                setModalVisible(false);
              }}
              title={props.title}
              isRelation={props.isRelation}
              typeSearch={props.typeSearch}
              searchConditions={conditions}
              closeModal={() => setIsVisibleResultSearchModal(false)}
              exportError={(error) => !isNil(props.exportError) && props.exportError(error)}
            />
          </SafeAreaView>
        }
      </Modal >
    </View>
  );
}
