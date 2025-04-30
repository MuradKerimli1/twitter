import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  selectedUser: null,
  onlineUsers: [],
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
  },
});

export const {
  setUser,
  logout,
  setSelectedUser,
  clearSelectedUser,
  updateUser,
  setOnlineUsers,
} = authSlice.actions;

export default authSlice.reducer;
