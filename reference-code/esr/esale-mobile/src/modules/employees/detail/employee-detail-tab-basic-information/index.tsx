import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { DetailTabBasicInformationStyles } from '../detail-style';
import {
  employeeDataSelector,
} from '../detail-screen-selector';
import { messages } from '../detail-messages';
import { translate } from '../../../../config/i18n';
import { Field, EmployeePackages, EmployeeManagers } from '../../employees-repository';

import { DynamicControlField } from '../../../../shared/components/dynamic-form/control-field/dynamic-control-field';
import {
  ControlType,
  DefineFieldType,
  TypeTitle,
  ValueAdmin,
  RelationDisplay,
  FIELD_BELONG,
} from '../../../../config/constants/enum';
import { useNavigation, StackActions } from '@react-navigation/native';

import { TEXT_EMPTY, FIELD_LABLE } from '../../../../config/constants/constants';
import StringUtils from '../../../../shared/util/string-utils';
import EntityUtils from '../../../../shared/util/entity-utils';
import { FieldDetailEmailStyles } from '../../../../shared/components/dynamic-form/control-field/detail/field-detail-styles';
import { authorizationSelector } from '../../../login/authorization/authorization-selector';
import { ScrollView } from 'react-native-gesture-handler';
import { commonTabActions } from '../../../../shared/components/common-tab/common-tab-reducer';
import { initializeFieldSelector } from '../../../../shared/api/api-selector';
import { DetailScreenActions } from '../detail-screen-reducer';
/**
 * Component for show tab basic information of employee
 */
export const DetailBasicInformation: React.FC = () => {

  // get from redux data of each employee
  const employeeData = useSelector(employeeDataSelector);
  const navigation = useNavigation();
  const authState = useSelector(authorizationSelector);
  const dispatch = useDispatch();
  const languageCode = authState?.languageCode ? authState?.languageCode : TEXT_EMPTY;
  // get data destructure
  const { data, fields } = employeeData;
  const extensionData = data?.employeeData;
  const rowData: { key: any, fieldValue: any } = { key: undefined, fieldValue: undefined }
  const initializeField = useSelector(initializeFieldSelector);
  let isFind = false;
  let name = "";
  let nameKana = "";

  useEffect(() => {
    if (fields) {
      const relationFieldInfos = fields.filter(element => element.fieldType === 17);
      dispatch(commonTabActions.setFieldInfos({ key: 'DetailScreen', fieldInfos: relationFieldInfos }))
    } else {
      dispatch(commonTabActions.setFieldInfos({ key: 'DetailScreen', fieldInfos: [] }))
    }
    dispatch(commonTabActions.setExtensionData({ extensionData: extensionData }))
  }, [employeeData]);

  const getListIdInTab = () => {
    const listTab = fields?.filter((item: any) => item.fieldType.toString() === DefineFieldType.TAB);
    const listId: any[] = [];
    if (listTab) {
      listTab.forEach((tab: any) => {
        if (tab.tabData.length > 0) {
          tab.tabData.forEach((item: any) => {
            listId.push(item)
          })
        }
      })
    }
    return listId;
  }

  const listFieldId = getListIdInTab();
  // show View Control
  function showNameControl(title: string, content: string) {
    return <View style={[DetailTabBasicInformationStyles.inforComponent]}>
      <Text style={DetailTabBasicInformationStyles.inforText}>
        {title}
      </Text>
      <Text style={DetailTabBasicInformationStyles.inforValue}>
        {content.trim()}
      </Text>
    </View>
  }
  //Show Managerment or SubOrdinate
  function showRealateEmployee(index: number, employid: number, employeeName: string) {
    const pushAction = StackActions.push('detail-employee', { id: employid, title: employeeName, });
    return (
      <Text onPress={() => { dispatch(DetailScreenActions.addEmployeeIds(employid)); navigation.dispatch(pushAction) }}>
        {index !== 0 && <Text>、</Text>}
        <Text style={FieldDetailEmailStyles.email} >
          {employeeName}
        </Text>
      </Text>
    )
  }

  /**
   * @param type type of title 1:titleDepartment, 2:titlePosition
   * @returns tile 
   */
  function getTitleDepartmentOrPosition(type: number) {
    let title;
    fields && fields.forEach((field) => {
      if (field.fieldName === (type === TypeTitle.DEPARTMENT ? 'employee_departments' : 'employee_positions')) {
        title = StringUtils.getFieldLabel(field, FIELD_LABLE, languageCode)
      }
    });
    return title;
  }

  return (
    <ScrollView style={DetailTabBasicInformationStyles.container}>
      {fields && [...fields].sort((a, b) => (a.fieldOrder > b.fieldOrder) ? 1 : -1).map((field: Field, index: number) => {
        if (field.availableFlag === 0) return <></>;
        if (field.isDefault) {
          rowData.fieldValue = EntityUtils.getValueProp(data, field.fieldName);
        } else {
          const employee = data.employeeData.find(item => item.key == field.fieldName);
          rowData.fieldValue = employee?.value;
        }
        const title = StringUtils.getFieldLabel(field, FIELD_LABLE, languageCode);
        //Show Special Control
        if (field.fieldType.toString() === DefineFieldType.OTHER) {
          //pain department-position
          if (field.fieldName === 'employee_departments' ||
            field.fieldName === 'employee_positions') {
            if (!isFind) {
              isFind = true;
              //display title
              return <View style={DetailTabBasicInformationStyles.marginTop15} key={index} >
                <View
                  style={[
                    DetailTabBasicInformationStyles.inforComponent,
                    DetailTabBasicInformationStyles.inforTitle,
                  ]}
                >
                  <Text style={DetailTabBasicInformationStyles.title}>
                    {translate(messages.departmentNameOrTitle)}
                  </Text>
                </View>
                <View style={[DetailTabBasicInformationStyles.inforComponent]}>
                  <Text style={DetailTabBasicInformationStyles.inforText}>
                    {getTitleDepartmentOrPosition(TypeTitle.DEPARTMENT)}
                  </Text>
                  <View >
                    <Text style={DetailTabBasicInformationStyles.inforValue}>
                      {data.employeeDepartments[0]?.departmentName}
                    </Text>
                  </View>
                </View>
                <View style={[DetailTabBasicInformationStyles.inforComponent]}>
                  <Text style={DetailTabBasicInformationStyles.inforText}>
                    {getTitleDepartmentOrPosition(TypeTitle.POSITION)}
                  </Text>
                  <View >
                    <Text style={DetailTabBasicInformationStyles.inforValue}>
                      {data.employeeDepartments[0]?.positionName}
                    </Text>
                  </View>
                </View>
              </View>
            }
          } else if (field.fieldName === 'employee_managers') {
            //display manager
            return <View key={index} style={[DetailTabBasicInformationStyles.inforComponent]}>
              <Text style={DetailTabBasicInformationStyles.inforText}>{title}</Text>
              {<View style={DetailTabBasicInformationStyles.inforOnRow}>
                <Text>
                  {data.employeeManagers.map((manager: EmployeeManagers, indexManage: number) => {
                    return manager.managerId && (showRealateEmployee(indexManage, manager.employeeId, manager.employeeName))
                  })}
                </Text>
              </View>
              }
            </View>
          } else if (field.fieldName === 'employee_subordinates') {
            //display subordinate
            return <View key={index} style={[DetailTabBasicInformationStyles.inforComponent]}>
              <Text style={DetailTabBasicInformationStyles.inforText}>{title}</Text>
              <View style={DetailTabBasicInformationStyles.inforOnRow}>
                <Text>
                  {data.employeeSubordinates.map((sub: any, indexSub: number) => {
                    return (showRealateEmployee(indexSub, sub.employeeId, sub.employeeName))
                  })}
                </Text>
              </View>
            </View>
          } else if (field.fieldName === 'is_admin') {
            return <View style={[DetailTabBasicInformationStyles.inforComponent]} key={index}>
              <Text style={DetailTabBasicInformationStyles.inforText}>
                {title}
              </Text>
              <Text style={DetailTabBasicInformationStyles.inforValue}>
                {
                  EntityUtils.getValueProp(data.isAdmin ? ValueAdmin.true : ValueAdmin.false, languageCode)
                }
              </Text>
            </View>
          } else if (field.fieldName === "employee_packages") {
            return <View style={[DetailTabBasicInformationStyles.inforComponent]} key={index}>
              <Text style={DetailTabBasicInformationStyles.inforText}>
                {title}
              </Text>
              {data.employeePackages && data.employeePackages.length > 0 && data.employeePackages.forEach((pack: EmployeePackages) => {
                field.fieldItems.forEach((item) => {
                  if (item.itemId === pack.packageId) {
                    return <Text style={DetailTabBasicInformationStyles.inforValue}>{item.itemLabel}</Text>
                  }
                  return <></>;
                })

              })}
            </View>
          }
          else if (field.fieldName === "language_id" || field.fieldName === "timezone_id") {
            let value = rowData.fieldValue;
            if (rowData.fieldValue !== null) {
              if (field.fieldName === "language_id") {
                value = initializeField.languages[parseInt(rowData.fieldValue) - 1]?.languageName
              }
              if (field.fieldName === "timezone_id") {
                value = initializeField.timezones[parseInt(rowData.fieldValue) - 1]?.timezoneName
              }
            }
            return <View style={[DetailTabBasicInformationStyles.inforComponent]} key={index}>
              <Text style={DetailTabBasicInformationStyles.inforText}>
                {title}
              </Text>
              <Text style={DetailTabBasicInformationStyles.inforValue}>
                {
                  value
                }
              </Text>
            </View>
          }
        } else {
          //Show   Dynamic Control type != 99
          if (
            field.fieldName === 'employee_surname' ||
            field.fieldName === 'employee_name'
          ) {
            name += (rowData.fieldValue || '') + " ";
            if (field.fieldName === 'employee_name') {
              return showNameControl(translate(messages.accountName), name);
            }
          } else if (
            field.fieldName === 'employee_surname_kana' ||
            field.fieldName === 'employee_name_kana'
          ) {
            nameKana += (rowData.fieldValue || '') + ' ';
            if (field.fieldName === 'employee_name_kana') {
              return showNameControl(translate(messages.accountNameKana), nameKana);
            }
          } else {
            if (field.fieldType.toString() == DefineFieldType.TAB) {
              if (data && data.employeeData) {
                return <View style={[DetailTabBasicInformationStyles.inforComponentTab]}>
                  <DynamicControlField
                    controlType={ControlType.DETAIL}
                    fieldInfo={field}
                    listFieldInfo={fields}
                    fieldNameExtension="employeeData"
                    elementStatus={{ fieldValue: data }}
                    extensionData={extensionData}
                    belong={FIELD_BELONG.EMPLOYEE}
                  />
                </View>
              }
            } else if (field?.fieldType.toString() === DefineFieldType.LOOKUP) {
              return <></>;
            } else if (field?.fieldType.toString() === DefineFieldType.RELATION && (field as any)?.relationData.displayTab === RelationDisplay.TAB) {
              return <></>;
            } else {
              let isTabData = listFieldId.find((fieldId) => { return fieldId.toString() === field.fieldId.toString() });
              if (!isTabData) {
                return <View style={[DetailTabBasicInformationStyles.inforComponent]}>
                  <DynamicControlField
                    controlType={ControlType.DETAIL}
                    fieldInfo={field}
                    elementStatus={{ fieldValue: rowData.fieldValue }}
                    extensionData={extensionData}
                    fields={data}
                    belong={FIELD_BELONG.EMPLOYEE}
                  />
                </View>
              }
              return <></>;
            }
          }
        }
        return <></>
      })
      }

    </ScrollView >
  );
};
