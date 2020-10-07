import React, { useEffect, useState } from 'react'
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { Modal } from 'reactstrap';
import { AUTH_TOKEN_KEY, URL_PORTAL, URL_PORTAL_YOUTUBE, ScreenModeOfPortal, REASON_CONST_URL } from 'app/config/constants';
import { Storage, translate } from 'react-jhipster';
import jwtDecode from 'jwt-decode';
import InviteEmployee from 'app/modules/employees/inviteEmployees/modal-invite-employees';

import {
    getStatusContract,
    reset,
    updateDisplayScreen,
} from "./portal-reducer";

export interface BeginerPortalProps extends StateProps, DispatchProps {
    closePortalPopupPortal,
    changeStatusPopup,
    setFalseStatus,
    changeStatusPortalData
}

const Portal = (props: BeginerPortalProps) => {
    const [idEmployee, SetIdEmployee] = useState(null);
    const [caseDisplay, setCaseDisPlay] = useState(ScreenModeOfPortal.FIRST_LOGIN);
    const [textBoxValue, setTextBoxValue] = useState(null);
    const [openInviteEmployees, setOpenInviteEmployees] = useState(false);
    const [isDisable, setIsDisable] = useState(false);

    const onCloseInviteEmployees = () => {
        setOpenInviteEmployees(false);
    }

    const onOpenInviteEmployees = () => {
        setOpenInviteEmployees(true);
    }

    useEffect(() => {
        const jwt = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
        if (jwt) {
            let jwtData = null;
            jwtData = jwtDecode(jwt);
            SetIdEmployee(jwtData['custom:employee_id']);
            props.getStatusContract(jwtData['custom:tenant_id']);
        }
    }, [])

    useEffect(() => {
        if(props.isDisplayFirstScreen === true || props.isDisplayFirstScreen === null){
            setTextBoxValue(false);
        } else {
            setTextBoxValue(true);
        }
    },[caseDisplay])

    useEffect(() => {
        if (openInviteEmployees) {
            document.body.className = 'wrap-employee modal-open';
        }
        return () => {
            document.body.className = document.body.className.replace('modal-open', '');
        }
    }, [openInviteEmployees]);

    const updateDisplayFirstScreen = () => {
        const params = {
            employeeId: idEmployee,
            isDisplayFirstScreen: !textBoxValue,
            updatedDate: props.updatedDate
        }
        props.updateDisplayScreen(params);
        setCaseDisPlay(ScreenModeOfPortal.MODAL_IMPORT);
        props.changeStatusPopup();
        props.changeStatusPortalData()
    }

    

    useEffect(() => {
        if ((caseDisplay === ScreenModeOfPortal.FIRST_LOGIN && props.isDisplayFirstScreen) || (caseDisplay === ScreenModeOfPortal.FIRST_LOGIN && props.isDisplayFirstScreen === null)) {
            setIsDisable(true)
        } else if ((caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.isDisplayFirstScreen) || (caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.isDisplayFirstScreen === null) ) {
            setIsDisable(true)
        } else {
            setIsDisable(false)
        }
    }, [caseDisplay])

    const openSiteSupport = paramsType => {
        window.open(paramsType === REASON_CONST_URL ? REASON_CONST_URL : URL_PORTAL);
    }

    const changeStatus = () => {
        setCaseDisPlay(ScreenModeOfPortal.SECOND_LOGIN);
        if (props.trialEndDate === null) {
            setCaseDisPlay(ScreenModeOfPortal.MODAL_IMPORT_PORTAL)
            const params = {
                employeeId: idEmployee,
                isDisplayFirstScreen: false,
                updatedDate: props.updatedDate
            }
            props.updateDisplayScreen(params);
        } 
    }

    const closeUp = () => {
        if (caseDisplay === ScreenModeOfPortal.MODAL_IMPORT_PORTAL || (caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.trialEndDate === null) || caseDisplay === ScreenModeOfPortal.MODAL_IMPORT) {
            setCaseDisPlay(ScreenModeOfPortal.NONE);
            props.setFalseStatus();
            props.closePortalPopupPortal();
            props.changeStatusPortalData();
        } else if (caseDisplay === ScreenModeOfPortal.UPDATE_FIRST_SCREEN) {
            if (textBoxValue === true) {
                props.changeStatusPortalData();
                props.closePortalPopupPortal();
                props.setFalseStatus();
                const params = {
                    employeeId: idEmployee,
                    isDisplayFirstScreen: !textBoxValue,
                    updatedDate: props.updatedDate
                }
                props.updateDisplayScreen(params);
                setCaseDisPlay(ScreenModeOfPortal.NONE);
            } else {
                props.setFalseStatus();
                props.closePortalPopupPortal();
                props.changeStatusPortalData();
            }
        }  else {
            props.setFalseStatus();
            props.closePortalPopupPortal();
        }
    }

    const changeTextBox = () => {
          setTextBoxValue(!textBoxValue);
    }

    return (
        <>
            {!openInviteEmployees &&
                <Modal isOpen={true} className="wrap-portal modal-open">
                    <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
                        <div className="modal-dialog form-popup">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <div className="left">
                                        {((caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.trialEndDate === null) || caseDisplay === ScreenModeOfPortal.MODAL_IMPORT_PORTAL) && <div className="popup-button-back" onClick={e => { setCaseDisPlay(ScreenModeOfPortal.FIRST_LOGIN) }}><a className="icon-small-primary icon-return-small" /><span className="text"><img className="icon-group-user" src="../../../content/images/ic-new-user.svg" />{translate('portal.modalPortal.title')}
                                        </span></div>}
                                    </div>
                                    <div className="right">

                                        <button className={`icon-small-primary icon-close-up-small line ${isDisable === true ? 'portal-disabled color-999' : ''}`} onClick={closeUp} />
                                    </div>
                                </div>
                                <div className="modal-body style-3">
                                    {caseDisplay === ScreenModeOfPortal.FIRST_LOGIN && <div className="popup-content d-flex px-0 pt-0 pb-4 style-3">
                                        <div className="tab-left">
                                            <div className="box-content-1">
                                                <div className="text-blue font-size-18 pl-1">
                                                    {translate('portal.popupLogin.hello')}
                                                </div>
                                                <p className="mb-4">
                                                    {translate('portal.popupLogin.content')}
                                                </p>
                                                <p className="mb-4 pb-3">
                                                    {translate('portal.popupLogin.footer')}
                                                </p>
                                                <div>
                                                    <img src="../../../content/images/logo-esm2.svg" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-right">
                                            <iframe width={535} height={288} src={URL_PORTAL_YOUTUBE} frameBorder={0} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                        </div>
                                    </div>
                                    }
                                    {caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.trialEndDate !== null && <div className="popup-content box-content-2 pb-4 style-3">
                                        <div className="text-blue font-size-18 mb-3 pl-2">
                                            {translate('portal.popupExperiment.title')}
                                        </div>
                                        <p className="mb-4 pb-2">
                                            {translate('portal.popupExperiment.content')}
                                        </p>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="box-item">
                                                    <div className="title-number">1</div>
                                                    <div className="text-blue font-size-18">
                                                        {translate('portal.popupExperiment.boxOneTitle')}
                                                    </div>
                                                    <p className="text-left">
                                                        {translate('portal.popupExperiment.boxOneContent')}
                                                    </p>
                                                    <div >
                                                        <img src="../../../content/images/group-three-logo.svg" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="box-item">
                                                    <div className="title-number">2</div>
                                                    <div className="text-blue font-size-18">
                                                        {translate('portal.popupExperiment.boxTwoTitle')}
                                                    </div>
                                                    <p className="text-left">
                                                        {translate('portal.popupExperiment.boxTwoContent')}
                                                    </p>
                                                    <button className="button-blue text-center w100 px-3 mt-4" onClick={e => openSiteSupport(REASON_CONST_URL)} >
                                                        {translate('portal.popupExperiment.button')}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="box-item">
                                                    <div className="title-number">3</div>
                                                    <div className="text-blue font-size-18">
                                                        {translate('portal.popupExperiment.boxThree')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    }

                                    {
                                        caseDisplay === ScreenModeOfPortal.UPDATE_FIRST_SCREEN && <div className="modal popup-esr popup-esr4 user-popup-page popup-align-right show" id="popup-esr" aria-hidden="true">
                                            <div className="modal-dialog form-popup">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <div className="left">
                                                            <div className="popup-button-back">

                                                            </div>
                                                        </div>
                                                        <div className="right">
                                                            <a className="icon-small-primary icon-close-up-small line" onClick={closeUp} />
                                                        </div>
                                                    </div>
                                                    <div className="modal-body style-3">
                                                        <div className="popup-content box-content-2 d-flex pt-0 style-3">
                                                            <div className="detail-content text-center">
                                                                <div className="text-blue font-size-18 mb-3">
                                                                    {translate('portal.popupStart.title')}
                                                                </div>
                                                                <p className="mb-5">
                                                                    {translate('portal.popupStart.contentOne')}
                                                                    {translate('portal.popupStart.contentTwo')}
                                                                </p>
                                                                <button className="button-blue text-center w100 px-3" onClick={updateDisplayFirstScreen} >
                                                                    {translate('portal.popupStart.button')}
                                                                </button>
                                                                <label className="icon-check font-weight-normal mt-3">
                                                                    <input type="checkbox" onChange={changeTextBox} checked ={textBoxValue} /><i />
                                                                    {translate('portal.popupStart.footer')}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="user-popup-form-bottom user-popup-tab3-form-bottom">
                                                            <a className="button-cancel d-inline-block" onClick={e => { setCaseDisPlay(ScreenModeOfPortal.FIRST_LOGIN) }}>{translate('portal.popupExperiment.back')}</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {
                                        ((caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.trialEndDate === null) || caseDisplay === ScreenModeOfPortal.MODAL_IMPORT_PORTAL) &&
                                        <div className="popup-content style-3">
                                            <div className="user-popup-form">

                                                {props.isAdmin &&
                                                    (<>
                                                        <div className="box-border portal-content-center none-border">
                                                            <div className="box-content">
                                                                <div className="title-box w100">
                                                                    {translate('portal.modalPortal.boxOneTitle')}
                                                                </div>
                                                                <div className="body-box">
                                                                    <div><img src="../../../content/images/portal/img-portal-register.svg" /></div>
                                                                    <p className="text-left">{translate('portal.modalPortal.boxOneContent')}
                                                                    </p>
                                                                    <button className="button-shadow-blue px-2 w100" onClick={e => setCaseDisPlay(ScreenModeOfPortal.MODAL_IMPORT)}>{translate('portal.modalPortal.boxOneButton')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="box-border portal-content-center none-border">
                                                            <div className="box-content">
                                                                <div className="title-box w100">
                                                                    {translate('portal.modalPortal.boxTwoTitle')}
                                                                </div>
                                                                <div className="body-box">
                                                                    <div><img src="../../../content/images/portal/img-portal-invite.svg" /></div>
                                                                    <p className="text-left">{translate('portal.modalPortal.boxTwoContent')}</p>
                                                                    <button className="button-shadow-blue px-2 w100" onClick={onOpenInviteEmployees} >{translate('portal.modalPortal.boxTwoButton')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>)
                                                }

                                                <div className="box-border portal-content-center none-border">
                                                    <div className="box-content">
                                                        <div className="title-box w100">{translate('portal.modalPortal.boxThreeTitle')}</div>
                                                        <div className="body-box">
                                                            <div><img src="../../../content/images/portal/img-portal-solution.svg" /></div>
                                                            <p className="text-left">{translate('portal.modalPortal.boxThreeContent')}</p>
                                                            <button className="button-shadow-blue px-2 w100" onClick={openSiteSupport}>{translate('portal.modalPortal.boxThreeButton')}</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    {
                                        caseDisplay === ScreenModeOfPortal.MODAL_IMPORT && <div className="popup-content box-content-2 d-flex pt-0 style-3">
                                            <div className="detail-content text-center">
                                                <div className="text-blue font-size-18 mb-3">
                                                    {translate('portal.importPortal.apologize')}
                                                </div>
                                            </div>
                                        </div>
                                    }

                                    <div className="user-popup-form-bottom user-popup-tab3-form-bottom">
                                        {caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.trialEndDate !== null && <button className="button-cancel" onClick={e => { setCaseDisPlay(ScreenModeOfPortal.FIRST_LOGIN) }}>{translate('portal.popupExperiment.back')}</button>}
                                        {caseDisplay === ScreenModeOfPortal.FIRST_LOGIN && <button className="button-blue" onClick={changeStatus}>{translate('portal.popupLogin.next')}</button>}
                                        {caseDisplay === ScreenModeOfPortal.SECOND_LOGIN && props.trialEndDate !== null && <button className="button-blue" onClick={e => { setCaseDisPlay(ScreenModeOfPortal.UPDATE_FIRST_SCREEN) }} >{translate('portal.popupLogin.next')}</button>}
                                        {caseDisplay === ScreenModeOfPortal.MODAL_IMPORT && <button className="button-blue" onClick={e => { setCaseDisPlay(ScreenModeOfPortal.MODAL_IMPORT_PORTAL) }} >{translate('portal.popupLogin.next')}</button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            }
            {openInviteEmployees &&
                <InviteEmployee
                    backToPortal={true}
                    toggleCloseInviteEmployees={onCloseInviteEmployees}
                />
            }
        </>
    )
}

const mapStateToProps = ({ beginerPortal, menuLeft }: IRootState) => ({
    trialEndDate: beginerPortal.trialEndDate,
    updatedDate: menuLeft.updatedDate,
    updateSuccess: beginerPortal.updateSuccess,
    isDisplayFirstScreen: menuLeft.isDisplayFirstScreen,
    isAdmin: menuLeft.isAdmin

});
const mapDispatchToProps = {
    getStatusContract,
    reset,
    updateDisplayScreen,

};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;



export default connect(mapStateToProps, mapDispatchToProps)(Portal);