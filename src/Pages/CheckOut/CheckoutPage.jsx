import React, { useState, useMemo } from "react";
import useCart from "../../hooks/useCart";
import UseAuth from "../../hooks/UseAuth";

import useAxiosPublic from "../../hooks/useAxiosPublic";

export default function CheckoutPage() {
  // const [coupon, setCoupon] = useState("");
  const [delivery, setDelivery] = useState("free");

  // Billing form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  const [cartItems] = useCart();
  const { user } = UseAuth();
  const axiosPublic = useAxiosPublic();

  // Calculate Subtotal
  const subTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return total + price * qty;
    }, 0);
  }, [cartItems]);

  // Delivery Charge
  const deliveryCharge = delivery === "flat" ? 80 : 0;

  // Final Total
  const totalAmount = subTotal + deliveryCharge;

  // -------------------------------
  // HANDLE PAYMENT SUBMIT
  // -------------------------------
  console.log("Cart Items:", cartItems);
  const handleCreatePayment = async () => {
    if (!firstName || !lastName || !address || !city || !country || !phone) {
      alert("Please fill all required billing fields!");
      return;
    }

    const paymentInfo = {
      email: user?.email,
      price: Number(totalAmount.toFixed(2)),
      transactionId: "",
      date: new Date(),
      status: "pending",
      cartIds: cartItems.map(item => item._id),
      menuItemIds: cartItems.map(item => item.ProductMainID),

      // Extra user billing info for backend if needed
      customerName: `${firstName} ${lastName}`,
      customerPhone: phone,
      customerAddress: address,
      customerCity: city,
      customerPostcode: postcode,
      customerCountry: country
    };

    console.log("Sending Payment Data:", paymentInfo);

    try {
      const response = await axiosPublic.post(
        "/create-ssl-payment",
        paymentInfo
      );

      console.log("Payment Session:", response.data);

      if (response.data?.url) {
        window.location.replace(response.data.url);
      } else {
        alert("Something went wrong! No payment URL received");
      }
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        {/* Billing Details Form */}
        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold mb-3">Billing Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <input
              className="border p-2 rounded"
              placeholder="First Name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            {/* Last Name */}
            <input
              className="border p-2 rounded"
              placeholder="Last Name *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <input
            className="border p-2 rounded w-full mt-3"
            placeholder="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Address */}
          <input
            className="border p-2 rounded w-full mt-3"
            placeholder="Address Line 1 *"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              className="border p-2 rounded"
              placeholder="City *"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              placeholder="Post Code"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />
          </div>

          <input
            className="border p-2 rounded w-full mt-3"
            placeholder="Country *"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />

          {/* Submit */}
          <button
            onClick={handleCreatePayment}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            PLACE ORDER
          </button>
        </div>
      </div>

      {/* RIGHT - ORDER SUMMARY */}
      <div className="space-y-6">
        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold mb-3">Order Summary</h2>

          {cartItems.length > 0 ? (
            <div className="space-y-4 border-b pb-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <img
                    src={item.images[0]}
                    alt={item.productName}
                    className="w-16 h-16 rounded object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-500">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm">
                      Qty: <span className="font-semibold">{item.quantity}</span>
                    </p>
                  </div>

                  <p className="font-semibold">
                    TK {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No items in cart.</p>
          )}

          {/* PRICE DETAILS */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Sub-Total</span>
              <span>TK {subTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>TK {deliveryCharge.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg mt-2">
              <span>Total Amount</span>
              <span>TK {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* DELIVERY METHOD */}
        <div className="border rounded-lg p-5 shadow-sm">
          <h2 className="font-semibold mb-3">Delivery Method</h2>

          <label className="flex items-center space-x-2 mb-2">
            <input
              type="radio"
              name="delivery"
              checked={delivery === "free"}
              onChange={() => setDelivery("free")}
            />
            <span>Free Shipping (TK 0.00)</span>
          </label>

          <label className="flex items-center space-x-2 mb-2">
            <input
              type="radio"
              name="delivery"
              checked={delivery === "flat"}
              onChange={() => setDelivery("flat")}
            />
            <span>Flat Rate (TK 80.00)</span>
          </label>
        </div>
      </div>
    </div>
  );
}




// import React, { useState, useMemo } from "react";
// import useCart from "../../hooks/useCart";
// import UseAuth from "../../hooks/UseAuth";
// import useAxiosSecure from "../../hooks/UseAxiosSecure";
//  // your cart hook

// export default function CheckoutPage() {
//   const [coupon, setCoupon] = useState("");
//   const [delivery, setDelivery] = useState("free");
//   // const [payment, setPayment] = useState("cod");
//   const [cartItems] = useCart();
//   const { user } = UseAuth();
//   const axiosSecure = useAxiosSecure();
//   console.log(cartItems);



//   // ---- Calculate Subtotal ----
//   const subTotal = useMemo(() => {
//     return cartItems.reduce((total, item) => {
//       const price = Number(item.price) || 0;
//       const quantity = Number(item.quantity) || 1;
//       return total + price * quantity;
//     }, 0);
//   }, [cartItems]);


//   // ---- Delivery Charge ----
//   const deliveryCharge = delivery === "flat" ? 80 : 0;

//    // ---- Total Amount ----
//   const totalAmount = subTotal + deliveryCharge;

//   console.log('User:', user?.email);


//   const handleCreatePayment = () => {
//     const payment = {
//       email: user?.email,
//       price: Number(totalAmount.toFixed(2)),
//       transactionId: "",
//       date: new Date(),
//       status: "pending",
//       cartIds: cartItems.map(item => item._id),
//       menuItemIds: cartItems.map(item => item.ProductMainID),
//   }
//   console.log('Payment Info:', payment);


//   const res = axiosSecure.post('/create-ssl-payment', payment);
//   console.log('Server Response:', res);
//   console.log('Payment data sent to server.');
//   }
 



//   return (
//     <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Left Section */}
//       <div className="lg:col-span-2 space-y-6">
//         {/* Billing Details */}
//         <div className="border rounded-lg p-5 shadow-sm">
//           <h2 className="font-semibold mb-3">Billing Details</h2>
//           <div className="flex items-center space-x-6 mb-4">
//             <label className="flex items-center space-x-2">
//               <input type="radio" name="addressType" />
//               <span>I want to use an existing address</span>
//             </label>
//             <label className="flex items-center space-x-2">
//               <input type="radio" name="addressType" defaultChecked />
//               <span>I want to use new address</span>
//             </label>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input className="border p-2 rounded" placeholder="First Name *" />
//             <input className="border p-2 rounded" placeholder="Last Name *" />
//           </div>

//           <input className="border p-2 rounded w-full mt-3" placeholder="Address Line 1" />

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//             <input className="border p-2 rounded" placeholder="City *" />
//             <input className="border p-2 rounded" placeholder="Post Code" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
//             <input className="border p-2 rounded" placeholder="Country *" />
//             <input className="border p-2 rounded" placeholder="Region/State" />
//           </div>

//           <button onClick={handleCreatePayment} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
//             PLACE ORDER
//           </button>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="space-y-6">
//         {/* Summary */}
//         <div className="border rounded-lg p-5 shadow-sm">
//           <h2 className="font-semibold mb-3">Order Summary</h2>

//           {/* CART ITEMS LIST */}
//           {cartItems.length > 0 ? (
//             <div className="space-y-4 border-b pb-3">
//               {cartItems.map((item) => (
//                 <div key={item._id} className="flex gap-3">
//                   <img
//                     src={item.images[0]}
//                     alt={item.productName}
//                     className="w-16 h-16 rounded object-cover"
//                   />

//                   <div className="flex-1">
//                     <p className="font-medium">{item.productName}</p>
//                     <p className="text-sm text-gray-500">
//                       Size: {item.size} | Color: {item.color}
//                     </p>
//                     <p className="text-sm">
//                       Qty: <span className="font-semibold">{item.quantity}</span>
//                     </p>
//                   </div>

//                   <p className="font-semibold">
//                     TK {(Number(item.price) * Number(item.quantity)).toFixed(2)}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500">No items in cart.</p>
//           )}

//           {/* PRICE CALCULATION */}
//           <div className="mt-4 space-y-2">
//             <div className="flex justify-between">
//               <span>Sub-Total</span>
//               <span>TK {subTotal.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between">
//               <span>Delivery Charges</span>
//               <span>TK {deliveryCharge.toFixed(2)}</span>
//             </div>

//             <div className="flex justify-between font-semibold text-lg mt-2">
//               <span>Total Amount</span>
//               <span>TK {totalAmount.toFixed(2)}</span>
//             </div>
//           </div>
//         </div>

//         {/* DELIVERY METHOD */}
//         <div className="border rounded-lg p-5 shadow-sm">
//           <h2 className="font-semibold mb-3">DELIVERY METHOD</h2>

//           <label className="flex items-center space-x-2 mb-2">
//             <input
//               type="radio"
//               name="delivery"
//               checked={delivery === "free"}
//               onChange={() => setDelivery("free")}
//             />
//             <span>Free Shipping (TK 0.00)</span>
//           </label>

//           <label className="flex items-center space-x-2 mb-2">
//             <input
//               type="radio"
//               name="delivery"
//               checked={delivery === "flat"}
//               onChange={() => setDelivery("flat")}
//             />
//             <span>Flat Rate (TK 80.00)</span>
//           </label>

//           <textarea
//             placeholder="Add Comments About Your Order"
//             className="border w-full p-2 rounded"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
