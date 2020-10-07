export const getCustomFieldsInfo = {
  fields: [
    {
      fieldId: 1,
      fieldBelong: 2,
      lookupFieldId: 2,
      fieldName: "text1",
      // fieldLabel: "{\"ja_jp\": \"会議室A\",\ "en_us\": \"Conference room A\",\"zh_cn\": \"\"}",
      fieldType: 1,
      fieldOrder: 1,
      isDefault: true,
      maxLength: 255,
      modifyFlag: 1,
      availableFlag: 1,
      isDoubleColumn: true,
      ownPermissionLevel: 1,
      othersPermissionLevel: 1,
      defaultValue: "100",
      currencyUnit: "USD",
      typeUnit: 0,
      decimalPlace: 2,
      activityLinkedFieldId: 1,
      urlType: 1,
      urlTarget: "http://vnexpress.net",
      urlEncode: 1,
      urlText: "vnexpress.net",
      linkTarget: 1,
      configValue: "100",
      isLinkedGoogleMap: false,
      fieldGroup: 1,
      lookupData: {
        extensionBelong: 1,
        searchKey: 2,
        itemReflect: '{"1":"12", "2":"13"}',
      },
      relationData: {
        extensionBelong: 1,
        fieldId: 1,
        format: 2,
        displayTab: 1,
        displayFields: [1, 2, 3, 4],
      },
      tabData: [1, 2, 3, 4, 5],
      fieldItems: [
        {
          itemId: 1,
          isAvailable: false,
          itemOrder: "5",
          isDefault: false,
          // itemLabel: "{\"ja_jp\": \"サービス\",\ "en_us\": \"\",\"zh_cn\": \"\"}",
          differenceSetting: {
            isDisplay: true,
            backwardColor: "#999999",
            // backwardText: "{\"ja_jp\": \"サービス\",\ "en_us\": \"\",\"zh_cn\": \"\"}",
            forwardColor: "#CCCCCC",
            // forwardText: "{\"ja_jp\": \"サービス\",\ "en_us\": \"\",\"zh_cn\": \"\"}",
          },
        },
      ],
    },
  ],
};

export const DUMMY_DATA_GET_SCENARIO = {
  scenario: {
    milestones: [
      {
        milestoneId: 12,
        statusMilestoneId: 0,
        milestoneName: "マイルストーンA",
        finishDate: "2020/07/01",
        memo: "完了済みタスクが一件、未完了タスクが２件あります。",
        mode: "",
        isDone: true,
        employees: [
          {
            employeeId: 1001,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
          {
            employeeId: 1002,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
          },
          {
            employeeId: 1003,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
          },
          {
            employeeId: 1004,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
        ],
        tasks: [
          {
            taskId: 12,
            taskName: "タスクA",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 13,
            taskName: "タスクB",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 14,
            taskName: "タスクC",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
        ],
      },
      {
        milestoneId: 13,
        statusMilestoneId: 0,
        milestoneName: "マイルストーンB",
        finishDate: "2019/7/28",
        memo: "完了済みタスクが一件、未完了タスクが２件あります。",
        mode: "",
        isDone: false,
        employees: [
          {
            employeeId: 1001,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
          {
            employeeId: 1002,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
          },
          {
            employeeId: 1003,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
          },
          {
            employeeId: 1004,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
        ],
        tasks: [
          {
            taskId: 12,
            taskName: "タスクA",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 13,
            taskName: "タスクB",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 14,
            taskName: "タスクC",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
        ],
      },
      {
        milestoneId: 14,
        statusMilestoneId: 0,
        milestoneName: "マイルストーンC",
        finishDate: "2019/7/28",
        memo: "完了済みタスクが一件、未完了タスクが２件あります。",
        mode: "",
        isDone: false,
        employees: [
          {
            employeeId: 1001,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
          {
            employeeId: 1002,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
          },
          {
            employeeId: 1003,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
          },
          {
            employeeId: 1004,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
        ],
        tasks: [
          {
            taskId: 12,
            taskName: "タスクA",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 13,
            taskName: "タスクB",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 14,
            taskName: "タスクC",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
        ],
      },
      {
        milestoneId: 15,
        statusMilestoneId: 0,
        milestoneName: "マイルストーンD",
        finishDate: "2019/7/28",
        memo: "完了済みタスクが一件、未完了タスクが２件あります。",
        mode: "",
        isDone: false,
        employees: [
          {
            employeeId: 1001,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
          {
            employeeId: 1002,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
          },
          {
            employeeId: 1003,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
          },
          {
            employeeId: 1004,
            employeeName: "直樹タナカ",
            employeePosition: "営業部 – 部長",
            photoEmployeeImg:
              "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
          },
        ],
        tasks: [
          {
            taskId: 12,
            taskName: "タスクA",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 13,
            taskName: "タスクB",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
          {
            taskId: 14,
            taskName: "タスクC",
            memo:
              "契約書に署名する契約書に署名する契約書に署名する契約書に署名する契約書に署名する",
            mode: "",
            employees: [
              {
                employeeId: 1001,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
              {
                employeeId: 1002,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/564x/a7/60/77/a760777e18c583a3a14eb137c303eb89.jpg",
              },
              {
                employeeId: 1003,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://i.pinimg.com/736x/b8/50/71/b8507139a5d657f6b16381f4648a7fd3.jpg",
              },
              {
                employeeId: 1004,
                employeeName: "直樹タナカ",
                employeePosition: "営業部 – 部長",
                photoEmployeeImg:
                  "https://img.hoidap247.com/picture/user/20200316/tini_1584349455045.jpg",
              },
            ],
            startDate: "2020/01/01",
            finishDate: "2020/01/01",
            subtasks: [],
          },
        ],
      },
    ],
  },
};

export const DUMMY_DATA_GET_MASTER_SCENARIO_BUY_CAR = {
  scenarios: {
    scenarioName: "Buy car",
    milestones: [
      {
        milestoneName: "マイルストーンA",
      },
      {
        milestoneName: "マイルストーンB",
      },
      {
        milestoneName: "マイルストーンC",
      },
    ],
  },
};

export const DUMMY_DATA_GET_MASTER_SCENARIO_BUY_CANDY = {
  scenarios: {
    scenarioName: "Buy candy",
    milestones: [
      {
        milestoneName: "マイルストーンD",
      },
    ],
  },
};

export const DUMMY_DATA_GET_MASTER_SCENARIO_NO_DATA = {
  scenarios: {
    scenarioName: "Buy nothing",
    milestones: [],
  },
};

export const getCustomer = {
  fields: [
    {
      fieldId: 1,
      fieldName: "string",
      fieldType: 1,
      fieldOrder: 1,
      required: false,
      isDefault: true,
      isDoubleColumn: true,
      doubleColumnOption: 1,
      isAvailable: true,
      isModify: true,
      isMobileModify: true,
      imeType: 1,
      searchType: 2,
      searchOption: 3,
      ownPermissionLevel: 2,
      othersPermissionLevel: 2,
      urlTarget: "string",
      urlEncode: 1,
      urlText: "string",
      iframeHeight: "string",
      isLineNameDisplay: true,
      configValue: 1,
      decimalPlace: 1,
      labelJaJp: "string",
      labelEnUs: "string",
      labelZhCn: "string",
      fieldItems: [
        {
          itemId: 1,
          isAvailable: true,
          itemOrder: "string",
          isDefault: true,
          labelJaJp: "string",
          labelEnUs: "string",
          labelZhCn: "string",
        },
      ],
    },
  ],
  customer: {
    photoFileName: "string",
    photoFilePath: "string",
    parentId: 1,
    customerName: "顧客A",
    customerAliasName: "string",
    phoneNumber: 1,
    zipCode: 1,
    prefecture: "string",
    building: "string",
    address: "string",
    businessMainId: 1,
    businessMainName: "繊維工業",
    businessSubId: 1,
    url: "string",
    employeeId: 1,
    departmentId: "string",
    groupId: 1,
    memo: "string",
    customerData: {},
    productTradingData: [],
    nextSchedules: [],
    nextActions: [],
    checkbox1: {
      1: true,
      3: true,
    },
  },
  tabsInfo: [],
  dataTab: [],
  dataWatchs: {},
};
