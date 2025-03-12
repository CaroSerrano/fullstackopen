import express from 'express';
import calculateBmi from './bmiCalculator';
const app = express();

app.get('/ping', (_req, res) => {
  res.send('pong');
});

app.get('/hello', (_req, res) => {
  res.send('hello fullstack');
});

app.get('/bmi', (req, res) => {
  if (!req.query.height || !req.query.weight) {
    res.json({ error: 'Provide height and weight parameters' });
  }
  const height = req.query.height;
  const weight = req.query.weight;
  if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.json({ error: 'Query params must be numbers' });
  }
  const bmiResult = calculateBmi({
    height: Number(height),
    weight: Number(weight),
  });
  res.json({ weight: Number(weight), height: Number(height), bmi: bmiResult });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
