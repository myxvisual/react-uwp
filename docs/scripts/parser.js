"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
process.chdir(__dirname);
process.chdir(__dirname);
var Parser = (function () {
    function Parser(options) {
        var _this = this;
        this.output = {};
        this.parse = function (fileName, callback) {
            if (callback === void 0) { callback = function (result) { }; }
            var fileNames = Array.isArray(fileName) ? fileName : [fileName];
            _this.fileNames = fileNames;
            _this.program = ts.createProgram(fileNames, _this.options);
            _this.checker = _this.program.getTypeChecker();
            _this.sourceFiles = _this.program.getSourceFiles();
            for (var _i = 0, _a = _this.fileNames; _i < _a.length; _i++) {
                var fileName_1 = _a[_i];
                _this.currSourceFile = _this.program.getSourceFile(fileName_1);
                _this.visit(_this.currSourceFile);
                ts.forEachChild(_this.currSourceFile, _this.visit);
            }
            callback(_this.output);
            console.log(fileName + " is compiled.");
            return _this.output;
        };
        this.parseHot = function (fileName, callback) {
            if (callback === void 0) { callback = function (result) { }; }
            console.log(fileName + " is hot compiling.");
            var fileNames = Array.isArray(fileName) ? fileName : [fileName];
            var _loop_1 = function (fileName_2) {
                fs.watchFile(fileName_2, function (curr, prev) {
                    console.log(fileName_2 + " is hot compiling.");
                    _this.parse(fileName_2, callback);
                });
            };
            for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
                var fileName_2 = fileNames_1[_i];
                _loop_1(fileName_2);
            }
            return _this.parse(fileName, callback);
        };
        this.visit = function (node) {
            _this.currNode = node;
            var symbol = null;
            switch (node.kind) {
                case ts.SyntaxKind.SourceFile: {
                    var declaration = node;
                    _this.output.fileName = declaration.fileName;
                    symbol = node.symbol;
                    break;
                }
                case ts.SyntaxKind.ClassDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    if (declaration.heritageClauses) {
                        var extendsNames_1 = [];
                        declaration.heritageClauses.forEach(function (heritageClause) {
                            heritageClause.types.forEach(function (type) {
                                var extendsSymbol = _this.checker.getSymbolAtLocation(type.expression);
                                extendsNames_1.push(_this.serializeSymbol(extendsSymbol, false).name);
                            });
                        });
                        _this.getResultCallback = function (result) {
                            result["extends"] = extendsNames_1;
                        };
                    }
                    break;
                }
                case ts.SyntaxKind.InterfaceDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    if (declaration.heritageClauses) {
                        var extendsNames_2 = [];
                        declaration.heritageClauses.forEach(function (heritageClause) {
                            heritageClause.types.forEach(function (type) {
                                var extendsSymbol = _this.checker.getSymbolAtLocation(type.expression);
                                extendsNames_2.push(_this.serializeSymbol(extendsSymbol, false).name);
                            });
                        });
                        _this.getResultCallback = function (result) {
                            result["extends"] = extendsNames_2;
                        };
                    }
                    break;
                }
                case ts.SyntaxKind.FunctionDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    break;
                }
                case ts.SyntaxKind.MethodDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    break;
                }
                case ts.SyntaxKind.PropertyDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    break;
                }
                case ts.SyntaxKind.EnumDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    break;
                }
                case ts.SyntaxKind.ImportDeclaration: {
                    break;
                }
                case ts.SyntaxKind.VariableDeclaration: {
                    var declaration = node;
                    symbol = _this.checker.getSymbolAtLocation(declaration.name);
                    break;
                }
                case ts.SyntaxKind.VariableStatement: {
                    var statement = node;
                    statement.declarationList.declarations.map(function (declaration, index) {
                        if (declaration) {
                            var docEntry = {};
                            symbol = _this.checker.getSymbolAtLocation(declaration.name);
                            var documentation = ts.displayPartsToString(symbol.getDocumentationComment());
                            docEntry.documentation = documentation || void 0;
                            docEntry.name = symbol.getName();
                            docEntry.type = _this.checker.typeToString(_this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
                            if (declaration.initializer) {
                                docEntry.initializerText = declaration.initializer.getFullText();
                            }
                            if (!_this.output.members)
                                _this.output.members = [];
                            _this.output.members.push(docEntry);
                        }
                    });
                    break;
                }
                case ts.SyntaxKind.ExportAssignment: {
                    var exportAssignment = node;
                    break;
                }
                case ts.SyntaxKind.EndOfFileToken: {
                    var endOfFileToken = node;
                    break;
                }
                default: {
                    console.log("Missing parse kind: " + node.kind);
                    break;
                }
            }
            if (node.kind === ts.SyntaxKind.SourceFile) {
                var result = _this.serializeSymbol(symbol);
                Object.assign(_this.output, result);
            }
            else {
                var result = _this.serializeSymbol(symbol);
                if (_this.getResultCallback) {
                    _this.getResultCallback(result);
                    _this.getResultCallback = void 0;
                }
                if (result) {
                    _this.output.members = (_this.output.members || []).concat([result]);
                }
            }
        };
        this.serializeSymbol = function (symbol, getAllAst) {
            if (getAllAst === void 0) { getAllAst = true; }
            if (!symbol || typeof symbol !== "object")
                return;
            var customType = {
                "8388608": "React",
                "16777220": "prototype"
            };
            var name = symbol.flags !== ts.SymbolFlags.Interface ? symbol.getName() : symbol.name;
            var isRequired;
            var isSourceFile = symbol.flags === 512;
            var documentation = ts.displayPartsToString(symbol.getDocumentationComment()) || void 0;
            // console.log(name, symbol.flags);
            var newSymbol = symbol;
            var parentSymbol = newSymbol.parent;
            if (parentSymbol && parentSymbol.flags === ts.SymbolFlags.Interface) {
                var valueDeclaration = symbol.valueDeclaration;
                isRequired = valueDeclaration ? !valueDeclaration.questionToken : false;
            }
            var extendsDocEntry = "declarations" in newSymbol ? newSymbol.declarations.map(function (declaration) { return ("expression" in declaration && declaration.expression.text); }).filter(function (extendsName) { return extendsName; }) : void 0;
            if (Array.isArray(extendsDocEntry) && extendsDocEntry.length === 0) {
                extendsDocEntry = void 0;
            }
            if (symbol.flags === 4) {
                var newSymbol_1 = symbol;
                for (var _i = 0, _a = newSymbol_1.declarations; _i < _a.length; _i++) {
                    var declaration = _a[_i];
                    var docEntry = {};
                    var variableSymbol = _this.checker.getSymbolAtLocation(declaration.name);
                    docEntry.name = variableSymbol.getName();
                    if (declaration.initializer) {
                        docEntry.initializerText = declaration.initializer.getFullText();
                    }
                    docEntry.documentation = documentation;
                    docEntry.type = _this.checker.typeToString(_this.checker.getTypeOfSymbolAtLocation(variableSymbol, variableSymbol.valueDeclaration));
                    return docEntry;
                }
            }
            if (!getAllAst) {
                return {
                    name: name,
                    documentation: documentation,
                    "extends": extendsDocEntry
                };
            }
            var exportsDocEntry;
            if ("exports" in symbol && symbol.exports.size) {
                exportsDocEntry = [];
                var values = symbol.exports.values();
                for (var i = 0; i < symbol.exports.size; i++) {
                    var result = values.next();
                    exportsDocEntry.push(_this.serializeSymbol(result.value, isSourceFile ? false : true));
                }
            }
            var membersDocEntry;
            if ("members" in symbol && symbol.members.size && symbol.flags !== 512 && name !== "HTMLAttributes") {
                membersDocEntry = [];
                var values = symbol.members.values();
                for (var i = 0; i < symbol.members.size; i++) {
                    var result = values.next();
                    membersDocEntry.push(_this.serializeSymbol(result.value, isSourceFile ? false : true));
                }
            }
            if (symbol.flags === ts.SymbolFlags.Interface || symbol.flags === ts.SymbolFlags.Class) {
                return {
                    name: name,
                    exports: exportsDocEntry,
                    members: membersDocEntry,
                    documentation: documentation,
                    "extends": extendsDocEntry
                };
            }
            var type;
            try {
                type = customType[symbol.flags];
                if (!type) {
                    type = _this.checker.typeToString(_this.checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));
                }
            }
            catch (err) { }
            type = type || "any";
            return {
                name: name,
                exports: exportsDocEntry,
                members: membersDocEntry,
                documentation: documentation,
                isRequired: isRequired,
                type: type,
                "extends": extendsDocEntry
            };
        };
        this.serializeSignature = function (signature) { return ({
            parameters: signature.parameters.map(function (symbol) { return _this.serializeSymbol(symbol); }),
            returnType: _this.checker.typeToString(signature.getReturnType()),
            documentation: ts.displayPartsToString(signature.getDocumentationComment()) || void 0
        }); };
        this.serializeSourceFile = function (symbol) {
            var details = _this.serializeSymbol(symbol);
            return details;
        };
        this.symbolFlags = {
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
        var defaultOptions = {
            target: ts.ScriptTarget.ES5,
            maxNodeModuleJsDepth: 4,
            module: ts.ModuleKind.CommonJS
        };
        this.options = options || defaultOptions;
    }
    return Parser;
}());
exports.Parser = Parser;
