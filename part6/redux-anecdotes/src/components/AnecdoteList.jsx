import { useSelector, useDispatch } from 'react-redux';
import { updateAnecdote } from '../reducers/anecdoteReducer';
import { setNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return [...anecdotes].filter((a) => a.content.includes(filter));
  });
  const dispatch = useDispatch();

  const handleVote = (id, anecdote) => {
    dispatch(
      updateAnecdote(id, {
        content: anecdote.content,
        votes: anecdote.votes + 1,
      })
    );
    dispatch(setNotification(`You voted ${anecdote.content}`, 5));
  };

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => handleVote(anecdote.id, anecdote)}>
                vote
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
