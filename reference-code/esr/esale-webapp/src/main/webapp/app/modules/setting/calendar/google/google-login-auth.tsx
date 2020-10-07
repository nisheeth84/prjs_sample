import React, { useState, useEffect } from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';
import { IRootState } from 'app/shared/reducers';
import { connect } from 'react-redux';
import { reset, hanldleGetData, hanldleupdate } from './google-calendar.reducer';
import { getJsonBName } from 'app/modules/setting/utils';
import { CALENDAR_TAB, SHOW_MESSAGE, TIME_OUT_MESSAGE } from 'app/modules/setting/constant';
import GoogleLogin from 'react-google-login';
import { isNullOrUndefined } from 'util';
import BoxMessage, { MessageType } from 'app/shared/layout/common/box-message';


export interface IGoogleLoginAuth {
    clientId
}
export const GoogleLoginAuth = (props: IGoogleLoginAuth) => {
    // const [clientIdState, setClientIdState] = useState('');

    useEffect(() => {
        console.log("CLIENT ID", props.clientId);
        // setClientIdState(props.clientId);
        if(props.clientId){
            // this.forceUpdate();
            
        }

    }, [props.clientId]);

    // useEffect(() => {
    //     console.log('state: ' + clientIdState);
        
    // }, [clientIdState])

    const responseGoogle = response => {
        console.log(response);
        console.log(123);
        
    };

    return (
        <>
        <GoogleLogin
                scope={'https://www.googleapis.com/auth/calendar'}
                render={renderProps => (
                    <button type="button" className="button-primary button-activity-registration pr-3 pl-3" onClick={renderProps.onClick}>
                        {translate('setting.calendar.google.btnAuthInfomation')}
                    </button>
                )}
                clientId={props.clientId ? props.clientId : 'xxxxxx'}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                // redirectUri={props.tenant + '/esales-pc/?page=google_calendar_setting&type=oauth_response'}
                // uxMode = "popup"
                // redirectUri="https://duongthanhtam.esr.luvina.net"
                // hostedDomain="https://duongthanhtam.esr.luvina.net"
                responseType={'code'}
                accessType={'offline'}
                cookiePolicy={'single_host_origin'}
            />
        </>
    );
};

export default GoogleLoginAuth;
