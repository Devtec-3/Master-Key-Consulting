import express, { type Express } from "express";
import cors from "cors";
import session from "express-session";
import pinoHttp from "pino-http"; // Go back to the standard import
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// FIX 1: Tell Express to trust Vercel's HTTPS proxy (Crucial for secure cookies!)
app.set("trust proxy", 1);

// FIX 2: Cast pinoHttp as 'any' to completely destroy the TS2349 call signature error
app.use(
  (pinoHttp as any)({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "masterkey-secret-2025",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);

app.use("/api", router);

export default app;
