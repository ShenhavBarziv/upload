# Easy File Upload Application

This repository now contains a Node.js backend and a React (TypeScript) frontend built with Material UI. It provides a user-friendly way to upload files from any device over your local network.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn) installed on your PC.

### Installation

1. Clone this repository or download the project files.
2. Open a terminal in the project directory.
3. Run `npm install` to install the server dependencies.
4. Navigate to the `client` directory and run `npm install` to install the frontend dependencies.

## Usage

1. Build the TypeScript server with `npm run build`.
2. Build the frontend using `npm run client:build`. During development you can run `npm run client` to start the React dev server.
3. Start the backend with `npm start`. Set the environment variable `USE_NGROK=true` before starting if you want to expose the server publicly.
4. Once started, the terminal will display the server address and a QR code for quick access. If ngrok is enabled, a public URL will also be shown.
5. Open the address in a browser (or scan the QR code) to use the web interface.

Run `npm test` to execute the automated tests.

## Features

- **Easy File Upload**: Upload files from any device connected to the same network.
- **QR Code Access**: Scan the QR code displayed in the terminal to quickly access the web interface from your device.
- **File Management**: View and download uploaded files through the application’s interface.
- **Public Sharing**: Set `USE_NGROK=true` to get a temporary public URL via ngrok so others can access your server.

## Dependencies

- [Express](https://expressjs.com/): Web framework for Node.js applications.
- [Multer](https://www.npmjs.com/package/multer): Middleware for handling multipart/form-data, primarily used for file uploads.
- [QRCode](https://www.npmjs.com/package/qrcode): Library for generating QR codes.
- [React](https://reactjs.org/) and [Material UI](https://mui.com/) for the frontend interface.
- [ngrok](https://ngrok.com/): Optional tunneling service to share your server outside the local network.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions to the Easy File Upload Application! To get started, please refer to our [Contributing Guide](CONTRIBUTING.md) for detailed instructions.

## Feedback

If you have feedback or suggestions, please [open an issue](https://github.com/ShenhavBarziv/upload/issues) on GitHub or contact us directly.
