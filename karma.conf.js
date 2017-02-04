const path = require('path');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'test/**/*.js',
    ],

    preprocessors: {
      'test/**/*.js': ['webpack']
    },

    webpack: {
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: path.resolve(__dirname, 'node_modules'),
            query: {
              presets: [
                'airbnb',
                'react',
                'es2015',
                'stage-0',
              ],
              plugins: [
                'babel-plugin-transform-flow-strip-types',
                'transform-decorators-legacy',
              ],
            },
          },
          {
            test: /\.json$/,
            loader: 'json',
          },
        ],
      },
      externals: {
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
        'react/addons': true,
      },
    },

    webpackServer: {
      noInfo: true,  // please don't spam the console when running in karma!
    },

    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-nightmare',
    ],

    nightmareOptions: {
      width: 800,
      height: 560,
      show: false,
    },

    customContextFile: 'test/context.html',
    customDebugFile: 'test/debug.html',

    reporters: ['progress'],
    port: 9876,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Nightmare'],
    singleRun: true,
  });
};
