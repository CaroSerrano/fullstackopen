import { useState, useEffect } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, onRemove }) => {
  const [detailsVisibility, setDetailsVisibility] = useState(false);
  const [removeBtnVisibility, setRemoveBtnVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (blog.user?.username === user.username) {
        setRemoveBtnVisibility(true);
      }
    }
  }, [blog.user]);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const handleViewBtn = () => {
    setDetailsVisibility(!detailsVisibility);
  };

  const handleLikeBtn = async () => {
    try {
      const newBlogObject = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: likes + 1,
        user: blog.user.id,
      };

      const returnedBlog = await blogService.update(blog.id, newBlogObject);
      setLikes(returnedBlog.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveBtn = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      await blogService.removeBlog(blog.id);
      onRemove(blog.id)
    }
  };

  const removeBtnStyle = {
    display: removeBtnVisibility ? '' : 'none',
  };

  const detailsStyle = {
    display: detailsVisibility ? '' : 'none',
  };

  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={handleViewBtn}>view</button>
      <p>{blog.author} </p>
      <div style={detailsStyle}>
        <p>{blog.url}</p>
        <p>
          {likes} <button onClick={handleLikeBtn}>like</button>
        </p>
        {blog.user ? blog.user.name : 'User unknown'}
      </div>
      <button style={removeBtnStyle} onClick={handleRemoveBtn}>
        remove
      </button>
    </div>
  );
};

export default Blog;
