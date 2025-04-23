"use client";

import { Moon, Sun } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { StorageKey, set } from "~/lib/localStorage";
import { cn } from "~/lib/utils";
import { Theme } from "~/types";

type ThemeSwitchProps = {
  readonly className?: string;
};

export const ThemeSwitch = memo<ThemeSwitchProps>(({ className }) => {
  const { t } = useTranslation();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className={cn("rounded-full bg-accent", className)}
        >
          <Sun className="size-2 text-muted-foreground scale-100 dark:scale-0" />
          <Moon className="absolute size-2 text-muted-foreground scale-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(Theme).map((theme) => (
          <DropdownMenuItem key={theme} onClick={() => set(StorageKey.THEME, theme)}>
            {t(`theme.${theme}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

ThemeSwitch.displayName = "ThemeSwitch";
