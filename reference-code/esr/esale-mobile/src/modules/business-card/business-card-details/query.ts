export const queryGetBusinessCard = (
  params: any = {
    businessCardId: null,
    isOnlyData: false,
    mode: "edit",
    hasTimeline: false,
    businessCardHistoryId: null,
  }
) => {
  return {
    query: `query{
        getBusinessCard(
            businessCardId: ${params.businessCardId},
            isOnlyData: ${params.isOnlyData},
            mode: ${params.mode},
            hasTimeline: ${params.hasTimeline},
            businessCardHistoryId: ${params.businessCardHistoryId}
        )
        {
            data{
                fieldInfo{
                    fieldId
                    fieldName
                    fieldLabel
                    fieldType
                    fieldOrder
                }
                tabInfo{
                    tabId
                    isDisplay
                    isDisplaySummary
                    maxRecord
                }
                businessCardDetail{
                    customerId
                    customerName
                    businessCardId
                    departmentName
                    position
                    firstName
                    lastName
                    alternativeCustomerName
                    firstNameKana
                    lastNameKana
                    businessCardImagePath
                    businessCardImageName
                    businessCardReceives{
                        receiveDate
                        receivedLastContactDate
                        activityId
                        employeeId
                        employeeSurname
                        employeeName
                    }
                    hasActivity
                    hasFollow
                    zipCode
                    prefecture
                    addressUnderPrefecture
                    building
                    address
                    emailAddress
                    phoneNumber
                    mobileNumber
                    lastContactDate
                    isWorking
                    memo
                }
                businessCardHistoryDetail{
                    customerId
                    customerName
                    businessCardId
                    departmentName
                    position
                    firstName
                    lastName
                    businessCardImagePath
                    businessCardImageName
                    businessCardsReceivesHistories{
                        receiveDate
                        receivedLastContactDate
                        activityId
                        employeeId
                        employeeSurname
                        employeeName
                        employeePhoto{
                            filePath
                            fileName
                        }
                    }
                }
                timelines
                activityHistories
                tradingProduct{
                    tradingProductBudges
                    tradingProductData
                }
                calendar{
                    calendarBudges
                    calendarData
                }
                histories
            }
        }
      }`,
  };
};

export const queryGetBusinessCardHistoryUpdate = (
  params: any = {
    businessCardId: null,
    offset: 1,
    limit: 30,
    orderBy: [],
  }
) => {
  let json = JSON.stringify(params.orderBy);
  json = json.replace(/"([^"]+)":/g, "$1:");
  return {
    query: `query{
        businessCardHistories(
            businessCardId: ${params.businessCardId},
            offset: ${params.offset},
            limit: ${params.limit},
            orderBy: ${json},
        )
        {
            businessCardHistories{
                businessCardHistoryId
                businessCardId
                updatedDate
                updatedUserName
                updatedUserPhotoName
                updatedUserPhotoPath
                contentChange
                mergedBusinessCards{
                    businessCardId
                    alternativeCustomerName
                    firstName
                    lastName
                    firstNameKana
                    lastNameKana
                    position
                    departmentName
                    zipCode
                    address
                    building
                    emailAddress
                    phoneNumber
                    mobileNumber
                    lastContactDate
                    isWorking
                    memo
                    fax
                    url
                }
            }
            fieldInfo{
                fieldId
                fieldName
                fieldLabel
                fieldType
                fieldOrder
            }
        }
      }`,
  };
};

export const queryDeleteBusinessCard = (
  params: any = {
    businessCards: [],
    processMode: 0, // 0, 1, 2
  }
) => {
  let json = JSON.stringify(params.businessCards);
  json = json.replace(/"([^"]+)":/g, "$1:");
  return {
    query: `mutation{
        deleteBusinessCards(
            businessCards: ${json},
            processMode: ${params.processMode}
        )
        {
            listOfBusinessCardId
            listOfCustomerId
            hasLastBusinessCard
            messageWarning   
        }
      }`,
  };
};

export const queryCreateFollowed = (
  params: any = {
    emloyeeId: null,
    followTargetType: null,
    followTargetId: null,
  }
) => {
  return {
    query: `mutation{
            createFollowed(
                emloyeeId: ${params.emloyeeId},
                followTargetType: ${params.followTargetType},
                followTargetId: ${params.followTargetId},
        )
        {
            timelineFollowed{
                timelineFollowedType
                timelineFollowedId
            }
        }
      }`,
  };
};

export const queryDeleteFollowed = (
  params: any = {
    employeeId: null,
    followeds: [], // followTargetType, followTargetId
  }
) => {
  let json = JSON.stringify(params.followeds);
  json = json.replace(/"([^"]+)":/g, "$1:");
  return {
    query: `mutation{
        deleteBusinessCards(
            employeeId: ${json},
            processFlg: ${params.updateFlg}
        )
        {
            followeds{
                followTargetType
                followTargetId
            }
        }
      }`,
  };
};
