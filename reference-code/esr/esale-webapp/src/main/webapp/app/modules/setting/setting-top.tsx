import React, { useState } from 'react';
import { translate } from 'react-jhipster';
import { SETTING_MENU } from './constant';
import styled from 'styled-components';

const SettingItemWrapped = styled.div`
    &:focus {
        background: #d6e3f3;
        border-radius: 12px;
    }
`;

interface ISettingTopProps {
    handleChangeMenu
}

export const SettingTop = (props: ISettingTopProps) => {

    const changeMenuType = (type) => {
        props.handleChangeMenu(type);
    }

    return (
        <>
            <div className="modal-body style-3">
                <div className="popup-content style-3 scroll-npmnone">
                    <div className="user-popup-form setting-popup-wrap">
                        <div className="setting-list">
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_SYSTEM)}>
                                    <div className="image">
                                        {/* <input autoFocus className="user" type="image" src="../../../content/images/setting/icon-gear.svg" /> */}
                                        <img className="user abc" src="../../../content/images/setting/icon-gear.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.system.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_CALENDAR)}>
                                    <div className="image">
                                        {/* <input className="user" type="image" src="../../../content/images/setting/ic-calender-gray.svg" /> */}
                                        <img className="user" src="../../../content/images/setting/ic-calender-gray.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.calendar.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content">
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-check-list-blue.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.taskManagement.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_CUSTOMER)}>
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-build-blue.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.customer.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content">
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-card-purple.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.card.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_PRODUCT)}>
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-box-yellow.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.product.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_PRODUCT_TRADE)}>
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-book-pink.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.sales.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_TASK)}>
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-check-list-pink.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.activity.title')}</div>
                                </button>
                            </SettingItemWrapped>
                            <SettingItemWrapped className="setting-item" >
                                <button className="item-content" onClick={() => changeMenuType(SETTING_MENU.MENU_EMPLOYEE)}>
                                    <div className="image">
                                        <img className="user" src="../../../content/images/setting/ic-person-yellow.svg" />
                                    </div>
                                    <div className="text text-center">{translate('setting.employee.title')}</div>
                                </button>
                            </SettingItemWrapped>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SettingTop;