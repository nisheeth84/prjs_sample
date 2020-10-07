import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldDetailOrganizationStyles } from './field-detail-styles';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { getSelectedOrganizationInfo } from '../../repository/organization-selection-repository';
import { KeySearch } from '../../../../../config/constants/enum';
import { useDispatch } from 'react-redux';
import { DetailScreenActions } from '../../../../../modules/employees/detail/detail-screen-reducer';

// Define value props of FieldDetailOrganization component
type IFieldDetailOrganizationProps = IDynamicFieldProps;

/**
 * Component for show organization fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailOrganization(props: IFieldDetailOrganizationProps) {
  const { fieldInfo, elementStatus, languageCode } = props;
  const title = StringUtils.getFieldLabel(fieldInfo, FIELD_LABLE, languageCode ?? TEXT_EMPTY);
  const [dataView, setDataView] = useState<any[]>([]);
  const navigator = useNavigation();
  const dispatch = useDispatch();
  // index to check last element of employees data
  var index = 0;

  /**
   * handle when click employee
   * @param item item just clicked
   */
  const handleClickItem = (item: any) => {
    const type = item.itemType
    if (KeySearch.EMPLOYEE === type) {
      dispatch(DetailScreenActions.addEmployeeIds(item.itemId));
      navigator.dispatch(
        StackActions.push("detail-employee", {
          id: item.itemId,
          title: item.itemName ?? TEXT_EMPTY
        }));
    } else if (KeySearch.DEPARTMENT === type) {
      // TODO: navigate screen
    } else if (KeySearch.GROUP === type) {
      // TODO: navigate screen
    }
    // TODO: check case department, group
    // filterEmployee(TargetType.MY_GROUP, item.itemId, false, null, [], null, [], dispatch, null);
  }

  useEffect(() => {
    handleGetData()
  }, []);

  /**
   * get data to show detail
   */
  const handleGetData = async () => {
    const valueArr = elementStatus ? elementStatus.fieldValue : fieldInfo.defaultValue
    const value: any = {
      departmentId: [],
      groupId: [],
      employeeId: []
    }
    JSON.parse(valueArr).forEach((item: any) => {
      if (item.department_id) {
        value.departmentId.push(item.department_id)
      }
      if (item.group_id) {
        value.groupId.push(item.group_id)
      }
      if (item.employee_id) {
        value.employeeId.push(item.employee_id)
      }
    })
    const response = await getSelectedOrganizationInfo(value);
    if (response) {
      if (response.status === 200) {
        if (response.data) {
          const dataArr: any[] = []
          const listEmployeeId: any[] = []
          setEmployee(response.data.employee, listEmployeeId, dataArr)
          setDepartment(response.data.departments, dataArr)
          setGroup(response.data.groupId, dataArr)
          setDataView(dataArr)
        }
      } else {
        // TODO: set error message
      }
    } else {
      // TODO: set error message
    }
  }

  /**
   * set data employee to show
   * @param data data from response
   * @param listEmployeeId list exist employee id
   * @param dataArr data array to show
   */
  const setEmployee = (data: any[], listEmployeeId: any[], dataArr: any[]) => {
    data?.forEach((item: any) => {
      if (!listEmployeeId.includes(item.employeeId)) {
        listEmployeeId.push(item.employeeId)
        dataArr.push({
          itemId: `${item.employeeId}`,
          itemName: `${item.employeeSurname ?? TEXT_EMPTY} ${item.employeeName ?? TEXT_EMPTY}`,
          itemType: KeySearch.EMPLOYEE,
          isLink: true
        })
      }
    })
  }

  /**
   * set data department to show
   * @param data data department to set into data view
   * @param dataArr array data to show on screen
   */
  const setDepartment = (data: any[], dataArr: any[]) => {
    data?.forEach((item: any) => {
      dataArr.push({
        itemId: `${item.departmentId}`,
        itemName: item.departmentName,
        itemType: KeySearch.DEPARTMENT,
        isLink: item.employeeIds && item.employeeIds.length > 0
      })
    })
  }

  /**
   * set data group to show
   * @param data data group to set into data view
   * @param dataArr array data to show on screen
   */
  const setGroup = (data: any[], dataArr: any[]) => {
    data?.forEach((item: any) => {
      dataArr.push({
        itemId: `${item.groupId}`,
        itemName: item.groupName,
        itemType: KeySearch.GROUP,
        isLink: item.employeeIds && item.employeeIds.length > 0
      })
    })
  }

	/**
	 * Render the organization component 
	 */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailOrganizationStyles.textColor}>{title}</Text>
        <View style={FieldDetailOrganizationStyles.mainContainer}>
          {
            dataView &&
            dataView.map((item: any) =>
              <View style={FieldDetailOrganizationStyles.itemContainer}>
                {
                  item.isLink ?
                    <TouchableOpacity onPress={() => handleClickItem(item)} >
                      <Text style={FieldDetailOrganizationStyles.itemText}>{item.itemName}</Text>
                    </TouchableOpacity>
                    :
                    <Text>{item.itemName ?? TEXT_EMPTY}</Text>
                }
                {
                  ++index !== dataView.length && item.itemName !== TEXT_EMPTY &&
                  <Text>, </Text>
                }
              </View>
            )
          }
        </View>
      </View>
    );
  }

  return renderComponent();
}