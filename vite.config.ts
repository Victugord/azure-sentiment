import { createApp } from "vinxi";

export default createApp({
  server: {
    preset: "vercel",
    output: {
      dir: "./dist",
    },
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
