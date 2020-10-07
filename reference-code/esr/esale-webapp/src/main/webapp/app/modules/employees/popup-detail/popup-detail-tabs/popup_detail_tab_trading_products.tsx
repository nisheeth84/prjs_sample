import React, { useState} from 'react';
import DynamicList from 'app/shared/layout/dynamic-form/list/dynamic-list'
import _ from 'lodash';
import { FieldInfoType } from 'app/shared/layout/dynamic-form/constants';
import { TAB_ID_LIST } from '../../constants'

export interface IPopupTabTradingProducts {
    tradingProducts: any,
    mode?: any,
    onChangeFields?: (value) => void,
    tradingProductsFields?: any,
}

const TabTradingProducts = (props: IPopupTabTradingProducts) => {
    const [fields] = useState(props.tradingProductsFields ? props.tradingProductsFields : props.tradingProducts.data.fieldInfo);
    return (
        <div className="tab-content">
            <div className="tab-pane active">
                {
                    props.tradingProducts &&
                        <DynamicList
                            id="EmployeeDetailTabProduct"
                            tableClass="table-list"
                            keyRecordId="productId"
                            records={props.tradingProducts.data.dataInfo.productTradings}
                            belong={1}
                            extBelong={+TAB_ID_LIST.product}
                            fieldInfoType={FieldInfoType.Tab}
                            forceUpdateHeader={false}
                            fields={fields}
                            fieldLinkHolver={[{ fieldName: 'productName', link: '#', hover: '', action: [] }, { fieldName: 'customerName', link: '#', hover: '', action: [] }, { fieldName: 'employeeName', link: '#', hover: '', action: [] }]}
                        >
                        </DynamicList>
                }
                <div></div>
            </div>
        </div>
    );
}

export default TabTradingProducts;