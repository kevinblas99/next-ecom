// components/CheckoutForm.tsx

import { CartItemWithProduct } from '@/lib/db/cart';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { useState } from 'react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  cartItems: CartItemWithProduct[]; // Array of cart items
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ cartItems }) => {

  const redirectToCheckout = async () => {

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Failed to load Stripe.');
      }

      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }), // Send cart items to the server
      });

      const session = await response.json();
      
      if (response.ok) {
        const result = await stripe.redirectToCheckout({
          sessionId: session.sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } else {
        throw new Error(session.error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle error (e.g., show error message to the user)
    } finally {
    }
  };

  return (
    <button onClick={redirectToCheckout} >
      Checkout
    </button>
  );
};

export default CheckoutForm;
