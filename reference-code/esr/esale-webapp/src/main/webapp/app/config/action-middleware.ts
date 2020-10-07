import { showLoading, hideLoading } from 'react-redux-loading-bar';
import {
  startExecuting,
  endExecuting,
  startExecutingBottom,
  endExecutingBottom
} from 'app/shared/reducers/action-executing';
import { IGNORE_DBL_CLICK_ACTION } from 'app/config/constants';
import { preventDoubleClick, preventDoubleClickBottom } from 'app/modules/modulo-bridge.ts';

export default function actionMiddleware(config = {}) {
  return store => next => action => {
    console.log('dispatch', action);

    const isPending = new RegExp(`_PENDING`, 'g');
    if (preventDoubleClick.findIndex(e => action.type.includes(e)) >= 0) {
      if (action.type.match(isPending)) {
        store.dispatch(startExecuting(action.type.replace('_PENDING', ''), true));
      } else {
        store.dispatch(
          endExecuting(action.type.replace('_FULFILLED', '').replace('_REJECTED', ''))
        );
      }
    } else if (preventDoubleClickBottom.findIndex(e => action.type.includes(e)) >= 0) {
      if (action.type.match(isPending)) {
        store.dispatch(startExecutingBottom(action.type.replace('_PENDING', ''), true));
      } else {
        store.dispatch(
          endExecutingBottom(action.type.replace('_FULFILLED', '').replace('_REJECTED', ''))
        );
      }
    }
    return next(action);
  };
}
