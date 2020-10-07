import React, { useState, useEffect, useRef } from 'react';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import ProductTypeMaster from './product-type-master/product-type-master';
import DialogDirtyCheckRestart from 'app/shared/layout/common/dialog-dirty-check-restart';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIME_OUT_MESSAGE, SHOW_MESSAGE } from 'app/modules/setting/constant';

import {
  updateProductTypes,
  reset
} from "./product-type-master/product-type-master.reducer";

export interface ITaskProductProps extends StateProps, DispatchProps {
  callBack?
  setDirtyTypeProps
}

export const TaskProduct = (props: ITaskProductProps) => {

  const [productTypeSubmit, setProductTypeSubmit] = useState({});
  const [togglePopupProduct, setTogglePopupProduct] = useState(false);
  const [resetState, setresetState] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showMsgSucess, setShowMsgSucess] = useState(SHOW_MESSAGE.NONE);

  const buttonCance = useRef(null);
  const buttonSubmit = useRef(null);

  const productTypeChange = (proType) => {
    props.setDirtyTypeProps(proType)
    const lstItem = proType['listItem']
    let checkJson = 0
    lstItem.forEach(element => {
      try {
        element['fieldUse'] = JSON.parse(element['fieldUse'])
      } catch (e) {
        checkJson += 1
      }
      element['fieldUse'] = JSON.stringify(element['fieldUse'])
    });

    setProductTypeSubmit(proType);
  }

  const saveData = () => {
    props.reset()
    if (productTypeSubmit['listItem'] !== undefined) {
      props.updateProductTypes(productTypeSubmit);
    }
  }

  const executeDirtyCheck = async (action: () => void) => {
    if (productTypeSubmit['listItem'] !== undefined) {
      await DialogDirtyCheckRestart({ onLeave: action });
    } else {
      action();
    }
  };

  const cancel = () => {
    buttonCance.current.blur();
    executeDirtyCheck(() => {
      setresetState(!resetState)
      setProductTypeSubmit({})
      props.setDirtyTypeProps({})
    })
  }

  const getErrorMessage = (errorCode) => {
    let errorMessage = '';
    if (!isNullOrUndefined(errorCode)) {
      errorMessage = translate('messages.' + errorCode);
    }
    return errorMessage;
  }

  const renderMessage = () => {
    return (
      <BoxMessage messageType={MessageType.Success} message={translate('messages.INF_COM_0008')} className="message-area-bottom" />
    );
  }

  useEffect(() => {
    setresetState(!resetState)
    props.setDirtyTypeProps({})
  }, [props.callBack])


  useEffect(() => {
    if (props.iDSS) {
      if (props.iDSS) {
        setShowMsgSucess(SHOW_MESSAGE.SUCCESS);
        setShowMessage(true)
        setProductTypeSubmit({})
        props.setDirtyTypeProps({})
      }
      setTimeout(() => {
        setShowMsgSucess(SHOW_MESSAGE.NONE);
        props.reset()
      }, TIME_OUT_MESSAGE);
    }
  }, [props.iDSS]);

  return (
    <>
      <div className="modal-body style-3">
        <div className="popup-content  style-3">
          <div className="user-popup-form setting-popup-wrap setting-popup-height">
            <div className="setting-popup-left">
              <div className="wrap-control-esr">
                <div className="esr-content">
                  <div className="esr-content-sidebar no-background">
                    <div className="esr-content-sidebar-outer">
                      <div className="esr-content-sidebar-inner">
                        <div className="list-group">
                          <a className={`${!togglePopupProduct && 'active'}`} onClick={() => setTogglePopupProduct(false)}>{translate('setting.product.projectSetting')}</a>
                        </div>
                        <div className="list-group">
                          <a className={`${togglePopupProduct && 'active'}`} onClick={() => setTogglePopupProduct(true)}>{translate('setting.product.productMaster')}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {togglePopupProduct && <ProductTypeMaster productTypeChange={productTypeChange} resetpapge={resetState} />}
          </div>
        </div>
      </div>
      <div className="user-popup-form-bottom">
        {showMsgSucess === SHOW_MESSAGE.SUCCESS && renderMessage()}
        {showMsgSucess === SHOW_MESSAGE.NONE && (
          <>
            <button ref={buttonCance} type="button" className="btn-button button-primary" onClick={cancel}>{translate('setting.button.cancel')}</button>
            <button ref={buttonSubmit} type="button" className="button-blue button-form-register"
              onClick={saveData}>{translate('setting.button.save')}
            </button>
          </>
        )}
      </div>
    </>
  )

}
const mapStateToProps = ({ productTypeMaster }: IRootState) => ({
  iDSS: productTypeMaster.listId,
  messageError: productTypeMaster.errorItems,
});

const mapDispatchToProps = {
  updateProductTypes,
  reset
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskProduct);