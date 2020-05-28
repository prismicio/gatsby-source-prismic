import { PluginOptions as GatsbyPluginOptions, SourceNodesArgs, NodeInput, Node } from 'gatsby';
import { Document as PrismicDocument } from 'prismic-javascript/d.ts/documents';
import * as PrismicDOM from 'prismic-dom';
export declare type NodeID = string;
export interface DocumentNodeInput extends NodeInput {
    prismicId: PrismicDocument['id'];
    data: {
        [key: string]: NormalizedField;
    };
    dataString: string;
    dataRaw: PrismicDocument['data'];
    alternate_languages: NormalizedAlternateLanguagesField;
    url?: string;
}
export interface SliceNodeInput extends NodeInput {
    slice_type: string;
    slice_label?: string;
    primary: {
        [key: string]: NormalizedField;
    };
    items: {
        [key: string]: NormalizedField;
    }[];
}
export interface DocumentsToNodesEnvironment {
    createNode: (node: NodeInput) => void;
    createNodeId: (input: string) => string;
    createContentDigest: (input: unknown) => string;
    normalizeImageField: ImageFieldNormalizer;
    normalizeLinkField: LinkFieldNormalizer;
    normalizeSlicesField: SlicesFieldNormalizer;
    normalizeStructuredTextField: StructuredTextFieldNormalizer;
    typePaths: TypePath[];
    pluginOptions: PluginOptions;
    context: DocumentsToNodesEnvironmentNodeContext | DocumentsToNodesEnvironmentBrowserContext;
}
export interface DocumentsToNodesEnvironmentNodeContext {
    gatsbyContext: SourceNodesArgs;
}
export interface DocumentsToNodesEnvironmentBrowserContext {
    hasNodeById: (id: string) => boolean;
    getNodeById: <T>(id: string) => T & Node;
}
export interface TypePath {
    path: string[];
    type: GraphQLType | string;
}
export declare type FieldNormalizer<T, N> = (apiId: string, field: T, path: TypePath['path'], doc: PrismicDocument, env: DocumentsToNodesEnvironment) => N | Promise<N>;
export declare type ImageFieldNormalizer = FieldNormalizer<ImageField, NormalizedImageField>;
export declare type LinkFieldNormalizer = FieldNormalizer<LinkField, NormalizedLinkField>;
export declare type SlicesFieldNormalizer = FieldNormalizer<SliceIDsField, NormalizedSlicesField>;
export declare type StructuredTextFieldNormalizer = FieldNormalizer<StructuredTextField, NormalizedStructuredTextField>;
export declare type Field = StructuredTextField | ImageField | SlicesField | GroupField | LinkField | AlternateLanguagesField | string | number | boolean | null;
export declare type NormalizedField = NormalizedStructuredTextField | NormalizedImageField | NormalizedSlicesField | NormalizedGroupField | NormalizedLinkField | NormalizedAlternateLanguagesField | Field;
export declare type StructuredTextField = {
    type: string;
    text: string;
    spans: {
        [key: string]: unknown;
    };
}[];
export interface NormalizedStructuredTextField {
    html: string;
    text: string;
    raw: StructuredTextField;
}
export declare type SlicesField = Slice[];
interface Slice {
    slice_type: string;
    slice_label: string | null;
    items: {
        [key: string]: Field;
    }[];
    primary: {
        [key: string]: Field;
    };
}
export declare type SliceIDsField = NodeID[];
export declare type NormalizedSlicesField = NodeID[];
export declare enum LinkFieldType {
    Any = "Any",
    Document = "Document",
    Media = "Media",
    Web = "Web"
}
export interface LinkField {
    link_type: LinkFieldType;
    isBroken: boolean;
    url?: string;
    target?: string;
    size?: number;
    id?: string;
    type?: string;
    tags?: string[];
    lang?: string;
    slug?: string;
    uid?: string;
}
export interface NormalizedLinkField extends LinkField {
    url: string;
    document?: NodeID;
    raw: LinkField;
}
export interface ImageField {
    alt?: string;
    copyright?: string;
    dimensions?: {
        width: number;
        height: number;
    };
    url?: string;
    [key: string]: unknown;
}
export interface NormalizedImageField extends ImageField {
    thumbnails?: {
        [key: string]: NormalizedImageField;
    };
    fixed?: GatsbyFixedImageProps;
    fluid?: GatsbyFluidImageProps;
    localFile?: NodeID;
}
interface GatsbyImageProps {
    base64?: string;
    aspectRatio: number;
    src: string;
    srcWebp: string;
    srcSet: string;
    srcSetWebp: string;
}
export interface GatsbyFixedImageProps extends GatsbyImageProps {
    width: number;
    height: number;
}
export interface GatsbyFluidImageProps extends GatsbyImageProps {
    sizes: string;
}
interface GatsbyImageArgs {
    quality?: number;
}
export interface GatsbyImageFluidArgs extends GatsbyImageArgs {
    maxWidth?: number;
    maxHeight?: number;
    sizes?: string;
    srcSetBreakpoints?: number[];
}
export interface GatsbyImageFixedArgs extends GatsbyImageArgs {
    width?: number;
    height?: number;
}
export declare type AlternateLanguagesField = LinkField[];
export declare type NormalizedAlternateLanguagesField = AlternateLanguagesField;
export declare type GroupField = {
    [key: string]: Field;
}[];
export declare type NormalizedGroupField = {
    [key: string]: NormalizedField;
}[];
export declare enum FieldType {
    Boolean = "Boolean",
    Color = "Color",
    Date = "Date",
    Embed = "Embed",
    GeoPoint = "GeoPoint",
    Group = "Group",
    Image = "Image",
    Link = "Link",
    Number = "Number",
    Select = "Select",
    Slice = "Slice",
    Slices = "Slices",
    StructuredText = "StructuredText",
    Text = "Text",
    Timestamp = "Timestamp",
    UID = "UID",
    AlternateLanguages = "AlternateLanguages"
}
export declare enum GraphQLType {
    ID = "ID",
    Boolean = "Boolean",
    String = "String",
    Float = "Float",
    Date = "Date",
    JSON = "JSON",
    Link = "PrismicLinkType",
    Image = "PrismicImageType",
    ImageThumbnail = "PrismicImageThumbnailType",
    ImageThumbnails = "PrismicImageThumbnailsType",
    Embed = "PrismicEmbedType",
    GeoPoint = "PrismicGeoPointType",
    StructuredText = "PrismicStructuredTextType",
    AllDocumentTypes = "PrismicAllDocumentTypes",
    Group = "Group",
    Slices = "Slices",
    AlternateLanguages = "AlternateLanguages"
}
export interface GraphQLTypeObj {
    type: GraphQLType | string;
    extensions?: {
        [key: string]: any;
    };
    resolve?: Function;
}
interface BaseFieldConfigSchema {
    label?: string;
    labels?: {
        [key: string]: string[];
    };
    placeholder?: string;
    [key: string]: unknown;
}
export interface BaseFieldSchema {
    type: FieldType;
    config: BaseFieldConfigSchema;
}
export interface ImageFieldSchema extends BaseFieldSchema {
    type: FieldType.Image;
    config: ImageFieldConfigSchema;
}
interface ThumbnailSchema {
    name: string;
    width?: string;
    height?: string;
}
interface ImageFieldConfigSchema extends BaseFieldConfigSchema {
    constraint?: {
        width?: number;
        height?: number;
    };
    thumbnails?: ThumbnailSchema[];
}
export interface SlicesFieldSchema extends BaseFieldSchema {
    type: FieldType.Slices;
    fieldset: string;
    config: SlicesFieldConfigSchema;
}
interface SlicesFieldConfigSchema extends BaseFieldConfigSchema {
    choices: SliceChoicesSchema;
}
export interface SliceChoicesSchema {
    [sliceId: string]: SliceFieldSchema;
}
declare enum SliceChoiceDisplay {
    List = "list",
    Grid = "grid"
}
export interface SliceFieldSchema extends BaseFieldSchema {
    type: FieldType.Slice;
    fieldset: string;
    description: string;
    icon: string;
    display: SliceChoiceDisplay;
    repeat?: FieldsSchema;
    'non-repeat'?: FieldsSchema;
}
export interface GroupFieldSchema extends BaseFieldSchema {
    type: FieldType.Group;
    config: GroupFieldConfigSchema;
}
interface GroupFieldConfigSchema extends BaseFieldConfigSchema {
    fields: FieldsSchema;
}
export declare type FieldSchema = BaseFieldSchema | ImageFieldSchema | SlicesFieldSchema | GroupFieldSchema | SliceFieldSchema;
export interface FieldsSchema {
    [fieldId: string]: FieldSchema;
}
export interface Schema {
    [tabName: string]: {
        [fieldId: string]: FieldSchema;
    };
}
export interface Schemas {
    [schemaId: string]: Schema;
}
export declare type LinkResolver = (doc: object) => string;
declare type PluginLinkResolver = (input: {
    key?: string;
    value?: unknown;
    node: PrismicDocument;
}) => LinkResolver;
export declare type HTMLSerializer = typeof PrismicDOM.HTMLSerializer;
declare type PluginHTMLSerializer = (input: {
    key: string;
    value: unknown;
    node: PrismicDocument;
}) => HTMLSerializer;
declare type ShouldDownloadImage = (input: {
    key: string;
    value: unknown;
    node: PrismicDocument;
}) => boolean | Promise<boolean>;
export declare type BrowserPluginOptions = GatsbyPluginOptions & Pick<PluginOptions, 'repositoryName' | 'accessToken' | 'fetchLinks' | 'schemas' | 'lang' | 'typePathsFilenamePrefix'>;
export interface PluginOptions extends GatsbyPluginOptions {
    repositoryName: string;
    releaseID?: string;
    accessToken?: string;
    linkResolver?: PluginLinkResolver;
    htmlSerializer?: PluginHTMLSerializer;
    fetchLinks?: string[];
    schemas: Schemas;
    lang?: string;
    shouldDownloadImage?: ShouldDownloadImage;
    shouldNormalizeImage?: ShouldDownloadImage;
    typePathsFilenamePrefix?: string;
}
export {};
