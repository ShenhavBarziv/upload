const os = require("os");
const qr = require("qrcode");

function findLocalIpAddress() {
  const nets = os.networkInterfaces();
  const results = Object.create(null);

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
      if (net.family === familyV4Value && !net.internal) {
        if (!results[name]) {
          results[name] = [];
        }
        results[name].push(net.address);
      }
    }
  }

  return results["Wi-Fi"][0]; // Assuming Wi-Fi network is used
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
