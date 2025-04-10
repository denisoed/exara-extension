import { browser } from "wxt/browser";
import { useTranslation } from "~/i18n/hooks";

import Logo from "~/assets/logo.svg?react";
import { cn } from "~/lib/utils";

interface MainProps {
  readonly className?: string;
  readonly filename: string;
}

export const Main = ({ className, filename }: MainProps) => {
  const { t } = useTranslation();

  return (
    <main
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <Logo className="w-24 animate-pulse text-primary" />
      <p className="text-pretty text-center leading-tight">
        {t("popup.hello")}{" "}
        <code className="inline-block rounded-sm bg-muted px-1.5 text-sm text-muted-foreground">
          {filename}
        </code>{" "}
        👋
      </p>
      <a
        href="https://turbostarter.dev/docs/extension"
        target="_blank"
        rel="noreferrer"
        className="cursor-pointer text-sm text-primary underline hover:no-underline"
      >
        {browser.i18n.getMessage("learnMore")}
      </a>
    </main>
  );
};
