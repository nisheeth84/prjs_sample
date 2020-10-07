import React, { Suspense } from 'react'
import { Switch } from 'react-router-dom';

// import Login from 'app/modules/account/login/login';
import Account from "app/modules/account";
import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';
import Logined from 'app/shared/layout/logined';
import ExceptionPage from './shared/error/exception-page';

// import SalesModalCreateSharedGroup from './modules/sales/group/sales-modal-create-shared-group';
// import ModalSalesSharedGroupEdit from './modules/sales/shared-group/modal-shared-group';
// import ModalSalesMyGroupEdit from './modules/sales/group/add-edit-my-group-modal';
import SalesMySharedListModal from './modules/sales/my-shared-list/sales-my-shared-list-modal';

const Routes = () => (
  <Suspense fallback={<div>Loading</div>}>
    <>
      <Switch>
        <ErrorBoundaryRoute path="/account" component={Account} />
        <ErrorBoundaryRoute path="/" component={Logined} />
        <ErrorBoundaryRoute component={ExceptionPage} />
      </Switch>
    </>
  </Suspense>
);

export default Routes;
