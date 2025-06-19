import os from 'os';
import qr from 'qrcode';

export function findLocalIpAddress(): string {
  let ip = '0.0.0.0';
  const interfaces = os.networkInterfaces();
  Object.keys(interfaces).forEach((name) => {
    const ips = interfaces[name];
    ips?.forEach((dev) => {
      if (dev.family === 'IPv4' && !dev.internal) ip = dev.address;
    });
  });
  return ip;
}

export async function generateQRCode(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    qr.toString(url, { type: 'terminal', width: 10 }, (err, qrCode) => {
      if (err) {
        reject(err);
      } else {
        resolve(qrCode);
      }
    });
  });
}
