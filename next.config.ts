import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Sesuaikan dengan kebutuhan Anda (misalnya '10mb')
    },
  },
};

export default nextConfig;
