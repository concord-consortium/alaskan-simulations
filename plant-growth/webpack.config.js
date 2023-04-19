'use strict';

const webpackCommon = require('../common/webpack-common.config.js');

module.exports = (env, argv) => {
  return webpackCommon(env, argv, __dirname, {
    // Add custom webpack configuration here
  });
};
