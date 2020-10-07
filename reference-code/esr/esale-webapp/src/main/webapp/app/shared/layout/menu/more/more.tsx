import React  from 'react';
import { Link } from 'react-router-dom';
import { translate } from 'react-jhipster';

export interface IMenuLeftNotificationProps  {
    togglePopupEmployeeDetail
    togglePopupEmployee
}
const MenuLeftMore = props => {

    return (
        <div className="drop-down menu-membership-dropdown">
            <ul>
                <li className="item smooth" onClick={props.togglePopupEmployeeDetail}>
                    <div className="text text2">
                        {translate('more.employeeDetails')}
                    </div>
                </li>
                <li className="item smooth" onClick={props.togglePopupEmployee}>
                    <div className="text text2" >{translate('more.setting')}</div>
                </li>
                <Link to="/account/logout" className="text text2 menu-full">
                <li className="item smooth menu-w100">
                    {translate('more.logout')}
                </li>
                </Link>
            </ul>
        </div>
    )
};

export default MenuLeftMore

