'use client'

import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { ref, get, set } from 'firebase/database';
import { doc, getDoc } from 'firebase/firestore';
import { database, db as firestore } from '../firebase';
import { AiOutlineDelete, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import Link from 'next/link';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
    const fetchCartItems = async () => {
      if (!uniqueDeviceId) return;

      const cartRef = ref(database, `${uniqueDeviceId}/Mycarts`);
      const snapshot = await get(cartRef);

      if (snapshot.exists()) {
        setCartItems(snapshot.val());
      } else {
        console.log('No data available');
      }
    };

    fetchCartItems();
  }, [uniqueDeviceId]);

  const fetchProductDetails = async (items) => {
    const promises = items.map(async (item) => {
      const productRef = doc(firestore, `site/tls/products/${item.id}`);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        return {
          ...item,
          image: productDoc.data().images[0], // Assuming the first image is the main image
          name: productDoc.data().name,
          // Use the price from the cart instead of Firestore
          price: item.price,
        };
      } else {
        console.log(`No product found for ID: ${item.id}`);
        return null;
      }
    });

    const results = await Promise.all(promises);
    setCartData(results.filter(item => item !== null));
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      fetchProductDetails(cartItems);
    } else {
      setCartData([]);
    }
  }, [cartItems]);

  useEffect(() => {
    const calculateTotalPrice = () => {
      const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalPrice(total);
    };

    if (cartData.length > 0) {
      calculateTotalPrice();
    } else {
      setTotalPrice(0);
    }
  }, [cartData]);

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1 || newQuantity > 100) return;

    const updatedCartItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCartItems);
    await set(ref(database, `${uniqueDeviceId}/Mycarts`), updatedCartItems);
    fetchProductDetails(updatedCartItems);
  };

  const removeItem = async (id) => {
    const updatedCartItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCartItems);
    await set(ref(database, `${uniqueDeviceId}/Mycarts`), updatedCartItems);
    fetchProductDetails(updatedCartItems);
  };

  return (
    <div className='flex justify-center items-center' style={{padding:"100px 0px"}}>
      <div className="p-6 min-h-screen mt-12 w-full max-w-screen-lg">
        <h2 className="text-3xl text-center font-bold mb-6 text-gray-800">Your Cart</h2>
        <div className="space-y-4">
          {cartData.length > 0 ? (
            <>
              {cartData.map((item, index) => (
                <Card key={index} className="flex flex-col md:flex-row justify-between items-center p-4 bg-white shadow-md rounded-lg">
                  <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4 rounded-lg" />
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price} each</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="p-1 bg-gray-200 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <AiOutlineMinus />
                        </button>
                        <span className="mx-2 text-lg">{item.quantity}</span>
                        <button
                          className="p-1 bg-gray-200 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <AiOutlinePlus />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full md:w-auto space-x-4">
                    <div className="text-lg font-bold">₹{item.price * item.quantity}</div>
                    <button
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                      onClick={() => removeItem(item.id)}
                    >
                      <AiOutlineDelete className="w-5 h-5" />
                    </button>
                  </div>
                </Card>
              ))}
              <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mt-4">
                <h3 className="text-xl font-semibold">Total</h3>
                <div className="text-2xl font-bold">₹{totalPrice}</div>
              </div>
              <Link href='/checkout'>
                <button className="w-full bg-blue-600 text-white py-3 mt-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-200">
                Proceed to Checkout
                </button>
              </Link>
            </>
          ) : (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
