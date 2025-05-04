import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  selectedUser: null,
  onlineUsers: [],
  visitors: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setVisitors: (state, action) => {
      state.visitors = action.payload;
    },
    clearVisitors: (state) => {
      state.visitors = [];
    },
  },
});

export const {
  setUser,
  logout,
  setSelectedUser,
  clearSelectedUser,
  updateUser,
  setOnlineUsers,
  setVisitors,
  clearVisitors,
} = authSlice.actions;

export default authSlice.reducer;
