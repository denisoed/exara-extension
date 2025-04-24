import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { NodeEnv } from "~/types";

export const env = createEnv({
  shared: {
    NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.DEVELOPMENT),
  },
  clientPrefix: "VITE_",
  client: {
    VITE_API_URL: z.string().url(),
  },
  runtimeEnv: {
    VITE_API_URL: import.meta.env.VITE_API_URL,
  },
  skipValidation:
    (!!import.meta.env.SKIP_ENV_VALIDATION &&
      ["1", "true"].includes(import.meta.env.SKIP_ENV_VALIDATION)) ||
    import.meta.env.npm_lifecycle_event === "lint",
  emptyStringAsUndefined: true,
});
