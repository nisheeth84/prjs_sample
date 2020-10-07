import { ScheduleHistoriesType, Calendar } from "../api/get-schedule-type";
import {DepartmentsType} from "../api/get-local-navigation-type";

export const GET_SCHEDULE = () => {
    const dummyData: Calendar = {
        addressBelowPrefectures: " Tokyo",
        buildingName: "D2T",
        businessCards: [
            {
                businessCardId: 1,
                businessCardName: "Business Card Name 1",
            },
            // {
            //     businessCardId: 2,
            //     businessCardName: "Business Card Name 2",
            // },
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
                customerAddress: "Tokyo"
            },
            {
                customerId: 2,
                parentCustomerName: "D2T",
                customerName: "DuyBD",
                customerAddress: "Tokyo"
            },
            {
                customerId: 3,
                parentCustomerName: "D2T",
                customerName: "ThunDH",
                customerAddress: "Tokyo"
            }
        ],
        employeeLoginId: 2,
        equipmentTypeId: null,
        equipments: [
            {
                equipmentId: 1,
                equipmentName: "Equipment Name 1",
                startTime: "2020-01-02T03:05:00Z",
                endTime: "2020-03-02T03:05:00Z",
            }
        ],
        files: [
            {
                fileData: "",
                fileName: "sample.pdf",
            },
            {
                fileData: "",
                fileName: "fileExcel.xlsx",
            }
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
            }
        ],
        note: "Note",
        participants: {
            employees: [
                {
                    employeeId: 1,
                    employeeName: "DatVL",
                    status: 1
                },
                {
                    employeeId: 2,
                    employeeName: "DuyBD",
                    status: 2
                },
                {
                    employeeId: 3,
                    employeeName: "ThunDH",
                    status: 0
                }
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
                }
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
                }
            ],
            employees: [
                {
                    employeeId: 1,
                    employeeName: "DatVL",
                    status: 1
                },
                {
                    employeeId: 2,
                    employeeName: "DuyBD",
                    status: 2
                },
                {
                    employeeId: 3,
                    employeeName: "ThunDH",
                    status: 0
                }
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
        zipCode: "zip Code"
    }
    return dummyData;
}

export const CALENDAR_DETAIL = () => {
    const dummyData: ScheduleHistoriesType[] = [
        {
            contentChange: [
                { schedule_type: "abc > bcd" },
                {
                    schedule_name: [
                        { start_day: "123 > 4" },
                        { start_time: "a > b" },
                    ]
                }
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
                    schedule_name: [

                        { start_day: "123 > 4" },

                        { start_time: "a > b" },
                    ]
                }
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
                    schedule_name: [

                        { start_day: "123 > 4" },

                        { start_time: "a > b" },
                    ]
                }
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
                    schedule_name: [

                        { start_day: "123 > 4" },

                        { start_time: "a > b" },
                    ]
                }
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
                    schedule_name: [

                        { start_day: "123 > 4" },

                        { start_time: "a > b" },
                    ]
                }
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
                    schedule_name: [

                        { start_day: "123 > 4" },
                        { start_time: "a > b" },
                    ]
                }
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
                    schedule_name: [
                        { start_day: "123 > 4" },
                        { start_time: "a > b" },
                    ]
                }
            ],
            updatedUserImage: null,
            updatedUserName: "ABC6",
            updatedDate: "2020-05-14T19:58:32.760024Z",
            updatedUserId: 4,
        }
    ]
    return dummyData;
};

/**
/**
 * dummy data
 */
export const DUMMY_DATA_GLOBAL = {
  getDataForCalendarByList: {
    dateFromData: "2020-05-13T13:05:00Z",
    dateToData: "2020-06-15T16:06:00Z",
    isGetMoreData: true,
    itemList: [
      {
        itemType: 3,
        itemId: 753,
        itemName: "DungBQ In hour 7",
        employeeIds: [],
        startDate: "2020-05-13T13:05:00Z",
        finishDate: "2020-06-15T16:06:00Z",
        updatedDate: "2020-05-19T04:20:55.044998Z",
        itemIcon: null,
        isFullDay: false,
        isOverDay: true,
        isRepeat: false,
        scheduleRepeatId: null,
        scheduleTypeId: 1,
        isPublic: true,
        isReportActivity: null,
        isParticipantUser: null,
        milestoneStatus: null,
        taskStatus: null,
        participationDivision: null,
        attendanceDivision: null,
        isDuplicate: null,
        customers: [
          {
            customerId: 1,
            customerName: 'customer 1'
          },
          {
            customerId: 2,
            customerName: 'customer 2'
          }
        ],
        productTradings: [
          {
            productTradingId: 1,
            productName: 'product 1'
          },
          {
            productTradingId: 2,
            productName: 'product 2'
          }
        ],
        businessCards: [
          {
            businessCardId: 1,
            businessCardName: 'businessCardName 1'
          },
          {
            businessCardId: 2,
            businessCardName: 'businessCardName 2'
          }
        ],
        address: '133-101 E 34th St, New York, NY 10016'
      },
      {
        itemType: 3,
        itemId: 1545,
        itemName: "Datvl",
        employeeIds: [],
        startDate: "2020-06-10T02:06:00Z",
        finishDate: "2020-06-10T02:06:00Z",
        updatedDate: "2020-06-09T02:46:16.491584Z",
        itemIcon: null,
        isFullDay: true,
        isOverDay: false,
        isRepeat: true,
        scheduleRepeatId: 99,
        scheduleTypeId: 1,
        isPublic: true,
        isReportActivity: null,
        isParticipantUser: null,
        milestoneStatus: null,
        taskStatus: null,
        participationDivision: null,
        attendanceDivision: null,
        isDuplicate: null,
        customers: [
          {
            customerId: 3,
            customerName: 'customer 3'
          },
          {
            customerId: 4,
            customerName: 'customer 4'
          }
        ],
        productTradings: [
          {
            productTradingId: 3,
            productName: 'product 3'
          },
          {
            productTradingId: 4,
            productName: 'product 4'
          }
        ],
        businessCards: [],
        address: null
      },
      {
        itemType: 3,
        itemId: 588,
        itemName: "create duybd start ",
        employeeIds: [],
        startDate: "2020-06-10T07:05:00Z",
        finishDate: "2020-06-10T07:05:00Z",
        updatedDate: "2020-05-16T07:00:09.922491Z",
        itemIcon: null,
        isFullDay: false,
        isOverDay: false,
        isRepeat: true,
        scheduleRepeatId: 52,
        scheduleTypeId: 2,
        isPublic: false,
        isReportActivity: null,
        isParticipantUser: null,
        milestoneStatus: null,
        taskStatus: null,
        participationDivision: null,
        attendanceDivision: null,
        isDuplicate: null,
        customers: [],
        productTradings: [],
        businessCards: [],
        address: null
      },
      {
        itemType: 3,
        itemId: 394,
        itemName: "Daniel Test",
        employeeIds: [],
        startDate: "2020-06-10T17:00:00Z",
        finishDate: "2020-06-10T17:00:00Z",
        updatedDate: "2020-05-11T17:45:12.814896Z",
        itemIcon: null,
        isFullDay: false,
        isOverDay: false,
        isRepeat: true,
        scheduleRepeatId: 47,
        scheduleTypeId: 1,
        isPublic: null,
        isReportActivity: null,
        isParticipantUser: null,
        milestoneStatus: null,
        taskStatus: null,
        participationDivision: null,
        attendanceDivision: null,
        isDuplicate: null,
        customers: [],
        productTradings: [],
        businessCards: [],
        address: null
      },
      {
        itemType: 3,
        itemId: 1546,
        itemName: "Datvl",
        employeeIds: [],
        startDate: "2020-06-11T02:06:00Z",
        finishDate: "2020-06-11T02:06:00Z",
        updatedDate: "2020-06-09T02:46:16.494106Z",
        itemIcon: null,
        isFullDay: true,
        isOverDay: false,
        isRepeat: true,
        scheduleRepeatId: 99,
        scheduleTypeId: 1,
        isPublic: true,
        isReportActivity: null,
        isParticipantUser: null,
        milestoneStatus: null,
        taskStatus: null,
        participationDivision: null,
        attendanceDivision: null,
        isDuplicate: null,
        customers: [],
        productTradings: [],
        businessCards: [],
        address: null
      },
      {
        itemType: 3,
        itemId: 589,
        itemName: "create duybd start ",
        employeeIds: [],
        startDate: "2020-06-11T07:05:00Z",
        finishDate: "2020-06-11T07:05:00Z",
        updatedDate: "2020-05-16T07:00:09.925825Z",
        itemIcon: null,
        isFullDay: false,
        isOverDay: false,
        isRepeat: true,
        scheduleRepeatId: 52,
        scheduleTypeId: 2,
        isPublic: false,
        isReportActivity: null,
        isParticipantUser: null,
        milestoneStatus: null,
        taskStatus: null,
        participationDivision: null,
        attendanceDivision: null,
        isDuplicate: null,
        customers: [],
        productTradings: [],
        businessCards: [],
        address: null
      }
    ],
    countSchedule: 6
  }
}

/**
 * Dummy department
 */
const DUMMY_DEPARTMENTS: Array<DepartmentsType> = [
  {
    "departmentId": 1,
    "departmentName": "DEV1",
    "isSelected": 1,
    "employees": [
      {
        employeeId: 1,
        employeeName: 'employeeName 1',
        isSelected: 1
      },
      {
        employeeId: 2,
        employeeName: 'employeeName 2',
        isSelected: 1
      },
      {
        employeeId: 3,
        employeeName: 'employeeName 3',
        isSelected: 0
      },
      {
        employeeId: 4,
        employeeName: 'employeeName 4',
        isSelected: 1
      }
    ]
  },
  {
    "departmentId": 3,
    "departmentName": "部署 C",
    "isSelected": 1,
    "employees": [
      {
        employeeId: 5,
        employeeName: 'employeeName 5',
        isSelected: 0
      },
      {
        employeeId: 6,
        employeeName: 'employeeName 6',
        isSelected: 1
      },
      {
        employeeId: 7,
        employeeName: 'employeeName 7',
        isSelected: 0
      },
      {
        employeeId: 8,
        employeeName: 'employeeName 8',
        isSelected: 0
      }
    ]
  },
  {
    "departmentId": 2,
    "departmentName": "部署 B",
    "isSelected": 0,
    "employees": [
      {
        employeeId: 9,
        employeeName: 'employeeName 9',
        isSelected: 0
      },
      {
        employeeId: 9,
        employeeName: 'employeeName 9',
        isSelected: 0
      },
      {
        employeeId: 10,
        employeeName: 'employeeName 10',
        isSelected: 1
      },
      {
        employeeId: 11,
        employeeName: 'employeeName 11',
        isSelected: 0
      }
    ]
  },
  {
    "departmentId": 10,
    "departmentName": "部署 C-2",
    "isSelected": 0,
    "employees": []
  },
  {
    "departmentId": 15,
    "departmentName": "部署 G",
    "isSelected": 0,
    "employees": []
  }
]
/**
 * Dummy Data
 */
export const DUMMY_DATA_LOCAL_NAVIGATION = {
  searchStatic: {
    isAllTime: 1,
    isDesignation: 0,
    startDate: "null",
    endDate: "null",
    viewTab: null,
    task: null,
    milestone: null,
    isAttended: null,
    isAbsence: null,
    isUnconfirmed: null,
    isShared: null
  },
  searchDynamic: {
    customersFavourite: [
      {
        listId: 1,
        listName: "DummyCustomer1",
        isSelected: 0
      },
      {
        listId: 2,
        listName: "DummyCustomer2",
        isSelected: 0
      }
    ],
    departments: DUMMY_DEPARTMENTS,
    groups: [
      {
        groupId: 275,
        groupName: "ESR_todo1",
        isSelected: 0,
        employees: [
          {
            employeeId: 15,
            employeeName: 'employeeName 51',
            isSelected: 0
          },
          {
            employeeId: 61,
            employeeName: 'employeeName 61',
            isSelected: 1
          },
          {
            employeeId: 71,
            employeeName: 'employeeName 71',
            isSelected: 0
          },
          {
            employeeId: 81,
            employeeName: 'employeeName 81',
            isSelected: 0
          }
        ]
      },
      {
        groupId: 441,
        groupName: "123",
        isSelected: 0,
        employees: [
          {
            employeeId: 55,
            employeeName: 'employeeName 55',
            isSelected: 0
          },
          {
            employeeId: 65,
            employeeName: 'employeeName 65',
            isSelected: 1
          },
          {
            employeeId: 75,
            employeeName: 'employeeName 75',
            isSelected: 0
          },
          {
            employeeId: 85,
            employeeName: 'employeeName 85',
            isSelected: 0
          }
        ]
      }
    ],
    scheduleTypes: [
      {
        scheduleTypeId: 1,
        scheduleTypeName: "DummySchedule 1",
        isSelected: 0
      },
      {
        scheduleTypeId: 2,
        scheduleTypeName: "DummySchedule 2",
        isSelected: 0
      }
    ],
    equipmentTypes: [
      {
        equipmentTypeId: 1,
        equipmentTypeName: "Dummy equipment 1",
        isSelected: 0
      },
      {
        equipmentTypeId: 2,
        equipmentTypeName: "Dummy equipment 2",
        isSelected: 0
      }
    ]
  }
}