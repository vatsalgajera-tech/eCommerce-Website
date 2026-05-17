import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { mobileMenuOpen: false, searchOpen: false, cartDrawerOpen: false },
  reducers: {
    toggleMobileMenu: (s) => { s.mobileMenuOpen = !s.mobileMenuOpen; },
    closeMobileMenu: (s) => { s.mobileMenuOpen = false; },
    toggleSearch: (s) => { s.searchOpen = !s.searchOpen; },
    toggleCartDrawer: (s) => { s.cartDrawerOpen = !s.cartDrawerOpen; },
    closeCartDrawer: (s) => { s.cartDrawerOpen = false; },
  },
});

export const { toggleMobileMenu, closeMobileMenu, toggleSearch, toggleCartDrawer, closeCartDrawer } = uiSlice.actions;
export default uiSlice.reducer;
