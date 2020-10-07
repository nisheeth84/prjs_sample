import { cloneDeep, filter, findIndex, first, forEach, isNil, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Platform, Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { APP_DATE_FORMAT_ES, DEFAULT_TIMEZONE, FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import { FIELD_BELONG, KeySearch, ModifyFlag, PlatformOS, TypeRelationSuggest } from '../../../../../../../config/constants/enum';
import { translate } from '../../../../../../../config/i18n';
import { Field } from '../../../../../../../modules/employees/employees-repository';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { getCustomFieldInfo } from '../../../../../../../modules/search/search-reponsitory';
import EntityUtils from '../../../../../../util/entity-utils';
import StringUtils from '../../../../../../util/string-utils';
import { Icon } from '../../../../../icon/icon';
import { getSelectedOrganizationInfo } from '../../../../repository/organization-selection-repository';
import { convertValueRelation } from '../relation-convert-suggest';
import { messages } from '../relation-suggest-messages';
import { EmployeeDTO, IEmployeeSuggestionsProps, IOrganizationInfo } from './employee-suggest-interface';
import { EmployeeSuggestSearchModal } from './employee-suggest-search-modal/employee-suggest-search-modal';
import EmployeeSuggestStyles from './employee-suggest-style';

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
export function RelationEmployeeSuggest(props: IEmployeeSuggestionsProps) {
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const timezoneName = authState?.timezoneName ? authState?.timezoneName : DEFAULT_TIMEZONE;
  const formatDate = authState?.formatDate ? authState?.formatDate : APP_DATE_FORMAT_ES;
  const [viewAll, setViewAll] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [dataRelationSelected, setdataRelationSelected] = useState<any[]>([]);
  const [customFieldInfoData, setCustomFieldInfoData] = useState<Field[]>([]);
  const suggesstionChoiseFirst = props.suggestionsChoice;
  const fieldInfo = props?.fieldInfo ?? TEXT_EMPTY;
  const relationBelong = props?.fieldInfo?.relationData?.fieldBelong ?? FIELD_BELONG.EMPLOYEE;

  useEffect(() => {
    handleGetSelectedOrganizationInfo();
  }, [suggesstionChoiseFirst]);

  useEffect(() => {
    getFieldInfoService();
  }, []);

  const getFieldInfoService = async () => {
    const responseFieldInfo = await getCustomFieldInfo(
      {
        fieldBelong: relationBelong,
      },
      {}
    );
    if (responseFieldInfo) {
      setCustomFieldInfoData(responseFieldInfo?.data?.customFieldsInfo);
    }
  }
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
    const selected = filter(dataRelationSelected.concat(dataConvert), (item, index, self) => {
      return findIndex(self, s => s.itemId === item.itemId) === index;
    });
    setdataRelationSelected(selected);
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
      let itemView = {
        itemId: employeeItem.employeeId,
        groupSearch: KeySearch.EMPLOYEE,
        itemName: getEmployeeFullName(employeeItem.employeeName, employeeItem.employeeSurname),
        departmentName: TEXT_EMPTY,
        positionName: TEXT_EMPTY,
        itemImage: employeeItem.photoFileUrl,
        indexChoice: 'employee',
        employee: employeeItem,
      }
      dataConvert.push(itemView);
    });
  }

  const getNameMappingRelationId = async (itemEmployee: EmployeeDTO) => {
    const fieldInfoDataClone = cloneDeep(customFieldInfoData);
    const employeeData = cloneDeep(itemEmployee?.employeeData);
    let nameValue = "";
    if (fieldInfoDataClone) {
      const fieldInfoItem = fieldInfoDataClone?.find((item: Field) => {
        return item?.fieldId === fieldInfo?.relationData?.displayFieldId
      })
      if (fieldInfoItem && fieldInfoItem.isDefault && employeeData) {
        nameValue = EntityUtils.getValueProp(itemEmployee?.employee, fieldInfoItem.fieldName);
      } else if (fieldInfoItem && !fieldInfoItem.isDefault && employeeData) {
        const employee = employeeData?.find((item: any) => item.key == fieldInfoItem.fieldName);
        nameValue = employee?.value;
      }
      if (!nameValue || nameValue?.length === 0) {
        nameValue = `${StringUtils.getFieldLabel(fieldInfoItem, FIELD_LABLE, languageCode)}${translate(messages.common_119908_15_relation_nodata)}`;
      } else {
        if (fieldInfoItem) {
          let paramConvert = {
            nameValue: nameValue,
            fieldInfoItem: fieldInfoItem,
            relationFieldInfo: fieldInfo,
            formatDate: formatDate,
            languageCode: languageCode,
            timezoneName: timezoneName,
            fields: props?.fields
          }
          nameValue = await convertValueRelation(paramConvert);
        }
      }
    }
    return nameValue;
  }

  /**
   * add employee selected in popup
   *  @param item selected
   */
  const handleAddEmployeeSuggestions = async (item: EmployeeDTO[], typeSearch: number) => {
    const employeeConverted: any[] = [];
    if (typeSearch === TypeRelationSuggest.SINGLE) {
      dataRelationSelected.pop();
    }
    for (let index = 0; index < item.length; index++) {
      const employeeItem = item[index];
      // convert object employee to view object
      let itemView = {
        itemId: employeeItem?.itemId,
        itemName: await getNameMappingRelationId(employeeItem),
      }
      employeeConverted.push(itemView);
    }
    setdataRelationSelected(dataRelationSelected.concat(employeeConverted));
    setModalVisible(false);
    if (dataRelationSelected.concat(employeeConverted)?.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
    if (props.updateStateElement) {
      props.updateStateElement(dataRelationSelected.concat(employeeConverted));
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
    const employeeSelected = dataRelationSelected.filter(itemDto => (itemDto.itemId !== employee.itemId));
    setdataRelationSelected(employeeSelected);
    if (employeeSelected.length <= MAX_SIZE_DISPLAY) {
      setViewAll(true);
    }
    props.updateStateElement(employeeSelected);
  }

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setModalVisible(false);
  }

  /*
   * Render the text component
   */
  return (
    <View style={EmployeeSuggestStyles.stretchView}>
      <View>
      <View style={EmployeeSuggestStyles.titleContainer}>
        {<Text style={EmployeeSuggestStyles.title}>{props.fieldLabel}</Text>}
        {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={EmployeeSuggestStyles.requiredContainer}>
              <Text style={EmployeeSuggestStyles.textRequired}>{translate(messages.common_119908_15_textRequired)}</Text>
            </View>
          )}
        </View>
        {
          dataRelationSelected && dataRelationSelected.length > 0 && props.typeSearch === TypeRelationSuggest.MULTI &&
          <TouchableOpacity style={[props.isError ? EmployeeSuggestStyles.errorContent : EmployeeSuggestStyles.touchContentMulti]}
            onPress={() => setModalVisible(true)}>
            <Text style={EmployeeSuggestStyles.labelInputCorlor}>{props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
          </TouchableOpacity>
        }
       
        {dataRelationSelected && dataRelationSelected?.length === 0 &&
          <TouchableOpacity style={[props.isError ? EmployeeSuggestStyles.errorContent : null]}
            onPress={() => setModalVisible(true)}>
            <Text style={EmployeeSuggestStyles.labelInputCorlor}>{props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
          </TouchableOpacity>
        }
        {/* View list save setting data */}
        {
          map(viewAll ? dataRelationSelected : dataRelationSelected.slice(0, MAX_SIZE_DISPLAY), item => {
            return (<View style={EmployeeSuggestStyles.touchableSelected}>
              {/* check view icon by group search */}
              <View style={EmployeeSuggestStyles.suggestTouchable}>
                <Text style={EmployeeSuggestStyles.suggestText}>{item.itemName}</Text>
              </View>

              <TouchableOpacity
                style={EmployeeSuggestStyles.iconCheckView}
                onPress={() => {
                  handleRemoveEmployeeSetting(item);
                }}>
                <Icon style={EmployeeSuggestStyles.iconListDelete} name="iconDelete" />
              </TouchableOpacity>

            </View>
            )
          })
        }
      </View>
      {
        !viewAll &&
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={EmployeeSuggestStyles.buttonViewAll}>
            {`${translate(messages.labelViewMore1)}${(dataRelationSelected.length - MAX_SIZE_DISPLAY)}${translate(messages.labelViewMore2)}`}
          </Text>
        </TouchableOpacity>
      }

      {/* layout modal  */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => handleCloseModal()}
      >
        {modalVisible &&
          <SafeAreaView style={[EmployeeSuggestStyles.modalContainer, Platform.OS === PlatformOS.IOS ? { marginTop: 0 } : {}]}>
            <EmployeeSuggestSearchModal
              typeSearch={props.typeSearch}
              fieldLabel={props.fieldLabel}
              dataSelected={dataRelationSelected}
              fieldInfo={fieldInfo}
              selectedData={handleAddEmployeeSuggestions}
              closeModal={() => setModalVisible(false)}
              exportError={(error) => !isNil(props.exportError) && props.exportError(error)}
            />
          </SafeAreaView>
        }
      </Modal >
    </View>
  );
}
