import ReactDOM from "react-dom/client";
import { StrictMode } from "react";

import App from "./App";
import "./index.css";

import { AppWrapper } from "./components/common/PageMeta.tsx";
import { store } from "./store/index.ts";
import { Provider } from "react-redux";
import { ThemeProvider } from "./context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <Provider store={store}>
          <App />
        </Provider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>,
);
