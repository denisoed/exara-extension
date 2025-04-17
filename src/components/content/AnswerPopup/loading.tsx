import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";


export const Loading = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-2 bg-popover rounded-[8px]">
      <Loader2 className="size-4 animate-spin text-black dark:text-white" />
      <span className="text-sm text-black dark:text-white">{t("contentScript.loading")}</span>
    </div>
  );
};

Loading.displayName = "Loading";
