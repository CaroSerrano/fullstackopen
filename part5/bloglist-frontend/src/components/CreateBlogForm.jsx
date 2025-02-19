import { useState } from 'react';

const CreateBlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const addBlog = (event) => {
    event.preventDefault();
    handleCreateBlog({
      title: title,
      author: author,
      url: url,
    });
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
