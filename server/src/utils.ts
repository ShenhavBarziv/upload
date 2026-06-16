import os from 'os';
import path from 'path';
import qr from 'qrcode';
import { execSync, execFile } from 'child_process';

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

export interface QRCodeResult {
  ascii: string;
  imagePath: string;
}

export async function generateQRCode(url: string): Promise<QRCodeResult> {
  const ascii = await new Promise<string>((resolve, reject) => {
    qr.toString(url, { type: 'terminal', width: 10 }, (err, qrCode) => {
      if (err) {
        reject(err);
      } else {
        resolve(qrCode);
      }
    });
  });

  const imagePath = await createTempQrImage(url);
  return { ascii, imagePath };
}

async function createTempQrImage(url: string): Promise<string> {
  const filePath = path.join(os.tmpdir(), `easy-upload-qr-${Date.now()}.png`);
  await new Promise<void>((resolve, reject) => {
    qr.toFile(filePath, url, { type: 'png', width: 256 }, (err?: Error | null) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return filePath;
}

export async function openFile(filePath: string): Promise<void> {
  const platform = process.platform;
  const command = platform === 'darwin' ? 'open' : platform === 'win32' ? 'cmd' : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', filePath] : [filePath];

  await new Promise<void>((resolve, reject) => {
    execFile(command, args, { shell: false }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function checkNgrokInstalled(minVersion = '3.7.0'): boolean {
  try {
    const versionOutput = execSync('ngrok version').toString().trim();
    const versionMatch = versionOutput.match(/(\d+\.\d+\.\d+)/);

    if (!versionMatch) {
      throw new Error('Unable to parse ngrok version.');
    }

    const installed = versionMatch[1];
    const isValid = compareVersions(installed, minVersion) >= 0;

    if (!isValid) {
      throw new Error(`Ngrok version too old. Installed: ${installed}, Required: ${minVersion}`);
    }

    console.log(`✅ Ngrok version ${installed} is OK`);
    return true;
  } catch (err: any) {
    console.error(`❌ Ngrok validation failed:`, err.message);
    return false;
  }
}

function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return 1;
    if ((pa[i] || 0) < (pb[i] || 0)) return -1;
  }
  return 0;
}
