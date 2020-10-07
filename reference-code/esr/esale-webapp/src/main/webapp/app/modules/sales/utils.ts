import { Storage } from 'react-jhipster';
import _, { cloneDeep } from 'lodash';
import moment from 'moment';
import {
  getHourMinute,
  isValidTimeFormat,
  tzToUtc,
  utcToTz,
  DATE_TIME_FORMAT,
  convertDateToYYYYMMDD,
  convertDateTimeToServer,
  formatDateTime,
  autoFormatTime,
  convertDateTimeDefault,
  getDateTimeFormatString
} from 'app/shared/util/date-utils';
import { type } from 'os';
import { DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { autoFormatNumber, jsonParse, getFieldLabel } from 'app/shared/util/string-utils';
import { SHARE_GROUP_MODES, SALES_SPECIAL_LIST_FIELD } from './constants';
import * as R from 'ramda'

const queryAttr = 'data-rbd-drag-handle-draggable-id';
const queryAttrCol = 'data-rbd-droppable-id';
const queryAttrPlaceholderContext = 'data-rbd-placeholder-context-id';

export const getColorTextDynamicList = (fieldInfo, fieldColumn, rowData, fieldName, typeValue = undefined) => {
  if (!fieldInfo || !fieldColumn || !fieldName || !rowData) {
    return "";
  }

  // 1. specify field info and get forward color, backward color 
  const getFieldInfo = fieldInfo.find(f => f.fieldName === fieldName) || {};
  const { forwardColor, backwardColor } = getFieldInfo;
  
  // 2. compare field value
  let valueCurrent = rowData[fieldName];

  let valueHistory;
  if (rowData.product_trading_history) {
    valueHistory = rowData.product_trading_history[_.camelCase(fieldName)];
  }

  if (valueHistory) {
    if (typeValue === 'time') {
      valueCurrent = new Date(valueCurrent).getTime();
      valueHistory = new Date(valueHistory).getTime();
      if (valueCurrent < valueHistory) {
        return backwardColor;
      }
  
      if (valueCurrent > valueHistory) {
        return forwardColor
      }

      return "";
    }

    // For usual case
    if (valueCurrent < valueHistory) {
      return backwardColor;
    }

    if (valueCurrent > valueHistory) {
      return forwardColor
    }

    return "";
  }

  return "";
}

export const getItemInFieldColumn = (itemId, fieldColumn, prop = 'itemLabel') => {
  try {
    const fieldItem = fieldColumn.fieldItems.find(item => item.itemId.toString() === itemId.toString())
    return prop === 'itemLabel' ? getFieldLabel(fieldItem, prop) : fieldItem[prop]
  } catch (error) {
    return null
  }
}
export const getProgressItemInFieldColumn = (itemId, fieldColumn, prop = 'progressOrder') => {
  try {
    const fieldItem = fieldColumn.fieldItems.find(item => item.productTradingProgressId.toString() === itemId.toString())
    return prop === 'itemLabel' ? getFieldLabel(fieldItem, prop) : fieldItem[prop]
  } catch (error) {
    return null
  }
}

export const getColorTextDynamicList2 = ({fieldInfo, fieldName,rowData, currentValue, typeValue, fieldColumn}) => {
  if (!fieldInfo) {
    return "";
  }



  // 1. specify field info and get forward color, backward color 
  const getFieldInfo = fieldInfo.find(f => f.fieldName === fieldName) || {};
  const { forwardColor, backwardColor } = getFieldInfo;
  
  // 2. compare field value
  const convertValueToNumber = (val: string | number, isTime?):number => isTime ? +new Date(val) : Number(val);
  let history;
  if (rowData.product_trading_history) {
    history = rowData.product_trading_history;
  }
  if(!history){
    return ""
  }
  const productTradingData = jsonParse(history.productTradingData,"")
  let historyValue = productTradingData[fieldName]

  if(fieldName === SALES_SPECIAL_LIST_FIELD.productTradingProgressId){
    historyValue = history[_.camelCase(SALES_SPECIAL_LIST_FIELD.productTradingProgressId)]
    const itemOrderCurrent = getProgressItemInFieldColumn(currentValue, fieldColumn)
    const itemOrderHistory = getProgressItemInFieldColumn(historyValue, fieldColumn)
    if (itemOrderCurrent < itemOrderHistory) {
      return backwardColor || "";
    }
  
    if (itemOrderCurrent > itemOrderHistory) {
      return forwardColor || ""
    }
  
    return "";
  }


  // case pulldown single
  if(fieldColumn?.fieldItems?.length){
    const itemOrderCurrent = getItemInFieldColumn(currentValue, fieldColumn, 'itemOrder')
    const itemOrderHistory = getItemInFieldColumn(historyValue, fieldColumn, 'itemOrder')

    if (itemOrderCurrent < itemOrderHistory) {
      return backwardColor || "";
    }
  
    if (itemOrderCurrent > itemOrderHistory) {
      return forwardColor || ""
    }
  
    return "";
   

  }
  
  if(!historyValue && historyValue !== 0){
    return ""
  }
 
  if (convertValueToNumber(currentValue, !!typeValue) < convertValueToNumber(historyValue, !!typeValue)) {
    return backwardColor || "";
  }

  if (convertValueToNumber(currentValue, !!typeValue) > convertValueToNumber(historyValue, !!typeValue)) {
    return forwardColor || ""
  }

  return "";
 

}

export const renderAmountWithCurrency = (amount, currency, decimalPlace) => {
  const number = autoFormatNumber(amount && amount.toString(), decimalPlace);
  if (currency === '¥') {
    return `${currency}${number}`;
  }

  return `${number}${currency}`;
};

const getProductTradingNearest = listProductTradings => {
  if (listProductTradings) {
    const tempListProductTradings = _.cloneDeep(listProductTradings);
    tempListProductTradings.sort((elPrev, elNext) => {
      return new Date(elNext.updatedDate).valueOf() - new Date(elPrev.updatedDate).valueOf();
    });

    return tempListProductTradings[0];
  }

  return {};
};

export const isInvalidDate = date =>
  typeof date === 'string' && date.toLowerCase().includes('invalid date');

export const getJsonBName = fieldName => {
  const langCode = Storage.session.get('locale', 'ja_jp');
  const langDefault = ['en_us', 'zh_cn'];
  if (fieldName) {
    try {
      const objectName = JSON.parse(fieldName);
      return (
        objectName[langCode] ||
        objectName[langDefault[0]] ||
        objectName[langDefault[1]] ||
        fieldName
      );
    } catch (e) {
      return fieldName;
    }
  }
  return '';
};

export const isJsonString = strJson => {
  try {
    JSON.parse(strJson);
  } catch (e) {
    return false;
  }
  return true;
};

export const parseJson = (val, key) => {
  try {
    return JSON.parse(val)[key];
  } catch (e) {
    return val;
  }
};

// export const parseJsonStr = val => {
//   if (_.isString(val)) {
//     return JSON.parse(val);
//   } else {
//     return val;
//   }
// };

export const addDefaultLabel = label => {
  const labelDefault: any = {};
  labelDefault['ja_jp'] = label;
  labelDefault['en_us'] = label;
  labelDefault['zh_cn'] = label;
  return labelDefault;
};

export const checkTwoObj = (eleProgress, eleFieldInfoProgress) => {
  return (
    eleProgress.productTradingProgressId === eleFieldInfoProgress.productTradingProgressId &&
    eleProgress.progressOrder === eleFieldInfoProgress.progressOrder
  );
};

export const getFieldInfoProgressAvailable = ({ listProgress, listFieldInfoProgress }) => {
  if (listProgress && listFieldInfoProgress) {
    return _.uniqBy(
      listFieldInfoProgress.reduce((arr, el) => {
        const index = listProgress.findIndex(ele => checkTwoObj(el, ele));
        if (index !== -1) {
          arr = [
            ...arr,
            {
              productTradingProgressId: listProgress[index].productTradingProgressId,
              progressOrder: listProgress[index].progressOrder
            }
          ];
        }
        return arr;
      }, []),
      'productTradingProgressId'
    );
  }

  return [];
};

export const getDraggedDom = draggableId => {
  const domQuery = `[${queryAttr}='${draggableId}']`;
  return document.querySelector(domQuery);
};

export const getDropDom = nameDopId => {
  const domQuery = `[${queryAttrCol}='${nameDopId}']`;
  return document.querySelector(domQuery);
};

export const getDomPlaceholderContext = () => {
  const domQuery = `[${queryAttrPlaceholderContext}='0']`;
  return document.querySelector(domQuery);
};

// Process clone card in drag drop
const setAttrCloneCard = (node, { innerHTML, className, zIndex }) => {
  // if array
  if (typeof className === 'object') {
    className.forEach(classname => {
      node.classList.toggle(classname);
    });
  }
  // If string
  else {
    node.classList.toggle(className);
  }
  node.innerHTML = innerHTML;
  node.style.zIndex = zIndex;
};

export const createCloneCard = (originalDOM, cloneDOM) => {
  if (originalDOM && cloneDOM) {
    const innerHTMLOforiginalDOM = originalDOM.innerHTML;
    setAttrCloneCard(cloneDOM, {
      className: ['contents-items', 'sales-list-card__disabled'],
      zIndex: '99',
      innerHTML: innerHTMLOforiginalDOM
    });
  }
  return;
};

export const deleteCloneCard = cloneDOM => {
  if (cloneDOM) {
    setAttrCloneCard(cloneDOM, {
      className: ['contents-items', 'sales-list-card__disabled'],
      zIndex: '99',
      innerHTML: ''
    });
  }
  return;
};

export const handleScrollWhenDragging = isDragging => {
  const dragItems: any = document.querySelectorAll('.bigger-4column .item-wrap');
  if (dragItems) {
    if (isDragging) {
      dragItems.forEach(item => {
        item.classList.add('card-is-dragging');
      });
      return;
    }

    dragItems.forEach(item => {
      item.classList.remove('card-is-dragging');
    });
  }
};

export const getBoundingRectDom = dom => {
  const obj = window.getComputedStyle(dom);
  const {
    width,
    height,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight
  } = obj;

  return {
    width,
    height,
    marginTop,
    marginBottom,
    marginRight,
    marginLeft,
    paddingTop,
    paddingLeft,
    paddingBottom,
    paddingRight
  };
};

export const computedDOM = HTMLCollection => ({
  getMaxHeight() {
    let heightLargest = 0;
    /** Check and get largest height of content-item */
    HTMLCollection.forEach(node => {
      const heightOfNode = parseFloat(getBoundingRectDom(node).height);
      heightLargest = heightLargest < heightOfNode ? heightOfNode : heightLargest;
    });

    return heightLargest;
  },

  getMaxMarginTop() {
    let marginTopLargest;
    HTMLCollection.forEach(node => {
      const marginTopOfNode = parseFloat(getBoundingRectDom(node).marginTop);
      marginTopLargest = marginTopOfNode;
    });
    return marginTopLargest;
  }
});

export const filterByFieldInfoProgress = (fieldInfoProgresses, tradingList) => {
  if (tradingList && fieldInfoProgresses && fieldInfoProgresses.length > 0) {
    const listProductTradingProgressId = fieldInfoProgresses.map(el => el.productTradingProgressId);
    return tradingList.filter(ele =>
      listProductTradingProgressId.includes(ele.productTradingProgressId)
    );
  }

  return tradingList;
};

/** style for drag */
export const getStyle = (style, snapshot) => {
  if (!snapshot.isDropAnimating) {
    return style;
  }
  return {
    ...style,
    // cannot be 0, but make it super tiny
    transitionDuration: `0.001s`
  };
};

// Process data product trading list by progress
export const inititialData = (progresses, productTradingByProgress) => {
  const filterProgressIsAvailable = progresses
    .filter(p => p.isAvailable)
    .sort((a, b) => a.progressOrder - b.progressOrder);

  // Sort productTradings by date
  const sortTradingByProgressByEndPlanDate = productTradingByProgress.map(ele => {
    const newProductTradings = _.cloneDeep(ele.productTradings);
    const newProductTradingsSort = _.sortBy(newProductTradings, o => {
      return o.endPlanDate;
    });

    return {
      ...ele,
      productTradings: newProductTradingsSort
    };
  });

  // Get list ID customer
  const listIdCustomer = sortTradingByProgressByEndPlanDate.reduce((arr, ele) => {
    if (ele.productTradings) {
      ele.productTradings.forEach(prod => {
        arr = [...arr, prod.customerId];
      });
    }

    return _.uniq(arr);
  }, []);

  const mapProductTradingWithProgress = filterProgressIsAvailable.map(progress => {
    let customers = [];

    // Filter By Customer ID
    for (let i = 0; i < sortTradingByProgressByEndPlanDate.length; i++) {
      const progressObj = {};
      if (sortTradingByProgressByEndPlanDate[i].productTradings) {
        listIdCustomer.forEach(id => {
          progressObj[id] = sortTradingByProgressByEndPlanDate[i].productTradings.filter(
            el => el.customerId === id
          );
        });

        sortTradingByProgressByEndPlanDate[i].customers = _.pickBy(
          progressObj,
          (val): any => !_.isEmpty(val)
        );
      }
    }

    for (let i = 0; i < sortTradingByProgressByEndPlanDate.length; i++) {
      if (_.isEqual(sortTradingByProgressByEndPlanDate[i].progressName, progress.progressName)) {
        customers = sortTradingByProgressByEndPlanDate[i].customers;
      }
    }
    return {
      ...progress,
      customers
    };
  });

  const mapProductTradingWithInfoCustomer = mapProductTradingWithProgress.map(ele => {
    let totalProductTrading = 0;
    let totalQuantity = 0;
    let totalPrice = 0;
    let totalAmount = 0;
    let productName = '';

    if (ele.customers) {
      const infoCustomer = {};
      Object.entries(ele.customers).forEach((entry: any) => {
        const customerId = entry[0];
        const listTradingOfCustomer = entry[1];

        let listEndDateEachProgress = [];
        let listEmployeeEachProgress = [];
        let totalQuantityEachProgress = 0;
        let totalAmountEachProgress = 0;
        let totalPriceEachProgress = 0;
        let productNameEachProgress = '';

        totalProductTrading = totalProductTrading + listTradingOfCustomer.length;

        listTradingOfCustomer.forEach(product => {
          totalPrice = totalPrice + product.price;
          totalPriceEachProgress = totalPriceEachProgress + product.price;

          totalQuantity = totalQuantity + product.quantity;
          totalQuantityEachProgress = totalQuantityEachProgress + product.quantity;

          totalAmount = totalAmount + product.amount;
          totalAmountEachProgress = totalAmountEachProgress + product.amount;

          listEndDateEachProgress = [...listEndDateEachProgress, product.endPlanDate];

          const employee = product.employee || {};

          listEmployeeEachProgress = _.uniqBy(
            [
              ...listEmployeeEachProgress,
              {
                employeeName: employee.employeeName,
                employeeId: employee.employeeId,
                photoFilePath: employee.photoFilePath,
                departmentName: employee.departmentName,
                positionName: employee.positionName,
                employeeSurnameKana: employee.employeeSurnameKana,
                employeeSurname: employee.employeeSurname,
                employeeNameKana: employee.employeeNameKana,
                cellphoneNumber: employee.cellphoneNumber,
                telephoneNumber: employee.telephoneNumber,
                email: employee.email
              }
            ],
            'employeeId'
          );

          productName = product.productName;
          productNameEachProgress = product.productName;
        });

        if (listEndDateEachProgress.length > 0) {
          listEndDateEachProgress = listEndDateEachProgress.map(d => moment(d));
        }

        // (p.minEndPlanDate = moment.min(listEndDateEachProgress)),
        //   (p.maxEndPlanDate = moment.max(listEndDateEachProgress)),
        //   (p.totalQuantity = totalQuantityEachProgress);
        // p.totalPrice = totalPriceEachProgress;
        // p.totalAmount = totalAmountEachProgress;
        // p.listEmployee = _.uniqBy(listEmployeeEachProgress, 'employeeId');
        // p.productName = productNameEachProgress;

        infoCustomer[customerId] = {
          totalPrice: totalPriceEachProgress,
          totalAmount: totalAmountEachProgress,
          totalQuantity: totalQuantityEachProgress,
          totalProductTrading,
          listEmployee: listEmployeeEachProgress.filter(employee => !!employee.employeeId),
          minEndPlanDate: moment.min(listEndDateEachProgress),
          maxEndPlanDate: moment.max(listEndDateEachProgress)
        };
      });

      ele.infoCustomer = infoCustomer;
    }

    return {
      ...ele,
      totalProductTrading,
      totalQuantity,
      totalPrice,
      totalAmount,
      productName
    };
  });

  return mapProductTradingWithInfoCustomer.map(el => {
    let customers = [];
    Object.entries(el.customers).forEach(entry => {
      let tempObj = {};
      const customerId = entry[0];
      const listProductTradings: any = entry[1];
      const customerName =
        listProductTradings.length > 0 ? listProductTradings[0].customerName : '';

      tempObj = {
        customerId,
        ...el.infoCustomer[customerId],
        productTradings: listProductTradings,
        customerName
      };

      customers = [...customers, tempObj];
    });

    el.customers = customers;
    return el;
  });
};

// Map color - Call this after initial Data
export const mapColorWithFieldInfo = (tradingList, fieldInfo, progresses) => {
  const findFieldInfoByFieldName = (fName) => R.find(R.propEq('fieldName', fName), fieldInfo) || {}
  const result = tradingList.map(el => {
    el.customers.forEach(customer => {
      /** Fill color each customer */
      let colorCustomer = '';
      // Get the nearest setting date
      const productTradingNearest = getProductTradingNearest(customer.productTradings);

      // Process color customer
      const { productTradingHistory } = productTradingNearest;
      if (productTradingHistory) {
        const productTradingOrderPrev = progresses.find(
          progress =>
            productTradingHistory.productTradingProgressId === progress.productTradingProgressId
        )?.progressOrder;
        const productTradingOrderCurrent = productTradingNearest?.progressOrder || '';
        if (productTradingOrderPrev && productTradingOrderCurrent) {
          // get field UpdateDate to get color
          // fieldId = 181 <=> fieldName: created_date
          // const fieldUpdatedDate = fieldInfo.find(field => field.fieldId === 181) || {};
          const productTradingProgressField = findFieldInfoByFieldName(SALES_SPECIAL_LIST_FIELD.productTradingProgressId)
          const { backwardColor, forwardColor } = productTradingProgressField;
          
          if (productTradingOrderPrev < productTradingOrderCurrent) {
            colorCustomer = forwardColor;
          } else if (productTradingOrderPrev > productTradingOrderCurrent) {
            colorCustomer = backwardColor;
          }
        }
      }
      
      customer.colorCustomer = colorCustomer;
      /** End Fill color each customer */

      // Process color each product trading
      customer.productTradings.forEach(product => {
        const colorOfItem = {
          endPlanDate: '',
          amount: ''
        };
        // Process get color
        // fieldId = 178 <=> fieldName: end_plan_date
        // fieldId = 175 <=> fieldName: amount
        const fieldEndPlandDate = findFieldInfoByFieldName(SALES_SPECIAL_LIST_FIELD.endPlanDate)
        const fieldAmount = findFieldInfoByFieldName(SALES_SPECIAL_LIST_FIELD.amount)
        // const listFieldName = Object.keys(product).map(name => _.camelCase(name));
        // const fieldHaveColor = fieldInfo
        // .filter(f => {
        //   return listFieldName.includes(_.camelCase(f.fieldName));
        // })
        // .map(f => ({ ...f, fieldName: _.camelCase(f.fieldName)}));
        // console.log({ listFieldName });
        // console.log({ fieldHaveColor });
        
        // Put to product
        if (product.productTradingHistory) {
          if (
            new Date(product.endPlanDate).getTime() >
            new Date(product.productTradingHistory.endPlanDate).getTime()
          ) {
            colorOfItem.endPlanDate = fieldEndPlandDate.forwardColor;
          } else if (
            new Date(product.endPlanDate).getTime() <
            new Date(product.productTradingHistory.endPlanDate).getTime()
          ) {
            colorOfItem.endPlanDate = fieldEndPlandDate.backwardColor;
          }

          if (product.amount > product.productTradingHistory.amount) {
            colorOfItem.amount = fieldAmount.forwardColor;
          } else if(product.amount < product.productTradingHistory.amount ) {
            colorOfItem.amount = fieldAmount.backwardColor;
          }
        }

        product.colorOfItem = colorOfItem;
        // product.colorOfItem = fieldHaveColor
        //   .map(colorElement => {
        //     const tempObj: any = {};
        //     if (product.productTradingHistory) {
        //       let text = '';
        //       let color = '';
        //       if (product[colorElement.fieldName] <= product.productTradingHistory[colorElement.fieldName]) {
        //         text = colorElement.forwardText;
        //         color = colorElement.forwardColor;
        //       } else {
        //         text = colorElement.backwardText;
        //         color = colorElement.backwardColor;
        //       }
        //       tempObj.text = text;
        //       tempObj.color = color;
        //       tempObj.fieldName = colorElement.fieldName;
        //     }

        //     return tempObj;
        //   })
        //   // Map list color to key and value
        //   .reduce((obj, ele) => {
        //     if (ele.fieldName) {
        //       obj[ele.fieldName] = ele;
        //     }

        //     return obj;
        //   }, {});
      });

      // Case ProductTrading have 1 element
      if (typeof customer.productTradings === 'object' && customer.productTradings.length <= 1) {
        customer.colorCustomerText = customer.productTradings[0].colorOfItem;
      }
    });

    return el;
  });

  return result
};

// Handle data For update sale list
export const correctParamsToUpdateProductTrading = list => {
  const parseDate = date =>
    date && convertDateTimeToServer(date, getDateTimeFormatString(DATE_TIME_FORMAT.User));
  return list.map(el => {
    const endPlanDate = parseDate(el.endPlanDate);
    const orderPlanDate = parseDate(el.orderPlanDate);

    return {
      productTradingId: Number(el.productTradingId),
      productId: el.productId,
      quantity: Number(el.quantity),
      price: Number(el.price),
      amount: Number(el.amount),
      employeeId: el.employeeId,
      endPlanDate,
      orderPlanDate,
      productTradingProgressId: Number(el.productTradingProgressId),
      memo: el.memo,
      // contactDate
      // activityId
      productTradingData: el.productTradingData
    };
  });
};

const objToArray = obj => {
  return Object.keys(obj).map(productId => {
    const newObj = {
      ...obj[productId]
    };
    // newObj['product_id'] = productId;
    newObj['product_trading_id'] = productId;
    return newObj;
  });
};

const convertKeyToCamelCase = obj => {
  let tempObj = {};
  Object.entries(obj).forEach(eachKeyValue => {
    tempObj = {
      ...tempObj,
      [_.camelCase(eachKeyValue[0])]: eachKeyValue[1]
    };
  });
  return tempObj;
};

const convertProductTradingToCamelCase = list => {
  let arr = [];
  list.forEach(item => {
    arr = [...arr, convertKeyToCamelCase(item)];
  });
  return arr;
};

export const mapFieldAndMergeToProductTradingList = ({
  saveEditValues,
  fieldInfos,
  productTradingList,
  saveProductChangeProgress
}) => {
  // Step 1: map field in personal with field info
  const mapFieldIdInFieldInfo = saveEditValues.reduce((obj, ele) => {
    fieldInfos.forEach(field => {
      if (ele.fieldId === field.fieldId && field.isDefault) {
        obj[ele.itemId] = {
          ...obj[ele.itemId],
          [field.fieldName]: ele.itemValue
        };
      }
    });
    return obj;
  }, {});

  // Step 2: split and get dynamic field
  let productTradingData = [];
  const mapDynamicField = saveEditValues.reduce((obj, ele) => {
    fieldInfos.forEach(field => {
      let tempObj = {};
      if (ele.fieldId === field.fieldId && !field.isDefault) {
        tempObj = {
          id: ele.itemId,
          key: field.fieldName,
          fieldType: field.fieldType,
          // fix error 500 update product trading
          value:
            _.isUndefined(ele.itemValue) ||
            _.isNull(ele.itemValue) ||
            _.isString(ele.itemValue) ||
            _.isNumber(ele.itemValue)
              ? ele.itemValue
              : JSON.stringify(ele.itemValue)
        };
        productTradingData = [...productTradingData, tempObj];
      }
    });

    if (productTradingData.length > 0) {
      obj[ele.itemId] = productTradingData
        .filter(item => item.id === ele.itemId)
        .map(item => ({
          fieldType: item.fieldType,
          key: item.key,
          // fieldType: 6 is date field
          // update date time field
          value: item.value
        }));
    }

    return obj;
  }, {});

  // Step 3: merge field which not dynamic field
  let listProductTradingEdited
  if(objToArray(mapFieldIdInFieldInfo).length > 0){
    listProductTradingEdited = objToArray(mapFieldIdInFieldInfo);
  }else {
    listProductTradingEdited = objToArray(mapDynamicField)
  }

  const productTradingListAfterMerge = productTradingList.reduce((arr, ele) => {
    const index = listProductTradingEdited.findIndex(p => {
      return _.toString(p['product_trading_id']) === _.toString(ele['product_trading_id']);
    });
    if (index !== -1) {
      arr = [...arr, { ...ele, ...listProductTradingEdited[index] }];
    }
    return arr;
  }, []);

  // Step 4 merge dynamic
  const productTradingListAfterMergeDynamicField = productTradingListAfterMerge.reduce(
    (arr, ele) => {
      // if product have dynamic field > add field productTradingData
      if (
        mapDynamicField[ele['product_trading_id']] &&
        mapDynamicField[ele['product_trading_id']].length > 0
      ) {
        arr = [...arr, { ...ele, productTradingData: mapDynamicField[ele['product_trading_id']] }];
      } else {
        arr = [...arr, { ...ele, productTradingData: [] }];
      }
      return arr;
    },
    []
  );

  // step 5 change progress id

  const productTradingListAfterChangeProgress = productTradingListAfterMergeDynamicField.map(
    elm => {
      const index = saveProductChangeProgress.findIndex(
        item => item.itemId.toString() === elm.product_trading_id.toString()
      );
      if (index > -1) {
        return {
          ...elm,
          productTradingProgressId: saveProductChangeProgress[index].itemValue
        };
      } else {
        return { ...elm };
      }
    }
  );
  return convertProductTradingToCamelCase(productTradingListAfterChangeProgress);
};

export const trimString = (string, length) => {
  if (string) {
    return string.length > length ? string.substring(0, length) + '...' : string;
  }
};

// Progress drag child card
const reCalculateCustomers = customers => {
  if (customers) {
    return customers.map(el => {
      let totalPrice = 0;
      let totalAmount = 0;
      let totalQuantity = 0;
      let listEmployeeEachProgress = [];
      let listEndDateEachProgress = [];

      el.productTradings.forEach(product => {
        totalPrice = totalPrice + product.price;

        totalQuantity = totalQuantity + product.quantity;

        totalAmount = totalAmount + product.amount;
        listEndDateEachProgress = [...listEndDateEachProgress, product.endPlanDate];
        listEmployeeEachProgress = _.uniqBy(
          [
            ...listEmployeeEachProgress,
            {
              employeeName: product.employeeName,
              employeeId: product.employeeId,
              photoFilePath: product.photoFilePath,
              departmentName: product.departmentName,
              positionName: product.positionName,
              employeeSurnameKana: product.employeeSurnameKana,
              employeeSurname: product.employeeSurname,
              employeeNameKana: product.employeeNameKana,
              cellphoneNumber: product.cellphoneNumber,
              telephoneNumber: product.telephoneNumber,
              email: product.email
            }
          ],
          'employeeId'
        );
      });

      if (listEndDateEachProgress.length > 0) {
        listEndDateEachProgress = listEndDateEachProgress.map(d => moment(d));
      }

      return {
        ...el,
        totalPrice,
        totalAmount,
        totalQuantity,
        listEmployee: listEmployeeEachProgress,
        minEndPlanDate: moment.min(listEndDateEachProgress),
        maxEndPlanDate: moment.max(listEndDateEachProgress)
      };
    });
  }
  return [];
};

const reCalculateColDestination = (columnCustomer, listCustomers) => {
  const tempCustomters = cloneDeep(listCustomers);
  const tempColCustomer = cloneDeep(columnCustomer);

  const listCustomerReCal = reCalculateCustomers(tempCustomters);
  let totalAmount = 0;
  let totalPrice = 0;
  let totalQuantity = 0;
  listCustomerReCal.forEach(customer => {
    totalAmount = customer.totalAmount;
    totalPrice = customer.totalPrice;
    totalQuantity = customer.totalQuantity;
  });

  return {
    ...tempColCustomer,
    customers: listCustomerReCal,
    totalAmount,
    totalPrice,
    totalQuantity,
    expand: columnCustomer.expand
  };
};

const convertProductToCustomer = trading => {
  const customerId = trading.customerId;
  const totalAmount = trading.amount;
  const totalPrice = trading.price;
  const totalQuantity = trading.quantity;
  const endPlanDate = trading.endPlanDate;

  const listEmployee = [
    {
      employeeName: trading.employeeName,
      employeeId: trading.employeeId,
      photoFilePath: trading.photoFilePath,
      departmentName: trading.departmentName,
      positionName: trading.positionName,
      employeeSurnameKana: trading.employeeSurnameKana,
      employeeSurname: trading.employeeSurname,
      employeeNameKana: trading.employeeNameKana,
      cellphoneNumber: trading.cellphoneNumber,
      telephoneNumber: trading.telephoneNumber,
      email: trading.email
    }
  ];

  return {
    customerId: Number(customerId),
    totalAmount,
    totalPrice,
    totalQuantity,
    productTradings: [trading],
    maxEndPlanDate: moment(endPlanDate),
    minEndPlanDate: moment(endPlanDate),
    listEmployee
  };
};

export const progressDragTrading = (colDestination, itemTrading) => {
  let nextColDestination = cloneDeep(colDestination);
  let nextCustomers = cloneDeep(colDestination.customers);
  const indexOfItemTrading = nextCustomers.findIndex(
    el => el.customerId.toString() === itemTrading.customerId.toString()
  );

  // merge
  if (indexOfItemTrading !== -1) {
    nextCustomers[indexOfItemTrading].productTradings = [
      ...nextCustomers[indexOfItemTrading].productTradings,
      itemTrading
    ];
    nextCustomers = reCalculateCustomers(nextCustomers);
    nextColDestination = reCalculateColDestination(nextColDestination, nextCustomers);
  } else {
    nextColDestination.customers = [
      ...nextColDestination.customers,
      convertProductToCustomer(itemTrading)
    ];
  }

  return nextColDestination;
};

export const parseSearchConditions = (data, groupMode, productTradingListDetailId) => {
  if (!data || !data.length) return [];
  const tmpConditions = [];
  data.map(item => {
    const val = [];
    if (item.isSearchBlank) {
      const _result = {
        fieldId: parseInt(item.fieldId, 0),
        searchType: null,
        searchOption: null,
        searchValue: [{}]
      };
      tmpConditions.push(_result);
      return;
    }
    if (!item.isSearchBlank && (_.isNil(item.fieldValue) || item.fieldValue === '')) {
      return;
    }
    if (Array.isArray(item.fieldValue)) {
      item.fieldValue.forEach((element, idx) => {
        if (
          // item.fieldType.toString() === DEFINE_FIELD_TYPE.NUMERIC.toString() ||
          item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE_TIME.toString() ||
          item.fieldType.toString() === DEFINE_FIELD_TYPE.DATE.toString() ||
          item.fieldType.toString() === DEFINE_FIELD_TYPE.TIME.toString()
        ) {
          val.push({ key: 'from', value: element.from });
          val.push({ key: 'to', value: element.to });
        } else {
          if (item.fieldValue.length > 1) {
            val.push({ key: idx.toString(), value: element });
          } else {
            val.push({ key: '1', value: element });
          }
        }
      });
    } else {
      val.push({ key: '1', value: item.fieldValue });
    }
    const result = {
      fieldId: parseInt(item.fieldId, 0),
      searchType: parseInt(item.searchType, 0) || (item && item.searchModeDate),
      searchOption: parseInt(item.searchOption, 0),
      // fieldOrder: parseInt(item.fieldOrder, 0),
      searchValue: val
    };
    if (
      groupMode === SHARE_GROUP_MODES.MODE_EDIT_GROUP ||
      groupMode === SHARE_GROUP_MODES.MODE_SWICH_GROUP_TYPE
    ) {
      result['productTradingListDetailId'] = productTradingListDetailId;
    }
    // if (isDirty) {
    //   const tmp = {
    //     fieldType: parseInt(item.fieldType, 0)
    //   };
    //   result = { ...result, ...tmp };
    // }
    tmpConditions.push(result);
  });
  return tmpConditions;
};
