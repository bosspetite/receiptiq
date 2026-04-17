import "./env.js";
import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { expensesRouter } from "./routes/expenses.routes.js";
import { uploadRouter } from "./routes/upload.routes.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

const configuredOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

function isDevLanOrigin(origin) {
    try {
        const u = new URL(origin);
        const { hostname } = u;
        if (hostname === "localhost" || hostname === "127.0.0.1") return true;
        if (/^10\.\d+\.\d+\.\d+$/.test(hostname)) return true;
        if (/^192\.168\.\d+\.\d+$/.test(hostname)) return true;
        if (/^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname)) return true;
        return false;
    } catch {
        return false;
    }
}

const corsOptions = {
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }
        if (
            configuredOrigins.includes(origin) ||
            configuredOrigins.includes("*")
        ) {
            return callback(null, true);
        }
        if (process.env.NODE_ENV !== "production" && isDevLanOrigin(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
    res.redirect(307, "/api/health");
});

app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/expenses", expensesRouter);
app.use("/api/upload", uploadRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log("");
    console.log(`  ReceiptIQ API  →  http://localhost:${PORT}`);
    console.log(`  Health check   →  http://localhost:${PORT}/api/health`);
    console.log("");
});
