import { useState } from 'react';
import { createBlog } from '../blogs/blogSlice';
import { useDispatch } from 'react-redux';
import { setNotification } from '../notification/notificationSlice';

const CreateBlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();

  const addBlog = (event) => {
    event.preventDefault();
    dispatch(
      createBlog({
        title: title,
        author: author,
        url: url,
      })
    );
    dispatch(
      setNotification(
        {
          message: 'A new blog added',
          error: false,
        },
        5
      )
    );
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          type='text'
          value={title}
          name='Title'
          onChange={(event) => setTitle(event.target.value)}
          placeholder='type title of the blog here'
        />
      </div>
      <div>
        Author:
        <input
          type='text'
          value={author}
          name='Author'
          onChange={(event) => setAuthor(event.target.value)}
          placeholder='type author of the blog here'
        />
      </div>
      <div>
        URL:
        <input
          type='text'
          value={url}
          name='Url'
          onChange={(event) => setUrl(event.target.value)}
          placeholder='type url of the blog here'
        />
      </div>
      <button type='submit'>Create Blog</button>
    </form>
  );
};

export default CreateBlogForm;
