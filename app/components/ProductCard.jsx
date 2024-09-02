import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AiOutlineHeart, AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai';
import { ref, get, set } from 'firebase/database';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db as firestore, database } from '../firebase';
import Link from 'next/link';

const ProductCard = ({ image, name, price, originalPrice, discountPercentage, id }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  function getOrCreateDeviceId() {
    if (typeof window !== 'undefined') {
      let deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
      }
      return deviceId;
    }
    return null;
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const uniqueDeviceId = getOrCreateDeviceId();

useEffect(() => {
  const checkIfInWishlist = async () => {
    if (!uniqueDeviceId) return;

    const itemRef = doc(firestore, 'site/tls/wishlists/', uniqueDeviceId, 'items', id);
    const snapshot = await getDoc(itemRef);

    setIsInWishlist(snapshot.exists());
  };

  checkIfInWishlist();
}, [id, uniqueDeviceId]);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!uniqueDeviceId) return;

    const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
    const snapshot = await get(cartRef);

    let cartItems = snapshot.exists() ? snapshot.val() : [];

    const existingItemIndex = cartItems.findIndex(item => item.id === id);

    if (existingItemIndex > -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ id, quantity: 1, price });
    }

    await set(cartRef, cartItems);

    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

const handleWishlistToggle = async (e) => {
  e.stopPropagation();
  if (!uniqueDeviceId) return;

  const wishlistRef = doc(firestore, 'site/tls/wishlists/', uniqueDeviceId);
  const itemRef = doc(wishlistRef, 'items', id);

  if (isInWishlist) {
    // Remove item from wishlist
    await deleteDoc(itemRef);
  } else {
    // Add item to wishlist
    await setDoc(itemRef, { id, name, price, image });
  }

  setIsInWishlist(!isInWishlist);
};
  return (
    
    <Card className="w-full h-96 relative overflow-hidden group hover:cursor-pointer">
      {/* Like Button (Visible on Hover) */}
      <button
        className={`absolute top-2 left-2 z-10 p-2 bg-white rounded-full transition-opacity duration-300 ${isInWishlist ? 'opacity-100' : 'opacity-0'}  opacity-100`}
        onClick={handleWishlistToggle}
      >
        {isInWishlist ? (
          <AiFillHeart className="text-red-500 text-xl" />
        ) : (
          <AiOutlineHeart className="text-red-500 text-xl" />
        )}
      </button>

      <Link href={`/products/${id}`}>
      {/* Image */}
      <CardContent className="p-0 h-2/3">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </CardContent>
      </Link>

      {/* Product Info (Always Visible) */}
      <div className="p-4 h-1/3">
        <h3 className="text-sm font-semibold">{name}</h3>
        <div className="mt-2">
          <span className="text-lg font-bold text-black">₹{price}</span>
          {originalPrice && (
            <>
              <span className="text-sm text-gray-500 line-through ml-2">₹{originalPrice}</span>
            </>
          )}
        </div>
      </div>

      {/* Hover Effect for Add to Cart */}
      <div className="absolute bottom-0 left-0 right-0 bg-white text-black p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300 lg:translate-y-full">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm">₹{price}</p>
        <div className='flex justify-center items-center'>
          <button
          className="mt-2 bg-black text-white px-4 py-2 rounded hover:bg-white border-2 border-white hover:text-black hover:border-black hover:border-2 transition-colors duration-300 flex items-center justify-center "
          onClick={handleAddToCart}
        >
          <span>Add to Cart</span>
        </button>
        </div>
        
      </div>

      {showPopup && (
        <div className="fixed top-4 right-4 bg-gray-100 text-black p-4 rounded-lg shadow-lg z-50 animate-slide-in lg:w-1/5 w-2/3">
          <h2 className="text-green-500 mb-2">Successfully Added to Cart</h2>
          <p>{name}</p>
        </div>
      )}
    </Card>
  );
};

export default ProductCard;
