import path from "node:path";
import {fileURLToPath} from "node:url";
const directory=path.dirname(fileURLToPath(import.meta.url));
/** @type {import('next').NextConfig} */
const config={outputFileTracingRoot:path.join(directory,"../..")};
export default config;
