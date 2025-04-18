{/* import { NextApiRequest, NextApiResponse } from 'next';
import { CartItemWithProduct, getCart } from '@/lib/db/cart';
import { createCheckoutSession } from '@/lib/checkout';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body; // Assuming you send the userId in the request body

      // Get the user's cart based on the userId
      const cart = await getCart(userId);

      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }

      // Create a checkout session using Stripe
      const session = await createCheckoutSession(cart);

      // Send the session ID back to the client
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Error creating checkout session' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

/*}

{/* import { NextApiRequest, NextApiResponse } from 'next';
import { getCart } from '@/lib/db/cart';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if (req.method === 'POST') {
      try {
        const cart = await getCart();
        const line_items = cart?.map((item) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              images: [item.product.imageUrl],
            },
            unit_amount: item.product.price,
          },
          quantity: item.quantity,
        }));
  
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          line_items: line_items,
          mode: 'payment',
          success_url: `${req.headers.origin}/?success=true`,
          cancel_url: `${req.headers.origin}/?canceled=true`,
          automatic_tax: { enabled: true },
        });
        res.redirect(303, session.url);
      } catch (err: any) {
        console.error('Error creating checkout session:', err);
        res.status(err.statusCode || 500).json({ error: err.message });
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  }


*/}

{/* import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { CartItemWithProduct } from '@/lib/db/cart';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if (req.method === 'POST') {
      try {
        // Validate the cart details that were sent from the client.
        const cartItems = req.body;
        const line_items = cartItems.map((item: CartItemWithProduct) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.product.name,
              images: [item.product.imageUrl],
            },
            unit_amount: item.product.price,
          },
          quantity: item.quantity,
        }));
        // Create Checkout Sessions from body params.
        const params: Stripe.Checkout.SessionCreateParams = {
          submit_type: 'pay',
          payment_method_types: ['card'],
          billing_address_collection: 'auto',
          shipping_address_collection: {
            allowed_countries: ['US', 'CA'],
          },
          line_items,
          success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/cart`,
        };
        const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
          params
        );
  
        res.status(200).json(checkoutSession);
      } catch (err) {
        res.status(500).json({ statusCode: 500, message: (err as Error).message });
      }
    } else {
      res.setHeader('Allow', 'POST');
      res.status(405).end('Method Not Allowed');
    }
  } 
*/}

  // Import necessary modules and functions
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createCheckoutSession } from '@/lib/checkout'; // Import the createCheckoutSession function
import { CartItemWithProduct } from '@/lib/db/cart';

// Initialize the Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Validate the cart details that were sent from the client.
      const cartItems: CartItemWithProduct[] = req.body;

      // Create the line items for the checkout session
      const lineItems = cartItems.map((item: CartItemWithProduct) => ({
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

      // Create Checkout Sessions from body params using createCheckoutSession function
      const session: Stripe.Checkout.Session = await createCheckoutSession(lineItems as any);

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error('Error creating checkout session:', err);
      res.status(500).json({ error: 'Error creating checkout session' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
