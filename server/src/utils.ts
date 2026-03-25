import os from 'os';
import qr from 'qrcode';
import { execSync } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';

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

export async function openQRCodeInWindow(url: string): Promise<void> {
  const qrDataUrl = await qr.toDataURL(url, { width: 360, margin: 1 });
  const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Upload QR Code</title>
    <style>
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #f6f8fa;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .card {
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        padding: 24px;
        text-align: center;
      }
      img {
        width: 300px;
        height: 300px;
      }
      p {
        margin-top: 12px;
        font-size: 14px;
        color: #444;
      }
      code {
        display: inline-block;
        max-width: 320px;
        overflow-wrap: anywhere;
        margin-top: 6px;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h2>Scan to Open Upload</h2>
      <img src="${qrDataUrl}" alt="Upload QR code" />
      <p>URL:</p>
      <code>${url}</code>
    </div>
  </body>
</html>`;

  const filePath = path.join(os.tmpdir(), 'upload-qr-code.html');
  await writeFile(filePath, htmlContent, 'utf8');

  const openCommand = process.platform === 'win32'
    ? `start "" "${filePath}"`
    : process.platform === 'darwin'
      ? `open "${filePath}"`
      : `xdg-open "${filePath}"`;

  execSync(openCommand, { stdio: 'ignore' });
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
