import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(req: Request) {
  try {
    const { cart } = await req.json();

    // Validate cart
    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Get current origin (works locally + production)
    const origin =
      req.headers.get("origin") || "http://localhost:3000";

    const lineItems = cart.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${item.name} (${item.color} / ${item.size})`,
        },
        unit_amount: Math.round(item.price * 100), // convert to cents safely
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      // Collect shipping address
      shipping_address_collection: {
        allowed_countries: ["US"],
      },

      // Collect phone number
      phone_number_collection: {
        enabled: true,
      },

      success_url: `${origin}/success`,
      cancel_url: `${origin}`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("Stripe Checkout Error:", error);

    return NextResponse.json(
      { error: "Stripe session creation failed." },
      { status: 500 }
    );
  }
}