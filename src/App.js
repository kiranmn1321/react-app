import React, { useState, useEffect } from "react";

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false); // Controls cart visibility

  // Load cart from localStorage on first render
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  // Fetch products from FakeStoreAPI
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // Add to Cart (Update Quantity if Already Exists)
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove from Cart (Decrease Quantity or Remove)
  const removeFromCart = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate total price
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {/* Cart Toggle Button */}
        <button
          onClick={() => setCartOpen(!cartOpen)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          🛒 Cart ({cart.length})
        </button>
      </div>

      {/* Product Listing */}
      <div className="flex flex-wrap justify-center gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 shadow-md w-64 rounded">
            <img src={product.image} alt={product.title} className="h-32 mx-auto" />
            <h2 className="text-lg font-bold mt-2">{product.title.substring(0, 20)}...</h2>
            <p className="text-gray-600">${product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded w-full"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Sidebar (Right Corner) */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-4 transition-transform ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ overflowY: "auto" }}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={() => setCartOpen(false)} className="text-red-500 font-bold">✕</button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 border-b">
              <span>{item.title.substring(0, 20)} ({item.quantity})</span>
              <div className="flex gap-2">
                <button onClick={() => removeFromCart(item.id)} className="bg-red-500 text-white px-2 rounded">-</button>
                <button onClick={() => addToCart(item)} className="bg-green-500 text-white px-2 rounded">+</button>
              </div>
            </div>
          ))
        )}

        {/* Cart Total */}
        <div className="mt-4 font-bold text-lg">
          Total: ${totalPrice}
        </div>
      </div>
    </div>
  );
};

export default App;

