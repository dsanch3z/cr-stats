require("dotenv").config();
const url = require("url");
const { handler } = require("./index");

module.exports = async function (req, _) {
  const urlObj = url.parse(req.url);

  return handler({
    headers: req.headers,
    rawPath: urlObj.pathname,
    rawQueryString: urlObj.query,
  });
};
