import React, { useEffect, useState } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CustomerRegistrationEditStyle } from './customer-registration-edit-styles';
import { messages } from './customer-registration-edit-messages';
import { translate } from '../../../config/i18n';
import { Header } from '../../../shared/components/header';
import { MultipleSelectWithSearchBox } from '../../../shared/components/multiple-select-with-search-box/multiple-select-search-box';
import {
  ModeScreen,
  ControlType,
  DefineFieldType,
  PlatformOS,
  ModifyFlag,
  TypeSelectSuggest,
} from '../../../config/constants/enum';
import {
  createCustomer,
  updateCustomer,
  getCustomerLayout,
  getCustomer,
} from '../customer-repository';
import { CommonStyles } from '../../../shared/common-style';
import { DynamicControlField } from '../../../shared/components/dynamic-form/control-field/dynamic-control-field';
import StringUtils from '../../../shared/util/string-utils';
import { ModalCustomerOption } from '../modal/customer-checkbox-modal';
import { CustomerRegistrationEditItem } from './customer-registration-edit-item';
import { isArray } from 'util';
import { TEXT_EMPTY, APP_DATE_FORMAT_ES, FIELD_LABLE } from '../../../config/constants/constants';
import { AppIndicator } from '../../../shared/components/app-indicator/app-indicator';
import { CommonMessages } from '../../../shared/components/message/message';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { isObject } from 'lodash';
import { utcToTz, DATE_TIME_FORMAT } from '../../../shared/util/date-utils';
import { FieldAddEditTextStyles } from '../../../shared/components/dynamic-form/control-field/add-edit/field-add-edit-styles';
import { CustomerSuggestView } from '../../../shared/components/suggestions/customer/customer-suggest-view';
import { EmployeeSuggestView } from '../../../shared/components/suggestions/employee/employee-suggest-view';
import { fieldAddEditMessages } from '../../../shared/components/dynamic-form/control-field/add-edit/field-add-edit-messages';

const styles = CustomerRegistrationEditStyle;
export const specialFName = {
  customerCompanyDescription: 'company_description',
  customerBusinessMain: 'business_main_id',
  customerBusinessSub: 'business_sub_id',
  customerTransactionAmount: 'total_trading_amount',
  customerScenario: 'scenario_id',
  customerProductData: 'productTradingData',
  customerPhoto: 'photo_file_path',
  parentId: 'parent_id',
  employeeId: 'employee_id',
  customerLogo: 'customer_logo',
  customerAddress: 'customer_address',
  personInCharge: 'person_in_charge',
  scheduleNext: 'schedule_next',
  actionNext: 'action_next',
  customerId: 'customer_id',
  createdDate: 'created_date',
  createdUser: 'created_user',
  updatedDate: 'updated_date',
  updatedUser: 'updated_user',
  lastContactDate: 'last_contact_date',
  customerName: 'customer_name',
  isDisplayChildCustomers: 'is_display_child_customers',
  customerParent: 'customer_parent',
  url: 'url'
};
let fieldSelected: any = {
  listFieldsItem: [],
  itemId: 0,
};

export function RegistrationEditScreen() {
  const [listMessageRessponse, setListMessageRessponse] = useState<any>("");
  const navigation = useNavigation();
  const route: any = useRoute();
  const [fieldInfos, setFieldInfos] = useState<any[]>([]);
  const [params, setParams] = useState<any>({
    customerData: [],
    customerAliasName: null,
    phoneNumber: '',
    memo: null,
    customerLogo: '[]',
  });
  const [selectModalOpen, setSelectModalOpen] = useState(false);
  const [hasChangeInvite, setHasChangeInvite] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modal, setModal] = useState(false);
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ?? TEXT_EMPTY;
  const [paramsEdit, setParamsEdit] = useState<any>({
    customerData: [],
    customerAliasName: null,
    phoneNumber: '',
    memo: null,
    customerLogo: '[]',
  });

  const getListIdInTab = () => {
    const listTab = fieldInfos?.filter((item: any) => item.fieldType.toString() === DefineFieldType.TAB);
    const listId: any[] = [];
    if (listTab) {
      listTab.forEach((tab: any) => {
        if (tab?.tabData?.length > 0) {
          tab.tabData.forEach((item: any) => {
            listId.push(item)
          })
        }
      })
    }
    const listLookup = fieldInfos?.filter((item: any) => item.fieldType.toString() === DefineFieldType.LOOKUP);
    if (listLookup) {
      listLookup.forEach((lookup: any) => {
        if (lookup?.lookupData?.itemReflect?.length > 0) {
          lookup.lookupData?.itemReflect?.forEach((item: any) => {
            listId.push(item.fieldId);
          })
        }
      })
    }
    return listId;
  }

  const listFieldId = getListIdInTab();

  /**
   * toggle modal
   */
  const toggleModal = () => {
    setModal(!modal);
  };

  /**
   * call api getCustomer
   */
  const getCustomerFunc = async () => {
    setRefresh(true);
    const { customerId } = route.params;
    const param = {
      customerId,
      mode: 'edit',
    };
    const response = await getCustomer(param);
    if (response && response.status === 200) {
      const customer: any = response.data.customer;
      let prm: any = {
        customerData: response.data.customer.customerData,
      };
      response.data.fields.forEach((el) => {
        const key = StringUtils.snakeCaseToCamelCase(el.fieldName);
        if (el.isDefault && el.fieldName && customer[key] !== undefined) {
          prm[key] = customer[key];
          if (isObject(prm[key])) {
            prm[key] = JSON.stringify(customer[key]);
          }
        }
      });
      setParamsEdit({ ...paramsEdit, ...prm });
      let param = {
        ...route?.params?.mode === ModeScreen.CREATE ? params : {
          customerData: prm['customerData'],
          customerAliasName: prm['customerAliasName'],
          phoneNumber: prm['phoneNumber'],
          memo: prm['memo'],
          customerLogo: prm['customerLogo'],
          customerId: prm['customerId'],
          customerName: prm['customerName']
        }
      };
      setFieldInfos(
        response.data.fields.sort((a, b) => a.fieldOrder - b.fieldOrder)
      );
      setParams({ ...param });
      setRefresh(false);
    }
  };

  const handleCustomerLayoutResponse = async (customerLayoutResponse: any) => {
    if (customerLayoutResponse) {
      if (customerLayoutResponse.status === 200) {
        const fieldsResponse = [...customerLayoutResponse?.data?.fields];
        fieldsResponse?.sort(
          (a, b) => a.fieldOrder - b.fieldOrder
        )
        setFieldInfos(fieldsResponse);
        fieldsResponse?.forEach(item => {
          if (!item.isDefault) {
            let defaultValue = Array.isArray(item.defaultValue)
              ? JSON.stringify(item.defaultValue)
              : (item.defaultValue || TEXT_EMPTY);
            if (item?.fieldType?.toString() === DefineFieldType.LINK) {
              defaultValue = JSON.stringify(
                {
                  url_target: item.defaultValue || item?.urlTarget,
                  url_text: item?.urlText
                })
            }
            if (item?.fieldType?.toString() === DefineFieldType.CHECKBOX
              || item?.fieldType?.toString() === DefineFieldType.MULTI_SELECTBOX
            ) {
              const itemSelected: any[] = [];
              item?.fieldItems?.map((itemSelect: any) => {
                if (itemSelect?.isDefault) {
                  itemSelected.push(itemSelect?.itemId);
                }
              })
              defaultValue = JSON.stringify(itemSelected);
            }
            if (item?.fieldType?.toString() === DefineFieldType.RADIOBOX
              || item?.fieldType?.toString() === DefineFieldType.SINGER_SELECTBOX
            ) {
              const itemSelected = item?.fieldItems?.find((itemSelect: any) => itemSelect?.isDefault)
              defaultValue = JSON.stringify(itemSelected?.itemId);
            }
            const value = {
              key: item.fieldName,
              fieldType: item.fieldType.toString(),
              value: defaultValue,
            }
            params.customerData.push(value);
          }
        })
      } else {
        setListMessageRessponse(customerLayoutResponse);
      }
    }
  }

  /**
   * call api getCustomerLayout
   */
  const getCustomerLayoutFc = async () => {
    setListMessageRessponse("");
    setRefresh(true);
    const customerLayoutResponse = await getCustomerLayout({});
    await handleCustomerLayoutResponse(customerLayoutResponse);
    setRefresh(false);
  };

  /**
   * get status
   */
  useEffect(() => {
    if (route.params.mode === ModeScreen.CREATE) {
      getCustomerLayoutFc();
    } else {
      getCustomerFunc();
    }
  }, [navigation.isFocused()]);

  /**
   * create Customer Func
   */
  const createCustomerFunc = async () => {
    setListMessageRessponse("");
    setRefresh(true);
    const formData = new FormData();
    formData.append('data', JSON.stringify(params));
    const response = await createCustomer(formData);
    setRefresh(false);
    if (response) {
      if (response.status === 200) {
        navigation.goBack();
      } else {
        setListMessageRessponse(response);
      }
    }
  };

  /**
   * update Customer Func
   */
  const updateCustomerFunc = async () => {
    setListMessageRessponse("");
    setRefresh(true);
    const formData = new FormData();
    formData.append('data', JSON.stringify(params));
    formData.append('customerId', JSON.stringify(paramsEdit['customerId']));
    const response = await updateCustomer(formData);
    setRefresh(false);
    if (response) {
      if (response.status === 200) {
        navigation.goBack();
      } else {
        setListMessageRessponse(response);
      }
    }
  };

  const onSelected = (item: any) => {
    onChangeText(item[0].itemId, fieldSelected);
    toggleModal();
  };

  /**
   * get elementStatus
   * @param field
   */
  const getElementStatus = (field: any) => {
    const { isDefault, fieldName } = field;
    let paramValue = (route?.params?.mode === ModeScreen.CREATE ? params : paramsEdit)
    let fieldValue = paramValue[StringUtils.snakeCaseToCamelCase(fieldName)] || TEXT_EMPTY;
    if (!isDefault) {
      const element = paramValue.customerData.find(
        (el: any) => el.key === fieldName
      );
      if (element) {
        fieldValue = element.value || TEXT_EMPTY;
      }
    }
    if (fieldName === specialFName.customerId && route?.params?.mode === ModeScreen.EDIT) {
      fieldValue = paramsEdit["customerId"].toString() || TEXT_EMPTY;
    }
    if (fieldValue && (field?.fieldType?.toString() === DefineFieldType.CHECKBOX
      || field?.fieldType?.toString() === DefineFieldType.MULTI_SELECTBOX
      || field?.fieldType?.toString() === DefineFieldType.SINGER_SELECTBOX
      || field?.fieldType?.toString() === DefineFieldType.RADIOBOX)
    ) {
      return JSON.parse(fieldValue);
    }
    return fieldValue;
  };

  /**
   * onChangeItemDynamic
   * @param data
   * @param field
   */
  const onChangeText = (data: any, field: any) => {
    if (field.fieldName === specialFName.customerAddress) {
      try {
        const jsonAddress = JSON.parse(data);
        if (!jsonAddress.zipCode && !jsonAddress.buildingName && !jsonAddress.addressName) {
          data = "";
        }
      } catch{
        data = "";
      }
    }
    const { fieldName, fieldType, isDefault } = field;
    let value = data;
    if (fieldName.includes("numeric")) {
      value = value?.split(",").join("");
    }
    let param = { ...params };

    if (!isDefault) {
      const index = param.customerData.findIndex(
        (el: any) => el.key === fieldName
      );
      const defaultValue = isArray(value)
        ? JSON.stringify(value)
        : (value || TEXT_EMPTY);
      const prm = {
        key: fieldName,
        fieldType: fieldType.toString(),
        value: defaultValue,
      };
      if (index > -1) {
        param.customerData[index] = prm;
      } else {
        param.customerData.push(prm);
      }
    } else {
      param[StringUtils.snakeCaseToCamelCase(fieldName)] = isNaN(value)
        ? value
        : Number(value);
    }
    setParams(param);
  };

  const renderNameText = (fileName: any, textTranslate: any, itemFileName: string) => {
    let txt = textTranslate;
    if (itemFileName !== specialFName.customerId && route?.params?.mode === ModeScreen.EDIT) {
      if (itemFileName === specialFName.createdDate) {
        txt = utcToTz(paramsEdit['createdDate'] + '', authorizationState.timezoneName, authorizationState.formatDate || APP_DATE_FORMAT_ES, DATE_TIME_FORMAT.User);
      } else if (itemFileName === specialFName.updatedDate) {
        txt = utcToTz(paramsEdit['updatedDate'] + '', authorizationState.timezoneName, authorizationState.formatDate || APP_DATE_FORMAT_ES, DATE_TIME_FORMAT.User);
      } else if (itemFileName === specialFName.createdUser) {
        let a = paramsEdit['createdUser'].split(',');
        txt = a[1].substring(16, a[1].length - 1);
      } else if (itemFileName === specialFName.updatedUser) {
        let a = paramsEdit['updatedUser'].split(',');
        txt = a[1].substring(16, a[1].length - 1);
      }
    }
    return (
      <View
        style={[
          FieldAddEditTextStyles.container,
          CommonStyles.padding4,
        ]}
      >
        <View style={FieldAddEditTextStyles.titleContainer}>
          <Text style={FieldAddEditTextStyles.title}>{fileName}</Text>
        </View>
        <View style={CommonStyles.padding2} />
        <Text>
          {txt}
        </Text>
      </View>
    )
  }

  const renderCustomerSuggestion = (item: any) => {
    return (
      <View style={CommonStyles.padding4}>
        <CustomerSuggestView
          typeSearch={TypeSelectSuggest.MULTI}
          fieldLabel={StringUtils.getFieldLabel(item, FIELD_LABLE, languageCode)}
          updateStateElement={(searchValue) => onChangeText(searchValue, item)}
        />
      </View>
    )
  }
  const errors = listMessageRessponse?.data?.parameters?.extensions?.errors;

  const renderDynamic = (item: any) => {
    if (item.fieldName === specialFName.customerBusinessMain || item.fieldName === specialFName.customerCompanyDescription) {
      return (
        <View key={item.fieldId}>
          <CustomerRegistrationEditItem
            field={item}
            params={params}
            onPress={() => {
              fieldSelected = item;
              toggleModal();
            }}
            onChangeText={() => { }}
          />
        </View>
      )
    } else if (item.fieldName === specialFName.customerParent) {
      return (
        renderCustomerSuggestion(item)
      )
    } else if ((item.fieldName === specialFName.customerId && route?.params?.mode === ModeScreen.CREATE) || item.fieldName === specialFName.createdDate || item.fieldName === specialFName.createdUser || item.fieldName === specialFName.updatedDate || item.fieldName === specialFName.updatedUser) {
      return (
        renderNameText(StringUtils.getFieldLabel(item, FIELD_LABLE, languageCode), translate(fieldAddEditMessages.inputRequired), item.fieldName)
      )
    } else if (item.fieldName === specialFName.employeeId || item.fieldName === specialFName.personInCharge) {
      return (
        <View style={CommonStyles.padding4}>
          <EmployeeSuggestView
            typeSearch={TypeSelectSuggest.MULTI}
            updateStateElement={(searchValue) => onChangeText(searchValue, item)}
            fieldLabel={StringUtils.getFieldLabel(item, FIELD_LABLE, languageCode)}
          />
        </View>
      )
    } else if (
      item.fieldName === specialFName.customerBusinessSub ||
      item.fieldName === specialFName.customerScenario ||
      item.fieldName === specialFName.scheduleNext ||
      item.fieldName === specialFName.actionNext ||
      item.fieldName === specialFName.isDisplayChildCustomers ||
      item.fieldName === specialFName.lastContactDate
    ) {
      return <></>;
    } else {
      if (item.availableFlag > 0) {
        if (item?.fieldType?.toString() === DefineFieldType.TITLE) {
          return <View />;
        }
        let error = errors?.find((itemError: any) => itemError.item === item.fieldName || StringUtils.camelCaseToSnakeCase(itemError.item) === item.fieldName) ?? null;
        if (item?.fieldType?.toString() !== DefineFieldType.OTHER) {
          let isTabData = listFieldId.find((fieldId) => { return fieldId?.toString() === item?.fieldId?.toString() });
          if (!isTabData) {
            return (
              <View style={[CommonStyles.generalInfoItem,
              (error && item?.fieldType?.toString() !== DefineFieldType.OTHER) && { backgroundColor: '#FED3D3' },
              item?.fieldType?.toString() !== DefineFieldType.TAB && { paddingHorizontal: 12 }
              ]}>
                <DynamicControlField
                  controlType={ControlType.ADD_EDIT}
                  fieldInfo={item}
                  isDisabled={item.modifyFlag === ModifyFlag.READ_ONLY}
                  updateStateElement={(_, __, data) => {
                    onChangeText(data, item);
                  }}
                  errorInfo={error}
                  elementStatus={{ fieldValue: getElementStatus(item) }}
                />
              </View>
            );
          }
        }
      }
    }
    return <View />;
  };
  const renderListDynamicField = () => {
    if (Platform.OS === PlatformOS.IOS) {
      return (
        <KeyboardAvoidingView
          behavior={"position"}
          style={CommonStyles.flex1}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            {fieldInfos.map((item: any) => renderDynamic(item))}
          </ScrollView>
        </KeyboardAvoidingView>
      )
    } else {
      return (
        <ScrollView contentContainerStyle={styles.scroll}>
          {fieldInfos.map((item: any) => renderDynamic(item))}
        </ScrollView>
      )
    }
  }

  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <Header
        title={translate(messages.titleRegistrationEdit)}
        nameButton={
          route.params.mode === ModeScreen.CREATE
            ? translate(messages.btn)
            : translate(messages.btnEdit)
        }
        onLeftPress={() => {
          navigation.goBack();
        }}
        textBold
        onRightPress={() =>
          route.params.mode === ModeScreen.CREATE
            ? createCustomerFunc()
            : updateCustomerFunc()
        }
      />
      {listMessageRessponse.length != "" &&
        <View style={styles.viewRegionErrorShow}>
          <CommonMessages response={listMessageRessponse} />
        </View>
      }
      {refresh ? (
        <AppIndicator visible />
      ) : (
          renderListDynamicField()
        )}
      <MultipleSelectWithSearchBox
        modalVisible={selectModalOpen}
        isOnlyPickItem
        onSubmitModal={() => {
          setSelectModalOpen(false);
          setHasChangeInvite(!hasChangeInvite);
        }}
        itemInfoProperties={['employeeName', 'employeeDescription']}
        idProperty="employeeId"
      />
      <ModalCustomerOption
        isVisible={modal}
        closeModal={toggleModal}
        dataOption={fieldSelected.listFieldsItem.filter(
          (el: any) => el.isAvailable
        )}
        onSelected={onSelected}
        itemSelected={fieldSelected}
      />
    </SafeAreaView>
  );
}
