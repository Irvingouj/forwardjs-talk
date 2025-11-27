const path = require("path");

module.exports = {
  mode: "production",             // or "development"
  entry: "./src/index.js",        // starting file
  output: {
    filename: "main.js",          // bundled output file
    path: path.resolve(__dirname, "dist"),
  },
};
