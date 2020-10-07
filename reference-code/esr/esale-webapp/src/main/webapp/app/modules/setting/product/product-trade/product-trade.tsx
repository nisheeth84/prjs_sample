import React, { useState, useEffect, useRef } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import { ProductTradeAdd } from './product-trade-add';
import ConfirmDialog from 'app/shared/layout/dialog/confirm-dialog';
import { MODE_POPUP, SHOW_MESSAGE } from 'app/modules/setting/constant';
import { getJsonBName, convertHTMLEncString } from "app/modules/setting/utils";
import { isNullOrUndefined } from "util";
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import _ from 'lodash';
import {
    reset,
    handleGetData,
    handleCheckDelete
} from "./product-trade.reducer";
import ListProductsTrade from './list-products-trade';
import { revertHTMLString } from 'app/modules/products/utils';

export interface IProductTradeProps extends StateProps, DispatchProps {
    productTradeChange,
    resetpapge?
}
export const ProductTrade = (props: IProductTradeProps) => {

    const tableRef = useRef(null)

    const [productItemDelete, setProductItemDelete] = useState({});
    const [productItemUpdate, setProductItemUpdate] = useState({});
    const [changeStatusDialog, setChangeStatusDialog] = useState(false);
    const [productTrade, setProductTrade] = useState([]);
    const [productTradeItem, setProductTradeItem] = useState(null);
    const [showMessage, setShowMessage] = useState(SHOW_MESSAGE.NONE);
    const [mode, setMode] = useState(MODE_POPUP.CREATE);

    const buttonModal = useRef(null);
    
    const getErrorMessage = (errorCode) => {
        let errorMessage = '';
        if (!isNullOrUndefined(errorCode)) {
            errorMessage = translate('messages.' + errorCode);
        }
        return errorMessage;
    }

    const renderErrorMessage = () => {
        switch (showMessage) {
            case SHOW_MESSAGE.ERROR:
                return (
                    <BoxMessage messageType={MessageType.Error}
                        message={getErrorMessage(props.errorCodeList && props.errorCodeList[0].errorCode)} />
                )
            case SHOW_MESSAGE.CAN_NOT_DELETE:
                return <><div>
                    <BoxMessage messageType={MessageType.Error}
                        message={getErrorMessage("INF_SET_0003")} />
                </div>
                </>
            default:
                break;
        }
    }

    const createParamupdate = (item, type, param, id) => {
        const paramupdate = {}
        paramupdate['listItem'] = param['listItem'] !== undefined ? [...param['listItem']] : []
        paramupdate['listDeletedProgress'] = param['listDeletedProgress'] !== undefined ? [...param['listDeletedProgress']] : []
        if (id === null) {
            if (param['listItem'] === undefined) {
                paramupdate['listItem'].push({ ...item })
                return paramupdate
            } else {
                let lstProductTrade = []
                let lstItem = {}
                switch (type) {
                    case MODE_POPUP.EDIT:
                        lstItem = _.find(param.listItem, { 'progressOrder': item.progressOrder });
                        if (lstItem !== undefined) {
                            lstProductTrade = _.map(param['listItem'], obj => {
                                if (item.productTradingProgressId > 0) {
                                    if (obj.productTradingProgressId === item.productTradingProgressId) {
                                        obj = _.clone(item);
                                    }
                                } else {
                                    if (obj.progressOrder === item.progressOrder) {
                                        obj = _.clone(item);
                                    }
                                }
                                return obj;
                            });
                            paramupdate['listItem'] = [...lstProductTrade]
                        } else {
                            paramupdate['listItem'].push({ ...item })
                        }
                        return paramupdate
                    case MODE_POPUP.CREATE:
                        paramupdate['listItem'].push({ ...item })
                        return paramupdate;
                    default:
                        break;
                }
            }
        } else {
            /* create listDeletedProgress */
            const itemDelete = _.find(param['listItem'], { 'progressOrder': item.progressOrder });
            if (id !== null && itemDelete !== undefined) {
                const lstPositions = _.reject(param['listItem'], (obj) => {
                    return item.productTradingProgressId > 0 ?
                        obj.productTradingProgressId === item.productTradingProgressId :
                        obj.progressOrder === item.progressOrder;
                });
                setProductItemUpdate(lstPositions)
                paramupdate['listItem'] = [...lstPositions]
            }
            if (item.productTradingProgressId !== 0) {
                paramupdate['listDeletedProgress'].push(item.productTradingProgressId)
            }
        }
        return paramupdate
    }

    const productTradeChange = (item) => {
        setShowMessage(SHOW_MESSAGE.NONE);
        let param = { ...productItemUpdate }
        if (item.progressOrder) {
            const lstProductTrade = _.map(productTrade, objChange => {
                if (item.productTradingProgressId > 0) {
                    if (objChange.productTradingProgressId === item.productTradingProgressId) {
                        objChange = _.clone(item);
                    }
                } else {
                    if (objChange.progressOrder === item.progressOrder) {
                        objChange = _.clone(item);
                    }
                }
                return objChange;
            });
            setProductTrade([...lstProductTrade]);
            setProductTradeItem(null);
            setProductItemUpdate(param = createParamupdate(item, MODE_POPUP.EDIT, param, null));
        } else {
            for (let index = 0; index <= productTrade.length; index++) {
                if (index !== 0 && index === productTrade.length) {
                    item['progressOrder'] = productTrade[index - 1].progressOrder + 1;
                } else {
                    item['progressOrder'] = 1;
                }
                item['productTradingProgressId'] = 0;
            }
            setProductTrade([...productTrade, item]);
            setProductItemUpdate(param = createParamupdate(item, MODE_POPUP.CREATE, param, null));
        }
        setChangeStatusDialog(false);
        props.productTradeChange(param);
    }

    const deleteProductTrade = async (item, actionDelete?) => {
        props.reset();
        setShowMessage(SHOW_MESSAGE.NONE);
        setProductItemDelete(item)
        if (actionDelete || item.productTradingProgressId === 0) {
            let param = { ...productItemUpdate }
            const itemName = convertHTMLEncString(getJsonBName(item.progressName));
            const result = await ConfirmDialog({
                title: (<>{translate('employees.top.dialog.title-delete-group')}</>),
                message: revertHTMLString(translate('employees.top.dialog.message-delete-group', { itemName })),
                confirmText: translate('employees.top.dialog.confirm-delete-group'),
                confirmClass: "button-red",
                cancelText: translate('employees.top.dialog.cancel-text'),
                cancelClass: "button-cancel"
            });
            if (result) {

                const lstProductTrade = _.reject(productTrade, (objDel) => {
                    return item.productTradingProgressId > 0 ?
                        objDel.productTradingProgressId === item.productTradingProgressId :
                        objDel.progressOrder === item.progressOrder;
                });
                setProductTrade([...lstProductTrade]);
                setProductItemUpdate(param = createParamupdate(item, null, param, item.progressOrder));
                props.productTradeChange(param);
                setProductItemDelete({})
            }
        } else {
            props.handleCheckDelete(item.productTradingProgressId)
        }
    }

    const dismissDialog = (type) => {
        props.reset();
        setChangeStatusDialog(!changeStatusDialog)
        setMode(type);
        setProductTradeItem(null);
    }

    const editProductTrade = (item) => {
        props.reset();
        setShowMessage(SHOW_MESSAGE.NONE);
        setMode(MODE_POPUP.EDIT);
        setChangeStatusDialog(true)
        setProductTradeItem(item);
    }

    const dataAfterDragDrop = datas => {
        let paramUpdate = { ...productItemUpdate }
        for (let index = 0; index < datas.length; index++) {
            datas[index].progressOrder = index + 1
            setProductItemUpdate(paramUpdate = createParamupdate(datas[index], MODE_POPUP.EDIT, paramUpdate, null))
            props.productTradeChange(paramUpdate)
        }
        setProductTrade(datas)

    };

    useEffect(() => {
        props.reset();
        props.handleGetData(false);
        setProductItemUpdate({})
    }, [props.resetpapge]);

    useEffect(() => {
        if (props.progressesUpdate) {
            props.reset();
            props.handleGetData(false);
            setProductItemUpdate({})
        }
    }, [props.progressesUpdate]);

    useEffect(() => {
        if (props.progresses ) {
            setProductTrade(props.progresses);
        }
    }, [props.progresses]);

    useEffect(() => {
        setShowMessage(SHOW_MESSAGE.NONE);
        if (props.errorCodeList && props.errorCodeList.length > 0) {
            setShowMessage(SHOW_MESSAGE.ERROR);
        }
        if (props.idCheck !== null && props.idCheck.length === 0) {
            deleteProductTrade(productItemDelete, true)
            setShowMessage(SHOW_MESSAGE.NONE);
        }
        if (props.idCheck !== null &&
            props.idCheck.length > 0) {
            setShowMessage(SHOW_MESSAGE.CAN_NOT_DELETE);
        }

    }, [props.progressesUpdate, props.idCheck, props.errorCodeList]);

    return (
        <>
            <div className="form-group setting-popup-height mb-0">                
                <label className="font-size-18">{translate('setting.sales.productTrade.title')}</label>
                <div className="block-feedback background-feedback border-radius-12 magin-top-5 pl-5 pr-5">
                    {translate('setting.sales.productTrade.titleWarning')}
                </div>
                {renderErrorMessage()}
                <div className="position-relative">
                    <button ref={buttonModal} type="button" className={`button-primary btn-padding ${changeStatusDialog && 'active'}`} onClick={() => {                        
                        buttonModal.current.blur();
                        dismissDialog(MODE_POPUP.CREATE);
                    }}>{translate('setting.sales.productTrade.btnAdd')}</button>
                    {
                        changeStatusDialog && <ProductTradeAdd
                            modePopup={mode}
                            productTradeItem={productTradeItem}
                            productTradeChange={productTradeChange}
                            dismissDialog={dismissDialog}
                            langKey={props.account["languageCode"]}
                        />
                    }
                </div>
                {productTrade && productTrade.length > 0 ?
                    <div>
                        <table className="table-default" ref={tableRef} >
                            <thead>
                                <tr className="white-space-last">
                                    <td className="w-cus30">{translate('setting.product.edit.progressName')}</td>
                                    <td className="w-cus15">{translate('setting.sales.productTrade.OrderEntry')}</td>
                                    <td className="w-cus15">{translate('setting.sales.productTrade.lostNote')}</td>
                                    <td className="w-cus15">{translate('setting.sales.productTrade.interruption')}</td>
                                    <td className="w-cus15">{translate('setting.sales.productTrade.end')}</td>
                                    <td className="text-center">{translate('setting.sales.productTrade.operation')}</td>
                                </tr>
                            </thead>
                            <tbody>
                                <ListProductsTrade
                                    listItems={productTrade}
                                    setItems={dataAfterDragDrop}
                                    editItem={editProductTrade}
                                    deleteItem={deleteProductTrade}
                                    tableRef={tableRef}
                                />
                            </tbody>
                        </table>
                    </div>

                    : <div className="show-message-nodata position-absolute" >
                        {translate("messages.INF_COM_0020", { 0: translate('setting.sales.title-snd') })}
                    </div >}
            {showMessage === SHOW_MESSAGE.SUCCESS && renderErrorMessage()}
            </div>
        </>
    )
}

const mapStateToProps = ({ productTrade, authentication }: IRootState) => ({
    progresses: productTrade.progresses,
    progressesUpdate: productTrade.progressesUpdate,
    errorCodeList: productTrade.errorItems,
    idCheck: productTrade.idCheck,
    account: authentication.account,
});

const mapDispatchToProps = {
    reset,
    handleGetData,
    handleCheckDelete
};
type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductTrade);