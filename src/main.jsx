import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import { ErrorBoundary } from "./components/ErrorBoundary.jsx";
import "./styles/tokens.css";
import "./styles/theme.css";
import "./styles/base.css";
import "./styles/app.css";
import "./styles/card.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* framer-motion animates via inline styles, so the CSS media query in
        base.css cannot reach it. reducedMotion="user" makes every motion
        component honour the OS setting. */}
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
);
