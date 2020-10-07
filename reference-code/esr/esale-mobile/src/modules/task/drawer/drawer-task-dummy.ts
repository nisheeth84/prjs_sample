export const DUMMY_LOCAL_MENU = {
  data: {
    data: {
      getLocalNavigation: {
        searchStatic: {
          isAllTime: 1,
          isDesignation: 0,
        },
        searchDynamic: {
          customersFavourite: [
            {
              listId: 1,
              listName: 'お気に入りリストA',
              isSelected: 0,
            },
            {
              listId: 2,
              listName: 'お気に入りリストB',
              isSelected: 1,
            },
          ],
          departments: [
            {
              departmentId: 1,
              departmentName: '部署A',
              isSelected: 1,
              employees: [
                {
                  employeeId: 1,
                  employeeName: 'TaiTD',
                  isSelected: 1,
                },
                {
                  employeeId: 2,
                  employeeName: 'HuyenDT',
                  isSelected: 0,
                },
              ],
            },
            {
              departmentId: 2,
              departmentName: '部署B',
              isSelected: 1,
              employees: [
                {
                  employeeId: 1,
                  employeeName: 'TaiTD',
                  isSelected: 0,
                },
                {
                  employeeId: 2,
                  employeeName: 'HuyenDT',
                  isSelected: 0,
                },
              ],
            },
          ],
          groups: [
            {
              groupId: 1,
              groupName: 'グループA',
              isSelected: 0,
              employees: [{
                color: null,
                departmentId: null,
                employeeId: 10002,
                employeeName: "Giang",
                employeeSurname: "Team",
                groupId: 1,
                isSelected: 0,
              }]
            },
            {
              groupId: 2,
              groupName: 'グループB',
              isSelected: 0,
              employees: [{
                color: null,
                departmentId: null,
                employeeId: 10002,
                employeeName: "Giang",
                employeeSurname: "Team",
                groupId: 1,
                isSelected: 0,
              }]
            },
          ],
          scheduleTypes: [
            {
              scheduleTypeId: 1,
              scheduleTypeName: "DummySchedule Type Name1",
              isSelected: 0,
            },
            {
              scheduleTypeId: 2,
              scheduleTypeName: "DummySchedule Type Name2",
              isSelected: 0,
            },
          ],
          equipmentTypes: [
            {
              equipmentTypeId: 1,
              equipmentTypeName: "Dummy equipment Type Name1",
              isSelected: 0,
            },
            {
              equipmentTypeId: 2,
              equipmentTypeName: "Dummy equipment Type Name2",
              isSelected: 0,
            },
          ],
        },
      },
    },
  },
};
