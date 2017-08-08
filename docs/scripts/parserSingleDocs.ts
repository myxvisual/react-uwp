import { Parser } from "./parser";
import * as fs from "fs";
import * as path from "path";

const parser = new Parser();


const buildComponentName = process.argv[2] || "Button";
let fileName = `../../src/${buildComponentName}.tsx`;

if (!fs.existsSync(fileName)) {
  fileName = `../../src/${buildComponentName}/index.tsx`;
}

const result = parser.parseHot(
  path.resolve(__dirname, fileName),
  result => fs.writeFileSync(result.fileName.replace(/\.tsx?/, ".doc.json"), JSON.stringify(result, null, 2))
);
