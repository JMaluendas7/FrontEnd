import React from "react";
import Banner from "./banner";
import Menu from "./menu";
import Content from "./contenidodos";

const App = () => {
  return (
    <div style={styles.container}>
      <Menu />
      <Banner />
      <Content />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
  },
};

export default App;
