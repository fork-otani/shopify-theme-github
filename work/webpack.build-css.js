const path = require('path')
const globImporter = require('node-sass-glob-importer')
// const isDevelopment = process.env.NODE_ENV !== 'production'
const isDevelopment = false
const entryFiles = path.resolve(__dirname, './stories/assets/add.scss');
// const entryFiles = {}
const setting = {
  srcDir: path.resolve(__dirname, '../'),
  distDir: path.resolve(__dirname, '../'),
  storyDir: path.resolve(__dirname, '../'),
}
// const glob = require('glob')
// glob
//   .sync(`**/*.{sass,scss}`, {
//     ignore: [`**/_*.{sass,scss}`],
//     cwd: setting.srcDir,
//   })
//   .forEach((filename) => {
//     let _output = filename.replace(/(.*)\.(s[ac]ss)$/g, '$1.css')
//     let _source = path.resolve(setting.srcDir, filename)
//     entryFiles[_output] = _source
//   })


const webpackConfig = {
  // mode: 'production',
  mode: 'development',
  entry: entryFiles,
  output: {
    path: path.resolve(__dirname, setting.distDir),
    filename: '[name]',
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].css',
              outputPath: (url) => {
                return path.relative('stories', url)
              },
              url: false,
            },
            // options: {
            //   name: '[path][name].css',
            //   outputPath: (url) => {
            //     return path.relative('src/public', url)
            //   },
            //   url: false,
            // },
          },
          'extract-loader',
          {
            loader: 'css-loader',
            options: {
              // sourceMap: isDevelopment,
              importLoaders: 2,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              // sourceMap: isDevelopment,
              postcssOptions: {
                plugins: [
                  require('autoprefixer')({
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
              additionalData: '@import "@src/scss/foundation/mixin/_mixin.scss";',
              sassOptions: {
                importer: globImporter(),
                fiber: false,
                quietDeps: true
              }
            }
          }
        ],
        include: path.resolve(__dirname, '../'),
        exclude: /node_modules/
      },
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@src': path.resolve(__dirname, './lib/'),
      '@stories': path.resolve(__dirname, './stories'),
      '@theme': path.resolve(__dirname, '../')
    }
  }
  ,
  optimization: {
    minimize: false
  }
}
module.exports = webpackConfig
