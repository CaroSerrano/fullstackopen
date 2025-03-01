/* eslint-disable no-unused-vars */
import { useState, useEffect, createRef, useReducer } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserContext from './userContext';
import blogService from './services/blogs';
import loginService from './services/login';
import storage from './services/storage';
import Login from './components/Login';
import Blog from './components/Blog';
import NewBlog from './components/NewBlog';
import Notification from './components/Notification';
import Togglable from './components/Togglable';

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SAVE':
      return action.payload;
    case 'REMOVE':
      return null;
    default:
      return state;
  }
};

const App = () => {
  const [user, userDispatch] = useReducer(userReducer, null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const user = storage.loadUser();
    if (user) {
      userDispatch({ type: 'SAVE', payload: user });
    }
  }, []);
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  });

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newObject) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(['blogs'], blogs.concat(newObject));
    },
  });
  const updateBlogMutation = useMutation({
    mutationFn: ({ id, data }) => blogService.update(id, data),
    onSuccess: (newObject) => {
      const blogs = queryClient.getQueryData(['blogs']);
      queryClient.setQueryData(
        ['blogs'],
        blogs.map((b) =>
          b.id.toString() !== newObject.id.toString() ? b : newObject
        )
      );
    },
    onError: (error) => {
      console.error('Error updating blog:', error);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (id) => blogService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (error) => {
      console.error('Error deleting blog:', error);
    },
  });
  // console.log(JSON.parse(JSON.stringify(result)));

  if (result.isLoading) {
    return <div>loading data...</div>;
  }

  const blogs = result.data;

  const blogFormRef = createRef();

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials);
      userDispatch({ type: 'SAVE', payload: user });
      storage.saveUser(user);
      notify(`Welcome back, ${user.name}`);
    } catch (error) {
      notify('Wrong credentials', 'error');
    }
  };

  const handleCreate = async (blog) => {
    newBlogMutation.mutate(blog);
    notify(`Blog created: ${blog.title}, ${blog.author}`);
    blogFormRef.current.toggleVisibility();
  };

  const handleVote = async (blog) => {
    console.log('updating', blog);
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    };

    updateBlogMutation.mutate({ id: blog.id.toString(), data: updatedBlog });
    notify(`You liked ${blog.title} by ${blog.author}`);
  };

  const handleLogout = () => {
    userDispatch({ type: 'REMOVE' });
    storage.removeUser();
    notify(`Bye, ${user.name}!`);
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlogMutation.mutate(blog.id);
      notify(`Blog ${blog.title}, by ${blog.author} removed`);
    }
  };

  if (!user) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <Login doLogin={handleLogin} />
      </div>
    );
  }

  const byLikes = (a, b) => b.likes - a.likes;

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <div>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </div>
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
          <NewBlog doCreate={handleCreate} />
        </Togglable>
        {blogs.sort(byLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleVote={handleVote}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </UserContext.Provider>
  );
};

export default App;
