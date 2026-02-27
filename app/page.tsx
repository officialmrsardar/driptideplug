"use client";

import { useState } from "react";
import Image from "next/image";

const SHOE_SIZES = ["6","7","8","9","10","11","12","13"];
const CLOTHING_SIZES = ["S","M","L","XL"];
const ACCESSORY_SIZES = ["One Size"];

const products = [
  { id: 1, name: "Jordan 4 Oreos", price: 320, category: "shoes",
    colors: { White: ["/images/jordanfouroreos.png"] } },

  { id: 2, name: "Jordan 4 Red Thunder", price: 340, category: "shoes",
    colors: { Red: ["/images/jordan_four_red_thunder.png"] } },

  { id: 3, name: "Spider Hoodie", price: 180, category: "clothing",
    colors: { Blue: ["/images/blue_spider_hoodie.png"] } },

  { id: 4, name: "Bape Hoodie", price: 200, category: "clothing",
    colors: {
      Blue: ["/images/blue_bape_hoodie.png"],
      Pink: ["/images/pink_bape_hoodie.JPEG"],
      Red: ["/images/red_bape_hoodie.JPEG"],
    } },

  { id: 5, name: "Moncler Jacket", price: 850, category: "clothing",
    colors: {
      Black: [
        "/images/blackmonclearjacket.png",
        "/images/blackmonclearjacket_2.png",
        "/images/blackmonclearjacket_3.png",
      ] } },

  { id: 6, name: "Denim Tears Hoodie", price: 250, category: "clothing",
    colors: {
      Black: ["/images/denim_tears_hoodies.png"],
      Pink: ["/images/pink_denim_tears_hoodie.JPG"],
      Red: ["/images/red_denim_tears_hoodie.JPG"],
    } },

  { id: 7, name: "Denim Tears Shorts", price: 170, category: "clothing",
    colors: { Black: ["/images/denim_tears_shorts.png"] } },

  { id: 8, name: "Fear of God Tracksuit", price: 500, category: "clothing",
    colors: {
      Black: ["/images/fear_of_god_track_suit.png"],
      Cream: ["/images/fear_of_god_track_suit.png"],
      Grey: ["/images/fear_of_god_track_suit.png"],
      Beige: ["/images/fear_of_god_track_suit.png"],
    } },

  { id: 9, name: "Goyard Green Bag", price: 2200, category: "accessory",
    colors: {
      Green: [
        "/images/go_yard_green_bag_2.JPG",
        "/images/go_yard_green_bag_3.JPG",
        "/images/go_yard_green_bag_4.JPG",
        "/images/go_yard_green_bag_5.JPG",
      ] } },

  { id: 10, name: "Audemars Piguet Watch", price: 450, category: "accessory",
    colors: {
      Silver: [
        "/images/ap_watch.jpeg",
        "/images/ap_watch_2.jpeg",
        "/images/ap_watch_3.jpeg",
        "/images/ap_watch_4.jpeg",
      ] } },

  { id: 11, name: "Rolex Watch", price: 9500, category: "accessory",
    colors: { Gold: ["/images/rolex_watch.JPG"] } },

  { id: 12, name: "Van Cleef Bracelet", price: 3800, category: "accessory",
    colors: { Gold: ["/images/van_cleef_bracelet.jpeg"] } },
];

export default function Home() {
  const [activeProduct, setActiveProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizes =
    activeProduct?.category === "shoes"
      ? SHOE_SIZES
      : activeProduct?.category === "clothing"
      ? CLOTHING_SIZES
      : ACCESSORY_SIZES;

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="flex min-h-screen bg-white text-black">

      {/* SIDEBAR */}
      <aside className="w-64 bg-black text-white px-6 py-8 flex flex-col">
        <Image src="/images/logo.png" alt="Logo" width={160} height={40} unoptimized />
        <nav className="mt-12 flex flex-col gap-4 text-sm uppercase">
          <span>New</span>
          <span>Shoes</span>
          <span>Clothing</span>
          <span>Accessories</span>
        </nav>
        <button onClick={() => setShowCart(true)} className="mt-auto text-sm">
          Cart ({cart.length})
        </button>
      </aside>

      {/* GRID */}
      <main className="flex-1 px-10 py-10">
        <div className="grid grid-cols-4 gap-8">
          {products.map((p) => {
            const color = Object.keys(p.colors)[0];
            const img = p.colors[color as keyof typeof p.colors]?.[0] ?? "";

            return (
              <div key={p.id}
                onClick={() => {
                  setActiveProduct(p);
                  setSelectedColor(color);
                  setActiveImage(img);
                  setSelectedSize("");
                }}
                className="cursor-pointer">

                <div className="aspect-square bg-gray-100 mb-3">
                  <img src={img} alt={p.name}
                    className="w-full h-full object-cover" />
                </div>

                <div className="text-sm">{p.name}</div>
                <div className="opacity-60">${p.price}</div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          <div className="relative bg-white w-[900px] p-8 grid grid-cols-2 gap-8">
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 text-2xl">
              ×
            </button>

            <div>
              <img src={activeImage}
                className="w-full aspect-square object-cover mb-4" />

              <div className="flex gap-2">
                {activeProduct.colors[selectedColor].map((img: string) => (
                  <img key={img}
                    src={img}
                    onClick={() => setActiveImage(img)}
                    className="w-16 h-16 object-cover border cursor-pointer" />
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-2xl mb-2">{activeProduct.name}</h1>
              <p className="mb-4">${activeProduct.price}</p>

              <div className="mb-4 flex gap-2">
                {Object.keys(activeProduct.colors).map((c) => (
                  <button key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      setActiveImage(activeProduct.colors[c][0]);
                    }}
                    className="border px-3 py-1">
                    {c}
                  </button>
                ))}
              </div>

              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="border px-3 py-2 w-full mb-4">
                <option value="">Select size</option>
                {sizes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button
                disabled={!selectedSize}
                onClick={() => {
                  setCart([...cart, {
                    name: activeProduct.name,
                    color: selectedColor,
                    size: selectedSize,
                    price: activeProduct.price,
                  }]);
                  setActiveProduct(null);
                }}
                className="border px-6 py-3 w-full">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART */}
      {showCart && (
        <div className="fixed right-0 top-0 h-full w-80 bg-white border-l p-6 z-50">
          <h2 className="mb-4 text-lg">Cart</h2>

          {cart.map((i, idx) => (
            <div key={idx} className="mb-2 text-sm">
              {i.name} — {i.color}/{i.size}
            </div>
          ))}

          <div className="mt-4 font-semibold">
            Total: ${cartTotal}
          </div>

          <button
            disabled={loading || cart.length === 0}
            onClick={handleCheckout}
            className="border w-full py-2 mt-4">
            {loading ? "Redirecting..." : "Checkout"}
          </button>
        </div>
      )}
    </div>
  );
}