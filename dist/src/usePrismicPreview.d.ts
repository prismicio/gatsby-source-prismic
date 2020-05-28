import { Node } from 'gatsby';
import { PluginOptions } from './types';
declare type Options = Pick<PluginOptions, 'repositoryName' | 'accessToken' | 'linkResolver' | 'htmlSerializer' | 'fetchLinks' | 'lang' | 'typePathsFilenamePrefix' | 'schemas'> & {
    pathResolver?: PluginOptions['linkResolver'];
    schemasDigest?: string;
};
interface State {
    isPreview?: boolean;
    isLoading: boolean;
    previewData?: {
        [key: string]: Node;
    };
    path?: string;
}
export declare const usePrismicPreview: (options: Options) => State;
export {};
