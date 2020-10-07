import { AntDesign } from '@expo/vector-icons';
import { cloneDeep, first, forEach, isEmpty, map } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Dimensions, FlatList, Image, PanResponder, RefreshControl, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { TEXT_EMPTY } from '../../../../../../../../config/constants/constants';
import { KeySearch, TypeRelationSuggest, PlatformOS } from '../../../../../../../../config/constants/enum';
import { translate } from '../../../../../../../../config/i18n';
import { useDebounce } from '../../../../../../../../config/utils/debounce';
import { authorizationSelector } from '../../../../../../../../modules/login/authorization/authorization-selector';
import StringUtils from '../../../../../../../util/string-utils';
import { Icon } from '../../../../../../icon';
import { employeesSuggestion, EmployeeSuggestionPayload } from '../../relation-suggest-repository';
import { EmployeeDTO, EmployeeSuggest } from '../employee-suggest-interface';
import { messages } from '../../relation-suggest-messages';
import EmployeeSuggestSearchStyles from './employee-suggest-search-style';

/**
 * Define search modal props
 */
export interface IEmployeeSuggestSearchModalProps {
  typeSearch: number,
  fieldLabel: string,
  fieldInfo:any,
  dataSelected: EmployeeDTO[],
  selectedData: (data: EmployeeDTO[], typeSearch: number) => void;
  closeModal: () => void;
  exportError: (err: any) => void;
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
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  const [disableConfirm, setDisableConfirm] = useState(false);
  //state item Employee used to be Clicked
  const [stateEmployeeBefore, setStateEmployeeBefore] = useState(TEXT_EMPTY);
  //list data selected
  const [dataSelected, setDataSelected] = useState<EmployeeDTO[]>([]);
  const [isDisplayKeyboard, setIsDisplayKeyboard] = useState(false);

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
 * set map state check view checkbox
 * @param employee 
 */
  const handleViewCheckbox = (employee: EmployeeDTO) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${employee.itemId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeRelationSuggest.SINGLE == props.typeSearch) {
      if (stateEmployeeBefore.length > 0) {
        newStateCheck.set(stateEmployeeBefore, !statusSelectedItem.get(stateEmployeeBefore));
      }
    }
    if (keyMap === stateEmployeeBefore) {
      setStateEmployeeBefore(TEXT_EMPTY);
    } else {
      setStateEmployeeBefore(keyMap);
    }
    setStatusSelectedItem(newStateCheck);
  }

  /**
 * handle add employee to list
 * @param employee 
 * @param typeSearch 
 */
  const handleEmployeeSelected = (employee: EmployeeDTO, typeSearch: number) => {
    const isExistEmployee = dataSelected.filter(itemEmployee => (itemEmployee.itemId === employee.itemId));
    if (typeSearch === TypeRelationSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistEmployee?.length <= 0) {
        dataSelected.push(employee);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistEmployee?.length > 0) {
        let listDataSelected = dataSelected.filter(itemEmployee => (itemEmployee.itemId !== employee.itemId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(employee);
        setDataSelected(dataSelected);
      }
    }
  }

  /**
 * handle click employee in list
 * @param employee
 */
  const handleClickEmloyeeItem = (employee: EmployeeDTO) => {
    handleViewCheckbox(employee);
    handleEmployeeSelected(employee, props.typeSearch);
  }

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
    // Call A
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
      searchType: null,
      offSet,
      limit: 10,
      listItemChoice: props.typeSearch === TypeRelationSuggest.MULTI ? map(props.dataSelected, item => {
        return {
          idChoice: item.itemId,
          searchType: KeySearch.EMPLOYEE
        };
      }) : [],
      relationFieldI:props?.fieldInfo.fieldId
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
    setEmployeeAPI(data, dataConvert);
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
        indexChoice: "employee",
        employee: employeeItem,
        idHistoryChoice: employeeItem.idHistoryChoice || 0,
        employeeData: employeeItem.employeeData
      }
      dataConvert.push(itemView);
    });
  }

  const confirmSearch = (data: EmployeeDTO[]) => {
    setDisableConfirm(true);
    if (props.selectedData) {
      props.selectedData(data, props.typeSearch);
    }
    setDisableConfirm(false);
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
        // style={{ height: 1, backgroundColor: '#E5E5E5' }}
      />
    )
  }

  /**
   * Get modal flex
   */
  const getFlexNumber = () => {
    const { height } = Dimensions.get('window');
    if (responseApiEmployee.length === 0) {
      return 2;
    } else if (y < 0) {
      return 10;
    } else {
      if ((statusButton && statusIcon === TEXT_EMPTY && y > (0.35 * height + (0.33 * height - onPress))) || (statusIcon && y > 0.35 * height)) {
        props.closeModal();
      }
      return 2;
    }
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
  const pressIcon = (touchMove: any) => {
    setOnPress(touchMove.nativeEvent.locationY);
    setStatusIcon(STATUS.ICON)
  }
  /**
   * press drag button
   * @param touchMove the coordinates of my touch event
   */
  const closeButton = (touchMove: any) => {
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
        <View style={EmployeeSuggestSearchStyles.inputContainer}>
          <TextInput style={EmployeeSuggestSearchStyles.inputSearchTextData} placeholder=
            {props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}
            value={searchValue}
            onChangeText={(text) => setSearchValue(text)}
            onFocus={() => setIsDisplayKeyboard(true)}
            onBlur={() => setIsDisplayKeyboard(false)}
          />
          <View style={EmployeeSuggestSearchStyles.textSearchContainer}>
            {searchValue.length > 0 && (
              <TouchableOpacity onPress={() => setSearchValue(TEXT_EMPTY)}>
                <AntDesign size ={18} name="closecircle" style={EmployeeSuggestSearchStyles.iconDelete} />
              </TouchableOpacity>
            )}
          </View>
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
              keyExtractor={item => { return `${item.itemId.toString()}` }}
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
              contentContainerStyle={EmployeeSuggestSearchStyles.listBottom}
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
                    {item.groupSearch === KeySearch.EMPLOYEE && !isEmpty(item.itemImage) &&
                      <Image style={EmployeeSuggestSearchStyles.iconImage} source={{ uri: item.itemImage }} />
                    }
                    {item.groupSearch === KeySearch.EMPLOYEE && isEmpty(item.itemImage) &&
                      <View style={EmployeeSuggestSearchStyles.iconEmployee}>
                        <Text>{`${item.itemName ? item.itemName.substr(0, 1) : TEXT_EMPTY}`}</Text>
                      </View>
                    }
                  </View>
                  {item.groupSearch === KeySearch.EMPLOYEE &&
                    <View style={EmployeeSuggestSearchStyles.suggestResponseText}>
                      <Text style={EmployeeSuggestSearchStyles.suggestText}>{item.departmentName}</Text>
                      <Text style={EmployeeSuggestSearchStyles.suggestTextDate}>{item.itemName} {item.positionName}</Text>
                    </View>
                  }
                  <View style={EmployeeSuggestSearchStyles.iconCheckView}>
                    {
                      statusSelectedItem.get(`${item.itemId}`) &&
                      <Icon name={"checkedIcon"}
                        style={EmployeeSuggestSearchStyles.iconCheck} />
                    }
                    {
                      !statusSelectedItem.get(`${item.itemId}`) &&
                      TypeRelationSuggest.MULTI === props.typeSearch &&
                      <Icon name={"unCheckedIcon"}
                        style={EmployeeSuggestSearchStyles.iconCheck} />
                    }
                  </View>
                </TouchableOpacity>
              }
            />
          </View>
        }
        {!(isDisplayKeyboard && isEmpty(responseApiEmployee)) &&
          <TouchableOpacity style={EmployeeSuggestSearchStyles.modalButton} disabled={disableConfirm} onPress={() => { confirmSearch(dataSelected); }}>
            <Text style={EmployeeSuggestSearchStyles.textButton}>{translate(messages.confirm)}</Text>
          </TouchableOpacity>
        }
      </KeyboardAvoidingView>
    </View>
  )
}
