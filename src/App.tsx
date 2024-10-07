import React, { useEffect } from "react";
import logo from "./logo.svg";
import {
  init,
  getProductTemplates,
  createProduct,
} from "@shelf-mate/api-client-ts";

init({ baseURL: "http://localhost:3000" });

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
