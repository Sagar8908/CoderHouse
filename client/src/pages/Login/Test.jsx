const Test = ({ children, ...prop }) => {
  console.log(prop);
  return (
    <div>
          <h1>This is Top</h1>
          <h2>{prop.title}</h2>
      {children}
      <h1>This is Bottom</h1>
    </div>
  );
};

export default Test;
