import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle, useMemo } from 'react'
import { IRootState } from 'app/shared/reducers'
import { connect, Options } from 'react-redux'
import {
  reset,
  getSuggestionsBusinessCard,
  getLazySuggestionsBusinessCard,
  getCustomerSuggestion,
  getProductTradingSuggestions,
  getProductSuggestions,
  getLazyProductTradingSuggestions,
  getLazyProductSuggestions,
  initProductSuggestion,
  getScheduleSuggestions,
  getLazyScheduleSuggestions,
  getMilestonesSuggestion,
  getTasksSuggestion,
  getLazyMilestonesSuggestion,
  getLazyTasksSuggestion,
  getLazyCustomerSuggestion,
  initRepostTargetSuggestion,
  saveSuggestionsChoice,
  getBusinessCardsByIds,
  searchRepostTargetSuggestion,
  searchProductSuggestion
} from './tag-suggestion.reducer'
import { useId } from 'react-id-generator';
import useDebounce from 'app/shared/util/useDebounce';
import _ from 'lodash';
import useEventListener from 'app/shared/util/use-event-listener';
import SuggestSchedule from './tag-suggestion-report-target/suggest-schedule';
import SuggestTask from './tag-suggestion-report-target/suggest-task';
import SuggestMilestone from './tag-suggestion-report-target/suggest-milestone';
import ResultSingleReportTarget from './tag-suggestion-report-target/result-single-report-target';
import SuggestBusinessCard from './tag-suggestion-business-card/suggest-business-card';
import ResultMultiBusinessCard from './tag-suggestion-business-card/result-multi-business-card';
import SuggestCustomer from './tag-suggestion-customer/suggest-customer';
import ResultSingleCustomer from './tag-suggestion-customer/result-single-customer';
import ResultMultiCustomer from './tag-suggestion-customer/result-multi-customer';
import SuggestProduct from './tag-suggestion-product-trading/suggest-product';
import SuggestProductTrading from './tag-suggestion-product-trading/suggest-product-trading';
import ResultMultiProductTrading from './tag-suggestion-product-trading/result-multi-product-trading';
import { translate } from 'react-jhipster';
import { ProgressesType, FieldInfoActivityType } from '../../models/get-activity-type'
import CreateEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import { BUSINESS_CARD_ACTION_TYPES, BUSINESS_CARD_VIEW_MODES } from 'app/modules/businessCards/constants';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search';
import { FIELD_BELONG } from 'app/config/constants';
import FieldsSearchResults from 'app/shared/layout/common/suggestion/list-result/fields-search-result'
import {
  TagAutoCompleteType,
  TagAutoCompleteMode
} from "app/shared/layout/common/suggestion/constants";
import { getProductTradingIdChoice, getProductIdChoice, getClassName, getBusinessCardIdChoice } from './function';
import { toKatakana } from 'app/shared/util/string-utils';
import { CommonUtil } from '../common-util';
export enum TagSuggestionType {
  None,
  BusinessCard,
  Customer,
  ProductTrading,
  ReportTarget
}

export enum TagSuggestionMode {
  None,
  Single,
  Multi,
}

export enum SearchType {
  Department = 1,
  Employee = 2,
  Group = 3,
}

export enum IndexSaveSuggestionChoice {
  Employee = "employee",
  Department = "employee_department",
  Group = "employee_group",
  Task = "task",
  Schedule = "schedule",
  Milestones = "milestones",
  BusinessCard = "businessCard",
  Product = "product",
  ProductTrading = "product_trading",
  Customer = "customer",
}

interface ITagSuggestDispatchProps {
  reset,
  getSuggestionsBusinessCard,
  getCustomerSuggestion,
  getProductTradingSuggestions,
  getProductSuggestions,
  initProductSuggestion,
  getScheduleSuggestions,
  getLazyScheduleSuggestions,
  getMilestonesSuggestion,
  getTasksSuggestion,
  getLazyMilestonesSuggestion,
  getLazyTasksSuggestion,
  getLazySuggestionsBusinessCard,
  getLazyCustomerSuggestion,
  initRepostTargetSuggestion,
  getLazyProductTradingSuggestions,
  getLazyProductSuggestions,
  saveSuggestionsChoice,
  getBusinessCardsByIds,
  searchRepostTargetSuggestion,
  searchProductSuggestion
}

interface ITagSuggestStateProps {
  action,
  reportTargets,
  businessCards,
  customers,
  errorMessage,
  errorItems,
  productTradings,
  products,
  totalProductTradings,
  totalProducts,
  schedules,
  totalSchedules,
  milestones,
  totalMilestones,
  tasks,
  totalTasks,
  totalBusinessCard,
  totalCustomer
}

interface ITagSuggestionOwnProps {
  id: any,
  className?: string,
  inputClass?: string,
  validMsg?: string,
  title?: string,
  placeholder?: string,
  type: TagSuggestionType,
  mode: TagSuggestionMode,
  isHideResult?: boolean,
  isRequired?: boolean,
  elementTags?: any[],
  listActionOption?: { id, name }[],
  isDisabled?: boolean,
  tagSearch?: boolean,
  searchType?: SearchType,
  onActionOptionTag?: (tag, actionId) => void,
  onActionSelectTag?: (id: any, type: TagSuggestionType, mode: TagSuggestionMode, listTag: any[]) => void,
  onActionSuggestLeft?: (id: any, type: TagSuggestionType, mode: TagSuggestionMode, param?: any) => void,
  onActionSuggestRight?: (id: any, type: TagSuggestionType, mode: TagSuggestionMode, param?: any) => void,
  onRemoveProductTrading?: (productTrading: any) => void,
  onTextChange?: (value: string) => void,
  isFocusInput?: boolean,
  customerId?: number,
  customerIds?: any[],
  listIdChoice?: any[],
  progresses?: ProgressesType[],
  fieldInfoProductTrading?: FieldInfoActivityType[],
  isHoldTextInput?: boolean, // if isHoldTextInput is TRUE then don't delete input text of input tag when click outside
  textInputValue?: any, // if init component, pulldown don't show when isHoldTextInput is true
  validateBeforeRemoveTag?: () => boolean,
  errorValidates?: any[],
}

type ITagSuggestionProp = ITagSuggestDispatchProps & ITagSuggestStateProps & ITagSuggestionOwnProps;

/**
 * component tag suggestion
 */
const TagSuggestion: React.FC<ITagSuggestionProp> = forwardRef((props, ref) => {
  const idInputList = useId(1, "Tag_Suggestion_");
  const [tags, setTags] = useState([]);
  const [textValue, setTextValue] = useState(props.textInputValue ? props.textInputValue : '');
  const [searchValue, setSearchValue] = useState('');
  const [listSuggest, setListSuggest] = useState([]);
  const bodyRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  // const [openModalEmployee, setOpenModalEmployee] = useState(false);
  const [offset, setOffset] = useState(0);
  const [offsetSchedule, setOffsetSchedule] = useState(0);
  const [offsetMilestone, setOffsetMilestone] = useState(0);
  const [offsetTask, setOffsetTask] = useState(0);
  // const [offsetProductTradings, setOffsetProductTradings] = useState(0);
  const [offsetProducts, setOffsetProducts] = useState(0);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const [selectedElements, setSelectedElements] = useState([]); // list of selected elements
  const limit = 10; // set limit for suggestion
  const debouncedTextValue = useDebounce(textValue, 500);
  const [styleInput, setStyleInput] = useState('input-common-wrap');
  const [productTradings, setProductTradings] = useState(null);
  const [products, setProducts] = useState(null);
  const [closePulldown, setClosePullDown] = useState(null);
  const [iShowDelete, setIsShownDelete] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const [openModalBusinessCard, setOpenModalBusinessCard] = useState(false);
  const [fieldBelong, setFieldBelong] = useState(FIELD_BELONG.EMPLOYEE);
  const [iconFunction, setIconFunction] = useState('');
  const [fieldNameExtension, setFieldNameExtension] = useState('employee_data');
  const [openPopupSearchResult, setOpenPopupSearchResult] = useState(false);
  const [type, setType] = useState(null);
  const [mode, setMode] = useState(null);
  const [customerIds, setCustomerIds] = useState([]); 
  const [isCompleted] = useState(false);

  useEffect(() => {
    switch (props.type) {
      case TagSuggestionType.Customer:
        setIconFunction("ic-sidebar-customer.svg");
        setFieldBelong(FIELD_BELONG.CUSTOMER);
        setFieldNameExtension('customer_data');
        setType(TagAutoCompleteType.Customer);
        break;
      case TagSuggestionType.BusinessCard:
        setIconFunction("ic-popup-title-card.svg");
        setFieldBelong(FIELD_BELONG.BUSINESS_CARD);
        setFieldNameExtension('businesscard_data');
        setType(TagAutoCompleteType.BusinessCard);
        break;
      default:
        break;
    }
    setMode(props.mode === TagSuggestionMode.Multi ? TagAutoCompleteMode.Multi : TagAutoCompleteMode.Single)
    return () => {
      props.reset(props.id);
    }
  }, []);

  useEffect(() => {
    if (props.elementTags) {
      setTags(props.elementTags);
      // props.onActionSelectTag(props.id, props.type, props.mode, props.elementTags);
    }
  }, [props.elementTags])

  useEffect(() => {
    if (props.customerIds) {
      setCustomerIds(props.customerIds);
    }
  }, [props.customerIds])

  useEffect(() => {
    if (textValue.trim().length === 0) {
      setListSuggest([]);
    } else {
      if (props.type === TagSuggestionType.ReportTarget) {
      	// props.initRepostTargetSuggestion(props.id, textValue.trim(), props.customerId);
        props.searchRepostTargetSuggestion(props.id, textValue.trim(), props.customerId, true);
      } else if (props.type === TagSuggestionType.BusinessCard) {
        props.getSuggestionsBusinessCard(props.id, textValue.trim(), customerIds, 0, getBusinessCardIdChoice(tags));
      } else if (props.type === TagSuggestionType.Customer) {
        props.getCustomerSuggestion(props.id, textValue.trim(), props.listIdChoice || [], 0);
      } else if (props.type === TagSuggestionType.ProductTrading) {
        setProductTradings([]);
        setProducts([]);
        // props.initProductSuggestion(props.id, textValue.trim(), customerIds, getProductTradingIdChoice(tags), getProductIdChoice(tags), isCompleted);
        props.searchProductSuggestion(props.id, textValue.trim(), customerIds, getProductTradingIdChoice(tags), getProductIdChoice(tags), true);
      }
    }
  }, [debouncedTextValue])

  if (props.isFocusInput && bodyRef && bodyRef.current) {
    bodyRef.current.focus();
  }

  useEffect(() => {
    if (props.type === TagSuggestionType.BusinessCard) {
      setListSuggest(props.businessCards);
    } else if (props.type === TagSuggestionType.Customer) {
      setListSuggest(props.customers);
    }
  }, [props.reportTargets, props.businessCards, props.customers])

  useEffect(() => {
    if(props.productTradings?.length > 0)
      setProductTradings(_.sortBy(props.productTradings, 'productName', 'asc'));
    else 
      setProductTradings([]);
  }, [props.productTradings])

  useEffect(() => {
    if(props.products?.length > 0)
      setProducts(_.sortBy(props.products, 'productName', 'asc'));
    else 
      setProducts([]);
  }, [props.products])

  useEffect(() => {
    if (props.validMsg || props.errorMessage) {
      setStyleInput('input-common-wrap normal-error');
    } else if (textValue && textValue.length > 0) {
      setStyleInput('input-common-wrap delete');
    } else {
      setStyleInput('input-common-wrap');
    }
  }, [props.validMsg, textValue])

  useImperativeHandle(ref, () => ({
    getTags() {
      return tags;
    },
    setTags(tagsToSet) {
      setTags(tagsToSet);
    },
    deleteTag(index: number) {
      tags.splice(index, 1);
      setTags(_.cloneDeep(tags));
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.mode, tags);
      }
    }
  }));

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e) {
      const { value } = e.target;
      setTextValue(value);
      props.onTextChange && props.onTextChange(value);
      setClosePullDown(false);
    } else {
      setTextValue("");
      props.onTextChange && props.onTextChange("");
      setClosePullDown(true);
    }
    if (props.isHoldTextInput) {
      setClosePullDown(false);
      setIsChangeInput(true);
    }
  }

  const onRemoveTag = (index: number) => {
    if(props.isDisabled) {
      return;
    }

    let check = true;
    if(props.validateBeforeRemoveTag)
      check = props.validateBeforeRemoveTag();
    if(!check){
      return;
    }
    const tagRemove = tags[index];
    tags.splice(index, 1);
    setTags(_.cloneDeep(tags));
    selectedElements.splice(index, 1);
    setSelectedElements(selectedElements);
    if (typeof props.onActionSelectTag === "function") {
      props.onActionSelectTag(props.id, props.type, props.mode, tags);
    }

    if (props.type === TagSuggestionType.ProductTrading) {
      if (tagRemove.productTradingId && typeof props.onRemoveProductTrading === "function") {
        props.onRemoveProductTrading(tagRemove);
      }
    }
    props.onTextChange && props.onTextChange("");
  }

  const onKeyDownTextBox = (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.target.blur();
    }
    if (e.key === "Tab") {
      setListSuggest([]);
    }
  }

  const onActionLeft = (e) => {
    if (props.onActionSuggestLeft) {
      props.onActionSuggestLeft(props.id, props.type, props.mode, searchValue);
    }
    // Open modal create employee
    if (props.type === TagSuggestionType.BusinessCard && !openPopupSearch) {
      setOpenPopupSearch(true);
    }

    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  const onActionRight = (e) => {
    if (props.onActionSuggestRight) {
      props.onActionSuggestRight(props.id, props.type, props.mode);
    }
    // Open modal create business card
    if (props.type === TagSuggestionType.BusinessCard) {
      setOpenModalBusinessCard(true);
    }
    setListSuggest([]);
    e.preventDefault ? e.preventDefault() : e.returnValue = false;
  }

  const onUnFocusTextBox = () => {
    // setListSuggest([]);
    // setClosePullDown(true);
    // if(textValue) {
    //   setTextValue(toKatakana(textValue))
    // }
  }

  const onActionOption = (tagIdx: number, ev) => {
    if (tagIdx < 0 || tagIdx > tags.length) {
      return;
    }
    tags[tagIdx].actionId = +ev.target.value;
    if (props.onActionOptionTag) {
      props.onActionOptionTag(tags[tagIdx], +ev.target.value);
    }
    // setTags(_.cloneDeep(tags));
  }

  const headerHoverOn = () => {
    setHovered(true);
  }

  const headerHoverOff = () => {
    setHovered(false);
  }


  const selectElementSuggest = (elem: any, idx?: any) => {
    if (idx === IndexSaveSuggestionChoice.Product) {
      elem['memoProduct'] = elem['memo'];
      elem['memo'] = "";
      elem['price'] = elem['unitPrice'];
      elem['quantity'] = 1;
    }

    if (props.mode === TagSuggestionMode.Single) {
      setTags([elem]);
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.mode, [elem]);
      }
      // if (props.type === TagSuggestionType.Milestone) {
      //   setOffset(0);
      //   props.saveSuggestionsChoice(props.id, 'milestones', elem.milestoneId);
      //   const tmpSelectedElements = _.cloneDeep(selectedElements);
      //   tmpSelectedElements.push(elem.milestoneId);
      //   setSelectedElements(tmpSelectedElements);
      // }
      // setListSuggest([]);
      // setTextValue("");
    } else if (props.mode === TagSuggestionMode.Multi) {
      const obj = _.cloneDeep(elem);
      obj['actionId'] = 0;
      tags.push(obj);
      setTags(_.cloneDeep(tags));
      // setListSuggest([]);
      if (props.onActionSelectTag) {
        props.onActionSelectTag(props.id, props.type, props.mode, tags);
      }
    }
    if (idx === IndexSaveSuggestionChoice.Task) {
      props.saveSuggestionsChoice(props.id, idx, elem.taskId);
    } else if (idx === IndexSaveSuggestionChoice.Milestones) {
      props.saveSuggestionsChoice(props.id, idx, elem.milestoneId);
    } else if (idx === IndexSaveSuggestionChoice.Schedule) {
      props.saveSuggestionsChoice(props.id, idx, elem.scheduleId);
    } else if (idx === IndexSaveSuggestionChoice.BusinessCard) {
      props.saveSuggestionsChoice(props.id, idx, elem.businessCardId);
    } else if (idx === IndexSaveSuggestionChoice.ProductTrading) {
      props.saveSuggestionsChoice(props.id, idx, elem.productTradingId);
    } else if (idx === IndexSaveSuggestionChoice.Product) {
      props.saveSuggestionsChoice(props.id, idx, elem.productId);
    } else if (idx === IndexSaveSuggestionChoice.Customer) {
      props.saveSuggestionsChoice(props.id, idx, elem.customerId);
    }

    setListSuggest([]);
    setTextValue("");
    setClosePullDown(true)
  }

  const handleUserMouseDown = (event) => {
    if (bodyRef.current && !bodyRef.current.contains(event.target)) {
      // setListSuggest([]);
      // setProducts([]);
      // setProductTradings([]);
      if (props.isHoldTextInput) {
        setClosePullDown(true);
      } else {
        setTextValue("");
      }
    }
  };

  useEventListener('mousedown', handleUserMouseDown);


  /**
   * handle calling api when scroll to bottom
   * @param e event
   */
  const handleScroll = (e) => {
    const element = e.target;
    if (listSuggest && element.scrollHeight - element.scrollTop === element.clientHeight) {
      if (props.type === TagSuggestionType.BusinessCard && props.totalBusinessCard === 10) {
        props.getLazySuggestionsBusinessCard(props.id, textValue.trim(), customerIds, props.businessCards.lenght, getBusinessCardIdChoice(tags) );
        setOffset(offset + 1);
      } else if (props.type === TagSuggestionType.Customer && props.totalCustomer === 10) {
        props.getLazyCustomerSuggestion(props.id, textValue.trim(), props.listIdChoice || [], props.customers.length, null);
        setOffset(offset + 1);
      }

    }
  }

  // action scroll to load data report taget
  const handleScrollReportTarget = (e) => {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      if (props.type === TagSuggestionType.ReportTarget) {
        props.searchRepostTargetSuggestion(props.id, textValue.trim(), props.customerId, false);
        // if (props.schedules && props.totalSchedules === 10) {
        //   props.getLazyScheduleSuggestions(props.id, textValue.trim(), props.customerId, props.schedules.length);
        // } else if (props.tasks?.length === 0 && (!props.milestones || (props.milestones?.length === 0 && props.totalMilestones === 10))) {
        //   props.getMilestonesSuggestion(props.id, textValue.trim(), props.customerId, null, 0);
        // } else if (props.milestones && props.totalMilestones === 10) {
        //   props.getLazyMilestonesSuggestion(props.id, textValue.trim(), props.customerId, null, props.milestones.length);
        // } else if (!props.tasks || props.tasks?.length === 0) {
        //   props.getTasksSuggestion(props.id, textValue.trim(), props.customerId, 0, null);
        // } else if (props.tasks && props.totalTasks === 10) {
        //   props.getLazyTasksSuggestion(props.id, textValue.trim(), props.customerId, props.tasks.length, null, null);
        // }
      }
    }
  }


  const handleScrollProductTradings = (e) => {
    const element = e.target;
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      if (props.type === TagSuggestionType.ProductTrading) {
        props.searchProductSuggestion(props.id, textValue.trim(), customerIds, getProductTradingIdChoice(tags), getProductIdChoice(tags), false);
        // if (props.productTradings && props.totalProductTradings === 10) {
        //   props.getLazyProductTradingSuggestions(props.id, textValue.trim(), props.productTradings.length, props.customerId, getProductTradingIdChoice(tags), isCompleted);
        // } else if (!props.products || props.products.length === 0) {
        //   props.getProductSuggestions(props.id, textValue.trim(), offsetProducts, getProductIdChoice(tags));
        //   setOffsetProducts(offsetProducts + 1);
        // } else if (props.products && props.totalProducts === 10) {
        //   props.getLazyProductSuggestions(props.id, textValue.trim(), props.products.length, getProductIdChoice(tags));
        //   setOffsetProducts(offsetProducts + 1);
        // }
      }
    }
  }

  const renderElementSuggestSchedule = (scheduleInfo, idx) => {
    return (
      <SuggestSchedule key={`scheduleInfo_${scheduleInfo.scheduleId}_${idx}`}
        scheduleInfo={scheduleInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }
  const renderElementSuggestTask = (taskInfo, idx) => {
    return (
      <SuggestTask key={`taskInfo_${taskInfo.taskId}_${idx}`}
        taskInfo={taskInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }
  const renderElementSuggestMilestone = (milestoneInfo, idx) => {
    return (
      <SuggestMilestone key={`milestoneInfo_${milestoneInfo.milestoneId}_${idx}`}
        milestoneInfo={milestoneInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  const renderElementProduct = (productInfo) => {
    return (
      <SuggestProduct key={`product_${productInfo.productId}`}
        productInfo={productInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }
  const renderElementProductTrading = (productTradingInfo) => {
    return (
      <SuggestProductTrading key={`productTrading_${productTradingInfo.productTradingId}`}
        productTradingInfo={productTradingInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  const renderElementSuggestBusinessCard = (businessCartInfo) => {
    return (
      <SuggestBusinessCard key={`businessCard_${businessCartInfo.businessCardId}`}
        businessCartInfo={businessCartInfo}
        tags={tags}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  const lengtReportTarget = useMemo(() => {
    return (props.schedules?.length || 0) + (props.milestones?.length || 0) + (props.tasks?.length || 0)
  }, [props.schedules, props.milestones, props.tasks]);
  
  /**
   * render suggest report target
   */
  const renderSuggestReportTarget = () => {
    return (
      <div className={`drop-down drop-down300 drop-down302 ${lengtReportTarget > 1 ? 'height-300' : 'height-150'}`} ref={bodyRef} onScroll={handleScrollReportTarget}>
        {props.schedules?.length > 0 && <>
          <div className="item smooth">
            <div className="text text2 lh20 color-666">
              <span className="icon icon-w18 mr-2"><img src="../../../content/images/ic-sidebar-calendar.svg" alt="" /></span>
              {translate('activity.modal.calendar')}
            </div>
            <ul className="drop-down301">
              {props.schedules.map((e, idx) => {
                return renderElementSuggestSchedule(e,idx);
              })}
            </ul>
          </div>
        </>}
        {props.milestones?.length > 0 && <>
          <div className="item smooth">
            <div className="text text2 lh20">
              <span className="icon icon-w18 mr-2"><img src="../../../content/images/task/ic-flag-brown.svg" alt="" /></span>
              {translate('activity.modal.milestone')}
            </div>
            <ul className="drop-down301">
              {props.milestones.map((e, idx) => {
                return renderElementSuggestMilestone(e, idx);
              })}
            </ul>
          </div>
        </>}

        {props.tasks?.length > 0 && <>
          <div className="item smooth">
            <div className="text text2 lh20">
              <span className="icon icon-w18 mr-2"><img src="../../../content/images/setting/ic-check-list-blue.svg" alt="" /></span>
              {translate('activity.modal.task')}
            </div>
            <ul className="drop-down301">
              {props.tasks.map((e, idx) => {
                return renderElementSuggestTask(e, idx);
              })}
            </ul>
          </div>
        </>}

      </div>
    );
  }

  const renderElementSuggestCustomer = (customerInfo) => {
    return (
      <SuggestCustomer key={`customer_${customerInfo.customerId}`}
        customerInfo={customerInfo ? customerInfo : []}
        tags={tags ? tags : []}
        selectElementSuggest={selectElementSuggest}
      />
    )
  }

  const lengthProducTrading = useMemo(()=>{
    return (productTradings?.length || 0) + (products?.length || 0);
  }, [productTradings, products])

  /**
   * renderSuggestProductTrading
   */
  const renderSuggestProductTrading = () => {
    return (
      <div className={`none-scroll drop-down drop-down300 drop-down302 style-3 activity-top-70 ${lengthProducTrading > 1 ? 'height-300' : 'height-150' }`} ref={bodyRef} onScroll={handleScrollProductTradings}>
        {(productTradings?.length > 0 || products?.length > 0 ) && <>
          <div className="item smooth overflow-y-hover max-height-208">
            {productTradings?.length > 0 && <>
              <div className="text text2 lh20 color-666">
                <span className="icon icon-w18 mr-2"><img src="../../../content/images/Group 6.svg" alt="" /></span>
                {translate('activity.modal.product-trading')}
              </div>
              <ul className="drop-down301" >
                {productTradings.map((e) => {
                  return renderElementProductTrading(e);
                })}
              </ul>
            </>}
            {products?.length > 0 && <>
              <div className="text text2 lh20">
                <span className="icon icon-w18 mr-2"><img src="../../../content/images/ic-sidebar-product.svg" alt="" /></span>
                {translate('activity.modal.product-suggest')}
              </div>
              <ul className="drop-down301" >
                {products.map((e) => {
                  return renderElementProduct(e);
                })}
              </ul>
            </>}
          </div>
        </>}
        {/* {products?.length > 0 && <>
          <div className="item smooth">
            <div className="text text2 lh20">
              <span className="icon icon-w18 mr-2"><img src="../../../content/images/ic-sidebar-product.svg" alt="" /></span>
              {translate('activity.modal.product-suggest')}
            </div>
            <ul className="drop-down301" >
              {products.map((e) => {
                return renderElementProduct(e);
              })}
            </ul>
          </div>
        </>} */}
        {/* <div className="form-group search">
          <form className="btn-tool">
            <div className="dropdown-search-checkbox">
                  <label className="icon-check">
                    <input type="checkbox" name="" onClick={() => setIsCompleted(!isCompleted)}/>
                    <i /> {translate('dynamic-control.suggestion.including-completed')}
                  </label>
                </div>
          </form>
        </div> */}
      </div>

    );
  }

  const addBusinessCard = () => {
    const interview = {
      businessCardId: null,
      departmentName: "",
      businessCardName: toKatakana(textValue),
      position: "",
      customerName: ""
    }
    selectElementSuggest(interview);
  }

  const hasOldValueSuggestion = () => {
    switch (props.type) {
      case TagSuggestionType.ProductTrading:
        return (productTradings && productTradings.length > 0) || (products && products.length > 0);
      case TagSuggestionType.ReportTarget:
        return (props.schedules && props.schedules.length > 0) || 
              (props.milestones && props.milestones.length > 0) ||
              (props.tasks && props.tasks.length > 0);
      default:
        return listSuggest && listSuggest.length > 0;
    }
  }

  const renderSuggest = () => {
    if (textValue.length === 0 && !hasOldValueSuggestion()) {
      return <></>
    } else if (props.isHoldTextInput && closePulldown) {
      return <></>
    } else if (props.isHoldTextInput && props.textInputValue && !isChangeInput) {
      return <></>
    }
    else if (props.type === TagSuggestionType.ReportTarget) {
      return renderSuggestReportTarget();
    } else if (props.type === TagSuggestionType.ProductTrading) {
      return renderSuggestProductTrading();
    } else {
      return (
        <div className={`drop-down w100 none-scroll ${ listSuggest.length === 1 ? 'height-150' : ''}`} ref={bodyRef}>
           <ul className={`dropdown-item style-3 overflow-hover ${TagSuggestionType.BusinessCard ? 'max-height-168' : ''}`} onScroll={handleScroll}>
            {listSuggest && listSuggest.map((e) => {
              if (props.type === TagSuggestionType.BusinessCard) {
                return renderElementSuggestBusinessCard(e);
              } else if (props.type === TagSuggestionType.Customer) {
                return renderElementSuggestCustomer(e);
              } else {
                return <></>
              }
            })}
            {props.type === TagSuggestionType.BusinessCard &&
             <li className="item smooth">
              <div className="text text2" onClick={() => { addBusinessCard() }}>
                {translate('activity.modal.add-business-card', { 0: textValue})}
              </div>
            </li>
            }
          </ul>
          {/* {props.type === TagSuggestionType.BusinessCard &&
            <div className="item smooth">
              <div className="text text2" onClick={() => { addBusinessCard() }}>
                {translate('activity.modal.add-business-card', { 0: textValue})}
              </div>
            </div>
          } */}
          <div className="form-group search">
            <form>
              <button className="submit" type="button" onClick={onActionLeft} />
              <label className="text color-999 z-index-1" >{translate('suggestion.place-holder')}</label>
              {/* <input type="text" placeholder={translate('activity.suggestion.place-holder')} value={searchValue} onChange={(e) => setSearchValue(e.target.value)} /> */}
              <a className="button-primary button-add-new add" onClick={onActionRight}>{translate('suggestion.right-click')}</a>
            </form>
          </div>
        </div>
      );
    }
  }


  // /**
  //  * Render tooltip of tag
  //  * @param tag
  //  */
  // const renderTooltip = (tag) => {
  //   return <></>;
  // }

  const renderResultSingle = () => {
    if (props.isHideResult || props.mode !== TagSuggestionMode.Single || tags.length < 1) {
      return <></>;
    }
    if (props.type === TagSuggestionType.ReportTarget) {
      return (
        <>
          <ResultSingleReportTarget
            tags={tags}
            headerHoverOn={headerHoverOn}
            headerHoverOff={headerHoverOff}
            hovered={hovered}
            onRemoveTag={onRemoveTag}
          />
        </>
      )
    } else if (props.type === TagSuggestionType.Customer) {
      return (
        <>
          <ResultSingleCustomer
            tags={tags}
            headerHoverOn={headerHoverOn}
            headerHoverOff={headerHoverOff}
            hovered={hovered}
            onRemoveTag={onRemoveTag}
          />
        </>
      )
    }
  }

  const renderResultMultiBusinessCard = () => {
    if (props.isHideResult || tags.length === 0 || props.mode !== TagSuggestionMode.Multi || textValue.length > 0) {
      return <></>
    }

    return (
      <ResultMultiBusinessCard
        tags={tags}
        listActionOption={props.listActionOption}
        isDisabled={props.isDisabled}
        onActionOption={onActionOption}
        onRemoveTag={onRemoveTag}
      />
    );
  }

  const renderResultMultiCustomer = () => {
    if (props.isHideResult || tags.length === 0 || props.mode !== TagSuggestionMode.Multi || textValue.length > 0) {
      return <></>
    }

    return (
      <ResultMultiCustomer
        tags={tags}
        listActionOption={props.listActionOption}
        isDisabled={props.isDisabled}
        onActionOption={onActionOption}
        onRemoveTag={onRemoveTag}
      />
    );
  }


  const handleListProductDataChange = (listProduct) => {
    // console.log('handleListProductDataChange', listProduct)
    setTags(listProduct);
    if (typeof props.onActionSelectTag === "function") {
      props.onActionSelectTag(props.id, props.type, props.mode, listProduct);
    }
  };

  const renderResultMultiProductTrading = () => {
    if (props.isHideResult || tags.length === 0 || props.mode !== TagSuggestionMode.Multi || listSuggest.length > 0) {
      return <></>
    }
    return (
      <ResultMultiProductTrading
        tags={tags}
        progresses={props.progresses}
        fieldInfoProductTrading={props.fieldInfoProductTrading}
        onRemoveTag={onRemoveTag}
        onListProductDataChange={handleListProductDataChange}
        errorValidates={props.errorValidates}
      />
    );
  }

  const renderResultMulti = () => {
    if (props.type === TagSuggestionType.BusinessCard) {
      return renderResultMultiBusinessCard();
    } else if (props.type === TagSuggestionType.Customer) {
      return renderResultMultiCustomer();
    } else if (props.type === TagSuggestionType.ProductTrading) {
      return renderResultMultiProductTrading();
    } else {
      return <></>
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


  let classNameAutoComplete = getClassName(props.type, props.mode, textValue, tags, props.validMsg, props.tagSearch);

  // activity class case start kienpt 28/07/2020
  if (props.type === TagSuggestionType.BusinessCard || props.type === TagSuggestionType.Customer || TagSuggestionType.ProductTrading) {
    classNameAutoComplete = 'input-common-wrap';
    if (tags && tags.length > 0 && props.mode === TagSuggestionMode.Single) {
      classNameAutoComplete += ' tag';
    }
    if (textValue && textValue.length > 0) {
      classNameAutoComplete += ' delete';
    }
    if (props.validMsg) {
      classNameAutoComplete += '  error';
    }
  }
  if (props.tagSearch) {
    classNameAutoComplete += 'search-box-button-style'
  }
  // activity class case end

  const singleTypeDisableInput = props.mode === TagSuggestionMode.Single && tags.length > 0;

  const onFocusTextBox = () => {
    if (singleTypeDisableInput) {
      return;
    }
    // getSuggestions(false);
    setClosePullDown(false);
  }
  
  /**
   * closeCreateEditBusinessCard
   */
  const closeCreateEditBusinessCard = () => {
    setOpenModalBusinessCard(false);
  }

  const onClosePopupSearch = () => {
    setOpenPopupSearch(false);
  }

  const handleSearchPopup = (condition) => {
    setConditionSearch(condition);
    setOpenPopupSearch(false);
    setOpenPopupSearchResult(true);
  }

  const onCloseFieldsSearchResults = () => {
    setOpenPopupSearchResult(false);
  }

  const onBackFieldsSearchResults = () => {
    setOpenPopupSearch(true);
    setTimeout(() => {
      setOpenPopupSearchResult(false);
    }, 1000);
  }

  const onActionSelectSearch = (listRecordChecked) => {
    if (listRecordChecked) {
      const listId = [];
      switch (props.type) {
        case TagSuggestionType.BusinessCard:
          listRecordChecked.forEach(item => {
            listId.push(item.BusinessCardId);
          });
          props.getBusinessCardsByIds(props.id, listId);
          break;
        case TagSuggestionType.Customer:
          listRecordChecked.forEach(item => {
            listId.push(item.customerId);
          });
          // props.handleGetCustomerList(props.id, listId);
          break;
        default:
          break;
      }
    }
    setOpenPopupSearchResult(false);
  }

  return (
    <>
      <label htmlFor={idInputList[0]}>{props.title} {props.isRequired && <label className="label-red">{translate('dynamic-control.require')}</label>}</label>
      <div className={classNameAutoComplete}>
        {renderResultSingle()}
        {(props.tagSearch && tags.length === 0) && <button className="icon-search"><i className="far fa-search"></i></button>}
        {
          <input type="text"
            ref={bodyRef}
            className={`${props.inputClass} ${(props.isDisabled || singleTypeDisableInput) ? 'disable' : ''}`}
            placeholder={singleTypeDisableInput ? '' : props.placeholder}
            id={idInputList[0]}
            value={singleTypeDisableInput ? '' : textValue}
            onChange={onTextChange}
            onBlur={onUnFocusTextBox}
            onMouseEnter={() => setIsShownDelete(true)}
            onMouseLeave={() => setIsShownDelete(false)}
            onKeyDown={onKeyDownTextBox}
            onFocus={onFocusTextBox}
            autoComplete="off"
            disabled={props.isDisabled || singleTypeDisableInput}
          />}
        {props.errorItems && <div className="messenger">{getErrorInfo('milestoneId')}</div>}
        {iShowDelete && textValue && textValue.length > 0 &&
          <span className="icon-delete" onClick={() => { setTextValue(''); onTextChange(null) }} onMouseEnter={() => setIsShownDelete(true)} onMouseLeave={() => setIsShownDelete(false)} />}
      </div>
      {(props.validMsg || props.errorMessage) &&
        <div className={styleInput}>
          <div className="messenger">{props.validMsg}</div>
        </div>
      }
      {renderSuggest()}
      <div className={props.className}>
        {renderResultMulti()}
      </div>

      {openModalBusinessCard &&
        <CreateEditBusinessCard
          closePopup={closeCreateEditBusinessCard}
          businessCardActionType={BUSINESS_CARD_ACTION_TYPES.CREATE}
          businessCardViewMode={BUSINESS_CARD_VIEW_MODES.EDITABLE}
        />
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
        />
      }
      {openPopupSearchResult &&
        <FieldsSearchResults
          iconFunction={iconFunction}
          condition={conditionSearch}
          onCloseFieldsSearchResults={onCloseFieldsSearchResults}
          onBackFieldsSearchResults={onBackFieldsSearchResults}
          type={type}
          modeSelect={mode}
          onActionSelectSearch={onActionSelectSearch}
        />
      }
    </>
  );
});

TagSuggestion.defaultProps = {
  className: "form-group-common",
  inputClass: "input-normal",
  placeholder: "テキスト",
};

const mapStateToProps = ({ tagSuggestionState }: IRootState, ownProps: ITagSuggestionOwnProps) => {
  if (!tagSuggestionState || !tagSuggestionState.data.has(ownProps.id)) {
    return {
      action: null,
      reportTargets: [],
      businessCards: [],
      customers: [],
      productTradings: [],
      products: [],
      errorMessage: null,
      errorItems: null,
      schedules: [],
      totalSchedules: null,
      milestones: [],
      totalMilestones: [],
      tasks: [],
      totalTasks: [],
      totalProductTradings: null,
      totalProducts: null,
      totalBusinessCard: null,
      totalCustomer: null
    };
  }
  return {
    action: tagSuggestionState.data.get(ownProps.id).action,
    reportTargets: tagSuggestionState.data.get(ownProps.id).reportTargets,
    businessCards: tagSuggestionState.data.get(ownProps.id).businessCards,
    customers: tagSuggestionState.data.get(ownProps.id).customers,
    productTradings: tagSuggestionState.data.get(ownProps.id).productTradings,
    products: tagSuggestionState.data.get(ownProps.id).products,
    errorMessage: tagSuggestionState.data.get(ownProps.id).errorMessage,
    errorItems: tagSuggestionState.data.get(ownProps.id).errorItems,
    schedules: tagSuggestionState.data.get(ownProps.id).schedules,
    totalSchedules: tagSuggestionState.data.get(ownProps.id).totalSchedules,
    milestones: tagSuggestionState.data.get(ownProps.id).milestones,
    totalMilestones: tagSuggestionState.data.get(ownProps.id).totalMilestones,
    tasks: tagSuggestionState.data.get(ownProps.id).tasks,
    totalTasks: tagSuggestionState.data.get(ownProps.id).totalTasks,
    totalProductTradings: tagSuggestionState.data.get(ownProps.id).totalProductTradings,
    totalProducts: tagSuggestionState.data.get(ownProps.id).totalProducts,
    totalBusinessCard: tagSuggestionState.data.get(ownProps.id).totalBusinessCard,
    totalCustomer: tagSuggestionState.data.get(ownProps.id).totalCustomer
  }
}

const mapDispatchToProps = {
  reset,
  getSuggestionsBusinessCard,
  getCustomerSuggestion,
  getProductTradingSuggestions,
  getProductSuggestions,
  initProductSuggestion,
  getScheduleSuggestions,
  getLazyScheduleSuggestions,
  getMilestonesSuggestion,
  getLazyMilestonesSuggestion,
  getTasksSuggestion,
  getLazyTasksSuggestion,
  getLazySuggestionsBusinessCard,
  getLazyCustomerSuggestion,
  initRepostTargetSuggestion,
  getLazyProductTradingSuggestions,
  getLazyProductSuggestions,
  saveSuggestionsChoice,
  getBusinessCardsByIds,
  searchRepostTargetSuggestion,
  searchProductSuggestion
};

const options = { forwardRef: true };

export default connect<ITagSuggestStateProps, ITagSuggestDispatchProps, ITagSuggestionOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(TagSuggestion);
