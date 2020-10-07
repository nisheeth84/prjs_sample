import React, { useState, useCallback } from 'react';
import { FormGroup } from 'reactstrap';
import styled from 'styled-components';
import { cloneDeep } from 'lodash';

const Wrapper = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  width: 205px;
  padding: 12px;
  border: 1px solid #E5E5E5;
  border-radius: 12px;
  background: white;
  z-index: 2;
  max-height: 600px;
  overflow-y: auto;
  hr { 
    margin: 5px 0 !important;
  }
  .wrap-check-box{
    margin-top: 10px;
      .form-check {
      padding-left: 0px !important;
    }
  }
  .wrap-check-radio {
    display: block !important;
  }
  
`;
export interface TypeNodalListDetail {
  listDetail: Array<{}>,
}

const ModalListDetail = ({ listDetail = [] }: TypeNodalListDetail) => {
  const [radioValue, setRadioValue] = useState('value1');
  const [listCheckBox, changeListCheckBox] = useState(listDetail);

  const onChangeRadio = useCallback((event) => {
    const { value } = event.target;
    setRadioValue(value);
  }, [setRadioValue]);

  const setCheckAll = useCallback((event) => {
    event.preventDefault();
    changeListCheckBox(listItemCheckBox => listItemCheckBox.map(itemCheckBox => ({ ...itemCheckBox, isCheck: true })));
  }, [changeListCheckBox]);

  const unCheckAll = useCallback((event) => {
    event.preventDefault();
    changeListCheckBox(listItemCheckBox => listItemCheckBox.map(itemCheckBox => ({ ...itemCheckBox, isCheck: false })));
  }, [changeListCheckBox]);

  const onChangeCheckBox = useCallback((event) => {
    const { dataset: { index } } = event.target;
    changeListCheckBox(listItemCheckBox => {
      const newListCheckBox = cloneDeep(listItemCheckBox);
      const checked = listItemCheckBox[index]['isCheck'];
      newListCheckBox[index]['isCheck'] = !checked;

      return newListCheckBox;
    })
  }, [changeListCheckBox]);

  return (
    <Wrapper>
      <FormGroup tag="fieldset">
        <div className="wrap-check-radio">
          <p className="radio-item">
            <input
              type="radio"
              name="radioValue"
              checked={radioValue === 'value1'}
              onChange={onChangeRadio}
              value="value1"
              id="radio5"
            />
            <label htmlFor="radio5">全て表示</label>
          </p>
          <p className="radio-item">
            <input
              type="radio"
              name="radioValue"
              checked={radioValue === 'value2'}
              onChange={onChangeRadio}
              value="value2"
              id="radio6"
            />
            <label htmlFor="radio6">自分の担当のみ表示</label>
          </p>
        </div>
      </FormGroup>
      <div className="d-flex justify-content-between">
        <a className="button-primary button-activity-registration" onClick={setCheckAll}>全選択</a>
        <a className="button-primary button-activity-registration" onClick={unCheckAll}>選択解除</a>
      </div>
      <div className="wrap-check-box">
        {
          listCheckBox.length > 0 ? (
            listCheckBox.map((detail, index) => (
              <FormGroup check key={detail['label']}>
                <label className="icon-check">
                  <input
                    type="checkbox"
                    data-index={index}
                    checked={detail['isCheck']}
                    onChange={onChangeCheckBox}
                  />
                  <i /> {detail['label']}
                </label>
              </FormGroup>
            ))
          ) : ''
        }
      </div>
    </Wrapper>
  );
}

export default ModalListDetail;
