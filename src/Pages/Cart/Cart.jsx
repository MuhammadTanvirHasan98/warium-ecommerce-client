import { useState, useEffect } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";

export default function CartPage() {
  const [cart] = useCart();

  // 🟢 Convert backend data → UI state (so quantity updates instantly)
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const formatted = cart.map((item) => ({
      id: item._id,
      name: item.productName,
      price: Number(item.price),
      quantity: item.quantity,
      image: item.images?.[0]?.[0] || "/placeholder.svg",
      size: item.size,
      color: item.color,
    }));
    setCartItems(formatted);
  }, [cart]);

  // 🟢 Increase Quantity
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // 🟢 Decrease Quantity (remove if zero)
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 🟢 Remove item
  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 🟢 Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const vatRate = 0.2;
  const vat = subtotal * vatRate;
  const total = subtotal + vat;

  // 🟠 Empty Cart Page
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="mb-12 text-lg text-gray-600">Manage your items</p>

          <div className="flex h-96 items-center justify-center rounded-lg border-2 border-gray-200 bg-gray-50">
            <div className="text-center">
              <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="mb-6 text-lg text-gray-600">Your cart is empty</p>
              <Link to="/">
                <button className="rounded-lg bg-black px-8 py-3 font-semibold text-white hover:bg-gray-800 active:scale-95">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // 🟢 Cart Page With Items
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
        <p className="text-lg text-gray-600 mb-8">
          {cartItems.length} item(s) in your cart
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-all"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 object-cover rounded-lg bg-gray-100"
                />

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      ${item.price.toFixed(2)} each
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {item.size} • Color: {item.color}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-8 h-8 border border-gray-300 rounded-md bg-gray-50 font-bold hover:bg-gray-100"
                    >
                      −
                    </button>

                    <span className="font-semibold text-gray-900 w-6 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-8 h-8 border border-gray-300 rounded-md bg-gray-50 font-bold hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Item Total / Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-full hover:bg-red-100"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div>
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Order Summary
              </h2>

              <div className="border-b border-gray-200 pb-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub-Total:</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">VAT (20%):</span>
                  <span className="font-semibold text-gray-900">
                    ${vat.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-black">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/checkout">
                  <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 active:scale-95">
                    Proceed to Checkout
                  </button>
                </Link>

                <Link to="/">
                  <button className="w-full border-2 border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 active:scale-95">
                    Continue Shopping
                  </button>
                </Link>
              </div>

              <div className="mt-6 bg-gray-50 border border-gray-200 p-4 rounded-lg">
                <p className="text-xs text-gray-600">✓ Free shipping over $100</p>
                <p className="text-xs text-gray-600 mt-1">✓ 30-day easy returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
