'use client'

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ref, get, set } from 'firebase/database';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { database, db as firestore } from '../firebase';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

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
    const fetchWishlistItems = async () => {
      if (!uniqueDeviceId) return;

      try {
        console.log("Fetching wishlist for device ID:", uniqueDeviceId);
        const wishlistRef = collection(firestore, 'site/tls/wishlists', uniqueDeviceId, 'items');
        const wishlistSnapshot = await getDocs(wishlistRef);

        if (!wishlistSnapshot.empty) {
          const items = wishlistSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          console.log("Wishlist items:", items);
          setWishlistItems(items);
        } else {
          console.log('No wishlist items available');
          setWishlistItems([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistItems([]);
      }
    };

    fetchWishlistItems();
  }, [uniqueDeviceId]);

  const addToCart = async (item) => {
    if (!uniqueDeviceId) return;

    try {
      const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
      const snapshot = await get(cartRef);
      let currentCart = snapshot.exists() ? snapshot.val() : [];

      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        currentCart[existingItemIndex].quantity += 1;
      } else {
        currentCart.push({ id: item.id, quantity: 1, price: item.price });
      }

      await set(cartRef, currentCart);

      // Remove from wishlist
      await removeFromWishlist(item.id);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const removeFromWishlist = async (id) => {
    try {
      const itemRef = doc(firestore, 'site/tls/wishlists', uniqueDeviceId, 'items', id);
      await deleteDoc(itemRef);

      setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Wishlist</h2>
      <div className="space-y-4">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <Card key={item.id} className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4 rounded-lg" />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
                  onClick={() => addToCart(item)}
                >
                  <AiOutlinePlus className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  <AiOutlineDelete className="w-5 h-5" />
                </button>
              </div>
            </Card>
          ))
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;