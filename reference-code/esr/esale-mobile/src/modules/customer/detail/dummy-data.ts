export const dummyTabInfoJSON = `[
  {
    "tabId": 0,
    "tabLabel": "Info Basic",
    "isDisplay": true
  },
  {
    "tabId": 2,
    "tabLabel": "Change History",
    "isDisplay": true
  },
  {
    "tabId": 1,
    "tabLabel": "Trading Product",
    "isDisplay": true
  },
  {
    "tabId": 13,
    "tabLabel": "Schedule",
    "isDisplay": true
  },
  {
    "tabId": 11,
    "tabLabel": "Network map",
    "isDisplay": true
  },
  {
    "tabId": 5,
    "tabLabel": "Task",
    "isDisplay": true
  },
  {
    "tabId": 10,
    "tabLabel": "活動履歴",
    "isDisplay": true
  }
]`;

export const dummyListActivities = `[
  {
    "activityId": 1,
    "isDraft": false,
    "contactDate": "2019/07/05",
    "activityStartTime": "2019/07/05 12:00",
    "activityEndTime": "2019/07/05 13:00",
    "activityDuration": 50,
    "employee": {
      "employeeName": "Kenvin NAME",
      "employeeSurname": "David Surname",
      "employeeId": 1,
      "employeePhoto": {
        "filePath": "http://placehold.jp/50x50.png",
        "fileName": "avatar 1"
      }
    },
    "businessCards": [
      {
        "businessCardId": 1,
        "firstName": "直樹1 F",
        "lastName": "直樹1 L",
        "firstNameKana": "タナカ",
        "lastNameKana": "タナカ",
        "position": "",
        "departmentName": "直樹"
      },
      {
        "businessCardId": 2,
        "firstName": "直樹2",
        "lastName": "直樹2",
        "firstNameKana": "タナカ2",
        "lastNameKana": "タナカ2",
        "position": "",
        "departmentName": "直樹2"
      }
    ],
    "interviewer": [
      "interviewerName1",
      "interviewerName2"
    ],
    "customer": {
      "customerId": 1,
      "customerName": "Customer name"
    },
    "productTradings": [
      {
        "productTradingId": 1,
        "productId": 1,
        "productName": "商品A",
        "quantity": 3,
        "price": 20,
        "amount": 40,
        "productTradingProgressId": 1,
        "productTradingProgressName": "進捗名A",
        "endPlanDate": "2019/09/05",
        "orderPlanDate": "2019/08/05",
        "employee": {
          "employeeId": 2,
          "employeeName": "Kenvin NAME 2",
          "employeeSurname": "David Surname 2",
          "employeePhoto": {
            "filePath": "http://placehold.jp/30x30.png",
            "fileName": "avatar 1"
          }
        },
        "memo": "Memo 1"
      },
      {
        "productTradingId": 2,
        "productId": 2,
        "productName": "商品B",
        "quantity": 20,
        "price": 20,
        "amount": 20,
        "productTradingProgressId": 2,
        "productTradingProgressName": "進捗名B",
        "endPlanDate": "2019/07/05",
        "orderPlanDate": "2019/07/05",
        "employee": {
          "employeeId": 3,
          "employeeName": "Kenvin NAME 3",
          "employeeSurname": "David Surname 3",
          "employeePhoto": {
            "filePath": "http://placehold.jp/30x30.png",
            "fileName": "avatar 1"
          }
        },
        "memo": "Memo 2"
      }
    ],
    "customers": [
      {
        "customerId": 1,
        "customerName": "Customer name 1"
      },
      {
        "customerId": 2,
        "customerName": "Customer name 2"
      }
    ],
    "memo": "MEMO 111111",
    "createdUser": {
      "createdDate": "2019/07/07",
      "employeeId": 3,
      "employeeName": "Kenvin NAME 3",
      "employeeSurname": "David Surname 3",
      "employeePhoto": {
        "filePath": "http://placehold.jp/30x30.png",
        "fileName": "avatar 1"
      }
    },
    "updatedUser": {
      "updatedDate": "2019/07/05",
      "employeeId": 2,
      "employeeName": "Kenvin NAME 2",
      "employeeSurname": "David Surname 2",
      "employeePhoto": {
        "filePath": "http://placehold.jp/30x30.png",
        "fileName": "avatar 1"
      }
    },
    "extTimeline": {},
    "task": null,
    "schedule": null,
    "milestone": {
      "milestoneId": 2,
      "milestoneName": "milestoneName"
    },
    "nextSchedule": {
      "nextScheduleDate": "2019/05/09",
      "nextScheduleId": 1,
      "nextScheduleName": "予定",
      "iconPath": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT8mif2MbxBbtR_E13NsGUr25pI3tHC_jex36gZZ621ureNxooo&usqp=CAU",
      "customerName": "直樹",
      "productTradings": [
        {
          "productTradingName": "商品1"
        },
        {
          "productTradingName": "商品2"
        }
      ]
    }
  },
  {
    "activityId": 2,
    "isDraft": false,
    "contactDate": "2019/07/05",
    "activityStartTime": "2019/07/05 10:00",
    "activityEndTime": "2019/07/05 11:00",
    "activityDuration": 60,
    "employee": {
      "employeeName": "Kenvin NAME 2",
      "employeeSurname": "David Surname",
      "employeeId": 1,
      "employeePhoto": {
        "filePath": "http://placehold.jp/50x50.png",
        "fileName": "avatar 1"
      }
    },
    "businessCards": [
      {
        "businessCardId": 1,
        "firstName": "直樹1 1111",
        "lastName": "直樹1",
        "firstNameKana": "タナカ",
        "lastNameKana": "タナカ",
        "position": "",
        "departmentName": "直樹"
      },
      {
        "businessCardId": 2,
        "firstName": "直樹2",
        "lastName": "直樹2",
        "firstNameKana": "タナカ2",
        "lastNameKana": "タナカ2",
        "position": "",
        "departmentName": "直樹2"
      }
    ],
    "interviewer": [
      "interviewerName1",
      "interviewerName2"
    ],
    "customer": {
      "customerId": 1,
      "customerName": "Customer name"
    },
    "productTradings": [
      {
        "productTradingId": 1,
        "productId": 1,
        "productName": "商品A",
        "quantity": 20,
        "price": 20,
        "amount": 40,
        "productTradingProgressId": 1,
        "productTradingProgressName": "進捗名A",
        "endPlanDate": "2019/07/05",
        "orderPlanDate": "2019/07/05",
        "employee": {
          "employeeId": 2,
          "employeeName": "Kenvin NAME 2",
          "employeeSurname": "David Surname 2",
          "employeePhoto": {
            "filePath": "http://placehold.jp/30x30.png",
            "fileName": "avatar 1"
          }
        },
        "memo": "Memo 1"
      },
      {
        "productTradingId": 2,
        "productId": 2,
        "productName": "商品B",
        "quantity": 20,
        "price": 20,
        "amount": 40,
        "productTradingProgressId": 2,
        "productTradingProgressName": "進捗名B",
        "endPlanDate": "2019/07/05",
        "orderPlanDate": "2019/07/05",
        "employee": {
          "employeeId": 3,
          "employeeName": "Kenvin NAME 3",
          "employeeSurname": "David Surname 3",
          "employeePhoto": {
            "filePath": "http://placehold.jp/30x30.png",
            "fileName": "avatar 1"
          }
        },
        "memo": "Memo 2"
      }
    ],
    "customers": [
      {
        "customerId": 1,
        "customerName": "Customer name 1"
      },
      {
        "customerId": 2,
        "customerName": "Customer name 2"
      }
    ],
    "memo": "MEMO 2222",
    "createdUser": {
      "createdDate": "2019/07/05",
      "employeeId": 3,
      "employeeName": "Kenvin NAME 3",
      "employeeSurname": "David Surname 3",
      "employeePhoto": {
        "filePath": "http://placehold.jp/30x30.png",
        "fileName": "avatar 1"
      }
    },
    "updatedUser": {
      "updatedDate": "2019/07/05",
      "employeeId": 2,
      "employeeName": "Kenvin NAME 2",
      "employeeSurname": "David Surname 2",
      "employeePhoto": {
        "filePath": "http://placehold.jp/30x30.png",
        "fileName": "avatar 1"
      }
    },
    "extTimeline": {},
    "task": {
      "taskId": 2,
      "taskName": "taskName"
    },  
    "schedule": null,
    "milestone": null,
    "nextSchedule": {
      "nextScheduleDate": "2019/05/09",
      "nextScheduleId": 1,
      "nextScheduleName": "予定",
      "iconPath": "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT8mif2MbxBbtR_E13NsGUr25pI3tHC_jex36gZZ621ureNxooo&usqp=CAU",
      "customerName": "直樹",
      "productTradings": [
        {
          "productTradingName": "商品1"
        },
        {
          "productTradingName": "商品2"
        }
      ]
    }
  }
]`;

export const dummyTaskJSON = `{
  "taskBadge": 120,
  "tasks": [{
    "taskId": 1,
    "finishDate": "2020/05/05",
    "taskName": "タスクA",
    "customer": {
      "customerId": 1,
      "customerName": "顧客A"
    },
    "productTradings": [
      {
        "productTradingId": 1,
        "productTradingName": "商品3123123123123"
      },
      {
        "productTradingId": 2,
        "productTradingName": "商品A1121212312323121231231231231232312123123123123123123123123123123123"
      }
    ],
    "employees": [
      {
        "employeeId": 1,
        "employeeName": "社員X"
      },
      {
        "employeeId": 2,
        "employeeName": "社員X1"
      }
    ]
  }]
}
`;

export const dummySchedulesJSON = `
[
  {
    "scheduleId": 1,
    "date": "6月4日（月）",
    "itemsList": [
      {
        "itemName": "予定A",
        "startEndDate": "10:00〜11:00"
      },
      {
        "itemName": "予定D",
        "startEndDate": "12:00〜13:00"
      },
      {
        "itemName": "予定C",
        "startEndDate": "15:00〜17:00"
      }
    ]
  },
  {
    "scheduleId": 2,
    "date": "6月5日（火）",
    "itemsList": [
      {
        "itemName": "予定F",
        "startEndDate": "10:00〜11:00"
      },
      {
        "itemName": "予定G",
        "startEndDate": "12:00〜13:00"
      },
      {
        "itemName": "予定H",
        "startEndDate": "15:00〜17:00"
      }
    ]
  }
]`;

export const dummyTradingProductsJSON = ` {
  "productTradingBadge": 10,
  "productTradings": [
    {
      "productTradingId": 1,
      "customerId": 1,
      "customerName": "customerName 1",
      "employeeId": 1,
      "employeeName": "employeeName 1",
      "productId": 1,
      "productName": "productName 1",
      "businessCardName": "businessCardName 1",
      "productTradingProgressId": 1,

      "progressName": {"ja_jp": "アプローチ", "en_us": "Approach", "zh_cn": "方法"},
      "endPlanDate": "2020/06/05",
      "price": 100,
      "amount": 100
    },
    {
      "productTradingId": 2,
      "customerId": 2,
      "customerName": "customerName 2",
      "employeeId": 2,
      "employeeName": "employeeName 2",
      "productId": 2,
      "productName": "productName 2",
      "businessCardName": "businessCardName 2",
      "productTradingProgressId": 1,

      "progressName": {"ja_jp": "アプローチ", "en_us": "Approach", "zh_cn": "方法"},
      "endPlanDate": "2020/10/05",
      "price": 100000,
      "amount": 100000
    }
  ]
}`

export const dummyActivityHistoryListJSON = `
[
  {
    "activityId": 1,
    "employeePhoto": "https://reactnative.dev/img/tiny_logo.png",
    "employeeName": "Mr David",
    "activityStartTime": "2020/05/05",
    "contactDate": "2020/05/05",
    "startTime": "10:00",
    "endTime": "11:00",
    "duration": 60,
    "interviewer": "Mr A",
    "customerName": "Mr B",
    "tradingProductName": "trading product C",
    "amount": 1000,
    "tradingProductEmployeeName": "Mr D",
    "tradingProductProgressName": "progress E",
    "tradingProductEndPlanDate": "2020/05/08",
    "tradingProductMemo": "Memo trading",
    "activityMemo": "Memo Activity",
    "createdDate":  "2020/05/05",
    "createdByName": "Mr A",
    "updatedDate": "2020/05/05",
    "updatedByName": "Mr B"
  }
]`;

export const dummyCustomerDetailJSON = `
{
  "customer": {
    "customerId": 2,
    "customerLogo": {
      "photoFileName": "tiny_logo.png",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "parentName": "Parent Name1",
    "parentId": 0,
    "customerName": "Customer Name",
    "customerAliasName": "customerAliasName 1",
    "phoneNumber": "0888888888888",
    "zipCode": "111111",
    "building": "building 1",
    "address": "address 1",
    "url": "google.com",
    "businessMainName": "business main name",
    "businessSubName": "business sub name",
    "employeeId": 1,
    "departmentId": 1,
    "memo": "memo 1",
    "createdDate": "2020/12/12",
    "createdUser":{
      "employeeId":10002,
      "employeeName":"Team Hang",
      "employeePhoto":"zgdfzo1min7z/employee/10002_admin-300x296_20200717073156267.gif"
      },
    "updatedDate": "2020/12/30",
    "updatedUser":{
      "employeeId":10002,
      "employeeName":"Team Hang",
      "employeePhoto":"zgdfzo1min7z/employee/10002_admin-300x296_20200717073156267.gif"
      },
    "personInCharge": {
      "employeeId": 0,
      "employeeName": "employeeName 1",
      "departmentId": 0,
      "departmentName": "departmentName 1",
      "groupId": 0,
      "groupName": "groupName 1"
    },
    "nextSchedules": [
      {
        "schedulesId": 1,
        "schedulesName": "schedulesName 1"
      },
      {
        "schedulesId": 2,
        "schedulesName": "schedulesName 2"
      },
      {
        "schedulesId": 3,
        "schedulesName": "schedulesName 3"
      },
      {
        "schedulesId": 4,
        "schedulesName": "schedulesName 4"
      }
    ],
    "nextActions": [
      {
        "taskId": 1,
        "taskName": "taskName 1"
      },
      {
        "taskId": 2,
        "taskName": "taskName 2"
      },
      {
        "taskId": 3,
        "taskName": "taskName 3"
      },
      {
        "taskId": 4,
        "taskName": "taskName 4"
      }
    ]
  },
  "dataWatchs": {
    "data": {
      "watch": [
        {"watchTargetId": 1},
        {"watchTargetId": 2},
        {"watchTargetId": 4},
        {"watchTargetId": 5}
      ]
    }
  },
  "fields": [
    {
      "fieldId": 1,
      "fieldBelong": 1,
      "fieldName": "customer_id",
      "fieldLabel": {"ja_jp":"Customer ID","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 5,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "1000000000",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 2,
      "fieldBelong": 1,
      "fieldName": "customer_parent",
      "fieldLabel": {"ja_jp":"Parent Name","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 99,
      "fieldOrder": 1,
      "isDefault": true,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "Parent Customer",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 3,
      "fieldBelong": 1,
      "fieldName": "customer_name",
      "fieldLabel": {"ja_jp":"Customer Name","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 10,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "Customer 1",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 4,
      "fieldBelong": 1,
      "fieldName": "customer_alias_name",
      "fieldLabel": {"ja_jp":"Customer Name (Alias)","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 10,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "Customer 1 (Alias)",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 5,
      "fieldBelong": 1,
      "fieldName": "phone_number",
      "fieldLabel": {"ja_jp":"phone number","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 15,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "09999999999",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 20,
      "fieldBelong": 1,
      "fieldName": "customer_address",
      "fieldLabel": {"ja_jp":"Address","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 14,
      "fieldOrder": 1,
      "isDefault": true,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "tokyo",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 6,
      "fieldBelong": 1,
      "fieldName": "business",
      "fieldLabel": {"ja_jp":"business name","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 99,
      "fieldOrder": 1,
      "isDefault": true,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "business name 1",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 7,
      "fieldBelong": 1,
      "fieldName": "url",
      "fieldLabel": {"ja_jp":"url","en_us":"Regist","zh_cn":"登録登録"},
      "fieldType": 12,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "http://google.com",
      "urlEncode": 1,
      "urlText": "google.com.vn",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 8,
      "fieldBelong": 1,
      "fieldName": "person_in_charge",
      "fieldLabel": {"ja_jp":"Person in charge","en_us":"employee","zh_cn":"登録登録"},
      "fieldType": 18,
      "fieldOrder": 1,
      "isDefault": true,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 9,
      "fieldBelong": 1,
      "fieldName": "next_schedule_id",
      "fieldLabel": {"ja_jp":"次回スケジュール","en_us":"employee","zh_cn":"登録登録"},
      "fieldType": 99,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 10,
      "fieldBelong": 1,
      "fieldName": "next_action_id",
      "fieldLabel": {"ja_jp":"ネクストアクション","en_us":"employee","zh_cn":"登録登録"},
      "fieldType": 99,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 11,
      "fieldBelong": 1,
      "fieldName": "memo",
      "fieldLabel": {"ja_jp":"memo","en_us":"memo","zh_cn":"登録登録"},
      "fieldType": 11,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 12,
      "fieldBelong": 1,
      "fieldName": "created_date",
      "fieldLabel": {"ja_jp":"created date","en_us":"created date","zh_cn":"登録登録"},
      "fieldType": 9,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 13,
      "fieldBelong": 1,
      "fieldName": "created_user",
      "fieldLabel": {"ja_jp":"created user","en_us":"created user","zh_cn":"登録登録"},
      "fieldType": 9,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 14,
      "fieldBelong": 1,
      "fieldName": "updated_date",
      "fieldLabel": {"ja_jp":"updated date","en_us":"updated date","zh_cn":"登録登録"},
      "fieldType": 9,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 15,
      "fieldBelong": 1,
      "fieldName": "updated_user",
      "fieldLabel": {"ja_jp":"updated user","en_us":"updated user","zh_cn":"登録登録"},
      "fieldType": 9,
      "fieldOrder": 1,
      "isDefault": false,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "google.com.vn",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    },
    {
      "fieldId": 16,
      "fieldBelong": 1,
      "fieldName": "customer_logo",
      "fieldLabel": {"ja_jp":"customer logo","en_us":"photo file name","zh_cn":"登録登録"},
      "fieldType": 11,
      "fieldOrder": 1,
      "isDefault": true,
      "maxLength": 100,
      "modifyFlag": 1,
      "availableFlag": 1,
      "isDoubleColumn": true,
      "ownPermissionLevel": 1,
      "othersPermissionLevel": 1,
      "defaultValue": "https://reactnative.dev/img/tiny_logo.png",
      "currencyUnit": "$",
      "typeUnit": 1,
      "decimalPlace": 1,
      "urlType": 1,
      "urlTarget": "",
      "urlEncode": 1,
      "urlText": "",
      "linkTarget": 1,
      "configValue": "",
      "isLinkedGoogleMap": false,
      "fieldGroup": 1,
      "lookupData": null,
      "lookedFieldId": 1,
      "relationData": null,
      "tabData": null,
      "fieldItems": [
        {
          "itemId": 1,
          "isAvailable": false,
          "itemOrder": "",
          "isDefault": true,
          "labelJaJp": "名前",
          "labelEnUs": "Name",
          "labelZhCn": "NameCH"
        }
      ]
    }
  ],
  "tabsInfo": ${dummyTabInfoJSON},
  "dataTabs": [
    {
      "tabId": 1,
      "data": ${dummyTradingProductsJSON}
    },
    {
      "tabId": 8,
      "data": ${dummyListActivities}
    },
    {
      "tabId": 13,
      "data": ${dummySchedulesJSON}
    },
    {
      "tabId": 5,
      "data": ${dummyTaskJSON}
    }
  ]
}`;

export const dummyResFollow = `{
  "status": 200
}`

export const dummyResChangeHistoryList = `[
  {
    "id": 3,
    "contentChange": [],
    "createdDate": "2020/02/04 12:00",
    "createdUserName": "Employee 3",
    "createdUserImage": "https://reactnative.dev/img/tiny_logo.png"
  },
  {
    "id": 1,
    "contentChange": [
      {
        "name": "Label change 1",
        "old": "3000",
        "new": "4000"
      },
      {
        "name": "Label change 2",
        "old": "5000",
        "new": "2000"
      }
    ],
    "createdDate": "2020/02/04 12:00",
    "createdUserName": "Employee 1",
    "createdUserImage": "https://reactnative.dev/img/tiny_logo.png"
  },
  {
    "id": 2,
    "contentChange": [
      {
        "name": "Label change 3",
        "old": "3000",
        "new": "4000"
      },
      {
        "name": "Label change 4",
        "old": "5000",
        "new": "2000"
      },
      {
        "name": "Label change 4",
        "old": "5000",
        "new": "2000"
      },
      {
        "name": "Label change 4",
        "old": "5000",
        "new": "2000"
      }
    ],
    "createdDate": "2020/04/04 12:00",
    "createdUserName": "Employee 2",
    "createdUserImage": "https://reactnative.dev/img/tiny_logo.png"
  }
]`;

export const dummyDepartmentDatas = `
[
  {
    "departmentId": 6,
    "departmentName": "bcd name 6",
    "parentId": 2,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 3,
    "departmentName": "bcd name 3",
    "parentId": 1,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 11,
    "departmentName": "bcd name 11",
    "parentId": 3,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 12,
    "departmentName": "bcd name 12",
    "parentId": 3,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 15,
    "departmentName": "bcd name 15",
    "parentId": 3,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 2,
    "departmentName": "bcd name 2",
    "parentId": 1,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 4,
    "departmentName": "bcd name 4",
    "parentId": 1,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 7,
    "departmentName": "bcd name 7",
    "parentId": 2,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 9,
    "departmentName": "bcd name 9",
    "parentId": 2,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 10,
    "departmentName": "bcd name 10",
    "parentId": 2,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 17,
    "departmentName": "bcd name 17",
    "parentId": 4,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 19,
    "departmentName": "bcd name 19",
    "parentId": 4,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 1,
    "departmentName": "bcd name 1",
    "parentId": 1,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 5,
    "departmentName": "bcd name 5",
    "parentId": 1,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 8,
    "departmentName": "bcd name 8",
    "parentId": 2,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 13,
    "departmentName": "bcd name 13",
    "parentId": 3,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 14,
    "departmentName": "bcd name 14",
    "parentId": 3,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 16,
    "departmentName": "bcd name 16",
    "parentId": 4,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 18,
    "departmentName": "bcd name 18",
    "parentId": 4,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
},
{
    "departmentId": 20,
    "departmentName": "bcd name 20",
    "parentId": 4,
    "networkStands": [
        {
            "businessCardId": 1,
            "stands": null
        }
    ]
}
]`;

export const dummyBusinessCardDatas = `[
  {
    "businessCardId": 1,
    "companyName": "Test1 Company",
    "departmentName": "Department Test2",
    "businessCardImage": {
      "businessCardImageName": "",
      "businessCardImagePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "position": "1",
    "emailAddress": "test1@gmail.com",
    "phoneNumber": "122222",
    "lastContactDate": "2020/05/05",
    "receiveDate": "2020/05/05",
    "employeeIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    "businessCardId": 2,
    "companyName": "Test2 Company",
    "departmentName": "Department Test2",
    "businessCardImage": {
      "businessCardImageName": "",
      "businessCardImagePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "position": "2",
    "emailAddress": "test2@gmail.com",
    "phoneNumber": "333122222",
    "lastContactDate": "2020/05/05",
    "receiveDate": "2020/05/05",
    "employeeIds": [1]
  },
  {
    "businessCardId": 3,
    "companyName": "Test2 Company",
    "departmentName": "Department Test2",
    "businessCardImage": {
      "businessCardImageName": "",
      "businessCardImagePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "position": "2",
    "emailAddress": "test2@gmail.com",
    "phoneNumber": "333122222",
    "lastContactDate": "2020/05/05",
    "receiveDate": "2020/05/05",
    "employeeIds": [1]
  },
  {
    "businessCardId": 4,
    "companyName": "Test2 Company",
    "departmentName": "Department Test2",
    "businessCardImage": {
      "businessCardImageName": "",
      "businessCardImagePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "position": "2",
    "emailAddress": "test2@gmail.com",
    "phoneNumber": "333122222",
    "lastContactDate": "2020/05/05",
    "receiveDate": "2020/05/05",
    "employeeIds": [1]
  },
  {
    "businessCardId": 5,
    "companyName": "Test2 Company",
    "departmentName": "Department Test2",
    "businessCardImage": {
      "businessCardImageName": "",
      "businessCardImagePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "position": "2",
    "emailAddress": "test2@gmail.com",
    "phoneNumber": "333122222",
    "lastContactDate": "2020/05/05",
    "receiveDate": "2020/05/05",
    "employeeIds": [1]
  },
  {
    "businessCardId": 6,
    "companyName": "Test2 Company",
    "departmentName": "Department Test2",
    "businessCardImage": {
      "businessCardImageName": "",
      "businessCardImagePath": "https://reactnative.dev/img/tiny_logo.png"
    },
    "position": "2",
    "emailAddress": "test2@gmail.com",
    "phoneNumber": "333122222",
    "lastContactDate": "2020/05/05",
    "receiveDate": "2020/05/05",
    "employeeIds": [1]
  }
]`;

export const dummyEmployeeDatas = `[
  {
    "employeeId": 1,
    "departmentName": "Department Employee1",
    "positionName": "Position Name Employee1",
    "employeeSurname": "Surname Employee1",
    "employeeName": "Employee Name 1",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 2,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 3",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 3,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 4,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 5,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 6,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 7,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 8,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 9,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  },
  {
    "employeeId": 10,
    "departmentName": "Department Employee2",
    "positionName": "Position Name Employee2",
    "employeeSurname": "Surname Employee2",
    "employeeName": "Employee Name 2",
    "employeeImage": {
      "photoFileName": "",
      "photoFilePath": "https://reactnative.dev/img/tiny_logo.png"
    }
  }
]`;

export const dummyStandDatas = `[
  {
    "masterStandId": 1,
    "masterStandName": {
      "ja_jp": "director 1",
      "en_us": "director 1",
      "zh_cn": "director 1"
    }
  },
  {
    "masterStandId": 2,
    "masterStandName": {
      "ja_jp": "director 2",
      "en_us": "director 2",
      "zh_cn": "director 2"
    }
  }
]`

export const dummyMotivationDatas = `[
  {
    "motivationId": 1,
    "motivationName": {
      "ja_jp": "motivationName 1",
      "en_us": "motivationName 1",
      "zh_cn": "motivationName 1"
    },
    "motivationIcon": {
      "iconName": "icon",
      "iconPath": "https://reactnative.dev/img/tiny_logo.png",
      "backgroundColor": "#38C07C"
    }
  },
  {
    "motivationId": 2,
    "motivationName": {
      "ja_jp": "motivationName 2",
      "en_us": "motivationName 2",
      "zh_cn": "motivationName 2"
    },
    "motivationIcon": {
      "iconName": "icon",
      "iconPath": "https://reactnative.dev/img/tiny_logo.png",
      "backgroundColor": "#F92525"
    }
  }
]`

export const dummyTradingProductDatas = `[
  {
    "tradingProductId": 1,
    "tradingProductName": "tradingProductName 1"
  },
  {
    "tradingProductId": 2,
    "tradingProductName": "tradingProductName 2"
  }
]`

export const DUMMY_TASK: any[] = [
  {
    taskId: 1,
    customers: [
      {
        customerName: 'string'
      }
    ],
    taskName: 'string',
    finishDate: '2019-07-05T09:40:07.538Z',
    parentTaskId: null,
    subTasks: [
      {
        subTaskId: 5,
        subTaskName: 'task1',
        statusTaskId: 1
      }
    ],
    productTradings: [
      {
        productTradingId: 1,
        productTradingName: 'string'
      },
      {
        productTradingId: 2,
        productTradingName: 'string'
      },
      {
        productTradingId: 3,
        productTradingName: 'string'
      },
      {
        productTradingId: 4,
        productTradingName: 'string'
      },
      {
        productTradingId: 5,
        productTradingName: 'string'
      },
      {
        productTradingId: 6,
        productTradingName: 'string'
      },
      {
        productTradingId: 7,
        productTradingName: 'string'
      }
    ],
    milestoneId: 1,
    milestoneName: 'string',
    statusTaskId: 1,
    employees: [
      {
        employeeId: 1,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'employeeName',
        departmentName: 'departmentName',
        positionName: 'positionName'
      },
      {
        employeeId: 2,
        photoFilePath: '',
        employeeName: 'edit',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 3,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'creat',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 4,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'string',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 5,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'creat',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 6,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'creat',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 7,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'creat',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 8,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'creat',
        departmentName: 'string',
        positionName: 'string'
      },
      {
        employeeId: 9,
        photoFilePath: 'https://reactnative.dev/img/tiny_logo.png',
        employeeName: 'creat',
        departmentName: 'string',
        positionName: 'string'
      }
    ]
  },
  {
    taskId: 2,
    customers: [
      {
        customerName: 'string'
      }
    ],
    taskName: 'string',
    finishDate: '2021-07-05T09:40:07.538Z',
    parentTaskId: 1,
    subTasks: [],
    productTradings: [
      {
        productTradingId: 1,
        productTradingName: 'string'
      }
    ],
    statusTaskId: 2,
    employees: [
      {
        employeeId: 2,
        photoFilePath: '',
        employeeName: 'string',
        departmentName: 'string',
        positionName: 'string'
      }
    ]
  },
  {
    taskId: 3,
    customers: [
      {
        customerName: 'string'
      }
    ],
    taskName: 'string',
    finishDate: '2021-07-05T09:40:07.538Z',
    parentTaskId: 1,
    subTasks: [],
    productTradings: [
      {
        productTradingId: 1,
        productTradingName: 'string'
      }
    ],
    statusTaskId: 2,
    employees: [
      {
        employeeId: 2,
        photoFilePath: '',
        employeeName: 'string',
        departmentName: 'string',
        positionName: 'string'
      }
    ]
  },
  {
    taskId: 4,
    customers: [
      {
        customerName: 'string'
      }
    ],
    taskName: 'string',
    finishDate: '2021-07-05T09:40:07.538Z',
    parentTaskId: null,
    subTasks: [],
    productTradings: [
      {
        productTradingId: 1,
        productTradingName: 'string'
      }
    ],
    statusTaskId: 1,
    employees: [
      {
        employeeId: 2,
        photoFilePath: '',
        employeeName: 'string',
        departmentName: 'string',
        positionName: 'string'
      }
    ]
  },
]
