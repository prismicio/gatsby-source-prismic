'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var react = require('react');
var esCookie = require('es-cookie');
var prismicJavascript = require('prismic-javascript');
var camelCase = _interopDefault(require('camelcase'));
var superstruct = require('superstruct');
var pascalcase = _interopDefault(require('pascalcase'));
var prismicDom = require('prismic-dom');
var uuid = require('uuid');
var md5 = _interopDefault(require('md5'));
var pick = _interopDefault(require('lodash.pick'));
var omit = _interopDefault(require('lodash.omit'));
var tsImgix = require('ts-imgix');
var isPlainObject = _interopDefault(require('lodash.isplainobject'));

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
const validateBrowserOptions = (browserOptions) => BrowserOptionsValidator(browserOptions);

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
 * Returns a valid GraphQL type name for a Prismic schema.
 *
 * @param apiId API ID of the schema.
 *
 * @returns Type name for the schema.
 */
const buildSchemaTypeName = (apiId) => pascalcase(`Prismic ${apiId}`);
/**
 * Determines whether the current context is the browser.
 *
 * @returns `true` if the current context is the browser, `false` otherwise.
 */
const isBrowser = typeof window !== 'undefined';

const BROWSER_STORE_KEY = '__GATSBY_SOURCE_PRISMIC__';
const IMAGE_FIELD_KEYS = [
    'alt',
    'copyright',
    'dimensions',
    'url',
];
const UUID_NAMESPACE = `638f7a53-c567-4eca-8fc1-b23efb1cfb2b`;
const PLACEHOLDER_NODE_TYPE_SUFFIX = '__PLACEHOLDER';

const createClient = (repositoryName, accessToken) => __awaiter(void 0, void 0, void 0, function* () { return yield prismicJavascript.getApi(`https://${repositoryName}.prismic.io/api/v2`, { accessToken }); });

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

const loadLinkFieldDocument = (field, env) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNode, createNodeId, createContentDigest, pluginOptions, context, } = env;
    if (field.link_type !== LinkFieldType.Document || !field.id || field.isBroken)
        return;
    const { hasNodeById } = context;
    const { repositoryName, accessToken, fetchLinks } = pluginOptions;
    const linkedDocId = createNodeId(`${field.type} ${field.id}`);
    // Skip the fetch process if the node already exists in the store.
    if (hasNodeById(linkedDocId))
        return;
    // Create a placeholder node in the store to prevent infinite recursion. This
    // placeholder will be replaced with the actual node during the
    // `documentToNodes` call.
    createNode({
        id: linkedDocId,
        internal: {
            type: buildSchemaTypeName(field.type) + PLACEHOLDER_NODE_TYPE_SUFFIX,
            contentDigest: createContentDigest(linkedDocId),
        },
    });
    const queryOptions = {};
    if (fetchLinks)
        queryOptions.fetchLinks = fetchLinks;
    // Query Prismic's API for the document.
    const client = yield createClient(repositoryName, accessToken);
    const doc = yield client.getByID(field.id, queryOptions);
    yield documentToNodes(doc, env);
});
const normalizeImageField = (_apiId, field, _path, _doc, _env) => __awaiter(void 0, void 0, void 0, function* () {
    const url = field.url;
    if (!url)
        return field;
    const fixed = buildFixedGatsbyImage(url, field.dimensions.width, field.dimensions.height);
    const fluid = buildFluidGatsbyImage(url, field.dimensions.width, field.dimensions.height);
    return Object.assign(Object.assign({}, field), { fixed, fluid });
});
// TODO: Abstract proxy handler for any `getNodeById` needs (e.g. Slices).
const normalizeLinkField = (apiId, field, _path, doc, env) => __awaiter(void 0, void 0, void 0, function* () {
    const { createNodeId, pluginOptions, context } = env;
    const { getNodeById } = context;
    const { linkResolver } = pluginOptions;
    let linkResolverForField = undefined;
    if (linkResolver)
        linkResolverForField = linkResolver({
            key: apiId,
            value: field,
            node: doc,
        });
    const linkedDocId = createNodeId(`${field.type} ${field.id}`);
    if (field.link_type === LinkFieldType.Document && field.id && !field.isBroken)
        yield loadLinkFieldDocument(field, env);
    return new Proxy(Object.assign(Object.assign({}, field), { url: prismicDom.Link.url(field, linkResolverForField), document: linkedDocId, raw: field }), {
        get: (obj, prop) => {
            if (prop === 'document') {
                if (field.link_type === LinkFieldType.Document &&
                    field.id &&
                    !field.isBroken)
                    return getNodeById(linkedDocId);
                return null;
            }
            return obj[prop];
        },
    });
});
const normalizeSlicesField = (_apiId, field, _path, _doc, env) => {
    const { context } = env;
    const { hasNodeById, getNodeById, } = context;
    return new Proxy(field, {
        get: (obj, prop) => {
            const id = obj[prop];
            if (hasNodeById(id)) {
                const node = getNodeById(id);
                return Object.assign(Object.assign({}, node), { __typename: node.internal.type });
            }
            return id;
        },
    });
};
const normalizeStructuredTextField = (apiId, field, _path, doc, env) => __awaiter(void 0, void 0, void 0, function* () {
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
});
const createEnvironment = (pluginOptions, typePaths) => {
    const nodeStore = new Map();
    const createNode = (node) => void nodeStore.set(node.id, node);
    const createNodeId = (input) => uuid.v5(input, UUID_NAMESPACE);
    const createContentDigest = (input) => md5(JSON.stringify(input));
    const hasNodeById = (id) => nodeStore.has(id);
    const getNodeById = (id) => nodeStore.get(id);
    return {
        createNode,
        createNodeId,
        createContentDigest,
        normalizeImageField,
        normalizeLinkField,
        normalizeSlicesField,
        normalizeStructuredTextField,
        typePaths,
        pluginOptions,
        context: { hasNodeById, getNodeById },
    };
};

var ActionType;
(function (ActionType) {
    ActionType["IS_NOT_PREVIEW"] = "IS_NOT_PREVIEW";
    ActionType["IS_PREVIEW"] = "IS_PREVIEW";
    ActionType["DOCUMENT_LOADED"] = "DOCUMENT_LOADED";
    ActionType["RESET"] = "RESET";
})(ActionType || (ActionType = {}));
const initialState = {
    isPreview: undefined,
    isLoading: false,
    previewData: undefined,
    path: undefined,
};
const reducer = (state, action) => {
    switch (action.type) {
        case ActionType.IS_NOT_PREVIEW: {
            return Object.assign(Object.assign({}, state), { isPreview: false, isLoading: false });
        }
        case ActionType.IS_PREVIEW: {
            return Object.assign(Object.assign({}, state), { isPreview: true, isLoading: true });
        }
        case ActionType.DOCUMENT_LOADED: {
            if (!action.payload)
                return Object.assign(Object.assign({}, state), { isPreview: false, isLoading: false });
            const { rootNode, path } = action.payload;
            const type = camelCase(rootNode.internal.type);
            const previewData = { [type]: rootNode };
            return Object.assign(Object.assign({}, state), { previewData, path, isPreview: true, isLoading: false });
        }
        case ActionType.RESET: {
            return initialState;
        }
        default:
            throw new Error('Invalid error');
    }
};
const usePrismicPreview = (options) => {
    const [state, dispatch] = react.useReducer(reducer, initialState);
    const hydratedOptions = react.useMemo(() => {
        if (!isBrowser)
            return options;
        const context = window[BROWSER_STORE_KEY][options.repositoryName];
        if (!context)
            throw new Error(`Could not find plugin context for repository: "${options.repositoryName}". Check that a gatsby-source-plugin instance exists for that repository. `);
        return validateBrowserOptions(Object.assign(Object.assign(Object.assign({}, context.pluginOptions), { schemasDigest: context.schemasDigest }), options));
    }, [options]);
    const { token, documentId } = react.useMemo(() => {
        var _a, _b;
        if (!isBrowser)
            return {};
        const params = new URLSearchParams(window.location.search);
        return {
            token: (_a = params.get('token')) !== null && _a !== void 0 ? _a : undefined,
            documentId: (_b = params.get('documentId')) !== null && _b !== void 0 ? _b : undefined,
        };
    }, [isBrowser ? window.location.search : undefined]);
    /**
     * Set the preview status as soon as possible.
     */
    react.useEffect(() => {
        const isPreview = Boolean(token && documentId);
        dispatch({
            type: isPreview ? ActionType.IS_PREVIEW : ActionType.IS_NOT_PREVIEW,
        });
    }, [token, documentId]);
    const asyncEffect = react.useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!state.isPreview || !token || !documentId)
            return;
        esCookie.set(prismicJavascript.previewCookie, token);
        const queryOptions = {};
        if (hydratedOptions.fetchLinks)
            queryOptions.fetchLinks = hydratedOptions.fetchLinks;
        // Query Prismic's API for the document.
        const client = yield createClient(hydratedOptions.repositoryName, hydratedOptions.accessToken);
        const doc = yield client.getByID(documentId, queryOptions);
        // Process the document into nodes.
        const typePathsRes = yield fetch(`/${hydratedOptions.typePathsFilenamePrefix}${hydratedOptions.schemasDigest}.json`, { headers: { 'Content-Type': 'application/json' } });
        const typePaths = yield typePathsRes.json();
        const env = createEnvironment(hydratedOptions, typePaths);
        const { context } = env;
        const { getNodeById } = context;
        const rootNodeId = yield documentToNodes(doc, env);
        const rootNode = getNodeById(rootNodeId);
        const path = (_c = (_b = ((_a = hydratedOptions.pathResolver) !== null && _a !== void 0 ? _a : hydratedOptions.linkResolver)) === null || _b === void 0 ? void 0 : _b({ node: doc })) === null || _c === void 0 ? void 0 : _c(doc);
        dispatch({ type: ActionType.DOCUMENT_LOADED, payload: { rootNode, path } });
    }), [state.isPreview]);
    react.useEffect(() => {
        asyncEffect();
    }, [asyncEffect]);
    return state;
};

const traverseAndReplace = (node, replacementNode) => {
    if (isPlainObject(node)) {
        // If the node shares the same Prismic ID, replace it.
        if (node.prismicId === replacementNode.prismicId)
            return replacementNode;
        // We did not find the Node to replace. Iterate all properties and continue
        // to find the Node.
        const newNode = {};
        for (const subnodeKey in node)
            newNode[subnodeKey] = traverseAndReplace(node[subnodeKey], replacementNode);
        return newNode;
    }
    // Iterate all elements in the node to find the Node.
    if (Array.isArray(node))
        return node.map(subnode => traverseAndReplace(subnode, replacementNode));
    // If the node is not an object or array, it cannot be a Node.
    return node;
};
const mergePrismicPreviewData = (args) => {
    const { staticData, previewData } = args;
    if (!staticData && !previewData)
        return;
    if (!staticData)
        return previewData;
    if (!previewData)
        return staticData;
    const previewDataRootNodeKey = Object.keys(previewData)[0];
    if (staticData.hasOwnProperty(previewDataRootNodeKey))
        return Object.assign(Object.assign({}, staticData), previewData);
    return traverseAndReplace(staticData, previewData[previewDataRootNodeKey]);
};

exports.buildFixedGatsbyImage = buildFixedGatsbyImage;
exports.buildFluidGatsbyImage = buildFluidGatsbyImage;
exports.mergePrismicPreviewData = mergePrismicPreviewData;
exports.usePrismicPreview = usePrismicPreview;
//# sourceMappingURL=index.cjs.js.map
