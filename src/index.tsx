import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ProductTemplateProvider } from "./providers/ProductTemplateProvider";
import Home from "./pages/Home";
import { StorageProvider } from "./providers/StorageProvider";
import { init } from "@shelf-mate/api-client-ts";
import { ProductProvider } from "./providers/ProductProvider";
import { UnitProvider } from "./providers/UnitProvider";
import { CategoryProvider } from "./providers/CategoryProvider";
init({ baseURL: process.env.REACT_APP_BACKEND_URL });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ProductTemplateProvider>
      <ProductProvider>
        <UnitProvider>
          <CategoryProvider>
            <StorageProvider>
              <Home />
            </StorageProvider>
          </CategoryProvider>
        </UnitProvider>
      </ProductProvider>
    </ProductTemplateProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
