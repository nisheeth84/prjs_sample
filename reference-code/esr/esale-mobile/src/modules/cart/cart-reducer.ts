import { SliceCaseReducers, createSlice } from '@reduxjs/toolkit';

export interface Cart {
  id: number;
  avatarUrl: any;
  name: string;
  role: string;
  price: number;
}
export interface CartState {
  carts: Array<Cart>;
}

export interface CartReducers extends SliceCaseReducers<CartState> {}

const cartSlice = createSlice<CartState, CartReducers>({
  name: 'employee',
  initialState: {
    carts: [
      {
        id: 1,
        avatarUrl: require('../../../assets/cart.png'),
        name: 'カテゴリ A',
        role: '商品 A',
        price: 12000,
      },
      {
        id: 2,
        avatarUrl: require('../../../assets/cart.png'),
        name: 'カテゴリ A',
        role: '商品 A',
        price: 12000,
      },
      {
        id: 3,
        avatarUrl: require('../../../assets/cart.png'),
        name: 'カテゴリ A',
        role: '商品 A',
        price: 12000,
      },
      {
        id: 3,
        avatarUrl: require('../../../assets/cart.png'),
        name: 'カテゴリ A',
        role: '商品 A',
        price: 12000,
      },
      {
        id: 4,
        avatarUrl: require('../../../assets/cart.png'),
        name: 'カテゴリ A',
        role: '商品 A',
        price: 12000,
      },
    ],
  },
  reducers: {
    update(state, { payload }) {
      const newList = state.carts;
      newList[payload.position] = payload.connection;
      state.carts = newList;
    },
    add(state, { payload }) {
      const newList = state.carts;
      newList.push(payload.cart);
      state.carts = newList;
    },
    delete(state, { payload }) {
      state.carts = state.carts.filter(
        (_, index) => index !== payload.position
      );
    },
  },
});

export const employeeActions = cartSlice.actions;
export default cartSlice.reducer;
