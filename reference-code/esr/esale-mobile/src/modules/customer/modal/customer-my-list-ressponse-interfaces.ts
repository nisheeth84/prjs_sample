/**
 * Difine value of list customer
 */
export interface ListCustomer{
  customerListId: number,
  customerListName: string,
  customerListType: number,
  isAutoList: boolean,
  isOverWrite: boolean
}
/**
 * Define value of List Participants
 */
export interface ListParticipants{
  customerListId: number;
  employeeId: number;
  departmentId: number;
  groupId: number;
  participantType: number;
}

/**
 * Define value of SearchConditions
 */
export interface SearchConditions{
  customerListId: number;
  fieldId: number;
  searchType: number;
  searchOption: number;
  searchValue: string;
}

/**
 * Define value of Fields
 */
export interface Fields{
  fieldId: any;
  fieldLabel: any;
  fieldType	: any;
  fieldOrder: any;
  searchType: any;
  searchOption: any;
}

/**
 * Define value of Update Time
 */
export interface UpdateTime{
  listUpdateTime: string
}

/**
 * Define InitializeListModalSuggestionData
 */
export interface InitializeListModalSuggestionData{
    listParticipants: ListParticipants[],
    searchConditions: SearchConditions[]
    list: ListCustomer,
    fields?: Fields,
}
/**
 * Define InitializeListModalResspone
 */
export interface InitializeListModalResspone {
  data: InitializeListModalSuggestionData;// data ressponse rom API
  status: number
}

/**
 * Define getResspoonseListCustomer
 */
export interface getResspoonseListCustomer {
  customerListId: number,
  isAutoList: boolean,
  actions: string
}
/**
 * Define ressponse from request
 */
export interface ValueCustomerList {
  // ID my list
  listId?: number;
  // Auto or ...
  isAutoList?: boolean;
  // Create or Update
  status?: boolean;
  // List custormer ID
  listIdCustomer?: number[];
}