import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
import { parseBody } from './exerciseCalculator';

const app = express();

app.use(express.json());

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

app.post('/exercises', (req, res) => {
  const { daily_exercises, target } = req.body;
  if(!daily_exercises || !target){
    res.json({error: 'Parameters missing'})
  }
  try {
    const exercisesResult = calculateExercises(
      parseBody({ daily_exercises, target })
    );
    res.json(exercisesResult);
  } catch (error) {
    res.json({ error: error.message });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
