import html from "@rollup/plugin-html";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import { readFileSync, copyFileSync } from "node:fs";

// Read the source HTML template
const template = readFileSync("index.html", "utf-8");

/**
 * Build a custom HTML page that injects hashed JS/CSS bundles
 * into the original index.html template.
 */
function makeHtml({ attributes, files, publicPath }) {
  // Collect CSS files
  const cssFiles = (files.css || []).map(
    (f) => `<link rel="stylesheet" href="${publicPath}${f.fileName}">`
  );

  // Collect JS files
  const jsFiles = (files.js || []).map(
    (f) => `<script src="${publicPath}${f.fileName}"></script>`
  );

  // Replace the old static references in the template
  let output = template
    // Remove old CSS link
    .replace(/<link rel="stylesheet" href="style\.css">\n?/, "")
    // Remove old JS script
    .replace(/<script src="app\.js"><\/script>\n?/, "");

  // Inject hashed CSS before </head>
  output = output.replace("</head>", `  ${cssFiles.join("\n  ")}\n</head>`);

  // Inject hashed JS before </body>
  output = output.replace("</body>", `  ${jsFiles.join("\n  ")}\n</body>`);

  return output;
}

export default {
  input: "src/main.js",
  output: {
    dir: "dist",
    format: "iife",
    entryFileNames: "[name].[hash].js",
    assetFileNames: "[name].[hash][extname]",
    sourcemap: false,
  },
  plugins: [
    postcss({
      extract: true,       // extract CSS to a separate file
      minimize: true,       // minify CSS
    }),
    terser(),
    html({
      template: makeHtml,
    }),
    {
      name: "copy-static",
      writeBundle() {
        copyFileSync("404.html", "dist/404.html");
      },
    },
  ],
};
