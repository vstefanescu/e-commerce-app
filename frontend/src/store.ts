import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    // aici poți adăuga și alți reducerei pe viitor
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
