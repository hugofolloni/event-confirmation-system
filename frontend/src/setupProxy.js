
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
    'http://localhost:9000/.netlify/functions/server/api',
    createProxyMiddleware({
      target: 'http://localhost:3000/api',
      changeOrigin: true,
    })
  );
};