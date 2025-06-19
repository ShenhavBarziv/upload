import { app, setupRoutes } from './routes';
import { generateQRCode, findLocalIpAddress } from './utils';
import { PORT } from './constants';

async function startServer(): Promise<void> {
  try {
    setupRoutes();
    const localIpAddress = findLocalIpAddress();
    const serverUrl = `http://${localIpAddress}:${PORT}`;
    const qrCode = await generateQRCode(serverUrl);
    console.log('QR code:');
    console.log(qrCode);
    app.listen(PORT, () => {
      console.log(`Server is running at ${serverUrl}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();
