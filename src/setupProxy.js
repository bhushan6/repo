const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/assessments/films",
    createProxyMiddleware({
      target: "https://app.codescreen.com",
      changeOrigin: true,
    })
  );
};
