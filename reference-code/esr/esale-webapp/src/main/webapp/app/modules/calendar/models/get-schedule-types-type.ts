/**
 * interface of schedule type
 */
import { DepartmentsType, EquipmentTypesType } from 'app/modules/calendar/models/get-local-navigation-type';

export type IScheduleTypes = {
  scheduleTypeId?: number;
  scheduleTypeName?: any;
  iconType?: number;
  iconName?: string;
  iconPath?: string;
  isAvailable?: true;
  displayOrder?: number;
};

/**
 * Dummy department
 */
const DUMMY_DEPARTMENTS: Array<DepartmentsType> = [
  {
    departmentId: 1,
    departmentName: 'DEV1',
    isSelected: 1,
    employees: [
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
    departmentId: 3,
    departmentName: '部署 C',
    isSelected: 1,
    employees: [
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
    departmentId: 2,
    departmentName: '部署 B',
    isSelected: 0,
    employees: [
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
    departmentId: 10,
    departmentName: '部署 C-2',
    isSelected: 0,
    employees: []
  },
  {
    departmentId: 15,
    departmentName: '部署 G',
    isSelected: 0,
    employees: []
  }
];
/**
 * Dummy Data
 */
export const DUMMY_DATA_LOCAL_NAVIGATION = {
  searchStatic: {
    isAllTime: 1,
    isDesignation: 0,
    startDate: 'null',
    endDate: 'null',
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
        listName: 'DummyCustomer1',
        isSelected: 0
      },
      {
        listId: 2,
        listName: 'DummyCustomer2',
        isSelected: 0
      }
    ],
    departments: DUMMY_DEPARTMENTS,
    groups: [
      {
        groupId: 275,
        groupName: 'ESR_todo1',
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
        groupName: '123',
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
        scheduleTypeName: 'DummySchedule 1',
        isSelected: 0
      },
      {
        scheduleTypeId: 2,
        scheduleTypeName: 'DummySchedule 2',
        isSelected: 0
      }
    ],
    equipmentTypes: [
      {
        equipmentTypeId: 1,
        equipmentTypeName: 'Dummy equipment 1',
        isSelected: 0
      },
      {
        equipmentTypeId: 2,
        equipmentTypeName: 'Dummy equipment 2',
        isSelected: 0
      }
    ]
  }
};

/**
 * Dummy data when input text in form (not description api)
 */
export const DUMMY_EQUIPMENT_TYPES: Array<EquipmentTypesType> = [
  {
    equipmentTypeId: 1,
    equipmentTypeName: 'Dummy equipment Type Name1',
    isSelected: 0
  },
  {
    equipmentTypeId: 2,
    equipmentTypeName: 'Dummy equipment Type Name2',
    isSelected: 0
  },
  {
    equipmentTypeId: 3,
    equipmentTypeName: 'Dummy equipment 3',
    isSelected: 0
  },
  {
    equipmentTypeId: 4,
    equipmentTypeName: 'Dummy equipment 4',
    isSelected: 1
  },
  {
    equipmentTypeId: 5,
    equipmentTypeName: 'Dummy equipment 5',
    isSelected: 0
  },
  {
    equipmentTypeId: 6,
    equipmentTypeName: 'Dummy equipment 6',
    isSelected: 1
  }
];

/**
 * dummy suggest when input data from form
 */
export const DUMMY_GET_SCHEDULE_TYPES: Array<IScheduleTypes> = [
  {
    scheduleTypeId: 1,
    scheduleTypeName: '{"ja_jp": "DummySchedule 1","en_us": "Out of office","zh_cn": "外出"}',
    iconType: 1,
    iconName: 'ic-calendar-user1',
    iconPath: '../../../../content/images/common/calendar/ic-calendar-user1.svg',
    isAvailable: true,
    displayOrder: 1
  },
  {
    scheduleTypeId: 2,
    scheduleTypeName: '{"ja_jp": "DummySchedule 2","en_us": "Visitor","zh_cn": "来客"}',
    iconType: 1,
    iconName: 'ic-calendar-phone',
    iconPath: '../../../../content/images/common/calendar/ic-calendar-phone.svg',
    isAvailable: true,
    displayOrder: 2
  },
  {
    scheduleTypeId: 3,
    scheduleTypeName: '{"ja_jp": "DummySchedule 3","en_us": "Visitor","zh_cn": "来客"}',
    iconType: 1,
    iconName: 'ic-calendar-phone',
    iconPath: '../../../../content/images/common/calendar/ic-calendar-phone.svg',
    isAvailable: true,
    displayOrder: 3
  },
  {
    scheduleTypeId: 4,
    scheduleTypeName: '{"ja_jp": "DummySchedule 4","en_us": "Visitor","zh_cn": "来客"}',
    iconType: 1,
    iconName: 'ic-calendar-phone',
    iconPath: '../../../../content/images/common/calendar/ic-calendar-phone.svg',
    isAvailable: true,
    displayOrder: 4
  }
];
