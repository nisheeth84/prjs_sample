import React from 'react';

export interface ICustomerControlRightProps {
    profile: any;
}

const CustomerControlRight = () => {
    return (
        <div className="control-right">
            <ul>
                <li><a className="button-popup" data-toggle="modal" data-target="#myModal"><img src="/content/images/ic-right-note.svg" alt="" /></a></li>
                <li><a className="button-popup" data-toggle="modal" data-target="#myModal"><img src="/content/images/ic-right-list.svg" alt="" /></a></li>
            </ul>
            <a className="expand-control-right"><i className="far fa-angle-right" /></a>
        </div>
    );
}

export default CustomerControlRight
