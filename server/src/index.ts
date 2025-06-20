import { app, setupRoutes } from './routes';
import { generateQRCode, findLocalIpAddress } from './utils';
import { PORT } from './constants';
import dotenv from "dotenv";
dotenv.config();
// Optionally expose the server via ngrok when USE_NGROK=true

async function startServer(): Promise<void> {
  try {
    setupRoutes();
    const localIpAddress = findLocalIpAddress();
    const serverUrl = `http://${localIpAddress}:${PORT}`;
    console.log("env: ", process.env.USE_NGROK)
    const useNgrok = process.env.USE_NGROK === 'true';
    let publicUrl = serverUrl;

    if (useNgrok) {
      try {
        const ngrok = await import('ngrok');
        publicUrl = await ngrok.connect({ addr: PORT });
      } catch (err) {
        console.error('Failed to start ngrok. Is it installed?', err);
      }
    }

    const qrCode = await generateQRCode(publicUrl);
    console.log('QR code:');
    console.log(qrCode);
    app.listen(PORT, () => {
      console.log(`Server is running at ${serverUrl}`);
      if (useNgrok) {
        console.log(`Public URL: ${publicUrl}`);
      }
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();
