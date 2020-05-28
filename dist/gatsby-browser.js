'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var md5 = _interopDefault(require('md5'));
var omit = _interopDefault(require('lodash.omit'));

const BROWSER_STORE_KEY = '__GATSBY_SOURCE_PRISMIC__';

const onClientEntry = (_gatsbyContext, pluginOptions) => {
    const params = new URLSearchParams(window.location.search);
    const isPreviewSession = params.has('token') && params.has('documentId');
    if (!isPreviewSession)
        return;
    window[BROWSER_STORE_KEY] = window[BROWSER_STORE_KEY] || {};
    Object.assign(window[BROWSER_STORE_KEY], {
        [pluginOptions.repositoryName]: {
            pluginOptions: omit(pluginOptions, ['schemas', 'plugins']),
            schemasDigest: md5(JSON.stringify(pluginOptions.schemas)),
        },
    });
};

exports.onClientEntry = onClientEntry;
//# sourceMappingURL=gatsby-browser.js.map
