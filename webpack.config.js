const path = require('path');

module.exports = {
  // ... your config
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
