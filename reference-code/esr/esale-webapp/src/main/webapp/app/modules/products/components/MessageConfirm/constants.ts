import { create, update } from 'lodash';
import { translate } from 'react-jhipster';
import TextChange from './components/TextChange';
import TextAreaChange from './components/TextAreaChange';
import FileChange from './components/FileChange';
import LinkChange from './components/LinkChange';
import OrganizationChange from './components/OrganizationChange';
import MutilDataChange from './components/MutilDataChange';

export const FIELD = {
  productName: 'product_name',
  productImageName: 'product_image_name',
  productTypeId: 'product_type_id',
  productSetData: 'product_set_data',
  unitPrice: 'unit_price',
  fileName: 'file_name',
  filePath: 'file_path',
  action: 'action'
};

export const LANGUAGE_LABEL = {
  languages: [
    {
      languageId: 1,
      labelChange: '変更されました。',
      year: '年',
      month: '月',
      date: '日'
    },
    {
      languageId: 2,
      labelChange: 'changed',
      year: ' year ',
      month: ' month ',
      date: ' date '
    },
    {
      languageId: 3,
      labelChange: '变了',
      year: '年',
      month: '月',
      date: '日期'
    }
  ]
};

export type HistoryItemDataType = {
  contentChange: object;
  createdDate: Date;
  createdUserId: number;
  createdUserImage: string;
  createdUserName: string;
  reasonEdit: string;
};

export type StatementDataType = {
  action: number;
  product_name: string;
  product_set_data: any;
};

export type SpecialDataType = {
  statementData?: [];
};

export type FieldInfoType = {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  fieldOrder: string;
  fieldItems?: any[];
};

export enum HistoryTitleEnum {
  created,
  updated,
  intergrated
}

export const HISTORY_TITLE = {
  create: 'history.title.create',
  edit: 'history.title.edit'
};

export enum ActionClickFile {
  show,
  dowload
}

export const iconTypes = [
  { type: ['xls'], icon: 'ic-file-xls.svg', action: ActionClickFile.dowload },
  { type: ['png', 'jpg', 'jpeg'], icon: 'ic-file-img.svg', action: ActionClickFile.show },
  { type: ['logo'], icon: 'logo-rule.svg', action: ActionClickFile.dowload }
];

export type FieldType99 = {
  fieldName: string;
  fieldType: number;
  sourceProp: string;
  keyOfId: string;
  keyOfValue: string;
};
export const fieldType99: FieldType99[] = [
  {
    fieldName: 'product_category_id',
    fieldType: 1,
    sourceProp: 'productCategories',
    keyOfId: 'productCategoryId',
    keyOfValue: 'productCategoryName'
  },
  {
    fieldName: 'product_type_id',
    fieldType: 1,
    sourceProp: 'productTypes',
    keyOfId: 'productTypeId',
    keyOfValue: 'productTypeName'
  },
  {
    fieldName: 'is_display',
    fieldType: 4,
    sourceProp: '',
    keyOfId: '',
    keyOfValue: ''
  }
];

export const Categories = {
  pulldownSingle: 1,
  pulldownMultiple: 2,
  checkbox: 3,
  radio: 4,
  number: 5,
  date: 6,
  dateTime: 7,
  time: 8,
  text: 9,
  textarea: 10,
  file: 11,
  link: 12,
  numberPhone: 13,
  address: 14,
  mail: 15,
  relation: 17,
  organization: 18,
  special: 99
};

export const arrFieldTypeToComponent = [
  {
    fieldTypes: [
      Categories.pulldownSingle,
      Categories.radio,
      Categories.number,
      Categories.date,
      Categories.dateTime,
      Categories.time,
      Categories.text,
      Categories.numberPhone,
      Categories.address,
      Categories.mail
    ],
    Component: TextChange
  },
  {
    fieldTypes: [Categories.pulldownMultiple, Categories.checkbox],
    Component: MutilDataChange
  },
  {
    fieldTypes: [Categories.textarea],
    Component: TextAreaChange
  },
  {
    fieldTypes: [Categories.file],
    Component: FileChange
  },
  {
    fieldTypes: [Categories.link],
    Component: LinkChange
  },
  // {
  //   fieldTypes: [Categories.relation],
  //   Component: StatementChange
  // },
  {
    fieldTypes: [Categories.organization],
    Component: OrganizationChange
  }
];

export const blankText = () => translate('products.detail.label.content.create');
