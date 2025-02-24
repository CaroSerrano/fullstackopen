import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    updateVotes(state, action) {
      console.log(action.payload);
      const { id, returnedAnecdote } = action.payload;

      return state.map((a) => (a.id !== id ? a : returnedAnecdote));
    },
    setAcnedotes(state, action) {
      return action.payload;
    },
  },
});

export const { setAcnedotes, appendAnecdote, updateVotes } =
  anecdoteSlice.actions;

/**************** Action creators (Redux Thunk) Funciones de comunicación con el servidor ****************/

export const inicializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAcnedotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(newAnecdote));
  };
};

export const updateAnecdote = (id, content) => {
  return async (dispatch) => {
    const returnedAnecdote = await anecdoteService.update(id, content);
    dispatch(updateVotes({ id, returnedAnecdote }));
  };
};
export default anecdoteSlice.reducer;
