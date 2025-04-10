import { useTranslation } from '~/i18n/hooks';
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

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage, t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    changeLanguage(value);
  };

  return (
    <div className="space-y-2">
      <label htmlFor="language" className="text-sm font-medium">
        {t("optionsPage.appLanguageLabel")}
      </label>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
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
  );
}