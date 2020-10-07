import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, TouchableOpacity, Image } from 'react-native';
import { EmployeeListScreenStyles } from './employee-list-style';
import { EmployeeState, RelationEmployeeProps } from './employees-types';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import StringUtils from '../../../../../../util/string-utils';
import { useNavigation, StackActions } from '@react-navigation/native';
import { RelationDisplay, TypeRelationSuggest, DefineFieldType, FIELD_BELONG, TargetID, TargetType } from '../../../../../../../config/constants/enum';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { useSelector, useDispatch } from 'react-redux';
import { getRelationData } from '../relation-detail-repositoty';
import { extensionDataSelector } from '../../../../../common-tab/common-tab-selector';
import { EmployeeListItemStyles } from '../../../../../../../modules/employees/list/employee-list-style';
import { Icon } from '../../../../../icon';
import { DetailScreenActions } from '../../../../../../../modules/employees/detail/detail-screen-reducer';
import { getEmployees } from '../../../../../../../modules/employees/employees-repository';

export function RelationEmployeeDetail(props: RelationEmployeeProps) {
  const dispatch = useDispatch()
  const [responseApiEmployee, setResponseApiEmployee] = useState<EmployeeState>();
  const { fieldInfo } = props;
  const displayTab = fieldInfo.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo.relationData ? fieldInfo.relationData.format : 0;
  const fieldBelong = fieldInfo.relationData.fieldBelong;
  const displayFieldIds = fieldInfo.relationData.displayFieldId;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(props?.fieldInfo, FIELD_LABLE, languageCode);
  const navigation = useNavigation();
  const extensionData = props?.extensionData ? props?.extensionData : useSelector(extensionDataSelector);
  const [relationData, setRelationData] = useState<any>();

  /**
   * Handling after first render
   */
  useEffect(() => {
    if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
      handleGetRelationEmployeesList();
    } else if (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) {
      handleGetRelationEmployeesTab();
    }
  }, []);


  /**
 * Call api get relation product list
 */
  const handleGetRelationEmployeesList = async () => {
    const employeeData: any = extensionData.find((item: any) => (item.key === fieldInfo.fieldName && item.fieldType === DefineFieldType.RELATION));
    const employeeIds: [] = JSON.parse(employeeData.value);
    if (employeeIds && employeeIds.length > 0) {
      const resEmployees = await getRelationData({
        listIds: employeeIds,
        fieldBelong: fieldBelong,
        fieldIds: Array.isArray(displayFieldIds) ? displayFieldIds : [displayFieldIds]
      });
      if (resEmployees?.data) {
        setRelationData(resEmployees.data.relationData);
      }
    }

  }

  /**
  * Call api get relation employee
  */
  const handleGetRelationEmployeesTab = async () => {
    const employeeData: any = extensionData.find((item: any) => (item.key === fieldInfo.fieldName && item.fieldType === DefineFieldType.RELATION));
    const employeeIds: number[] = JSON.parse(employeeData.value);
    const employeesRessponse = await getEmployees({
      offset: 0,
      selectedTargetId: TargetID.ZERO,
      selectedTargetType: TargetType.ALL,
      isUpdateListView: false,
      searchConditions: [],
      filterConditions: [],
      localSearchKeyword: "",
      orderBy: [],
    });
    if (employeesRessponse.data) {
      employeesRessponse.data.employees = employeesRessponse.data.employees.filter(item => employeeIds.includes(item.employeeId))
      setResponseApiEmployee((employeesRessponse.data as any));
    }
  }

  const getPathTreeName = (str: string) => {
    const trimStr = str.replace(/\\|"|{|}/g, '');
    const oStr = trimStr.lastIndexOf(',');
    const str1 = trimStr.substr(0, oStr);
    const str2 = trimStr.substr(oStr + 1, trimStr.length);
    if (!str1) {
      return str2.trim();
    }
    return str2.trim() + ' (' + str1.replace(/,/g, ' - ') + ')';
  }

  /**
   * reader employee tab
   */
  const renderEmployeeTab = () => {
    return (
      <View>
        <View style={EmployeeListScreenStyles.listEmployee}>
          <FlatList
            data={responseApiEmployee?.employees}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={EmployeeListItemStyles.inforEmployee}
                  onPress={() => {
                    dispatch(DetailScreenActions.addEmployeeIds(item.employeeId));
                    if (fieldInfo.fieldBelong == FIELD_BELONG.EMPLOYEE) {
                      navigation.dispatch(
                        StackActions.push('detail-employee', { id: item.employeeId, title: TEXT_EMPTY })
                      );
                    } else {
                      navigation.navigate('detail-employee', { id: item.employeeId, title: TEXT_EMPTY });
                    }
                  }}
                >
                  <View style={EmployeeListItemStyles.cellWrapper}>

                    {(item as any)?.employeeIcon?.fileUrl && (item as any)?.employeeIcon?.fileUrl !== "" ? (
                      <Image
                        source={{ uri: (item as any)?.employeeIcon?.fileUrl }}
                        style={EmployeeListItemStyles.avatar}
                      />
                    ) : (
                        <View style={EmployeeListItemStyles.wrapAvatar}>
                          <Text style={EmployeeListItemStyles.bossAvatarText}>
                            {item.employeeSurname ? item.employeeSurname.charAt(0) : (item.employeeName ? item.employeeName.charAt(0) : "")}
                          </Text>
                        </View>
                      )
                    }
                    <View style={EmployeeListItemStyles.name}>
                      <View>
                        <Text style={EmployeeListItemStyles.title} numberOfLines={1}>
                          {(item.employeeDepartments[0] as any)?.pathTreeName ? getPathTreeName((item.employeeDepartments[0] as any)?.pathTreeName) : ""}
                        </Text>
                      </View>

                      <View style={EmployeeListItemStyles.row}>
                        <Text numberOfLines={1}>{item.employeeSurname || ""} {item.employeeName || ""} {item.employeeDepartments[0]?.positionName || ""}</Text>
                      </View>
                      <View />
                    </View>
                  </View>
                  <View style={EmployeeListItemStyles.iconArrowRight}>
                    <Icon name="arrowRight" />
                  </View>

                </TouchableOpacity>
              )
            }}
            keyExtractor={(item, index) => item.employeeId.toString() + index}
            contentContainerStyle={EmployeeListScreenStyles.contentContainerStyle
            }
          />
        </View>
      </View>
    );
  };

  /**
   * reader employee list
   */
  const renderEmployeeList = () => {
    return (
      <View>
        <Text style={EmployeeListScreenStyles.labelHeader}>{title}</Text>
        <View style={EmployeeListScreenStyles.mainContainer}>
          {
            relationData ?
              relationData?.map((data: any, index: number) =>
                <View style={EmployeeListScreenStyles.employeeContainer} key={data.recordId.toString() + index}>
                  <TouchableOpacity onPress={() => {
                    dispatch(DetailScreenActions.addEmployeeIds(data.recordId));
                    if (fieldInfo.fieldBelong == FIELD_BELONG.EMPLOYEE) {
                      navigation.dispatch(
                        StackActions.push('detail-employee', { id: data.recordId, title: data.dataInfos[0].value ? data.dataInfos[0].value : TEXT_EMPTY })
                      );
                    } else {
                      navigation.navigate('detail-employee', { id: data.recordId, title: data.dataInfos[0].value ? data.dataInfos[0].value : TEXT_EMPTY });
                    }
                  }} >
                    <Text>
                      {data.dataInfos.length !== 0 &&
                        data.dataInfos.map((_item: any, idx: number) => {
                          return (
                            <Text key={idx} style={EmployeeListScreenStyles.link}>{data.recordId}</Text>
                          );
                        })}
                    </Text>
                  </TouchableOpacity>
                  {
                    ++index !== relationData.length
                    && relationData.length > 1
                    && <Text style={EmployeeListScreenStyles.link}>,</Text>
                  }
                </View>
              ) : (<View><Text></Text></View>)
          }
        </View>
      </View>
    );
  };

  return (
    <View>
      {
        (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) && renderEmployeeTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderEmployeeList()
      }
    </View>
  );
}
