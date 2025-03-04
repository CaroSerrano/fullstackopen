import { useState } from 'react';
import { createBlog } from '../blogs/blogSlice';
import { useDispatch } from 'react-redux';
import { setNotification } from '../notification/notificationSlice';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const CreateBlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    navigate('/');
  };

  return (
    <Form onSubmit={addBlog}>
      <Form.Group>
        Title:
        <Form.Control
          type='text'
          value={title}
          name='Title'
          onChange={(event) => setTitle(event.target.value)}
          placeholder='type title of the blog here'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Author: </Form.Label>
        <Form.Control
          type='text'
          value={author}
          name='Author'
          onChange={(event) => setAuthor(event.target.value)}
          placeholder='type author of the blog here'
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>URL:</Form.Label>
        <Form.Control
          type='text'
          value={url}
          name='Url'
          onChange={(event) => setUrl(event.target.value)}
          placeholder='type url of the blog here'
        />
      </Form.Group>
      <Button style={{ marginTop: 10 }} variant='primary' type='submit'>
        Create Blog
      </Button>
    </Form>
  );
};

export default CreateBlogForm;
