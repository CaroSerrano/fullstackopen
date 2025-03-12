interface bmiArgs {
  height: number;
  weight: number;
}

const parseBmiArguments = (args: string[]): bmiArgs => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  if (isNaN(Number(args[2])) || isNaN(Number(args[2]))) {
    throw new Error('Provided values were not numbers!');
  } else {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  }
};

function calculateBmi(args: bmiArgs): string {
  const IMC = args.weight / (args.height / 100) ** 2;
  let result: string;
  if (IMC < 18.5) {
    result = 'Underweight';
  } else if (IMC < 25) {
    result = 'Normal range';
  } else {
    result = 'Overweight (Pre-obese)';
  }
  return result;
}

try {
  const bmiArguments = parseBmiArguments(process.argv);
  console.log(calculateBmi(bmiArguments));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}

export default calculateBmi;
