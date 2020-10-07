import axios from 'axios';
import { curry } from 'ramda';

export const postDataWithActionType = curry((api, type, data) => ({
  type,
  payload: axios.post(api, data, {
    headers: { ['Content-Type']: 'application/json' }
  })
}));
