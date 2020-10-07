import {
  getActivities as getActivitiesSuggestionsGlobal,
  getEmployeeSuggestionsGlobal,
  getProductSuggestionsGlobal,
  getProductTradingSuggestionsGlobal,
  getReportSuggestionsGlobal,
  getEmployeeLists,
  getScheduleSuggestionsGlobal,
  getCustomers,
  getTimelineSuggestionsGlobal,
  getBusinessCardSuggestionsGlobal,
  getTradingProduct,
} from './search-reponsitory';

import { querySearch } from './search-query';
import { SearchActions } from './search-reducer';

import { getProducts } from '../products/products-repository';
// TODO: check test UI by data dummy
// import { SCHEDULES_DUMMY, TIMELINE_DUMMY, BUSINESS_DUMMY, CUSTOMER_DUMMY, ACTIVITIES_DUMMY, ANALYSIS_DUMMY,
// TASK_DUMMY, PRODUCT_TRADINGS_DUMMY
// } from "./search-dummy";

export async function CallSearchToScreen(
  nameService: string,
  params: any,
  dispatch: any
) {
  switch (nameService) {
    case 'calendar': {
      // const response = await getScheduleSuggestionsGlobal(
      //   queryScheduleSuggestionsGlobal(params),
      //   {}
      // );
      // if (response.status === 200) {
      //   dispatch(SearchActions.getDataScheduleSuggestionsGlobal(response));
      // }
      break;
    }
    case 'timeline': {
      // const response = await getTimelineSuggestionsGlobal(
      //   queryTimelineSuggestionsGlobal(params),
      //   {}
      // );
      // if (response.status === 200) {
      //   dispatch(SearchActions.getTimelineSuggestionsGlobal(response));
      // }
      break;
    }

    case 'businessCard': {
      // const response = await getBusinessCardSuggestionsGlobal(
      //   queryBusinessCardSuggestionsGlobal(params),
      //   {}
      // );
      // if (response.status === 200) {
      //   dispatch(SearchActions.getBusinessCardSuggestionsGlobal(response));
      // }
      break;
    }
    case 'customers': {
      const response = await getCustomers(params, {});
      if (response.status === 200) {
        return response?.data || [];
      }
      return [];
    }
    case 'activities': {
      const response = await getActivitiesSuggestionsGlobal(
        querySearch(params),
        {}
      );
      if (response.status === 200) {
        dispatch(SearchActions.getActivities(response));
      }
      break;
    }
    case 'employees': {
      const responseEmployees = await getEmployeeLists(params, {});
      if (responseEmployees.status === 200) {
        dispatch(SearchActions.getEmployees(responseEmployees.data));
      }
      return responseEmployees?.data || [];
      // break;
    }
    case 'analysis': {
      const response = await getReportSuggestionsGlobal(
        querySearch(params),
        {}
      );
      if (response.status === 200) {
        dispatch(SearchActions.getReportSuggestionsGlobal(response));
      }
      break;
    }
    case 'products': {
      const listProductResponse = await getProducts(params, {});
      if (listProductResponse) {
        if (listProductResponse.status === 200) {
          // dispatch(productActions.getProducts(listProductResponse.data));
        }
      }
      return listProductResponse?.data || [];
    }
    case 'schedules': {
      const response = await getScheduleSuggestionsGlobal(
        querySearch(params),
        {}
      );
      if (response.status === 200) {
        dispatch(SearchActions.getProductSuggestionsGlobal(response));
      }
      break;
    }
    case 'productTrading': {
      const response = await getTradingProduct(params, {});
      if (response.status === 200) {
        return response?.data || [];
      }
      return [];
    }
    default: {
      break;
    }
  }
}

/**
 *
 * @param param
 */
export async function CallSearchAll(params: any, _dispatch: any) {
  // schedules
  const responseScheduleSuggestionsGlobal = await getScheduleSuggestionsGlobal(
    params,
    {}
  );

  // timelines
  const responseTimelineSuggestionsGlobal = await getTimelineSuggestionsGlobal(
    params,
    {}
  );

  // businesscards
  const responseBusinessCardSuggestionsGlobal = await getBusinessCardSuggestionsGlobal(
    params,
    {}
  );

  // const responseCustomerSuggestionsGlobal = await getCustomerSuggestionsGlobal(params,
  //   {}
  // );

  // const responseActivitiesSuggestionsGlobal = await getActivitiesSuggestionsGlobal(params, {});

  // employees
  const responseEmployeeSuggestionsGlobal = await getEmployeeSuggestionsGlobal(
    params,
    {}
  );

  // const responseReportSuggestionsGlobal = await getReportSuggestionsGlobal(params,
  //   {}
  // );

  const responseProductSuggestionsGlobal = await getProductSuggestionsGlobal(
    params,
    {}
  );
// TODO use when integrate search global task 
  // const responseTaskSuggestionsGlobal = await getTaskSuggestionsGlobal(params,
  //   {}
  // );

  const responseProductTradingSuggestionsGlobal = await getProductTradingSuggestionsGlobal(
    params,
    {}
  );
  const resultSearchAll = {
    scheduleSuggestionsGlobal:
      responseScheduleSuggestionsGlobal?.data?.schedules,
    timelineSuggestionsGlobal:
      responseTimelineSuggestionsGlobal?.data?.timelines,
    businessCardSuggestionsGlobal:
      responseBusinessCardSuggestionsGlobal?.data?.businessCards,
    customerSuggestionsGlobal: [],
    activities: [],
    employeeSuggestionsGlobal:
      responseEmployeeSuggestionsGlobal?.data.employees,
    reportSuggestionsGlobal: [],
    productSuggestionsGlobal: responseProductSuggestionsGlobal?.data?.dataInfo,
    taskSuggestionsGlobal: [],
    productTradingSuggestionsGlobal:
      responseProductTradingSuggestionsGlobal?.data?.productTradings,
  };

  return resultSearchAll;
}
