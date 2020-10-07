import 'app/modules/account/login/login.scss';
import { AUTH_REFRESH_TOKEN_KEY, AUTH_TOKEN_KEY } from 'app/config/constants';
import { IRootState } from 'app/shared/reducers';
import React from 'react';
import { Storage, translate } from 'react-jhipster';
import { connect } from 'react-redux';

export interface IPopupSelectDestinationProps extends StateProps, DispatchProps {
  toggleShowPopupDestination: (show: boolean) => void;
  redirectUrl?: (path: any) => void;
  uriContract
}

const PopupSelectDestination = (props: IPopupSelectDestinationProps) => {
  const accessToken = Storage.local.get(AUTH_TOKEN_KEY) || Storage.session.get(AUTH_TOKEN_KEY);
  const refreshToken = Storage.local.get(AUTH_REFRESH_TOKEN_KEY) || Storage.session.get(AUTH_REFRESH_TOKEN_KEY);

  return (
    <>
      <div className="popup-esr2 popup-esr2-login" id="popup-esr2">
        <div className="popup-esr2-content">
          <div className="popup-esr2-body">
            <div className="popup-esr2-title">{translate('account.popup.destination.title')}</div>
            <p>{translate('account.popup.destination.message')}</p>
          </div>
          <div className="popup-esr2-footer">
            <form method="post" action={props.uriContract}>
              <input type="hidden" value={accessToken} name="id-token" />
              <input type="hidden" value={refreshToken} name="refresh-token" />
              <button className="btn-login v2 button-blue" type="submit">
                {translate('account.popup.btn-contract')}
              </button>
              &nbsp;
              <a
                onClick={() => {
                  props.toggleShowPopupDestination(false);
                  props.redirectUrl(null);
                }}
                className="button-blue"
              >
                {translate('account.popup.btn-esms')}
              </a>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" />
    </>
  );
};

const mapStateToProps = ({ authentication }: IRootState) => ({});

const mapDispatchToProps = {};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PopupSelectDestination);
