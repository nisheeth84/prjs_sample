import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { connect, Options } from 'react-redux';
import { Modal } from 'reactstrap';
import { IRootState } from 'app/shared/reducers';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list';
import {
    handleSearchEmployees,
    handleSearchProducts,
    handleSearchMilestones,
    handleSearchProductTradings,
    handleSearchTasks,
    handleSearchCustomers,
    handleSearchBusinessCard,
    FieldsSearchResultsAction
} from './fields-search-result.reducer'
import { TagAutoCompleteMode, TagAutoCompleteType } from '../constants';
import { FIELD_BELONG, ScreenMode, EXTENSION_BELONG, TYPE_MSG_EMPTY } from 'app/config/constants';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { customHeaderField } from 'app/modules/employees/list/special-render/special-render';
import * as R from 'ramda'
import { renderCellSpecial } from './special-cell';

interface IFieldsSearchResultsDispatchProps {
    handleSearchEmployees,
    handleSearchProducts,
    handleSearchMilestones,
    handleSearchProductTradings,
    handleSearchTasks,
    handleSearchBusinessCard,
    handleSearchCustomers
}

interface IIFieldsSearchResultsStateProps {
    action?,
    dataResponse?
}
interface IFieldsSearchResultsOwnProps {
    condition: any,
    onCloseFieldsSearchResults: () => void,
    onBackFieldsSearchResults: () => void,
    modeSelect: TagAutoCompleteMode,
    type: TagAutoCompleteType,
    onActionSelectSearch: (listRecordChecked) => void,
    iconFunction: string
}

type IFieldsSearchResultsProps = IFieldsSearchResultsDispatchProps & IIFieldsSearchResultsStateProps & IFieldsSearchResultsOwnProps;

export const FieldsSearchResults: React.FC<IFieldsSearchResultsProps> = forwardRef((props, ref) => {
    const tableListRef = useRef(null);
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
    const [value, setValue] = useState(false);
    const [belongDynamic, setBelongDynamic] = useState(FIELD_BELONG.EMPLOYEE);
    const [idDynamic, setIdDynamic] = useState(null);
    const [keyRecordIdDynamic, setKeyRecordIdDynamic] = useState(null);
    const [titleResult, setTitleResult] = useState("");
    const [listRecordChecked, setListRecordChecked] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsResults, setRecordResults] = useState([]);
    const [isShowPaging, setShowPaging] = useState(false);
    const getSelectedRecord = (list) => {
        setListRecordChecked(list);
    }

    const handleSearch = (offsetRecord, limitRecord) => {
        switch (props.type) {
            case TagAutoCompleteType.Employee:
                props.handleSearchEmployees(offsetRecord, limitRecord, props.condition);
                break;
            case TagAutoCompleteType.Product:
                props.handleSearchProducts(offsetRecord, limitRecord, props.condition);
                break;
            case TagAutoCompleteType.Milestone:
                props.handleSearchMilestones(offsetRecord, limitRecord, props.condition);
                break;
            case TagAutoCompleteType.ProductTrading:
                props.handleSearchProductTradings(offsetRecord, limitRecord, props.condition);
                break;
            case TagAutoCompleteType.Task:
                props.handleSearchTasks(offsetRecord, limitRecord, props.condition);
                break;
            case TagAutoCompleteType.Customer:
                props.handleSearchCustomers(offsetRecord, limitRecord, props.condition);
                break;
            case TagAutoCompleteType.BusinessCard:
                props.handleSearchBusinessCard(offsetRecord, limitRecord, props.condition);
                break;
            default: break;
        }
    }

    const onPageChange = (offsetRecord, limitRecord) => {
        setOffset(offsetRecord);
        setLimit(limitRecord);
        handleSearch(offsetRecord, limitRecord);
    }

    useEffect(() => {
        switch (props.type) {
            case TagAutoCompleteType.Employee:
                setBelongDynamic(FIELD_BELONG.EMPLOYEE);
                setIdDynamic("EMPLOYEE_LIST_ID");
                setKeyRecordIdDynamic("employeeId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_employees'));
                break;
            case TagAutoCompleteType.Product:
                setBelongDynamic(FIELD_BELONG.PRODUCT);
                setIdDynamic("PRODUCT_LIST_ID");
                setKeyRecordIdDynamic("productId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_products'));
                break;
            case TagAutoCompleteType.Milestone:
                setBelongDynamic(FIELD_BELONG.MILE_STONE);
                setIdDynamic("MILESTONE_LIST_ID");
                setKeyRecordIdDynamic("milestoneId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_milestones'));
                break;
            case TagAutoCompleteType.ProductTrading:
                setBelongDynamic(FIELD_BELONG.PRODUCT_TRADING);
                setIdDynamic("PRODUCT_TRADING_LIST_ID");
                setKeyRecordIdDynamic("productTradingId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_product_tradings'));
                break;
            case TagAutoCompleteType.Task:
                setBelongDynamic(FIELD_BELONG.TASK);
                setIdDynamic("TASK_LIST_ID");
                setKeyRecordIdDynamic("taskId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_tasks'));
                break;
            case TagAutoCompleteType.Customer:
                setBelongDynamic(FIELD_BELONG.CUSTOMER);
                setIdDynamic("CUSTOMER_LIST_ID");
                setKeyRecordIdDynamic("customerId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_customers'));
                break;
            case TagAutoCompleteType.BusinessCard:
                setBelongDynamic(FIELD_BELONG.BUSINESS_CARD);
                setIdDynamic("BUSINESSCARD_LIST_ID");
                setKeyRecordIdDynamic("businessCardId");
                setTitleResult(translate('dynamic-control.popup_search_results.title_business_cards'));
                break;
            default:
                break;
        }
        return (() => {
            setTotalRecords(0);
            setRecordResults([]);
            setOffset(0);
            setLimit(RECORD_PER_PAGE_OPTIONS[1]);
        });
    }, [])

    useEffect(() => {
        if (!value) {
            handleSearch(offset, limit);
            setValue(true);
        }
    }, [value]);

    useEffect(() => {
        let isShow = false;
        if (!props.dataResponse) {
            return;
        }
        switch (props.action) {
            case FieldsSearchResultsAction.SuccessGetEmployee:
                setTotalRecords(props.dataResponse.totalRecords);
                setRecordResults(props.dataResponse.employees);
                if (props.dataResponse.totalRecords > 0) {
                    isShow = true;
                }
                break;
            case FieldsSearchResultsAction.SuccessGetProduct:
                setTotalRecords(props.dataResponse.totalCount);
                setRecordResults(R.path(['dataInfo', 'products'], props.dataResponse));
                if (props.dataResponse.totalCount > 0) {
                    isShow = true;
                }
                break;
            case FieldsSearchResultsAction.SuccessGetMilestones:
                setTotalRecords(props.dataResponse.countMilestone);
                setRecordResults(props.dataResponse.milestones);
                if (props.dataResponse.countMilestone > 0) {
                    isShow = true;
                }
                break;
            case FieldsSearchResultsAction.SuccessGetProductTradings:
                setTotalRecords(props.dataResponse.total);
                setRecordResults(props.dataResponse.productTradings);
                if (props.dataResponse.total > 0) {
                    isShow = true;
                }
                break;
            case FieldsSearchResultsAction.SuccessGetTask:
                setTotalRecords(props.dataResponse.countTotalTask);
                setRecordResults(props.dataResponse.tasks);
                if (props.dataResponse.countTotalTask > 0) {
                    isShow = true;
                }
                break;
            case FieldsSearchResultsAction.SuccessGetCustomers:
                setTotalRecords(props.dataResponse.totalRecords);
                setRecordResults(props.dataResponse.customers);
                if (props.dataResponse.totalRecords > 0) {
                    isShow = true;
                }
                break;
            case FieldsSearchResultsAction.SuccessGetBusinessCards:
                setTotalRecords(props.dataResponse.totalRecords);
                setRecordResults(props.dataResponse.businessCards);
                if (props.dataResponse.totalRecords > 0) {
                    isShow = true;
                }
                break;
            default:
                break;
        }
        setShowPaging(isShow);
        tableListRef && tableListRef.current && tableListRef.current.changeTargetSidebar(0, 0);
    }, [props.action])

    const baseUrl = window.location.origin.toString();
    const getIconFunction = () => {
        if (!props.iconFunction) {
            return <></>;
        } else {
            return <img className="icon-group-user" src={baseUrl + `/content/images/${props.iconFunction}`} alt="" />;
        }
    };

    // const customContentField = (fieldColumn, rowData, mode, nameKey) => {
    //     try {
    //         if (props.type !== TagAutoCompleteType.Employee || !rowData || !fieldColumn) {
    //             return;
    //         }
    //         if (_.isArray(fieldColumn)) {
    //             const idxSurname = fieldColumn.find(item => item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname);
    //             const idxSurnameKana = fieldColumn.find(item => item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana);
    //             if (idxSurname) {
    //                 return (
    //                     <div className='overflow-menu margin-left-4'>
    //                         {rowData["employee_icon"] && rowData["employee_icon"]["fileUrl"] && <a className="avatar"> <img src={rowData["employee_icon"]["fileUrl"]} /> </a>}
    //                         {(!rowData["employee_icon"] || !rowData["employee_icon"]["fileUrl"]) &&
    //                             <a className={'avatar ' + getColorImage(7)}> {rowData.employee_surname.charAt(0)} </a>
    //                         }
    //                         <div className="d-inline-block text-ellipsis max-calc66">{rowData.employee_surname ? rowData.employee_surname : ''}  {rowData.employee_name ? rowData.employee_name : ''}</div>
    //                     </div>
    //                 );
    //             } else if (idxSurnameKana) {
    //                 return <span className="d-inline-block text-ellipsis">
    //                     {rowData.employee_surname_kana ? rowData.employee_surname_kana : ''} {rowData.employee_name_kana ? rowData.employee_name_kana : ''}
    //                 </span>
    //             }
    //         }
    //         else {
    //             if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager && rowData.employee_departments.length > 0) {
    //                 return <>
    //                     {
    //                         rowData.employee_departments.map((element, idx) => {
    //                             return (
    //                                 <a key={idx} className="specical-employee-item text-ellipsis">
    //                                     {getFieldLabel(element, 'employeeFullName')}
    //                                 </a>
    //                             )
    //                         })
    //                     }
    //                 </>;
    //             }
    //             if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates && rowData.employee_subordinates.length > 0) {
    //                 return <a className="specical-employee-item text-ellipsis">
    //                     {rowData.employee_subordinates.map((element, index) => {
    //                         if (index !== rowData.employee_subordinates.length - 1) {
    //                             return (<a> {element.employeeFullName},</a>)
    //                         } else {
    //                             return (<a> {element.employeeFullName}</a>)
    //                         }
    //                     })}
    //                 </a>
    //             }
    //             if (fieldColumn.fieldName === 'timezone_id') {
    //                 return <>{rowData.timezone && rowData.timezone.timezoneShortName}</>;
    //             }

    //             if (fieldColumn.fieldName === 'language_id') {
    //                 return <>{rowData.language && rowData.language.languageName}</>;
    //             }
    //             if (rowData.employee_departments && rowData.employee_departments.length > 0) {
    //                 let text2 = '';
    //                 if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
    //                     rowData.employee_departments.map((element) => {
    //                         text2 += '<div class = "specical-employee-item text-ellipsis" title="' + getPathTreeName(getFieldLabel(element, 'pathTreeName')) + '">' + getPathTreeName(getFieldLabel(element, 'pathTreeName')) + '</div>';
    //                     });
    //                 }
    //                 if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
    //                     rowData.employee_departments.map((element) => {
    //                         text2 += '<div class = "specical-employee-item text-ellipsis">' + getFieldLabel(element, 'positionName') + '</div>';
    //                     });
    //                 }
    //                 return <>{ReactHtmlParser(text2)}</>;
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return <></>;
    //     }
    //     return <></>;
    // }

    return (
        <Modal isOpen={true} fade={true} toggle={() => { }} id="popup-suggest-tag-field-search" autoFocus={true} zIndex="auto">
        <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show popup-search" id="popup-esr" aria-hidden="true">
            <div className="modal-dialog form-popup">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="left">
                            <div className="popup-button-back">
                                <a className="icon-small-primary icon-return-small" onClick={() => { props.onBackFieldsSearchResults() }} />
                                <span className="text">
                                    {getIconFunction()}
                                    {titleResult}
                                </span>
                            </div>
                        </div>
                        <div className="right">
                            <a className="icon-small-primary icon-close-up-small line" onClick={() => { props.onCloseFieldsSearchResults(); }} />
                        </div>
                    </div>
                    <div className="modal-body style-3">
                        {(props.dataResponse) &&
                            <div className="esr-content-body-main">
                                <div className="pagination-top text-right">
                                    <div className="esr-pagination">
                                        {isShowPaging && (
                                            <PaginationList offset={offset} limit={limit} totalRecords={totalRecords} onPageChange={onPageChange} />
                                        )}
                                    </div>
                                </div>
                                {recordsResults &&
                                    <DynamicList
                                        ref={tableListRef}
                                        id={idDynamic}
                                        records={recordsResults} // list record display in list
                                        belong={belongDynamic} // belong of module function (field-belong)
                                        keyRecordId={keyRecordIdDynamic} // field name of record id in list record
                                        isResultsSearch={true}
                                        totalRecords={totalRecords}
                                        mode={ScreenMode.DISPLAY}
                                        modeSelected={props.modeSelect}
                                        checkboxFirstColumn={true}
                                        onSelectedRecord={getSelectedRecord}
                                        customHeaderField={customHeaderField}
                                        // getCustomFieldValue={customFieldValue}
                                        customContentField={(field, rowData, mode, nameKey) => renderCellSpecial(field, rowData, mode, nameKey, props.type)}
                                        extBelong={props.type === TagAutoCompleteType.Milestone ? EXTENSION_BELONG.SEARCH_DETAIL : EXTENSION_BELONG.LIST}
                                        typeMsgEmpty={TYPE_MSG_EMPTY.SEARCH}
                                    />}
                            </div>}
                        <div className="user-popup-form-bottom">
                            <a className="button-cancel" onClick={() => { props.onBackFieldsSearchResults(); }}>
                                {translate('dynamic-control.popup_search_results.cancel')}
                            </a>
                            <a
                                className={listRecordChecked && _.size(listRecordChecked) > 0 ? 'button-blue' : 'button-blue disable'}
                                onClick={() => {
                                    if (listRecordChecked && _.size(listRecordChecked) > 0) {
                                        props.onActionSelectSearch(listRecordChecked);
                                    }
                                }}
                            >
                                {translate('dynamic-control.popup_search_results.select')}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Modal>
    );
});

const mapStateToProps = ({ fieldsSearchResultsState }: IRootState) => ({
    action: fieldsSearchResultsState.action,
    dataResponse: fieldsSearchResultsState.dataResponse
});

const mapDispatchToProps = {
    handleSearchEmployees,
    handleSearchProducts,
    handleSearchMilestones,
    handleSearchProductTradings,
    handleSearchTasks,
    handleSearchBusinessCard,
    handleSearchCustomers
};

const options = { forwardRef: true };

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    options as Options
)(FieldsSearchResults);