'use strict';

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const getConfig = require('./config');

const webpackCfg = {
    ...getConfig(false),
    plugins: [
        new BundleAnalyzerPlugin()
    ],

}
module.exports = webpackCfg;
