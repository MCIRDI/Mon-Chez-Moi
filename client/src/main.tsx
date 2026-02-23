import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppContextProvider } from "./Context/AppContext.tsx";
import { UiSettingsProvider } from "./Context/UiSettingsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UiSettingsProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </UiSettingsProvider>
  </StrictMode>
);
