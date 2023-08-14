import fs from "fs-extra";
import path from "path";
import ElectronPreferences from "electron-preferences"; // ...or if you prefer to use module imports

const preferencePath = path.join(__dirname, "config", "preference.json");
fs.ensureFileSync(preferencePath);
const preference = fs.readJSONSync(preferencePath, { throws: false }) ?? {
  assets: {
    animFrame: 24,
    computeNormals: "never",
    computeTangents: "never",
    blendShape: [],
  },
};

export const preferences = new ElectronPreferences({
  // Override default preference BrowserWindow values
  browserWindowOverrides: {
    /* ... */
  },

  // Create an optional menu bar
  // menu: Menu.buildFromTemplate(/* ... */),

  // Provide a custom CSS file, relative to your appPath.
  css: "preference-styles.css",

  // Preference file path
  dataStore: "~/preferences.json", // defaults to <userData>/preferences.json

  // Preference default values
  defaults: preference,

  // Preference sections visible to the UI
  sections: [
    {
      id: "assets",
      label: "Assets",
      icon: "archive-paper", // See the list of available icons below
      form: {
        groups: [
          {
            label: "Import Options", // optional
            fields: [
              {
                label: "Animation Framerate",
                key: "animFrame",
                type: "dropdown",
                options: [
                  { label: "24", value: 24 },
                  { label: "30", value: 30 },
                  { label: "60", value: 60 },
                ],
                help: "Select baked animation framerate.",
              },
              {
                label: "Compute Normals",
                key: "computeNormals",
                type: "dropdown",
                options: [
                  { label: "never", value: "never" },
                  { label: "broken", value: "broken" },
                  { label: "missing", value: "missing" },
                  { label: "always", value: "always" },
                ],
                help: "Compute Normals Option.",
              },
              {
                label: "Compute Tangents",
                key: "computeTangents",
                type: "dropdown",
                options: [
                  { label: "never", value: "never" },
                  { label: "missing", value: "missing" },
                  { label: "overwrite", value: "overwrite" },
                ],
                help: "Compute Tangents Option.",
              },
              {
                label: "Blend Shape",
                key: "blendShape",
                type: "checkbox",
                options: [
                  { label: "include normals", value: "normals" },
                  { label: "include tangents", value: "tangents" },
                ],
                help: "Include blend shape normals/tangents, if reported present by the FBX SDK.",
              },
              // ...
            ],
          },
          // ...
        ],
      },
    },
    // ...
  ],
});

// Subscribing to preference changes.
preferences.on("save", (preferencesObject) => {
  console.log(`Preferences were saved.`, JSON.stringify(preferences, null, 4));
  fs.writeJson(preferencePath, preferencesObject);
});

// Using a button field with `channel: 'reset'`
preferences.on("click", (key) => {
  if (key === "resetButton") {
    // resetApp();
  }
});
