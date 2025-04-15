import { useState } from "react";
import { Switch } from "~/components/ui/switch";
import { get, set, StorageKey } from "~/lib/localStorage";
import { useEffect } from "react";
import { useTranslation } from "~/i18n/hooks";

export function ScrollCloseSwitch() {
  const { t } = useTranslation();
  const [isScrollCloseEnabled, setIsScrollCloseEnabled] = useState<boolean>(false);

  useEffect(() => {
    get<boolean>(StorageKey.SCROLL_CLOSE).then((value) => {
      setIsScrollCloseEnabled(value);
    });
  }, []);

  const handleScrollCloseChange = (checked: boolean) => {
    set(StorageKey.SCROLL_CLOSE, checked);
    setIsScrollCloseEnabled(checked);
  };

  return (
    <div className="flex items-center justify-between space-x-2">
      <label
        htmlFor="scroll-close"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {t("optionsPage.scrollCloseLabel")}
      </label>
      {isScrollCloseEnabled}
      <Switch
        id="scroll-close"
        checked={isScrollCloseEnabled}
        onCheckedChange={handleScrollCloseChange}
      />
    </div>
  );
}