export const compareDate = (
  firstDate: string = "",
  secondDate: string = ""
) => {
  firstDate = firstDate?.slice(0, 10) || "";
  secondDate = secondDate?.slice(0, 10) || "";
  return firstDate == secondDate;
};

const DEFAULT_ORDER = [
  {
    key: "receive_date",
    value: "DESC",
    fieldType: 9,
  },
  {
    key: "customer_name",
    value: "ASC",
    fieldType: 9,
  },
  {
    key: "business_card_name",
    value: "ASC",
    fieldType: 9,
  },
];

export const createParamsGetBusinessCards = (param: any) => {
  return {
    selectedTargetType: 1,
    selectedTargetId: 1,
    searchConditions: [],
    orders: DEFAULT_ORDER,
    offset: 1,
    limit: 30,
    searchLocal: "",
    filterConditions: [],
    isFirstLoad: false,
    ...param,
  };
};

export const fieldTypeSort = [
  { key: "business_card_id", fieldType: 5, name: "business_card_id" },
  {
    key: "business_card_image_path",
    fieldType: 11,
    name: "business_card_image_path",
  },
  { key: "customer_name", fieldType: 9, name: "customer_name" },
  { key: "business_card_name", fieldType: 9, name: "business_card_name" },
  {
    key: "business_card_name_kana",
    fieldType: 9,
    name: "business_card_name_kana",
  },
  { key: "position", fieldType: 9, name: "position" },
  { key: "department_name", fieldType: 9, name: "department_name" },
  { key: "address", fieldType: 14, name: "address" },
  { key: "email_address", fieldType: 15, name: "email_address" },
  { key: "phone_number", fieldType: 13, name: "phone_number" },
  { key: "mobile_number", fieldType: 13, name: "mobile_number" },
  {
    key: "business_cards_receives.employee_id",
    fieldType: 99,
    name: "business_cards_receives.employee_id",
  },
  {
    key: "business_cards_receives.receive_date",
    fieldType: 6,
    name: "business_cards_receives.receive_date",
  },
  {
    key: "business_cards_receives.received_last_contact_date",
    fieldType: 6,
    name: "business_cards_receives.received_last_contact_date",
  },
  { key: "last_contact_date", fieldType: 6, name: "last_contact_date" },
  { key: "is_working", fieldType: 99, name: "is_working" },
  { key: "memo", fieldType: 10, name: "memo" },
  { key: "created_date", fieldType: 7, name: "created_date" },
  { key: "created_user", fieldType: 99, name: "created_user" },
  { key: "updated_date", fieldType: 7, name: "updated_date" },
  { key: "updated_user", fieldType: 99, name: "updated_user" },
];
