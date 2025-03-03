import { useState, useEffect } from 'react';
import { setNotification } from '../notification/notificationSlice';
import { updateBlog, deleteBlog } from './blogSlice';
import { useDispatch } from 'react-redux';

const Blog = ({ blog }) => {
  const [removeBtnVisibility, setRemoveBtnVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (blog.user === user.id) {
        setRemoveBtnVisibility(true);
      }

      if (blog.user.id && blog.user.id === user.id) {
        setRemoveBtnVisibility(true);
      }
    }
  }, [blog.user]);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5,
  };

  const handleLikeBtn = async () => {
    try {
      dispatch(
        updateBlog(blog.id, {
          ...blog,
          likes: blog.likes + 1,
          user: blog.user.id,
        })
      );
      setLikes(blog.likes + 1);
    } catch (error) {
      console.log(error);
      dispatch(
        setNotification(
          {
            message: 'Error updating blog',
            error: true,
          },
          5
        )
      );
    }
  };

  const handleRemoveBtn = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog.id));
      dispatch(
        setNotification(
          {
            message: 'Blog deleted successfully',
            error: false,
          },
          5
        )
      );
    }
  };

  const removeBtnStyle = {
    display: removeBtnVisibility ? '' : 'none',
  };

  return (
    <div style={blogStyle} className='Blog' data-testid='blog'>
      <div id='mainData'>
        <h3 id='title'>{blog.title}</h3>
        <p id='author'>Author: {blog.author} </p>
      </div>

      <div id='details'>
        <p id='url'>{blog.url}</p>
        <p id='likes' data-testid='likes'>
          Likes: {likes}{' '}
          <button onClick={handleLikeBtn} id='likeBtn'>
            like
          </button>
        </p>
        Added by: {blog.user ? blog.user.name : 'User unknown'}
        {blog.comments.length > 0 && (
          <>
            <h4>Comments</h4>
            <ul>
              {blog.comments.map((c) => (
                <li key={Math.floor(Math.random() * 1000)}>{c}</li>
              ))}
            </ul>
          </>
        )}
      </div>
      <button style={removeBtnStyle} onClick={handleRemoveBtn}>
        remove
      </button>
    </div>
  );
};

export default Blog;
