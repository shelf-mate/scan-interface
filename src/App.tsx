import React, { useEffect } from "react";
import logo from "./logo.svg";
import Home from "./pages/Home";
import {
  init,
  getProductTemplates,
  createProduct,
} from "@shelf-mate/api-client-ts";
import { useProductTemplate } from "./providers/ProductTemplateProvider";
import Modal from "./components/AddModal";

function App() {
  const { currentProductTemplate } = useProductTemplate();
  return (
    <div className="App">
      <h1>{currentProductTemplate?.name}</h1>
      <Home />
    </div>
  );
}

export default App;
