type CoursePart = {
  name: string;
  exerciseCount: number;
};

type ContentProps = {
  courseParts: CoursePart[];
};

const Content = (props: ContentProps) => {
  return (
    <div>
      {props.courseParts.map((c) => (
        <p>
          {c.name} {c.exerciseCount}
        </p>
      ))}
    </div>
  );
};

export default Content;
