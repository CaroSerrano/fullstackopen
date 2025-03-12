interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

type ratingResult = {
  rating: number;
  ratingDescription: string;
};

function calculateRating(average: number, target: number): ratingResult {
  if (average >= target) {
    return { rating: 3, ratingDescription: 'Well done!' };
  } else if (target - average < 5) {
    return { rating: 2, ratingDescription: 'Not so good' };
  } else {
    return { rating: 1, ratingDescription: "You're lazy!" };
  }
}

interface CalculatorValues {
  daily_exercises: number[];
  target: number;
}

const parseArguments = (args: string[]): CalculatorValues => {
  if (args.length < 2) throw new Error('Not enough arguments');
  let hoursArray: number[] = [];
  for (let i = 2; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error('Provided values were not numbers!');
    } else if (i === 2) {
      continue;
    } else {
      hoursArray.push(Number(args[i]));
    }
  }

  return {
    target: Number(args[2]),
    daily_exercises: hoursArray,
  };
};

export const parseBody = (args: CalculatorValues): CalculatorValues => {
  if (Object.keys(args).length < 2) throw new Error('Not enough arguments');
  if (isNaN(Number(args.target))) {
    throw new Error('Provided target value was not a number');
  }
  for (let i = 0; i < args.daily_exercises.length; i++) {
    if (isNaN(Number(args.daily_exercises[i]))) {
      throw new Error('Provided daily_exercises values were not numbers!');
    }
  }

  return {
    target: Number(args.target),
    daily_exercises: args.daily_exercises,
  };
};

function calculateExercises(args: CalculatorValues): Result {
  const averageValue =
    args.daily_exercises.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) / args.daily_exercises.length;
  const ratingResult = calculateRating(averageValue, args.target);

  const result: Result = {
    periodLength: args.daily_exercises.length,
    trainingDays: args.daily_exercises.filter((day) => day !== 0).length,
    success: averageValue >= args.target,
    rating: ratingResult.rating,
    ratingDescription: ratingResult.ratingDescription,
    target: args.target,
    average: averageValue,
  };
  return result;
}
try {
  const calcAguments = parseArguments(process.argv);
  console.log(calculateExercises(calcAguments));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateExercises;
