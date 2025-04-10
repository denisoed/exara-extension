import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "~/components/layout/layout";
import { browser } from "wxt/browser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

const Options = () => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    // Load saved language preference
    chrome.storage.sync.get(["language"], (result) => {
      if (result.language) {
        setLanguage(result.language);
      }
    });
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    chrome.storage.sync.set({ language: value });
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto space-y-6">
          <h1 className="text-2xl font-bold">
            {browser.i18n.getMessage("optionsPageTitle")}
          </h1>
          <div className="space-y-2">
            <label htmlFor="language" className="text-sm font-medium">
              {browser.i18n.getMessage("optionsPageLanguageLabel")}
            </label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
