export const queryChildCustomerInfo = (customerId: number) => {
  return {
    query: `{
      getChildCustomers(customerId: ${customerId}) {
        childCustomers
          customerId
          customerName
          level
      }
    }`
  }
}
/**
 * query graphql get customer detail
 * @param customerId number
 */
export const queryCustomerBasicInfo = (customerId: number, childCustomerIds: Array<any>) =>{
  return {
    query: `{
      getCustomer(mode: "detail",
      customerId: ${customerId},
      childCustomerIds: ${childCustomerIds},
      isGetDataOfEmployee: false,
      hasTimeline: true) {
        customer {
          customerId
          photo {
            photoFileName
            photoFilePath
          }
          parentName
          parentId
          customerName
          businessMainName
          businessSubName
        }
        tabsInfo {
          data {
            tabId
            tabLabel
            isDisplay
          }
        }
        dataTab {
          ${responseQueryActivityHistory}
        }
        dataWatchs
        dataTimelines
  
      }
    }`,
  };
}
 
const responseQueryActivityHistory = `
dataTab {
  activities {
    activityId
    isDraft
    contactDate
    activityStartTime
    activityEndTime
    activityDuration
    employee {
      employeeName
      employeeId
      employeePhoto
    }
    businessCards {
      businessCardId
      firstName
      lastName
      firstNameKana
      lastNameKana
      position
      departmentName
    }
    interviewer
    customer {
      customerId
      customerName
    }
    productTradings {
      productId
      productName
      quantity
      price
      amount
      productTradingProgressId
      productTradingProgressName			
      endPlanDate			
      orderPlanDate			
      employeeId			
      employeeName			
      memo			
    }
    customers {
      customerId
      customerName
    }
    memo
    createdUser {
      createdDate
      createdUserName
      createdUserId
    }
    updatedUser {
      updatedDate			
      updatedUserName			
      updatedUserId			
    }
  }
}`

/**
 * Query delete customer
 * @param customerList Array<number>
 */
export const queryDeleteCustomer = (customerList: Array<number>) => {
  return {
    query: `{
      customerIds: ${customerList}
    }`
  }
}

/**
 * Query create follow customer
 * 
 * @param employeeId number
 * @param targetType number
 * @param targetId number
 */
export const queryCreateFollow = (employeeId: number, targetType: number, targetId: number) => {
  return {
    query: `{
      createFollowed(employeeId: ${employeeId},
      followTargetType: ${targetType},
      followTargetId: ${targetId}) {
        timelineFollowed {
          timelineFollowedType,
          timelineFollowedId
        }
      }
    }`
  }
}

/**
 * Query delete followed customer
 * 
 * @param employeeId number
 * @param followeds Array<Followed>
 */
export const queryDeleteFollowed = (employeeId: number, followeds: Array<any>) => {
  return {
    query: `{
      deleteFollowed(employeeId: ${employeeId},
      followeds: ${followeds}) {
        followeds {
          timelineFollowedType,
          timelineFollowedId
        }
      }
    }`
  }
}

export const queryGetChangeHistoryList = (customerId: number, tabId: number, currentPage: number, limit: number) => {
  return {
    query: `
    {
      getCustomer(mode: "detail",
      customerId: ${customerId},
      tabId: ${tabId}
      isGetDataOfEmployee: false,
      tabFilter: {
        currentPage: ${currentPage},
        limit: ${limit}
      }
      hasTimeline: false) {
        dataTab ${responseQueryChangeHistory}
      }
    }`
  }
}

export const queryDeleteActivity = (activitysId: number[], isDraft: boolean) => {
  return {
    query: `{
      deleteActivities(
        activityIds: ${activitysId},
        isDraft: ${isDraft}) {
          activityIds
        }
    }`
  };
}

export const queryGetActivities = (
  listBusinessCardId: Array<any>, 
  listCustomerId: Array<any>, 
  listProductTradingId: Array<any>,
  productName: string,
  searchLocal: string,
  searchConditions: any,
  filterConditions: Array<any>,
  isFirstLoad: boolean,
  selectedTargetType: number,
  selectedTargetId: number,
  orderBy: Array<any>,
  offset: number,
  limit: number,
  hasTimeline: boolean,
  ) => {
  return {
    query: `{
      getActivities(
        listBusinessCardId: ${listBusinessCardId},
        listCustomerId: ${listCustomerId},
        listProductTradingId: ${listProductTradingId},
        productName: ${productName},
        searchLocal: ${searchLocal},
        searchConditions: ${searchConditions},
        filterConditions: ${filterConditions},
        isFirstLoad: ${isFirstLoad},
        selectedTargetType: ${selectedTargetType},
        selectedTargetId: ${selectedTargetId},
        orderBy: ${orderBy},
        offset: ${offset},
        limit: ${limit},
        hasTimeline: ${hasTimeline}) {
          dataInfo {
            activities {
              activityId
              isDraft
              contactDate
              activityStartTime
              activityEndTime
              activityDuration
              employee {
                employeeName
                employeeSurname
                employeeId
                employeePhoto {
                  filePath
                  fileName
                }
              }
              businessCards {
                businessCardId
                firstName
                lastName
                firstNameKana
                lastNameKana
                position
                departmentName
              }
              interviewer
              customer {
                customerId
                customerName
              }
              productTradings {
                productTradingId
                productId
                productName
                quantity
                price
                amount
                productTradingProgressId
                productTradingProgressName
                endPlanDate
                orderPlanDate
                employee {
                  employeeName
                  employeeSurname
                  employeeId
                  employeePhoto {
                    filePath
                    fileName
                  }
                }
                memo
              }
              customers {
                customerId
                customerName
              }
              memo
              createdUser {
                createdDate
                employeeId
                employeeName
                employeeSurname
                employeePhoto {
                  filePath
                  fileName
                }
              }
              updatedUser {
                updatedDate
                employeeId
                employeeName
                employeeSurname
                employeePhoto {
                  filePath
                  fileName
                }
              }
              extTimeline
              task {
                taskId
                taskName
              }
              schedule {
                scheduleId
                scheduleName
              }
              milestone {
                milestoneId
                milestoneName
              }
              nextSchedule {
                nextScheduleDate
                nextScheduleId
                nextScheduleName
                iconPath
                customerName
                productTradings {
                  producTradingName
                }
              }
            }
            initializeInfo
            total
          }
        }
    }`
  };
}

const responseQueryChangeHistory = `{
  
}`

export const queryGetNetworkMapBusinessCards = (customerId: number) => {
  return {
    query: `{
      initializeNetworkMap(customerId: ${customerId}) {
        companyId
      }
    }`
  }
}

export const queryDeleteNetworkStand = (networkStandId: number) => {
  return {
    query: `{
      deleteNetworkStand(networkStandId: ${networkStandId}) {
        networkStandId
      }
    }`
  }
}

export const queryUpdateNetworkStand = (networkStandId: number, standId?: number, motivationId?: number, tradingProductIds?: number, comment?: string) => {
  return {
    query: `{
      updateNetworkStand(networkStandId: ${networkStandId},
        standId: ${standId},
        motivationId: ${motivationId},
        tradingProductIds: ${tradingProductIds},
        comment: ${comment}) {
        networkStandId
      }
    }`
  }
}

export const queryCreateNetworkStand = (
  businessCardCompanyId: number,
  businessCardDepartmentId: number,
  businessCardId: number,
  standId?: number,
  motivationId?: number,
  tradingProductIds?: number,
  comment?: string) => {
  return {
    query: `{
      addNetworkStand(businessCardId: ${businessCardId},
        businessCardCompanyId: ${businessCardCompanyId},
        businessCardDepartmentId: ${businessCardDepartmentId},
        standId: ${standId},
        motivationId: ${motivationId},
        tradingProductIds: ${tradingProductIds},
        comment: ${comment}) {
        networkStandId
      }
    }`
  }
}