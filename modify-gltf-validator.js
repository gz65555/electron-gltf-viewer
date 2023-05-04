const fs = require("fs");
const path = require("path");

const filepath = path.join(
  __dirname,
  "node_modules",
  "gltf-validator",
  "gltf_validator.dart.js"
);

const code = fs.readFileSync(filepath, { encoding: "utf-8" });
const resultCode = code.replace("if(dartNodeIsActuallyNode)", "if(false)");
fs.writeFileSync(filepath, resultCode, { encoding: "utf-8" });
