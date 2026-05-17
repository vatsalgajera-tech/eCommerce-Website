import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('sv_user'));
const token = localStorage.getItem('sv_token');

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: user || null, token: token || null, isLoading: false },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('sv_user', JSON.stringify(action.payload.user));
      localStorage.setItem('sv_token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('sv_user');
      localStorage.removeItem('sv_token');
    },
    setLoading: (state, action) => { state.isLoading = action.payload; },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export const selectUser = (s) => s.auth.user;
export const selectToken = (s) => s.auth.token;
export const selectIsAdmin = (s) => s.auth.user?.role === 'admin';
export default authSlice.reducer;
