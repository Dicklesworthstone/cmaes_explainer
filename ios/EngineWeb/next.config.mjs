// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(configDirectory, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  reactStrictMode: true,
  reactCompiler: true,
  images: { unoptimized: true },
  turbopack: {
    root: repositoryRoot,
    rules: {},
  },
};

export default nextConfig;
