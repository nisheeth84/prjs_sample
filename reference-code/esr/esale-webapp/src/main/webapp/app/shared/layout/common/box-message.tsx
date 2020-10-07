import React from 'react';
import { translate } from 'react-jhipster';
import _ from 'lodash';

export enum MessageType {
  None,
  Info,
  Warning,
  Success,
  Error,
}

export interface IBoxMessageProps {
  messageType?: MessageType;
  className?: string;
  styleClassMessage?: string;
  message?: string;
  messages?: string[];
  isMsgCode?: boolean,
  isShowButton?: boolean;
  onActionMessage?: () => void;
  isShowDelete?: boolean;
  onDeleteMessage?: () => void;
  addStyle?: {};
}

const BoxMessage = (props: IBoxMessageProps) => {
  if (props.messageType === MessageType.None || (!props.message && !props.messages)) {
    return (<></>);
  }
  let styleClass = "max-width-720";
  if (props.className && props.className.length > 0) {
    styleClass = props.className;
  }
  let styleInput = {};
  if (!_.isEmpty(props.addStyle)) {
    styleInput = props.addStyle;
  }
  let classType = "";
  if (props.styleClassMessage && props.styleClassMessage.length > 0) {
    classType = props.styleClassMessage;
  } else {
    if (props.messageType === MessageType.Warning) {
      classType = "block-feedback block-feedback-yellow";
    } else if (props.messageType === MessageType.Success) {
      classType = "block-feedback block-feedback-green text-left";
    } else if (props.messageType === MessageType.Error) {
      classType = "block-feedback block-feedback-pink";
    } else if (props.messageType === MessageType.Info) {
      classType = "block-feedback block-feedback-blue";
    }
  }
  if (props.isShowButton && classType.length > 0) {
    classType = `${classType}-button`
  }

  const isMessageCode = (msg) => {
    const codeRegex = /([_\-0-9a-z]*[.]){1,}[_\-0-9a-zA-Z]{1,}$/g;
    if (codeRegex.test(msg)) {
      return true;
    }
    return false;
  }

  const translateMsg = (msg) => {
    if (!msg || msg.length <= 0) {
      return "";
    }
    if (isMessageCode(msg)) {
      return translate(msg);
    } else {
      return msg;
    }
  }

  const getMessage = () => {
    if (!props.message || props.message.length <= 0) {
      return <></>;
    } else {
      return <>{translateMsg(props.message)}</>;
    }
  }

  const getMessages = () => {
    if (!props.messages || props.messages.length <= 0) {
      return <></>;
    } else {
      return (
        <>
          {props.message && props.message.length > 0 && <br />}
          {props.messages && props.messages.map((el, index) =>
            <p key={index} style={{ margin: '0' }}>{translateMsg(el)}</p>
          )}
        </>
      );
    }
  }

  return (
    <div className={styleClass} style={styleInput}>
      <div className={classType}>
        {getMessage()}
        {getMessages()}
        {props.isShowButton &&
          <a className="button-primary button-activity-registration" onClick={() => { if (props.onActionMessage) props.onActionMessage() }}>テキストボタン</a>
        }
        {props.isShowDelete &&
          <a className="close mt-2" onClick={props.onDeleteMessage}>×</a>
        }
      </div>
    </div>
  );
};

export default BoxMessage;
