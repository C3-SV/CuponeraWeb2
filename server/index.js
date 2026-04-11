import express from "express";
import cors from "cors";
import "./src/config/load-env.js";
import { env } from "./src/config/env.js";
import { errorHandler, asyncHandler, notFoundHandler } from "./src/lib/http.js";
import { authRouter } from "./src/modules/auth/auth.routes.js";
import { adminRouter } from "./src/modules/admin/admin.routes.js";
import { createPaymentIntent } from "./src/modules/pay/pay.handlers.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_ORIGIN || true,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => res.send("OK"));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.post("/pay", asyncHandler(createPaymentIntent));
app.post("/api/pay", asyncHandler(createPaymentIntent));

app.use("/api/auth", authRouter);
app.use("/api/admin", adminRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
