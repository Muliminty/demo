const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // 自动清理构建目录
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: { cacheDirectory: true } // 启用 Babel 缓存
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.png' // 可选 favicon 配置
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx'], // 自动解析扩展名
        alias: { // 路径别名配置
            '@': path.resolve(__dirname, 'src/')
        }
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public') // 静态资源目录
        },
        port: 3000,
        historyApiFallback: true, // 支持 SPA 路由
        hot: true, // 启用热更新
        open: true // 自动打开浏览器
    },
    optimization: {
        splitChunks: { // 代码分割优化
            chunks: 'all'
        }
    }
}