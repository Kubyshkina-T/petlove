
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftp.goit.study",
        pathname: "/img/pets/**",
      },
      {
        protocol: "https",
        hostname: "ftp.goit.study",
        pathname: "/img/petsfriends/**",
      },
    ],
  },
};

export default nextConfig;
