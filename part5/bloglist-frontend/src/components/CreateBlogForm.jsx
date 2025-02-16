const CreateBlogForm = ({
  title,
  author,
  url,
  handleCreateBlog,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => {
  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        Title:  
        <input
          type="text"
          value={title}
          name="Title"
          onChange={handleTitleChange}
        />
      </div>
      <div>
        Author:  
        <input
          type="text"
          value={author}
          name="Author"
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        URL:  
        <input type="text" value={url} name="Url" onChange={handleUrlChange} />
      </div>
      <button type="submit">Create Blog</button>
    </form>
  );
};

export default CreateBlogForm;
