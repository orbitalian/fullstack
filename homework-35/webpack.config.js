const path                  = require('path');
const HtmlWebpackPlugin     = require('html-webpack-plugin');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const CssMinimizerPlugin    = require('css-minimizer-webpack-plugin');
const TerserPlugin          = require('terser-webpack-plugin');
const ESLintPlugin          = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}, argv = {}) => {
  const isDev     = argv.mode !== 'production';
  const isAnalyze = !!env.analyze;

  return {

    // --- Точка входу ---
    entry: {
      main: './src/js/index.js',
      app:  './src/ts/app.ts',
    },

    // --- Вихід з хешуванням ---
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'js/[name].[contenthash:8].js',
      assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
      publicPath: './',
      clean: true,
    },

    // =============================================
    // 1. DevServer — автоперезавантаження
    // =============================================
    devServer: {
      static: path.join(__dirname, 'dist'),
      port: 3000,
      hot: true,
      open: true,
      compress: true,
      historyApiFallback: true,
      devMiddleware: {
        writeToDisk: true,
      },
    },

    devtool: isDev ? 'source-map' : false,

    // =============================================
    // Резолюція файлів
    // =============================================
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },

    // =============================================
    // Модулі — лоадери
    // =============================================
    module: {
      rules: [

        // 2. Зовнішній CSS
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },

        // 3a. LESS
        {
          test: /\.less$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
          ],
        },

        // 3b. SCSS / SASS
        {
          test: /\.(scss|sass)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                api: 'modern', // використовуємо новий API замість legacy
              },
            },
          ],
        },

        // 4. TypeScript → через ts-loader
        {
          test: /\.ts$/i,
          use: 'ts-loader',
          exclude: /node_modules/,
        },

        // 5. JavaScript → Babel (транспіляція для старих браузерів)
        {
          test: /\.js$/i,
          use: 'babel-loader',
          exclude: /node_modules/,
        },

        // Шрифти
        {
          test: /\.(woff|woff2|ttf|eot)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[contenthash:8][ext]',
          },
        },

        // Зображення
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: { maxSize: 8 * 1024 },
          },
          generator: {
            filename: 'images/[name].[contenthash:8][ext]',
          },
        },

      ],
    },

    // =============================================
    // Плагіни
    // =============================================
    plugins: [

      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: !isDev,
      }),

      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
      }),

      // 6. ESLint — перевірка коду під час збірки
      new ESLintPlugin({
        extensions: ['js', 'ts'],
        emitWarning: isDev,          // у dev — попередження, у prod — помилка
      }),

      // 7. Bundle Analyzer — запускається лише через npm run analyze
      ...(isAnalyze ? [new BundleAnalyzerPlugin()] : []),

    ],

    // =============================================
    // Оптимізація
    // =============================================
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: !isDev },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      },
    },

  };
};