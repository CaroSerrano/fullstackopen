import { CoursePart } from './Content';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = (props: CoursePart) => {
  switch (props.kind) {
    case 'basic':
      return (
        <div>
          <h2>{props.name} </h2>
          <p>Exercises: {props.exerciseCount}</p>
          <p>{props.description}</p>
        </div>
      );
    case 'group':
      return (
        <div>
          <h2>{props.name}</h2>
          <p>Exercises: {props.exerciseCount}</p>
          <p>Project exercises: {props.groupProjectCount}</p>
        </div>
      );
    case 'background':
      return (
        <div>
          <h2>{props.name}</h2>
          <p>Exercises: {props.exerciseCount}</p>
          <p>{props.description}</p>
          <p>submit to: {props.backgroundMaterial}</p>
        </div>
      );
    case 'special':
      return (
        <div>
          <h2>{props.name}</h2>
          <p>Exercises: {props.exerciseCount}</p>
          <p>{props.description}</p>
          <p>Requirements: </p>
          {props.requirements.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </div>
      );

    default:
      return assertNever(props);
  }
};

export default Part;
