import { SliceCaseReducers, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CustomerList, TaskItemModal, TaskItemModalActionListUser, extendItem, ItemFavouriteList, ItemSharedList, ItemMyList, ValueCustomerList, ItemSortTypeData, GetCustomers, ListCount } from "./customer-list-repository";
import { StatusCustomerType, StatusConfirmType, MessageType } from "./customer-list-enum";

export interface OrderBy {
  key: string,
  fieldType: number,
  value: string,
}

export interface GetCustomerParam {
  selectedTargetId: number;
  selectedTargetType: number;
  isUpdateListView: boolean;
  searchConditions: any;
  filterConditions: any;
  localSearchKeyword: any;
  orderBy: Array<OrderBy>;
  offset: number;
  limit: number;
}

export interface GetMessage {
  toastMessage: string,
  visible: boolean,
}

export interface CustomerListState {
  customerList: CustomerList;
  listFavourite: Array<ItemFavouriteList>;
  listShare: Array<ItemSharedList>;
  listMyList: Array<ItemMyList>;
  listFavouriteFilter: Array<ItemFavouriteList>;
  listShareFilter: Array<ItemSharedList>;
  listMyListFilter: Array<ItemMyList>;
  // listCustomers: ListCustomers;
  listCustomers: GetCustomers;
  listCountRelationCustomer: ListCount;
  extendItemOfCustomers: Array<extendItem>;
  status: string;
  statusSelect: number;
  statusConfirm: number;
  filterItemModal: Array<TaskItemModal>;
  filterItemModalActionListUser: Array<TaskItemModalActionListUser>;
  statusMyList: number;
  statusListUser: number;
  statusSelected: boolean;
  isModalVisibleConfirmDelete: boolean;
  statusShowActionList: boolean;
  statusShowLastUpdatedDate: boolean;
  isModalVisibleActionMyList: boolean;
  isModalDeleteConfirmDialog: boolean;
  isModalSort: boolean;
  isModalVisibleActionListUser: boolean;
  listCustomerIds: [];
  setValueCustomerList: ValueCustomerList;
  arraySortTypeData: Array<ItemSortTypeData>;
  typeSort: string;
  responseCustomer: any;
  isMessage: number;
  lenghtList : number;
  customerParam: GetCustomerParam;
  statusLoadmore: string
  messageSuccess: GetMessage
}

export interface GetCustomerListPayload {}

export interface GetResponseCustomerPayload {
  responseCustomer:  any;
}

export interface GetStatusLoadmorePayload {
  statusLoadmore:  string;
}

export interface GetCustomerListSearchPayload {
  text: string;
}

export interface GetListCustomerPayload {
  listCustomers: GetCustomers;
}

export interface deleteCustomerOutOfListPayload {
  listCustomerIds: [];
}

export interface SetListCustomerExtendPayload {
  position: number;
}

export interface SetExtendItemListCustomerPayload {
  position: number;
  cate: string;
}

export interface SetItemSelectPayload {
  position: number;
}

export interface SetAllSelectPayload {
  connection: number;
}

export interface updateExtendPayload {
  position: number
}

export interface updateFilterItemModal {
  position: number;
  connection: TaskItemModal;
}

export interface updateFilterItemModalActionListUser {
  position: number;
  connection: TaskItemModalActionListUser;
}

export interface updateSelectedPayload {
  connection: number;
}

export interface statusConfirmPayload {
  connection: number;
}

export interface isModalVisibleConfirmDelete {
  connection: number;
}


export interface updateStatusMyList {
  connection: [];
}

export interface updateStatusListUser {
  connection: [];
}

export interface DeleteCustomerPayload {
  position: number;
}

export interface StatusShowLastUpdatedDatePayload {
  statusShowLastUpdatedDate: boolean;
}

export interface StatusIsModalVisibleActionMyListPayload {
  isModalVisible: boolean;
}

export interface StatusIsModalDeleteConfirmDialog {
  isModalVisible: boolean;
}

export interface StatusIsModalSort {
  isModalVisible: boolean;
}

export interface StatusLastUpdatedDatePayload {
  status: boolean;
}

export interface StatusIsModalVisibleActionListUserPayload {
  isModalVisible: boolean;
}

export interface EditMyListPayload {
  listId: number;
  listName: string;
}

export interface CreateMyListPayload {
  item: ItemMyList;
}

export interface RemoveFavouriteListPayload {
  listId: number;
}

export interface AddToListFavouritePayload {
  listId: number;
  typeList: number;
}

export interface SetCustomerListTypePayload {
  listId: number;
  typeList: number;
  isAutoList: boolean;
  status: boolean;
  listIdCustomer: [];
  statusScreen: boolean;
  selectedTargetType: number;
  listName: string;
}

export interface SetSelectSortModalPayload {
  position: number;
}

export interface SetSelectSortModalPayload {
  sortAS: number;
}

export interface GetSortTypeDataListPayload {
  arraySortTypeData: Array<ItemSortTypeData>
}

export interface SetOptionSortPayload {
  typeSort: string;
}

export interface SetIsShowMessagePayload {
  isMessage:  number;
}

export interface CustomerListReducer extends  SliceCaseReducers<CustomerListState> {}

const customerListSlice = createSlice<CustomerListState, CustomerListReducer>({
  name: "customerList",
  initialState: {
    customerList: {
      myList: [],
      sharedList: [],
      favouriteList: [],
    },
    setValueCustomerList: {
      listId:0,
      typeList: 0,
      isAutoList: false,
      status: false,
      listIdCustomer: [],
      statusScreen: false,
      selectedTargetType: 0,
      listName: ''
    },
    listFavourite: [],
    listShare: [],
    listMyList: [],
    listFavouriteFilter: [],
    listShareFilter: [],
    listMyListFilter: [],
    status: "pending",
    listCustomers: {
      totalRecords: 0,
      customers: [],
      lastUpdatedDate:"",
    },
    listCountRelationCustomer: {
      listCount: [],
    },
    listCustomerIds: [],
    extendItemOfCustomers: [],
    filterItemModal: [],
    filterItemModalActionListUser: [],
    statusSelect: 0,
    statusConfirm: 0,
    statusMyList: 0,
    statusListUser: 0,
    statusSelected: false,
    isModalVisibleConfirmDelete: false,
    statusShowActionList: false,
    statusShowLastUpdatedDate: false,
    isModalVisibleActionMyList: false,
    isModalVisibleActionListUser: false,
    isModalDeleteConfirmDialog: false,
    isModalSort: false,
    arraySortTypeData: [],
    typeSort: "ASC",
    responseCustomer: "",
    isMessage: MessageType.DEFAULT,
    lenghtList: 0,
    customerParam: {
      selectedTargetId: 0,
      filterConditions: [],
      isUpdateListView: false,
      localSearchKeyword: "",
      selectedTargetType: 0,
      searchConditions: [],
      orderBy: [],
      offset: 0,
      limit: 20,
    },
    statusLoadmore: "default",
    messageSuccess: {
      toastMessage: "",
      visible: false
    }
  },
  reducers: {
    getCustomerList(state, { payload }: PayloadAction<CustomerList>) {
      state.customerList = payload;
      state.listFavourite = state.customerList.favouriteList;
      state.listMyList = state.customerList.myList;
      state.listShare = state.customerList.sharedList;
      state.listFavouriteFilter = state.listFavourite
      state.listMyListFilter = state.listMyList;
      state.listShareFilter = state.listShare;

      if(state.listFavourite) {
        state.lenghtList += state.listFavourite.length;
      }

      if(state.listMyList) {
        state.lenghtList += state.listMyList.length;
      }

      if(state.listShare) {
        state.lenghtList += state.listShare.length;
      }
    },

    getListCustomers(state, { payload }: PayloadAction<GetCustomers>) {
      if (state.statusLoadmore === "appending") {
        state.listCustomers.customers = [...state.listCustomers.customers, ...payload.customers];
      } else {
        state.listCustomers = payload;
      }
      state.statusLoadmore = "default";
    },

    getStatusLoadmore(state, { payload }: PayloadAction<GetStatusLoadmorePayload>) {
      state.statusLoadmore = payload.statusLoadmore;
    },

    getResponseCustomer(state, { payload }: PayloadAction<GetResponseCustomerPayload>) {
      state.responseCustomer = payload.responseCustomer;
    },

    getListItemCustomerSearch(state, { payload }: PayloadAction<GetCustomerListSearchPayload>) {
      if(payload.text === ""){
        if(state.listFavourite) {
          state.listFavouriteFilter = state.listFavourite;
        }
        if(state.listMyList) {
          state.listMyListFilter = state.listMyList;
        }
        if(state.listShare) {
          state.listShareFilter = state.listShare;
        }
      }else{
        if(state.listFavourite) {
          state.listFavouriteFilter = state.listFavourite.filter((item) => {
            return item.listName.toLowerCase().includes(payload.text.toLowerCase());
          });
        }
        if(state.listMyList) {
          state.listMyListFilter = state.listMyList.filter((item) => {
            return item.listName.toLowerCase().includes(payload.text.toLowerCase());
          });
        }
        if(state.listShare) {
          state.listShareFilter = state.listShare.filter((item) => {
            return item.listName.toLowerCase().includes(payload.text.toLowerCase());
          });
        }
      }
    },
    
    handleSetExtendItemListCustomer(state, { payload }: PayloadAction<SetExtendItemListCustomerPayload>) {
      if(payload.cate == "favourite") {
        const temp = state.listFavourite[payload.position];
        temp.extend = !temp.extend;
        state.listFavourite[payload.position] = temp;
        state.listFavouriteFilter[payload.position] = temp;
      }else if(payload.cate == "mylist") {
        const temp = state.listMyList[payload.position];
        temp.extend = !temp.extend;
        state.listMyList[payload.position] = temp;
        state.listMyListFilter[payload.position] = temp;
      }else if(payload.cate == "sharelist") {
        const temp = state.listShare[payload.position];
        temp.extend = !temp.extend;
        state.listShare[payload.position] = temp;
        state.listShareFilter[payload.position] = temp;
      }
    },
    
    getListCountRelationCustomer(state, { payload }: PayloadAction<ListCount>) {
      state.listCountRelationCustomer = payload;
    },

    handleSetExtendListCustomers(state, { payload }: PayloadAction<SetListCustomerExtendPayload>) {
      let temp = state.listCustomers.customers[payload.position];
      temp.extend = !temp.extend;
      state.listCustomers.customers[payload.position] = temp;
    },

    handleSetItemSelectCustomers(state, { payload }: PayloadAction<SetItemSelectPayload>) {
      let temp = state.listCustomers.customers[payload.position];
      temp.select = !temp.select;
      if(!temp.select) {
        const search = (what: boolean) => state.listCustomers.customers.find(element => element.select === what);
        if (search(true)) {
          state.statusSelected = true;
        } else {
            state.statusSelected = false;
        }
      }else{
        state.statusSelected = true;
      }
      state.listCustomers.customers[payload.position] = temp;
    },

    handleSetAllSelectCustomers(state, { payload }: PayloadAction<SetAllSelectPayload>) {
      let defaultListCustomers = state.listCustomers;
      if(payload.connection === 0){
        state.statusSelected = false;
        state.listCustomers.customers = defaultListCustomers.customers.map((item) => {
          item.select = false;
          return item;
        })
      }else{
        state.statusSelected = true;
        state.listCustomers.customers = defaultListCustomers.customers.map((item) => {
          item.select = true;
          return item;
        })
      }
    },

    handleExplandStatusMyList(state, { payload }: PayloadAction<updateStatusMyList>) {
      state.filterItemModal = payload.connection;
      
    },
    
    handleExplandStatusListUser(state, { payload }: PayloadAction<updateStatusListUser>) {
      state.filterItemModalActionListUser = payload.connection;
    },

    handleFilterItemModal(state, { payload }: PayloadAction<updateFilterItemModal>) {
      const newList = state.filterItemModal;
      newList[payload.position] = payload.connection;
      state.filterItemModal = newList;
    },

    handleFilterItemModalActionListUser(state, { payload }: PayloadAction<updateFilterItemModalActionListUser>) {
      const newList = state.filterItemModalActionListUser;
      newList[payload.position] = payload.connection;
      state.filterItemModalActionListUser = newList;
    },

    handleExpland(state, { payload }: PayloadAction<updateSelectedPayload>) {
      let statusSelect = state.statusSelect;
      if(payload.connection === StatusCustomerType.Current) {
        statusSelect = StatusCustomerType.Current;
      } else if(payload.connection === StatusCustomerType.Select) {
        statusSelect = StatusCustomerType.Select;
      } else if(payload.connection === StatusCustomerType.Selected) {
        statusSelect = StatusCustomerType.Selected;
      }
      state.statusSelect = statusSelect;
    },

    handleStatusConfirm(state, { payload }: PayloadAction<statusConfirmPayload>) {
      let status = state.statusConfirm;
      if(payload.connection === StatusConfirmType.NoManipulation) {
        status = StatusConfirmType.NoManipulation;
      } else if(payload.connection === StatusConfirmType.DeleteCustomer) {
        status = StatusConfirmType.DeleteCustomer;
      } else if(payload.connection === StatusConfirmType.DeleteCustomerInList) {
        status = StatusConfirmType.DeleteCustomerInList;
      }else if(payload.connection === StatusConfirmType.DeleteList) {
        status = StatusConfirmType.DeleteList;
      }else if(payload.connection === StatusConfirmType.DeleteListFavourite) {
        status = StatusConfirmType.DeleteListFavourite;
      }
      state.statusConfirm = status;
    },
    
    handleIsModalVisibleConfirmDelete(state, { payload }: PayloadAction<isModalVisibleConfirmDelete>) {
      let statusVisibleConfirmDelete = state.isModalVisibleConfirmDelete;
      if(payload.connection === 0) {
        statusVisibleConfirmDelete = false;
      } else if(payload.connection === 1) {
        statusVisibleConfirmDelete = true;
      }
      state.isModalVisibleConfirmDelete = statusVisibleConfirmDelete;
    },

    handleIsModalVisibleActionMyList(state, { payload }: PayloadAction<StatusIsModalVisibleActionMyListPayload>) {
      let statusVisible = false;
      if(payload.isModalVisible) {
        statusVisible = true;
      }
      state.isModalVisibleActionMyList = statusVisible;
    },

    handleIsModalVisibleActionListUser(state, { payload }: PayloadAction<StatusIsModalVisibleActionListUserPayload>) {
      let statusVisible = false;
      if(payload.isModalVisible) {
        statusVisible = true;
      }
      state.isModalVisibleActionListUser = statusVisible;
    },

    handleIsDeleteConfirmDialog(state, { payload }: PayloadAction<StatusIsModalDeleteConfirmDialog>) {
      let statusVisible = false;
      if(payload.isModalVisible) {
        statusVisible = true;
      }
      state.isModalDeleteConfirmDialog = statusVisible;
    },

    handleIsVisibleSort(state, { payload }: PayloadAction<StatusIsModalSort>) {
      state.isModalSort = payload.isModalVisible;
    },

    handleSetStatusHideActionList(state) {
      state.statusShowActionList = false;
    },
    
    handleSetStatusShowActionList(state) {
      state.statusShowActionList = true;
    },

    handleSetStatusShowLastUpdatedDate(state, { payload }: PayloadAction<StatusLastUpdatedDatePayload>) {
      state.statusShowLastUpdatedDate = payload.status;
    },
    
    deleteCustomers(state, { payload }: PayloadAction<deleteCustomerOutOfListPayload>) {
      payload.listCustomerIds.map((itemId) => {
        var getIndexCustomerId = state.listCustomers.customers.findIndex(obj => obj.customerId === itemId);
        if (getIndexCustomerId > -1) {
          state.listCustomers.customers.splice(getIndexCustomerId, 1);
        }
      })
    },
    
    // actionEditMyList(state, { payload }: PayloadAction<EditMyListPayload>) {
    //   let defaultListMyListFilter = state.listMyListFilter;
    //   if(payload.listName != ""){
    //     defaultListMyListFilter.forEach((item) => {
    //       if(item.listId === payload.listId){
    //         item.listName = payload.listName;
    //       }
    //       return item;
    //     })
    //   }
    //   state.listMyListFilter = defaultListMyListFilter
    //   state.listMyList =  state.listMyListFilter;
    // },

    // actionCreateMyList(state, { payload }: PayloadAction<CreateMyListPayload>) {
    //   let defaultListMyListFilter = state.listMyListFilter;
    //   defaultListMyListFilter.push(payload.item);
    //   state.listMyList =  state.listMyListFilter;
    // },

    // actionRemoveFavouriteList(state, { payload }: PayloadAction<RemoveFavouriteListPayload>) {
    //   let defaultLisFavouriteFilter = state.listFavouriteFilter;
    //   const getIndexCustomerId = defaultLisFavouriteFilter.findIndex(obj => obj.listId === payload.listId);
    //   if (getIndexCustomerId > -1) {
    //     defaultLisFavouriteFilter.splice(getIndexCustomerId, 1);
    //   }
    //   state.listFavourite =  state.listFavouriteFilter;
    // },

    // actionAddToListFavourite(state, { payload }: PayloadAction<AddToListFavouritePayload>) {
    //   let defaultListFilter: Array<any> = [];
    //   if(payload.typeList === ListType.MyList) {
    //     defaultListFilter = state.listMyListFilter;
    //   } else if(payload.typeList === ListType.ShareList){
    //     defaultListFilter = state.listShareFilter;
    //   }

    //   defaultListFilter.forEach((item) =>{
    //     if(item.listId == payload.listId) {
    //       let itemFavouriteFilter = {
    //         "customerListType": payload.typeList,
    //         "extend": item.extend,
    //         "isAutoList": item.isAutoList,
    //         "listId": item.listId,
    //         "listName": item.listName,
    //         "participantType": item.participantType,
    //       };
    //       state.listFavouriteFilter.push(itemFavouriteFilter);
    //     }
    //   })
    //   state.listFavourite = state.listFavouriteFilter
    // },

    actionSetCustomerListType(state, { payload }: PayloadAction<SetCustomerListTypePayload>) {
      state.setValueCustomerList.listId = payload.listId;
      state.setValueCustomerList.typeList = payload.typeList;
      state.setValueCustomerList.isAutoList = payload.isAutoList;
      state.setValueCustomerList.status = payload.status;
      state.setValueCustomerList.listIdCustomer = payload.listIdCustomer;
      state.setValueCustomerList.statusScreen = payload.statusScreen;
      state.setValueCustomerList.selectedTargetType = payload.selectedTargetType;
      state.setValueCustomerList.listName = payload.listName
    },

    getSortTypeDataList(state, { payload }: PayloadAction<GetSortTypeDataListPayload>) {
      state.arraySortTypeData = payload.arraySortTypeData;
    },

    handleSelectedTypeSort(state, { payload }: PayloadAction<SetSelectSortModalPayload>) {
      let temp = state.arraySortTypeData[payload.position];
      state.arraySortTypeData.forEach((item) => {
        item.selected = false; 
        return item
      });
      temp.selected = true;
      state.arraySortTypeData[payload.position] = temp;
    },

    handleOptionAscOrDesc(state, { payload }: PayloadAction<SetOptionSortPayload>) {
      state.typeSort = payload.typeSort
    },
    
    handleSetIsShowMessage(state, { payload }: PayloadAction<SetIsShowMessagePayload>) {
      state.isMessage = payload.isMessage
    },

    setParamCustomers(state, { payload }: PayloadAction<GetCustomerParam>) {
      state.customerParam = payload;
      
    },

    handleSetShowMessageSuccess(state, { payload }: PayloadAction<GetMessage>) {
      console.log("handleSetShowMessageSuccess",payload);
      state.messageSuccess = payload
    },
  }
})

export const customerListActions = customerListSlice.actions;
export default customerListSlice.reducer;