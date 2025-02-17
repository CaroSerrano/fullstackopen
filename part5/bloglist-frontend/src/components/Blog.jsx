import { useState } from "react";

const Blog = ({ blog }) => {
  const [detailsVisibility, setDetailsVisibility] = useState(false);
  console.log(blog);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const handleViewBtn = () => {
    setDetailsVisibility(!detailsVisibility);
  };

  const detailsStyle = {
    display: detailsVisibility ? "" : "none",
  };
  return (
    <div style={blogStyle}>
      {blog.title} <button onClick={handleViewBtn}>view</button>
      <p>{blog.author} </p>
      <div style={detailsStyle}>
        <p>{blog.url}</p>
        <p>
          {blog.likes} <button>like</button>
        </p>
        {blog.user ? blog.user.name : "User unknown"}
      </div>
    </div>
  );
};

export default Blog;
