import { PARAMS_0, PARAMS_1 } from "../../config/constants/constants";
import _ from "lodash";

/**
 * check is copy list
 * @param listFirst 
 * @param listSeconds 
 */
const checkIsCopyList = (listFirst: any, listSeconds: any) => {
  return (
    listFirst.listType === listSeconds.listType
    && listFirst.listMode === listSeconds.listMode
    && listFirst.ownerList === listSeconds.ownerList
    && listFirst.viewerList === listSeconds.viewerList
  )
}

/**
 * get new copy of list
 * @param listCopy 
 * @param arrList 
 */
export const getCopyList = (listCopy: any, arrList: any[]) => {

  if (!listCopy) {
    return
  }

  let copyNameFormat = "{0}のコピー（{1}）".replace(PARAMS_0, listCopy.listName);
  let arrCopy = arrList.filter((listItem: any) => {
    var myRe = new RegExp(`^${listCopy.listName}のコピー\\（\\d\\）$|^${listCopy.listName}のコピー\\(\\d\\)$`, "g")
    var myArray = myRe.exec(listItem.listName) || []
    return (myArray.length > 0 && checkIsCopyList(listCopy, listItem))
  }) || []

  let newList = _.cloneDeep(listCopy);
  newList.listName = copyNameFormat.replace(PARAMS_1, `${arrCopy.length + 1}`);

  return newList;
}

/**
 * check owner of list
 * @param list 
 * @param customerId 
 */
export const checkOwner = (ownerList: string, employeeId: number, isMyList: boolean) => {
  if (isMyList) {
    return true;
  }
  if (!ownerList || !employeeId) {
    return false;
  }
  const owner = JSON.parse(ownerList)?.employeeId || [];
  return owner.indexOf(employeeId) >= 0
}