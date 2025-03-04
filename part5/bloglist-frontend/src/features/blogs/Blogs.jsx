import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Button, ListGroup } from 'react-bootstrap';

const Blogs = () => {
  const blogs = useSelector(({ blogs }) => blogs);
  const navigate = useNavigate();
  const handleCreateBlogBtn = (event) => {
    navigate('/create-blog');
  };

  return (
    <div>
      <h2>Blogs</h2>
      <Button
        style={{ margin: 10 }}
        variant='outline-primary'
        onClick={handleCreateBlogBtn}
      >
        Create new
      </Button>
      <ListGroup>
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <ListGroup.Item action variant='light' key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
            </ListGroup.Item>
          ))}
      </ListGroup>
    </div>
  );
};

export default Blogs;
