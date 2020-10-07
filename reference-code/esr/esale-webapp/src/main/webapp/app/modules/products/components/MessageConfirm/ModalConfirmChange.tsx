import React, { useMemo } from 'react';
import {
  FieldInfoType,
  Categories,
  fieldType99,
  FieldType99,
} from './constants';
import * as R from 'ramda';
import HistoryContent from './components/HistoryContent';
import { translate } from 'react-jhipster';
import { Modal } from 'reactstrap';
import { findFieldInfo, convertDataMessageConfirm } from './util';
import ErrorBoundary from 'app/shared/error/error-boundary';
import styled from 'styled-components'

const ContentChangeWrapper = styled.div`
  background-color: #f9f9f9;
  padding:12px 0;
  border-radius:12px;
`

interface IProps {
  data: {
    [x: string]: {
      newValue: any;
      oldValue: any;
    };
  };
  fieldInfo: FieldInfoType[];
  sourceData?: {
    [key: string]: any[];
  };
  specialData?: {
    [key: string]: any;
  };
  // modal
  modalProps: {
    onCancel: any;
    onOk: any;
    textCancel: any;
    textOk: any;
  };
}

const ModalConfirmChange: React.FC<IProps> = ({
  fieldInfo: fieldInfos,
  data,
  sourceData,
  modalProps,
  specialData,
  ...props
}) => {

  const contentChangeConverted = useMemo(() => {
    const newContentChange = {};

    Object.entries(data).forEach(([fieldId, fieldValue]) => {
      const fieldInfo = findFieldInfo(Number(fieldId), fieldInfos, 'fieldId');
      const dataConverted = convertDataMessageConfirm(fieldValue, fieldInfo, sourceData);
      const { fieldName } = fieldInfo;
      newContentChange[fieldName] = dataConverted;

    });

    return newContentChange;
  }, [data]);

  const convertProductSetData = (statement: any) => {
    if (statement.action !== 2) {
      return statement;
    }
    const productSetData = {};
    const keyProductSetData = 'product_set_data';

    Object.keys(statement[keyProductSetData]).forEach(fieldName => {
      const fieldInfo = findFieldInfo(fieldName, fieldInfos);
      const fieldValue = statement[keyProductSetData][fieldName];
      productSetData[fieldName] = convertDataMessageConfirm(fieldValue, fieldInfo, sourceData);
    });

    return { ...statement, [keyProductSetData]: productSetData };
  };

  const convertDataSpecial = useMemo(() => {
    const results = {};

    if (R.is(Array, specialData?.statementData)) {
      const { statementData } = specialData;

      results['statementData'] = R.map(convertProductSetData, statementData);
    }
    return results;
  }, [specialData]);

  return (
    <Modal isOpen zIndex="2000">
      <div
        className="popup-esr2 popup-esr3 popup-product popup-product-limit-size min-width-340"
      >
        <div className="popup-esr2-content">
          <button type="button" className="close" data-dismiss="modal">
            <span className="la-icon">
              <i className="la la-close"></i>
            </span>
          </button>
          <div className="popup-esr2-body border-bottom">
            <div className="popup-esr2-title">
              {translate('products.detail.title.popupChangeStatus')}
            </div>
            <label>
              <b>{translate('messages.WAR_PRO_0004')}</b>
            </label>
            <div>
              <label className="pop-pro-cus">
                <b>{translate('products.popup.move-to-category.confirmChanges')}</b>
              </label>
              <ContentChangeWrapper className="warning-content-popup popup-product-limit-size-content" >
                <div className="pop-pro-content-cus">
                  <ErrorBoundary>
                    <HistoryContent
                      isModalConfirm={true}
                      data={{ contentChange: contentChangeConverted }}
                      fieldInfo={fieldInfos}
                      // sourceData={sourceData}
                      specialData={convertDataSpecial}
                    />
                  </ErrorBoundary>
                </div>
              </ContentChangeWrapper>
            </div>
          </div>
          <div className="popup-esr2-footer float-right">
            <a title="" onClick={modalProps.onCancel} className="button-cancel color-333">
              {modalProps.textCancel}
            </a>
            <a title="" onClick={modalProps.onOk} className="button-blue">
              {modalProps.textOk}
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
};


export default ModalConfirmChange
