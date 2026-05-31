import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Teasing from "./Teasing";
import "./index.css";

const ADMIN_KEY = "kidiworld_admin_access";
const TEASING_MODE = true; // ← Set to false to disable teasing and open platform

function Root() {
  const [adminAccess, setAdminAccess] = React.useState(() => {
    return sessionStorage.getItem(ADMIN_KEY) === "true";
  });

  if (!TEASING_MODE || adminAccess) {
    return <App />;
  }

  return (
    <Teasing
      onAdminAccess={() => setAdminAccess(true)}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
