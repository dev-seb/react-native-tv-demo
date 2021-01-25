/**
 * react-app-rewirred overrides for react-scripts
 */
module.exports = {

  /**
   * Search for .web.js files
   */
  webpack: (config, env) => {
    config.resolve = {
      alias: {
        'react-native$': 'react-native-web'
      },
      extensions: [
        '.web.js',
        '.js',
      ],
    };
    return config;
  },

  /**
   * Changes paths to web/
   */
  paths: (paths, env) => {
    paths.appBuild = paths.appPath + '/web/build';
    paths.appPublic = paths.appPath + '/web/public';
    paths.appHtml = paths.appPath + '/web/public/index.html';
    paths.appIndexJs = paths.appPath + '/web/index.js';
    return paths;
  }

};
