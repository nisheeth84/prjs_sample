
export interface CustomerListParticipantId{
  customerListParticipantId: number;
}
export interface CustomerListSearchConditionId{
  customerListSearchConditionId: number;
}

export interface Customer {
  customerId: number
}

/**
 * Define value of List Participants
 */
export interface ListParticipantsInsertUpdate {
  employeeId: number;
  departmentId: number;
  groupId: number;
  participantType: number;
}

/**
 * Define value of SearchConditions
 */
export interface SearchConditionsInsertUpdate {
  fieldId: number;
  searchType: number;
  searchOption: number;
  searchValue: string;
}

export interface CreateMyListDataRessponse {
  data: any;
  status: number;
}

export interface UpdateMyListDataRessponse{
  data: any;
  status: number;
}