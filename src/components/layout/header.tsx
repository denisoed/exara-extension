import { Bot, Settings } from "lucide-react";
import { ThemeSwitch } from "~/components/common/theme";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const Header = () => {
  return (
    <header className="flex items-center justify-center gap-2">
      <a
        href="/options.html"
        target="_blank"
        rel="noreferrer"
        className={cn(
          buttonVariants({
            variant: "outline",
            size: "icon",
          }),
          "rounded-full",
        )}
      >
        <Settings className="size-5" />
        <span className="sr-only">Options</span>
      </a>
      <ThemeSwitch />
    </header>
  );
};
