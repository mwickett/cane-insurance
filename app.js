const path = require('path')
const HardSourcePlugin = require('hard-source-webpack-plugin')
const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('babel-preset-latest')
const pageId = require('spike-page-id')
const marked = require('marked')
const DotenvPlugin = require('webpack-dotenv-plugin')
const Contentful = require('spike-contentful')

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
      locals: { pageId: pageId(ctx), foo: 'bar' }
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
    })
  ]
}
