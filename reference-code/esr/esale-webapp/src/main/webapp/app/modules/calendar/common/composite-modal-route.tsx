import React, { useEffect } from 'react';
import { Storage } from 'react-jhipster';

type ComponentProps = {
  component: any,
  canSubmit?: boolean,
  bodyClass?: string,
  backUrl: string,
  tenant?: string
}
export const CompositeModalComponent = ({ component: Component, bodyClass, backUrl, canSubmit = false, tenant, ...rest }: ComponentProps) => {

  useEffect(() => {
    if (Storage.local.get('calendar/create-edit-schedule')) {
      Storage.local.remove('calendar/create-edit-schedule');
    }
  }, []);

  const renderComponent = () => (
    <>
      <Component />
    </>
  );

  return renderComponent();
}
export default CompositeModalComponent;
