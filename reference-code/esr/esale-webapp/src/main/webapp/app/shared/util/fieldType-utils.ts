export const modeScreenType = {
  typeDetail: 'typeDetail',
  typeAddEdit: 'typeAddEdit',
  typeList: 'typeList',
  typeEditSimple: 'typeEditSimple',
  typeSort: 'typeSort',
  typeSearchFilter: 'typeSearchFilter'
};

const data = [
  {
    fieldName: 'employee_photo.file_name',
    type: {
      typeDetail: 11,
      typeAddEdit: 11,
      typeList: 11,
      typeEditSimple: 11,
      typeSort: 11,
      typeSearchFilter: 11
    }
  },
  {
    fieldName: 'employee_surname',
    type: {
      typeDetail: 9,
      typeAddEdit: 9,
      typeList: 9,
      typeEditSimple: 9,
      typeSort: 9,
      typeSearchFilter: 9
    }
  },
  {
    fieldName: 'employee_name',
    type: {
      typeDetail: 9,
      typeAddEdit: 9,
      typeList: 9,
      typeEditSimple: 9,
      typeSort: 9,
      typeSearchFilter: 9
    }
  },
  {
    fieldName: 'employee_surname_kana',
    type: {
      typeDetail: 9,
      typeAddEdit: 9,
      typeList: 9,
      typeEditSimple: 9,
      typeSort: 9,
      typeSearchFilter: 9
    }
  },
  {
    fieldName: 'employee_name_kana',
    type: {
      typeDetail: 9,
      typeAddEdit: 9,
      typeList: 9,
      typeEditSimple: 9,
      typeSort: 9,
      typeSearchFilter: 9
    }
  },
  {
    fieldName: 'email',
    type: {
      typeDetail: 15,
      typeAddEdit: 15,
      typeList: 15,
      typeEditSimple: 15,
      typeSort: 15,
      typeSearchFilter: 15
    }
  },
  {
    fieldName: 'telephone_number',
    type: {
      typeDetail: 13,
      typeAddEdit: 13,
      typeList: 13,
      typeEditSimple: 13,
      typeSort: 13,
      typeSearchFilter: 13
    }
  },
  {
    fieldName: 'cellphone_number',
    type: {
      typeDetail: 13,
      typeAddEdit: 13,
      typeList: 13,
      typeEditSimple: 13,
      typeSort: 13,
      typeSearchFilter: 13
    }
  },
  {
    fieldName: 'employee_managers',
    type: {
      typeDetail: 99,
      typeAddEdit: 99,
      typeList: 99,
      typeSort: 99,
      typeSearchFilter: 18
    }
  },
  {
    fieldName: 'employee_subordinates',
    type: {
      typeDetail: 99,
      typeAddEdit: 99,
      typeList: 18,
      typeSort: 99,
      typeSearchFilter: 18
    }
  },
  {
    fieldName: 'user_id',
    type: {
      typeDetail: 9,
      typeAddEdit: 9,
      typeList: 9,
      typeEditSimple: 9,
      typeSort: 9,
      typeSearchFilter: 9
    }
  },
  {
    fieldName: 'is_admin',
    type: {
      typeDetail: 99,
      typeAddEdit: 4,
      typeList: 4,
      typeEditSimple: 4,
      typeSort: 4,
      typeSearchFilter: 4
    }
  },
  {
    fieldName: 'language_id',
    type: {
      typeDetail: 99,
      typeAddEdit: 1,
      typeList: 1,
      typeEditSimple: 1,
      typeSort: 1,
      typeSearchFilter: 1
    }
  },
  {
    fieldName: 'timezone_id',
    type: {
      typeDetail: 99,
      typeAddEdit: 1,
      typeList: 1,
      typeSort: 1,
      typeSearchFilter: 1
    }
  },
  {
    fieldName: 'subscription_id',
    type: {
      typeDetail: 99,
      typeAddEdit: 2,
      typeList: 2,
      typeEditSimple: 2,
      typeSort: 2,
      typeSearchFilter: 2
    }
  },
  {
    fieldName: 'option_id',
    type: {
      typeDetail: 99,
      typeAddEdit: 2,
      typeList: 2,
      typeEditSimple: 2,
      typeSort: 2,
      typeSearchFilter: 2
    }
  },
  {
    fieldName: 'employee_departments',
    type: {
      typeDetail: 99,
      typeAddEdit: 1,
      typeList: 99,
      typeEditSimple: 1,
      typeSearchFilter: 1
    }
  },
  {
    fieldName: 'employee_positions',
    type: {
      typeDetail: 99,
      typeAddEdit: 1,
      typeList: 99,
      typeEditSimple: 1,
      typeSearchFilter: 1
    }
  },
  {
    fieldName: 'employee_packages',
    type: {
      typeDetail: 99,
      typeAddEdit: 1,
      typeList: 99,
      typeEditSimple: 1,
      typeSearchFilter: 1
    }
  }
];

export const convertFieldType = (fields, option) => {
  fields.map(field => {
    data.forEach(item => {
      Object.keys(item).forEach(dataKey => {
        if (item[dataKey] === field.fieldName) {
          Object.keys(item.type).forEach(item1 => {
            if (item1 === option) {
              field.fieldType = item.type[item1];
            }
          });
        }
      });
    });
  });
  return fields;
};
