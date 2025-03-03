import { useState, useEffect } from 'react';
import { setNotification } from '../notification/notificationSlice';
import { updateBlog, deleteBlog, addComment } from './blogSlice';
import { useDispatch } from 'react-redux';

const Blog = ({ blog }) => {
  const [removeBtnVisibility, setRemoveBtnVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [comment, setComment] = useState('');
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
  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };
  const handleCommentBtn = () => {
    setComment('');
    const newComment = {
      content: comment,
    };
    dispatch(addComment(blog.id, newComment));
  };

  const removeBtnStyle = {
    display: removeBtnVisibility ? '' : 'none',
  };

  if (!blog) {
    return null;
  }

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
        <br />
        <input
          value={comment}
          type='text'
          id='comment'
          onChange={handleCommentChange}
        />
        <button style={{ margin: 5 }} onClick={handleCommentBtn}>
          add comment
        </button>
        {blog.comments.length > 0 && (
          <>
            <h4>Comments</h4>
            <ul>
              {blog.comments.map((c) => (
                <li key={c.id}>{c.content}</li>
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
