import React from 'react';
import { translate } from 'react-jhipster';
import './exception-page.scss';

interface IErrorPageProps {
  messageError: string;
}

const ErrorPage = (props: IErrorPageProps) => {

  const handleClickButton = () => {
    const tenant = window.location.pathname.split('/')[1];
    window.location.href = `/${tenant}`;
  }

  return (
    <div className="wrap-login reset wrap-exception">
      <div className="reset-password">
        <img className="logo" src="/content/images/logo.svg" />
        <div className="import-email">
        <p>{translate('messages.' + props.messageError)}</p>
        </div>
        <button className="btn-login v2 button-blue" type="button" onClick={handleClickButton}>
          {translate('exception.back')}
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;