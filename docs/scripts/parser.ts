import * as ts from "typescript";

export interface DocEntry {
  fileName?: string;
  name?: string;
  type?: string;
  constructors?: DocEntry[];
  isRequired?: boolean;
  documentation?: string;
  exports?: DocEntry[];
  parameters?: DocEntry[];
  returnType?: string;
  comment?: string;
  members?: DocEntry[];
  extends?: DocEntry[] | string[];
  initializerText?: string;
}

export class Parser {
  constructor(options?: ts.CompilerOptions, host?: ts.CompilerHost) {
    const defaultOptions: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES5,
      maxNodeModuleJsDepth: 4,
      module: ts.ModuleKind.CommonJS
    };
    this.options = options || defaultOptions;
    this.host = host;
  }

  private rootNames: string[];
  private options: ts.CompilerOptions;
  private host: ts.CompilerHost;

  private program: ts.Program;
  private checker: ts.TypeChecker;
  private sourceFiles: ts.SourceFile[];
  private currSourceFile: ts.SourceFile;
  private currNode: ts.Node;
  private output: DocEntry = {};
  getResultCallback: (result: DocEntry) => void;

  parse = (fileName: string | string[], callback = (result?: DocEntry) => { }) => {
    const rootNames = Array.isArray(fileName) ? fileName : [fileName];
    this.rootNames = rootNames;
    this.program = ts.createProgram(rootNames, this.options, this.host);
    this.checker = this.program.getTypeChecker();
    this.sourceFiles = this.program.getSourceFiles() as ts.SourceFile[];

    for (const fileName of this.rootNames) {
      this.currSourceFile = this.program.getSourceFile(fileName);
      this.visit(this.currSourceFile);
      ts.forEachChild(this.currSourceFile, this.visit);
    }

    callback(this.output);
    return this.output;
  }

  private visit = (node: ts.Node) => {
    if (!node) return;
    this.currNode = node;
    let symbol: ts.Symbol = null;

    switch (node.kind) {
      case ts.SyntaxKind.SourceFile: {
        const declaration = node as ts.SourceFile;
        this.output.fileName = declaration.fileName;
        symbol = (node as any).symbol;
        break;
      }
      case ts.SyntaxKind.ClassDeclaration: {
        const declaration = node as ts.ClassDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);

        if (declaration.heritageClauses) {
          const extendsNames: string[] = [];
          declaration.heritageClauses.forEach(heritageClause => {
            heritageClause.types.forEach(type => {
              const extendsSymbol = this.checker.getSymbolAtLocation(type.expression);
              extendsNames.push(this.serializeSymbol(extendsSymbol, false).name);
            });
          });
          this.getResultCallback = (result: DocEntry) => {
            result.extends = extendsNames;
          };
        }
        break;
      }
      case ts.SyntaxKind.InterfaceDeclaration: {
        const declaration = node as ts.InterfaceDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);

        if (declaration.heritageClauses) {
          const extendsNames: string[] = [];
          declaration.heritageClauses.forEach(heritageClause => {
            heritageClause.types.forEach(type => {
              const extendsSymbol = this.checker.getSymbolAtLocation(type.expression);
              extendsNames.push(this.serializeSymbol(extendsSymbol, false).name);
            });
          });
          this.getResultCallback = (result: DocEntry) => {
            result.extends = extendsNames;
          };
        }
        break;
      }
      case ts.SyntaxKind.FunctionDeclaration: {
        const declaration = node as ts.FunctionDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);
        break;
      }
      case ts.SyntaxKind.MethodDeclaration: {
        const declaration = node as ts.MethodDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);
        break;
      }
      case ts.SyntaxKind.PropertyDeclaration: {
        const declaration = node as ts.PropertyDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);
        break;
      }
      case ts.SyntaxKind.EnumDeclaration: {
        const declaration = node as ts.EnumDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);
        break;
      }
      case ts.SyntaxKind.ImportDeclaration: {
        break;
      }
      case ts.SyntaxKind.VariableDeclaration: {
        const declaration = node as ts.VariableDeclaration;
        symbol = this.checker.getSymbolAtLocation(declaration.name);
        break;
      }
      case ts.SyntaxKind.VariableStatement: {
        const statement = node as ts.VariableStatement;
        statement.declarationList.declarations.map((declaration, index) => {
          if (declaration) {
            const docEntry: DocEntry = {};
            symbol = this.checker.getSymbolAtLocation(declaration.name);
            let documentation = ts.displayPartsToString(symbol.getDocumentationComment(void 0));
            docEntry.documentation = documentation || void 0;
            docEntry.name = symbol.getName();
            docEntry.type = this.checker.typeToString(this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
            if (declaration.initializer) {
              docEntry.initializerText = declaration.initializer.getFullText();
            }
            if (!this.output.members) this.output.members = [];
            this.output.members.push(docEntry);
          }
        });
        break;
      }
      case ts.SyntaxKind.ExportAssignment: {
        const exportAssignment = node as ts.ExportAssignment;
        break;
      }
      case ts.SyntaxKind.EndOfFileToken: {
        const endOfFileToken = node as ts.EndOfFileToken;
        break;
      }
      default: {
        console.log(`Missing parse kind: ${node.kind}`);
        break;
      }
    }

    if (node.kind === ts.SyntaxKind.SourceFile) {
      const result = this.serializeSymbol(symbol);
      Object.assign(this.output, result);
    } else {
      const result = this.serializeSymbol(symbol);
      if (this.getResultCallback) {
        this.getResultCallback(result);
        this.getResultCallback = void 0;
      }
      if (result) {
        this.output.members = [...(this.output.members || []), result];
      }
    }
  }

  serializeSymbol = (symbol: ts.Symbol, getAllAst = true): DocEntry => {
    if (!symbol || typeof symbol !== "object") return;

    const customType: any = {
      "8388608": "React",
      "16777220": "prototype"
    };

    const name = symbol.flags !== ts.SymbolFlags.Interface ? symbol.getName() : symbol.name;
    let isRequired: boolean;
    const isSourceFile = symbol.flags === 512;
    const documentation = ts.displayPartsToString(symbol.getDocumentationComment(void 0)) || void 0;

    // console.log(name, symbol.flags);

    let newSymbol: any = symbol;
    const parentSymbol: ts.Symbol = newSymbol.parent;
    if (parentSymbol && parentSymbol.flags === ts.SymbolFlags.Interface) {
      const valueDeclaration: any = symbol.valueDeclaration;
      isRequired = valueDeclaration ? !valueDeclaration.questionToken : false;
    }

    let extendsDocEntry = "declarations" in newSymbol ? newSymbol.declarations.map((declaration: any) => (
      "expression" in declaration && declaration.expression.text
    )).filter((extendsName: any) => extendsName) : void 0;

    if (Array.isArray(extendsDocEntry) && extendsDocEntry.length === 0) {
      extendsDocEntry = void 0;
    }

    if (symbol.flags === 4) {
      const newSymbol: ts.VariableDeclarationList = symbol as any;

      for (const declaration of newSymbol.declarations) {
        const docEntry: DocEntry = {};
        const variableSymbol = this.checker.getSymbolAtLocation(declaration.name);
        docEntry.name = variableSymbol.getName();
        if (declaration.initializer) {
          docEntry.initializerText = declaration.initializer.getFullText();
        }
        docEntry.documentation = documentation;
        docEntry.type = this.checker.typeToString(this.checker.getTypeOfSymbolAtLocation(variableSymbol, variableSymbol.valueDeclaration));
        return docEntry;
      }
    }

    if (!getAllAst) {
      return {
        name,
        documentation,
        extends: extendsDocEntry
      };
    }

    let exportsDocEntry: DocEntry[];
    if ("exports" in symbol && symbol.exports.size) {
      exportsDocEntry = [];
      const values = symbol.exports.values();
      for (let i = 0; i < symbol.exports.size; i++) {
        const result: any = values.next();
        exportsDocEntry.push(this.serializeSymbol(result.value, isSourceFile ? false : true));
      }
    }

    let membersDocEntry: DocEntry[];
    if ("members" in symbol && symbol.members.size && symbol.flags !== 512 && name !== "HTMLAttributes") {
      membersDocEntry = [];
      const values = symbol.members.values();
      for (let i = 0; i < symbol.members.size; i++) {
        const result: any = values.next();
        membersDocEntry.push(this.serializeSymbol(result.value, isSourceFile ? false : true));
      }
    }

    if (symbol.flags === ts.SymbolFlags.Interface || symbol.flags === ts.SymbolFlags.Class) {
      return {
        name,
        exports: exportsDocEntry,
        members: membersDocEntry,
        documentation,
        extends: extendsDocEntry
      };
    }

    let type: string;

    try {
      type = this.checker.typeToString(this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
    } catch (err) { }
    if (!type) {
      type = customType[symbol.flags] || "any";
    }

    return {
      name,
      exports: exportsDocEntry,
      members: membersDocEntry,
      documentation,
      isRequired,
      type,
      extends: extendsDocEntry
    };
  }

  serializeSignature = (signature: ts.Signature) => ({
    parameters: signature.parameters.map(symbol => this.serializeSymbol(symbol)),
    returnType: this.checker.typeToString(signature.getReturnType()),
    documentation: ts.displayPartsToString(signature.getDocumentationComment(void 0)) || void 0
  })

  serializeSourceFile = (symbol: ts.Symbol) => {
    const details = this.serializeSymbol(symbol);
    return details;
  }

  symbolFlags: any = {
    "0": "None",
    "1": "FunctionScopedVariable",
    "2": "BlockScopedVariable",
    "4": "Property",
    "8": "EnumMember",
    "16": "Function",
    "32": "Class",
    "64": "Interface",
    "128": "ConstEnum",
    "256": "RegularEnum",
    "512": "ValueModule",
    "1024": "NamespaceModule",
    "2048": "TypeLiteral",
    "4096": "ObjectLiteral",
    "8192": "Method",
    "16384": "Constructor",
    "32768": "GetAccessor",
    "65536": "SetAccessor",
    "131072": "Signature",
    "262144": "TypeParameter",
    "524288": "TypeAlias",
    "1048576": "ExportValue",
    "2097152": "ExportType",
    "4194304": "ExportNamespace",
    "8388608": "Alias",
    "16777216": "Prototype",
    "33554432": "ExportStar",
    "67108864": "Optional",
    "134217728": "Transient",
    "384": "Enum",
    "3": "Variable",
    "107455": "Value",
    "793064": "Type",
    "1920": "Namespace",
    "1536": "Module",
    "98304": "Accessor",
    "107454": "FunctionScopedVariableExcludes",
    "900095": "EnumMemberExcludes",
    "106927": "FunctionExcludes",
    "899519": "ClassExcludes",
    "792968": "InterfaceExcludes",
    "899327": "RegularEnumExcludes",
    "899967": "ConstEnumExcludes",
    "106639": "ValueModuleExcludes",
    "99263": "MethodExcludes",
    "41919": "GetAccessorExcludes",
    "74687": "SetAccessorExcludes",
    "530920": "TypeParameterExcludes",
    "8914931": "ModuleMember",
    "944": "ExportHasLocal",
    "1952": "HasExports",
    "6240": "HasMembers",
    "418": "BlockScoped",
    "98308": "PropertyOrAccessor",
    "7340032": "Export",
    "106500": "ClassMember"
  };
}

export default Parser;
