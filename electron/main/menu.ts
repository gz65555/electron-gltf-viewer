import { app, BrowserWindow, dialog, Menu } from "electron";
import { contextDocument, getIO, openFile, readModelFile } from "./gltf/reader";
import { preferences } from "./preference/preference";
import fs from "fs-extra";
import path from "path";

export function createMenu() {
  return Menu.buildFromTemplate([
    {
      label: "View",
      submenu: [
        {
          label: "Exit",
          click() {
            app.quit();
          },
        },
        {
          label: "Preference",
          accelerator: "CmdOrCtrl+,",
          click() {
            preferences.show();
          },
        },
      ],
    },
    {
      label: "File",
      submenu: [
        {
          label: "Open File",
          accelerator: "CmdOrCtrl+O",
          // this is the main bit hijack the click event
          click() {
            // construct the select file dialog
            dialog
              .showOpenDialog({
                properties: ["openFile"],
                filters: [
                  { name: "Models", extensions: ["gltf", "glb", "fbx"] },
                ],
              })
              .then(async function (fileObj) {
                // the fileObj has two props
                if (!fileObj.canceled) {
                  const allWindows = BrowserWindow.getAllWindows();
                  openFile(allWindows[0], fileObj.filePaths[0]);
                }
              })
              // should always handle the error yourself, later Electron release might crash if you don't
              .catch(function (err) {
                console.error(err);
              });
          },
        },
        {
          label: "Export GlB",
          accelerator: "CmdOrCtrl+E",
          async click() {
            if (contextDocument) {
              const result = await dialog.showSaveDialog(
                BrowserWindow.getFocusedWindow(),
                {
                  title: "Download to File…",
                  filters: [{ name: "All Files", extensions: [".glb"] }],
                }
              );
              if (!result.canceled) {
                const filepath = result.filePath!;
                const io = await getIO();
                const buffer = await io.writeBinary(contextDocument);
                await fs.writeFile(filepath, buffer);
              }
            } else {
              dialog.showMessageBox(BrowserWindow.getFocusedWindow(), {
                message: "Open a gltf/glb First",
              });
            }
          },
        },
      ],
    },
    {
      label: "Application",
      submenu: [
        {
          label: "About Application",
        },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: function () {
            app.quit();
          },
        },
      ],
    },
    {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X" },
        { label: "Copy", accelerator: "CmdOrCtrl+C" },
        { label: "Paste", accelerator: "CmdOrCtrl+V" },
        {
          label: "Select All",
          accelerator: "CmdOrCtrl+A",
        },
      ],
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Open Dev Tools",
          accelerator: "CmdOrCtrl+Option+J",
          click() {
            const allWindows = BrowserWindow.getAllWindows();
            if (allWindows[0]) {
              allWindows[0].webContents.openDevTools();
            }
          },
        },
      ],
    },
  ]);
}
