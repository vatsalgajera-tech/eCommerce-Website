import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => { try { return JSON.parse(localStorage.getItem('sv_wishlist')) || []; } catch { return []; } };

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: loadWishlist() },
  reducers: {
    toggleWishlist: (state, action) => {
      const product = action.payload;
      const idx = state.items.findIndex(p => p._id === product._id);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.push(product);
      localStorage.setItem('sv_wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => { state.items = []; localStorage.removeItem('sv_wishlist'); },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export const selectWishlist = (s) => s.wishlist.items;
export const selectIsWishlisted = (productId) => (s) => s.wishlist.items.some(p => p._id === productId);
export default wishlistSlice.reducer;
