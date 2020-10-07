import {
  EMPLOYEES_API,
  PRODUCT_API,
  CUSTOMERS_API,
  SALES_API,
} from '../../config/constants/api';

export const getUrlLayout = (fieldBelong: number) => {
  switch (fieldBelong) {
    case 8:
      return EMPLOYEES_API.getEmployeeLayout;
    case 14:
      return PRODUCT_API.getProductLayout;
    case 5:
      return CUSTOMERS_API.getCustomerLayout;
    case 16:
      return SALES_API.getProgresses;
    default:
      return EMPLOYEES_API.getEmployeeLayout;
  }
};
