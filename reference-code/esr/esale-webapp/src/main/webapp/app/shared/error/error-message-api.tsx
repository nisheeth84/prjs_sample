import React from 'react';
import { translate } from 'react-jhipster';

export interface IErrorMessageApiProps {
  errorMessage: any; // The error response follows RFC7807
}

const ErrorMessageApi = (props: IErrorMessageApiProps) => {
  if (!props.errorMessage) {
    return <></>;
  }
  return (
    <div className="form-group error">
      <span className="icon">
        <img src="/content/images/ic-dont.svg" alt="" title="" />
      </span>
      {props.errorMessage &&
        props.errorMessage.message === 'error.validation' &&
        props.errorMessage.fieldErrors.map((e, i) => {
          return <span key={i}>{translate('account.' + e.field + '.' + e.message)}</span>;
        })}
      {props.errorMessage && props.errorMessage.message !== 'error.validation' && props.errorMessage.status === 400 && (
        <span>{translate(props.errorMessage.message)}</span>
      )}
      {(!props.errorMessage || props.errorMessage.status !== 400) && <span>システムエラー</span>}
    </div>
  );
};

export default ErrorMessageApi;
