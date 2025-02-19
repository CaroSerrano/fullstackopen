import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
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

  const user = userEvent.setup()
  const viewBtn = screen.getByText('view')
  await user.click(viewBtn)
  expect(details).toHaveStyle('display: block')
  screen.debug();
});



