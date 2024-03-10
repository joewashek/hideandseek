const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const appDirectory = fs.realpathSync(process.cwd());
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(appDirectory, "src/app.ts"),
    output: {
        filename: "js/bundleName.js",
        clean: true,
    },
    resolve: {
        extensions: [".tsx",".ts",".js"],
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        static: path.resolve(appDirectory, "public"),
        hot: true,
        devMiddleware: {
            publicPath: "/"
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(appDirectory, "public/index.html")
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/assets',to:'assets' },
                { from: 'public/fonts',to:'fonts' },
            ]
        })
    ],
    mode: "development"
}