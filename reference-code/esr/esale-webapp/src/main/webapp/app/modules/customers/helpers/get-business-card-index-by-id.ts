import { compose, findIndex, curry, equals } from 'ramda';

import { getBusinessCardId } from './get-business-card-id';

export const findBusinessCardIndexById = curry((businessCardId, businessCardDatas) =>
  findIndex(
    compose(
      equals(businessCardId),
      getBusinessCardId
    ),
    businessCardDatas
  )
);
