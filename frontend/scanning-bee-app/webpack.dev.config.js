const path = require('path');
const { spawn } = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

function spawnElectron(env, inspectPort) {
    spawn(
        'electron',
        [`--inspect=${inspectPort}`, '.'],
        { shell: true, env, stdio: 'inherit' }
    )
    .on('error', err => console.error(err))
    .on('close', code => {
        process.exit(code);
    })
}

module.exports = {
    mode: 'development',
    entry: {
        'index': path.resolve(__dirname, 'modules/renderer/dist/src/index.js'),
    },
    resolve: {
        alias: {
            '@frontend': path.resolve(__dirname, 'modules/renderer/dist/src/'),
            '@utils': path.resolve(__dirname, 'modules/renderer/dist/src/utils/'),
            '@assets': path.resolve(__dirname, 'modules/renderer/assets/'),
        },
    },
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
            }
        ]
    },
    stats: false,
    optimization: {
        minimize: false,
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin(),
    ],
    devtool: 'cheap-source-map',
    infrastructureLogging: {
        level: 'error',
    },
    devServer: {
        port: 8083,
        compress: false,
        setupMiddlewares(middlewares, devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            spawnElectron(process.env, 9222);

            return middlewares;
        },
    },
};
