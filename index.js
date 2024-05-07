const { app, setupRoutes } = require("./routes");
const { generateQRCode, findLocalIpAddress } = require("./utils");
const { PORT } = require("./constants");

async function startServer() {
  setupRoutes();
  const localIpAddress = findLocalIpAddress();
  const serverUrl = `http://${localIpAddress}:${PORT}`;
  const qrCode = await generateQRCode(serverUrl);
  console.log("QR code:");
  console.log(qrCode);
  app.listen(PORT, () => {
    console.log(`Server is running at ${serverUrl}`);
  });
}

startServer();
