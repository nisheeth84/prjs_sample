export const GET_SCHEDULE = () => {
  const dummyData = {
    addressBelowPrefectures: " Tokyo",
    buildingName: "D2T",
    businessCards: [
      {
        businessCardId: 1,
        businessCardName: "Business Card Name 1",
      },
    ],
    canModify: true,
    scheduleType: {
      scheduleTypeId: 2,
      scheduleTypeName: "来客",
    },
    customer: [
      {
        customerId: 1,
        parentCustomerName: "D2T",
        customerName: "DatVL",
        customerAddress: "Tokyo",
      },
      {
        customerId: 2,
        parentCustomerName: "D2T",
        customerName: "DuyBD",
        customerAddress: "Tokyo",
      },
      {
        customerId: 3,
        parentCustomerName: "D2T",
        customerName: "ThunDH",
        customerAddress: "Tokyo",
      },
    ],
    employeeLoginId: 2,
    equipmentTypeId: null,
    equipments: [
      {
        equipmentId: 1,
        equipmentName: "Equipment Name 1",
        startTime: "2020-01-02T03:05:00Z",
        endTime: "2020-03-02T03:05:00Z",
      },
    ],
    files: [
      {
        fileData: "",
        fileName: "sample.pdf",
      },
      {
        fileData: "",
        fileName: "fileExcel.xlsx",
      },
    ],
    finishDate: "2020-01-02T03:05:00Z",
    isAllAttended: true,
    isFullDay: false,
    isParticipant: true,
    isPublic: true,
    isRepeated: true,
    milestones: [
      {
        milestonesId: 1,
        milestoneName: "Milestone Name 1",
        startDate: "2020-01-01T02:00:00Z",
        endDate: "2020-01-01T05:00:00Z",
      },
    ],
    note: "Note",
    participants: {
      employees: [
        {
          employeeId: 1,
          employeeName: "DatVL",
          status: 1,
        },
        {
          employeeId: 2,
          employeeName: "DuyBD",
          status: 2,
        },
        {
          employeeId: 3,
          employeeName: "ThunDH",
          status: 0,
        },
      ],
      departments: [
        {
          departmentId: 1,
          departmentName: "DEV1",
        },
        {
          departmentId: 2,
          departmentName: "部署 B",
        },
        {
          departmentId: 3,
          departmentName: "部署 C",
        },
      ],
      groups: [
        {
          groupId: 1,
          groupName: "Group 1",
        },
      ],
    },
    prefecturesId: 1,
    prefecturesName: null,
    productTradings: [
      {
        productTradingId: 1,
        producTradingName: "Product 1",
        customerId: 1,
      },
      {
        productTradingId: 2,
        producTradingName: "Product 2",
        customerId: 2,
      },
      {
        productTradingId: 3,
        producTradingName: "Product 3",
        customerId: 3,
      },
    ],
    regularDayOfMonth: null,
    regularDayOfWeek: "0010000",
    regularEndOfMonth: false,
    regularWeekOfMonth: null,
    relatedCustomers: [
      {
        customerId: 1,
        customerName: "DatVL",
      },
      {
        customerId: 2,
        customerName: "DuyBD",
      },
      {
        customerId: 3,
        customerName: "DungHT",
      },
    ],
    repeatCycle: 0,
    repeatEndDate: "2020-01-06T22:00:00Z",
    repeatEndType: 1,
    repeatNumber: 0,
    repeatType: 0,
    scheduleHistories: CALENDAR_DETAIL(),
    scheduleId: 1500,
    scheduleName: "Schedule D2T ",
    sharers: {
      departments: [
        {
          departmentId: 1,
          departmentName: "DEV1",
        },
        {
          departmentId: 2,
          departmentName: "部署 B",
        },
        {
          departmentId: 3,
          departmentName: "部署 C",
        },
      ],
      employees: [
        {
          employeeId: 1,
          employeeName: "DatVL",
          status: 1,
        },
        {
          employeeId: 2,
          employeeName: "DuyBD",
          status: 2,
        },
        {
          employeeId: 3,
          employeeName: "ThunDH",
          status: 0,
        },
      ],
      groups: [],
    },
    startDate: "2020-01-01T02:00:00Z",
    tasks: [
      {
        taskId: 1,
        taskName: "Task 1",
        endDate: "2020-01-01T02:00:00Z",
      },
    ],
    updatedDate: "2020-05-14T19:58:32.760024Z",
    zipCode: "zip Code",
  };
  return dummyData;
};

export const CALENDAR_DETAIL = () => {
  const dummyData = [
    {
      contentChange: [
        { schedule_type: "abc > bcd" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC1",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 1,
    },
    {
      contentChange: [
        { schedule_type: "d2t > d2t pro" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC2",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 2,
    },
    {
      contentChange: [
        { schedule_type: "abc > bcd" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC3",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 3,
    },
    {
      contentChange: [
        { schedule_type: "abc > bcd" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC4",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 4,
    },
    {
      contentChange: [
        { schedule_type: "abc > bcd" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC5",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 4,
    },
    {
      contentChange: [
        { schedule_type: "abc > bcd" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC6",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 4,
    },
    {
      contentChange: [
        { schedule_type: "abc > bcd" },
        {
          schedule_name: [{ start_day: "123 > 4" }, { start_time: "a > b" }],
        },
      ],
      updatedUserImage: null,
      updatedUserName: "ABC6",
      updatedDate: "2020-05-14T19:58:32.760024Z",
      updatedUserId: 4,
    },
  ];
  return dummyData;
};
