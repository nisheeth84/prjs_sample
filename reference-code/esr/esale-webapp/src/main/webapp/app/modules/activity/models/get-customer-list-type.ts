/**
 * Define data structure for API getCustomerList
 **/
import { ActivityFormSeach } from '../models/get-activities-type';
import { CommonUtil } from '../common/common-util';

export type FavouriteListType = {
  listId?: any;
  listName?: string;
  isAutoList?: any;
  customer_list_type?: any;
};
type SharedListType = {
  listId?: any;
  listName?: any;
  isAutoList?: any;
};
type MyListType = {
  listId?: any;
  listName?: any;
  isAutoList?: any;
};
export type GetCustomerList = {
  myList?: MyListType[];
  favouriteList?: FavouriteListType[];
  sharedList?: SharedListType[];
};
