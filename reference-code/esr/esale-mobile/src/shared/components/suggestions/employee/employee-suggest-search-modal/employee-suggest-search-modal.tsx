import React, { useState, useEffect, useRef } from 'react'
import { Text, View, TextInput, TouchableOpacity, Image, FlatList, RefreshControl, ActivityIndicator, Animated, PanResponder, Dimensions, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { Icon } from '../../../icon';
import { TypeSelectSuggest, KeySearch, PlatformOS } from '../../../../../config/constants/enum';
import { translate } from '../../../../../config/i18n';
import { messages } from '../employee-suggest-messages';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { cloneDeep, map, isEmpty, first, forEach } from 'lodash';
import { employeesSuggestion, saveEmployeeSuggestionsChoice, EmployeeSuggestionPayload } from '../../repository/employee-suggest-repositoty';
import { EmployeeSuggest, EmployeeDTO } from '../../interface/employee-suggest-interface';
import EmployeeSuggestSearchStyles from './employee-suggest-search-style';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../../../../modules/login/authorization/authorization-selector';
import StringUtils from '../../../../util/string-utils';
import { useDebounce } from '../../../../../config/utils/debounce';

/**
 * Define search modal props
 */
export interface IEmployeeSuggestSearchModalProps {
  typeSearch: number,
  fieldLabel: string,
  groupSearch: number | undefined,
  dataSelected: EmployeeDTO[],
  isCloseDetailSearchModal: boolean,
  isRelation?: boolean,
  selectedData: (data: EmployeeDTO, typeSearch: number) => void;
  setConditions: (cond: any[]) => void;
  openDetailSearchModal: () => void;
  closeModal: () => void;
  exportError: (err: any) => void;
}

/**
 * IndexChoice of data select
 */
enum IndexChoice {
  EMPLOYEE = 'employee',
  DEPARTMENT = 'employee_department',
  GROUP = 'employee_group'
}

// label positionName
const POSITION_NAME = 'positionName';

/**
 * EmployeeSuggestSearch screen component
 * @param props IEmployeeSuggestSearchModalProps
 */
export function EmployeeSuggestSearchModal(props: IEmployeeSuggestSearchModalProps) {
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY);
  const [offset, setOffset] = useState(0);
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY);
  const [responseApiEmployee, setResponseApiEmployee] = useState<EmployeeDTO[]>([]);
  const [footerIndicator, setFooterIndicator] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  const [onPress, setOnPress] = useState(0);
  const [statusButton, setStatusButton] = useState(TEXT_EMPTY);
  const [statusIcon, setStatusIcon] = useState(TEXT_EMPTY);
  const [y, setY] = useState(0);
  const debounceSearch = useDebounce(searchValue, 500);
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_event, gestureState) => {
        setY(gestureState.dy);
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      }
    })
  ).current;

  /**
   * Change value search
   */
  useEffect(() => {
    handleSearch(searchValue);
  }, [debounceSearch]);

  /**
   * handle text input to show suggestion
   * @param text text from input
   */
  const handleSearch = (text: string) => {
    responseApiEmployee.splice(0, responseApiEmployee.length);
    setResponseApiEmployee([]);
    setOffset(0);
    setSearchValue(text);
    setErrorMessage(TEXT_EMPTY);
    // Call API
    handleGetEmployees(text, 0);
  }

  /**
   * Call api get suggest employee
   * @param text search input
   */
  const handleGetEmployees = async (text: string, offSet: number) => {
    setIsNoData(true);
    const payload: EmployeeSuggestionPayload = {
      keyWords: text,
      searchType: props.groupSearch === KeySearch.NONE ? null : props.groupSearch,
      offSet,
      limit: 10,
      listItemChoice: props.typeSearch === TypeSelectSuggest.MULTI ? map(props.dataSelected, item => {
        return {
          idChoice: item.itemId,
          searchType: item.groupSearch
        };
      }) : []
    };
    const resEmployees = await employeesSuggestion(payload);
    if (resEmployees.status === 200 && resEmployees.data) {
      setEmployeeDTO(resEmployees.data);
      setErrorMessage(TEXT_EMPTY);
    } else {
      setErrorMessage(translate(messages.errorCallAPI));
      setIsNoData(true);
      setResponseApiEmployee([]);
    }
    setRefreshData(false);
    setFooterIndicator(false);
  }

  /**
   * set data view list when call API
   * @param response data API
   */
  const setEmployeeDTO = (data: EmployeeSuggest) => {
    const dataConvert: EmployeeDTO[] = [];
    switch (props.groupSearch) {
      case KeySearch.EMPLOYEE: {
        setEmployeeAPI(data, dataConvert);
        break;
      }
      case KeySearch.DEPARTMENT: {
        setDepartmentAPI(data, dataConvert);
        break;
      }
      case KeySearch.GROUP: {
        setGroupAPI(data, dataConvert);
        break;
      }
      default: {
        setEmployeeAPI(data, dataConvert);
        setDepartmentAPI(data, dataConvert);
        setGroupAPI(data, dataConvert);
      }
    }

    if (!isEmpty(dataConvert)) {
      setIsNoData(false);
    }
    dataConvert.sort((item1, item2) => {
      if (item1.idHistoryChoice && item2.idHistoryChoice) {
        return item2.idHistoryChoice - item1.idHistoryChoice
      }
      return 0;
    });
    setResponseApiEmployee(cloneDeep(responseApiEmployee).concat(dataConvert));
  }

  /**
   * set data seach when search with employee
   * @param response data API
   */
  const setEmployeeAPI = (data: EmployeeSuggest, dataConvert: EmployeeDTO[]) => {
    forEach(data.employees, (employeeItem) => {
      const department = first(employeeItem.employeeDepartments);
      let itemView = {
        itemId: employeeItem.employeeId,
        groupSearch: KeySearch.EMPLOYEE,
        itemName: getEmployeeFullName(employeeItem.employeeSurname, employeeItem.employeeName),
        departmentName: department ? department.departmentName : TEXT_EMPTY,
        positionName: department ? StringUtils.getFieldLabel(department, POSITION_NAME, languageCode) : TEXT_EMPTY,
        itemImage: employeeItem.employeeIcon?.fileUrl,
        isBusy: employeeItem.isBusy,
        indexChoice: IndexChoice.EMPLOYEE,
        employee: employeeItem,
        idHistoryChoice: employeeItem.idHistoryChoice || 0
      }
      dataConvert.push(itemView);
    });
  }

  /**
   * set data seach when search with depart
   * @param response data API
   */
  const setDepartmentAPI = (data: EmployeeSuggest, dataConvert: EmployeeDTO[]) => {
    forEach(data.departments, (departmentItem) => {
      let itemView = {
        itemId: departmentItem.departmentId,
        groupSearch: KeySearch.DEPARTMENT,
        itemName: departmentItem.departmentName,
        departmentName: departmentItem.parentDepartment.departmentName,
        positionName: TEXT_EMPTY,
        itemImage: TEXT_EMPTY,
        listEmployeeName: map(departmentItem.employeesDepartments, item => getEmployeeFullName(item.employeeSurname, item.employeeName)).join(', '),
        indexChoice: IndexChoice.DEPARTMENT,
        employee: departmentItem,
        idHistoryChoice: departmentItem.idHistoryChoice || 0
      }
      dataConvert.push(itemView);
    });
  }

  /**
   * set data seach when search with group
   * @param response data API
   */
  const setGroupAPI = (data: EmployeeSuggest, dataConvert: EmployeeDTO[]) => {
    forEach(data.groups, (groupItem) => {
      let itemView = {
        itemId: groupItem.groupId,
        groupSearch: KeySearch.GROUP,
        itemName: groupItem.groupName,
        groupName: groupItem.groupName,
        positionName: TEXT_EMPTY,
        itemImage: TEXT_EMPTY,
        listEmployeeName: map(groupItem.employeesGroups, item => getEmployeeFullName(item.employeeSurname, item.employeeName)).join(', '),
        indexChoice: IndexChoice.GROUP,
        employee: groupItem,
        idHistoryChoice: groupItem.idHistoryChoice || 0
      }
      dataConvert.push(itemView);
    });
  }

  /**
   * Get employee name
   * @param surname 
   * @param name 
   */
  const getEmployeeFullName = (surname: string, name: string) => {
    return [surname, name].join(' ').trim();
  }

  /**
   * event click choose employee item in list
   * @param employee
   */
  const handleClickEmloyeeItem = (employee: EmployeeDTO) => {
    props.selectedData(employee, props.typeSearch);
    if (!props.isRelation) {
      handleSaveSuggestionsChoice(employee);
    }
  }

  /**
   * save suggestions choice
   * @param itemSelected 
   */
  const handleSaveSuggestionsChoice = async (selected: EmployeeDTO) => {
    const response = await saveEmployeeSuggestionsChoice({
      sugggestionsChoice: [
        {
          index: selected.indexChoice,
          idResult: selected.itemId
        }
      ]
    });
    if (response.status !== 200) {
      props.exportError(response);
    }
  }

  /**
   * Render ActivityIndicator
   * @param animating 
   */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator style={{ padding: 5 }} animating={animating} size="large" />
    )
  }

  /**
   * Render separator flatlist
   */
  const renderItemSeparator = () => {
    return (
      <View
        style={{ height: 1, backgroundColor: '#E5E5E5' }}
      />
    )
  }

  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    const { height } = Dimensions.get('window');
    if (responseApiEmployee.length === 0) {
      return 1;
    } else if (y < 0) {
      return 10;
    } else {
      if((statusButton && statusIcon ===TEXT_EMPTY && y > (0.35*height + (0.33*height-onPress))) || (statusIcon && y>0.35*height)){
        props.closeModal();
      }
      return 2;
    }
    setStatusIcon(TEXT_EMPTY);
    setStatusButton(TEXT_EMPTY);
  }

  // const status check onpress
  const STATUS = {
    BUTTON: "button",
    ICON: "icon",
  }

  /**
   * press drag icon
   * @param touchMove the coordinates of my touch event
   */
  const pressIcon=(touchMove: any)=>{
    setOnPress(touchMove.nativeEvent.locationY);
    setStatusIcon(STATUS.ICON)
  }
   /**
    * press drag button
    * @param touchMove the coordinates of my touch event
    */
  const closeButton=(touchMove: any)=>{
    setOnPress(touchMove.nativeEvent.locationY);
    setStatusButton(STATUS.BUTTON)
  }

  return (
    <View style={EmployeeSuggestSearchStyles.modalContainer} >
      <Animated.View
        style={{ flex: responseApiEmployee.length > 0 ? 1 : 4, justifyContent: 'flex-end' }}
        {...panResponder.panHandlers}
      >
        <View onTouchStart={(e) => { closeButton(e) }}>
          <TouchableOpacity
            style={EmployeeSuggestSearchStyles.modalTouchable}
            onPress={() => props.closeModal()}
          >
            <View onTouchStart={(e) => { pressIcon(e) }}>
              <Icon style={EmployeeSuggestSearchStyles.modalIcon} name="iconModal" />
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <KeyboardAvoidingView
        style={[EmployeeSuggestSearchStyles.modalContent, { flex: getFlexNumber() }]}
        behavior={Platform.OS === PlatformOS.IOS ? "padding" : undefined}
      >
        <View style={EmployeeSuggestSearchStyles.searchInputContainer}>
          <View style={EmployeeSuggestSearchStyles.inputContent}>
            <TextInput style={EmployeeSuggestSearchStyles.inputSearchTextData} placeholder=
              {props.typeSearch == TypeSelectSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
                : props.fieldLabel + translate(messages.placeholderMultiChoose)}
              value={searchValue}
              onChangeText={(text) => setSearchValue(text)}
            />
            <View style={EmployeeSuggestSearchStyles.textSearchContainer}>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  props.openDetailSearchModal();
                }}
              >
                <Icon name="searchOption" />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={EmployeeSuggestSearchStyles.cancel}
            onPress={() => {
              handleSearch(TEXT_EMPTY);
              setFooterIndicator(true);
            }}
          >
            <Text style={EmployeeSuggestSearchStyles.cancelText}>{translate(messages.cancelText)}</Text>
          </TouchableOpacity>
        </View>
        <View style={EmployeeSuggestSearchStyles.dividerContainer} />
        {
          errorMessage !== TEXT_EMPTY && (
            <Text style={EmployeeSuggestSearchStyles.errorMessage}>{errorMessage}</Text>
          )
        }
        {errorMessage === TEXT_EMPTY &&
          <View style={[!isEmpty(responseApiEmployee) ? EmployeeSuggestSearchStyles.suggestionContainer : EmployeeSuggestSearchStyles.suggestionContainerNoData]}>
            <FlatList
              data={responseApiEmployee}
              keyExtractor={item => { return `${item.itemId.toString()}_${item.groupSearch.toString()}` }}
              onEndReached={() => {
                if (!isNoData) {
                  setFooterIndicator(true);
                  handleGetEmployees(searchValue, offset + 10);
                  setOffset(offset + 10);
                }
              }}
              onEndReachedThreshold={0.001}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              ItemSeparatorComponent={renderItemSeparator}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setFooterIndicator(true);
                    setRefreshData(true);
                    handleSearch(searchValue);
                  }}
                />
              }
              renderItem={({ item }) =>
                <TouchableOpacity style={!isEmpty(responseApiEmployee) ? EmployeeSuggestSearchStyles.touchableSelect : EmployeeSuggestSearchStyles.touchableSelectNoData}
                  onPress={() => {
                    handleClickEmloyeeItem(item);
                  }}>
                  <View style={EmployeeSuggestSearchStyles.suggestAvatar}>
                    {item.groupSearch === KeySearch.DEPARTMENT &&
                      <View style={EmployeeSuggestSearchStyles.iconDepart}>
                        <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                      </View>
                    }

                    {item.groupSearch === KeySearch.EMPLOYEE && !isEmpty(item.itemImage) &&
                      <Image style={EmployeeSuggestSearchStyles.iconImage} source={{ uri: item.itemImage }} />
                    }
                    {item.groupSearch === KeySearch.EMPLOYEE && isEmpty(item.itemImage) &&
                      <View style={EmployeeSuggestSearchStyles.iconEmployee}>
                        <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                      </View>
                    }

                    {item.groupSearch === KeySearch.GROUP &&
                      <View style={EmployeeSuggestSearchStyles.iconGroup}>
                        <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                      </View>
                    }
                  </View>
                  {item.groupSearch === KeySearch.DEPARTMENT &&
                    <View style={EmployeeSuggestSearchStyles.suggestResponseText}>
                      <Text style={EmployeeSuggestSearchStyles.suggestText}>{item.itemName}</Text>
                      <Text numberOfLines={1} style={EmployeeSuggestSearchStyles.suggestTextDate}>{item.listEmployeeName}</Text>
                    </View>
                  }
                  {item.groupSearch === KeySearch.EMPLOYEE &&
                    <View style={EmployeeSuggestSearchStyles.suggestResponseText}>
                      <Text style={EmployeeSuggestSearchStyles.suggestText}>{item.departmentName}</Text>
                      <Text style={EmployeeSuggestSearchStyles.suggestTextDate}>{item.itemName} {item.positionName}</Text>
                      {item.isBusy &&
                        <View style={EmployeeSuggestSearchStyles.busyWarningContent}>
                          <Icon name="warning" style={EmployeeSuggestSearchStyles.warningIcon} />
                          <Text numberOfLines={1} style={EmployeeSuggestSearchStyles.busyText}>{translate(messages.isBusyMessage)}</Text>
                        </View>
                      }
                    </View>
                  }
                  {item.groupSearch === KeySearch.GROUP &&
                    <View style={EmployeeSuggestSearchStyles.suggestResponseText}>
                      <Text style={EmployeeSuggestSearchStyles.suggestText}>{item.itemName}</Text>
                      <Text numberOfLines={1} style={EmployeeSuggestSearchStyles.suggestTextDate}>{item.listEmployeeName}</Text>
                    </View>
                  }
                </TouchableOpacity>
              }
            />
          </View>
        }
      </KeyboardAvoidingView>
    </View>
  )
}
