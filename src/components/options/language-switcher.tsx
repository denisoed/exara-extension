import { useTranslation } from '~/i18n/hooks';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ru", label: "Русский" },
];

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
  };

  const currentLanguageLabel = LANGUAGES.find(lang => lang.value === currentLanguage)?.label || "Select language";

  return (
    <div className="space-y-2 w-full">
      <label htmlFor="language" className="text-sm font-medium">
        {t("optionsPage.appLanguageLabel")}
      </label>
      <div className="w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between" id="language">
              {currentLanguageLabel}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[--radix-popper-anchor-width]">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value)}
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