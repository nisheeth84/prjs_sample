import React from 'react';
import { ScreenMode } from 'app/config/constants';
import { PRODUCT_SPECIAL_FIELD_NAMES } from 'app/modules/products/constants';
import SpecialEditList from 'app/modules/products/special-item/special-edit-list';
import _ from 'lodash';
import { EMPLOYEE_SPECIAL_LIST_FIELD } from 'app/modules/employees/constants';
import ReactHtmlParser from 'react-html-parser';
import { getPathTreeName } from 'app/modules/employees/list/special-render/special-render';
import StringUtils, { getColorImage, getFieldLabel } from 'app/shared/util/string-utils';
import { TagAutoCompleteType } from '../constants';
import { getColumnWidth } from 'app/shared/layout/dynamic-form/list/dynamic-list-helper';
import EmployeeName from '../../EmployeeName';
import Popover from '../../Popover';
import { renderItemNotEdit } from 'app/modules/customers/list/special-render/special-render';
import { CUSTOMER_SPECIAL_LIST_FIELD } from 'app/modules/customers/constants';
import { translate } from 'react-jhipster';
import * as R from 'ramda';
import { getPhotoFilePath } from 'app/shared/util/entity-utils';
import { utcToTz, DATE_TIME_FORMAT } from 'app/shared/util/date-utils';
import SpecailEditList from 'app/modules/employees/special-item/special-edit-list';
import { getValueProp } from 'app/shared/util/entity-utils';
import { BUSINESS_SPECIAL_FIELD_NAMES } from 'app/modules/businessCards/constants';


const customEmployeeField = (fieldColumn, rowData, mode, nameKey) => {
  try {
      if (_.isArray(fieldColumn)) {
          const idxSurname = fieldColumn.find(item => item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurname);
          const idxSurnameKana = fieldColumn.find(item => item.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSurnameKana);
          if (idxSurname) {
              return (
                  <div className='overflow-menu margin-left-4'>
                      {rowData["employee_icon"] && rowData["employee_icon"]["fileUrl"] && <a className="avatar"> <img src={rowData["employee_icon"]["fileUrl"]} /> </a>}
                      {(!rowData["employee_icon"] || !rowData["employee_icon"]["fileUrl"]) &&
                          <a className={'avatar ' + getColorImage(7)}> {rowData.employee_surname.charAt(0)} </a>
                      }
                      <div className="d-inline-block text-ellipsis max-calc66">{rowData.employee_surname ? rowData.employee_surname : ''}  {rowData.employee_name ? rowData.employee_name : ''}</div>
                  </div>
              );
          } else if (idxSurnameKana) {
              return <span className="d-inline-block text-ellipsis">
                  {rowData.employee_surname_kana ? rowData.employee_surname_kana : ''} {rowData.employee_name_kana ? rowData.employee_name_kana : ''}
              </span>
          }
      }
      else {
          if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeManager && rowData.employee_departments.length > 0) {
              return <>
                  {
                      rowData.employee_departments.map((element, idx) => {
                          return (
                              <a key={idx} className="specical-employee-item text-ellipsis">
                                  {getFieldLabel(element, 'employeeFullName')}
                              </a>
                          )
                      })
                  }
              </>;
          }
          if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeSubordinates && rowData.employee_subordinates.length > 0) {
              return <a className="specical-employee-item text-ellipsis">
                  {rowData.employee_subordinates.map((element, index) => {
                      if (index !== rowData.employee_subordinates.length - 1) {
                          return (<a> {element.employeeFullName},</a>)
                      } else {
                          return (<a> {element.employeeFullName}</a>)
                      }
                  })}
              </a>
          }
          if (fieldColumn.fieldName === 'timezone_id') {
              return <>{rowData.timezone && rowData.timezone.timezoneShortName}</>;
          }

          if (fieldColumn.fieldName === 'language_id') {
              return <>{rowData.language && rowData.language.languageName}</>;
          }
          if (rowData.employee_departments && rowData.employee_departments.length > 0) {
              let text2 = '';
              if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeeDepartments) {
                  rowData.employee_departments.map((element) => {
                      text2 += '<div class = "specical-employee-item text-ellipsis" title="' + getPathTreeName(getFieldLabel(element, 'pathTreeName')) + '">' + getPathTreeName(getFieldLabel(element, 'pathTreeName')) + '</div>';
                  });
              }
              if (fieldColumn.fieldName === EMPLOYEE_SPECIAL_LIST_FIELD.employeePositions) {
                  rowData.employee_departments.map((element) => {
                      text2 += '<div class = "specical-employee-item text-ellipsis">' + getFieldLabel(element, 'positionName') + '</div>';
                  });
              }
              return <>{ReactHtmlParser(text2)}</>;
          }
      }
  } catch (error) {
      console.log(error);
      return <></>;
  }
  return <></>;
}

const customCustomerField = (fieldColumn, rowData, mode, nameKey) => {
  try {
    if (_.isArray(fieldColumn)) {
      const businessMainName = fieldColumn.find(item => item.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID);
      if (businessMainName && businessMainName.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
        return <div className="text-ellipsis text-over">
          <Popover x={-20} y={50}>
            {
              R.path(['business', 'businessMainName'], rowData) + translate("customers.list.dot") + R.path(['business', 'businessSubname'], rowData)
            }
          </Popover>
        </div>;
      }
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_DATE ||
      fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_DATE) {
      const dateDisplay = utcToTz(rowData[StringUtils.snakeCaseToCamelCase(fieldColumn.fieldName)], DATE_TIME_FORMAT.User);
      return <div className="text-over text-ellipsis"><Popover x={-20} y={25}>{dateDisplay}</Popover></div>;
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.UPDATED_USER) {
      const photoPathEmployee = R.path(['updatedUser', 'employeePhoto'], rowData);
      const charEmploy = R.path(['updatedUser', 'employeeName'], rowData) ? R.path(['updatedUser', 'employeeName'], rowData).charAt(0) : '';
      return <div className="text-ellipsis over-unset relative org-view text-over">
        {photoPathEmployee ? <a className="avatar"><img src={photoPathEmployee} /></a> : <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>}
        {R.path(['updatedUser'], rowData) &&
          <a className="d-inline-block text-ellipsis max-calc66" key={R.path(['updatedUser', 'employeeId'], rowData)}>
            <Popover x={-20} y={25}>
              {R.path(['updatedUser', 'employeeName'], rowData)}
            </Popover>
          </a>
        }
      </div>;
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CREATED_USER) {
      const photoPathEmployee = R.path(['createdUser', 'employeePhoto'], rowData);
      const charEmploy = R.path(['createdUser', 'employeeName'], rowData) ? R.path(['createdUser', 'employeeName'], rowData).charAt(0) : '';
      return <div className="text-ellipsis over-unset relative org-view text-over">
        {photoPathEmployee ? <a className="avatar"><img src={photoPathEmployee} /></a> : <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>}
        {R.path(['createdUser'], rowData) &&
          <a className="d-inline-block text-ellipsis max-calc66" key={R.path(['createdUser', 'employeeId'], rowData)}>
            <Popover x={-20} y={25}>
              {R.path(['createdUser', 'employeeName'], rowData)}
            </Popover>
          </a>
        }
      </div>;
    }
    if (_.isArray(fieldColumn)) {
      const businessMainName = fieldColumn.find(item => item.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID);
      if (businessMainName && businessMainName.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.BUSINESS_MAIN_ID) {
        return <div className="text-ellipsis text-over">
          <Popover x={-20} y={50}>
            {
              R.path(['business', 'businessMainName'], rowData) + translate("customers.list.dot") + R.path(['business', 'businessSubname'], rowData)
            }
          </Popover>
        </div>;
      }
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_PARENT) {
      return <div className="text-ellipsis text-over">
        <Popover x={-20} y={50}>
          {
            R.path(['customerParent', 'pathTreeId'], rowData) && R.path(['customerParent', 'pathTreeId'], rowData).map((item, idx) => {
              const length = R.path(['customerParent', 'pathTreeId'], rowData).length;
              return <a key={idx}>
                {(idx === 1 && idx !== length) ? translate('commonCharacter.left-parenthesis') : ''}
                {R.path(['customerParent', 'pathTreeName', 0], rowData)}
                {(idx > 0 && idx < length - 1) ? translate('commonCharacter.minus') : ''}
                {(idx === length - 1 && idx !== 0) ? translate('commonCharacter.right-parenthesis') : ''}
              </a>;
            })
          }
        </Popover>
      </div>;
    }

    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_NAME) {
      return <div className='overflow-menu text-over'>
        <a className="d-inline-block text-ellipsis max-calc66 w-auto">
          <Popover x={-20} y={25}>
            {rowData.customerName ? rowData.customerName : ''}
          </Popover>
        </a>
      </div>
    }
    if (fieldColumn.fieldName === CUSTOMER_SPECIAL_LIST_FIELD.CUSTOMER_LOGO) {
      const photoFilePath = getPhotoFilePath(fieldColumn.fieldName)
      const imgSrc = R.path([StringUtils.snakeCaseToCamelCase(fieldColumn.fieldName), photoFilePath], rowData);
      return (
        <div className="text-over">
          {imgSrc ? <a className="image_table d-inline-block" title="" ><img className="no-image" src={imgSrc} alt="" title="" /></a> :
            <a className="image_table no_image_table d-inline-block" title="" ><img className="no-image" src="../../content/images/noimage.png" alt="" title="" /></a>}
        </div>
      )
    }
    return <SpecialEditList
      valueData={rowData}
      itemData={fieldColumn}
      extensionsData={() => { }}
      updateStateField={() => { }}
      nameKey={nameKey}
      mode={mode}
    />
  } catch (error) {
    console.log(error);
    return <></>;
  }
  return <></>;
}

const getPositionString = rowData => {
  if (rowData.departmentName && rowData.position) {
    let arr = [];
    const index = rowData.departmentName.indexOf('兼');
    if (index < 0) {
      const idx = rowData.position.indexOf('兼');
      if (idx <= 0) {
        const idxBp = rowData.position.indexOf(rowData.departmentName);
        if (idxBp >= 0) {
          const position = rowData.position.slice(idxBp).trim();
          if (position.length > 0) {
            arr = [position];
          }
        }
      }
    } else {
      const department = rowData.departmentName.split('兼');
      const positions = rowData.position.split('兼');
      if (positions.length > 1) {
        if (department.length === positions.length) {
          const arrs = [];
          department.forEach((e, idxP) => {
            const positionArr = positions[idxP].trim().split(' ');
            let string = '';
            for (let m = 0; m < positionArr.length - 1; m++) {
              string = string + ' ' + positionArr[m];
            }
            if (positionArr.length >= 2 && string.trim() === e.trim()) {
              arrs.push(positions[idxP]);
            }
          });
          arr = arrs.length === department.length ? [...arrs] : [];
        }
      }
    }
    if (arr.length > 0) {
      return arr;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const customBusinessField = (fieldColumn, rowData, mode, nameKey) => {
  try {
    if (_.isArray(fieldColumn)) {
      const idxCompanyName = fieldColumn.find(
        item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.alternativeCustomerName
      );
      const idxPositions = fieldColumn.find(
        item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardPositions
      );
      const idxEmail = fieldColumn.find(
        item => item.fieldName === BUSINESS_SPECIAL_FIELD_NAMES.businessCardEmailAddress
      );
      if (idxCompanyName) {
        const lastName = rowData.lastName ? rowData.lastName : '';
        return (
          <>
            {rowData.customerId ? (
              <div className="overflow-menu">
                <a className="d-inline-block text-ellipsis max-calc66 w-auto" title="">
                  <Popover x={-20} y={50}>
                    {rowData.customerName ? rowData.customerName : rowData.alternativeCustomerName}
                  </Popover>
                </a>
                <a
                  title=""
                  className="icon-small-primary icon-link-small overflow-menu-item"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>
                <div className={`d-inline position-relative overflow-menu-item position-top`}>
                  <a
                    id={rowData.businessCardId}
                    title=""
                    className={`icon-small-primary icon-sort-small `}
                  ></a>
                </div>
              </div>
            ) : (
              <div className="overflow-menu">
                <div className="d-inline-block text-ellipsis max-calc66 w-auto">
                  <label>{rowData.alternativeCustomerName}</label>
                </div>
              </div>
            )}
            <div className="overflow-menu">
              <a className="d-inline-block text-ellipsis max-calc66 w-auto" title="">
                <Popover x={-20} y={50}>
                  {rowData.firstName + ' ' + lastName}
                </Popover>
              </a>
              <a
                title=""
                className="icon-small-primary icon-link-small overflow-menu-item"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
              <div className={`d-inline position-relative overflow-menu-item position-top`}>
                <a
                  id={rowData.businessCardId}
                  title=""
                  className={`icon-small-primary icon-sort-small`}
                ></a>
              </div>
            </div>
          </>
        );
      }
      if (idxPositions) {
        const positionsArr = getPositionString(rowData);
        return positionsArr ? (
          <div>
            {positionsArr.map((e, idx) => (
              <div key={idx}>
                <Popover x={-20} y={50}>
                  <span className="mr-3">{e}</span>
                </Popover>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <Popover x={-20} y={50}>
              <span className="mr-3">
                {rowData.departmentName} {rowData.position}
              </span>
            </Popover>
          </div>
        );
      }
      if (idxEmail) {
        return (
          <>
            <div>{rowData.phoneNumber}</div>
            <div>{rowData.mobileNumber}</div>
            {rowData.emailAddress && rowData.emailAddress.length > 0 && (
              <div>
                <a title="">
                  <Popover x={-20} y={50}>
                    <span className="mr-3">{rowData.emailAddress}</span>
                  </Popover>
                </a>
              </div>
            )}
          </>
        );
      }
    } else {
      switch (fieldColumn.fieldName.toString()) {
        case BUSINESS_SPECIAL_FIELD_NAMES.employeeId:
          return (
            <>
              {rowData.businessCardsReceives.map((e, index) => {
                const employeeSurname = e.employeeSurname ? e.employeeSurname : '';
                const employeeName = e.employeeName ? e.employeeName : '';
                return (
                  <div key={index}>
                    <a className="task-of-milestone">
                      <Popover x={-20} y={50}>
                        <span>
                          {employeeSurname} {employeeName}
                        </span>
                      </Popover>
                    </a>
                  </div>
                );
              })}
            </>
          );
        case BUSINESS_SPECIAL_FIELD_NAMES.createdUser:
          return (
            <a>
              <Popover x={-20} y={50}>
                <span>{rowData.createdUserInfo.employeeName}</span>
              </Popover>
            </a>
          );
        case BUSINESS_SPECIAL_FIELD_NAMES.updatedUser:
          return (
            <a>
              <Popover x={-20} y={50}>
                <span>{rowData.updatedUserInfo.employeeName}</span>
              </Popover>
            </a>
          );
        case BUSINESS_SPECIAL_FIELD_NAMES.isWorking:
          return rowData.isWorking ? (
            <>{translate('businesscards.list.isWorking.working')}</>
          ) : (
            <>{translate('businesscards.list.isWorking.notWorking')}</>
          );
        case BUSINESS_SPECIAL_FIELD_NAMES.businessReceiveDate:
          return (
            <>
              {rowData.businessCardsReceives.map((e, index) => (
                <div key={index}>
                  <span className="mr-3">{utcToTz(e.receiveDate, DATE_TIME_FORMAT.User)}</span>
                </div>
              ))}
            </>
          );
        case BUSINESS_SPECIAL_FIELD_NAMES.businessCardImagePath: {
          const imgSrc = getValueProp(rowData, 'business_card_image_path');
          const imageId = getValueProp(rowData, 'business_card_id');
          return (
            <div id={imageId} style={{ width: '200px' }} className="text-over text-ellipsis">
              {imgSrc ? (
                <a className="image_table" title="">
                  <img className="product-item" src={imgSrc} alt="" title="" />
                </a>
              ) : (
                <a className="image_table no_image_table" title="">
                  <img
                    className="product-item"
                    src="../../content/images/noimage.png"
                    alt=""
                    title=""
                  />
                </a>
              )}
            </div>
          );
        }
        default:
          break;
      }
    }
  } catch (error) {
    return <></>;
  }
};

export const renderCellSpecial = (field, rowData, mode, nameKey, serviceType) => {
  if (serviceType === TagAutoCompleteType.Employee) {
    return customEmployeeField(field, rowData, mode, nameKey);
  }
  if (serviceType === TagAutoCompleteType.Customer) {
    return customCustomerField(field, rowData, mode, nameKey);
  }
  if (serviceType === TagAutoCompleteType.BusinessCard) {
    return customBusinessField(field, rowData, mode, nameKey);
  }
  const styleCell = {};
  if (mode !== ScreenMode.EDIT) {
    styleCell["width"] = `${getColumnWidth(field)}px`;
  }

  if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy || field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.updateBy) {
    const user = {}
    if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.createBy) {
      user["name"] = rowData["created_user"]
      user["img"] = rowData["created_user_image"]
      user["id"] = rowData["created_user_id"]
    } else {
      user["name"] = rowData["updated_user"]
      user["img"] = rowData["updated_user_image"]
      user["id"] = rowData["updated_user_id"]
    }
    return (
      <>
        <EmployeeName
          userName={user["name"]}
          userImage={user["img"]}
          employeeId={user["id"]}
          sizeAvatar={48}
          backdrop={true}
        ></EmployeeName>
        {/* {rowData["employee_icon"] && rowData["employee_icon"]["fileUrl"] && <a className="avatar"> <img src={rowData["employee_icon"]["fileUrl"]} /> </a>}
        {(!rowData["employee_icon"] || !rowData["employee_icon"]["fileUrl"]) &&
          <a className={'avatar ' + getColorImage(7)}> {charEmploy} </a>
        }
        <a className="d-inline-block text-ellipsis max-calc66"
         onClick={() => 
            {      // console.log("rowData", rowData)
            // onOpenPopupEmployeeDetail(rowData.employee_id, field.fieldId)
          }
        }>
          <Popover x={-20} y={25}>
            {rowData[field.fieldName]}
          </Popover>
        </a> */}
      </>
    )
  } else if (field.fieldName === PRODUCT_SPECIAL_FIELD_NAMES.productsSets) {
    if (rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]) {
      const sets = _.cloneDeep(rowData[PRODUCT_SPECIAL_FIELD_NAMES.productsSets]);
      sets.sort((a, b) => (a.productName.toLowerCase() > b.productName.toLowerCase()) ? 1 : -1);
      return (
        <>
          {sets.map((item, idx) => {
            return (
              <div key={idx}>
                <Popover x={-20} y={20} >
                  <div style={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    color: '#0f6db5'
                  }} className="set-width-200" onClick={() => {}}>{item.productName}</div>
                </Popover>
              </div>
            )
          })}
        </>
      )
    }
    return (
      <div>

        <div className="set-width-200"></div>
      </div>
    )
  } else {
    return <SpecialEditList
      // onOpenPopupProductDetail={onOpenPopupProductDetail}
      valueData={rowData}
      itemData={field}
      extensionsData={() => {}}
      updateStateField={() => {}}
      nameKey={nameKey}
      mode={mode}
      // firstFocus={errorItems ? { id: firstProductsError, item: firstErrorItemError, nameId: 'product_id' } : { id: firstProductShowInListFocus, item: firstItemInEditListFocus, nameId: 'product_id' }}
    />
  }
}