import { render, screen } from '@testing-library/react';
import Blog from './Blog';
import { expect } from 'vitest';

test('renders content', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Harry',
    url: 'bla',
    likes: 50,
  };
  const mockHandler = vi.fn();

  const { container } = render(<Blog blog={blog} onRemove={mockHandler} />);
  screen.debug(container);
  const mainData = container.querySelector('#mainData');
  const details = container.querySelector('#details');

  expect(mainData).toHaveStyle('display: block');
  expect(details).toHaveStyle('display: none');

  screen.debug();
});
