const path = require('path')
const HardSourcePlugin = require('hard-source-webpack-plugin')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const marked = require('marked')
const DotenvPlugin = require('webpack-dotenv-plugin')
const Contentful = require('spike-contentful')
const locals = {}

module.exports = {
  devtool: 'source-map',
  matchers: {
    html: '*(**/)*.sgr',
    css: '*(**/)*.sss'
  },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', '_cache/**', 'readme.md'],
  reshape: (ctx) => {
    return htmlStandards({
      webpack: ctx,
      locals: Object.assign(locals, { pageId: pageId(ctx) }, { marked: marked })
    })
  },
  postcss: (ctx) => {
    return cssStandards({ webpack: ctx })
  },
  babel: { presets: [jsStandards] },
  plugins: [
    new HardSourcePlugin({
      environmentPaths: { root: __dirname },
      recordsPath: path.join(__dirname, '_cache/records.json'),
      cacheDirectory: path.join(__dirname, '_cache/hard_source_cache')
    }),
    new DotenvPlugin({
      sample: './.env.example',
      path: './.env'
    }),
    new Contentful({
      addDataTo: locals,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      spaceId: process.env.CONTENTFUL_SPACE_ID,
      contentTypes: [
        {
          name: 'lander',
          id: 'lander',
        },
      ]
    })
  ]
}
