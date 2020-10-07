import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../reducers';
import { CartState } from './cart-reducer';

export const cartsSelector = createSelector(
  (state: RootState) => state.cart,
  (carts: CartState) => carts.carts
);
