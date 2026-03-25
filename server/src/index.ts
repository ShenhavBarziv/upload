import { app, setupRoutes } from './routes';
import { generateQRCode, findLocalIpAddress, openFile } from './utils';
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

    const { ascii, imagePath } = await generateQRCode(publicUrl);
    console.log('QR code:');
    console.log(ascii);
    app.listen(PORT, () => {
      console.log(`Server is running at ${serverUrl}`);
      if (useNgrok) {
        console.log(`Public URL: ${publicUrl}`);
      }
      openFile(imagePath).catch((err) => {
        console.error('Failed to open the QR code image automatically:', err);
      });
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}

startServer();
