import { app, BrowserWindow, dialog, ipcMain, Menu } from "electron";
import {
  contextDocument,
  contextFilename,
  getIO,
  openFile,
  readModelFile,
} from "./gltf/reader";
import { preferences } from "./preference/preference";
import fs from "fs-extra";
import path from "path";
import { Notification } from "electron";

export function createMenu() {
  ipcMain.on("export-glb", async (e, params) => {
    const isGlTF = params.type === "glTF";
    const result = await dialog.showSaveDialog(
      BrowserWindow.getFocusedWindow(),
      {
        title: "Export to File…",
        defaultPath: `*/${contextFilename}`,
        filters: [
          { name: "All Files", extensions: [isGlTF ? ".gltf" : ".glb"] },
        ],
      }
    );
    if (!result.canceled) {
      const filepath = result.filePath!;
      const dirname = path.dirname(filepath);
      const filename = path.basename(filepath);
      const io = await getIO();
      if (!isGlTF) {
        const buffer = await io.writeBinary(contextDocument);
        await fs.writeFile(filepath, buffer);
      } else {
        const data = await io.writeJSON(contextDocument);
        const { json, resources } = data;
        const promises = [];
        for (let uri in resources) {
          const name = path.basename(uri);
          if (json.buffers) {
            const item = json.buffers.find((item) => item.uri === uri);
            if (item) item.uri = name;
          }
          if (json.images) {
            const item = json.images.find((item) => item.uri === uri);
            if (item) item.uri = name;
          }
          promises.push(fs.writeFile(path.join(dirname, name), resources[uri]));
        }
        promises.push(fs.writeFile(filepath, JSON.stringify(json)));
        await Promise.all(promises);

        new Notification({
          title: "File Exported",
          body: `${filename} has been saved in \n${dirname}`,
        }).show();
      }
    }
  });

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
          label: "Export GlB/GlTF",
          accelerator: "CmdOrCtrl+E",
          async click() {
            if (contextDocument) {
              const allWindows = BrowserWindow.getAllWindows();
              const win = allWindows[0];
              win.webContents.send("export-glb");
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
