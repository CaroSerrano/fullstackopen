import { useState } from "react";

const Title = ({ text }) => {
  return <h1>{text}</h1>;
};
const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};
const Display = ({ value, text }) => {
  return (
    <div>
      {text} {value}
    </div>
  );
};

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };
  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };
  const handleBadClick = () => {
    setBad(bad + 1);
  };
  const all = good + bad + neutral
  const avergae = ((good * 1) + (bad * -1)) / all
  const positive = (good * 100) / all

  return (
    <div>
      <Title text="give feedback" />
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <Title text="statistics" />
      <Display value={good} text="good" />
      <Display value={neutral} text="neutral" />
      <Display value={bad} text="bad" />
      <Display value={all} text="all" />
      <Display value={avergae} text="average" />
      <Display value={positive} text="positive" />
    </div>
  );
};

export default App;
