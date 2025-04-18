// Import necessary modules/components
'use client';

import { getCart } from "@/lib/db/cart";
import { formatPrice } from "@/lib/format";
import CartEntry from "./CartEntry";
import { setProductQuantity } from "./actions";
import CheckoutForm from "@/components/CheckoutForm";
import { ShoppingCart } from "@/lib/db/cart";
import { useState } from "react";
import { useEffect } from "react";

// Define metadata if needed
// Define the CartPage component
export default function CartPage() {
  // Define state to hold cart items
  const [cart, setCart] = useState<ShoppingCart | null>(null);

  // Fetch cart items when component mounts
  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getCart();
        setCart(cartData);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
    fetchCart();
  }, []);

  // Render the component
  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Shopping Cart</h1>
      {cart?.items.map((cartItem) => (
        <CartEntry
          cartItem={cartItem}
          key={cartItem.id}
          setProductQuantity={setProductQuantity}
        />
      ))}
      {!cart?.items.length && <p>Your cart is empty.</p>}
      <div className="flex flex-col items-end sm:items-center">
        <p className="mb-3 font-bold">
          Total: {formatPrice(cart?.subtotal || 0)}
        </p>
        {/* Pass cartItems to CheckoutForm */}
        <CheckoutForm cartItems={cart?.items || []} />
      </div>
    </div>
  );
}
