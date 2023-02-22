const path = require('path')
const globImporter = require('node-sass-glob-importer')

const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
  "stories": [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    '@whitespace/storybook-addon-html',
    "@storybook/addon-links",
    "@storybook/addon-essentials",
  ],
  webpackFinal: async (config) => {
    // config.devtool=false;
    config.module.rules.push(
      {
        test: /\.pug$/,
        use: {
          loader: 'storypug/lib/webpack-loader.js',
          options: {
            filters: {
              "md":(text, options) => {
                const mdOptions = Object.assign({
                  linkify:true,
                  breaks:true,
                  html:true,
                },options)
                const md = require('jstransformer')(require('jstransformer-markdown-it'));
                return `<div class="markdown-body">${md.render(text,mdOptions).body}</div>`
              },
              "code":(text) => {
                const hljs = require('jstransformer')(require('jstransformer-highlight'));
                return `<pre class="hljs"><code class="code-src">${hljs.render(text).body}</code><div onClick="navigator.clipboard.writeText(this.previousElementSibling.innerText);this.innerText='Copied!';var t = this;setTimeout(function(){t.innerText = 'Copy';},1000)" class="code-copy">Copy</div></pre>`
              },
              "pug":(text,options) => {
                const pug = require('jstransformer')(require('jstransformer-pug'));
                const {fn} = pug.compile(text,{pretty:true});
                return fn(options)
              },
            },
          }
        },
      }
    )
    config.module.rules.push({
      test: /\.s[ac]ss$/,
      use: [
        'css-hot-loader',
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].css',
            outputPath: (url) => {
              return path.relative('stories', url);
            },
            url: false
          }
        },
        'extract-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            url: false
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [
                require('autoprefixer')({
                  grid: true,
                  overrideBrowserslist: ["last 2 versions", "ie >= 11", "Android >= 4"]
                }),
                require('css-mqpacker')(),
              ]
            }
          }
        },
        {
          loader: 'sass-loader',
          options: {
            additionalData: '@import "@lib/scss/foundation/mixin/_mixin.scss";',
            // sourceMap: isDevelopment,
            sassOptions: {
              importer: globImporter(),
              fiber: false,
            }
          }
        }
      ],
      include: path.resolve(__dirname, '../'),
      exclude: /node_modules/
    })

    config.resolve.alias['@'] = path.resolve(__dirname, '../')
    config.resolve.alias['@stories'] = path.resolve(__dirname, '../stories')
    config.resolve.alias['@lib'] = path.resolve(__dirname, '../lib')
    return config
  }
}
