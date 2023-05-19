import { rmSync } from "fs";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-electron-plugin";
import { esmodule } from "vite-electron-plugin/plugin";
import { loadViteEnv } from "vite-electron-plugin/plugin";

import electronPath from "electron";
import { spawn } from "child_process";
import pkg from "./package.json";

rmSync(path.join(__dirname, "dist"), { recursive: true, force: true }); // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      "@galacean/engine",
      "@galacean/engine-core",
      "@galacean/engine-math",
      "@galacean/engine-loader",
      "@galacean/engine-rhi-webgl",
    ],
  },
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
      styles: path.join(__dirname, "src/assets/styles"),
    },
  },
  plugins: [
    react(),
    electron({
      include: ["electron"],
      plugins: [
        loadViteEnv(),
        esmodule({
          include: ["node-fetch"],
        }),
      ],
    }),
  ],
  server: process.env.VSCODE_DEBUG
    ? {
        host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
        port: pkg.debug.env.VITE_DEV_SERVER_PORT,
      }
    : undefined,
});
