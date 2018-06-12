
const { resolve, join } = require('path');
const context = resolve(__dirname, '..');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = function (isProd) {
    const cfg = {
        context,
        mode: 'production',
        entry: {
            index: './index.ts',
        },
        output: {
            path: join(context, 'dist'),
            filename: 'yame-[name].min.js',
        },
        plugins: [
            new BundleAnalyzerPlugin()
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all"
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ['babel-loader', 'ts-loader']
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: 'exports-loader?module.exports.toString()'
                        },
                        {
                            loader: 'css-loader',
                            options: { minimize: isProd }
                        },
                        { loader: 'less-loader' }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'exports-loader?module.exports.toString()'
                        },
                        {
                            loader: 'css-loader',
                            options: { minimize: isProd }
                        }]
                }
            ]
        },
        devtool: isProd ? false : 'source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.less', '.css']
        }
    };
    return cfg;
}
