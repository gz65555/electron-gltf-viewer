import { rmSync } from "fs";
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron, { onstart } from "vite-plugin-electron";
import electronPath from "electron";
import { spawn } from "child_process";
import pkg from "./package.json";

rmSync(path.join(__dirname, "dist"), { recursive: true, force: true }); // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: [
      "oasis-engine",
      "@oasis-engine/core",
      "@oasis-engine/math",
      "@oasis-engine/loader",
      "@oasis-engine/rhi-webgl",
      "@oasis-engine-toolkit/controls",
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
      main: {
        entry: "electron/main/index.ts",
        vite: {
          build: {
            // For Debug
            sourcemap: true,
            outDir: "dist/electron/main",
          },
          // Will start Electron via VSCode Debug
          plugins: [
            onstart(() => {
              if (process.electronApp) {
                process.electronApp.removeAllListeners();
                process.electronApp.kill();
              }

              // Start Electron.app
              process.electronApp = spawn(
                // @ts-ignore
                electronPath,
                [
                  ".",
                  "--no-sandbox",
                  "--gltf-url https://gw.alipayobjects.com/os/bmw-prod/0b0b0b3b-1b0c-4b0c-9b0c-1b0c0b0b0b0b.gltf",
                ],
                { stdio: "inherit" }
              );
              // Exit command after Electron.app exits
              process.electronApp.once("exit", process.exit);
            }),
          ],
        },
      },
      preload: {
        input: {
          // You can configure multiple preload scripts here
          index: path.join(__dirname, "electron/preload/index.ts"),
        },
        vite: {
          build: {
            // For Debug
            sourcemap: "inline",
            outDir: "dist/electron/preload",
          },
        },
      },
      // Enables use of Node.js API in the Electron-Renderer
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
      renderer: {},
    }),
  ],
  server: process.env.VSCODE_DEBUG
    ? {
        host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
        port: pkg.debug.env.VITE_DEV_SERVER_PORT,
      }
    : undefined,
});
