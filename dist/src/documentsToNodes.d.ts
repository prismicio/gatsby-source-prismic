import { Document as PrismicDocument } from 'prismic-javascript/d.ts/documents';
import { DocumentsToNodesEnvironment } from './types';
export declare const documentToNodes: (doc: PrismicDocument, env: DocumentsToNodesEnvironment) => Promise<string>;
export declare const documentsToNodes: (docs: PrismicDocument[], env: DocumentsToNodesEnvironment) => Promise<string[]>;
