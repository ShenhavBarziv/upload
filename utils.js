const os = require("os");
const qr = require("qrcode");

function findLocalIpAddress() {
  var ip = "0.0.0.0";
  var ips = os.networkInterfaces();
  Object.keys(ips).forEach(function (_interface) {
    ips[_interface].forEach(function (_dev) {
      if (_dev.family === "IPv4" && !_dev.internal) ip = _dev.address;
    });
  });
  return ip;
}

async function generateQRCode(url) {
  return new Promise((resolve, reject) => {
    qr.toString(
      url,
      { type: "terminal", width: 10, height: 10 },
      (err, qrCode) => {
        if (err) {
          reject(err);
        } else {
          resolve(qrCode);
        }
      }
    );
  });
}

module.exports = {
  findLocalIpAddress,
  generateQRCode,
};
