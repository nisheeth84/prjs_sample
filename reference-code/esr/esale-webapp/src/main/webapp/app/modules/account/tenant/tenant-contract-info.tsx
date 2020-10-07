import 'app/modules/account/login/login.scss';
import { AUTH_REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import { logout } from 'app/shared/reducers/authentication';
import React, { useEffect, useState } from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import './tenant-contract-info.scss';
import { clearStorage } from 'app/shared/util/utils';

export interface ITenantContractInfoProps extends StateProps, DispatchProps, RouteComponentProps<{}> {}

export const TenantContractInfo = (props: ITenantContractInfoProps) => {
  const [isAccessContract, setIsAccessContract] = useState(false);
  const [siteContract, setSiteContract] = useState(null);
  const [storage, setStorage] = useState({} as any);

  useEffect(() => {
    if (props.isLogoutSuccess) {
      props.history.push('/account/login' + window.location.search);
    }
  }, [props.isLogoutSuccess]);

  useEffect(() => {
    if (props.location.state && props.location.state.isAccessContract) {
      setIsAccessContract(props.location.state.isAccessContract);
      setSiteContract(props.location.state.siteContract);
    }

    const accessToken = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
    const refreshToken = Storage.local.get(AUTH_REFRESH_TOKEN_KEY) || Storage.session.get(AUTH_REFRESH_TOKEN_KEY);
    setStorage({ accessToken, refreshToken });
    clearStorage();
  }, []);

  /**
   * Handle click button on the screen
   */
  const routeChange = () => {
    props.logout();
  };

  const onFAQ = (e) => {
    e.preventDefault();
    window.open('https://www.google.com/')
  }

  const { accessToken, refreshToken } = storage;

  return (
    !props.isLogoutSuccess && (
      <div className="wrap-login reset">
        <div className="reset-password">
          <img className="logo" src="/content/images/logo.svg" />
          <p className="title">{translate('account.tenant.contract-info.title')}</p>
          <div className="import-email notification-tenant-expired">
            <ul>
              <li>・{translate('account.tenant.contract-info.content1')}</li>
              <li>・
                <span>{translate('account.tenant.contract-info.content2')}</span>
                <a href="" className="link-to-site" onClick={onFAQ}>FAQ</a>
                <span>{translate('account.tenant.contract-info.content3')}</span>
              </li>
              <li>・{translate('account.tenant.contract-info.content4')}</li>
            </ul>
          </div>
          {isAccessContract ? (
            <form method="post" action={siteContract}>
              <input type="hidden" value={accessToken} name="id-token" />
              <input type="hidden" value={refreshToken} name="refresh-token" />
              <button className="btn-login v2 button-blue" type="submit">
                {translate('account.popup.btn-contract')}
              </button>
            </form>
          ) : (
            <button className="btn-login v2 button-blue" type="button" onClick={routeChange}>
              {translate('account.popup.btn-back-login')}
            </button>
          )}
        </div>
      </div>
    )
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({
  isLogoutSuccess: authentication.isLogoutSuccess
});

const mapDispatchToProps = { logout };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect<any, any, {}>(
  mapStateToProps,
  mapDispatchToProps
)(TenantContractInfo);
