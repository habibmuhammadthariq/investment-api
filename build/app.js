import express, { static as ExpressStatic } from "express";
import Middleware from "./middleware/index.js";
import router from "./router.js";
export async function createApp() {
    const app = express();
    const middleware = new Middleware(app);
    middleware.registerBeforeRoutes();
    app.use("/assets", ExpressStatic("src/assets"));
    app.use("/v1", router());
    middleware.registerAfterRoutes();
    return app;
}
