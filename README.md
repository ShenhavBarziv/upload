# Easy File Upload Application

This Node.js application provides a user-friendly way to upload files from your phone or any other device to your PC. It allows you to quickly transfer files over a local network using a simple web interface.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed on your PC.

### Installation

1. Clone this repository or download the project files.
2. Open a terminal in the project directory.
3. Run `npm install` (or `yarn install`) to install the required dependencies.

## Usage

1. Run the application using `npm start` (or `yarn start`).
2. Once started, the application will provide a local address in the terminal.
3. The terminal will also display a QR code. You can scan this QR code using your device's camera app to directly access the application interface without having to manually type the address.
4. Open a web browser on your device (phone, tablet, or computer).
5. Enter the provided address manually in the browser's address bar or use the QR code to navigate to the application.
6. You will be directed to the application interface where you can choose to upload files.
7. Select the file you want to upload from your device.
8. The file will be transferred to your PC and saved in the specified directory.

## Features

- **Easy File Upload**: Upload files from any device connected to the same network.
- **QR Code Access**: Scan the QR code displayed in the terminal to quickly access the web interface from your device.
- **File Management**: View and download uploaded files through the application’s interface.

## Dependencies

- [Express](https://expressjs.com/): Web framework for Node.js applications.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data, primarily used for file uploads.
- [QRCode](https://www.npmjs.com/package/qrcode): Library for generating QR codes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions to the Easy File Upload Application! To get started, please refer to our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

## Feedback

If you have feedback or suggestions, please [open an issue](https://github.com/ShenhavBarziv/upload/issues) on GitHub or contact us directly.
