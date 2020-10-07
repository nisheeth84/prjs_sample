import { AntDesign } from '@expo/vector-icons';
import _ from 'lodash';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView, Modal,
  Platform, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { KeySearch, ModifyFlag, PlatformOS, SearchTypeOrganization, SelectOrganizationMode } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import StringUtils from '../../../../util/string-utils';
import { AppIndicator } from '../../../app-indicator/app-indicator';
import { getEmployeeSuggestions, ListItemChoice } from '../../repository/employee-suggest-repository';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { EmployeeSuggest, EmployeeSuggestionResponse, ItemData } from '../interface/employee-suggest-interface';
import { fieldAddEditMessages } from './field-add-edit-messages';
import { FieldAddEditOrganizationStyles } from './field-add-edit-styles';

// Define value props of FieldAddEditPhoneNumber component
type IFieldAddEditOrganizationProps = IDynamicFieldProps;

/**
 * Component for show organization selection fields
 * @param props see IEmployeeSuggestionsProps
 */
export function FieldAddEditOrganization(props: IFieldAddEditOrganizationProps) {
  const { fieldInfo, languageCode } = props;
  const [disableConfirm, setDisableConfirm] = useState(false);
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const [isShowSuggestion, setShowSuggestion] = useState(false);
  const [responseApiEmployee, setResponseApiEmployee] = useState<ItemData[]>([]);
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [dataSelected, setDataSelected] = useState<ItemData[]>([]);
  const [dataViewSelected, setDataViewSelected] = useState<ItemData[]>([]);
  const [oldChooseItem, setOldChooseItem] = useState<ItemData>();
  const [viewAll, setViewAll] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [listItemChoice, setListItemChoice] = useState<ListItemChoice[]>([]);
  const [visibleFooter, setVisibleFooter] = useState(true);
  const [overRecord, setOverRecord] = useState(false);
  const [isFocusTextInput, setIsFocusTextInput] = useState(false);
  const modalIcon = require("../../../../../../assets/icons/icon_modal.png");
  const searchIcon = require("../../../../../../assets/icons/search.png");
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
  const unCheckedIcon = require("../../../../../../assets/icons/unchecked.png");
  const deleteIcon = require("../../../../../../assets/icons/icon_delete.png")
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const targetSelect = fieldInfo?.selectOrganizationData?.target;
  const formatSelect = fieldInfo?.selectOrganizationData?.format;

  /**
   * add item selected in popup
   *  @param item item just selected
   */
  const handleAddItemDataSuggestions = (itemData: ItemData) => {
    const isExistItem = dataSelected?.filter(item => (item.itemId === itemData.itemId && item.groupSearch === itemData.groupSearch))
    if (isExistItem?.length > 0) {
      const listDataSelected = dataSelected?.filter(item => (item.itemId !== itemData.itemId || item.groupSearch !== itemData.groupSearch));
      setDataSelected(listDataSelected);
    } else {
      if (formatSelect === SelectOrganizationMode.SINGLE) {
        dataSelected?.pop();
      }
      dataSelected?.push(itemData);
      setDataSelected(dataSelected);
    }
  }

  /**
   * handle text input to show suggestion
   * @param text text from input
   */
  const handleSearch = (text: string, loadMore: boolean) => {
    setSearchValue(text);
    setErrorMessage(TEXT_EMPTY);
    setShowSuggestion(true);
    getDataSuggestFromAPI(text, loadMore);
  }

  const deCodeTarget = () => {
    let searchTypeOrganization = null;
    if (targetSelect) {
      switch (targetSelect) {
        case "100":
          searchTypeOrganization = SearchTypeOrganization.EMPLOYEE;
          break;
        case "010":
          searchTypeOrganization = SearchTypeOrganization.DEPARTMENT;
          break;
        case "001":
          searchTypeOrganization = SearchTypeOrganization.GROUP;
          break;
        case "110":
          searchTypeOrganization = SearchTypeOrganization.DEPARTMENT_EMPLOYEE;
          break;
        case "101":
          searchTypeOrganization = SearchTypeOrganization.EMPLOYEE_GROUP;
          break;
        case "011":
          searchTypeOrganization = SearchTypeOrganization.DEPARTMENT_GROUP;
          break;
        default:
          break;
      }
    }
    return searchTypeOrganization;
  }

  /**
   * get data from API
   */
  const getDataSuggestFromAPI = async (textSearch: string, loadMore: boolean) => {
    setVisibleFooter(true);
    const response = await getEmployeeSuggestions(
      {
        searchType: deCodeTarget(),
        offSet: loadMore ? offset + limit : 0,
        endTime: TEXT_EMPTY,
        keyWords: textSearch,
        limit: limit,
        startTime: TEXT_EMPTY,
        listItemChoice: listItemChoice,
        relationFieldI: null
      }
    );
    if (loadMore) {
      setOffset(offset + limit)
    } else {
      setOffset(0)
    }
    if (response) {
      checkStatusResponse(response, loadMore);
    } else {
      // TODO: set error message
    }
    setVisibleFooter(false)
  }

  /**
   * 
   * @param response data from API
   */
  const checkStatusResponse = (response: EmployeeSuggestionResponse, loadMore: boolean) => {
    if (response.status && response.status === 200) {
      const dataResponse = response.data
      if (!dataResponse || offset > dataResponse.total) {
        setOverRecord(true)
      } else if (loadMore) {
        if (offset + limit > dataResponse.total) {
          setOverRecord(true)
          return;
        }
        const data = _.cloneDeep(responseApiEmployee)
        setEmployeeDTO(dataResponse);
        data.push(...responseApiEmployee)
        setResponseApiEmployee(data);
      } else {
        setEmployeeDTO(dataResponse);
        createStateCheck(responseApiEmployee);
        setResponseApiEmployee(responseApiEmployee);
      }
    } else {
      // TODO: set error message
      setErrorMessage("ERROR CONNECT SERVER");
    }
  }
  /**
   * set data view list when call API
   * @param data data from API
   */
  const setEmployeeDTO = (data: EmployeeSuggest) => {
    responseApiEmployee.splice(0, responseApiEmployee.length)
    setEmployeeAPI(data);
    setDepartmentAPI(data);
    setGroupAPI(data);
  }
  /**
   * set data seach when search with employee
   * @param data data from API
   */
  const setEmployeeAPI = (data: EmployeeSuggest) => {
    if (data.employees) {
      for (let index = 0; index < data.employees.length; index++) {
        const employeeItem = data.employees[index];
        // convert object employee to view object
        const itemView = {
          itemId: employeeItem.employeeId,
          groupSearch: KeySearch.EMPLOYEE,
          employeeName: employeeItem.employeeName,
          departmentName: employeeItem.employeeDepartments.departmentName,
          positionName: employeeItem.employeeDepartments.positionName,
          groupName: TEXT_EMPTY,
          itemImage: employeeItem.employeeIcon.fileUrl
        }
        responseApiEmployee.push(itemView);
      }
    }
  }

  /**
   * set data seach when search with depart
   * @param data data from API
   */
  const setDepartmentAPI = (data: EmployeeSuggest) => {
    if (data.departments) {
      for (let index = 0; index < data.departments.length; index++) {
        const departmentItem = data.departments[index];
        const itemView = {
          itemId: departmentItem.departmentId,
          groupSearch: KeySearch.DEPARTMENT,
          employeeName: TEXT_EMPTY,
          departmentName: departmentItem.departmentName,
          positionName: TEXT_EMPTY,
          groupName: TEXT_EMPTY,
          itemImage: TEXT_EMPTY,
        }
        responseApiEmployee.push(itemView);
      }
    }
  }

  /**
   * set data seach when search with group
   * @param data data from API
   */
  const setGroupAPI = (data: EmployeeSuggest) => {
    if (data.groups) {
      for (let index = 0; index < data.groups.length; index++) {
        const groupItem = data.groups[index];
        const itemView = {
          itemId: groupItem.groupId,
          groupSearch: KeySearch.GROUP,
          employeeName: TEXT_EMPTY,
          departmentName: TEXT_EMPTY,
          positionName: TEXT_EMPTY,
          groupName: groupItem.groupName,
          itemImage: TEXT_EMPTY,
        }
        responseApiEmployee.push(itemView);
      }
    }
  }
  /**
    * confirm selection
    *  @param data list data selected
    */
  const confirmSearch = (data: ItemData[]) => {
    setModalVisible(false);
    setDisableConfirm(true);
    let newDataViewSelected: ItemData[] = [];
    if (formatSelect === SelectOrganizationMode.MULTI) {
      newDataViewSelected = _.cloneDeep(dataViewSelected)
    }
    data.forEach(item => {
      if (statusSelectedItem.get(`${item.itemId}_${item.groupSearch}`)) {
        newDataViewSelected.push(item)
        listItemChoice.push({ idChoice: item.itemId, searchType: item.groupSearch })
      }
    });
    setListItemChoice(listItemChoice)

    setDataViewSelected(newDataViewSelected);
    if (newDataViewSelected.length > 5) {
      setViewAll(false)
    }
    if (props.updateStateElement && !props.isDisabled) {
      props.updateStateElement(fieldInfo, fieldInfo.fieldType, newDataViewSelected);
    }
    setOffset(0)
    setDisableConfirm(false);
  }

  /**
   * set map state check view checkbox 
   * @param itemData itemData just checked
   */
  const handleViewCheckbox = (itemData: ItemData) => {
    const newStateCheck = _.cloneDeep(statusSelectedItem);
    if (formatSelect === SelectOrganizationMode.SINGLE && oldChooseItem) {
      newStateCheck.set(`${oldChooseItem.itemId}_${oldChooseItem.groupSearch}`, false)
    }
    const keyMap = `${itemData.itemId}_${itemData.groupSearch}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));
    setStatusSelectedItem(newStateCheck);
    setOldChooseItem(itemData);
  }

  /**
   * create new state for checkbox when change keyword
   * @param data list data to creat new state
   */
  const createStateCheck = (data: ItemData[]) => {
    const newSelectedItem = new Map();
    data.forEach(item => {
      newSelectedItem.set(`${item.itemId}_${item.groupSearch}`, false);
    });
    setStatusSelectedItem(newSelectedItem);
  }

  /**
   * event click choose itemData in list
   * @param itemData itemData just checked
   */
  const handleClickItem = (itemData: ItemData) => {
    handleViewCheckbox(itemData);
    handleAddItemDataSuggestions(itemData);
  }

  /**
   * event click choose itemData in list
   * @param itemData itemData want to remove
   */
  const handleRemoveEmployee = (itemData: ItemData) => {
    const itemSelected = dataViewSelected.filter(itemDto => (itemDto.itemId != itemData.itemId || itemDto.groupSearch != itemData.groupSearch));
    setDataViewSelected(itemSelected);
    setDataSelected(_.cloneDeep(itemSelected));
    handleViewCheckbox(itemData);
    if (itemSelected.length <= 5) {
      setViewAll(true);
    }
    const newListItemChoice = _.cloneDeep(listItemChoice)
    setListItemChoice(newListItemChoice.filter((item: any) => item.idChoice != itemData.itemId || item.searchType != itemData.groupSearch))
  }

  /**
   * event click view all selection
   */
  const handleViewAll = () => {
    setViewAll(true)
  }

  /**
   * event click choose employee item in list
   */
  const initDataModal = () => {
    setDataSelected([]);
    setModalVisible(true);
    setOverRecord(false)
    handleSearch(TEXT_EMPTY, false);
  }
  const renderDataView = () => {
    const dataView = viewAll ? dataViewSelected : dataViewSelected.slice(0, 5)
    return dataView.map((item) => {
      return (
        <TouchableOpacity style={FieldAddEditOrganizationStyles.touchableSelected}
          onPress={() => {
            handleRemoveEmployee(item);
          }}>
          {/* check view icon by group search */}
          <View style={FieldAddEditOrganizationStyles.suggestAvatar}>
            {item.groupSearch === KeySearch.DEPARTMENT &&
              <View style={FieldAddEditOrganizationStyles.iconDepart}>
                <Text>{item.departmentName?.substr(0, 1) ?? TEXT_EMPTY}</Text>
              </View>
            }

            {item.groupSearch === KeySearch.EMPLOYEE && item.itemImage?.length > 0 &&
              <Image style={FieldAddEditOrganizationStyles.iconImage} source={{ uri: item.itemImage }} />
            }
            {item.groupSearch === KeySearch.EMPLOYEE && !item.itemImage &&
              <View style={FieldAddEditOrganizationStyles.iconEmployee}>
                <Text>{item.employeeName?.substr(0, 1) ?? TEXT_EMPTY}</Text>
              </View>
            }
            {item.groupSearch === KeySearch.GROUP &&
              <View style={FieldAddEditOrganizationStyles.iconGroup}>
                <Text>{item.groupName?.substr(0, 1) ?? TEXT_EMPTY}</Text>
              </View>
            }
          </View>

          {item.groupSearch === KeySearch.DEPARTMENT &&
            <View style={FieldAddEditOrganizationStyles.suggestTouchable}>
              <Text style={FieldAddEditOrganizationStyles.suggestTextInfo}>{item.departmentName}</Text>
            </View>
          }
          {item.groupSearch === KeySearch.EMPLOYEE &&
            <View style={FieldAddEditOrganizationStyles.suggestTouchable}>
              <Text style={FieldAddEditOrganizationStyles.suggestText}>{item.departmentName}</Text>
              <Text style={FieldAddEditOrganizationStyles.suggestTextInfo}>{item.employeeName} {item.positionName}</Text>
            </View>
          }
          {item.groupSearch === KeySearch.GROUP &&
            <View style={FieldAddEditOrganizationStyles.suggestTouchable}>
              <Text style={FieldAddEditOrganizationStyles.suggestTextInfo}>{item.groupName}</Text>
            </View>
          }

          <View style={FieldAddEditOrganizationStyles.iconCheckView}>
            <Image style={FieldAddEditOrganizationStyles.iconListDelete} source={deleteIcon} />
          </View>
        </TouchableOpacity>
      )
    })
  }
  /**
   * Render the organization selection component 
   */
  const renderComponent = () => {

    return (
      <View style={FieldAddEditOrganizationStyles.stretchView}>
        <View>
          <View style={FieldAddEditOrganizationStyles.titleContainer}>
            <Text style={FieldAddEditOrganizationStyles.title}>{title}</Text>
            {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
              <View style={FieldAddEditOrganizationStyles.requiredContainer}>
                <Text style={FieldAddEditOrganizationStyles.textRequired}>{translate(fieldAddEditMessages.common_119908_16_inputRequired)}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={FieldAddEditOrganizationStyles.labelInput}
            disabled={fieldInfo.modifyFlag === ModifyFlag.READ_ONLY}
            onPress={() => { initDataModal() }}>
            <Text style={FieldAddEditOrganizationStyles.labelInputCorlor}>
              {formatSelect === SelectOrganizationMode.MULTI
                ? `${title}${translate(fieldAddEditMessages.common_119908_16_suggestMultiPlaceholder)}`
                : `${title}${translate(fieldAddEditMessages.common_119908_16_suggestSinglePlaceholder)}`
              }
            </Text>
          </TouchableOpacity>
          {renderDataView()}
          {
            !viewAll &&
            <TouchableOpacity onPress={handleViewAll}>
              <Text style={FieldAddEditOrganizationStyles.buttonViewAll}>{`${translate(fieldAddEditMessages.common_119908_16_labelViewMore1)}${(dataViewSelected.length - 5)}${translate(fieldAddEditMessages.common_119908_16_labelViewMore2)}`}</Text>
            </TouchableOpacity>
          }

        </View>
        <View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setOffset(0)
              setModalVisible(false)
            }}
          >
            <KeyboardAvoidingView
              style={FieldAddEditOrganizationStyles.modalContainer}
              behavior={Platform.OS === PlatformOS.IOS ? "padding" : "height"}
            >
              <TouchableOpacity
                style={[{ flex: 1 }, FieldAddEditOrganizationStyles.modalTouchable]}
                onPress={() => { setModalVisible(false) }} >
                <View>
                  <Image style={FieldAddEditOrganizationStyles.modalIcon} source={modalIcon} />
                </View>
              </TouchableOpacity>
              <View style={[FieldAddEditOrganizationStyles.modalContent, { flex: responseApiEmployee?.length > 0 ? 3 : 2 }]}>
                <View style={FieldAddEditOrganizationStyles.inputContainer}>
                  {searchValue.length <= 0 && (
                    <View style={FieldAddEditOrganizationStyles.iconCheckView}>
                      <Image style={FieldAddEditOrganizationStyles.iconCheck} source={searchIcon} />
                    </View>
                  )}
                  <TextInput style={searchValue.length > 0 ? FieldAddEditOrganizationStyles.inputSearchTextData : FieldAddEditOrganizationStyles.inputSearchText} placeholder=
                    {`${title}${translate(fieldAddEditMessages.common_119908_16_suggestMultiPlaceholder)}`}
                    value={searchValue}
                    onChangeText={(text) => {
                      setOverRecord(false)
                      handleSearch(text, false)
                    }}
                    autoFocus={true}
                    onFocus={() => setIsFocusTextInput(true)}
                    onBlur={() => setIsFocusTextInput(false)}
                  />
                  <View style={FieldAddEditOrganizationStyles.textSearchContainer}>
                    {searchValue.length > 0 && (
                      <TouchableOpacity onPress={() => { setSearchValue(TEXT_EMPTY); handleSearch(TEXT_EMPTY, false); }}>
                        <AntDesign name="closecircle" style={FieldAddEditOrganizationStyles.iconDelete} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <View style={FieldAddEditOrganizationStyles.dividerContainer} />
                {
                  errorMessage !== TEXT_EMPTY && (
                    <Text style={FieldAddEditOrganizationStyles.errorMessage}>{errorMessage}</Text>
                  )
                }
                {isShowSuggestion &&
                  <View style={FieldAddEditOrganizationStyles.suggestionContainer}>
                    <FlatList
                      data={responseApiEmployee}
                      keyExtractor={item => { return `${item.itemId.toString()}_${item.groupSearch.toString()}` }}
                      onEndReached={() => {
                        if (!overRecord) {
                          handleSearch(searchValue, true)
                        }
                      }}
                      ListFooterComponent={() => {
                        return (visibleFooter ?<AppIndicator visible /> : <></>)
                      }}
                      onEndReachedThreshold={0.01}
                      renderItem={({ item }) =>
                        <TouchableOpacity style={FieldAddEditOrganizationStyles.touchableSelect}
                          onPress={() => {
                            handleClickItem(item);
                          }}>
                          <View style={FieldAddEditOrganizationStyles.suggestAvatar}>
                            {item.groupSearch === KeySearch.DEPARTMENT &&
                              <View style={FieldAddEditOrganizationStyles.iconDepart}>
                                <Text>{item.departmentName?.substr(0, 1) ?? TEXT_EMPTY}</Text>
                              </View>
                            }

                            {item.groupSearch === KeySearch.EMPLOYEE && item.itemImage?.length > 0 &&
                              <Image style={FieldAddEditOrganizationStyles.iconImage} source={{ uri: item.itemImage }} />
                            }
                            {item.groupSearch === KeySearch.EMPLOYEE && !item.itemImage &&
                              <View style={FieldAddEditOrganizationStyles.iconEmployee}>
                                <Text>{item.employeeName?.substr(0, 1) ?? TEXT_EMPTY}</Text>
                              </View>
                            }

                            {item.groupSearch === KeySearch.GROUP &&
                              <View style={FieldAddEditOrganizationStyles.iconGroup}>
                                <Text>{item.groupName?.substr(0, 1) ?? TEXT_EMPTY}</Text>
                              </View>
                            }
                          </View>
                          {item.groupSearch === KeySearch.DEPARTMENT &&
                            <View style={FieldAddEditOrganizationStyles.suggestTouchable}>
                              <Text style={FieldAddEditOrganizationStyles.suggestTextInfo}>{item.departmentName}</Text>
                            </View>
                          }
                          {item.groupSearch === KeySearch.EMPLOYEE &&
                            <View style={FieldAddEditOrganizationStyles.suggestTouchable}>
                              <Text style={FieldAddEditOrganizationStyles.suggestText}>{item.departmentName}</Text>
                              <Text style={FieldAddEditOrganizationStyles.suggestTextInfo}>{item.employeeName} {item.positionName}</Text>
                            </View>
                          }
                          {item.groupSearch === KeySearch.GROUP &&
                            <View style={FieldAddEditOrganizationStyles.suggestTouchable}>
                              <Text style={FieldAddEditOrganizationStyles.suggestTextInfo}>{item.groupName}</Text>
                            </View>
                          }
                          <View style={FieldAddEditOrganizationStyles.iconCheckView}>
                            {statusSelectedItem.get(`${item.itemId}_${item.groupSearch}`) &&
                              <Image style={FieldAddEditOrganizationStyles.iconCheck} source={checkedIcon} />
                            }
                            {!statusSelectedItem.get(`${item.itemId}_${item.groupSearch}`) &&
                              <Image style={FieldAddEditOrganizationStyles.iconCheck} source={unCheckedIcon} />
                            }
                          </View>
                        </TouchableOpacity>
                      }
                    />
                  </View>}
                <TouchableOpacity style={[isFocusTextInput && _.isEmpty(responseApiEmployee) ? {} : FieldAddEditOrganizationStyles.modalButton]} disabled={disableConfirm} onPress={() => { confirmSearch(dataSelected); }}>
                  <Text style={FieldAddEditOrganizationStyles.textButton}>{translate(fieldAddEditMessages.common_119908_16_suggestConfirm)}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Modal >
        </View>
      </View>

    );
  }

  return renderComponent();
}