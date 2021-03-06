import { RenderBodyArgs } from 'gatsby'

import { onRenderBody } from '../src/gatsby-ssr'

import mockSchema from './__fixtures__/schema.json'

const PROGRAM_DIRECTORY_PATH = '/__PROGRAM_DIRECTORY__/'

const mockActions = {
  deletePage: jest.fn(),
  createPage: jest.fn(),
  deleteNode: jest.fn(),
  deleteNodes: jest.fn(),
  createNode: jest.fn(),
  touchNode: jest.fn(),
  createNodeField: jest.fn(),
  createParentChildLink: jest.fn(),
  setWebpackConfig: jest.fn(),
  replaceWebpackConfig: jest.fn(),
  setBabelOptions: jest.fn(),
  setBabelPlugin: jest.fn(),
  setBabelPreset: jest.fn(),
  createJob: jest.fn(),
  createJobV2: jest.fn(),
  setJob: jest.fn(),
  endJob: jest.fn(),
  setPluginStatus: jest.fn(),
  createRedirect: jest.fn(),
  addThirdPartySchema: jest.fn(),
  createTypes: jest.fn(),
  createFieldExtension: jest.fn(),
}

const mockGatsbyContext: RenderBodyArgs = {
  boundActionCreators: mockActions,
  actions: mockActions,
  setHeadComponents: jest.fn(),
  setHtmlAttributes: jest.fn(),
  setBodyAttributes: jest.fn(),
  setBodyProps: jest.fn(),
  setPreBodyComponents: jest.fn(),
  setPostBodyComponents: jest.fn(),
  pathPrefix: 'pathPrefix',
  pathname: 'pathname',
  store: {
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    getState: jest
      .fn()
      .mockReturnValue({ program: { directory: PROGRAM_DIRECTORY_PATH } }),
    replaceReducer: jest.fn(),
  },
  emitter: {
    addListener: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    prependListener: jest.fn(),
    prependOnceListener: jest.fn(),
    removeListener: jest.fn(),
    off: jest.fn(),
    removeAllListeners: jest.fn(),
    setMaxListeners: jest.fn(),
    getMaxListeners: jest.fn(),
    listeners: jest.fn(),
    rawListeners: jest.fn(),
    emit: jest.fn(),
    eventNames: jest.fn(),
    listenerCount: jest.fn(),
  },
  loadNodeContent: jest.fn(),
  getNodes: jest.fn(),
  getNode: jest.fn(),
  getNodesByType: jest.fn(),
  getNodeAndSavePathDependency: jest.fn(),
  hasNodeChanged: jest.fn(),
  reporter: {
    stripIndent: jest.fn(),
    format: jest.fn(),
    setVerbose: jest.fn(),
    setNoColor: jest.fn(),
    panic: jest.fn().mockImplementation((msg: string | Error, err?: Error) => {
      throw err ?? msg
    }),
    panicOnBuild: jest
      .fn()
      .mockImplementation((msg: string | Error, err?: Error) => {
        throw err ?? msg
      }),
    error: jest.fn(),
    uptime: jest.fn(),
    success: jest.fn(),
    verbose: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
    activityTimer: jest.fn().mockReturnValue({
      start: jest.fn(),
      end: jest.fn(),
    }),
    createProgress: jest.fn(),
  },
  cache: {
    set: jest.fn(),
    get: jest.fn(),
  },
  createNodeId: jest.fn().mockReturnValue('createNodeId'),
  createContentDigest: jest.fn().mockReturnValue('createContentDigest'),
  tracing: {
    tracer: {},
    parentSpan: {},
    startSpan: jest.fn(),
  },
  schema: {
    buildObjectType: jest.fn(),
    buildUnionType: jest.fn(),
    buildInterfaceType: jest.fn(),
    buildInputObjectType: jest.fn(),
    buildEnumType: jest.fn(),
    buildScalarType: jest.fn(),
  },
}

const pluginOptions = {
  repositoryName: 'repositoryName',
  plugins: [],
  schemas: { page: mockSchema },
}

describe('onRenderBody', () => {
  beforeEach(() => jest.clearAllMocks())

  test('expect Prismic Toolbar script not to be included by default', async () => {
    await onRenderBody!(mockGatsbyContext, pluginOptions)

    expect(mockGatsbyContext.setHeadComponents).not.toHaveBeenCalled()
  })

  test('expect Prismic Toolbar script to be included if `prismicToolbar` is set to `true`', async () => {
    await onRenderBody!(mockGatsbyContext, {
      ...pluginOptions,
      prismicToolbar: true,
    })

    expect(mockGatsbyContext.setHeadComponents).toHaveBeenCalledTimes(1)

    expect(
      (mockGatsbyContext.setHeadComponents as jest.Mock).mock.calls[0][0][0]
        .props.src,
    ).toBe(
      `//static.cdn.prismic.io/prismic.js?repo=${pluginOptions.repositoryName}&new=true`,
    )
  })

  test('expect Prismic Toolbar script to use the legacy URL if the `legacy` option is provided', async () => {
    await onRenderBody!(mockGatsbyContext, {
      ...pluginOptions,
      prismicToolbar: 'legacy',
    })

    expect(
      (mockGatsbyContext.setHeadComponents as jest.Mock).mock.calls[0][0][0]
        .props.src,
    ).toBe(
      `//static.cdn.prismic.io/prismic.js?repo=${pluginOptions.repositoryName}`,
    )
  })
})
