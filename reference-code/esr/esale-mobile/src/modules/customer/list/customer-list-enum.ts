// action overflow popup menu display case 
export enum PopupValueMenu {
  UpdateList = 1,
  AddFavorite = 2,
  EditList = 3,
  DeleteList = 4,
  CopyList = 5,
  RemoveFavorite = 6,
  ChangeMylistToShareList = 7,
}

// action show overflow menu Local navigation	
export enum ActionTypeList {
  FavoriteMyListAuto = 1,
  FavoriteMyList = 2,
  FavoriteShareListAutoOwner = 3,
  FavoriteShareListAutoMember = 4,
  FavoriteShareListOwner = 5,
  FavoriteShareListMember = 6,
  MyListAuto = 7,
  MyList = 8,
  ShareListAutoOwner = 9,
  ShareListAutoMember = 10,
  ShareListOwner = 11,
  ShareListMember = 12,
}

// value of selectedTargetType
export enum SelectedTargetType {
  CustomerAll = 0,
  CustomerInCharge = 1,
  CustomerFavouriteList = 2,
  CustomerMyList = 3,
  CustomerShareList = 4,
}

// value of api ListCustomers
export enum Parameters {
  SelectedTargetId = 0,
}

// value of list type
export enum ListType {
  MyList = 1,
  ShareList = 2,
}

// value of Type sharelist Owner or Member
export enum ParticipantType {
  Menber = 1,
  Owner = 2,
}

// value of Type ActionList
export enum ActionListType {
  NoAction = 0,
  Edit = 1,
  CopyOrCreate = 2,
}

// action overflow popup customer display case 
export enum PopupActionValueCustomer {
  DeleteCustomer = 1,
  AddList = 2,
  MoveList = 3,
  DeleteList = 4,
  CreateMyList = 5,
  CreateShareList = 6,
}

// case of customer display
export enum CaseScreenShowCustomer {
  HistoryActive = 1,
  RegisterActive = 2,
  RegisterShedule = 3,
  RegisterTask = 4,
  Post = 5,
  CreateMail = 6,
  RegisterBusinessCard = 7,
  ChildCustomerRegistration = 8,
}

// value magic number Drawer Left Content
export enum MagicNumberDrawerLeft {
  StatusShowIconArrowRight = 0,
}

// actions in the popup when selecting customers

export enum ActionsPopupSelectingCustomers {
  ListInChargeCustomer = 1,
  ListAllCustomer = 2,
  ListMylistCustomer = 3,
  ListMylistAutoCustomer = 4,
  ListSharelistOwnerCustomer = 5,
  ListSharelistMemberCustomer = 6,
  ListSharelistOwnerAutoCustomer = 7,
  ListSharelistMemberAutoCustomer = 8,
}

// value status current, select, selected
export enum StatusCustomerType {
  Current = 0,
  Select = 1,
  Selected = 2,
}

// value status current, select, selected

export enum StatusConfirmType {
  NoManipulation = 0,
  DeleteCustomer = 1,
  DeleteCustomerInList = 2,
  DeleteList = 3,
  DeleteListFavourite = 4,
}

// value sort data type
export enum SortDataType {
  CUSTOMER_PARENT = 1,
  CUSTOMER_NAME = 2,
  CUSTOMER_ADDRESS = 3,
  CREATED_DATE = 4,
  UPDATED_DATE = 5,
}

// value status all select and all selected
export enum StatusAllType {
  SELECT = 0,
  SELECTED = 1,
}

// Message type
export enum MessageType {
  DEFAULT = 0,
  NO_DATA = 1,
  ERROR = 3,
}

// CustomerList
export enum CustomerListApi {
  MODE_OWNER_AND_MEMBER = 2,
}

//StackScreen
export enum StackScreenListCustomer {
  REGISTER_ACTIVE = "activityCreateEdit",
  REGISTER_SHEDULE = "create-screen",
  POST = "customer-detail",
  CREATE_MAIL = "activityList",
  REGISTER_BUSINESS_CARD = "business-card-add",
  CHILD_CUSTOMER_REGISTER = "customer-create-or-update"
}

export enum CustomerRegisterEditMode {
  REGISTER_SHEDULE = 0
}
