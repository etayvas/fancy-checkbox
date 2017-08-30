const webpack = require('webpack')
, CopyWebpackPlugin = require('copy-webpack-plugin')
//seperate css file
, ExtractTextPlugin = require("extract-text-webpack-plugin")
, path = require('path')

const config = {
    context: path.resolve(__dirname, './src')
    , entry: {
        main: './main.ts'
    }
    ,output: {
          path: path.resolve(__dirname, './dist')
        , filename: '[name].bundle.js'
        , publicPath: '/'
    }
    ,resolve: {
        extensions: ['.js', '.ts', '.scss', 'svg']
    }
    ,devServer: {
        contentBase: path.resolve(__dirname, './src')
    }
    ,module: {
        loaders: [
            {
                 test: /\.tsx?$/
               , loader: 'awesome-typescript-loader'
            }
            ,{
                  test: /\.js$/
                , exclude: /node_modules/
                , loader: 'babel-loader'
                , query: {
                    presets: ['es2015']
                }
            }
            ,{
                  test: /\.scss$/
                , exclude: /node_modules/
                , loader: ExtractTextPlugin.extract('css-loader!sass-loader')
            }
            ,{
                  test: /\.svg$/
                , exclude: /node_modules/
                , loader: 'svg-url-loader'
                , options: {}
            }
        ]
    }
    ,plugins: [
          new ExtractTextPlugin('style.css')
        , new CopyWebpackPlugin([
            // Copy directory contents to {output}/to/directory/
            { from: 'index.html', to: 'index.html' }
        ])
    ]
    ,watch: true
};

module.exports = config;
