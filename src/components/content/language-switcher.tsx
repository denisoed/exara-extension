import { ChevronDown } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { LANGUAGES } from "~/data/languages";
import { useTranslation } from "~/i18n/hooks";
import { StorageKey, set } from "~/lib/localStorage";
import type { Language } from "~/types";

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage, t } = useTranslation();

  const handleLanguageChange = (lang: Language) => {
    changeLanguage(lang.value);
    set(StorageKey.LANGUAGE, lang);
  };

  const currentLanguageLabel =
    LANGUAGES.find((lang) => lang.value === currentLanguage)?.label ||
    "Select language";

  return (
    <div className="space-y-2 w-full">
      <label htmlFor="language" className="text-sm font-medium">
        {t("optionsPage.appLanguageLabel")}
      </label>
      <div className="w-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              id="language"
            >
              {currentLanguageLabel}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[--radix-popper-anchor-width]"
          >
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => handleLanguageChange(lang)}
                className="w-full"
              >
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
