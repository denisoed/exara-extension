import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import * as localStorage from "~/lib/localStorage";
import { useTranslation } from "~/i18n/hooks";

export function TokenInput() {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await localStorage.get<string>(localStorage.StorageKey.TOKEN);
        if (savedToken) {
          setToken(savedToken);
          setIsSaved(true);
        }
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    setIsSaved(false);
  };

  const saveToken = async () => {
    if (!token.trim()) return;
    
    try {
      await localStorage.set(localStorage.StorageKey.TOKEN, token.trim());
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const deleteToken = async () => {
    try {
      await localStorage.remove(localStorage.StorageKey.TOKEN);
      setToken("");
      setIsSaved(false);
    } catch (error) {
      console.error("Error deleting token:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveToken();
    }
  };

  if (isLoading) {
    return <div className="h-8 animate-pulse bg-muted rounded"></div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="api-token" className="text-xs text-muted-foreground">
        {t("components.tokenInput.label")}
      </Label>
      <div className="flex gap-2">
        <Input
          id="api-token"
          type="password"
          placeholder={t("components.tokenInput.placeholder")}
          value={token}
          onChange={handleTokenChange}
          onKeyDown={handleKeyDown}
          className="flex-1 h-8 text-sm"
        />
        {!isSaved ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2"
            disabled={!token.trim()}
            onClick={saveToken}
          >
            {t("components.tokenInput.save")}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-destructive hover:bg-destructive/80"
            onClick={deleteToken}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
} 