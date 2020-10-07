export const DUMMY_PRODUCT = {
  product: {
    productId: "101",
    productData: [],
    productName: "商品B",
    unitPrice: 20000,
    isDisplay: 1,
    productImageName: "sp001.jpg",
    productImagePath: "",
    productCategoryId: 1,
    productCategoryName:
      '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
    productTypeId: 2,
    productTypeName:
      '{"ja_jp": "商品タイプ","en_us": "product type name","zh_cn": "类别"}',
    memo: "メモの内容が入ります。",
    isSet: false,
    createdDate: "2019/10/08",
    createdUserId: 102,
    createdUserName: "山田",
    updatedDate: "2019/10/08",
    updatedUserId: 102,
    updatedUserName: "山田",
  },
  productCategories: [
    {
      productCategoryId: 1,
      productCategoryName:
        '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
      productCategoryLevel: 1,
      displayOrder: 1,
      productCategoryChild: [
        {
          categoryId: 3,
          productCategoryName:
            '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
          productCategoryLevel: 2,
          displayOrder: 2,
          productCategoryChild: null,
        },
        {
          categoryId: 6,
          productCategoryName:
            '{"ja_jp": "カテゴリ名","en_us": "category name","zh_cn": "类别"}',
          productCategoryLevel: 2,
          displayOrder: 2,
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
    },
    {
      productTypeId: 2,
      productTypeName:
        '{"ja_jp": "商品タイプ","en_us": "product type name","zh_cn": "类别"}',
      fieldUse: {
        "101": 0,
        "102": 1,
      },
    },
  ],
  productSets: [
    {
      productId: 105,
      productImagePath: "",
      productName: "セット1",
      unitPrice: 1000,
    },
    {
      productId: 106,
      productImagePath: "",
      productName: "セット2",
      unitPrice: 2000,
    },
  ],
  productTradings: {
    productTradingBadge: 2,
    productTradings: [
      {
        productTradingId: 1,
        customerName: "顧客A",
        endPlanDate: "2019/10/10",
        progressName: "アプローチ",
        amount: 50000,
        employeeName: "従業員名A",
        productName: "商品名A",
      },
      {
        productTradingId: 2,
        customerName: "顧客B",
        endPlanDate: "2019/10/10",
        progressName: "アプローチ",
        amount: 50000,
        employeeName: "従業員名B",
        productName: "商品名B",
      },
    ],
    fieldInfoTab: [],
  },
  productHistories: [],
};