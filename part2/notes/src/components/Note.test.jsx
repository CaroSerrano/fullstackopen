import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Note from './Note'

test('renders content', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }
  const mockHandler = vi.fn()
  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1) //verifica que la mock function (función simulada) se haya llamado exactamente una vez

  render(<Note note={note} toggleImportance={mockHandler} />)
  screen.debug()
  

  const element = screen.getByText('Component testing is done with react-testing-library')
  screen.debug(element)
  expect(element).toBeDefined()
})