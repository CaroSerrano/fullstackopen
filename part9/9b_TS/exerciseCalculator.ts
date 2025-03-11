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

function calculateExercises(hours: number[], target: number): Result {
  const averageValue =
    hours.reduce((accumulator, currentValue) => accumulator + currentValue, 0) /
    hours.length;
  const ratingResult = calculateRating(averageValue, target);

  const result: Result = {
    periodLength: hours.length,
    trainingDays: hours.filter((day) => day !== 0).length,
    success: averageValue >= target,
    rating: ratingResult.rating,
    ratingDescription: ratingResult.ratingDescription,
    target,
    average: averageValue,
  };
  return result;
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))
