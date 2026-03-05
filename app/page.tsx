"use client";

import { useState } from "react";
import Image from "next/image";

const SHOE_SIZES = ["6","7","8","9","10","11","12","13"];
const CLOTHING_SIZES = ["S","M","L","XL"];
const ACCESSORY_SIZES = ["One Size"];

const products = [
  { id: 1, name: "Jordan 4 Oreos", price: 299.99, category: "shoes",
    colors: { White: ["/images/jordanfouroreos.png"] } },

  { id: 2, name: "Jordan 4 Red Thunder", price: 299.99, category: "shoes",
    colors: { Red: ["/images/jordan_four_red_thunder.png"] } },

  { id: 3, name: "Jordan 4 Black Cats", price: 299.99, category: "shoes",
    colors: { Black: ["/images/jordan_four_black_cat.jpeg"] } },

  { id: 4, name: "Spider Hoodie", price: 180, category: "clothing",
    colors: { Blue: ["/images/blue_spider_hoodie.png"] } },

  { id: 5, name: "Bape Hoodie", price: 159.99, category: "clothing",
    colors: {
      Blue: ["/images/blue_bape_hoodie.png"],
      Pink: ["/images/pink_bape_hoodie.JPEG"],
      Red: ["/images/red_bape_hoodie.JPEG"],
    } },

  { id: 7, name: "Moncler Jacket", price: 499.99, category: "clothing",
    colors: {
      Black: [
        "/images/blackmonclearjacket.png",
        "/images/blackmonclearjacket_2.png",
        "/images/blackmonclearjacket_3.png",
      ] } },

  { id: 8, name: "Denim Tears Hoodie", price: 250, category: "clothing",
    colors: {
      Black: ["/images/denim_tears_hoodies.png"],
      Pink: ["/images/pink_denim_tears_hoodie.JPG"],
      Red: ["/images/red_denim_tears_hoodie.JPG"],
    } },

  { id: 9, name: "Denim Tears Shorts", price: 170, category: "clothing",
    colors: { Black: ["/images/denim_tears_shorts.png"] } },

  { id: 10, name: "Fear of God Tracksuit", price: 299.99, category: "clothing",
    colors: {
      Black: ["/images/fear_of_god_track_suit.png"],
      Cream: ["/images/fear_of_god_track_suit.png"],
      Grey: ["/images/fear_of_god_track_suit.png"],
      Beige: ["/images/fear_of_god_track_suit.png"],
    } },

  { id: 11, name: "Goyard Green Bag", price: 499.99, category: "accessory",
    colors: {
      Green: [
        "/images/go_yard_green_bag_2.JPG",
        "/images/go_yard_green_bag_3.JPG",
        "/images/go_yard_green_bag_4.JPG",
        "/images/go_yard_green_bag_5.JPG",
      ] } },

  { id: 12, name: "Audemars Piguet Watch", price: 649.99, category: "accessory",
    colors: {
      Silver: [
        "/images/ap_watch.jpeg",
        "/images/ap_watch_2.jpeg",
        "/images/ap_watch_3.jpeg",
        "/images/ap_watch_4.jpeg",
      ] } },

  { id: 13, name: "Rolex Watch", price: 4999.99, category: "accessory",
    colors: { Gold: ["/images/rolex_watch.JPG"] } },

  { id: 14, name: "Van Cleef Bracelet", price: 399.99, category: "accessory",
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-white text-black">

      <aside className="lg:w-64 w-full bg-black text-white px-6 py-6 flex flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-start">
        <Image src="/images/logo.png" alt="Logo" width={140} height={40} />
        <nav className="hidden lg:flex mt-10 flex-col gap-4 text-sm uppercase">
          <span>New</span>
          <span>Shoes</span>
          <span>Clothing</span>
          <span>Accessories</span>
        </nav>
        <button onClick={() => setShowCart(true)} className="text-sm">
          Cart ({cart.length})
        </button>
      </aside>

      <main className="flex-1 px-6 py-8">
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => {
            const color = Object.keys(p.colors)[0];
            const img = p.colors[color as keyof typeof p.colors]?.[0];

            return (
              <div key={p.id}
                onClick={() => {
                  setActiveProduct(p);
                  setSelectedColor(color);
                  setActiveImage(img || "");
                  setSelectedSize("");
                }}
                className="cursor-pointer">

                <div className="aspect-square bg-gray-100 mb-3 relative">
                  <Image
                    src={img || "/images/placeholder.png"}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-sm">{p.name}</div>
                <div className="opacity-60">
                  ${p.price.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {activeProduct && (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-5xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">

            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 text-2xl">
              ×
            </button>

            <div>
              <div className="relative aspect-square mb-4">
                <Image src={activeImage} alt="" fill className="object-cover" />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {activeProduct.colors[selectedColor].map((img: string) => (
                  <div key={img} className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={img}
                      alt=""
                      fill
                      onClick={() => setActiveImage(img || "")}
                      className="object-cover border cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-2xl mb-2">{activeProduct.name}</h1>
              <p className="mb-4 font-semibold">
                ${activeProduct.price.toLocaleString()}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {Object.keys(activeProduct.colors).map((c) => (
                  <button key={c}
                    onClick={() => {
                      setSelectedColor(c);
                      setActiveImage(activeProduct.colors[c][0] || "");
                    }}
                    className="border px-3 py-1 text-sm">
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

      {showCart && (
        <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white border-l p-6 z-50">
          <button
            onClick={() => setShowCart(false)}
            className="mb-4 text-sm underline">
            Close
          </button>

          <h2 className="mb-4 text-lg font-semibold">Cart</h2>

          {cart.map((i, idx) => (
            <div key={idx} className="mb-2 text-sm">
              {i.name} — {i.color}/{i.size}
            </div>
          ))}

          <div className="mt-4 font-semibold">
            Total: ${cartTotal.toLocaleString()}
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
