import React, { useState, useEffect } from 'react';
import DynamicList from "app/shared/layout/dynamic-form/list/dynamic-list"
import _ from 'lodash';
import { TAB_ID_LIST } from '../../constants';
import { FieldInfoType, DEFINE_FIELD_TYPE } from 'app/shared/layout/dynamic-form/constants';
import { translate } from 'react-jhipster';
import PaginationList from 'app/shared/layout/paging/pagination-list';
import * as R from 'ramda';
import { RECORD_PER_PAGE_OPTIONS } from 'app/shared/util/pagination.constants';
import { FIELD_BELONG, ControlType } from 'app/config/constants';
import Popover from 'app/shared/layout/common/Popover';
import OverFlowMenu from 'app/shared/layout/common/overflow-menu';
import { BUSINESS_SPECIAL_FIELD_NAMES } from 'app/modules/businessCards/constants';
import { getValueProp } from 'app/shared/util/entity-utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import { connect } from 'react-redux';
import { IRootState } from 'app/shared/reducers';
import { handleInitBusinessCardTab } from 'app/modules/employees/popup-detail/popup-employee-detail-reducer'
import PopupCustomerDetail from 'app/modules/customers/popup-detail/popup-customer-detail';
import { useId } from "react-id-generator";
import { TYPE_DETAIL_MODAL } from 'app/modules/activity/constants';
import { renderItemNotEdit } from 'app/modules/customers/list/special-render/special-render';
import businessCard from 'app/modules/customers/department/business-card';
import { getColorImage } from 'app/shared/util/string-utils';

export interface IPopupTabBusinessCards extends StateProps, DispatchProps {
  id: string,
  fieldInfo?: any;
  employeeId?: any;
  showAnyDetail?: any
}


const TabBusinessCards = (props: IPopupTabBusinessCards) => {
  const [fields, setFields] = useState([]);

  const [limit, setLimit] = useState(RECORD_PER_PAGE_OPTIONS[1]);
  const [offset, setOffset] = useState(0);

  const [activeIcon, setActiveIcon] = useState(false);
  const [openOverFlow, setOpenOverFlow] = useState(null)
  const [heightPosition,] = useState(1); // setHeightPosition

  const [activeIconCard, setActiveIconCard] = useState(false);
  const [openOverFlowCard,] = useState(null) // setOpenOverFlowCard
  const [heightPositionCard,] = useState(1); // setHeightPositionCard

  const [customerModalEmail,] = useState(null); // setCustomerModalEmail

  const [openPopupCustomerDetail, setOpenPopupCustomerDetail] = useState(false);
  const [customerIdDetail, setCustomerIdDetail] = useState();

  const customerDetailCtrlId = useId(1, "businessCardCustomerDetailCtrlId_");

  const paramTmp = {
    offset,
    limit,
    filterConditions: [],
    orderBy: [],
    loginFlag: false,
    employeeId: props.employeeId,
    customerId: null
  }

  const [param, setParam] = useState(paramTmp)

  useEffect(() => {
    if (props.businessCardList && props.businessCardList.businessCards && props.businessCardList.businessCards.length > 0) {
      const tmpBusinessCardList = _.cloneDeep(props.businessCardList.businessCards);

      tmpBusinessCardList.forEach((e, index) => {
        const zipCode = tmpBusinessCardList[index].zip_code ? tmpBusinessCardList[index].zip_code : "";
        const building = tmpBusinessCardList[index].building ? tmpBusinessCardList[index].building : "";
        const address = tmpBusinessCardList[index].address ? tmpBusinessCardList[index].address : "";
        e['address'] = JSON.stringify({
          zipCode,
          address: zipCode + address + building,
          buildingName: building,
          addressName: address
        })
      })
      // TODO:
      // totalRecords = props.businessCardList.totalRecords;
      // businessCardList = _.cloneDeep(tmpBusinessCardList);
    }
  }, [props.businessCardList]);

  useEffect(() => {
    if (props.fieldInfo) {
      setFields(props.fieldInfo);
    }
  }, [props.fieldInfo]);

  useEffect(() => {
    props.handleInitBusinessCardTab(props.id, param);
  }, []);

  /**
   * Open Employee Detail
   * @param employeeIdIn
   */
  const onClickDetailEmployee = (employeeIdIn) => {
    if(props.employeeId === employeeIdIn) return;
    props.showAnyDetail(employeeIdIn, TYPE_DETAIL_MODAL.EMPLOYEE);
  }

  const onOpenPopupCustomerDetail = (customerId, fieldId) => {
    if (!openPopupCustomerDetail && fieldId !== null) {
      setOpenPopupCustomerDetail(!openPopupCustomerDetail);
      setCustomerIdDetail(customerId);
    }
  }

  const getPositionString = (rowData) => {
    if (getValueProp(rowData, 'department_name') && getValueProp(rowData, 'position')) {
      let arr = [];
      const index = getValueProp(rowData, 'department_name').indexOf("兼");
      if (index < 0) {
        const idx = getValueProp(rowData, 'position').indexOf("兼");
        if (idx <= 0) {
          const idxBp = getValueProp(rowData, 'position').indexOf(getValueProp(rowData, 'department_name'));
          if (idxBp >= 0) {
            const position = getValueProp(rowData, 'position').slice(idxBp).trim();
            if (position.length > 0) {
              arr = [position]
            }
          }
        }
      } else {
        const department = getValueProp(rowData, 'department_name').split('兼');
        const positions = getValueProp(rowData, 'position').split('兼');
        if (positions.length > 1) {
          if (department.length === positions.length) {
            const arrs = []
            department.forEach((e, idxP) => {
              const positionArr = positions[idxP].trim().split(" ");
              let string = '';
              for (let m = 0; m < positionArr.length - 1; m++) {
                string = string + " " + positionArr[m];
              }
              if (positionArr.length >= 2 && string.trim() === e.trim()) {
                arrs.push(positions[idxP])
              }
            });
            arr = arrs.length === department.length ? [...arrs] : [];
          }
        }
      }
      if (arr.length > 0) {
        return arr
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  const checkSaveMove = (id) => {
    // const index = businessCardList.findIndex(e => e.business_card_id === id);
    // if (index >= 0) {
    //   return (businessCardList[index]["save_mode"] !== 1);
    // }
    return false;
  }

  const onClickEmail = (email) => {
    window.location.href = `mailto:${email}`;
  }

  const checkEmail = (rowData) => {
    return getValueProp(rowData, 'email_address') && getValueProp(rowData, 'email_address').length > 0;
  }

  /**
 * event on click open modal detail customer
 * @param taskId
 */
  const onClosePopupCustomerDetail = () => {
    setOpenPopupCustomerDetail(false);
  }

  const showPopupCustomerDetailScreen = (currentCustomerId, listCustomerId) => {
    return (
      <>
        {
          <PopupCustomerDetail
            id={customerDetailCtrlId[0]}
            showModal={true}
            customerId={currentCustomerId}
            listCustomerId={listCustomerId}
            toggleClosePopupCustomerDetail={onClosePopupCustomerDetail}
            openFromOtherServices={true}
            isOpenCustomerDetailNotFromList={true}
          />
        }
      </>
    )
  }

  const customContentField = (fieldColumn, rowData, mode, nameKey) => {
    const rowData2 = _.cloneDeep(rowData);
    rowData2['created_user'] = rowData['createdUserInfo'];
    rowData2['updated_user'] = rowData['updatedUserInfo'];
    if (_.isArray(fieldColumn)) {
      const idxCompanyName = fieldColumn.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName);
      const idxPositions = fieldColumn.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions);
      const idxEmail = fieldColumn.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress);
      if (idxCompanyName) {
        const customerString = "customer" + getValueProp(rowData, 'business_card_id').toString();
        const businessCardString = "businessCard" + getValueProp(rowData, 'business_card_id').toString();
        const activeClass = (activeIcon || openOverFlow === customerString) ? 'active' : '';
        const activeClassCard = (activeIconCard || openOverFlowCard === businessCardString) ? 'active' : '';
        const lastName = getValueProp(rowData, 'last_name') ? getValueProp(rowData, 'last_name') : "";
        return (
          <>
            {
              getValueProp(rowData, 'customer_id') ?
                <div className='overflow-menu' onMouseOut={(e) => { setActiveIcon(false) }}>
                  <a
                    className="d-inline-block text-ellipsis max-calc66 w-auto"
                    title=""
                  >
                    <Popover x={-20} y={50} >
                      {getValueProp(rowData, 'customer_name')
                        ? getValueProp(rowData, 'customer_name')
                        : getValueProp(rowData, 'alternative_customer_name')}
                    </Popover>
                  </a>
                  <a
                    title=""
                    className="icon-small-primary icon-link-small overflow-menu-item"
                    href={`${window.location.origin}/${props.tenant}/customer-detail/${getValueProp(rowData, 'customer_id')}`}
                    target="_blank" rel="noopener noreferrer"></a>
                  <div className={`d-inline position-relative overflow-menu-item ${heightPosition < 200 ? 'position-top' : ''}`}
                    onMouseLeave={(e) => setOpenOverFlow(null)}>
                    <a
                      id={getValueProp(rowData, 'business_card_id')}
                      title=""
                      className={`icon-small-primary icon-sort-small ${activeClass}`}
                    >
                    </a>
                    {openOverFlow === customerString &&
                      <OverFlowMenu
                        setOpenOverFlow={setOpenOverFlow}
                        fieldBelong={FIELD_BELONG.CUSTOMER}
                        param={rowData}
                        showTooltipActivity={props.historyActivities}
                        showToolTipMail={customerModalEmail !== null}
                      />}
                  </div>
                </div> :
                <div className='overflow-menu'>
                  <div className="d-inline-block text-ellipsis max-calc66 w-auto">
                    <Popover x={-20} y={50} >
                      {getValueProp(rowData, 'alternative_customer_name')}
                    </Popover>
                  </div>
                </div>
            }
            <div className='overflow-menu' onMouseOut={(e) => { setActiveIconCard(false) }} >
              <a
                className="d-inline-block text-ellipsis max-calc66 w-auto"
                title=""
              >
                <Popover x={-20} y={50} >
                  {getValueProp(rowData, 'first_name') + " " + lastName}
                </Popover>
              </a>
              <a title=""
                className="icon-small-primary icon-link-small overflow-menu-item"
                href={`${window.location.origin}/${props.tenant}/business-card-detail/${getValueProp(rowData, 'business_card_id')}`}
                target="_blank"
                rel="noopener noreferrer"></a>
              <div className={`d-inline position-relative overflow-menu-item ${heightPositionCard < 200 ? 'position-top' : ''}`} >
                <a id={getValueProp(rowData, 'business_card_id')}
                  title=""
                  className={`icon-small-primary icon-sort-small ${activeClassCard}`}
                >
                </a>
              </div>
            </div>
            {
              checkSaveMove(getValueProp(rowData, 'business_card_id')) &&
              <div className='overflow-menu'>
                <a title="" className="button-wait save-mode-label">{translate("businesscards.list.saveMode")}</a>
              </div>
            }
          </>
        );
      }

      if (idxPositions) {
        const positionsArr = getPositionString(rowData);
        return (
          positionsArr ?
            <div>
              {
                positionsArr.map((e, idx) => (
                  <div key={idx}>
                    <Popover x={-20} y={50} >
                      <span className="mr-3">{e}</span>
                    </Popover>
                  </div>
                ))
              }
            </div> :
            <div>
              <Popover x={-20} y={50} >
                <span className="mr-3">{getValueProp(rowData, 'department_name')} {getValueProp(rowData, 'position')}</span>
              </Popover>
            </div>
        )
      }
      if (idxEmail) {
        return (
          <>
            <div>{getValueProp(rowData, 'phone_number')}</div>
            <div>{getValueProp(rowData, 'mobile_number')}</div>
            {checkEmail(rowData) &&
              <div onClick={() => onClickEmail(getValueProp(rowData, 'email_address'))}>
                <a title="">
                  <Popover x={-20} y={50} >
                    <span className="mr-3">{getValueProp(rowData, 'email_address')}</span>
                  </Popover>
                </a>
              </div>
            }

          </>
        )
      }
    } else {
      switch (fieldColumn.fieldName.toString()) {
        case BUSINESS_SPECIAL_FIELD_NAMES.employeeId:
          return <>
            {
              getValueProp(rowData, 'business_cards_receives').map((e, index) => {
                const employeeSurname = e.employeeSurname ? e.employeeSurname : "";
                const employeeName = e.employeeName ? e.employeeName : "";
                const charEmploy = R.path(['employeeName'], e) ? R.path(['employeeName'], e).charAt(0) : '';
                if(e.employeeId === props.employeeId){
                  return <div className="text-ellipsis over-unset relative org-view text-over p-0" key={e.employeeId}>
                      {R.path(['filePath'], e) ? <a className="avatar mr-1 v2"><img src={R.path(['filePath'], e)} /></a> : <a className={'avatar mr-1 v2 ' + getColorImage(7)}> {charEmploy} </a>}
                      <div className="d-inline-block text-ellipsis color-000 max-calc66">
                        <Popover x={-20} y={25}>
                          <span>{employeeSurname}{' '}{employeeName}</span>
                        </Popover>
                      </div>
                    </div>
                }
                return (
                  <div className="text-ellipsis over-unset relative org-view text-over p-0" key={e.employeeId}>
                    {R.path(['filePath'], e) ? <a className="avatar mr-1 v2"><img src={R.path(['filePath'], e)} /></a> : <a className={'avatar mr-1 v2 ' + getColorImage(7)}> {charEmploy} </a>}
                    <a className={`d-inline-block text-ellipsis max-calc66`}
                      onClick={() => onClickDetailEmployee(e.employeeId)}>
                      <Popover x={-20} y={25}>
                        <span>{employeeSurname}{' '}{employeeName}</span>
                      </Popover>
                    </a>
                  </div>
                )
              }
              )
            }
          </>
        case BUSINESS_SPECIAL_FIELD_NAMES.createdUser:
          return renderItemNotEdit(fieldColumn, rowData2, props.tenant, onClickDetailEmployee, props.employeeId);
        case BUSINESS_SPECIAL_FIELD_NAMES.updatedUser:
          return renderItemNotEdit(fieldColumn, rowData2, props.tenant, onClickDetailEmployee, props.employeeId);
        case BUSINESS_SPECIAL_FIELD_NAMES.isWorking:
          return getValueProp(rowData, 'is_working')
            ? <>{translate("businesscards.list.isWorking.working")}</>
            : <>{translate("businesscards.list.isWorking.notWorking")}</>;
        case BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate:
          return <>
            {
              getValueProp(rowData, 'business_cards_receives').map((e, index) =>
                <div key={index}><span className="mr-3 height-27 d-inline-flex align-items-center">{utcToTz(e.receiveDate, DATE_TIME_FORMAT.User)}</span></div>
              )
            }
          </>
        case BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath:
          {
            const imgSrc = getValueProp(rowData, 'business_card_image_path');
            const imageId = getValueProp(rowData, 'business_card_id');
            return (
              <div id={imageId} className="text-over text-ellipsis width-200" >
                {imgSrc ? <a className="image_table" title="" ><img className="product-item" src={imgSrc} alt="" title="" /></a> :
                  <a className="image_table no_image_table" title="" ><img className="product-item" src="../../content/images/noimage.png" alt="" title="" /></a>}
              </div>
            )
          }
        case BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName:
          {
            return (<>
              <a
                className="d-inline-block text-ellipsis max-calc66 w-auto"
                title=""
                onClick={() => onOpenPopupCustomerDetail(getValueProp(rowData, 'customer_id'), fieldColumn.fieldId)}
              >
                <Popover x={-20} y={50} >
                  {getValueProp(rowData, 'customer_name')
                    ? getValueProp(rowData, 'customer_name')
                    : getValueProp(rowData, 'alternative_customer_name')}
                </Popover>
              </a>
            </>
            )
          }
        case BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress:
          {
            return (
              <>
                <div onClick={() => onClickEmail(getValueProp(rowData, 'email_address'))}>
                  <a title="">
                    <Popover x={-20} y={50} >
                      <span className="mr-3">{getValueProp(rowData, 'email_address')}</span>
                    </Popover>
                  </a>
                </div>
              </>
            )
          }
        case BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions:
          {
            return (
              <>
                <div>
                  <Popover x={-20} y={50} >
                    <span className="mr-3">{getValueProp(rowData, 'department_name')} {getValueProp(rowData, 'position')}</span>
                  </Popover>
                </div>
              </>
            )
          }
        default:
          break;
      }
    }
  }

  const onPageChange = (offsetRecord, limitRecord) => {
    setOffset(offsetRecord);
    setLimit(limitRecord);
    param.offset = offsetRecord;
    param.limit = limitRecord;
    setParam(_.cloneDeep(param));

    props.handleInitBusinessCardTab(props.id, param);
  }

  const renderMsgEmpty = (serviceStr) => {
    const msg = translate('messages.INF_COM_0020', { 0: serviceStr })
    return (
      <div>{msg}</div>
    )
  };

  const getIsWorkingItem = () => {
    const publicItems = [];
    publicItems.push(
      {
        itemId: 1,
        itemLabel: translate("businesscards.create-edit.isWorking"),
        itemOrder: 1,
        isAvailable: true
      },
      {
        itemId: 0,
        itemLabel: translate("businesscards.create-edit.notWorking"),
        itemOrder: 2,
        isAvailable: true
      }
    )
    return publicItems;
  }

  const convertSpecialItemFilter = fieldInfo => {
    let data = null;
    fieldInfo && fieldInfo.map(item => {
      if (item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardFirstName) {
        data = item;
        return;
      }
      if (item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardDepartments) {
        data = item;
        return;
      }
      if (item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress) {
        data = item;
        return;
      }
    });
    return data;
  };

  /**
   * Custom FieldInfo when view/edit/filter on list
   * FieldInfo type = 99
   */
  const customFieldsInfo = (field, type) => {
    const fieldCustom = _.cloneDeep(field);
    if (ControlType.FILTER_LIST === type) {
      if (_.isArray(fieldCustom)) {
        return convertSpecialItemFilter(fieldCustom);
      }
      if (field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.isWorking) {
        fieldCustom.fieldItems = getIsWorkingItem();
        fieldCustom.fieldType = DEFINE_FIELD_TYPE.CHECKBOX;
      }
      return fieldCustom;
    }
    return field;
  }

  const customHeaderField = (field) => {
    if (_.isArray(field)) {
      const idxCompanyName = field.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName);
      const idxPositions = field.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions);
      const idxEmail = field.find(item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress);
      if (idxCompanyName) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.companyName")}</Popover>;
      }
      if (idxPositions) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.positionName")}</Popover>;
      }
      if (idxEmail) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.contactName")}</Popover>;
      }
    } else {
      if (field.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.address) {
        return <Popover x={-20} y={25}>{translate("businesscards.list.header.address")}</Popover>;
      }
    }
  }

  const renderComponent = () => {
    if (props.businessCards && (props.businessCards?.totalRecord > 0)) {
      return (
        <>
          <div className="overflow-hidden">
            <div className="pagination-top max-width-220 d-flex">
              <div className="esr-pagination">
                <PaginationList
                  offset={offset}
                  limit={limit}
                  totalRecords={R.path(['totalRecord'], props.businessCards)}
                  onPageChange={onPageChange} />
              </div>
            </div>
            <DynamicList
              id="EmployeeDetailTabBusinessCard"
              tableClass="table-list"
              keyRecordId="businessCardId"
              records={props.businessCards.businessCardList}
              belong={FIELD_BELONG.BUSINESS_CARD}
              extBelong={+TAB_ID_LIST.businessCard}
              fieldInfoType={FieldInfoType.Tab}
              forceUpdateHeader={false}
              fields={fields}
              fieldLinkHolver={[
                { fieldName: 'businessCardName', link: '#', hover: '', action: [] },
                { fieldName: 'streetAddress', link: '#', hover: '', action: [] }]
              }
              getCustomFieldInfo={customFieldsInfo}
              customContentField={customContentField}
              customHeaderField={customHeaderField}
              fieldNameExtension={"businessCardData"}
            >
            </DynamicList>
          </div>
          {openPopupCustomerDetail && showPopupCustomerDetailScreen(customerIdDetail, [])}
        </>
      )
    } else {
      return (
        <>
          <div className="h-100">
            <div className="align-center images-group-content" >
              <img className="images-group-16" src={'/content/images/ic-sidebar-business-card.svg'} alt="" />
              {renderMsgEmpty(translate('customers.detail.label.tab.businessCard'))}
            </div>
          </div>
        </>
      )
    }
  }

  return renderComponent();
}

const mapStateToProps = ({ employeeDetail, applicationProfile }: IRootState, ownProps: any) => ({
  businessCards: employeeDetail.data.has(ownProps.id) ? employeeDetail.data.get(ownProps.id).businessCards : {},
  // businessCards: employeeDetail.businessCards,
  // action: employeeDetail.action,
  businessCardList: employeeDetail.data.has(ownProps.id) ? employeeDetail.data.get(ownProps.id).businessCards?.businessCardList : [],
  // businessCardList: employeeDetail.businessCards?.businessCardList,
  totalRecord: employeeDetail.data.has(ownProps.id) ? employeeDetail.data.get(ownProps.id).businessCards?.totalRecord : null,
  // totalRecord: employeeDetail.businessCards?.totalRecord,
  tenant: applicationProfile.tenant,
  // TODO:
  historyActivities: null
});

const mapDispatchToProps = {
  handleInitBusinessCardTab
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabBusinessCards);