import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["avatars.githubusercontent.com",
              "lh3.googleusercontent.com",
              "res.cloudinary.com",
              "images.unsplash.com",
              "images.stockcake.com"
    ],
             
  },
};

export default nextConfig;
