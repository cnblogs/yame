
const { resolve, join } = require('path');
const context = resolve(__dirname, '..');

module.exports = function (isProd) {
    const cfg = {
        context,
        mode: 'production',
        entry: {
            index: './index.ts',
        },
        output: {
            path: join(context, 'dist'),
            filename: 'yame-[name].min.js'
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
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
                },
                {
                    test: /\.(png|jpg|gif|svg|woff)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192
                            }
                        }
                    ]
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
