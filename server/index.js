import express from "express";
import cors from "cors";
import "dotenv/config";
import Stripe from "stripe";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.get("/", (req, res) => res.send("OK"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/pay", async (req, res) => {
  try {
    const { amountCents, cart } = req.body;

    if (!Number.isInteger(amountCents) || amountCents <= 0) {
      return res.status(400).json({ ok: false, status: "invalid_amount" });
    }

    const pi = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "usd",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      payment_method: "pm_card_visa",
      confirm: true,
      description: "MVP académico - pago simulado",
      metadata: {
        cartItems: Array.isArray(cart) ? String(cart.length) : "0",
      },
    });

    // Frontend necesita:
    return res.json({ ok: true, status: pi.status });
  } catch (err) {

    return res.status(500).json({
      ok: false,
      status: "error",
      error: err?.message ?? "Stripe error",
    });
  }
});

app.listen(process.env.PORT || 4242, () => {
  console.log(`Backend running on http://localhost:${process.env.PORT || 4242}`);
});