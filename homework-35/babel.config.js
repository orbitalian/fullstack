module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead', // підтримка браузерів з часткою > 0.25%
        useBuiltIns: false,
      },
    ],
  ],
};
