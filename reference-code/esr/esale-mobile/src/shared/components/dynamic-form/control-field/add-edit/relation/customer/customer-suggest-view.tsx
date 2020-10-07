import { cloneDeep, isNil, map } from 'lodash';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSelector } from 'react-redux';
import { APP_DATE_FORMAT_ES, DEFAULT_TIMEZONE, FIELD_LABLE, TEXT_EMPTY } from '../../../../../../../config/constants/constants';
import { FIELD_BELONG, ModifyFlag, TypeRelationSuggest } from '../../../../../../../config/constants/enum';
import { translate } from '../../../../../../../config/i18n';
import { Field } from '../../../../../../../modules/employees/employees-repository';
import { authorizationSelector } from '../../../../../../../modules/login/authorization/authorization-selector';
import { getCustomFieldInfo } from '../../../../../../../modules/search/search-reponsitory';
import EntityUtils from '../../../../../../util/entity-utils';
import StringUtils from '../../../../../../util/string-utils';
import { Icon } from '../../../../../icon/icon';
import { convertValueRelation } from '../relation-convert-suggest';
import { messages } from '../relation-suggest-messages';
import { CustomerSuggest, ICustomerSuggestionsProps } from './customer-suggest-interface';
import { CustomerSuggestModalView } from './customer-suggest-modal/customer-suggest-modal-view';
import CustomerSuggestStyles from './customer-suggest-style';


/**
 * Max size display selected data
 */
const MAX_SIZE_DISPLAY = 5;

/**
 * Component for searching text fields
 * @param props see ICustomerSuggestProps
 */
export function RelationCustomerSuggest(props: ICustomerSuggestionsProps) {
  const [viewAll, setViewAll] = useState(!(props.initData && props.initData.length > 5));
  const [modalVisible, setModalVisible] = useState(false);
  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : 'ja_jp';
  const timezoneName = authState?.timezoneName ? authState?.timezoneName : DEFAULT_TIMEZONE;
  const formatDate = authState?.formatDate ? authState?.formatDate : APP_DATE_FORMAT_ES;
  const fieldInfo = props?.fieldInfo ?? TEXT_EMPTY;
  const [customFieldInfoData, setCustomFieldInfoData] = useState<Field[]>([]);
  const [dataRelationSelected, setdataRelationSelected] = useState<any[]>([]);
  const relationBelong = props?.fieldInfo?.relationData?.fieldBelong ?? FIELD_BELONG.CUSTOMER;

  useEffect(() => {
    getFieldInfoService();
  }, []);

  /**
   * Get all field of element
   */
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
   * convert view value ralation
   */
  const getNameMappingRelationId = async (itemCustomer: CustomerSuggest) => {
    const fieldInfoDataClone = cloneDeep(customFieldInfoData);
    const customerData = cloneDeep(itemCustomer?.customerData);
    let nameValue = "";
    if (fieldInfoDataClone) {
      const fieldInfoItem = fieldInfoDataClone?.find((item: Field) => {
        return item?.fieldId === fieldInfo?.relationData?.displayFieldId
      })
      if (fieldInfoItem && fieldInfoItem.isDefault && customerData) {
        nameValue = EntityUtils.getValueProp(itemCustomer, fieldInfoItem.fieldName);
      } else if (fieldInfoItem && !fieldInfoItem.isDefault && customerData) {
        const employee = customerData?.find((item: any) => item.key == fieldInfoItem.fieldName);
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
        } else {
          nameValue = `${StringUtils.getFieldLabel(fieldInfoItem, FIELD_LABLE, languageCode)}${translate(messages.common_119908_15_relation_nodata)}`;
        }
      }
    }
    return nameValue;
  }

  /**
   * event click choose employee item in list
   * @param employee
   */
  const handleRemoveCustomerSetting = (customer: CustomerSuggest) => {
    const selected = dataRelationSelected.filter(itemDto => itemDto.customerId !== customer.customerId);
    setdataRelationSelected(selected);
    if (selected.length <= MAX_SIZE_DISPLAY) {
      setViewAll(true);
    }
    props.updateStateElement(selected);
  }

  /**
   * Add data select from search result screen
   * @param customers CustomerSuggest[]
   */
  const handleAddSelectResults = async (customers: CustomerSuggest[]) => {
    const customerConverted: any[] = [];
    if (props.typeSearch === TypeRelationSuggest.SINGLE) {
      dataRelationSelected.pop();
    }
    for (let index = 0; index < customers.length; index++) {
      const customersItem = customers[index];
      // convert object customers to view object
      let itemView = {
        customerId: customersItem?.customerId,
        itemName: await getNameMappingRelationId(customersItem),
      }
      customerConverted.push(itemView);
    }
    setdataRelationSelected(dataRelationSelected.concat(customerConverted));
    setModalVisible(false);
    if (dataRelationSelected.concat(customerConverted)?.length > MAX_SIZE_DISPLAY) {
      setViewAll(false)
    }
    props.updateStateElement(dataRelationSelected.concat(customerConverted));
  }

  /**
   * Render label
   */
  const renderLabel = () => {
      return (
        <View style={CustomerSuggestStyles.titleContainer}>
        {<Text style={CustomerSuggestStyles.title}>{props.fieldLabel}</Text>}
        {fieldInfo.modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={CustomerSuggestStyles.requiredContainer}>
              <Text style={CustomerSuggestStyles.textRequired}>{translate(messages.common_119908_15_textRequired)}</Text>
            </View>
          )}
        </View>
      )
  }

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setModalVisible(false);
  }

  /*
   * Render the text component in add-edit case
   */
  return (
    <View style={CustomerSuggestStyles.stretchView}>
      {renderLabel()}
      <View>
        {
          dataRelationSelected && dataRelationSelected.length > 0 && props.typeSearch === TypeRelationSuggest.MULTI &&
          <TouchableOpacity
            style={[CustomerSuggestStyles.labelInputDataMulti, props.isError && CustomerSuggestStyles.errorContent]}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={CustomerSuggestStyles.labelInputCorlor}>{props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
          </TouchableOpacity>
        }
        {
          dataRelationSelected && dataRelationSelected?.length === 0 &&
          <TouchableOpacity
            style={[CustomerSuggestStyles.labelInputData, props.isError && CustomerSuggestStyles.errorContent]}
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Text style={CustomerSuggestStyles.labelInputCorlor}>{props.typeSearch == TypeRelationSuggest.SINGLE ? props.fieldLabel + translate(messages.placeholderSingleChoose)
              : props.fieldLabel + translate(messages.placeholderMultiChoose)}</Text>
          </TouchableOpacity>
        }
        {
          map(viewAll ? dataRelationSelected : dataRelationSelected.slice(0, MAX_SIZE_DISPLAY), item => {
            return (
              <View style={CustomerSuggestStyles.viewSuggestContent}>
                <View
                  style={CustomerSuggestStyles.suggestTouchable}>
                  <Text style={CustomerSuggestStyles.suggestText}>{item.itemName}</Text>
                </View>
                <TouchableOpacity
                  style={CustomerSuggestStyles.iconCheckView}
                  onPress={() => {
                    handleRemoveCustomerSetting(item);
                  }}>
                  <Icon style={CustomerSuggestStyles.iconListDelete} name="delete" />
                </TouchableOpacity>
              </View>
            )
          })
        }
        {
          !viewAll &&
          <TouchableOpacity onPress={() => setViewAll(true)}>
            <Text style={CustomerSuggestStyles.buttonViewAll}>{`${translate(messages.labelViewMore1)}${(dataRelationSelected.length - MAX_SIZE_DISPLAY)}${translate(messages.labelViewMore2)}`}</Text>
          </TouchableOpacity>
        }
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => handleCloseModal()}
        >
          {modalVisible &&
            <View style={CustomerSuggestStyles.modalContentStyle}>
              <CustomerSuggestModalView
                typeSearch={props.typeSearch}
                fieldLabel={props.fieldLabel}
                dataSelected={dataRelationSelected}
                fieldInfo={fieldInfo}
                listIdChoice={props.listIdChoice}
                closeModal={() => setModalVisible(false)}
                selectData={(data) => handleAddSelectResults(data)}
                exportError={(error) => !isNil(props.exportError) && props.exportError(error)}
              />
            </View>
          }
        </Modal >
      </View>
    </View>

  );
}
