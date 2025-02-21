import { createSlice } from '@reduxjs/toolkit';

const getId = () => (100000 * Math.random()).toFixed(0);

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      return [...state, { content: action.payload, id: getId(), votes: 0 }];
    },
    vote(state, action) {
      const id = action.payload;
      const anecdoteToChange = state.find((a) => a.id === id);
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1,
      };
      return state.map((a) => (a.id !== id ? a : changedAnecdote));
    },
    setAcnedotes(state, action) {
      return action.payload;
    },
  },
});

export const { createAnecdote, vote, setAcnedotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
