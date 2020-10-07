import { FIELD_BELONG } from "../../config/constants/enum";

export const ServiceName: any = {
  products: "products",
  employees: "employees",
  customers: 'customers',
  productTrading: "productTrading",
  activities: "activities"
};
export const ExtensionName: any = {
  products: "product_data",
  employees: "employee_data",
  customers: "customer_data",
  productTrading: "sale_data",
};

export const DataLayoutName: any = {
  products: "productLayout",
  employees: "employeeLayout",
  customers: "fields",
  productTrading: "progresses"
}

export const AdminRights: any = {
  IS_ADMIN: 1,
  IS_NOT_ADMIN: 0
}

export const ServicesWithOther =[
  FIELD_BELONG.PRODUCT_TRADING
]

export const AdditionsListService :any = {
  '16': [5, 6]
}

export const ServiceNotDisplay : any ={
  '5': ['business_sub_id', 'scenario_id'],
  '6': [],
  '14':['created_user_name', 'updated_user_name', 'product_type_name', 'product_category_name'],
  '16':['is_finish'],
  '8': []
}