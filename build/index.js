import { createApp } from "./app.js";
import { port } from "./config/server.js";
import { Server } from "./server.js";
const server = new Server(await createApp());
await server.start(port);
console.log(`[server]: Server is running at ${server.url}`);
export default server;
