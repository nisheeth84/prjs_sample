import { translate } from 'react-jhipster';
import React, { useImperativeHandle, forwardRef, useState } from 'react';
import DatePicker from "app/shared/layout/common/date-picker";
import { TagAutoCompleteType, TagAutoCompleteMode } from "app/shared/layout/common/suggestion/constants";
import TagAutoComplete from "app/shared/layout/common/suggestion/tag-auto-complete";
import { convertDateTimeToTz, switchFormatDate } from 'app/shared/util/date-utils';
export interface IFieldBusinessCardReceiverProps {
  onReceiverChange: () => void;
  fieldLabel: string;
  receivePerson: any[];
  isDisabled?: boolean;
  onUpdateFieldValue?: (item: any, type: any, val: any) => void;
}

const FieldBusinessCardReceiver = forwardRef((props: IFieldBusinessCardReceiverProps, ref) => {
  const { fieldLabel } = props;
  const [receivePerson, setReceivePerson] = useState(props.receivePerson ? props.receivePerson : [{ employeeId: null, receiveDate: null }]);
  const [receivePersonChoice, setReceivePersonChoice] = useState(props.receivePerson ? props.receivePerson : [{ employeeId: null, receiveDate: null }]);
  useImperativeHandle(ref, () => ({
    receivePerson
  }));

  const addReceiver = () => {
    setReceivePerson(value => [...value, { employeeId: null, receiveDate: null }]);
  };

  /**
     * Handle when select Operator list
     * @param id 
     * @param type 
     * @param mode 
     * @param listTag 
     */
  const onActionSelectOperator = (id: any, type: TagAutoCompleteType, mode: TagAutoCompleteMode, listTag: any[]) => {
    if (listTag.length > 0) {
      for (const item of listTag) {
        if (item.employeeId) {
          receivePerson.forEach((emp, index) => {
            if (id === index) {
              receivePerson[index] = { ...receivePerson[index], ...item }
            }
          })
        }
      }
    } else receivePerson.forEach((emp, index) => {
      if (id === index) {
        receivePerson[index] = { ...receivePerson[index], employeeId: null }
      }
    })

    setReceivePersonChoice(receivePerson.filter(e => e.employeeId !== null))
  };

  const getListOperator = (data) => {
    let arrOperator = [];
    if (data) {
      if (data.employeeId) {
        arrOperator.push({
          employeeId: data.employeeId,
          employeeIcon: {
            fileUrl: data.employeePhoto?.filePath
          },
          employeeSurname: data.employeeSurname,
          employeeName: data.employeeName,
          departments: [
            {
              departmentName: null,
              positionName: null
            }
          ]
        })
      } else {
        arrOperator = null;
      }
    }
    return arrOperator;
  }

  const onchangDate = (index, d) => {
    if (d && d !== '') {
      receivePerson[index].receiveDate = convertDateTimeToTz(d)
    }
    else receivePerson[index].receiveDate = null
    setReceivePerson(receivePerson)
  }

  return (
    <div className="col-lg-12 form-group">
      <div className="col-lg-12 form-group">
        <label>{fieldLabel}</label>
      </div>
      <div className="box-border">
        {receivePerson.map((item, index) => (
          <div className="row" key={index}>
            <div className="col-lg-6 form-group mb-3">
              <div className="col-lg-12 padding-right-0">
                <label>{translate('businesscards.create-edit.employee-id')}</label>
                <div className="form-group">
                  <TagAutoComplete
                    id={index}
                    type={TagAutoCompleteType.Employee}
                    modeSelect={TagAutoCompleteMode.Single}
                    isRequired={false}
                    onActionSelectTag={onActionSelectOperator}
                    elementTags={getListOperator(item)}
                    placeholder={translate('businesscards.create-edit.employee-id-placeholder')}
                    isShowOnList={true}
                    listItemChoise={receivePersonChoice}
                    searchType={2}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 form-group mb-3">
              <div className="col-lg-12">
                <label>{translate('businesscards.create-edit.receive-date')}</label>
                <DatePicker
                  date={item.receiveDate ? new Date(item.receiveDate) : null}
                  onDateChanged={(d) => onchangDate(index, d)}
                  isDisabled={props.isDisabled}
                  placeholder={translate('businesscards.create-edit.receive-date-placeholder')}
                />
              </div>
            </div>
            <div className="col-12 mb-3">
              <div className="col-md-6 form-group">
                <label>{translate('businesscards.create-edit.last-contract-date')}</label>
                <span className="color-333">{translate('businesscards.create-edit.auto-update')}</span>
                {/* <span className="color-333">{item?.receivedLastContactDate ? switchFormatDate(item.receivedLastContactDate, 1) : translate('businesscards.create-edit.auto-update')}</span> */}
              </div>
            </div>
          </div>
        ))}
        <div className="col-lg-6 form-group button-add-employee">
          <button type="button" title="" className="button-add-department-post-name" onClick={addReceiver} >
            {translate('businesscards.create-edit.button-add-receive')}
          </button>
        </div>
      </div>
    </div>
  );
});

export default FieldBusinessCardReceiver;
