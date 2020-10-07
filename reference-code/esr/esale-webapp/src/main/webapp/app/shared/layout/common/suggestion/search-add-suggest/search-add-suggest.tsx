import React, { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect, Options } from 'react-redux';
import { useId } from 'react-id-generator';
import {
  reset,
  handleGetEmployeeList,
  handleGetProductList,
  handleGetMilestoneList,
  handleGetTaskList,
  handleGetProductTradingList,
  handleGetCustomerList,
  handleGetBusinessCardList,
  handleGetActivityList,
} from '../tag-auto-complete.reducer'
import { translate } from 'react-jhipster';
import FieldsSearchResults  from '../list-result/fields-search-result';
import { FIELD_BELONG } from 'app/config/constants';
import { EMPLOYEE_ACTION_TYPES, EMPLOYEE_VIEW_MODES } from 'app/modules/employees/constants';
import ModalCreateEditEmployee from 'app/modules/employees/create-edit/modal-create-edit-employee';
import ModalCreateEditProduct from 'app/modules/products/product-popup/product-edit';
import CreateEditMilestoneModal from 'app/modules/tasks/milestone/create-edit/create-edit-milestone-modal'
import CreateEditCustomerModal from 'app/modules/customers/create-edit-customer/create-edit-customer-modal';
import CreateEditBusinessCard from 'app/modules/businessCards/create-edit-business-card/create-edit-business-card';
import ActivityModalForm from 'app/modules/activity/create-edit/activity-modal-form';
import PopupFieldsSearch from 'app/shared/layout/dynamic-form/popup-search/popup-fields-search'
import {  getIconSrc } from 'app/config/icon-loader';
import { PRODUCT_ACTION_TYPES } from 'app/modules/products/constants';
import { MILES_ACTION_TYPES } from 'app/modules/tasks/milestone/constants';
import { getFieldNameExtension } from 'app/modules/modulo-bridge';
import ModalCreateEditTask from 'app/modules/tasks/create-edit-task/modal-create-edit-task';
import { TagAutoCompleteType } from '../constants';
import { TASK_VIEW_MODES, TASK_ACTION_TYPES } from 'app/modules/tasks/constants';
import { CUSTOMER_ACTION_TYPES, CUSTOMER_VIEW_MODES } from 'app/modules/customers/constants';
import { BUSINESS_CARD_ACTION_TYPES, BUSINESS_CARD_VIEW_MODES } from 'app/modules/businessCards/constants';
import { ACTIVITY_ACTION_TYPES, ACTIVITY_VIEW_MODES } from 'app/modules/activity/constants';
import CreateEditSchedule from "app/modules/calendar/popups/create-edit-schedule";

interface ISearchAddSuggestDispatchProps {
  reset,
  handleGetEmployeeList,
  handleGetProductList,
  handleGetMilestoneList,
  handleGetTaskList,
  handleGetProductTradingList,
  handleGetCustomerList,
  handleGetBusinessCardList,
  handleGetActivityList,
}

interface ISearchAddSuggestStateProps {
  action,
  products,
  tasks,
  tradingProducts,
  employees,
  milestones,
  customers,
  activities,
  businessCards,
}

interface ISearchAddSuggestOwnProps {
  id: string,
  fieldBelong: number,
  modeSelect: number,
  onUnfocus?: () => void,
  onActionTriggerSearch?: () => void,
  onActionTriggerAdd?: () => void,
  onSelectRecords?: (records: any[]) => void,
}

type ISearchAddSuggestProps = ISearchAddSuggestDispatchProps & ISearchAddSuggestStateProps & ISearchAddSuggestOwnProps;

const SearchAddSuggest: React.FC<ISearchAddSuggestProps> = forwardRef((props, ref) => {
  const [openPopupAdd, setOpenPopupAdd] = useState(false);
  const [openPopupSearch, setOpenPopupSearch] = useState(false);
  const [openPopupSearchResult, setOpenPopupSearchResult] = useState(false);
  const [conditionSearch, setConditionSearch] = useState(null);
  const [conDisplaySearchDetail, setConDisplaySearchDetail] = useState(false);
  const employeeEditCtrlId = useId(1, "searchAddSuggestEmployeeEditCtrlId_");

  useImperativeHandle(ref, () => ({
    isShowingSearchOrAdd() {
      return openPopupAdd || openPopupSearch || openPopupSearchResult;
    },
  }));

  useEffect(() => {
    return () => {
      props.reset(props.id);
    }
  }, []);

  useEffect(() => {
    const records = [];
    switch (props.fieldBelong) {
      case FIELD_BELONG.EMPLOYEE:
        if (props.employees) {
          records.push(...props.employees);
          records.forEach(e => {
            e['recordId'] = e.employeeId;
          });
        }
        break;
      case FIELD_BELONG.PRODUCT:
        if (props.products) {
          records.push(...props.products);
          records.forEach(e => {
            e['recordId'] = e.productId;
          });
        }
        break;
      case FIELD_BELONG.MILE_STONE:
        if (props.milestones) {
          records.push(...props.milestones);
          records.forEach(e => {
            e['recordId'] = e.taskId;
          });
        }
        break;
      case FIELD_BELONG.TASK:
        if (props.tasks) {
          records.push(...props.tasks);
          records.forEach(e => {
            e['recordId'] = e.taskId;
          });
        }
        break;        
      case FIELD_BELONG.PRODUCT_TRADING:
        if (props.tradingProducts) {
          records.push(...props.tradingProducts);
          records.forEach(e => {
            e['recordId'] = e.productTradingId;
          });
        }
        break;
      case FIELD_BELONG.CUSTOMER:
          if (props.customers) {
            records.push(...props.customers);
            records.forEach(e => {
              e['recordId'] = e.customerId;
            });
          }
        break;
      case FIELD_BELONG.BUSINESS_CARD:
          if (props.businessCards) {
            records.push(...props.businessCards);
            records.forEach(e => {
              e['recordId'] = e.businessCardId;
            });
          }
        break;
        case FIELD_BELONG.ACTIVITY:
          if (props.activities) {
            records.push(...props.activities);
            records.forEach(e => {
              e['recordId'] = e.activityId;
            });
          }
        break;
      default:
        break;
    }
    if (props.onSelectRecords) {
      props.onSelectRecords(records);
    }
  }, [props.products, props.employees, props.milestones, props.tradingProducts, props.tasks, props.businessCards, props.customers, props.activities])

  const onKeyDownSuggestionAdd = (e) => {
    // Check for TAB key press
    if (e.keyCode === 9) {
      // TAB not shift
      if (!e.shiftKey) {
        if (props.onUnfocus) {
          props.onUnfocus();
        }
        e.target.blur();
      }
    }
  }

  const callApiGetRecordsByIds = (ids: number[]) => {
    if (!ids || ids.length < 1) {
      return;
    }
    switch (props.fieldBelong) {
      case FIELD_BELONG.EMPLOYEE:
        props.handleGetEmployeeList(props.id, ids);
        break;
      case FIELD_BELONG.PRODUCT:
        props.handleGetProductList(props.id, ids)
        break;
      case FIELD_BELONG.MILE_STONE:
        props.handleGetMilestoneList(props.id, ids)
        break;
      case FIELD_BELONG.TASK:
        props.handleGetTaskList(props.id, ids)
        break;
      case FIELD_BELONG.PRODUCT_TRADING:
          props.handleGetProductTradingList(props.id, ids)
          break;
      case FIELD_BELONG.CUSTOMER:
          props.handleGetCustomerList(props.id, ids)
          break;
      case FIELD_BELONG.BUSINESS_CARD:
        props.handleGetBusinessCardList(props.id, ids)
        break;
      case FIELD_BELONG.ACTIVITY:
        props.handleGetActivityList(props.id, ids)
        break;
      default:
        break;
    }
  }

  const onHandleClickSearch = (ev) => {
    if (props.onActionTriggerSearch) {
      props.onActionTriggerSearch();
    }
    // Open modal create employee
    setOpenPopupSearch(true);
    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
  }

  const onHandleClickAdd = (ev) => {
    if (props.onActionTriggerAdd) {
      props.onActionTriggerAdd();
    }
    setOpenPopupAdd(true)
    ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
  }

  const onCloseModalAdd = (param?) => {
    if (param) {
      if (props.fieldBelong === FIELD_BELONG.EMPLOYEE) {
        callApiGetRecordsByIds([param.employeeId]);
      } else if (props.fieldBelong === FIELD_BELONG.CUSTOMER) {
        callApiGetRecordsByIds([param.customerId]);
      } else if (props.fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
        callApiGetRecordsByIds([param.businessCardId]);
      } else {
        callApiGetRecordsByIds([param]);
      }
    }
    setOpenPopupAdd(false);
  }

  const handleSearchPopup = (condition) => {
    setConditionSearch(condition);
    setOpenPopupSearch(false);
    setOpenPopupSearchResult(true);
  }

  const onBackFieldsSearchResults = () => {
    setOpenPopupSearch(true);
    setOpenPopupSearchResult(false);
  }

  const onActionSelectSearch = (listRecordChecked) => {
    if (listRecordChecked) {
      const listId = [];
      switch (props.fieldBelong) {
        case FIELD_BELONG.EMPLOYEE:
          listRecordChecked.forEach(item => {
            listId.push(item.employeeId);
          });
          break;
        case FIELD_BELONG.PRODUCT:
          listRecordChecked.forEach(item => {
            listId.push(item.productId);
          });
          break;
        case FIELD_BELONG.MILE_STONE:
          listRecordChecked.forEach(item => {
            listId.push(item.milestoneId);
          });
          break;
        case FIELD_BELONG.TASK:
          listRecordChecked.forEach(item => {
            listId.push(item.taskId);
          });
          break;
        case FIELD_BELONG.CUSTOMER:
          listRecordChecked.forEach(item => {
            listId.push(item.customerId);
          });
          break;
        case FIELD_BELONG.BUSINESS_CARD:
          listRecordChecked.forEach(item => {
            listId.push(item.businessCardId);
          });
          break;
        case FIELD_BELONG.ACTIVITY:
          listRecordChecked.forEach(item => {
            listId.push(item.activityId);
          });
          break;
        default:
          break;
      }
      callApiGetRecordsByIds(listId);
    }
    setOpenPopupSearchResult(false);
  }

  const getTypeSearch = () => {
    if (props.fieldBelong === FIELD_BELONG.EMPLOYEE) {
      return TagAutoCompleteType.Employee;
    } else if (props.fieldBelong === FIELD_BELONG.PRODUCT) {
      return TagAutoCompleteType.Product;
    } else if (props.fieldBelong === FIELD_BELONG.PRODUCT_TRADING) {
      return TagAutoCompleteType.ProductTrading;
    } else if (props.fieldBelong === FIELD_BELONG.MILE_STONE) {
      return TagAutoCompleteType.Milestone;
    } else if (props.fieldBelong === FIELD_BELONG.TASK) {
      return TagAutoCompleteType.Task;
    } else if (props.fieldBelong === FIELD_BELONG.BUSINESS_CARD) {
      return TagAutoCompleteType.BusinessCard;
    } else if (props.fieldBelong === FIELD_BELONG.CUSTOMER) {
      return TagAutoCompleteType.Customer;
    } else if (props.fieldBelong === FIELD_BELONG.ACTIVITY) {
      return TagAutoCompleteType.Activity;
    } else {
      return TagAutoCompleteType.None;
    }
  }

  const renderModalComponent = () => {
    let iconSrc = getIconSrc(props.fieldBelong);
    if (iconSrc && iconSrc.lastIndexOf('/') > 0) {
      iconSrc = iconSrc.slice(iconSrc.lastIndexOf('/'), iconSrc.length);
    }
    return (
      <>
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.EMPLOYEE &&
          <ModalCreateEditEmployee
            id={employeeEditCtrlId[0]}
            key={props.id}
            iconFunction={iconSrc}
            toggleCloseModalEmployee={onCloseModalAdd}
            employeeActionType={EMPLOYEE_ACTION_TYPES.CREATE}
            employeeViewMode={EMPLOYEE_VIEW_MODES.EDITABLE}
            isOpenedFromModal={true}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.PRODUCT &&
          <ModalCreateEditProduct
            iconFunction={iconSrc}
            productActionType={PRODUCT_ACTION_TYPES.CREATE}
            onCloseFieldsEdit={onCloseModalAdd}
            showModal={true}
            hiddenShowNewTab={true}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.MILE_STONE &&
          <CreateEditMilestoneModal
            milesActionType={MILES_ACTION_TYPES.CREATE}
            onCloseModalMilestone={onCloseModalAdd}
            toggleCloseModalMiles={() => setOpenPopupAdd(false)}
            hiddenShowNewTab={true}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.TASK && 
          <ModalCreateEditTask
            onCloseModalTask={onCloseModalAdd}
            toggleCloseModalTask={() => setOpenPopupAdd(false)}
            iconFunction={iconSrc}
            taskActionType={TASK_ACTION_TYPES.CREATE}
            taskViewMode={TASK_VIEW_MODES.EDITABLE}
            canBack={true}
            backdrop={false}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.CUSTOMER && 
          <CreateEditCustomerModal
            iconFunction={iconSrc}
            toggleCloseModalCustomer={onCloseModalAdd}
            customerActionType={CUSTOMER_ACTION_TYPES.CREATE}
            customerViewMode={CUSTOMER_VIEW_MODES.EDITABLE}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.BUSINESS_CARD && 
          <CreateEditBusinessCard
            iconFunction={iconSrc}
            businessCardActionType={BUSINESS_CARD_ACTION_TYPES.UPDATE}
            businessCardViewMode={BUSINESS_CARD_VIEW_MODES.EDITABLE}
            businessCardId={null}
            closePopup={onCloseModalAdd}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.SCHEDULE && 
          <CreateEditSchedule
            onClosePopup={() => onCloseModalAdd()}
          />
        }
        {openPopupAdd && props.fieldBelong === FIELD_BELONG.ACTIVITY &&
          <ActivityModalForm 
            popout={false}
            activityActionType={ACTIVITY_ACTION_TYPES.CREATE}
            activityViewMode={ACTIVITY_VIEW_MODES.EDITABLE}
            onCloseModalActivity={onCloseModalAdd}
            callFromEmployee={true}
            canBack={true}/> 
        }
        {openPopupSearch &&
          <PopupFieldsSearch
            iconFunction={iconSrc}
            fieldBelong={props.fieldBelong}
            conditionSearch={conditionSearch}
            onCloseFieldsSearch={() => setOpenPopupSearch(false)}
            onActionSearch={handleSearchPopup}
            conDisplaySearchDetail={conDisplaySearchDetail}
            setConDisplaySearchDetail={setConDisplaySearchDetail}
            fieldNameExtension={getFieldNameExtension(props.fieldBelong)}
            hiddenShowNewTab={true}
            isOpenedFromModal={true}
          />
        }
        {openPopupSearchResult &&
          <FieldsSearchResults
            iconFunction={iconSrc}
            condition={conditionSearch}
            onCloseFieldsSearchResults={() => setOpenPopupSearchResult(false)}
            onBackFieldsSearchResults={onBackFieldsSearchResults}
            type={getTypeSearch()}
            modeSelect={props.modeSelect}
            onActionSelectSearch={onActionSelectSearch}
          />
        }
      </>
    )
  }
  
  return (
    // <div className={`form-group ${openPopupSearchResult ? '' : 'search'}`}>
    <div className={`form-group search`}>
      <form>
        <button className="submit z-index-999" type="button" 
          onClick={onHandleClickSearch} 
        />
        <label className="text color-999">{translate('dynamic-control.suggestion.search')}</label>
        {props.fieldBelong !== FIELD_BELONG.PRODUCT_TRADING && <button className="button-primary button-add-new add w-auto"
          type="button"
          onKeyDown={onKeyDownSuggestionAdd} 
          onClick={onHandleClickAdd}>
            {translate('dynamic-control.suggestion.add')}
        </button>}
      </form>
      {renderModalComponent()}
    </div>
  )
});


const mapStateToProps = ({ tagAutoCompleteState}: IRootState, ownProps: ISearchAddSuggestOwnProps) => {
  if (!tagAutoCompleteState || !tagAutoCompleteState.data.has(ownProps.id)) {
    return { action: null, errorMessage: null, errorItems: null, suggestionsChoiceId: null, 
            products: [], tradingProducts: [], employees: [], milestones: [], tasks: [], 
            customers: [], businessCards: [], activities: []
          };
  }
  return {
    action: tagAutoCompleteState.data.get(ownProps.id).action,
    products: tagAutoCompleteState.data.get(ownProps.id).products,
    tradingProducts: tagAutoCompleteState.data.get(ownProps.id).tradingProducts,
    employees: tagAutoCompleteState.data.get(ownProps.id).employees,
    milestones: tagAutoCompleteState.data.get(ownProps.id).milestones,
    tasks: tagAutoCompleteState.data.get(ownProps.id).tasks,
    customers: tagAutoCompleteState.data.get(ownProps.id).customers,
    businessCards: tagAutoCompleteState.data.get(ownProps.id).businessCards,
    activities: tagAutoCompleteState.data.get(ownProps.id).activities,
  }
}

const mapDispatchToProps = {
  reset,
  handleGetEmployeeList,
  handleGetProductList,
  handleGetMilestoneList,
  handleGetTaskList,
  handleGetProductTradingList,
  handleGetCustomerList,
  handleGetBusinessCardList,
  handleGetActivityList,
};

const options = { forwardRef: true };

export default connect<ISearchAddSuggestStateProps, ISearchAddSuggestDispatchProps, ISearchAddSuggestOwnProps>(
  mapStateToProps,
  mapDispatchToProps,
  null,
  options as Options
)(SearchAddSuggest);
