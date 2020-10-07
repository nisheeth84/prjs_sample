import React, { useState, useEffect, useRef } from 'react';
import { PRODUCT_TAB } from '../constant';
import ProductTrade from './product-trade/product-trade';
import { translate } from 'react-jhipster';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import DialogDirtyCheck from 'app/shared/layout/common/dialog-dirty-check';
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { TIME_OUT_MESSAGE } from 'app/modules/setting/constant';
import {
    updateProductTrade
} from "../product/product-trade/product-trade.reducer";

export interface IProductProps extends StateProps, DispatchProps {
    callBack?
    setDirtyTypeProps
}

export const Product = (props: IProductProps) => {
    const [productTabs, setProductTabs] = useState(PRODUCT_TAB.PRODUCT_TRADE);
    const [productTradeSubmit, setProductTradeSubmit] = useState({});
    const [reset, setreset] = useState(false);
    const [lockupdate, setLockupdate] = useState(true);
    const [showMessage, setShowMessage] = useState(false);

    const buttonCance = useRef(null);
    const buttonSubmit = useRef(null);
    
    const productTradeChange = (productTrades) => {
        setProductTradeSubmit(productTrades);
        props.setDirtyTypeProps(productTrades)
    }

    const saveData = () => {
        if (productTradeSubmit['listItem'] !== undefined) {
            props.updateProductTrade(productTradeSubmit);
        }
    }

    const executeDirtyCheck = async (action: () => void, cancel?: () => void) => {
        if (productTradeSubmit['listItem'] !== undefined) {
            await DialogDirtyCheck({ onLeave: action, onStay: cancel });
        } else {
            action();
        }
    };

    const cancel = () => {
        buttonCance.current.blur();
        executeDirtyCheck(() => {
            setreset(!reset)
            setProductTradeSubmit({})
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
        setTimeout(() => {
            setShowMessage(false)
        }, TIME_OUT_MESSAGE);

        if (showMessage) {
            return <>
                <div className='width-720 position-absolute'>
                    <BoxMessage messageType={MessageType.Success}
                        message={getErrorMessage("INF_COM_0008")} />
                </div>
            </>
        }
    }


    useEffect(() => {
        setreset(!reset)
    }, [props.callBack])

    useEffect(() => {
        if (props.progressesUpdate) {
            setShowMessage(true)
            setProductTradeSubmit({})
            props.setDirtyTypeProps({})
        }
        if (!lockupdate) {
            setLockupdate(!lockupdate)
        }
    }, [props.progressesUpdate])

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
                                                <div className="list-group" onClick={() => setProductTabs(PRODUCT_TAB.PRODUCT_TRADE)}>
                                                    <a className={productTabs === PRODUCT_TAB.PRODUCT_TRADE ? "active" : ""}>{translate('setting.sales.nav.productTrade')}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="setting-popup-content">
                            {productTabs === PRODUCT_TAB.PRODUCT_TRADE && <ProductTrade resetpapge={reset} productTradeChange={productTradeChange} />}
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-popup-form-bottom">
                {renderMessage()}
                <button ref={buttonCance} className="btn-button button-primary" onClick={cancel}>{translate('setting.button.cancel')}</button>
                <button ref={buttonSubmit} className="btn-button button-blue" onClick={saveData}>{translate('setting.button.save')}</button>
            </div>
        </>
    )

}
const mapStateToProps = ({ productTrade }: IRootState) => ({
    progressesUpdate: productTrade.progressesUpdate,
});

const mapDispatchToProps = {
    updateProductTrade
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Product);