import React from 'react';
import {translate } from 'react-jhipster';
import { Prompt } from 'react-router-dom';
import useEventListener from 'app/shared/util/use-event-listener';

export interface IBrowserDirtyCheckProps {
  isDirty: boolean
}

const BrowserDirtyCheck = (props: IBrowserDirtyCheckProps) => {

  const onBeforeUnload = (ev) => {
    if (props.isDirty) {
      const dialogText = translate("messages.WAR_COM_0007");
      ev.returnValue = dialogText;
      return dialogText;
    } else {
       return true;
    }
  };

  useEventListener('beforeunload', onBeforeUnload);

  return (
    <Prompt
        when={props.isDirty}
        message={translate("messages.WAR_COM_0007")}
    />
  );
};

export default BrowserDirtyCheck;
