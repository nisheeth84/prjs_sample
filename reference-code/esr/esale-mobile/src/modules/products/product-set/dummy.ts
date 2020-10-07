export const DUMMY_PRODUCT_SET = {
  dataInfo: {
    productSet: {
      productId: 101,
      productName: "商品B",
      unitPrice: 20000,
      isSet: 1,
      productImagePath: "",
      productImageName: "sp001.jpg",
      productCategoryId: 1,
      productCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
      productTypeId: 2,
      productTypeName:
        '{"ja_jp": "商品タイプ","en_us": "product type name","zh_cn": "类别"}',
      memo: "メモの内容が入ります。",
      isDisplay: true,
      productData: [],
      createdDate: "2019/10/08",
      createdUserId: 102,
      createdUserName: "社員A",
      updatedDate: "2019/10/09",
      updatedUserId: 102,
      updatedUserName: "社員A",
    },
    products: [
      {
        productId: 102,
        productName: "商品B",
        unitPrice: 20000,
        productImageName: "sp001.jpg",
        productImagePath: "",
        productCategoryId: 1,
        productCategoryName:
          '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
        productTypeId: 2,
        memo: "メモの内容が入ります。",
        productSetData: [
          {
            fieldType: "",
            key: "fieldInfoProductSet",
            value: "テキストが入ります。あいうえお。",
          },
        ],
        setId: 101,
        quantity: 1,
      },
      {
        productId: 103,
        productName: "商品C",
        unitPrice: 3000,
        productImageName: "sp002.jpg",
        productImagePath: "",
        productCategoryId: 1,
        productCategoryName:
          '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
        productTypeId: 3,
        memo: "メモの内容が入ります。",
        productSetData: [
          {
            fieldType: "",
            key: "fieldInfoProductSet",
            value: "テキストが入ります。あいうえお。",
          },
        ],
        setId: 101,
        quantity: 2,
      },
    ],
    productSets: [
      {
        productId: 1041,
        productName: "カテゴリ1",
        unitPrice: 10000,
        productImagePath: "",
      },
      {
        productId: 1051,
        productName: "カテゴリ2",
        unitPrice: 10000,
        productImagePath: "",
      },
    ],
    productCategories: [
      {
        productCategoryId: 1,
        productCategoryName:
          '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
        productCategoryLevel: 1,
        productCategoryChild: [
          {
            categoryId: 3,
            productCategoryName:
              '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
            productCategoryLevel: 2,
            productCategoryChild: null,
          },
          {
            categoryId: 6,
            productCategoryName:
              '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
            productCategoryLevel: 2,
            productCategoryChild: null,
          },
        ],
      },
    ],
    productTypes: [
      {
        productTypeId: 1,
        productTypeName:
          '{"ja_jp": "商品タイプ","en_us": "product type name","zh_cn": "类别"}',
        fieldUse: {
          "101": 1,
          "102": 0,
        },
        isAvailable: true,
      },
      {
        productTypeId: 2,
        productTypeName:
          '{"ja_jp": "商品タイプ","en_us": "product type name","zh_cn": "类别"}',
        fieldUse: {
          "101": 0,
          "102": 1,
        },
        isAvailable: true,
      },
    ],
    productTradings: {
      productTradingBadge: 3,
      productTradings: [
        {
          productTradingId: 1,
          customerName: "顧客A",
          employeeName: "従業員名A",
          productName: "商品名A",
          endPlanDate: "2019/10/10",
          progressName: "アプローチ",
          amount: 50000,
        },
        {
          productTradingId: 2,
          customerName: "顧客B",
          employeeName: "従業員名B",
          productName: "商品名B",
          endPlanDate: "2019/10/10",
          progressName: "アプローチ",
          amount: 5000,
        },
      ],
      fieldInfoTab: [],
    },
    productHistories: [],
  },
  fieldInfoProduct: [
    {
      fieldID: 1,
      fieldName: "numeric1",
    },
    {},
  ],
  fieldInfoProductSet: [
    {
      fieldID: 1,
      fieldName: "numeric1",
    },
    {},
  ],
  tabInfo: [],
  fieldInfoTab: [],
};