import { useState } from "react";

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const Display = ({ text, anecdote }) => {
  return (
    <div>
      <h1>{text}</h1>
      {anecdote}
    </div>
  );
};
const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const initialVotes = new Uint8Array(8);
  const [votes, setVote] = useState(initialVotes);

  const handleVote = () => {
    console.log("votes", votes);
    const copy = [...votes];
    copy[selected] += 1;
    console.log("copy", copy);
    setVote(copy);
  };

  const handleSelection = () => {
    const randomNum = Math.floor(Math.random() * 8);
    console.log(randomNum);
    setSelected(randomNum);
  };

  const maxVotes = Math.max(...votes)
  const mostVoted = votes.findIndex((vote) => vote===maxVotes)
  return (
    <div>
      <Display text="Anecdote of the day" anecdote={anecdotes[selected]} />
      <br />
      <Button text="next anecdote" onClick={handleSelection} />
      <Button text="vote" onClick={handleVote} />
      <br />
      <Display text="Anecdote with most votes" anecdote={anecdotes[mostVoted]}/>
    </div>
  );
};

export default App;
