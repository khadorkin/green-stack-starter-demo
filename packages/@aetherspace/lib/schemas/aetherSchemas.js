"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ats = exports.aetherCollection = exports.aetherArray = exports.aetherObject = exports.aetherSchema = exports.aetherEnum = exports.aetherDate = exports.aetherBoolean = exports.aetherNumber = exports.aetherString = exports.aetherID = void 0;
var ss = __importStar(require("superstruct"));
var assignDescriptors = function (schema, aetherType, schemaName) {
    return Object.assign(schema, __assign({ docs: function (example, description) { return Object.assign(schema, { example: example, description: description }); }, default: function (defaultVal, example, description) { return Object.assign(schema, __assign(__assign({ default: defaultVal }, (example ? { example: example } : null)), (description ? { description: description } : null))); }, aetherType: aetherType }, (schemaName ? { schemaName: schemaName } : null)));
};
var makeOptionalable = function (schema, aetherType, schemaName) {
    return Object.assign(schema, {
        nullable: function () {
            var newSchema = Object.assign(ss.nullable(schema), { nullable: true });
            return assignDescriptors(newSchema, aetherType, schemaName);
        },
        optional: function (nullable) {
            var newSchema = Object.assign(ss.optional(schema), { optional: true });
            if (!nullable)
                return assignDescriptors(newSchema, aetherType, schemaName);
            return assignDescriptors(Object.assign(ss.nullable(newSchema), { nullable: true }), aetherType, schemaName);
        },
    });
};
var aetherWrapper = function (struct, aetherType) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var schema = assignDescriptors(struct.apply(void 0, args), aetherType);
        return makeOptionalable(schema, aetherType);
    };
};
exports.aetherID = aetherWrapper(ss.string, 'AetherID');
exports.aetherString = aetherWrapper(ss.string, 'AetherString');
exports.aetherNumber = aetherWrapper(ss.number, 'AetherNumber');
exports.aetherBoolean = aetherWrapper(ss.boolean, 'AetherBoolean');
exports.aetherDate = aetherWrapper(ss.date, 'AetherDate');
var aetherEnum = function (values) {
    var schema = assignDescriptors(ss.enums(values), 'AetherEnum');
    return makeOptionalable(schema, 'AetherEnum');
};
exports.aetherEnum = aetherEnum;
var aetherSchema = function (schemaName, objSchema) {
    var aetherSchema = assignDescriptors(ss.object(objSchema), 'aetherSchema', schemaName);
    return makeOptionalable(aetherSchema, 'AetherSchema', schemaName);
};
exports.aetherSchema = aetherSchema;
var aetherObject = function (objSchema) { return exports.aetherSchema('', objSchema); };
exports.aetherObject = aetherObject;
var aetherArray = function (Element) {
    var arraySchema = assignDescriptors(ss.array(Element), 'AetherArray');
    return makeOptionalable(arraySchema, 'AetherSchema');
};
exports.aetherArray = aetherArray;
var aetherCollection = function (objSchema) {
    var entrySchema = exports.aetherObject(objSchema);
    return exports.aetherArray(entrySchema);
};
exports.aetherCollection = aetherCollection;
exports.ats = {
    id: exports.aetherID,
    string: exports.aetherString,
    number: exports.aetherNumber,
    boolean: exports.aetherBoolean,
    date: exports.aetherDate,
    enum: exports.aetherEnum,
    schema: exports.aetherSchema,
    object: exports.aetherObject,
    array: exports.aetherArray,
    collection: exports.aetherCollection,
    // -- SuperStruct Validators --
    is: ss.is,
    validate: ss.validate,
    assert: ss.assert,
};
exports.default = exports.ats;
