import Parser from "../../scripts/Parser";
import * as ts from "typescript";

export function sourceCode2docEntry(input?: any): any {
  const options = 1 ? {
    module: ts.ModuleKind.AMD,
    target: ts.ScriptTarget.ES5,
    noLib: true,
    noResolve: true,
    suppressOutputPathCheck: true
  } : {
    target: ts.ScriptTarget.ES5,
    maxNodeModuleJsDepth: 4,
    module: ts.ModuleKind.CommonJS
  } as ts.CompilerOptions;

  let inputFileName = options.jsx ? "module.tsx" : "module.ts";
  let sourceFile = ts.createSourceFile(inputFileName, input, options.target || ts.ScriptTarget.ES5);
  let outputText;

  const compilerHost = {
    getSourceFile: function (fileName) { return fileName.indexOf("module") === 0 ? sourceFile : undefined; },
    writeFile: function (_name, text) { outputText = text; },
    getDefaultLibFileName: function () { return "lib.d.ts"; },
    useCaseSensitiveFileNames: function () { return false; },
    getCanonicalFileName: function (fileName) { return fileName; },
    getCurrentDirectory: function () { return ""; },
    getNewLine: function () { return "\r\n"; },
    fileExists: function (fileName) { return fileName === inputFileName; },
    readFile: function () { return ""; },
    directoryExists: function () { return true; },
    getDirectories: function () { return []; }
  };
  const parser = new Parser(options, compilerHost);
  const docEntry = parser.parse(inputFileName);
  return docEntry;
}

export default sourceCode2docEntry;

