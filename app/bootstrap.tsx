import * as ReactDOM from "react-dom";
import * as React from "react";
import { App } from "app";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter >,
  document.getElementById("app")
);