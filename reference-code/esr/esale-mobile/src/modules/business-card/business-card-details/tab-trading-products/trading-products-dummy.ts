/* eslint-disable @typescript-eslint/camelcase */
export const DUMMY_DATA = {
  dataInfo: {
    totalRecord: 2,
    productTradingBadge: 3,
    productTradings: [
      {
        productsTradingsId: 11,
        customerId: 111,
        customerName: "顧客A",
        employeeId: 1,
        employeeName: "社員A",
        productId: 10001,
        productName: "商品C",
        productTradingProgressId: 1,
        progressName: "アプローチ",
        estimatedCompletionDate: "2020 / 10 / 11",
        quantity: 1,
        price: 1500000,
        amount: 2000,
        numeric1: 11,
        checkbox1: 0,
      },
      {
        productsTradingsId: 101,
        customerId: 111,
        customerName: "顧客A",
        employeeId: 1,
        employeeName: "社員A",
        productId: 10001,
        productName: "商品C",
        productTradingProgressId: 1,
        progressName: "アプローチ",
        estimatedCompletionDate: "2020 / 10 / 11",
        quantity: 1,
        price: 1000,
        amount: 2000,
        numeric1: 11,
        productTradingData: [
          {
            fieldType: 10,
            key: "text_1",
            value: "Hello world",
          },
          {
            fieldType: 1,
            key: "pulldown_1",
            value: 12,
          },
        ],
      },
    ],
  },
  fieldInfoTab: [
    {
      fieldId: 1,
      fieldInfoTabId: 1,
      fieldInfoTabPersonalId: 1,
      fieldName: "text_1",
      fieldLabel: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        ja_jp: "会議室A",
        en_us: "Conference room A",
        zh_cn: "会议室A",
      },
      fieldType: 10,
      fieldOrder: 1,
      isColumnFixed: false,
      columnWidth: 50,
    },
    {
      fieldId: 2,
      fieldInfoTabId: 2,
      fieldInfoTabPersonalId: 2,
      fieldName: "text_2",
      fieldLabel: {
        ja_jp: "電話番号",
        en_us: "phone number",
        zh_cn: "电话号码",
      },
      fieldType: 10,
      fieldOrder: 2,
      isColumnFixed: false,
      columnWidth: 50,
    },
  ],
  fields: [
    {
      fieldId: 1,
      fieldName: "text_1",
      fieldLabel: {
        ja_jp: "会議室A",
        en_us: "Conference room A",
        zh_cn: "会议室A",
      },
      fieldType: 10,
      fieldOrder: 1,
      fieldItems: [],
    },
    {
      fieldId: 3,
      fieldName: "checkbox_1",
      fieldLabel: {
        ja_jp: "勝因",
        en_us: "Cause of victory",
        zh_cn: "胜利的原因",
      },
      fieldType: 3,
      fieldOrder: 3,
      fieldItems: [
        {
          itemId: 1,
          itemLabel: {
            ja_jp: "サービス",
            en_us: "service",
            zh_cn: "服务",
          },
        },
        {
          itemId: 2,
          itemLabel: {
            ja_jp: "機能",
            en_us: "function",
            zh_cn: "功能介绍",
          },
        },
      ],
    },
  ],
};
