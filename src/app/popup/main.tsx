import React from "react";
import ReactDOM from "react-dom/client";
import { LanguageSwitcher } from "@/components/options/language-switcher";

import { Layout } from "~/components/layout/layout";

const Popup = () => {
  return (
    <Layout>
      <LanguageSwitcher />
    </Layout>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
