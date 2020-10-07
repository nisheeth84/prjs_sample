import { AdditionsListService } from '../search-enum';
import {
  getCustomFieldInfo,
  getCustomers,
  getDataLayout,
  getProductTradingByActivity,
} from '../search-reponsitory';
import { DefineFieldType, FIELD_BELONG } from '../../../config/constants/enum';
import { getUrlLayout } from '../search-util';
import _ from 'lodash';
import { OBJECT_EMPTY } from '../../../config/constants/constants';

export const getAdditionsService = async (
  nameService: string,
  defaultData: any
) => {
  let defaultServiceData = [...defaultData].sort((a: any, b: any) => {
    return a.fieldOrder - b.fieldOrder;
  });

  const additionsServices: any = AdditionsListService[nameService] || [];
  if (additionsServices.length === 0) {
    return defaultServiceData;
  }

  if (nameService === FIELD_BELONG.PRODUCT_TRADING.toString()) {
    const responseCustomerFieldInfo: any = await getFieldInfoServiceByService(
      5
    );
    const responseActivities: any = await getFieldInfoServiceByService(6);
    defaultServiceData = [
      ...responseCustomerFieldInfo,
      ...defaultServiceData,
      ...responseActivities.filter((el: any) => {
        return el.fieldName === 'contact_date';
      }),
    ];
  }
  return defaultServiceData;
};

const getFieldInfoServiceByService: any = async (fieldBelong: number) => {
  const responseFieldInfo = await getCustomFieldInfo(
    {
      fieldBelong,
    },
    {}
  );
  const customField = responseFieldInfo?.data?.customFieldsInfo
    .filter((el: any) => {
      return el.fieldType.toString() !== DefineFieldType.RELATION;
    })
    .sort((a: any, b: any) => {
      return a.fieldOrder - b.fieldOrder;
    });
  return customField || [];
};

export const getAdditionServiceId = async (
  trueConditions: any,
  fieldBelong: number
) => {
  const conditions = [...trueConditions];
  const fieldObject: any = {};
  conditions.forEach((el: any) => {
    if (el.fieldBelong !== fieldBelong) {
      const elementBelong = el.fieldBelong;
      delete el.fieldBelong;
      if (!fieldObject[elementBelong?.toString()]) {
        fieldObject[elementBelong?.toString()] = [el];
      } else {
        fieldObject[elementBelong?.toString()].push(el);
      }
    }
  });
  const newConditions = [...conditions].filter((el: any) => {
    return el.fieldBelong === fieldBelong;
  });
  if (JSON.stringify(fieldObject) === OBJECT_EMPTY) {
    return newConditions;
  }

  switch (fieldBelong) {
    case FIELD_BELONG.PRODUCT_TRADING:
      const customerConditions = await callAdditionService(5, fieldObject['5']);
      const activityConditions = await callAdditionService(6, fieldObject['6']);
      if (!!customerConditions) {
        newConditions.push(customerConditions);
      }
      if (!!activityConditions) {
        newConditions.push(activityConditions);
      }
      return newConditions;
    default:
      return;
  }
};

const callAdditionService = async (fieldBelong: any, fieldParams: any) => {
  if (!fieldParams) {
    return;
  }
  switch (fieldBelong) {
    case FIELD_BELONG.CUSTOMER:
      const returnCustomers: any = [];
      const paramCustomer = {
        filterConditions: [],
        isUpdateListView: false,
        limit: 30,
        localSearchKeyword: '',
        offset: 0,
        orderBy: [],
        searchConditions: fieldParams || [],
        selectedTargetId: 0,
        selectedTargetType: 0,
      };
      const response = await getCustomers(paramCustomer, {});

      if (response.status === 200) {
        response?.data?.customers?.forEach((element: any) => {
          returnCustomers.push(element.customerId);
        });
        return {
          fieldType: 4,
          fieldName: 'customer_id',
          fieldValue: returnCustomers,
        };
      }
      return;
    case FIELD_BELONG.ACTIVITY:
      let returnActivity: any = [];
      const paramsActivities = {
        searchConditions: fieldParams || [],
      };
      const responseActivities = await getProductTradingByActivity(
        paramsActivities,
        {}
      );
      returnActivity = responseActivities?.data?.productTradingIds || [];
      return {
        fieldType: 4,
        fieldName: 'product_trading_id',
        fieldValue: returnActivity,
      };
    default:
      return;
  }
};

export const getAdditionsServiceLayout = async (mainService: number) => {
  switch (mainService) {
    case FIELD_BELONG.PRODUCT_TRADING:
      const customerLayout = await getDataLayoutService(FIELD_BELONG.CUSTOMER);
      return {
        '5': customerLayout?.data?.fields || [],
      };

    default:
      return {};
  }
};

const getDataLayoutService = async (fieldBelong: number) => {
  const dataLayout = await getDataLayout(getUrlLayout(fieldBelong), {}, {});
  return dataLayout;
};
