import { Hono } from "hono";

import { app as handlerApp } from "@/apps/handler/entry-server.ts";

/**
 * Simple dev server for grouping all apps together into one Hono instance
 * to be able to use @hono/vite-dev-server.
 * DEV purpose only.
 */
const server = new Hono();

server.route("/", handlerApp);

export default server;
