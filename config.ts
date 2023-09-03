import { load } from "std/dotenv/mod.ts";

export interface Env {
  TOKEN: string;

  MODE: "production" | "development" | string;
}

export const getEnv = async (): Promise<Env> => {
  const env = ((Deno.env.get("MODE") as Env["MODE"]) === "production"
    ? Deno.env.toObject()
    : await load()) as unknown as Env;

  return env;
};

export const env = await getEnv();
