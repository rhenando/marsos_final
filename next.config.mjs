// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/socket.io/:path*",
        destination: "http://localhost:3001/socket.io/:path*", // Adjust if your Socket.IO server is on another port or URL
      },
    ];
  },
};

export default nextConfig;
