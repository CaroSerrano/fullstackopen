import { useState, useEffect } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, onRemove, onLike }) => {
  const [detailsVisibility, setDetailsVisibility] = useState(false);
  const [removeBtnVisibility, setRemoveBtnVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      console.log('Usuario autenticado:', user);
      console.log('Usuario del blog:', blog.user);
      if (blog.user === user.id) {
        setRemoveBtnVisibility(true);
      }

      if(blog.user.id && blog.user.id === user.id){
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
      onLike()
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
      onRemove(blog.id);
    }
  };

  const removeBtnStyle = {
    display: removeBtnVisibility ? '' : 'none',
  };

  const detailsStyle = {
    display: detailsVisibility ? '' : 'none',
  };

  return (
    <div style={blogStyle} className='Blog' data-testid='blog'>
      <div id='mainData'>
        <p id='title'>
          {blog.title} <button onClick={handleViewBtn}>view</button>
        </p>
        <p id='author'>{blog.author} </p>
      </div>

      <div style={detailsStyle} id='details'>
        <p id='url'>{blog.url}</p>
        <p id='likes'>
          {likes} <button onClick={handleLikeBtn} id='likeBtn'>like</button>
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
