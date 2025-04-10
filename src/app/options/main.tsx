import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "~/components/layout/layout";
import { LanguageSwitcher } from "@/components/options/language-switcher";
import { useTranslation } from "~/i18n/hooks";

const Options = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold">
            {t("optionsPage.title")}
          </h1>
          <LanguageSwitcher />
        </div>
      </div>
    </Layout>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
