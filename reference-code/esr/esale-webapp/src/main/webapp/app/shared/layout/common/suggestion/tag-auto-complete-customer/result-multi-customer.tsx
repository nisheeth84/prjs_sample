import React from 'react';

export interface IResultMultiCustomerProps {
    tags: any;
    onRemoveTag: any;
    disableTag?: any;
}

const ResultMultiCustomer = (props: IResultMultiCustomerProps) => {
    return (
        <div className="chose-many">
            {props.tags && props.tags.map((customer, idx) =>
                <div key={idx} className="w48 position-relative">
                    <div className="drop-down w100 h-auto">
                        <ul className="dropdown-item">
                            <li className="item smooth">
                                <div className="text text1 text-ellipsis">{customer['parentCustomerName']}</div>
                                <div className="text text2">{customer['customerName']}</div>
                                <div className="text text3">{customer['customerAddress']}</div>
                                <button className="close" disabled={props.disableTag} onClick={props.disableTag ? () => { } : () => props.onRemoveTag(idx)}>×</button>
                            </li>
                        </ul>
                    </div>
                    <div className="drop-down child">
                        <ul className="dropdown-item">
                            <li className="item smooth">
                                <div className="text text1">{customer['parentCustomerName']}</div>
                                <div className="text text2">{customer['customerName']}</div>
                                <div className="text text3">{customer['customerAddress']}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ResultMultiCustomer;