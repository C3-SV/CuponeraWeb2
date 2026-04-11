import Stripe from "stripe";
import { env } from "../../config/env.js";
import { HttpError } from "../../lib/http.js";

let stripe = null;

const getStripe = () => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new HttpError(503, "Falta STRIPE_SECRET_KEY en el servidor.");
  }

  if (!stripe) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripe;
};

export const createPaymentIntent = async (req, res) => {
  const { amountCents, cart } = req.body ?? {};

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new HttpError(400, "El monto enviado no es válido.");
  }

  const paymentIntent = await getStripe().paymentIntents.create({
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

  res.json({
    ok: true,
    status: paymentIntent.status,
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
  });
};
