import { Parser } from "./Parser";
import * as fs from "fs";
import * as path from "path";

const parser = new Parser();

const buildComponentName = process.argv[2] || "Button";
let file = `../../src/${buildComponentName}.tsx`;

if (!fs.existsSync(file)) {
  file = `../../src/${buildComponentName}/index.tsx`;
}

const result = parser.parse(
  path.resolve(__dirname, file),
  result => {
    const fileName = result.fileName.replace(/\.tsx?/, ".doc.json");
    result.fileName = void 0;
    result.name = void 0;
    const data = JSON.stringify(result, null, 2);
    fs.writeFileSync(fileName, data.replace(/\\r\\n/g, "\\n"));
  }
);
