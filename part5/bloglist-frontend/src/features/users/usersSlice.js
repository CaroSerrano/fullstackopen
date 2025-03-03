import { createSlice } from '@reduxjs/toolkit';
import userService from '../../services/users';

const userSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload;
    },
    appendUser: (state, action) => {
      state.push(action.payload);
    },
    editUser: (state, action) => {
      const { id, updatedUser } = action.payload;
      state.map((b) => (b.id !== id ? b : updatedUser));
    },
    removeUser: (state, action) => {
      const foundUser = state.find((user) => user.id === action.payload);
      if (foundUser) {
        state.splice(state.indexOf(foundUser), 1);
      }
    },
  },
});

export const { setUsers, appendUser, editUser, removeUser } = userSlice.actions;
export default userSlice.reducer;

export const inicializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll();
    dispatch(setUsers(users));
  };
};

export const createUser = (content) => {
  return async (dispatch) => {
    const newUser = await userService.create(content);
    dispatch(appendUser(newUser));
  };
};

export const updateUser = (id, content) => {
  return async (dispatch) => {
    const updatedUser = await userService.update(id, content);
    dispatch(editUser(id, updatedUser));
  };
};

export const deleteUser = (id) => {
  return async (dispatch) => {
    await userService.removeUser(id);
    dispatch(removeUser(id));
  };
};
