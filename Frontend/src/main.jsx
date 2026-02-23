import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { AuthViewProvider } from "./context/AuthViewContext";
import { DashboardProvider } from "./context/DashboardContext";
import { MusicProvider } from "./context/MusicContext";
import "./index.css";
import "./style/arcade.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <MusicProvider>
        <AuthViewProvider>
          <DashboardProvider>
            <App />
          </DashboardProvider>
        </AuthViewProvider>
      </MusicProvider>
    </Provider>
  </React.StrictMode>
);
