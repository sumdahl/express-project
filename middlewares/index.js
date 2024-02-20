const fs = require("fs");

function logReqRes(filename) {
  return (req, res, next) => {
    const timeStamp = new Date();
    fs.appendFile(
      filename,
      `${timeStamp.toLocaleString()} : ${req.ip} : ${req.method} : ${
        req.path
      }\n`,
      (err, data) => {
        next();
      }
    );
  };
}

module.exports = {
  logReqRes,
};
