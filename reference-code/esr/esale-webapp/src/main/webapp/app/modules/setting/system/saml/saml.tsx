import React, { useState, useEffect } from 'react';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { translate } from 'react-jhipster';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';
import { SHOW_MESSAGE, TIME_OUT_MESSAGE } from '../../constant';
import { isNullOrUndefined } from "util";
import {
    reset,
    getCognitoSetting,
    updateAuthenticationSAML
} from "./saml.reducer";
import { AUTH_TOKEN_KEY } from 'app/config/constants';
import { Storage } from 'react-jhipster';
import jwtDecode from 'jwt-decode';
import _, { reject } from 'lodash';
import styled from 'styled-components';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import DropFileCustom from './dropFile';

const DivFileStyleWrapper = styled.div`
  &:focus{
    border: 1px solid #0f6db5;
  }
`;

export interface ISamlProps extends StateProps, DispatchProps {
    changeSamlData,
    initSamlData,
    changeSamlFileData,
    dirtyReroad,
    setDirtyType?
}

export const SAML = (props: ISamlProps) => {

    const [saml, setSaml] = useState({});
    const [initSaml, setInitSaml] = useState(null);
    const [referenceField, setReferenceField] = useState(null);
    const [showMessage, setShowMessage] = useState(0);
    const [fileUpload, setFileUpload] = useState([]);

    useEffect(() => {
        props.reset()
        const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
        if (jwt) {
            const jwtData = jwtDecode(jwt);
            props.getCognitoSetting(jwtData['custom:tenant_id']);
        }
    }, [props.dirtyReroad]);

    useEffect(() => {
        if (props.samlUpdateRes !== null) {

            const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
            if (jwt) {
                const jwtData = jwtDecode(jwt);
                props.getCognitoSetting(jwtData['custom:tenant_id']);
            }
        }
    }, [props.samlUpdateRes]);

    useEffect(() => {
        if (props.auth) {
            const samls = _.cloneDeep(props.auth.saml)
            setSaml(samls);
            setInitSaml(props.auth.saml);
            setReferenceField(props.auth.referenceField);
            props.initSamlData(props.auth.saml);
        }
    }, [props.auth]);

    // useEffect(() => {
    //   if(!_.isEqual(initSaml, saml)) {
    //     props.setDirtyType(true);
    //   }
    // }, [initSaml, saml]);

    const handleChangeInput = keyMap => e => {
        let param = _.cloneDeep(saml)
        if (e.target.type === 'checkbox') {
            setSaml(param = { ...param, [keyMap]: e.target.checked });
        } else {
            setSaml(param = { ...param, [keyMap]: e.target.value });
        }
        if (param && param['fileStatus'] === undefined) {
            setSaml(param = { ...param, ['fileStatus']: false });
        }
        props.changeSamlData(param);
    }

    const getErrorMessage = (errorCode) => {
        let errorMessage = '';
        if (!isNullOrUndefined(errorCode)) {
            errorMessage = translate('messages.' + errorCode);
        }
        return errorMessage;
    }
    const getErrorMessageValidate = (objErr) => {
        let errorMessage = '';
        if (!isNullOrUndefined(objErr.errorCode)) {
            if (objErr.errorParams) {
                errorMessage = translate('messages.' + objErr.errorCode, { values: objErr.errorParams[0] });
            } else {
                errorMessage = translate('messages.' + objErr.errorCode);
            }
        }
        return errorMessage;
    }

    const renderErrorMessage = (typeErr?) => {
        switch (showMessage) {
            case SHOW_MESSAGE.ERROR:
                if (props.errorMessage && props.errorMessage[0] && !props.errorMessage[0]['errorParams']) {
                    if (props.errorMessage[0].errorCode !== 'ERR_COM_0013') {
                        return (
                            <BoxMessage messageType={MessageType.Error}
                                message={getErrorMessage(props.errorMessage && props.errorMessage[0].errorCode)} />
                        )
                    } else {
                        return <span className="setting-input-valis-msg">{getErrorMessage(props.errorMessage && props.errorMessage[0].errorCode)} </span>
                    }
                }
                break;
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
    const renderErrorMessageItem = (typeErr?) => {
        const listMessage = {}
        if (props.errorMessage && props.errorMessage.length > 0 && props.errorMessage[0]['errorParams']) {
            props.errorMessage && props.errorMessage.forEach(element => {

                listMessage[`${element.item}`] = <div>
                    <span className="setting-input-valis-msg">{getErrorMessageValidate(element)} </span>
                </div>
            });
        }
        return listMessage
    }

    const renderErrorMessageFile = () => {
        const listMessage = {}
        if (props.errorMessage && props.errorMessage.length > 0) {
            props.errorMessage && props.errorMessage.forEach(e => {

                listMessage[`${e.item}`] = <div>
                    <span className="setting-input-valis-msg">{getErrorMessageValidate(e)} </span>
                </div>
            });
        }
        return listMessage
    }

    const onFileChange = (file) => {
        if (file) {
            const data = _.cloneDeep(props.auth ? props.auth.saml : {})
            let dataUpload;
            setFileUpload(file);
            setSaml(dataUpload = { ...saml, ['metaDataName']: file.name });
            setSaml(dataUpload = { ...dataUpload, ['fileStatus']: true });
            if (data.metaDataName !== file.name)
                props.changeSamlData(dataUpload);
        }
        props.changeSamlFileData(file);
    }

    const deleteFile = () => {
        let dataDelete
        setSaml(dataDelete = { ...saml, ['metaData']: null, ['metaDataName']: null, ['fileStatus']: true });
        props.changeSamlData(dataDelete);
    }

    useEffect(() => {
        setShowMessage(SHOW_MESSAGE.NONE);
        if (props.errorMessage && props.errorMessage.length > 0) {
            setShowMessage(SHOW_MESSAGE.ERROR);
        }
    }, [props.samlUpdateRes, props.errorMessage]);


    return (
        <>
            <label className="color-333">{translate('setting.system.saml.title')}</label>
            <div className="block-feedback background-feedback border-radius-12 font-size-12 magin-top-5 padding-bottom-30">
                {translate('setting.system.saml.titleWarning')}<br />
                {translate('setting.system.saml.titleWarning1')}<br />
                {translate('setting.system.saml.titleWarning2')}<br />
                {translate('setting.system.saml.titleWarning3')}
            </div>
            {showMessage === SHOW_MESSAGE.ERROR && props.errorMessage[0]?.errorCode !== 'ERR_COM_0013' && renderErrorMessage()}
            <div className="magin-top-10">
                <div className="wrap-check w-100">
                    <div className="mt-0">
                        <p className="check-box-item normal d-inline magin-right-70">
                            <label className="icon-check">
                                <input type="checkbox" checked={saml && saml['isPc']} onChange={handleChangeInput('isPc')} /><i />
                                {translate('setting.system.saml.isPc')}
                            </label>
                        </p>
                        <p className="check-box-item normal d-inline">
                            <label className="icon-check" >
                                <input type="checkbox" checked={saml && saml['isApp']} onChange={handleChangeInput('isApp')} /><i />
                                {translate('setting.system.saml.isApp')}
                            </label>
                        </p>
                    </div>
                </div>
            </div>
            <div className="row break-row">
                <div className="col-lg-7 form-group">
                    <label className="color-3333">{translate('setting.system.saml.titleIssure')}</label>
                    <input type="text" className="input-normal magin-top-5" value={saml ? saml['referenceValue'] : null} onChange={handleChangeInput('referenceValue')} placeholder={translate('setting.system.saml.placeholderIssure')} />
                </div>
                {/* </div> */}
                {/* <div className="row break-row"> */}
                <div className="col-lg-7 form-group">
                    <label className="color-3333">{translate('setting.system.saml.publisher')}</label>
                    <input type="text" className={`input-normal ${renderErrorMessageItem()['providerName'] ? 'setting-input-valid' : 'magin-top-5'}`} value={saml ? saml['providerName'] : null} onChange={handleChangeInput('providerName')} placeholder={translate('setting.system.saml.placeholderpublisher')} />
                    {props.errorMessage && renderErrorMessageItem()['providerName']}
                </div>
                <div className="col-lg-7 form-group magin-top-15">
                    <label className="color-3333">{translate('setting.system.saml.Certificate')}<a className="label-red ml-3">{translate('setting.system.saml.isRq')}</a></label>
                    <DndProvider backend={Backend}>
                        <DropFileCustom
                            onFileChange={onFileChange}
                            deleteFile={deleteFile}
                            infoFile={saml ? saml['metaDataName'] : null}
                            highlight={showMessage === SHOW_MESSAGE.ERROR && props.errorMessage[0]?.errorCode === 'ERR_COM_0013'}
                        />
                    </DndProvider>
                    {showMessage === SHOW_MESSAGE.ERROR && props.errorMessage[0]?.errorCode === 'ERR_COM_0013' && renderErrorMessage()}
                </div>
            </div>
        </>
    )
}
const mapStateToProps = ({ saml }: IRootState) => ({
    errorMessage: saml.errorItems,
    auth: saml.auth,
    samlUpdateRes: saml.samlUpdateRes
});

const mapDispatchToProps = {
    reset,
    getCognitoSetting,
    updateAuthenticationSAML,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SAML);