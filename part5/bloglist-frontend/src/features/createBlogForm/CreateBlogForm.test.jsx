import { render, screen } from '@testing-library/react';
import CreateBlogForm from './CreateBlogForm';
import userEvent from '@testing-library/user-event';

test('<CreateBlogForm /> calls handleCreateBlog correctly', async () => {
  const handleCreateBlog = vi.fn();
  const user = userEvent.setup();

  render(<CreateBlogForm handleCreateBlog={handleCreateBlog} />);

  const titleInput = screen.getByPlaceholderText('type title of the blog here');
  const auhorInput = screen.getByPlaceholderText(
    'type author of the blog here'
  );
  const urlInput = screen.getByPlaceholderText('type url of the blog here');
  const sendButton = screen.getByText('Create Blog');

  await user.type(titleInput, 'Blog from test');
  await user.type(auhorInput, 'author');
  await user.type(urlInput, 'bla');
  await user.click(sendButton);

  expect(handleCreateBlog.mock.calls).toHaveLength(1);
  expect(handleCreateBlog.mock.calls[0]).toEqual([
    { title: 'Blog from test', author: 'author', url: 'bla' },
  ]);
});
