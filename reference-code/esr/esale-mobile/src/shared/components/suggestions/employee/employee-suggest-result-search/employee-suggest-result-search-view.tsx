import React, { useState, useEffect, } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import EmployeeSuggestResultSearchStyle, { AppbarStyles } from './employee-suggest-result-search-style';
import { TypeSelectSuggest } from '../../../../../config/constants/enum';
import { IResultSearchProps } from '../../interface/employee-suggest-interface';
import { TEXT_EMPTY } from '../../../../../config/constants/constants';
import { getEmployyees } from '../../repository/employee-suggest-result-search-repositoty';
import { Employee } from '../../interface/employee-suggest-result-search-interface';
import { messages } from '../employee-suggest-messages';
import { translate } from '../../../../../config/i18n';
import { cloneDeep, isNil, map, isEmpty, filter, findIndex } from 'lodash';
import { saveEmployeeSuggestionsChoice } from '../../repository/employee-suggest-repositoty';
import { responseMessages } from '../../../../messages/response-messages';
import StringUtils from '../../../../util/string-utils';
import { getFieldNameElastic } from '../../../../../modules/search/search-detail-special/employee-special';
import { ExtensionName, ServiceName } from '../../../../../modules/search/search-enum';
import { useSelector } from 'react-redux';
import { ServiceInfoSelector, ServiceFavoriteSelector } from '../../../../../modules/menu/menu-feature-selector';
import { authorizationSelector } from '../../../../../modules/login/authorization/authorization-selector';
import { SvgCssUri } from 'react-native-svg';
import { apiUrl } from '../../../../../config/constants/api';
import { FilterMessageStyle } from '../../../message/message-style';

const REGEXP = /["{}]/g;
const OFF_SET = 20;
const LIMIT = 20;
const INDEX_CHOICE = 'employee';
/**
 * Result Search View
 * @param props 
 */
export function EmployeeSuggestResultSearchView(props: IResultSearchProps) {
  const unCheckedIcon = require("../../../../../../assets/icons/unchecked.png");
  const checkedIcon = require("../../../../../../assets/icons/selected.png");
  const deleteIcon = require("../../../../../../assets/icons/close.png");
  //state click Employee
  const [statusSelectedItem, setStatusSelectedItem] = useState(new Map());
  //state item Employee used to be Clicked
  const [stateEmployeeBefore, setStateEmployeeBefore] = useState(TEXT_EMPTY);
  //list data selected
  const [dataSelected, setDataSelected] = useState<Employee[]>([]);
  //List data show up on Screen
  const [viewDataSelect, setViewDataSelect] = useState<Employee[]>([]);
  //offset
  const [offset, setOffset] = useState(0);
  //totalRecords
  const [totalRecords, setTotalRecords] = useState(0);
  const [footerIndicator, setFooterIndicator] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [isNoData, setIsNoData] = useState(false);
  const [displayNoDataMessage, setDisplayNoDataMessage] = useState(false);
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const serviceOther = useSelector(ServiceInfoSelector);
  const employees = useSelector(authorizationSelector);
  /**
   * get data by API depends on input from Search-Detail-Screen
   * @param offsetLocal 
   */
  const getDataFromAPI = async (offsetLocal: number) => {
    setDisplayNoDataMessage(false);
    setIsNoData(true);
    setFooterIndicator(true);
    const res = await getEmployyees({
      searchConditions: buildSearchCondition(),
      filterConditions: [],
      limit: LIMIT,
      offset: offsetLocal
    })
    const employeeLocal = res?.data?.employees;
    if (!isEmpty(employeeLocal)) {
      setIsNoData(false);
    } else if (isEmpty(viewDataSelect)) {
      setDisplayNoDataMessage(true);
    }
    if (!isNil(employeeLocal)) {
      if (offsetLocal > 0) {
        setViewDataSelect(filter(cloneDeep(viewDataSelect).concat(employeeLocal), (value, index, self) => {
          return findIndex(self, item => item.employeeId === value.employeeId) === index;
        }))
      } else {
        setViewDataSelect(employeeLocal);
      }
      setTotalRecords(res.data.totalRecords);
    }
    setFooterIndicator(false);
    setRefreshData(false);
  }


  /**
   * Loadmore data everytime offset is changed
   */
  useEffect(() => {
    getDataFromAPI(offset);
  }, [offset]
  )

  /** 
   * set map state check view checkbox
   * @param employee 
   */
  const handleViewCheckbox = (employee: Employee) => {
    const newStateCheck = new Map(statusSelectedItem);
    let keyMap = `${employee.employeeId}`;
    newStateCheck.set(keyMap, !statusSelectedItem.get(keyMap));

    if (TypeSelectSuggest.SINGLE == props.typeSearch) {
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
  const handleEmployeeSelected = (employee: Employee, typeSearch: number) => {
    const isExistEmployee = dataSelected.filter(itemEmployee => (itemEmployee.employeeId === employee.employeeId));
    if (typeSearch === TypeSelectSuggest.SINGLE) {
      dataSelected.pop();
      if (isExistEmployee?.length <= 0) {
        dataSelected.push(employee);
      }
      setDataSelected(dataSelected);
    } else {
      if (isExistEmployee?.length > 0) {
        let listDataSelected = dataSelected.filter(itemEmployee => (itemEmployee.employeeId !== employee.employeeId))
        setDataSelected(listDataSelected);
      } else {
        dataSelected.push(employee);
        setDataSelected(dataSelected);
      }
    }
  }
  /**
   * call API saveEmployeeSuggestionsChoice
   * @param data
   */
  const callsaveEmployeeSuggestionsChoiceAPI = async (data: Employee[]) => {
    if (!props.isRelation) {
      const response = await saveEmployeeSuggestionsChoice({
        sugggestionsChoice: map(data, item => {
          return {
            index: INDEX_CHOICE,
            idResult: item.employeeId
          }
        })
      });
      if (response.status !== 200) {
        props.exportError(response);
      }
    }
  }

  /**
   * convert data from string object
   * @param pathTreeName 
   */
  const convertObjectToString = (pathTreeName: string) => {
    return pathTreeName.replace(REGEXP, TEXT_EMPTY);
  }

  /**
   * Check value condition
   * @param value 
   * @param isSearchBlank 
   */
  const checkEmptyValue = (value: any, isSearchBlank: boolean) => {
    return !isSearchBlank && isEmpty(value);
  };

  /**
   * Convert search condition
   */
  const buildSearchCondition = () => {
    const conditions = [...props.searchConditions];
    let trueConditions = [];
    for (let i = 0; i <= conditions.length - 1; i++) {
      if (
        !checkEmptyValue(conditions[i].fieldValue, conditions[i].isSearchBlank)
      ) {
        const item: any = {};
        item.fieldId = conditions[i].fieldId;
        item.fieldName = StringUtils.camelCaseToSnakeCase(
          getFieldNameElastic(
            conditions[i],
            ExtensionName[ServiceName.employees] || ""
          )
        );
        item.fieldType = conditions[i].fieldType;
        item.fieldValue = conditions[i].fieldValue;
        item.isDefault = conditions[i].isDefault;
        if (conditions[i].timeZoneOffset) {
          item.timeZoneOffset = conditions[i].timeZoneOffset;
        }
        if (
          conditions[i]?.fieldValue?.length > 0 &&
          (!!conditions[i]?.fieldValue[0]?.from ||
            conditions[i]?.fieldValue[0]?.from === TEXT_EMPTY)
        ) {
          item.fieldValue =
            typeof conditions[i].fieldValue[0] === "string"
              ? conditions[i].fieldValue[0]
              : JSON.stringify(conditions[i].fieldValue[0]);
        } else if (typeof conditions[i].fieldValue === "string") {
          item.fieldValue = conditions[i].fieldValue || "";
        } else {
          item.fieldValue = conditions[i].fieldValue
            ? JSON.stringify(conditions[i].fieldValue)
            : "";
        }
        if (conditions[i].searchOption) {
          item.searchOption = conditions[i].searchOption;
        } else {
          item.searchOption = 1;
        }
        if (conditions[i].searchType) {
          item.searchType = conditions[i].searchType;
        } else {
          item.searchType = 1;
        }
        if (conditions[i].isSearchBlank) {
          item.fieldValue = ''
        }
        trueConditions.push(item);
      }
    }
    return trueConditions;
  };

  /**
   * handle click employee in list
   * @param employee
   */
  const handleClickEmloyeeItem = (employee: Employee) => {
    handleViewCheckbox(employee);
    handleEmployeeSelected(employee, props.typeSearch);

  }
  function renderResultEmpty() {
    let service = serviceFavorite.find(item => item.serviceId === 8);
    !service && (service = serviceOther.find(item => item.serviceId === 8));
    return service && <View style={EmployeeSuggestResultSearchStyle.noDataMessage}>
      {service.iconPath &&
        <View style={FilterMessageStyle.imageView}>
          <SvgCssUri
            uri={`${apiUrl}${service.iconPath}`}
            width="100%"
            height="100%"
          />
        </View>}
      <Text style={EmployeeSuggestResultSearchStyle.textNoData}>{translate(responseMessages.INF_COM_0019).replace('{0}', StringUtils.getFieldLabel(service, "serviceName", employees.languageCode))}</Text>
    </View>
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
  return (
    <View style={{ flex: 1 }}>
      <View style={[AppbarStyles.barContainer, AppbarStyles.block]}>
        <TouchableOpacity
          onPress={() => {
            //back to Search Detail Screen
            props.closeModal();
          }}>
          <Image style={EmployeeSuggestResultSearchStyle.deleteIcon} source={deleteIcon} />
        </TouchableOpacity>
        <View style={AppbarStyles.titleWrapper}>
          <Text style={AppbarStyles.title}>{props.title ? props.title : translate(messages.functionText)}</Text>
        </View>
        <TouchableOpacity
          style={dataSelected.length > 0
            ? AppbarStyles.applyButton
            : [AppbarStyles.applyButton, AppbarStyles.disableButton]}
          disabled={dataSelected.length === 0}
          onPress={() => {
            //back to Result Selected Screen
            props.updateStateElement(dataSelected);
            callsaveEmployeeSuggestionsChoiceAPI(dataSelected);
            props.closeModal();
          }}
        >
          <Text style={EmployeeSuggestResultSearchStyle.AddlabelStyle} >{translate(messages.choiceText)} </Text>
        </TouchableOpacity>
      </View >

      <Text style={EmployeeSuggestResultSearchStyle.SumLabelStyle}>
        {translate(messages.totalRecordStartText).concat(totalRecords.toString()).concat(translate(messages.totalRecordEndText))}
      </Text>
      <View style={EmployeeSuggestResultSearchStyle.Underline}>

      </View>
      <View style={{ flex: 1 }}>
        {
          !displayNoDataMessage ? (
            <FlatList
              onEndReachedThreshold={0.1}
              onEndReached={() => {
                if (!isNoData) {
                  setOffset(offset + OFF_SET);
                }
              }}
              data={viewDataSelect}
              keyExtractor={item => item.employeeId.toString()}
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setFooterIndicator(true);
                    setRefreshData(true);
                    setOffset(0);
                  }}
                />
              }
              renderItem={({ item }) => <View>
                <TouchableOpacity
                  onPress={() => {
                    handleClickEmloyeeItem(item);
                  }}
                  style={EmployeeSuggestResultSearchStyle.dataModalStyle}>
                  <View style={EmployeeSuggestResultSearchStyle.dataSelectedStyle}>
                    {
                      <View style={EmployeeSuggestResultSearchStyle.iconEmployee}>
                        {isNil(item.employeeIcon?.filePath)
                          ?
                          <Text>{`${item.employeeSurnameKana ? item.employeeSurnameKana.substr(0, 1) : TEXT_EMPTY}`}</Text>
                          :
                          <Image style={EmployeeSuggestResultSearchStyle.iconCheck} source={{
                            uri: item.employeeIcon?.filePath
                          }
                          } />
                        }
                      </View>
                    }
                    <View>

                      <Text>
                        {
                          !isNil(item.employeeDepartments[0])
                            ? convertObjectToString(item.employeeDepartments[0].pathTreeName)
                            : null
                        }
                      </Text>
                      <Text style={EmployeeSuggestResultSearchStyle.nameEmployeeStyle}>
                        {item.employeeSurnameKana}{item.employeeNameKana} {item.employeeDepartments[0].positionName}
                      </Text>
                    </View>
                  </View>
                  <View style={EmployeeSuggestResultSearchStyle.iconCheckView}>
                    {
                      statusSelectedItem.get(`${item.employeeId}`) &&
                      <Image style={EmployeeSuggestResultSearchStyle.iconCheck} source={checkedIcon} />
                    }
                    {
                      !statusSelectedItem.get(`${item.employeeId}`) &&
                      < Image style={EmployeeSuggestResultSearchStyle.iconCheck} source={unCheckedIcon} />
                    }
                  </View>
                </TouchableOpacity>
              </View>
              }
            />
          ) : (
              renderResultEmpty()
            )
        }
      </View>
    </View >
  );
}




