export const queryGetCustomerList = (params: {
  mode?: number;
  isFavourite?: boolean;
}) => {
  return {
    query: `{
      getCustomerList(
        mode: ${JSON.stringify(params.mode)}
        isFavourite: ${JSON.stringify(params.isFavourite)}
      )
      {
        myList
        [
          {
            listId
            listName
            isAutoList
          }
        ]
        sharedList
        [
          {
            listId
            listName
            isAutoList
          }
        ]	
        favouriteList
        [
          {
            listId
            listName
            isAutoList
            customer_list_type
          }
        ]
      }
    }`,
  };
};

export const queryMoveCustomersToOtherList = (params: {
  sourceListId: number;
  destListId: number;
  customerIds: Array<number>;
}) => {
  return {
    query: `{
      getCustomerList(
        sourceListId: ${JSON.stringify(params.sourceListId)}
        destListId: ${JSON.stringify(params.destListId)}
        customerIds: ${JSON.stringify(params.customerIds)}
      )
      {
        customerListMemberIds
        [
          {
            customerListMemberId
          }
        ]
      }
    }`,
  };
};

export const queryGetMasterScenarios = () => {
  return {
    query: `{
      getMasterScenarios(
      )
      {
        scenarios
        [
          {
            scenarioId
            scenarioName
          }
        ]
      }
    }`,
  };
};

export const queryGetMasterScenario = (params: { scenarioId: number }) => {
  return {
    query: `{
      getScenario(
        scenarioId: ${JSON.stringify(params.scenarioId)}
      )
      {
        scenarios
        {
          scenarioName
          milestones
          [
            {
              milestoneName
            }
          ]
        }
      }
    }`,
  };
};

export const queryGetScenario = (params: {
  mode: string;
  customerId: number;
  isGetChildCustomer: boolean;
  childCustomerIds: Array<number>;
}) => {
  return {
    query: `{
      getCustomer(
        mode: ${JSON.stringify(params.mode)}         									
        customerId: ${JSON.stringify(params.customerId)}     									
        isGetChildCustomer: ${JSON.stringify(params.isGetChildCustomer)}							
        childCustomerIds:${JSON.stringify(params.childCustomerIds)}						
      
      )
      {
        {
          data
          {
            fields[]
            customer{}
          }
        }
      }
    }`,
  };
};

export const queryGetCustomer = (params: { customerId: number }) => {
  return {
    query: `{
      getScenario(
        customerId: ${JSON.stringify(params.customerId)}
      )
      {
        scenario
        {
          milestones
          [
            {
              
            }
          ]
        }
      }
    }`,
  };
};

export const queryCreateCustomer = (params: {
  customerRegistration: Array<{
    photoFileName: string;
    photoFilePath: string;
    parentId: number;
    customerName: string;
    customerAliasName: string;
    phoneNumber: string;
    zipCode: string;
    building: string;
    address: string;
    businessMainId: number;
    businessSubId: number;
    url: string;
    employeeId: number;
    departmentId: number;
    groupId: number;
    totalTradingAmount: string;
    memo: string;
    longitude: string;
    latitude: string;
    customerData: Array<{
      fieldType: number;
      key: string;
      value: string;
    }>;
  }>;
}) => {
  return {
    query: `{
        createCustomerList(
          businessCardList: ${params.customerRegistration}
        )
        {
          data
          {
            customerId        
          }
        }
      }`,
  };
};
