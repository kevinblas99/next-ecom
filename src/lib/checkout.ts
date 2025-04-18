// lib/checkout.ts

import Stripe from 'stripe';
import { ShoppingCart } from '../lib/db/cart'; // Assuming ShoppingCart type is defined in cart.ts

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
});

export async function createCheckoutSession(cart: ShoppingCart): Promise<Stripe.Checkout.Session> {
  const items = cart.items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.product.name,
        images: [item.product.imageUrl],
      },
      unit_amount: item.product.price * 100, // Stripe uses cents, so multiply by 100
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
  });

  return session;
}
