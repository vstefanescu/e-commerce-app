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

// Load cart from localStorage
function loadCartFromLocalStorage(): CartProduct[] {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveCartToLocalStorage(cart: CartProduct[]) {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch {
    console.error("Could not save cart to localStorage.");
  }
}

const initialState: CartState = {
  products: loadCartFromLocalStorage(),
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
      saveCartToLocalStorage(state.products);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      saveCartToLocalStorage(state.products);
    },
    clearCart: (state) => {
      state.products = [];
      saveCartToLocalStorage(state.products);
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
