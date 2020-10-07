/**
 * API suggest schedule
 */
export const SCHEDULES_DUMMY = {
  schedules: [
    {
      scheduleId: 1,
      scheduleName: "カレンダー A",
      startDate: "10/05/2020 10:00",
      endDate: "10/05/2020 11:30",
    },
    {
      scheduleId: 2,
      scheduleName: "カレンダー B",
      startDate: "10/05/2020 10:00",
      endDate: "10/05/2020 11:30",
    },
    {
      scheduleId: 3,
      scheduleName: "カレンダー C",
      startDate: "10/05/2020 10:00",
      endDate: "10/05/2020 11:30",
    },
    {
      scheduleId: 4,
      scheduleName: "カレンダー D",
      startDate: "10/05/2020 10:00",
      endDate: "10/05/2020 11:30",
    },
    {
      scheduleId: 5,
      scheduleName: "カレンダー E",
      startDate: "10/05/2020 10:00",
      endDate: "10/05/2020 11:30",
    },
  ],
};

export const TIMELINE_DUMMY = {
  timelines: [
    {
      timelineId: 123,
      createdDate: "2020-01-01",
      comment: "This is post of timeline",
    },
    {
      timelineId: 150,
      createdDate: "2020-01-04",
      comment: "This is post of another timeline",
    },
    {
      timelineId: 122,
      createdDate: "2020-01-01",
      comment: "This is post of timeline",
    },
    {
      timelineId: 152,
      createdDate: "2020-01-04",
      comment: "This is post of another timeline",
    },
    {
      timelineId: 125,
      createdDate: "2020-01-01",
      comment: "This is post of timeline",
    },
    {
      timelineId: 158,
      createdDate: "2020-01-04",
      comment: "This is post of another timeline",
    },
  ],
};

export const BUSINESS_DUMMY = {
  businessCards: [
    {
      businessCardId: 1,
      businessCardImagePath: "google.com/123.png",
      departmentName: "Team Design",
      businessCardName: "David A",
      position: "Leader",
      customerName: "顧客",
    },
    {
      businessCardId: 2,
      businessCardImagePath: "google.com/123.png",
      departmentName: "Team Design",
      businessCardName: "David A",
      position: "Leader",
      customerName: "顧客",
    },
    {
      businessCardId: 3,
      businessCardImagePath: "google.com/123.png",
      departmentName: "Team Design",
      businessCardName: "David A",
      position: "Leader",
      customerName: "顧客",
    },
    {
      businessCardId: 4,
      businessCardImagePath: "google.com/123.png",
      departmentName: "Team Design",
      businessCardName: "David A",
      position: "Leader",
      customerName: "顧客",
    },
    {
      businessCardId: 5,
      businessCardImagePath: "google.com/123.png",
      departmentName: "Team Design",
      businessCardName: "David A",
      position: "Leader",
      customerName: "顧客",
    },
  ],
  totalRecord: 20,
};

export const CUSTOMER_DUMMY = {
  customers: [
    {
      customerId: 1, 
      customerName: "nguyen van a",
      customerParent: {
        customerName: "nguye w",
      },
      building: "Hoa Binh tower",
      address: "106 HQV",
    },
    {
      customerId: 2, 
      customerName: "nguyen van b",
      customerParent: {
        customerName: "nguyen sc b",
      },
      building: "Hoa Binh tower",
      address: "106 HQV",
    },
    {
      customerName: "nguyen van c",
      customerParent: {
        customerName: "nguyen nga b",
      },
      building: "Hoa Binh tower",
      address: "106 HQV",
    },
    {
      customerId: 3, 
      customerName: "nguyen van d",
      customerParent: {
        customerName: "nguyen thi b",
      },
      building: "Hoa Binh tower",
      address: "106 HQV",
    },
    {
      customerId: 4, 
      customerName: "nguyen van e",
      customerParent: {
        customerName: "nguyen van b",
      },
      building: "Hoa Binh tower",
      address: "106 HQV",
    },
  ],
};

export const ACTIVITIES_DUMMY = {
  dataInfo: {
    activities: [
      {
        activityId: 1,
        isDraft: "true",
        contactDate: "2019/07/05",
        activityStartTime: "2019/07/05 10:00",
        activityEndTime: "2019/07/05 10:30",
        activityDuration: "60",
        employee: {
          employeeName: "直樹タナカ",
          employeeId: 1,
          employeePhoto: {
            photoFileName: "PHP tutorial.xlsx",
            photoFilePath:
              "https://cdn.iconscout.com/icon/free/png-512/avatar-380-456332.png",
          },
        },
        listBusinessCard: [
          {
            businessCardId: 1,
            firstName: "直樹",
            lastName: "直樹",
            firstNameKana: "直樹",
            lastNameKana: "直樹",
            titleName: "直樹",
            departmentName: "直樹",
          },
        ],
        interviewer: ["直樹タナカ", "直樹タ"],
        customer: {
          customerId: 1,
          customerName: "直樹タナカ",
        },
        productTradings: [
          {
            productTradingId: 1,
            productId: 1,
            productName: "直樹タナカ",
            employeeId: 1,
            employeeName: "顧客",
            quantity: 2,
            price: "20000",
            amount: "20000",
            endPlanDate: "2019/07/05",
            orderPlanDate: "2019/07/05",
            productTradingProgressId: 1,
            productTradingProgressName: "受注",
            memo: "abcdadadad",
            productsTradingsDetailsData: {},
          },
        ],
        customers: [
          {
            customerId: 1,
            customerName: "直樹タナカ",
          },
          {
            customerId: 1,
            customerName: "直樹タナカ",
          },
        ],
        memo: "直樹タナカ",
        createdUser: {
          createdDate: "2019/04/01",
          createdUserName: "中村",
          createdUserId: 1,
        },
        updatedUser: {
          updatedDate: "2019/04/12",
          updatedUserName: "中村中村",
          updatedUserId: 1,
        },
        extTimeline: {},
        initializeInfo: {
          selectedListType: 1,
          selectedListId: 50,
        },
        nextSchedule: {
          nextScheduleDate: "2019/04/12",
          nextScheduleName: "MS相談会",
          iconPath:
            "https://camo.githubusercontent.com/6cb23d4c5246fae200fe28e35e13d54188f8e0c5/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f333834303430302f313930383535332f30343065613933302d376366382d313165332d383133632d6566666139633361613738312e706e67",
        },
        task: "物件販売の相談",
      },
    ],
  },
};

export const EMPLOYEES_DUMMY = {
  total: 12,
  employees: [
    {
      employeeName: "Hung",
      employeePhoto: {
        photoFileName: "",
        photoFilePath: "",
      },
      employeeDepartments: [
        {
          departmentId: 1,
          departmentName: "dev1",
          positionId: 2,
          positionName: "manager",
        },
      ],
    },
    {
      employeeName: "Hung",
      employeePhoto: {
        photoFileName: "",
        photoFilePath: "",
      },
      employeeDepartments: [
        {
          departmentId: 1,
          departmentName: "dev1",
          positionId: 2,
          positionName: "manager",
        },
      ],
    },
    {
      employeeName: "Hung",
      employeePhoto: {
        photoFileName: "",
        photoFilePath: "",
      },
      employeeDepartments: [
        {
          departmentId: 1,
          departmentName: "dev1",
          positionId: 2,
          positionName: "manager",
        },
      ],
    },
    {
      employeeName: "Hung",
      employeePhoto: {
        photoFileName: "",
        photoFilePath: "",
      },
      employeeDepartments: [
        {
          departmentId: 1,
          departmentName: "dev1",
          positionId: 2,
          positionName: "manager",
        },
      ],
    },
    {
      employeeName: "Hung",
      employeePhoto: {
        photoFileName: "",
        photoFilePath: "",
      },
      employeeDepartments: [
        {
          departmentId: 1,
          departmentName: "dev1",
          positionId: 2,
          positionName: "manager",
        },
      ],
    },
  ],
};

export const ANALYSIS_DUMMY = {
  reports: [
    {
      reportId: 123,
      reportName: "レポートA",
      reportCategoryId: 1,
      reportCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
    },
    {
      reportId: 12,
      reportName: "レポートB",
      reportCategoryId: 1,
      reportCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
    },
    {
      reportId: 1,
      reportName: "レポートB",
      reportCategoryId: 1,
      reportCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
    },
    {
      reportId: 4,
      reportName: "レポートB",
      reportCategoryId: 1,
      reportCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
    },
    {
      reportId: 5,
      reportName: "レポートB",
      reportCategoryId: 1,
      reportCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
    },
  ],
  totalRecord: 8,
};

export const PRODUCT_DUMMY = {
  products: [
    {
      productId: 123,
      productName: "セットA",
      productCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
      productImagePath: "product/sp001.jpg",
      unitPrice: 100000,
      isSet: true,
    },
    {
      productId: 12,
      productName: "商品B",
      productCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
      productImagePath: "product/sp002.jpg",
      unitPrice: 2000000,
      isSet: false,
    },
    {
      productId: 122,
      productName: "商品B",
      productCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
      productImagePath: "product/sp002.jpg",
      unitPrice: 20077777,
      isSet: false,
    },
  ],
  totalRecord: 20,
};

export const TASK_DUMMY = {
  tasks: [
    {
      taskId: 101,
      taskName: "契約書に署名する",
      milestone: {
        milestoneId: 2221,
        milestoneName: "契約契約契約契約",
      },
      customer: {
        customerId: 2001,
        customerName: "未来会社未来会社",
      },
      productTradings: [
        {
          productTradingId: 7771,
          productTradingName: "カテゴカテゴ",
        },
      ],
      finishDate: "2019/02/01",
      operatorNames: "ゴカ",
    },
    {
      taskId: 102,
      taskName: "契約書に署名する",
      milestone: {
        milestoneId: 2221,
        milestoneName: "契約契約契約契約",
      },
      customer: {
        customerId: 2001,
        customerName: "未来会社未来会社",
      },
      productTradings: [
        {
          productTradingId: 7771,
          productTradingName: "カテゴカテゴ",
        },
      ],
      finishDate: "2019/02/01",
      operatorNames: "ゴカ",
    },
    {
      taskId: 103,
      taskName: "契約書に署名する",
      milestone: {
        milestoneId: 2221,
        milestoneName: "契約契約契約契約",
      },
      customer: {
        customerId: 2001,
        customerName: "未来会社未来会社",
      },
      productTradings: [
        {
          productTradingId: 7771,
          productTradingName: "カテゴカテゴ",
        },
      ],
      finishDate: "2019/02/01",
      operatorNames: "ゴカ",
    },
    {
      taskId: 104,
      taskName: "契約書に署名する",
      milestone: {
        milestoneId: 2221,
        milestoneName: "契約契約契約契約",
      },
      customer: {
        customerId: 2001,
        customerName: "未来会社未来会社",
      },
      productTradings: [
        {
          productTradingId: 7771,
          productTradingName: "カテゴカテゴ",
        },
      ],
      finishDate: "2019/02/01",
      operatorNames: "ゴカ",
    },
  ],
};

export const PRODUCT_TRADINGS_DUMMY = {
  productTradings: [
    {
      productsTradingsId: 1,
      customerId: 1,
      customerName: "顧客",
      productId: 1,
      productName: "製品",
      productImageName: "製品.jpg",
      productImagePath: "excample.vn",
      employeeId: 1,
      employeeName: "部員",
      progressName: "finish",
    },
    {
      productsTradingsId: 2,
      customerId: 1,
      customerName: "顧客",
      productId: 1,
      productName: "製品",
      productImageName: "製品.jpg",
      productImagePath: "excample.vn",
      employeeId: 1,
      employeeName: "部員",
      progressName: "finish",
    },
    {
      productsTradingsId: 3,
      customerId: 1,
      customerName: "顧客",
      productId: 1,
      productName: "製品",
      productImageName: "製品.jpg",
      productImagePath: "excample.vn",
      employeeId: 1,
      employeeName: "部員",
      progressName: "finish",
    },
  ],
  totalRecord: 20,
};
