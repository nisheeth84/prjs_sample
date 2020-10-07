import { createSelector } from "@reduxjs/toolkit";
import { CustomerListState } from "./customer-list-reducer";
import { RootState } from "../../../reducers";

export const CustomerListSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.customerList
);
export const ListFavouriteSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.listFavourite
);
export const ListSharedSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.listShare
);
export const ListMyListSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.listMyList
);
export const ListFavouriteFilterSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.listFavouriteFilter
);
export const ListSharedFilterSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.listShareFilter
);
export const ListMyListFilterSelector = createSelector(
  (state: RootState) => state.customerList,
  (list: CustomerListState) => list.listMyListFilter
);
export const ListCustomersSelector = createSelector(
  (state: RootState) => state.customerList,
  (customers: CustomerListState) => customers.listCustomers
);
export const ListCountRelationCustomer = createSelector(
  (state: RootState) => state.customerList,
  (counts: CustomerListState) => counts.listCountRelationCustomer
);
export const statusSelector = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.status
);
export const statusSelectedListCustomer = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.statusSelected
);
export const listFilterItemModal = createSelector(
  (state: RootState) => state.customerList,
  (itemModal: CustomerListState) => itemModal.filterItemModal,
);
export const listFilterItemModalActionListUser = createSelector(
  (state: RootState) => state.customerList,
  (itemModal: CustomerListState) => itemModal.filterItemModalActionListUser,
);
export const clickSelector = createSelector(
  (state: RootState) => state.customerList,
  (statusClickEdit: CustomerListState) => statusClickEdit.statusSelect,
);
export const statusMyListModal = createSelector(
  (state: RootState) => state.customerList,
  (statusList: CustomerListState) => statusList.statusMyList,
);
export const statusVisibleConfirmDelete = createSelector(
  (state: RootState) => state.customerList,
  (statusPupop: CustomerListState) => statusPupop.isModalVisibleConfirmDelete,
);
export const statusIsVisibleSortSelector = createSelector(
  (state: RootState) => state.customerList,
  (statusPupop: CustomerListState) => statusPupop.isModalSort,
);
export const statusDeleteConfirmDialogSelector = createSelector(
  (state: RootState) => state.customerList,
  (statusPupop: CustomerListState) => statusPupop.isModalDeleteConfirmDialog,
);
export const StatusShowActionSelector = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.statusShowActionList
);
export const StatusShowLastUpdatedDateSelector = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.statusShowLastUpdatedDate
);
export const statusModalActionMylistSelector = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.isModalVisibleActionMyList
);
export const statusModalActionListUserSelector = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.isModalVisibleActionListUser
);
export const getValueCustomerListSelector = createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.setValueCustomerList
);
export const statusConfirmSelector= createSelector(
  (state: RootState) => state.customerList,
  (status: CustomerListState) => status.statusConfirm
);
export const SortTypeDataListSelector = createSelector(
  (state: RootState) => state.customerList,
  (sortTypeDataList: CustomerListState) => sortTypeDataList.arraySortTypeData
);
export const SortTypeAscOrDescSelector = createSelector(
  (state: RootState) => state.customerList,
  (sortTypeDataList: CustomerListState) => sortTypeDataList.typeSort
);
export const ResponseCustomerSelector = createSelector(
  (state: RootState) => state.customerList,
  (sortTypeDataList: CustomerListState) => sortTypeDataList.responseCustomer
);
export const IsShowMessageSelector = createSelector(
  (state: RootState) => state.customerList,
  (type: CustomerListState) => type.isMessage
);
export const LengthListSelector = createSelector(
  (state: RootState) => state.customerList,
  (count: CustomerListState) => count.lenghtList
);
export const ParamCustomersSelector = createSelector(
  (state: RootState) => state.customerList,
  (param: CustomerListState) => param.customerParam
);
export const MessageSuccessSelector = createSelector(
  (state: RootState) => state.customerList,
  (message: CustomerListState) => message.messageSuccess
);

