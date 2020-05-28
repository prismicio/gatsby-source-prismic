'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fsExtra = require('fs-extra');
var path = _interopDefault(require('path'));
var md5 = _interopDefault(require('md5'));
var superstruct = require('superstruct');
var pascalcase = _interopDefault(require('pascalcase'));
var prismicJavascript = require('prismic-javascript');
var pick = _interopDefault(require('lodash.pick'));
var omit = _interopDefault(require('lodash.omit'));
var prismicDom = require('prismic-dom');
var gatsbySourceFilesystem = require('gatsby-source-filesystem');
var tsImgix = require('ts-imgix');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

const baseSchema = {
    repositoryName: 'string',
    accessToken: 'string?',
    releaseID: 'string?',
    linkResolver: 'function?',
    htmlSerializer: 'function?',
    fetchLinks: superstruct.struct.optional(['string']),
    lang: 'string?',
    typePathsFilenamePrefix: 'string?',
};
const baseDefaults = {
    linkResolver: () => () => () => { },
    htmlSerializer: () => () => () => { },
    fetchLinks: [],
    lang: '*',
    typePathsFilenamePrefix: 'prismic-typepaths---',
};
const PluginOptionsValidator = superstruct.struct(Object.assign(Object.assign({}, baseSchema), { schemas: superstruct.struct.record(['string', 'object']), shouldDownloadImage: 'function?', plugins: superstruct.struct.size([0, 0]) }), Object.assign(Object.assign({}, baseDefaults), { shouldDownloadImage: () => () => false, plugins: [] }));
const BrowserOptionsValidator = superstruct.struct(Object.assign(Object.assign({}, baseSchema), { pathResolver: 'function?', schemasDigest: 'string' }), baseDefaults);
const validatePluginOptions = (pluginOptions) => PluginOptionsValidator(pluginOptions);

var name = "gatsby-source-prismic";

/**
 * Returns a namespaced string intended for logging.
 *
 * @param message Message to namespace.
 *
 * @returns Namespaced message.
 */
const msg = (message) => `${name} - ${message}`;
/**
 * Maps values of an object to new values.
 *
 * @param fn Function that maps a value and key to a new value.
 * @param obj Object to map to a new object.
 *
 * @returns New object with mapped values.
 */
const mapObjVals = (fn, obj) => {
    const result = {};
    for (const key in obj)
        result[key] = fn(obj[key], key);
    return result;
};
/**
 * Maps values of an object to new values.
 *
 * @param fn Function that maps a value and key to a new value.
 * @param obj Object to map to a new object.
 *
 * @returns New object with mapped values.
 */
const mapObjValsP = (fn, obj) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {};
    const keys = Object.keys(obj);
    yield Promise.all(keys.map((key) => __awaiter(void 0, void 0, void 0, function* () {
        result[key] = yield fn(obj[key], key);
    })));
    return result;
});
/**
 * Returns true if the provided object has no keys, false otherwise.
 *
 * @param obj Object to check.
 *
 * @returns `true` if `obj` has no keys, `false` otherwise.
 */
const isEmptyObj = (obj) => {
    for (const _ in obj)
        return false;
    return true;
};
/**
 * Returns a valid GraphQL type name for a Prismic schema.
 *
 * @param apiId API ID of the schema.
 *
 * @returns Type name for the schema.
 */
const buildSchemaTypeName = (apiId) => pascalcase(`Prismic ${apiId}`);

var LinkFieldType;
(function (LinkFieldType) {
    LinkFieldType["Any"] = "Any";
    LinkFieldType["Document"] = "Document";
    LinkFieldType["Media"] = "Media";
    LinkFieldType["Web"] = "Web";
})(LinkFieldType || (LinkFieldType = {}));
var FieldType;
(function (FieldType) {
    FieldType["Boolean"] = "Boolean";
    FieldType["Color"] = "Color";
    FieldType["Date"] = "Date";
    FieldType["Embed"] = "Embed";
    FieldType["GeoPoint"] = "GeoPoint";
    FieldType["Group"] = "Group";
    FieldType["Image"] = "Image";
    FieldType["Link"] = "Link";
    FieldType["Number"] = "Number";
    FieldType["Select"] = "Select";
    FieldType["Slice"] = "Slice";
    FieldType["Slices"] = "Slices";
    FieldType["StructuredText"] = "StructuredText";
    FieldType["Text"] = "Text";
    FieldType["Timestamp"] = "Timestamp";
    FieldType["UID"] = "UID";
    // Internal plugin-specific field not defined in the in Prismic schema.
    FieldType["AlternateLanguages"] = "AlternateLanguages";
})(FieldType || (FieldType = {}));
var GraphQLType;
(function (GraphQLType) {
    GraphQLType["ID"] = "ID";
    GraphQLType["Boolean"] = "Boolean";
    GraphQLType["String"] = "String";
    GraphQLType["Float"] = "Float";
    GraphQLType["Date"] = "Date";
    GraphQLType["JSON"] = "JSON";
    GraphQLType["Link"] = "PrismicLinkType";
    GraphQLType["Image"] = "PrismicImageType";
    GraphQLType["ImageThumbnail"] = "PrismicImageThumbnailType";
    GraphQLType["ImageThumbnails"] = "PrismicImageThumbnailsType";
    GraphQLType["Embed"] = "PrismicEmbedType";
    GraphQLType["GeoPoint"] = "PrismicGeoPointType";
    GraphQLType["StructuredText"] = "PrismicStructuredTextType";
    GraphQLType["AllDocumentTypes"] = "PrismicAllDocumentTypes";
    GraphQLType["Group"] = "Group";
    GraphQLType["Slices"] = "Slices";
    GraphQLType["AlternateLanguages"] = "AlternateLanguages";
})(GraphQLType || (GraphQLType = {}));
var SliceChoiceDisplay;
(function (SliceChoiceDisplay) {
    SliceChoiceDisplay["List"] = "list";
    SliceChoiceDisplay["Grid"] = "grid";
})(SliceChoiceDisplay || (SliceChoiceDisplay = {}));

const fieldToType = (apiId, field, path, context) => {
    var _a, _b;
    const { customTypeApiId, enqueueTypeDef, enqueueTypePath, gatsbyContext, sliceZoneId, } = context;
    const { schema: gatsbySchema, reporter } = gatsbyContext;
    // Casting to `FieldType | string` since we may come across an unsupported
    // field type. This will happen when Prismic introduces new field types.
    switch (field.type) {
        case FieldType.UID:
        case FieldType.Color:
        case FieldType.Select:
        case FieldType.Text: {
            const type = GraphQLType.String;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Boolean: {
            const type = GraphQLType.Boolean;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.StructuredText: {
            const type = GraphQLType.StructuredText;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Number: {
            const type = GraphQLType.Float;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Date:
        case FieldType.Timestamp: {
            const type = GraphQLType.Date;
            enqueueTypePath([...path, apiId], type);
            return { type, extensions: { dateformat: {} } };
        }
        case FieldType.GeoPoint: {
            const type = GraphQLType.GeoPoint;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Embed: {
            const type = GraphQLType.Embed;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Image: {
            const type = GraphQLType.Image;
            enqueueTypePath([...path, apiId], type);
            const thumbnails = (_b = (_a = field) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.thumbnails;
            if (thumbnails)
                for (const thumbnail of thumbnails)
                    enqueueTypePath([...path, apiId, 'thumbnails', thumbnail.name], GraphQLType.ImageThumbnail);
            return type;
        }
        case FieldType.Link: {
            const type = GraphQLType.Link;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Group: {
            const groupTypeName = pascalcase(`Prismic ${customTypeApiId} ${apiId} GroupType`);
            enqueueTypeDef(gatsbySchema.buildObjectType({
                name: groupTypeName,
                fields: mapObjVals((subfield, subfieldApiId) => fieldToType(subfieldApiId, subfield, [...path, apiId], context), field.config.fields),
                extensions: { infer: false },
            }));
            const type = `[${groupTypeName}]`;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        case FieldType.Slices: {
            const slicesTypeName = pascalcase(`Prismic ${customTypeApiId} ${apiId} SlicesType`);
            const sliceChoices = field.config.choices;
            const sliceChoiceTypes = Object.entries(sliceChoices).map(([sliceChoiceApiId, sliceChoice]) => fieldToType(sliceChoiceApiId, sliceChoice, [...path, apiId], Object.assign(Object.assign({}, context), { sliceZoneId: apiId })));
            enqueueTypeDef(gatsbySchema.buildUnionType({
                name: slicesTypeName,
                types: sliceChoiceTypes,
            }));
            const type = `[${slicesTypeName}]`;
            enqueueTypePath([...path, apiId], type);
            return {
                type,
                resolve: (parent, _args, context, info) => context.nodeModel.getNodesByIds({ ids: parent[info.path.key] }),
            };
        }
        case FieldType.Slice: {
            const { 'non-repeat': primaryFields, repeat: itemsFields, } = field;
            const sliceFieldTypes = {
                slice_type: `${GraphQLType.String}!`,
                slice_label: GraphQLType.String,
            };
            if (primaryFields && !isEmptyObj(primaryFields)) {
                const primaryTypeName = pascalcase(`Prismic ${customTypeApiId} ${sliceZoneId} ${apiId} PrimaryType`);
                enqueueTypeDef(gatsbySchema.buildObjectType({
                    name: primaryTypeName,
                    fields: mapObjVals((primaryField, primaryFieldApiId) => fieldToType(primaryFieldApiId, primaryField, [...path, apiId, 'primary'], context), primaryFields),
                }));
                enqueueTypePath([...path, apiId, 'primary'], primaryTypeName);
                sliceFieldTypes.primary = primaryTypeName;
            }
            if (itemsFields && !isEmptyObj(itemsFields)) {
                const itemTypeName = pascalcase(`Prismic ${customTypeApiId} ${sliceZoneId} ${apiId} ItemType`);
                enqueueTypeDef(gatsbySchema.buildObjectType({
                    name: itemTypeName,
                    fields: mapObjVals((itemField, itemFieldApiId) => fieldToType(itemFieldApiId, itemField, [...path, apiId, 'items'], context), itemsFields),
                }));
                const type = `[${itemTypeName}]`;
                enqueueTypePath([...path, apiId, 'items'], type);
                sliceFieldTypes.items = type;
            }
            const type = pascalcase(`Prismic ${customTypeApiId} ${sliceZoneId} ${apiId}`);
            enqueueTypeDef(gatsbySchema.buildObjectType({
                name: type,
                fields: sliceFieldTypes,
                interfaces: ['PrismicSliceType', 'Node'],
                extensions: { infer: false },
            }));
            enqueueTypePath([...path, apiId], type);
            return type;
        }
        // Internal plugin-specific field not defined in the Prismic schema.
        case FieldType.AlternateLanguages: {
            // The types are intentionally different here. We need to handle
            // AlternateLanguages in a unique way in `documentToNodes.js`.
            enqueueTypePath([...path, apiId], FieldType.AlternateLanguages);
            return `[${GraphQLType.Link}!]!`;
        }
        default: {
            const fieldPath = [...path, apiId].join('.');
            reporter.warn(msg(`Unsupported field type "${field.type}" detected for field "${fieldPath}". JSON type will be used.`));
            const type = GraphQLType.JSON;
            enqueueTypePath([...path, apiId], type);
            return type;
        }
    }
};
const schemaToTypeDefs = (apiId, schema, context) => {
    const { enqueueTypeDef, enqueueTypePath, gatsbyContext } = context;
    const { schema: gatsbySchema } = gatsbyContext;
    // UID fields are defined at the same level as data fields, but are a level
    // above data in API responses. Pulling it out separately here allows us to
    // process the UID field differently than the data fields.
    const _a = Object.values(schema).reduce((acc, tab) => {
        for (const fieldApiId in tab)
            acc[fieldApiId] = tab[fieldApiId];
        return acc;
    }, {}), { uid: uidField } = _a, dataFields = __rest(_a, ["uid"]);
    // UID fields must be conditionally processed since not all custom types
    // implement a UID field.
    let uidFieldType;
    if (uidField)
        uidFieldType = fieldToType('uid', uidField, [apiId], context);
    // The alternate languages field acts as a list of Link fields. Note:
    // AlternateLanguages is an internal plugin-specific type, not from Prismic.
    const alternateLanguagesFieldType = fieldToType('alternate_languages', { type: FieldType.AlternateLanguages }, [apiId], context);
    // Create a type for all data fields.
    const dataTypeName = pascalcase(`Prismic ${apiId} DataType`);
    enqueueTypePath([apiId, 'data'], dataTypeName);
    enqueueTypeDef(gatsbySchema.buildObjectType({
        name: dataTypeName,
        fields: mapObjVals((dataField, dataFieldApiId) => fieldToType(dataFieldApiId, dataField, [apiId, 'data'], context), dataFields),
        extensions: { infer: false },
    }));
    // Create the main schema type.
    const schemaTypeName = buildSchemaTypeName(apiId);
    const schemaFieldTypes = {
        data: dataTypeName,
        dataRaw: `${GraphQLType.JSON}!`,
        dataString: `${GraphQLType.String}!`,
        first_publication_date: {
            type: `${GraphQLType.Date}!`,
            extensions: { dateformat: {} },
        },
        href: `${GraphQLType.String}!`,
        url: GraphQLType.String,
        lang: `${GraphQLType.String}!`,
        last_publication_date: {
            type: `${GraphQLType.Date}!`,
            extensions: { dateformat: {} },
        },
        tags: `[${GraphQLType.String}!]!`,
        alternate_languages: alternateLanguagesFieldType,
        type: `${GraphQLType.String}!`,
        prismicId: `${GraphQLType.ID}!`,
    };
    if (uidFieldType)
        schemaFieldTypes.uid = uidFieldType;
    enqueueTypePath([apiId], schemaTypeName);
    enqueueTypeDef(gatsbySchema.buildObjectType({
        name: schemaTypeName,
        fields: schemaFieldTypes,
        interfaces: ['PrismicDocument', 'Node'],
        extensions: { infer: false },
    }));
};
/**
 * Returns an GraphQL type containing all image thumbnail field names. If no thumbnails are configured, a placeholder type is returned.
 *
 * @param typePaths Array of TypePaths for all schemas.
 * @param gatsbySchema Gatsby node schema.
 *
 * @returns GraphQL type to support image thumbnail fields.
 */
const buildImageThumbnailsType = (typePaths, gatsbySchema) => {
    const keys = typePaths
        .filter(typePath => typePath.type === GraphQLType.ImageThumbnail)
        .map(typePath => typePath.path[typePath.path.length - 1]);
    if (keys.length < 1)
        return gatsbySchema.buildScalarType({
            name: GraphQLType.ImageThumbnails,
            serialize: () => null,
        });
    const fieldTypes = keys.reduce((acc, key) => {
        acc[key] = GraphQLType.ImageThumbnail;
        return acc;
    }, {});
    return gatsbySchema.buildObjectType({
        name: GraphQLType.ImageThumbnails,
        fields: fieldTypes,
    });
};
/**
 * Converts an object mapping custom type API IDs to JSON schemas to an array
 * of GraphQL type definitions. The result is intended to be called with
 * Gatsby's `createTypes` action.
 *
 * @param schemas An object mapping custom type API IDs to JSON schemas.
 *
 * @returns An array of GraphQL type definitions.
 */
const schemasToTypeDefs = (schemas, gatsbyContext) => {
    const { schema: gatsbySchema } = gatsbyContext;
    const typeDefs = [];
    const enqueueTypeDef = typeDef => void typeDefs.push(typeDef);
    const typePaths = [];
    const enqueueTypePath = (path, type) => void typePaths.push({ path, type });
    const context = { gatsbyContext, enqueueTypeDef, enqueueTypePath };
    for (const apiId in schemas)
        schemaToTypeDefs(apiId, schemas[apiId], Object.assign(Object.assign({}, context), { customTypeApiId: apiId }));
    // Union type for all schemas.
    enqueueTypeDef(gatsbySchema.buildUnionType({
        name: GraphQLType.AllDocumentTypes,
        types: Object.keys(schemas).map(apiId => buildSchemaTypeName(apiId)),
    }));
    // Type for all image thumbnail fields.
    enqueueTypeDef(buildImageThumbnailsType(typePaths, gatsbySchema));
    return { typeDefs, typePaths };
};

const IMAGE_FIELD_KEYS = [
    'alt',
    'copyright',
    'dimensions',
    'url',
];
const API_PAGE_SIZE = 100;

const createClient = (repositoryName, accessToken) => __awaiter(void 0, void 0, void 0, function* () { return yield prismicJavascript.getApi(`https://${repositoryName}.prismic.io/api/v2`, { accessToken }); });
const pagedGet = (client, queryOptions, page, pageSize, documents, reporter) => __awaiter(void 0, void 0, void 0, function* () {
    reporter.verbose(msg(`fetching documents page ${page}`));
    const response = yield client.query([], Object.assign(Object.assign({}, queryOptions), { page, pageSize }));
    for (const doc of response.results)
        documents.push(doc);
    if (page * pageSize < response.total_results_size)
        return yield pagedGet(client, queryOptions, page + 1, pageSize, documents, reporter);
    return documents;
});
const fetchAllDocuments = (pluginOptions, gatsbyContext) => __awaiter(void 0, void 0, void 0, function* () {
    const { repositoryName, releaseID, accessToken, fetchLinks, lang } = pluginOptions;
    const { reporter } = gatsbyContext;
    const client = yield createClient(repositoryName, accessToken);
    const queryOptions = {};
    if (releaseID) {
        const ref = client.refs.find(r => r.id === releaseID);
        if (ref) {
            queryOptions.ref = ref.ref;
        }
        else {
            console.warn(`The release ${releaseID} was not found`);
        }
    }
    if (fetchLinks)
        queryOptions.fetchLinks = fetchLinks;
    if (lang)
        queryOptions.lang = lang;
    return yield pagedGet(client, queryOptions, 1, API_PAGE_SIZE, [], reporter);
});

const getTypeForPath = (path, typePaths) => {
    const stringifiedPath = JSON.stringify(path);
    const def = typePaths.find(x => JSON.stringify(x.path) === stringifiedPath);
    if (!def)
        return;
    if (/^\[.*GroupType\]$/.test(def.type))
        return GraphQLType.Group;
    if (/^\[.*SlicesType\]$/.test(def.type))
        return GraphQLType.Slices;
    return def.type;
};
const normalizeField = (apiId, field, path, doc, env) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNodeId, createNode, createContentDigest, typePaths, normalizeStructuredTextField, normalizeLinkField, normalizeImageField, normalizeSlicesField, } = env;
    const type = getTypeForPath([...path, apiId], typePaths);
    switch (type) {
        case GraphQLType.Image: {
            const baseObj = pick(field, IMAGE_FIELD_KEYS);
            const thumbsObj = omit(field, IMAGE_FIELD_KEYS);
            const base = yield normalizeImageField(apiId, baseObj, path, doc, env);
            const thumbs = yield mapObjValsP((thumb) => __awaiter(void 0, void 0, void 0, function* () { return yield normalizeImageField(apiId, thumb, path, doc, env); }), thumbsObj);
            return Object.assign(Object.assign({}, base), { thumbnails: thumbs });
        }
        case GraphQLType.StructuredText: {
            return yield normalizeStructuredTextField(apiId, field, path, doc, env);
        }
        case GraphQLType.Link: {
            return yield normalizeLinkField(apiId, field, path, doc, env);
        }
        case GraphQLType.Group: {
            return yield normalizeObjs(field, [...path, apiId], doc, env);
        }
        case GraphQLType.Slices: {
            const sliceNodeIds = yield Promise.all(field.map((slice, index) => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                const sliceNodeId = createNodeId(`${doc.type} ${doc.id} ${apiId} ${index}`);
                const normalizedPrimary = yield normalizeObj(slice.primary, [...path, apiId, slice.slice_type, 'primary'], doc, env);
                const normalizedItems = yield normalizeObjs(slice.items, [...path, apiId, slice.slice_type, 'items'], doc, env);
                const node = {
                    id: sliceNodeId,
                    slice_type: slice.slice_type,
                    slice_label: (_a = slice.slice_label) !== null && _a !== void 0 ? _a : undefined,
                    primary: normalizedPrimary,
                    items: normalizedItems,
                    internal: {
                        type: pascalcase(`Prismic ${doc.type} ${apiId} ${slice.slice_type}`),
                        contentDigest: createContentDigest(slice),
                    },
                };
                createNode(node);
                return node.id;
            })));
            return yield normalizeSlicesField(apiId, sliceNodeIds, [...path, apiId], doc, env);
        }
        // This field type is not an actual Prismic type and was assigned manually
        // in `schemasToTypeDefs.ts`.
        case GraphQLType.AlternateLanguages: {
            // Treat the array of alternate language documents as a list of link
            // fields. We need to force the link type to a Document since it is not
            // there by default.
            return yield Promise.all(field.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                return yield normalizeLinkField(apiId, Object.assign(Object.assign({}, item), { link_type: LinkFieldType.Document }), path, doc, env);
            })));
        }
        default: {
            return field;
        }
    }
});
const normalizeObj = (obj = {}, path, doc, env) => mapObjValsP((field, fieldApiId) => normalizeField(fieldApiId, field, path, doc, env), obj);
const normalizeObjs = (objs = [], path, doc, env) => Promise.all(objs.map(obj => normalizeObj(obj, path, doc, env)));
const documentToNodes = (doc, env) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNode, createContentDigest, createNodeId, pluginOptions } = env;
    const { linkResolver } = pluginOptions;
    let linkResolverForDoc = undefined;
    if (linkResolver)
        linkResolverForDoc = linkResolver({ node: doc });
    const docNodeId = createNodeId(`${doc.type} ${doc.id}`);
    const docUrl = linkResolverForDoc === null || linkResolverForDoc === void 0 ? void 0 : linkResolverForDoc(doc);
    const normalizedData = yield normalizeObj(doc.data, [doc.type, 'data'], doc, env);
    const normalizedAlernativeLanguages = (yield normalizeField('alternate_languages', doc.alternate_languages, [doc.type], doc, env));
    const node = Object.assign(Object.assign({}, doc), { id: docNodeId, prismicId: doc.id, data: normalizedData, dataString: JSON.stringify(doc.data), dataRaw: doc.data, alternate_languages: normalizedAlernativeLanguages, url: docUrl, internal: {
            type: buildSchemaTypeName(doc.type),
            contentDigest: createContentDigest(doc),
        } });
    createNode(node);
    return node.id;
});
const documentsToNodes = (docs, env) => __awaiter(void 0, void 0, void 0, function* () { return yield Promise.all(docs.map(doc => documentToNodes(doc, env))); });

const normalizeImageField = (apiId, field, _path, doc, env) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNode, createNodeId, pluginOptions, context } = env;
    const { gatsbyContext } = context;
    const { store, cache, actions, reporter } = gatsbyContext;
    const { touchNode } = actions;
    let { shouldDownloadImage } = pluginOptions;
    let shouldAttemptToCreateRemoteFileNode = true;
    if (shouldDownloadImage)
        shouldAttemptToCreateRemoteFileNode = yield shouldDownloadImage({
            key: apiId,
            value: field,
            node: doc,
        });
    if (!shouldAttemptToCreateRemoteFileNode || !field.url)
        return field;
    let fileNodeID = undefined;
    const cachedImageDataKey = `prismic-image-${field.url}`;
    const cachedImageData = yield cache.get(cachedImageDataKey);
    if (cachedImageData) {
        fileNodeID = cachedImageData.fileNodeID;
        touchNode({ nodeId: fileNodeID });
    }
    else {
        try {
            const fileNode = yield gatsbySourceFilesystem.createRemoteFileNode({
                url: field.url,
                store,
                cache,
                createNode,
                createNodeId,
                reporter,
            });
            if (fileNode) {
                fileNodeID = fileNode.id;
                yield cache.set(cachedImageDataKey, { fileNodeID });
            }
        }
        catch (error) {
            reporter.error(msg(`failed to create image node with URL: ${field.url}`), new Error(error));
        }
    }
    return Object.assign(Object.assign({}, field), { localFile: fileNodeID });
});
const normalizeLinkField = (apiId, field, _path, doc, env) => {
    const { createNodeId, pluginOptions } = env;
    const { linkResolver } = pluginOptions;
    let linkResolverForField = undefined;
    if (linkResolver)
        linkResolverForField = linkResolver({
            key: apiId,
            value: field,
            node: doc,
        });
    let linkedDocId = undefined;
    if (field.link_type === LinkFieldType.Document)
        linkedDocId = createNodeId(`${field.type} ${field.id}`);
    return Object.assign(Object.assign({}, field), { url: prismicDom.Link.url(field, linkResolverForField), document: linkedDocId, raw: field });
};
const normalizeSlicesField = (_apiId, field, _path, _doc, _env) => field;
const normalizeStructuredTextField = (apiId, field, _path, doc, env) => {
    const { pluginOptions } = env;
    const { linkResolver, htmlSerializer } = pluginOptions;
    let linkResolverForField = undefined;
    if (linkResolver)
        linkResolverForField = linkResolver({
            key: apiId,
            value: field,
            node: doc,
        });
    let htmlSerializerForField = undefined;
    if (htmlSerializer)
        htmlSerializerForField = htmlSerializer({
            key: apiId,
            value: field,
            node: doc,
        });
    return {
        html: prismicDom.RichText.asHtml(field, linkResolverForField, htmlSerializerForField),
        text: prismicDom.RichText.asText(field),
        raw: field,
    };
};
const createEnvironment = (pluginOptions, gatsbyContext, typePaths) => {
    const { actions, createNodeId, createContentDigest } = gatsbyContext;
    const { createNode } = actions;
    return {
        createNode,
        createNodeId: (input) => createNodeId(input),
        createContentDigest,
        normalizeImageField,
        normalizeLinkField,
        normalizeSlicesField,
        normalizeStructuredTextField,
        typePaths,
        pluginOptions,
        context: { gatsbyContext },
    };
};

// Default width for `fixed` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FIXED_WIDTH = 400;
// Default resolutions for `fixed` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FIXED_RESOLUTIONS = [1, 1.5, 2];
// Default maxWidth for `fluid` images. Same as `gatsby-plugin-sharp`.
const DEFAULT_FLUID_MAX_WIDTH = 800;
// Default breakpoint factors for `fluid` images. Same as
// `gatsby-plugin-sharp`.
const DEFAULT_FLUID_BREAKPOINT_FACTORS = [0.25, 0.5, 1.5, 2];
/**
 * Default params for all images.
 */
const DEFAULT_PARAMS = {
    // `max` ensures the resulting image is never larger than the source file.
    fit: tsImgix.ImgixFit.max,
    // 50 is fairly aggressive.
    q: 50,
    // Automatically apply compression and use webp when possible.
    auto: { compress: true, format: true },
};
/**
 * Default params for the placeholder image.
 */
const DEFAULT_PLACEHOLDER_PARAMS = {
    // 100 is greater than the default `gatsby-transformer-sharp` size, but it
    // improves the placeholder quality significantly.
    w: 100,
    // The image requires some blurring since it may be stretched large. This
    // softens the pixelation.
    blur: 15,
    // Since this is a low quality placeholer, we can drop down the quality.
    q: 20,
};
const extractURLParts = (url) => {
    const instance = new URL(url);
    const baseURL = instance.origin + instance.pathname;
    const urlParams = instance.searchParams;
    return { baseURL, urlParams };
};
const buildURL = (url, params) => tsImgix.buildImgixUrl(url)(Object.assign(Object.assign({}, DEFAULT_PARAMS), params));
const buildPlaceholderURL = (url, params) => buildURL(url, Object.assign(Object.assign({}, DEFAULT_PLACEHOLDER_PARAMS), params));
const buildFixedSrcSet = (baseURL, params, resolutions = DEFAULT_FIXED_RESOLUTIONS) => resolutions
    .map(resolution => {
    const url = buildURL(baseURL, Object.assign(Object.assign({}, params), { dpr: resolution }));
    return `${url} ${resolution}x`;
})
    .join(', ');
const buildFluidSrcSet = (baseURL, aspectRatio, params, breakpoints) => {
    const { w: width } = params;
    if (!breakpoints)
        breakpoints = DEFAULT_FLUID_BREAKPOINT_FACTORS.map(x => width * x);
    // Remove duplicates, sort by numerical value, and ensure maxWidth is added.
    const uniqSortedBreakpoints = [...new Set([...breakpoints, width].sort())];
    return uniqSortedBreakpoints
        .map(breakpoint => {
        if (!breakpoint)
            return;
        const url = buildURL(baseURL, Object.assign(Object.assign({}, params), { w: breakpoint, h: Math.round(breakpoint / aspectRatio) }));
        return `${url} ${Math.round(breakpoint)}w`;
    })
        .filter(Boolean)
        .join(', ');
};
const buildFixedGatsbyImage = (url, sourceWidth, sourceHeight, args = {}) => {
    var _a, _b, _c;
    const { baseURL, urlParams } = extractURLParts(url);
    const rect = (_a = urlParams.get('rect')) !== null && _a !== void 0 ? _a : undefined;
    const aspectRatio = sourceWidth / sourceHeight;
    const width = (_b = args.width) !== null && _b !== void 0 ? _b : DEFAULT_FIXED_WIDTH;
    const height = (_c = args.height) !== null && _c !== void 0 ? _c : Math.round(width / aspectRatio);
    const quality = args.quality;
    const base64 = buildPlaceholderURL(baseURL, { rect });
    const src = buildURL(baseURL, { w: width, h: height, rect, q: quality });
    const srcSet = buildFixedSrcSet(baseURL, {
        w: width,
        h: height,
        rect,
        q: quality,
    });
    return {
        base64,
        aspectRatio,
        width,
        height,
        src,
        srcWebp: src,
        srcSet,
        srcSetWebp: srcSet,
    };
};
const buildFluidGatsbyImage = (url, sourceWidth, sourceHeight, args = {}) => {
    var _a, _b, _c;
    const { baseURL, urlParams } = extractURLParts(url);
    const rect = (_a = urlParams.get('rect')) !== null && _a !== void 0 ? _a : undefined;
    const aspectRatio = sourceWidth / sourceHeight;
    const width = (_b = args.maxWidth) !== null && _b !== void 0 ? _b : DEFAULT_FLUID_MAX_WIDTH;
    const height = (_c = args.maxHeight) !== null && _c !== void 0 ? _c : Math.round(width / aspectRatio);
    const quality = args.quality;
    const breakpoints = args.srcSetBreakpoints;
    const base64 = buildPlaceholderURL(baseURL, { rect });
    const src = buildURL(baseURL, { w: width, h: height, rect, q: quality });
    const srcSet = buildFluidSrcSet(baseURL, aspectRatio, { w: width, h: height, rect, q: quality }, breakpoints);
    return {
        base64,
        aspectRatio,
        src,
        srcWebp: src,
        srcSet,
        srcSetWebp: srcSet,
        sizes: '',
    };
};
const resolveFluid = (source, args) => source.url
    ? buildFluidGatsbyImage(source.url, source.dimensions.width, source.dimensions.height, args)
    : undefined;
const resolveFixed = (source, args) => source.url
    ? buildFixedGatsbyImage(source.url, source.dimensions.width, source.dimensions.height, args)
    : undefined;
const resolvers = {
    [GraphQLType.Image]: {
        fixed: { resolve: resolveFixed },
        fluid: { resolve: resolveFluid },
    },
    [GraphQLType.ImageThumbnail]: {
        fixed: { resolve: resolveFixed },
        fluid: { resolve: resolveFluid },
    },
};

const gql = (query) => String(query).replace(`\n`, ` `);
const types = gql `
  "A text field with formatting options."
  type PrismicStructuredTextType {
    "The HTML value of the text using \`prismic-dom\` and the HTML serializer."
    html: String
    "The plain text value of the text using \`prismic-dom\`."
    text: String
    "The field's value without transformations exactly as it comes from the Prismic API."
    raw: JSON
  }

  "A field for storing geo-coordinates."
  type PrismicGeoPointType {
    "The latitude value of the geo-coordinate."
    latitude: Float
    "The longitude value of the geo-coordinate."
    longitude: Float
  }

  "Embed videos, songs, tweets, slices, etc."
  type PrismicEmbedType {
    "The ID of the resource author. Fetched via oEmbed data."
    author_id: ID
    "The name of the author/owner of the resource. Fetched via oEmbed data."
    author_name: String
    "A URL for the author/owner of the resource. Fetched via oEmbed data."
    author_url: String
    "The suggested cache lifetime for this resource, in seconds. Consumers may choose to use this value or not. Fetched via oEmbed data."
    cache_age: String
    "The URL of the resource."
    embed_url: String
    "The HTML required to display the resource. The HTML should have no padding or margins. Consumers may wish to load the HTML in an off-domain iframe to avoid XSS vulnerabilities. Fetched via oEmbed data."
    html: String
    "The name of the resource."
    name: String
    "The name of the resource provider. Fetched via oEmbed data."
    provider_name: String
    "The URL of the resource provider. Fetched via oEmbed data."
    provider_url: String
    "The width of the resource's thumbnail. Fetched via oEmbed data."
    thumbnail_height: Int
    "A URL to a thumbnail image representing the resource. Fetched via oEmbed data."
    thumbnail_url: String
    "The width of the resource's thumbnail. Fetched via oEmbed data."
    thumbnail_width: Int
    "A text title, describing the resource. Fetched via oEmbed data."
    title: String
    "The resource type. Fetched via oEmbed data."
    type: String
    "The oEmbed version number."
    version: String
    "The source URL of the resource. Fetched via oEmbed data."
    url: String
    "The width in pixel of the resource. Fetched via oEmbed data."
    width: Int
    "The height in pixel of the resource. Fetched via oEmbed data."
    height: Int
    "The ID of the resource media. Fetched via oEmbed data."
    media_id: ID
    "A description for the resource."
    description: String
  }

  "Dimensions for images."
  type PrismicImageDimensionsType {
    "Width of the image in pixels."
    width: Int!
    "Height of the image in pixels."
    height: Int!
  }

  "\`gatsby-image\`-compatible image data for \`fixed\` images."
  type PrismicImageFixedType {
    base64: String
    aspectRatio: Float
    width: Float
    height: Float
    src: String
    srcSet: String
    srcWebp: String
    srcSetWebp: String
  }

  "\`gatsby-image\`-compatible image data for \`fluid\` images."
  type PrismicImageFluidType {
    base64: String
    aspectRatio: Float
    src: String
    srcSet: String
    srcWebp: String
    srcSetWebp: String
    sizes: String
  }

  "An image thumbnail with constraints."
  type PrismicImageThumbnailType implements PrismicImageInterface {
    alt: String
    copyright: String
    dimensions: PrismicImageDimensionsType
    url: String
    localFile: File @link
    "\`gatsby-image\`-compatible image data for \`fixed\` images."
    fixed(width: Int, height: Int): PrismicImageFixedType
    "\`gatsby-image\`-compatible image data for \`fluid\` images."
    fluid(
      maxWidth: Int
      maxHeight: Int
      srcSetBreakpoints: [Int!]
    ): PrismicImageFluidType
  }

  "An image field with optional constrained thumbnails."
  type PrismicImageType implements PrismicImageInterface {
    alt: String
    copyright: String
    dimensions: PrismicImageDimensionsType
    url: String
    localFile: File @link
    "\`gatsby-image\`-compatible image data for \`fixed\` images."
    fixed(width: Int, height: Int): PrismicImageFixedType
    "\`gatsby-image\`-compatible image data for \`fluid\` images."
    fluid(
      maxWidth: Int
      maxHeight: Int
      srcSetBreakpoints: [Int!]
    ): PrismicImageFluidType
    "The image's thumbnails."
    thumbnails: PrismicImageThumbnailsType
  }

  "Types of links."
  enum PrismicLinkTypes {
    "Any of the other types"
    Any
    "Internal content"
    Document
    "Internal media content"
    Media
    "URL"
    Web
  }

  "Link to web, media, and internal content."
  type PrismicLinkType {
    "The type of link."
    link_type: PrismicLinkTypes!
    "If a Document link, \`true\` if linked document does not exist, \`false\` otherwise."
    isBroken: Boolean
    "The document's URL derived via the link resolver."
    url: String
    "The link's target."
    target: String
    "If a Media link, the size of the file."
    size: Int
    "If a Document link, the linked document's Prismic ID."
    id: ID
    "If a Document link, the linked document's Prismic custom type API ID"
    type: String
    "If a Document link, the linked document's list of tags."
    tags: [String]
    "If a Document link, the linked document's language."
    lang: String
    "If a Document link, the linked document's slug."
    slug: String
    "If a Document link, the linked document's UID."
    uid: String
    "If a Document link, the linked document."
    document: PrismicAllDocumentTypes @link
    "The field's value without transformations exactly as it comes from the Prismic API."
    raw: JSON
  }

  interface PrismicSliceType {
    "The slice type API ID."
    slice_type: String!

    "The slice label."
    slice_label: String
  }

  interface PrismicImageInterface {
    "The image's alternative text."
    alt: String
    "The image's copyright text."
    copyright: String
    "The image's dimensions."
    dimensions: PrismicImageDimensionsType
    "The image's URL on Prismic's CDN."
    url: String
    "The locally downloaded image if \`shouldNormalizeImage\` returns true."
    localFile: File
    fixed: PrismicImageFixedType
    fluid: PrismicImageFluidType
  }

  interface PrismicDocument {
    "The document's data object without transformations exactly as it comes from the Prismic API."
    dataRaw: JSON!
    "The document's data object without transformations. The object is stringified via \`JSON.stringify\` to eliminate the need to declare subfields."
    dataString: String
      @deprecated(reason: "Use \`dataRaw\` instead which returns JSON.")
    "The document's initial publication date."
    first_publication_date(
      "Format the date using Moment.js' date tokens, e.g. \`date(formatString: \\"YYYY MMMM DD\\")\`. See https://momentjs.com/docs/#/displaying/format/ for documentation for different tokens."
      formatString: String
      "Returns a string generated with Moment.js' \`fromNow\` function"
      fromNow: Boolean
      "Returns the difference between this date and the current time. Defaults to \\"milliseconds\\" but you can also pass in as the measurement \\"years\\", \\"months\\", \\"weeks\\", \\"days\\", \\"hours\\", \\"minutes\\", and \\"seconds\\"."
      difference: String
      "Configures the locale Moment.js will use to format the date."
      locale: String
    ): Date
    "The document's Prismic API URL."
    href: String
    "The document's URL derived via the link resolver."
    url: String
    "Globally unique identifier. Note that this differs from the \`prismicID\` field."
    id: ID!
    "The document's language."
    lang: String!
    "The document's most recent publication date"
    last_publication_date(
      "Format the date using Moment.js' date tokens, e.g. \`date(formatString: \\"YYYY MMMM DD\\")\`. See https://momentjs.com/docs/#/displaying/format/ for documentation for different tokens."
      formatString: String
      "Returns a string generated with Moment.js' \`fromNow\` function"
      fromNow: Boolean
      "Returns the difference between this date and the current time. Defaults to \\"milliseconds\\" but you can also pass in as the measurement \\"years\\", \\"months\\", \\"weeks\\", \\"days\\", \\"hours\\", \\"minutes\\", and \\"seconds\\"."
      difference: String
      "Configures the locale Moment.js will use to format the date."
      locale: String
    ): Date
    "The document's list of tags."
    tags: [String!]!
    "Alternate languages for the document."
    alternate_languages: [PrismicLinkType!]!
    "The document's Prismic API ID type."
    type: String!
    "The document's Prismic ID."
    prismicId: ID!
  }
`;

const sourceNodes = (gatsbyContext, pluginOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { actions, reporter, store } = gatsbyContext;
    const { createTypes } = actions;
    const { program } = store.getState();
    const createTypesActivity = reporter.activityTimer(msg('create types'));
    const fetchDocumentsActivity = reporter.activityTimer(msg('fetch documents'));
    const createNodesActivity = reporter.activityTimer(msg('create nodes'));
    const writeTypePathsActivity = reporter.activityTimer(msg('write out type paths'));
    /**
     * Validate plugin options. Set default options where necessary. If any
     * plugin options are invalid, stop immediately.
     */
    try {
        pluginOptions = validatePluginOptions(pluginOptions);
    }
    catch (error) {
        reporter.error(msg('invalid plugin options'));
        reporter.panic(error);
    }
    /**
     * Create types derived from Prismic custom type schemas.
     */
    createTypesActivity.start();
    reporter.verbose(msg('starting to create types'));
    const { typeDefs, typePaths } = schemasToTypeDefs(pluginOptions.schemas, gatsbyContext);
    createTypes(typeDefs);
    createTypes(types);
    createTypesActivity.end();
    /**
     * Fetch documents from Prismic.
     */
    fetchDocumentsActivity.start();
    reporter.verbose(msg('starting to fetch documents'));
    const documents = yield fetchAllDocuments(pluginOptions, gatsbyContext);
    reporter.verbose(msg(`fetched ${documents.length} documents`));
    fetchDocumentsActivity.end();
    /**
     * Create nodes for all documents.
     */
    createNodesActivity.start();
    reporter.verbose(msg('starting to create nodes'));
    const env = createEnvironment(pluginOptions, gatsbyContext, typePaths);
    // TODO: Implement queue like `schemasToTypeDefs` and create nodes here.
    yield documentsToNodes(documents, env);
    createNodesActivity.end();
    /**
     * Write type paths to public for use in Prismic previews.
     */
    writeTypePathsActivity.start();
    reporter.verbose(msg('starting to write out type paths'));
    const schemasDigest = md5(JSON.stringify(pluginOptions.schemas));
    const typePathsFilename = path.resolve(program.directory, 'public', [pluginOptions.typePathsFilenamePrefix, schemasDigest, '.json']
        .filter(part => part !== undefined && part !== null)
        .join(''));
    reporter.verbose(msg(`writing out type paths to : ${typePathsFilename}`));
    fsExtra.writeFileSync(typePathsFilename, JSON.stringify(typePaths));
    writeTypePathsActivity.end();
});
const createResolvers = (gatsbyContext, _pluginOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { createResolvers } = gatsbyContext;
    createResolvers(resolvers);
});
const onPreExtractQueries = gatsbyContext => {
    const { store } = gatsbyContext;
    const { program } = store.getState();
    // Add fragments for GatsbyPrismicImage to .cache/fragments.
    fsExtra.copyFileSync(path.resolve(__dirname, '../fragments.js'), path.resolve(program.directory, '.cache/fragments/gatsby-source-prismic-fragments.js'));
};

exports.createResolvers = createResolvers;
exports.onPreExtractQueries = onPreExtractQueries;
exports.sourceNodes = sourceNodes;
//# sourceMappingURL=gatsby-node.js.map
