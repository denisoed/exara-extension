import React from "react";
import ReactDOM from "react-dom/client";
import { LanguageSwitcher } from "@/components/options/language-switcher";
import { ScrollCloseSwitch } from "@/components/options/scroll-close-switch";

import { Layout } from "~/components/layout/layout";

const Popup = () => {
  return (
    <Layout>
      <div className="flex flex-col gap-4">
        <LanguageSwitcher />
        <ScrollCloseSwitch />
      </div>
    </Layout>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
