import React, { useState, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect, Options } from 'react-redux';
import _ from 'lodash';
import { useId } from 'react-id-generator';
import {
  reset,
  getProductSuggestions,
  getEmployeeSuggestions,
  getCustomerSuggestions,
  getProductTradingSuggestions,
  getMilestoneSuggestions,
  getTaskSuggestions,
  getBusinessCardSuggestions,
  saveSuggestionsChoice,
  saveSuggestionListChoice,
  TagAutoCompleteAction,
  handleGetEmployeeList,
  handleGetProductList,
  handleGetMilestoneList,
  handleGetProductTradingList,
  handleGetTaskList,
  handleGetCustomerList,
  handleGetBusinessCardList,
  handleGetEmployeeLayout
} from './tag-auto-complete.reducer';
import useEventListener from 'app/shared/util/use-event-listener';
import moment from 'moment';

import {
  AvatarColor,
  TagAutoCompleteType,
  TagAutoCompleteMode,
  SearchType,
  IndexSaveSuggestionChoice,
  TagAutoCompletePostMessageAction
} from "app/shared/layout/common/suggestion/constants";
import ModalCreateEditEmployee from 'app/modules/employees/create-edit/modal-create-edit-employee';
import { EMPLOYEE_VIEW_MODES, EMPLOYEE_ACTION_TYPES } from '../../../../modules/employees/constants';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search';
import { FIELD_BELONG, SCREEN_TYPES, USER_FORMAT_DATE_KEY, APP_DATE_FORMAT, AUTHORITIES } from 'app/config/constants';
import useDebounce from '../../../util/useDebounce'
import SuggestEmployee from './tag-auto-complete-employee/suggest-employee';
import SuggestCustomer from './tag-auto-complete-customer/suggest-customer';
import ResultSingleProduct from './tag-auto-complete-product/result-multi-product';
import SuggestProduct from './tag-auto-complete-product/suggest-product';
import SuggestProductTrading from './tag-auto-complete-product-tradding/suggest-product-tradding';
import ResultMultiProductTrading from './tag-auto-complete-product-tradding/result-multi-product-tradding';
import { Storage, translate } from 'react-jhipster';
import FieldsSearchResults from './list-result/fields-search-result'
import SuggestMilestone from './tag-auto-complete-milestone/suggest-milestone';
import ResultSingleMilestone from './tag-auto-complete-milestone/result-single-milestone';
import ResultSingleCustomer from './tag-auto-complete-customer/result-single-customer';
import ModalCreateEditProduct from 'app/modules/products/product-popup/product-edit';
import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { PRODUCT_ACTION_TYPES } from 'app/modules/products/constants';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import SelectedItem, { ITEM_FORMATS } from './item/selected-item';
import { moveToScreen } from 'app/shared/reducers/screen-move.reducer';
import { TASK_ACTION_TYPES, TASK_VIEW_MODES } from 'app/modules/tasks/constants';
import { isMouseOnRef } from 'app/shared/util/utils';
import ResultMultiMilestone from './tag-auto-complete-milestone/result-multi-milestone';
import SuggestTask from './tag-auto-complete-task/suggest-task';
import ResultSingleTask from './tag-auto-complete-task/result-single-task';
import ResultMultiTask from './tag-auto-complete-task/result-multi-task';
import ModalCreateEditCustomer from 'app/modules/customers/create-edit-customer/create-edit-customer-modal';
import CreateEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import { BUSINESS_CARD_ACTION_TYPES, BUSINESS_CARD_VIEW_MODES } from 'app/modules/businessCards/constants';
import { CUSTOMER_ACTION_TYPES, CUSTOMER_VIEW_MODES } from 'app/modules/customers/constants';
import dateFnsFormat from 'date-fns/format';
import ResultMultiCustomer from './tag-auto-complete-customer/result-multi-customer';
import ResultMultiBusinessCard from './tag-auto-complete-business-card/result-multi-business-card';
import ResultSingleBusinessCard from './tag-auto-complete-business-card/result-single-business-card';
import SuggestBusinessCard from './tag-auto-complete-business-card/suggest-business-card';
import PopupEmployeeDetail from "app/modules/employees/popup-detail/popup-employee-detail";
import { toKatakana } from 'app/shared/util/string-utils';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { isJsonString } from 'app/modules/products/utils';

interface ITagAutoCompleteDispatchProps {
  reset,
  getProductSuggestions,
  getProductTradingSuggestions,
  getEmployeeSuggestions,
  getCustomerSuggestions,
  getMilestoneSuggestions,
  getTaskSuggestions,
  getBusinessCardSuggestions,
  saveSuggestionsChoice,
  saveSuggestionListChoice,
  handleGetEmployeeList,
  handleGetProductList,
  handleGetMilestoneList,
  handleGetEmployeeLayout,
  handleGetProductTradingList,
  handleGetTaskList,
  handleGetCustomerList,
  handleGetBusinessCardList,
  moveToScreen
}

interface ITagAutoCompleteStateProps {
  action,
  products,
  tradingProducts,
  employees,
  customers,
  tasks,
  businessCards,
  employeeLayout,
  milestones,
  errorMessage,
  errorItems,
  isAdmin
}

interface ITagAutoCompleteOwnProps {
  id: any,
  className?: string,
  inputClass?: string,
  validMsg?: string,
  title?: string,
  placeholder?: string,
  type: TagAutoCompleteType,
  modeSelect: TagAutoCompleteMode,
  isHideResult?: boolean,
  isRequired?: boolean,
  elementTags?: any[],
  listActionOption?: { id, name }[],
  isDisabled?: boolean,
  disableTag?: boolean,
  tagSearch?: boolean,
  searchType?: SearchType,
  onActionOptionTag?: (tag, actionId) => void,
  onActionSelectTag?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => void,
  onActionSuggestLeft?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, param?: any) => void
  onActionSuggestRight?: (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, param?: any) => void,
  isFocusInput?: boolean,
  isShowOnList?: boolean,
  onRemoveTag?: () => void,
  backTab?: (orderIndex) => void,
  itemfieldOrder?: any,
  handleDirtyCheck?: () => void,
  isProdSet?: boolean,
  tagListNotSuggestion?: any[],
  hiddenActionRight?: boolean
  lstChoice?: any[],
  onlyShowEmployees?: boolean,
  customerIds?: any[], // customer Ids for product trading suggest search
  onChangeText?: (text) => void,
  maxLength?: number,
  isDisabledPreView?: boolean,
  isHoldTextInput?: boolean, // if isHoldTextInput is TRUE then don't delete input text of input tag when click outside
  textInputValue?: any, // if init component, pulldown don't show when isHoldTextInput is true
  listItemChoise?: any[], // in addition to the selected results, you can receive Input from outside to remove more desired results
  isShowAddText?: boolean, // if true, show button add text. 
  validateBeforeRemoveTag?: () => boolean, // validate before remove tag
  customerIdChoice?: number, // customer id for customer relation suggest search
  autoFocusCustomer?: boolean // if autoFocusCustomer is True, then auto Select Customer if customerName mapping 
  tagCallback?: any
}

type ITagAutoCompleteProps = ITagAutoCompleteDispatchProps & ITagAutoCompleteStateProps & ITagAutoCompleteOwnProps;

const TagAutoComplete: React.FC<ITagAutoCompleteProps> = forwardRef((props, ref) => {
  const idInputList = useId(1, "Tag_AutoComplete_");
  const [tags, setTags] = useState([]);
  const [textValue, setTextValue] = useState(props.textInputValue ? props.textInputValue : '');
  const [searchValue] = useState('');
  const [listSuggest, setListSuggest] = useState([]);
  const bodyRef = useRef(null);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);
  const autoCompleteRef = useRef(null);
  const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [openModalMilestone, setOpenModalMilestone] = useState(false);
  const [openModalTask, setOpenModalTask] = useState(false);
  const [openModalCustomer, setOpenModalCustomer] = useState(false);
  const [openModalCBussinessCards, setOpenModalCBussinessCards] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const debouncedTextValue = useDebounce(textValue, 500);
  const [showSuggest, setShowSuggest] = useState(false);
  const [openPopupSearchResult, setOpenPopupSearchResult] = useState(false);
  const [iconFunction, setIconFunction] = useState('');
  const [fieldNameExtension, setFieldNameExtension] = useState('employee_data');
  const [fieldBelong, setFieldBelong] = useState(FIELD_BELONG.EMPLOYEE);
  const singleTypeDisableInput = props.modeSelect === TagAutoCompleteMode.Single && tags.length > 0;
  const [mousemoveInput, setMouseMoveInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const [tagListNotSuggestion, setTagListNotSuggestion] = useState(props.tagListNotSuggestion ? props.tagListNotSuggestion : []);
  const [isHover, changeIsHover] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [customerIds, setCustomerIds] = useState([]);
  const [employeeIdDetail, setEmployeeIdDetail] = useState(null);
  const [openPopupEmployeeDetail, setOpenPopupEmployeeDetail] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const employeeEditCtrlId = useId(1, "tagautoEmployeeEditCtrlId_");
  const employeeDetailCtrlId = useId(1, "tagautoEmployeeDetail_")

  const dateFormat = Storage.session.get(USER_FORMAT_DATE_KEY, APP_DATE_FORMAT);

  useEffect(() => {
    switch (props.type) {
      case TagAutoCompleteType.Product:
        setIconFunction('ic-sidebar-product.svg');
        setFieldBelong(FIELD_BELONG.PRODUCT);
        setFieldNameExtension('product_data');
        break;
      case TagAutoCompleteType.ProductTrading:
        setIconFunction('ic-sidebar-sales.svg');
        setFieldBelong(FIELD_BELONG.PRODUCT_TRADING);
        setFieldNameExtension('product_trading_data');
        break;
      case TagAutoCompleteType.Employee:
        setIconFunction("ic-sidebar-employee.svg");
        setFieldBelong(FIELD_BELONG.EMPLOYEE);
        setFieldNameExtension('employee_data');
        break;
      case TagAutoCompleteType.Customer:
        setIconFunction("ic-sidebar-customer.svg");
        setFieldBelong(FIELD_BELONG.CUSTOMER);
        setFieldNameExtension('customer_data');
        break;
      case TagAutoCompleteType.Milestone:
        setIconFunction("task/ic-flag-brown.svg");
        setFieldBelong(FIELD_BELONG.MILE_STONE);
        setFieldNameExtension('milestone_data');
        break;
      case TagAutoCompleteType.Task:
        setIconFunction("ic-task-brown.svg");
        setFieldBelong(FIELD_BELONG.TASK);
        setFieldNameExtension('task_data');
        break;
      case TagAutoCompleteType.BusinessCard:
        setIconFunction("ic-sidebar-business-card.svg");
        setFieldBelong(FIELD_BELONG.BUSINESS_CARD);
        setFieldNameExtension('business_card_data');
        break;
      default:
        break;
    }
    return () => {
      props.reset(props.id);
    }
  }, []);

  useEffect(() => {
    if (props.elementTags) {
      setTags(props.elementTags);
    }
  }, [props.elementTags])

  useEffect(() => {
    if (props.customerIds) {
      setCustomerIds(props.customerIds);
    }
  }, [props.customerIds])

  useEffect(() => {
    setIsDisabled(props.isDisabled);
  }, [props.isDisabled])

  useEffect(() => {
    if ((props.type === TagAutoCompleteType.ProductTrading || props.type === TagAutoCompleteType.BusinessCard) && props.elementTags) {
      setTags(props.elementTags);
    }
  }, [props.elementTags])

  const getListChoice = (type) => {
    let listChoice = [];
    switch (type) {
      case TagAutoCompleteType.Employee:
        tags.forEach(e => {
          let searchType = 0;
          let idChoice = 0;
          if (e.employeeId) {
            searchType = 2;
            idChoice = e.employeeId;
          } else if (e.departmentId) {
            searchType = 1;
            idChoice = e.departmentId;
          } else if (e.groupId) {
            searchType = 3;
            idChoice = e.groupId;
          }
          listChoice.push({ idChoice, searchType });
        });
        if (props.listItemChoise) {
          props.listItemChoise.forEach(ele => {
            let searchType = 0;
            let idChoice = 0;
            if (ele.employeeId) {
              searchType = 2;
              idChoice = ele.employeeId;
            } else if (ele.departmentId) {
              searchType = 1;
              idChoice = ele.departmentId;
            } else if (ele.groupId) {
              searchType = 3;
              idChoice = ele.groupId;
            }
            listChoice.push({ idChoice, searchType });
          });
        }
        break;
      case TagAutoCompleteType.Customer:
        listChoice = tags.map(e => e.customerId);
        if (props.customerIdChoice) {
          listChoice.push(props.customerIdChoice);
        }
        break;
      case TagAutoCompleteType.Product:
        if (!props.isProdSet) {
          listChoice = tags.map(e => e.productId);
        } else {
          listChoice = props.lstChoice.map(e => e.productId);
        }
        break;
      case TagAutoCompleteType.ProductTrading:
        listChoice = tags.map(e => e.productTradingId);
        break;
      case TagAutoCompleteType.Milestone:
        listChoice = tags.map(e => e.milestoneId);
        break;
      case TagAutoCompleteType.Task:
        listChoice = tags.map(e => e.taskId);
        break;
      case TagAutoCompleteType.BusinessCard:
        listChoice = tags.map(e => e.businessCardId);
        break;
      default:
        break;
    }
    // set list not suggestion
    tagListNotSuggestion && tagListNotSuggestion.forEach(e => {
      listChoice.push({ idChoice: e.idChoice, searchType: e.searchType });
    });
    return listChoice;
  }

  const getSuggestions = (isGetMoreData) => {
    const offSet = isGetMoreData ? offset + 10 : 0;
    if (offset === offSet && isGetMoreData) {
      return;
    }
    setIsScroll(isGetMoreData);
    setOffset(offSet);
    if (isGetMoreData || offset > 10) {
      setIsLoading(true);
    }
    switch (props.type) {
      case TagAutoCompleteType.Product:
        props.getProductSuggestions(props.id, textValue.trim(), offSet, getListChoice(TagAutoCompleteType.Product));
        break;
      case TagAutoCompleteType.ProductTrading:
        props.getProductTradingSuggestions(props.id, textValue.trim(), offSet, getListChoice(TagAutoCompleteType.ProductTrading), customerIds);
        break;
      case TagAutoCompleteType.Customer:
        props.getCustomerSuggestions(props.id, textValue ? textValue.trim() : "", offSet, getListChoice(TagAutoCompleteType.Customer));
        break;
      case TagAutoCompleteType.Employee:
        props.getEmployeeSuggestions(props.id, textValue ? textValue.trim() : "", "", "", props.searchType ? props.searchType : null, offSet, getListChoice(TagAutoCompleteType.Employee));
        break;
      case TagAutoCompleteType.Milestone:
        props.getMilestoneSuggestions(props.id, textValue.trim(), offSet, getListChoice(TagAutoCompleteType.Milestone));
        break;
      case TagAutoCompleteType.Task:
        props.getTaskSuggestions(props.id, textValue.trim(), offSet, getListChoice(TagAutoCompleteType.Task));
        break;
      case TagAutoCompleteType.BusinessCard:
        props.getBusinessCardSuggestions(props.id, textValue.trim(), offSet, getListChoice(TagAutoCompleteType.BusinessCard), customerIds);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    // return when initialization
    if (!debouncedTextValue) {
      return;
    }
    if (textValue && textValue.length > 1 || textValue === "") {
      getSuggestions(false);
    }
  }, [debouncedTextValue])

  if (props.isFocusInput && inputRef && inputRef.current) {
    inputRef.current.focus();
  }

  useEffect(() => {
    if (props.type === TagAutoCompleteType.Employee) {
      props.handleGetEmployeeLayout(props.id, null);
    }
  }, [props.type])

  const setListSuggestProductTrading = () => {
    let tmp = [];
    if (props.tradingProducts) {
      tmp.push(...props.tradingProducts);
    }
    if (isScroll) {
      listSuggest.push(...tmp);
    } else {
      if (_.isEmpty(textValue) && tmp.length > 0) {
        const tradingProductsNull = tmp.filter(pro => !pro.idHistoryChoice);
        let tradingProductsNotNull = tmp.filter(pro => pro.idHistoryChoice);
        tmp = [];
        tradingProductsNotNull = _.sortBy(tradingProductsNotNull, ['idHistoryChoice']);
        _.reverse(tradingProductsNotNull);
        tmp.push(...tradingProductsNotNull);
        tmp.push(...tradingProductsNull);
      }
      setListSuggest(tmp);
    }
  }

  useEffect(() => {
    setIsLoading(false);
    if (props.type === TagAutoCompleteType.Product) {
      const tmp = [];
      if (props.products) {
        tmp.push(...props.products);
      }
      if (isScroll) {
        listSuggest.push(...tmp);
      } else {
        setListSuggest(tmp);
      }
    }
  }, [props.products]);

  useEffect(() => {
    setIsLoading(false);
    if (props.type === TagAutoCompleteType.ProductTrading) {
      setListSuggestProductTrading();
    }
  }, [props.tradingProducts])

  useEffect(() => {
    setIsLoading(false);
    if (props.type === TagAutoCompleteType.Employee) {
      let tmp = [];
      if (props.employees && props.employees.total) {
        setTotal(props.employees.total)
      }
      if (props.employees && props.employees.employees) {
        tmp.push(...props.employees.employees);
      }
      if (props.employees && props.employees.departments) {
        tmp.push(...props.employees.departments);
      }
      if (props.employees && props.employees.groups) {
        tmp.push(...props.employees.groups);
      }
      if (isScroll) {
        listSuggest.push(...tmp);
      } else {
        if (_.isEmpty(textValue) && tmp.length > 0) {
          tmp = _.sortBy(tmp, ['idHistoryChoice']);
          _.reverse(tmp);
        }
        setListSuggest(tmp);
      }
    }
  }, [props.employees])

  useEffect(() => {
    setIsLoading(false);
    if (props.milestones && props.type === TagAutoCompleteType.Milestone) {
      let tmp = [];
      if (props.milestones) {
        tmp.push(...props.milestones);
      }
      if (isScroll) {
        listSuggest.push(...tmp);
      } else {
        if (_.isEmpty(textValue) && tmp.length > 0) {
          tmp = _.sortBy(tmp, ['idHistoryChoice']);
          _.reverse(tmp);
        }
        setListSuggest(tmp);
      }
    }
  }, [props.milestones])

  useEffect(() => {
    setIsLoading(false);
    if (props.tasks && props.type === TagAutoCompleteType.Task) {
      let tmp = [];
      if (props.tasks) {
        tmp.push(...props.tasks);
      }
      if (isScroll) {
        listSuggest.push(...tmp);
      } else {
        if (_.isEmpty(textValue) && tmp.length > 0) {
          tmp = _.sortBy(tmp, ['idHistoryChoice']);
          _.reverse(tmp);
        }
        setListSuggest(tmp);
      }
    }
  }, [props.tasks])

  useEffect(() => {
    setIsLoading(false);
    if (props.customers && props.customers.customers && props.type === TagAutoCompleteType.Customer) {
      let tmp = [];
      if (props.customers && props.customers.customers) {
        tmp.push(...props.customers.customers);
      }
      if (isScroll) {
        listSuggest.push(...tmp);
      } else {
        if (_.isEmpty(textValue) && tmp.length > 0) {
          tmp = _.sortBy(tmp, ['idHistoryChoice']);
          _.reverse(tmp);
        }
        setListSuggest(tmp);
      }
    }
  }, [props.customers])

  useEffect(() => {
    setIsLoading(false);
    if (props.type === TagAutoCompleteType.BusinessCard) {
      let tmp = [];
      if (props.businessCards) {
        tmp.push(...props.businessCards);
      }
      if (isScroll) {
        listSuggest.push(...tmp);
      } else {
        if (_.isEmpty(textValue) && tmp.length > 0) {
          tmp = _.sortBy(tmp, ['idHistoryChoice']);
          _.reverse(tmp);
        }
        setListSuggest(tmp);
      }
    }
  }, [props.businessCards])

  useImperativeHandle(ref, () => ({
    getTags() {
      return tags;
    },
    setTags(tagsToSet) {
      setTags(_.cloneDeep(tagsToSet));
    },
    setTagsNotSuggestion(listNotSuggest) {
      if (listNotSuggest && _.isArray(listNotSuggest)) {
        setTagListNotSuggestion(listNotSuggest);
      }
    },
    deleteTag(index: number, prodId?) {
      if (!prodId) {
        tags.splice(index, 1);
        setTags(_.cloneDeep(tags));
        if (props.onActionSelectTag) {
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
      } else {
        setTags([])
        if (props.onActionSelectTag) {
          props.onActionSelectTag(props.id, props.type, props.modeSelect, []);
        }
      }
    }
  }));

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (props.maxLength && (value.length > props.maxLength)) {
      return;
    }
    setTextValue(value);
    if (props.onChangeText) {
      props.onChangeText(value);
    }
    if (props.handleDirtyCheck) {
      props.handleDirtyCheck();
    }

  }

  const onAmountChange = (e, idx) => {
    const { value } = e.target;
    const amountRegExp = new RegExp('^[0-9]*$');
    if (value === '' || amountRegExp.test(value)) {
      // const obj = _.cloneDeep(tags[idx]);
      // obj.amount = value === '' ? 0 : +value;
      tags[idx].amount = value === '' ? 0 : +value;
      setTags(_.cloneDeep(tags));
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
      }
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
    } else {
      return;
    }
  }

  const onRemoveTag = (index: number, focusP?: boolean) => {
    let check = true;
    if (props.validateBeforeRemoveTag)
      check = props.validateBeforeRemoveTag();
    if (!check) {
      return;
    }

    tags.splice(index, 1);
    setTags(_.cloneDeep(tags));
    if (typeof props.onActionSelectTag === "function") {
      props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
    }
    if (focusP) {
      inputRef.current.disabled = false;
      inputRef.current.focus();
      getSuggestions(false);
      setShowSuggest(true);
    }
  }

  const onFocusTextBox = () => {
    if (singleTypeDisableInput) {
      return;
    }
    getSuggestions(false);
    setShowSuggest(true);
    setIsFocus(true);
  }

  const onUnFocusTextBox = (e) => {
    // setListSuggest([]);
    const { value } = e.target;
    setTextValue(toKatakana(value));
    setIsFocus(false);
  }


  const onKeyDownTextBox = (e) => {
    // Check for TAB key press
    if (e.keyCode === 9) {
      // SHIFT + TAB
      if (e.shiftKey) {
        setShowSuggest(false);
        props.backTab(props.itemfieldOrder);
        // TAB
      } else {
        setListSuggest([]);
        e.target.blur();
      }
    }
  }

  const onActionLeft = (e) => {
    if (props.onActionSuggestLeft) {
      props.onActionSuggestLeft(props.id, props.type, props.modeSelect, searchValue);
    }
    // Open modal create employee
    setOpenPopupSearch(true);
    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  const onActionRight = (e) => {
    if (props.onActionSuggestRight) {
      props.onActionSuggestRight(props.id, props.type, props.modeSelect);
    }
    // Open modal create employee
    switch (props.type) {
      case TagAutoCompleteType.Employee:
        setOpenModalEmployee(true);
        break;
      case TagAutoCompleteType.Product:
        setOpenModalProduct(true);
        break;
      case TagAutoCompleteType.Milestone:
        setOpenModalMilestone(true);
        break;
      case TagAutoCompleteType.Task:
        setOpenModalTask(true);
        break;
      case TagAutoCompleteType.Customer:
        setOpenModalCustomer(true);
        break;
      case TagAutoCompleteType.BusinessCard:
        setOpenModalCBussinessCards(true);
        break;
      default:
        break;
    }
    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  const onActionOption = (tagIdx: number, participantType) => {
    if (tagIdx < 0 || tagIdx > tags.length) {
      return;
    }
    tags[tagIdx].actionId = participantType;
    tags[tagIdx].participantType = participantType;
    if (props.onActionOptionTag) {
      props.onActionOptionTag(tags[tagIdx], participantType);
    }
    setTags(_.cloneDeep(tags));
  }

  const saveSuggestionChoice = (elem) => {
    if (props.type === TagAutoCompleteType.Employee) {
      let index = "";
      let idResult = "";
      if (elem.employeeId) {
        index = IndexSaveSuggestionChoice.Employee;
        idResult = elem.employeeId;
      } else if (elem.departmentId) {
        index = IndexSaveSuggestionChoice.Department;
        idResult = elem.departmentId;
      } else if (elem.groupId) {
        index = IndexSaveSuggestionChoice.Group;
        idResult = elem.groupId;
      }
      props.saveSuggestionsChoice(props.id, index, idResult);
    } else if (props.type === TagAutoCompleteType.Milestone) {
      props.saveSuggestionsChoice(props.id, IndexSaveSuggestionChoice.Milestone, elem.milestoneId);
    } else if (props.type === TagAutoCompleteType.Product) {
      props.saveSuggestionsChoice(props.id, IndexSaveSuggestionChoice.Product, elem.productId);
    } else if (props.type === TagAutoCompleteType.Task) {
      props.saveSuggestionsChoice(props.id, IndexSaveSuggestionChoice.Task, elem.taskId);
    } else if (props.type === TagAutoCompleteType.ProductTrading) {
      props.saveSuggestionsChoice(props.id, IndexSaveSuggestionChoice.ProductTrading, elem.productTradingId);
    } else if (props.type === TagAutoCompleteType.Customer) {
      props.saveSuggestionsChoice(props.id, IndexSaveSuggestionChoice.Customer, elem.customerId);
    } else if (props.type === TagAutoCompleteType.BusinessCard) {
      props.saveSuggestionsChoice(props.id, IndexSaveSuggestionChoice.BusinessCard, elem.businessCardId);
    }
  }

  const saveSuggestionListChoiceProps = (arrayElement) => {
    const arrayResult = [];
    if (props.type === TagAutoCompleteType.Employee) {
      let index = "";
      let idResult = "";
      arrayElement.map((elem: any) => {
        if (elem.employeeId) {
          index = IndexSaveSuggestionChoice.Employee;
          idResult = elem.employeeId;
        } else if (elem.departmentId) {
          index = IndexSaveSuggestionChoice.Department;
          idResult = elem.departmentId;
        } else if (elem.groupId) {
          index = IndexSaveSuggestionChoice.Group;
          idResult = elem.groupId;
        }
        arrayResult.push(idResult);
      });
      props.saveSuggestionListChoice(props.id, index, arrayResult);
    } else if (props.type === TagAutoCompleteType.Product) {
      arrayElement.map((elem: any) => {
        arrayResult.push(elem.productId);
      });
      props.saveSuggestionListChoice(props.id, IndexSaveSuggestionChoice.Product, arrayResult);
    } else if (props.type === TagAutoCompleteType.Task) {
      arrayElement.map((elem: any) => {
        arrayResult.push(elem.taskId);
      });
      props.saveSuggestionListChoice(props.id, IndexSaveSuggestionChoice.Task, arrayResult);
    } else if (props.type === TagAutoCompleteType.Milestone) {
      arrayElement.map((elem: any) => {
        arrayResult.push(elem.milestoneId);
      });
      props.saveSuggestionListChoice(props.id, IndexSaveSuggestionChoice.Milestone, arrayResult);
    }
    else if (props.type === TagAutoCompleteType.ProductTrading) {
      arrayElement.map((elem: any) => {
        arrayResult.push(elem.productTradingId);
      });
      props.saveSuggestionListChoice(props.id, IndexSaveSuggestionChoice.ProductTrading, arrayResult);
    } else if (props.type === TagAutoCompleteType.Customer) {
      arrayElement.map((elem: any) => {
        arrayResult.push(elem.customerId);
      });
      props.saveSuggestionListChoice(props.id, IndexSaveSuggestionChoice.Customer, arrayResult);
    } else if (props.type === TagAutoCompleteType.BusinessCard) {
      arrayElement.map((elem: any) => {
        arrayResult.push(elem.businessCardId);
      });
      props.saveSuggestionListChoice(props.id, IndexSaveSuggestionChoice.BusinessCard, arrayResult);
    }
  }

  const selectElementSuggest = (elem: any) => {
    if (!elem) {
      return;
    }
    if (props.modeSelect === TagAutoCompleteMode.Single) {
      const obj = _.cloneDeep(elem);
      tags.splice(0, tags.length);
      tags.push(obj);
      setTags(_.cloneDeep(tags));
      setListSuggest([]);
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.modeSelect, _.cloneDeep(tags));
      }
    } else if (props.modeSelect === TagAutoCompleteMode.Multi) {
      const obj = _.cloneDeep(elem);
      if (props.type === TagAutoCompleteType.Product) {
        obj['amount'] = 1;
      }
      obj['actionId'] = 0;
      tags.push(obj);
      if (props.isProdSet) {
        setTags([]);
        setShowSuggest(false);
      } else {
        setTags(_.cloneDeep(tags));
      }
      setListSuggest([]);
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.modeSelect, _.cloneDeep(tags));
      }
    }
    saveSuggestionChoice(elem);
  }

  const handleUserMouseDown = (event) => {
    if (bodyRef.current && !bodyRef.current.contains(event.target) && inputRef.current && !inputRef.current.contains(event.target)) {
      const isOpenModal = openModalEmployee || openModalProduct || openModalMilestone || openModalTask ||
        openModalCustomer || openModalCBussinessCards || openPopupSearch || openPopupSearchResult;
      if (!isOpenModal) {
        setListSuggest([]);
        setShowSuggest(false);
      }
    }
  };

  const handleUserMouseMove = () => {
    if (autoCompleteRef && autoCompleteRef.current.contains(event.target)) {
      setMouseMoveInput(true);
    } else {
      setMouseMoveInput(false);
    }
  }

  const handleUserKeyDown = (e) => {
    if (e.key === "Delete" && singleTypeDisableInput && mousemoveInput) {
      onRemoveTag(0);
    }
  }

  useEventListener('mousedown', handleUserMouseDown);
  useEventListener('mousemove', handleUserMouseMove);
  useEventListener('keydown', handleUserKeyDown);

  // const getSelfIdForTag = (tag: any) => {
  //    return tag.employeeId ?? tag.departmentId ?? tag.groupId;
  // }

  // const [{ canDrop, isOver }, drop] = useDrop({
  //   accept: DnDItemTypes.EMPLOYEE,
  //   drop(item: DragItem, monitor: DropTargetMonitor) {
  //     const isAvailable = tags.filter((v) => getSelfIdForTag(v) === getSelfIdForTag(item.data)).length === 0;
  //     let added = false;
  //     if (isAvailable) {
  //       selectElementSuggest(item.data);
  //       added = true;
  //     }
  //     return { added };
  //   },
  //   canDrop(item: DragItem, monitor) {
  //     return tags.filter((v) => getSelfIdForTag(v) === getSelfIdForTag(item.data)).length === 0;
  //   },
  //   collect: (monitor: any) => ({
  //     isOver: monitor.isOver() && monitor.canDrop(),
  //     canDrop: monitor.canDrop(),
  //   })
  // });

  const renderElementSuggestProduct = (productInfo) => {
    return (
      <SuggestProduct
        productInfo={productInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  const renderElementSuggestProductTrading = (tradingProductInfo) => {
    return (
      <SuggestProductTrading
        tradingProductInfo={tradingProductInfo}
        selectElementSuggest={selectElementSuggest}
        tags={tags}
      />
    )
  }

  /**
   * Get random Avatar
   */
  const getAvatarName = (itemId) => {
    if (!itemId || itemId.length === 0) {
      return AvatarColor[0];
    }
    return AvatarColor[itemId];
  }

  /**
   * Close modal create employee
   */
  const onCloseModalEmployee = (param) => {
    if (param) {
      props.handleGetEmployeeList(props.id, [param.employeeId]);
    }
    setOpenModalEmployee(false);
  }
  /**
   * Close modal create product
   */
  const onCloseModalProduct = (param) => {
    if (param) {
      props.handleGetProductList(props.id, [param]);
    }
    setOpenModalProduct(false);
  }
  /**
   * Close modal create milestone
   */
  const onCloseModalMilestone = (param) => {
    if (param) {
      props.handleGetMilestoneList(props.id, [param]);
    }
    setOpenModalMilestone(false);
  }
  /**
   * Close modal create task
   */
  const onCloseModalTask = (param) => {
    if (param) {
      props.handleGetTaskList(props.id, [param]);
    }
    setOpenModalTask(false);
  }
  /**
   * Close modal create customer
   */
  const onCloseModalCustomer = (param) => {
    if (param) {
      props.handleGetCustomerList(props.id, [param]);
    }
    setOpenModalCustomer(false);
  }
  /**
   * Close modal create business card
   */
  const onCloseModalBusinessCard = (param) => {
    if (param) {
      props.handleGetBusinessCardList(props.id, [param]);
    }
    document.body.classList.remove('wrap-card');
    setOpenModalCBussinessCards(false);
  }

  const onActionSelectSearch = (listRecordChecked) => {
    if (listRecordChecked) {
      const listId = [];
      switch (props.type) {
        case TagAutoCompleteType.Employee:
          listRecordChecked.forEach(item => {
            listId.push(item.employeeId);
          });
          props.handleGetEmployeeList(props.id, listId);
          break;
        case TagAutoCompleteType.Product:
          listRecordChecked.forEach(item => {
            listId.push(item.productId);
          });
          props.handleGetProductList(props.id, listId)
          break;
        case TagAutoCompleteType.Milestone:
          listRecordChecked.forEach(item => {
            listId.push(item.milestoneId);
          });
          props.handleGetMilestoneList(props.id, listId)
          break;
        case TagAutoCompleteType.ProductTrading:
          listRecordChecked.forEach(item => {
            listId.push(item.productTradingId);
          });
          props.handleGetProductTradingList(props.id, listId)
          break;
        case TagAutoCompleteType.Task:
          listRecordChecked.forEach(item => {
            listId.push(item.taskId);
          });
          props.handleGetTaskList(props.id, listId)
          break;
        case TagAutoCompleteType.Customer:
          listRecordChecked.forEach(item => {
            listId.push(item.customerId);
          });
          props.handleGetCustomerList(props.id, listId);
          break;
        case TagAutoCompleteType.BusinessCard:
          listRecordChecked.forEach(item => {
            listId.push(item.businessCardId);
          });
          props.handleGetBusinessCardList(props.id, listId);
          break;
        default:
          break;
      }
    }
    setOpenPopupSearchResult(false);
  }

  const onCloseFieldsSearchResults = () => {
    setOpenPopupSearchResult(false);
    setConditionSearch(null);
  }

  const onBackFieldsSearchResults = () => {
    setOpenPopupSearch(true);
    setTimeout(() => {
      setOpenPopupSearchResult(false);
    }, 1000);
  }

  const onClosePopupSearch = () => {
    setOpenPopupSearch(false);
    setConditionSearch(null);
    // if (saveCondition && saveCondition.length > 0) {
    //   setConditionSearch(saveCondition);
    // }
  }

  const handleSearchPopup = (condition) => {
    if (props.type === TagAutoCompleteType.ProductTrading && customerIds && customerIds.length > 0) {
      condition.push({
        fieldName: 'customer_id',
        fieldType: 3,
        fieldValue: '["' + customerIds[0] + '"]',
        isDefault: 'true',
        searchOption: '1',
        searchType: '1'
      });
    }
    setConditionSearch(condition);
    setOpenPopupSearch(false);
    setOpenPopupSearchResult(true);
  }

  const getFirstCharacter = (name) => {
    return name ? name.charAt(0) : "";
  }

  const renderElementSuggestEmployee = (employeeInfo) => {
    return (
      <SuggestEmployee
        employeeInfo={employeeInfo}
        getAvatarName={getAvatarName}
        getFirstCharacter={getFirstCharacter}
        selectElementSuggest={selectElementSuggest}
        tags={tags}
        onlyShowEmployees={props.onlyShowEmployees}
      />
    )
  }

  const renderElementSuggestCustomer = (customerInfo) => {
    return (
      <SuggestCustomer
        customerInfo={customerInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
        valueInput={textValue}
        autoFocusCustomer={props.autoFocusCustomer}
      />
    )
  }

  useEffect(() => {
    if (props.action !== TagAutoCompleteAction.Request) {
      setIsLoading(false)
    }
    switch (props.action) {
      case TagAutoCompleteAction.SuccessGetProduct:
        if (props.products && props.products.length > 0) {
          const dataSuggest = [];
          props.products.map((item) => {
            saveSuggestionChoice(item);
            if (!tags.find(tag => tag.productId === item.productId)) {
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      case TagAutoCompleteAction.SuccessGetEmployees:
        if (props.employees && props.employees.length > 0) {
          const dataSuggest = [];
          props.employees.map((item) => {
            if (!tags.find(tag => tag.employeeId === item.employeeId)) {
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      case TagAutoCompleteAction.SuccessGetCustomers:
        if (props.customers && props.customers.length > 0) {
          const dataSuggest = [];
          props.customers.map((item) => {
            if (!tags.find(tag => tag.customerId === item.customerId)) {
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      case TagAutoCompleteAction.SuccessGetMilestones:
        if (props.milestones && props.milestones.length > 0) {
          const dataSuggest = [];
          props.milestones.map((item) => {
            if (!tags.find(tag => tag.milestoneId === item.milestoneId)) {
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      case TagAutoCompleteAction.SuccessGetTasks:
        if (props.tasks && props.tasks.length > 0) {
          const dataSuggest = [];
          props.tasks.map((item) => {
            if (!tags.find(tag => tag.taskId === item.taskId)) {
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      case TagAutoCompleteAction.SuccessGetProductTradings:
        if (props.tradingProducts && props.tradingProducts.length > 0) {
          const dataSuggest = [];
          props.tradingProducts.map((item) => {
            if (!tags.find(tag => tag.productTradingId === item.productTradingId)) {
              if (item.productTradingProgress && _.size(item.productTradingProgress.label) > 0) {
                item['progressName'] = item.productTradingProgress.label;
              }
              if (item.fileUrl && item.fileUrl.length > 0) {
                item['employeeIcon'] = item.fileUrl;
              }
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      case TagAutoCompleteAction.SuccessGetBusinessCard:
        if (props.businessCards && props.businessCards.length > 0) {
          const dataSuggest = [];
          props.businessCards.map((item) => {
            if (!tags.find(tag => tag.businessCardId === item.businessCardId)) {
              tags.push(item);
              dataSuggest.push(item);
            }
          });
          saveSuggestionListChoiceProps(dataSuggest);
          setTags(_.cloneDeep(tags));
          props.onActionSelectTag(props.id, props.type, props.modeSelect, tags);
        }
        break;
      default:
        break;
    }
    return () => { };
  }, [props.action]);

  /**
   * Render element of suggested milestones
   * @param milestoneInfo
   */
  const renderElementSuggestMilestone = (milestoneInfo) => {
    return (
      <SuggestMilestone
        milestoneInfo={milestoneInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
        dateFormat={dateFormat}
      />
    )
  }

  /**
   * Render element of suggested tasks
   * @param taskInfo
   */
  const renderElementSuggestTask = (taskInfo) => {
    return (
      <SuggestTask
        taskInfo={taskInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  /**
   * Render element of suggested tasks
   * @param taskInfo
   */
  const renderElementSuggestBusinessCard = (businessCardInfo) => {
    return (
      <SuggestBusinessCard
        businessCardInfo={businessCardInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  const onKeyDownSuggestionAdd = (e) => {
    // Check for TAB key press
    if (e.keyCode === 9) {
      // TAB not shift
      if (!e.shiftKey) {
        setShowSuggest(false);
        e.target.blur();
      }
    }
  }

  const zIndex1 = { zIndex: 1 };
  const zIndex2 = { zIndex: 2 };

  // start - custom for activity
  const addBusinessCard = () => {
    if (!textValue || !textValue.trim()) {
      return;
    }
    const interview = {
      businessCardId: null,
      departmentName: "",
      businessCardName: toKatakana(textValue),
      position: "",
      customerName: ""
    }
    selectElementSuggest(interview);
  }
  // end - custom for activity

  const renderSuggest = () => {
    return (
      <div className={`drop-down ${props.isShowOnList ? "w300" : "w100"}`} ref={bodyRef}>
        <ul className="dropdown-item style-3 overflow-hover calendar" ref={suggestionRef}>
          {listSuggest && listSuggest.length > 0 && listSuggest.map((e, idx) => {
            if (props.type === TagAutoCompleteType.Product) {
              return <div key={idx}>{renderElementSuggestProduct(e)}</div>;
            } else if (props.type === TagAutoCompleteType.Customer) {
              return <div key={idx}>{renderElementSuggestCustomer(e)}</div>;
            } else if (props.type === TagAutoCompleteType.ProductTrading) {
              return <div key={idx}>{renderElementSuggestProductTrading(e)}</div>;
            } else if (props.type === TagAutoCompleteType.Employee) {
              return <div key={idx}>{renderElementSuggestEmployee(e)}</div>;
            } else if (props.type === TagAutoCompleteType.Milestone) {
              return <div key={idx}>{renderElementSuggestMilestone(e)}</div>;
            } else if (props.type === TagAutoCompleteType.Task) {
              return <div key={idx}>{renderElementSuggestTask(e)}</div>;
            } else if (props.type === TagAutoCompleteType.BusinessCard) {
              return <div key={idx}>{renderElementSuggestBusinessCard(e)}</div>;
            }
            else {
              return <></>
            }
          })}
          {
            (isLoading && listSuggest.length > 0) ?
              <li>
                <p className="sk-fading-circle margin-auto style-2">
                  <span className="sk-circle1 sk-circle"></span>
                  <span className="sk-circle2 sk-circle"></span>
                  <span className="sk-circle3 sk-circle"></span>
                  <span className="sk-circle4 sk-circle"></span>
                  <span className="sk-circle5 sk-circle"></span>
                  <span className="sk-circle6 sk-circle"></span>
                  <span className="sk-circle7 sk-circle"></span>
                  <span className="sk-circle8 sk-circle"></span>
                  <span className="sk-circle9 sk-circle"></span>
                  <span className="sk-circle10 sk-circle"></span>
                  <span className="sk-circle11 sk-circle"></span>
                  <span className="sk-circle12 sk-circle"></span>
                </p>
              </li>
              : null
          }
          {props.isShowAddText &&
            <li className="item smooth">
              <div className="text text2" onClick={() => { addBusinessCard() }}>
                {translate('activity.modal.add-business-card', { 0: textValue })}
              </div>
            </li>
          }
        </ul>
        <div className="form-group search">
          <form className="btn-tool">
            <button className="submit" style={zIndex2} type="button" onClick={onActionLeft} />
            <label className="text color-999" style={zIndex1}>{translate('dynamic-control.suggestion.search')}</label>
            {!props.hiddenActionRight && (props.isAdmin || props.type !== TagAutoCompleteType.Employee)
              && <button
                className="button-primary button-add-new add w-auto"
                onKeyDown={onKeyDownSuggestionAdd}
                onClick={onActionRight}>{translate('dynamic-control.suggestion.add')}
              </button>}
          </form>
        </div>
      </div>
    );
  }

  /**
   * handle calling api when scroll to bottom
   * @param e event
   */
  const handleScroll = (e) => {
    const element = suggestionRef.current;
    if (!listSuggest || listSuggest.length === total || !showSuggest || listSuggest.length < offset) {
      return;
    }
    if (suggestionRef && !isMouseOnRef(suggestionRef, e)) {
      setIsScroll(false);
      return;
    }
    if (listSuggest && element.scrollHeight - element.scrollTop === element.clientHeight && textValue && !isLoading) {
      getSuggestions(true);
    }
  }
  useEventListener('wheel', handleScroll);

  const getAdress = (addressIn) => {
    let addressOut = '';
    if (addressIn === '{}') {
      return addressOut;
    }
    const addressJson = isJsonString(addressIn) ? JSON.parse(addressIn) : "";
    if (!addressJson) {
      return addressIn;
    }
    addressOut += addressJson.address ? addressJson.address : "";
    return addressOut;
  }

  /**
   * Render tooltip of tag
   * @param tag
   */
  const renderTooltip = (tag) => {
    if (props.type === TagAutoCompleteType.Customer) {
      return (
        <>
          <div className="drop-down child w100 h-auto">
            <ul className="dropdown-item">
              <li className="item smooth">
                {tag && tag['parentCustomerName'] && <div className="text1 font-size-12 word-break-all">{tag['parentCustomerName']}</div>}
                <div className="text2 word-break-all">{tag['customerName']}</div>
                {tag && tag['customerAddress'] && <div className="text1 font-size-12 word-break-all">{getAdress(tag['customerAddress'])}</div>}
              </li>
            </ul>
          </div>
        </>
      )
    }
    if (tag && (props.type === TagAutoCompleteType.Milestone || props.type === TagAutoCompleteType.Employee)) {
      const tmp = [];
      if (tag.customer && _.size(tag.customer) > 0) {
        if (tag.customer && tag.customer['parentCustomerName']) {
          tmp.push(tag.customer['parentCustomerName']);
        }
        if (tag.customer && tag.customer['customerName']) {
          tmp.push(tag.customer['customerName']);
        }
      } else {
        if (tag['parentCustomerName']) {
          tmp.push(tag['parentCustomerName']);
        }
        if (tag['customerName']) {
          tmp.push(tag['customerName']);
        }
      }
      const displayCustomerName = tmp.join('－');
      return (
        <>
          <div className="drop-down child w100 h-auto">
            <ul className="dropdown-item">
              <li className="item smooth">
                {(tag && tag['productName']) ||
                  displayCustomerName &&
                  <div className="text1 font-size-12 word-break-all">{tag['productName']}{displayCustomerName}</div>}
                <div className="text2 word-break-all">{`${tag['milestoneName']}`}{tag['endDate'] && `（${dateFnsFormat(tag['endDate'], dateFormat)}）`}</div>
              </li>
            </ul>
          </div>
        </>
      )
    } return <></>;
  }

  const goToEmployeeDetail = (id) => {
    setEmployeeIdDetail(id);
    setOpenPopupEmployeeDetail(true);
  }

  const renderResultSingle = () => {
    if (props.isHideResult || props.modeSelect !== TagAutoCompleteMode.Single || tags.length < 1) {
      return <></>;
    }
    if (props.type === TagAutoCompleteType.Product) {
      const tagName1 = "productName";
      return (
        <>
          {tags.map((e, idx) =>
            <div key={idx} className="tag">{e[tagName1]}<button className="close" onClick={() => onRemoveTag(idx)}>×</button></div>
          )}
        </>
      )
    } else if (props.type === TagAutoCompleteType.Milestone) {
      return (
        <>
          <ResultSingleMilestone
            tags={tags}
            onRemoveTag={() => onRemoveTag}
            renderTooltip={renderTooltip}
            isShowOnList={props.isShowOnList}
            disableTag={props.disableTag}
            dateFormat={dateFormat}
          />
        </>
      )
    } else if (props.type === TagAutoCompleteType.Employee) {
      return (
        <>
          <SelectedItem
            item={tags[0]}
            index={0}
            mode={ITEM_FORMATS.SINGLE}
            fieldBelong={FIELD_BELONG.EMPLOYEE}
            onRemoveItem={onRemoveTag}
            gotoDetail={goToEmployeeDetail}
            widthClass={'w48'}
          />
        </>
      )
    } else if (props.type === TagAutoCompleteType.Customer) {
      return (
        <>
          <ResultSingleCustomer
            tags={tags}
            onRemoveTag={() => onRemoveTag}
            renderTooltip={renderTooltip}
            isShowOnList={props.isShowOnList}
            disableTag={props.disableTag}
          />
        </>
      )
    } else if (props.type === TagAutoCompleteType.Task) {
      return (<ResultSingleTask
        tags={tags}
        onRemoveTag={() => onRemoveTag}
        isShowOnList={props.isShowOnList}
      />)
    } else if (props.type === TagAutoCompleteType.BusinessCard) {
      return (<ResultSingleBusinessCard
        tags={tags}
        onRemoveTag={() => onRemoveTag}
        isShowOnList={props.isShowOnList}
      />)
    }
  }

  const renderResultMultiProduct = () => {
    if (listSuggest.length > 0) {
      return <></>
    }
    return (
      <ResultSingleProduct
        tags={tags}
        onAmountChange={onAmountChange}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiCustomer = () => {
    return (
      <ResultMultiCustomer
        tags={tags}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiProductTrading = () => {
    return (
      <ResultMultiProductTrading
        tags={tags}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiMilestone = () => {
    return (
      <ResultMultiMilestone
        tags={tags}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiTask = () => {
    return (
      <ResultMultiTask
        tags={tags}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiBusinessCard = () => {
    return (
      <ResultMultiBusinessCard
        tags={tags}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiEmployee = () => {
    if (props.isHideResult || tags.length === 0 || props.modeSelect !== TagAutoCompleteMode.Multi) {
      return <></>
    }
    return (
      <div className="break-line form-group common">
        <div className="chose-many">
          {tags && tags.map((tag, index) =>
            <SelectedItem
              item={tag}
              key={index}
              index={index}
              mode={ITEM_FORMATS.MULTI}
              fieldBelong={FIELD_BELONG.EMPLOYEE}
              onRemoveItem={onRemoveTag}
              gotoDetail={goToEmployeeDetail}
              onActionOption={onActionOption}
              listActionOption={props.listActionOption}
              widthClass={'w48'}
            />
          )}
        </div>
      </div>
    );
  }

  const renderResultMulti = () => {
    if (props.isHideResult || tags.length === 0 || props.modeSelect !== TagAutoCompleteMode.Multi) {
      return <></>
    }
    if (props.type === TagAutoCompleteType.Product) {
      return renderResultMultiProduct();
    } else if (props.type === TagAutoCompleteType.ProductTrading) {
      return renderResultMultiProductTrading();
    } else if (props.type === TagAutoCompleteType.Employee) {
      return renderResultMultiEmployee();
    } else if (props.type === TagAutoCompleteType.Milestone) {
      return renderResultMultiMilestone();
    } else if (props.type === TagAutoCompleteType.Task) {
      return renderResultMultiTask();
    } else if (props.type === TagAutoCompleteType.Customer) {
      return renderResultMultiCustomer();
    } else if (props.type === TagAutoCompleteType.BusinessCard) {
      return renderResultMultiBusinessCard();
    }
  }

  /**
 * Get error infor by field name
 * @param fieldName
 */
  const getErrorInfo = fieldName => {
    if (!props.errorItems) return null;
    let errorInfo = null;
    for (const elem of props.errorItems) {
      if (elem.item === fieldName) {
        errorInfo = elem;
        break;
      }
    }
    return errorInfo;
  };
  const [styleInput, setStyleInput] = useState('input-common-wrap');
  useEffect(() => {
    if (props.validMsg || props.errorMessage) {
      setStyleInput('input-common-wrap normal-error');
    } else if (textValue && textValue.length > 0) {
      setStyleInput('input-common-wrap delete');
    } else {
      setStyleInput('input-common-wrap');
    }
  }, [props.validMsg, textValue])

  useEffect(() => {
    if (tags.length > 0) {
      setTextValue('');
      setShowSuggest(false);
    }
  }, [tags])

  let classNameAutoComplete = '';
  if (props.type !== TagAutoCompleteType.None) {
    classNameAutoComplete = 'input-common-wrap suggestion';
    if (!props.tagSearch && tags && tags.length > 0) {
      classNameAutoComplete += ' tag';
    }
    if (textValue && textValue.length > 0) {
      classNameAutoComplete += ' delete';
    }
    if (props.validMsg) {
      classNameAutoComplete += ' error';
    }
    if ((singleTypeDisableInput || props.isDisabled) && props.type !== TagAutoCompleteType.ProductTrading) {
      classNameAutoComplete += ' disable';
    }
  }
  if (props.tagSearch) {
    classNameAutoComplete += ' search-box-no-button-style'
  }

  const onReceiveMessage = ev => {
    if (!ev.data.id || props.id !== ev.data.id) {
      return;
    }
    if (TagAutoCompletePostMessageAction.ProductTrading === ev.data.type) {
      setIsDisabled(ev.data.isDisable);
      if (ev.data.isDisable) {
        setTags([]);
        if (props.onActionSelectTag) {
          props.onActionSelectTag(props.id, props.type, props.modeSelect, []);
        }
      } else {
        setCustomerIds(ev.data.customerIds);
      }
    }
  };

  const onClosePopupEmployeeDetail = () => {
    setOpenPopupEmployeeDetail(false);
  }

  const [hoverX, setHoverX] = useState(false);
  useEventListener('message', onReceiveMessage);
  return (
    <>
      {props.title &&
        <label htmlFor={idInputList[0]}>{props.title} {props.isRequired && <label className="label-red">{translate('dynamic-control.require')}</label>}</label>
      }
      <div className={classNameAutoComplete} ref={autoCompleteRef} onMouseEnter={() => changeIsHover(true)} onMouseLeave={() => changeIsHover(false)}>
        {renderResultSingle()}
        {props.tagSearch && <button className="icon-search"><i className="far fa-search"></i></button>}
        <input type="text"
          ref={inputRef}
          className={props.inputClass}
          placeholder={singleTypeDisableInput ? '' : props.placeholder}
          id={idInputList[0]}
          value={singleTypeDisableInput ? '' : textValue}
          onChange={onTextChange}
          onFocus={onFocusTextBox}
          onBlur={onUnFocusTextBox}
          onKeyDown={onKeyDownTextBox}
          autoComplete="off"
          disabled={singleTypeDisableInput || isDisabled || props.isDisabledPreView}
          onMouseEnter={() => setHoverX(true)}
          onMouseLeave={() => setHoverX(false)}
        />
        {/* {props.errorItems && <div className="messenger">{getErrorInfo('milestoneId')}</div>} */}
        {(hoverX || isFocus) && textValue && <span className="icon-delete" onClick={() => {
          props.onChangeText && props.onChangeText("");
          setTextValue("");
        }}
          onMouseEnter={() => setHoverX(true)}
          onMouseLeave={() => setHoverX(false)} />}
      </div>
      <div className="input-common-wrap suggestion z-index-99">
        {/* {showSuggest && listSuggest && listSuggest.length > 0 && renderSuggest()} */}
        {showSuggest && renderSuggest()}
      </div>
      {(props.validMsg || props.errorMessage) &&
        <div className={styleInput}>
          <div className="messenger">{props.validMsg}</div>
        </div>
      }
      <div className={props.className}>
        {renderResultMulti()}
      </div>
      {/* Employee */}
      {openModalEmployee &&
        <ModalCreateEditEmployee
          id={employeeEditCtrlId[0]}
          toggleCloseModalEmployee={onCloseModalEmployee}
          iconFunction={iconFunction}
          employeeActionType={EMPLOYEE_ACTION_TYPES.CREATE}
          employeeViewMode={EMPLOYEE_VIEW_MODES.EDITABLE}
          isOpenedFromModal={true}
          // do not change
          hiddenShowNewTab={true}
        />
      }
      {openModalProduct &&
        <ModalCreateEditProduct
          iconFunction={iconFunction}
          productActionType={PRODUCT_ACTION_TYPES.CREATE}
          onCloseFieldsEdit={onCloseModalProduct}
          showModal={true}
          // do not change
          hiddenShowNewTab={true}
        />
      }
      {openModalMilestone &&
        <CreateEditMilestoneModal
          milesActionType={MILES_ACTION_TYPES.CREATE}
          onCloseModalMilestone={onCloseModalMilestone}
          toggleCloseModalMiles={() => setOpenModalMilestone(false)}
          isOpenFromModal={true}
          // do not change
          hiddenShowNewTab={true}
        />
      }
      {openModalTask &&
        <ModalCreateEditTask
          toggleCloseModalTask={() => setOpenModalTask(false)}
          onCloseModalTask={onCloseModalTask}
          iconFunction="ic-task-brown.svg"
          taskActionType={TASK_ACTION_TYPES.CREATE}
          taskId={null}
          taskViewMode={TASK_VIEW_MODES.EDITABLE}
          canBack={true} />
      }
      {openModalCustomer &&
        <ModalCreateEditCustomer
          toggleCloseModalCustomer={() => setOpenModalCustomer(false)}
          onCloseModalCustomer={onCloseModalCustomer}
          customerActionType={CUSTOMER_ACTION_TYPES.CREATE}
          customerViewMode={CUSTOMER_VIEW_MODES.EDITABLE}
          hiddenShowNewTab={true}
          fromTagAuto={true}
          isOpenedFromModal={true} />
      }
      {openModalCBussinessCards &&
        <CreateEditBusinessCard
          closePopup={() => setOpenModalCBussinessCards(false)}
          toggleNewWindow={onCloseModalBusinessCard}
          businessCardActionType={BUSINESS_CARD_ACTION_TYPES.CREATE}
          businessCardViewMode={BUSINESS_CARD_VIEW_MODES.EDITABLE}
          businessCardId={null}
          onCloseModalBusinessCard={onCloseModalBusinessCard}
          hiddenShowNewTab={true}
          isOpenedFromModal={true} />
      }
      {openPopupSearch &&
        <PopupFieldsSearch
          iconFunction={iconFunction}
          fieldBelong={fieldBelong}
          conditionSearch={conditionSearch}
          onCloseFieldsSearch={onClosePopupSearch}
          onActionSearch={handleSearchPopup}
          conDisplaySearchDetail={conDisplaySearchDetail}
          setConDisplaySearchDetail={setConDisplaySearchDetail}
          fieldNameExtension={fieldNameExtension}
          // do not change
          hiddenShowNewTab={true}
          isOpenedFromModal={true}
          selectedTargetType={0}
          selectedTargetId={0}
          layoutData={props.employeeLayout}
        />
      }
      {openPopupSearchResult &&
        <FieldsSearchResults
          iconFunction={iconFunction}
          condition={conditionSearch}
          onCloseFieldsSearchResults={onCloseFieldsSearchResults}
          onBackFieldsSearchResults={onBackFieldsSearchResults}
          type={props.type}
          modeSelect={props.modeSelect}
          onActionSelectSearch={onActionSelectSearch}
        />
      }
      {/* ShowDETAIL */}
      {openPopupEmployeeDetail && (<PopupEmployeeDetail
        id={employeeDetailCtrlId[0]}
        key={employeeIdDetail}
        showModal={true}
        employeeId={employeeIdDetail}
        listEmployeeId={[employeeIdDetail]}
        toggleClosePopupEmployeeDetail={onClosePopupEmployeeDetail}
        resetSuccessMessage={() => { }}
        openFromModal={true}
      />)}
    </>
  );
});

TagAutoComplete.defaultProps = {
  className: "form-group-common",
  inputClass: "input-normal",
  placeholder: "テキスト",
};

const mapStateToProps = ({ tagAutoCompleteState, authentication }: IRootState, ownProps: ITagAutoCompleteOwnProps) => {
  if (!tagAutoCompleteState || !tagAutoCompleteState.data.has(ownProps.id)) {
    return {
      action: null,
      products: [],
      tradingProducts: [],
      employees: [],
      customers: [],
      employeeLayout: [],
      milestones: [],
      tasks: [],
      businessCards: [],
      errorMessage: null,
      errorItems: null,
      suggestionsChoiceId: null,
      isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
    };
  }
  return {
    action: tagAutoCompleteState.data.get(ownProps.id).action,
    products: tagAutoCompleteState.data.get(ownProps.id).products,
    tradingProducts: tagAutoCompleteState.data.get(ownProps.id).tradingProducts,
    employees: tagAutoCompleteState.data.get(ownProps.id).employees,
    customers: tagAutoCompleteState.data.get(ownProps.id).customers,
    tasks: tagAutoCompleteState.data.get(ownProps.id).tasks,
    businessCards: tagAutoCompleteState.data.get(ownProps.id).businessCards,
    employeeLayout: tagAutoCompleteState.data.get(ownProps.id).employeeLayout,
    milestones: tagAutoCompleteState.data.get(ownProps.id).milestones,
    errorMessage: tagAutoCompleteState.data.get(ownProps.id).errorMessage,
    errorItems: tagAutoCompleteState.data.get(ownProps.id).errorItems,
    suggestionsChoiceId: tagAutoCompleteState.data.get(ownProps.id).suggestionsChoiceId,
    isAdmin: hasAnyAuthority(authentication.account.authorities, [AUTHORITIES.ADMIN]),
  }
}

const mapDispatchToProps = {
  reset,
  getProductSuggestions,
  getProductTradingSuggestions,
  getEmployeeSuggestions,
  getCustomerSuggestions,
  getMilestoneSuggestions,
  getBusinessCardSuggestions,
  getTaskSuggestions,
  saveSuggestionsChoice,
  saveSuggestionListChoice,
  handleGetEmployeeList,
  handleGetProductList,
  handleGetMilestoneList,
  handleGetEmployeeLayout,
  handleGetProductTradingList,
  handleGetTaskList,
  handleGetCustomerList,
  handleGetBusinessCardList,
  moveToScreen
};

const options = { forwardRef: true };

export default connect<ITagAutoCompleteStateProps, ITagAutoCompleteDispatchProps, ITagAutoCompleteOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TagAutoComplete);
