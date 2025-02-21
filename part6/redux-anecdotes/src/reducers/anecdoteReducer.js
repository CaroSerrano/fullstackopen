import { createSlice } from '@reduxjs/toolkit';
import anecdoteService from '../services/anecdotes';

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      return state.map((a) => (a.id !== id ? a : changedAnecdote));
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAcnedotes(state, action) {
      return action.payload;
    },
  },
});

export const { vote, setAcnedotes, appendAnecdote } = anecdoteSlice.actions;

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
export default anecdoteSlice.reducer;
