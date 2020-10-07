import React, { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { Storage, translate } from 'react-jhipster';
import { AUTH_REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY, SIGNOUT_SAML_URL } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';

export interface IMultiDropDownProps extends StateProps {
    lstData: any,
    initData: { id: any, name: any }[],
    index: number,
    type: any,
    placehoder: any,
    updateStateFields: (index, key, value) => void;
    errorInfo?: any;
    zIndex?: any
}

export const MultiDropDown = (props: IMultiDropDownProps) => {
    const accessToken = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    const refreshToken = Storage.local.get(AUTH_REFRESH_TOKEN_KEY) || Storage.session.get(AUTH_REFRESH_TOKEN_KEY);
    const uriContract = Storage.session.get(SIGNOUT_SAML_URL) ? Storage.session.get('redirect_url') : null;
    const { lstData, index } = props;
    const { initData } = props;
    const [listDataSelected, setListDataSelected] = useState([]);
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [isSelectedDropdown, setIsSelectedDropdown] = useState(false);

    useEffect(() => {
        setListDataSelected(lstData ? lstData : []);
    }, [lstData])

    const filterData = () => {
        return initData.filter(i => !listDataSelected.find(id => i.id === id))
    }

    const filteredData = filterData();

    const handleSelect = (id, type) => {
        setIsOpenDropdown(!isOpenDropdown);
        props.zIndex && props.zIndex(!isOpenDropdown);
        setIsSelectedDropdown(!isSelectedDropdown);
        setListDataSelected(_.cloneDeep(listDataSelected.concat(id)));
        const listSelectedTemp = [...listDataSelected];
        listSelectedTemp.push(id);
        props.updateStateFields(index, type, listSelectedTemp);
    }

    const handleRemoveItem = (indexOfItem, typeRemove) => {
        const tmpListDataSelected = [...listDataSelected]
        tmpListDataSelected.splice(indexOfItem, 1);
        setIsSelectedDropdown(!isSelectedDropdown);
        props.updateStateFields(index, typeRemove, tmpListDataSelected);
        setListDataSelected(_.cloneDeep(tmpListDataSelected));
    }

    const handleOpenSub = () => {
        setIsOpenDropdown(!isOpenDropdown);
        props.zIndex && props.zIndex(!isOpenDropdown);
    }

    const node = useRef(null);

    const handleClickOutside = event => {
        if (node.current && !node.current.contains(event.target)) {
            props.zIndex && props.zIndex(false);
            setIsOpenDropdown(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, []);

    return (
        <div className="select-option text-nowrap form-group">
            <button className={`select-text text-left ${props.errorInfo ? 'error' : ''}`} type="button" onClick={() => { handleOpenSub(); props.zIndex && props.zIndex(true) }} ref={node}>
                {props.placehoder}
            </button>
            {props.errorInfo && <span className="messenger-error">
                {translate('messages.' + props.errorInfo.errorCode, { 0: initData.find(e => e.id === props.errorInfo.rowId).name, 1: '0' })}
            </span>}
            <div className={`drop-down drop-down3 ${!isOpenDropdown ? 'd-none': ''}`}>
                <ul className="dropdown-item style-3" >
                    {filteredData.map((data, id) => (
                        <li key={id}
                            onClick={() => handleSelect(data.id, props.type)}
                            className="item smooth">
                            <div className="text text2">{data.name}</div>
                        </li>
                    ))}
                </ul>
                <div className="form-group search min-height-48 h-50-px">
                    <form method="post" action={uriContract || props.siteContract }>
                        <input type="hidden" value={accessToken} name="id-token" />
                        <input type="hidden" value={refreshToken} name="refresh-token" />
                        <button type="submit" className="button-primary button-add-new add w-auto">{translate('employees.inviteEmployees.form.button.addNew')}</button>
                    </form>
                </div>
            </div>
            <div className="show-wrap employee-show-wrap" >
                {(listDataSelected != null) &&
                    listDataSelected.map((r, i) => (
                        <div className="item" key={i}>
                            <div className="text text2" title={`${initData.filter(x => x.id === r).map(x => x.name)}`}>
                                {initData.filter(x => x.id === r).map(x => x.name)}
                            </div>
                            <div className="close" onClick={(event) => { event.stopPropagation(); handleRemoveItem(i, props.type); }}>
                                ×</div>
                        </div>
                    ))
                }
            </div>
        </div>

    )
}
const mapStateToProps = ({ authentication }: IRootState) => ({
    siteContract: authentication.siteContract
});

type StateProps = ReturnType<typeof mapStateToProps>;

export default connect(mapStateToProps)(MultiDropDown);