import { BROWSER_STORE_KEY } from './constants';
import { GatsbyBrowser } from 'gatsby';
import { BrowserPluginOptions } from './types';
declare global {
    interface Window {
        [BROWSER_STORE_KEY]: BrowserPluginOptionsStore;
    }
}
export interface BrowserPluginOptionsStore {
    [key: string]: {
        pluginOptions: BrowserPluginOptions;
        schemasDigest: string;
    };
}
export declare const onClientEntry: GatsbyBrowser['onClientEntry'];
