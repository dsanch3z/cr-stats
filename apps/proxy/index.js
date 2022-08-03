const https = require("https");

const { CR_API_TOKEN, CR_API_BASE_URL } = process.env;

exports.handler = async (event) => {
  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
    };
  }

  try {
    const qs = event.rawQueryString ? `?${event.rawQueryString}` : "";
    const url = CR_API_BASE_URL + event.rawPath + qs;
    return await request(url, event.headers);
  } catch (err) {
    console.error("Error ", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err.message,
      }),
    };
  }
};

function isAuthenticated(event = {}) {
  const headers = event.headers;
  const authorization = headers ? headers["authorization"] : null;

  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      const parts = authorization.split("Bearer ");
      const token = parts[1];

      return token === CR_API_TOKEN;
    }
  }

  return false;
}

function request(url = "", headers = {}) {
  const options = {
    headers: {
      Authorization: headers["authorization"],
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.get(url, options, (res) => {
      let data = [];

      res.on("data", (chunk) => {
        data.push(chunk);
      });

      res.on("end", () => {
        try {
          const json = Buffer.concat(data).toString();
          const result = JSON.parse(json);
          resolve(result);
        } catch (err) {
          console.error("Error parsing response", err);
          reject(err);
        }
      });
    });

    req.on("error", (err) => reject(err));
    req.end();
  });
}
