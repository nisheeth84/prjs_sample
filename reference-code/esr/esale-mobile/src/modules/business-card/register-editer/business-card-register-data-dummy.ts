export const dataSuggestBusinessCardDepartmentDummy = {
  department: [
    {
      departmentId: 11111,
      departmentName: "示唆A",
    },
    {
      departmentId: 11112,
      departmentName: "示唆B",
    },
    {
      departmentId: 11113,
      departmentName: "示唆C",
    },
    {
      departmentId: 11114,
      departmentName: "示唆D",
    },
    {
      departmentId: 11115,
      departmentName: "示唆E",
    },
  ],
};

export const dataGetEmployeesSuggestionDummy = {
  data: {
    departments: [
      {
        departmentId: 123,
        departmentName: "name",
        parentDepartment: [
          {
            departmentId: 123,
            departmentName: "name",
          },
        ],
        employees: [
          {
            employeeId: 123,
            employeePhoto: {
              fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
              filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
            },
            employeeSurname: "SurnameA",
            employeeName: "nameA",
            employeeSurnameKana: "SurnameKanaA",
            employeeNameKana: "NameKanaA",
            employeePositonName: "PositonNameA",
          },
          {
            employeeId: 124,
            isBusy: true,
            employeePhoto: {
              fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
              filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
            },
            employeeSurname: "SurnameB",
            employeeName: "nameB",
            employeeSurnameKana: "SurnameKanaB",
            employeeNameKana: "NameKanaB",
            employeePositonName: "PositonNameB",
          },
        ],
      },
    ],
    employees: [
      {
        employeeId: 123,
        employeePhoto: {
          fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
          filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
        },
        employeeSurname: "SurnameA",
        employeeName: "nameA",
        employeeSurnameKana: "SurnameKanaA",
        employeeNameKana: "NameKanaA",
        employeePositonName: "PositonNameA",
      },
      {
        employeeId: 124,
        isBusy: true,
        employeePhoto: {
          fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
          filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
        },
        employeeSurname: "SurnameB",
        employeeName: "nameB",
        employeeSurnameKana: "SurnameKanaB",
        employeeNameKana: "NameKanaB",
        employeePositonName: "PositonNameB",
      },
    ],
    groups: [
      {
        groupId: 123,
        groupName: "name",
        employees: [
          {
            employeeId: 123,
            employeePhoto: {
              fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
              filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
            },
            employeeSurname: "Surname",
            employeeName: "name",
            employeeSurnameKana: "SurnameKana",
            employeeNameKana: "NameKana",
            employeePositonName: "PositonName",
          },
          {
            employeeId: 124,
            isBusy: true,
            employeePhoto: {
              fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
              filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
            },
            employeeSurname: "Surname",
            employeeName: "name",
            employeeSurnameKana: "SurnameKana",
            employeeNameKana: "NameKana",
            employeePositonName: "PositonName",
          },
        ],
      },
    ],
  },
};

export const dataGetBusinessCardDummy = {
  data: {
    fieldInfo: [
      {
        fieldId: 1,
        fieldName: "businessCardId",
      },
    ],
    businessCardDetail: {
      businessCardId: 1,
      customerName: "名1",
      businessCardImagePath: "/businessCards/",
      businessCardImageName: "businessCardImage",
      businessCardReceives: [
        {
          employeeId: 123,
          receiveDate: "2019/02/22 09:30:00",
          receivedLastContactDate: "2019/02/25 10:20:12",
          activityId: 1001,
          employeeSurname: "か",
          employeeName: "なな",
        },
        {
          employeeId: 124,
          receiveDate: "2019/02/12 09:30:00",
          receivedLastContactDate: "2019/02/15 10:20:12",
          activityId: 1002,
          employeeSurname: "か",
          employeeName: "なな",
        },
      ],
      hasActivity: 1,
      hasFollow: 1,
    },
    businessCardHistoryDetail: {
      customerId: 101,
      customerName: "名A",
      businessCardsReceivesHistories: [
        {
          employeeId: 123,
          receiveDate: "2019/02/22 09:30:00",
          receivedLastContactDate: "2019/02/25 10:20:12",
          activityId: 1005,
          employeeSurname: "か",
          employeeName: "なな",
          employeePhoto: {
            fileName: "https://www.w3schools.com/w3css/img_lights.jpg",
            filePath: "https://www.w3schools.com/w3css/img_lights.jpg",
          },
        },
      ],
      departmentName: "abc",
      position: "abc",
      firstName: "abc",
      lastName: "abc",
      zipCode: "abc",
      address: "abc",
      building: "abc",
      emailAddress: "abc",
      phoneNumber: "abc",
      mobilePhone: "abc",
      businessCardImagePath: "https://www.w3schools.com/w3css/img_lights.jpg",
      businessCardImageName: "https://www.w3schools.com/w3css/img_lights.jpg",
      isWorking: 1,
      memo: "abc",
    },
    timelines: {},
    tabsInfo: [],
    activityHistories: [],
    tradingProduct: {
      tradingProductBudges: 1,
      tradingProductData: [],
    },
    calendar: {
      calendarBudges: 2,
      calendarData: [],
    },
    histories: [],
  },
};

export const dataGetAddressesFromZipCodeDummy = {
  addressInfos: [
    {
      zipCode: "002-0851",
      prefectureName: "札幌市中央区",
      cityName: "Tokyo",
      areaName: "11A",
    },
    {
      zipCode: "002-0852",
      prefectureName: "札幌市中央区",
      cityName: "Tokyo",
      areaName: "11B",
    },
  ],
};

export const dataGetCustomerSuggestionDummy = {
  data: {
    customers: [
      {
        customerId: 123,
        customerName: "name",
        parentCustomerName: "parentCustomerName",
        address: "123",
      },
      {
        customerId: 124,
        customerName: "name2",
        parentCustomerName: "parentCustomerName2",
        address: "1234",
      },
    ],
  },
};
