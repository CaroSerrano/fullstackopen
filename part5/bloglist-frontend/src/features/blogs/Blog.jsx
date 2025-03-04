import { useState, useEffect } from 'react';
import { setNotification } from '../notification/notificationSlice';
import { updateBlog, deleteBlog, addComment } from './blogSlice';
import { useDispatch } from 'react-redux';
import {
  Button,
  ListGroup,
  Form,
  Modal,
  Card,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Blog = ({ blog }) => {
  const [removeBtnVisibility, setRemoveBtnVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

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
    handleCloseModal();
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
    navigate('/');
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
    marginTop: 15,
  };

  if (!blog) {
    return null;
  }

  return (
    <div style={blogStyle} className='Blog' data-testid='blog'>
      <Card style={{ padding: 10 }}>
        <div id='mainData'>
          <Card.Title id='title'>{blog.title}</Card.Title>
          <Card.Subtitle id='author'>Author: {blog.author} </Card.Subtitle>
        </div>

        <div id='details'>
          <Card.Text id='url'>{blog.url}</Card.Text>
          <Card.Text id='likes' data-testid='likes'>
            Likes: {likes}{' '}
            <Button
              size='sm'
              variant='outline-dark'
              onClick={handleLikeBtn}
              id='likeBtn'
            >
              Like
            </Button>
          </Card.Text>
          <Card.Text>
            Added by: {blog.user ? blog.user.name : 'User unknown'}
          </Card.Text>
          <br />
          <Form.Control
            as='textarea'
            value={comment}
            id='comment'
            onChange={handleCommentChange}
            placeholder='write a comment here'
            style={{ marginTop: 20, marginBottom: 10 }}
          />
          <Button
            size='sm'
            variant='outline-dark'
            style={{ margin: 5 }}
            onClick={handleCommentBtn}
          >
            Add comment
          </Button>
          {blog.comments.length > 0 && (
            <>
              <h4>Comments</h4>
              <ListGroup variant='flush' as='ol' numbered>
                {blog.comments.map((c) => (
                  <ListGroup.Item as='li' key={c.id}>
                    {c.content}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </div>
        <Button
          size='sm'
          variant='outline-danger'
          style={removeBtnStyle}
          onClick={handleShowModal}
        >
          Remove blog
        </Button>
      </Card>
      <Modal size='sm' show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Please confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this blog?</Modal.Body>
        <Modal.Footer>
          <Button variant='outline-secondary' onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant='outline-danger' onClick={handleRemoveBtn}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Blog;
