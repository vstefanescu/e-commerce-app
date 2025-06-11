import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


export interface CartProduct {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartState {
  products: CartProduct[];
}

const initialState: CartState = {
  products: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const item = state.products.find(p => p.id === action.payload.id);
      if (item) {
        item.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
    clearCart: (state) => {
      state.products = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
