import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { expect } from 'vitest';

test('renders main data by default', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Harry',
    url: 'bla',
    likes: 50,
  };
  const mockHandler = vi.fn();

  const { container } = render(<Blog blog={blog} onRemove={mockHandler} />);
  const mainData = container.querySelector('#mainData');
  const details = container.querySelector('#details');

  expect(mainData).toHaveStyle('display: block');
  expect(details).toHaveStyle('display: none');
});

test('renders details when clicking view button', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Harry',
    url: 'bla',
    likes: 50,
  };
  const mockHandler = vi.fn();

  const { container } = render(<Blog blog={blog} onRemove={mockHandler} />);
  const details = container.querySelector('#details');
  const user = userEvent.setup();
  const viewBtn = screen.getByText('view');
  await user.click(viewBtn);
  expect(details).toHaveStyle('display: block');
});

test('two clicks on botton like equals two calls to event handler', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Harry',
    url: 'bla',
    likes: 50,
  };
  const mockHandler = vi.fn();
  const mockLikeHandler = vi.fn();

  const { container } = render(
    <Blog blog={blog} onRemove={mockHandler} onLike={mockLikeHandler} />
  );
  const user = userEvent.setup();

  const likeBtn = screen.getByText('like');
  await user.click(likeBtn);
  await user.click(likeBtn);

  expect(mockLikeHandler).toHaveBeenCalledTimes(2);
});
