import { createApp } from "vinxi";

export default createApp({
  server: {
    preset: "cloudflare-module",
  },
  routers: [
    {
      name: "public",
      type: "static",
      dir: "./public",
    },
    {
      name: "client",
      type: "spa",
      handler: "./index.html",
      base: "/",
    },
    {
      name: "api",
      type: "http",
      handler: "./server/entry.ts",
      base: "/api",
    },
  ],
});
