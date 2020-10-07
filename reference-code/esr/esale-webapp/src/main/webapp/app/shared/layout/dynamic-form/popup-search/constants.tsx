import { FIELD_BELONG } from 'app/config/constants';
import { DEFINE_FIELD_TYPE } from '../constants';

export const fieldTypeSearchSpecial = [
  {
    fieldBelong: FIELD_BELONG.EMPLOYEE,
    fields: [
      { fieldName: 'employee_managers', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'employee_subordinates', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'employee_packages', fieldType: DEFINE_FIELD_TYPE.MULTI_SELECTBOX },
      { fieldName: 'employee_departments', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
      { fieldName: 'employee_positions', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
      { fieldName: 'is_admin', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.ACTIVITY,
    fields: [
      { fieldName: 'activity_format_id', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
      { fieldName: 'employee_id', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'activity_time', fieldType: DEFINE_FIELD_TYPE.NUMERIC },
      { fieldName: 'interviewer', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'customer_id', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'customer_relation_id', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'next_schedule_id', fieldType: DEFINE_FIELD_TYPE.DATE },
      { fieldName: 'activity_target_id', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'is_finish', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.BUSINESS_CARD,
    fields: [
      { fieldName: 'company_name', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'employee_id', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'is_working', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.CUSTOMER,
    fields: [
      { fieldName: 'customer_parent', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'business_main_id', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'schedule_next', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'action_next', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'is_display_child_customers', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'last_contact_date', fieldType: DEFINE_FIELD_TYPE.DATE },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.PRODUCT_TRADING,
    fields: [
      { fieldName: 'is_finish', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'product_trading_progress_id', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.PRODUCT,
    fields: [
      { fieldName: 'product_category_id', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
      { fieldName: 'product_type_id', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'product_relation_id', fieldType: DEFINE_FIELD_TYPE.TEXT },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.TASK,
    fields: [
      { fieldName: 'customer_id', fieldType: DEFINE_FIELD_TYPE.NUMERIC },
      { fieldName: 'is_public', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'customer_name', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'product_name', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'milestone_name', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'parent_id', fieldType: DEFINE_FIELD_TYPE.NUMERIC },
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'products_tradings_id', fieldType: DEFINE_FIELD_TYPE.NUMERIC },
      { fieldName: 'milestone_id', fieldType: DEFINE_FIELD_TYPE.NUMERIC },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.SCHEDULE,
    fields: [
      { fieldName: 'is_public', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'can_modify', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldName: 'schedule_type_id', fieldType: DEFINE_FIELD_TYPE.SINGER_SELECTBOX },
    ]
  },
  {
    fieldBelong: FIELD_BELONG.MILE_STONE,
    fields: [
      { fieldName: 'created_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
      { fieldName: 'updated_user', fieldType: DEFINE_FIELD_TYPE.TEXT },
    ]
  }
];

export const fieldSearchIgnore = [
  { fieldBelong: FIELD_BELONG.EMPLOYEE, fields: ['timezone_id', 'language_id', 'employee_icon'] },
  { fieldBelong: FIELD_BELONG.ACTIVITY, fields: ['product_trading_id', 'scenario_id'] },
  { fieldBelong: FIELD_BELONG.BUSINESS_CARD, fields: ['business_card_image_path'] },
  { fieldBelong: FIELD_BELONG.CUSTOMER, fields: ['customer_logo', 'scenario_id', 'business_sub_id'] },
  { fieldBelong: FIELD_BELONG.PRODUCT_TRADING, fields: [] },
  { fieldBelong: FIELD_BELONG.PRODUCT, fields: [] },
  { fieldBelong: FIELD_BELONG.TASK, fields: [] },
  { fieldBelong: FIELD_BELONG.MILE_STONE, fields: [] },
]

export const mappingFieldSearchOtherService = [
  {
    mainFieldBelong: FIELD_BELONG.ACTIVITY,
    subFields: [
      { fieldBelong: FIELD_BELONG.CUSTOMER, fieldName: 'customer_id' },
      { fieldBelong: FIELD_BELONG.PRODUCT_TRADING, fieldName: 'activity_id' }
    ]
  },
  {
    mainFieldBelong: FIELD_BELONG.BUSINESS_CARD,
    subFields: [
      { fieldBelong: FIELD_BELONG.CUSTOMER, fieldName: 'customer_id', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldBelong: FIELD_BELONG.ACTIVITY, fieldName: 'business_card_id' },
      { fieldBelong: FIELD_BELONG.PRODUCT_TRADING, fieldName: 'activity_id' }
    ]
  },
  {
    mainFieldBelong: FIELD_BELONG.PRODUCT_TRADING,
    subFields: [
      { fieldBelong: FIELD_BELONG.CUSTOMER, fieldName: 'customer_id', fieldType: DEFINE_FIELD_TYPE.CHECKBOX },
      { fieldBelong: FIELD_BELONG.ACTIVITY, fieldName: 'last_contact_date' }
    ]
  }
]
