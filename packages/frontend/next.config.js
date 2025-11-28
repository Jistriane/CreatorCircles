const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, 'certs');
const httpsOptions = fs.existsSync(certDir)
  ? {
      key: fs.readFileSync(path.join(certDir, 'localhost.key')),
      cert: fs.readFileSync(path.join(certDir, 'localhost.crt')),
    }
  : undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  },
  // server: {
  //   https: httpsOptions,
  //   port: 3001,
  // },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self' http://localhost:3001 ws://localhost:3001 https://fullnode.devnet.sui.io/;",
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
