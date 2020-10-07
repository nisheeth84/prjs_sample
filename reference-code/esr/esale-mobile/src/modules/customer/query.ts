export const queryListCustomers = (selectedTargetType: number, selectedTargetId: number, isUpdateListView: boolean, searchConditions: Array<any>, filterConditions : Array<any>, searchLocal:string, orderBy : Array<any>, offset: number, limit: number, extensionBelong: number) => {
  return {
    query: `{
      getCustomers(
      selectedTargetType: ${selectedTargetType},
      selectedTargetId: ${selectedTargetId},
      isUpdateListView: ${isUpdateListView},
      extensionBelong: ${extensionBelong},
      searchConditions: ${searchConditions},
      filterConditions: ${filterConditions},
      searchLocal:  ${searchLocal},
      orders: ${orderBy},
      offset: ${offset},
      limit: ${limit}) {
        totalRecords
        customers {
          customerId
          customerLogo {
            fileName
            filePath
          }
          customerName
          customerAliasName
          customerParent {
            pathTreeId
            pathTreeName
          }
          phoneNumber
          customerAddress {
            zipCode
            addressName
            buildingName
            address
          }
          business {
            businessMainId
            businessMainName
            businessSubId
            businessSubName
          }
          url
          memo
          customerData {
            fieldType
            key
            value
          }
          createdDate
          createdUser {
            employee_id
            employee_name
          }
          updatedDate
          updatedUser {
            employee_id
            employee_name
          }
          personInCharge {
            employeeId
            employeeName
          }
        }
      }
    }`
  };
}

export const queryMoveCustomersToOtherList = (sourceListId: number, destListId: number, customerIds: number[]) => {
  return {
    query: `{
      moveCustomersToOtherList(
        sourceListId: ${sourceListId},
        destListId: ${destListId},
        customerIds: ${customerIds}){
          customerListMemberIds {
            customerListMemberId
          }
        }
    }`
  };
}