import "dotenv/config";
import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  target: process.env.CR_API_BASE_URL,
  changeOrigin: true,
});
const server = http.createServer(function (req, res) {
  proxy.web(req, res);
});

console.log("listening on port 8080");
server.listen(8080);
