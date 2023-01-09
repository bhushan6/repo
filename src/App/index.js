import React, { Component } from "react";
import Films from "../Films";
import "./style.css";

const App = () => {
  return (
    <div>
      <p className="films-analysis-service">Films Analysis Service</p>
      <Films />
    </div>
  );
};

export default App;
