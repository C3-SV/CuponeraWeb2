import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, status: "method_not_allowed" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, status: "invalid_json" }),
    };
  }

  const { amountCents, cart } = body;

  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, status: "invalid_amount" }),
    };
  }

  try {
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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        status: pi.status,
        paymentIntentId: pi.id,
        amount: pi.amount,
        currency: pi.currency,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        status: "error",
        error: err?.message ?? "Stripe error",
      }),
    };
  }
};
