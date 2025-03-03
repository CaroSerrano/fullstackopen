import { createSlice } from '@reduxjs/toolkit';
import blogService from '../../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs: (state, action) => {
      return action.payload;
    },
    appendBlog: (state, action) => {
      state.push(action.payload);
    },
    editBlog: (state, action) => {
      const { id, updatedBlog } = action.payload;
      return state.map((b) => (b.id !== id ? b : updatedBlog));
    },
    removeBlog: (state, action) => {
      const foundBlog = state.find((blog) => blog.id === action.payload);
      if (foundBlog) {
        state.splice(state.indexOf(foundBlog), 1);
      }
    },
  },
});

export const { setBlogs, appendBlog, editBlog, removeBlog } = blogSlice.actions;
export default blogSlice.reducer;

export const inicializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch(appendBlog(newBlog));
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.addComment(id, comment);
    dispatch(editBlog({ id, updatedBlog }));
  };
};

export const updateBlog = (id, content) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.update(id, content);
    dispatch(editBlog({ id, updatedBlog }));
  };
};

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.removeBlog(id);
    dispatch(removeBlog(id));
  };
};
