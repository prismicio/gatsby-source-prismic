import { Node } from 'gatsby';
interface NodeTree {
    [key: string]: Node;
}
interface MergePrismicPreviewDataArgs {
    staticData?: {
        [key: string]: any;
    };
    previewData?: NodeTree;
}
export declare const mergePrismicPreviewData: (args: MergePrismicPreviewDataArgs) => NodeTree | undefined;
export {};
