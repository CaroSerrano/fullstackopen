const Header = (props) => <h2 key={props.key}>{props.course}</h2>;

const Content = (props) => {
  const parts = props.parts.map((p) => <Part key={p.id} part={p} />);
  return <div>{parts}</div>;
};

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
);

const Total = ({ parts }) => {  
  const total = parts.reduce((s, p) => {
    return s + p.exercises;
  }, 0);

  return (
    <p>
      <strong>Total of {total} exercises</strong>
    </p>
  );
};

const Course = ({ courses }) => {
  const renderCourses = courses.map((c) => {
    return (
      <div key={c.id}>
        <Header course={c.name} />
        <Content parts={c.parts} />
        <Total parts={c.parts} />
      </div>
    );
  });
  return renderCourses;
};

export default Course