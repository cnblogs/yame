'use strict'

const chokidar = require('chokidar');
const stringify = require('json-stringify-safe');
const WebSocket = require('ws');
const { resolve, join } = require('path');

const context = resolve(__dirname, '..');
const getConfig = require('./config');

const serveCfg = {
    clipboard: true,
    port: 4200,
    content: './demo',
    hot: {
        host: 'localhost',
        port: 8090,
    },
    on: {
        listening: ({ server }) => {
            const socket = new WebSocket('ws://localhost:8090');
            const watchPath = __dirname;
            const options = {};
            const watcher = chokidar.watch(watchPath, options);

            watcher.on('change', () => {
                const data = {
                    type: 'broadcast',
                    data: {
                        type: 'window-reload',
                        data: {},
                    },
                };

                socket.send(stringify(data));
            });

            server.on('close', () => {
                watcher.close();
            });
        },
    },
}

const webpackCfg = {
    ...getConfig(false),
    mode: 'development',
    output: {
        path: join(context, 'demo'),
        filename: 'yame-[name].min.js',
    },
    serve: serveCfg,
}



module.exports = webpackCfg;
