const path                = require('path');
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin  = require('css-minimizer-webpack-plugin');
const TerserPlugin        = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {

  // --- Точка входу ---
  entry: './src/js/index.js',

  // --- Вихідна папка з хешуванням імен ---
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',   // хеш у назві JS
    assetModuleFilename: 'assets/[name].[contenthash:8][ext]',
    clean: true,                                  // очищати dist перед збіркою
  },

  // --- Dev Server (livereload) ---
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 3000,
    hot: true,
    open: true,
  },

  // --- Source maps для розробки ---
  devtool: isDev ? 'source-map' : false,

  // --- Модулі ---
  module: {
    rules: [

      // CSS
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,            // витягує CSS в окремий файл
          'css-loader',
        ],
      },

      // Шрифти (локальні .woff, .woff2, .ttf, .eot)
      {
        test: /\.(woff|woff2|ttf|eot)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]',
        },
      },

      // Зображення (.png, .jpg, .jpeg, .gif, .svg, .webp)
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,                    // < 8kb → base64, інакше файл
          },
        },
        generator: {
          filename: 'images/[name].[contenthash:8][ext]',
        },
      },

    ],
  },

  // --- Плагіни ---
  plugins: [

    // Генерує index.html і автоматично підключає всі збірки
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename:  'index.html',
      minify: !isDev,
    }),

    // Витягує CSS в окремий файл з хешем
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),

  ],

  // --- Оптимізація ---
  optimization: {
    minimizer: [
      // Мінімізація JS
      new TerserPlugin({
        terserOptions: {
          compress: { drop_console: true },       // прибрати console.log у production
        },
      }),
      // Мінімізація CSS
      new CssMinimizerPlugin(),
    ],

    // Виносимо зовнішні бібліотеки в окремий chunk (vendor)
    // Це зменшує розмір основної збірки і дозволяє браузеру
    // кешувати бібліотеки окремо від коду проекту
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
