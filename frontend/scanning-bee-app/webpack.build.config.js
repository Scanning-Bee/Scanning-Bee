const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const TerserPlugin = require('terser-webpack-plugin');

const APP_NAME = process.env.APP_NAME || 'Scanning Bee';

const commonConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(mp4)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.node$/,
                use: ['node-loader'],
            },
        ],
    },
}

module.exports = [
    {
        ...commonConfig,
        entry: {
            'index': path.resolve(__dirname, 'packages/main/dist/src/index.js'),
        },
        target: 'electron-main',
        optimization: {
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        mangle: false,
                        compress: {
                            keep_classnames: true,
                            keep_fnames: true,
                            reduce_vars: false,
                        },
                    }
                })
            ]
        },
        plugins: [
            new webpack.EnvironmentPlugin({
                FLUENTFFMPEG_COV: false,
                SCANNING_BEE_VERSION: process.env.SCANNING_BEE_VERSION,
                APP_NAME,
            })
        ],
        output: {
            path: path.resolve(__dirname, 'build', 'code', 'dist', 'main'),
        },
    },
    {
        ...commonConfig,
        entry: {
            'index': path.resolve(__dirname, 'packages/renderer/dist/src/index.js'),
        },
        resolve: {
            alias: {
                '@frontend': path.resolve(__dirname, 'packages/renderer/dist/src/'),
                '@utils': path.resolve(__dirname, 'packages/renderer/dist/src/utils/'),
                '@assets': path.resolve(__dirname, 'packages/renderer/assets/'),
            },
        },
        target: 'electron-renderer',
        externals: externalsObject,
        plugins: [
            new webpack.EnvironmentPlugin({
                APP_NAME,
                SCANNING_BEE_VERSION: process.env.SCANNING_BEE_VERSION,
            }),
            new WebpackObfuscator({
                compact: true,
                controlFlowFlattening: false,
                deadCodeInjection: true,
                deadCodeInjectionThreshold: 0.2,
                debugProtection: false,
                disableConsoleOutput: true,
                identifierNamesGenerator: 'hexadecimal',
                log: false,
                numbersToExpressions: false,
                renameGlobals: false,
                rotateStringArray: true,
                selfDefending: false,
                shuffleStringArray: true,
                simplify: true,
                splitStrings: false,
                stringArray: true,
                stringArrayEncoding: [],
                stringArrayIndexShift: true,
                stringArrayWrappersCount: 1,
                stringArrayWrappersChainedCalls: true,
                stringArrayWrappersParametersMaxCount: 2,
                stringArrayWrappersType: 'variable',
                stringArrayThreshold: 0.75,
                target: 'node',
                unicodeEscapeSequence: false,
            }),
            new HtmlWebpackPlugin(),
        ],
        output: {
            path: path.join(__dirname, 'build', 'code', 'dist', 'renderer'),
        },
    },
]
