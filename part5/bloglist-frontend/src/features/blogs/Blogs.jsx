import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Blogs = () => {
  const blogs = useSelector(({ blogs }) => blogs);
  const navigate = useNavigate();
  const handleCreateBlogBtn = (event) => {
    navigate('/create-blog');
  };

  return (
    <div>
      <h2>Blogs</h2>
      <button onClick={handleCreateBlogBtn}>Create new</button>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
    </div>
  );
};

export default Blogs;
