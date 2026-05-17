import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => { try { return JSON.parse(localStorage.getItem('sv_cart')) || []; } catch { return []; } };
const saveCart = (items) => localStorage.setItem('sv_cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, action) => {
      const { product, qty = 1, size, color } = action.payload;
      const key = `${product._id}-${size}-${color}`;
      const existing = state.items.find(i => `${i.product._id}-${i.size}-${i.color}` === key);
      if (existing) { existing.qty += qty; }
      else { state.items.push({ product, qty, size, color }); }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      const { productId, size, color } = action.payload;
      state.items = state.items.filter(i => !(i.product._id === productId && i.size === size && i.color === color));
      saveCart(state.items);
    },
    updateQty: (state, action) => {
      const { productId, size, color, qty } = action.payload;
      const item = state.items.find(i => i.product._id === productId && i.size === size && i.color === color);
      if (item) item.qty = qty;
      saveCart(state.items);
    },
    clearCart: (state) => { state.items = []; saveCart([]); },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export const selectCartItems = (s) => s.cart.items;
export const selectCartTotal = (s) => s.cart.items.reduce((sum, i) => sum + (i.product.discountPrice || i.product.price) * i.qty, 0);
export const selectCartCount = (s) => s.cart.items.reduce((sum, i) => sum + i.qty, 0);
export default cartSlice.reducer;
