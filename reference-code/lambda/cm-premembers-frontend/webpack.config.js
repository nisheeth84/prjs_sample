'use strict';

// Import plugins
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const glob = require('glob');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const InlineEnviromentVariablesPlugin = require('inline-environment-variables-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TARGET = process.env.npm_lifecycle_event;
const IsBuild = (TARGET == 'build');

// Output paths
const publicPath = 'assets/';
const assetsPath = path.join(__dirname, 'public', 'assets');

// Path variables
const srcPath = path.join(__dirname, 'source');
const jsPath = path.join(srcPath,'js');
const vendorPath = path.join(srcPath, 'vendor');
const remarkPath = path.join(vendorPath, 'remark', 'src');

// Entries
const scssEntries = {};
glob.sync(path.join(srcPath, 'scss', '!(_*).scss')).forEach(value => {
  const key = value.replace(srcPath, '').replace('/scss/', '').replace('.scss', '');
  scssEntries[key] = value;
});

const imgEntries = {};
glob.sync(path.join(srcPath, 'images', '**', '*.*')).forEach(value => {
  const key = value.replace(srcPath, '').replace('/images/', '');
  imgEntries[key] = value;
});
const remarkDirs = path.join(remarkPath, 'es', '**', '*.js');
const fontDirs = path.join(remarkPath, 'fonts', '*', '*.scss');
const fontTargets = glob.sync(fontDirs);

// Loaders
const imageLoaders = [
  {
    test: /\.(png|jpg|svg|ico)$/,
    use: 'file-loader?name=../images/[name].[ext]'
  }
];
const jsLoaders = [
  {
    test: /\.js$|\.tag.html$/,
    exclude: /node_modules|vendor/,
    loader: 'eslint-loader',
    enforce: 'pre',
    options: {
      failOnError: false
    }
  },
  {
    test: /\.tag.html$/,
    exclude: /node_modules/,
    enforce: 'pre',
    use: [
      {
        loader: 'riot-tag-loader',
        options: {
          debug: !IsBuild,
          style: 'scss'
        }
      }
    ]
  },
  {
    test: /\.js$|\.tag$/,
    exclude: /node_modules/,
    enforce: 'post',
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: `es2015-riot`
        }
      }
    ]
  },
   { 
    test: /\.json$/,
    loader: 'json-loader'
  },
  { 
    test: /\.css$/,
    loader: 'css-loader'
  },
];
const styleLoaders = [
  { 
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({ 
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              remarkPath,
              path.join(remarkPath, 'skins/scss'),
              path.join(remarkPath, 'scss'),
              path.join(remarkPath, 'scss/bootstrap'),
              path.join(remarkPath, 'scss/mixins'),
              path.join(remarkPath, 'vendor')
            ],
            minimize: IsBuild 
          }
        }
      ]
    })
  },
  {
    test: /\.(png|jpg|svg|ico)$/,
    use: 'file-loader?name=../images/[name].[ext]'
  }
];
const fontLoaders = [
  { 
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({ 
      fallback: 'style-loader',
      use: [
        {
          loader: 'css-loader',
          options: {
            importLoaders: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [
              path.join(remarkPath, 'scss'),
            ]
          }
        }
      ]
    })
  },
  {
    test: /\.(eot|svg|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
    use: 'file-loader?name=../fonts/[name].[ext]',
    include: [
      path.resolve(__dirname, './source/vendor/remark/src/fonts')
    ]
  }
];
const providePlugin = {
        riot: 'riot',
        i18next: 'i18next',
        jQuery: 'jquery/jquery',
        '$' : 'jquery/jquery',
        'window.jQuery': 'jquery/jquery',
        toastr: 'toastr/toastr',
        Tether: 'tether/tether',
        State: 'State',
        Component: 'Component',
        Plugin: 'Plugin',
        Base: 'Base',
        Config: 'Config',
        Menubar: 'Section/Menubar',
        GridMenu: 'Section/GridMenu',
        Sidebar: 'Section/Sidebar',
        PageAside: 'Section/PageAside',
        Site: 'Site',
        SiteCustomize: 'SiteCustomize',
        uuid: 'uuid'
};

const plugins = [
  new InlineEnviromentVariablesPlugin(process.env),
  new MergeJsonWebpackPlugin({
    'debug': !IsBuild,
    'output': {
        'groupBy': [
            {
                'pattern': './source/js/language/en/**/*.json',
                'fileName': './language/en.json'
            },
            {
                'pattern': './source/js/language/ja/**/*.json',
                'fileName': './language/ja.json'
            }
        ]
    },
    'globOptions': {
        'nosort': true
    }
  })
]
if (IsBuild){
  plugins.push(new UglifyJSPlugin());
}else{
  providePlugin['riot-hot-reload'] = 'riot-hot-reload';
}
plugins.push(new webpack.ProvidePlugin(providePlugin))

const riotPath = {};
riotPath["app"] = path.join(jsPath + '/index.js')
// Exports
module.exports = [
  {
    name: 'images',
    entry: imgEntries,
    output: {
      path: path.join(assetsPath, 'images'),
      filename: '[name]'
    },
    module: {
      rules: imageLoaders
    }
  },
  {
    name: 'scss',
    entry: Object.assign(scssEntries, {
      main: [
        './source/scss/main.scss',
        './source/scss/skin.scss'
      ]
    }),
    output: {
      path: path.join(assetsPath, 'stylesheets'),
      filename: '[name].css'
    },
    module: {
      rules: styleLoaders
    },
    plugins: [
      new ExtractTextPlugin('[name].css'),
      new OptimizeCssAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
        canPrint: true
      })
    ]
  },
  {
    name: 'font',
    entry: {
      font: fontTargets
    },
    output: {
      path: path.join(assetsPath, 'stylesheets'),
      filename: '[name].css'
    },
    module: {
      rules: fontLoaders
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ]
  },
  {
    name: 'js',
    // 招待受け入れがsoucemapを含めるとエラーになるため暫定対応を行う
    // devtool: IsBuild ? false : 'eval',
    devtool: 'eval',
    entry: Object.assign(riotPath,{
      // vendors:path.join(jsPath + '/vendor.js'),
      screenExternalTransUtil: path.join(jsPath + '/screenExternalTransUtil.js'),
      breakpoints: path.join(jsPath + '/breakpoints.js')
    }),
    // entry: {
    //   app: jsPath + '/index.js',
    //   vendor: jsPath + '/vendor.js',
    //   breakpoint: jsPath + '/breakpoints.js',
    // },
    // Object.assign(jsxEntries, {
    //   breakpoints: path.join(jsxPath, 'breakpoints.jsx'),
    //   vendors: path.join(jsxPath, 'vendors.jsx')
    // })
    output: {
      path: path.join(assetsPath, 'javascripts'),
      filename: '[name].js',
      publicPath: publicPath
    },
    module: {
      rules: jsLoaders
    },
    resolve: {
      extensions: ['*','.js','.tag'],
      modules: [
        path.join(remarkPath, 'vendor'),
        path.join(remarkPath, 'vendor', 'jquery'),
        path.join(remarkPath, 'js', 'config'),
        path.join(remarkPath, 'es'),
        path.join(remarkPath, 'es', 'App'),
        path.join(remarkPath, 'es', 'Plugin'),
        path.join(remarkPath, 'es', 'Section'),
        jsPath,
        path.join(jsPath, 'tags'),
        'node_modules'
      ]
    },
    plugins: plugins
  }
];
